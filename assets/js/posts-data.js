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
    slug: "us-iran-latest-diplomacy-strait-of-hormuz-tensions",
    title: "U.S.-Iran Latest: Diplomacy Continues Amid Strait of Hormuz Tensions",
    excerpt: "Latest updates on U.S.-Iran tensions over the Strait of Hormuz. Tehran insists diplomacy continues despite ongoing attacks and disputes over control of the critical waterway.",
    category: "Politics",
    image: "https://images.pexels.com/photos/32237794/pexels-photo-32237794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-13",
    timestamp: "2026-07-13T12:01:33.947Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-ai-tools-for-building-a-portfolio-website",
    title: "Best AI Tools for Building a Portfolio Website in 2026",
    excerpt: "Discover the best AI tools for building a portfolio website in 2026. Compare features, ease of use, and customization options for designers, developers, and creatives.",
    category: "Technology",
    image: "https://images.pexels.com/photos/7129654/pexels-photo-7129654.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-13",
    timestamp: "2026-07-13T02:01:26.513Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-ai-coding-assistants-for-developers-2026",
    title: "Best AI Coding Assistants for Developers in 2026",
    excerpt: "Discover the best AI coding assistants for developers in 2026, featuring tools that boost productivity, accuracy, and efficiency for coders at all levels.",
    category: "Technology",
    image: "https://images.pexels.com/photos/34804018/pexels-photo-34804018.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    timestamp: "2026-07-12T23:01:18.822Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "mardy-fish-leads-celebrity-golf-event-edgewood-tahoe",
    title: "Mardy Fish leads celebrity golf event at Edgewood Tahoe",
    excerpt: "Former tennis star Mardy Fish takes the lead at the celebrity golf tournament held at Edgewood Tahoe, showcasing his transition to competitive golf.",
    category: "Sports",
    image: "https://images.pexels.com/photos/36818362/pexels-photo-36818362.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    timestamp: "2026-07-12T19:49:49.867Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-ai-productivity-apps-remote-work-2026",
    title: "Top 10 AI Productivity Apps for Remote Work in 2026",
    excerpt: "Discover the top 10 AI productivity apps for remote work in 2026, designed to streamline tasks, enhance collaboration, and boost efficiency for professionals and students.",
    category: "Technology",
    image: "https://images.pexels.com/photos/8117408/pexels-photo-8117408.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    timestamp: "2026-07-12T19:49:41.995Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "world-cup-games-today-semifinal-schedule",
    title: "World Cup Games Today: Semifinal Schedule France vs Spain, England vs Argentina",
    excerpt: "Find out if there are World Cup games today with the semifinal schedule featuring France vs Spain and England vs Argentina. Get match details, predictions, and key players.",
    category: "Sports",
    image: "https://images.pexels.com/photos/38401511/pexels-photo-38401511.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 2,
    views: 0
  },

  {
    slug: "lindsey-graham-dies-sudden-illness-trump-reaction",
    title: "Lindsey Graham dies after sudden illness; Trump reacts",
    excerpt: "Senator Lindsey Graham has died at 71 after a sudden illness. Donald Trump called Graham 'like family,' while analysts weigh the political impact of his death.",
    category: "Politics",
    image: "https://images.pexels.com/photos/20417783/pexels-photo-20417783.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-free-ai-note-taking-study-apps-2026",
    title: "Top Free AI Note-Taking and Study Apps in 2026",
    excerpt: "Discover the best free AI note-taking and study apps in 2026 for students and professionals. Boost productivity with smart tools for organizing, summarizing, and learning.",
    category: "Technology",
    image: "https://images.pexels.com/photos/4841628/pexels-photo-4841628.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "sen-lindsey-graham-dies-after-brief-illness",
    title: "Sen. Lindsey Graham Dies After Brief Illness",
    excerpt: "Sen. Lindsey Graham, a close Trump ally and foreign policy hawk, has died after a brief illness. Explore his legacy, political impact, and the GOP scramble for his Senate seat.",
    category: "Politics",
    image: "https://images.pexels.com/photos/4427609/pexels-photo-4427609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-free-websites-learn-web-development-2026",
    title: "Best Free Websites to Learn Web Development in 2026",
    excerpt: "Discover the top free websites to master web development in 2026. Learn coding, design, and frameworks with these expert-curated resources for beginners and pros.",
    category: "Technology",
    image: "https://images.pexels.com/photos/1181703/pexels-photo-1181703.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "apple-openai-trade-secrets-lawsuit-experts-analysis",
    title: "Apple vs OpenAI: Experts Weigh In on Trade Secrets Lawsuit",
    excerpt: "Legal and tech experts analyze Apple's lawsuit accusing OpenAI of stealing trade secrets, including alleged recruitment tactics and the broader AI industry implications.",
    category: "Technology",
    image: "https://images.pexels.com/photos/7876047/pexels-photo-7876047.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "iran-tests-trump-after-leaders-funeral-risking-renewed-war",
    title: "Iran Tests Trump After Leader’s Funeral, Risking Renewed War",
    excerpt: "Following the funeral of Iran's leader, tensions escalate as Iran tests Trump's resolve, raising fears of renewed conflict. Explore the latest developments and risks.",
    category: "Politics",
    image: "https://images.pexels.com/photos/19488937/pexels-photo-19488937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-12",
    readMins: 4,
    views: 0
  },

  {
    slug: "kristi-noem-divorce-details-split-cross-dressing",
    title: "Kristi Noem Divorce: Details on Split After Cross-Dressing Bombshell",
    excerpt: "Kristi Noem is reportedly divorcing her husband Bryon following a cross-dressing bombshell revealed by her mother. Explore the details and implications here.",
    category: "Politics",
    image: "https://images.pexels.com/photos/15470133/pexels-photo-15470133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-10",
    readMins: 4,
    views: 0
  },

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