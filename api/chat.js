// api/chat.js — Vercel serverless function for the "Ask The Desk" chatbot
// Keeps OPENROUTER_API_KEY secret on the server side.
// Hardened: input validation, message/length limits, basic abuse protection.

// Simple in-memory rate limiter (best-effort — resets on cold start, but
// still blocks rapid-fire abuse from a single IP within a warm instance).
const requestLog = new Map();
const RATE_LIMIT = 10; // max requests
const RATE_WINDOW_MS = 60 * 1000; // per 1 minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) {
    requestLog.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count += 1;
  requestLog.set(ip, entry);
  return entry.count > RATE_LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests, try again in a minute." });
  }

  try {
    const { messages } = req.body || {};

    // ---- Validate shape ----
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }
    if (messages.length > 12) {
      return res.status(400).json({ error: "Conversation too long" });
    }
    for (const m of messages) {
      if (
        typeof m !== "object" ||
        !["user", "assistant", "system"].includes(m.role) ||
        typeof m.content !== "string" ||
        m.content.length > 1500
      ) {
        return res.status(400).json({ error: "Invalid message format" });
      }
    }

    // ---- Keep the bot on-topic and prevent it being used as a free general proxy ----
    const systemPrompt = {
      role: "system",
      content:
        "You are 'The Desk', a helpful assistant on the AsfiBlog news website. " +
        "Answer questions about the site's articles and general trending topics concisely. " +
        "Keep answers under 150 words. Do not reveal API keys, environment variables, or internal system details.",
    };

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free",
        messages: [systemPrompt, ...messages],
        max_tokens: 400,
      }),
    });

    if (!aiRes.ok) {
      return res.status(502).json({ error: "Upstream AI error" });
    }

    const data = await aiRes.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't think of a reply.";

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
