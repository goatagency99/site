/* The Zebra Patch Collection — shown at the bottom of every MEN product page (above RECOMMENDATIONS).
   Same carousel as the one that used to sit on the homepage: swipe / drag / arrows, SKINNY + RELAXED fits,
   the background colour follows the jeans, a tap on the jeans opens that fit's product page.
   Usage: the page has <section class="zad" id="zebraAd" hidden></section>; window.BYM_ZEBRA_AD.mount(el) fills and shows it. */
(function () {
  'use strict';
  if (window.BYM_ZEBRA_AD) return;

  var COL = [
    ['burgundy', 'Burgundy', '#6B2535', 'dark'], ['blue', 'Blue', '#057CA7', 'dark'], ['red', 'Red', '#890712', 'dark'],
    ['pink', 'Pink', '#9B4178', 'dark'], ['green', 'Green', '#144E13', 'dark'], ['grey', 'Grey', '#565656', 'dark'],
    ['white', 'White', '#999999', 'light'], ['brown', 'Brown', '#422A10', 'dark'], ['purple', 'Purple', '#26003E', 'dark'],
    ['orange', 'Orange', '#BC5200', 'dark']
  ];
  function set(fit) { return COL.map(function (c) { return { id: c[0], name: c[1] + ' Zebra Patch Jeans', bg: c[2], tone: c[3], image: 'assets/img/zebra-' + fit + '-' + c[0] + '-s.webp' }; }); }
  var SKINNY = set('skinny'), RELAXED = set('relaxed');

  var CSS = [
    '.zad{--bg:#6B2535;--fg:#fff;--fg-soft:rgba(255,255,255,.78);--bg-delay:140ms;--bg-dur:600ms;--ease:cubic-bezier(.22,1,.36,1);--step:57vw;--jh:46vh;',
    'position:relative;isolation:isolate;display:grid;grid-template-rows:auto 1fr auto;margin:44px 0 0;padding:28px 0 26px;background-color:var(--bg);color:var(--fg);',
    'transition:background-color var(--bg-dur) var(--ease);overflow:hidden;user-select:none;-webkit-user-select:none;font-family:"Jost","Helvetica Neue",Helvetica,Arial,sans-serif}',
    '@supports(height:1svh){.zad{--jh:46svh}}',
    '.zad[hidden]{display:none}',
    '.zad[data-tone="light"]{--fg:#111;--fg-soft:rgba(17,17,17,.72)}',
    '.zad__heading{margin:0;text-align:center;font-weight:400;font-size:19px;letter-spacing:.01em;line-height:1.2;padding:0 16px 8px;color:var(--fg);transition:color var(--bg-dur) var(--ease);position:relative;z-index:3}',
    '.zad__stage{position:relative;min-height:0;display:flex;align-items:center;justify-content:center;touch-action:pan-y}',
    '.zad__stage.is-dragging{cursor:grabbing}',
    '.zad__track{position:relative;width:100%;height:var(--jh)}',
    '.zad__slide{position:absolute;top:0;left:50%;height:100%;width:calc(var(--jh)*.7133);margin-left:calc(var(--jh)*-.35665);transform:translate3d(calc(var(--d)*var(--step) + var(--drag,0px)),0,0);pointer-events:none}',
    '.zad__slide img{display:block;width:100%;height:100%;object-fit:contain;-webkit-user-drag:none;pointer-events:auto;cursor:pointer}',
    '.zad__slide:not(.is-active) img{opacity:.92}',
    '.zad__glow{position:absolute;left:50%;top:50%;width:calc(var(--jh)*1.1);height:calc(var(--jh)*1.1);transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.10),rgba(255,255,255,0));pointer-events:none;z-index:0}',
    '.zad__arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:48px;height:48px;display:none;place-items:center;background:transparent;border:0;color:var(--fg);cursor:pointer;opacity:.85;padding:0}',
    '.zad__arrow:hover{opacity:1}.zad__arrow--prev{left:clamp(6px,2vw,28px)}.zad__arrow--next{right:clamp(6px,2vw,28px)}.zad__arrow svg{width:26px;height:26px}',
    '.zad__info{text-align:center;padding:12px 16px 0;position:relative;z-index:3;color:var(--fg);transition:color var(--bg-dur) var(--ease)}',
    '.zad__name{margin:0;font-weight:500;font-size:15px;letter-spacing:.01em;min-height:1.4em}',
    '.zad__desc{margin:2px 0 0;font-size:12px;font-weight:400;color:var(--fg-soft)}',
    '.zad__links{display:flex;justify-content:center;gap:28px;margin-top:8px}',
    '.zad__link{display:inline-block;padding:4px 2px;color:var(--fg);font-size:12px;font-weight:600;letter-spacing:.22em;border:0;border-bottom:1px solid transparent;opacity:.45;background:none;font-family:inherit;cursor:pointer}',
    '.zad__link.is-active{opacity:1;border-bottom-color:currentColor}',
    '@media(min-width:641px){.zad{--step:60vw;--jh:50vh}.zad__heading{font-size:24px}.zad__name{font-size:18px}.zad__desc{font-size:14px}.zad__arrow{display:grid}}',
    '@media(min-width:1025px){.zad{--step:28vw;--jh:56vh;padding-top:40px}}',
    '@media(min-width:1600px){.zad{--step:24vw}}',
    '@media(prefers-reduced-motion:reduce){.zad{--bg-delay:60ms;--bg-dur:250ms}}'
  ].join('\n');

  function mount(host) {
    if (!host || host.dataset.zadReady === '1') return;
    host.dataset.zadReady = '1';
    if (!document.getElementById('zad-css')) { var st = document.createElement('style'); st.id = 'zad-css'; st.textContent = CSS; document.head.appendChild(st); }
    host.setAttribute('aria-roledescription', 'carousel'); host.setAttribute('aria-label', 'The Zebra Patch Collection');
    host.dataset.tone = 'dark';
    host.innerHTML = '<h2 class="zad__heading">The Zebra Patch Collection</h2>' +
      '<div class="zad__stage"><div class="zad__glow" aria-hidden="true"></div><div class="zad__track" aria-live="off"></div>' +
      '<button class="zad__arrow zad__arrow--prev" type="button" aria-label="Previous product"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button class="zad__arrow zad__arrow--next" type="button" aria-label="Next product"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button></div>' +
      '<div class="zad__info" aria-live="polite" aria-atomic="true"><h3 class="zad__name"></h3><p class="zad__desc">Hand-finished statement denim, made to fit you.</p>' +
      '<nav class="zad__links" aria-label="Zebra Patch fits"><button type="button" class="zad__link is-active" data-fit="skinny">SKINNY</button><button type="button" class="zad__link" data-fit="relaxed">RELAXED</button></nav></div>';
    host.hidden = false;

    var stage = host.querySelector('.zad__stage'), track = host.querySelector('.zad__track'), nameEl = host.querySelector('.zad__name');
    var prevBtn = host.querySelector('.zad__arrow--prev'), nextBtn = host.querySelector('.zad__arrow--next');
    var links = host.querySelectorAll('.zad__link');
    var FIT = 'skinny', PRODUCTS = SKINNY, N = PRODUCTS.length, active = 0, bgTimer = null, navToken = 0, drag = null, dragMoved = false;
    var mod = function (n, m) { return ((n % m) + m) % m; };
    var cssMs = function (name, fb) { var v = getComputedStyle(host).getPropertyValue(name).trim(); if (!v) return fb; return v.slice(-2) === 'ms' ? parseFloat(v) : parseFloat(v) * 1000; };
    var stepPx = function () { var v = getComputedStyle(host).getPropertyValue('--step').trim(); return v.slice(-2) === 'vw' ? window.innerWidth * parseFloat(v) / 100 : parseFloat(v); };

    var slides = PRODUCTS.map(function (p, i) {
      var el = document.createElement('div'); el.className = 'zad__slide'; el.setAttribute('role', 'group'); el.setAttribute('aria-roledescription', 'slide');
      el.setAttribute('aria-label', (i + 1) + ' of ' + N + ': ' + p.name);
      var img = new Image(); img.alt = p.name; img.decoding = 'async'; img.draggable = false; img.loading = 'lazy'; img.src = p.image;
      el.appendChild(img); track.appendChild(el); return el;
    });

    function layout(dragPx, instant) {
      dragPx = dragPx || 0;
      slides.forEach(function (el, i) {
        var d = mod(i - active + Math.floor(N / 2), N) - Math.floor(N / 2);
        el.style.setProperty('--d', d); el.style.setProperty('--drag', dragPx + 'px');
        el.classList.toggle('is-active', d === 0); el.setAttribute('aria-hidden', d === 0 ? 'false' : 'true');
        el.style.visibility = Math.abs(d) >= 3 ? 'hidden' : '';
      });
    }
    function applyBackground(i) { var p = PRODUCTS[i]; host.style.setProperty('--bg', p.bg); host.dataset.tone = p.tone; }
    function goTo(index, instant) {
      active = mod(index, N); var token = ++navToken;
      layout(0, instant); nameEl.textContent = PRODUCTS[active].name;
      if (bgTimer) { clearTimeout(bgTimer); bgTimer = null; }
      bgTimer = setTimeout(function () { bgTimer = null; if (token !== navToken) return; applyBackground(active); }, instant ? 0 : cssMs('--bg-delay', 140));
    }
    function setFit(fit) {
      if (fit === FIT) return; FIT = fit; PRODUCTS = fit === 'relaxed' ? RELAXED : SKINNY;
      slides.forEach(function (el, i) { var img = el.querySelector('img'); img.src = PRODUCTS[i].image; img.alt = PRODUCTS[i].name; el.setAttribute('aria-label', (i + 1) + ' of ' + N + ': ' + PRODUCTS[i].name); });
      nameEl.textContent = PRODUCTS[active].name; applyBackground(active);
      links.forEach(function (l) { l.classList.toggle('is-active', l.dataset.fit === fit); });
    }
    links.forEach(function (l) { l.addEventListener('click', function (e) { e.preventDefault(); setFit(l.dataset.fit); }); });
    var next = function () { goTo(active + 1); }, prev = function () { goTo(active - 1); };

    function startDrag(x0, y0) { dragMoved = false; drag = { x0: x0, y0: y0, x: x0, t0: performance.now(), axis: null }; }
    function moveDrag(x, y) {
      if (!drag) return false; var dx = x - drag.x0, dy = y - drag.y0;
      if (!drag.axis) { if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return false; drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; if (drag.axis === 'x') stage.classList.add('is-dragging'); }
      if (drag.axis !== 'x') return false;
      drag.x = x; dragMoved = true; layout(dx, true); return true;
    }
    function endDrag() {
      if (!drag) return; var dx = drag.x - drag.x0, v = dx / Math.max(1, performance.now() - drag.t0), axis = drag.axis; drag = null; stage.classList.remove('is-dragging');
      if (axis !== 'x') return; var th = Math.min(stepPx() * 0.18, 80);
      if (dx < -th || v < -0.35) next(); else if (dx > th || v > 0.35) prev(); else layout(0, false);
    }
    stage.addEventListener('touchstart', function (e) { if (e.target.closest('.zad__arrow')) return; var t = e.touches[0]; startDrag(t.clientX, t.clientY); }, { passive: true });
    stage.addEventListener('touchmove', function (e) { if (!drag) return; var t = e.touches[0]; if (moveDrag(t.clientX, t.clientY) && e.cancelable) e.preventDefault(); }, { passive: false });
    stage.addEventListener('touchend', endDrag); stage.addEventListener('touchcancel', endDrag);
    stage.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || (e.button !== undefined && e.button !== 0) || e.target.closest('.zad__arrow')) return; startDrag(e.clientX, e.clientY); });
    stage.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && drag) moveDrag(e.clientX, e.clientY); });
    stage.addEventListener('pointerup', function (e) { if (e.pointerType === 'mouse') endDrag(); });
    stage.addEventListener('pointercancel', function (e) { if (e.pointerType === 'mouse') endDrag(); });
    // a tap (not a drag) on the jeans opens that fit's product page (same fit for every colour)
    stage.addEventListener('click', function (e) {
      if (dragMoved) { dragMoved = false; e.preventDefault(); e.stopPropagation(); return; }
      if (e.target.closest('.zad__arrow') || !e.target.closest('.zad__slide')) return;
      var dest = 'bymarccc-product.html?p=' + FIT;
      if (window.BYM_NAV && window.BYM_NAV.navigate) window.BYM_NAV.navigate(dest); else window.location.href = dest;
    });
    nextBtn.addEventListener('click', next); prevBtn.addEventListener('click', prev);
    window.addEventListener('resize', function () { if (host.isConnected) layout(0, true); });
    applyBackground(0); goTo(0, true);
  }
  window.BYM_ZEBRA_AD = { mount: mount };
})();
