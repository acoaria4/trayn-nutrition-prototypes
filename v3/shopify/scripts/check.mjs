import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {Liquid} from 'liquidjs';
import {parseShopifyJson} from './shopify-json.mjs';
const engine=new Liquid({strictFilters:false});
for(const name of ['schema','doc','form','paginate','layout','section','style','stylesheet','javascript','liquid']) engine.registerTag(name,{parse(token,remainTokens){if(['schema','doc','form','paginate','style','stylesheet','javascript'].includes(name)){const stream=this.liquid.parser.parseStream(remainTokens).on(`tag:end${name}`,function(){this.stop();}).on('template',()=>{});stream.start();}},render(){return '';}});
let count=0;
for(const dir of ['layout','snippets','sections','templates']) for(const file of await readdir(dir)) {
 if(!file.endsWith('.liquid'))continue;
 const source=await readFile(`${dir}/${file}`,'utf8');
 engine.parse(source);count++;
 const schema=source.match(/{% schema %}([\s\S]*?){% endschema %}/);
 if(schema){const parsed=JSON.parse(schema[1]);assert.ok(parsed.name.length<=25,`${file}: section name too long`);}
 for(const match of source.matchAll(/'([^']+)' \| asset_url/g))await stat(`assets/${match[1]}`);
}
for(const file of await readdir('templates')) if(file.endsWith('.json')) {
 const template=parseShopifyJson(await readFile(`templates/${file}`,'utf8'));
 for(const id of template.order)await stat(`sections/${template.sections[id].type}.liquid`);
}
parseShopifyJson(await readFile('config/settings_schema.json','utf8'));parseShopifyJson(await readFile('config/settings_data.json','utf8'));parseShopifyJson(await readFile('locales/en.default.json','utf8'));
console.log(`Parsed ${count} Liquid files; schemas, templates and asset references passed.`);
