/* =========================================================
   SCAT — book.js
   reservations: the night (?night=N), the set, the guests, the table
   picked on the floor plan (sc-seat), a ticket with a sung door code,
   a calendar file. the table is sc-table, shared with every page.
   concept, design & code by ghostly.grl ♥
   ========================================================= */
(() => {
  const S = window.SC, $ = S.$, $$ = S.$$;
  const M = S.motion;
  const LONG = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const t0 = S.ny();
  $$('[data-stamp]').forEach((s) => (s.textContent = `'${String(t0.y).slice(2)} ${S.pad(t0.mo)} ${S.pad(t0.d)}`));
  $$('[data-exif]').forEach((e) => (e.innerHTML = `<b>№ ${e.dataset.exif}</b> / 36 · 35mm · f/2.8 · 1/30`));

  const D = S.barNight().night;
  const form = $('[data-book]'), ticket = $('[data-ticket]'), days = $('[data-days]'), sets = $('[data-sets]');
  const who = $('[data-who]'), out = $('[data-party]'), seatSel = $('[data-seat]'), err = $('[data-err]');
  const opts = [...Array(7)].map((_, i) => { const wd = (D + i) % 7; return { wd, date: S.nextDate(wd) }; });
  let party = 2, pick = 0;

  /* ---------- the night ---------- */
  days.innerHTML = opts.map((o, i) => `<button type="button" data-o="${i}" ${S.NIGHTS[o.wd].off ? 'disabled title="the band sleeps"' : ''}><span>${i ? DAYS[o.wd] : 'TONIGHT'}</span><b>${o.date.getUTCDate()}</b></button>`).join('');
  const choose = (i) => {
    if (S.NIGHTS[opts[i].wd].off) i = opts.findIndex((o) => !S.NIGHTS[o.wd].off);
    pick = i;
    $$('button', days).forEach((b) => b.classList.toggle('is-on', +b.dataset.o === i));
    const n = S.NIGHTS[opts[i].wd];
    who.textContent = `${n.name} · ${n.kind.toLowerCase()} · ${n.time.replace('—', ' — ').toLowerCase()}`;
    $('[data-act]').textContent = `${i ? LONG[opts[i].wd].toLowerCase() : 'tonight'} · ${n.name.toLowerCase()}`;
    const times = n.sets.match(/\d{1,2}:\d{2}/g) || ['9:00'];
    const keep = form.set ? form.set.value : null;
    sets.innerHTML = times.map((s, j) => `<label><input type="radio" name="set" value="${s}" ${(keep ? s === keep : !j) ? 'checked' : ''} /><span class="tc">${s}</span></label>`).join('');
    if (!$('input:checked', sets)) $('input', sets).checked = true;
  };
  days.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && !b.disabled) choose(+b.dataset.o); });
  $$('[data-step-btn]').forEach((b) => b.addEventListener('click', () => { party = S.clamp(party + +b.dataset.stepBtn, 1, 8); out.textContent = party; paintSeats(); }));

  /* ---------- where to sit (the floor plan pick comes first) ---------- */
  let planSeat = null;
  try { planSeat = JSON.parse(S.store.get('seat')); } catch (e) {}
  const SEATS = [['any', 'anywhere · surprise us'], ['booth', 'a booth along the wall'], ['two', 'a little table for two'], ['four', 'a table for four'], ['bar', 'at the bar · where the call is sung'], ['piano', 'the piano bench · ask nicely']];
  const paintSeats = () => {
    const keep = seatSel.value;
    const plan = planSeat ? [[`plan:${planSeat.id}`, `${planSeat.kind === 'bar' ? 'stool' : planSeat.kind === 'piano' ? 'the piano bench' : planSeat.kind === 'booth' ? 'booth' : 'table'} ${planSeat.kind === 'piano' ? '' : planSeat.id} · from the floor plan`.replace(/\s+/g, ' ')]] : [];
    seatSel.innerHTML = [...plan, ...SEATS].map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    seatSel.value = keep && [...seatSel.options].some((o) => o.value === keep) ? keep : seatSel.options[0].value;
  };
  paintSeats();

  /* ---------- the ticket ---------- */
  const seatLabel = (v) => (v.startsWith('plan:') ? seatSel.querySelector(`option[value="${v}"]`)?.textContent.replace(' · from the floor plan', '') || v.slice(5) : (SEATS.find((s) => s[0] === v) || SEATS[0])[1].split(' · ')[0]);
  const fill = (tb) => {
    const d = new Date(tb.date);
    $('[data-t-name]').textContent = tb.name;
    $('[data-t-night]').textContent = `${LONG[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`;
    $('[data-t-set]').textContent = `the ${tb.set}`;
    $('[data-t-party]').textContent = `${tb.party} ${tb.party > 1 ? 'guests' : 'guest'}`;
    $('[data-t-seat]').textContent = tb.seatLabel || 'anywhere';
    $('[data-t-code]').textContent = tb.code.map((s) => s.toUpperCase()).join(' · ');
    $('[data-t-mail]').textContent = `this ticket is kept on this device${tb.email ? ' · ' + tb.email : ''} · show it at the door, or just sing`;
  };
  const held = () => { try { const tb = JSON.parse(S.store.get('table')); return tb && tb.date >= opts[0].date.getTime() ? tb : null; } catch (e) { return null; } };
  const swap = (from, to) => {
    if (!M) { from.hidden = true; to.hidden = false; return; }
    gsap.to(from, { opacity: 0, y: -10, duration: .35, ease: 'power2.in', onComplete: () => {
      from.hidden = true; gsap.set(from, { clearProps: 'opacity,transform' }); to.hidden = false;
      gsap.fromTo(to.children, { opacity: 0, y: 16, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .07, duration: .8, ease: 'power3.out', clearProps: 'filter' });
    } });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim();
    $$('.f.is-bad', form).forEach((f) => f.classList.remove('is-bad'));
    if (!name) { form.name.closest('.f').classList.add('is-bad'); err.textContent = 'a name for the door, please'; form.name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { form.email.closest('.f').classList.add('is-bad'); err.textContent = 'an email, so we can confirm'; form.email.focus(); return; }
    err.textContent = '';
    const o = opts[pick], set = form.set.value;
    const keys = Object.keys(S.SYL), h = S.hash(name + o.date.getTime() + set);
    const code = [keys[h % 16], keys[(h >>> 4) % 16], keys[(h >>> 8) % 16]];
    const tb = { name, email, date: o.date.getTime(), set, party, code, seat: seatSel.value, seatLabel: seatLabel(seatSel.value), note: form.note.value.trim() };
    S.store.set('table', JSON.stringify(tb));
    fill(tb); swap(form, ticket);
    setTimeout(() => S.phrase(code, .3), 800);
  });
  $('[data-sing]').addEventListener('click', () => { const tb = held(); if (!tb) return; if (S.muted) S.setMuted(false); S.phrase(tb.code, .3); });
  $('[data-change]').addEventListener('click', () => {
    const tb = held();
    if (tb) {
      form.name.value = tb.name; form.email.value = tb.email || ''; form.note.value = tb.note || '';
      party = tb.party; out.textContent = party;
      const i = opts.findIndex((o) => o.date.getTime() === tb.date); if (i > -1) choose(i);
      const r = $(`input[value="${tb.set}"]`, sets); if (r) r.checked = true;
      if (tb.seat && [...seatSel.options].some((o) => o.value === tb.seat)) seatSel.value = tb.seat;
    }
    swap(ticket, form);
  });
  $('[data-cancel]').addEventListener('click', () => {
    S.store.del('table'); form.reset(); party = 2; out.textContent = 2; choose(pick);
    S.toast('cancelled · the stairs thank you'); swap(ticket, form);
  });
  // a real calendar file, in harlem time
  $('[data-ics]').addEventListener('click', () => {
    const tb = held(); if (!tb) return;
    const d = new Date(tb.date), [h, m] = tb.set.split(':').map(Number), hh = h < 12 ? h + 12 : h;
    const ymd = `${d.getUTCFullYear()}${S.pad(d.getUTCMonth() + 1)}${S.pad(d.getUTCDate())}`;
    const end = hh + 2 >= 24 ? `${hh + 2 - 24}` : `${hh + 2}`;
    const endDay = new Date(tb.date); if (hh + 2 >= 24) endDay.setUTCDate(endDay.getUTCDate() + 1);
    const ymd2 = `${endDay.getUTCFullYear()}${S.pad(endDay.getUTCMonth() + 1)}${S.pad(endDay.getUTCDate())}`;
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//the scat club//reservations//EN', 'BEGIN:VEVENT',
      `UID:${ymd}-${S.hash(tb.name + tb.set)}@scat.nyc`, `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d+/g, '')}`,
      `DTSTART;TZID=America/New_York:${ymd}T${S.pad(hh)}${S.pad(m)}00`, `DTEND;TZID=America/New_York:${ymd2}T${S.pad(+end)}${S.pad(m)}00`,
      `SUMMARY:The Scat Club · the ${tb.set} set`, 'LOCATION:2259 Frederick Douglass Blvd (downstairs)\\, Harlem\\, NY 10027',
      `DESCRIPTION:Table for ${tb.party} under ${tb.name}. At the door\\, sing: ${tb.code.map(cap).join('-')}.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `scat-club-${ymd}.ics`; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  /* ---------- start: ?night=N, or the table you already hold ---------- */
  const q = new URLSearchParams(location.search).get('night');
  const start = q !== null ? Math.max(0, opts.findIndex((o) => o.wd === +q)) : 0;
  choose(start);
  const tb = held();
  if (tb && q === null) { fill(tb); form.hidden = true; ticket.hidden = false; }

  /* ---------- motion ---------- */
  if (M) {
    const ph = $('.bk .photo');
    gsap.fromTo(ph, { opacity: 0, filter: 'blur(14px) saturate(.6)', scale: 1.08 }, { opacity: 1, filter: 'blur(0px) saturate(1)', scale: 1, duration: 2.6, ease: 'power3.out', clearProps: 'filter' });
    gsap.timeline()
      .from('.bk__the', { opacity: 0, x: -20, duration: .9, ease: 'power3.out' }, .3)
      .fromTo('.bk__scr', { clipPath: 'inset(-40% 100% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)', duration: 1.4, ease: 'power2.inOut' }, .5)
      .from('.bk__addr, .bk__night', { opacity: 0, y: 14, stagger: .1, duration: .9 }, 1)
      .from('.bk__card', { opacity: 0, y: 40, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out', clearProps: 'filter' }, .6)
      .from('.hdr, .bk .cam', { opacity: 0, duration: 1 }, 1.2);
    gsap.fromTo('.faq__scr', { clipPath: 'inset(-30% 100% -30% -10%)' }, { clipPath: 'inset(-30% -10% -30% -10%)', duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: '.faq', start: 'top 70%' } });
    gsap.fromTo('.faq__list li', { opacity: 0, y: 24, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .08, duration: 1, ease: 'power3.out', clearProps: 'filter,transform', scrollTrigger: { trigger: '.faq__list', start: 'top 82%' } });
    gsap.from('.ft__lock > *', { opacity: 0, y: 40, filter: 'blur(8px)', stagger: .12, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: '.ft', start: 'top 80%' } });
  }
})();
