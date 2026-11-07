/* =========================================================
   SCAT — menu.js
   one drink at a time under a single light (a sticky stage driven
   by the scroll), then the cellar and the kitchen as printed cards.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SC, $ = S.$, $$ = S.$$;
  const M = S.motion;
  const DR = S.DRINKS, L = DR.length;
  const src = (d) => `img/HOME/${d.syl.join('')}.png`;

  // the orange date stamp + exif
  const t0 = S.ny();
  $$('[data-stamp]').forEach((s) => (s.textContent = `'${String(t0.y).slice(2)} ${S.pad(t0.mo)} ${S.pad(t0.d)}`));
  $$('[data-exif]').forEach((e) => (e.innerHTML = `<b>№ ${e.dataset.exif}</b> / 36 · 35mm · f/2.0 · 1/30`));

  /* =========================================================
     01 the title card
     ========================================================= */
  const hero = () => {
    if (!M) return;
    gsap.timeline()
      .from('.mn-hero__the', { opacity: 0, letterSpacing: '.5em', duration: 1.6, ease: 'power3.out' }, .1)
      .fromTo('.mn-hero__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.6, ease: 'power2.inOut' }, .35)
      .from('.mn-hero__caps', { opacity: 0, yPercent: 40, duration: 1.3, ease: 'power3.out' }, .7)
      .from('.mn-hero__sub, .mn-hero__jump a, .mn-hero .corner, .mn-hero__hint, .hdr', { opacity: 0, y: 12, filter: 'blur(6px)', stagger: .06, duration: 1.1, ease: 'power3.out' }, 1);
    gsap.to('.mn-hero__lock', { yPercent: -20, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.mn-hero', start: 'top top', end: 'bottom top', scrub: true } });
  };

  /* =========================================================
     02 the stage: the scroll picks the drink
     ========================================================= */
  const stage = () => {
    const sec = $('[data-stage]');
    sec.style.setProperty('--n', L);
    const glasses = $('[data-s-glasses]'), idx = $('[data-s-idx]'), glow = $('[data-glow]');
    const el = { name: $('[data-s-name]'), n: $('[data-s-n]'), syl: $('[data-s-syl]'), desc: $('[data-s-desc]'), what: $('[data-s-what]'), taste: $('[data-s-taste]'), price: $('[data-s-price]'), bar: $('[data-s-bar]') };
    glasses.innerHTML = DR.map((d, i) => `<figure class="stage__g" data-g="${i}"><img src="${src(d)}" alt="${d.name}: ${d.desc}" decoding="async" ${i > 1 ? 'loading="lazy"' : ''} /></figure>`).join('');
    idx.innerHTML = DR.map((d, i) => `<li><button type="button" data-i="${i}"><b>${S.pad(i + 1)}</b>${d.name}${d.zero ? ' <em>0%</em>' : ''}</button></li>`).join('');
    const gs = $$('.stage__g', glasses), btns = $$('button', idx);
    const card = $$('.stage__card > *');
    let cur = -1;

    const tasteHTML = (d) => [['sweet', d.sweet], ['sour', d.sour], ['bitter', d.bitter]]
      .map(([k, v]) => `<p><span>${k}</span><i><b style="transform:scaleX(${v / 10})"></b></i></p>`).join('');

    const set = (d, i) => {
      el.name.textContent = d.name;
      el.n.textContent = S.pad(i + 1);
      el.syl.textContent = d.syl.join(' · ');
      el.desc.textContent = d.desc;
      el.what.textContent = d.what;
      el.taste.innerHTML = tasteHTML(d);
      el.price.textContent = `$${d.price}` + (d.zero ? ' · 0%' : '');
    };
    const show = (i, dir = 1) => {
      if (i === cur) return;
      const prev = cur; cur = i;
      const d = DR[i];
      btns.forEach((b, j) => b.classList.toggle('is-on', j === i));
      el.bar.style.transform = `scaleY(${(i + 1) / L})`;
      glow.style.setProperty('--liq', d.liq);
      if (!M) { gs.forEach((g, j) => g.classList.toggle('is-on', j === i)); set(d, i); return; }
      // the old glass lifts away out of focus, the new one rises into the light
      if (prev > -1) gsap.to(gs[prev], { opacity: 0, yPercent: -10 * dir, scale: .94, filter: 'blur(10px)', duration: .7, ease: 'power2.in', overwrite: true });
      gsap.fromTo(gs[i], { opacity: 0, yPercent: 12 * dir, scale: 1.04, filter: 'blur(12px)' }, { opacity: 1, yPercent: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, delay: prev > -1 ? .25 : 0, ease: 'power3.out', overwrite: true });
      gsap.timeline()
        .to([el.name, ...card], { opacity: 0, y: -8 * dir, filter: 'blur(4px)', duration: .3, stagger: .02, ease: 'power2.in' })
        .add(() => set(d, i))
        .fromTo(el.name, { opacity: 0, y: 0, filter: 'blur(0px)', clipPath: 'inset(-30% 100% -30% -10%)' }, { opacity: 1, clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.1, ease: 'power2.inOut' })
        .fromTo(card, { opacity: 0, y: 12 * dir, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .05, duration: .7, ease: 'power3.out' }, '<.1')
        .fromTo($$('b', el.taste), { scaleX: 0 }, { scaleX: (j) => [d.sweet, d.sour, d.bitter][j] / 10, duration: .9, stagger: .08, ease: 'power3.out' }, '<.2');
    };

    // the scroll through the section picks the drink
    const pickFromScroll = () => {
      const r = sec.getBoundingClientRect(), range = sec.offsetHeight - innerHeight;
      const p = S.clamp(-r.top / range, 0, .9999);
      const i = Math.floor(p * L);
      if (i !== cur) show(i, i > cur ? 1 : -1);
    };
    addEventListener('scroll', pickFromScroll, { passive: true });
    addEventListener('resize', pickFromScroll);
    const goTo = (i) => {
      const range = sec.offsetHeight - innerHeight;
      const y = sec.offsetTop + range * ((i + .5) / L);
      S.lenis ? S.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: S.reduced ? 'auto' : 'smooth' });
    };
    idx.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) goTo(+b.dataset.i); });
    $('[data-s-sing]').addEventListener('click', () => {
      if (S.muted) S.setMuted(false);
      S.phrase(DR[cur].syl, .3);
      S.toast(DR[cur].syl.map((s) => s[0].toUpperCase() + s.slice(1)).join('-') + ' ♪');
    });
    // keyboard: arrows move through the drinks while the stage is on screen
    addEventListener('keydown', (e) => {
      if (!/^Arrow(Up|Down|Left|Right)$/.test(e.key)) return;
      const r = sec.getBoundingClientRect();
      if (r.top > 1 || r.bottom < innerHeight - 1 || e.target.closest('input, textarea')) return;
      const k = /Down|Right/.test(e.key) ? 1 : -1, n = cur + k;
      if (n < 0 || n >= L) return;
      e.preventDefault(); goTo(n);
    });
    show(0); pickFromScroll();
  };

  /* =========================================================
     04 the cellar
     ========================================================= */
  const CELLAR = [
    { h: 'Champagne', items: [
      ['Brut, non-vintage', 'Reims · biscuit, green apple, very fine bubbles', '22', '118'],
      ['Rosé brut', 'Épernay · wild strawberry, a little chalk', '26', '140'],
      ['Crémant de Bourgogne', 'Burgundy · the house fizz, for hi-de-ho', '16', '72'],
    ] },
    { h: 'White', items: [
      ['Sancerre', 'Loire · flint, grapefruit, cold', '18', '82'],
      ['Grüner Veltliner', 'Kamptal · white pepper, green pear', '15', '66'],
      ['Fino sherry', 'Jerez · almond, sea air, served very cold', '12', '—'],
    ] },
    { h: 'Red', items: [
      ['Pinot Noir', 'Willamette Valley · cherry, forest floor', '18', '84'],
      ['Barbera d’Alba', 'Piedmont · plum, bright acid, easy late', '15', '68'],
      ['Syrah', 'Northern Rhône · black olive, smoke, the hard-bop red', '19', '90'],
    ] },
  ];
  const cellar = () => {
    $('[data-cellar]').innerHTML = CELLAR.map((c) => `<div class="cel">
        <p class="cel__h scr">${c.h}</p>
        <p class="cel__k sp"><span>glass</span><span>bottle</span></p>
        <ol>${c.items.map(([n, d, g, b]) => `<li class="cel__i"><p class="cel__n tc">${n}</p><p class="cel__p tc">${g}</p><p class="cel__p tc">${b}</p><p class="cel__d sp">${d}</p></li>`).join('')}</ol>
      </div>`).join('');
    if (!M) return;
    gsap.from('#cellar .card-sec__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#cellar', start: 'top 70%' } });
    gsap.fromTo('.cel', { opacity: 0, y: 30, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .12, duration: 1.1, ease: 'power3.out', clearProps: 'filter', scrollTrigger: { trigger: '[data-cellar]', start: 'top 80%' } });
  };

  /* =========================================================
     05 the kitchen
     ========================================================= */
  const PLATES = [
    ['Sweet potato fries', 'in a paper cone, smoked paprika mayo', '9'],
    ['Deviled eggs', 'smoked paprika, chive, a little hot sauce', '11'],
    ['Hot-honey chicken', 'buttermilk-fried bites, pickles', '16'],
    ['Skillet cornbread', 'whipped honey butter, flaky salt', '9'],
    ['Shrimp & grits', 'a small bowl, andouille, scallion', '18'],
    ['Oysters', 'half dozen, mignonette, lemon', '21'],
    ['Pimento cheese', 'saltines, bread & butter pickles', '10'],
    ['Chocolate pot', 'bourbon cream, for two spoons', '12'],
  ];
  const kitchen = () => {
    $('[data-plates]').innerHTML = PLATES.map(([n, d, p]) => `<li class="plate"><p class="plate__n scr">${n}</p><p class="plate__p tc">${p}</p><p class="plate__d sp">${d}</p></li>`).join('');
    S.slots($('.kitchen'));
    if (!M) return;
    const ph = $('.kitchen__photo');
    ScrollTrigger.create({ trigger: ph, start: 'top 70%', once: true, onEnter: () => gsap.fromTo(ph, { opacity: 0, filter: 'blur(14px) saturate(.6)' }, { opacity: 1, filter: 'blur(0px) saturate(1)', duration: 2.4, ease: 'power2.out', clearProps: 'filter' }) });
    gsap.from('.kitchen .card-sec__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.kitchen', start: 'top 65%' } });
    gsap.fromTo('.plate', { opacity: 0, x: 20, filter: 'blur(5px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', stagger: .06, duration: 1, ease: 'power3.out', clearProps: 'filter', scrollTrigger: { trigger: '[data-plates]', start: 'top 82%' } });
  };

  const how = () => {
    if (!M) return;
    gsap.timeline({ scrollTrigger: { trigger: '.how', start: 'top 65%' } })
      .from('.how__the', { opacity: 0, letterSpacing: '.4em', duration: 1.3, ease: 'power3.out' })
      .fromTo('.how__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.3, ease: 'power2.inOut' }, .2)
      .from('.how__steps li', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .14, duration: 1, ease: 'power3.out' }, .6)
      .from('.how .btn, .how__note', { opacity: 0, y: 12, stagger: .1, duration: .9 }, 1.1);
  };

  const footer = () => {
    if (!M) return;
    gsap.from('.ft__lock > *', { opacity: 0, y: 40, filter: 'blur(8px)', stagger: .12, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.ft', start: 'top 80%' } });
  };

  hero(); stage(); how(); cellar(); kitchen(); footer();
})();
