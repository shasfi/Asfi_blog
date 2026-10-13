# AsfiBlog Social Trend Discovery — Official API setup

This patch retains BOTH Musk–Ambani articles and prior news editorial logic. It ALSO adds optional real measured YouTube popularity and an **authorized, JSON social signal feed**. It does NOT scrape TikTok or Instagram or fake their reach.

## No API keys added yet
Without `YOUTUBE_API_KEY` and `SOCIAL_SIGNAL_FEED_URL`, the original Google News/Google Trends pipeline runs as before.

## YouTube US popular videos
1. In Google Cloud Console create/select a project.
2. Enable **YouTube Data API v3**.
3. In Credentials create an API key and restrict it to YouTube Data API v3.
4. Add `YOUTUBE_API_KEY` in Vercel Project -> Settings -> Environment Variables, for Production. Never place key in GitHub source files.
5. Redeploy the site so environment changes take effect.

Code calls official YouTube `videos.list` with `chart=mostPopular`, `regionCode=US`, three categories plus general. It collects video title, video URL, publish timestamp, and real video `viewCount`, only videos posted within 96 hours. This is **video reach, not article-search volume**. Up to 4 API requests per publishing run. Errors are ignored so posting doesn't depend on YouTube uptime.

## TikTok and Instagram
- TikTok Creative Center US Trends is manually viewable, with region-specific top hashtags, view and post counts. TikTok Research Tools are intended for eligible research organizations, not generally available to a commercial news blog.
- Instagram official hashtag search has Business/Creator account prerequisites and limits. It is not a blanket 'most viral stories' public endpoint.
- The site therefore does **not** directly monitor all TikTok/Instagram posts. If you have a properly licensed data provider that offers an HTTPS JSON API, configure `SOCIAL_SIGNAL_FEED_URL` and optionally `SOCIAL_SIGNAL_FEED_TOKEN`. Do not connect unlawful scraping providers.
- Expected JSON is `{ "signals": [{ "platform": "tiktok", "title": "The topic being discussed", "url": "https://www.tiktok.com/...", "observedAt": "2026-10-14T09:00:00Z", "views": 120000, "summary": "Optional editorial context" }] }`. Platforms: `tiktok`, `instagram`, `youtube`, `x`, `threads`, `facebook`. Data older than 48h is discarded.
- Only **social ranking signals** are consumed. The publisher still requires matching independent news references before automatically publishing; the original quote/situation must be fact-checked.

## What to test
`npm test` should pass the earlier 7 tests plus the new social signals suite. Vercel Cron logs should include `Discovery: fresh US YouTube/authorized social signals:` after setting keys. An empty or missing source must not disable Google Trends+News. Do not log API keys.

The ranking score is heuristic, and no script can predict all future viral events. Keyword-volume research and editorial review remain separate.

Sources: https://developers.google.com/youtube/v3/docs/videos/list, https://developers.tiktok.com/docs/en/about-research-api, https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/hashtag-search
