// Region guard for third-party advertising. No user IP is returned to browser.
// Only an explicit country allow-list permits automatic ad requests.
// Unknown location => consent required. Legal review is still recommended.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'x-vercel-ip-country');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const country = String(req.headers['x-vercel-ip-country'] || '').toUpperCase();
  const allow = new Set(['US','PK','IN']);
  return res.status(200).json({ policy: allow.has(country) ? 'auto' : 'consent-required' });
}
