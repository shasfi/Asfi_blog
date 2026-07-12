// api/send-email.js — Vercel serverless function
// Sends contact-form messages to your Gmail via Nodemailer.
// Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars.

import nodemailer from "nodemailer";

// Very small in-memory rate limiter, same pattern as chat.js
const requestLog = new Map();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 1000;

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const { name, email, message } = req.body || {};

  if (
    typeof name !== "string" || !name.trim() || name.length > 100 ||
    typeof email !== "string" || !isValidEmail(email) || email.length > 150 ||
    typeof message !== "string" || !message.trim() || message.length > 3000
  ) {
    return res.status(400).json({ error: "Please fill in a valid name, email, and message." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Asfi Blog Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Asfi Blog contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not send message, please try again later." });
  }
}