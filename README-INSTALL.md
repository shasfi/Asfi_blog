# AsfiBlog — verified Adsterra loader connection fix

## Root cause
The public GitHub `assets/js/main.js` lacked code that actually imports the existing `assets/js/adsterra.js`. Adsterra file presence alone is not enough. This repair appends a guarded one-time loader without replacing existing blog articles, GA4, OpenRouter, YouTube trend logic, sitemap, or post catalog.

## Placement
- 300x250 sponsored display near the top, after page heading/home hero.
- 4:1 Native Banner near bottom before footer; lazily requested when approaching the viewport.
- No mobile exclusion and no article word-count threshold.
- Intended on every HTML page that has `<main>` and includes `/assets/js/main.js`.
- If browser blocks third-party ads or Adsterra provides no fill, the actual creative may still be blank.

## Conditions / important hosting & privacy note
Ad loading is **enabled** by this patch. Do not deploy active commercial ads on Vercel Hobby: Vercel requires a commercial-permitted plan for sites containing advertising. The patch keeps regional eligibility and opt-out/consent protections: no forced tracking-based ads where consent is required. In US/PK/IN the region endpoint may return `auto` for the existing baseline; privacy review and opt-out compliance are still required.

## Installation (Windows PowerShell)
1. Extract this zip to `E:\Projects\AsfiBlog_Adsterra_Loader_Fix_2026-10-14`.
2. Open PowerShell in `E:\Projects\Asfi_blog`.
3. Before editing, ensure the repo is clean and remote has not advanced due to automated publishing:

```powershell
git status -sb
git fetch origin
git rev-list HEAD..origin/main --count
```

If working tree has pending modifications or the count is nonzero, preserve/reconcile those changes first; do not blindly overwrite/pull.

4. Dry-run:

```powershell
py -3 "E:\Projects\AsfiBlog_Adsterra_Loader_Fix_2026-10-14\apply_fix.py" --project "E:\Projects\Asfi_blog"
```

5. Apply (only after confirming advertising hosting permission):

```powershell
py -3 "E:\Projects\AsfiBlog_Adsterra_Loader_Fix_2026-10-14\apply_fix.py" --project "E:\Projects\Asfi_blog" --apply
```

6. Verify:

```powershell
py -3 "E:\Projects\AsfiBlog_Adsterra_Loader_Fix_2026-10-14\verify_fix.py" "E:\Projects\Asfi_blog"
node --check .\assets\js\main.js
node --check .\assets\js\adsterra.js
npm test
git diff --check
git status -sb
```

Only if checks pass and hosting is commercial-permitted, commit/push current branch after checking no new remote articles. Never force push.

## Live site test after deployment
On homepage and one article, use F12 Console:

```js
window.ASFIBLOG_AD_BOOTSTRAP
window.ASFIBLOG_AD_DIAGNOSTICS
document.querySelectorAll('.asfi-ad--top').length
document.querySelectorAll('.asfi-ad--bottom').length
```

Expected loader initialized `true`, top/bottom counts `1` in regions or sessions where ad scripts are allowed. Check Network tab for `/assets/js/adsterra.js`, `/api/ad-eligibility`, and Adsterra URLs `bauval.org/22/` and `bauval.org/21/` after scrolling to the bottom slot. If `geoPolicy:'consent-required'`, declining consent, ad blocker/GPC, or a network failure will prevent ad requests by design.

## Testing performed before delivery
- 239 static HTML pages including articles had shared main.js connection in test repository.
- 11/11 existing automated tests passed.
- Installer applied twice idempotently (no duplicate bootstrap).
- Controlled Chromium DOM tests passed on desktop and mobile homepage, short/long articles, and privacy page: one top and one bottom slot and expected script requests.
- Real Adsterra creative fill, regional edge headers, hosting plan, live Vercel deployment not verified.

Existing articles and automation remain unchanged by installer. First backup of changed files is saved alongside project under `Asfi_blog_before_adsterra_loader_fix`.
