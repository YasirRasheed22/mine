/* ═══════════════════════════════════════════════════════════════════════
   YASIR RASHEED  ·  2026 PORTFOLIO  ·  script.js
   Three.js neural net, typed text, scroll reveal, magnetic btns, counters
═══════════════════════════════════════════════════════════════════════ */
'use strict';

/* ── YEAR ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─────────────────────────────── LOADER ─────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('out');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    kickHero();
  }, 1600);
});

/* ─────────────────────────────── CURSOR ─────────────────────────────── */
const cDot  = document.getElementById('c-dot');
const cRing = document.getElementById('c-ring');
const cGlow = document.getElementById('c-glow');
let mx = 0, my = 0, rx = 0, ry = 0, gx = 0, gy = 0;

if (!('ontouchstart' in window)) {
  document.documentElement.style.cursor = 'none';
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cDot.style.left = mx + 'px'; cDot.style.top = my + 'px';
  });
  (function loopCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    gx += (mx - gx) * 0.06;
    gy += (my - gy) * 0.06;
    cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
    cGlow.style.left = gx + 'px'; cGlow.style.top = gy + 'px';
    requestAnimationFrame(loopCursor);
  })();

  document.querySelectorAll('a,button,.so,.wc,.pc,.bc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-expand'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-expand'));
  });
} else {
  document.body.classList.add('has-touch');
}

/* ─────────────────────────────── THREE.JS ───────────────────────────── */
function initThree() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = () => canvas.parentElement.clientWidth;
  const H = () => canvas.parentElement.clientHeight;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 1000);
  camera.position.z = 30;

  /* ── PARTICLES ── */
  const N = window.innerWidth > 768 ? 200 : 80;
  const pos = new Float32Array(N * 3);
  const pd  = [];
  for (let i = 0; i < N; i++) {
    const x = (Math.random() - .5) * 66;
    const y = (Math.random() - .5) * 44;
    const z = (Math.random() - .5) * 22;
    pos[i*3]=x; pos[i*3+1]=y; pos[i*3+2]=z;
    pd.push({ x, y, z,
      vx: (Math.random()-.5)*.022,
      vy: (Math.random()-.5)*.016,
      vz: (Math.random()-.5)*.010 });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ color:0x00c8ff, size:.22, sizeAttenuation:true, transparent:true, opacity:.55 });
  const pts  = new THREE.Points(pGeo, pMat);
  scene.add(pts);

  /* ── LINES ── */
  const MAXL = 300;
  const lpos = new Float32Array(MAXL * 6);
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.BufferAttribute(lpos, 3));
  const lineMesh = new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color:0x00c8ff, transparent:true, opacity:.09 }));
  scene.add(lineMesh);

  /* ── ICOSAHEDRON ── */
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(9, 1),
    new THREE.MeshBasicMaterial({ color:0x7c3aed, wireframe:true, transparent:true, opacity:.055 })
  );
  ico.position.set(12, -2, -12);
  scene.add(ico);

  /* ── TORUS ── */
  const tor = new THREE.Mesh(
    new THREE.TorusGeometry(6, .06, 8, 70),
    new THREE.MeshBasicMaterial({ color:0x00ffa3, transparent:true, opacity:.12 })
  );
  tor.position.set(-14, 5, -8);
  tor.rotation.x = .9;
  scene.add(tor);

  /* ── RING 2 ── */
  const tor2 = new THREE.Mesh(
    new THREE.TorusGeometry(4, .04, 8, 60),
    new THREE.MeshBasicMaterial({ color:0x00c8ff, transparent:true, opacity:.08 })
  );
  tor2.position.set(10, 8, -6);
  scene.add(tor2);

  /* ── MOUSE ── */
  let smx = 0, smy = 0;
  document.addEventListener('mousemove', e => {
    smx = (e.clientX / window.innerWidth  - .5) * 2;
    smy = (e.clientY / window.innerHeight - .5) * 2;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
  });

  const D = 10;
  (function anim() {
    requestAnimationFrame(anim);
    for (let i = 0; i < N; i++) {
      const d = pd[i];
      d.x+=d.vx; d.y+=d.vy; d.z+=d.vz;
      if(Math.abs(d.x)>33)d.vx*=-1;
      if(Math.abs(d.y)>22)d.vy*=-1;
      if(Math.abs(d.z)>11)d.vz*=-1;
      pos[i*3]=d.x; pos[i*3+1]=d.y; pos[i*3+2]=d.z;
    }
    pGeo.attributes.position.needsUpdate=true;

    let li=0;
    for(let i=0;i<N&&li<MAXL;i++){
      for(let j=i+1;j<N&&li<MAXL;j++){
        const dx=pd[i].x-pd[j].x, dy=pd[i].y-pd[j].y, dz=pd[i].z-pd[j].z;
        if(dx*dx+dy*dy+dz*dz<D*D){
          lpos[li*6]=pd[i].x;lpos[li*6+1]=pd[i].y;lpos[li*6+2]=pd[i].z;
          lpos[li*6+3]=pd[j].x;lpos[li*6+4]=pd[j].y;lpos[li*6+5]=pd[j].z;
          li++;
        }
      }
    }
    lGeo.setDrawRange(0,li*2);
    lGeo.attributes.position.needsUpdate=true;

    camera.position.x += (smx*2.5 - camera.position.x)*.018;
    camera.position.y += (-smy*2  - camera.position.y)*.018;
    ico.rotation.x+=.0007; ico.rotation.y+=.0011;
    tor.rotation.z+=.0025; tor2.rotation.x+=.0018; tor2.rotation.y+=.0022;

    renderer.render(scene, camera);
  })();
}

/* ─────────────────────────────── HERO KICK ─────────────────────────── */
function kickHero() {
  initThree();
  // badge
  const badge = document.getElementById('heroBadge');
  if(badge) badge.classList.add('vis');

  // words
  const words = document.querySelectorAll('.hero-name .word');
  words.forEach((w, i) => {
    setTimeout(() => w.classList.add('vis'), i * 80);
  });

  // sub + terminal
  setTimeout(() => {
    document.getElementById('heroSub')?.classList.add('vis');
    document.getElementById('heroTerm')?.classList.add('vis');
  }, 460);

  // btns
  setTimeout(() => document.getElementById('heroBtns')?.classList.add('vis'), 600);

  // stats reveal + counter
  setTimeout(() => {
    const stats = document.getElementById('heroStats');
    if(stats) {
      stats.classList.add('vis');
      stats.querySelectorAll('.hs-n').forEach(el => animateCounter(el));
    }
  }, 720);

  // typed text
  setTimeout(startTyped, 700);
}

/* ─────────────────────────────── TYPED TEXT ─────────────────────────── */
const PHRASES = ['building scalable products', 'crafting clean architecture', 'shipping real solutions', 'solving hard problems', 'designing systems that scale'];

function startTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  let pi = 0, ci = 0, del = false, wait = 0;
  (function tick() {
    const ph = PHRASES[pi];
    if (!del && ci <= ph.length)    el.textContent = ph.slice(0, ci++);
    else if (del && ci >= 0)        el.textContent = ph.slice(0, ci--);
    if (!del && ci > ph.length)     { wait++; if(wait>24){ del=true; wait=0; } }
    if (del && ci < 0)              { del=false; pi=(pi+1)%PHRASES.length; ci=0; }
    setTimeout(tick, del ? 35 : (ci===ph.length+1 ? 1800 : 70));
  })();
}

/* ─────────────────────────────── COUNTER ────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.t);
  const dur = 1800;
  const start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

/* ─────────────────────────────── NAVBAR ─────────────────────────────── */
const navbar = document.getElementById('navbar');
const hb     = document.getElementById('hamburger');
const mob    = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('sc', window.scrollY > 50);
  updateActiveNav();
  checkReveal();
  checkBars();
});

hb.addEventListener('click', () => {
  const o = hb.classList.toggle('open');
  hb.setAttribute('aria-expanded', o);
  mob.classList.toggle('open', o);
  mob.setAttribute('aria-hidden', !o);
});

document.querySelectorAll('.ml').forEach(a => a.addEventListener('click', () => {
  hb.classList.remove('open');
  mob.classList.remove('open');
  hb.setAttribute('aria-expanded', false);
  mob.setAttribute('aria-hidden', true);
}));

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight / 3;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop, bot = top + sec.offsetHeight;
    if (scrollMid >= top && scrollMid < bot) {
      document.querySelectorAll('.nl').forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + sec.id)
      );
    }
  });
}

/* ─────────────────────────────── SCROLL REVEAL ─────────────────────── */
const revealEls = document.querySelectorAll('[data-reveal]');

function checkReveal() {
  const vh = window.innerHeight;
  revealEls.forEach(el => {
    if (el.classList.contains('visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < vh * 0.88) {
      el.classList.add('visible');
    }
  });
}

// initial check after loader
setTimeout(checkReveal, 200);

/* ─────────────────────────────── SKILL BARS ────────────────────────── */
let barsAnimated = false;
function checkBars() {
  if (barsAnimated) return;
  const first = document.querySelector('.sb-fill');
  if (!first) return;
  const rect = first.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    document.querySelectorAll('.sb-fill').forEach(fill => {
      fill.style.width = fill.dataset.w + '%';
    });
    barsAnimated = true;
  }
}

/* ─────────────────────────────── MAGNETIC BTNS ─────────────────────── */
function initMagnetic() {
  // removed class dependency — apply to primary buttons
  document.querySelectorAll('.btn-primary, .btn-glass').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 18;
      const y = ((e.clientY - r.top)  / r.height - .5) * 12;
      btn.style.transform = `translate(${x}px,${y}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });
}

/* ─────────────────────────────── SMOOTH SCROLL ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
  });
});

/* ─────────────────────────────── BACK TO TOP ───────────────────────── */
document.getElementById('backToTop')?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ─────────────────────────────── CONTACT FORM ──────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    'cf-name':    { err: 'err-name',    validate: v => v.trim().length >= 2 ? '' : 'Enter your full name.' },
    'cf-email':   { err: 'err-email',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email.' },
    'cf-subject': { err: 'err-subject', validate: v => v.trim().length >= 3 ? '' : 'Subject too short.' },
    'cf-message': { err: 'err-message', validate: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters.' },
  };

  Object.entries(fields).forEach(([id, { err, validate }]) => {
    const el = document.getElementById(id);
    const er = document.getElementById(err);
    el.addEventListener('blur', () => {
      const m = validate(el.value);
      er.textContent = m;
      el.classList.toggle('err', !!m);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('err')) {
        const m = validate(el.value);
        er.textContent = m;
        el.classList.toggle('err', !!m);
      }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    let hasErr = false;
    Object.entries(fields).forEach(([id, { err, validate }]) => {
      const el = document.getElementById(id);
      const er = document.getElementById(err);
      const m  = validate(el.value);
      er.textContent = m;
      el.classList.toggle('err', !!m);
      if (m) hasErr = true;
    });
    if (hasErr) return;

    const btn     = document.getElementById('submitBtn');
    const txtEl   = document.getElementById('btnTxt');
    const loadEl  = document.getElementById('btnLoad');
    const success = document.getElementById('formSuccess');

    btn.disabled = true;
    txtEl.style.display = 'none';
    loadEl.style.display = 'flex';

    await new Promise(r => setTimeout(r, 1800));

    btn.disabled = false;
    txtEl.style.display = '';
    loadEl.style.display = 'none';
    success.classList.add('show');
    form.reset();

    setTimeout(() => success.classList.remove('show'), 6000);
    /*
      ── To wire up Formspree, replace the setTimeout mock above with:
      const res = await fetch('https://formspree.io/f/YOUR_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: document.getElementById('cf-name').value, ... }),
      });
      ──
    */
  });
}

/* ─────────────────────────────── BENTO HOVER ───────────────────────── */
function initBento() {
  document.querySelectorAll('.bc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 6;
      const y = ((e.clientY - r.top)  / r.height - .5) * 4;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ─────────────────────────────── TILT CARDS ────────────────────────── */
function initTilt() {
  document.querySelectorAll('.pc,.wc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 8;
      const y = ((e.clientY - r.top)  / r.height - .5) * 5;
      card.style.transform = `translateY(-5px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ─────────────────────────────── PARALLAX ORBS ─────────────────────── */
function initParallax() {
  const orbs = document.querySelectorAll('.ao');
  window.addEventListener('mousemove', e => {
    const px = (e.clientX / window.innerWidth  - .5) * 2;
    const py = (e.clientY / window.innerHeight - .5) * 2;
    orbs.forEach((o, i) => {
      const f = [.4, .25, .15][i] || .2;
      o.style.transform += ` translate(${px*20*f}px,${py*16*f}px)`;
    });
  });
}

/* ─────────────────────────────── WA FAB SCROLL ─────────────────────── */
(function() {
  const fab = document.getElementById('waFab');
  if (!fab) return;
  window.addEventListener('scroll', () => {
    fab.style.opacity = window.scrollY > 300 ? '1' : '0.7';
  });
})();

/* ─────────────────────────────── SECTION NUMBER COUNTERS ──────────── */
function initSectionCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.hs-n[data-t]').forEach(animateCounter);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .4 });
  document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));
}

/* ─────────────────────────────── INIT ──────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initMagnetic();
  initBento();
  initTilt();
  initSectionCounters();
  checkReveal();
  checkBars();
  updateActiveNav();
  // Parallax only on desktop
  if (!('ontouchstart' in window)) initParallax();
});
