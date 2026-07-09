/* =====================================================================
   Ahmed Hindy — Portfolio interactions
   Vanilla JS, no libraries. Respects prefers-reduced-motion.
   ===================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initYear();
    initNav();
    initHeaderScroll();
    initScrollProgress();
    initReveals();
    initCountUps();
    initFilter();
    initLightbox();
    initFacades();
    initHeroCanvas();
  });

  /* ---------- Current year ---------- */
  function initYear() {
    var y = new Date().getFullYear();
    document.querySelectorAll('[data-current-year]').forEach(function (el) {
      el.textContent = y;
    });
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    var body = document.body;
    if (!toggle || !nav) return;

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      body.classList.add('nav-open');
    }
    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      body.classList.remove('nav-open');
    }
    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? close() : open();
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---------- Header scrolled state ---------- */
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll progress bar ---------- */
  function initScrollProgress() {
    var bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    var update = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      bar.style.transform = 'scaleX(' + p + ')';
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- Scroll reveals ---------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    // Stagger siblings that share a group via data-reveal-group
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function (el) { io.observe(el); });

    // Auto-stagger children inside [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var kids = group.querySelectorAll('.reveal');
      kids.forEach(function (kid, i) {
        kid.style.setProperty('--reveal-delay', (i * 90) + 'ms');
      });
    });
  }

  /* ---------- Count-up numbers ---------- */
  function initCountUps() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    function format(el, value) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var str = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
      // thousands separators
      var parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      el.textContent = prefix + parts.join('.') + suffix;
    }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (reduceMotion) { format(el, target); return; }
      var dur = 1500;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        format(el, target * eased);
        if (t < 1) requestAnimationFrame(step);
        else format(el, target);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      nums.forEach(function (el) { run(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Filterable project grid ---------- */
  function initFilter() {
    var bar = document.querySelector('[data-filter-bar]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!bar || !grid) return;
    var items = Array.prototype.slice.call(grid.querySelectorAll('[data-tags]'));

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      bar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');

      items.forEach(function (item) {
        var match = f === 'all' || (' ' + item.getAttribute('data-tags') + ' ').indexOf(' ' + f + ' ') > -1;
        if (reduceMotion) {
          item.classList.toggle('is-hidden', !match);
          return;
        }
        item.classList.add('is-filtering');
        setTimeout(function () {
          item.classList.toggle('is-hidden', !match);
          requestAnimationFrame(function () { item.classList.remove('is-filtering'); });
        }, 220);
      });
    });
  }

  /* ---------- Lightbox (shared) ---------- */
  function initLightbox() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    if (!triggers.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close (Esc)"><i class="fas fa-times" aria-hidden="true"></i></button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous"><i class="fas fa-chevron-left" aria-hidden="true"></i></button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next"><i class="fas fa-chevron-right" aria-hidden="true"></i></button>' +
      '<img class="lightbox__img" alt="" />' +
      '<div class="lightbox__caption"></div>';
    document.body.appendChild(box);

    var imgEl = box.querySelector('.lightbox__img');
    var capEl = box.querySelector('.lightbox__caption');
    var current = 0;
    var lastFocus = null;

    function srcOf(t) { return t.getAttribute('data-lightbox') || (t.querySelector('img') && t.querySelector('img').src); }
    function capOf(t) { return t.getAttribute('data-caption') || (t.querySelector('img') && t.querySelector('img').alt) || ''; }

    function show(i) {
      current = (i + triggers.length) % triggers.length;
      var t = triggers[current];
      imgEl.src = srcOf(t);
      imgEl.alt = capOf(t);
      capEl.textContent = capOf(t);
    }
    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.lightbox__close').focus();
    }
    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    triggers.forEach(function (t, i) {
      t.classList.add('zoomable');
      t.setAttribute('tabindex', '0');
      t.setAttribute('role', 'button');
      t.addEventListener('click', function () { open(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  }

  /* ---------- Click-to-load embed facades (Tableau) ---------- */
  function initFacades() {
    document.querySelectorAll('[data-embed]').forEach(function (facade) {
      function load() {
        var url = facade.getAttribute('data-embed');
        var wrap = document.createElement('div');
        wrap.className = 'embed-live';
        var iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');
        iframe.title = facade.getAttribute('data-embed-title') || 'Interactive dashboard';
        wrap.appendChild(iframe);
        facade.replaceWith(wrap);
      }
      facade.setAttribute('tabindex', '0');
      facade.setAttribute('role', 'button');
      facade.addEventListener('click', load);
      facade.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); }
      });
    });
  }

  /* ---------- Hero canvas particle network ---------- */
  function initHeroCanvas() {
    var container = document.getElementById('hero-canvas');
    if (!container || reduceMotion || window.innerWidth < 900) return;

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, particles = [], running = false, rafId = null;
    var COUNT = 46, LINK = 130;
    var mouse = { x: -999, y: -999 };

    function resize() {
      W = container.clientWidth;
      H = container.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // mouse attraction (gentle)
        var mdx = mouse.x - p.x, mdy = mouse.y - p.y;
        var md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 140 && md > 0.1) {
          p.x += (mdx / md) * 0.4;
          p.y += (mdy / md) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(46, 230, 200, 0.85)';
        ctx.fill();

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(176, 127, 245,' + (0.16 * (1 - d / LINK)) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(frame);
    }

    function start() { if (!running) { running = true; rafId = requestAnimationFrame(frame); } }
    function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

    resize();
    seed();
    start();

    container.addEventListener('mousemove', function (e) {
      var r = container.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    container.addEventListener('mouseleave', function () { mouse.x = mouse.y = -999; });

    window.addEventListener('resize', function () { resize(); seed(); });
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
      }, { threshold: 0.01 }).observe(container);
    }
  }
})();
