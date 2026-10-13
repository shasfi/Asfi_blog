# AsfiBlog — Windows ZIP → GitHub → existing Vercel deployment

**Date:** 14 Oct 2026. **Use this revised ZIP**, not the preceding copy. The root of the archive is `Asfi_blog-main/`, containing `index.html`, `api/`, `blog/`, `assets/`, `vercel.json` and `package.json`. Do **not** upload the ZIP as a single file to the GitHub repository and expect it to become the website.

## 0. Before touching production

- On Vercel, open your **existing** AsfiBlog project (do not create a second project, since `asfiblog.vercel.app` is already attached).
- Check **Settings → Git**. Note the exact repository and production branch (typically `main`). The code's `GITHUB_OWNER` and `GITHUB_REPO` must identify that same GitHub repository, because the publishing function commits new articles there.
- Visit the current GitHub repo and check the latest article commit dates. This supplied ZIP is a snapshot from **14 Oct 2026**. If cron has published additional articles since then, copying `assets/js/posts-data.js`, `blog/index.html`, `sitemap.xml`, `rss.xml` or homepage static article cards from the ZIP can hide those newer posts. **Stop here, take a fresh repository snapshot and reconcile those catalog/HTML/feed files first.** Never delete newer article HTML files. A generic "Replace all" does not merge catalogs.
- Make a backup of the current GitHub repository before deploying.

## 1. Install GitHub Desktop and clone the existing repo

1. Install GitHub Desktop from https://desktop.github.com/ and sign into your GitHub account.
2. Open GitHub Desktop → **File → Clone repository** → choose the exact repository linked to the existing Vercel project → choose a local folder → **Clone**.
3. At the top, confirm the current branch is the production branch (often `main`) and **Fetch origin / Pull origin** to obtain latest posts.
4. Create a backup branch, e.g. `backup-before-asfiblog-update`, and click **Publish branch**. This keeps a Git-backed reference to the current files.
5. Return to `main` (or the project's actual production branch), pull latest and create a new branch, e.g. `asfiblog-seo-trending-update`.

## 2. Extract and copy the revised website source

1. Right-click the revised ZIP → **Extract All...**.
2. Open the extracted **inner** `Asfi_blog-main` folder. You should see `index.html`, `assets`, `api`, `blog`, `vercel.json` directly. Do not copy only the outer folder.
3. In GitHub Desktop choose **Repository → Show in Explorer** to open the local cloned repository.
4. Copy the **contents of the inner** `Asfi_blog-main` folder into the local repo root, merging folders and replacing *matching* source files. **Do not delete the repo's `.git` folder**, do not remove extra existing content, and do not copy credentials or `.env` files.
5. **Important for automated posts:** if the live GitHub repo has any article/catalog change after the ZIP snapshot, do not blindly overwrite `assets/js/posts-data.js`, `blog/index.html`, `index.html`, `sitemap.xml` and `rss.xml`. Those files need a merge that preserves all later articles. You may need an updated merged project ZIP first.

## 3. Review, commit, preview and merge

1. In GitHub Desktop review **Changes**. Ensure updated `api/generate-blog.js`, `vercel.json`, HTML, JS, sitemap and all existing blog files are included.
2. If Node 20+ is installed, open PowerShell inside the clone and run: `npm test`. Six tests should pass in this revised ZIP. Do not run `npm start`; this is a static site with Vercel API functions.
3. GitHub Desktop: **Summary** = `AsfiBlog SEO GA4 US trends and automation update`, then **Commit to asfiblog-seo-trending-update**, then **Publish branch**.
4. GitHub → create a **Pull Request** from the update branch to `main`. If Vercel previews are enabled, use the Preview deployment to inspect pages. Do not trigger the publisher manually on preview.
5. Once inspected, **Merge Pull Request**. Vercel's linked project should automatically build production from the configured production branch. Check **Deployments → latest → Ready**. If it fails, inspect build logs before changing further files.

## 4. Environment variables (existing Vercel project)

Vercel → existing AsfiBlog project → **Settings → Environment Variables** → choose **Production**. These are required by the publisher:

| Variable | Value |
|---|---|
| `CRON_SECRET` | Your own secret **16+ characters**; NEVER paste it into public chats, code or GitHub |
| `OPENROUTER_API_KEY` | Existing valid OpenRouter private API key |
| `GITHUB_TOKEN` | Private GitHub token with **Contents: Read and write** access to the exact repo |
| `GITHUB_OWNER` | The GitHub user/org owning that repo, not a URL |
| `GITHUB_REPO` | Only the repo name, e.g. `Asfi_blog` (use your actual name) |
| `SITE_URL` | `https://asfiblog.vercel.app` (no trailing slash) |
| `AUTO_TOPIC_MODE` | `broad` for US-first sports + general + entertainment + tech news |
| `PEXELS_API_KEY` | Optional: your existing Pexels API key for images |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Only if you use the existing `/api/views` counter |

Existing `api/chat.js` and `api/send-email.js` may use their own variables; **preserve all existing production variables** rather than replacing them with only this table. Variables edited in Vercel need a **new production deployment** to take effect.

**Cron:** `vercel.json` defines four schedules per day at **23:00, 02:00, 12:00 and 17:00 UTC**. This is 04:00, 07:00, 17:00 and 22:00 in Pakistan Standard Time (UTC+5). They run with Vercel's authorization header when `CRON_SECRET` is configured. Vercel Hobby allows each individual cron job at most daily, with execution sometime within the specified hour. There is no guarantee that four articles will be published; quality gates can reject weak stories or AI output.

## 5. Verify production (do not skip)

1. Open `https://asfiblog.vercel.app/` and `https://asfiblog.vercel.app/blog/index.html` in a private/incognito window. Existing 227 article URLs should continue working; blog archive must contain direct links.
2. Open a few existing `/blog/<slug>.html` pages. Inspect titles, breadcrumbs, tables of contents, images and author labels.
3. Open `https://asfiblog.vercel.app/sitemap.xml`, `https://asfiblog.vercel.app/rss.xml`, `https://asfiblog.vercel.app/robots.txt`. They should load and contain the correct site URLs.
4. Open **Google Analytics → Reports → Realtime**. Accept analytics consent on your own visit. In browser page source, confirm `G-SXL9MNZFNL` is present only once. Note: tag being visible is not proof a GA4 event arrived; check Realtime/Tag Assistant.
5. Open **Vercel → your project → Logs / Cron Jobs**, and check `/api/generate-blog` execution results. For publication, confirm **GitHub commits**, the new article URL and updated `posts-data.js`, blog directory, sitemap and RSS. Status **409** means duplicate rejected and **422** means unsafe/insufficient content rejected; do not bypass checks just to force daily publishing.
6. **Search Console:** submit sitemap if necessary; monitor Page Indexing and Performance by country. New indexing, 60–70% US readership and 1,000–4,000 daily visitors are goals, not automatic effects of deployment.
7. **AdSense is NOT installed.** You still need your own approved AdSense publisher ID, `ads.txt` and compliant consent/ad setup. **Hosting plan warning:** Vercel Hobby currently permits non-commercial personal projects only; enabling AdSense is commercial use and requires Vercel Pro/Enterprise or another host that permits commercial ads. Reference: https://vercel.com/docs/limits/fair-use-guidelines .

## 6. Rollback

If the deployed project breaks, Vercel → **Deployments** can restore a prior working deployment for site traffic; but Vercel notes cron schedules may not roll back automatically. Or revert the update PR in GitHub and redeploy. Preserve source catalogs/newer generated posts when rolling back.

## Editorial transparency

OpenRouter output is AI-assisted, not truly human-written. The updated generator prompts natural plain-language, length, useful structure, source-check attempts and a visible disclosure. It does **not** fact-check every claim or magically rewrite the existing 227 articles. `SEO-CONTENT-AUDIT.csv` identifies older articles for manual source-backed review before claiming human editorial verification.
