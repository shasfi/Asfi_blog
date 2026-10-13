import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(process.cwd());
const blog=path.join(root,'blog');
const pages=[...fs.readdirSync(root).filter(f=>f.endsWith('.html')).map(f=>path.join(root,f)),...fs.readdirSync(blog).filter(f=>f.endsWith('.html')).map(f=>path.join(blog,f))];
const articleNames=fs.readdirSync(blog).filter(f=>f.endsWith('.html')&&f!=='index.html');
const content=f=>fs.readFileSync(f,'utf8');
const sandbox={window:{}};
vm.runInNewContext(content(path.join(root,'assets/js/posts-data.js')),sandbox);
const posts=JSON.parse(JSON.stringify(sandbox.window.ASFIBLOG_POSTS));

test('All HTML files install exactly one NEW analytics tag, no old tag',()=>{
  for(const f of pages){const h=content(f);assert.equal((h.match(/gtag\/js\?id=G-SXL9MNZFNL/g)||[]).length,1,f);assert.ok(!h.includes('G-QBFK40KM9C'),f);assert.ok(h.includes("analytics_storage:mode"),f);}
  assert.ok(!content(path.join(root,'assets/js/main.js')).includes('G-QBFK40KM9C'));
});
test('All 227 existing posts have unique catalog records and visible direct links',()=>{
  assert.equal(posts.length,articleNames.length);
  const keys=new Set(posts.map(x=>x.slug)); assert.equal(keys.size,posts.length);
  for(const f of articleNames) assert.ok(keys.has(f.slice(0,-5)),f);
  const html=content(path.join(blog,'index.html')); const between=html.split('<!-- STATIC_ARCHIVE_START -->')[1].split('<!-- STATIC_ARCHIVE_END -->')[0];
  for (const post of posts) assert.ok(between.includes(`href="/blog/${post.slug}.html"`),post.slug);
  assert.ok((html.split('id="posts-grid"')[1]||'').includes('class="card in-view"'));
});
test('Sitemap and RSS include correct static URLs',()=>{
  const sitemap=content(path.join(root,'sitemap.xml'));
  for(const f of articleNames) assert.ok(sitemap.includes(`https://asfiblog.vercel.app/blog/${f}`),f);
  assert.equal((sitemap.match(/<loc>/g)||[]).length,articleNames.length+7);
  assert.ok(content(path.join(root,'rss.xml')).includes('<rss version="2.0">'));
});
test('Unversioned articles data must not use year-long immutable caching',()=>{
  const vercel=JSON.parse(content(path.join(root,'vercel.json')));
  assert.equal(vercel.crons.length,4);
  assert.ok(vercel.headers.some(h=>h.source==='/assets/(.*)' && h.headers.some(x=>x.value.includes('must-revalidate'))));
  assert.ok(!vercel.headers.some(h=>h.source==='/assets/(.*)' && h.headers.some(x=>x.value.includes('immutable'))));
});
test('Publishing requires a configured strong secret before any fetch',async()=>{
  const save=process.env.CRON_SECRET; const saveF=globalThis.fetch;
  let attemptedFetch=false;
  globalThis.fetch=async()=>{attemptedFetch=true;throw Error('must not fetch')};
  const {default:handler}=await import('../api/generate-blog.js');
  const request={headers:{},query:{},method:'GET'};
  async function call(){ let status,body;const res={status(v){status=v;return this},json(v){body=v;return this}};await handler(request,res);return {status,body}; }
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await call()).status,503);
    process.env.CRON_SECRET='short';
    assert.equal((await call()).status,503);
    process.env.CRON_SECRET='fake-test-only-strong-secret';
    assert.equal((await call()).status,401);
    assert.equal(attemptedFetch,false);
  }finally {if(save===undefined)delete process.env.CRON_SECRET;else process.env.CRON_SECRET=save;globalThis.fetch=saveF;}
});

test('Generated article HTML includes visible source/AI disclosure and long substantive content gate', async () => {
  const { default: handler } = await import('../api/generate-blog.js');
  const keys=['CRON_SECRET','OPENROUTER_API_KEY','GITHUB_TOKEN','GITHUB_OWNER','GITHUB_REPO','SITE_URL','PEXELS_API_KEY'];
  const saved = Object.fromEntries(keys.map(k=>[k,process.env[k]]));
  const oldFetch=globalThis.fetch;
  const base='https://api.github.com/repos/test-owner/test-repo/contents/';
  let htmlCaptured='';
  const sections = Array.from({length:6},(_,i)=>`<h2>Section ${i+1}</h2>` + `<p>${('Meaningful example context with precise limitations and a distinct consideration. ').repeat(37)}</p>`).join('');
  const post={title:'Example Topic Review With Context', slug:'example-topic-review-with-context', category:'Sports', meta_description:'A detailed example of contextual coverage with background, plain-English explanations, questions, and clear limits for the reader.', content:sections, tags:['US Sports','News','Analysis','Audience','Example','Coverage'], faq:Array.from({length:4},(_,i)=>({q:`What is detail ${i}?`,a:`Explanation for detail ${i}.`}))};
  const jsonResponse=(status,data)=>({ok:status>=200&&status<300,status,json:async()=>data,text:async()=>JSON.stringify(data)});
  globalThis.fetch=async (url,options={})=>{
    if(url===`${base}assets/js/posts-data.js`) return jsonResponse(200,{content:Buffer.from(content(path.join(root,'assets/js/posts-data.js'))).toString('base64'),sha:'test-sha'});
    if(url==='https://openrouter.ai/api/v1/chat/completions') return jsonResponse(200,{choices:[{message:{content:JSON.stringify(post)}}]});
    if(url===`${base}blog/${post.slug}.html` && options.method==='PUT'){
      htmlCaptured=Buffer.from(JSON.parse(options.body).content,'base64').toString();
      return jsonResponse(403,{message:'intentional stop before GitHub write'});
    }
    throw new Error(`unexpected network request: ${url}`);
  };
  Object.assign(process.env,{CRON_SECRET:'test-secret-of-adequate-length',OPENROUTER_API_KEY:'stub',GITHUB_TOKEN:'stub',GITHUB_OWNER:'test-owner',GITHUB_REPO:'test-repo',SITE_URL:'https://asfiblog.vercel.app'});
  delete process.env.PEXELS_API_KEY;
  try {
    let status,body;
    const res={status(v){status=v;return this},json(v){body=v;return this}};
    await handler({method:'POST', headers:{authorization:'Bearer test-secret-of-adequate-length'},query:{},body:{topic:'sports review',context:'Specific example context provided by an editor.'}},res);
    assert.equal(status,500,JSON.stringify(body)); // GitHub mock intentionally blocks final write
    assert.ok(htmlCaptured.includes('This article was prepared with AI assistance'), 'disclosure absent from visible HTML');
    assert.ok(htmlCaptured.includes('has not been independently fact-checked'), 'editorial clarity absent');
    assert.ok(htmlCaptured.includes('<h2>Section 1</h2>') === false, 'section headings should receive IDs');
    assert.ok(htmlCaptured.includes('Section 1</h2>'));
  } finally {
    globalThis.fetch=oldFetch;
    for(const k of keys) {if(saved[k]===undefined)delete process.env[k]; else process.env[k]=saved[k];}
  }
});


test('Broad-trending configuration includes US sports/entertainment and displays sources in generated body',()=>{
  const src=content(path.join(root,'api/generate-blog.js'));
  assert.ok(src.includes('AUTO_TOPIC_MODE === "focused"'), 'should default to broad, not tech-only');
  assert.ok(src.includes('section/topic/SPORTS?hl=en-US'), 'US sports feed missing');
  assert.ok(src.includes('section/topic/ENTERTAINMENT?hl=en-US'), 'US entertainment feed missing');
  assert.ok(src.includes('Sensitive breaking-news claim lacks two independent publisher references'), 'missing high-risk gate');
  assert.ok(src.indexOf('const bodyWithImages = distributeImages(post.content') > src.indexOf('Sources and verification limits'), 'sources must be added to content before HTML snapshot');
});
