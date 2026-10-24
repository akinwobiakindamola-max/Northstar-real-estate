(function(){
 const section=document.getElementById('ns-testimonials');
 if(!section||section.dataset.ready)return;
 section.dataset.ready='true';
 const reviews=Array.from(section.querySelectorAll('.ns-review'));
 const dots=Array.from(section.querySelectorAll('[data-review-index]'));
 let current=0;
 function show(index){
  current=(index+reviews.length)%reviews.length;
  reviews.forEach((review,i)=>{review.hidden=i!==current;review.classList.toggle('ns-review-enter',i===current);});
  dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
  section.querySelector('.ns-review-status').textContent=`Testimonial ${current+1} of ${reviews.length}: ${reviews[current].querySelector('.ns-review-author').textContent}`;
 }
 section.querySelector('.ns-review-prev').addEventListener('click',()=>show(current-1));
 section.querySelector('.ns-review-next').addEventListener('click',()=>show(current+1));
 dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.reviewIndex))));
 section.querySelector('.ns-review-carousel').addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowLeft'?-1:1));}
 });
 let touch=null;
 section.addEventListener('touchstart',event=>{touch={x:event.touches[0].clientX,y:event.touches[0].clientY};},{passive:true});
 section.addEventListener('touchend',event=>{
  if(!touch)return;
  const dx=event.changedTouches[0].clientX-touch.x,dy=event.changedTouches[0].clientY-touch.y;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))show(current+(dx<0?1:-1));touch=null;
 },{passive:true});
 const dialog=section.querySelector('.ns-review-dialog');
 const openButton=section.querySelector('.ns-all-reviews');
 const list=dialog.querySelector('.ns-review-list');
 reviews.forEach(review=>{const copy=review.cloneNode(true);copy.hidden=false;copy.removeAttribute('data-review');list.appendChild(copy);});
 openButton.addEventListener('click',()=>dialog.showModal());
 dialog.querySelector('.ns-close-reviews').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>openButton.focus());
})();
