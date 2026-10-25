(() => {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, particles = [], bursts = [];
  const pointer = { x: -1000, y: -1000, active: false };
  const countForWidth = () => Math.min(105, Math.max(38, Math.floor(window.innerWidth / 11)));
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = reduceMotion ? 30 : countForWidth();
    particles = Array.from({length: count}, () => ({
      x: Math.random()*width, y: Math.random()*height,
      vx: (Math.random()-.5)*.45, vy: (Math.random()-.5)*.45,
      r: Math.random()*1.7+.6, phase: Math.random()*Math.PI*2
    }));
  }
  function burst(x,y) {
    bursts.push({x,y,life:1});
    if (bursts.length > 8) bursts.shift();
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    for (let i=0;i<particles.length;i++) {
      const p=particles[i];
      p.phase += .015;
      p.x += p.vx + Math.cos(p.phase)*.12;
      p.y += p.vy + Math.sin(p.phase)*.12;
      if(p.x<0)p.x=width;if(p.x>width)p.x=0;
      if(p.y<0)p.y=height;if(p.y>height)p.y=0;
      if(pointer.active) {
        const dx=p.x-pointer.x, dy=p.y-pointer.y, dist=Math.hypot(dx,dy);
        if(dist<125 && dist>0) {
          const force=(125-dist)/125;
          p.x += dx/dist*force*2.7;
          p.y += dy/dist*force*2.7;
        }
      }
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,38,56,${.35+.55*(Math.sin(p.phase)+1)/2})`;
      ctx.shadowBlur=8;ctx.shadowColor='#ff2638';ctx.fill();ctx.shadowBlur=0;
      for(let j=i+1;j<particles.length;j++){
        const q=particles[j],d=Math.hypot(p.x-q.x,p.y-q.y);
        if(d<100){
          ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle=`rgba(255,38,56,${(1-d/100)*.17})`;ctx.lineWidth=.6;ctx.stroke();
        }
      }
    }
    bursts=bursts.filter(b=>b.life>0);
    bursts.forEach(b=>{
      const radius=(1-b.life)*115;
      ctx.beginPath();ctx.arc(b.x,b.y,radius,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,38,56,${b.life*.8})`;ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(b.x,b.y,radius*.64,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,90,100,${b.life*.45})`;ctx.stroke();
      b.life-=.025;
    });
    if(!reduceMotion) requestAnimationFrame(draw);
  }
  resize(); draw();
  if(!reduceMotion) window.addEventListener('resize',resize);
  window.addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.active=true;});
  window.addEventListener('pointerleave',()=>{pointer.active=false;});
  window.addEventListener('pointerdown',e=>burst(e.clientX,e.clientY));
  const toggle=document.getElementById('menuToggle'), nav=document.getElementById('nav');
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');nav.querySelectorAll('a').forEach(link=>link.classList.remove('active'));a.classList.add('active');}));
  const copyBtn=document.getElementById('discordCopy'), status=document.getElementById('copyStatus');
  copyBtn.addEventListener('click',async()=>{
    const username=copyBtn.dataset.discord;
    try { await navigator.clipboard.writeText(username);status.textContent='Discord username copied: '+username; }
    catch { status.textContent='Discord username: '+username+' — copy it manually.'; }
  });
  document.getElementById('year').textContent=new Date().getFullYear();
})();