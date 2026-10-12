// === index.html dan ajratildi (XOLERIC SEO) ===
const tabHistory = ['tab-home'];
function switchTab(id) {
  if (id !== tabHistory[tabHistory.length - 1]) tabHistory.push(id);
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('[data-tab="'+id+'"]').forEach(b => b.classList.add('active'));
  document.getElementById('appBody').scrollTop = 0;
}
function tabBack() {
  if (tabHistory.length > 1) {
    tabHistory.pop();
    switchTab(tabHistory[tabHistory.length - 1]);
  }
}
function toggleAcc(h) {
  const i = h.closest('.acc-item');
  const o = i.classList.contains('open');
  document.querySelectorAll('.acc-item.open').forEach(e => e.classList.remove('open'));
  if (!o) i.classList.add('open');
}
const rates = {
  beton:{rate:260000,unit:'kub metr',label:'Hajm (kub metr)',max:100},
  gisht:{rate:7500,unit:'dona',label:'Miqdor (dona)',max:5000},
  sesma:{rate:70000,unit:'m\u00B2',label:'Maydon (m\u00B2)',max:500},
  tom:{rate:80000,unit:'m\u00B2',label:'Maydon (m\u00B2)',max:500},
  elektr:{rate:35000,unit:'m\u00B2',label:'Maydon (m\u00B2)',max:500},
  suvoq:{rate:25000,unit:'m\u00B2',label:'Maydon (m\u00B2)',max:500}
};
function calcPrice(){
  const s=document.getElementById('calcService').value;
  const a=Math.min(parseInt(document.getElementById('calcAmount').value)||1,rates[s].max);
  const q=parseFloat(document.getElementById('calcQuality').value);
  document.getElementById('amountLabel').textContent=rates[s].label;
  document.getElementById('calcAmount').max=rates[s].max;
  document.getElementById('amountVal').textContent=a+' '+rates[s].unit;
  const t=rates[s].rate*a*q;
  document.getElementById('resultPrice').textContent=f(Math.round(t));
  document.getElementById('breakWorkPrice').textContent=f(Math.round(t))+' so\'m';
}
function f(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,' ')}
function submitForm(){
  const n=document.getElementById('formName').value.trim();
  const p=document.getElementById('formPhone').value.trim();
  if(!n||!p){alert('Ism va telefon raqamni kiriting');return}
  document.getElementById('orderModal').classList.add('active');
}
function closeModal(){document.getElementById('orderModal').classList.remove('active')}
function exitSite(){if(confirm('Saytdan chiqishni xohlaysizmi?'))window.location.href='about:blank'}
window.addEventListener('popstate',()=>{if(tabHistory.length>1){tabBack();history.pushState(null,'',window.location.href)}});
history.pushState(null,'',window.location.href);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
(function(){const a=document.getElementById('bgAudio');if(!a)return;a.volume=.15;const p=()=>{a.play().catch(()=>{})};p();document.addEventListener('click',()=>{if(a.paused)p()},{once:true});document.addEventListener('touchstart',()=>{if(a.paused)p()},{once:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&a.paused)p()})})();
calcPrice();

// SCROLL-DRIVEN HERO ZOOM (IntersectionObserver, no scroll listener)
(function(){
  const fig=document.getElementById('heroFig');
  if(!fig)return;
  const img=fig.querySelector('img');
  const o=new IntersectionObserver(([e])=>{
    const ratio=e.intersectionRatio;
    const s=1+(1-ratio)*.15;
    img.style.transform='scale('+Math.min(s,1.15)+')';
  },{threshold:[0,.1,.2,.3,.4,.5,.6,.7,.8,.9,1]});
  o.observe(fig);
})();

// SCROLL REVEAL
(function(){
  const els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  const o=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}});
  },{threshold:.1});
  els.forEach(e=>o.observe(e));
})();

let touchStartY=0;
document.getElementById('appBody').addEventListener('touchstart',e=>{touchStartY=e.touches[0].clientY},{passive:true});