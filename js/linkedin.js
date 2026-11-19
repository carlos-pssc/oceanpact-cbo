(function(){
var page=document.getElementById('page'), stage=document.getElementById('stage');
var topbar=document.getElementById('topbar');
var MAXW=1280; // largura máxima do conteúdo
var content=document.getElementById('content'), hbg=document.getElementById('headerBg'), hdr=document.getElementById('header');
function fit(){var vw=document.documentElement.clientWidth, w=Math.min(vw,MAXW), s=w/1920, V=vw/s, off=(V-1920)/2;
  page.style.width=V+'px'; page.style.transform='scale('+s+')'; content.style.left=off+'px';
  stage.style.width='100%'; stage.style.height=(4222*s)+'px';
  hbg.style.height=(90*s)+'px'; hdr.style.transform='translate('+(off*s)+'px,'+(15*s)+'px) scale('+s+')';
  if(window.onFit) window.onFit(V);}
window.addEventListener('resize',fit);fit();
function onScroll(){topbar.classList.toggle('scrolled',window.scrollY>10)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Aumentar / diminuir texto (80% a 130%), lembrado neste navegador
var t=1; try{t=parseFloat(localStorage.getItem('cbo-text'))||1}catch(e){}
function apply(){document.documentElement.style.setProperty('--t',t.toFixed(2));try{localStorage.setItem('cbo-text',t)}catch(e){}}
document.querySelectorAll('.fontCtl .plus').forEach(function(b){b.onclick=function(){t=Math.min(1.3,t+0.1);apply()}});
document.querySelectorAll('.fontCtl .minus').forEach(function(b){b.onclick=function(){t=Math.max(0.8,t-0.1);apply()}});
apply();
})();
