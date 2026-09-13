// ============================================================
// PAGE NAVIGATION — cinematic transitions between the 3 sections
// ============================================================
function goToPage(fromId, toId, onArrive){
  const from = document.getElementById(fromId);
  const to = document.getElementById(toId);

  from.classList.add('is-leaving');

  setTimeout(() => {
    from.classList.remove('is-active', 'is-leaving');
    to.classList.add('is-active', 'is-entering');
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    if (onArrive) onArrive();
    setTimeout(() => to.classList.remove('is-entering'), 1200);
  }, 550);
}

document.getElementById('btn-open-surprise').addEventListener('click', () => {
  goToPage('page-1', 'page-2', startYearsCounter);
});

document.getElementById('btn-next-message').addEventListener('click', () => {
  goToPage('page-2', 'page-3');
});

document.getElementById('btn-gift').addEventListener('click', () => {
  goToPage('page-3', 'page-4');
});

// Generic back navigation — every .back-btn declares where it came from and where to return
document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    goToPage(btn.dataset.from, btn.dataset.to);
  });
});

// ============================================================
// "14 YEARS" ANIMATED COUNT-UP — runs once when page 2 is entered
// ============================================================
let yearsCounted = false;
function startYearsCounter(){
  if (yearsCounted) return;
  yearsCounted = true;

  const el = document.getElementById('years-number');
  const target = 14;
  const duration = 1400;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============================================================
// FLOATING HEART CHAIN — small hearts sprinkled along the link path
// ============================================================
(function buildChainHearts(){
  const container = document.getElementById('chain-hearts');
  const positions = [
    { left: '6%',  top: '55%', delay: '0s' },
    { left: '24%', top: '15%', delay: '.3s' },
    { left: '42%', top: '65%', delay: '.6s' },
    { left: '58%', top: '20%', delay: '.9s' },
    { left: '76%', top: '60%', delay: '1.2s' },
    { left: '92%', top: '25%', delay: '1.5s' },
  ];
  positions.forEach(pos => {
    const heart = document.createElement('span');
    heart.className = 'chain-heart';
    heart.textContent = '❤';
    heart.style.left = pos.left;
    heart.style.top = pos.top;
    heart.style.animationDelay = pos.delay;
    container.appendChild(heart);
  });
})();

// ============================================================
// AMBIENT BACKGROUND PARTICLES — floating hearts, petals, sparkles
// ============================================================
(function ambientParticles(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COUNT = prefersReduced ? 0 : (window.innerWidth < 600 ? 16 : 28);
  const TYPES = ['heart', 'petal', 'spark'];
  const particles = [];

  function rand(min, max){ return Math.random() * (max - min) + min; }

  function makeParticle(){
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    return {
      type,
      x: rand(0, w),
      y: rand(0, h),
      size: type === 'spark' ? rand(1.5, 3) : rand(8, 16),
      speedY: rand(0.15, 0.5),
      speedX: rand(-0.25, 0.25),
      sway: rand(0.5, 1.5),
      swayOffset: rand(0, Math.PI * 2),
      rotation: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.01, 0.01),
      opacity: rand(0.25, 0.6),
      hue: type === 'petal' ? rand(320, 350) : rand(300, 330),
    };
  }

  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function drawHeart(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `hsl(${p.hue}, 90%, 75%)`;
    const s = p.size / 16;
    ctx.beginPath();
    ctx.moveTo(0, 4 * s);
    ctx.bezierCurveTo(-8 * s, -4 * s, -4 * s, -10 * s, 0, -3 * s);
    ctx.bezierCurveTo(4 * s, -10 * s, 8 * s, -4 * s, 0, 4 * s);
    ctx.fill();
    ctx.restore();
  }

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = `hsl(${p.hue}, 85%, 80%)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size / 2, p.size / 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawSpark(p){
    ctx.save();
    ctx.globalAlpha = p.opacity * (0.6 + 0.4 * Math.sin(Date.now() / 400 + p.swayOffset));
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(Date.now() / 1000 * p.sway + p.swayOffset) * 0.3;
      p.rotation += p.rotSpeed;

      if (p.y < -20) { p.y = h + 20; p.x = rand(0, w); }
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;

      if (p.type === 'heart') drawHeart(p);
      else if (p.type === 'petal') drawPetal(p);
      else drawSpark(p);
    });
    requestAnimationFrame(animate);
  }
  if (!prefersReduced) animate();
})();

// ============================================================
// FINAL "MAKE A WISH" MOMENT — confetti burst + reveal message
// ============================================================
document.getElementById('btn-wish').addEventListener('click', function(){
  const msg = document.getElementById('final-message');
  msg.classList.add('is-shown');
  this.disabled = true;
  this.style.opacity = '0.6';
  fireConfetti();
});

function fireConfetti(){
  const canvas = document.getElementById('confetti');
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const colors = ['#ff7ab6', '#a76bff', '#ff5d7a', '#ffd6e8', '#c98bff'];
  const pieces = [];
  const heartEmojis = ['❤', '💖', '✨'];

  for (let i = 0; i < 140; i++){
    pieces.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      isHeart: Math.random() < 0.3,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
      life: 0,
    });
  }

  const duration = 3800;
  const startTime = performance.now();

  function frame(now){
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      p.speedY += 0.02;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);

      if (p.isHeart){
        ctx.font = `${p.size + 6}px serif`;
        ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }
      ctx.restore();
    });

    if (elapsed < duration){
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  requestAnimationFrame(frame);
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
