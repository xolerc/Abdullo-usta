/* ============================================================
   ABDULLO.USTA — Main JS
   3D Interactions, Particles, Scroll Animations
   ============================================================ */
(function () {
  'use strict';

  /* --- Viewport Height (iOS Safari) --- */
  function setVh() {
    document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
  }
  setVh();
  window.addEventListener('resize', setVh);

  /* --- Cursor Glow Effect --- */
  var cursorGlow = document.getElementById('cursorGlow');
  var mouseX = 0, mouseY = 0;
  var glowX = 0, glowY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    if (cursorGlow) {
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
    }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* --- Floating Particles --- */
  function createParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    var count = window.innerWidth < 768 ? 15 : 30;
    for (var i = 0; i < count; i++) {
      var particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.width = (Math.random() * 4 + 2) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = Math.random() * 0.3 + 0.1;
      container.appendChild(particle);
    }
  }
  createParticles();

  /* --- Preloader --- */
  var preloader = document.querySelector('.preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('is-done');
      document.body.style.overflow = '';
      initScrollReveal();
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  /* --- Logo Full-Screen Overlay --- */
  var preloaderLogo = document.getElementById('preloaderLogo');
  var logoOverlay = document.getElementById('logoOverlay');
  var logoOverlayClose = document.getElementById('logoOverlayClose');

  if (preloaderLogo && logoOverlay) {
    preloaderLogo.addEventListener('click', function () {
      logoOverlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
    });
    logoOverlayClose.addEventListener('click', function () {
      logoOverlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    });
    logoOverlay.addEventListener('click', function (e) {
      if (e.target === logoOverlay) {
        logoOverlay.classList.remove('is-visible');
        document.body.style.overflow = '';
      }
    });
  }

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
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --- Scroll Reveal --- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  /* --- Counter Animation --- */
  function animateCounters() {
    var counters = document.querySelectorAll('.hero-stat-num');
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-count'));
      var suffix = counter.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function update(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + suffix;
        }
      }
      requestAnimationFrame(update);
    });
  }

  /* Start counters when hero is visible */
  var heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(heroStats);
  }

  /* --- Before/After Slider --- */
  var baSlider = document.querySelector('.ba-slider-wrap');
  var baBefore = document.querySelector('.ba-layer-before');

  if (baSlider && baBefore) {
    var isDragging = false;

    function updateSlider(x) {
      var rect = baSlider.getBoundingClientRect();
      var pos = (x - rect.left) / rect.width;
      pos = Math.max(0, Math.min(1, pos));
      baBefore.style.clipPath = 'inset(0 ' + (pos * 100) + '% 0 0)';
      var handle = baSlider.querySelector('.ba-handle');
      if (handle) handle.style.left = (pos * 100) + '%';
    }

    baSlider.addEventListener('mousedown', function (e) {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', function (e) {
      if (isDragging) updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', function () {
      isDragging = false;
    });

    baSlider.addEventListener('touchstart', function (e) {
      isDragging = true;
      updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchmove', function (e) {
      if (isDragging) updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchend', function () {
      isDragging = false;
    });
  }

  /* --- 3D Tilt Effect on Cards --- */
  function initTiltEffect() {
    var cards = document.querySelectorAll('.service-card, .portfolio-card, .testimonial-card, .process-step');
    
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = (y - centerY) / centerY * -8;
        var rotateY = (x - centerX) / centerX * 8;
        
        card.style.transform = 'translateY(-12px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  /* Initialize tilt after preloader */
  setTimeout(initTiltEffect, 2500);

  /* --- HUD Scroll Effect --- */
  var hud = document.querySelector('.hud');
  var lastScrollY = 0;

  window.addEventListener('scroll', function() {
    var scrollY = window.pageYOffset;
    
    if (scrollY > 100) {
      hud.style.background = 'rgba(10,10,15,0.9)';
      hud.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(0,212,255,0.15)';
    } else {
      hud.style.background = 'rgba(18,18,26,0.7)';
      hud.style.boxShadow = '';
    }
    
    lastScrollY = scrollY;
  });

  /* --- Parallax on Hero Grid --- */
  var heroGrid = document.querySelector('.hero-grid');
  window.addEventListener('scroll', function() {
    if (heroGrid) {
      var scrollY = window.pageYOffset;
      heroGrid.style.transform = 'perspective(600px) rotateX(60deg) translateY(' + (scrollY * 0.1) + 'px)';
    }
  });

})();
