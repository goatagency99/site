/* LOOKBOOK runway (phone view): every look as a full-body model on a transparent background, side by side.
   The middle model is sharp, the neighbours are smaller and blurred; swipe left / right with the finger.
   Tap the middle model -> that look's product page (buy the whole outfit). Tap a neighbour -> it slides to the middle.
   Under the models: the look's name and its pieces (each one opens its own product page).
   Cut-out photos: assets/img/lookbook-cut/<look key>.webp (all the same height, feet at the bottom edge).
   index.html has <section class="lbr lbr--home" id="runway" data-gender="women" data-switch="1"> as section 2 (after the music); fill() builds it.
   data-switch adds WOMEN / MEN buttons under the title. Phone only for now (desktop shows nothing until its own design). */
(function () {
  'use strict';
  if (window.BYM_RUNWAY) return;

  // look key -> width / height of its cut-out (a look shows up here only once its cut-out exists)
  var CUT = {"look-2-tech-set":0.3308,"look-w14-art-set":0.2683,"look-w15-crochet-set":0.2692,"look-w16-satin-set":0.3033,"look-w13-black-wind-set":0.3375,"look-w12-hot-pink-zip-set":0.3292,"look-7-hot-pink-zip-set":0.3317,"look-w11-red-zip-set":0.3267,"look-6-red-zip-set":0.3467,"look-w3-delulu-blazer-set":0.2817,"look-w7-muse-blazer-set":0.285,"look-w8-lace-set":0.2633,"look-w5-black-charm-set":0.2733,"look-w6-black-zip-set":0.3217,"look-w7-grey-zip-set":0.3325,"look-w4-burgundy-charm-set":0.2658,"look-w3-sporty-set":0.4325,"look-3-pink-zip-set":0.3525,"look-4-black-zip-set":0.3533,"look-5-grey-zip-set":0.3525,"look-2-blue-zip-set":0.3342,"look-w2-blue-zip-set":0.3392,"look-1-tech-set":0.3492,"look-w1-logo-set":0.3433,"look-w1-burgundy-baby-wind-set":0.2758};
  var DIR = 'assets/img/lookbook-cut/';
  var PHONE = '(max-width: 899px)';

  var CSS = [
    '.lbr{grid-column:1/-1;position:relative;width:100vw;margin:0 0 6px calc(50% - 50vw);padding:2px 0 18px;background:linear-gradient(180deg,#f3f3f2 0%,#f6f6f5 62%,#fff 100%);color:#111;overflow:hidden;font-family:"Jost","Helvetica Neue",Helvetica,Arial,sans-serif;user-select:none;-webkit-user-select:none}',
    '.lbr:empty,.lbr[hidden]{display:none}',
    '.lbr--home{display:flow-root;margin:0;width:100%;overflow:visible;padding-top:0}',
    '.lbr--home .lbr__stage{overflow:hidden}',
    '.lbr--home::before{content:"";position:absolute;left:0;right:0;top:-86px;height:86px;background:linear-gradient(180deg,rgba(243,243,242,0) 0%,rgba(243,243,242,.55) 62%,#f3f3f2 100%);pointer-events:none;z-index:1}',   /* soft fade from the colourful section 1 into the grey of section 2 */
    '.lbr--home .lbr__head{padding-top:0}',
    '.lbr--home .lbr__g{position:relative;z-index:5;justify-content:center;gap:34px;margin:-27px 0 0}',
    '.lbr--home .lbr__g button{font-size:15px;letter-spacing:.24em;padding:0 2px 13px;border-bottom-width:1.5px;color:rgba(17,17,17,.42)}',
    '.lbr--home .lbr__g button[aria-pressed="true"]{color:#111}',
    '.lbr__g{display:flex;gap:22px;margin-top:12px}',
    '.lbr__g button{padding:3px 0;border:0;border-bottom:1px solid transparent;background:none;font:inherit;font-size:11px;letter-spacing:.2em;color:#9a9a96;cursor:pointer}',
    '.lbr__g button[aria-pressed="true"]{color:#111;border-bottom-color:#111}',
    '@media(min-width:900px){.lbr{display:none}}',
    '.lbr__head{padding:18px 18px 0}',
    '.lbr__title{margin:0;font-size:27px;font-weight:400;letter-spacing:-.01em;line-height:1.1}',
    '.lbr__sub{margin:6px 0 0;font-size:12px;color:#6f6f6f;letter-spacing:.01em}',
    '.lbr__stage{position:relative;height:min(60svh,540px);margin-top:8px;touch-action:pan-y}',
    '.lbr__m{position:absolute;left:50%;bottom:58px;height:calc(100% - 70px);transform-origin:50% 62%;will-change:transform,filter;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.lbr__m img{display:block;height:100%;width:auto;-webkit-user-drag:none;pointer-events:none;-webkit-box-reflect:below 1px linear-gradient(transparent 88%,rgba(255,255,255,.16))}',
    '.lbr__floor{position:absolute;left:0;right:0;bottom:0;height:104px;background:linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(0,0,0,.025) 30%,rgba(255,255,255,.35) 100%);pointer-events:none}',
    '.lbr__bar{position:relative;width:110px;height:2px;margin:6px auto 0;background:rgba(0,0,0,.12);border-radius:2px;overflow:hidden}',
    '.lbr__fill{position:absolute;top:0;bottom:0;left:0;background:#111;border-radius:2px;transition:transform .35s cubic-bezier(.22,1,.36,1)}',
    '.lbr__info{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:22px 18px 10px}',
    '.lbr__name{margin:0;font-size:18px;font-weight:400;letter-spacing:.005em}',
    '.lbr__name small{display:block;font-size:10px;letter-spacing:.2em;color:#6f6f6f;margin-bottom:3px}',
    '.lbr__count{font-size:10px;letter-spacing:.18em;color:#555;white-space:nowrap}',
    '.lbr__items{display:flex;gap:10px;overflow-x:auto;padding:0 18px 4px;scroll-padding:0 18px;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain}',
    '.lbr__items::-webkit-scrollbar{display:none}',
    '.lbr__it{flex:0 0 auto;display:flex;align-items:center;gap:12px;width:auto;max-width:68vw;padding:10px 16px 10px 10px;border-radius:14px;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.04),0 6px 22px rgba(0,0,0,.05);color:#111;text-decoration:none;scroll-snap-align:start}',
    '.lbr__it img{flex:0 0 auto;width:56px;height:72px;object-fit:cover;border-radius:8px;background:#f0f0f0}',
    '.lbr__it span{flex:0 1 auto;min-width:0;font-size:13px;line-height:1.35}',
    '.lbr__it b{display:block;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.lbr__it i{font-style:normal;color:#555}',
    '.lbr__it em{flex:0 0 auto;margin-left:10px;font-style:normal;font-size:22px;font-weight:300;line-height:1;color:#111}',
    '.lbr__mo{display:inline-block;margin-left:8px;padding:2px 7px;border:1px solid #111;border-radius:999px;font-size:9px;letter-spacing:.16em;vertical-align:middle}'
  ].join('\n');

  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return typeof window.BYM_FMT === 'function' ? window.BYM_FMT(n) : n + ' RON'; };
  var go = function (url) { if (window.BYM_NAV && window.BYM_NAV.navigate) window.BYM_NAV.navigate(url); else location.href = url; };
  var titleCase = function (s) { return String(s || '').toLowerCase().replace(/(^|[\s&-])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }); };

  function looksFor(gender) {
    var C = (window.BYMARCCC_CATALOG || {}).CATALOG || {};
    return Object.keys(C).filter(function (k) {
      var p = C[k]; if (!p || !CUT[k] || p.hidden || !(p.collections || []).includes('looks')) return false;
      return (p.genders || [p.gender || 'men']).indexOf(gender) !== -1;
    }).sort(function (a, b) { return (C[a].lookNo || 99) - (C[b].lookNo || 99); }).map(function (k) { return { key: k, p: C[k] }; });
  }

  function fill(host) {
    if (!host || host.dataset.lbrReady === '1') return;
    if (!matchMedia(PHONE).matches) return;
    if (host._lbrAbort) host._lbrAbort.abort();
    var ab = host._lbrAbort = new AbortController(), sig = { signal: ab.signal };
    var gender = host.dataset.gender === 'men' ? 'men' : 'women';
    var L = looksFor(gender); if (L.length < 2) { host.hidden = true; return; }
    host.dataset.lbrReady = '1';
    if (!document.getElementById('lbr-css')) { var st = document.createElement('style'); st.id = 'lbr-css'; st.textContent = CSS; document.head.appendChild(st); }
    var C = window.BYMARCCC_CATALOG.CATALOG, N = L.length;
    host.innerHTML = '<div class="lbr__head">' + (host.dataset.switch ? '' : '<h3 class="lbr__title">' + (gender === 'men' ? 'Men' : 'Women') + ' Lookbook</h3><p class="lbr__sub">' + N + ' looks, styled head to toe. Tap the look to shop it.</p>') +
      (host.dataset.switch ? '<nav class="lbr__g" aria-label="Lookbook"><button type="button" data-g="women" aria-pressed="' + (gender === 'women') + '">WOMEN</button><button type="button" data-g="men" aria-pressed="' + (gender === 'men') + '">MEN</button></nav>' : '') + '</div>' +
      '<div class="lbr__stage" aria-roledescription="carousel" aria-label="Lookbook"><div class="lbr__floor"></div></div>' +
      '<div class="lbr__bar"><div class="lbr__fill"></div></div>' +
      '<div class="lbr__info"><h4 class="lbr__name"></h4><span class="lbr__count"></span></div><div class="lbr__items"></div>';
    var stage = host.querySelector('.lbr__stage'), fillEl = host.querySelector('.lbr__fill'), nameEl = host.querySelector('.lbr__name'),
      countEl = host.querySelector('.lbr__count'), itemsEl = host.querySelector('.lbr__items');
    fillEl.style.width = (100 / N) + '%';
    host.querySelectorAll('.lbr__g button').forEach(function (bt) { bt.addEventListener('click', function () { if (bt.dataset.g === gender) return; if (raf) cancelAnimationFrame(raf); host.dataset.gender = bt.dataset.g; host.dataset.lbrReady = ''; fill(host); }); });

    var els = L.map(function (x, i) {
      var b = document.createElement('div'); b.className = 'lbr__m'; b.setAttribute('role', 'button'); b.tabIndex = 0;
      b.setAttribute('aria-label', x.p.title);
      var im = new Image(); im.alt = ''; im.decoding = 'async'; im.draggable = false; if (i > 3) im.loading = 'lazy'; im.src = DIR + x.key + '.webp';
      b.appendChild(im); stage.appendChild(b);
      b.addEventListener('click', function () { if (moved) return; if (i === idxOf(pos)) go('bymarccc-product.html?p=' + x.key); else snapTo(Math.round(pos) + wrapD(i - pos)); });
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter') go('bymarccc-product.html?p=' + x.key); });
      return b;
    });

    var pos = 0, target = 0, raf = 0, shown = -1, moved = false;
    function stepPx() { return Math.min(window.innerWidth * 0.34, 180); }
    var wrapD = function (d) { d = ((d % N) + N) % N; return d > N / 2 ? d - N : d; };   // endless: left of LOOK 1 sits the last look
    var idxOf = function (p) { return ((Math.round(p) % N) + N) % N; };
    function paint() {
      var step = stepPx(), h = stage.clientHeight - 70;
      els.forEach(function (b, i) {
        var d = wrapD(i - pos), ad = Math.abs(d);
        if (ad > 2.6) { b.style.visibility = 'hidden'; return; }
        b.style.visibility = '';
        var k = Math.min(1, ad), sc = 1 - 0.14 * k - 0.07 * Math.max(0, ad - 1);   // neighbours only a little smaller, and lifted (scaled around the hips, not the feet)
        var w = h * CUT[L[i].key];
        var x = Math.sign(d) * (k * step + Math.max(0, ad - 1) * step * 0.58);
        b.style.transform = 'translate3d(' + (x - w / 2) + 'px,0,0) scale(' + sc + ')';
        b.style.filter = k > 0.02 ? 'blur(' + (k * 2.8 + Math.max(0, ad - 1) * 1.4).toFixed(2) + 'px)' : 'none';
        b.style.opacity = String(1 - 0.12 * k - 0.2 * Math.max(0, ad - 1));
        b.style.zIndex = String(100 - Math.round(ad * 10));
      });
      var cur = idxOf(pos);
      fillEl.style.transform = 'translateX(' + (cur * 100) + '%)';
      if (cur !== shown) { shown = cur; info(cur); }
    }
    function info(i) {
      var x = L[i], p = x.p, m = /^LOOK\s*(\d+)\s*[—-]\s*(.+)$/i.exec(String(p.title || ''));
      nameEl.innerHTML = '<small>' + (m ? 'LOOK ' + m[1] : 'LOOK') + (p.membersOnly ? '<span class="lbr__mo">MEMBERS ONLY</span>' : '') + '</small>' + esc(titleCase(m ? m[2] : p.title));
      var items = (p.lookItems || []).map(function (k) { return [k, C[k]]; }).filter(function (e) { return e[1] && e[1].gallery && e[1].gallery.length; });
      countEl.textContent = items.length ? items.length + (items.length === 1 ? ' PIECE' : ' PIECES') : '';
      itemsEl.innerHTML = items.map(function (e) {
        var q = e[1], g = q.gallery[0], src = g.src || g, price = typeof q.salePrice === 'number' ? q.salePrice : q.price;
        return '<a class="lbr__it" href="bymarccc-product.html?p=' + encodeURIComponent(e[0]) + '"><img src="' + esc(src) + '" alt="" loading="lazy" decoding="async">' +
          '<span><b>' + esc(q.title) + '</b><i>' + (typeof price === 'number' ? esc(money(price)) : '') + '</i></span><em aria-hidden="true">+</em></a>';
      }).join('');
      itemsEl.scrollLeft = 0;
    }
    itemsEl.addEventListener('click', function (e) { var a = e.target.closest('a.lbr__it'); if (!a) return; e.preventDefault(); go(a.getAttribute('href')); });

    function animate() {
      raf = 0; var d = target - pos;
      if (Math.abs(d) < 0.001) { pos = target; paint(); return; }
      pos += d * 0.18; paint(); raf = requestAnimationFrame(animate);
    }
    function snapTo(i) { target = Math.round(i); if (!raf) raf = requestAnimationFrame(animate); }

    // finger / mouse drag
    var drag = null;
    function start(x, y) { if (raf) { cancelAnimationFrame(raf); raf = 0; } moved = false; drag = { x0: x, y0: y, p0: pos, axis: null, t: performance.now(), lx: x, v: 0 }; }
    function move(x, y) {
      if (!drag) return false; var dx = x - drag.x0, dy = y - drag.y0;
      if (!drag.axis) { if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return false; drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; }
      if (drag.axis !== 'x') return false;
      moved = true; var now = performance.now(); drag.v = (x - drag.lx) / Math.max(1, now - drag.t); drag.t = now; drag.lx = x;
      pos = drag.p0 - dx / stepPx(); paint(); return true;
    }
    function end() {
      if (!drag) return; var axis = drag.axis, v = drag.v, p0 = drag.p0; drag = null; if (axis !== 'x') return;
      var t = Math.round(pos);   // a quick flick moves one look even when the finger travelled less than half a step
      if (t === Math.round(p0) && Math.abs(v) > 0.35) t = Math.round(p0) + (v < 0 ? 1 : -1);
      snapTo(t);
      setTimeout(function () { moved = false; }, 60);
    }
    stage.addEventListener('touchstart', function (e) { var t = e.touches[0]; start(t.clientX, t.clientY); }, { passive: true });
    stage.addEventListener('touchmove', function (e) { var t = e.touches[0]; if (move(t.clientX, t.clientY) && e.cancelable) e.preventDefault(); }, { passive: false });
    stage.addEventListener('touchend', end); stage.addEventListener('touchcancel', end);
    stage.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') start(e.clientX, e.clientY); });
    window.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && drag) move(e.clientX, e.clientY); }, sig);
    window.addEventListener('pointerup', function (e) { if (e.pointerType === 'mouse') end(); }, sig);
    window.addEventListener('resize', function () { if (host.isConnected) paint(); }, sig);
    paint();
  }

  function fillAll() { document.querySelectorAll('.lbr:not([data-lbr-ready="1"])').forEach(fill); }
  window.BYM_RUNWAY = { fill: fill, fillAll: fillAll };
  fillAll();
})();
