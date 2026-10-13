# AsfiBlog verified viral-news editorial patch — 14 October 2026

This is a **patch for the existing repository**, NOT a replacement for all 228+ HTML files. It was created from the AsfiBlog source ZIP provided earlier in this chat. Do not replace your entire published site with an older ZIP.

## What is included

* Two original, long-form, AI-assisted editorial explainers: October 8 'Real Boss of India' and October 9 'Prime Minister Ambani'. Content includes source links, official government response, the 2025 Jio-SpaceX agreement, Rahul Gandhi's reply, October 13 updates, FAQ, metadata and schema markup. These remain AI-assisted; do not label as human-authored investigative reporting.
* An automation Git patch that upgrades the existing `api/generate-blog.js` ranking logic. Prefers fresh, multi-source, US-interest news and public figures; editorial prompt demands source-attributed, news-desk-quality articles and explicit uncertainties. Searches Google News/Trends feeds; DOES NOT directly monitor X, TikTok or YouTube viral analytics, DOES NOT guarantee first-to-publish status or future trends.
* `apply_patch.py` merges those two article pages into your **newest local GitHub repo** (catalog, static archive, sitemap, RSS, and a clearly labeled homepage Editor's Picks section). It preserves other published articles, existing listing objects and site code.

## Windows PowerShell steps

First, ensure `E:\Projects\Asfi_blog` contains your latest Github local clone. Close other edits. You already pushed the earlier SEO update. Do not use `git reset --hard` or `git push --force`.

1. Open PowerShell in `E:\Projects\Asfi_blog`; run `git status -sb`. If you have uncommitted edits, commit or back them up FIRST. Then run `git pull --ff-only origin main`. If pull fails, STOP and resolve it before moving on.
2. Extract this patch ZIP to a separate folder, e.g. `E:\Projects\AsfiBlog_Viral_Editorial_Patch` (NOT inside the repository).
3. Preview only:

```powershell
py -3 "E:\Projects\AsfiBlog_Viral_Editorial_Patch\apply_patch.py" --project "E:\Projects\Asfi_blog"
```

4. When it prints `Preflight OK` and `DRY RUN ONLY`, apply locally:

```powershell
py -3 "E:\Projects\AsfiBlog_Viral_Editorial_Patch\apply_patch.py" --project "E:\Projects\Asfi_blog" --apply
```

5. Run quality checks:

```powershell
cd E:\Projects\Asfi_blog
npm test
(Get-ChildItem .\blog -Filter "*.html" -File).Count
git diff --check
git status --short
git fetch origin
git rev-list HEAD..origin/main --count
```

Expected on a baseline with 227 articles: 230 HTML files (229 articles and 1 archive), 7 existing tests pass; if more articles have been added automatically since, count can be higher. No deletion expected. `LF will be replaced by CRLF` is a Windows line-ending warning, not a code error. A nonzero remote commit count means **STOP**; do not force push. Additional actual article claims require editorial review; automated tests don't verify facts.

6. Once reviewed, create backup branch and update GitHub:

```powershell
git branch backup/pre-viral-patch-20261014
git push origin backup/pre-viral-patch-20261014
git add -A
git diff --cached --check
git commit -m "Publish sourced Elon Musk Ambani explainers and prioritize verified US trends"
git fetch origin
git rev-list HEAD..origin/main --count
# ONLY WHEN RESULT IS 0:
git push origin main
```

7. Verify Vercel Deployments status `Ready`, then manually visit both new article URLs, `/blog/index.html`, `/sitemap.xml`, `/rss.xml`, homepage Editor's Picks, GA4 Realtime and Vercel Cron logs.

## Notes

* Both articles share a news incident but deliberately have different editorial angles and cross-link each other. This is not a promise both will rank.
* Custom manual breaking news can still be supplied through the existing authenticated API route, but an editorial evidence pack must accompany sensitive claims; generic unsourced prompts risk being rejected or inaccurate.
* Source links cover available evidence through October 13, 2026. If official status changes after that date, update the articles promptly.
* A good publisher should run human factual review of names, statements, quotations and dates before publishing. 'Natural human-like prose' does not change actual authorship.

### Pre-publication editorial check

Two publish-ready drafts were created from the evidence available at preparation time; the installer does not independently query publishers or verify live facts. Before publishing, review each URL's factual claims and source links, particularly when major regulatory developments occur after October 13. For legal, public-figure, death or criminal stories, use editorial approval. This software cannot truthfully represent AI drafting as human authorship.
