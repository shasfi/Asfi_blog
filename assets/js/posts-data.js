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
    slug: "nepal-flash-floods-live-updates-hundreds-dead-thousands-missing",
    title: "Nepal Flash Floods Live Updates: Hundreds Dead, 1,000+ Missing",
    excerpt: "Nepal flash floods have claimed hundreds of lives with over 1,000 missing. Get the latest updates on casualties, rescue efforts, and expert analysis of the disaster.",
    category: "General",
    image: "https://images.pexels.com/photos/32782556/pexels-photo-32782556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-27",
    timestamp: "2026-08-27T17:48:47.348Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "tech-companies-ndas-data-center-talks",
    title: "Tech Companies Use NDAs for Data Center Talks",
    excerpt: "Tech companies and local officials are covering data center talks in NDAs, heavily restricting public transparency. Discover why this practice raises alarms.",
    category: "Business",
    image: "https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-27",
    timestamp: "2026-08-27T12:00:51.638Z",
    readMins: 10,
    views: 0
  },

  {
    slug: "nathan-grima-afl-surgery-nightmare",
    title: "Nathan Grima: AFL Star's Surgery Nightmare Story",
    excerpt: "Nathan Grima, former AFL player, faced a near-death ordeal after what was meant to be minor surgery. Here is what we know about his recovery and the warning signs.",
    category: "Sports",
    image: "https://images.pexels.com/photos/6129152/pexels-photo-6129152.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-27",
    timestamp: "2026-08-27T02:05:09.496Z",
    readMins: 8,
    views: 0
  },

  {
    slug: "alex-apodaca-bella-mir-dana-white-contender-series-upset",
    title: "Alex Apodaca Stuns Bella Mir on Dana White Contender Series",
    excerpt: "Alex Apodaca reacts to his massive upset win over Bella Mir on Dana White's Contender Series, calling the victory 'sick' as he earns a UFC deal.",
    category: "Sports",
    image: "https://images.pexels.com/photos/5424764/pexels-photo-5424764.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-27",
    timestamp: "2026-08-27T02:01:05.096Z",
    readMins: 7,
    views: 0
  },

  {
    slug: "sec-punishments-coaches-sign-nfl-players",
    title: "SEC Punishes Coaches Who Sign NFL Players: New Rule Explained",
    excerpt: "SEC reportedly settles on punishments for programs and head coaches who decide to sign NFL players. Here is what the new rule means and who it affects.",
    category: "Sports",
    image: "https://images.pexels.com/photos/15338948/pexels-photo-15338948.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-26",
    timestamp: "2026-08-26T23:01:14.060Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "draftkings-odds-phillies-mlb-betting-tips",
    title: "DraftKings Odds: Phillies Win Trends and MLB Betting Tips",
    excerpt: "DraftKings odds highlight the Phillies' continued success. Get MLB betting tips for Monday and analyze Philadelphia's winning streak.",
    category: "Sports",
    image: "https://images.pexels.com/photos/7594232/pexels-photo-7594232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-26",
    timestamp: "2026-08-26T17:01:21.923Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "fire-vs-wings-odds-dallas-hosts-portland-in-wnba-clash",
    title: "Fire vs Wings Odds: Dallas Hosts Portland in WNBA Clash",
    excerpt: "Fire vs Wings odds preview: Dallas Wings host Portland Fire in a key WNBA matchup. Get betting lines, analysis, and what to expect.",
    category: "Sports",
    image: "https://images.pexels.com/photos/27866609/pexels-photo-27866609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-25",
    timestamp: "2026-08-25T23:34:13.024Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "ship-disabled-attack-strait-hormuz-middle-east",
    title: "Ship Disabled by Attack in Strait of Hormuz: Latest Updates",
    excerpt: "A ship was disabled in a Strait of Hormuz attack amid rising regional tensions. Get the latest updates on maritime incidents and Middle East developments.",
    category: "Politics",
    image: "https://images.pexels.com/photos/32237794/pexels-photo-32237794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-25",
    timestamp: "2026-08-25T17:01:27.034Z",
    readMins: 7,
    views: 0
  },

  {
    slug: "browns-name-deshaun-watson-starting-qb-over-shedeur-sanders",
    title: "Browns Name Deshaun Watson Starting QB Over Shedeur Sanders",
    excerpt: "Browns name Deshaun Watson starting quarterback over Shedeur Sanders. Get the full breakdown of the decision, coach comments, and what it means for Cleveland.",
    category: "Sports",
    image: "https://images.pexels.com/photos/33920564/pexels-photo-33920564.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-25",
    timestamp: "2026-08-25T12:45:59.053Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "enes-kanter-freedom-ejected-sky-fever-game",
    title: "Enes Kanter Freedom Ejected in Sky vs Fever Game",
    excerpt: "Former NBA player Enes Kanter Freedom was ejected during a Sky vs Fever game after a heated confrontation with Chicago's Natasha Cloud.",
    category: "Sports",
    image: "https://images.pexels.com/photos/5274999/pexels-photo-5274999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-24",
    timestamp: "2026-08-24T17:01:00.864Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "iphone-18-pro-release-schedule-what-to-expect-when",
    title: "iPhone 18 Pro Release Schedule: What To Expect When",
    excerpt: "Get the latest iPhone 18 Pro release schedule and timeline. Find out when to expect the announcement, pre-orders, and availability based on recent leaks and industry trends.",
    category: "Technology",
    image: "https://images.pexels.com/photos/7537255/pexels-photo-7537255.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-24",
    timestamp: "2026-08-24T02:20:48.773Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "grand-theft-auto-vi-leak-escalates-without-resolution",
    title: "Grand Theft Auto VI Leak Escalates Without Resolution",
    excerpt: "The Grand Theft Auto VI leak continues to spread unchecked, with new gameplay and map details emerging despite efforts by Take-Two to contain the breach.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/34482313/pexels-photo-34482313.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-22",
    timestamp: "2026-08-22T12:23:36.521Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "pentagon-fires-stars-and-stripes-leaders",
    title: "Pentagon Fires Stars and Stripes Leaders Over Criticism",
    excerpt: "Pentagon fires Stars and Stripes leaders who criticized DOD interference, raising concerns over press freedom and editorial independence.",
    category: "Politics",
    image: "https://images.pexels.com/photos/33738318/pexels-photo-33738318.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-22",
    timestamp: "2026-08-22T02:11:16.519Z",
    readMins: 7,
    views: 0
  },

  {
    slug: "dutch-gp-ending-zandvoort-f1",
    title: "Dutch GP Ending: Why Zandvoort Race is Concluding Despite F1 Support",
    excerpt: "The Dutch GP is ending despite F1 wanting Zandvoort to stay. Discover the key factors behind this decision and what it means for the future of Formula 1.",
    category: "Sports",
    image: "https://images.pexels.com/photos/28680795/pexels-photo-28680795.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-21",
    timestamp: "2026-08-21T12:01:00.505Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "falcons-colts-joint-practices-day-1",
    title: "Falcons-Colts Joint Practices Day 1: Key Takeaways",
    excerpt: "Everything you need to know from Day 1 of Falcons-Colts joint practices, including standout performances and what to expect next.",
    category: "Sports",
    image: "https://images.pexels.com/photos/30612723/pexels-photo-30612723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-20",
    timestamp: "2026-08-20T12:09:08.452Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "fc-dallas-real-salt-lake-lineup",
    title: "fc dallas - real salt lake lineup",
    excerpt: "fc dallas vs real salt lake lineup preview offers insight into both teams’ tactical plans and key player rotations ahead of their upcoming clash.",
    category: "Sports",
    image: "https://images.pexels.com/photos/1657324/pexels-photo-1657324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-20",
    timestamp: "2026-08-20T02:01:11.096Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "israeli-military-probes-hind-rajab-killing",
    title: "Israeli Military Probes Hind Rajab Killing",
    excerpt: "Israeli military launches criminal probes into the killings of Hind Rajab and Palestinian paramedics, raising fresh concerns over accountability and conduct in Gaza.",
    category: "Politics",
    image: "https://images.pexels.com/photos/6069240/pexels-photo-6069240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-19",
    timestamp: "2026-08-19T23:01:04.938Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "us-tourist-dies-after-lightning-strike-on-mount-etna",
    title: "US Tourist Dies After Lightning Strike on Mount Etna",
    excerpt: "A US tourist died after being struck by lightning while hiking Sicily’s Mount Etna. Learn about the incident, lightning risks in volcanic regions, and safety measures from CNN, NBC, and NYT reports.",
    category: "Science",
    image: "https://images.pexels.com/photos/12372779/pexels-photo-12372779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-18",
    timestamp: "2026-08-18T23:14:39.368Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "lakers-governor-buss-blocks-stake-sale",
    title: "Lakers Governor Jeanie Buss Blocks Siblings’ Stake Sale",
    excerpt: "Jeanie Buss denies her siblings cannot sell Lakers family stake to Bob Iger and Joshua Kushner, sparking legal and financial debate and future franchise value.",
    category: "Business",
    image: "https://images.pexels.com/photos/6289049/pexels-photo-6289049.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-18",
    timestamp: "2026-08-18T02:01:13.138Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "nsw-gun-buyback-after-bondi-attack",
    title: "NSW Gun Buyback Launched After Bondi Attack",
    excerpt: "NSW Gun Buyback Scheme launched in response to Bondi terror attack. Learn about the program's goals, public reaction, and implications for gun laws in Australia.",
    category: "Politics",
    image: "https://images.pexels.com/photos/11941117/pexels-photo-11941117.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-15",
    timestamp: "2026-08-15T23:47:14.089Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "gomez-fernando-mendoza-debut-bigger-test",
    title: "Gutierrez: Fernando Mendoza Shines in Debut, Major Test Ahead",
    excerpt: "Raiders rookie QB Fernando Mendoza excels in preseason debut, but faces tougher challenges ahead. Analyze his performance and what’s next.",
    category: "Sports",
    image: "https://images.pexels.com/photos/159505/quarterback-running-back-football-player-159505.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-15",
    timestamp: "2026-08-15T17:01:18.454Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "taliban-education-toll-afghanistan-girls-boys",
    title: "Taliban Education Toll: Impact on Girls and Boys in Afghanistan",
    excerpt: "The Taliban's takeover has severely impacted education for all Afghan students, particularly girls, with profound social and economic consequences.",
    category: "Politics",
    image: "https://images.pexels.com/photos/31093707/pexels-photo-31093707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-14",
    timestamp: "2026-08-14T17:36:18.750Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "darksiders-4-kingdom-come-game-launch-2028",
    title: "Darksiders 4 and New Kingdom Come Game Set for 2028 Launch",
    excerpt: "Darksiders 4 and Kingdom Come Deliverance 2 are confirmed to launch before March 2028, per Embracer Group's latest roadmap updates for upcoming titles.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/7862609/pexels-photo-7862609.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-14",
    timestamp: "2026-08-14T02:54:21.513Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "train-derails-east-sussex-11-injured",
    title: "Train Derails in East Sussex, 11 Injured in Southern England",
    excerpt: "A passenger train derailed in East Sussex, southern England, leaving 11 injured. Here's the latest on the incident near Lewes.",
    category: "General",
    image: "https://images.pexels.com/photos/32487875/pexels-photo-32487875.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-13",
    timestamp: "2026-08-13T23:01:14.307Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "google-pixel-11-cases-let-phone-colors-shine-through",
    title: "Google Pixel 11 Cases Let Phone Colors Shine Through",
    excerpt: "Discover how Google Pixel 11 cases are designed to showcase vibrant phone colors. Explore the latest trends in smartphone accessories that prioritize style and visibility.",
    category: "Technology",
    image: "https://images.pexels.com/photos/6913227/pexels-photo-6913227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-13",
    timestamp: "2026-08-13T17:32:00.418Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "man-united-vs-leeds-preview-predictions-lineups",
    title: "Man United vs Leeds: Match Preview, Lineups and Predictions",
    excerpt: "Get the latest Man United vs Leeds preview, team news, predicted lineups, and match predictions for the upcoming Premier League clash.",
    category: "Sports",
    image: "https://images.pexels.com/photos/36513047/pexels-photo-36513047.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-12",
    timestamp: "2026-08-12T17:53:19.544Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "google-pixel-2026-hardware-launch-event-expectations",
    title: "What to Expect from Google's 2026 Pixel Hardware Launch Event",
    excerpt: "What to expect from Google's 2026 Pixel hardware launch event, including rumored devices, features, and launch details. Stay updated with the latest news.",
    category: "Technology",
    image: "https://images.pexels.com/photos/28936752/pexels-photo-28936752.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-11",
    timestamp: "2026-08-11T17:01:25.127Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "morgan-freeman-90-retirement-plans",
    title: "Morgan Freeman at 90: Continuing His Legacy Without Retirement Plans",
    excerpt: "Morgan Freeman, now approaching 90, continues working with no retirement plans. Discover how he maintains his career and passion for acting at this stage.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/37684401/pexels-photo-37684401.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-08",
    timestamp: "2026-08-08T23:00:49.008Z",
    readMins: 5,
    views: 0
  },

  {
    slug: "republicans-face-year-end-test-over-trump-spending-bill",
    title: "Republicans Face Year-End Test Over Trump Spending Bill",
    excerpt: "Republicans face likely year-end test after punting Trump spending bill, risking political fallout as Congress approaches deadline.",
    category: "Politics",
    image: "https://images.pexels.com/photos/6949977/pexels-photo-6949977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-08",
    timestamp: "2026-08-08T12:08:27.473Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "puerto-rico-water-rationing-begins-amid-escalating-drought",
    title: "Puerto Rico Water Rationing Begins Amid Escalating Drought",
    excerpt: "Puerto Rico starts rationing water as drought conditions intensify, affecting thousands. Learn about the crisis, its causes, and impacts on daily life.",
    category: "General",
    image: "https://images.pexels.com/photos/37729212/pexels-photo-37729212.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-07",
    timestamp: "2026-08-07T23:45:36.628Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "trump-colombia-military-cooperation-fast-tracks",
    title: "Trump Fast-Tracks Military Cooperation With Colombia",
    excerpt: "Trump administration accelerates military collaboration with Colombia amid new president's security focus, reshaping regional alliances and challenges.",
    category: "Politics",
    image: "https://images.pexels.com/photos/2076824/pexels-photo-2076824.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-07",
    timestamp: "2026-08-07T17:00:51.546Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "openais-hockey-puck-sized-device-over-300",
    title: "OpenAI's Hockey Puck-Sized Device Over $300",
    excerpt: "OpenAI's new hockey puck-sized device will reportedly cost over $300, sparking excitement in tech. Learn about its potential features and market impact.",
    category: "Technology",
    image: "https://images.pexels.com/photos/22307556/pexels-photo-22307556.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-06",
    timestamp: "2026-08-06T23:17:16.244Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "gun-rights-devotion-disappeared-firearm-incident",
    title: "Gun Rights Devotion Disappeared After Firearm Incident",
    excerpt: "A trans woman brandished a firearm, and suddenly gun rights devotion disappeared. Explore how identity politics and firearm ownership intersect in recent debates.",
    category: "Politics",
    image: "https://images.pexels.com/photos/26856650/pexels-photo-26856650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-06",
    timestamp: "2026-08-06T12:01:13.136Z",
    readMins: 6,
    views: 0
  },

  {
    slug: "scoop-jim-renacci-mulls-house-bid-if-max-miller-drops-out",
    title: "Jim Renacci Considers a House Bid if Max Miller Steps Down",
    excerpt: "Jim Renacci mulls a House bid if Max Miller drops out, as the Ohio GOP faces turmoil over misconduct allegations and a scramble for a replacement candidate.",
    category: "Politics",
    image: "https://images.pexels.com/photos/8847167/pexels-photo-8847167.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-04",
    timestamp: "2026-08-04T12:01:20.839Z",
    readMins: 9,
    views: 0
  },

  {
    slug: "matte-black-pixel-11-pro-revealed-gallery",
    title: "Matte Black Pixel 11 Pro Revealed in Detailed Gallery",
    excerpt: "Explore the detailed gallery of the matte black Pixel 11 Pro, design insights, camera updates, and market expectations from the latest leaks.",
    category: "Technology",
    image: "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-03",
    timestamp: "2026-08-03T17:33:36.387Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "europes-wildfire-crisis-eases-west-danger-shifts-east-greece",
    title: "Europe's Wildfire Crisis Eases as Danger Shifts to Greece",
    excerpt: "Europe’s wildfire crisis eases in west as danger shifts east to Greece, with evacuations in France and blazes threatening Greek islands, tourism, and Athens.",
    category: "General",
    image: "https://images.pexels.com/photos/38369177/pexels-photo-38369177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-01",
    timestamp: "2026-08-01T23:01:03.603Z",
    readMins: 8,
    views: 0
  },

  {
    slug: "borislav-nikolic-ufc-belgrade-replacement",
    title: "Borislav Nikolic: Late-Notice Replacement in UFC Belgrade",
    excerpt: "Borislav Nikolic steps in as a late-notice replacement for UFC Belgrade, bringing excitement to the event with his Brave championship experience.",
    category: "Sports",
    image: "https://images.pexels.com/photos/5424764/pexels-photo-5424764.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-01",
    timestamp: "2026-08-01T17:00:41.675Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "labour-burnham-bounce-opinion-polls",
    title: "Labour Burnham Bounce Opinion Polls Explained",
    excerpt: "Labour Burnham bounce opinion polls reveal significant insights into political trends and voter behavior. Discover more about this phenomenon.",
    category: "Politics",
    image: "https://images.pexels.com/photos/1464193/pexels-photo-1464193.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-01",
    timestamp: "2026-08-01T12:00:45.914Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "russia-ukraine-casualties-trade-attacks",
    title: "Russia and Ukraine Report Casualties Amid Ongoing Attacks",
    excerpt: "Russia and Ukraine report casualties as attacks continue, highlighting the escalating conflict and its humanitarian impact.",
    category: "Politics",
    image: "https://images.pexels.com/photos/11849395/pexels-photo-11849395.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-08-01",
    timestamp: "2026-08-01T02:00:36.908Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "spain-migrants-returning-ceuta-border-tragedy",
    title: "Spain Reports Migrants Returning From Ceuta After Tragedy",
    excerpt: "Spain says migrants are returning from Ceuta after 57 die in border rush, highlighting the ongoing migrant crisis at the Spanish-Moroccan border.",
    category: "Politics",
    image: "https://images.pexels.com/photos/19264369/pexels-photo-19264369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-31",
    timestamp: "2026-07-31T23:00:39.338Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "father-son-new-charges-hostage-situation",
    title: "Father and Son Face New Charges for Hostage Situation",
    excerpt: "Father and son accused of zip-tying Forest Service workers face new charges in a troubling hostage case that highlights rising tensions.",
    category: "Politics",
    image: "https://images.pexels.com/photos/18326060/pexels-photo-18326060.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-31",
    timestamp: "2026-07-31T17:00:43.495Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "mlb-trade-deadline-dominoes-2026-market",
    title: "MLB Trade Deadline Dominoes for 10 Biggest Names on 2026 Market",
    excerpt: "Explore the MLB trade deadline dominoes for the 10 biggest names on the 2026 market and their potential impacts on teams and players.",
    category: "Sports",
    image: "https://images.pexels.com/photos/26890858/pexels-photo-26890858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-31",
    timestamp: "2026-07-31T12:00:46.190Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "andy-burnham-regional-mayors-share-income-tax",
    title: "Andy Burnham to Give Regional Mayors Share of Income Tax",
    excerpt: "Andy Burnham plans to give regional mayors a share of income tax, enhancing financial autonomy and devolution efforts across the UK.",
    category: "Politics",
    image: "https://images.pexels.com/photos/38565876/pexels-photo-38565876.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-31",
    timestamp: "2026-07-31T02:00:42.790Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "grynspan-un-chief-poll",
    title: "Informal Poll Indicates Costa Rica's Grynspan Leads UN Chief Race",
    excerpt: "An informal poll shows Costa Rica's Grynspan ahead in the race to become the next UN chief, marking a significant shift in global leadership dynamics.",
    category: "Politics",
    image: "https://images.pexels.com/photos/16146279/pexels-photo-16146279.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-30",
    timestamp: "2026-07-30T23:00:39.336Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "jake-paul-mvp-merges-with-pfl",
    title: "Jake Paul's MVP Merges with PFL in MMA Landscape Shift",
    excerpt: "Jake Paul's MVP merges with PFL, creating a seismic shift in the MMA landscape that redefines combat sports promotion and athlete opportunities.",
    category: "Sports",
    image: "https://images.pexels.com/photos/5424764/pexels-photo-5424764.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-30",
    timestamp: "2026-07-30T21:36:23.719Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "2026-mlb-trade-deadline-preview-passans-insights",
    title: "2026 MLB Trade Deadline Preview: Passan's Insights for Every Team",
    excerpt: "Explore Passan's insights in the 2026 MLB trade deadline preview, detailing team strategies and potential trade candidates.",
    category: "Sports",
    image: "https://images.pexels.com/photos/26890858/pexels-photo-26890858.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-30",
    timestamp: "2026-07-30T17:00:47.326Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "unc-bill-belichick-crisis-mode-decisions",
    title: "UNC and Bill Belichick in Crisis Mode Require Tough Decisions",
    excerpt: "UNC and Bill Belichick in crisis mode require difficult decisions to navigate their troubled paths in sports and leadership.",
    category: "Sports",
    image: "https://images.pexels.com/photos/6766999/pexels-photo-6766999.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-30",
    timestamp: "2026-07-30T12:00:44.533Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "anthony-smith-released-bond-felony-charges",
    title: "Anthony Smith Released on $500K Bond, Faces Felony Charges",
    excerpt: "Anthony Smith was released on a $500K bond after facing three felony charges including terroristic threats and domestic violence.",
    category: "Sports",
    image: "https://images.pexels.com/photos/7785088/pexels-photo-7785088.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-30",
    timestamp: "2026-07-30T02:00:38.673Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "whats-the-catch-with-the-apple-upgrade-program",
    title: "What’s the Catch with the Apple Upgrade Program?",
    excerpt: "Discover the catch with the Apple Upgrade program, including leasing options, costs, and partnership insights with Klarna.",
    category: "Technology",
    image: "https://images.pexels.com/photos/6913311/pexels-photo-6913311.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-29",
    timestamp: "2026-07-29T23:00:46.368Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "tarik-skubal-trade-tier-rankings-mlb",
    title: "Tier Rankings For a Tigers Tarik Skubal Trade to Every MLB Team",
    excerpt: "Explore tier rankings for a Tarik Skubal trade to every MLB team amid latest rumors surrounding the Tigers ace pitcher.",
    category: "Sports",
    image: "https://images.pexels.com/photos/11901406/pexels-photo-11901406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-29",
    timestamp: "2026-07-29T17:00:54.440Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "deportation-overland-couple-shot-dead-guatemala",
    title: "Deportation Impact: Overland Couple Shot Dead in Guatemala",
    excerpt: "Deportation incidents lead to tragedies, like the Overland couple shot dead in Guatemala after an ICE stop. Understand the implications.",
    category: "Politics",
    image: "https://images.pexels.com/photos/36984942/pexels-photo-36984942.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-29",
    timestamp: "2026-07-29T12:00:41.325Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "cpi-inflation-remains-high-above-rba-target",
    title: "CPI Inflation Remains High Above RBA Target",
    excerpt: "CPI inflation in Australia continues to outpace the RBA's target range, impacting household budgets and economic policy. Learn what this means for interest rates and prices.",
    category: "Business",
    image: "https://images.pexels.com/photos/29899905/pexels-photo-29899905.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-29",
    timestamp: "2026-07-29T02:01:01.811Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "france-spain-wildfires-heatwave",
    title: "France and Spain battle wildfires as new heatwave looms",
    excerpt: "France and Spain are struggling to contain devastating wildfires amid extreme heat, with evacuations and threats to critical infrastructure as another heatwave approaches.",
    category: "General",
    image: "https://images.pexels.com/photos/4902032/pexels-photo-4902032.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-28",
    timestamp: "2026-07-28T23:00:53.874Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "us-walks-out-un-security-council-france-remarks",
    title: "US Walks Out of UN Security Council Meeting During France Remarks",
    excerpt: "The US delegation walked out of a UN Security Council meeting during France's remarks, reportedly protesting criticism of America's human rights record. Details on the diplomatic rift.",
    category: "Politics",
    image: "https://images.pexels.com/photos/33984563/pexels-photo-33984563.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-28",
    timestamp: "2026-07-28T17:00:59.249Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "claude-codex-ai-apple-security-updates",
    title: "Claude and Codex AI tools credited in Apple security updates",
    excerpt: "Apple's latest iOS and macOS security updates credit Claude, Codex, and other AI tools for enhancing protection. Learn how AI is shaping Apple's security strategy.",
    category: "Technology",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-28",
    timestamp: "2026-07-28T12:01:01.473Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "playstation-5-gta-6-download-codes-region-locked-xbox-unaffected",
    title: "PlayStation 5 GTA 6 Download Codes Region Locked, Xbox Unaffected",
    excerpt: "PlayStation 5 GTA 6 download codes are now region locked, causing issues for importers, while Xbox buyers remain unaffected. Learn why this disparity exists and its implications.",
    category: "Technology",
    image: "https://images.pexels.com/photos/4511372/pexels-photo-4511372.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-28",
    timestamp: "2026-07-28T02:01:03.358Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "wildfire-nears-bordeaux-evacuations-france",
    title: "Wildfire Nears Bordeaux as Thousands Evacuate in France",
    excerpt: "A wildfire is now just nine miles from Bordeaux, France, prompting mass evacuations and health warnings. Officials warn of worsening conditions as Europe battles extreme heat.",
    category: "General",
    image: "https://images.pexels.com/photos/33344945/pexels-photo-33344945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-27",
    timestamp: "2026-07-27T23:00:48.737Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "why-new-war-yemen-different-houthis",
    title: "Why a New War in Yemen Could Be Different for the Houthis",
    excerpt: "Explore why a new war in Yemen could be different for the Houthis, including their military gains, regional alliances, and the impact on global shipping routes.",
    category: "Politics",
    image: "https://images.pexels.com/photos/16907640/pexels-photo-16907640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-27",
    timestamp: "2026-07-27T17:01:03.595Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "pentagon-removes-4-troops-from-iran-war-death-toll",
    title: "Pentagon Removes 4 Troops From Iran War Death Toll Amid Renewed Fighting",
    excerpt: "The Pentagon has quietly removed 4 troops from the official Iran war death toll during renewed fighting, sparking outrage among military families and raising transparency concerns.",
    category: "Politics",
    image: "https://images.pexels.com/photos/32407600/pexels-photo-32407600.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-26",
    timestamp: "2026-07-26T23:01:03.161Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ff14-housing-updates-inspired-by-wow",
    title: "FF14 to Receive Two Major Housing Updates Inspired by World of Warcraft",
    excerpt: "Final Fantasy 14 is set to get two major housing updates after Yoshi-P was inspired by World of Warcraft. Learn what changes are coming and why they matter.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/32772105/pexels-photo-32772105.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-26",
    timestamp: "2026-07-26T17:01:15.020Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "cook-islands-eez-mapped-scientific-deep-ocean-voyage",
    title: "Cook Islands EEZ mapped in scientific deep ocean voyage",
    excerpt: "A scientific expedition has mapped deep ocean changes across the Cook Islands Exclusive Economic Zone (EEZ), revealing critical insights into marine ecosystems.",
    category: "Science",
    image: "https://images.pexels.com/photos/30620493/pexels-photo-30620493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-26",
    timestamp: "2026-07-26T12:00:52.353Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "down-the-tubes-new-york-times-analysis",
    title: "Down the Tubes: Analyzing The New York Times' Latest Coverage",
    excerpt: "Explore the trending topic 'Down the Tubes' and its connection to The New York Times' latest coverage. Discover insights into media trends and public discourse.",
    category: "General",
    image: "https://images.pexels.com/photos/35755252/pexels-photo-35755252.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-26",
    timestamp: "2026-07-26T02:01:21.324Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "usyk-team-challenges-anthony-joshua-comeback-fight",
    title: "Usyk’s Team Challenges Anthony Joshua Ahead of Comeback Fight",
    excerpt: "Oleksandr Usyk’s team has urged Anthony Joshua to ‘show greatness’ in his comeback fight against Kristian Prenga. Explore the latest updates and analysis.",
    category: "Sports",
    image: "https://images.pexels.com/photos/31403621/pexels-photo-31403621.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-25",
    timestamp: "2026-07-25T23:01:17.442Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "georgias-okefenokee-swamp-unesco-world-heritage-site",
    title: "Georgia’s Okefenokee Swamp Named UNESCO World Heritage Site",
    excerpt: "Georgia’s Okefenokee Swamp has been designated a UNESCO World Heritage site, recognizing its ecological importance and cultural significance. Learn more about this milestone.",
    category: "General",
    image: "https://images.pexels.com/photos/14603517/pexels-photo-14603517.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-25",
    timestamp: "2026-07-25T17:00:56.955Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "jon-bon-jovi-ends-show-madison-square-garden",
    title: "Jon Bon Jovi Abruptly Ends Show at Madison Square Garden",
    excerpt: "Jon Bon Jovi shocked fans by abruptly ending his Madison Square Garden show. Learn why the rock icon cut his performance short and what it means for his legacy.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/27817824/pexels-photo-27817824.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-25",
    timestamp: "2026-07-25T12:01:16.746Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "pakistan-iran-us-talks-china-push",
    title: "Pakistan and Iran Seek US Talks Through China’s Diplomatic Push",
    excerpt: "Pakistan and Iran are exploring renewed talks with the US, facilitated by China’s diplomatic efforts. Sources reveal details of this geopolitical development.",
    category: "Politics",
    image: "https://images.pexels.com/photos/6949994/pexels-photo-6949994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-25",
    timestamp: "2026-07-25T02:01:18.242Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "the-odyssey-cast-and-what-to-know-before-watching",
    title: "The Odyssey Cast and What to Know Before Watching",
    excerpt: "Discover the cast of The Odyssey, key characters, and plot details to enhance your viewing experience before watching this trending adaptation.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/20290070/pexels-photo-20290070.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-24",
    timestamp: "2026-07-24T23:00:51.766Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "us-saudi-nuclear-deal-status",
    title: "Is the US-Saudi Nuclear Deal On, or in Limbo?",
    excerpt: "Explore the current status of the US-Saudi nuclear deal and factors influencing its future, including geopolitical tensions and normalization with Israel.",
    category: "Politics",
    image: "https://images.pexels.com/photos/16705829/pexels-photo-16705829.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-24",
    timestamp: "2026-07-24T17:00:45.556Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "attacker-allahu-akbar-stabs-jewish-man-nyc",
    title: "Attacker shouting 'Allahu Akbar' stabs Jewish man in NYC",
    excerpt: "A man shouting 'Allahu Akbar' stabbed a Jewish man with a screwdriver in NYC, sparking a hate crime investigation. Latest updates on the Upper West Side attack.",
    category: "General",
    image: "https://images.pexels.com/photos/38455472/pexels-photo-38455472.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-24",
    timestamp: "2026-07-24T12:00:54.538Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "giuliana-rancic-jerry-oconnell-breakup",
    title: "Giuliana Rancic: Jerry O’Connell Addresses Past Breakup",
    excerpt: "Giuliana Rancic's past with Jerry O’Connell resurfaces as he discusses their breakup over a decade later. Discover more about their history.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/6670155/pexels-photo-6670155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-24",
    timestamp: "2026-07-24T02:00:43.683Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ukraine-new-military-chief-retaliation-russia",
    title: "Ukraine’s new military chief vows stronger retaliation against Russia",
    excerpt: "Ukraine’s new military chief pledges to escalate retaliation against Russia amid leadership shakeups and strategic shifts. Analysis of Zelensky’s latest moves.",
    category: "Politics",
    image: "https://images.pexels.com/photos/11834883/pexels-photo-11834883.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-23",
    timestamp: "2026-07-23T23:00:57.127Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "tyreek-hill-no-power-left-leg",
    title: "Tyreek Hill Reveals He Has No Power in Left Leg After Injury",
    excerpt: "Tyreek Hill, the former Dolphins wide receiver, shared that he still has no power in his left leg 10 months after surgery. Learn more about his recovery and future.",
    category: "Sports",
    image: "https://images.pexels.com/photos/37234920/pexels-photo-37234920.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-23",
    timestamp: "2026-07-23T21:36:51.587Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ice-officer-vetting-scrutiny-hiring-push",
    title: "ICE Officer Vetting Under Scrutiny Amid Hiring Push",
    excerpt: "Amid a major hiring push, ICE officer vetting faces scrutiny as experts question training standards and oversight following deadly incidents involving agents.",
    category: "Politics",
    image: "https://images.pexels.com/photos/35986122/pexels-photo-35986122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-23",
    timestamp: "2026-07-23T17:00:54.231Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "darragh-macanthony-peterborough-united-defensive-injuries",
    title: "Darragh MacAnthony responds to Peterborough United defensive injury concerns",
    excerpt: "Peterborough United chairman Darragh MacAnthony addresses fan concerns over defensive injury issues, offering insight into the club's strategy moving forward.",
    category: "Sports",
    image: "https://images.pexels.com/photos/33317197/pexels-photo-33317197.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-23",
    timestamp: "2026-07-23T12:33:24.292Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "jerusalem-holy-sites-nesting-swifts",
    title: "Jerusalem’s Holy Sites Host Ancient Colonies of Nesting Swifts",
    excerpt: "Discover how Jerusalem’s holy sites are home to some of the oldest colonies of nesting swifts, blending natural history with the city’s rich cultural heritage.",
    category: "Science",
    image: "https://images.pexels.com/photos/17633591/pexels-photo-17633591.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-23",
    timestamp: "2026-07-23T02:01:08.869Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "houthi-red-sea-blockade-economic-impact",
    title: "Houthi Red Sea Blockade Sparks Global Economic Concerns",
    excerpt: "The Houthi blockade in the Red Sea disrupts shipping routes, raising fears of economic instability. Learn how this impacts global trade and oil markets.",
    category: "Business",
    image: "https://images.pexels.com/photos/13102530/pexels-photo-13102530.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-22",
    timestamp: "2026-07-22T23:00:57.859Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "top-ai-presentation-generators-2026",
    title: "Top 10 AI Presentation Generators in 2026",
    excerpt: "Discover the best AI presentation generators in 2026 for students and professionals. Compare features, ease of use, and standout tools for creating stunning slide decks.",
    category: "Technology",
    image: "https://images.pexels.com/photos/15863044/pexels-photo-15863044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-22",
    timestamp: "2026-07-22T17:01:04.275Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "iphone-18-rumors-ranked-by-likelihood",
    title: "iPhone 18 Rumors: 20 Claims Ranked by Likelihood",
    excerpt: "A reality check on iPhone 18 rumors: we rank 20 claims by likelihood based on Apple's history, leaks, and expert analysis. Get the latest on release date, Pro models, and camera upgrades.",
    category: "Technology",
    image: "https://images.pexels.com/photos/6913351/pexels-photo-6913351.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-22",
    timestamp: "2026-07-22T12:26:44.619Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "world-cup-final-shatters-us-soccer-viewership-records",
    title: "World Cup Final Shatters U.S. Soccer Viewership Records",
    excerpt: "The World Cup final drew over 60 million viewers in the U.S., setting a new record for soccer viewership. Learn why this historic moment matters for sports broadcasting.",
    category: "Sports",
    image: "https://images.pexels.com/photos/38109922/pexels-photo-38109922.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-22",
    timestamp: "2026-07-22T02:00:59.724Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "ai-rise-universal-entertainment-app",
    title: "AI and the Rise of the Universal Entertainment App",
    excerpt: "AI is transforming entertainment with universal apps that combine streaming, gaming, and social media. Learn how this trend is reshaping digital experiences.",
    category: "Technology",
    image: "https://images.pexels.com/photos/8294791/pexels-photo-8294791.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-21",
    timestamp: "2026-07-21T23:01:03.608Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "light-flip-phone-review-colorful-affordable-throwback",
    title: "Light Flip Phone Review: A Colorful, Affordable Throwback",
    excerpt: "The Light Flip phone combines retro design with modern minimalism at an affordable price. Discover why this colorful flip phone is trending in tech circles.",
    category: "Technology",
    image: "https://images.pexels.com/photos/10609069/pexels-photo-10609069.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-21",
    timestamp: "2026-07-21T17:00:55.190Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "us-troops-injured-iran-retaliation",
    title: "Nearly 100 US troops injured as Iran retaliates against allies",
    excerpt: "The Pentagon reports almost 100 US troops injured in recent weeks amid escalating tensions with Iran, which has launched reprisal attacks on American allies.",
    category: "Politics",
    image: "https://images.pexels.com/photos/3743542/pexels-photo-3743542.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-21",
    timestamp: "2026-07-21T12:00:53.189Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-ai-video-editing-tools-2026",
    title: "Best AI Video Editing Tools for Content Creators in 2026",
    excerpt: "Discover the best AI video editing tools for content creators in 2026, featuring cutting-edge automation, intuitive interfaces, and professional-grade effects.",
    category: "Technology",
    image: "https://images.pexels.com/photos/31718971/pexels-photo-31718971.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-21",
    timestamp: "2026-07-21T02:01:03.548Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "woman-trial-murder-children-no-criminal-responsibility",
    title: "Woman on trial for killing 3 children claims no criminal responsibility",
    excerpt: "A woman is on trial for the murder of her three children, with her defense arguing she may not be criminally responsible due to mental health issues. The case raises questions about postpartum mental health.",
    category: "Health",
    image: "https://images.pexels.com/photos/6077328/pexels-photo-6077328.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-20",
    timestamp: "2026-07-20T23:00:51.462Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "spiderman-brand-new-day-mcu-timeline",
    title: "Spider-Man: Brand New Day Confirmed in MCU Timeline by Kevin Feige",
    excerpt: "Kevin Feige confirms 'Spider-Man: Brand New Day' is part of the MCU timeline. Learn how this storyline integrates into Marvel's cinematic universe.",
    category: "Entertainment",
    image: "https://images.pexels.com/photos/7809123/pexels-photo-7809123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-20",
    timestamp: "2026-07-20T17:21:15.450Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "best-free-ai-writing-grammar-tools-for-students",
    title: "Best Free AI Writing and Grammar Tools for Students",
    excerpt: "Discover the best free AI writing and grammar tools for students to enhance productivity, improve essays, and avoid mistakes. Perfect for academic success.",
    category: "Technology",
    image: "https://images.pexels.com/photos/5537938/pexels-photo-5537938.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-20",
    timestamp: "2026-07-20T12:01:00.366Z",
    readMins: 4,
    views: 0
  },

  {
    slug: "earthquake-in-peru-kills-6-displaces-hundreds",
    title: "Earthquake in Peru Kills 6 and Displaces Hundreds",
    excerpt: "A powerful earthquake in Peru's Andes region has killed at least 6 people and displaced hundreds. Authorities report collapsed buildings and ongoing rescue efforts.",
    category: "General",
    image: "https://images.pexels.com/photos/14000708/pexels-photo-14000708.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    date: "2026-07-20",
    timestamp: "2026-07-20T02:00:55.249Z",
    readMins: 4,
    views: 0
  },

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