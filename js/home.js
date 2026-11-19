(function(){
// Escala o canvas de 1920px para a largura da janela
var page=document.getElementById('page'), stage=document.getElementById('stage');
var topbar=document.getElementById('topbar');
var MAXW=1280; // largura máxima do conteúdo
var content=document.getElementById('content'), hbg=document.getElementById('headerBg'), hdr=document.getElementById('header');
function fit(){var vw=document.documentElement.clientWidth, w=Math.min(vw,MAXW), s=w/1920, V=vw/s, off=(V-1920)/2;
  page.style.width=V+'px'; page.style.transform='scale('+s+')'; content.style.left=off+'px';
  stage.style.width='100%'; stage.style.height=(5454*s)+'px';
  hbg.style.height=(90*s)+'px'; hdr.style.transform='translate('+(off*s)+'px,'+(15*s)+'px) scale('+s+')';
  if(window.onFit) window.onFit(V);}
var decoIn=document.querySelector('#decoBg > div');
window.onFit=function(V){decoIn.style.transform='rotate(-90deg) scale(1,'+(V/2165*1.02)+')'};
window.addEventListener('resize',fit);fit();
function onScroll(){topbar.classList.toggle('scrolled',window.scrollY>10)}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Carrossel
var slides=[].slice.call(document.querySelectorAll('.slide')), n=slides.length, cur=0;
var dots=document.getElementById('dots');
for(var i=0;i<n;i++){var b=document.createElement('button');b.setAttribute('aria-label','Slide '+(i+1));b.dataset.k=i;b.innerHTML='<img alt="">';dots.appendChild(b);}
function render(){
  slides.forEach(function(s,k){var d=((k-cur)%n+n)%n; if(d>2)d-=n; s.dataset.pos=d;});
  [].forEach.call(dots.children,function(b,k){var on=k===cur;b.classList.toggle('on',on);b.firstChild.src=on?'assets/icones/dot-active.svg':'assets/icones/dot.svg';});
}
function go(k){cur=((k%n)+n)%n;render();}
document.getElementById('prev').onclick=function(){go(cur-1)};
document.getElementById('next').onclick=function(){go(cur+1)};
dots.onclick=function(e){var b=e.target.closest('button');if(b)go(+b.dataset.k)};
slides.forEach(function(s,k){s.onclick=function(){go(k)}});
render();
var timer=setInterval(function(){go(cur+1)},5000);
document.getElementById('carousel').addEventListener('mouseenter',function(){clearInterval(timer)});

// Unidades: troca o conteúdo e move o indicador (onda + tartaruga)
var units=[].slice.call(document.querySelectorAll('.unit')), ind=document.getElementById('indicator');
var imgBox=document.getElementById('detailImg'), title=document.getElementById('detailTitle'), text=document.getElementById('detailText'), link=document.getElementById('detailLink');
var detail=document.getElementById('detail'), thumb=document.getElementById('thumb');
function host(u){return u.replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/.*$/,'')}
// Pré-carrega todas as imagens assim que a página abre
var cache=UNITS.map(function(d){var im=new Image();im.decoding='async';im.src=d.img;return im});
var body=document.getElementById('detailBody'), cur=-1, token=0;
imgBox.innerHTML='<div class="ph"></div><span class="go">Visitar site ↗</span>';
var ph=imgBox.querySelector('.ph');
function select(i){
  if(i===cur) return; cur=i; var my=++token;
  var u=units[i], d=UNITS[i];
  ind.style.top=(parseFloat(u.style.top)+u.offsetHeight-14.3)+'px';
  imgBox.href=d.url; imgBox.title='Abrir o site de '+d.name;
  // imagem: entra por cima da anterior com fade + leve zoom
  var src=cache[i], im=document.createElement('img'); im.alt=d.name; im.src=src.src;
  var old=[].slice.call(imgBox.querySelectorAll('img'));
  imgBox.insertBefore(im,imgBox.querySelector('.go'));
  var show=function(){ if(my!==token){im.remove();return}
    ph.style.display='none';
    requestAnimationFrame(function(){requestAnimationFrame(function(){im.classList.add('show')})});
    setTimeout(function(){old.forEach(function(o){o.remove()})},600);
  };
  (im.decode?im.decode():Promise.resolve()).then(show,function(){ if(my!==token)return; im.remove(); old.forEach(function(o){o.remove()}); ph.textContent=d.name; ph.style.display='flex'; });
  // texto: sai rápido e entra suave
  body.classList.add('out');
  setTimeout(function(){ if(my!==token)return;
    title.textContent=d.name; text.textContent=d.text;
    link.href=d.url; link.textContent=host(d.url)+' ↗';
    detail.scrollTop=0; syncThumb(); body.classList.remove('out');
  },180);
}
units.forEach(function(u,i){u.onclick=function(){select(i)}});
function syncThumb(){
  var max=detail.scrollHeight-detail.clientHeight, track=1257.5, th=Math.max(120,track*detail.clientHeight/Math.max(detail.scrollHeight,1));
  thumb.style.height=th+'px'; thumb.style.top=(max>0?(track-th)*detail.scrollTop/max:0)+'px';
}
detail.addEventListener('scroll',syncThumb);
select(0);
})();

// ===== Frota =====
(function(){
  var tabs=document.getElementById('fleetTabs'), boat=document.getElementById('fleetBoat'), info=document.getElementById('fleetInfo');
  var stage=document.getElementById('fleetStage'), nameEl=document.getElementById('fleetName'), specs=document.getElementById('fleetSpecs');
  var prev=document.getElementById('fleetPrev'), next=document.getElementById('fleetNext'), thumb=document.getElementById('fleetThumb'), count=document.getElementById('fleetCount');
  var total=0; FLEET.forEach(function(t){total+=t.v.length}); document.getElementById('fleetTotalN').textContent=total;
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // abas: distribuídas na largura, com a onda + tartaruga embaixo da ativa
  var W=1776, slot=W/FLEET.length;
  FLEET.forEach(function(t,i){
    var b=document.createElement('button'); b.setAttribute('role','tab'); b.textContent=t.k;
    b.style.left=(slot*i+slot/2)+'px'; b.onclick=function(){show(i)}; tabs.appendChild(b);
  });
  var btns=[].slice.call(tabs.querySelectorAll('button'));


  // mar: duas camadas de ondas que correm em sentidos opostos
  (function(){
    var sea=document.getElementById('fleetSea'), NS='http://www.w3.org/2000/svg';
    sea.setAttribute('viewBox','0 0 1776 90');
    function layer(cls,period,amp,base,fill,stroke,extra){
      var w=1776+period*3, d='M0 90L0 '+base, pts=[];
      for(var x=0;x<=w;x+=8){var y=base+Math.sin(x/period*2*Math.PI)*amp+Math.sin(x/period*4*Math.PI+1)*amp*.25; d+='L'+x+' '+y.toFixed(1); pts.push(x+' '+y.toFixed(1));}
      d+='L'+w+' 90Z';
      var g=document.createElementNS(NS,'g'); g.setAttribute('class','layer '+cls);
      var b=document.createElementNS(NS,'path'); b.setAttribute('d',d); b.setAttribute('fill',fill); g.appendChild(b);
      var l=document.createElementNS(NS,'path'); l.setAttribute('d','M'+pts.join('L')); l.setAttribute('stroke',stroke); l.setAttribute('stroke-width',extra); l.setAttribute('fill','none'); l.setAttribute('stroke-linecap','round'); g.appendChild(l);
      sea.appendChild(g);
    }
    sea.innerHTML='<defs><linearGradient id="seaG1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="seaG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>';
    layer('l1',360,5,26,'url(#seaG1)','rgba(255,255,255,.45)',2);
    layer('l2',300,6,36,'url(#seaG2)','#fff',3);
  })();
  var boatX=null, sailT=null;
  function moveBoat(x, first){
    if(first||boatX===null){ boat.style.transition='none'; boat.style.left=x+'px'; boat.offsetWidth; boat.style.transition=''; boatX=x; return; }
    if(Math.abs(x-boatX)<1) return;
    boat.classList.toggle('left',x<boatX);
    clearTimeout(sailT); boat.classList.add('sailing');
    requestAnimationFrame(function(){ boat.style.left=x+'px'; });
    boatX=x;
    sailT=setTimeout(function(){ boat.classList.remove('sailing'); },1200);
  }
  // posições do carrossel (mesmo formato do carrossel do topo)
  var POS={'0':'translateX(0) scale(1)','-1':'translateX(-500px) scale(.72)','1':'translateX(500px) scale(.72)','-2':'translateX(-790px) scale(.5)','2':'translateX(790px) scale(.5)'};
  var t=null, cur=0, slides=[], tIdx=-1;

  function layout(){
    var n=slides.length;
    slides.forEach(function(s,k){
      var d=k-cur;
      s.dataset.d=d;
      if(Math.abs(d)<=2){s.style.transform=POS[d];s.style.opacity=1;s.style.zIndex=10-Math.abs(d);s.style.filter=d?'brightness(.75)':'none';s.style.pointerEvents='auto'}
      else{s.style.transform='translateX('+(d<0?-1150:1150)+'px) scale(.4)';s.style.opacity=0;s.style.zIndex=0;s.style.pointerEvents='none'}
    });
    var v=t.v[cur];
    nameEl.classList.add('out'); specs.classList.add('out');
    setTimeout(function(){
      nameEl.textContent=v.n;
      var parts=[];
      if(v.a) parts.push('<span><b>'+esc(v.a)+'</b>de convés</span>');
      if(v.w) parts.push('<span><b>'+esc(v.w)+'</b>de porte bruto</span>');
      if(v.dp) parts.push('<span><b>'+esc(v.dp)+'</b>posicionamento dinâmico</span>');
      specs.innerHTML=parts.join('');
      nameEl.classList.remove('out'); specs.classList.remove('out');
    },180);
    count.textContent=(cur+1)+' / '+n;
    var w=Math.max(8,100/n); thumb.style.width=w+'%'; thumb.style.left=(n>1?(100-w)*cur/(n-1):0)+'%';
    prev.disabled=cur===0; next.disabled=cur===n-1;
  }
  function go(k){ if(!t) return; cur=Math.max(0,Math.min(t.v.length-1,k)); layout(); }

  function show(i){
    if(i===tIdx) return; var first=tIdx<0; tIdx=i; t=FLEET[i];
    btns.forEach(function(b,k){b.classList.toggle('on',k===i);b.setAttribute('aria-selected',k===i)});
    moveBoat(slot*i+slot/2, first);
    info.classList.add('out'); stage.classList.add('fade');
    setTimeout(function(){
      info.querySelector('h3').textContent=t.k+' · '+t.full+' · '+t.v.length+(t.v.length>1?' embarcações':' embarcação');
      info.querySelector('p').textContent=t.desc;
      stage.innerHTML=t.v.map(function(v,k){return '<div class="vslide" data-k="'+k+'"><img draggable="false" src="assets/frota/'+v.i+'.webp" alt="'+esc(v.n)+'"></div>'}).join('');
      slides=[].slice.call(stage.children);
      slides.forEach(function(s,k){s.onclick=function(){if(k!==cur)go(k)}});
      cur=0; layout();
      info.classList.remove('out'); stage.classList.remove('fade');
    }, first?0:250);
  }
  prev.onclick=function(){go(cur-1)};
  next.onclick=function(){go(cur+1)};

  // arrastar (mouse ou toque) para passar
  var sx=null;
  stage.addEventListener('pointerdown',function(e){sx=e.clientX});
  window.addEventListener('pointerup',function(e){ if(sx===null) return; var dx=e.clientX-sx; sx=null; if(Math.abs(dx)>40) go(cur+(dx<0?1:-1)); });
  // setas do teclado quando a seção está visível
  document.addEventListener('keydown',function(e){
    var r=stage.getBoundingClientRect(); if(r.bottom<0||r.top>window.innerHeight) return;
    if(e.key==='ArrowRight') go(cur+1); else if(e.key==='ArrowLeft') go(cur-1);
  });
  // pré-carrega as fotos depois que a página abre
  window.addEventListener('load',function(){setTimeout(function(){FLEET.forEach(function(t){t.v.forEach(function(v){var im=new Image();im.src='assets/frota/'+v.i+'.webp'})})},1500)});
  show(0);
})();

// some o selo quando o aviso do rodapé aparece
(function(){var u=document.getElementById('unofficial'),c=document.getElementById('copy');
  function chk(){var r=c.getBoundingClientRect();u.classList.toggle('hide',r.top<window.innerHeight-20)}
  window.addEventListener('scroll',chk,{passive:true});window.addEventListener('resize',chk);chk();})();
