/* ========================================
   ÉNERGIE RENOUVELABLE — script.js
   ======================================== */

// ──────────────────────────────────────────
// 1. ANIMATED CANVAS BACKGROUND
// ──────────────────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, nodes = [], raf;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // ── Node (energy dot) ──
  function Node() {
    this.reset();
  }
  Node.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.r    = Math.random() * 2 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.life = Math.random() * 200 + 100;
    this.age  = 0;
    const palette = ['#00e5a0', '#00b8d9', '#ffd166', '#8b5cf6', '#ef4444'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  };
  Node.prototype.update = function () {
    this.x   += this.vx;
    this.y   += this.vy;
    this.age ++;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.age > this.life) this.reset();
  };
  Node.prototype.alpha = function () {
    const half = this.life / 2;
    return this.age < half
      ? this.age / half
      : 1 - (this.age - half) / half;
  };

  // create nodes
  const COUNT = Math.min(Math.floor((W * H) / 12000), 120);
  for (let i = 0; i < COUNT; i++) nodes.push(new Node());

  // ── draw ──
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle grid lines
    ctx.strokeStyle = 'rgba(0,229,160,0.03)';
    ctx.lineWidth   = 1;
    const gridSize = 80;
    for (let x = 0; x < W; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // connection lines between close nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.save();
          const alpha = (1 - dist / 140) * 0.12 * nodes[i].alpha() * nodes[j].alpha();
          ctx.strokeStyle = `rgba(0,229,160,${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // dots
    nodes.forEach(n => {
      n.update();
      ctx.save();
      ctx.globalAlpha = n.alpha() * 0.8;
      ctx.fillStyle   = n.color;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = n.color;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    raf = requestAnimationFrame(draw);
  }
  draw();
})();


// ──────────────────────────────────────────
// 2. FLOATING PARTICLES
// ──────────────────────────────────────────
(function () {
  const container = document.getElementById('particles');
  const COLORS    = ['#00e5a0', '#00b8d9', '#ffd166', '#a78bfa'];
  const NUM       = 25;

  for (let i = 0; i < NUM; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size  = Math.random() * 6 + 2;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const delay = Math.random() * 20;
    const dur   = Math.random() * 15 + 12;
    const left  = Math.random() * 100;

    Object.assign(p.style, {
      width:           `${size}px`,
      height:          `${size}px`,
      background:      color,
      left:            `${left}%`,
      animationDuration:`${dur}s`,
      animationDelay:  `${delay}s`,
      boxShadow:       `0 0 ${size * 2}px ${color}`,
    });
    container.appendChild(p);
  }
})();


// ──────────────────────────────────────────
// 3. NAVBAR SCROLL EFFECT
// ──────────────────────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();


// ──────────────────────────────────────────
// 4. MOBILE NAV TOGGLE
// ──────────────────────────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.style.display === 'flex';
      links.style.display  = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position      = 'absolute';
      links.style.top           = '70px';
      links.style.left          = '0';
      links.style.right         = '0';
      links.style.background    = 'rgba(6,13,20,0.97)';
      links.style.padding       = '24px 40px';
      links.style.backdropFilter= 'blur(20px)';
      links.style.borderBottom  = '1px solid rgba(0,229,160,0.12)';
      toggle.textContent        = open ? '☰' : '✕';
    });

    // close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.style.display = 'none';
        toggle.textContent  = '☰';
      });
    });
  }
})();


// ──────────────────────────────────────────
// 5. SCROLL REVEAL
// ──────────────────────────────────────────
(function () {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger siblings
        const siblings = entry.target.parentNode.querySelectorAll('.reveal');
        let delay = 0;
        siblings.forEach((el, idx) => {
          if (el === entry.target) delay = idx * 100;
        });
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


// ──────────────────────────────────────────
// 6. ANIMATED COUNTERS
// ──────────────────────────────────────────
(function () {
  const counters = document.querySelectorAll('.big-stat-num');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1800;
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(target * ease).toLocaleString('fr-FR');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ──────────────────────────────────────────
// 7. ENERGY CARD BORDER GLOW ON HOVER
// ──────────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.energy-card');

  cards.forEach(card => {
    const color = card.dataset.color || '#00e5a0';

    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 30px 80px rgba(0,0,0,0.4), 0 0 40px ${color}22`;
      card.style.borderColor = color + '44';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow  = '';
      card.style.borderColor = '';
    });
  });
})();


// ──────────────────────────────────────────
// 8. SMOOTH CURSOR TRAIL (desktop only)
// ──────────────────────────────────────────
(function () {
  if (window.innerWidth < 768) return;

  const trail = [];
  const NUM   = 8;

  for (let i = 0; i < NUM; i++) {
    const dot = document.createElement('div');
    Object.assign(dot.style, {
      position:     'fixed',
      pointerEvents:'none',
      borderRadius: '50%',
      zIndex:       '9999',
      transition:   `transform 0.1s, opacity 0.3s`,
    });
    document.body.appendChild(dot);
    trail.push({ el: dot, x: -50, y: -50 });
  }

  let mx = -50, my = -50;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function tick() {
    trail.forEach((t, i) => {
      const prev = i === 0 ? { x: mx, y: my } : trail[i - 1];
      t.x += (prev.x - t.x) * 0.35;
      t.y += (prev.y - t.y) * 0.35;
      const size    = (NUM - i) * 1.5 + 1;
      const alpha   = (NUM - i) / NUM * 0.4;
      const hue     = 160 + i * 6;
      t.el.style.cssText = `
        position:fixed; pointer-events:none; border-radius:50%; z-index:9999;
        width:${size}px; height:${size}px;
        background: hsl(${hue}, 100%, 60%);
        opacity: ${alpha};
        transform: translate(${t.x - size / 2}px, ${t.y - size / 2}px);
        box-shadow: 0 0 ${size * 2}px hsl(${hue},100%,50%);
      `;
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


// ──────────────────────────────────────────
// 9. SECTION ACTIVE LINK HIGHLIGHT
// ──────────────────────────────────────────
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}`
        ? 'var(--accent-green)' : '';
    });
  });
})();


// ──────────────────────────────────────────
// 10. HERO PARALLAX
// ──────────────────────────────────────────
(function () {
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.08 + i * 0.04;
      orb.style.transform = `translateY(${y * speed}px)`;
    });
  });
})();
