import {createMotion} from './motion.js';
if(import.meta.env.DEV)document.querySelector('[data-version-picker]').href='/versions/';

const header=document.querySelector('.header');
let oldHeight=0;
let motion,scene,paused=false,sceneLoading=false;
const preference=matchMedia('(prefers-reduced-motion:reduce)');
const isReduced=()=>preference.matches||paused||new URLSearchParams(location.search).get('motion')==='off';
const measure=()=>{const height=header.offsetHeight;if(height!==oldHeight){oldHeight=height;document.documentElement.style.setProperty('--header',`${height}px`);motion?.refresh();}};
new ResizeObserver(measure).observe(header);measure();
const menu=document.querySelector('.mobile-menu');
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.open=false));
menu.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
document.addEventListener('click',e=>{if(!menu.contains(e.target))menu.open=false;});

const motionButton=document.querySelector('.motion-switch');motionButton.hidden=false;
motionButton.addEventListener('click',()=>{paused=!paused;motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'Resume motion':'Pause motion');motionButton.querySelector('span:last-child').textContent=paused?'Resume motion':'Pause motion';document.body.classList.toggle('motion-paused',paused);motion.setPaused(paused);updateVideo();});
preference.addEventListener('change',()=>{motion.rebuild();updateVideo();});

function tabs(){
 const list=document.querySelector('.label-tabs'),links=[...list.querySelectorAll('a')],panels=[...document.querySelectorAll('.label-panel')];let selected=0;
 list.setAttribute('role','tablist');
 const activate=(i,focus=false)=>{selected=i;links.forEach((a,j)=>{a.setAttribute('aria-selected',String(i===j));a.tabIndex=i===j?0:-1;panels[j].hidden=i!==j;});if(focus)links[i].focus();motion?.refresh();};
 links.forEach((a,i)=>{a.id=`tab-${a.dataset.tab}`;a.setAttribute('role','tab');a.setAttribute('aria-controls',a.dataset.tab);panels[i].setAttribute('role','tabpanel');panels[i].setAttribute('aria-labelledby',a.id);panels[i].tabIndex=0;a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();activate(i);});a.addEventListener('keydown',e=>{const next={ArrowRight:(i+1)%3,ArrowLeft:(i+2)%3,Home:0,End:2}[e.key];if(next!==undefined){e.preventDefault();activate(next,true);}});});activate(0);
 const hash=()=>{const i=panels.findIndex(p=>`#${p.id}`===location.hash);if(i>=0)activate(i);};hash();addEventListener('hashchange',hash);
}
tabs();
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>motion?.refresh()));
const reader=document.querySelector('#label-dialog');let labelOpener,labelOverflow;
document.querySelectorAll('[data-open-label]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;e.preventDefault();labelOpener=a;labelOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';reader.showModal();}));
reader.querySelector('[data-close-label]').addEventListener('click',()=>reader.close());
reader.addEventListener('close',()=>{document.documentElement.style.overflow=labelOverflow||'';labelOpener?.focus({preventScroll:true});});

document.querySelector('.view-controls').hidden=false;
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 const picture=document.querySelector('.inspect-stage>.scene-fallback');picture.querySelector('source')?.remove();
 picture.querySelector('img').src=new URL(`images/${b.dataset.view==='back'?'pouch-back.webp':b.dataset.view==='detail'?'detail-wide.webp':'product-wide.webp'}`,new URL(import.meta.env.BASE_URL,location.href)).href;
 picture.querySelector('img').alt=b.dataset.view==='back'?'Back pouch visualisation':b.dataset.view==='detail'?'Close-up of the pouch artwork':'Front pouch visualisation';
}));

const expanded=document.createElement('dialog');expanded.className='scene-dialog';expanded.setAttribute('aria-label','Expanded packaging inspection');document.body.append(expanded);
const layout=document.querySelector('.inspection-layout');let restorePoint,expandOpener,expandOverflow;
document.querySelector('[data-fullscreen]').addEventListener('click',e=>{
 if(expanded.open){expanded.close();return;}
 expandOpener=e.currentTarget;restorePoint=document.createComment('Inspection position');layout.before(restorePoint);expanded.append(layout);expanded.showModal();expandOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';expandOpener.textContent='Close view ×';scene?.settle();scene?.resize();
});
expanded.addEventListener('close',()=>{restorePoint.replaceWith(layout);expandOpener.innerHTML='Expand view <span aria-hidden="true">⤢</span>';document.documentElement.style.overflow=expandOverflow||'';scene?.resize();expandOpener.focus({preventScroll:true});});

const videoVisibility=new Map();let currentVideo,heroFilmVisible=true;
function updateVideo(){
 const next=isReduced()||document.hidden||navigator.connection?.saveData?null:[...videoVisibility].filter(([video,ratio])=>ratio>.15&&(heroFilmVisible||!video.closest('.hero-photo'))).sort((a,b)=>b[1]-a[1])[0]?.[0];
 if(next===currentVideo)return;
 if(currentVideo){currentVideo.pause();currentVideo.classList.remove('is-playing');}
 currentVideo=next;
 if(next){const desired=new URL(innerWidth<800?next.dataset.phone:next.dataset.wide,location.href).href;if(next.src!==desired){next.src=desired;next.load();}next.play().then(()=>{if(currentVideo===next)next.classList.add('is-playing');}).catch(()=>{next.classList.remove('is-playing');});}
}
const videoObserver=new IntersectionObserver(entries=>{for(const e of entries)videoVisibility.set(e.target,e.intersectionRatio);updateVideo();},{threshold:[0,.15,.4,.7,1]});
document.querySelectorAll('.campaign-video').forEach(v=>{videoObserver.observe(v);v.addEventListener('error',()=>v.classList.remove('is-playing'));});
document.addEventListener('visibilitychange',updateVideo);
matchMedia('(max-width:799px)').addEventListener('change',()=>{currentVideo?.pause();currentVideo=null;updateVideo();});

const navigation=[...document.querySelectorAll('.desktop-nav a')];
const activeObserver=new IntersectionObserver(entries=>{const active=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(active)for(const a of navigation){if(a.hash===`#${active.target.id}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}},{rootMargin:'-15% 0px -45%',threshold:[0,.3,.6]});
navigation.forEach(a=>{const el=document.querySelector(a.hash);if(el)activeObserver.observe(el);});
motion=createMotion({isReduced,scene:()=>scene,onHeroFilm:visible=>{heroFilmVisible=visible;updateVideo();}});
async function loadScene(){
 if(sceneLoading||new URLSearchParams(location.search).has('no3d'))return;sceneLoading=true;
 try{const {createProductScene}=await import('./scene.js');scene=await createProductScene({reduced:isReduced,onReady:()=>{document.querySelector('.scene-help').textContent='Choose a view, or inspect the pack in 3D.';}});if(scene){scene.hero(Number(document.querySelector('.hero-story').dataset.progress||0));motion.refresh();}}
 catch(error){console.warn('Product images retained:',error.message);}
}
if('requestIdleCallback'in window)requestIdleCallback(loadScene,{timeout:1200});else setTimeout(loadScene,250);
document.fonts.ready.then(()=>{motion.refresh();if(location.hash){try{document.querySelector(location.hash)?.scrollIntoView({behavior:'instant',block:'start'});}catch{}}});
addEventListener('pagehide',()=>{document.querySelectorAll('video').forEach(v=>v.pause());});
addEventListener('pageshow',e=>{if(e.persisted){motion.refresh();scene?.resize();updateVideo();}});
