// api/generate-blog.js
// Vercel Serverless Function
// URL after deploy: https://yourproject.vercel.app/api/generate-blog?secret=YOUR_SECRET
//
// Full pipeline (100% free):
// 1. Fetch REAL trending searches from Google Trends RSS (free, no API key)
//    -- OR use a custom topic passed in by you (see "CUSTOM TOPIC" below)
// 2. Generate a full SEO + AEO + GEO optimized article using OpenRouter FREE model
//    (title, meta description, 1500-2200 word body, tags, FAQ block, image alt text)
// 3. Fetch 2-4 relevant free images from Pexels
// 4. Build a static HTML blog post page matching the site design, with:
//    - meta description, canonical, Open Graph, Twitter Card tags
//    - Article + BreadcrumbList + FAQPage JSON-LD structured data
//    - an auto-generated Table of Contents (built from real h2/h3 headings)
//    - a visible FAQ section (answer-engine friendly)
//    - images distributed through the article, not stacked at the top
// 5. Push the new file to GitHub -> Vercel auto-deploys it
// 6. Add a matching card to posts-data.js (de-duplicated by slug AND by title similarity)
// 7. Add the new URL to sitemap.xml and rss.xml
//
// CUSTOM TOPIC (manual override):
// Call the endpoint with a "topic" param and the pipeline skips trending/evergreen
// selection completely and writes about exactly what you asked for:
//   /api/generate-blog?secret=YOUR_SECRET&topic=Iran%20Israel%20ceasefire%20latest
//   /api/generate-blog?secret=YOUR_SECRET&topic=FIFA%20World%20Cup%202026%20schedule&category=Sports
// Optional: &category=Sports (else the AI still picks the best-fitting one)

export default async function handler(req, res) {
  // Splits article HTML into an intro + h2-sections, and weaves extra images
  // between sections (roughly evenly spaced) instead of stacking them all up top.
  function distributeImages(contentHtml, images, alts) {
    if (!images || images.length <= 1) return contentHtml;

    const extraImages = images.slice(1);
    const extraAlts = alts.slice(1);
    const figure = (url, alt) =>
      `<figure class="post-figure"><img src="${url}" alt="${alt || ""}" loading="lazy" /></figure>`;

    const sections = contentHtml.split(/(?=<h2)/);
    if (sections.length <= 1) {
      return contentHtml + extraImages.map((url, i) => figure(url, extraAlts[i])).join("\n");
    }

    const gap = Math.max(1, Math.floor(sections.length / (extraImages.length + 1)));
    let result = sections[0];
    let imgIdx = 0;
    for (let i = 1; i < sections.length; i++) {
      result += sections[i];
      if (imgIdx < extraImages.length && i % gap === 0) {
        result += figure(extraImages[imgIdx], extraAlts[imgIdx]);
        imgIdx++;
      }
    }
    while (imgIdx < extraImages.length) {
      result += figure(extraImages[imgIdx], extraAlts[imgIdx]);
      imgIdx++;
    }
    return result;
  }

  function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : text;
  }

  // Removes stray "--", "@" and "#" markdown/social artifacts that free LLMs
  // sometimes leak into output (e.g. "## Heading", "-- word --", "@handle").
  // A real em dash "—" is left untouched, and things like "state-of-the-art"
  // (single hyphen inside a word) are never touched.
  function sanitizeSymbols(str) {
    if (!str) return str;
    return String(str)
      .replace(/-{2,}/g, "—") // "--" / "---" -> proper em dash
      .replace(/(^|\s)#{1,6}\s*/g, "$1") // leftover markdown "## " headers
      .replace(/(^|\s)@(\S+)/g, "$1$2") // stray "@mentions"
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }
  function sanitizeHtmlBlock(html) {
    if (!html) return html;
    // Same cleanup but safe to run on HTML: only touches text, never inside tags.
    return html.replace(/>([^<]+)</g, (m, text) => `>${sanitizeSymbols(text)}<`);
  }

  // Turns every <h2>/<h3> in the article into an anchor target and builds a
  // matching Table of Contents. Uses the site's existing .toc CSS (already in
  // assets/css/style.css) so no style changes are needed.
  function buildHeadingsAndToc(contentHtml) {
    const usedIds = new Set();
    const tocItems = [];

    const withIds = contentHtml.replace(/<h([23])>([\s\S]*?)<\/h\1>/gi, (match, level, inner) => {
      const plain = inner.replace(/<[^>]+>/g, "").trim();
      let base =
        plain
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .slice(0, 60) || `section-${tocItems.length + 1}`;
      let id = base;
      let n = 2;
      while (usedIds.has(id)) id = `${base}-${n++}`;
      usedIds.add(id);
      tocItems.push({ level: Number(level), text: plain, id });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    });

    let tocHtml = "";
    if (tocItems.length > 1) {
      const items = tocItems
        .map(
          (t) =>
            `<li${t.level === 3 ? ' style="margin-left:16px; list-style:circle;"' : ""}><a href="#${t.id}">${t.text}</a></li>`
        )
        .join("\n        ");
      tocHtml = `<nav class="toc" aria-label="Table of contents">
      <p class="toc-title">In this article</p>
      <ol>
        ${items}
      </ol>
    </nav>`;
    }
    return { html: withIds, tocHtml, headings: tocItems };
  }

  // Cheap word-overlap similarity so we can flag near-duplicate topics even
  // when the slug is different (e.g. two posts about the same news story).
  function titleSimilarity(a, b) {
    const norm = (s) =>
      new Set(
        s
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 3)
      );
    const setA = norm(a);
    const setB = norm(b);
    if (setA.size === 0 || setB.size === 0) return 0;
    let overlap = 0;
    for (const w of setA) if (setB.has(w)) overlap++;
    return overlap / Math.min(setA.size, setB.size);
  }

  try {
    // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" automatically.
    // Keep accepting the old ?secret= query param too, so manual runs and
    // cron-job.org (kept as an optional backup trigger) still work.
    const authHeader = req.headers.authorization || "";
    const headerOk = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const queryOk = req.query.secret === process.env.CRON_SECRET;
    if (!headerOk && !queryOk) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const SITE_URL = process.env.SITE_URL;

    // ---- CUSTOM TOPIC OVERRIDE ----
    // If you pass ?topic=... the whole trending/evergreen picker is skipped
    // and the AI writes about exactly what you gave it.
    const customTopic = (req.query.topic || req.body?.topic || "").trim();
    const customCategory = (req.query.category || req.body?.category || "").trim();

    let trendingHeadline = customTopic;
    let trendingContext = req.query.context || req.body?.context || "User-provided topic — write a complete, accurate, well-researched style article about it.";
    let isListicle = false;
    let listicleTopic = null;
    let imageCount = 2 + Math.floor(Math.random() * 3);

    // These are only needed for the trending path, but postsDataApi/postsDataJs
    // are needed either way (de-dupe + prepend), so fetch it once up front.
    console.log("STEP 1: fetching posts-data.js (needed for de-dupe either way)");
    const postsDataApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/assets/js/posts-data.js`;
    const postsDataGet = await fetch(postsDataApi, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
    if (!postsDataGet.ok) {
      const errText = await postsDataGet.text();
      return res.status(500).json({ error: "Could not fetch posts-data.js from GitHub", detail: errText });
    }
    const postsDataFile = await postsDataGet.json();
    let postsDataJs = Buffer.from(postsDataFile.content, "base64").toString("utf-8");
    const existingTitles = [...postsDataJs.matchAll(/title:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
    const usedTitlesLower = existingTitles.map((t) => t.toLowerCase());

    if (!customTopic) {
      console.log("STEP 1: fetching real-time trending topics (Google Trends + Google News)");

      // Google Trends daily/realtime RSS — good for fast-moving search terms.
      const trendsGeos = ["US", "AU", "GB", "CA"];
      const trendsPromises = trendsGeos.map((geo) =>
        fetch(`https://trends.google.com/trending/rss?geo=${geo}`)
          .then((r) => r.text())
          .catch(() => "")
      );

      // Google News RSS, topic by topic — this is what actually surfaces big
      // real-world stories (wars, sports results/scandals, celebrity news,
      // tech launches) that plain "trending searches" often miss because those
      // are just short, generic queries.
      const newsFeeds = [
        { url: "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en", label: "general" },
        { url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-US&gl=US&ceid=US:en", label: "world" },
        { url: "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=en-US&gl=US&ceid=US:en", label: "sports" },
        { url: "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=en-US&gl=US&ceid=US:en", label: "technology" },
        { url: "https://news.google.com/rss/headlines/section/topic/ENTERTAINMENT?hl=en-US&gl=US&ceid=US:en", label: "entertainment" },
        { url: "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en", label: "business" },
      ];
      const newsPromises = newsFeeds.map((f) => fetch(f.url).then((r) => r.text()).catch(() => ""));

      const [trendsTexts, newsTexts] = await Promise.all([
        Promise.all(trendsPromises),
        Promise.all(newsPromises),
      ]);
      console.log("STEP 1 done: trends+news feeds fetched");

      const clean = (s) =>
        s ? s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim() : "";

      function parseTrendsRss(text) {
        return text
          .split("<item>")
          .slice(1)
          .map((block) => {
            const titleMatch = block.match(/<title>(.*?)<\/title>/s);
            const snippetMatch = block.match(/<ht:news_item_snippet>(.*?)<\/ht:news_item_snippet>/s);
            const newsTitleMatch = block.match(/<ht:news_item_title>(.*?)<\/ht:news_item_title>/s);
            return {
              title: titleMatch ? clean(titleMatch[1]) : null,
              description: clean(snippetMatch?.[1] || newsTitleMatch?.[1] || ""),
            };
          })
          .filter((i) => i.title);
      }

      function parseNewsRss(text) {
        return text
          .split("<item>")
          .slice(1)
          .map((block) => {
            const titleMatch = block.match(/<title>(.*?)<\/title>/s);
            const descMatch = block.match(/<description>([\s\S]*?)<\/description>/s);
            let title = titleMatch ? clean(titleMatch[1]) : null;
            if (title) {
              // Google News titles look like "Headline text - Source Name" —
              // strip the trailing " - Source" so we're left with the headline.
              const dashIdx = title.lastIndexOf(" - ");
              if (dashIdx > 15) title = title.slice(0, dashIdx).trim();
            }
            return { title, description: clean(descMatch?.[1] || "") };
          })
          .filter((i) => i.title);
      }

      const trendItems = trendsTexts.flatMap(parseTrendsRss);

      // IMPORTANT FIX: previously all feeds were flattened into one long array
      // (general, world, sports, tech, entertainment, business, in that order)
      // and only the first 15 items of that combined array were eligible for
      // selection. Since "general" and "world" feeds are large, sports/
      // entertainment items (FIFA, cricket, etc.) almost never made the cut.
      // Fix: take a fair slice from EACH feed first, THEN combine, so every
      // category has a real chance of being picked.
      const PER_FEED_LIMIT = 8;
      const newsItemsPerFeed = newsTexts.map(parseNewsRss);
      const balancedNewsPool = newsItemsPerFeed.flatMap((items) => items.slice(0, PER_FEED_LIMIT));

      if (trendItems.length === 0 && balancedNewsPool.length === 0) {
        return res.status(500).json({ error: "Could not fetch trending topics" });
      }

      // Prefer real news headlines (war/politics/sports/entertainment/tech)
      // most of the time, since they're what people actually mean by
      // "trending" — fall back to Trends search terms for freshness/variety.
      const useNewsPool = balancedNewsPool.length > 0 && (trendItems.length === 0 || Math.random() < 0.7);
      const pool = useNewsPool ? balancedNewsPool : trendItems;
      const pickFrom = Math.min(pool.length, 30);
      const chosen = pool[Math.floor(Math.random() * pickFrom)];
      trendingHeadline = chosen.title;
      trendingContext = chosen.description || "No additional summary available.";

      console.log("STEP 1.5: checking whether to run an evergreen listicle instead");

      // Evergreen "best of" listicle topics, aimed at Asfi Blog's AI/programming/
      // web-dev audience. Mixed in occasionally alongside real trending news so
      // the blog also covers things like "Top 10 Free AI Tools for Students".
      const EVERGREEN_TOPICS = [
        "Top 10 Free AI Tools for Students in 2026",
        "Best AI Coding Assistants for Developers in 2026",
        "Top 10 Free AI Image Generators in 2026",
        "Best AI Resume and Cover Letter Builders in 2026",
        "Top AI Chatbots Compared: Which One Should You Use in 2026",
        "Best Free AI Writing and Grammar Tools for Students",
        "Top 10 AI Productivity Apps for Remote Work in 2026",
        "Best AI Video Editing Tools for Content Creators in 2026",
        "Top Free AI Note-Taking and Study Apps in 2026",
        "Best AI Tools for Freelancers and Agencies in 2026",
        "Top 10 AI Presentation and Slide-Deck Generators in 2026",
        "Best Free Websites to Learn Web Development in 2026",
        "Top 10 VS Code Extensions Every Developer Should Use in 2026",
        "Best AI Tools for Building a Portfolio Website in 2026",
      ];
      const availableTopics = EVERGREEN_TOPICS.filter(
        (t) => !usedTitlesLower.some((u) => u.includes(t.toLowerCase().split(" in 2026")[0].slice(0, 18)))
      );
      isListicle = availableTopics.length > 0 && Math.random() < 0.3;
      listicleTopic = isListicle ? availableTopics[Math.floor(Math.random() * availableTopics.length)] : null;
      console.log("STEP 1.5 done: mode =", isListicle ? `listicle (${listicleTopic})` : "trending");
    } else {
      console.log("STEP 1: custom topic override in use ->", customTopic);
    }

    const SYMBOL_RULE =
      '- Do NOT use the raw symbols "--", "@" or "#" anywhere in the title, description, or content (no markdown headers like "## ", no "--" as a dash, no "@handles"). Use a proper em dash (—) or rewrite the sentence instead.';

    const prompt = isListicle
      ? `You are a professional SEO editor for "Asfi Blog", a technology and student-productivity publication. Write a detailed, 100% original, SEO-optimized, answer-engine-optimized (AEO) evergreen listicle article on this topic.

Topic: "${listicleTopic}"

IMPORTANT RULES:
- This is an evergreen "best of" guide, not breaking news — do not claim it is based on a trending search or cite a publish date as the reason it matters.
- category must be "Technology".
- Prioritize depth and quality over brevity: it is fine, and preferred, for the article to run long if that makes it more useful and complete.
- Title: under 60 characters, front-load the main keyword, no clickbait, no symbols besides normal punctuation.
- meta_description: exactly 150-160 characters, includes the main keyword naturally near the start.
- Content: 1600-2200 words of full HTML using ONLY <h2>, <h3>, <p>, <ul>, <li>, <strong> tags (no <html>/<head>/<body>, no inline styles, no <div>). Structure it as a numbered list: one <h2> per item, formatted like "1. Tool or Item Name" (put the descriptor in the paragraph, not the heading). Under each <h2>, optionally use one <h3> for a "Best for" or "Key feature" sub-point if it adds real structure. Cover at least 8 items if the topic implies a "Top 10". Each item needs a substantive paragraph on what it does, who it's best for, and one standout feature. Do NOT invent specific prices, version numbers, or benchmark stats you can't verify — describe capabilities in general, accurate terms instead.
- Include one short concluding <h2> section ("Which One Should You Choose") that directly and plainly answers the core question the topic raises, phrased so it could be lifted as a direct answer by an AI search summary.
- tags: exactly 6 relevant, specific tags (not single generic words like "AI").
- image_keyword: one GENERIC, safe-for-work English keyword phrase to search stock photography for this topic — never a specific brand/product name.
- image_alts: an array of exactly ${imageCount} descriptive, SEO-friendly alt text strings (each under 125 characters, each describing a distinct relevant visual, no keyword stuffing).
- faq: an array of exactly 4 objects, each with "q" (a real question a student/developer would type into Google or ask an AI assistant about this topic) and "a" (a direct, complete, 1-3 sentence answer written so it stands alone as a correct answer).
${SYMBOL_RULE}

Return ONLY valid JSON (no markdown, no code fences, no explanation) with EXACTLY these keys:
{
  "title": "...",
  "meta_description": "...",
  "slug": "url-friendly-slug-no-spaces",
  "category": "Technology",
  "content": "...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "image_keyword": "...",
  "image_alts": ["...", "..."],
  "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
}`
      : `You are a professional SEO editor for "Asfi Blog", a trending news publication. Write a detailed, 100% original, SEO-optimized, answer-engine-optimized (AEO) blog article based on this ${customTopic ? "topic" : "real, currently trending topic"}.

${customTopic ? "Topic" : "Trending term"}: "${trendingHeadline}"
${customTopic ? "Extra context (optional)" : "Related news context"}: "${trendingContext}"

IMPORTANT RULES:
- Base the article strictly on the topic and context given above. Do not invent specific product names, features, statistics, dates, or quotes that are not implied by the given information. If the context is thin, write more generally about the topic and why it matters, rather than making up specifics.
${customCategory ? `- category must be "${customCategory}".` : "- Pick the single best-fitting \"category\" for this topic: one of Technology, Business, Science, Health, Entertainment, Sports, Politics, or General."}
- Prioritize depth and quality over brevity: it is fine, and preferred, for the article to run long if that makes it more useful, more authoritative, and better for SEO.
- Title: under 60 characters, front-load the main keyword, no clickbait, no symbols besides normal punctuation.
- meta_description: exactly 150-160 characters, includes the main keyword naturally near the start.
- Content: 1500-2200 words of full HTML using ONLY <h2>, <h3>, <p>, <ul>, <li>, <strong> tags (no <html>/<head>/<body>, no inline styles, no <div>). Use at least 5 <h2> subheadings, and add <h3> sub-subheadings under any <h2> that covers more than one distinct point (this both improves readability and gives search engines a clearer content outline for the Table of Contents). Write in a clear, human, editorial tone grounded strictly in the given information. Every paragraph must add real information — no filler, no repeating the same sentence in different words.
- Include one short concluding <h2> section that directly and plainly answers the core question the topic raises, phrased so it could be lifted as a direct answer by an AI search summary.
- tags: exactly 6 relevant, specific tags (not single generic words like "news").
- image_keyword: one GENERIC, safe-for-work English keyword phrase to search stock photography for this topic — never a specific brand/company/product name, since stock photos for brand names are often wrong or mismatched.
- image_alts: an array of exactly ${imageCount} descriptive, SEO-friendly alt text strings (each under 125 characters, each describing a distinct relevant visual for this story, no keyword stuffing).
- faq: an array of exactly 4 objects, each with "q" (a real question a reader would type into Google or ask an AI assistant about this topic) and "a" (a direct, complete, 1-3 sentence answer written so it stands alone as a correct answer).
${SYMBOL_RULE}

Return ONLY valid JSON (no markdown, no code fences, no explanation) with EXACTLY these keys:
{
  "title": "...",
  "meta_description": "...",
  "slug": "url-friendly-slug-no-spaces",
  "category": "...",
  "content": "...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "image_keyword": "...",
  "image_alts": ["...", "..."],
  "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
}`;

    async function tryGenerate(model) {
      const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });
      console.log(`OpenRouter [${model}] status:`, aiRes.status);
      const aiData = await aiRes.json();
      let rawText = aiData.choices?.[0]?.message?.content || "";
      rawText = extractJSON(rawText.replace(/```json|```/g, "").trim());
      try {
        return JSON.parse(rawText);
      } catch (e) {
        console.log(`OpenRouter [${model}] gave unparseable output:`, rawText.slice(0, 300));
        return null;
      }
    }

    // Fast/reliable paid models pehle — free models sabse slow/unreliable
    // hote hain aur retry loop me time waste karte hain jo 30s cron timeout
    // cross kar deta hai. Free models ko sirf last-resort fallback rakha hai.
    // (Unchanged on purpose — this order stays exactly as it was.)
    const modelsToTry = [
      "deepseek/deepseek-chat",
      "openai/gpt-4o-mini",
      "meta-llama/llama-3.1-8b-instruct:free",
      "openrouter/free",
    ];

    let post = null;
    for (const model of modelsToTry) {
      post = await tryGenerate(model);
      if (post && post.title && post.content) {
        console.log(`STEP 2 done: got valid content from ${model}`);
        break;
      }
    }

    if (!post) {
      return res.status(500).json({
        error: "All AI models failed to return valid content. Try again in a moment.",
      });
    }

    // ---- Clean up stray "--", "@", "#" and other markdown leftovers ----
    post.title = sanitizeSymbols(post.title);
    post.meta_description = sanitizeSymbols(post.meta_description);
    post.content = sanitizeHtmlBlock(post.content || "");
    post.tags = (post.tags || []).map((t) => sanitizeSymbols(t)).filter(Boolean);
    post.faq = (post.faq || []).map((f) => ({
      q: sanitizeSymbols(f.q),
      a: sanitizeSymbols(f.a),
    }));

    const slug =
      post.slug ||
      post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const category = post.category || "General";
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    if (post.content) {
      post.content = post.content
        .replace(/style="[^"]*"/gi, "")
        .replace(/<div[^>]*>/gi, "<p>")
        .replace(/<\/div>/gi, "</p>");
    }

    // ---- De-dupe check by TITLE SIMILARITY (not just exact slug match) ----
    // Catches the case where the same story/topic comes back with a different
    // slug (e.g. "Iran Tests Trump" vs "Iran-US Tensions Rise Again") so it
    // doesn't silently create two near-identical posts.
    let duplicateWarning = null;
    for (const existing of existingTitles) {
      const sim = titleSimilarity(post.title, existing);
      if (sim >= 0.7) {
        duplicateWarning = `New title "${post.title}" is ${(sim * 100).toFixed(0)}% similar to existing post "${existing}". Publishing anyway, but you may want to review/merge these.`;
        console.log("DUPLICATE WARNING:", duplicateWarning);
        break;
      }
    }

    // ---- Build Table of Contents from the real headings in the content ----
    const { html: contentWithIds, tocHtml, headings } = buildHeadingsAndToc(post.content);
    post.content = contentWithIds;

    const imgQuery = encodeURIComponent(post.image_keyword || category);
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${imgQuery}&per_page=${imageCount}`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    const pexelsData = await pexelsRes.json();
    const images = (pexelsData.photos || []).map((p) => p.src.large);
    const thumbnail = images[0] || "";
    const imageAlts =
      post.image_alts && post.image_alts.length === images.length
        ? post.image_alts
        : images.map((_, i) => `${post.title} — illustration ${i + 1}`);

    const heroImageHtml = thumbnail
      ? `<figure class="post-figure post-figure--hero"><img src="${thumbnail}" alt="${imageAlts[0]}" loading="lazy" /></figure>`
      : "";
    const bodyWithImages = distributeImages(post.content, images, imageAlts);

    const publishDate = new Date();
    const dateLabel = publishDate.toISOString().split("T")[0];
    const wordCount = (post.content || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    const readMins = Math.max(4, Math.round(wordCount / 200));

    const faqSchema = (post.faq || [])
      .map(
        (item) => `{
      "@type": "Question",
      "name": ${JSON.stringify(item.q)},
      "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(item.a)} }
    }`
      )
      .join(",\n    ");

    const faqHtml = (post.faq || [])
      .map(
        (item) => `<details class="faq-item">
        <summary>${item.q}</summary>
        <p class="faq-a">${item.a}</p>
      </details>`
      )
      .join("\n      ");

    const tagsHtml = (post.tags || []).map((t) => `<span>${t}</span>`).join(" ");
    const tagKeywordsMeta = (post.tags || []).map((t) => `<meta property="article:tag" content="${t}" />`).join("\n");

    const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${post.title} — Asfi Blog</title>
<meta name="description" content="${post.meta_description}" />
<meta name="keywords" content="${(post.tags || []).join(", ")}" />
<meta name="author" content="Sheikh Asfi" />
<link rel="canonical" href="${SITE_URL}/blog/${slug}.html" />

<meta property="og:title" content="${post.title}" />
<meta property="og:description" content="${post.meta_description}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${SITE_URL}/blog/${slug}.html" />
<meta property="og:site_name" content="Asfi Blog" />
${thumbnail ? `<meta property="og:image" content="${thumbnail}" />\n<meta property="og:image:alt" content="${imageAlts[0]}" />` : ""}
<meta property="article:published_time" content="${dateLabel}" />
<meta property="article:modified_time" content="${dateLabel}" />
<meta property="article:section" content="${categoryLabel}" />
<meta property="article:author" content="Sheikh Asfi" />
${tagKeywordsMeta}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${post.title}" />
<meta name="twitter:description" content="${post.meta_description}" />
${thumbnail ? `<meta name="twitter:image" content="${thumbnail}" />` : ""}
<meta name="robots" content="index, follow, max-image-preview:large" />
<meta name="google-site-verification" content="PpUxcguGEAURplqDhmyFXEu5TRZI382yGwo-MM1Pkkc" />

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="alternate icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/style.css" />
<script src="/assets/js/posts-data.js" defer></script>
<script src="/assets/js/blog-render.js" defer></script>
<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/chatbot.js" defer></script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": ${JSON.stringify(post.title)},
  "description": ${JSON.stringify(post.meta_description)},
  "image": ${JSON.stringify(images)},
  "datePublished": "${dateLabel}",
  "dateModified": "${dateLabel}",
  "wordCount": ${wordCount},
  "keywords": ${JSON.stringify((post.tags || []).join(", "))},
  "author": {
  "@type": "Person",
  "name": "Sheikh Asfi",
  "url": "https://asfiblog.vercel.app/author/asfi"
},
  "publisher": {
    "@type": "Organization",
    "name": "Asfi Blog",
    "logo": { "@type": "ImageObject", "url": "${SITE_URL}/logo.png" }
  },
  "mainEntityOfPage": "${SITE_URL}/blog/${slug}.html",
  "articleSection": "${categoryLabel}"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_URL}/" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${SITE_URL}/blog/index.html" },
    { "@type": "ListItem", "position": 3, "name": ${JSON.stringify(post.title)} }
  ]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    ${faqSchema}
  ]
}
</script>
</head>
<body>

<div class="ticker">
  <span class="ticker__live">LIVE</span>
  <div class="ticker__track">
    <span>${categoryLabel.toUpperCase()} — filed ${dateLabel}</span>
    <span>ASFI BLOG — filed around the clock</span>
    <span>TECHNOLOGY — new stories filed daily</span>
    <span>BUSINESS — markets, moves, and money</span>
  </div>
</div>

<header class="site">
  <div class="wrap nav">
    <a href="/" class="logo">Asfi<span>Blog</span></a>
    <nav class="nav__links">
      <a href="/">Home</a>
      <a href="/blog/index.html" class="active">Blog</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/privacy-policy.html">Privacy</a>
      <a href="/disclaimer.html">Disclaimer</a>
    </nav>
    <div style="display:flex; align-items:center; gap:16px;">
      <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode"></button>
      <button class="nav__toggle-btn" aria-label="Menu">☰</button>
    </div>
  </div>
</header>

<div class="wrap breadcrumb">
  <a href="/">Home</a> / <a href="/blog/index.html">Blog</a> / <span>${categoryLabel}</span>
</div>

<main class="wrap">
  <article class="post">
    <span class="stamp">${categoryLabel}</span>
    <h1>${post.title}</h1>
    <p class="timestamp">Filed ${dateLabel} · ${readMins} min read</p>
    ${heroImageHtml}
    ${tocHtml}
    <div class="content">
      ${bodyWithImages}
    </div>
    <div class="tags">
      ${tagsHtml}
    </div>

    <div class="faq">
      <h2>Frequently asked questions</h2>
      ${faqHtml}
    </div>

    <div class="author-box">
      <div class="avatar">SA</div>
      <div>
        <div class="name">Sheikh Asfi</div>
        <div class="bio">Founder & Editor, Asfi Blog.</div>
      </div>
    </div>

    <a class="back-link" href="/blog/index.html">&larr; Back to all dispatches</a>
  </article>

  <section style="padding-top:16px; padding-bottom:24px;" id="related-posts-section">
    <div class="section-head">
      <h2>Related dispatches</h2>
      <a href="/blog/index.html" class="see-all">All dispatches →</a>
    </div>
    <div class="grid grid--trending" id="related-posts"></div>
  </section>
</main>

<footer class="site">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <a href="/" class="logo">Asfi<span>Blog</span></a>
      <p>Independent coverage of what the world's talking about — technology, business, science, and health, filed in plain English, around the clock.</p>
      <div class="footer__social">
        <a href="https://www.linkedin.com/in/asfand-yar-ali-1466b6373/" aria-label="Asfi Blog on LinkedIn" target="_blank" rel="noopener">in</a>
        <a href="/blog/index.html" aria-label="Asfi Blog RSS">RSS</a>
      </div>
    </div>
    <div class="footer__col">
      <h4>Desks</h4>
      <ul>
        <li><a href="/blog/index.html?category=technology">Technology</a></li>
        <li><a href="/blog/index.html?category=business">Business</a></li>
        <li><a href="/blog/index.html?category=science">Science</a></li>
        <li><a href="/blog/index.html?category=health">Health</a></li>
        <li><a href="/blog/index.html?category=politics">Politics</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Company</h4>
      <ul>
        <li><a href="/about.html">About Asfi Blog</a></li>
        <li><a href="/author/asfi">About Sheikh Asfi</a></li>
        <li><a href="/contact.html">Contact</a></li>
        <li><a href="/blog/index.html">All Dispatches</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Legal</h4>
      <ul>
        <li><a href="/privacy-policy.html">Privacy Policy</a></li>
        <li><a href="/disclaimer.html">Disclaimer</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap footer__bottom">
    <span class="footer__fine">© <span id="year"></span> Asfi Blog. All rights reserved.</span>
    <span class="footer__fine">Filed daily from a small, independent newsroom.</span>
  </div>
</footer>
<script>document.getElementById("year").textContent = new Date().getFullYear();</script>

<button id="pw-chat-toggle" aria-label="Open chat">💬</button>
<div id="pw-chat-panel">
  <div class="pw-chat__head">
    <span>Ask The Desk</span>
    <button id="pw-chat-close" aria-label="Close chat">✕</button>
  </div>
  <div class="pw-chat__body" id="pw-chat-body">
    <div class="pw-msg bot">Hi, I'm The Desk. Ask me anything about this story or other trending topics.</div>
  </div>
  <form class="pw-chat__input" id="pw-chat-form">
    <input id="pw-chat-input" type="text" placeholder="Type a message..." autocomplete="off" />
    <button type="submit">Send</button>
  </form>
</div>

</body>
</html>`;

    const githubApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/${slug}.html`;

    const putPostRes = await fetch(githubApi, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Auto blog: ${post.title}`,
        content: Buffer.from(htmlPage).toString("base64"),
      }),
    });
    if (!putPostRes.ok) {
      const errText = await putPostRes.text();
      return res.status(500).json({ error: "GitHub push failed for post file", detail: errText });
    }

    // The site now reads every post from assets/js/posts-data.js (window.ASFIBLOG_POSTS)
    // instead of static cards in blog/index.html, so the new post gets prepended there.
    // views starts at 0 — it's a REAL count (backed by Vercel KV via /api/views), not a
    // seeded/demo number, so it should only ever grow from actual visits.
    // (postsDataApi / postsDataFile / postsDataJs were already fetched at the top,
    // reused here so we don't hit the GitHub API for the same file twice.)

    const newEntry = `  {
    slug: ${JSON.stringify(slug)},
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.meta_description)},
    category: ${JSON.stringify(categoryLabel)},
    image: ${JSON.stringify(thumbnail)},
    date: ${JSON.stringify(dateLabel)},
    readMins: ${readMins},
    views: 0
  },
`;

    // De-dupe: if a post with this exact slug already exists in
    // posts-data.js (e.g. the same trending story comes up again on a later
    // run), strip the old object out first so we never end up with two
    // entries for the same slug — which would show the same post twice on
    // the homepage/blog listing.
    const existingEntryRe = new RegExp(
      `\\s*\\{\\s*slug:\\s*${JSON.stringify(slug)}[\\s\\S]*?\\},?\\n`
    );
    postsDataJs = postsDataJs.replace(existingEntryRe, "\n");

    postsDataJs = postsDataJs.replace(
      "window.ASFIBLOG_POSTS = [",
      `window.ASFIBLOG_POSTS = [\n${newEntry}`
    );

    await fetch(postsDataApi, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add post to posts-data.js: ${post.title}`,
        content: Buffer.from(postsDataJs).toString("base64"),
        sha: postsDataFile.sha,
      }),
    });

    try {
      const sitemapApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/sitemap.xml`;
      const sitemapGet = await fetch(sitemapApi, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });
      const sitemapData = await sitemapGet.json();
      let sitemapXml = Buffer.from(sitemapData.content, "base64").toString("utf-8");

      // Remove any existing <url> block for this exact slug first so a
      // repeat run never creates a duplicate sitemap entry.
      const existingUrlRe = new RegExp(
        `\\s*<url>\\s*<loc>${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/blog/${slug}\\.html</loc>[\\s\\S]*?</url>\\n?`
      );
      sitemapXml = sitemapXml.replace(existingUrlRe, "\n");

      const newUrlEntry = `  <url>
    <loc>${SITE_URL}/blog/${slug}.html</loc>
    <lastmod>${dateLabel}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      sitemapXml = sitemapXml.replace("</urlset>", newUrlEntry);

      await fetch(sitemapApi, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update sitemap: ${post.title}`,
          content: Buffer.from(sitemapXml).toString("base64"),
          sha: sitemapData.sha,
        }),
      });
    } catch (e) {
      // Non-fatal
    }

    try {
      const rssApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/rss.xml`;
      const rssGet = await fetch(rssApi, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      });
      const rssData = await rssGet.json();
      let rssXml = Buffer.from(rssData.content, "base64").toString("utf-8");

      const escapeXml = (s) =>
        String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/'/g, "&#x27;")
          .replace(/"/g, "&quot;");

      const newItem = `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blog/${slug}.html</link>
      <guid>${SITE_URL}/blog/${slug}.html</guid>
      <pubDate>${dateLabel} 00:00:00 GMT</pubDate>
      <description>${escapeXml(post.meta_description)}</description>
    </item>
`;
      // Remove any existing <item> for this exact slug first so a repeat
      // run never creates a duplicate feed entry.
      const existingItemRe = new RegExp(
        `\\s*<item>\\s*<title>[\\s\\S]*?<guid>${SITE_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/blog/${slug}\\.html</guid>[\\s\\S]*?</item>\\n?`
      );
      rssXml = rssXml.replace(existingItemRe, "\n");
      rssXml = rssXml.replace(/(<language>[^<]*<\/language>\s*\n)/, `$1${newItem}`);

      await fetch(rssApi, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update rss.xml: ${post.title}`,
          content: Buffer.from(rssXml).toString("base64"),
          sha: rssData.sha,
        }),
      });
    } catch (e) {
      // Non-fatal
    }

    return res.status(200).json({
      success: true,
      title: post.title,
      slug,
      category: categoryLabel,
      images: images.length,
      wordCount,
      headings: headings.length,
      duplicateWarning,
      url: `${SITE_URL}/blog/${slug}.html`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}