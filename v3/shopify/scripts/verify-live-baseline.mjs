// Read-only: compare native theme files with the recorded, downloaded baseline.
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, relative} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const baseline=JSON.parse(await readFile(new URL('../docs/LIVE_BASELINE_2026_10_23.json',import.meta.url),'utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
async function walk(path){const out=[];for(const entry of await readdir(path,{withFileTypes:true})){const target=resolve(path,entry.name);if(entry.isDirectory())out.push(...await walk(target));else if(entry.isFile())out.push(relative(root,target).replaceAll('\\','/'));else throw new Error(`Unexpected non-file: ${target}`);}return out;}
const actual=(await Promise.all(baseline.nativeDirectories.map(dir=>walk(resolve(root,dir))))).flat().sort();
const expected=baseline.files.map(row=>row.path).sort();
const differences=[];
for(const path of actual)if(!expected.includes(path))differences.push(`Extra: ${path}`);
for(const row of baseline.files){if(!actual.includes(row.path))differences.push(`Missing: ${row.path}`);else if(sha(await readFile(resolve(root,row.path)))!==row.sha256)differences.push(`Changed: ${row.path}`);}
if(differences.length){console.error(differences.join('\n'));process.exitCode=1;}else console.log(`All ${expected.length} native files match the downloaded live theme ${baseline.theme.id} byte for byte, including settings and templates.`);
