import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import { chromium,webkit } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createRenderer} from '../scripts/preview.mjs';
const chromeOptions={...(process.env.PLAYWRIGHT_CHROME_PATH?{executablePath:process.env.PLAYWRIGHT_CHROME_PATH}:process.platform==='darwin'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:process.platform==='win32'?{channel:'chrome'}:{}),headless:true};
async function mockPage(browser,{width=1280,available=true,failAdd=false,failSection=false,pageType='index',js=true,height=844,reducedMotion='no-preference',mobile=false,retailContent=false,quantityRule={min:1,increment:1,max:null}}={}) {
 const renderer=createRenderer({available,retailContent});renderer.globals.product.variants[0].quantity_rule=quantityRule;let count=0,adds=0,changes=[];
 const context=await browser.newContext({viewport:{width,height},javaScriptEnabled:js,reducedMotion,isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const setCart=()=>{const cart={item_count:count,total_price:count*329900,currency:{iso_code:'INR'},cart_level_discount_applications:[],items:count?[{key:'test-key:abc',product:{title:'TRAYN Whey Belgian Chocolate',handle:'trayn-whey-rich-chocolate',has_only_default_variant:true},variant:{title:'Default Title',quantity_rule:quantityRule},quantity:count,url:'/products/trayn-whey-rich-chocolate',final_line_price:count*329900,properties:[],line_level_discount_allocations:[]}]:[]};Object.assign(renderer.globals.cart,cart);return cart;};
 await context.route('https://theme.test/**',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.pathname.startsWith('/assets/')) {const name=url.pathname.split('/').at(-1);const type=name.endsWith('.css')?'text/css':name.endsWith('.js')?'text/javascript':name.endsWith('.woff2')?'font/woff2':name.endsWith('.svg')?'image/svg+xml':name.endsWith('.webp')?'image/webp':'application/octet-stream';return route.fulfill({body:await readFile(`assets/${name}`),contentType:type});}
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
   assert.equal(await page.locator('html.lenis').count(),width>=900?1:0);
   await page.waitForFunction(()=>document.querySelector('.hero-stream img')?.naturalWidth>0);
   await page.evaluate(()=>document.fonts.ready);
   const headline=await page.locator('.hero-opening h1').evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const rect=range.getBoundingClientRect();return {left:rect.left,right:rect.right,viewport:innerWidth};});
   assert.ok(headline.left>=0&&headline.right<=headline.viewport,'Hero copy must remain inside the viewport');
   if(name==='laptop'||name==='phone'){await mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/homepage-premium-${name}.png`});}
   assert.equal(await page.locator('.pin-spacer').count(),width>=900?2:1);
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
   if(width===390 || width===1280) await page.screenshot({path:`artifacts/cart-filled-${name.replaceAll(' ','-')}.png`});
   await page.locator('[data-cart-remove]').click();
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='0');
   assert.ok(await page.getByText('Your cart is empty.',{exact:true}).isVisible());
   assert.ok(await page.locator('[data-checkout]').isHidden());
   assert.ok(await page.locator('[data-view-cart]').isHidden());
   if(width===390 || width===1280) await page.screenshot({path:`artifacts/cart-empty-${name.replaceAll(' ','-')}.png`});
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
  assert.ok(await fallback.page.locator('[data-quantity-adjust]').first().isHidden());
  assert.equal(await fallback.page.locator('[name=quantity]').getAttribute('type'),'number');
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
  if(failure==='section'){assert.ok(await page.locator('[data-view-cart]').isVisible());assert.ok(await page.locator('[data-cart-content]').isHidden());}
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
   await page.waitForFunction(()=>{const img=document.querySelector('.purchase-flavour-image');return img.complete && img.naturalWidth>0;});await art.evaluate(el=>el.decode());assert.equal(await art.getAttribute('alt'),'Dark chocolate folds sweeping around two fractured chocolate pieces against black');
   assert.equal(await page.locator('.purchase-image-pending').count(),0);
   assert.equal(await art.evaluate(el=>getComputedStyle(el).transform),'none');
   assert.match(await art.getAttribute('src'),/belgian-chocolate-flavour/);
   await page.locator('#purchase').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(150);
   await page.screenshot({path:`artifacts/shop-art-${name.replaceAll(' ','-')}.png`});
   const shop=page.locator('.purchase-section--flavour');
   const bounds=await shop.evaluate(el=>({top:el.getBoundingClientRect().top+scrollY,width:el.getBoundingClientRect().width,height:el.offsetHeight,gallery:el.querySelector('.purchase-gallery').getBoundingClientRect().toJSON(),copy:el.querySelector(innerWidth<900?'.purchase-copy h2':'.purchase-copy').getBoundingClientRect().toJSON(),border:getComputedStyle(el).borderTopWidth}));
   assert.equal(bounds.border,'0px');assert.ok(Math.abs(bounds.gallery.width-bounds.width)<2,JSON.stringify(bounds));
   if(width<900){assert.ok(bounds.gallery.height<=280);assert.ok(bounds.copy.bottom<=bounds.gallery.top+1);}
   else {
    assert.ok(bounds.copy.height<height-80,JSON.stringify(bounds.copy));
    assert.ok(Math.abs((await art.boundingBox()).width/width-.84)<.01);
   }
   const drift=[];
   for(const offset of [-height*.6,bounds.height*.3]){
    await page.evaluate(y=>scrollTo(0,y),bounds.top+offset);await page.waitForTimeout(100);
    drift.push(await shop.evaluate(el=>({art:new DOMMatrix(getComputedStyle(el.querySelector('.purchase-art-stage')).transform).m42,copy:el.querySelector(innerWidth<900?'.purchase-copy h2':'.purchase-copy').getBoundingClientRect().top-el.getBoundingClientRect().top})));
   }
   assert.ok(drift[0].art>drift[1].art);
   assert.ok(drift.every(p=>Math.abs(p.art)<=18.1));assert.ok(Math.abs(drift[0].copy-drift[1].copy)<1);

   await page.waitForFunction(()=>document.querySelector('.mindset-poster').dataset.motionEnd);
   const interval=await page.locator('.mindset-poster').evaluate(el=>({start:Number(el.dataset.motionStart),end:Number(el.dataset.motionEnd),holdStart:Number(el.dataset.holdStart),holdEnd:Number(el.dataset.holdEnd)}));
   assert.equal(interval.holdEnd-interval.holdStart,width>=900?320:210);
   assert.ok(interval.holdStart-interval.start>120,JSON.stringify(interval));
   assert.equal(await page.locator('.mindset-rule').count(),0);
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
    if(phase>.8) {
     const brand=await page.locator('.mindset-brand').evaluate(el=>({bounds:el.getBoundingClientRect().toJSON(),opacity:Number(getComputedStyle(el).opacity)}));
     assert.ok(brand.opacity>.1 && brand.opacity<.2);
     const words=await page.locator('.mindset-word').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().toJSON()));
     for(const word of words)assert.ok(brand.bounds.bottom<=word.top || brand.bounds.top>=word.bottom || brand.bounds.right<=word.left || brand.bounds.left>=word.right,JSON.stringify({brand,word}));
    }
    positions.push(states.map(s=>s.x));
    await page.screenshot({path:`artifacts/mindset-${Math.round(phase*100)}-${name.replaceAll(' ','-')}.png`});
   }
   assert.ok(positions[2][0]-positions[0][0]>(width>=900?200:100));
   assert.ok(positions[0][1]-positions[2][1]>(width>=900?200:100));
   await page.screenshot({path:`artifacts/mindset-mid-${name.replaceAll(' ','-')}.png`});
   await page.evaluate(y=>window.scrollTo(0,y),interval.end+8);await page.waitForTimeout(100);
   assert.equal(await page.locator('.mindset-poster').getAttribute('data-motion-progress'),'1.000');
   assert.equal(await page.locator('.mindset-brand').evaluate(el=>getComputedStyle(el).opacity),'0');
   assert.ok((await page.locator('.mindset-word').evaluateAll(words=>words.map(el=>Math.abs(new DOMMatrix(getComputedStyle(el).transform).m41)))).every(x=>x<1));
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
   assert.equal(await page.locator('.pin-spacer').count(),width>=900?2:1);
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
   assert.equal(await page.locator('.purchase-art-stage').evaluate(el=>getComputedStyle(el).transform),'none');
   assert.equal(await page.locator('html.lenis').count(),0);
   assert.equal(await page.locator('.product-curtain').evaluate(el=>getComputedStyle(el).display),'none');
   if(js){const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(result.violations,[]);}
   assert.deepEqual(errors,[]);await context.close();
  }
 }finally{await browser.close();}
});

test('desktop wheel interpolation, reversal, keyboard, anchors and modal scroll isolation',async()=>{
 const browser=await chromium.launch(chromeOptions);
 try{
  const {page,errors}=await mockPage(browser,{width:1280,available:false});
  await page.waitForFunction(()=>document.documentElement.classList.contains('lenis'));
  await page.waitForTimeout(350);
  await page.mouse.move(600,450);
  await page.evaluate(()=>{window.wheelFrames=[];const end=performance.now()+650;function sample(){window.wheelFrames.push(scrollY);if(performance.now()<end)requestAnimationFrame(sample)}requestAnimationFrame(sample)});
  await page.mouse.wheel(0,360);
  await page.waitForTimeout(700);
  const frames=await page.evaluate(()=>window.wheelFrames);
  assert.ok(new Set(frames.map(Math.round)).size>10,JSON.stringify(frames));
  assert.ok(Math.abs((await page.evaluate(()=>scrollY))-360)<2);
  assert.ok(Math.max(...frames.slice(1).map((y,i)=>Math.abs(y-frames[i])))<150);
  await page.mouse.wheel(0,240);await page.waitForTimeout(50);await page.mouse.wheel(0,-360);await page.waitForTimeout(700);
  assert.ok(Math.abs((await page.evaluate(()=>scrollY))-240)<2);
  await page.mouse.wheel(0,240);await page.keyboard.press('Home');await page.waitForTimeout(500);
  assert.equal(await page.evaluate(()=>scrollY),0);
  await page.locator('.desktop-navigation a').first().click();await page.waitForTimeout(300);
  const purchaseY=await page.locator('#purchase').evaluate(el=>el.getBoundingClientRect().top);
  assert.ok(purchaseY>=70&&purchaseY<110,String(purchaseY));
  await page.locator('[data-cart-open]').click();await page.waitForTimeout(100);
  const bodyY=await page.evaluate(()=>scrollY);
  await page.mouse.move(500,450);await page.mouse.wheel(0,400);await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>scrollY),bodyY);
  await page.keyboard.press('Escape');
  await page.locator('[data-study-inspect]').click();
  await page.getByRole('button',{name:'Zoom In'}).click();
  const canvas=page.locator('.inspector-canvas');await canvas.hover();
  const old=await canvas.evaluate(el=>el.scrollTop),background=await page.evaluate(()=>scrollY);
  await page.mouse.wheel(0,180);await page.waitForTimeout(150);
  assert.ok((await canvas.evaluate(el=>el.scrollTop))>old);
  assert.equal(await page.evaluate(()=>scrollY),background);
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);
  assert.equal(await page.locator('html.lenis').count(),0);
  await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:390,height:844});await page.waitForTimeout(250);
  assert.equal(await page.locator('html.lenis').count(),0);
  await page.setViewportSize({width:1280,height:700});await page.waitForTimeout(250);
  assert.equal(await page.locator('html.lenis').count(),1);
  assert.equal(await page.locator('.pin-spacer').count(),2);
  assert.deepEqual(errors,[]);
 }finally{await browser.close()}
});


for(const [name,engine,options,width] of [['desktop',chromium,chromeOptions,1280],['WebKit phone',webkit,{headless:true},390]]) {
 test(`${name}: brand, bounded quantity steppers, cart focus and return to shop`,async()=>{
  const browser=await engine.launch(options);
  try {
   const {page,errors,state}=await mockPage(browser,{width,height:width<900?600:844,quantityRule:{min:5,increment:5,max:10}});
   const mark=page.locator('.header-brand-mark');
   assert.equal(await mark.evaluate(el=>getComputedStyle(el).maskImage),'none');
   assert.equal(await mark.locator('img').evaluate(el=>getComputedStyle(el).opacity),'1');
   assert.equal(await page.locator('.study-footer img').evaluate(el=>getComputedStyle(el).opacity),'1');
   const quantity=page.locator('[data-product-form] [name=quantity]');
   const minus=page.locator('[data-product-form] [data-quantity-adjust="-1"]');
   const plus=page.locator('[data-product-form] [data-quantity-adjust="1"]');
   assert.equal(await quantity.inputValue(),'5');assert.ok(await minus.isDisabled());
   await plus.focus();await page.keyboard.press('Enter');
   assert.equal(await quantity.inputValue(),'10');assert.ok(await plus.isDisabled());
   await minus.click();assert.equal(await quantity.inputValue(),'5');
   await quantity.fill('7');assert.equal(await quantity.evaluate(el=>el.validity.stepMismatch),true);
   await quantity.fill('5');await page.locator('[data-add-button]').click();
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='5');
   assert.equal(state().count,5);assert.ok(await page.locator('.cart-item-media--flavour img').isVisible());
   assert.ok(await page.locator('[data-view-cart]').isVisible());assert.ok(await page.locator('[data-checkout]').isVisible());
   assert.equal(await page.locator('.cart-totals strong').innerText(),'₹16,495');
   const checkout=await page.locator('[data-checkout]').boundingBox();assert.ok(checkout.y>=0&&checkout.y+checkout.height<=(width<900?600:844));
   const cartQuantity=page.locator('[data-cart-quantity]');
   await cartQuantity.fill('4');assert.equal(await cartQuantity.evaluate(el=>el.validationMessage),'Minimum quantity: 5');
   await cartQuantity.dispatchEvent('change');assert.deepEqual(state().changes,[]);
   await cartQuantity.fill('5');
   const cartPlus=page.locator('#cart-drawer [data-quantity-adjust="1"]');
   await cartPlus.focus();await page.keyboard.press('Enter');
   await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='10');
   assert.ok(await cartPlus.isDisabled());
   await page.waitForFunction(()=>document.activeElement.matches('[data-cart-quantity]'));
   const cartMinus=page.locator('#cart-drawer [data-quantity-adjust="-1"]');
   await cartMinus.focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='5');
   await page.waitForFunction(()=>document.activeElement.dataset.quantityAdjust==='-1');
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(audit.violations,[]);
   await cartMinus.click();await page.waitForFunction(()=>document.querySelector('[data-cart-count]').textContent==='0');
   assert.deepEqual(state().changes,[10,5,0]);assert.ok(await page.locator('[data-view-cart]').isHidden());
   assert.ok(await page.locator('[data-checkout]').isHidden());
   assert.equal(await page.locator('[data-cart-continue]>span').first().innerText(),'Shop Belgian Chocolate');
   await page.locator('[data-cart-continue]').click();
   await page.waitForFunction(()=>!document.querySelector('#cart-drawer').open && document.activeElement.id==='purchase');
   assert.equal(await page.evaluate(()=>location.hash),'#purchase');
   const top=await page.locator('#purchase').evaluate(el=>el.getBoundingClientRect().top);assert.ok(top>=70&&top<110,String(top));
   const scrollBefore=await page.evaluate(()=>scrollY);const cartLink=await page.locator('[data-cart-open]').boundingBox();
   await page.mouse.click(cartLink.x+cartLink.width/2,cartLink.y+cartLink.height/2);
   await page.waitForFunction(()=>document.querySelector('#cart-drawer').open && document.querySelector('[data-cart-status]').textContent==='');
   assert.ok(Math.abs((await page.evaluate(()=>scrollY))-scrollBefore)<1);
   await page.keyboard.press('Escape');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  }finally{await browser.close();}
 });
}

test('TRAYN Nutrition website naming and Shopify amount formatting retain fractions and currency',async()=>{
 for(const [currency,amount,expected] of [['INR',329900,'₹3,299'],['INR',329950,'₹3,299.50'],['USD',329900,'$3,299.00 USD']]) {
  const renderer=createRenderer({currency});renderer.globals.product.variants[0].price=amount;
  renderer.globals.shop.name='Trayn Nutrition';renderer.globals.page_title='Trayn Nutrition';
  const html=await renderer.renderPage();
  assert.match(html,/<title>Premium Whey Protein \| TRAYN Nutrition<\/title>/);
  assert.match(html,/<meta property="og:site_name" content="TRAYN Nutrition">/);
  assert.equal(html.match(/data-product-price>([\s\S]*?)<\/p>/)[1].trim(),expected);
 }
});

for(const [name,engine,options,width,height] of [['Chrome phone',chromium,chromeOptions,390,600],['WebKit phone',webkit,{headless:true},390,844],['WebKit compact',webkit,{headless:true},320,640]]) {
 test(`${name}: native hero handoff, retained motion and an accessible shop entrance`,async()=>{
  const browser=await engine.launch(options);
  try {
   const {page,errors}=await mockPage(browser,{width,height,mobile:true});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>document.querySelector('.hero-story').dataset.scrollEnd);
   const interval=await page.locator('.hero-story').evaluate(el=>({start:Number(el.dataset.scrollStart),end:Number(el.dataset.scrollEnd)}));
   assert.equal(interval.end-interval.start,2040);
   assert.equal(await page.locator('.hero-pin').evaluate(el=>getComputedStyle(el).position),'sticky');
   const poses=[];
   for(const phase of [.2,.55,.9,.35]) {
    await page.evaluate(y=>scrollTo(0,y),interval.start+2040*phase);await page.waitForTimeout(100);
    const state=await page.locator('.hero-story').evaluate(el=>({progress:Number(el.dataset.heroProgress),pin:el.querySelector('.hero-pin').getBoundingClientRect().top,header:document.querySelector('.study-header').offsetHeight,pouch:getComputedStyle(el.querySelector('.hero-product')).transform,stream:getComputedStyle(el.querySelector('.hero-stream')).transform,light:Number(getComputedStyle(el.querySelector('.hero-light')).opacity)}));
    assert.ok(Math.abs(state.progress-phase)<.01);
    assert.ok(Math.abs(state.pin-state.header)<1);
    if(phase===.2)assert.equal(state.light,0);
    if(phase===.55)assert.ok(state.light>.3);
    poses.push(state);
   }
   assert.notEqual(poses[0].pouch,poses[1].pouch);
   assert.notEqual(poses[0].stream,poses[1].stream);
   if(engine===chromium) {
    const session=await page.context().newCDPSession(page);
    const originalHeight=await page.locator('.hero-pin').evaluate(el=>el.offsetHeight);
    await session.send('Emulation.setSmallViewportHeightDifferenceOverride',{difference:100});
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.hero-pin').evaluate(el=>el.offsetHeight),originalHeight);
    const content=await page.locator('.hero-product').evaluate(el=>({height:el.offsetHeight,viewport:innerHeight,header:document.querySelector('.study-header').offsetHeight}));
    assert.ok(Math.abs(content.height-(content.viewport-content.header-100)*.56)<1);
    assert.equal(await page.locator('.hero-story').evaluate(el=>Number(el.dataset.scrollEnd)-Number(el.dataset.scrollStart)),2040);
    await session.send('Emulation.setSmallViewportHeightDifferenceOverride',{difference:0});
    await page.waitForTimeout(100);
   }
   for(const released of [0,60,200]) {
    await page.evaluate(y=>scrollTo(0,y),interval.end+released);await page.waitForTimeout(100);
    const seam=await page.evaluate(()=>({bottom:document.querySelector('.hero-pin').getBoundingClientRect().bottom,next:document.querySelector('#purchase').getBoundingClientRect().top}));
    assert.ok(Math.abs(seam.next-seam.bottom)<1,JSON.stringify(seam));
   }
   await page.locator('#purchase').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(100);
   const shop=await page.locator('#purchase').evaluate(el=>({title:el.querySelector('h2').getBoundingClientRect().toJSON(),art:el.querySelector('.purchase-gallery').getBoundingClientRect().toJSON(),button:el.querySelector('[data-add-button]').getBoundingClientRect().toJSON(),header:document.querySelector('.study-header').offsetHeight}));
   assert.ok(shop.title.top>=shop.header);
   assert.ok(shop.title.bottom<=shop.art.top+1);
   assert.ok(shop.button.bottom<=height,JSON.stringify(shop));
   const entranceY=await page.locator('#purchase').evaluate(el=>el.getBoundingClientRect().top+scrollY-innerHeight*.55);
   await page.evaluate(y=>scrollTo(0,y),entranceY);await page.waitForTimeout(100);
   const before=await page.locator('.purchase-art-stage').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).m41);
   assert.ok(before>5);
   await page.locator('[data-product-form] [name=quantity]').focus();
   const settled=await page.locator('.purchase-art-stage').evaluate(el=>{const m=new DOMMatrix(getComputedStyle(el).transform);return[m.a,m.d,m.m41,m.m42];});
   assert.deepEqual(settled,[1,1,0,0]);
   await page.setViewportSize({width:844,height:390});await page.waitForTimeout(300);
   assert.equal(await page.locator('body.has-hero-motion').count(),0);
   await page.setViewportSize({width,height});await page.waitForTimeout(300);
   assert.equal(await page.locator('.hero-pin').evaluate(el=>getComputedStyle(el).position),'sticky');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(errors,[]);
  }finally{await browser.close();}
 });
}

for(const [name,engine,options,width]of [['desktop',chromium,chromeOptions,1280],['Chrome phone',chromium,chromeOptions,390],['WebKit phone',webkit,{headless:true},390]]) {
 test(`prepared retail product: ${name} gallery keyboard control, details and accessibility`,async()=>{
  const browser=await engine.launch(options);
  try{
   const {page,errors}=await mockPage(browser,{pageType:'product',retailContent:true,width,height:900,available:false});
   await page.waitForFunction(()=>document.querySelector('.retail-media-panel img')?.naturalWidth>0);
   const gallerySize=await page.locator('.retail-gallery').evaluate(el=>({gallery:el.getBoundingClientRect().width,parent:el.parentElement.getBoundingClientRect().width}));
   assert.ok(Math.abs(gallerySize.gallery-gallerySize.parent)<2,'Gallery must fill the available product column on every viewport');
   assert.equal(await page.locator('.retail-media-panel:visible').count(),1);
   assert.match(await page.locator('.retail-media-panel:visible img').getAttribute('src'),/front-retail/);
   const radios=page.getByRole('radio');await radios.nth(0).focus();await page.keyboard.press('ArrowRight');
   assert.ok(await radios.nth(1).isChecked());
   assert.match(await page.locator('.retail-media-panel:visible img').getAttribute('src'),/back-manufacturer-blank/);
   await page.keyboard.press('ArrowRight');assert.ok(await radios.nth(2).isChecked());
   assert.match(await page.locator('.retail-media-panel:visible img').getAttribute('src'),/label-manufacturer-blank/);
   await radios.nth(0).focus();await page.keyboard.press('Space');
   await page.evaluate(()=>window.scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);
   await mkdir('artifacts',{recursive:true});await page.screenshot({path:`artifacts/retail-product-${name.replaceAll(' ','-')}.png`});
   await page.locator('.retail-product-detail summary').first().click();
   assert.ok(await page.locator('.retail-product-detail').first().evaluate(el=>el.open));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,[]);
   assert.deepEqual(errors,[]);
   if(name==='desktop'){
    const nojs=await mockPage(browser,{pageType:'product',retailContent:true,js:false,available:false,width:390});
    await nojs.page.getByRole('radio').nth(0).focus();await nojs.page.keyboard.press('ArrowRight');
    assert.ok(await nojs.page.getByRole('radio').nth(1).isChecked());
    await nojs.page.locator('.retail-product-detail summary').last().click();
    assert.ok(await nojs.page.locator('.retail-product-detail').last().evaluate(el=>el.open));
    await nojs.context.close();
   }
  }finally{await browser.close();}
 });
}
