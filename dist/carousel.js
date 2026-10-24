(function(){
 const section=document.getElementById('ns-services');
 if(!section||section.dataset.ready)return;
 section.dataset.ready='true';
 const carousel=section.querySelector('.ns-carousel'),stage=section.querySelector('.ns-carousel-stage');
 const originals=Array.from(stage.querySelectorAll('.ns-service-slide'));
 const dots=Array.from(section.querySelectorAll('[data-index]')),status=section.querySelector('.ns-carousel-status');
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)'),count=originals.length;
 if(count<2)return;
 const mod=n=>(n%count+count)%count;
 let current=1,moving=false,target=null,finishTimer;
 const pool=[];
 stage.replaceChildren();
 for(let slot=-2;slot<=2;slot++){
  const card=originals[mod(current+slot)].cloneNode(true);
  card.dataset.slot=String(slot);card.className='ns-service-slide';stage.appendChild(card);pool.push(card);
 }
 function layout(){
  const width=pool[0].offsetWidth;
  const gap=stage.clientWidth<=600?12:Math.min(24,Math.max(16,stage.clientWidth*.012));
  const step=width*.93+gap;
  carousel.style.setProperty('--ns-center-edge',`${(stage.clientWidth-width)/2}px`);
  carousel.style.setProperty('--ns-arrow-y',`${stage.clientHeight/2}px`);
  pool.forEach(card=>{
   const slot=Number(card.dataset.slot),active=slot===0;
   card.style.setProperty('--slide-offset',`${slot*step}px`);
   card.style.setProperty('--slide-scale',active?'1':'.86');
   card.classList.toggle('ns-current',active);card.classList.toggle('ns-side',!active);
   card.setAttribute('aria-hidden',String(!active));card.inert=!active;
  });
  dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
  status.textContent=`Slide ${current+1} of ${count}: ${originals[current].querySelector('h2').textContent}`;
 }
 function finish(){
  if(!moving)return;
  clearTimeout(finishTimer);stage.classList.add('ns-no-motion');
  pool.forEach(card=>{
   const slot=Number(card.dataset.slot);
   if(slot < -2 || slot > 2){
    const nextSlot=slot < -2?2:-2;card.dataset.slot=String(nextSlot);
    card.innerHTML=originals[mod(current+nextSlot)].innerHTML;
   }
  });
  layout();void stage.offsetWidth;stage.classList.remove('ns-no-motion');moving=false;
  if(target!==null&&target!==current)moveTo(target);else target=null;
 }
 function step(direction){
  if(moving)return;
  moving=true;current=mod(current+direction);
  pool.forEach(card=>card.dataset.slot=String(Number(card.dataset.slot)-direction));layout();
  if(reducedMotion.matches)finish();else finishTimer=setTimeout(finish,850);
 }
 function moveTo(index){
  target=mod(index);if(moving||target===current)return;
  step(mod(target-current)<=mod(current-target)?1:-1);
 }
 stage.addEventListener('transitionend',event=>{
  if(event.target.matches('.ns-current')&&event.propertyName==='transform')finish();
 });
 stage.classList.add('ns-no-motion');layout();requestAnimationFrame(()=>stage.classList.remove('ns-no-motion'));
 section.querySelector('.ns-carousel-prev').addEventListener('click',()=>moveTo(current-1));
 section.querySelector('.ns-carousel-next').addEventListener('click',()=>moveTo(current+1));
 dots.forEach(dot=>dot.addEventListener('click',()=>moveTo(Number(dot.dataset.index))));
 carousel.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  event.preventDefault();moveTo(current+(event.key==='ArrowLeft'?-1:1));
 });
 let touch=null;
 carousel.addEventListener('touchstart',event=>{touch={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 carousel.addEventListener('touchend',event=>{
  if(!touch)return;
  const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))moveTo(current+(dx<0?1:-1));touch=null;
 },{passive:true});
 new ResizeObserver(()=>{
  if(moving)finish();stage.classList.add('ns-no-motion');layout();
  requestAnimationFrame(()=>stage.classList.remove('ns-no-motion'));
 }).observe(stage);
})();
