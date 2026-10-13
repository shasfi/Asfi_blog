# AsfiBlog deployment and editorial audit (14 Oct 2026)

## What this ZIP changes

- Uses GA4 **G-SXL9MNZFNL** on all existing HTML pages and in future generated articles. Removes old GA4 ID from `assets/js/main.js` to prevent duplicate measurement. Consent is opt-in and ads are not activated without a publisher ID.
- Existing 227 article URLs kept intact. Adds 5 missing catalog entries, pre-rendered article cards and 227 static article links to the archive for crawl discovery without JavaScript.
- Fixes one-year immutable caching of `posts-data.js` (which made new articles invisible to repeat visitors).
- Secures the scheduler route when `CRON_SECRET` is undefined. Blocks duplicate slugs/titles and inadequate auto-generated text instead of publishing it.
- Defaults automated discovery to US-first broad trending coverage across general news, US sports, entertainment, technology and business. Set `AUTO_TOPIC_MODE=focused` only for technology-focused publishing. Source corroboration is attempted; high-risk claims without at least two matching publisher references are skipped.
- Makes the newsletter an honest RSS follow action: before this change, its subscription button displayed a success message but stored no email.
- Regenerates sitemap and RSS and documents legacy content needing editorial review in `SEO-CONTENT-AUDIT.csv`.

## Latest clarification: trending and writing

- The October 14 revised archive defaults to US-first general, sports, entertainment, technology and business trends, rather than primarily US tech. US editorial weighting is not a guarantee of 60–70% real US visitors. Headline signals and RSS feed order are not verified social-media virality measurements.
- Automated articles are **AI-assisted**, not human-authored. Prompts favor plain English, real attribution and useful long-form coverage. High-risk claims without at least two corroborating headlines are rejected; this is a safety filter, not an editorial fact-check.
- Articles now visibly include the AI-assistance note and discovery reference links in the rendered body (previous article-template ordering bug fixed).
- Existing 227 articles are **unchanged in substantive writing and claims**, with their audit in `SEO-CONTENT-AUDIT.csv`; rewriting them safely requires an actual source-backed editorial pass.
- Four daily cron schedules may yield fewer than four published articles: the system rejects duplicates, unsupported claims and short or malformed AI output.

## Required Vercel Environment Variables

- `CRON_SECRET` — secure random value **16+ characters**, required for publishing; configure in Vercel Production.
- `OPENROUTER_API_KEY`, `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `SITE_URL=https://asfiblog.vercel.app`, `PEXELS_API_KEY` (optional images).
- `AUTO_TOPIC_MODE=broad` (recommended; broad is also the default) or `focused` (optional technology-centric publishing).
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` (optional visitor view counts). Do not mistake this counter for GA4 unique visitors.

**Never** include environment secrets in the ZIP or public git history. If `CRON_SECRET` is shorter than 16 characters, update it before deployment and update any external scheduler that uses it.

**Windows/GitHub Desktop guided deployment:** read `WINDOWS-DEPLOY-STEP-BY-STEP.md` before replacing any files. In particular, never overwrite newly published live articles with an older ZIP snapshot.

## Publishing checks

- After Vercel deploy, open `https://asfiblog.vercel.app/blog/index.html`, verify cards and the complete article directory render with JavaScript disabled.
- Search page source for the exact GA4 ID. Use Analytics Realtime or Tag Assistant with **analytics consent accepted** to verify activity. The site previously had a DIFFERENT GA4 measurement ID in `assets/js/main.js`; measurements collected under that historical ID will not move automatically.
- Verify `https://asfiblog.vercel.app/sitemap.xml` and `https://asfiblog.vercel.app/rss.xml` return HTTP 200 and valid XML.
- Inspect the Vercel Cron Jobs logs, new post URL, GitHub commits for posts-data, blog/index static archive, sitemap, RSS, and subsequent Vercel build status after each run.
- The generator rejects low-quality/duplicate content (HTTP 409 or 422); this is deliberate, **not a guaranteed four posts every day**. Rich, factual articles cannot be guaranteed solely by text prompts.
- A deployed version needs live checks for Google indexing, US organic traffic, legal consent compliance and AdSense approval. These cannot be tested offline.

## SEO / GEO / AEO / AIO

- Continue publishing first-hand testing, screenshots, code samples, dated source citations, natural summaries, clear answer-first paragraphs, FAQs and real authorship/review evidence.
- Don't mark automatically generated articles as human fact-checked unless someone actually verified them. Existing articles are **not rewritten or fact-checked by this patch**. They are inventoried for editorial review in `SEO-CONTENT-AUDIT.csv`.
- Prioritize clusters: API integrations, developer troubleshooting, AI tool comparisons with verified pricing/date, web performance, and credible US product guidance. Search volume and competition need data from Search Console and keyword tools before prioritization.
- No indexing/traffic guarantees: target 4,000 page users per day with 60-70% US geography remains an aspirational KPI; validate it in GA4.

## AdSense

**Hosting restriction:** As of this audit, Vercel Hobby is for non-commercial personal use and Vercel specifically classifies Google AdSense banners as commercial use. Upgrade to Pro/Enterprise or move to a hosting provider permitting monetization before ads go live. https://vercel.com/docs/limits/fair-use-guidelines

- No AdSense publisher ID was supplied. Accordingly, **NO AdSense ad code or ads.txt with invented IDs** is installed. Do not add fake ad publisher IDs or put ads on empty/low-value pages. After actual AdSense approval, integrate responsive in-article, in-feed, and optional anchor ad units under Google's rules and a properly configured CMP as required.
- This is an initial consent interface, NOT a certified IAB TCF CMP for EEA/UK/Swiss personalized AdSense ads. Implement a certified CMP before applicable AdSense serving.

## Rollback / regression

- Keep the previous GitHub commit and Vercel production deployment available for rollback.
- Verify existing APIs (`/api/chat`, `/api/views`, `/api/send-email`) after deployment; they need live credentials and third-party services.
- No external websites, API secrets, Search Console data or OpenRouter calls were available in the local source run; full production behavior remains to be validated live.
