# AsfiBlog Adsterra Native + Display Patch — 14 October 2026

This patch uses the two exact Adsterra codes supplied by the publisher:
- Native Banner: https://bauval.org/21/bc9ccbb45c50d34c46c04ff7f0cf29f8 with `container-bc9ccbb45c50d34c46c04ff7f0cf29f8`
- 300 x 250 display banner: atOptions key `839c46c0eb2c23e325b33c7a671cf3bf`, https://bauval.org/22/839c46c0eb2c23e325b33c7a671cf3bf

## IMPORTANT BEFORE TURNING ON
- Vercel Hobby is for non-commercial personal projects; do not enable commercial ads there. Use a commercial-permitted hosting plan/provider first.
- Check Adsterra dashboard for the same ad script URLs and publisher IDs, and ensure the ad inventory is approved.
- The ad script is OFF by default (`window.ASFIBLOG_ADS_ENABLED = false` in `assets/js/main.js`).
- When ads are enabled, users are asked to opt in separately for ads. This simple opt-in is NOT a certified CMP. Evaluate regional privacy and consent requirements and use an appropriate consent platform/geo restriction where required.
- Do not combine these tags with popunders or misleading sponsored placements. Review third-party ad creatives and navigation behavior.

## Why this approach

The shared `assets/js/main.js` is loaded on every existing published article and on future OpenRouter auto-generated pages. That allows the patch to cover existing and future pages **without editing hundreds of HTML files or changing the publishing pipeline**.

Intended (when enabled and visitor opts in):
- Home: one Native Banner after trending section on desktop.
- Blog archive: one Native Banner after the article card grid on desktop.
- Individual 800+ word articles: one 300x250 display after the 4th paragraph.
- Individual 1300+ word articles: an additional Native Banner after the FAQ/tags on desktop.
- Sensitive or tragic headline terms: ads skipped on that article (basic conservative filter, not a complete brand safety classifier).
- Mobile native 4:1 creative is disabled until a better responsive Native layout is available; mobile articles can show the 300x250 display.
- No ads in navigation, popups, footer legal pages, or the first screen by default.

## Installation (PowerShell)

Unzip to `E:\Projects\AsfiBlog_Adsterra_Patch`. Go to your existing project:

```powershell
cd E:\Projects\Asfi_blog
git status -sb
```

If it shows pending local changes, review/commit those first; NEVER overwrite or reset your auto-generated posts.

Dry run (no files modified):

```powershell
py -3 "E:\Projects\AsfiBlog_Adsterra_Patch\apply_ads_patch.py" --project "E:\Projects\Asfi_blog"
```

Apply:

```powershell
py -3 "E:\Projects\AsfiBlog_Adsterra_Patch\apply_ads_patch.py" --project "E:\Projects\Asfi_blog" --apply
```

Run checks:

```powershell
node --check .\assets\js\adsterra.js
node --check .\assets\js\main.js
npm test
git diff --check
git status --short
```

Installer backups are saved outside the project, in the sibling folder `Asfi_blog_ads_patch_backup`. For example, `git add assets/js/main.js assets/js/adsterra.js privacy-policy.html`. Use your ordinary preview-branch -> PR -> production workflow. No changes are made to `api/generate-blog.js`, article HTML files, RSS, sitemap, `posts-data.js`, or GitHub Cron.

## Activation (ONLY after hosting/compliance confirmed)

In your installed `assets/js/main.js` find this single line:

```js
window.ASFIBLOG_ADS_ENABLED = false;
```

Change to `true`, then deploy as a new commit. Do **not** paste the Adsterra scripts into all pages separately; they are already inside `assets/js/adsterra.js`. A visitor's choice is stored under `asfiblog_adsterra_choice` and can be changed via the Privacy Policy preference button.

## Verification on commercial hosting

Visit page, reject advertising: DevTools Network must show zero requests to `bauval.org` (assuming no other vendor integration).

Allow advertising: Scroll below the article's fourth paragraph; ad request `bauval.org/22/...` should load on articles >=800 words. On desktop, scroll to the Native block to see `bauval.org/21/...`.

The ad network may return no creative due to fill rates, location, ad blocker, approval, or inventory. We have not tested live vendor delivery or earnings.

All user-visible article content, search indexing, and the Google Analytics tag remain unchanged. Publisher should still verify Web Vitals, site security, and privacy compliance after enabling ads.
