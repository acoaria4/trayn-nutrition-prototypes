import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir} from 'node:fs/promises';
import {chromiumOptions} from '../scripts/browser-options.mjs';
const origin=process.env.TEST_URL||'http://127.0.0.1:4184/';
const engine=process.env.BROWSER==='webkit'?webkit:chromium;
let browser;
before(async()=>{browser=await engine.launch(engine===chromium?chromiumOptions():{headless:true});await mkdir('artifacts',{recursive:true});});
after(async()=>browser?.close());
async function open(options={},query=''){
 const context=await browser.newContext(options),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()}: ${r.url()}`);});
 await page.goto(origin+query,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 return{context,page,errors};
}
async function anchor(page,id){await page.locator(id).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.waitForTimeout(150);}
for(const [name,width,height]of[['desktop',1440,900],['laptop',1280,650],['phone',390,844],['small-phone',320,640],['large-phone',430,932],['tablet',768,1024]]){
 test(`${name}: native hero geometry, readable chapters and bounded media`,async()=>{
 const{context,page,errors}=await open({viewport:{width,height},hasTouch:width<800});
 await page.waitForFunction(()=>document.querySelector('.hero-story').dataset.distance==='2040');
 const geometry=await page.evaluate(()=>{const story=document.querySelector('.hero-story'),stage=document.querySelector('.hero-stage'),header=document.querySelector('.header');return{distance:Number(story.dataset.end)-Number(story.dataset.start),height:story.offsetHeight-stage.offsetHeight,fill:stage.offsetHeight+header.offsetHeight-innerHeight,fonts:document.fonts.check('800 40px Manrope')&&document.fonts.check('800 40px Barlow')};});
 assert.equal(geometry.distance,2040);assert.equal(geometry.height,2040);assert.ok(Math.abs(geometry.fill)<=1);assert.equal(geometry.fonts,true);
 await page.screenshot({path:`artifacts/verified-${name}-hero.png`});
 await page.evaluate(()=>scrollTo(0,1500));await page.waitForTimeout(200);await page.screenshot({path:`artifacts/verified-${name}-fuel.png`});
 for(const id of ['#mindset','#flavour','#packaging','#product','#questions','#contact']){await anchor(page,id);assert.ok(await page.locator(`${id} h2`).isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${id} overflows`);const media=await page.evaluate(()=>[...document.querySelectorAll('video')].filter(v=>!v.paused).length);assert.ok(media<=1,'Only one decorative film may play');await page.screenshot({path:`artifacts/verified-${name}-${id.slice(1)}.png`});}
 assert.deepEqual(errors,[]);await context.close();
 });
}
test('3D controls, canvas handoff, expanded inspection and source label',async()=>{
 const{context,page,errors}=await open({viewport:{width:1280,height:800}});await page.waitForFunction(()=>document.body.dataset.sceneReady==='true',{timeout:20000});
 await anchor(page,'#packaging');await page.locator('[data-view=back]').click();await page.waitForTimeout(100);assert.equal(await page.locator('canvas').count(),1);assert.equal(await page.locator('.inspect-stage.is-ready canvas').count(),1);assert.equal(await page.locator('[data-view=back]').getAttribute('aria-pressed'),'true');
 await page.locator('#pack-rotation').fill('90');await page.locator('[data-zoom=in]').click();await page.locator('[data-light]').click();assert.equal(await page.locator('[data-light]').getAttribute('aria-pressed'),'true');
 await page.locator('canvas').focus();await page.keyboard.press('ArrowLeft');assert.ok(Number(await page.locator('#pack-rotation').inputValue())<90);await page.keyboard.press('Home');assert.equal(await page.locator('#pack-rotation').inputValue(),'0');
 await page.locator('[data-view=detail]').click();await page.screenshot({path:'artifacts/verified-inspection-detail.png'});
 await page.locator('[data-fullscreen]').click();assert.equal(await page.locator('.scene-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('.scene-dialog').evaluate(el=>el.open),false);await page.locator('.packaging>.inspection-layout').waitFor();
 await anchor(page,'#questions');await anchor(page,'#packaging');await page.locator('[data-view=front]').click();assert.equal(await page.locator('.inspect-stage.is-ready canvas').count(),1);
 await page.locator('.inspection-copy [data-open-label]').click();assert.equal(await page.locator('#label-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');assert.equal(await page.locator('.inspection-copy [data-open-label]').evaluate(el=>el===document.activeElement),true);
 // Context loss must restore a visible image and leave the source label usable.
 await page.locator('canvas').evaluate(el=>el.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.waitForTimeout(150);assert.equal(await page.locator('.inspect-stage').evaluate(el=>el.classList.contains('is-ready')),false);assert.equal(await page.locator('.inspect-stage>.scene-fallback').isVisible(),true);
 assert.deepEqual(errors,[]);await context.close();
});
test('Touch inspection, menu, tab keyboard and FAQ disclosures',async()=>{
 const{context,page,errors}=await open({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await page.waitForFunction(()=>document.body.dataset.sceneReady==='true');
 await page.locator('.mobile-menu summary').click();await page.locator('.mobile-menu a[href="#product"]').click();assert.equal(await page.locator('.mobile-menu').evaluate(el=>el.open),false);
 await page.locator('[data-tab=nutrition]').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#ingredients').isVisible(),true);assert.equal(await page.locator('#nutrition').isVisible(),false);await page.keyboard.press('End');assert.equal(await page.locator('#use').isVisible(),true);
 await anchor(page,'#packaging');await page.locator('[data-view=front]').click();await page.locator('canvas').evaluate(el=>el.scrollIntoView({block:'center'}));await page.waitForTimeout(150);const box=await page.locator('canvas').boundingBox();await page.mouse.move(box.x+box.width*.35,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.65,box.y+box.height*.5,{steps:8});await page.mouse.up();assert.ok(Math.abs(Number(await page.locator('#pack-rotation').inputValue()))>30);
 await anchor(page,'#questions');await page.locator('.question-list summary').last().click();assert.equal(await page.locator('.question-list details').last().evaluate(el=>el.open),true);await page.screenshot({path:'artifacts/verified-phone-questions-open.png'});
 assert.deepEqual(errors,[]);await context.close();
});
test('Reduced motion, no WebGL, and no-JavaScript retain content',async()=>{
 for(const options of [{reducedMotion:'reduce'}, {javaScriptEnabled:false}]){
 const{context,page,errors}=await open({viewport:{width:390,height:844},...options},'?no3d=1');assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('has-hero-motion')),false);for(const id of ['#mindset','#packaging','#ingredients','#use','#questions']){if(options.javaScriptEnabled===false)assert.equal(await page.locator(id).isVisible(),true);}assert.equal(await page.locator('canvas').count(),0);assert.equal(await page.locator('.inspect-stage>.scene-fallback').isVisible(),true);assert.deepEqual(errors,[]);await context.close();
 }
 const{context,page}=await open({viewport:{width:1280,height:800}},'?no3d=1');await anchor(page,'#packaging');await page.locator('[data-view=back]').click();assert.match(await page.locator('.inspect-stage img').getAttribute('src'),/pouch-back/);await context.close();
});
test('Motion pause does not collapse layout or interrupt native scroll',async()=>{
 const{context,page}=await open({viewport:{width:1280,height:800}});await page.waitForFunction(()=>document.body.dataset.sceneReady==='true');await page.evaluate(()=>scrollTo(0,1000));await page.waitForTimeout(200);const before=await page.locator('.hero-story').evaluate(el=>el.offsetHeight);await page.locator('.motion-switch').evaluate(el=>el.focus({preventScroll:true}));await page.keyboard.press('Space');assert.equal(await page.locator('.hero-story').evaluate(el=>el.offsetHeight),before);assert.ok(Math.abs(await page.evaluate(()=>scrollY)-1000)<2);await anchor(page,'#mindset');assert.ok(await page.evaluate(()=>scrollY)>2040);await page.locator('.motion-switch').evaluate(el=>el.focus({preventScroll:true}));await page.keyboard.press('Space');assert.equal(await page.locator('.motion-switch').getAttribute('aria-pressed'),'false');await context.close();
});
test('Accessible reading and interaction surfaces',async()=>{
 const{context,page}=await open({viewport:{width:390,height:844}});for(const id of ['#mindset','#packaging','#product','#questions']){await anchor(page,id);const result=await new AxeBuilder({page}).include(id).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations.map(v=>({id:v.id,description:v.description,nodes:v.nodes.map(n=>n.target)})),[],id);}
 await context.close();
});
