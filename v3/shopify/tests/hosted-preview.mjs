// Read-only verification of the selected preview or published storefront.
import assert from 'node:assert/strict';
import {chromium,webkit} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const preview=process.env.SHOPIFY_TEST_URL || 'https://trayn-nutrition.myshopify.com?preview_theme_id=192540770592';
const expectedRole=process.env.SHOPIFY_TEST_ROLE || 'unpublished';
const expectedTheme=Number(process.env.SHOPIFY_TEST_THEME_ID || 192540770592);
await mkdir('artifacts',{recursive:true});
async function checkAvailability(page) {
 const expected=await page.locator('[data-product-form]').evaluate(form=>form.querySelector('[data-variant-select]').selectedOptions[0].dataset.available!=='true' || form.dataset.requiresSellingPlan==='true');
 assert.equal(await page.locator('[data-add-button]').isDisabled(),expected);
}
for(const [name,engine,options,width,height] of [['desktop',chromium,{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'},1280,650],['mobile',webkit,{},390,844]]) {
 if(process.env.SHOPIFY_TEST_DEVICE && process.env.SHOPIFY_TEST_DEVICE!==name) continue;
 const browser=await engine.launch({...options,headless:true});
 try {
  const page=await browser.newPage({viewport:{width,height}});page.setDefaultTimeout(30000);page.setDefaultNavigationTimeout(30000);
  const errors=[],analyticsBlocked=[],badAssets=[];
  page.on('pageerror',e=>{
   if(/^\/(monorail-edge|error-analytics-sessions-production)\.shopifysvc\.com\/.*due to access control checks\.$/.test(e.message) || /^\/traynnutrition\.com\/api\/event\/collect due to access control checks\.$/.test(e.message)) analyticsBlocked.push(e.message);
   else errors.push(e.message);
  });
  page.on('response',r=>{if(r.status()>=400 && /\/assets\/(trayn|barlow|manrope|belgian|tension)/.test(r.url()))badAssets.push(r.url());});
  const response=await page.goto(preview,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.querySelector('.hero-story')?.dataset.scrollDistance==='2040');
  assert.equal(await page.evaluate(()=>Shopify.theme.id),expectedTheme);
  assert.equal(await page.evaluate(()=>Shopify.theme.role),expectedRole);
  if(process.env.SHOPIFY_TEST_BRAND_CART==='1') {
   assert.equal(await page.locator('body').getAttribute('data-local-preview'),null);
   assert.equal(await page.locator('[data-checkout]').isDisabled(),false);
   assert.match(await page.title(),/TRAYN Nutrition/);assert.doesNotMatch(await page.title(),/Trayn Nutrition/);
   assert.equal(await page.locator('meta[property="og:site_name"]').getAttribute('content'),'TRAYN Nutrition');
   const logo=await page.locator('.header-brand-mark').evaluate(el=>({mask:getComputedStyle(el).maskImage,opacity:getComputedStyle(el.querySelector('img')).opacity,src:el.querySelector('img').currentSrc}));
   assert.equal(logo.mask,'none');assert.equal(logo.opacity,'1');
   assert.equal((await page.request.get(logo.src)).status(),200);
   assert.equal(await page.locator('.study-footer img').evaluate(el=>getComputedStyle(el).opacity),'1');
  }
  if(process.env.SHOPIFY_TEST_PERFORMANCE==='1') {
   await page.waitForFunction(()=>document.querySelector('.hero-stream img')?.naturalWidth>0);
   assert.equal(await page.locator('html.lenis').count(),width>=900?1:0);
   await page.screenshot({path:`artifacts/scroll-profile/hosted-hero-${name}.png`});
   if(width>=900){await page.mouse.move(600,420);await page.mouse.wheel(0,240);await page.waitForTimeout(750);assert.ok(Math.abs((await page.evaluate(()=>scrollY))-240)<2);}
  }
  await page.locator('#purchase').evaluate(el=>el.scrollIntoView());
  await page.waitForFunction(()=>{const img=document.querySelector('.purchase-flavour-image');return img?.complete && img.naturalWidth>0;});
  assert.match(await page.locator('.purchase-flavour-image').getAttribute('src'),/belgian-chocolate-flavour/);
  if(process.env.SHOPIFY_TEST_SCENE==='1') {
   await page.locator('.purchase-flavour-image').evaluate(async img=>{
    for(let attempt=0;attempt<3;attempt++){
     const source=img.currentSrc;
     try{await img.decode();if(source===img.currentSrc)break;}
     catch(error){if(attempt===2)throw error;}
    }
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   });
   assert.match(await page.locator('.purchase-flavour-image').getAttribute('src'),/flavour-flow/);
   const scene=await page.locator('.purchase-section--flavour').evaluate(el=>({gallery:el.querySelector('.purchase-gallery').getBoundingClientRect().toJSON(),copy:el.querySelector(innerWidth<900?'.purchase-copy h2':'.purchase-copy').getBoundingClientRect().toJSON(),border:getComputedStyle(el).borderTopWidth}));
   assert.equal(scene.border,'0px');assert.ok(Math.abs(scene.gallery.width-width)<2);
   if(width<900){assert.ok(scene.gallery.height<=280);assert.ok(scene.copy.bottom<=scene.gallery.top+1);}
   await page.screenshot({path:`artifacts/shopify-${name}-flavour-flow.png`});
  }
  await page.waitForFunction(()=>document.querySelector('.mindset-poster').dataset.motionEnd);
  const interval=await page.locator('.mindset-poster').evaluate(el=>({start:Number(el.dataset.motionStart),end:Number(el.dataset.motionEnd),holdStart:Number(el.dataset.holdStart),holdEnd:Number(el.dataset.holdEnd)}));
  assert.equal(interval.holdEnd-interval.holdStart,width>=900?320:210);
  assert.equal(await page.locator('.mindset-rule').count(),0);
  assert.ok(interval.end-interval.start>(width>=900?440:330));
  const positions=[];
  for(const phase of [.1,.5,.85]) {
   await page.evaluate(y=>window.scrollTo(0,y),interval.start+(interval.end-interval.start)*phase);await page.waitForTimeout(120);
   const states=await page.locator('.mindset-word').evaluateAll(words=>words.map(el=>({x:new DOMMatrix(getComputedStyle(el).transform).m41,progress:Number(el.dataset.motionProgress),y:el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom,header:document.querySelector('.study-header').offsetHeight})));
   assert.equal(states[0].progress,states[1].progress);assert.ok(Math.abs(states[0].progress-phase)<.05);
   if(phase>.8) {
    const brand=await page.locator('.mindset-brand').evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),bounds:el.getBoundingClientRect().toJSON()}));
    assert.ok(brand.opacity>.1 && brand.opacity<.2);
    const words=await page.locator('.mindset-word').evaluateAll(elements=>elements.map(el=>el.getBoundingClientRect().toJSON()));
    for(const word of words)assert.ok(brand.bounds.bottom<=word.top || brand.bounds.top>=word.bottom || brand.bounds.right<=word.left || brand.bounds.left>=word.right);
   }
   assert.ok(states[0].y>states[0].header+10 && states[1].y<height-24);
   if(phase>.8) assert.ok(states.every(s=>s.bottom<height-24));
   positions.push(states.map(s=>s.x));
   await page.screenshot({path:`artifacts/shopify-${name}-mindset-${Math.round(phase*100)}.png`});
  }
  assert.ok(positions[2][0]-positions[0][0]>(width>=900?200:100));
  assert.ok(positions[0][1]-positions[2][1]>(width>=900?200:100));
  assert.equal(await page.locator('.pin-spacer').count(),width>=900?2:1);
  await page.screenshot({path:`artifacts/shopify-${name}-mindset.png`});
  const redY=await page.locator('.product-intro').evaluate(el=>{const header=document.querySelector('.study-header').offsetHeight;return el.getBoundingClientRect().top+scrollY-header-(innerHeight-header)*.48;});
  await page.evaluate(y=>window.scrollTo(0,y),redY);await page.waitForTimeout(120);
  assert.ok(Math.abs(Number(await page.locator('.product-section').getAttribute('data-takeover-progress'))-.5)<.05);
  await page.screenshot({path:`artifacts/shopify-${name}-red-reveal.png`});
  await page.locator('[data-study-inspect]').click();
  await page.getByRole('button',{name:'Back Label',exact:true}).click();
  await page.locator('[data-inspector-image]').evaluate(img=>img.decode());
  assert.match(await page.locator('[data-inspector-image]').getAttribute('src'),/\.webp\?/);
  await page.keyboard.press('Escape');
  await page.locator('#purchase').evaluate(el=>el.scrollIntoView());await page.waitForTimeout(200);
  assert.ok(Math.abs((await page.locator('.study-header').boundingBox()).y)<1);
  await checkAvailability(page);
  if(process.env.SHOPIFY_TEST_BRAND_CART==='1') {
   const input=page.locator('[data-product-form] [name=quantity]');
   const initial=Number(await input.inputValue());
   const plus=page.locator('[data-product-form] [data-quantity-adjust="1"]');
   if(await plus.isEnabled()) {
    const increment=Number(await input.getAttribute('step'));
    await plus.click();assert.equal(Number(await input.inputValue()),initial+increment);
    await page.locator('[data-product-form] [data-quantity-adjust="-1"]').click();assert.equal(Number(await input.inputValue()),initial);
   }
   const expectedPrice=await page.locator('[data-variant-select]').evaluate(el=>el.selectedOptions[0].dataset.price);
   assert.equal((await page.locator('[data-product-price]').innerText()).trim(),expectedPrice);
  }
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`artifacts/shopify-${name}-purchase.png`});
  await page.locator('[data-cart-open]').click();
  await page.waitForFunction(()=>document.querySelector('[data-cart-status]').textContent==='');
  assert.ok(await page.locator('#cart-drawer').evaluate(el=>el.open));
  assert.ok(await page.locator('[data-checkout]').isHidden());
  if(process.env.SHOPIFY_TEST_BRAND_CART==='1') {
   assert.ok(await page.locator('[data-view-cart]').isHidden());
   assert.ok(await page.locator('[data-cart-continue]').isVisible());
   assert.match(await page.locator('[data-cart-continue]').innerText(),/Shop (Belgian Chocolate|TRAYN)/);
   await page.waitForTimeout(280);
   await page.screenshot({path:`artifacts/shopify-${name}-brand-cart-empty.png`});
   await page.locator('[data-cart-continue]').click();
   await page.waitForFunction(()=>!document.querySelector('#cart-drawer').open && document.activeElement.id==='purchase');
  }
  await page.keyboard.press('Escape');
  await page.locator('#product').evaluate(el=>el.scrollIntoView());
  await page.locator('#full-nutrition summary').click();
  assert.ok(await page.locator('#full-nutrition').evaluate(el=>el.open));
  const layout=await page.locator('.label-reader').evaluate(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:innerWidth-r.right};});assert.ok(layout.left>=7.9 && layout.right>=7.9);
  if(width<900){await page.getByRole('radio',{name:'Per 100 g',exact:true}).check();assert.ok(await page.locator('#full-nutrition [data-basis="100g"]').first().isVisible());}
  await page.goto(new URL('/products/trayn-whey-rich-chocolate',page.url()).href,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('[data-purchase]')?.dataset.commerceReady==='true');
  assert.equal(await page.locator('.hero-story').count(),0);assert.match(await page.locator('h1').innerText(),/TRAYN WHEY BELGIAN CHOCOLATE/);
  await checkAvailability(page);
  assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);
  if(analyticsBlocked.length) console.log(`${name}: ${analyticsBlocked.length} Shopify analytics requests blocked by browser access controls; storefront assertions passed.`);
  console.log(`${name}: ${expectedRole} theme, sticky header, hero, inspector, flavour image, large visible typography sequence, visible red wipe, Shopify cart rendering, reader and product route PASS`);
 } finally {await browser.close();}
}
