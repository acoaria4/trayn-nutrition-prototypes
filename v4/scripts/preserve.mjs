import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const files={};
async function scan(path){for(const e of await readdir('../'+path,{withFileTypes:true})){if(['node_modules','dist','artifacts','.git','test-results','playwright-report'].includes(e.name)||e.name.endsWith('.log'))continue;const name=path+'/'+e.name;if(e.isDirectory())await scan(name);else if(e.isFile())files[name]=createHash('sha256').update(await readFile('../'+name)).digest('hex');}}
for(const v of ['v1','v2','v3'])await scan(v);
if(process.argv.includes('--check')){const before=JSON.parse(await readFile('artifacts/preserved.json'));const changed=[...new Set([...Object.keys(before),...Object.keys(files)])].filter(k=>before[k]!==files[k]);if(changed.length)throw Error('Existing versions changed: '+changed.join(', '));console.log('Preserved '+Object.keys(files).length+' files in V1–V3.');}else{await writeFile('artifacts/preserved.json',JSON.stringify(files));console.log('Captured '+Object.keys(files).length+' preserved files.');}
