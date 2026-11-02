import {chromium} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
const url=process.env.PROFILE_URL || 'https://traynnutrition.com/';
const label=process.env.PROFILE_LABEL || 'live';
const variants=(process.env.PROFILE_VARIANTS || 'normal,off').split(',');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('artifacts/scroll-profile',{recursive:true});
try{
 for(const variant of variants){
  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:2});
  const page=await context.newPage();
  if(variant==='baseline') await page.route(/\/trayn\.(js|css)(\?|$)/,async route=>route.fulfill({body:await readFile(`artifacts/scroll-profile/baseline.${route.request().url().includes('.js')?'js':'css'}`),contentType:route.request().url().includes('.js')?'text/javascript':'text/css'}));
  if(variant==='candidate') await page.route('**/*',async route=>{
   const request=route.request(),path=new URL(request.url()).pathname;
   const name=path.split('/').at(-1);
   if(['trayn.js','trayn.css','hero-slipstream.svg'].includes(name)) return route.fulfill({body:await readFile(`assets/${name}`),contentType:name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'image/svg+xml'});
   if(request.isNavigationRequest() && request.frame()===page.mainFrame()) {
    const response=await route.fetch();let body=await response.text();
    body=body.replace(/<svg class="hero-stream"[\s\S]*?<\/svg>/,'<div class="hero-stream" aria-hidden="true"><img src="/hero-slipstream.svg" width="1440" height="900" alt="" decoding="async"></div>');
    return route.fulfill({response,body});
   }
   return route.continue();
  });
  await page.addInitScript(()=>{
   window.__profile={longtasks:[],frames:[],refreshes:0};
   new PerformanceObserver(list=>window.__profile.longtasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
  });
  const target=new URL(url);if(variant==='off')target.searchParams.set('motion','off');
  await page.goto(target.href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(async()=>{for(const img of document.querySelectorAll('main img')){img.loading='eager';try{await img.decode()}catch{}}});
  if(variant==='single-mask') await page.addStyleTag({content:'.hero-product .pouch-front{clip-path:none}.hero-product-pose{will-change:transform}.hero-foil,.hero-stream{will-change:transform}'});
  if(variant==='no-stream') await page.addStyleTag({content:'.hero-stream{display:none}'});
  if(variant==='candidate' || new URL(url).hostname==='127.0.0.1') {
   const loaded=await page.locator('.hero-stream img').evaluate(img=>({complete:img.complete,width:img.naturalWidth}));
   if(!loaded.complete || !loaded.width) throw Error('Slipstream artwork did not decode: '+JSON.stringify(loaded));
  }
  await page.waitForTimeout(500);
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate:Number(process.env.PROFILE_CPU || 4)});
  const events=[];cdp.on('Tracing.dataCollected',e=>events.push(...e.value));
  await cdp.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline,blink.user_timing',transferMode:'ReportEvents'});
  const spans=[];
  for(const [section,selector,distance] of [['hero','.hero-story',1900],['purchase','#purchase',650],['mindset','.mindset-poster',900],['packaging','.packaging-art',650],['details','.product-intro',700],['questions','.faq-list',650]]){
   const start=await page.locator(selector).evaluate(el=>Math.max(0,el.getBoundingClientRect().top+scrollY-(innerHeight*.7)));
   await page.evaluate(y=>scrollTo(0,y),start);await page.waitForTimeout(150);
   const before=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
   const sample=await page.evaluate(async({start,distance})=>{
    const frames=[];let previous;const began=performance.now();
    await new Promise(resolve=>{function frame(now){if(previous)frames.push(now-previous);previous=now;const progress=Math.min(1,(now-began)/2000);scrollTo(0,start+distance*progress);if(progress<1)requestAnimationFrame(frame);else resolve()}requestAnimationFrame(frame)});
    return {start:began,end:performance.now(),frames};
   },{start,distance});
   const after=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
   const f=sample.frames.sort((a,b)=>a-b);spans.push({section,start:sample.start,end:sample.end,frames:f.length,p95FrameMs:f[Math.floor(f.length*.95)],maxFrameMs:Math.max(...f),over33ms:f.filter(x=>x>33.5).length,metrics:Object.fromEntries(['LayoutCount','RecalcStyleCount','LayoutDuration','RecalcStyleDuration','ScriptDuration','TaskDuration'].map(k=>[k,after[k]-before[k]]))});
  }
  const done=new Promise(resolve=>cdp.once('Tracing.tracingComplete',resolve));await cdp.send('Tracing.end');await done;
  const totals={};for(const e of events)if(e.ph==='X' && ['Paint','Layout','UpdateLayoutTree','FunctionCall','PrePaint','RasterTask','GPUTask'].includes(e.name)){const key=e.name;totals[key]??={count:0,ms:0};totals[key].count++;totals[key].ms+=(e.dur||0)/1000;}
  const report={label,variant,url:target.href,viewport:'1440x900 @2x',cpuThrottle:Number(process.env.PROFILE_CPU ||4),spans,totals,resources:await page.evaluate(()=>({scripts:[...document.scripts].map(s=>s.src).filter(Boolean),longtasks:window.__profile.longtasks}))};
  await writeFile(`artifacts/scroll-profile/${label}-${variant}.json`,JSON.stringify(report,null,2));
  await writeFile(`artifacts/scroll-profile/${label}-${variant}-trace.json`,JSON.stringify({traceEvents:events}));
  console.log(JSON.stringify({label,variant,spans:spans.map(({start,end,...s})=>s),totals}));await context.close();
 }
}finally{await browser.close()}
