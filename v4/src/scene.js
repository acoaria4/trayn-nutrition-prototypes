import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

export async function createProductScene({reduced, onReady}) {
  const hero=document.querySelector('[data-scene-mount=hero]');
  const inspect=document.querySelector('[data-scene-mount=inspect]');
  const shell=inspect.closest('.inspect-shell');
  const help=shell.querySelector('.scene-help');
  const button=shell.querySelector('[data-inspect-toggle]');
  const slider=document.querySelector('#pack-rotation');
  const tools=document.querySelector('.inspection-tools');
  let renderer;
  try {renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});}catch{return null;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<800?1.5:2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.85;
  renderer.setClearColor(0x090909,0);
  const canvas=renderer.domElement;canvas.setAttribute('aria-label','Interactive TRAYN pouch. Use left and right arrow keys to rotate, plus and minus to zoom, and Home to reset.');
  canvas.tabIndex=-1;canvas.setAttribute('role','img');
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,100);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.45;room.dispose();pmrem.dispose();
  const key=new THREE.DirectionalLight(0xfff4e9,2.8);key.position.set(-3,4,6);scene.add(key);
  const red=new THREE.PointLight(0xf82030,12,20,2);red.position.set(3,1,2);scene.add(red);
  const rim=new THREE.DirectionalLight(0xc5d0e5,1.5);rim.position.set(3,4,-3);scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xe5e6dd,0x18100d,.5));
  const pose=new THREE.Group();scene.add(pose);
  let model;
  try {const base=new URL(import.meta.env.BASE_URL,location.href);model=(await new GLTFLoader().loadAsync(new URL('models/trayn-pouch.glb',base).href)).scene;}
  catch {renderer.dispose();environment.dispose();return null;}
  const box=new THREE.Box3().setFromObject(model);const centre=box.getCenter(new THREE.Vector3());model.position.sub(centre);pose.add(model);
  model.traverse(o=>{if(o.isMesh){o.frustumCulled=true;o.material.envMapIntensity=.45;}});
  // Prepare material programs during the idle load, before the first scroll reveal.
  try{await renderer.compileAsync(scene,camera);}catch{/* Image fallback remains available. */}
  let mount=null,mode='hero',heroProgress=0,inspectionProgress=1,interactive=false,yaw=0,pitch=0,zoom=8.2,light=false,pending=0,disposed=false,lost=false;
  const visibility={hero:true,inspect:false};
  function size(){if(!mount||disposed)return;const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}
  function apply(){
    const phone=innerWidth<800;
    if(mode==='hero') {
      const p=THREE.MathUtils.smoothstep(heroProgress,.18,.55);
      pose.visible=heroProgress>.17;
      pose.position.set(phone?0:THREE.MathUtils.lerp(1.6,-1.0,p),phone?-.55:0,0);
      pose.scale.setScalar(phone?.9:1);
      pose.rotation.set(phone?0:.03,THREE.MathUtils.lerp(-.5,.08,p),0);
      camera.position.set(0,0,phone?12:7.8);camera.lookAt(0,0,0);
      const sweep=Math.sin(THREE.MathUtils.clamp((heroProgress-.49)/.27,0,1)*Math.PI);
      key.position.x=-4+sweep*7;key.intensity=1.7+sweep*.8;red.intensity=10+sweep*5;
    }else{
      pose.visible=true;pose.scale.setScalar(1);pose.position.set(0,0,0);
      pose.rotation.set(pitch,interactive?yaw:(1-inspectionProgress)*.35,0);
      camera.position.set(0,interactive?0:(1-inspectionProgress)*.8,interactive?zoom:4.5+inspectionProgress*3.7);
      camera.lookAt(0,interactive?0:(1-inspectionProgress)*.75,0);
      key.position.set(light?3:-3,4,6);key.intensity=light?2.3:1.8;red.intensity=light?22:9;
    }
  }
  function draw(){if(disposed||pending||lost||document.hidden||!mount||!visibility[mode])return;pending=requestAnimationFrame(()=>{pending=0;if(disposed||lost)return;apply();renderer.render(scene,camera);});}
  function attach(next){hero.classList.toggle('is-ready',next==='hero');inspect.classList.toggle('is-ready',next==='inspect');if(mode===next&&mount)return;mode=next;mount=next==='inspect'?inspect:hero;mount.append(canvas);canvas.tabIndex=next==='inspect'&&interactive?0:-1;size();}
  const ro=new ResizeObserver(()=>size());ro.observe(hero);ro.observe(inspect);
  const observer=new IntersectionObserver(entries=>{
    for(const e of entries)visibility[e.target===inspect?'inspect':'hero']=e.isIntersecting;
    if(visibility.inspect)attach('inspect');else if(visibility.hero)attach('hero');else{hero.classList.remove('is-ready');inspect.classList.remove('is-ready');}
    draw();
  },{threshold:0});observer.observe(hero);observer.observe(inspect);
  function engage(){interactive=true;inspectionProgress=1;canvas.tabIndex=0;inspect.classList.add('is-interactive');button.textContent='Use scroll view ↗';tools.hidden=false;help.textContent='Drag sideways to turn. Use the controls to get closer.';draw();}
  function imageMode(){interactive=false;inspect.classList.remove('is-interactive');button.textContent='Inspect in 3D ↗';canvas.tabIndex=-1;help.textContent='Choose a view, or inspect the pack in 3D.';tools.hidden=true;draw();}
  function view(name){engage();pitch=0;if(name==='front'){yaw=0;zoom=8.2;}if(name==='back'){yaw=Math.PI;zoom=8.2;}if(name==='detail'){yaw=.22;zoom=4.6;pitch=.08;}slider.value=String(Math.round(yaw*180/Math.PI));shell.querySelector('[data-view-label]').textContent=name.toUpperCase()+' / '+(light?'RED EDGE LIGHT':'STUDIO LIGHT');draw();}
  button.hidden=false;shell.querySelector('[data-fullscreen]').hidden=false;
  button.addEventListener('click',()=>interactive?imageMode():engage());
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
  slider.addEventListener('input',()=>{engage();yaw=Number(slider.value)*Math.PI/180;draw();});
  document.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{engage();zoom=THREE.MathUtils.clamp(zoom+(b.dataset.zoom==='in'?-.7:.7),4.3,10);draw();}));
  document.querySelector('[data-reset]').addEventListener('click',()=>view('front'));
  document.querySelector('[data-light]').addEventListener('click',e=>{engage();light=!light;e.currentTarget.setAttribute('aria-pressed',String(light));draw();});
  let pointer;
  canvas.addEventListener('pointerdown',e=>{if(!interactive||mode!=='inspect'||e.button>0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,yaw,pitch,captured:false};});
  canvas.addEventListener('pointermove',e=>{
    if(!pointer||e.pointerId!==pointer.id)return;
    const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;
    if(!pointer.captured){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}if(Math.abs(dx)<6)return;canvas.setPointerCapture(e.pointerId);pointer.captured=true;}
    yaw=pointer.yaw+dx*.009;pitch=THREE.MathUtils.clamp(pointer.pitch+dy*.003,-.25,.25);slider.value=String(((yaw*180/Math.PI+180)%360+360)%360-180);draw();
  });
  const release=()=>pointer=null;canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('keydown',e=>{if(!interactive)return;const k=e.key;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(k))return;e.preventDefault();if(k==='Home')view('front');if(k==='ArrowLeft')yaw-=.15;if(k==='ArrowRight')yaw+=.15;if(k==='ArrowUp'||k==='+'||k==='=')zoom=Math.max(4.3,zoom-.3);if(k==='ArrowDown'||k==='-')zoom=Math.min(10,zoom+.3);slider.value=String(THREE.MathUtils.radToDeg(yaw));draw();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;hero.classList.remove('is-ready');inspect.classList.remove('is-ready');button.hidden=true;tools.hidden=true;help.textContent='Interactive view paused. Pack images and the original label are still available.';});
  canvas.addEventListener('webglcontextrestored',()=>{lost=false;button.hidden=false;attach(mode);mount.classList.add('is-ready');draw();});
  document.addEventListener('visibilitychange',draw);
  attach(visibility.inspect?'inspect':'hero');draw();
  document.body.dataset.sceneReady='true';onReady?.();
  return {
    hero(p){heroProgress=p;draw();},
    inspection(p){inspectionProgress=p;draw();},
    settle(){inspectionProgress=1;draw();},
    resize:size,
    reset(){view('front');},
    dispose(){disposed=true;cancelAnimationFrame(pending);observer.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',draw);model.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of [].concat(o.material)){for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose();}}});environment.dispose();renderer.dispose();canvas.remove();},
  };
}
