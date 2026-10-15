// Explicit, one-time import. Build does not overwrite editable theme sections.
import { readFile, writeFile, cp, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { slipstreamDocument } from '../../src/templates.js';
const html=slipstreamDocument();
const schema=(name,settings=[])=>`\n{% schema %}\n${JSON.stringify({name,tag:'div',class:'trayn-section',settings,presets:[{name}]},null,2)}\n{% endschema %}\n`;
const asset=markup=>markup.replace(/\/(?:images|fonts)\/[A-Za-z0-9_./-]+\.(?:webp|png|pdf|woff2)/g,path=>`{{ '${basename(path)}' | asset_url }}`);
const part=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
const write=async(file,text)=>writeFile(file,text);
const blocks={
 'trayn-hero':part('<section class="hero-story"','<div class="study-story">'),
 'trayn-mindset':part(' <section class="study-chapter chapter-mindset"',' <section class="study-chapter chapter-packaging"'),
 'trayn-packaging':part(' <section class="study-chapter chapter-packaging"','</div>\n<section class="product-section'),
 'trayn-label-artwork':part('<section class="product-section','<section class="questions-section'),
 'trayn-questions':part('<section class="questions-section','<section class="contact-section'),
};
blocks['trayn-hero']=blocks['trayn-hero'].replace('href="#mindset" class="hero-scroll" data-study-jump="0"','href="#purchase" class="hero-scroll"').replace('Scroll to explore','Shop the Whey').replace('Packaging concept · Not for sale','Belgian Chocolate / TRAYN').replace('href="#packaging" data-study-jump="0.88">Explore the pack','href="#purchase">Shop the Whey');
blocks['trayn-packaging']=blocks['trayn-packaging'].replace('Front and back pouch visualisations. Packaging concept. Not for sale.','Front and back pouch visualisations. Refer to the selected product for purchase information.');
blocks['trayn-questions']=blocks['trayn-questions'].replace('What is TRAYN showcasing?','Where can I shop the product?').replace('A 500 g Belgian Chocolate whey protein concentrate packaging concept, and the mindset behind TRAYN Nutrition. The front and back pouch images are visualisations.','Choose the featured product in the Shop section to see its current price and availability. The packaging inspector shows the supplied design visualisation.').replace('Can I buy it here?','How do I check out?').replace('This is a product showcase. Prices, availability and a launch date have not been announced here. For product enquiries, contact TRAYN using the email below.','Add an available product to your cart, review the quantity, and continue to Shopify checkout. Available delivery and payment options are shown during checkout.');
blocks['trayn-label-artwork']=blocks['trayn-label-artwork'].replace('KNOW<br>YOUR <span>PACK.</span>','{{ section.settings.heading | escape }}<br>YOUR <span>PACK.</span>');
for(const [id,markup] of Object.entries(blocks)){
 const settings=id==='trayn-label-artwork'?[{type:'text',id:'heading',label:'Heading',default:'KNOW'}]:[];
 await write(`sections/${id}.liquid`,asset(markup)+schema(id.replace('trayn-','TRAYN ').replaceAll('-',' '),settings));
}
await write('snippets/pouch-masks.liquid',part('<svg class="pouch-masks"','<a class="study-skip"'));
await write('snippets/pack-inspector.liquid',asset(part('<dialog class="pack-inspector"','<script type="module"')));
async function copyFlat(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())await copyFlat(path);else await cp(path,`assets/${e.name}`);}}
await copyFlat('../public');
console.log('Imported V3 artwork, styles and independent Liquid sections.');
