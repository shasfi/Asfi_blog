# Pulsewire - Full Site + Auto Blog Setup Guide (100% Free)

This is a fully redesigned version of the Pulsewire site: modern 2026-style visual design, richer homepage sections, 4 sample blog posts, a full SEO + AEO + GEO optimized structure, and an upgraded auto-blog pipeline.

The automation system:
1. Picks a trending news topic (Google News RSS - free)
2. Writes a full, long-form SEO/AEO-optimized article with AI (OpenRouter free model), including an FAQ block
3. Adds 2-4 relevant free images (Pexels) with descriptive alt text
4. Publishes it as a live HTML page on your site (via GitHub -> Vercel auto-deploy), with full meta tags + JSON-LD structured data
5. Updates your blog listing page automatically
6. Updates your sitemap.xml automatically

Runs 2-4 times per day, fully automated, once set up.

---

## What's new in this version

- **Modern visual redesign**: animated hero, gradient accents, magazine-style featured post layout, stat counters, trust/credibility section, newsletter box, richer multi-column footer, reading-progress bar on articles, back-to-top button, table of contents on articles, author box, FAQ accordions.
- **Fully responsive**: tested breakpoints for desktop, tablet, and mobile (down to ~340px wide).
- **4 sample blog posts included** (Technology, Business, Science, Health) so the site launches with real content instead of an empty blog.
- **SEO + AEO + GEO on every page**: canonical URLs, Open Graph, Twitter Cards, `NewsArticle` / `BreadcrumbList` / `FAQPage` JSON-LD structured data, semantic heading structure, descriptive image alt text, and direct-answer paragraphs written for AI search summaries.
- **sitemap.xml + robots.txt** included, and the automation now updates the sitemap automatically every time a new post is published.
- **Upgraded auto-blog generator**: 1300-1800 word articles (up from ~1000), 2-4 images with unique alt text per post, a 3-question FAQ block with schema markup, and full meta/OG/Twitter/JSON-LD tags generated automatically for every new post.

## What's included

- `index.html`, `about.html`, `contact.html`, `privacy-policy.html`, `disclaimer.html` — full site pages
- `blog/index.html` — auto-updating blog listing (featured post + card grid), pre-loaded with 4 sample posts
- `blog/*.html` — 4 sample blog posts, fully SEO/AEO structured, used as templates for the auto-generator's output
- `assets/css/style.css` — full design system (light/dark theme, animations, ticker, cards, footer, FAQ, TOC)
- `assets/js/main.js` — theme toggle, mobile nav, scroll-reveal animations, stat counters, back-to-top, reading progress
- `assets/js/chatbot.js` + `api/chat.js` — "Ask The Desk" AI chatbot widget (appears on every page)
- `api/generate-blog.js` — the auto-blog automation (SEO/AEO/GEO optimized)
- `sitemap.xml`, `robots.txt` — for search engine indexing

## Before you upload: 3 things to personalize

1. In `contact.html`, replace `youremail@example.com` with your real email.
2. In every page's `<link rel="canonical">`, `og:url`, and `sitemap.xml`, replace `https://pulsewire.vercel.app` with your actual Vercel URL (or custom domain once you have one). A quick find-and-replace across all files works.
3. If you don't want the name "Pulsewire", replace it across all files (logo text, titles, footer) — it's just a placeholder brand name.

## Step 1: Create GitHub repo for your site

- Push your website (including the `blog/` folder, `assets/` folder, and `api/` folder from this project) to a GitHub repo.
- Connect that repo to Vercel (Vercel dashboard -> "Add New Project" -> import from GitHub).
- Every time a file changes in the repo, Vercel auto-redeploys. This is default Vercel behavior, nothing extra to configure.

## Step 2: Get your free API keys

### OpenRouter (AI content generation) - Free
1. Go to https://openrouter.ai and sign up
2. Go to "Keys" and create a new API key
3. Use free models like `google/gemini-2.0-flash-exp:free` (already set in the code)

### Pexels (free stock images)
1. Go to https://www.pexels.com/api/
2. Sign up and copy your API key (instant, free, unlimited)

### GitHub Personal Access Token
1. GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens
2. Give it "Contents: Read and write" permission on your specific repo only
3. Copy the token

## Step 3: Add Environment Variables in Vercel

Go to your Vercel Project -> Settings -> Environment Variables and add:

| Name | Value |
|---|---|
| OPENROUTER_API_KEY | your OpenRouter key |
| PEXELS_API_KEY | your Pexels key |
| GITHUB_TOKEN | your GitHub token |
| GITHUB_OWNER | your GitHub username |
| GITHUB_REPO | your repo name |
| SITE_URL | https://yourproject.vercel.app (or your custom domain later) |
| CRON_SECRET | any random password you make up, e.g. `myBlog2026Secret` |

The chatbot (`api/chat.js`) reuses the same `OPENROUTER_API_KEY` — no extra key needed.

Redeploy the project after adding these so they take effect.

## Step 4: Automate with a free scheduler (cron-job.org)

Vercel's free plan only allows 1 scheduled run per day through its own cron feature, so we use a free external scheduler instead:

1. Go to https://cron-job.org and create a free account
2. Create a new cron job with this URL:
   `https://yourproject.vercel.app/api/generate-blog?secret=myBlog2026Secret`
3. Set it to run 2-4 times a day, for example: 06:00, 12:00, 17:00, 21:00
4. Save. That's it - it will now hit your endpoint automatically and each hit publishes one new blog post, complete with schema markup, FAQ, and updated sitemap.

## Step 5: Test it manually first

Before relying on the scheduler, open this URL directly in your browser once to confirm it works:

`https://yourproject.vercel.app/api/generate-blog?secret=myBlog2026Secret`

You should see a JSON response like:
```
{ "success": true, "title": "...", "slug": "...", "images": 3, "url": "..." }
```

Then check `https://yourproject.vercel.app/blog/index.html` to see the new post listed, and `https://yourproject.vercel.app/sitemap.xml` to confirm the new URL was added.

## Before applying for AdSense

- Let the automation run until you have at least 15-20 published posts (the 4 sample posts included here count toward this).
- Make sure About, Contact, Privacy Policy, and Disclaimer pages are personalized with your real details (Step "Before you upload" above).
- Submit your sitemap.xml to Google Search Console and confirm your key pages are indexed before applying.

## Notes

- The `secret` in the URL prevents random people from spamming your AI/image API quota - keep it private.
- Free OpenRouter models sometimes get rate-limited if used too much in a short time - 2-4 posts/day is a safe amount.
- If a Pexels search returns fewer images than requested, the page will simply use however many came back — this won't break the page.
