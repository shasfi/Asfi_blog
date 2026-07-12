// update-existing-posts.js
// ---------------------------------------------------------------
// Retrofits ALL existing blog/*.html posts with:
//   1. Heading ids (h2/h3) + an auto-built Table of Contents
//   2. Missing SEO meta tags (author, og:site_name, twitter:image,
//      article:tag per tag, robots max-image-preview, keywords fallback)
//   3. Clean-up of stray "--", "@", "#" symbols in visible text
//
// This does NOT touch new posts created by api/generate-blog.js —
// that pipeline already outputs all of this automatically going forward.
// This script is only for the posts that already existed before that
// pipeline was updated.
//
// SAFE TO RE-RUN: every step checks "is this already there?" first,
// so running it twice will never create duplicate TOCs or duplicate tags.
//
// USAGE:
//   node update-existing-posts.js
// (run from the project root — the folder that contains "blog/")
// ---------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const BLOG_DIR = path.join(__dirname, "blog");

function sanitizeSymbols(str) {
  if (!str) return str;
  return String(str)
    .replace(/-{2,}/g, "—")
    .replace(/(^|\s)#{1,6}\s*/g, "$1")
    .replace(/(^|\s)@(\S+)/g, "$1$2")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function sanitizeHtmlBlock(html) {
  if (!html) return html;
  return html.replace(/>([^<]+)</g, (m, text) => {
    if (text.trim() === "") return m; // leave pure whitespace/newlines alone
    return `>${sanitizeSymbols(text)}<`;
  });
}

function buildHeadingsAndToc(contentHtml) {
  const usedIds = new Set();
  const tocItems = [];

  const withIds = contentHtml.replace(/<h([23])(?![^>]*\bid=)([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const plain = inner.replace(/<[^>]+>/g, "").trim();
    let base =
      plain
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 60) || `section-${tocItems.length + 1}`;
    let id = base;
    let n = 2;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    tocItems.push({ level: Number(level), text: plain, id });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  // Also register any headings that ALREADY have an id (so re-runs don't
  // duplicate a TOC entry or drop already-tagged headings).
  const alreadyIdRe = /<h([23])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m;
  const seenIds = new Set(tocItems.map((t) => t.id));
  const merged = [];
  const combinedRe = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let match2;
  while ((match2 = combinedRe.exec(withIds)) !== null) {
    const idMatch = match2[2].match(/\bid="([^"]+)"/);
    if (!idMatch) continue;
    const plain = match2[3].replace(/<[^>]+>/g, "").trim();
    merged.push({ level: Number(match2[1]), text: plain, id: idMatch[1] });
  }

  let tocHtml = "";
  if (merged.length > 1) {
    const items = merged
      .map(
        (t) =>
          `<li${t.level === 3 ? ' style="margin-left:16px; list-style:circle;"' : ""}><a href="#${t.id}">${t.text}</a></li>`
      )
      .join("\n        ");
    tocHtml = `<nav class="toc" aria-label="Table of contents">
      <p class="toc-title">In this article</p>
      <ol>
        ${items}
      </ol>
    </nav>`;
  }
  return { html: withIds, tocHtml, headings: merged };
}

function extractTag(html, name) {
  const re = new RegExp(`<meta[^>]*property=["']${name}["'][^>]*>`, "i");
  return html.match(re);
}
function extractNameTag(html, name) {
  const re = new RegExp(`<meta[^>]*name=["']${name}["'][^>]*>`, "i");
  return html.match(re);
}

function addMissingSeoTags(html) {
  let out = html;

  // author
  if (!extractNameTag(out, "author")) {
    out = out.replace(/(<meta name="keywords"[^>]*>\n?)/i, `$1<meta name="author" content="Sheikh Asfi" />\n`);
  }

  // og:site_name
  if (!extractTag(out, "og:site_name")) {
    out = out.replace(/(<meta property="og:url"[^>]*>\n?)/i, `$1<meta property="og:site_name" content="Asfi Blog" />\n`);
  }

  // twitter:image (mirror og:image if present)
  if (!extractNameTag(out, "twitter:image")) {
    const ogImage = out.match(/<meta property="og:image" content="([^"]*)"/i);
    if (ogImage) {
      out = out.replace(
        /(<meta name="twitter:description"[^>]*>\n?)/i,
        `$1<meta name="twitter:image" content="${ogImage[1]}" />\n`
      );
    }
  }

  // robots max-image-preview
  out = out.replace(
    /<meta name="robots" content="index, follow"\s*\/?>/i,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`
  );

  // article:tag meta per existing keyword tag (if not already present)
  if (!/<meta property="article:tag"/i.test(out)) {
    const keywordsMatch = out.match(/<meta name="keywords" content="([^"]*)"/i);
    if (keywordsMatch && keywordsMatch[1]) {
      const tags = keywordsMatch[1].split(",").map((t) => t.trim()).filter(Boolean);
      const tagMeta = tags.map((t) => `<meta property="article:tag" content="${t}" />`).join("\n");
      out = out.replace(/(<meta property="article:section"[^>]*>\n?)/i, `$1${tagMeta}\n`);
    }
  }

  return out;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf-8");
  let html = original;

  // 1. Sanitize stray --, @, # in visible text only (never inside tags/attrs)
  html = sanitizeHtmlBlock(html);

  // 2. Add heading ids + TOC (only inside the .content block, only if no TOC yet)
  const alreadyHasToc = /<nav class="toc"/i.test(html);
  const contentMatch = html.match(/(<div class="content">\n?)([\s\S]*?)(\n?\s*<\/div>\s*\n\s*<div class="tags">)/);

  if (!alreadyHasToc && contentMatch) {
    const { html: contentWithIds, tocHtml } = buildHeadingsAndToc(contentMatch[2]);
    const rebuiltContentBlock = `${contentMatch[1]}${contentWithIds}${contentMatch[3]}`;
    html = html.replace(contentMatch[0], rebuiltContentBlock);

    if (tocHtml) {
      // Insert the TOC right before the content div (after hero image if present)
      html = html.replace(/(<div class="content">)/, `${tocHtml}\n    $1`);
    }
  }

  // 3. Add any missing SEO meta tags
  html = addMissingSeoTags(html);

  if (html !== original) {
    fs.writeFileSync(filePath, html, "utf-8");
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error("Could not find blog/ folder next to this script.");
    process.exit(1);
  }
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".html") && f !== "index.html");

  let changed = 0;
  for (const f of files) {
    const full = path.join(BLOG_DIR, f);
    const didChange = processFile(full);
    console.log(`${didChange ? "UPDATED" : "no change needed"}: ${f}`);
    if (didChange) changed++;
  }
  console.log(`\nDone. ${changed}/${files.length} post(s) updated.`);
}

main();