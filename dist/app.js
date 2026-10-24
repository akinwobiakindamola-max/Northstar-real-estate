const moreButton = document.querySelector('.more-button');
const morePanel = document.querySelector('#more-panel');
const listingButton = document.querySelector('.nav-dropdown');
const listingPanel = document.querySelector('#listings-menu');

function close(button, panel) {
  button.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
}
function toggle(button, panel, otherButton, otherPanel) {
  const opening = panel.hidden;
  close(otherButton, otherPanel);
  panel.hidden = !opening;
  button.setAttribute('aria-expanded', String(opening));
}
moreButton.addEventListener('click', () => toggle(moreButton, morePanel, listingButton, listingPanel));
listingButton.addEventListener('click', () => toggle(listingButton, listingPanel, moreButton, morePanel));
document.addEventListener('click', event => {
  if (!morePanel.contains(event.target) && !moreButton.contains(event.target)) close(moreButton, morePanel);
  if (!listingPanel.contains(event.target) && !listingButton.contains(event.target)) close(listingButton, listingPanel);
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (!morePanel.hidden) { close(moreButton, morePanel); moreButton.focus(); }
  if (!listingPanel.hidden) { close(listingButton, listingPanel); listingButton.focus(); }
});
window.matchMedia('(max-width:1050px)').addEventListener('change', () => {
  close(moreButton, morePanel);
  close(listingButton, listingPanel);
});

(function(){
 const video=document.querySelector('.hero-video');
 if(!video)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const toggle=document.createElement('button');
 toggle.type='button';toggle.className='hero-video-toggle';toggle.textContent='Play background video';
 toggle.setAttribute('aria-label','Play background video');video.closest('.hero').appendChild(toggle);
 video.muted=true;
 function sync(){const playing=!video.paused&&!video.ended;toggle.textContent=playing?'Pause video':'Play video';toggle.setAttribute('aria-label',playing?'Pause background video':'Play background video');}
 video.addEventListener('playing',()=>{video.classList.add('is-playing');sync();});
 video.addEventListener('pause',sync);
 video.addEventListener('error',()=>{video.classList.remove('is-playing');toggle.hidden=true;});
 toggle.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause();});
 if(reduced.matches){video.autoplay=false;video.pause();}else video.play().catch(sync);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
 reduced.addEventListener('change',event=>{if(event.matches){video.pause();video.classList.remove('is-playing');}});
 sync();
})();
