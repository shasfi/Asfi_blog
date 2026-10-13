# AsfiBlog combined viral-news + US YouTube social trend patch

**This supersedes the earlier `AsfiBlog_Viral_Editorial_Patch_2026-10-14.zip`**. Use only THIS installer; it safely handles whether or not the earlier viral patch has already been installed. It is NOT a replacement for all site files.

## Deliverables

- Two separately sourced, long-form Elon Musk–Mukesh Ambani explainers. Metadata body word counts: **1,538** and **1,651**. Original source claims require independent verification by an editor before publication; source headline corroboration is NOT full fact-checking.
- Existing Google News/Google Trends trend prioritization and original automation retained.
- **NEW** optional real measured **US YouTube popular video signals** using official YouTube Data API v3. `YOUTUBE_API_KEY` is required in Vercel for live YouTube discovery. Without it the existing RSS automation works unchanged.
- **NEW** optional **licensed social-data JSON feed** supporting TikTok/Instagram/X/Threads/Facebook source URLs when you have legitimate permission and an approved provider. No direct TikTok/Instagram scraping or unrestricted public trend API is claimed.
- Historical post URLs remain unchanged. Only two article pages and their homepage links, index records, RSS, and sitemap are appended/merged.

## Deploy through your existing local GitHub clone (Windows PowerShell)

1. Extract the entire ZIP to `E:\Projects\AsfiBlog_Viral_Editorial_Patch` (this folder must contain `apply_patch.py`). **Do not** extract over `E:\Projects\Asfi_blog`.
2. Open PowerShell in the existing `E:\Projects\Asfi_blog` repository and check `git status -sb`. If there are uncommitted changes, stop and resolve/commit them first.
3. Run `git pull --ff-only origin main`. If it fails, STOP. You should be on `main` and up-to-date before the patch applies.
4. Dry run (does not alter your files):

   ```powershell
   py -3 "E:\Projects\AsfiBlog_Viral_Editorial_Patch\apply_patch.py" --project "E:\Projects\Asfi_blog"
   ```

5. If you see `Preflight OK`, install:

   ```powershell
   py -3 "E:\Projects\AsfiBlog_Viral_Editorial_Patch\apply_patch.py" --project "E:\Projects\Asfi_blog" --apply
   ```

6. Before any push, verify:

   ```powershell
   cd E:\Projects\Asfi_blog
   npm test
   py -3 "E:\Projects\AsfiBlog_Viral_Editorial_Patch\verify_patch.py" --project "E:\Projects\Asfi_blog"
   (Get-ChildItem .\blog -Filter '*.html' -File).Count
   git diff --check
   git status --short
   git fetch origin
   git rev-list HEAD..origin/main --count
   ```

   The combined patch passes **11 local tests** (7 site tests + 4 social-signal tests) when installed on the known project source. If the last command isn't `0`, DO NOT push or force-push; another new automated blog was committed remotely and must be reconciled.

7. After reviewing changes, create a backup branch from the last production commit, then commit/push:

   ```powershell
   git branch backup/pre-social-news-20261014
   git push origin backup/pre-social-news-20261014
   git add -A
   git diff --cached --check
   git commit -m "Add viral editorials and optional US YouTube social trend scoring"
   git fetch origin
   git rev-list HEAD..origin/main --count
   # Only if it is 0:
   git push origin main
   ```

8. In Vercel Dashboard, verify Deployment `Ready` and then set `YOUTUBE_API_KEY` as a Production environment variable if you want YouTube-based ranking. Create a new deployment after setting it. Never paste API keys in chat or commit them to GitHub. Read `SOCIAL_DISCOVERY_SETUP.md` for YouTube and licensed TikTok/Instagram data options.
9. Visit the article pages, homepage Editor's Picks, blog archive, sitemap, RSS, GA4 Realtime, and Vercel Cron logs; verify real posting rather than assuming local tests prove production success.

## Important editorial and business limits

- YouTube video view counts are not Google search volume, country audience percentage, or future virality. TikTok/Instagram direct cross-platform trend metrics **do not become available automatically** without authorized source access.
- A source being repeated in two publisher headlines does not prove it is true. Run human review on allegations, deaths, politics, medical/safety news and sensational stories. Do not invent quotes or fake exclusive reporting.
- The generated articles are AI-assisted, not human-authored investigative journalism. The existing 227 articles were **not** individually rewritten by this patch.
- No Google ranking, traffic share, AdSense approval or production feature is guaranteed by test passes.
