const routes = JSON.parse(document.querySelector('#trayn-routes')?.textContent || '{}');
const drawer = document.querySelector('#cart-drawer');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let opener, previousOverflow, entrance;
let queue = Promise.resolve();
const serialize = task => { const next = queue.then(task); queue = next.catch(() => {}); return next; };
const api = async (url, options = {}) => {
  const response = await fetch(url, {credentials:'same-origin',headers:{Accept:'application/json',...options.headers},...options});
  let body;
  try { body = await response.json(); } catch { throw new Error('Unable to read the cart response. Please try again.'); }
  if(!response.ok) throw new Error(typeof body.description === 'string' ? body.description : typeof body.message === 'string' ? body.message : 'Unable to update your cart. Please try again.');
  return body;
};
function openCart(trigger, keyboard = false) {
  if(!drawer) { location.assign(routes.cart); return; }
  opener = trigger || document.activeElement;
  if(!drawer.open) {
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    drawer.showModal();
    entrance?.cancel();
    if(!keyboard && !reduced.matches) entrance = drawer.animate([{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:250,easing:'cubic-bezier(0.23, 1, 0.32, 1)'});
  }
}
function announce(message) { const el=drawer?.querySelector('[data-cart-status]'); if(el) el.textContent=message; }
function updateQuantityControls(group) {
  const input=group.querySelector('input');
  const value=input.valueAsNumber;
  const minimum=Number(input.min || 0);
  const maximum=input.max===''?Infinity:Number(input.max);
  const lineMinimum=Number(input.dataset.lineMinimum || 0);
  input.setCustomValidity(value>0 && value<lineMinimum?`${input.dataset.minimumLabel}: ${lineMinimum}`:'');
  group.querySelector('[data-quantity-adjust="-1"]').disabled=input.disabled || (Number.isFinite(value) && value<=minimum);
  group.querySelector('[data-quantity-adjust="1"]').disabled=input.disabled || (Number.isFinite(value) && value>=maximum);
}
function prepareQuantityControls(root=document) {
  root.querySelectorAll('[data-quantity-stepper]').forEach(group=> {
    group.dataset.quantityReady='true';
    group.querySelectorAll('[data-quantity-adjust]').forEach(button=>button.hidden=false);
    updateQuantityControls(group);
  });
}
function cartFocus() {
  const active=document.activeElement;
  if(!drawer?.contains(active)) return;
  const key=active.dataset.key || active.closest('[data-quantity-stepper]')?.querySelector('[data-cart-quantity]')?.dataset.key;
  if(key) return {key,remove:active.hasAttribute('data-cart-remove'),adjust:active.dataset.quantityAdjust};
}
function showCartFallback() {
  drawer.querySelector('[data-cart-content]').hidden=true;
  drawer.querySelector('[data-cart-footer]').hidden=false;
  drawer.querySelector('[data-checkout]').hidden=true;
}
async function syncCart(fallbackFocus) {
  const cart=await api(`${routes.cart}.js`);
  const response=await fetch(`${routes.cart}?section_id=cart-content`,{credentials:'same-origin'});
  if(!response.ok) throw new Error('Your cart was updated, but could not be displayed. Use View cart to review it.');
  const parsed=new DOMParser().parseFromString(await response.text(),'text/html').querySelector('[data-cart-content]');
  if(!parsed) throw new Error('Use View cart to review your updated cart.');
  const focus=cartFocus() || (document.activeElement===document.body?fallbackFocus:undefined);
  drawer.querySelector('[data-cart-content]').replaceWith(parsed);
  prepareQuantityControls(drawer);
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=String(cart.item_count));
  drawer.classList.toggle('is-empty',cart.item_count===0);
  drawer.querySelector('[data-cart-footer]').hidden=cart.item_count===0;
  drawer.querySelector('[data-checkout]').hidden=cart.item_count===0;
  if(focus) {
    let target=[...drawer.querySelectorAll(focus.remove?'[data-cart-remove]':'[data-cart-quantity]')].find(el=>el.dataset.key===focus.key);
    if(target && focus.adjust) {
      const button=target.closest('[data-quantity-stepper]').querySelector(`[data-quantity-adjust="${focus.adjust}"]`);
      if(!button.disabled) target=button;
    }
    (target || drawer.querySelector('[data-cart-close]')).focus({preventScroll:true});
  }
  return cart;
}
function prepareForms(root=document) {
  root.querySelectorAll('[data-purchase]').forEach(panel=> {
    if(panel.dataset.commerceReady) return;
    panel.dataset.commerceReady='true';
    const form=panel.querySelector('[data-product-form]');
    if(!form) return;
    const select=form.querySelector('[data-variant-select]');
    const quantity=form.querySelector('[name=quantity]');
    const button=form.querySelector('[data-add-button]');
    const status=form.querySelector('[data-purchase-status]');
    const sticky=panel.nextElementSibling?.matches('[data-mobile-purchase]') ? panel.nextElementSibling : null;
    const update = () => {
      const option=select.selectedOptions[0];
      const available=option.dataset.available==='true' && form.dataset.requiresSellingPlan!=='true';
      panel.querySelector('[data-product-price]').textContent=option.dataset.price;
      button.disabled=!available;
      button.querySelector('[data-add-label]').textContent=available?'Add to Cart':'Sold Out';
      quantity.min=option.dataset.min || '1';
      quantity.step=option.dataset.step || '1';
      if(option.dataset.max) quantity.max=option.dataset.max;else quantity.removeAttribute('max');
      quantity.value=quantity.min;
      updateQuantityControls(quantity.closest('[data-quantity-stepper]'));
      if(sticky) {
        sticky.querySelector('[data-mobile-price]').textContent=option.dataset.price;
        sticky.querySelector('button').disabled=!available;
        sticky.querySelector('[data-add-label]').textContent=available?'Add to Cart':'Sold Out';
      }
      status.textContent='';
      if(document.body.dataset.template==='product') {const url=new URL(location.href);url.searchParams.set('variant',option.value);history.replaceState(null,'',url);}
    };
    select.addEventListener('change',update);
    update();
    form.addEventListener('submit',event=> {
      if(!form.checkValidity() || button.disabled) return;
      event.preventDefault();
      const keyboard=event.submitter?.matches(':focus-visible') || false;
      const payload=new FormData(form);
      button.disabled=true;
      if(sticky) sticky.querySelector('button').disabled=true;
      select.disabled=true;
      quantity.disabled=true;
      updateQuantityControls(quantity.closest('[data-quantity-stepper]'));
      status.textContent='Adding to your cart…';
      serialize(async()=> {
        let added=false;
        try {
          await api(routes.add,{method:'POST',body:payload});added=true;
          status.textContent='Added to your cart.';
          openCart(event.submitter || button,keyboard);
          announce('Loading your cart…');
          await syncCart();announce('Added to your cart.');
        } catch(error) {
          const message=added?'Added to your cart. Use View cart to review it.':error.message;
          if(added) showCartFallback();
          status.textContent=message;announce(message);
        } finally {
          select.disabled=false;
          quantity.disabled=false;
          updateQuantityControls(quantity.closest('[data-quantity-stepper]'));
          const available=select.selectedOptions[0].dataset.available==='true' && form.dataset.requiresSellingPlan!=='true';
          button.disabled=!available;
          if(sticky) sticky.querySelector('button').disabled=!available;
        }
      });
    });
    if(sticky) {
      const actions=panel.querySelector('.purchase-actions');
      const observer=new IntersectionObserver(([entry])=> {sticky.hidden=entry.isIntersecting || entry.boundingClientRect.bottom>0;},{rootMargin:'0px 0px -12px 0px'});
      observer.observe(actions);
    }
  });
}
if(drawer && routes.cart) {
  document.addEventListener('click',event=> {
    const trigger=event.target.closest('[data-cart-open]');
    if(trigger && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();openCart(trigger,event.detail===0);announce('Loading your cart…');
      serialize(async()=>{try {await syncCart();announce('');}catch(error){showCartFallback();announce(error.message);}});
    }
    if(event.target.closest('[data-cart-close]')) drawer.close();
    const continueShopping=event.target.closest('[data-cart-continue]');
    if(continueShopping && drawer.contains(continueShopping) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      const purchase=document.getElementById('purchase');
      if(purchase) {
        event.preventDefault();
        drawer.addEventListener('close',()=> {
          history.replaceState(null,'','#purchase');
          purchase.scrollIntoView({block:'start',behavior:'instant'});
          purchase.focus({preventScroll:true});
        },{once:true});
      }
      drawer.close();
    }
    const remove=event.target.closest('[data-cart-remove]');
    if(remove && drawer.contains(remove) && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {event.preventDefault();changeLine(remove.dataset.key,0);}
  });
  drawer.addEventListener('click',event=>{if(event.target!==drawer) return;const rect=drawer.getBoundingClientRect();if(event.clientX<rect.left || event.clientX>rect.right) drawer.close();});
  drawer.addEventListener('close',()=> {entrance?.cancel();document.documentElement.style.overflow=previousOverflow || '';opener?.focus({preventScroll:true});});
  drawer.addEventListener('change',event=> {
    if(!event.target.matches('[data-cart-quantity]')) return;
    const input=event.target;
    if(!input.checkValidity()) {input.reportValidity();return;}
    changeLine(input.dataset.key,Number(input.value));
  });
}
const pendingChanges = new Map();
function changeLine(key, quantity) {
  if (pendingChanges.get(key) === quantity) return;
  pendingChanges.set(key, quantity);
  serialize(async()=> {
    const focus=cartFocus();
    const input=[...drawer.querySelectorAll('[data-cart-quantity]')].find(el=>el.dataset.key===key);
    if(input) {input.disabled=true;updateQuantityControls(input.closest('[data-quantity-stepper]'));}
    announce('Updating your cart…');
    drawer.setAttribute('aria-busy','true');
    try {await api(routes.change,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:key,quantity})});await syncCart(focus);announce('Cart updated.');}
    catch(error) {try {await syncCart(focus);}catch {showCartFallback();}announce(error.message);}
    finally {
      if(input?.isConnected) {input.disabled=false;updateQuantityControls(input.closest('[data-quantity-stepper]'));}
      drawer.removeAttribute('aria-busy');if(pendingChanges.get(key)===quantity) pendingChanges.delete(key);
    }
  });
}
document.addEventListener('click',event=> {
  const button=event.target.closest('[data-quantity-adjust]');
  if(!button || button.disabled) return;
  const group=button.closest('[data-quantity-stepper]');
  const input=group.querySelector('input');
  const direction=Number(button.dataset.quantityAdjust);
  const lineMinimum=Number(input.dataset.lineMinimum || 0);
  if(!Number.isFinite(input.valueAsNumber)) input.value=input.min || '0';
  if(input.hasAttribute('data-cart-quantity') && direction<0 && input.valueAsNumber<=lineMinimum) input.value='0';
  else if(input.hasAttribute('data-cart-quantity') && direction>0 && input.valueAsNumber===0) input.value=String(lineMinimum);
  else input.stepUp(direction);
  input.dispatchEvent(new Event('input',{bubbles:true}));
  input.dispatchEvent(new Event('change',{bubbles:true}));
});
document.addEventListener('input',event=> {
  const group=event.target.closest('[data-quantity-stepper]');
  if(group) updateQuantityControls(group);
});
prepareQuantityControls();
prepareForms();
document.addEventListener('shopify:section:load', event=>{prepareQuantityControls(event.target);prepareForms(event.target);});
