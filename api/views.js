// api/views.js
// Real-time, cross-visitor view counter backed by Vercel KV (Upstash Redis REST).
// Requires KV_REST_API_URL + KV_REST_API_TOKEN env vars (auto-added when you
// connect a Vercel KV database to this project — Vercel dashboard > Storage).
//
// GET  /api/views          -> { "some-slug": 42, "other-slug": 7, ... }  (all counts)
// POST /api/views  {slug}  -> { slug: "some-slug", views: 43 }           (increment by 1)

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const HASH_KEY = "asfiblog:views";

async function kv(command) {
  const res = await fetch(`${KV_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  if (!res.ok) throw new Error(`KV error ${res.status}`);
  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  // Allow the front-end (same origin, but keep it simple/safe) to call this.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({}); // graceful no-op until KV is connected
  }

  try {
    if (req.method === "GET") {
      const flat = await kv(["hgetall", HASH_KEY]); // [field, value, field, value, ...]
      const counts = {};
      if (Array.isArray(flat)) {
        for (let i = 0; i < flat.length; i += 2) {
          counts[flat[i]] = parseInt(flat[i + 1], 10) || 0;
        }
      }
      return res.status(200).json(counts);
    }

    if (req.method === "POST") {
      let body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch (e) { body = {}; }
      }
      const slug = (body && body.slug || "").trim();
      if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        return res.status(400).json({ error: "Invalid slug" });
      }
      const newCount = await kv(["hincrby", HASH_KEY, slug, "1"]);
      return res.status(200).json({ slug, views: newCount });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("views.js error:", err);
    return res.status(200).json({}); // fail soft — never break the page
  }
}
