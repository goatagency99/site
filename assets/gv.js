/* GOATIFY visitors — anonymous page-view beacon for the "Live visitors", Reports and Live View globe in the GOATIFY app.
   No cookies, no personal data: a random id kept in this browser, the page path, a readable page name
   ("Women · Tops · Hoodies", "Product · Zebra Patch Jeans") and how long it was on screen. City comes from Cloudflare, not from here. */
(function () {
  try {
    if (navigator.webdriver || !/(^|\.)bymarccc\.com$/.test(location.hostname)) return;
    var API = 'https://goatify.goatagency.us/api/v1/collect/bymarccc', K = 'bym.vid', v = null;
    try { v = localStorage.getItem(K); } catch (e) {}
    if (!v || !/^[A-Za-z0-9_-]{16,64}$/.test(v)) {
      var a = new Uint8Array(16); crypto.getRandomValues(a);
      v = Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
      try { localStorage.setItem(K, v); } catch (e) {}
    }
    var utm = ''; try { utm = new URLSearchParams(location.search).get('utm_source') || ''; } catch (e) {}
    var cap = function (s) { s = String(s || '').replace(/\s+/g, ' ').trim().toLowerCase(); return s.replace(/(^|[\s\-·/])([a-zà-ž])/g, function (m, x, y) { return x + y.toUpperCase(); }); };
    var SECTIONS = [['zebra', 'Zebra Patch'], ['shopWomen', 'Women'], ['shop', 'Men'], ['shopCustomize', 'Customize'], ['reel', 'Community'], ['play', 'Playground']];
    var label = function () {
      var p = location.pathname;
      if (/bymarccc-product/.test(p)) { var h = document.getElementById('pTitle') || document.querySelector('h1'); var tt = (h && h.textContent.trim()) || document.title.split(/[—|]/)[0].trim(); return 'Product · ' + cap(tt); }
      if (/checkout/.test(p)) return 'Checkout';
      if (/\/order(\.html)?$/.test(p)) return 'Order confirmation';
      if (/members/.test(p)) return 'Account';
      if (/pay-in-2/.test(p)) return 'Pay in 2 terms';
      if (/journal/.test(p)) return 'Journal · ' + document.title.split(/[—|]/)[0].trim();
      var fp = document.getElementById('fp'); if (fp && !fp.hidden) return 'Music player';
      var mid = innerHeight / 2;
      for (var i = 0; i < SECTIONS.length; i++) {
        var el = document.getElementById(SECTIONS[i][0]); if (!el || el.hidden || !el.offsetParent) continue;
        var r = el.getBoundingClientRect(); if (r.top > mid || r.bottom < mid) continue;
        var tab = el.querySelector('.shop__tab[aria-selected="true"]'), sub = el.querySelector('.shop__sub.is-on');
        var out = SECTIONS[i][1]; if (tab) out += ' · ' + cap(tab.textContent); if (sub && !/^all$/i.test(sub.textContent.trim())) out += ' · ' + cap(sub.textContent);
        return out;
      }
      return 'Home';
    };
    var last = Date.now(), cur = '';
    var send = function (ev, forLabel) {
      var now = Date.now(), d = Math.min(60, Math.round((now - last) / 1000)); last = now;
      var t = forLabel || ''; if (!t) { try { t = label(); } catch (e) {} }
      var body = JSON.stringify({ v: v, e: ev, p: location.pathname, t: t.slice(0, 80), d: ev === 'pv' ? 0 : d, r: ev === 'pv' ? document.referrer : '', u: ev === 'pv' ? utm : '' });
      cur = t;
      try { if (navigator.sendBeacon && navigator.sendBeacon(API, new Blob([body], { type: 'text/plain' }))) return; } catch (e) {}
      try { fetch(API, { method: 'POST', body: body, headers: { 'content-type': 'text/plain' }, keepalive: true, credentials: 'omit' }).catch(function () {}); } catch (e) {}
    };
    send('pv');
    // every 15 s on screen: time spent on the current page/section; a new section (scrolled from Men to Women, picked TOPS) counts as a new view
    setInterval(function () {
      if (document.visibilityState !== 'visible') { last = Date.now(); return; }
      var t = ''; try { t = label(); } catch (e) {}
      if (t && t !== cur) { send('hb', cur); send('pv', t); } else if (Date.now() - last >= 15000) send('hb', cur);
    }, 5000);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { last = Date.now(); send('hb', cur); } else send('hb', cur); });
  } catch (e) {}
})();
