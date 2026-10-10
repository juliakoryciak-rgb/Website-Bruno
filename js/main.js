(function () {
  "use strict";

  var S = window.SITE || {};
  var doc = document;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.documentElement.classList.add("js");

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function isPlaceholder(v) { return !v || /\[.*\]/.test(v); }
  function soundcloudSearch(q) { return "https://soundcloud.com/search?q=" + encodeURIComponent(q); }

  // Deterministischer Zufall, damit jede Wellenform immer gleich aussieht
  function seeded(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6d2b79f5;
      var t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Links (E-Mail, Social) ---------- */
  $$('[data-link]').forEach(function (a) {
    var key = a.getAttribute("data-link");
    if (key === "email") {
      a.textContent = S.email || "booking@[domain]";
      a.href = "mailto:" + (S.email || "");
      return;
    }
    var url = S[key];
    if (url) {
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.title = "Link folgt";
      a.addEventListener("click", function (e) { e.preventDefault(); });
    }
  });

  var year = $("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Navigation ---------- */
  var nav = $(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 20); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var navLinks = $$(".nav__links a");
  var navBar = $(".nav__links");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + entry.target.id;
          a.classList.toggle("is-active", on);
          // Auf dem Handy aktiven Link in der wischbaren Leiste sichtbar halten
          if (on && navBar.scrollWidth > navBar.clientWidth) {
            navBar.scrollTo({ left: a.offsetLeft - 8, behavior: reduceMotion ? "auto" : "smooth" });
          }
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  /* ---------- „Nach oben“ und Logo: ganz nach oben scrollen ---------- */
  // Der Anker #top sitzt in der fixierten Navigation, darauf kann der Browser nicht scrollen.
  $$('a[href="#top"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
  });

  /* ---------- Genre-Laufband: so oft kopieren, dass nie eine Lücke entsteht ---------- */
  var track = $(".marquee__track");
  if (track) {
    var list = $(".marquee__list", track);
    var fillMarquee = function () {
      $$(".marquee__list[aria-hidden]", track).forEach(function (c) { c.remove(); });
      var w = list.getBoundingClientRect().width;
      if (!w) return;
      // Mindestens zwei Bildschirmbreiten plus eine Liste, damit die Schleife nahtlos ist
      var copies = Math.ceil((window.innerWidth * 2) / w) + 1;
      for (var i = 0; i < copies; i++) {
        var copy = list.cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      }
      mqWidth = w;
    };
    var mqWidth = 0;
    fillMarquee();

    // Bewegung per JavaScript statt CSS-Animation: so kann das Band beim Anhalten
    // sanft abbremsen und danach weich wieder anlaufen, ohne zu springen.
    var marquee = $(".marquee");
    var SPEED = 45;           // Pixel pro Sekunde
    var mqX = 0, mqV = SPEED, mqTarget = SPEED, mqLast = 0;
    var mqStep = function (ts) {
      var dt = mqLast ? Math.min(0.05, (ts - mqLast) / 1000) : 0;
      mqLast = ts;
      mqV += (mqTarget - mqV) * Math.min(1, dt * 3);   // weiches Bremsen/Beschleunigen
      mqX -= mqV * dt;
      if (mqWidth && mqX <= -mqWidth) mqX += mqWidth;
      track.style.transform = "translate3d(" + mqX.toFixed(2) + "px,0,0)";
      requestAnimationFrame(mqStep);
    };
    if (!reduceMotion) requestAnimationFrame(mqStep);
    var mqPinned = false;
    marquee.addEventListener("mouseenter", function () { mqTarget = 0; });
    marquee.addEventListener("mouseleave", function () { if (!mqPinned) mqTarget = SPEED; });
    // Auf dem Handy: antippen hält das Band an, nochmal antippen lässt es weiterlaufen
    marquee.addEventListener("click", function (e) {
      if (e.pointerType === "mouse") return;
      mqPinned = !mqPinned;
      mqTarget = mqPinned ? 0 : SPEED;
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillMarquee);
    var mqTimer;
    window.addEventListener("resize", function () { clearTimeout(mqTimer); mqTimer = setTimeout(fillMarquee, 200); });
  }

  /* ---------- Bio: Rest der Geschichte aufklappen ---------- */
  var bioToggle = $("[data-bio-toggle]");
  if (bioToggle) {
    var bio = $(".bio");
    var bioLabel = $("[data-bio-toggle-label]", bioToggle);
    bioToggle.hidden = false;
    bioToggle.addEventListener("click", function () {
      var open = !bio.classList.contains("is-open");
      bio.classList.toggle("is-open", open);
      bioToggle.setAttribute("aria-expanded", open ? "true" : "false");
      bioLabel.textContent = open ? "Weniger anzeigen" : "Ganze Geschichte lesen";
      // Beim Zuklappen zurück an den Anfang der Bio
      if (!open && bio.getBoundingClientRect().top < 0) {
        $("#bio").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
  }

  /* ---------- Equalizer (Bio) ---------- */
  var eq = $(".eq");
  if (eq) {
    var r = seeded("bruno");
    for (var i = 0; i < 20; i++) {
      var b = el("span", i > 8 && i < 12 ? "is-hi" : "");
      b.style.height = (6 + r() * 16) + "px";
      b.style.animationDelay = (-r() * 1.2).toFixed(2) + "s";
      b.style.animationDuration = (0.7 + r() * 0.8).toFixed(2) + "s";
      eq.appendChild(b);
    }
  }

  /* ---------- Gerade in jedem Set ---------- */
  var setList = $("[data-set-tracks]");
  if (setList && S.setTracks) {
    S.setTracks.forEach(function (t, idx) {
      var li = el("li");
      var a = el("a");
      a.href = soundcloudSearch(t.artist + " " + t.title);
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", t.title + " von " + t.artist + " auf SoundCloud anhören");
      a.appendChild(el("span", "nowplaying__no", String(idx + 1).padStart(2, "0")));
      var info = el("span");
      info.appendChild(el("span", "nowplaying__title", t.title));
      info.appendChild(el("span", "nowplaying__artist", t.artist));
      a.appendChild(info);
      var p = el("span", "play");
      p.appendChild(el("span", "icon-play"));
      a.appendChild(p);
      li.appendChild(a);
      setList.appendChild(li);
    });
    var upd = $("[data-set-updated]");
    if (upd && S.setTracksUpdated) upd.textContent = "Stand: " + S.setTracksUpdated;
  }

  /* ---------- Inspiration: Karten mit Wellenform ---------- */
  $$(".artist").forEach(function (card, idx) {
    var name = card.getAttribute("data-artist");
    var trackName = card.getAttribute("data-track");
    var rand = seeded(name);
    var bars = window.innerWidth < 760 ? 34 : 44;

    card.appendChild(el("p", "artist__no", String(idx + 1).padStart(2, "0")));
    // Zwei gleiche Balken-Ebenen: unten gedimmt, oben hell. Die obere wird stufenlos
    // per clip-path aufgedeckt, dadurch läuft der Fortschritt flüssig statt Balken für Balken.
    var wave = el("div", "wave");
    wave.setAttribute("aria-hidden", "true");
    var waveBase = el("div", "wave__layer");
    var waveTop = el("div", "wave__layer wave__layer--played");
    var waveHead = el("span", "wave__head");
    var phase = rand() * 6;
    for (var i = 0; i < bars; i++) {
      var env = 0.45 + 0.55 * Math.abs(Math.sin(i / bars * Math.PI * 1.6 + phase));
      var h = Math.max(14, Math.round((0.3 + rand() * 0.7) * env * 100)) + "%";
      var b1 = el("span"); b1.style.height = h; waveBase.appendChild(b1);
      var b2 = el("span"); b2.style.height = h; waveTop.appendChild(b2);
    }
    wave.appendChild(waveBase);
    wave.appendChild(waveTop);
    wave.appendChild(waveHead);
    card.appendChild(wave);
    card.appendChild(el("h3", "artist__name", name));

    var t = el("a", "artist__track");
    t.href = soundcloudSearch(trackName ? name + " " + trackName : name);
    t.target = "_blank";
    t.rel = "noopener";
    t.setAttribute("aria-label", (trackName ? trackName + " von " + name : name) + " auf SoundCloud anhören");
    t.appendChild(el("span", "icon-play"));
    t.appendChild(doc.createTextNode(trackName || "Auf SoundCloud hören"));
    card.appendChild(t);

    // Startzustand: ein Teil „schon gespielt“
    var base = 0.25 + rand() * 0.5;
    var cur = base;
    function paint(p) {
      cur = p;
      var pct = (p * 100).toFixed(2);
      waveTop.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      waveHead.style.left = pct + "%";
    }
    paint(base);

    // Hover: Wellenform „spielt“ gleichmäßig durch, beim Verlassen gleitet sie zurück
    var raf, last;
    function run(ts) {
      if (last) paint((cur + (ts - last) / 9000) % 1);
      last = ts;
      raf = requestAnimationFrame(run);
    }
    function back(from, t0) {
      return function step(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / 600);
        var e = 1 - Math.pow(1 - k, 3);
        paint(from + (base - from) * e);
        if (k < 1) raf = requestAnimationFrame(step);
      };
    }
    if (!reduceMotion) {
      card.addEventListener("mouseenter", function () { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(run); });
      card.addEventListener("mouseleave", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(back(cur)); });
    }
  });

  /* ---------- Player-Logik (Hero + Mixes) ---------- */
  // Nur ein Player gleichzeitig. Ohne SoundCloud-Link ist es eine Vorschau-Animation.
  var players = [];
  function makePlayer(root, button, onFrame, duration, hooks) {
    hooks = hooks || {};
    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", "Abspielen");
    var p = { playing: false, progress: 0, raf: 0, last: 0 };
    function frame(ts) {
      if (!p.last) p.last = ts;
      p.progress = (p.progress + (ts - p.last) / duration) % 1;
      p.last = ts;
      onFrame(p.progress);
      p.raf = requestAnimationFrame(frame);
    }
    p.stop = function () {
      p.playing = false;
      cancelAnimationFrame(p.raf);
      root.classList.remove("is-playing");
      button.setAttribute("aria-label", "Abspielen");
      if (hooks.onStop) hooks.onStop();
    };
    p.start = function () {
      players.forEach(function (o) { if (o !== p) o.stop(); });
      p.playing = true;
      p.last = 0;
      root.classList.add("is-playing");
      button.setAttribute("aria-label", "Pause");
      if (hooks.onStart) hooks.onStart();
      if (!reduceMotion || hooks.always) p.raf = requestAnimationFrame(frame);
    };
    button.addEventListener("click", function () { p.playing ? p.stop() : p.start(); });
    players.push(p);
    return p;
  }

  var hero = $("[data-hero-player]");
  if (hero) {
    var fill = $(".mini-player__fill", hero);
    var knob = $(".mini-player__knob", hero);
    function setBar(pr) {
      var v = (pr * 100).toFixed(2) + "%";
      fill.style.width = v;
      knob.style.left = v;
    }
    // Hörprobe: Sobald in content.js „heroSnippet“ eine MP3 steht, spielt der Button echte Musik
    var audio = S.heroSnippet ? new Audio(S.heroSnippet) : null;
    if (audio) {
      audio.preload = "none";
      audio.addEventListener("ended", function () { hp.stop(); audio.currentTime = 0; setBar(0); });
    } else {
      $(".play", hero).title = "Hörprobe folgt";
    }
    var hp = makePlayer(hero, $(".play", hero), function (pr) {
      if (audio && audio.duration) pr = audio.currentTime / audio.duration;
      setBar(pr);
    }, 30000, {
      always: !!audio,
      onStart: function () { if (audio) audio.play().catch(function () { hp.stop(); }); },
      onStop: function () { if (audio) audio.pause(); },
    });
    hp.progress = audio ? 0 : 0.62;
    if (audio) setBar(0);
  }

  var mixWrap = $("[data-mixes]");
  var scEmbeds = [];
  if (mixWrap && S.mixes) {
    var ICON = {
      prev: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M11 7v10l-7-5zM20 7v10l-7-5z"/></svg>',
      next: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M4 7v10l7-5zM13 7v10l7-5z"/></svg>',
      play: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
      more: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>'
    };
    var fmtTime = function (sec) {
      sec = Math.max(0, Math.floor(sec));
      return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
    };
    S.mixes.forEach(function (m, idx) {
      // Aufbau wie ein „Jetzt läuft“-Bildschirm: Cover, Titel, Fortschritt, Tasten
      var card = el("article", "mix reveal");
      if (m.cover) card.style.setProperty("--cover", "url('" + m.cover + "')");

      var cover = el("div", "mix__cover");
      if (m.cover) {
        var ci = el("img");
        ci.src = m.cover;
        ci.alt = "Cover: " + m.title;
        ci.loading = "lazy";
        cover.appendChild(ci);
      } else {
        // Platzhalter, bis das echte Cover da ist
        cover.classList.add("mix__cover--empty");
        var ph = el("div", "mix__ph");
        ph.setAttribute("aria-hidden", "true");
        ph.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 16l-5-5-9 9"/></svg>';
        ph.appendChild(el("span", "mix__ph-text", "Cover folgt"));
        cover.appendChild(ph);
      }
      if (!m.soundcloud) cover.appendChild(el("span", "mix__soon-badge", "Coming soon"));
      card.appendChild(cover);

      var head = el("div", "mix__head");
      var titles = el("div", "mix__titles");
      titles.appendChild(el("h3", "mix__title", m.title));
      titles.appendChild(el("p", "mix__artist", "brunoooo.mp3"));
      head.appendChild(titles);
      var more = el("span", "mix__more");
      more.setAttribute("aria-hidden", "true");
      more.innerHTML = ICON.more;
      head.appendChild(more);
      card.appendChild(head);

      // Länge in Sekunden für die Zeitanzeige (aus „60–90 min“ wird 60 min)
      var total = (parseInt(m.length, 10) || 60) * 60;
      var startP = [0.38, 0.62, 0.22][idx % 3];

      var prog = el("div", "mix__progress");
      prog.setAttribute("aria-hidden", "true");
      var bar = el("div", "mix__bar");
      var fill = el("span", "mix__fill");
      bar.appendChild(fill);
      prog.appendChild(bar);
      var times = el("div", "mix__times");
      var tNow = el("span", "", fmtTime(total * startP));
      var tLeft = el("span", "", "-" + fmtTime(total * (1 - startP)));
      times.appendChild(tNow);
      times.appendChild(tLeft);
      prog.appendChild(times);
      card.appendChild(prog);

      var ctrls = el("div", "mix__controls");
      ctrls.setAttribute("aria-hidden", "true");
      ctrls.innerHTML = '<span class="mix__ctrl">' + ICON.prev + '</span><span class="mix__ctrl mix__ctrl--play">' + ICON.play + '</span><span class="mix__ctrl">' + ICON.next + '</span>';
      card.appendChild(ctrls);

      var foot = el("div", "mix__foot");
      foot.appendChild(el("span", "", "© brunoooo.mp3"));
      foot.appendChild(el("span", "", m.soundcloud ? "SoundCloud" : "Bald auf SoundCloud"));
      card.appendChild(foot);

      // Beim Drüberfahren „läuft“ der Mix: Balken wächst, Zeit zählt weiter
      var cur = startP, raf, last;
      var playIcon = $(".mix__ctrl--play", ctrls);
      var paint = function (p) {
        cur = p;
        fill.style.transform = "scaleX(" + p.toFixed(4) + ")";
        tNow.textContent = fmtTime(total * p);
        tLeft.textContent = "-" + fmtTime(total * (1 - p));
      };
      paint(startP);
      var run = function (ts) {
        if (last) paint((cur + (ts - last) / 1000 / total) % 1);
        last = ts;
        raf = requestAnimationFrame(run);
      };
      if (!reduceMotion) {
        card.addEventListener("mouseenter", function () {
          cancelAnimationFrame(raf); last = 0; card.classList.add("is-playing");
          playIcon.innerHTML = ICON.pause;
          raf = requestAnimationFrame(run);
        });
        card.addEventListener("mouseleave", function () {
          cancelAnimationFrame(raf); card.classList.remove("is-playing");
          playIcon.innerHTML = ICON.play;
        });
      }

      if (m.soundcloud) {
        // Zwei-Klick-Lösung: SoundCloud lädt erst nach Zustimmung (Datenschutz)
        var gate = el("div", "sc-gate");
        gate.appendChild(el("p", "sc-gate__text", "Beim Laden des Players werden Daten an SoundCloud übertragen."));
        var load = el("button", "btn btn--ghost btn--sm", "Player laden");
        load.type = "button";
        gate.appendChild(load);
        card.appendChild(gate);
        var embed = function () {
          var f = doc.createElement("iframe");
          f.loading = "lazy";
          f.allow = "autoplay";
          f.title = "SoundCloud-Player: " + m.title;
          f.src = "https://w.soundcloud.com/player/?url=" + encodeURIComponent(m.soundcloud) +
            "&color=%23a8c8cc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=false";
          gate.replaceWith(f);
        };
        // Ein Klick lädt alle Player auf der Seite
        scEmbeds.push(embed);
        load.addEventListener("click", function () {
          try { localStorage.setItem("sc-consent", "1"); } catch (e) {}
          scEmbeds.splice(0).forEach(function (fn) { fn(); });
        });
        var ok = false;
        try { ok = localStorage.getItem("sc-consent") === "1"; } catch (e) {}
        if (ok) embed();
      }
      mixWrap.appendChild(card);
    });
  }

  /* ---------- Gigs ---------- */
  var gigWrap = $("[data-gigs]");
  if (gigWrap && S.gigs) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var upcoming = [], past = [];
    S.gigs.forEach(function (g) {
      var monthOnly = /^\d{4}-\d{2}$/.test(g.date || "");
      var d = g.date ? new Date((monthOnly ? g.date + "-01" : g.date) + "T00:00:00") : null;
      // Bei reinen Monatsangaben zählt der Gig bis zum Monatsende als „demnächst“
      var end = d && monthOnly ? new Date(d.getFullYear(), d.getMonth() + 1, 0) : d;
      var isUp = d ? end >= today : !!g.upcoming;
      (isUp ? upcoming : past).push({ g: g, d: d, monthOnly: monthOnly });
    });
    function byDate(dir) {
      return function (a, b) {
        if (!a.d && !b.d) return 0;
        if (!a.d) return -1;
        if (!b.d) return 1;
        return dir * (a.d - b.d);
      };
    }
    upcoming.sort(byDate(1));
    past.sort(byDate(-1));
    var fmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    var fmtMonth = new Intl.DateTimeFormat("de-DE", { month: "short", year: "numeric" });
    function when(it) {
      if (it.d) return it.monthOnly ? fmtMonth.format(it.d) : fmt.format(it.d);
      return it.g.note || "[Datum]";
    }

    function render(which) {
      var items = which === "upcoming" ? upcoming : past;
      gigWrap.innerHTML = "";
      if (!items.length) {
        var empty = el("p", "gigs__empty");
        empty.innerHTML = which === "upcoming"
          ? 'Neue Termine folgen bald. <a href="#booking">Jetzt anfragen →</a>'
          : "Noch keine Einträge.";
        gigWrap.appendChild(empty);
        return;
      }
      items.forEach(function (it, i) {
        var row = el("div", "gig");
        row.style.animationDelay = (i * 0.04) + "s";
        var name = el("span", "gig__name", it.g.name);
        if (!it.d && it.g.note) name.appendChild(el("span", "gig__tag", it.g.note));
        if (which === "upcoming" && i === 0 && it.d) name.appendChild(el("span", "gig__tag", "Next"));
        row.appendChild(name);
        row.appendChild(el("span", "gig__meta", it.g.city + (it.d ? " · " + when(it) : "")));
        gigWrap.appendChild(row);
      });
    }

    var tabs = $$(".tab");
    function select(which) {
      tabs.forEach(function (t) {
        var on = t.getAttribute("data-tab") === which;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      render(which);
    }
    tabs.forEach(function (t) {
      t.addEventListener("click", function () { select(t.getAttribute("data-tab")); });
    });
    select(upcoming.length ? "upcoming" : "past");
  }

  /* ---------- Booking-Formular → fertige E-Mail ---------- */
  var form = $("[data-booking-form]");
  if (form) {
    var err = $("[data-form-error]", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var missing = [];
      ["name", "email"].forEach(function (k) {
        var bad = !f[k].value.trim() || (k === "email" && !f[k].checkValidity());
        f[k].closest(".field").classList.toggle("is-invalid", bad);
        if (bad) missing.push(k);
      });
      if (missing.length) {
        err.textContent = "Bitte Name und eine gültige E-Mail-Adresse angeben.";
        f[missing[0]].focus();
        return;
      }
      err.textContent = "";
      var date = f.date.value ? fmtDate(f.date.value) : "offen";
      var lines = [
        "Hi Bruno,",
        "",
        "ich möchte dich gern buchen.",
        "",
        "Name: " + f.name.value.trim(),
        "E-Mail: " + f.email.value.trim(),
        "Datum: " + date,
        "Ort / Location: " + (f.location.value.trim() || "–"),
        "Art des Events: " + f.type.value,
        "Gäste (ca.): " + (f.guests.value || "–"),
        "",
        f.message.value.trim(),
      ];
      var subject = "Booking-Anfrage: " + f.type.value + " · " + date;
      window.location.href = "mailto:" + (S.email || "") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    });
    function fmtDate(v) {
      var p = v.split("-");
      return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : v;
    }
  }

  /* ---------- Galerie mit Großansicht ---------- */
  var gallery = $("[data-gallery]");
  var lb = $("[data-lightbox]");
  if (gallery && S.gallery && S.gallery.length) {
    var base = "assets/img/galerie/";
    S.gallery.forEach(function (g, i) {
      var b = el("button", "gallery__item");
      b.type = "button";
      b.setAttribute("aria-label", "Foto vergrößern: " + (g.caption || g.alt));
      var im = el("img");
      im.src = base + g.file + "-klein.jpg";
      im.alt = g.alt || "";
      im.decoding = "async"; // klein genug, um alle direkt zu laden (kein Lazy-Loading in der Seitwärts-Reihe)
      b.appendChild(im);
      if (g.caption) b.appendChild(el("span", "gallery__cap", g.caption));
      b.addEventListener("click", function () { openLb(i); });
      gallery.appendChild(b);
    });

    // Pfeile zum Blättern in der Fotoreihe
    var galBtns = $$("[data-gal-step]");
    galBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        gallery.scrollBy({ left: +btn.getAttribute("data-gal-step") * gallery.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
    var galArrows = function () {
      var max = gallery.scrollWidth - gallery.clientWidth - 4;
      galBtns.forEach(function (btn) {
        btn.disabled = +btn.getAttribute("data-gal-step") < 0 ? gallery.scrollLeft <= 4 : gallery.scrollLeft >= max;
      });
    };
    gallery.addEventListener("scroll", galArrows, { passive: true });
    window.addEventListener("resize", galArrows);
    $$("img", gallery).forEach(function (im) { im.addEventListener("load", galArrows); });
    galArrows();

    var cur = 0, lbImg = $("[data-lb-img]", lb), lbCap = $("[data-lb-caption]", lb), lbCount = $("[data-lb-count]", lb);
    var show = function (i) {
      cur = (i + S.gallery.length) % S.gallery.length;
      var g = S.gallery[cur];
      lbImg.src = base + g.file + ".jpg";
      lbImg.alt = g.alt || "";
      lbCap.textContent = g.caption || "";
      lbCount.textContent = (cur + 1) + " / " + S.gallery.length;
      // Nächstes Bild schon vorladen
      new Image().src = base + S.gallery[(cur + 1) % S.gallery.length].file + ".jpg";
    };
    var openLb = function (i) {
      show(i);
      if (lb.showModal) lb.showModal(); else lb.setAttribute("open", "");
      doc.documentElement.classList.add("no-scroll");
    };
    var closeLb = function () { if (lb.open) lb.close(); };
    lb.addEventListener("close", function () { doc.documentElement.classList.remove("no-scroll"); });
    $("[data-lb-close]", lb).addEventListener("click", closeLb);
    $$("[data-lb-step]", lb).forEach(function (btn) {
      btn.addEventListener("click", function () { show(cur + +btn.getAttribute("data-lb-step")); });
    });
    // Klick neben das Foto schließt
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });
    // Wischen auf dem Handy
    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- Uhrzeit im Hero ---------- */
  var clock = $("[data-clock]");
  if (clock) {
    var moods = [
      [5, "Afterhour vorbei. Kaffee?"],
      [11, "Zu früh für den Club. Perfekt zum Reinhören."],
      [15, "Daydrinking-Wetter, wie am StrandPauli."],
      [19, "Zeit fürs Warm-up."],
      [23, "Peak Time."],
    ];
    var tick = function () {
      var now = new Date();
      var h = now.getHours();
      var mood = h < 3 || h >= 23 ? "Peak Time." : h < 5 ? "Closing. Noch ein Track?" : moods[0][1];
      if (h >= 5 && h < 23) moods.forEach(function (m) { if (h >= m[0]) mood = m[1]; });
      var hh = String(h).padStart(2, "0"), mm = String(now.getMinutes()).padStart(2, "0");
      clock.innerHTML = "";
      clock.appendChild(el("span", "clock__dot"));
      clock.appendChild(el("span", "clock__time", hh + ":" + mm));
      clock.appendChild(el("span", "clock__mood", mood));
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- Video im Hero (optional) ---------- */
  if (S.heroVideo) {
    var heroImg = $(".hero__photo img");
    var v = doc.createElement("video");
    v.className = "hero__video";
    v.src = S.heroVideo;
    v.poster = heroImg.getAttribute("src");
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("aria-hidden", "true");
    if (!reduceMotion) v.autoplay = true;
    heroImg.replaceWith(v);
  }

  /* ---------- Crossfader (Sound) ---------- */
  var fader = $("[data-fader]");
  if (fader) {
    var modes = $$(".mode[data-pos]");
    var readout = $("[data-fader-readout]");
    var applyFader = function () {
      var v = +fader.value;
      var ws = modes.map(function (m) {
        var w = Math.max(0, 1 - Math.abs(v - +m.getAttribute("data-pos")) / 50);
        m.style.setProperty("--w", w.toFixed(3));
        m.classList.toggle("is-live", w > 0.5);
        return { name: m.getAttribute("data-name"), w: w };
      });
      fader.style.setProperty("--v", v + "%");
      var sum = ws.reduce(function (a, b) { return a + b.w; }, 0) || 1;
      readout.textContent = ws.filter(function (x) { return x.w > 0.02; })
        .sort(function (a, b) { return b.w - a.w; })
        .map(function (x) { return Math.round(x.w / sum * 100) + " % " + x.name; })
        .join("  ·  ");
    };
    fader.addEventListener("input", applyFader);
    applyFader();
  }

  /* ---------- Easter Egg: 4× aufs Logo (für die vier o's) ---------- */
  var logo = $(".nav__logo");
  var camper = $("[data-camper]");
  if (logo && camper) {
    var clicks = 0, timer, typed = "";
    var drive = function () {
      if (camper.classList.contains("is-driving")) return;
      camper.hidden = false;
      camper.classList.add("is-driving");
      setTimeout(function () { camper.classList.remove("is-driving"); camper.hidden = true; }, reduceMotion ? 3000 : 7000);
    };
    logo.addEventListener("click", function () {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(function () { clicks = 0; }, 1200);
      if (clicks >= 4) { clicks = 0; drive(); }
    });
    doc.addEventListener("keydown", function (e) {
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      typed = (typed + e.key).slice(-4).toLowerCase();
      if (typed === "oooo") { typed = ""; drive(); }
    });
  }

  /* ---------- 3D-Karten ---------- */
  if (!reduceMotion) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $$(".artist").forEach(function (card) {
        card.classList.add("tilt");
        card.addEventListener("pointermove", function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width, yy = (e.clientY - r.top) / r.height;
          card.classList.add("is-tilting");
          card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
          card.style.setProperty("--my", (yy * 100).toFixed(1) + "%");
          card.style.transform = "perspective(900px) rotateX(" + ((0.5 - yy) * 7).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 9).toFixed(2) + "deg) translateY(-3px)";
        });
        card.addEventListener("pointerleave", function () {
          card.classList.remove("is-tilting");
          card.style.transform = "";
        });
      });
    }
  }

  /* ---------- Lebendigkeit: Fortschrittsbalken, Lichtschein, Galerie-Drift ---------- */
  var bar = $(".scrollbar");
  if (bar) {
    var setProgress = function () {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    };
    setProgress();
    window.addEventListener("scroll", setProgress, { passive: true });
    window.addEventListener("resize", setProgress);
  }

  if (!reduceMotion) {
    // Filmkorn
    var grain = el("div", "grain");
    grain.setAttribute("aria-hidden", "true");
    doc.body.appendChild(grain);

    // Lichtschein in den hellen Containern (nur mit Maus)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $$(".section--panel").forEach(function (panel) {
        panel.addEventListener("pointermove", function (e) {
          var r = panel.getBoundingClientRect();
          panel.style.setProperty("--mx", (e.clientX - r.left) + "px");
          panel.style.setProperty("--my", (e.clientY - r.top) + "px");
          panel.classList.add("is-lit");
        });
        panel.addEventListener("pointerleave", function () { panel.classList.remove("is-lit"); });
      });
    }

    // Galerie gleitet langsam von selbst, hält bei Maus oder Berührung an
    var gal = $("[data-gallery]");
    if (gal) {
      var dir = 1, hold = 0, galLast = 0, galAcc = 0;
      var pause = function () { hold = performance.now() + 4000; };
      gal.addEventListener("pointerenter", function () { hold = Infinity; });
      gal.addEventListener("pointerleave", function () { hold = performance.now() + 800; });
      ["touchstart", "wheel", "keydown"].forEach(function (ev) { gal.addEventListener(ev, pause, { passive: true }); });
      $$("[data-gal-step]").forEach(function (b) { b.addEventListener("click", pause); });
      var drift = function (ts) {
        var dt = galLast ? Math.min(0.05, (ts - galLast) / 1000) : 0;
        galLast = ts;
        var max = gal.scrollWidth - gal.clientWidth;
        if (ts > hold && max > 0 && !(lb && lb.open)) {
          galAcc += 18 * dt * dir;              // ca. 18 Pixel pro Sekunde
          var stepPx = galAcc | 0;
          if (stepPx) { gal.scrollLeft += stepPx; galAcc -= stepPx; }
          if (gal.scrollLeft >= max - 1) { dir = -1; hold = ts + 2500; }
          else if (gal.scrollLeft <= 0 && dir < 0) { dir = 1; hold = ts + 2500; }
        }
        requestAnimationFrame(drift);
      };
      gal.style.scrollSnapType = "none"; // sonst springt das Einrasten beim Gleiten
      gal.addEventListener("touchstart", function () { gal.style.scrollSnapType = ""; }, { passive: true });
      requestAnimationFrame(drift);
    }
  }

  /* ---------- Einblenden beim Scrollen ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    // Leichte Staffelung bei Karten-Rastern
    $$(".artists, .mixes").forEach(function (grid) {
      $$(".reveal", grid).forEach(function (c, i) { c.style.setProperty("--d", (i % 4) * 0.07 + "s"); });
    });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("is-in"); });
  }
})();
