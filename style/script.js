const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];
let shootingStars = [];
let explosions = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createStars();
}

function createStars() {
  stars = [];
  const numStars = 300;
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02
    });
  }
}

function drawCrossStar(star) {
  const { x, y, size, alpha } = star;
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(x, y - size * 2);
  ctx.lineTo(x, y + size * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - size * 2, y);
  ctx.lineTo(x + size * 2, y);
  ctx.stroke();
}

function createShootingStar() {
  const x = Math.random() * width * 0.5;
  const y = Math.random() * height * 0.5;
  shootingStars.push({
    x,
    y,
    length: Math.random() * 100 + 100,
    speed: Math.random() * 10 + 6,
    angle: Math.PI / 4,
    alpha: 1
  });
}

function drawShootingStar(star) {
  const { x, y, length, alpha } = star;
  const dx = Math.cos(star.angle) * length;
  const dy = Math.sin(star.angle) * length;

  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
}

function createExplosion(x, y) {
  const particles = [];
  const num = 30;
  for (let i = 0; i < num; i++) {
    const angle = (Math.PI * 2) * (i / num);
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * (Math.random() * 3 + 2),
      vy: Math.sin(angle) * (Math.random() * 3 + 2),
      alpha: 1,
      size: Math.random() * 2 + 1
    });
  }
  explosions.push(particles);
}

function drawExplosion() {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const particles = explosions[i];
    for (let j = particles.length - 1; j >= 0; j--) {
      const p = particles[j];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.alpha <= 0) {
        particles.splice(j, 1);
      }
    }
    if (particles.length === 0) {
      explosions.splice(i, 1);
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  // Vẽ sao chữ thập
  for (let star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) {
      star.delta = -star.delta;
    }
    drawCrossStar(star);
  }

  // Sao băng
  if (Math.random() < 0.05) {
    createShootingStar();
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.01;
    drawShootingStar(s);
    if (s.alpha <= 0) {
      shootingStars.splice(i, 1);
    }
  }

  // Hiệu ứng nổ sao
  drawExplosion();

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createExplosion(x, y);
});

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  createExplosion(x, y);
}, { passive: false });

window.addEventListener("resize", resize);
resize();
animate();