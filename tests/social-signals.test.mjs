import test from 'node:test';
import assert from 'node:assert/strict';
import { socialSignalScore,fetchYouTubeUSSignals,fetchLicensedSocialSignals } from '../api/trend-signals.js';
test('social signal scoring matches named events, not generic sports words',()=>{
 const signals=[{title:'Elon Musk Ambani Starlink India row explodes',views:500000}];
 assert.ok(socialSignalScore('Elon Musk Ambani Starlink dispute in India',signals)>0);
 assert.equal(socialSignalScore('US sports score update today',signals),0);
});
test('YouTube signal retrieval uses official API, US region and real view counts',async()=>{
 const now=Date.now(); let n=0;
 const fetcher=async url=>{
   const u=new URL(url);assert.equal(u.hostname,'www.googleapis.com');assert.equal(u.searchParams.get('chart'),'mostPopular');assert.equal(u.searchParams.get('regionCode'),'US');n++;
   return {ok:true,json:async()=>({items:[{id:'abcdefghijk',snippet:{title:'Elon Musk Ambani India Starlink debate',publishedAt:new Date(now-3600000).toISOString(),description:'News reaction'},statistics:{viewCount:'123456'}}]})};
 };
 const signals=await fetchYouTubeUSSignals('fake-key',{fetcher,now});
 assert.equal(n,4);assert.equal(signals.length,1);assert.equal(signals[0].views,123456);
});
test('No keys means no YouTube calls; social feeds require approved HTTPS source',async()=>{
 assert.deepEqual(await fetchYouTubeUSSignals('',{fetcher:()=>{throw Error('called')}}),[]);
 assert.deepEqual(await fetchLicensedSocialSignals('http://localhost:8080/tiktok',{fetcher:()=>{throw Error('called')}}),[]);
});
test('Licensed provider validates platform URLs, recency and shape',async()=>{
 const now=Date.now(); const good={platform:'tiktok',title:'Verified Starlink India discussion clip',url:'https://www.tiktok.com/@topic/video/123456',views:20000,observedAt:new Date(now-1800000).toISOString()};
 const bad={...good,url:'https://attacker.example/malware'};
 const fetcher=async()=>({ok:true,headers:{get:()=>null},text:async()=>JSON.stringify({signals:[good,bad]})});
 const actual=await fetchLicensedSocialSignals('https://licensed-example.org/trends','',{fetcher,now});
 assert.equal(actual.length,1);assert.equal(actual[0].platform,'tiktok');
});
