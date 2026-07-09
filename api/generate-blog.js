// api/generate-blog.js
// Vercel Serverless Function
// URL after deploy: https://yourproject.vercel.app/api/generate-blog?secret=YOUR_SECRET
//
// Full pipeline (100% free):
// 1. Fetch trending topic from Google News RSS (free, no API key)
// 2. Generate title + article + meta + tags using OpenRouter FREE model
// 3. Fetch 2-4 relevant free images from Pexels
// 4. Build a static HTML blog post page matching the site design
// 5. Push the new file to GitHub -> Vercel auto-deploys it
// 6. Add a matching card to blog/index.html

export default async function handler(req, res) {
  // Extracts the {...} JSON block even if the model adds extra text around it
  function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? match[0] : text;
  }

  // Calls OpenRouter with a given model and returns parsed JSON, or null if it fails
  async function tryGenerate(model, prompt, apiKey) {
    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
    const SITE_URL = process.env.SITE_URL; // e.g. https://pulsewire.vercel.app

    console.log("STEP 0: env check", {
      hasOpenRouter: !!OPENROUTER_KEY,
      hasPexels: !!PEXELS_KEY,
      hasGithubToken: !!GITHUB_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO,
      SITE_URL,
    });

    // ---------- 1. GET TRENDING TOPIC (Google News RSS - FREE) ----------
    const categories = ["TECHNOLOGY", "BUSINESS", "SCIENCE", "HEALTH"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    console.log("STEP 1: fetching RSS for category", category);
    const rssUrl = `https://news.google.com/rss/headlines/section/topic/${category}?hl=en-US&gl=US&ceid=US:en`;
    const rssRes = await fetch(rssUrl);
    const rssText = await rssRes.text();
    console.log("STEP 1 done: RSS length", rssText.length);

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

    const trendingHeadline = titles[Math.floor(Math.random() * Math.min(10, titles.length))];

    // ---------- 2. GENERATE CONTENT WITH AI (OpenRouter FREE model) ----------
    const prompt = `You are a professional blog writer for "Pulsewire", a trending news publication. Write a detailed, original, SEO-optimized blog article based on this trending news headline: "${trendingHeadline}"

Category: ${category}

Return ONLY valid JSON (no markdown, no code fences, no explanation) with EXACTLY these keys:
{
  "title": "catchy SEO title, max 70 characters",
  "meta_description": "150-160 character meta description",
  "slug": "url-friendly-slug-no-spaces",
  "content": "Full HTML article, 900-1300 words, using <h2> subheadings and <p> paragraphs. Do not include <html>, <head>, or <body> tags. Write in a clear, human, engaging tone.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "image_keyword": "one simple English keyword or phrase to search stock photos for this topic"
}`;

    console.log("STEP 2: generating content for headline:", trendingHeadline);

    // Try a list of models in order until one gives valid JSON
    // Free tier models first, then cheap paid fallbacks (need a small OpenRouter balance)
    const modelsToTry = [
      "meta-llama/llama-3.1-8b-instruct:free",
      "meta-llama/llama-3.1-70b-instruct:free",
      "deepseek/deepseek-chat",
      "openai/gpt-4o-mini",
    ];

    let post = null;
    for (const model of modelsToTry) {
      post = await tryGenerate(model, prompt, OPENROUTER_KEY);
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

    // ---------- 3. FETCH FREE IMAGES (Pexels) ----------
    console.log("STEP 3: fetching Pexels images for", post.image_keyword || category);
    const imgQuery = encodeURIComponent(post.image_keyword || category);
    const pexelsRes = await fetch(
      `https://api.pexels.com/v1/search?query=${imgQuery}&per_page=3`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    console.log("STEP 3: Pexels HTTP status", pexelsRes.status);
    const pexelsData = await pexelsRes.json();
    const images = (pexelsData.photos || []).map((p) => p.src.large);
    const thumbnail = images[0] || "";
    console.log("STEP 3 done: image count", images.length);

    // ---------- 4. BUILD HTML POST PAGE (matches site design system) ----------
    const imagesHtml = images
      .map(
        (url, i) =>
          `<img src="${url}" alt="${post.title} image ${i + 1}" loading="lazy" />`
      )
      .join("\n");

    const publishDate = new Date();
    const dateLabel = publishDate.toISOString().split("T")[0];
    const categoryLabel = category.charAt(0) + category.slice(1).toLowerCase();

    const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${post.title} — Pulsewire</title>
<meta name="description" content="${post.meta_description}" />
<meta name="keywords" content="${(post.tags || []).join(", ")}" />
<link rel="canonical" href="${SITE_URL}/blog/${slug}.html" />

<meta property="og:title" content="${post.title}" />
<meta property="og:description" content="${post.meta_description}" />
<meta property="og:type" content="article" />
${thumbnail ? `<meta property="og:image" content="${thumbnail}" />` : ""}

<link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/css/style.css" />
<script src="/assets/js/main.js" defer></script>
<script src="/assets/js/chatbot.js" defer></script>
</head>
<body>

<div class="ticker">
  <div class="ticker__track">
    <span>${categoryLabel.toUpperCase()} — filed ${dateLabel}</span>
    <span>PULSEWIRE — filed around the clock</span>
    <span>TECHNOLOGY — new stories filed daily</span>
    <span>BUSINESS — markets, moves, and money</span>
  </div>
</div>

<header class="site">
  <div class="wrap nav">
    <a href="/" class="logo">Pulse<span>wire</span></a>
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

<main class="wrap">
  <article class="post">
    <span class="stamp">${categoryLabel}</span>
    <h1>${post.title}</h1>
    <p class="timestamp">Filed ${dateLabel}</p>
    ${imagesHtml}
    <div class="content">
      ${post.content}
    </div>
    <div class="tags">
      ${(post.tags || []).map((t) => `<span>${t}</span>`).join(" ")}
    </div>
    <a class="back-link" href="/blog/index.html">&larr; Back to all dispatches</a>
  </article>
</main>

<footer class="site">
  <div class="wrap footer__inner">
    <div>
      <a href="/" class="logo">Pulse<span>wire</span></a>
      <p class="footer__fine">Independent coverage of what's trending, filed daily.</p>
    </div>
    <div class="footer__links">
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
      <a href="/privacy-policy.html">Privacy Policy</a>
      <a href="/disclaimer.html">Disclaimer</a>
    </div>
  </div>
  <div class="wrap footer__fine">© <span id="year"></span> Pulsewire. All rights reserved.</div>
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

    // ---------- 5. PUSH NEW POST FILE TO GITHUB ----------
    console.log("STEP 5: pushing post file to GitHub", `${GITHUB_OWNER}/${GITHUB_REPO}`);
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
    console.log("STEP 5 done: GitHub post push status", putPostRes.status);
    if (!putPostRes.ok) {
      const errText = await putPostRes.text();
      console.log("STEP 5 ERROR:", errText.slice(0, 500));
      return res.status(500).json({ error: "GitHub push failed for post file", detail: errText });
    }

    // ---------- 6. UPDATE blog/index.html WITH A MATCHING CARD ----------
    console.log("STEP 6: fetching current blog/index.html");
    const indexApi = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/blog/index.html`;
    const indexGet = await fetch(indexApi, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
    console.log("STEP 6: index GET status", indexGet.status);
    if (!indexGet.ok) {
      const errText = await indexGet.text();
      console.log("STEP 6 ERROR: could not fetch index.html", errText.slice(0, 500));
      return res.status(500).json({ error: "Could not fetch blog/index.html from GitHub", detail: errText });
    }
    const indexData = await indexGet.json();
    let indexHtml = Buffer.from(indexData.content, "base64").toString("utf-8");

    const newCard = `<a href="/blog/${slug}.html" class="card">
      ${thumbnail ? `<div class="card__img-wrap"><img src="${thumbnail}" alt="${post.title}" loading="lazy" /></div>` : ""}
      <div class="card__body">
        <span class="stamp">${categoryLabel}</span>
        <div class="card__title">${post.title}</div>
        <p class="card__excerpt">${post.meta_description}</p>
        <p class="timestamp" style="margin-top:10px;">${dateLabel}</p>
      </div>
    </a>
<!--POSTS_MARKER-->`;

    indexHtml = indexHtml.replace("<!--POSTS_MARKER-->", newCard);

    await fetch(indexApi, {
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
    });

    return res.status(200).json({
      success: true,
      title: post.title,
      slug,
      url: `${SITE_URL}/blog/${slug}.html`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}