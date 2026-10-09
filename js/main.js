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
  function spotifySearch(q) { return "https://open.spotify.com/search/" + encodeURIComponent(q); }

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
      track.style.setProperty("--shift", -w + "px");
      track.style.setProperty("--dur", (w / 45).toFixed(1) + "s"); // ca. 45 px pro Sekunde
    };
    fillMarquee();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillMarquee);
    var mqTimer;
    window.addEventListener("resize", function () { clearTimeout(mqTimer); mqTimer = setTimeout(fillMarquee, 200); });
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
      a.href = spotifySearch(t.artist + " " + t.title);
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", t.title + " von " + t.artist + " auf Spotify anhören");
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
    var wave = el("div", "wave");
    wave.setAttribute("aria-hidden", "true");
    var spans = [];
    var phase = rand() * 6;
    for (var i = 0; i < bars; i++) {
      var s = el("span");
      var env = 0.45 + 0.55 * Math.abs(Math.sin(i / bars * Math.PI * 1.6 + phase));
      s.style.height = Math.max(14, Math.round((0.3 + rand() * 0.7) * env * 100)) + "%";
      wave.appendChild(s);
      spans.push(s);
    }
    card.appendChild(wave);
    card.appendChild(el("h3", "artist__name", name));

    var t = el("a", "artist__track");
    t.href = spotifySearch(trackName ? name + " " + trackName : name);
    t.target = "_blank";
    t.rel = "noopener";
    t.setAttribute("aria-label", (trackName ? trackName + " von " + name : name) + " auf Spotify anhören");
    t.appendChild(el("span", "icon-play"));
    t.appendChild(doc.createTextNode(trackName || "Auf Spotify hören"));
    card.appendChild(t);

    // Startzustand: ein Teil „schon gespielt“
    var base = 0.25 + rand() * 0.5;
    function paint(p) {
      var n = Math.round(p * spans.length);
      for (var k = 0; k < spans.length; k++) spans[k].classList.toggle("is-on", k < n);
    }
    paint(base);

    // Hover: Wellenform „spielt“ durch
    var raf, start;
    function run(ts) {
      if (!start) start = ts;
      var p = (base + (ts - start) / 2600) % 1;
      paint(p);
      raf = requestAnimationFrame(run);
    }
    if (!reduceMotion) {
      card.addEventListener("mouseenter", function () { start = 0; raf = requestAnimationFrame(run); });
      card.addEventListener("mouseleave", function () { cancelAnimationFrame(raf); paint(base); });
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
    S.mixes.forEach(function (m, idx) {
      var card = el("article", "card mix reveal");
      var top = el("div", "mix__top");
      var head = el("div");
      head.appendChild(el("p", "mix__no", "Mix " + String(idx + 1).padStart(2, "0")));
      head.appendChild(el("h3", "mix__title", m.title));
      top.appendChild(head);
      var vinyl = el("div", "vinyl");
      vinyl.setAttribute("aria-hidden", "true");
      top.appendChild(vinyl);
      card.appendChild(top);

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
            "&color=%23a8c8cc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false";
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
      } else {
        var pl = el("div", "mix__player");
        var btn = el("button", "play");
        btn.type = "button";
        btn.appendChild(el("span", "icon-play"));
        var bar = el("div", "mix__bar");
        var mf = el("span", "mix__fill");
        bar.appendChild(mf);
        pl.appendChild(btn);
        pl.appendChild(bar);
        pl.appendChild(el("span", "mix__len", m.length));
        card.appendChild(pl);
        card.appendChild(el("p", "mix__note", (m.note ? m.note + " · " : "") + "Bald auf SoundCloud"));
        var mp = makePlayer(card, btn, function (pr) { mf.style.width = (pr * 100).toFixed(2) + "%"; }, 45000);
        mp.progress = [0.62, 0.36, 0.8][idx % 3];
        mf.style.width = (mp.progress * 100) + "%";
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

  /* ---------- E-Mail kopieren ---------- */
  var copyBtn = $("[data-copy-email]");
  if (copyBtn) {
    var done = function () {
      copyBtn.textContent = "Kopiert";
      copyBtn.classList.add("is-done");
      setTimeout(function () { copyBtn.textContent = "Kopieren"; copyBtn.classList.remove("is-done"); }, 1800);
    };
    var selectMail = function () {
      var r = doc.createRange();
      r.selectNodeContents($(".booking__mail"));
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    };
    copyBtn.addEventListener("click", function () {
      var mail = S.email || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, selectMail);
      } else {
        selectMail();
      }
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

  /* ---------- Bewegung: Genre-Band, 3D-Karten ---------- */
  if (!reduceMotion) {
    var marqueeSkew = $(".marquee__skew");

    var lastY = window.scrollY, skew = 0, ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY;
      // Genre-Band kippt mit der Scroll-Geschwindigkeit
      var v = y - lastY; lastY = y;
      skew += (Math.max(-12, Math.min(12, v * 0.25)) - skew) * 0.25;
      if (marqueeSkew) marqueeSkew.style.setProperty("--skew", skew.toFixed(2) + "deg");
      if (Math.abs(skew) > 0.05) requestTick();
    };
    var requestTick = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", requestTick, { passive: true });
    update();

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      $$(".artist, .mix").forEach(function (card) {
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
