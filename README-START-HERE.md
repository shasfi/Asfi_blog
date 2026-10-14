# AsfiBlog all-page mobile + desktop Adsterra patch

This patch replaces the earlier *restricted* ad loader. It does NOT overwrite any existing blog article, your generator, trends automation, sitemap, RSS, post catalog, or GA4 tags.

## What changes

- Enables the ad feature flag in `assets/js/main.js` and adds a single shared loader.
- Renders one Adsterra **300 x 250** slot close to the top, after the page headline (or after homepage/archive hero).
- Renders one Adsterra **Native 4:1** block toward the bottom, before the footer, on desktop AND mobile.
- No word-count requirement: short 400-word articles are eligible too.
- Works on Home, archive, category, About, Author, Contact, Privacy, Disclaimer, Stats, 404, and every existing/future HTML article that uses `main.js`.
- **No separate ads opt-in popup in US/PK/IN**, unless prior user preference says no, Global Privacy Control is active, or other restrictions apply. An eligibility API determines region server-side.
- Consent-based gate for UK/EEA and all other/unknown regions; this is a baseline engineering guard and NOT an independent legal compliance certification. Jurisdiction/vendor review still needed.
- Browser ad blockers, vendor approval, ad fill and script restrictions can cause blank spaces; no 100% impression guarantee.

## IMPORTANT

Vercel Hobby **prohibits commercial use**. This patch enables advertising in main.js and must not be deployed to Hobby. Confirm Vercel Pro or migrate to commercial-permitted hosting first. If you are staying on Hobby, set `window.ASFIBLOG_ADS_ENABLED = false;` in `assets/js/main.js` after patching, BEFORE pushing.

Unknown locations and restricted regions require opt-in before third-party ad scripts load. This is necessary because the Adsterra script may access device identifiers or cookies; merely hiding a popup does not establish legal consent. The solution does not promise compliant auto-ads in every jurisdiction. Review US state privacy rights and Adsterra data handling.

**About the 4:1 Native layout on mobile:** We request the native creative for mobile. The ad unit was created with 4-in-a-row layout in the publisher dashboard, so it may be cramped on phones. The ad container allows horizontal overflow; for best mobile experience ask Adsterra for a separate mobile 1:1 or 2:1 native unit. Never paste the SAME native script twice on one page.

## Windows PowerShell steps

1. Extract this ZIP into `E:\Projects\AsfiBlog_AllPages_Adsterra_Responsive_Patch_2026-10-14`.
2. In `E:\Projects\Asfi_blog` open PowerShell and ensure there are no pending local changes you want to preserve. Do not reset your working tree.

```powershell
cd E:\Projects\Asfi_blog
git status -sb
git fetch origin
git rev-list HEAD..origin/main --count
```

If behind remote, first preserve your local changes and reconcile new automated posts. Do not blindly `git pull` if dirty.

3. Dry-run (no changes):

```powershell
py -3 "E:\Projects\AsfiBlog_AllPages_Adsterra_Responsive_Patch_2026-10-14\apply_patch.py" --project "E:\Projects\Asfi_blog"
```

4. Apply:

```powershell
py -3 "E:\Projects\AsfiBlog_AllPages_Adsterra_Responsive_Patch_2026-10-14\apply_patch.py" --project "E:\Projects\Asfi_blog" --apply
```

5. Verify:

```powershell
py -3 "E:\Projects\AsfiBlog_AllPages_Adsterra_Responsive_Patch_2026-10-14\verify_patch.py" "E:\Projects\Asfi_blog"
node --check .\assets\js\main.js
node --check .\assets\js\adsterra.js
node --check .\api\ad-eligibility.js
npm test
git diff --check
git status --short
```

6. Confirm commercial-permitted hosting, then commit and push with your normal branch/preview workflow. Avoid force push; verify remote has not advanced via automation.

## Post-deploy validation

- Confirm `https://asfiblog.vercel.app/api/ad-eligibility` returns JSON such as `{ "policy": "auto" }` for permitted-country requests. If unknown/restricted it should return `{ "policy": "consent-required" }`.
- In Chrome Desktop + Mobile, on Home and short/long articles, verify one `.asfi-ad--top` and one `.asfi-ad--bottom` in Elements; both are labeled Advertisement.
- Network tab: look for `bauval.org/22/...` after page load and `bauval.org/21/...` as bottom comes into viewport.
- Test US/PK/IN country responses and UK/EEA separately. For unknown region do not claim ad delivery without user opt-in.
- Test in browser without adblock and verify ad unit approval in Adsterra dashboard. A network request is not proof of ad creative fill.

## Files modified

- `assets/js/main.js` (only replaces prior marked Adsterra setup block)
- `assets/js/adsterra.js` (new shared loader)
- `api/ad-eligibility.js` (new region guard)
- `privacy-policy.html` (revises ad notice)
- `404.html` (adds shared main.js)

Backups are saved to a sibling `Asfi_blog_adsterra_allpages_backup` folder outside the repo. No changes to 227+ articles or generator.
