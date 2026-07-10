// api/generate-blog.js
// Vercel Serverless Function
// URL after deploy: https://yourproject.vercel.app/api/generate-blog?secret=YOUR_SECRET
//
// Full pipeline (100% free):
// 1. Fetch REAL trending searches from Google Trends RSS (free, no API key)
// 2. Generate a full SEO + AEO + GEO optimized article using OpenRouter FREE model
//    (title, meta description, 1300-1800 word body, tags, FAQ block, image alt text)
// 3. Fetch 2-4 relevant free images from Pexels
// 4. Build a static HTML blog post page matching the site design, with:
//    - meta description, canonical, Open Graph, Twitter Card tags
//    - Article + BreadcrumbList + FAQPage JSON-LD structured data
//    - a visible FAQ section (answer-engine friendly)
//    - images distributed through the article, not stacked at the top
// 5. Push the new file to GitHub -> Vercel auto-deploys it
// 6. Add a matching card to blog/index.html
// 7. Add the new URL to sitemap.xml

export default async function handler(req, res) {
  // Splits article HTML into an intro + h2-sections, and weaves extra images
  // between sections (roughly evenly spaced) instead of stacking them all up top.
  function distributeImages(contentHtml, images, alts) {
    if (!images || images.length <= 1) return contentHtml;

    const extraImages = images.slice(1);
    const extraAlts = alts.slice(1);
    const figure = (url, alt) =>
      `<figure class="post-figure"><img src="${url}" alt="${alt || ""}" loading="lazy" /></figure>`;

    const sections = contentHtml.split(/(?=<h2>)/);
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

  try {
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const SITE_URL = process.env.SITE_URL;

    console.log("STEP 1: fetching Google Trends trending searches");
    const geos = ["US", "AU", "GB", "CA"]; 
    const rssPromises = geos.map(geo => 
      fetch(`https://trends.google.com/trending/rss?geo=${geo}`) 
      .then(r => r.text()) 
      .catch(() => "")
     ); 
    const rssTexts = await Promise.all(rssPromises); 
    const rssText = rssTexts.join("");
    console.log("STEP 1 done: RSS length", rssText.length);

    const itemBlocks = rssText.split("<item>").slice(1);
    const items = itemBlocks
      .map((block) => {
        const titleMatch = block.match(/<title>(.*?)<\/title>/s);
        const snippetMatch = block.match(/<ht:news_item_snippet>(.*?)<\/ht:news_item_snippet>/s);
        const newsTitleMatch = block.match(/<ht:news_item_title>(.*?)<\/ht:news_item_title>/s);
        const clean = (s) =>
          s ? s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim() : "";
        return {
          title: titleMatch ? clean(titleMatch[1]) : null,
          description: clean(snippetMatch?.[1] || newsTitleMatch?.[1] || ""),
        };
      })
      .filter((i) => i.title);

    if (items.length === 0) {
      return res.status(500).json({ error: "Could not fetch trending topics" });
    }

    const chosen = items[Math.floor(Math.random() * Math.min(15, items.length))];
    const trendingHeadline = chosen.title;
    const trendingContext = chosen.description || "No additional summary available.";

    const imageCount = 2 + Math.floor(Math.random() * 3);

    const prompt = `You are a professional SEO editor for "AsfiBlog", a trending news publication. Write a detailed, 100% original, SEO-optimized, answer-engine-optimized (AEO) blog article based on this real, currently trending search topic.

Trending term: "${trendingHeadline}"
Related news context: "${trendingContext}"

IMPORTANT RULES:
- Base the article ONLY on the trending term and context given above. Do not invent specific product names, features, statistics, dates, or quotes that are not implied by the given information. If the context is thin, write more generally about the topic and why it might be trending, rather than making up specifics.
- Pick the single best-fitting "category" for this topic: one of Technology, Business, Science, Health, Entertainment, Sports, Politics, or General.
- Title: under 60 characters, front-load the main keyword, no clickbait.
- meta_description: exactly 150-160 characters, includes the main keyword naturally.
- Content: 1300-1800 words of full HTML using ONLY <h2>, <p>, <ul>, <li>, <strong> tags (no <html>/<head>/<body>, no inline styles, no <div>). Use at least 4 <h2> subheadings. Write in a clear, human, editorial tone grounded strictly in the given information. Every paragraph must add real information.
- Include one short concluding paragraph that directly and plainly answers the core question the topic raises, phrased so it could be lifted as a direct answer by an AI search summary.
- tags: exactly 5 relevant, specific tags (not single generic words like "news").
- image_keyword: one GENERIC, safe-for-work English keyword phrase to search stock photography for this topic — never a specific brand/company/product name, since stock photos for brand names are often wrong or mismatched.
- image_alts: an array of exactly ${imageCount} descriptive, SEO-friendly alt text strings (each under 125 characters, each describing a distinct relevant visual for this story, no keyword stuffing).
- faq: an array of exactly 3 objects, each with "q" (a real question a reader would type into Google or ask an AI assistant about this topic) and "a" (a direct, complete, 1-3 sentence answer written so it stands alone as a correct answer).

Return ONLY valid JSON (no markdown, no code fences, no explanation) with EXACTLY these keys:
{
  "title": "...",
  "meta_description": "...",
  "slug": "url-friendly-slug-no-spaces",
  "category": "...",
  "content": "...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "image_keyword": "...",
  "image_alts": ["...", "..."],
  "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
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

    const modelsToTry = [
      "openrouter/free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "deepseek/deepseek-chat",
      "openai/gpt-4o-mini",
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
    const readMins = Math.max(4, Math.round((post.content || "").split(" ").length / 200));

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

    const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${post.title} — AsfiBlog</title>
<meta name="description" content="${post.meta_description}" />
<meta name="keywords" content="${(post.tags || []).join(", ")}" />
<link rel="canonical" href="${SITE_URL}/blog/${slug}.html" />

<meta property="og:title" content="${post.title}" />
<meta property="og:description" content="${post.meta_description}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${SITE_URL}/blog/${slug}.html" />
${thumbnail ? `<meta property="og:image" content="${thumbnail}" />` : ""}
<meta property="article:published_time" content="${dateLabel}" />
<meta property="article:section" content="${categoryLabel}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${post.title}" />
<meta name="twitter:description" content="${post.meta_description}" />
<meta name="robots" content="index, follow" />
<meta name="google-site-verification" content="PpUxcguGEAURplqDhmyFXEu5TRZI382yGwo-MM1Pkkc" />

<link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/css/style.css" />
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
  "author": { "@type": "Person", "name": "Sheikh Asfi" },
  "publisher": { "@type": "Organization", "name": "AsfiBlog" },
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
    <span>ASFIBLOG — filed around the clock</span>
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
        <div class="bio">Founder & Editor, AsfiBlog.</div>
      </div>
    </div>

    <a class="back-link" href="/blog/index.html">&larr; Back to all dispatches</a>
  </article>
</main>

<footer class="site">
  <div class="wrap footer__grid">
    <div class="footer__brand">
      <a href="/" class="logo">Asfi<span>Blog</span></a>
      <p>Independent coverage of what the world's talking about — technology, business, science, and health, filed in plain English, around the clock.</p>
      <div class="footer__social">
        <a href="https://twitter.com" aria-label="AsfiBlog on X" target="_blank" rel="noopener">𝕏</a>
        <a href="https://linkedin.com" aria-label="AsfiBlog on LinkedIn" target="_blank" rel="noopener">in</a>
        <a href="https://facebook.com" aria-label="AsfiBlog on Facebook" target="_blank" rel="noopener">f</a>
        <a href="/blog/index.html" aria-label="AsfiBlog RSS">RSS</a>
      </div>
    </div>
    <div class="footer__col">
      <h4>Desks</h4>
      <ul>
        <li><a href="/blog/index.html#technology">Technology</a></li>
        <li><a href="/blog/index.html#business">Business</a></li>
        <li><a href="/blog/index.html#science">Science</a></li>
        <li><a href="/blog/index.html#health">Health</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Company</h4>
      <ul>
        <li><a href="/about.html">About AsfiBlog</a></li>
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
    <span class="footer__fine">© <span id="year"></span> AsfiBlog. All rights reserved.</span>
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

    return res.status(200).json({
      success: true,
      title: post.title,
      slug,
      category: categoryLabel,
      images: images.length,
      url: `${SITE_URL}/blog/${slug}.html`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}