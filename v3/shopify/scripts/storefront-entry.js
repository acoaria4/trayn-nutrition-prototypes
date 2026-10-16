import './commerce.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initializeFullPageMotion } from './motion/motion.js';
import { initializeChapterMotion } from './motion/chapter-motion.js';
import { initializeLowerMotion } from './motion/lower-motion.js';
import { initializeInteractions } from './motion/interactions.js';
import { initializeSmoothScroll } from './motion/smooth-scroll.js';
import { requestMotionRefresh } from './motion/refresh.js';
import { initializeFlavourMotion } from './motion/flavour-motion.js';
gsap.registerPlugin(ScrollTrigger);
const header=document.querySelector('.study-header');
if(header) {
 let height;
 const measure=()=>{const next=header.offsetHeight;if(next===height)return;height=next;document.documentElement.style.setProperty('--header-height',`${next}px`);requestMotionRefresh();};
 new ResizeObserver(measure).observe(header);measure();
}
document.querySelectorAll('[data-study-back]').forEach(image=>image.hidden=false);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-study-view]').forEach(link=>link.addEventListener('click',event=> {
 if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey) return;
 event.preventDefault();const back=link.dataset.studyView==='back';
 document.body.classList.toggle('is-instant',reduced.matches||event.detail===0);
 document.body.dataset.packView=back?'back':'front';
 document.querySelectorAll('[data-study-front]').forEach(image=>image.setAttribute('aria-hidden',String(back)));
 document.querySelectorAll('[data-study-back]').forEach(image=>image.setAttribute('aria-hidden',String(!back)));
 document.querySelectorAll('[data-study-view]').forEach(control=>control.setAttribute('aria-current',String(control===link)));
 document.querySelectorAll('[data-study-inspect]').forEach(control=>control.href=link.href);
}));
if(!window.Shopify?.designMode && header && document.querySelector('.hero-story')) initializeFullPageMotion({header});
if(!window.Shopify?.designMode && header && document.querySelector('.mindset-poster') && document.querySelector('.packaging-art')) initializeChapterMotion({header});
initializeInteractions();
if(!window.Shopify?.designMode && header && document.querySelector('.product-section') && document.querySelector('.contact-email')) initializeLowerMotion({header});
initializeSmoothScroll();
if(!window.Shopify?.designMode) initializeFlavourMotion();
const restoreAnchor=()=> {
 if(!location.hash) return;
 ScrollTrigger.refresh();
 try {document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({block:'start',behavior:'instant'});} catch {}
};
window.addEventListener('hashchange',restoreAnchor);
document.fonts.ready.then(()=>{ScrollTrigger.sort();if(location.hash)restoreAnchor();else requestMotionRefresh();});
document.addEventListener('shopify:section:load',()=>{initializeInteractions();requestMotionRefresh();});
