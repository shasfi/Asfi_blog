ASFI BLOG — MUSK ARTICLE VISIBILITY REPAIR

Root cause: two article HTML files may exist but catalog/archive/sitemap/RSS are missing their links.
This is an isolated local source-code repair. It does not change cron, OpenRouter, YouTube, Adsterra, or secrets.

1. In PowerShell, go to your existing cloned project:
   cd E:\Projects\Asfi_blog
   git status -sb
   git fetch origin
   git rev-list HEAD..origin/main --count

2. If clean and 0 commits behind, dry-run:
   py -3 "E:\Projects\AsfiBlog_Musk_Article_Visibility_Fix\fix_visibility.py" --project "E:\Projects\Asfi_blog"

3. If Preflight OK, apply:
   py -3 "E:\Projects\AsfiBlog_Musk_Article_Visibility_Fix\fix_visibility.py" --project "E:\Projects\Asfi_blog" --apply

4. Validate:
   npm test
   git diff --check
   git status -sb

5. Then commit, recheck remote and push (never force):
   git add assets/js/posts-data.js blog/index.html sitemap.xml rss.xml index.html blog/elon-musk-ambani-real-boss-india-starlink-dispute.html blog/elon-musk-prime-minister-ambani-starlink-india-explained.html
   git commit -m "Show Musk Ambani articles in archive sitemap RSS and homepage"
   git fetch origin
   git rev-list HEAD..origin/main --count
   git push origin main   [ONLY if count returned 0]

6. Wait for Vercel Ready. Verify homepage, archive and article direct URLs.
