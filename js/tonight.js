/* =========================================================
   SCAT — tonight.js
   the poster of the night (with a live count to the first set),
   the running order that knows what time it is in harlem,
   and the seven nights ahead, tonight first.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SC, $ = S.$, $$ = S.$$;
  const M = S.motion;
  const LONG = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  const develop = (photo) => M && photo && gsap.fromTo(photo, { opacity: 0, filter: 'blur(14px) saturate(.6)' }, { opacity: 1, filter: 'blur(0px) saturate(1)', duration: 2.4, ease: 'power2.out', clearProps: 'filter' });

  // the orange date stamp + exif, like the home page
  const t0 = S.ny();
  const STAMP = `'${String(t0.y).slice(2)} ${S.pad(t0.mo)} ${S.pad(t0.d)}`;
  $$('[data-stamp]').forEach((s) => (s.textContent = STAMP));
  $$('[data-exif]').forEach((e) => (e.innerHTML = `<b>№ ${e.dataset.exif}</b> / 36 · 35mm · f/2.0 · 1/30`));

  /* ---------- the night, as numbers: hours after its midnight (25 = 1am) ---------- */
  const toHr = (s) => { const [h, m] = s.split(':').map(Number); return (h < 12 ? h + 12 : h) + (m || 0) / 60; };
  const clock = (hr) => {
    const h24 = Math.floor(hr) % 24, m = Math.round((hr % 1) * 60);
    const h = h24 % 12 || 12, ap = h24 < 12 ? 'AM' : 'PM';
    return m ? `${h}:${S.pad(m)}${ap}` : `${h}${ap}`;
  };
  const dateOf = (d) => { const x = S.nextDate(d); return `${LONG[d]} ${x.getUTCDate()} ${MON[x.getUTCMonth()]}`; };

  // the running order of a given night
  const order = (d) => {
    const n = S.NIGHTS[d], h = S.HOURS[d];
    if (n.off || !h) return [];
    const sets = (n.sets.match(/\d{1,2}:\d{2}/g) || []).map(toHr);
    const [open, close] = h;
    const ev = [{ at: open, k: 'Doors', note: 'the bar opens · the record player, low', id: 'doors' }];
    if (sets.length === 1) {
      ev.push({ at: sets[0], k: 'The jam opens', note: 'house trio first · then the sign-up chalkboard', id: 'set1', set: true });
      ev.push({ at: sets[0] + 2, k: 'The call', note: 'the bartender sings, the room answers', id: 'call' });
    } else {
      ev.push({ at: sets[0], k: 'First set', note: n.line, id: 'set1', set: true });
      ev.push({ at: (sets[0] + sets[1]) / 2 + .25, k: 'The call', note: 'between sets · the bartender sings, the room answers', id: 'call' });
      ev.push({ at: sets[1], k: 'Second set', note: 'the long one · requests on a napkin', id: 'set2', set: true });
    }
    ev.push({ at: close - .5, k: 'Last call', note: 'one more song, one more answer', id: 'last' });
    ev.push({ at: close, k: 'Lights up', note: 'coats on · see you tomorrow', id: 'close' });
    return ev;
  };

  const night = S.barNight();
  const D = night.night, N = S.NIGHTS[D], P = S.POSTER[D];
  const EV = order(D);
  const nextOpen = (() => { for (let i = 1; i < 8; i++) { const d = (D + i) % 7; if (!S.NIGHTS[d].off) return d; } return D; })();

  /* =========================================================
     01 tonight's poster
     ========================================================= */
  const hero = () => {
    const ph = $('[data-tn-photo]');
    ph.dataset.img = `HOME/${S.NIGHT_IMG[D]}.png`;
    $('.slot__tag', ph).textContent = `img/HOME/${S.NIGHT_IMG[D]}.png — tonight's photograph`;
    S.slots(ph.parentNode);
    $('[data-h-day]').textContent = N.off ? 'MONDAY' : LONG[D];
    $('[data-h-scr]').textContent = P.scr;
    $('[data-h-caps]').textContent = P.caps;
    $('[data-h-kind]').textContent = N.off ? 'no music tonight · the bar is dark' : `${N.kind.toLowerCase()} · ${N.line}`;
    $('[data-h-date]').textContent = dateOf(D) + (N.off ? '' : ` · ${N.sets.replace('&', '·')}`);

    const label = $('[data-h-label]'), count = $('[data-h-count]');
    const hms = (h) => { const s = Math.max(0, Math.round(h * 3600)); return `${S.pad(s / 3600)}:${S.pad((s % 3600) / 60)}:${S.pad(s % 60)}`; };
    const tick = () => {
      const b = S.barNight();
      if (b.night !== D) { location.reload(); return; } // the night turned over at 3am: start again
      const sec = new Date().getSeconds() / 3600;
      const hr = b.hr + sec;
      let l, c;
      if (N.off) { l = 'the band sleeps · back'; c = LONG[nextOpen]; }
      else {
        const next = EV.find((e) => e.at > hr);
        const cur = [...EV].reverse().find((e) => e.at <= hr);
        if (!cur) { l = 'doors in'; c = hms(EV[0].at - hr); }
        else if (!next) { l = 'lights up · tomorrow'; c = S.POSTER[(D + 1) % 7].scr.toUpperCase(); }
        else if (cur.set) { l = `on now · the ${cur.k.toLowerCase()}`; c = next.id === 'call' ? 'LISTEN' : 'ON NOW'; }
        else { l = `the ${next.k.toLowerCase().replace(/^the /, '')} in`; c = hms(next.at - hr); }
      }
      if (label.textContent !== l) label.textContent = l;
      count.textContent = c;
      paintRun(hr);
    };
    S._tick = tick;

    if (!M) return;
    develop($('.tn-hero .photo'));
    gsap.timeline()
      .from('.tn-hero .photo', { scale: 1.12, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.tn-hero__day', { opacity: 0, letterSpacing: '.4em', duration: 1.6, ease: 'power3.out' }, .1)
      .fromTo('.tn-hero__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.5, ease: 'power2.inOut' }, .4)
      .from('.tn-hero__caps', { opacity: 0, yPercent: 40, duration: 1.3, ease: 'power3.out' }, .7)
      .from('.tn-hero__kind, .tn-hero__now > *, .tn-hero .corner, .tn-hero .cam, .hdr', { opacity: 0, y: 12, filter: 'blur(6px)', stagger: .06, duration: 1.2, ease: 'power3.out' }, 1);
    gsap.timeline({ scrollTrigger: { trigger: '.tn-hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.tn-hero .photo', { yPercent: 16, ease: 'none' }, 0)
      .to('.tn-hero__lock', { yPercent: -24, opacity: .25, ease: 'none' }, 0);
  };

  /* =========================================================
     02 the running order
     ========================================================= */
  const list = $('[data-run]'), rail = $('[data-r-rail]');
  let rows = [];
  const run = () => {
    if (N.off) {
      $('[data-r-sub]').textContent = 'monday · the band sleeps';
      list.innerHTML = `<li class="run__row is-off"><span class="run__t tc">—</span><span class="run__k scr">No music tonight</span><span class="run__n sp">back ${LONG[nextOpen].toLowerCase()} · ${S.NIGHTS[nextOpen].name.toLowerCase()} · doors at ${clock(S.HOURS[nextOpen][0])}</span></li>`;
      rail.parentNode.hidden = true;
    } else {
      list.innerHTML = EV.map((e) => `<li class="run__row${e.set ? ' is-set' : ''}" data-id="${e.id}">
        <span class="run__t tc">${clock(e.at)}</span>
        <span class="run__k scr">${e.k}</span>
        <span class="run__n sp">${e.note}</span>
        <span class="run__now sp" aria-hidden="true">now</span></li>`).join('');
    }
    rows = $$('.run__row', list);
    paintRun(S.barNight().hr);
    if (!M) return;
    gsap.from('.run__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.run', start: 'top 70%' } });
    gsap.fromTo(rows, { opacity: 0, x: -24, filter: 'blur(6px)' }, { opacity: (i, r) => (r.classList.contains('is-past') ? .38 : 1), x: 0, filter: 'blur(0px)', stagger: .09, duration: 1.1, ease: 'power3.out', clearProps: 'opacity,filter,transform', scrollTrigger: { trigger: list, start: 'top 78%' } });
    gsap.from('.run__rail', { scaleY: 0, transformOrigin: 'top', duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: list, start: 'top 78%' } });
  };
  // the hairline fills to now; the row we're in lights up
  const paintRun = (hr) => {
    if (N.off || !rows.length) return;
    let idx = -1;
    EV.forEach((e, i) => { if (e.at <= hr) idx = i; });
    rows.forEach((r, i) => { r.classList.toggle('is-past', i < idx); r.classList.toggle('is-now', i === idx); });
    // fill: through the rows already passed, plus how far we are into the current one
    let f = 0;
    if (idx >= 0) {
      const a = EV[idx].at, b = EV[idx + 1] ? EV[idx + 1].at : a + 1;
      const r = rows[idx], top = r.offsetTop, h = r.offsetHeight;
      const px = top + h * .5 + (rows[idx + 1] ? (rows[idx + 1].offsetTop - top) * S.clamp((hr - a) / (b - a), 0, 1) : 0);
      f = S.clamp(px / list.offsetHeight, 0, 1);
    }
    rail.style.transform = `scaleY(${f})`;
  };

  /* =========================================================
     03 the week ahead
     ========================================================= */
  const week = () => {
    const box = $('[data-week]');
    const ds = [...Array(7)].map((_, i) => (D + i) % 7);
    box.innerHTML = ds.map((d, i) => {
      const n = S.NIGHTS[d], p = S.POSTER[d], x = S.nextDate(d);
      const when = `${DAYS[d]} ${x.getUTCDate()} ${MON[x.getUTCMonth()].slice(0, 3)}`;
      if (n.off) return `<li class="wk__row is-off" data-d="${d}">
          <span class="wk__day tc">${i ? when : 'TONIGHT'}</span>
          <span class="wk__name scr">${p.scr}</span>
          <span class="wk__kind sp">the band sleeps</span>
          <span class="wk__go sp">—</span></li>`;
      return `<li class="wk__row" data-d="${d}">
          <a href="book.html?night=${d}" data-cursor="hold a table">
            <span class="wk__day tc">${i ? when : 'TONIGHT'}</span>
            <span class="wk__name scr">${p.scr}</span>
            <span class="wk__kind sp">${p.caps.toLowerCase()}${p.caps.includes(n.kind) ? '' : ' · ' + n.kind.toLowerCase()}</span>
            <span class="wk__time sp">${n.time.replace('—', ' — ').toLowerCase()} · ${/from/.test(n.sets) ? n.sets : 'sets ' + n.sets}</span>
            <span class="wk__go sp">hold a table ›</span>
          </a></li>`;
    }).join('');

    // a print of that night's photograph follows the cursor
    if (S.fine) {
      const pr = document.createElement('div');
      pr.className = 'print'; pr.setAttribute('aria-hidden', 'true');
      pr.innerHTML = '<div class="print__photo"></div><p class="print__cap"><span class="scr"></span><span class="sp"></span></p>';
      document.body.append(pr);
      const ph = $('.print__photo', pr), nm = $('.print__cap .scr', pr), pc = $('.print__cap .sp', pr);
      let x = 0, y = 0, px = 0, py = 0, rot = 0, on = false, raf = 0, curD = -1;
      const follow = () => {
        px += (x - px) * .16; py += (y - py) * .16;
        const vr = S.clamp((x - px) * .08, -10, 10); rot += (vr - rot) * .2;
        const right = px > innerWidth * .55;
        pr.style.transform = `translate3d(${px + (right ? -330 : 60)}px, ${py - 140}px, 0) rotate(${rot + (right ? 3 : -3)}deg)`;
        raf = on || Math.abs(x - px) > .5 ? requestAnimationFrame(follow) : 0;
      };
      const show = (d) => {
        if (d === curD) return; curD = d;
        const src = `img/HOME/${S.NIGHT_IMG[d]}.png`;
        ph.innerHTML = `<img src="${src}" alt="" /><p class="stamp">${STAMP}</p>`;
        nm.textContent = S.POSTER[d].scr; pc.textContent = DAYS[d];
        if (M) gsap.fromTo(ph, { filter: 'blur(6px)', opacity: .5 }, { filter: 'blur(0px)', opacity: 1, duration: .9, ease: 'power2.out', clearProps: 'filter,opacity' });
      };
      box.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(follow); });
      $$('.wk__row', box).forEach((row) => row.addEventListener('mouseenter', (e) => {
        if (!on) { px = x = e.clientX; py = y = e.clientY; }
        on = true; pr.classList.add('is-on'); show(+row.dataset.d);
        if (!raf) raf = requestAnimationFrame(follow);
      }));
      box.addEventListener('mouseleave', () => { on = false; pr.classList.remove('is-on'); });
    }
    if (!M) return;
    gsap.from('.wk__head > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.wk', start: 'top 72%' } });
    gsap.fromTo($$('.wk__row', box), { opacity: 0, y: 26, filter: 'blur(5px)' }, { opacity: (i, r) => (r.classList.contains('is-off') ? .42 : 1), y: 0, filter: 'blur(0px)', stagger: .07, duration: 1, ease: 'power3.out', clearProps: 'opacity,filter,transform', scrollTrigger: { trigger: box, start: 'top 82%' } });
  };

  /* =========================================================
     04 down the stairs
     ========================================================= */
  const door = () => {
    if (N.off) {
      $('[data-d-sub]').textContent = `closed tonight · back ${LONG[nextOpen].toLowerCase()}`;
      const b = $('[data-d-btn]'); b.textContent = `hold a table for ${LONG[nextOpen].toLowerCase()}`; b.href = `book.html?night=${nextOpen}`;
    } else $('[data-d-btn]').href = `book.html?night=${D}`;
    if (!M) return;
    const p = $('.tn-door');
    ScrollTrigger.create({ trigger: p, start: 'top 55%', once: true, onEnter: () => develop($('.photo', p)) });
    gsap.to($('.photo', p), { yPercent: 10, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.tn-door__lock > *', { opacity: 0, y: 24, filter: 'blur(6px)', stagger: .12, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 50%' } });
  };

  /* =========================================================
     05 hold a table — every "hold a table" opens the satin card
     (same table as the home page: stored in sc-table)
     ========================================================= */
  const sheet = () => {
    const box = $('[data-sheet]'), card = $('.sheet__card', box);
    const form = $('[data-book]', box), done = $('.book__done', box), days = $('[data-days]', box);
    const sets = $('[data-sets]', box), who = $('[data-who]', box), out = $('[data-party]', box);
    S.slots(box);
    let party = 2, pick = 0, last = null;
    // the next seven nights, tonight first (dates in harlem)
    const opts = [...Array(7)].map((_, i) => { const wd = (D + i) % 7; return { wd, date: S.nextDate(wd) }; });
    days.innerHTML = opts.map((o, i) => `<button type="button" data-o="${i}" ${S.NIGHTS[o.wd].off ? 'disabled title="the band sleeps"' : ''}><span>${i ? DAYS[o.wd] : 'TONIGHT'}</span><b>${o.date.getUTCDate()}</b></button>`).join('');
    const choose = (i) => {
      if (S.NIGHTS[opts[i].wd].off) i = opts.findIndex((o) => !S.NIGHTS[o.wd].off);
      pick = i;
      $$('button', days).forEach((b) => b.classList.toggle('is-on', +b.dataset.o === i));
      const n = S.NIGHTS[opts[i].wd];
      who.textContent = `${n.name} · ${n.kind.toLowerCase()}`;
      const times = n.sets.match(/\d{1,2}:\d{2}/g) || ['9:00'];
      const keep = form.set ? form.set.value : null;
      sets.innerHTML = times.map((s, j) => `<label><input type="radio" name="set" value="${s}" ${(keep ? s === keep : !j) ? 'checked' : ''} /><span class="tc">${s}</span></label>`).join('');
      if (!$('input:checked', sets)) $('input', sets).checked = true;
    };
    days.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && !b.disabled) choose(+b.dataset.o); });
    $$('[data-step-btn]', box).forEach((b) => b.addEventListener('click', () => { party = S.clamp(party + +b.dataset.stepBtn, 1, 8); out.textContent = party; }));

    const fill = (tb) => {
      const d = new Date(tb.date);
      $('[data-t-name]', box).textContent = tb.name;
      $('[data-t-when]', box).textContent = `${LONG[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]} · the ${tb.set} set · ${tb.party} ${tb.party > 1 ? 'guests' : 'guest'}`;
      $('[data-t-code]', box).textContent = tb.code.join(' · ');
    };
    const held = () => { try { const tb = JSON.parse(S.store.get('table')); return tb && tb.date >= opts[0].date.getTime() ? tb : null; } catch (e) { return null; } };
    const showForm = (on) => { form.hidden = !on; done.hidden = on; };

    const open = (wd) => {
      last = document.activeElement;
      const tb = held();
      if (tb) { fill(tb); showForm(false); }
      else { showForm(true); choose(Math.max(0, opts.findIndex((o) => o.wd === wd))); }
      box.hidden = false;
      document.documentElement.classList.add('has-sheet');
      S.lenis && S.lenis.stop();
      if (M) {
        gsap.fromTo('.sheet__bg', { opacity: 0 }, { opacity: 1, duration: .6, ease: 'power2.out' });
        gsap.fromTo(card, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9, ease: 'power3.out', clearProps: 'filter' });
        gsap.fromTo('.sheet__lock > *', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: .08, duration: .8, delay: .15, ease: 'power3.out' });
      }
      setTimeout(() => (form.hidden ? $('[data-unbook]', box) : $('button.is-on', days) || form.name).focus({ preventScroll: true }), 60);
    };
    const close = () => {
      const end = () => { box.hidden = true; document.documentElement.classList.remove('has-sheet'); S.lenis && S.lenis.start(); last && last.focus && last.focus({ preventScroll: true }); };
      if (!M) return end();
      gsap.to(card, { opacity: 0, y: 30, duration: .4, ease: 'power2.in' });
      gsap.to('.sheet__bg', { opacity: 0, duration: .5, delay: .1, onComplete: end });
    };
    $$('[data-close]', box).forEach((b) => b.addEventListener('click', close));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !box.hidden) close(); });

    // every "hold a table" on the page opens the card on its night
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="book.html"]');
      if (!a) return;
      e.preventDefault();
      const m = a.getAttribute('href').match(/night=(\d)/);
      open(m ? +m[1] : D);
    });

    const swap = (from, to) => {
      if (!M) { from.hidden = true; to.hidden = false; return; }
      gsap.to(from, { opacity: 0, duration: .3, onComplete: () => {
        from.hidden = true; gsap.set(from, { opacity: 1 }); to.hidden = false;
        gsap.from(to.children, { opacity: 0, y: 16, stagger: .07, duration: .7, ease: 'power3.out' });
      } });
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wrap = $('.f__name', form), name = form.name.value.trim();
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
    $('[data-unbook]', box).addEventListener('click', () => { S.store.del('table'); choose(pick); swap(done, form); });
    $('[data-sing]', box).addEventListener('click', () => { const tb = held(); if (tb) S.phrase(tb.code, .3); });
  };

  const footer = () => {
    if (!M) return;
    gsap.from('.ft__lock > *', { opacity: 0, y: 40, filter: 'blur(8px)', stagger: .12, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.ft', start: 'top 80%' } });
  };

  hero(); run(); S._tick(); week(); door(); sheet(); footer();
  setInterval(S._tick, 1000);
  addEventListener('resize', () => S._tick());
})();
