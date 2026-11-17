/*
 * Single source of truth for the site's live demo links and contact channels.
 *
 * When a demo moves to another address or a WhatsApp number changes, edit ONLY
 * the SITE_CONFIG object below: every page builds its links from it.
 *
 * Markup contract:
 *   <a data-demo="TALENTO" data-demo-action="try">   -> <base>/vitrina/TALENTO?utm_...#probar
 *   <a data-demo="TALENTO" data-demo-action="lead">  -> <base>/vitrina/TALENTO?lead=1&utm_...
 *   <a data-demo="TALENTO" data-demo-action="page">  -> <base>/vitrina/TALENTO?utm_...
 *   <span data-demo-minutes></span>                  -> demo session length in minutes
 *   <div data-whatsapp-list></div>                   -> visible WhatsApp numbers with their buttons
 *   [data-sticky-demo]                               -> a bottom sticky bar; the floating WhatsApp
 *                                                       button is lifted above it
 * utm_campaign comes from <body data-page="..."> (falls back to the file name).
 * Without JavaScript the demo links keep their own href (the contact section).
 * Every page also gets a floating WhatsApp button (bottom right).
 */
(function () {
  var SITE_CONFIG = {
    demos: {
      BANCA: 'https://appy4comexback.yacaretech.com',
      TRIBUTARIA: 'https://appdemoetax.yacaretech.com',
      MUNICIPIOS: 'https://appdemoetax.yacaretech.com',
      TALENTO: 'https://appdemotalento.yacaretech.com',
      COMPRAS: 'https://appdemocompras.yacaretech.com'
    },
    // Length of a demo session, as the demos announce it.
    demoMinutes: 60,
    whatsapp: {
      numbers: [
        { display: '+593 99 993 2376', wa: '593999932376' },
        { display: '+593 97 860 8200', wa: '593978608200' }
      ],
      text: 'Hola, quiero conocer las plataformas de Yacaretech'
    }
  };

  function campaign() {
    var page = document.body && document.body.getAttribute('data-page');
    if (page) return page;
    var file = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '');
    return file || 'index';
  }

  function demoUrl(code, action) {
    var base = SITE_CONFIG.demos[code];
    if (!base) return null;
    var params = [];
    if (action === 'lead') params.push('lead=1');
    params.push('utm_source=sitio', 'utm_medium=web', 'utm_campaign=' + encodeURIComponent(campaign()));
    var url = base.replace(/\/+$/, '') + '/vitrina/' + encodeURIComponent(code) + '?' + params.join('&');
    if (action === 'try') url += '#probar';
    return url;
  }

  function whatsappUrl(n) {
    return 'https://wa.me/' + n.wa + '?text=' + encodeURIComponent(SITE_CONFIG.whatsapp.text);
  }

  var WA_SVG = '<svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 9.9 9.9 5.2 16 5.2s11 4.8 11 10.6-4.9 10.6-11 10.6zm6-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>';

  function injectStyles() {
    if (document.getElementById('yt-wa-style')) return;
    var css =
      '.yt-wa{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px) + var(--yt-wa-lift,0px));z-index:90;display:flex;flex-direction:column;align-items:flex-end;gap:10px;font-family:inherit}' +
      '.yt-wa-btn{width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:#1f9d55;color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:transform .15s}' +
      '.yt-wa-btn:hover{transform:scale(1.06)}' +
      '.yt-wa-btn svg{width:28px;height:28px}' +
      '.yt-wa-menu{background:#fff;color:#1d1d1f;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:14px;min-width:220px;max-width:calc(100vw - 32px)}' +
      '.yt-wa-menu p{font-size:.85rem;font-weight:600;margin:0 0 10px}' +
      '.yt-wa-menu a{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:#1d1d1f;text-decoration:none;font-size:.92rem;font-weight:600}' +
      '.yt-wa-menu a:hover{background:#f0f7f2}' +
      '.yt-wa-menu a svg{color:#1f9d55;flex:0 0 auto}' +
      '.yt-wa-list{display:flex;flex-wrap:wrap;gap:10px}' +
      '.yt-wa-list a{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:980px;background:#1f9d55;color:#fff;text-decoration:none;font-size:.92rem;font-weight:600}' +
      '.yt-wa-list a:hover{background:#198a49}' +
      '.yt-wa-list a span,.yt-wa-menu a span{color:inherit!important;font-size:inherit}';
    var s = document.createElement('style');
    s.id = 'yt-wa-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function numberLink(n) {
    var a = document.createElement('a');
    a.href = whatsappUrl(n);
    a.target = '_blank';
    a.rel = 'noopener';
    a.setAttribute('data-whatsapp', n.wa);
    a.innerHTML = WA_SVG + '<span></span>';
    a.lastChild.textContent = n.display;
    return a;
  }

  function wireWhatsApp() {
    var numbers = SITE_CONFIG.whatsapp.numbers;
    if (!numbers.length) return;
    injectStyles();

    var lists = document.querySelectorAll('[data-whatsapp-list]');
    for (var i = 0; i < lists.length; i++) {
      lists[i].classList.add('yt-wa-list');
      lists[i].innerHTML = '';
      for (var k = 0; k < numbers.length; k++) lists[i].appendChild(numberLink(numbers[k]));
    }

    if (document.querySelector('.yt-wa')) return;
    var wrap = document.createElement('div');
    wrap.className = 'yt-wa';
    var menu = document.createElement('div');
    menu.className = 'yt-wa-menu';
    menu.hidden = true;
    menu.id = 'yt-wa-menu';
    menu.innerHTML = '<p>Escr&iacute;banos por WhatsApp</p>';
    for (var j = 0; j < numbers.length; j++) menu.appendChild(numberLink(numbers[j]));
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yt-wa-btn';
    btn.setAttribute('aria-label', 'Escríbanos por WhatsApp');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'yt-wa-menu');
    btn.innerHTML = WA_SVG;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      btn.setAttribute('aria-expanded', String(!menu.hidden));
    });
    document.addEventListener('click', function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
    wrap.appendChild(menu);
    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    // Keep the floating button above a sticky bottom demo bar, if the page has one.
    var sticky = document.querySelector('[data-sticky-demo]');
    if (sticky) {
      var lift = function () {
        var visible = getComputedStyle(sticky).display !== 'none';
        wrap.style.setProperty('--yt-wa-lift', visible ? sticky.offsetHeight + 'px' : '0px');
      };
      lift();
      window.addEventListener('resize', lift);
    }
  }

  function wire() {
    var links = document.querySelectorAll('a[data-demo]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var url = demoUrl(a.getAttribute('data-demo'), a.getAttribute('data-demo-action') || 'try');
      if (!url) continue;
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    }
    var minutes = document.querySelectorAll('[data-demo-minutes]');
    for (var j = 0; j < minutes.length; j++) minutes[j].textContent = String(SITE_CONFIG.demoMinutes);
    wireWhatsApp();
  }

  window.YacareSite = { config: SITE_CONFIG, demoUrl: demoUrl, whatsappUrl: whatsappUrl, wire: wire };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
