/* ============================================================
   ABDULLO.USTA — Main JS
   Spring-physics feel, IntersectionObserver, no custom cursor
   ============================================================ */
(function () {
  'use strict';

  /* --- Viewport Height (iOS Safari) --- */
  function setVh() {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);

  /* --- Preloader --- */
  var preloader = document.querySelector('.preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('is-done');
      document.body.style.overflow = '';
      initScrollReveal();
    }, 2000);
  });
  document.body.style.overflow = 'hidden';

  /* --- Dark / Light Mode --- */
  var modeToggle = document.querySelector('.mode-toggle');
  var html = document.documentElement;
  var isDark = true;

  var saved = localStorage.getItem('abdullo-theme');
  if (saved === 'light') {
    isDark = false;
    html.classList.remove('dark');
    html.classList.add('light');
  } else {
    html.classList.add('dark');
  }

  if (modeToggle) {
    modeToggle.addEventListener('click', function () {
      isDark = !isDark;
      if (isDark) {
        html.classList.remove('light');
        html.classList.add('dark');
        localStorage.setItem('abdullo-theme', 'dark');
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
        localStorage.setItem('abdullo-theme', 'light');
      }
    });
  }

  /* --- Mobile Menu --- */
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- HUD: hide on scroll down, show on scroll up --- */
  var hud = document.querySelector('.hud');
  var lastScroll = 0;
  if (hud) {
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset;
      if (y > lastScroll && y > 120) {
        hud.classList.add('is-hidden');
      } else {
        hud.classList.remove('is-hidden');
      }
      lastScroll = y;
    }, { passive: true });
  }

  /* --- Scroll Reveal (IntersectionObserver) --- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* --- Counter Animation --- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1400;
          var startTime = null;

          function step(ts) {
            if (!startTime) startTime = ts;
            var p = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }
  initCounters();

  /* --- Before / After Slider --- */
  var baSlider = document.querySelector('.ba-slider-wrap');
  if (baSlider) {
    var baBefore = baSlider.querySelector('.ba-layer-before');
    var baHandle = baSlider.querySelector('.ba-handle');
    var dragging = false;

    function updateBA(x) {
      var rect = baSlider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      var pct = pos * 100;
      baBefore.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      baHandle.style.left = pct + '%';
    }

    baSlider.addEventListener('mousedown', function (e) { dragging = true; updateBA(e.clientX); });
    document.addEventListener('mousemove', function (e) { if (dragging) updateBA(e.clientX); });
    document.addEventListener('mouseup', function () { dragging = false; });

    baSlider.addEventListener('touchstart', function (e) {
      dragging = true;
      updateBA(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (dragging) updateBA(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function () { dragging = false; });
  }

  /* --- Contact Form --- */
  var form = document.getElementById('orderForm');
  var formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      formSuccess.classList.add('is-visible');
    });
  }

})();
