import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export function createMotion({isReduced,scene,onHeroFilm}){
  const header=document.querySelector('.header'),story=document.querySelector('.hero-story');
  let media;
  function setup(){
    media?.revert();document.body.classList.remove('has-hero-motion');
    media=gsap.matchMedia();
    media.add({wide:'(min-width:800px)',room:'(min-height:520px), (max-width:799px) and (orientation:portrait)'},({conditions})=>{
      if(isReduced())return;
      if(conditions.room){
        document.body.classList.add('has-hero-motion');
        const state={p:0};let filmHidden=false;
        const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:story,start:()=>`top top+=${header.offsetHeight}`,end:'+=2040',scrub:true,invalidateOnRefresh:true,onRefresh:self=>{story.dataset.start=self.start;story.dataset.end=self.end;story.dataset.distance='2040';},onUpdate:self=>{story.dataset.progress=self.progress.toFixed(3);const opening=document.querySelector('.hero-opening'),fuel=document.querySelector('.hero-fuel');const a=self.progress>.35,b=self.progress<.52;if(opening.inert!==a)opening.inert=a;if(fuel.inert!==b)fuel.inert=b;const next=self.progress>.42;if(next!==filmHidden){filmHidden=next;onHeroFilm?.(!next);}}}});
        tl.to(state,{p:1,duration:1,onUpdate:()=>scene()?.hero(state.p)},0)
          .to('.hero-photo',{scale:1.07,autoAlpha:0,duration:.42},.02)
          .to('.hero-opening',{y:conditions.wide?-40:-20,autoAlpha:0,duration:.2},.12)
          .fromTo('.hero-product>.scene-fallback',{autoAlpha:0},{autoAlpha:1,duration:.16},.24)
          .fromTo('.hero-fuel',{autoAlpha:0,y:16},{autoAlpha:1,y:0,duration:.2},.48)
          .fromTo('.hero-progress i',{scaleX:0},{scaleX:1,duration:1},0);
      }
      const poster=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.mindset-composition',start:'top 92%',end:()=>`top top+=${header.offsetHeight+40}`,scrub:true,invalidateOnRefresh:true}});
      poster.fromTo('.get-word',{xPercent:-20},{xPercent:0,duration:1},0)
        .fromTo('.built-word',{xPercent:20},{xPercent:0,duration:1},0)
        .fromTo('.mindset-image',{scale:.87,rotation:-4,clipPath:'inset(8% 10% 8% 10%)'},{scale:1,rotation:0,clipPath:'inset(0% 0% 0% 0%)',duration:1},0);
      gsap.fromTo('.flavour-photo',{scale:1.08,y:30},{scale:1,y:-20,ease:'none',scrollTrigger:{trigger:'.flavour',start:'top bottom',end:'bottom top',scrub:true}});
      const state={p:0};
      gsap.to(state,{p:1,ease:'none',scrollTrigger:{trigger:'.inspect-shell',start:'top 92%',end:()=>`top top+=${header.offsetHeight+45}`,scrub:true,invalidateOnRefresh:true},onUpdate:()=>scene()?.inspection(state.p)});
      gsap.fromTo('.detail-strip img',{scale:1.15,xPercent:3},{scale:1,xPercent:0,ease:'none',scrollTrigger:{trigger:'.detail-strip',start:'top bottom',end:'bottom top',scrub:true}});
      gsap.fromTo('.closing>picture',{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:'.closing',start:'top bottom',end:'bottom bottom',scrub:true}});
      return()=>{document.body.classList.remove('has-hero-motion');document.querySelector('.hero-opening').inert=false;document.querySelector('.hero-fuel').inert=false;};
    });
    ScrollTrigger.sort();ScrollTrigger.refresh();
  }
  setup();
  return{refresh:()=>ScrollTrigger.refresh(true),rebuild:setup,setPaused(value){for(const trigger of ScrollTrigger.getAll()){if(value)trigger.disable(false);else trigger.enable(false);}if(!value)ScrollTrigger.refresh();},destroy:()=>media?.revert()};
}
