// Local-only Liquid approximation. Shopify's renderer remains the final authority.
import { Liquid } from 'liquidjs';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
export const productFixture={id:10331931017504,title:'TRAYN Whey Belgian Chocolate',handle:'trayn-whey-rich-chocolate',url:'/products/trayn-whey-rich-chocolate',description:'',media:[],available:false,has_only_default_variant:true,requires_selling_plan:false,variants:[{id:51737000116512,title:'Default Title',price:329900,available:false,quantity_rule:{min:1,increment:1,max:null}}]};
productFixture.selected_or_first_available_variant=productFixture.variants[0];
export function createRenderer({available=false}={}) {
 const p=structuredClone(productFixture);p.available=available;p.variants[0].available=available;p.selected_or_first_available_variant=p.variants[0];
 const cart={item_count:0,items:[],currency:{iso_code:'INR'},total_price:0,taxes_included:false,cart_level_discount_applications:[]};
 const globals={product:p,settings:{featured_product:p},shop:{name:'TRAYN Nutrition',currency:'INR',email:'traynnutrition@gmail.com',policies:[],refund_policy:{body:''}},routes:{root_url:'/',cart_url:'/cart',cart_add_url:'/cart/add',cart_change_url:'/cart/change',all_products_collection_url:'/collections/all',search_url:'/search'},request:{locale:{iso_code:'en'},page_type:'index'},cart,canonical_url:'http://127.0.0.1:4180/',page_title:'TRAYN · Local Shopify preview',content_for_header:''};
 const engine=new Liquid({root:['.','snippets','sections','layout'],extname:'.liquid',globals});
 const translations=JSON.parse(readFileSync('locales/en.default.json','utf8'));
 engine.registerFilter('t',key=>key.split('.').reduce((value,part)=>value?.[part],translations) || key);
 engine.registerFilter('asset_url',name=>`/assets/${name}?v=local-preview`);
 engine.registerFilter('stylesheet_tag',url=>`<link rel="stylesheet" href="${url}">`);
 engine.registerFilter('preload_tag',url=>`<link rel="preload" href="${url}" as="font" type="font/woff2" crossorigin>`);
 const money=v=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(Number(v)/100);
 engine.registerFilter('money_with_currency',money);engine.registerFilter('money',money);engine.registerFilter('default_errors',()=> '');
 engine.registerTag('schema',{parse(token,tokens){this.liquid.parser.parseStream(tokens).on('tag:endschema',function(){this.stop();}).start();},render(){return '';}});
 engine.registerTag('doc',{parse(token,tokens){this.liquid.parser.parseStream(tokens).on('tag:enddoc',function(){this.stop();}).start();},render(){return '';}});
 engine.registerTag('form',{parse(token,tokens){this.type=token.args.split(',')[0].replaceAll("'",'').trim();this.id=token.args.match(/id:\s*([a-z_]+)/)?.[1];this.tpl=[];const templates=this.tpl;this.liquid.parser.parseStream(tokens).on('template',tpl=>templates.push(tpl)).on('tag:endform',function(){this.stop();}).start();},*render(ctx,emitter){const id=this.id?yield this.liquid.evalValue(this.id,ctx):'form';emitter.write(`<form method="post" action="${this.type==='product'?'/cart/add':'/password'}" id="${id}" class="purchase-form" ${this.type==='product'?'data-product-form':''}>`);yield this.liquid.renderer.renderTemplates(this.tpl,ctx,emitter);emitter.write('</form>');}});
 engine.registerTag('section',{parse(token){this.name=token.args.replaceAll("'",'').trim();},async render(){return `<div id="shopify-section-${this.name}" class="shopify-section">${await renderSection(this.name,{id:this.name,settings:{}})}</div>`;}});
 async function renderSection(type,section){const source=await readFile(`sections/${type}.liquid`,'utf8');const match=source.match(/{% schema %}([\s\S]*?){% endschema %}/);const defaults=Object.fromEntries((match?JSON.parse(match[1]).settings:[]).filter(s=>s.default!==undefined).map(s=>[s.id,s.default]));section.settings={...defaults,...section.settings};return engine.renderFile(`sections/${type}.liquid`,{section});}
 async function renderPage(page='index') {
  globals.request.page_type=page;
  const template=JSON.parse(await readFile(`templates/${page}.json`,'utf8'));
  let content='';
  for(const id of template.order){const section=template.sections[id];content+=`<div class="shopify-section">${await renderSection(section.type,{id,settings:section.settings||{}})}</div>`;}
  const rendered=await engine.renderFile('layout/theme.liquid',{content_for_layout:content});
  return rendered.replace('<body ', '<body data-local-preview="true" ').replace('<main id="MainContent"','<p style="margin:0;padding:8px 24px;background:#151313;color:#c8c4c0;font:12px sans-serif">Local Shopify theme preview · no real purchases</p><main id="MainContent"');
 }
 return {renderPage,engine,globals};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const renderer=createRenderer();
 const mime={'.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.pdf':'application/pdf'};
 createServer(async(req,res)=> {
  try {
   const url=new URL(req.url,'http://127.0.0.1');
   if(url.pathname.startsWith('/assets/')){const path=resolve(`.${url.pathname}`);if(!path.startsWith(resolve('assets')+'/'))throw new Error('Invalid path');res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path));return;}
   if(url.pathname.endsWith('.js')||url.searchParams.has('section_id')){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({message:'Shopping is not connected in the local preview. Use the unpublished Shopify theme.'}));return;}
   const page=url.pathname.startsWith('/products/')?'product':url.pathname==='/cart'?'cart':'index';
   res.setHeader('Content-Type','text/html');res.end(await renderer.renderPage(page));
  }catch(error){res.writeHead(500,{'Content-Type':'text/plain'});res.end(error.stack);}
 }).listen(4180,'127.0.0.1',()=>console.log('Local Shopify preview: http://127.0.0.1:4180/ (commerce disabled)'));
}
