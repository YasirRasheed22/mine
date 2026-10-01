/* ═══════════════════════════════════════════════════════════════
   MOTION LAYER — Lenis + GSAP/ScrollTrigger + Three.js
   1. smooth scroll        5. scrubbed about statement
   2. intro curtain        6. scroll-drawn experience timeline
   3. hero choreography    7. pinned horizontal projects gallery
   4. living software-architecture background   8. interactive 3D skill sphere
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (reduce || typeof gsap === 'undefined') {
    root.classList.remove('js-motion');
    root.classList.add('no-motion');
    const cu = document.getElementById('curtain'); if (cu) cu.remove();
    $$('.cnt').forEach(el => el.textContent = el.dataset.to);
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ── 1. Smooth scroll ── */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      const t = $(a.getAttribute('href'));
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -56, duration: 1.6 }); }
    });
    const top = $('#backToTop');
    if (top) top.addEventListener('click', e => { e.stopImmediatePropagation(); lenis.scrollTo(0, { duration: 1.8 }); }, true);
  }

  /* progress bar */
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: .3 } });

  /* ── 2. Intro curtain (single loader, lives in the HTML so it covers first paint) ── */
  const curtain = $('#curtain');
  window.__introStarted = true;
  const cnt = $('.cu-count', curtain);
  const prog = { v: 0 };
  if (lenis) lenis.stop();

  gsap.timeline({ defaults: { ease: 'power4.out' },
      onComplete: () => { curtain.remove(); if (lenis) lenis.start(); } })
    .from('.cu-mark', { yPercent: 40, opacity: 0, duration: .8 })
    .to(prog, { v: 100, duration: 1.1, ease: 'power2.inOut',
      onUpdate: () => cnt.textContent = String(Math.round(prog.v)).padStart(3, '0') }, 0)
    .to('.cu-mark, .cu-count', { opacity: 0, duration: .3, ease: 'power2.in' }, '+=.05')
    .to('#curtain i:first-child', { scaleY: 0, duration: .9, ease: 'power4.inOut' }, '>-.05')
    .to('#curtain i:last-child',  { scaleY: 0, duration: .9, ease: 'power4.inOut' }, '<')
    .add(() => heroIn(), '-=.45');

  /* ── 3. Hero ── */
  const solarState = { intro: 0 };
  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.hero-badge', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8 })
      .fromTo('.hero-name .word, .hero-name .amp',
        { y: 0, yPercent: 110, opacity: 0, rotate: 4 },
        { y: 0, yPercent: 0, opacity: 1, rotate: 0, duration: 1.1, stagger: .09 }, '-=.5')
      .fromTo('.hero-sub',      { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .9 }, '-=.7')
      .fromTo('.hero-terminal', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, '-=.65')
      .fromTo('.hero-btns',     { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, '-=.6')
      .fromTo('.hero-stats',    { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: .8 }, '-=.6')
      .fromTo('.scroll-mouse',  { opacity: 0 }, { opacity: 1, duration: .8 }, '-=.3')
      // planets fly out of the sun into their orbits
      .fromTo('.solar', { opacity: 0 }, { opacity: 1, duration: .8, ease: 'power2.out' }, 0.2)
      .to(solarState, { intro: 1, duration: 2.6, ease: 'expo.out' }, 0.2);
  }

  initSolar();
  function initSolar() {
    const stage = $('#solarStage'), sun = $('#sun');
    if (!stage) return;
    const ic = (n, v) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${n}/${n}-${v || 'original'}.svg`;
    // [slug, label, orbit, glow rgb]
    const defs = [
      ['react', 'React / React Native', 0, '97,218,251'], ['nodejs', 'Node.js', 0, '104,160,99'],
      ['docker', 'Docker', 0, '36,150,237'], ['firebase', 'Firebase', 0, '255,202,40'],
      ['javascript', 'JavaScript', 1, '247,223,30'], ['typescript', 'TypeScript', 1, '49,120,198'],
      ['php', 'PHP / CodeIgniter', 1, '119,123,179'], ['mysql', 'MySQL', 1, '0,117,143'],
      ['git', 'Git', 1, '240,80,50'], ['postgresql', 'PostgreSQL', 1, '51,103,145'],
      ['android', 'Android', 2, '61,220,132'], ['electron', 'Electron', 2, '71,159,174'],
      ['tensorflow', 'TensorFlow', 2, '255,111,0'], ['html5', 'HTML5', 2, '228,77,38'],
      ['css3', 'CSS3', 2, '38,77,228'], ['python', 'Python', 2, '255,212,59'],
      ['wordpress', 'WordPress', 2, '33,117,155', 'plain'], ['redis', 'Redis', 2, '220,56,44']
    ];
    const radii = [118, 190, 262], speeds = [.5, .33, .22];
    const counts = [0, 0, 0]; defs.forEach(d => counts[d[2]]++);
    const seen = [0, 0, 0];
    const planets = defs.map(d => {
      const el = document.createElement('div');
      el.className = 'planet ' + d[0];
      el.style.setProperty('--glow', `rgba(${d[3]},.35)`);
      el.innerHTML = `<img src="${ic(d[0], d[4])}" alt="${d[1]}" loading="lazy" decoding="async"><i>${d[1]}</i>`;
      stage.appendChild(el);
      const o = d[2], idx = seen[o]++;
      const p = { el, o, a: (idx / counts[o]) * Math.PI * 2 + o * .9, slow: 1 };
      el.addEventListener('mouseenter', () => p.slow = .08);
      el.addEventListener('mouseleave', () => p.slow = 1);
      return p;
    });
    const orbits = $$('.orbit', stage);
    const view = { tilt: 62, rz: -18, tTilt: 62, tRz: -18 };
    addEventListener('mousemove', e => {
      view.tRz = -18 + (e.clientX / innerWidth - .5) * 26;
      view.tTilt = 62 - (e.clientY / innerHeight - .5) * 16;
    });
    let visible = true;
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe($('#solar'));
    gsap.ticker.add((t, dt) => {
      if (!visible) return;
      const s = dt / 1000;
      view.tilt += (view.tTilt - view.tilt) * .05;
      view.rz += (view.tRz - view.rz) * .05;
      stage.style.transform = `rotateX(${view.tilt}deg) rotateZ(${view.rz}deg)`;
      const inv = `rotateZ(${-view.rz}deg) rotateX(${-view.tilt}deg)`;
      sun.style.transform = inv + ` scale(${.4 + .6 * solarState.intro})`;
      orbits.forEach((o, i) => {
        const r = radii[i] * solarState.intro;
        o.style.width = o.style.height = r * 2 + 'px';
        o.style.margin = `${-r}px 0 0 ${-r}px`;
      });
      planets.forEach(p => {
        p.a += speeds[p.o] * s * p.slow;
        const R = radii[p.o] * solarState.intro;
        p.el.style.transform = `rotateZ(${p.a}rad) translateX(${R}px) rotateZ(${-p.a}rad) ${inv} scale(${.3 + .7 * solarState.intro})`;
      });
    });
  }

  gsap.to('.hero-visual', { yPercent: -12, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-copy', { yPercent: 8, opacity: .25, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'center top', end: 'bottom top', scrub: true } });

  [['.ao1', 220], ['.ao2', -300], ['.ao3', 180]].forEach(([s, d]) =>
    gsap.to(s, { y: d, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 } }));

  /* marquee reacts to scroll velocity */
  const track = $('.mq-track');
  if (track) {
    track.style.animation = 'none';
    let x = 0, dir = -1;
    const skew = gsap.quickTo(track, 'skewX', { duration: .4, ease: 'power3' });
    ScrollTrigger.create({ onUpdate: s => {
      dir = s.direction === 1 ? -1 : 1;
      skew(gsap.utils.clamp(-14, 14, s.getVelocity() / -140));
    } });
    gsap.ticker.add(() => {
      const h = track.scrollWidth / 2;
      x += dir * 1.1;
      if (x <= -h) x += h;
      if (x > 0) x -= h;
      gsap.set(track, { x });
    });
  }

  /* ── 4. Background: living software architecture (nodes, APIs, packets, code) ── */
  initNet();
  function initNet() {
    const cv = $('#bgnet'); if (!cv) return;
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const fit = () => { dpr = Math.min(devicePixelRatio, 1.5); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; };
    fit(); addEventListener('resize', fit);

    const small = innerWidth < 768;
    const NN = small ? 34 : 72, MAXD = small ? 130 : 175;
    const tags = ['API', 'DB', 'AUTH', 'CACHE', 'UI', 'CI/CD', 'WS', 'QUEUE', 'JWT', 'REST', 'SQL', 'CDN', 'LB', 'SMS', 'PAY'];
    const rnd = Math.random;
    const nodes = Array.from({ length: NN }, (_, i) => ({
      x: rnd() * W, y: rnd() * H * 1.4, vx: (rnd() - .5) * .22, vy: (rnd() - .5) * .22,
      r: 1.6 + rnd() * 1.6, tag: i % 5 === 0 ? tags[(i / 5 | 0) % tags.length] : null, ph: rnd() * 6.28
    }));
    const snippets = ['const app = express()', '=> { }', 'async / await', 'SELECT * FROM jobs', 'git push origin main', '200 OK', 'POST /api/dispatch',
      'useEffect(() => {})', 'docker compose up', 'npm run build', 'INSERT INTO leads', 'socket.emit("job")', 'JWT.verify(token)', 'npx react-native run-android',
      'firebase deploy', 'stripe.charges.create', 'twilio.calls.create', 'res.json({ ok: true })'];
    const code = Array.from({ length: small ? 6 : 14 }, (_, i) => ({
      t: snippets[i % snippets.length], x: rnd() * W, y: rnd() * H, vy: .12 + rnd() * .22, a: .05 + rnd() * .07, fs: 11 + (rnd() * 3 | 0)
    }));
    const packets = [];
    let spawn = 0;
    const mouse = { x: -999, y: -999 };
    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    // accent colour follows the section (hue in HSL)
    const hue = { v: 190 };
    const accents = { hero: 190, about: 200, experience: 150, skills: 265, services: 190, projects: 38, education: 265, contact: 190 };
    Object.keys(accents).forEach(id => {
      const el = $('#' + id) || (id === 'projects' ? $('.hz') : null);
      if (el) ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%',
        onToggle: s => s.isActive && gsap.to(hue, { v: accents[id], duration: 1.4, ease: 'power2.inOut' }) });
    });
    let vel = 0;
    ScrollTrigger.create({ onUpdate: s => { vel = Math.min(Math.abs(s.getVelocity()) / 2500, 3); } });

    gsap.ticker.add((t, dt) => {
      const k = Math.min(dt / 16.7, 3);
      const sy = (scrollY * .12) % (H * 1.4);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const hs = Math.round(hue.v), col = a => `hsla(${hs},95%,62%,${a})`;

      // floating code
      ctx.textAlign = 'left';
      code.forEach(c => {
        c.y -= c.vy * k * (1 + vel); if (c.y < -20) { c.y = H + 20; c.x = rnd() * W; }
        ctx.font = `${c.fs}px "Space Mono", monospace`;
        ctx.fillStyle = col(c.a); ctx.fillText(c.t, c.x, c.y);
      });

      // move nodes (mouse gently repels)
      nodes.forEach(n => {
        n.x += n.vx * k; n.y += n.vy * k;
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H * 1.4; if (n.y > H * 1.4) n.y = -20;
        const dx = n.x - mouse.x, dy = (n.y - sy) - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400) { const d = Math.sqrt(d2) || 1, f = (120 - d) / 120 * .9; n.x += dx / d * f; n.y += dy / d * f; }
      });
      const P = n => ({ x: n.x, y: n.y - sy });

      // links
      const links = [];
      for (let i = 0; i < NN; i++) {
        const a = P(nodes[i]);
        for (let j = i + 1; j < NN; j++) {
          const b = P(nodes[j]), dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
          if (d < MAXD) {
            ctx.strokeStyle = col(.13 * (1 - d / MAXD));
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (a.y > -40 && a.y < H + 40) links.push([i, j]);
          }
        }
        // cursor acts like a client sending requests
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 150) { ctx.strokeStyle = col(.28 * (1 - md / 150)); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }

      // data packets travelling along links
      spawn -= dt;
      if (spawn <= 0 && links.length && packets.length < 40) {
        const l = links[rnd() * links.length | 0];
        packets.push({ a: l[0], b: l[1], t: 0, sp: .008 + rnd() * .012 });
        spawn = 90 / (1 + vel * 2);
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]; p.t += p.sp * k * (1 + vel);
        if (p.t >= 1) { packets.splice(i, 1); continue; }
        const a = P(nodes[p.a]), b = P(nodes[p.b]);
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, col(.95)); g.addColorStop(1, col(0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
      }

      // nodes + tags
      ctx.font = '10px "Space Mono", monospace'; ctx.textAlign = 'center';
      nodes.forEach(n => {
        const p = P(n); if (p.y < -30 || p.y > H + 30) return;
        n.ph += .02 * k; const pulse = .5 + .5 * Math.sin(n.ph);
        ctx.fillStyle = col(.55 + pulse * .3); ctx.beginPath(); ctx.arc(p.x, p.y, n.r, 0, 6.283); ctx.fill();
        if (n.tag) {
          const w = ctx.measureText(n.tag).width + 14;
          ctx.strokeStyle = col(.28 + pulse * .15); ctx.fillStyle = 'rgba(5,8,20,.55)';
          ctx.beginPath(); ctx.roundRect(p.x - w / 2, p.y + 8, w, 17, 6); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col(.75); ctx.fillText(n.tag, p.x, p.y + 20);
        }
      });
    });
  }

  /* ── Section titles / labels ── */
  $$('.sec-title').forEach(t => {
    t.innerHTML = t.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="ln">${l}</span>`).join('<br/>');
    gsap.fromTo($$('.ln', t), { yPercent: 115, rotate: 3 },
      { yPercent: 0, rotate: 0, duration: 1.1, ease: 'power4.out', stagger: .12,
        scrollTrigger: { trigger: t, start: 'top 88%' } });
  });
  $$('.sec-label').forEach(l =>
    gsap.fromTo(l, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: l, start: 'top 92%' } }));
  $$('.sec-sub').forEach(s =>
    gsap.fromTo(s, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .9, delay: .15, ease: 'power3.out',
      scrollTrigger: { trigger: s, start: 'top 92%' } }));

  /* ── 5. About: scrubbed word-by-word statement + counters ── */
  const st = $('#abStatement');
  if (st) {
    st.innerHTML = st.textContent.trim().split(/(\s+)/).map(w => /^\s+$/.test(w) ? w : `<span class="w">${w}</span>`).join('');
    st.querySelectorAll('.w').forEach(w => { if (!w.textContent.trim()) w.remove(); });
    gsap.to($$('.w', st), { opacity: 1, stagger: .12, ease: 'none',
      scrollTrigger: { trigger: st, start: 'top 82%', end: 'bottom 48%', scrub: .6 } });
  }
  $$('.ab-stat').forEach((s, i) =>
    gsap.fromTo(s, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: .9, delay: i * .08, ease: 'power3.out',
      scrollTrigger: { trigger: '.ab-grid', start: 'top 88%' } }));
  $$('.cnt').forEach(el => {
    const o = { v: 0 };
    el.textContent = '0';
    gsap.to(o, { v: +el.dataset.to, duration: 1.8, ease: 'power2.out',
      onUpdate: () => el.textContent = Math.round(o.v),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* ── 6. Experience timeline ── */
  gsap.to('.xp-line-fg', { scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.xp-wrap', start: 'top 60%', end: 'bottom 70%', scrub: .5 } });
  $$('.xp-item').forEach(it => {
    ScrollTrigger.create({ trigger: it, start: 'top 62%', onEnter: () => it.classList.add('on'), onLeaveBack: () => it.classList.remove('on') });
    gsap.fromTo($('.xp-card', it), { x: 70, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: it, start: 'top 78%' } });
    gsap.fromTo($('.xp-date', it), { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: it, start: 'top 78%' } });
  });

  /* ── 7. Projects: pinned horizontal gallery ── */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const trk = $('.hz-track'), pin = $('.hz-pin'); if (!trk) return;
    const dist = () => trk.scrollWidth - innerWidth + 0;
    const tween = gsap.to(trk, { x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .8,
        invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => gsap.set('.hz-bar i', { scaleX: s.progress }) } });
    $$('.hz-panel').forEach((p, i) => {
      gsap.fromTo($('.hz-art svg', p), { xPercent: 22, rotate: -10, scale: .85 }, { xPercent: -12, rotate: 8, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 95%', end: 'right 5%', scrub: true } });
      gsap.fromTo($('.hz-num', p), { xPercent: 70 }, { xPercent: -50, ease: 'none',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      if (i > 0) gsap.from($('.hz-body > *', p), { y: 36, opacity: 0, duration: .8, stagger: .07, ease: 'power3.out',
        scrollTrigger: { trigger: p, containerAnimation: tween, start: 'left 78%', toggleActions: 'play none none reverse' } });
    });
  });
  mm.add('(max-width: 900px)', () => {
    $$('.hz-panel').forEach(p => gsap.from(p, { y: 60, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: p, start: 'top 88%' } }));
  });

  /* ── Services / skills / education reveals ── */
  gsap.fromTo('.sv', { y: 90, opacity: 0, rotateX: -18, scale: .94, transformPerspective: 900 },
    { y: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.1, ease: 'power4.out', stagger: .09,
      scrollTrigger: { trigger: '.srv-grid', start: 'top 82%' }, clearProps: 'transform' });
  gsap.fromTo('.sk-g', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .07, ease: 'power3.out',
    scrollTrigger: { trigger: '.sk-groups', start: 'top 85%' } });
  gsap.fromTo('.edu-chips span', { y: 20, opacity: 0, scale: .9 }, { y: 0, opacity: 1, scale: 1, duration: .7, stagger: .06, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.edu-chips', start: 'top 88%' } });
  gsap.fromTo('.faq-item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: 'power3.out',
    scrollTrigger: { trigger: '.faq-list', start: 'top 86%' } });
  gsap.fromTo('.c-links .cl', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: .8, stagger: .12, ease: 'power3.out',
    scrollTrigger: { trigger: '.c-links', start: 'top 88%' } });
  gsap.fromTo('.cf-g', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '#contactForm', start: 'top 85%' } });
  gsap.fromTo('.ft-top > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .12, ease: 'power3.out',
    scrollTrigger: { trigger: '#footer', start: 'top 92%' } });

  /* ── Spotlight + tilt + magnetic ── */
  if (!touch) {
    $$('.sv, .sk-g, .xp-card').forEach(el => {
      const rotX = gsap.quickTo(el, 'rotateX', { duration: .5, ease: 'power3' });
      const rotY = gsap.quickTo(el, 'rotateY', { duration: .5, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
        rotY((x / r.width - .5) * 7); rotX(-(y / r.height - .5) * 7);
      });
      el.addEventListener('mouseleave', () => { rotX(0); rotY(0); });
    });
    $$('.btn-primary, .btn-glass, .nav-hire').forEach(b => {
      const mx = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3' });
      const my = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * .3); my((e.clientY - (r.top + r.height / 2)) * .4);
      });
      b.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
  }

  /* ── 8. Interactive 3D skill sphere (real tech icons + labels) ── */
  initSphere();
  function initSphere() {
    const cv = $('#skSphere'); if (!cv) return;
    const ctx = cv.getContext('2d');
    const dv = (n, v) => `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${n}/${n}-${v || 'original'}.svg`;
    // [label, icon slug?, variant?]
    const items = [['React Native', 'react'], ['React.js', 'react'], ['Node.js', 'nodejs'], ['JavaScript', 'javascript'], ['PHP', 'php'],
      ['CodeIgniter', 'codeigniter', 'plain'], ['MySQL', 'mysql'], ['Firebase', 'firebase'], ['SQLite', 'sqlite'], ['PostgreSQL', 'postgresql'],
      ['Docker', 'docker'], ['Git', 'git'], ['Android', 'android'], ['Electron', 'electron'], ['TensorFlow', 'tensorflow'], ['HTML5', 'html5'],
      ['CSS3', 'css3'], ['Bootstrap', 'bootstrap'], ['WordPress', 'wordpress', 'plain'],
      ['REST APIs'], ['Stripe'], ['PayPal'], ['Authorize.Net'], ['Twilio'], ['OpenAI'], ['OpenCV'], ['WebRTC'], ['AWS'], ['CI/CD'], ['OWASP'], ['SSL/TLS'],
      ['Shopify'], ['Wix'], ['Squarespace'], ['Agile'], ['Scrum'], ['Jira'], ['Trello'], ['Notion'], ['Google Maps'], ['Zkteco'], ['AI Agents'], ['Chatbots']];
    const n = items.length;
    const pts = items.map((it, i) => {
      const k = i + .5, phi = Math.acos(1 - 2 * k / n), th = Math.PI * (1 + Math.sqrt(5)) * k;
      let img = null;
      if (it[1]) { img = new Image(); img.decoding = 'async'; img.src = dv(it[1], it[2]); }
      return { w: it[0], img, x: Math.cos(th) * Math.sin(phi), y: Math.sin(th) * Math.sin(phi), z: Math.cos(phi), hue: i % 3 };
    });
    let W = 0, H = 0, dpr = 1;
    const fit = () => { dpr = Math.min(devicePixelRatio, 2); const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; };
    fit(); addEventListener('resize', fit);
    let vx = .004, vy = .006, drag = false, lx = 0, ly = 0, hover = false, visible = false, hx = 0, hy = 0;
    cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointerup', () => drag = false);
    cv.addEventListener('pointermove', e => {
      if (drag) { vy = (e.clientX - lx) * .0016; vx = -(e.clientY - ly) * .0016; lx = e.clientX; ly = e.clientY; }
      const r = cv.getBoundingClientRect(); hx = (e.clientX - r.left) / r.width - .5; hy = (e.clientY - r.top) / r.height - .5; hover = true;
    });
    cv.addEventListener('pointerleave', () => { hover = false; drag = false; });
    new IntersectionObserver(es => visible = es[0].isIntersecting).observe(cv);
    const colors = ['0,200,255', '167,139,250', '232,234,246'];
    gsap.ticker.add(() => {
      if (!visible) return;
      if (!drag) {
        const tx = hover ? hy * .03 : .003, ty = hover ? hx * .03 : .006;
        vx += (tx - vx) * .04; vy += (ty - vy) * .04;
      }
      const cx = Math.cos(vx), sx = Math.sin(vx), cy = Math.cos(vy), sy = Math.sin(vy);
      pts.forEach(p => {
        const y = p.y * cx - p.z * sx; let z = p.y * sx + p.z * cx;
        const x = p.x * cy + z * sy; z = -p.x * sy + z * cy;
        p.x = x; p.y = y; p.z = z;
      });
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const R = Math.min(W, H) * .4;
      [...pts].sort((a, b) => a.z - b.z).forEach(p => {
        const depth = (p.z + 1) / 2, s = .6 + depth * .65, X = W / 2 + p.x * R, Y = H / 2 + p.y * R;
        if (p.img && p.img.complete && p.img.naturalWidth) {
          const sz = 38 * s;
          ctx.globalAlpha = .25 + depth * .75;
          ctx.drawImage(p.img, X - sz / 2, Y - sz / 2, sz, sz);
          ctx.globalAlpha = 1;
        } else {
          ctx.font = `600 ${Math.round(14 * s)}px Manrope, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(${colors[p.hue]},${.18 + depth * .82})`;
          ctx.fillText(p.w, X, Y);
        }
      });
    });
  }

  /* ── Active nav ── */
  $$('main section[id]').forEach(sec => {
    ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%',
      onToggle: s => s.isActive && $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id)) });
  });
  const projSec = $('#projects');
  if (projSec) ScrollTrigger.create({ trigger: projSec, start: 'top 45%', end: 'bottom 45%',
    onToggle: s => s.isActive && $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#projects')) });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
