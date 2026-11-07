/* =========================================================
   SCAT — index.js (home, v4 · 2000s chic)
   curtain → THE Scat CLUB → the call (Midnight) → this week (Dorian)
   → the drinks → the room (Nubois) → reservations (Rossmore)
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SC, $ = S.$, $$ = S.$$;
  const M = S.motion;
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const LONG = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  /* ---------- no flash: photographs surface slowly, like a focus pull in a dark room ---------- */
  const develop = (photo) => M && photo && gsap.fromTo(photo, { opacity: 0, filter: 'blur(14px) saturate(.6)' }, { opacity: 1, filter: 'blur(0px) saturate(1)', duration: 2.4, ease: 'power2.out', clearProps: 'filter' });
  const soft = (el) => M && gsap.fromTo(el, { filter: 'blur(6px)', opacity: .5 }, { filter: 'blur(0px)', opacity: 1, duration: 1, ease: 'power2.out', clearProps: 'filter,opacity' });

  // the orange date stamp, like a 2002 point-and-shoot (harlem date)
  const t = S.ny();
  const STAMP = `'${String(t.y).slice(2)} ${S.pad(t.mo)} ${S.pad(t.d)}`;
  $$('[data-stamp]').forEach((s) => (s.textContent = STAMP));
  // and the exif line above it: frame number on a 36-exposure roll
  const EXIF = { '01': 'f/2.8 · 1/60', '14': 'f/2.0 · 1/15', '27': 'f/4 · 1/125', '36': 'f/2.8 · 1/30' };
  $$('[data-exif]').forEach((e) => (e.innerHTML = `<b>№ ${e.dataset.exif}</b> / 36 · 35mm · ${EXIF[e.dataset.exif] || 'f/2.8 · 1/60'}`));

  /* =========================================================
     00 the curtain: the lockup writes itself, a hairline, the room opens
     ========================================================= */
  const loader = () => new Promise((done) => {
    const ld = $('.ld');
    if (!ld || !M) { ld && ld.remove(); document.body.classList.remove('is-loading'); return done(); }
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.ld__corner, .ld__cap', { opacity: 0, duration: 1.2 }, 0)
      .from('.ld__lock .tc', { opacity: 0, letterSpacing: '.4em', duration: 1.6 }, .2)
      .fromTo('.ld__lock .scr', { clipPath: 'inset(-40% 100% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.4, ease: 'power2.inOut' }, .6)
      .fromTo('.ld__line', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, .4)
      .to('.ld__in', { opacity: 0, y: -14, filter: 'blur(6px)', duration: .9, ease: 'power2.in' }, 2.4)
      .to(ld, { opacity: 0, duration: 1.1, ease: 'power2.inOut', onStart: () => { document.body.classList.remove('is-loading'); done(); }, onComplete: () => ld.remove() }, 2.9);
  });

  /* =========================================================
     01 THE Scat CLUB
     ========================================================= */
  const night = S.barNight();
  const tonight = S.NIGHTS[night.night];
  $('[data-tonight-name]').textContent = tonight.off ? 'the band sleeps' : tonight.name;
  $('[data-tonight-time]').textContent = tonight.off ? 'back tuesday' : tonight.sets;

  const heroIn = () => {
    if (!M) return;
    develop($('.hero .photo'));
    gsap.timeline()
      .from('.hero .photo', { scale: 1.12, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.hero .lock__caps', { opacity: 0, yPercent: (i) => (i ? 40 : -40), duration: 1.4, ease: 'power3.out' }, .2)
      .fromTo('.hero .lock__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.5, ease: 'power2.inOut' }, .6)
      .from('.hdr, .hero__tonight, .hero .cam', { opacity: 0, duration: 1.4 }, 1.1);
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero .photo', { yPercent: 18, ease: 'none' }, 0)
      .to('.hero .lock', { yPercent: -30, opacity: .2, ease: 'none' }, 0);
  };

  // every poster screen: its photograph surfaces slowly as you arrive
  const posters = () => {
    if (!M) return;
    $$('.poster:not(.hero)').forEach((p) => {
      ScrollTrigger.create({ trigger: p, start: 'top 55%', once: true, onEnter: () => develop($('.photo', p)) });
      gsap.to($('.photo', p), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  };

  /* =========================================================
     02 THE Scat CALL — the Midnight Lounge glass
     ========================================================= */
  const call = () => {
    const CALLS = [['shoo', 'be', 'doo'], ['ba', 'dee', 'ya'], ['skee', 'dat'], ['hi', 'de', 'ho'], ['doo', 'wah'], ['sha', 'na'], ['zoot'], ['bop']];
    const CHIPS = ['shoo', 'be', 'doo', 'ba', 'dee', 'ya', 'skee', 'dat', 'wah', 'bop', 'zoot', 'hi', 'de', 'ho', 'sha', 'na'];
    const sec = $('.call'), line = $('[data-call]'), again = $('[data-again]'), ans = $('[data-answer]'), box = $('[data-sylls]');
    const the = $('[data-c-the]'), scr = $('[data-c-scr]'), caps = $('[data-c-caps]'), sub = $('[data-c-sub]');
    let cur = CALLS[0], picked = [], poured = false;

    box.innerHTML = CHIPS.map((s) => `<button type="button" data-s="${s}">${s}</button>`).join('');
    const paintAns = () => { ans.textContent = picked.length ? picked.map(cap).join('-') + (picked.length < 3 ? '…' : '') : ''; };
    const callText = (c) => c.map(cap).join('-') + '?';
    const sing = () => { S.phrase(cur, .3); S.call = cur; };

    const swapLock = (a, b, c, d) => {
      const set = () => { the.textContent = a; scr.textContent = b; caps.textContent = c; sub.textContent = d; };
      if (!M) return set();
      gsap.timeline()
        .to([the, scr, caps, sub], { opacity: 0, filter: 'blur(8px)', duration: .35, stagger: .04 })
        .add(set)
        .to([the, scr, caps, sub], { opacity: 1, filter: 'blur(0px)', duration: .7, stagger: .08, ease: 'power2.out' });
    };
    const pickDrink = (a) => {
      let best = null, score = -1;
      S.DRINKS.forEach((d) => {
        let sc = d.syl.filter((s) => a.includes(s)).length;
        if (d.syl.join() === a.slice(0, d.syl.length).join()) sc += 5;
        sc += (S.hash(a.join() + d.name) % 100) / 1000;
        if (sc > score) { score = sc; best = d; }
      });
      return best;
    };
    const serve = () => {
      const d = pickDrink(picked);
      poured = true;
      S.store.set('answer', picked.join('-'));
      sec.classList.add('is-poured');
      if (M) gsap.fromTo('.glassfx', { rotate: 0 }, { keyframes: [{ rotate: -2.2, duration: .35 }, { rotate: 1.4, duration: .4 }, { rotate: -.6, duration: .45 }, { rotate: 0, duration: .6 }], ease: 'sine.inOut' });
      setTimeout(() => S.phrase(d.syl, .3), 500);
      swapLock('YOUR', d.name, `$${d.price}`, d.desc + (d.zero ? ' · zero proof' : ''));
      again.textContent = 'Another call?';
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b || picked.length >= 3) return;
      picked.push(b.dataset.s); S.sing(b.dataset.s); paintAns();
      if (picked.length === 3) setTimeout(serve, 350);
    });
    line.addEventListener('click', sing);
    again.addEventListener('click', () => {
      if (!poured) { sing(); return; }
      poured = false; picked = []; paintAns();
      sec.classList.remove('is-poured');
      cur = S.pick(CALLS.filter((c) => c !== cur));
      line.textContent = callText(cur);
      swapLock('THE', 'Scat', 'CALL', 'the bartender sings · you sing it back');
      again.textContent = 'Sing to get a drink!';
      setTimeout(sing, 700);
    });
    paintAns();

    if (!M) return;
    gsap.fromTo('.glassfx', { yPercent: 8 }, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.call__lock > *', { opacity: 0, y: 20, filter: 'blur(6px)', stagger: .1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 50%' } });
    let touched = false, sung = false;
    addEventListener('pointerdown', () => (touched = true), { once: true });
    ScrollTrigger.create({ trigger: sec, start: 'top 35%', onEnter: () => { if (touched && !sung) { sung = true; sing(); } } });
  };

  /* =========================================================
     03 Dorian SOCIETY — one poster a night, from tonight
     ========================================================= */
  const POSTER = S.POSTER;
  const week = () => {
    const sec = $('.week'), nav = $('[data-days-nav]');
    const els = { scr: $('[data-w-scr]'), caps: $('[data-w-caps]'), kind: $('[data-w-kind]'), start: $('[data-w-start]'), date: $('[data-w-date]') };
    const order = [...Array(7)].map((_, i) => (night.night + i) % 7);
    nav.innerHTML = order.map((d, i) => `<button type="button" data-d="${d}" class="${i === 0 ? 'is-today' : ''}">${i === 0 ? 'TONIGHT' : DAYS[d]}</button>`).join('');
    let curD = null;
    const show = (d, anim = true) => {
      if (d === curD) return; curD = d;
      const p = POSTER[d], n = S.NIGHTS[d], date = S.nextDate(d);
      const set = () => {
        els.scr.textContent = p.scr; els.caps.textContent = p.caps; els.kind.textContent = p.kind;
        els.start.textContent = n.off ? 'DOORS SHUT' : `START AT ${n.time.split('—')[0]}`;
        els.date.textContent = `${LONG[d]} ${date.getUTCDate()} ${MON[date.getUTCMonth()]}`;
      };
      $$('button', nav).forEach((b) => b.classList.toggle('is-on', +b.dataset.d === d));
      if (!anim || !M) return set();
      // the Dorian move: everything smears sideways, like a glass raised too fast
      gsap.timeline()
        .to([els.scr, els.caps, els.kind, els.start, els.date], { opacity: 0, x: -30, filter: 'blur(10px)', duration: .3, stagger: .02 })
        .to($('.photo', sec), { x: 30, filter: 'blur(8px)', duration: .3 }, 0)
        .add(set)
        .set([els.scr, els.caps, els.kind, els.start, els.date], { x: 30 })
        .to([els.scr, els.caps, els.kind, els.start, els.date], { opacity: 1, x: 0, filter: 'blur(0px)', duration: .7, stagger: .05, ease: 'power3.out' })
        .to($('.photo', sec), { x: 0, filter: 'blur(0px)', duration: .8, ease: 'power3.out', clearProps: 'filter' }, '<');
    };
    show(order[0], false);
    nav.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.d); });
    nav.addEventListener('mouseover', (e) => { const b = e.target.closest('button'); if (b && S.fine) show(+b.dataset.d); });
    if (M) gsap.from('.week__top > *, .week__mid > *, .week__foot > *', { opacity: 0, y: 24, stagger: .08, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 50%' } });
  };

  /* =========================================================
     04 the drinks
     ========================================================= */
  const menu = () => {
    const list = $('[data-menu]');
    list.innerHTML = S.DRINKS.map((d, i) => `<li class="drink" data-i="${i}" data-cursor="listen">
      <p class="drink__name scr">${d.name}</p>
      <p class="drink__price">${d.price}</p>
      <p class="drink__syl sp">${d.syl.join(' · ')}${d.zero ? ' · zero proof' : ''}</p>
      <p class="drink__desc sp">${d.desc}</p></li>`).join('');
    let last = -1;
    $$('.drink', list).forEach((row) => row.addEventListener('mouseenter', () => {
      const i = +row.dataset.i; if (i === last) return; last = i; S.phrase(S.DRINKS[i].syl, .2);
    }));

    // a lab print of the drink follows the cursor (her cut-out photo img/HOME/<syllables>.png, a drawn glass until then)
    if (S.fine) {
      const pr = document.createElement('div');
      pr.className = 'print'; pr.setAttribute('aria-hidden', 'true');
      pr.innerHTML = '<div class="print__photo"></div><p class="print__cap"><span class="scr"></span><span class="sp"></span></p>';
      document.body.append(pr);
      const ph = $('.print__photo', pr), nm = $('.print__cap .scr', pr), pc = $('.print__cap .sp', pr);
      const cache = {};
      let x = 0, y = 0, px = 0, py = 0, rot = 0, on = false, raf = 0;
      const follow = () => {
        px += (x - px) * .16; py += (y - py) * .16;
        const vr = S.clamp((x - px) * .08, -10, 10); rot += (vr - rot) * .2;
        pr.style.transform = `translate3d(${px + (px > innerWidth / 2 ? -300 : 70)}px, ${py - 170}px, 0) rotate(${rot + (px > innerWidth / 2 ? 3 : -3)}deg)`;
        raf = on || Math.abs(x - px) > .5 ? requestAnimationFrame(follow) : 0;
      };
      const show = (i) => {
        const d = S.DRINKS[i];
        nm.textContent = d.name; pc.textContent = `$${d.price}`;
        ph.classList.remove('has-img');
        ph.innerHTML = S.glass(d.glass, { liq: d.liq }) + `<p class="stamp">${STAMP}</p>`;
        const src = `img/HOME/${d.syl.join('')}.png`;
        const put = () => { const im = new Image(); im.src = src; im.alt = ''; im.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'; ph.prepend(im); ph.classList.add('has-img'); };
        if (cache[src] === true) put();
        else if (cache[src] === undefined) { const im = new Image(); im.onload = () => { cache[src] = true; if (nm.textContent === d.name) put(); }; im.onerror = () => (cache[src] = false); im.src = src; cache[src] = 'wait'; }
        soft(ph);
      };
      list.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(follow); });
      $$('.drink', list).forEach((row) => row.addEventListener('mouseenter', (e) => {
        if (!on) { px = x = e.clientX; py = y = e.clientY; }
        on = true; pr.classList.add('is-on'); show(+row.dataset.i);
        if (!raf) raf = requestAnimationFrame(follow);
      }));
      list.addEventListener('mouseleave', () => { on = false; pr.classList.remove('is-on'); });
    }
    if (!M) return;
    gsap.from('.menu__head > *', { opacity: 0, y: 30, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.menu', start: 'top 70%' } });
    gsap.from($$('.drink', list), { opacity: 0, y: 24, stagger: .06, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: list, start: 'top 80%' } });
  };

  /* =========================================================
     04½ last night — an editorial spread: one photograph at a time,
     slow crossfades, a numbered index, a hairline that keeps time
     ========================================================= */
  const gallery = () => {
    const FR = [
      { tone: 'warm', who: 'The Sweet Kick', at: 'the first set · 9:14pm', desc: 'the tenor sax, mid-note, low warm light' },
      { tone: 'red', who: 'Table twelve', at: 'two coupes, one lipstick · 9:52pm', desc: 'two coupes and a lipstick mark on red' },
      { tone: 'bw', who: 'The piano', at: 'between choruses · 10:30pm', desc: 'hands on the keys, black and white' },
      { tone: 'gold', who: 'The call', at: 'the bartender, eyes closed · 11:06pm', desc: 'the bartender singing the call, eyes closed' },
      { tone: 'blur', who: 'Between sets', at: 'nobody sat down · 11:41pm', desc: 'dancing between the tables, slow shutter' },
      { tone: 'bw', who: 'The door', at: 'sing the code · 12:20am', desc: 'someone singing the door code, black and white' },
      { tone: 'warm', who: 'Last call', at: 'a coat left behind · 1:58am', desc: 'empty glasses, a stool, a coat left behind' },
    ];
    const box = $('[data-gal]'), idx = $('[data-gal-idx]');
    const who = $('[data-gal-who]'), at = $('[data-gal-at]'), num = $('[data-gal-n]'), bar = $('[data-gal-bar]');
    box.innerHTML = FR.map((f, i) => `<figure class="gal__ph slot tone-${f.tone}" data-img="HOME/night-${i + 1}.png" data-desc="${f.desc}">
      <span class="slot__tag sp">img/HOME/night-${i + 1}.png — ${f.desc}</span></figure>`).join('');
    idx.innerHTML = FR.map((f, i) => `<li><button type="button" data-g="${i}"><b>${S.pad(i + 1)}</b><span>${f.who}</span><span>${f.at.split('· ').pop()}</span></button></li>`).join('');
    S.slots(box);
    const phs = $$('.gal__ph', box), btns = $$('button', idx);
    let cur = -1, timer = null, live = false;
    const HOLD = 6;

    const show = (i) => {
      if (i === cur) return;
      const prev = phs[cur]; cur = i;
      const f = FR[i], ph = phs[i];
      btns.forEach((b, j) => b.classList.toggle('is-on', j === i));
      num.textContent = S.pad(i + 1);
      if (!M) { phs.forEach((p, j) => p.classList.toggle('is-on', j === i)); who.textContent = f.who; at.textContent = f.at; return; }
      gsap.set(ph, { zIndex: 2 }); if (prev) gsap.set(prev, { zIndex: 1 });
      gsap.fromTo(ph, { opacity: 0, scale: 1.07 }, { opacity: 1, duration: 1.8, ease: 'power2.inOut' });
      gsap.to(ph, { scale: 1, duration: HOLD + 2, ease: 'none', overwrite: false });
      if (prev) gsap.to(prev, { opacity: 0, duration: 1.8, delay: .2, ease: 'power2.inOut' });
      gsap.to([who, at], { opacity: 0, y: -6, duration: .45, ease: 'power2.in', onComplete: () => {
        who.textContent = f.who; at.textContent = f.at;
        gsap.fromTo([who, at], { opacity: 0, y: 8, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, stagger: .08, ease: 'power3.out' });
      } });
      if (timer) timer.kill();
      timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: 'none', paused: !live, onComplete: () => show((cur + 1) % FR.length) });
    };
    idx.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.g); });
    box.addEventListener('click', () => show((cur + 1) % FR.length));
    show(0);
    if (!M) return;
    ScrollTrigger.create({ trigger: '.gal', start: 'top 60%', end: 'bottom 30%', onToggle: (st) => { live = st.isActive; if (timer) live ? timer.play() : timer.pause(); } });
    gsap.timeline({ scrollTrigger: { trigger: '.gal', start: 'top 60%' } })
      .fromTo('.gal__photos', { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1.8, ease: 'power3.inOut' })
      .from('.gal__frame', { opacity: 0, scale: .97, duration: 1.4, ease: 'power2.out' }, .8)
      .from('.gal__side > *', { opacity: 0, y: 20, filter: 'blur(6px)', stagger: .08, duration: 1.1, ease: 'power3.out' }, .3);
  };

  /* =========================================================
     05 Nubois — the room, the glasses clink
     ========================================================= */
  const room = () => {
    if (!M) return;
    const paths = $$('.cheers path');
    paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    gsap.timeline({ scrollTrigger: { trigger: '.room', start: 'top 40%' } })
      .fromTo('.room__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.4, ease: 'power2.inOut' })
      .from('.room__caps span', { opacity: 0, x: (i) => (i ? 40 : -40), duration: 1, ease: 'power3.out' }, .3)
      .to(paths, { strokeDashoffset: 0, duration: 1, stagger: .08, ease: 'power2.out' }, .5)
      .fromTo('.cheers', { rotate: -4 }, { rotate: 4, duration: .12, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 1.6);
  };

  /* =========================================================
     06 THE Rossmore — reservations on red felt
     ========================================================= */
  const book = () => {
    const form = $('[data-book]'), done = $('.book__done'), days = $('[data-days]'), out = $('[data-party]');
    let party = 2, pick = null;
    const opts = [...Array(7)].map((_, i) => { const base = new Date(Date.UTC(t.y, t.mo - 1, t.d)); base.setUTCDate(base.getUTCDate() + i); return { wd: base.getUTCDay(), date: base }; });
    days.innerHTML = opts.map((o, i) => `<button type="button" data-o="${i}" ${o.wd === 1 ? 'disabled title="the band sleeps"' : ''}><span>${DAYS[o.wd]}</span><b>${o.date.getUTCDate()}</b></button>`).join('');
    const choose = (i) => { pick = i; $$('button', days).forEach((b) => b.classList.toggle('is-on', +b.dataset.o === i)); };
    choose(opts.findIndex((o) => o.wd !== 1));
    days.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && !b.disabled) choose(+b.dataset.o); });
    $$('[data-step-btn]').forEach((b) => b.addEventListener('click', () => { party = S.clamp(party + +b.dataset.stepBtn, 1, 8); out.textContent = party; }));

    const swap = (from, to) => {
      if (!M) { from.hidden = true; to.hidden = false; return; }
      gsap.to(from, { opacity: 0, duration: .3, onComplete: () => {
        from.hidden = true; gsap.set(from, { opacity: 1 }); to.hidden = false;
        gsap.from(to.children, { opacity: 0, y: 16, stagger: .07, duration: .7, ease: 'power3.out' });
      } });
    };
    const fill = (tb) => {
      const d = new Date(tb.date);
      $('[data-t-name]').textContent = tb.name;
      $('[data-t-when]').textContent = `${LONG[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} · the ${tb.set} set · ${tb.party} ${tb.party > 1 ? 'guests' : 'guest'}`;
      $('[data-t-code]').textContent = tb.code.join(' · ');
    };
    const held = (() => { try { return JSON.parse(S.store.get('table')); } catch (e) { return null; } })();
    if (held && held.date >= Date.UTC(t.y, t.mo - 1, t.d)) { fill(held); form.hidden = true; done.hidden = false; }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wrap = $('.f__name'), name = form.name.value.trim();
      if (!name) { wrap.classList.add('is-bad'); form.name.focus(); return; }
      wrap.classList.remove('is-bad');
      const o = opts[pick], set = form.set.value;
      const keys = Object.keys(S.SYL), h = S.hash(name + o.date.getTime() + set);
      const code = [keys[h % 16], keys[(h >>> 4) % 16], keys[(h >>> 8) % 16]];
      const tb = { name, date: o.date.getTime(), set, party, code };
      S.store.set('table', JSON.stringify(tb));
      fill(tb); swap(form, done);
      setTimeout(() => S.phrase(code, .3), 700);
    });
    $('[data-unbook]').addEventListener('click', () => { S.store.del('table'); swap(done, form); });

    if (!M) return;
    gsap.timeline({ scrollTrigger: { trigger: '.book', start: 'top 45%' } })
      .from('.book__the', { opacity: 0, x: -20, duration: .8 })
      .fromTo('.book__scr', { clipPath: 'inset(-40% 100% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.3, ease: 'power2.inOut' }, .2)
      .from('.book__addr', { opacity: 0, y: 14, duration: .9 }, .8)
      .from('.book__card', { opacity: 0, y: 40, duration: 1.1, ease: 'power3.out' }, .4);
    // the balls roll a little as you pass
    gsap.to('.ball', { x: (i) => [-60, 40, 30][i], y: (i) => [30, -20, 40][i], ease: 'none', scrollTrigger: { trigger: '.book', start: 'top bottom', end: 'bottom top', scrub: true } });
  };

  /* =========================================================
     footer
     ========================================================= */
  const footer = () => {
    if (!M) return;
    gsap.timeline({ scrollTrigger: { trigger: '.ft', start: 'top 70%' } })
      .from('.ft__lock .tc', { opacity: 0, yPercent: (i) => (i ? 30 : -30), duration: 1.2, ease: 'power3.out' })
      .fromTo('.ft__lock .scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.3, ease: 'power2.inOut' }, .3)
      .from('.ft__cols > div, .ft__nav', { opacity: 0, y: 16, stagger: .1, duration: .9 }, .6);
  };

  // ---------- run ----------
  call(); week(); menu(); gallery(); room(); book(); footer(); posters();
  loader().then(() => { heroIn(); M && ScrollTrigger.refresh(); });
})();
