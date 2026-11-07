/* =========================================================
   SCAT — main.js (shared engine, every page)
   a jazz bar in harlem. we call, you answer.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = (window.SC = {});
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  S.$ = $; S.$$ = $$;
  S.page = document.body.dataset.page || 'home';
  S.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  S.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  S.hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  S.motion = S.hasGsap && !S.reduced;
  S.rand = (a, b) => a + Math.random() * (b - a);
  S.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  S.pad = (n, l = 2) => String(Math.max(0, Math.floor(n))).padStart(l, '0');
  S.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  S.hash = (str) => { let h = 7; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

  // storage that never throws
  S.store = {
    get(k) { try { return localStorage.getItem('sc-' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('sc-' + k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem('sc-' + k); } catch (e) {} },
  };

  if (S.hasGsap) gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  addEventListener('load', () => { if (location.hash.length > 1) return; window.scrollTo(0, 0); S.lenis && S.lenis.scrollTo(0, { immediate: true }); });

  /* =========================================================
     THE HOUSE — data every page shares
     ========================================================= */

  // every syllable is a note on the blues scale (semitones above A3)
  S.SYL = {
    shoo: 0, be: 3, doo: 5, ba: 7, dee: 10, ya: 12, skee: 15, dat: 6,
    wah: 2, bop: -5, zoot: -2, hi: 17, de: 8, ho: -7, sha: 14, na: 9,
  };

  S.DRINKS = [
    { name: 'Shoo-Be-Doo', syl: ['shoo', 'be', 'doo'], glass: 'coupe', price: 18, liq: '#7a1018',
      desc: 'rye, sweet vermouth, black cherry, two dashes of bitters', what: 'a manhattan that stayed for the late set.', sweet: 6, sour: 1, bitter: 6 },
    { name: 'Ba-Dee-Ya', syl: ['ba', 'dee', 'ya'], glass: 'highball', price: 17, liq: '#f08a7a',
      desc: 'gin, pink grapefruit, rosemary honey, soda', what: 'tall, bright, a little too loud. like the trumpet.', sweet: 4, sour: 7, bitter: 3 },
    { name: 'Skee-Dat', syl: ['skee', 'dat'], glass: 'rocks', price: 18, liq: '#e8a54b',
      desc: 'mezcal, lime, chili, roasted pineapple, salt', what: 'smoke and a kick on the two and four.', sweet: 4, sour: 6, bitter: 2 },
    { name: 'Doo-Wah', syl: ['doo', 'wah'], glass: 'nicknora', price: 19, liq: '#c9a27a',
      desc: 'cognac, cold brew, cream, grated nutmeg', what: 'a nightcap that does not believe in bedtime.', sweet: 7, sour: 0, bitter: 4 },
    { name: 'Bop', syl: ['bop'], glass: 'martini', price: 17, liq: '#e9e4c8',
      desc: 'very cold gin, a whisper of vermouth, olive brine, three olives', what: 'one syllable. no small talk.', sweet: 0, sour: 1, bitter: 3 },
    { name: 'Zoot', syl: ['zoot'], glass: 'coupe', price: 18, liq: '#f0913a',
      desc: 'bourbon, white peach, lemon, a sugared rim', what: 'peach in a sharp suit.', sweet: 6, sour: 2, bitter: 1 },
    { name: 'Hi-De-Ho', syl: ['hi', 'de', 'ho'], glass: 'flute', price: 19, liq: '#f3d27a',
      desc: 'champagne, elderflower, lemon, a little gin', what: 'the call everybody knows. the room sings it back.', sweet: 5, sour: 5, bitter: 1 },
    { name: 'Sha-Na', syl: ['sha', 'na'], glass: 'highball', price: 12, liq: '#c2366f', zero: true,
      desc: 'hibiscus, ginger, lime, tonic — zero proof', what: 'all the song, none of the hangover.', sweet: 5, sour: 6, bitter: 3 },
  ];

  // index = day of the week in harlem (0 = sunday)
  S.NIGHTS = [
    { day: 'SUN', short: 'Sunday', name: 'Call & Response Sunday', sub: 'the whole room sings', kind: 'SCAT CHOIR', line: 'house trio + everybody', time: '7PM—11PM', sets: '7:00 & 9:00', tint: '#5f5d2f' },
    { day: 'MON', off: true, name: 'closed', sub: 'the band sleeps', tint: '#2a1a14' },
    { day: 'TUE', short: 'Chalkboard', name: 'The Chalkboard Jam', sub: 'open jam session', kind: 'JAM SESSION', line: 'bring a horn. or a hum.', time: '9PM—1AM', sets: 'from 9:00', tint: '#5b2bd6' },
    { day: 'WED', short: 'Nella', name: 'Nella & the Late Trains', sub: 'vocal quartet', kind: 'VOCAL NIGHT', line: 'ballads, then fewer ballads', time: '9PM—1AM', sets: '9:00 & 11:30', tint: '#b3141e' },
    { day: 'THU', short: 'Odessa', name: 'Odessa Kline Trio', sub: 'trio', kind: 'PIANO NIGHT', line: 'piano, upright bass & brushes', time: '9PM—1AM', sets: '9:00 & 11:30', tint: '#c2620f' },
    { day: 'FRI', short: 'Sweet Kick', name: 'The Sweet Kick', sub: 'little big band', kind: 'SWING NIGHT', line: 'eleven players, one tiny stage', time: '9PM—2AM', sets: '9:00 & 11:30', tint: '#c2366f' },
    { day: 'SAT', short: 'Moses', name: 'Moses Grey Quartet', sub: 'quartet', kind: 'HARD BOP', line: 'tenor sax & trouble', time: '9PM—2AM', sets: '9:00 & 11:30', tint: '#1f4fd1' },
  ];

  // how each night is lettered on its poster (index = weekday)
  S.POSTER = [
    { scr: 'Sunday', caps: 'CALL & RESPONSE', kind: 'LIVE JAZZ & THE WHOLE ROOM SINGS' },
    { scr: 'Closed', caps: 'THE BAND SLEEPS', kind: 'SEE YOU TUESDAY' },
    { scr: 'Chalkboard', caps: 'OPEN JAM SESSION', kind: 'LIVE JAZZ & BRING A HORN' },
    { scr: 'Nella', caps: '& THE LATE TRAINS', kind: 'LIVE JAZZ & VOCAL NIGHT' },
    { scr: 'Odessa', caps: 'KLINE TRIO', kind: 'LIVE JAZZ & PIANO NIGHT' },
    { scr: 'Sweet Kick', caps: 'LITTLE BIG BAND', kind: 'LIVE JAZZ & SWING NIGHT' },
    { scr: 'Moses', caps: 'GREY QUARTET', kind: 'LIVE JAZZ & HARD BOP' },
  ];
  // each night's photograph (her roll in img/HOME)
  S.NIGHT_IMG = ['night-4', 'night-7', 'night-1', 'night-2', 'night-3', 'night-5', 'night-6'];

  // opening hours per weekday, in hours after midnight (25 = 1am next day)
  S.HOURS = [[17, 24], null, [18, 25], [18, 25], [18, 25], [18, 26], [18, 26]];

  /* ---------- harlem time ---------- */
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' });
  const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  S.ny = () => {
    const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { day: WD[p.weekday], h: +p.hour % 24, m: +p.minute, y: +p.year, mo: +p.month, d: +p.day };
  };
  // the bar's night: after midnight still belongs to yesterday
  S.barNight = () => {
    const t = S.ny();
    const late = t.h < 3;
    const day = late ? (t.day + 6) % 7 : t.day;
    const hr = (late ? t.h + 24 : t.h) + t.m / 60;
    const o = S.HOURS[day];
    return { ...t, night: day, open: !!o && hr >= o[0] && hr < o[1], hr };
  };
  // the date (in harlem) of the next given weekday, tonight included (after midnight, tonight is still yesterday)
  S.nextDate = (wd) => {
    const t = S.ny(), late = t.h < 3;
    const base = new Date(Date.UTC(t.y, t.mo - 1, t.d - (late ? 1 : 0)));
    const add = (wd - (late ? (t.day + 6) % 7 : t.day) + 7) % 7;
    base.setUTCDate(base.getUTCDate() + add);
    return base;
  };

  /* ---------- glassware, drawn like the menu card ---------- */
  const GL = {
    coupe: { body: 'M14 40 C14 80 106 80 106 40', rim: [60, 40, 46, 6], liq: 'M19 46 C21 74 99 74 101 46 Z', stem: 'M60 77 V150', foot: [60, 155, 24, 5], extra: '<circle class="ln" cx="88" cy="38" r="6"/><path class="ln" d="M88 32 Q92 18 100 12"/>' },
    martini: { body: 'M8 34 L60 90 L112 34', rim: [60, 34, 52, 6], liq: 'M18 42 L60 86 L102 42 Z', stem: 'M60 90 V151', foot: [60, 156, 26, 5], extra: '<path class="ln" d="M36 14 L80 74"/><circle class="ln" cx="48" cy="31" r="6"/><circle class="ln" cx="57" cy="43" r="6"/><circle class="ln" cx="66" cy="55" r="6"/>' },
    rocks: { body: 'M18 72 L24 158 Q25 163 30 163 H90 Q95 163 96 158 L102 72', rim: [60, 72, 42, 6], liq: 'M21 100 L26 157 H94 L99 100 Z', extra: '<rect class="ln" x="34" y="92" width="24" height="24" rx="3" transform="rotate(-12 46 104)"/><rect class="ln" x="60" y="100" width="22" height="22" rx="3" transform="rotate(14 71 111)"/><path class="ln" d="M28 150 H92"/><circle class="ln" cx="92" cy="68" r="12"/><path class="ln" d="M92 56 V80 M80 68 H104 M84 60 L100 76 M100 60 L84 76"/>' },
    highball: { body: 'M30 24 L34 161 H86 L90 24', rim: [60, 24, 30, 4], liq: 'M32 52 L35 157 H85 L88 52 Z', extra: '<path class="ln" d="M74 2 L56 132"/><circle class="ln" cx="88" cy="34" r="14"/><path class="ln" d="M88 20 V48 M74 34 H102 M78 24 L98 44 M98 24 L78 44"/>' },
    nicknora: { body: 'M24 32 C24 84 96 84 96 32', rim: [60, 32, 36, 5], liq: 'M28 42 C30 78 90 78 92 42 Z', stem: 'M60 81 V151', foot: [60, 156, 22, 5], extra: '<path class="ln" d="M44 40 Q60 34 76 40"/>' },
    flute: { body: 'M44 14 C40 70 46 94 60 96 C74 94 80 70 76 14', rim: [60, 14, 16, 3], liq: 'M46 32 C44 72 50 89 60 90 C70 89 76 72 74 32 Z', stem: 'M60 96 V152', foot: [60, 157, 20, 5], extra: '<circle class="ln" cx="56" cy="70" r="1.6"/><circle class="ln" cx="63" cy="58" r="1.6"/><circle class="ln" cx="58" cy="46" r="1.6"/><path class="ln" d="M74 10 Q84 2 92 8 Q86 16 76 14"/>' },
    julep: { body: 'M28 56 L32 160 H88 L92 56', rim: [60, 56, 32, 4], liq: 'M30 70 L33 156 H87 L90 70 Z', extra: '<path class="ln" d="M28 56 Q40 34 60 40 Q80 32 92 56"/><path class="ln" d="M58 40 Q50 18 62 6 Q70 22 58 40 M62 38 Q78 22 88 26 Q80 40 62 38"/><path class="ln" d="M70 30 L80 160"/>' },
  };
  const hatch = (x0, x1, y0, y1) => { let d = ''; for (let y = y0; y < y1; y += 7) d += `M${x0} ${y} Q${(x0 + x1) / 2} ${y + 3} ${x1} ${y} `; return d; };
  S.glass = (type, opt = {}) => {
    const g = GL[type] || GL.rocks;
    const id = 'cl' + Math.random().toString(36).slice(2, 7);
    const [cx, cy, rx, ry] = g.rim;
    const foot = g.foot ? `<ellipse class="ln" cx="${g.foot[0]}" cy="${g.foot[1]}" rx="${g.foot[2]}" ry="${g.foot[3]}"/>` : '';
    return `<svg viewBox="0 0 120 170" aria-hidden="true"><defs><clipPath id="${id}"><path d="${g.liq}"/></clipPath></defs>
      <path class="liq" d="${g.liq}" ${opt.liq ? `style="fill:${opt.liq};opacity:.9"` : ''}/>
      <path class="hatch" clip-path="url(#${id})" d="${hatch(0, 120, 30, 170)}"/>
      <path class="ln" d="${g.body}"/><ellipse class="ln" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>
      ${g.stem ? `<path class="ln" d="${g.stem}"/>` : ''}${foot}${g.extra || ''}</svg>`;
  };

  /* =========================================================
     the voice: every syllable is sung (web audio, no files)
     ========================================================= */
  let ac = null, master = null;
  S.audio = () => {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain(); master.gain.value = .35;
      // a small room: a short feedback delay
      const dly = ac.createDelay(); dly.delayTime.value = .19;
      const fb = ac.createGain(); fb.gain.value = .28;
      const wet = ac.createGain(); wet.gain.value = .3;
      master.connect(ac.destination); master.connect(dly); dly.connect(fb); fb.connect(dly); dly.connect(wet); wet.connect(ac.destination);
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  S.muted = S.store.get('mute') === '1';
  // vowels shape the formant, so "doo" sounds darker than "dee"
  const vowel = (s) => /ee|i$|hi/.test(s) ? 1900 : /a/.test(s) ? 1100 : /o/.test(s) ? 650 : /e/.test(s) ? 1500 : 800;
  S.sing = (syl, when = 0, len) => {
    if (S.muted) return;
    const a = S.audio(); if (!a) return;
    const t = a.currentTime + when;
    const semi = S.SYL[syl] ?? 0;
    const f = 220 * Math.pow(2, semi / 12);
    const dur = len || (/oo|ah|ee|ya/.test(syl) ? .34 : .18);
    const o = a.createOscillator(), o2 = a.createOscillator();
    o.type = 'triangle'; o2.type = 'sine';
    o.frequency.setValueAtTime(f * .94, t); o.frequency.exponentialRampToValueAtTime(f, t + .05);
    o2.frequency.setValueAtTime(f * 2, t);
    const lfo = a.createOscillator(), lg = a.createGain(); lfo.frequency.value = 5.5; lg.gain.value = f * .012;
    lfo.connect(lg); lg.connect(o.frequency);
    const bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = vowel(syl); bp.Q.value = 1.4;
    const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    const g = a.createGain(), g2 = a.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.9, t + .02); g.gain.setValueAtTime(.8, t + dur * .6); g.gain.exponentialRampToValueAtTime(.001, t + dur + .12);
    g2.gain.value = .12;
    o.connect(bp); bp.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); g.connect(master);
    [o, o2, lfo].forEach((n) => { n.start(t); n.stop(t + dur + .2); });
  };
  // a soft brushed-snare tick, for the count-in
  S.tick = (when = 0) => {
    if (S.muted) return;
    const a = S.audio(); if (!a) return;
    const t = a.currentTime + when;
    const b = a.createBuffer(1, a.sampleRate * .08, a.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const n = a.createBufferSource(); n.buffer = b;
    const hp = a.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3000;
    const g = a.createGain(); g.gain.value = .25;
    n.connect(hp); hp.connect(g); g.connect(master); n.start(t);
  };
  S.phrase = (syls, gap = .26) => syls.forEach((s, i) => S.sing(s, i * gap));

  /* ---------- the little player: lights up whenever the room sings ---------- */
  const player = $('.player');
  S.nowPlaying = (txt) => { const n = $('[data-now]'); if (n && txt) n.textContent = txt; };
  const _sing = S.sing;
  S.sing = (syl, when = 0, len) => {
    _sing(syl, when, len);
    if (!player || S.muted) return;
    player.classList.add('is-on');
    clearTimeout(S._pl);
    S._pl = setTimeout(() => player.classList.remove('is-on'), (when + .8) * 1000);
  };
  S.call = ['shoo', 'be', 'doo'];
  if (player) $('[data-play]', player).addEventListener('click', () => {
    if (S.muted) S.setMuted(false);
    S.phrase(S.call, .3);
  });

  /* =========================================================
     motion + chrome
     ========================================================= */

  /* ---------- smooth scroll ---------- */
  if (window.Lenis && !S.reduced) {
    S.lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (S.hasGsap) {
      S.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => S.lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { S.lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  S.scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (S.lenis) S.lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1 && $(id)) { e.preventDefault(); S.scrollTo(id); }
  }));

  /* ---------- image slots: drop a file in img/, it shows up ---------- */
  S.slots = (root = document) => $$('.slot[data-img]:not([data-loading])', root).forEach((slot) => {
    slot.dataset.loading = '';
    const img = new Image();
    img.alt = slot.dataset.desc || '';
    img.decoding = 'async';
    img.onload = () => { slot.prepend(img); slot.classList.add('has-img'); };
    img.src = 'img/' + slot.dataset.img;
  });
  S.slots();

  /* ---------- split letters ---------- */
  S.split = (el) => {
    if (el.dataset.splitDone) return $$('.c', el);
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach((ch) => {
      const s = document.createElement('span');
      s.className = 'c';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
    el.dataset.splitDone = '1';
    return $$('.c', el);
  };

  /* ---------- scramble: letters scat before they settle ---------- */
  const SCATS = 'shoobedoobadeeyaskeedatbop';
  S.scramble = (el, to, dur = 600) => {
    const final = to ?? el.dataset.text ?? el.textContent;
    el.dataset.text = final;
    if (S.reduced) { el.textContent = final; return; }
    const start = performance.now();
    cancelAnimationFrame(el._scr);
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const keep = Math.floor(final.length * p);
      el.textContent = final.slice(0, keep) + [...final.slice(keep)].map((c, i) => (c === ' ' ? ' ' : SCATS[(i + Math.floor(now / 60)) % SCATS.length])).join('');
      if (p < 1) el._scr = requestAnimationFrame(step);
    };
    el._scr = requestAnimationFrame(step);
  };
  $$('[data-scramble]').forEach((el) => el.addEventListener('mouseenter', () => S.scramble(el, null, 450)));

  /* ---------- toast ---------- */
  const toast = $('.toast');
  S.toast = (msg, ms = 2800) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(S._t);
    S._t = setTimeout(() => toast.classList.remove('is-on'), ms);
  };

  /* ---------- cursor: a point-and-shoot viewfinder ----------
     four corner marks trail the red focus dot; over a link they lock onto it
     like autofocus (dot blinks) */
  const cur = $('.cur');
  if (cur && S.fine) {
    document.documentElement.classList.add('has-cursor');
    const label = $('.cur__label', cur), dot = $('.cur__dot', cur), frame = $('.cur__frame', cur);
    const SIZE = 34, PAD = 9;
    let x = innerWidth / 2, y = innerHeight / 2;
    let fx = x - SIZE / 2, fy = y - SIZE / 2, fw = SIZE, fh = SIZE, target = null;
    addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    addEventListener('mousedown', () => {
      cur.classList.add('is-down');
      fw *= .82; fh *= .82; fx += fw * .11; fy += fh * .11;
    });
    addEventListener('mouseup', () => cur.classList.remove('is-down'));
    const loop = () => {
      let tx = x - SIZE / 2, ty = y - SIZE / 2, tw = SIZE, th = SIZE, k = .2;
      if (target && target.isConnected) {
        const r = target.getBoundingClientRect();
        if (r.width < innerWidth * .5 && r.height < innerHeight * .4) {
          tx = r.left - PAD; ty = r.top - PAD; tw = r.width + PAD * 2; th = r.height + PAD * 2; k = .24;
        } else { tw = th = SIZE * 1.6; tx = x - tw / 2; ty = y - th / 2; }
      }
      fx += (tx - fx) * k; fy += (ty - fy) * k; fw += (tw - fw) * k; fh += (th - fh) * k;
      frame.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
      frame.style.width = fw + 'px'; frame.style.height = fh + 'px';
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)${cur.classList.contains('is-down') ? ' scale(.5)' : ''}`;
      const below = fy + fh + 22 < innerHeight;
      label.style.transform = `translate3d(${fx}px, ${below ? fy + fh + 8 : fy - 18}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, label, input, select, [data-cursor], [role="button"]');
      if (t === target) return;
      target = t;
      cur.classList.toggle('is-hover', !!t);
      if (t) { cur.classList.remove('is-focus'); void cur.offsetWidth; cur.classList.add('is-focus'); }
      const l = t && t.dataset.cursor;
      cur.classList.toggle('has-label', !!l);
      if (l) label.textContent = l;
    });
    document.addEventListener('mouseleave', () => cur.style.opacity = 0);
    document.addEventListener('mouseenter', () => cur.style.opacity = 1);

  }

  /* ---------- sound on / off ---------- */
  const paintSound = () => $$('[data-sound] b').forEach((b) => (b.textContent = S.muted ? 'off' : 'on'));
  S.setMuted = (m) => { S.muted = m; S.store.set('mute', m ? '1' : '0'); paintSound(); };
  paintSound();
  $$('[data-sound]').forEach((b) => b.addEventListener('click', () => { S.setMuted(!S.muted); if (!S.muted) S.sing('bop'); }));

  /* ---------- magnetic buttons ---------- */
  if (S.fine && S.motion) {
    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' }));
    });
  }

  /* ---------- header: hides going down, comes back going up ---------- */
  const hdr = $('.hdr');
  if (hdr) {
    let last = 0;
    const onScroll = () => {
      const y = scrollY;
      hdr.classList.toggle('is-scrolled', y > 40);
      hdr.classList.toggle('is-hidden', y > 300 && y > last && !hdr.classList.contains('is-open'));
      last = y;
    };
    addEventListener('scroll', onScroll, { passive: true });
    const burger = $('.hdr__burger');
    burger && burger.addEventListener('click', () => {
      const open = hdr.classList.toggle('is-open');
      burger.textContent = open ? 'close' : 'menu';
      S.lenis && (open ? S.lenis.stop() : S.lenis.start());
    });
    const here = location.pathname.split('/').pop() || 'index.html';
    $$('.hdr__nav a').forEach((a) => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  }

  /* ---------- live sign + clock (always harlem time) ---------- */
  const live = $('[data-live]'), clocks = $$('[data-clock]');
  const tickClock = () => {
    const b = S.barNight();
    const hm = S.pad(b.h) + ':' + S.pad(b.m);
    if (live) {
      live.innerHTML = b.open
        ? `<span class="on">●</span> open now · harlem ${hm}`
        : `<span class="off">●</span> ${b.night === 1 && b.hr > 3 ? 'monday, the band sleeps' : 'doors at ' + (b.night === 0 ? '5pm' : '6pm')} · harlem ${hm}`;
    }
    clocks.forEach((c) => c.textContent = 'harlem ' + hm);
  };
  tickClock(); setInterval(tickClock, 20000);

  /* ---------- tab title: the set's not over ---------- */
  const title = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '♪ come back — it\'s your call' : title;
  });

  /* ---------- konami: the whole room scats ---------- */
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let ki = 0;
  addEventListener('keydown', (e) => {
    ki = e.key === KON[ki] ? ki + 1 : (e.key === KON[0] ? 1 : 0);
    if (ki < KON.length) return;
    ki = 0;
    document.body.classList.add('is-scatting');
    const solo = ['skee', 'ba', 'dee', 'dat', 'shoo', 'be', 'doo', 'wah', 'hi', 'de', 'ho', 'bop'];
    S.phrase(solo, .14);
    S.toast('the whole room answers: skee-ba-dee-dat ♪');
    $$('.scr').slice(0, 40).forEach((el) => { if (el.children.length === 0 && el.textContent.length < 40) S.scramble(el, null, 1600); });
    setTimeout(() => document.body.classList.remove('is-scatting'), 2600);
    document.dispatchEvent(new CustomEvent('konami'));
  });

  /* ---------- console ---------- */
  S.help = () => console.log('%cSC.sing("bop") · SC.phrase(["shoo","be","doo"]) · SC.barNight() · SC.DRINKS · SC.toast("hi")', 'color:#d8202c;font-family:monospace');
  console.log(`%c
   ♪    /\\_/\\      ♫
       ( o.o )   <3  ghostly.grl
   ♫    > ^ <   ♪     *

  SCAT — a jazz bar in harlem. we call, you answer.
  type SC.help() for the bartender's notes`, 'color:#d8202c;font-family:monospace');
})();
