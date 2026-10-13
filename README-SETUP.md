# AsfiBlog — Source, Deployment and Audit

This is the uploaded AsfiBlog static HTML/CSS/JavaScript site with Vercel APIs, 227 individual published article pages and an OpenRouter → GitHub → Vercel automated blogging pipeline.

**Step-by-step Windows deployment:** [`WINDOWS-DEPLOY-STEP-BY-STEP.md`](WINDOWS-DEPLOY-STEP-BY-STEP.md).

**Start here:** [`DEPLOY-AND-SEO-REVIEW.md`](DEPLOY-AND-SEO-REVIEW.md), [`SEO-GROWTH-PLAN.md`](SEO-GROWTH-PLAN.md) and [`SEO-CONTENT-AUDIT.csv`](SEO-CONTENT-AUDIT.csv).

## Files and systems

- `index.html`: public homepage with crawlable latest-article preview and site positioning.
- `blog/index.html`: blog search/filter/cards plus crawlable static archive of the published URLs.
- `blog/*.html`: standalone published articles with metadata, schema, FAQ, internal links and GA4 tag.
- `assets/js/posts-data.js`: frontend source of truth for site article cards; generator updates it on GitHub after each new article.
- `api/generate-blog.js`: scheduled AI-assisted publishing endpoint, including auth, selection, length/duplicate checks and GitHub publishing.
- `api/chat.js`, `api/views.js`, `api/send-email.js`: separate API functions with their own credentials and storage requirements.
- `assets/js/consent.js`: opt-in analytics consent interface.
- `vercel.json`: rewrites, cron schedules, security headers and public asset cache behavior.
- `sitemap.xml` and `rss.xml`: static site discovery and subscription endpoints.

## Run static checks locally

Requires Node.js 20+:

```bash
npm test
```

Run the directory with a local static web server (e.g. `python -m http.server 8000`) for browser checks. Serverless `/api/*` routes require Vercel or a compatible runtime and environment configuration. Never commit `.env` files or secret tokens.

## Analytics and monetization

GA4 ID installed: `G-SXL9MNZFNL`. The old Analytics ID found in `main.js` was removed to avoid double-tagging. Analytics cookies remain denied until a visitor accepts the banner. Use Google Tag Assistant and GA4 Realtime to verify behavior after deployment. Google Search Console is still needed for indexing and keyword/country performance.

**AdSense is not installed** because no approved publisher account ID was provided. Do not invent or reuse another publisher's ID; see deployment notes.

## Reality check

- Existing 227 articles were **not independently fact-checked/re-authored** in this automated patch. `SEO-CONTENT-AUDIT.csv` identifies priority content for human editorial review.
- Current API tests validate authorization, but cannot prove OpenRouter completion quality, GitHub write permissions, real Vercel cron success or search engine ranking.
- Existing published URLs are preserved. Deploy with a reversible git commit and validate in production before changing external schedulers.
