// Legitimate social discovery signals for AsfiBlog. Discovery != evidence of facts.
// YouTube's official Data API supports US popular-video discovery.
// TikTok/Instagram general public trending discovery has restricted official API access;
// any third-party feed must be explicitly licensed/authorized by the site owner.
const SOCIAL_HOSTS = new Set(['tiktok.com','instagram.com','youtube.com','youtu.be','x.com','twitter.com','threads.net','facebook.com']);
const DEDUPE_WORDS = new Set(['the','that','this','with','from','after','about','news','latest','live','today','video','official','update','what','why','how','just','best','more','says','reveals','trending']);

function hostMatches(host, domain) { return host === domain || host.endsWith('.'+domain); }
function videoUrlValid(url, platform) {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    const allowed = platform === 'tiktok' ? ['tiktok.com'] : platform === 'instagram' ? ['instagram.com'] : platform === 'youtube' ? ['youtube.com','youtu.be'] : platform === 'x' ? ['x.com','twitter.com'] : platform === 'threads' ? ['threads.net'] : platform === 'facebook' ? ['facebook.com'] : [];
    return allowed.some(h=>hostMatches(host,h));
  } catch { return false; }
}
function normalizedTitle(text) {
  return new Set(String(text || '').toLowerCase().match(/[\p{L}\p{N}]{4,}/gu)?.filter(x=>!DEDUPE_WORDS.has(x))||[]);
}
export function socialSignalScore(title,signals=[]) {
  const a = normalizedTitle(title);
  if (a.size < 2) return 0;
  let bonus = 0;
  for (const signal of signals) {
    const b = normalizedTitle(signal.title);
    if (b.size < 2) continue;
    let overlap = 0;
    for (const word of a) if(b.has(word)) overlap++;
    if (overlap < 2 || overlap / Math.min(a.size,b.size) < 0.45) continue;
    const rawViews = Number(signal.views)||0;
    const popularity = rawViews > 0 ? Math.min(8,Math.log10(rawViews+1)*1.25) : 0;
    bonus += 5 + popularity;
  }
  return Math.min(22,Math.round(bonus));
}
function recentEnough(when,hours=96,now=Date.now()) {
  const parsed = Date.parse(String(when || ''));
  return Number.isFinite(parsed) && parsed <= now+3600000 && now-parsed <= hours*3600000;
}
export async function fetchYouTubeUSSignals(apiKey,{fetcher=globalThis.fetch,now=Date.now()}={}) {
  if (!apiKey) return [];
  const categoryIds=['','17','24','28']; // General; sports; entertainment; science & technology.
  const results=await Promise.all(categoryIds.map(async category=>{
    const url=new URL('https://www.googleapis.com/youtube/v3/videos');
    url.searchParams.set('part','snippet,statistics');
    url.searchParams.set('chart','mostPopular');
    url.searchParams.set('regionCode','US');
    url.searchParams.set('maxResults','25');
    if(category)url.searchParams.set('videoCategoryId',category);
    url.searchParams.set('key',apiKey);
    try {
      const response=await fetcher(url.toString(),{signal:AbortSignal.timeout(3300)});
      if(!response.ok){console.warn('YouTube trends status:',response.status);return []}
      const data=await response.json();
      return (Array.isArray(data.items)?data.items:[]).flatMap(item=>{
        const id=String(item.id||'');
        const title=String(item.snippet?.title||'').trim();
        const published=item.snippet?.publishedAt;
        if(!/^[\w-]{11}$/.test(id)||title.length<12||!recentEnough(published,96,now))return [];
        return [{platform:'youtube',title,summary:String(item.snippet?.description||'').slice(0,350),url:`https://www.youtube.com/watch?v=${id}`,views:Number(item.statistics?.viewCount)||0,published}];
      });
    } catch(e){console.warn('YouTube trend retrieval unavailable:',e.message);return []}
  }));
  return [...new Map(results.flat().map(item=>[item.url,item])).values()].slice(0,75);
}
export async function fetchLicensedSocialSignals(feedUrl,token,{fetcher=globalThis.fetch,now=Date.now()}={}) {
  if(!feedUrl)return [];
  let parsed;
  try {parsed=new URL(feedUrl)} catch {return []}
  // Configured server-side HTTPS licensed data feed; no Instagram/TikTok scraping.
  if(parsed.protocol!=='https:'||parsed.username||parsed.password)return [];
  try {
    const headers={Accept:'application/json'};
    if(token)headers.Authorization=`Bearer ${token}`;
    const response=await fetcher(parsed.toString(),{headers,signal:AbortSignal.timeout(3300)});
    if(!response.ok)return [];
    if(Number(response.headers?.get?.('content-length')||0)>200000)return [];
    const raw=await response.text();
    if(raw.length>200000)return [];
    const payload=JSON.parse(raw);
    if(!Array.isArray(payload.signals))return [];
    return payload.signals.slice(0,100).flatMap(s=>{
      const platform=String(s.platform||'').toLowerCase();
      const title=String(s.title||'').trim().slice(0,250);
      const url=String(s.url||'');
      if(!SOCIAL_HOSTS.size||!videoUrlValid(url,platform)||title.length<12||!recentEnough(s.observedAt,48,now))return [];
      return [{platform,title,summary:String(s.summary||'').slice(0,350),url,views:Math.max(0,Math.min(Number(s.views)||0,1e12)),published:s.observedAt}];
    });
  }catch(e){console.warn('Authorized social feed unavailable:',e.message);return []}
}
