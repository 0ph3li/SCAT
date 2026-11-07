# THE SCAT CLUB — we call, you answer

**THE SCAT CLUB** is a concept website for a basement jazz bar in Harlem, New York, that doesn't exist.
There are live sets every night except Monday, when the band sleeps.

The house rule is simple: **nobody orders here.** The bartender sings a three-syllable call (*shoo-be-doo?*), you sing three syllables back, and your answer is your drink. Every cocktail on the menu is named after the sound that orders it.

> we call, you answer.

Concept, design & code by **ghostly.grl** ♥ · case study 27 of martina.exe · 🎬 reel: [`reel/scat-reel.mp4`](reel/scat-reel.mp4)

---

## The idea

A jazz bar lives on call and response: the horn plays a line, the room answers it. SCAT turns that into the whole brand.

- **Ordering is a song.** On the home page the bartender's call is sung (Web Audio, no sound files). Tap three syllables and the red lockup *THE Scat CALL* turns into *YOUR Ba-Dee-Ya $17*.
- **The door is a call too.** Every reservation comes with three syllables that you sing on the stairs. The code is made from your name, the night and the set, and it is sung back to you.
- **It works like a real bar.** The site keeps Harlem time. Tonight's act, the running order, the countdown and the open/closed sign all update by themselves. The night turns over at **3am New York time**, not at midnight, because the bar is still open.
- **It looks like 2001, the expensive way.** Photographs fill the screen, tall condensed caps are stretched upright, a script runs across them, and red is used like ink. There's satin and pearl, and an orange date stamp in the corner of every photo, like a point-and-shoot camera. No flash: photos surface slowly, like a focus pull in a dark room.

---

## The bar

All of this is live data on the site (`js/main.js`), shared by every page.

| | |
|---|---|
| address | 2259 Frederick Douglass Blvd, downstairs · Harlem, NY 10027 · A B C D to 125th St |
| hours | tue–thu 6pm–1am · fri–sat 6pm–2am · sun 5pm–midnight · **monday closed** |
| sets | 9:00 & 11:30 · sunday 7:00 & 9:00 · tuesday's jam from 9:00 |
| the room | 64 seats, one 1948 baby grand, no bad table |
| contact | 555·0193 · @scat.harlem · hello@scat.nyc |

### The week

| night | act | poster |
|---|---|---|
| tue | **Chalkboard** — the open jam session | live jazz & bring a horn |
| wed | **Nella** & the Late Trains — vocal quartet | live jazz & vocal night |
| thu | **Odessa** Kline Trio — piano, upright bass & brushes | live jazz & piano night |
| fri | **Sweet Kick** — a little big band, eleven players | live jazz & swing night |
| sat | **Moses** Grey Quartet — tenor sax & trouble | live jazz & hard bop |
| sun | **Sunday** — call & response, the whole room sings | live jazz & the whole room sings |
| mon | closed — the band sleeps | see you tuesday |

### The drinks

| drink | sing | what's in it | |
|---|---|---|---|
| Shoo-Be-Doo | shoo · be · doo | rye, sweet vermouth, black cherry, two dashes of bitters | $18 |
| Ba-Dee-Ya | ba · dee · ya | gin, pink grapefruit, rosemary honey, soda | $17 |
| Skee-Dat | skee · dat | mezcal, lime, chili, roasted pineapple, salt | $18 |
| Doo-Wah | doo · wah | cognac, cold brew, cream, grated nutmeg | $19 |
| Bop | bop | very cold gin, a whisper of vermouth, olive brine, three olives | $17 |
| Zoot | zoot | bourbon, white peach, lemon, a sugared rim | $18 |
| Hi-De-Ho | hi · de · ho | champagne, elderflower, lemon, a little gin | $19 |
| Sha-Na | sha · na | hibiscus, ginger, lime, tonic — **zero proof** | $12 |

Every syllable is a note on the blues scale, and vowels change the colour of the voice, so *doo* sounds darker than *dee*.

---

## Art direction: 2000s chic, straight from the posters

The brief was five bar posters, each one a screen of the home page, copied closely: **THE Jazz CLUB**, **THE Midnight LOUNGE**, **Dorian SOCIETY**, **Nubois BAR LOUNGE** and **THE Rossmore**. The `VIBES/` folder is the moodboard.

| colour | hex | used for |
|---|---|---|
| ink | `#0b0908` | the room, every dark background |
| cream | `#f4ece0` | type, pearl buttons |
| red | `#c4161c` | the script, prices, the "now" in the running order |
| felt | `#c81d1d` | the pool table, reservations |
| stamp | `#ff9a2e` | the date stamp in the corner of each photo |

**Type**
- [Libre Caslon Condensed](https://fonts.google.com/specimen/Libre+Caslon+Condensed): the tall caps, stretched 120–130% upright (*THE* … *CLUB*).
- [Ephesis](https://fonts.google.com/specimen/Ephesis): the script that runs across them (*Scat*, *Moses*, *the stairs*).
- [Jost](https://fonts.google.com/specimen/Jost): small wide-spaced caps for everything else.

**The photographic layer**
- an EXIF line above the date stamp (`№ 14 / 36 · 35mm · f/2.0 · 1/15`), with the date in Harlem time;
- a soft warm light leak on each photo, a whisper of film grain, a bloom around the type;
- a frosted-glass pill header, satin cards, pearl pill buttons.

**The cursor** is a point-and-shoot viewfinder. Four corner marks trail a red focus dot. Over a link they lock onto it like autofocus, the dot blinks, and a small label says what will happen (*hold a table*, *listen*, *next*).

---

## Pages

### `index.html` · home
| screen | ref | what happens |
|---|---|---|
| **curtain** | — | not a loader: the corners fade in, *THE Scat CLUB* writes itself, a hairline draws, the room opens |
| **THE Scat CLUB** | THE Jazz CLUB | her piano photograph full-bleed, the giant lockup, and a line with tonight's act and sets |
| **THE Scat CALL** | THE Midnight LOUNGE | the lockup sits inside a frosted martini glass. The bartender sings a call; tap three syllables and the red lockup becomes *YOUR* drink, with its price and recipe. *Another call?* sings a new one. The glass wobbles when the drink is served. |
| **this week** | Dorian SOCIETY | one poster per night, starting with **TONIGHT** and swapping with a blur when you pick a day. The order of the days, the act, the start time and the date are all computed live. |
| **THE Drinks** | the Midnight menu | the eight cocktails in two columns. A white-bordered lab print of the drink follows the cursor. |
| **LAST Night** | — | an editorial spread: one big photograph at a time with slow crossfades, a numbered index, a script caption, and a hairline that fills while each photo holds |
| **Scat JAZZ LOUNGE** | Nubois | the bar in black and white, red script, two red glasses clinking |
| **THE Rossmore** | THE Rossmore | reservations on red pool felt: a satin card that turns into your table and your door code |

### `tonight.html` · tonight
| screen | what happens |
|---|---|
| **tonight's poster** | that night's photograph, the day in tall caps, the act in script, and a live line that changes through the night: *doors in 09:03:18* → *the first set in…* → *on now* → *last call* → *lights up*. On Mondays it says *the band sleeps · back tuesday*. |
| **THE Running ORDER** | doors, first set, the call, second set, last call, lights up, built from that night's hours and sets. A red hairline fills down to *now*, past rows dim, and the current row gets a pulsing dot and a satin *now* pill. |
| **The week** | seven rows, tonight first. A print of each night's photograph follows the cursor down the list. |
| **DOWN the stairs** | the bar in black and white and a pearl button to hold a table for tonight |
| **hold a table** | every *hold a table* on the page opens a satin card over the red felt, already on that night, with that night's sets (Monday can't be picked) |

### `menu.html` · the menu
| screen | what happens |
|---|---|
| **THE Drinks & THE KITCHEN** | the title card, with jump pills to cocktails, wine and small plates |
| **one drink at a time** | a sticky stage driven by the scroll. Each cut-out drink rises into a light tinted by the drink itself, with its name written across the glass in script. A side card shows the syllables, recipe, a line, sweet/sour/bitter bars and the price, plus **sing it ♪**. There's an index on the left, the arrow keys work, and a red hairline keeps count. |
| **NOBODY orders here** | the three steps of the call, linking to the call game on the home |
| **THE Cellar** | champagne, white and red, by the glass or by the bottle, set like a printed card |
| **SMALL Plates** | eight plates from the kitchen next to her photograph, which stays put while the list scrolls |

### `room.html` · the room
| screen | what happens |
|---|---|
| **THE Room** | *64 SEATS · 1 PIANO* over the bar in black and white |
| **THE WAY down** | three photographs staggered like a staircase: seventeen steps, sing at the door, through the curtain |
| **THE Floor plan** | an SVG of the room: the stairs, the velvet curtain, the stage with a baby grand, 4 booths, 14 tables, 10 bar stools and the piano bench. Point at a table to read its note (*a corner for whispering*, *under the trumpet · for the brave*). Click to pick it; your table goes with you to reservations. Works with the keyboard too, and on phones the plan scrolls sideways. |
| **The small print** | the piano, the sound, what to wear, access, phones, private hire on mondays |

### `book.html` · reservations
| screen | what happens |
|---|---|
| **HOLD a table** | her red felt, the lockup on the left and a satin card on the right: the night (`?night=N` preselects it), the set, guests, where to sit (the floor-plan pick comes first), name, email and a note |
| **the ticket** | the card turns into a ticket: night, set, guests, table and **the three syllables to sing at the door**, sung back to you. Hear the code again, **add to calendar** (a real `.ics` file in New York time), change or cancel. |
| **Before you come** | walk-ins, running late, cancelling, the minimum, big tables, the code |

---

## Details worth finding

- **The days turn over at 3am, Harlem time.** Open the site after midnight on a Friday and Friday is still *tonight*.
- **The header sign is live:** *● open now · harlem 22:41*, or *doors at 6pm*, or *monday, the band sleeps*.
- **Your table follows you.** Book on the home, in the tonight card or on the reservations page: it's the same table everywhere, until the night has passed.
- **The door code is yours.** It is made from your name, the night and the set, so the same booking always sings the same three syllables.
- **The floor plan remembers** the table you picked and offers it first when you book.
- **Sound on / off** sits in the header. Every syllable on the site is synthesised live, with a little room delay.
- **Leave the tab** and the title becomes *♪ come back — it's your call*.
- **Konami code** (↑ ↑ ↓ ↓ ← → ← → B A): the whole room scats. The scripts scramble into syllables and the room sings *skee-ba-dee-dat*.
- **Open the console** for the signature and type `SC.help()` for the bartender's notes.
- **The signature** is an ASCII martini and cat that lives only in the code: HTML comments and the console, never on the page.

---

## Built with

- HTML, CSS and vanilla JavaScript: no framework, no build step.
- [GSAP](https://gsap.com/) + ScrollTrigger for every animation and scroll scene.
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling.
- The Web Audio API for the sung syllables (no audio files).
- `Intl.DateTimeFormat` with `America/New_York` for everything that depends on time.
- `localStorage` (prefix `sc-`) for the table, the floor-plan pick, your last answer and the sound setting.
- `prefers-reduced-motion` is respected: the motion steps aside and everything still works.

There is no backend. Reservations are kept in your browser and nothing is emailed.

### Structure

```
SCAT/
├── index.html        home: curtain, the call, this week, drinks, last night, the room, reservations
├── tonight.html      tonight's poster, running order, the week, hold a table
├── menu.html         the drinks stage, the cellar, small plates
├── room.html         the way down, the floor plan, the small print
├── book.html         reservations and the ticket
├── css/
│   ├── style.css     shared: type, palette, grain, slots, viewfinder cursor, header, footer
│   └── index.css · tonight.css · menu.css · room.css · book.css
├── js/
│   ├── main.js       the shared engine (window.SC): harlem time, the week, the drinks, the voice,
│   │                 image slots, cursor, header, sound, konami, console
│   └── index.js · tonight.js · menu.js · room.js · book.js
├── img/              photographs (see img/README.md)
├── VIBES/            the moodboard
└── reel/             scat-reel.mp4, the case study reel
```

### Run it locally

Any static server works. From the project folder:

```bash
python3 .claude/serve.py
```

Then open [http://localhost:5730](http://localhost:5730). This tiny server sends no-cache headers, so edits show up on reload. `python3 -m http.server 5730` works too.

### Photographs

Every photo is a slot: put a file with the right name in `img/` and it appears. Until then, the slot shows a frame in the photo's tone with the filename on it. See [`img/README.md`](img/README.md) for the list.

---

```
          ♪    /\_/\      ♫
              ( o.o )   <3  ghostly.grl
          ♫    > ^ <   ♪
              we call, you answer.
```

Concept, design & code by **ghostly.grl** ♥ — a concept bar, 2026.
