// assets/js/posts-data.js
// -----------------------------------------------------------------------
// Single source of truth for every published post. The homepage (trending
// section) and the blog listing page (categories, search, filters, grid)
// both read from window.ASFIBLOG_POSTS instead of hardcoded HTML cards.
//
// IMPORTANT: api/generate-blog.js appends a new entry here automatically
// every time it auto-publishes a post, so this file stays in sync with
// whatever is inside /blog/*.html. If you ever add a post by hand, add a
// matching entry here too (or it won't show up on home/blog listing).
//
// "views" = a baseline count. Real per-visitor growth is layered on top
// client-side (see assets/js/blog-render.js) since this is a static site
// with no database — real cross-visitor analytics would need a backend
// (e.g. Vercel KV) if that's ever wanted.
// -----------------------------------------------------------------------

window.ASFIBLOG_POSTS = [
  {
    slug: "netflix-stock-live-tv-bundles-retention-struggles",
    title: "Netflix Stock: Live TV and Bundles Explored Amid Retention Struggles",
    excerpt: "Netflix stock focus shifts as the streaming giant explores live TV and bundles to combat viewer retention struggles. What this strategic pivot means for investors.",
    category: "Business",
    image: "https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 7,
    views: 0
  },

  {
    slug: "ai-agents-replacing-apps",
    title: "AI Agents Are Quietly Replacing the Apps You Use Every Day",
    excerpt: "Booking, shopping, and scheduling are moving from taps to typed requests. Here's what's actually changing under the hood — and what it means for you.",
    category: "Technology",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2026-07-09",
    readMins: 6,
    views: 0
  },
  {
    slug: "nasdaq-rally-chip-ai-spacex-oil-gains",
    title: "Nasdaq Rally Leads Market Surge as Chip and AI Stocks Shine",
    excerpt: "Nasdaq rallies as chip and AI stocks surge, SpaceX steadies after a three-day dip, while oil climbs and market futures adjust amid geopolitical tension.",
    category: "Business",
    image: "https://images.pexels.com/photos/7947742/pexels-photo-7947742.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "measles-exposure-map-central-ios",
    title: "Measles Exposure Map Reveals High-Risk Zones in Central Iowa",
    excerpt: "A new map from KCCI identifies central Iowa locations with potential measles exposure. Learn which areas pose risks and how to protect yourself now.",
    category: "Health",
    image: "https://images.pexels.com/photos/8830479/pexels-photo-8830479.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "dairy-intake-may-slow-biological-aging-study",
    title: "Dairy Intake May Slow Biological Aging, Study Suggests",
    excerpt: "Study ties daily dairy intake to slower biological aging, with lower cellular wear markers in regular consumers. Learn what it means for health and longevity.",
    category: "Health",
    image: "https://images.pexels.com/photos/37377280/pexels-photo-37377280.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 7,
    views: 0
  },
  {
    slug: "us-home-prices-all-time-high-mortgage-rates",
    title: "US Home Prices Reach All-Time High Amid Rising Mortgage Rates",
    excerpt: "Despite higher borrowing costs and fewer sales, US home prices hit record levels. Explore the factors driving this paradox in the housing market.",
    category: "Business",
    image: "https://images.pexels.com/photos/8293714/pexels-photo-8293714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "sony-rx10-v-superzoom-4k-120p-review",
    title: "Sony RX10 V Superzoom Adds 4K 120p and New Design",
    excerpt: "Sony RX10 V superzoom arrives with new design and 4K 120p video. We break down specs, key upgrades, and if it beats the RX10 IV for photo and video creators.",
    category: "Technology",
    image: "https://images.pexels.com/photos/29531886/pexels-photo-29531886.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "four-day-work-week-2026",
    title: "Why the 4-Day Work Week Is Back in the Conversation",
    excerpt: "New pilot data is reviving the debate. Here's what's actually driving it in 2026 — and where it's stalling.",
    category: "Business",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2026-07-09",
    readMins: 5,
    views: 0
  },
  {
    slug: "plastic-eating-bacteria-breakthrough",
    title: "Scientists Found a Bacteria That Eats Plastic — Here's What That Means",
    excerpt: "A lab breakthrough is being called a possible fix for one of recycling's biggest problems. We separate the hype from the timeline.",
    category: "Science",
    image: "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2026-07-09",
    readMins: 6,
    views: 0
  },
  {
    slug: "james-webb-telescope-galaxy-mystery",
    title: "James Webb Telescope Reveals Mysteries of Galaxy 11 Million Light-Years Away",
    excerpt: "Astronomers are baffled by new James Webb Space Telescope images uncovering secrets of a distant galaxy. Discover the latest cosmic revelations here.",
    category: "Science",
    image: "https://images.pexels.com/photos/30238187/pexels-photo-30238187.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "sleep-banking-trend-explained",
    title: "\"Sleep Banking\" Is Trending — Does It Actually Work?",
    excerpt: "The idea of stockpiling rest before a big week sounds appealing. Here's what sleep science actually says about it.",
    category: "Health",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800",
    date: "2026-07-09",
    readMins: 5,
    views: 0
  },
  {
    slug: "grocery-price-war-consumer-spending-cuts-2024",
    title: "Grocery Price Wars Heat Up as Shoppers Tighten Belts",
    excerpt: "Grocery stores slash prices as consumers cut spending. Discover why retailers are racing to the bottom and how to maximize savings on your weekly shop.",
    category: "Business",
    image: "https://images.pexels.com/photos/5498233/pexels-photo-5498233.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },
  {
    slug: "ladera-ranch-children-rare-cancer-concerns",
    title: "Ladera Ranch Families Worry Over Children's Rare Cancer Cases",
    excerpt: "Families in Ladera Ranch express concern after multiple children diagnosed with rare cancer, raising questions about environmental factors and medical oversight.",
    category: "Health",
    image: "https://images.pexels.com/photos/34166164/pexels-photo-34166164.png?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  }
];
