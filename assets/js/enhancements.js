// assets/js/enhancements.js
//
// NOTE (updated): this file used to auto-inject a second breadcrumb, a
// "⏱ X min read · Category" badge, a Table of Contents, and a "Related
// posts" block on every article page using JavaScript + inline styles.
//
// All four of those are now already built directly into the static HTML
// of every post (the ".stamp" + ".timestamp" line, the ".toc" box, and the
// "#related-posts" grid, which blog-render.js fills in). Because both the
// static HTML and this script were injecting the same things, articles were
// showing duplicated reading-time/category lines, and pages could look
// slightly inconsistent since this script used ad-hoc inline styles instead
// of the site's real CSS classes.
//
// This file is now a safe no-op so nothing renders twice and every post
// page uses only the static template — meaning the same layout, spacing,
// and styling on every single blog post. It's kept in place (instead of
// removing the <script> tag from every post) so nothing needs to change in
// the individual HTML files, current or future.
(function () {
  // Intentionally does nothing. See note above.
})();