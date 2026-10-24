const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let width = 0, height = 0;
function resizeCanvas() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({length: 75}, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
    r: Math.random() * 1.7 + .5
  }));
}
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,38,56,.65)'; ctx.fill();
  }
  requestAnimationFrame(drawParticles);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); drawParticles();

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', () => {
  nav.querySelectorAll('a').forEach(link => link.classList.remove('active'));
  if (a.closest('nav')) a.classList.add('active');
}));

document.addEventListener('click', event => {
  if (event.target.closest('a, button')) return;
  const x = event.clientX, y = event.clientY;
  particles.forEach(p => {
    const dx = p.x - x, dy = p.y - y, d = Math.sqrt(dx*dx + dy*dy) || 1;
    if (d < 180) { p.vx += dx / d * 2.5; p.vy += dy / d * 2.5; }
  });
});

const discordButton = document.getElementById('discordCopy');
const copyStatus = document.getElementById('copyStatus');
discordButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(discordButton.dataset.discord);
    copyStatus.textContent = 'Discord username copied!';
  } catch {
    copyStatus.textContent = 'Discord username: ' + discordButton.dataset.discord;
  }
});
