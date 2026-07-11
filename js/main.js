/* ===== Abdullo Usta - Main JS ===== */
(function () {
  'use strict';

  /* --- Vh unit --- */
  function setVh() {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);

  /* --- Preloader --- */
  const preloader = document.querySelector('.preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('is-done');
      document.body.style.overflow = '';
      initScrollReveal();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  /* --- Custom Cursor --- */
  const cursorWrap = document.querySelector('.cursor-wrap');
  const cursorDot = document.querySelector('.cursor-dot');
  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;

  if (cursorDot && window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .portfolio-card, .service-card, .mode-toggle, .hamburger').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorDot.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { cursorDot.classList.remove('is-hover'); });
    });
  }

  /* --- Dark / Light Mode --- */
  const modeToggle = document.querySelector('.mode-toggle');
  const html = document.documentElement;
  let isDark = true;

  // Load saved preference
  const savedMode = localStorage.getItem('abdullo-theme');
  if (savedMode === 'light') {
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
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Before / After Slider --- */
  const baSlider = document.querySelector('.ba-slider-wrap');
  if (baSlider) {
    const baBefore = baSlider.querySelector('.ba-layer-before');
    const baHandle = baSlider.querySelector('.ba-handle');
    let isDragging = false;

    function updateSlider(x) {
      var rect = baSlider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0.05, Math.min(0.95, pos));
      var pct = pos * 100;
      baBefore.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      baHandle.style.left = pct + '%';
    }

    baSlider.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateSlider(e.clientX);
    });
    document.addEventListener('mousemove', function (e) {
      if (isDragging) updateSlider(e.clientX);
    });
    document.addEventListener('mouseup', function () { isDragging = false; });

    baSlider.addEventListener('touchstart', function (e) {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', function (e) {
      if (isDragging) updateSlider(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', function () { isDragging = false; });
  }

  /* --- Scroll Reveal --- */
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
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* --- Counter Animation --- */
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          var duration = 1500;
          var start = 0;
          var startTime = null;

          function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target + suffix;
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }
  animateCounters();

  /* --- HUD hide on scroll down, show on scroll up --- */
  var hud = document.querySelector('.hud');
  var lastScroll = 0;
  if (hud) {
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        hud.style.transform = 'translateY(-100%)';
        hud.style.transition = 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)';
      } else {
        hud.style.transform = 'translateY(0)';
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

})();
