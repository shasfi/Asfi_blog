// api/generate-blog.js
// Vercel Serverless Function
// URL after deploy: https://yourproject.vercel.app/api/generate-blog?secret=YOUR_SECRET
//
// Full pipeline (100% free):
// 1. Fetch trending topic from Google News RSS (free, no API key)
// 2. Generate a full SEO + AEO + GEO optimized article using OpenRouter FREE model
//    (title, meta description, 1200-1800 word body, tags, FAQ block, image alt text)
// 3. Fetch 2-4 relevant free images from Pexels
// 4. Build a static HTML blog post page matching the site design, with:
//    - meta description, canonical, Open Graph, Twitter Card tags
//    - Article + BreadcrumbList + FAQPage JSON-LD structured data
//    - a visible FAQ section (answer-engine friendly)
// 5. Push the new file to GitHub -> Vercel auto-deploys it
// 6. Add a matching card to blog/index.html
// 7. Add the new URL to sitemap.xml

export default async function handler(req, res) {
  try {
    // ---------- 0. SECURITY CHECK ----------
    if (req.query.secret !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
    const PEXELS_KEY = process.env.PEXELS_API_KEY;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_REPO = process.env.GITHUB_REPO;
    const SITE_URL = process.env.SITE_URL; // e.g. https://asfiblog.vercel.app

    // ---------- 1. GET TRENDING TOPIC (Google News RSS - FREE) ----------
    const categories = ["TECHNOLOGY", "BUSINESS", "SCIENCE", "HEALTH"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const rssUrl = `https://news.google.com/rss/headlines/section/topic/${category}?hl=en-US&gl=US&ceid=US:en`;
    const rssRes = await fetch(rssUrl);
    const rssText = await rssRes.text();

    const itemBlocks = rssText.split("<item>").slice(1);
    const titles = itemBlocks
      .map((block) => {
        const match = block.match(/<title>(.*?)<\/title>/s);
        return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : null;
      })
      .filter(Boolean);

    if (titles.length === 0) {
      return res.status(500).json({ error: "Could not fetch trending topics" });
    }

    // Give the model several real, currently-trending headlines instead of just one —
    // it picks the strongest angle itself and can cross-reference for accuracy/context.
    const topHeadlines = titles.slice(0, 8);
    const trendingHeadline = topHeadlines[Math.floor(Math.random() * Math.min(10, topHeadlines.length))];

    // ---------- 2. GENERATE SEO + AEO + GEO OPTIMIZED CONTENT (OpenRouter FREE model) ----------
    const imageCount = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4 images

    const prompt = `You are a senior editorial writer for "AsfiBlog", a trending news and analysis publication. Your job is to write content that reads as if a real, experienced human journalist wrote it after researching the topic — not a generic AI summary.

Primary headline to cover: "${trendingHeadline}"
Other currently-trending headlines in the same category (for context/cross-reference only, do not copy wording from them): ${JSON.stringify(topHeadlines.filter((t) => t !== trendingHeadline).slice(0, 5))}

Category: ${category}

CRITICAL — avoid sounding like AI-generated filler:
- Never use these overused AI phrases or their variants: "In today's fast-paced world", "In the ever-evolving landscape", "In conclusion", "It's important to note", "Dive into", "Unlock the power of", "Navigating the world of", "In this article, we will".
- Open with a specific, concrete detail or fact from the story — not a broad generalization.
- Vary sentence length naturally (mix short punchy sentences with longer explanatory ones). Avoid a repetitive rhythm where every paragraph is the same length.
- Include specific numbers, names, dates, or examples wherever possible instead of vague statements like "many experts believe" or "studies show".
- Add a genuine point of view or analysis in at least one section — what this actually means for the reader, not just a restatement of facts.
- Write like you're explaining this to a smart friend, not writing a corporate press release.

SEO / AEO / GEO rules:
- Title: under 60 characters, front-load the main keyword, specific (not generic clickbait).
- meta_description: exactly 150-160 characters, includes the main keyword naturally, written to earn clicks.
- Content: 900-1300 words of full HTML using ONLY <h2>, <p>, <ul>, <li>, <strong> tags (no <html>/<head>/<body>). Use at least 3 <h2> subheadings phrased as real questions or subtopics readers search for. Every paragraph must add real, non-repeated information — no padding.
- Include one short paragraph near the end that directly and plainly answers the core question the headline raises, phrased so it could stand alone as a correct answer in an AI search summary (AEO/GEO).
- takeaway: a single 1-2 sentence "key takeaway" that captures the single most useful insight from the article (used for a highlighted callout box — must add real value, not restate the title).
- tags: exactly 5 relevant, specific tags (not generic single words like "news").
- image_keyword: one simple, safe-for-work English keyword phrase to search stock photography for this topic.
- image_alts: an array of exactly ${imageCount} descriptive, SEO-friendly alt text strings (each under 125 characters, each describing a distinct relevant visual for this story, no keyword stuffing).
- faq: an array of exactly 3 objects, each with "q" (a real question a reader would type into Google or ask an AI assistant about this topic) and "a" (a direct, complete, 1-3 sentence answer written so it stands alone as a correct answer).

Originality requirement: do not lift phrasing from any news source. Every sentence must be written fresh, in your own words, based on the general facts of the story.

Return ONLY valid JSON (no markdown, no code fences, no explanation) with EXACTLY these keys:
{
  "title": "...",
  "meta_description": "...",
  "slug": "url-friendly-slug-no-spaces",
  "content": "...",
  "takeaway": "...",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "image_keyword": "...",
  "image_alts": ["...", "..."],
  "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]
}`;


    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await aiRes.json();
    let rawText = aiData.choices?.[0]?.message?.content || "";
    rawText = rawText.replace(/```json|```/g, "").trim();

    let post;
    try {
      post = JSON.parse(rawText);
    } catch (e) {
      return res.status(500).json({ error: "AI did not return valid JSON", raw: rawText });
    }

    const slug =
      post.slug ||
      post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // ---------- 3. FETCH FREE IMAGES (Pexels) — 2 to 4 images ----------
    const imgQuery = encodeURIComponent(post.image_keyword || category);
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${imgQuery}&per_page=${imageCount}`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    const pexelsData = await pexelsRes.json();
    const images = (pexelsData.photos || []).map((p) => p.src.large);
    const thumbnail = images[0] || "";
    const imageAlts = post.image_alts && post.image_alts.length === images.length
      ? post.image_alts
      : images.map((_, i) => `${post.title} — illustration ${i + 1}`);

    // ---------- 4. BUILD HTML POST PAGE (matches site design system) ----------
    const imagesHtml = images
      .map((url, i) => `<img src="${url}" alt="${imageAlts[i]}" loading="lazy" />`)
      .join("\n    ");

    const publishDate = new Date();
    const dateLabel = publishDate.toISOString().split("T")[0];
    const categoryLabel = category.charAt(0) + category.slice(1).toLowerCase();
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
    ${imagesHtml}
    ${post.takeaway ? `<div class="takeaway-box" style="background:var(--surface-2,#f4f4f4); border-left:4px solid var(--accent,#c97f00); padding:16px 20px; margin:24px 0; border-radius:6px;"><strong>Key takeaway:</strong> ${post.takeaway}</div>` : ""}
    <div class="content">
      ${post.content}
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

    // ---------- 5. PUSH NEW POST FILE + FETCH index.html/sitemap.xml IN PARALLEL ----------
    const githubApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/${slug}.html`;
    const indexApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/index.html`;
    const sitemapApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/sitemap.xml`;

    const [, indexGet, sitemapGet] = await Promise.all([
      fetch(githubApi, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Auto blog: ${post.title}`,
          content: Buffer.from(htmlPage).toString("base64"),
        }),
      }),
      fetch(indexApi, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }),
      fetch(sitemapApi, { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }),
    ]);

    // ---------- 6. UPDATE blog/index.html WITH A MATCHING CARD ----------
    const indexData = await indexGet.json();
    let indexHtml = Buffer.from(indexData.content, "base64").toString("utf-8");

    const newCard = `<a href="/blog/${slug}.html" class="card">
      ${thumbnail ? `<div class="card__img-wrap"><img src="${thumbnail}" alt="${imageAlts[0]}" loading="lazy" /></div>` : ""}
      <div class="card__body">
        <span class="stamp">${categoryLabel}</span>
        <div class="card__title">${post.title}</div>
        <p class="card__excerpt">${post.meta_description}</p>
        <p class="timestamp" style="margin-top:10px;">${dateLabel} · ${readMins} min read</p>
      </div>
    </a>
<!--POSTS_MARKER-->`;

    indexHtml = indexHtml.replace("<!--POSTS_MARKER-->", newCard);

    // ---------- 7. BUILD SITEMAP UPDATE ----------
    let sitemapPut = Promise.resolve();
    try {
      const sitemapData = await sitemapGet.json();
      let sitemapXml = Buffer.from(sitemapData.content, "base64").toString("utf-8");

      const newUrlEntry = `  <url>
    <loc>${SITE_URL}/blog/${slug}.html</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      sitemapXml = sitemapXml.replace("</urlset>", newUrlEntry);

      sitemapPut = fetch(sitemapApi, {
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
      // Non-fatal — sitemap update failing shouldn't block the post from publishing
    }

    // ---------- 8. FIRE OFF index.html + sitemap.xml UPDATES IN PARALLEL ----------
    await Promise.all([
      fetch(indexApi, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Update blog index: ${post.title}`,
          content: Buffer.from(indexHtml).toString("base64"),
          sha: indexData.sha,
        }),
      }),
      sitemapPut,
    ]);

    return res.status(200).json({
      success: true,
      title: post.title,
      slug,
      images: images.length,
      url: `${SITE_URL}/blog/${slug}.html`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}