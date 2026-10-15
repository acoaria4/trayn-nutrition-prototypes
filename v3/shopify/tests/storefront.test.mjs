import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import { chromium,webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createRenderer} from '../scripts/preview.mjs';
const chromeOptions={executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true};
async function mockPage(browser,{width=1280,available=true,failAdd=false,failSection=false,pageType='index',js=true,height=844,reducedMotion='no-preference'}={}) {
 const renderer=createRenderer({available});let count=0,adds=0,changes=[];
 const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:js,reducedMotion});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const setCart=()=>{const cart={item_count:count,total_price:count*329900,currency:{iso_code:'INR'},cart_level_discount_applications:[],items:count?[{key:'test-key:abc',product:{title:'TRAYN Whey Belgian Chocolate',has_only_default_variant:true},variant:{title:'Default Title',quantity_rule:{increment:1}},quantity:count,url:'/products/trayn-whey-rich-chocolate',final_line_price:count*329900,properties:[],line_level_discount_allocations:[]}]:[]};Object.assign(renderer.globals.cart,cart);return cart;};
 await context.route('https://theme.test/**',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.pathname.startsWith('/assets/')) {const name=url.pathname.split('/').at(-1);const type=name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':name.endsWith('.woff2')?'font/woff2':name.endsWith('.webp')?'image/webp':'application/octet-stream';return route.fulfill({body:await readFile(`assets/${name}`),contentType:type});}
  if(url.pathname==='/cart/add.js') {adds++;if(failAdd)return route.fulfill({status:422,json:{description:'The requested quantity is not available.'}});await new Promise(r=>setTimeout(r,60));count+=Number(request.postData()?.match(/name="quantity"\r\n\r\n(\d+)/)?.[1]||1);return route.fulfill({json:{items:[{id:51737000116512}]}});}
  if(url.pathname==='/cart/change.js') {const body=request.postDataJSON();assert.equal(body.id,'test-key:abc');changes.push(body.quantity);count=body.quantity;return route.fulfill({json:setCart()});}
  if(url.pathname==='/cart.js') return route.fulfill({json:setCart()});
  if(url.searchParams.has('section_id')) {if(failSection)return route.fulfill({status:500,body:'Error'});setCart();return route.fulfill({body:await renderer.engine.renderFile('sections/cart-content.liquid'),contentType:'text/html'});}
  return route.fulfill({body:await renderer.renderPage(pageType),contentType:'text/html'});
 });
 await page.goto(`https://theme.test/${pageType==='product'?'products/trayn-whey-rich-chocolate':''}`);
 if(js) await page.waitForFunction(()=>document.querySelector('[data-purchase]')?.dataset.commerceReady==='true' || document.querySelector('.cart-page'));
 return {page,context,errors,state:()=>({count,adds,changes})};
}
for(const [name,engine,options,width] of [['desktop',chromium,chromeOptions,1440],['laptop',chromium,chromeOptions,1280],['tablet',chromium,chromeOptions,768],['phone',chromium,chromeOptions,390],['compact',chromium,chromeOptions,320],['WebKit phone',webkit,{headless:true},390],['WebKit compact',webkit,{headless:true},320]]) {
 test(`${name}: hero pacing, purchase, cart edit/remove, focus and overflow`,async()=> {
  const browser=await engine.launch(options);
  try {
   const {page,context,errors,state}=await mockPage(browser,{width});
   await page.waitForFunction(()=>document.querySelector('.hero-story').dataset.scrollDistance==='2040');
   assert.equal(await page.locator('.pin-spacer').count(),2);
   await page.locator('[data-study-inspect]').click();
   await page.getByRole('button',{name:'Back Label',exact:true}).click();
   assert.ok((await page.locator('[data-inspector-image]').getAttribute('src')).includes('.webp?v='));
   await page.keyboard.press('Escape');
   await page.locator('.desktop-navigation a').first().evaluate(el=>el.click());
   await page.waitForTimeout(150);
   assert.ok((await page.locator('#purchase').boundingBox()).y>=65);
   assert.ok(Math.abs((await page.locator('.study-header').boundingBox()).y)<1);
   await page.locator('[data-product-form] [name=quantity]').fill('2');
   const add=page.locator('[data-add-button]');await add.click();
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='2');
   assert.equal(state().adds,1);
   assert.ok(await page.locator('#cart-drawer').evaluate(el=>el.open));
   await page.locator('[data-cart-quantity]').fill('3');await page.locator('[data-cart-quantity]').dispatchEvent('change');
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='3');
   assert.deepEqual(state().changes,[3]);
   await page.locator('[data-cart-remove]').click();
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='0');
   assert.ok(await page.getByText('Your cart is empty.',{exact:true}).isVisible());
   assert.ok(await page.locator('[data-checkout]').isHidden());
   await page.keyboard.press('Escape');
   await page.waitForFunction(()=>!document.querySelector('#cart-drawer').open);
   await page.waitForFunction(()=>document.activeElement===document.querySelector('[data-add-button]'));
   const layout=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,hero:document.querySelector('.hero-scene').offsetHeight,header:document.querySelector('.study-header').offsetHeight,height:innerHeight}));
   assert.equal(layout.overflow,false);assert.ok(Math.abs(layout.hero-(layout.height-layout.header))<2);
   assert.deepEqual(errors,[]);
   if(width===390 || width===1280){await mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/purchase-${name.replaceAll(' ','-')}.png`});}
   await context.close();
  } finally {await browser.close();}
 });
}
test('sold-out variants, product page, accessibility and no-JavaScript forms',async()=>{
 const browser=await chromium.launch(chromeOptions);
 try {
  const {page,context,errors}=await mockPage(browser,{pageType:'product',available:false});
  assert.ok(await page.locator('[data-add-button]').isDisabled());
  assert.equal(await page.locator('h1').textContent(),'TRAYN Whey Belgian Chocolate');
  assert.equal(await page.locator('.hero-story').count(),0);
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations,[]);
  assert.deepEqual(errors,[]);await context.close();
  const fallback=await mockPage(browser,{pageType:'product',js:false});
  assert.equal(await fallback.page.locator('[data-product-form]').getAttribute('action'),'/cart/add');
  assert.equal(await fallback.page.locator('[name=id]').inputValue(),'51737000116512');
  assert.ok(await fallback.page.locator('[data-add-button]').isEnabled());
  await fallback.context.close();
 } finally {await browser.close();}
});
for(const failure of ['stock','section']) test(`cart ${failure} failure is readable and does not duplicate additions`,async()=>{
 const browser=await chromium.launch(chromeOptions);
 try {
  const {page,state}=await mockPage(browser,{pageType:'product',failAdd:failure==='stock',failSection:failure==='section'});
  await page.locator('[data-add-button]').click();
  const text=failure==='stock'?'The requested quantity is not available.':'Added to your cart. Use View cart to review it.';
  await page.waitForFunction(text=>document.querySelector('[data-purchase-status]').textContent===text,text);
  assert.equal(state().adds,1);assert.equal(state().count,failure==='stock'?0:1);
  assert.ok(await page.locator('[data-add-button]').isEnabled());
 } finally {await browser.close();}
});
for(const [name,engine,options,width,height] of [['desktop',chromium,chromeOptions,1440,900],['short laptop',chromium,chromeOptions,1280,650],['tablet',chromium,chromeOptions,768,1024],['short phone',chromium,chromeOptions,390,600],['compact WebKit',webkit,{headless:true},320,640],['phone WebKit',webkit,{headless:true},390,844]]) {
 test(`${name}: shop artwork and motion stay visible during the scroll`,async()=> {
  const browser=await engine.launch(options);
  try {
   const {page,errors}=await mockPage(browser,{width,height,available:false});
   await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
   const art=page.locator('.purchase-flavour-image');
   await page.locator('#purchase').evaluate(el=>el.scrollIntoView());
   await page.waitForFunction(()=>{const img=document.querySelector('.purchase-flavour-image');return img.complete && img.naturalWidth>0;});assert.equal(await art.getAttribute('alt'),'Dark chocolate pieces with a glossy chocolate ribbon and cocoa on a dark surface');
   assert.equal(await page.locator('.purchase-image-pending').count(),0);
   assert.equal(await art.evaluate(el=>getComputedStyle(el).transform),'none');
   assert.match(await art.getAttribute('src'),/belgian-chocolate-flavour/);
   await page.locator('#purchase').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(150);
   await page.screenshot({path:`artifacts/shop-art-${name.replaceAll(' ','-')}.png`});
   await page.waitForFunction(()=>document.querySelector('.mindset-poster').dataset.motionEnd);
   const interval=await page.locator('.mindset-poster').evaluate(el=>({start:Number(el.dataset.motionStart),end:Number(el.dataset.motionEnd)}));
   assert.ok(interval.end-interval.start>(width>=900?780:540),JSON.stringify(interval));
   const positions=[];
   for(const phase of [.1,.5,.85]) {
    await page.evaluate(y=>window.scrollTo(0,y),interval.start+(interval.end-interval.start)*phase);await page.waitForTimeout(100);
    const states=await page.locator('.mindset-word').evaluateAll(words=>words.map(el=>({x:new DOMMatrix(getComputedStyle(el).transform).m41,progress:Number(el.dataset.motionProgress),top:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,header:document.querySelector('.study-header').offsetHeight})));
    for(const [index,state] of states.entries()) {
     assert.ok(Math.abs(state.progress-phase)<.04,JSON.stringify({phase,state}));
     assert.ok(state.top>state.header+10 && state.top<height-24,JSON.stringify(state));
     if(index===0 || phase>.8) assert.ok(state.bottom<height-24,JSON.stringify(state));
    }
    assert.equal(states[0].progress,states[1].progress);
    positions.push(states.map(s=>s.x));
    await page.screenshot({path:`artifacts/mindset-${Math.round(phase*100)}-${name.replaceAll(' ','-')}.png`});
   }
   assert.ok(positions[2][0]-positions[0][0]>(width>=900?210:100));
   assert.ok(positions[0][1]-positions[2][1]>(width>=900?210:100));
   await page.screenshot({path:`artifacts/mindset-mid-${name.replaceAll(' ','-')}.png`});
   await page.evaluate(y=>window.scrollTo(0,y),interval.end+8);await page.waitForTimeout(100);
   assert.equal(await page.locator('.mindset-poster').getAttribute('data-motion-progress'),'1.000');
   assert.ok((await page.locator('.mindset-poster').boundingBox()).y>60);
   await page.evaluate(y=>window.scrollTo(0,y),interval.start+(interval.end-interval.start)*.35);await page.waitForTimeout(100);
   const reverse=await page.locator('.mindset-word').evaluateAll(words=>words.map(el=>({x:new DOMMatrix(getComputedStyle(el).transform).m41,progress:Number(el.dataset.motionProgress)})));
   assert.ok(Math.abs(reverse[0].progress-.35)<.04);
   assert.equal(reverse[0].progress,reverse[1].progress);
   assert.ok(reverse[0].x<positions[1][0] && reverse[1].x>positions[1][1]);
   const redMidpoint=await page.locator('.product-intro').evaluate(el=>{const header=document.querySelector('.study-header').offsetHeight;return el.getBoundingClientRect().top+scrollY-header-(innerHeight-header)*.48;});
   await page.evaluate(y=>window.scrollTo(0,y),redMidpoint);await page.waitForTimeout(120);
   const product=page.locator('.product-section');
   const progress=await product.evaluate(el=>Number(el.dataset.takeoverProgress));
   assert.ok(progress>.35&&progress<.65,String(progress));
   const introY=(await page.locator('.product-intro').boundingBox()).y;assert.ok(introY>height*.3&&introY<height*.65);
   await page.locator('.product-intro h2').dispatchEvent('pointerdown',{pointerType:'touch'});
   assert.equal(await product.evaluate(el=>Number(el.dataset.takeoverProgress)),progress);
   await page.screenshot({path:`artifacts/red-mid-${name.replaceAll(' ','-')}.png`});
   await page.locator('.label-tabs a').first().focus();
   assert.equal(await product.getAttribute('data-takeover-progress'),'1');
   assert.equal(await page.locator('.pin-spacer').count(),2);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  } finally {await browser.close();}
 });
}
test('reduced motion and no JavaScript retain the shop artwork and readable label',async()=>{
 const browser=await chromium.launch(chromeOptions);
 try {
  for(const js of [true,false]) {
   const {page,context,errors}=await mockPage(browser,{width:390,reducedMotion:'reduce',js});
   await page.locator('#purchase').evaluate(el=>el.scrollIntoView());
   await page.waitForFunction(()=>{const img=document.querySelector('.purchase-flavour-image');return img.complete && img.naturalWidth>0;});
   assert.equal(await page.locator('.pin-spacer').count(),0);
   assert.equal(await page.locator('.product-curtain').evaluate(el=>getComputedStyle(el).display),'none');
   if(js){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations,[]);}
   assert.deepEqual(errors,[]);await context.close();
  }
 }finally{await browser.close();}
});
