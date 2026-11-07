/* =========================================================
   SCAT — room.js
   the room: a b/w poster, the way down, and a floor plan you can
   sit in (your pick is remembered as sc-seat and goes to reservations).
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SC, $ = S.$, $$ = S.$$;
  const M = S.motion;
  const NS = 'http://www.w3.org/2000/svg';

  const t0 = S.ny();
  $$('[data-stamp]').forEach((s) => (s.textContent = `'${String(t0.y).slice(2)} ${S.pad(t0.mo)} ${S.pad(t0.d)}`));
  $$('[data-exif]').forEach((e) => (e.innerHTML = `<b>№ ${e.dataset.exif}</b> / 36 · 35mm · f/4 · 1/125`));

  const develop = (el) => M && el && gsap.fromTo(el, { opacity: 0, filter: 'blur(14px) saturate(.6)' }, { opacity: 1, filter: 'blur(0px) saturate(1)', duration: 2.4, ease: 'power2.out', clearProps: 'filter' });

  /* =========================================================
     01 the room
     ========================================================= */
  const hero = () => {
    if (!M) return;
    const ph = $('.rm-hero .photo');
    develop(ph);
    gsap.timeline()
      .from(ph, { scale: 1.1, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.rm-hero__the', { opacity: 0, letterSpacing: '.5em', duration: 1.6, ease: 'power3.out' }, .2)
      .fromTo('.rm-hero__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.5, ease: 'power2.inOut' }, .5)
      .from('.rm-hero__caps span', { opacity: 0, x: (i) => (i ? 40 : -40), duration: 1.3, ease: 'power3.out' }, .8)
      .from('.rm-hero__sub, .rm-hero .corner, .rm-hero .cam, .hdr', { opacity: 0, y: 12, filter: 'blur(6px)', stagger: .07, duration: 1.1, ease: 'power3.out' }, 1.1);
    gsap.timeline({ scrollTrigger: { trigger: '.rm-hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to(ph, { yPercent: 12, ease: 'none' }, 0)
      .to('.rm-hero__lock, .rm-hero__caps', { yPercent: -24, opacity: .2, ease: 'none' }, 0);
  };

  /* =========================================================
     02 the way down: each step surfaces as you descend
     ========================================================= */
  const down = () => {
    if (!M) return;
    gsap.from('.down__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.down', start: 'top 70%' } });
    $$('.step').forEach((st, i) => {
      ScrollTrigger.create({ trigger: st, start: 'top 75%', once: true, onEnter: () => develop($('.step__ph', st)) });
      gsap.fromTo($$('.step__n, .step__k, .step__d', st), { opacity: 0, y: 20, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .08, duration: 1, ease: 'power3.out', clearProps: 'filter', scrollTrigger: { trigger: st, start: 'top 70%' } });
    });
  };

  /* =========================================================
     03 the floor plan
     ========================================================= */
  // every table in the room (x, y in the 1000×600 plan)
  const T = [];
  const NOTES2 = ['under the trumpet · for the brave', 'dead centre · you see everything', 'a corner for whispering', 'by the bar · fastest drinks in the house', 'the regulars’ table · say hi to Lou', 'facing the piano', 'half in the spotlight', 'for first dates', 'the one with the wobble · we put a coaster', 'closest to the curtain · easy exit'];
  ['B1', 'B2', 'B3', 'B4'].forEach((id, i) => T.push({ id, kind: 'booth', seats: 4, x: 230 + i * 110, y: 74, note: ['the booth by the stairs · coats on the hook', 'red velvet · the band’s favourite', 'the long view of the stage', 'next to the bar · the bartender sees you first'][i] }));
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) {
    const n = r * 5 + c + 1;
    T.push({ id: String(n), kind: 'two', seats: 2, x: 420 + c * 80, y: 230 + r * 80, note: NOTES2[n - 1] });
  }
  [0, 1, 2, 3].forEach((c) => T.push({ id: String(11 + c), kind: 'four', seats: 4, x: 430 + c * 100, y: 470, note: ['for four, at the foot of the stage', 'for four · birthdays welcome, we sing', 'for four, between the stage and the bar', 'for four · the bartender’s view'][c] }));
  for (let i = 0; i < 10; i++) T.push({ id: 'Bar ' + (i + 1), kind: 'bar', seats: 1, x: 862, y: 140 + i * 40, note: i < 3 ? 'at the bar · where the call is sung' : i > 7 ? 'end of the bar · quiet, close to the cloakroom' : 'at the bar · answer the call face to face' });
  T.push({ id: 'Piano', kind: 'piano', seats: 2, x: 84, y: 485, note: 'two seats on the piano bench · ask nicely, and not on trio nights' });
  const KIND = { booth: 'Booth', two: 'Table', four: 'Table', bar: 'Stool', piano: 'The bench' };

  const plan = () => {
    const svg = $('[data-map]');
    const el = (tag, attrs, parent = svg) => { const e = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); parent.appendChild(e); return e; };
    // the room itself: walls, stairs, stage, bar counter, the curtain
    const room = el('g', { class: 'pl-room' });
    el('rect', { x: 20, y: 20, width: 960, height: 560, rx: 18, class: 'pl-wall' }, room);
    for (let i = 0; i < 9; i++) el('line', { x1: 34, x2: 150, y1: 40 + i * 13, y2: 40 + i * 13, class: 'pl-line' }, room);
    el('text', { x: 92, y: 172, class: 'pl-lab', 'text-anchor': 'middle' }, room).textContent = 'IN · 17 STEPS';
    el('path', { d: 'M160 30 Q172 70 160 110 Q172 150 160 190', class: 'pl-curtain' }, room);
    el('path', { d: 'M30 380 H330 Q350 380 350 400 V570 H30 Z', class: 'pl-stage' }, room);
    el('text', { x: 190, y: 404, class: 'pl-lab', 'text-anchor': 'middle' }, room).textContent = 'THE STAGE';
    // a baby grand from above
    el('path', { d: 'M110 430 H230 Q300 430 300 470 Q300 500 262 504 Q236 506 228 540 H110 Z', class: 'pl-piano' }, room);
    el('rect', { x: 118, y: 438, width: 16, height: 94, class: 'pl-keys' }, room);
    el('rect', { x: 860 - 34, y: 110, width: 40, height: 420, rx: 8, class: 'pl-bar' }, room);
    el('rect', { x: 916, y: 110, width: 50, height: 420, rx: 4, class: 'pl-back' }, room);
    el('text', { x: 941, y: 320, class: 'pl-lab', 'text-anchor': 'middle', transform: 'rotate(90 941 320)' }, room).textContent = 'THE BAR · BOTTLES';
    el('text', { x: 600, y: 580 - 16, class: 'pl-lab', 'text-anchor': 'middle' }, room).textContent = 'CLOAKROOM · LIFT ON 125TH →';

    // the tables
    const g = el('g', { class: 'pl-tables' });
    T.forEach((t, i) => {
      const a = el('g', { class: `pl-t pl-t--${t.kind}`, tabindex: 0, role: 'button', 'data-t': i, 'aria-label': `${KIND[t.kind]} ${t.id}, ${t.seats} ${t.seats > 1 ? 'seats' : 'seat'}: ${t.note}` }, g);
      if (t.kind === 'booth') {
        el('path', { d: `M${t.x - 46} ${t.y - 40} V${t.y + 30} M${t.x + 46} ${t.y - 40} V${t.y + 30} M${t.x - 46} ${t.y - 40} H${t.x + 46}`, class: 'pl-seat pl-bench' }, a);
        el('rect', { x: t.x - 30, y: t.y - 22, width: 60, height: 40, rx: 4, class: 'pl-top' }, a);
        el('text', { x: t.x, y: t.y + 4, class: 'pl-id', 'text-anchor': 'middle' }, a).textContent = t.id;
      } else if (t.kind === 'two') {
        el('circle', { cx: t.x - 26, cy: t.y, r: 8, class: 'pl-seat' }, a); el('circle', { cx: t.x + 26, cy: t.y, r: 8, class: 'pl-seat' }, a);
        el('circle', { cx: t.x, cy: t.y, r: 17, class: 'pl-top' }, a);
        el('text', { x: t.x, y: t.y + 4, class: 'pl-id', 'text-anchor': 'middle' }, a).textContent = t.id;
      } else if (t.kind === 'four') {
        [[-30, 0], [30, 0], [0, -30], [0, 30]].forEach(([dx, dy]) => el('circle', { cx: t.x + dx, cy: t.y + dy, r: 8, class: 'pl-seat' }, a));
        el('rect', { x: t.x - 20, y: t.y - 20, width: 40, height: 40, rx: 3, class: 'pl-top' }, a);
        el('text', { x: t.x, y: t.y + 4, class: 'pl-id', 'text-anchor': 'middle' }, a).textContent = t.id;
      } else if (t.kind === 'bar') {
        el('circle', { cx: t.x - 50, cy: t.y, r: 11, class: 'pl-top pl-stool' }, a);
      } else {
        el('rect', { x: t.x - 9, y: t.y - 36, width: 18, height: 72, rx: 4, class: 'pl-top' }, a);
        el('text', { x: t.x + 2, y: t.y + 62, class: 'pl-id pl-id--small', 'text-anchor': 'middle' }, a).textContent = 'BENCH';
      }
    });

    // the side card
    const info = { k: $('[data-i-k]'), name: $('[data-i-name]'), seats: $('[data-i-seats]'), note: $('[data-i-note]'), book: $('[data-i-book]'), clear: $('[data-i-clear]') };
    const DEF = { name: info.name.textContent, seats: info.seats.textContent, note: info.note.textContent };
    let picked = null;
    try { picked = JSON.parse(S.store.get('seat')); } catch (e) {}
    const paint = (t, mode) => {
      if (!t) {
        info.k.textContent = 'your table'; info.name.textContent = DEF.name; info.seats.textContent = DEF.seats; info.note.textContent = DEF.note;
        info.book.textContent = 'hold a table'; info.clear.hidden = true; return;
      }
      info.k.textContent = mode === 'picked' ? 'you picked' : 'you’re pointing at';
      info.name.textContent = `${KIND[t.kind]} ${t.kind === 'piano' ? '' : t.id}`.trim();
      info.seats.textContent = `${t.seats} ${t.seats > 1 ? 'SEATS' : 'SEAT'}`;
      info.note.textContent = t.note;
      info.book.textContent = mode === 'picked' ? `hold ${t.kind === 'bar' ? 'this stool' : 'this table'}` : 'hold a table';
      info.clear.hidden = mode !== 'picked';
      if (M) gsap.fromTo([info.name, info.seats, info.note], { opacity: .3, y: 6 }, { opacity: 1, y: 0, duration: .45, stagger: .04, ease: 'power2.out' });
    };
    const mark = () => $$('.pl-t', svg).forEach((a) => a.classList.toggle('is-picked', !!picked && T[+a.dataset.t].id === picked.id));
    const choose = (i) => {
      const t = T[i];
      picked = { id: t.id, kind: t.kind, seats: t.seats };
      S.store.set('seat', JSON.stringify(picked));
      mark(); paint(t, 'picked');
      S.sing(t.kind === 'bar' ? 'bop' : t.kind === 'piano' ? 'hi' : 'doo');
      S.toast(`${KIND[t.kind]} ${t.kind === 'piano' ? '' : t.id} · noted`);
    };
    let hoverT = null;
    svg.addEventListener('mouseover', (e) => { const a = e.target.closest('.pl-t'); if (!a || a === hoverT) return; hoverT = a; paint(T[+a.dataset.t], 'hover'); });
    svg.addEventListener('mouseleave', () => { hoverT = null; paint(picked ? T.find((t) => t.id === picked.id) : null, 'picked'); });
    svg.addEventListener('click', (e) => { const a = e.target.closest('.pl-t'); if (a) choose(+a.dataset.t); });
    svg.addEventListener('keydown', (e) => { const a = e.target.closest('.pl-t'); if (a && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(+a.dataset.t); } });
    svg.addEventListener('focusin', (e) => { const a = e.target.closest('.pl-t'); if (a) paint(T[+a.dataset.t], 'hover'); });
    info.clear.addEventListener('click', () => { picked = null; S.store.del('seat'); mark(); paint(null); });
    mark();
    if (picked) { const t = T.find((x) => x.id === picked.id); if (t) paint(t, 'picked'); }

    if (!M) return;
    gsap.from('.plan__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.plan', start: 'top 70%' } });
    const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 75%' } });
    tl.fromTo('.pl-wall', { strokeDasharray: 3200, strokeDashoffset: 3200 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
      .from('.pl-room > :not(.pl-wall)', { opacity: 0, duration: .8, stagger: .04 }, .6)
      .from('.pl-t', { opacity: 0, scale: .6, transformOrigin: 'center', transformBox: 'fill-box', stagger: .02, duration: .5, ease: 'back.out(2)' }, 1)
      .from('.plan__info > *', { opacity: 0, x: 20, stagger: .06, duration: .8, ease: 'power3.out' }, .8);
  };

  /* =========================================================
     04 the small print
     ========================================================= */
  const det = () => {
    if (!M) return;
    gsap.fromTo('.det__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.det', start: 'top 70%' } });
    gsap.fromTo('.det__list li', { opacity: 0, y: 24, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .08, duration: 1, ease: 'power3.out', clearProps: 'filter,transform', scrollTrigger: { trigger: '.det__list', start: 'top 82%' } });
  };
  const footer = () => {
    if (!M) return;
    gsap.from('.ft__lock > *', { opacity: 0, y: 40, filter: 'blur(8px)', stagger: .12, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.ft', start: 'top 80%' } });
  };

  hero(); down(); plan(); det(); footer();
})();
