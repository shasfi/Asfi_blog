# AsfiBlog DIRECT Adsterra connection fix — one replacement file

This replaces `assets/js/main.js` and `404.html` only. All 227+ article HTML files, the blog generator, API keys, and post catalog remain untouched.

**Before production:** Ads require a hosting plan that permits commercial use (Vercel Hobby is noncommercial). Applicable privacy and network-policy restrictions still apply.

## Exact steps (PowerShell opened in E:\Projects\Asfi_blog)
1. `git status -sb` — ensure no unrelated uncommitted changes; automated publishing may modify the repo.
2. `git fetch origin` and `git rev-list HEAD..origin/main --count` — if not zero, merge newer remote articles before continuing.
3. Make a backup: `Copy-Item .\assets\js\main.js .\assets\js\main.before-ads-fix.js.bak` (don't commit this backup).
4. Extract this ZIP. Copy `assets/js/main.js` to `E:\Projects\Asfi_blog\assets\js\main.js` and `404.html` to `E:\Projects\Asfi_blog\404.html`, allowing replace. **Do not copy the enclosing folder into itself.**
5. `node --check .\assets\js\main.js`
6. `Select-String -Path .\assets\js\main.js -Pattern 'ASFI_ADSTERRA_DIRECT_FIX_20261014_V4'`
7. `npm test`
8. `git add assets/js/main.js 404.html && git commit -m "Connect Adsterra loader on every page"` (in PowerShell, two separate lines if `&&` unavailable).
9. `git fetch origin` and `git rev-list HEAD..origin/main --count` once more; only if 0, `git push origin main`.
10. Wait for Vercel Production deployment Ready.

## Verify live deployment, NOT just local
In a PowerShell session:
`$js = (Invoke-WebRequest -Uri 'https://asfiblog.vercel.app/assets/js/main.js?v=adsfix20261014' -UseBasicParsing).Content`
`$js.Contains('ASFI_ADSTERRA_DIRECT_FIX_20261014_V4')`
This MUST return `True`. If `False`, production is running old code / wrong branch / cache.

On website DevTools Console:
`window.ASFIBLOG_AD_BOOTSTRAP`
`window.ASFIBLOG_AD_DIAGNOSTICS`
`document.querySelectorAll('.asfi-ad--top').length`
`document.querySelectorAll('.asfi-ad--bottom').length`

If the first shows loaded but slots absent, check `/api/ad-eligibility` result, regional permissions, GPC/adblock, browser errors. Slots do not guarantee Adsterra fill.
