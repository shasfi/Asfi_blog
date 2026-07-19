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
    slug: "us-iran-trade-strikes-tensions-escalate",
    title: "US and Iran trade strikes as tensions escalate over troop deaths",
    excerpt: "The US and Iran have exchanged military strikes after American troops were killed, escalating tensions in the Middle East. Read the latest on the conflict.",
    category: "Politics",
    image: "https://images.pexels.com/photos/33610644/pexels-photo-33610644.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-19",
    timestamp: "2026-07-19T23:00:55.918Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "jonas-vingegaard-crashes-out-of-tour-de-france",
    title: "Jonas Vingegaard Crashes Out of Tour de France: What Happened",
    excerpt: "Jonas Vingegaard crashes out of Tour de France after a Stage 15 fall. Learn the details of the incident, its impact on the race, and what’s next for the Danish cyclist.",
    category: "Sports",
    image: "https://images.pexels.com/photos/18823753/pexels-photo-18823753.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-19",
    timestamp: "2026-07-19T17:04:52.201Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "sam-burns-wife-caroline-open-championship",
    title: "Sam Burns Wife Caroline: Meet the Woman Behind His Open Championship Run",
    excerpt: "Sam Burns' wife Caroline has been a key supporter in his golf career. Learn about their relationship and her role in his Open Championship performance at Birkdale.",
    category: "Sports",
    image: "https://images.pexels.com/photos/6230144/pexels-photo-6230144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-19",
    timestamp: "2026-07-19T12:01:05.987Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "amber-alert-washington-search-for-abducted-4-year-old",
    title: "AMBER Alert Washington: Search for Abducted 4-Year-Old",
    excerpt: "An AMBER Alert has been issued in Washington for a 4-year-old girl abducted in Kennewick. Learn the details and how to assist in the search.",
    category: "General",
    image: "https://images.pexels.com/photos/33645588/pexels-photo-33645588.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-19",
    timestamp: "2026-07-19T02:00:53.447Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "lebron-james-praises-caitlin-clark-wnba-record",
    title: "LeBron James praises Caitlin Clark after historic 45-point WNBA game",
    excerpt: "LeBron James applauded Caitlin Clark on Instagram after her record-breaking 45-point, 10-assist performance for the Indiana Fever, marking a historic WNBA milestone.",
    category: "Sports",
    image: "https://images.pexels.com/photos/30049751/pexels-photo-30049751.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-18",
    timestamp: "2026-07-18T23:00:57.672Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "evan-blass-leak-samsung-z-fold8-galaxy-watch9-specs",
    title: "Evan Blass Leak Reveals Samsung Z Fold8, Z Fold8 Ultra and Galaxy Watch9 Specs",
    excerpt: "New leaks by Evan Blass confirm Samsung Z Fold8, Z Fold8 Ultra, and Galaxy Watch9 specs ahead of Galaxy Unpacked. Details on design, display tech, and expected features.",
    category: "Technology",
    image: "https://images.pexels.com/photos/19281807/pexels-photo-19281807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-18",
    timestamp: "2026-07-18T17:00:52.430Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "sacramento-county-woman-identified-deadly-boat-incident",
    title: "Sacramento County woman identified in deadly San Francisco Bay boat incident",
    excerpt: "A Sacramento County woman has been identified as the second victim in the deadly San Francisco Bay boat sinking that claimed four lives. Authorities continue search efforts.",
    category: "General",
    image: "https://images.pexels.com/photos/17206206/pexels-photo-17206206.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-18",
    timestamp: "2026-07-18T12:00:58.482Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "fever-score-caitlin-clark-wnba-history-200-3-pointers",
    title: "Fever Score: Caitlin Clark Makes WNBA History with 200 3-Pointers",
    excerpt: "Caitlin Clark sets a WNBA record for fastest to 200 career 3-pointers, redefining the Fever score in women's basketball. Learn how she's changing the game.",
    category: "Sports",
    image: "https://images.pexels.com/photos/14060661/pexels-photo-14060661.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-18",
    timestamp: "2026-07-18T02:01:00.831Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "nba-summer-league-scouting-report-top-rookies",
    title: "NBA Summer League Scouting Report: Top Rookies Show Star Potential",
    excerpt: "Discover how the top rookies in the NBA Summer League are already showcasing stardom-bound potential. Insights and analysis on standout performances and future stars.",
    category: "Sports",
    image: "https://images.pexels.com/photos/32348571/pexels-photo-32348571.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-17",
    timestamp: "2026-07-17T23:01:01.890Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-vs-code-extensions-developers-need-2026",
    title: "Top 10 VS Code Extensions Developers Need in 2026",
    excerpt: "Discover the top 10 VS Code extensions every developer should use in 2026 for productivity, debugging, and seamless coding. Essential tools for any tech stack.",
    category: "Technology",
    image: "https://images.pexels.com/photos/12902862/pexels-photo-12902862.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-17",
    timestamp: "2026-07-17T17:01:05.675Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "royal-birkdale-course-record-history-and-key-facts",
    title: "Royal Birkdale Course Record: History and Key Facts",
    excerpt: "The Royal Birkdale course record is held by a professional golfer who shot a historic low round. Learn about the record, its significance, and past champions.",
    category: "Sports",
    image: "https://images.pexels.com/photos/19333442/pexels-photo-19333442.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-17",
    timestamp: "2026-07-17T12:00:59.660Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "nfc-west-training-camp-2026-preview",
    title: "NFC West Training Camp 2026 Preview: Key Storylines",
    excerpt: "Previewing the top NFC West training camp storylines for 2026, including updates on the 49ers, Cardinals, Rams, and Seahawks as they prepare for the NFL season.",
    category: "Sports",
    image: "https://images.pexels.com/photos/3102323/pexels-photo-3102323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-17",
    timestamp: "2026-07-17T02:01:01.700Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-ai-resume-cover-letter-builders-2026",
    title: "Best AI Resume and Cover Letter Builders in 2026",
    excerpt: "Discover the best AI resume and cover letter builders in 2026 for students and professionals. Compare features, usability, and standout tools for job applications.",
    category: "Technology",
    image: "https://images.pexels.com/photos/270238/pexels-photo-270238.png?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T23:02:18.626Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-ai-chatbots-compared-2026",
    title: "Top AI Chatbots Compared for 2026: Best Picks",
    excerpt: "Explore the top AI chatbots for 2026, comparing features, use cases, and standout capabilities to help you choose the best tool for productivity and tech needs.",
    category: "Technology",
    image: "https://images.pexels.com/photos/30530412/pexels-photo-30530412.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T23:01:05.545Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ontario-seeks-federal-aid-wildfires-evacuations",
    title: "Ontario seeks federal aid as wildfires force evacuations",
    excerpt: "Ontario requests federal support for evacuations amid devastating wildfires in remote towns. Officials warn of worsening conditions as blazes continue to spread.",
    category: "General",
    image: "https://images.pexels.com/photos/33622178/pexels-photo-33622178.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T21:36:37.447Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "sony-playstation-all-digital-backlash-lawsuits",
    title: "Sony faces backlash and lawsuits over PlayStation's all-digital future",
    excerpt: "Sony faces growing backlash and legal challenges over PlayStation's shift to an all-digital future, with lawsuits and antitrust complaints mounting worldwide.",
    category: "Technology",
    image: "https://images.pexels.com/photos/9409819/pexels-photo-9409819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T17:00:57.848Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "dylan-edwards-ku-football-offense",
    title: "Dylan Edwards to bring new dimension to KU football offense",
    excerpt: "Dylan Edwards, the dynamic running back, is set to add a new dimension to KU football's offense this season. Learn how his skills could transform the team's playbook.",
    category: "Sports",
    image: "https://images.pexels.com/photos/163449/american-football-football-match-sport-team-163449.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T12:01:53.543Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "pakistan-resists-uk-deportation-grooming-gang-leader",
    title: "Pakistan resists UK deportation of grooming gang leader",
    excerpt: "Pakistan refuses UK attempts to deport Shabir Ahmed, leader of a grooming gang, amid legal and diplomatic tensions. Learn the latest on this high-profile case.",
    category: "Politics",
    image: "https://images.pexels.com/photos/37730955/pexels-photo-37730955.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T12:01:16.456Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "donald-trump-endorses-mike-lindell-minnesota-governor",
    title: "President Donald Trump Endorses Mike Lindell for Minnesota Governor",
    excerpt: "President Donald Trump has endorsed Mike Lindell, founder of MyPillow, for Minnesota governor. Learn what this means for the election and Lindell's political ambitions.",
    category: "Politics",
    image: "https://images.pexels.com/photos/8850874/pexels-photo-8850874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-16",
    timestamp: "2026-07-16T02:01:25.965Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "astros-trade-lance-mccullers-jr-to-brewers",
    title: "Astros Trade Fan Favorite Lance McCullers Jr. to Brewers",
    excerpt: "The Houston Astros are reportedly trading fan favorite Lance McCullers Jr. and Colton Gordon to the Milwaukee Brewers for pitching depth and prospect Jadyn Fielder.",
    category: "Sports",
    image: "https://images.pexels.com/photos/36780551/pexels-photo-36780551.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-15",
    timestamp: "2026-07-15T23:01:16.534Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-10-free-ai-image-generators-2026",
    title: "Top 10 Free AI Image Generators in 2026",
    excerpt: "Discover the top 10 free AI image generators in 2026 for students and creators. Compare features, quality, and ease of use to find the best tool for your needs.",
    category: "Technology",
    image: "https://images.pexels.com/photos/18069856/pexels-photo-18069856.png?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-15",
    timestamp: "2026-07-15T17:01:24.706Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "wildfire-smoke-canada-spread-midwest-east",
    title: "Wildfire Smoke from Canada to Spread Across Midwest and East",
    excerpt: "Wildfire smoke from Canada is expected to spread across the Midwest and East, posing health risks and reducing air quality. Learn how to stay safe and track updates.",
    category: "Health",
    image: "https://images.pexels.com/photos/12027855/pexels-photo-12027855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-15",
    timestamp: "2026-07-15T12:01:17.485Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "odyssey-movie-imax-70mm-tickets-frenzy",
    title: "Odyssey Movie Sparks Frenzy for IMAX 70mm Tickets",
    excerpt: "The Odyssey movie has ignited a surge in demand for IMAX 70mm tickets, as film enthusiasts rush to experience its epic visuals in the highest-quality format available.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/31308374/pexels-photo-31308374.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-15",
    timestamp: "2026-07-15T02:01:12.282Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "kilmarnock-fc-vs-raith-rovers-standings-league-cup",
    title: "Kilmarnock FC vs Raith Rovers standings and League Cup updates",
    excerpt: "Latest Kilmarnock FC vs Raith Rovers standings, Scottish League Cup score updates, and key match stats. Analysis of team form, head-to-head records, and tournament implications.",
    category: "Sports",
    image: "https://images.pexels.com/photos/32190714/pexels-photo-32190714.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-14",
    timestamp: "2026-07-14T23:01:13.764Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ranking-field-154th-open-royal-birkdale",
    title: "Ranking the Field for the 154th Open at Royal Birkdale",
    excerpt: "Discover the full list of 156 players competing in the 154th Open at Royal Birkdale. Get insights into rankings, conditions, and key contenders in this historic golf championship.",
    category: "Sports",
    image: "https://images.pexels.com/photos/8796519/pexels-photo-8796519.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-14",
    timestamp: "2026-07-14T17:01:32.958Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-10-free-ai-tools-for-students-2026",
    title: "Top 10 Free AI Tools for Students in 2026",
    excerpt: "Discover the top 10 free AI tools for students in 2026, from note-taking to coding assistance. Boost productivity with these powerful, no-cost resources.",
    category: "Technology",
    image: "https://images.pexels.com/photos/7972331/pexels-photo-7972331.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-14",
    timestamp: "2026-07-14T12:01:25.289Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "inside-israels-secret-operation-ahmadinejad",
    title: "Inside Israel’s Secret Operation to Install Ahmadinejad",
    excerpt: "Explore Israel's covert operation to position Ahmadinejad, Iran's former president, as a leader amidst geopolitical tensions and intrigue.",
    category: "Politics",
    image: "https://images.pexels.com/photos/19488937/pexels-photo-19488937.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-14",
    timestamp: "2026-07-14T02:01:05.766Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "mejores-peliculas-netflix-estrenos-clasicos-argentina",
    title: "Mejores películas Netflix: estrenos y clásicos para ver ahora",
    excerpt: "Descubre las mejores películas en Netflix esta semana, incluyendo estrenos en Argentina y clásicos imperdibles. Actualizado con las novedades del 13 al 19 de julio.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/9807998/pexels-photo-9807998.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-13",
    timestamp: "2026-07-13T23:01:16.027Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "uk-counter-terror-police-ann-widdecombe-murder",
    title: "UK counter-terror police investigate Ann Widdecombe murder",
    excerpt: "UK counter-terrorism police lead the investigation into the suspected murder of former lawmaker Ann Widdecombe. A 28-year-old man has been arrested.",
    category: "Politics",
    image: "https://images.pexels.com/photos/10464479/pexels-photo-10464479.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-13",
    timestamp: "2026-07-13T17:01:14.997Z",
    readMins: 4,
    views: 0
  },

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