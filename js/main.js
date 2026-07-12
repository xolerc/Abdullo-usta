/* ============================================================
   ABDULLO.USTA v4.0 — MATERIALITY
   Three.js + Dynamic Light + Material Interactions
   ============================================================ */
(function () {
  'use strict';

  /* === DYNAMIC LIGHT === */
  var light = document.getElementById('dynamicLight');
  var lx = 0, ly = 0;

  document.addEventListener('mousemove', function(e) {
    lx = e.clientX;
    ly = e.clientY;
    if (light) {
      light.style.left = lx + 'px';
      light.style.top = ly + 'px';
    }
  });

  /* === CURSOR === */
  var cursorEl = document.getElementById('cursorMain');
  var cursorLabel = document.getElementById('cursorLabel');
  var cx = 0, cy = 0;

  document.addEventListener('mousemove', function(e) {
    cx = e.clientX;
    cy = e.clientY;
  });

  function updateCursor() {
    cursorEl.style.left = cx + 'px';
    cursorEl.style.top = cy + 'px';
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  /* Cursor hover */
  var hoverEls = document.querySelectorAll('[data-cursor]');
  hoverEls.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursorEl.classList.add('hover');
      cursorLabel.textContent = el.getAttribute('data-cursor');
    });
    el.addEventListener('mouseleave', function() {
      cursorEl.classList.remove('hover');
      cursorLabel.textContent = '';
    });
  });

  /* === PRELOADER === */
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  var loaderPercent = document.getElementById('loaderPercent');
  var progress = 0;

  function updateLoader() {
    if (progress < 100) {
      progress += Math.random() * 5 + 1;
      if (progress > 100) progress = 100;
      loaderBar.style.width = progress + '%';
      loaderPercent.textContent = Math.floor(progress);
      setTimeout(updateLoader, 30 + Math.random() * 20);
    } else {
      setTimeout(function() {
        loader.classList.add('done');
        document.body.style.overflow = '';
        initReveal();
        initCounters();
      }, 400);
    }
  }

  window.addEventListener('load', function() {
    document.body.style.overflow = 'hidden';
    setTimeout(updateLoader, 200);
  });

  /* === MENU === */
  var menuBtn = document.getElementById('navMenuBtn');
  var menuFull = document.getElementById('menuFull');
  var menuClose = document.getElementById('menuClose');
  var menuLinks = menuFull.querySelectorAll('.menu-full-link');

  menuBtn.addEventListener('click', function() {
    menuBtn.classList.toggle('open');
    menuFull.classList.toggle('open');
    document.body.style.overflow = menuFull.classList.contains('open') ? 'hidden' : '';
  });

  menuClose.addEventListener('click', function() {
    menuBtn.classList.remove('open');
    menuFull.classList.remove('open');
    document.body.style.overflow = '';
  });

  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('open');
      menuFull.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* === TIME === */
  function updateTime() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('navTime').textContent = h + ':' + m;
  }
  updateTime();
  setInterval(updateTime, 30000);

  /* === SCROLL PROGRESS === */
  var progressFill = document.getElementById('progressFill');
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressFill.style.width = (scrollTop / docHeight * 100) + '%';
  });

  /* === SECTION COUNTER === */
  var counterCurrent = document.querySelector('.section-counter-current');
  var allSections = document.querySelectorAll('.section, .hero');

  function updateCounter() {
    var scrollY = window.pageYOffset + window.innerHeight / 2;
    allSections.forEach(function(sec, i) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        counterCurrent.textContent = String(i + 1).padStart(2, '0');
      }
    });
  }
  window.addEventListener('scroll', updateCounter);

  /* === SMOOTH SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  /* === SCROLL REVEAL === */
  function initReveal() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) {
      observer.observe(el);
    });
  }

  /* === COUNTER === */
  function initCounters() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.hero-stat-val[data-count]').forEach(function(el) {
            var target = parseInt(el.getAttribute('data-count'));
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = null;
            function update(ts) {
              if (!start) start = ts;
              var p = Math.min((ts - start) / duration, 1);
              var eased = 1 - Math.pow(1 - p, 3);
              el.innerHTML = Math.floor(eased * target) + suffix;
              if (p < 1) requestAnimationFrame(update);
              else el.innerHTML = target + suffix;
            }
            requestAnimationFrame(update);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    var statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
  }

  /* === THREE.JS HERO === */
  if (typeof THREE !== 'undefined' && document.getElementById('heroCanvas')) {
    var canvas = document.getElementById('heroCanvas');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    var dirLight = new THREE.DirectionalLight(0xd4a853, 0.8);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    /* Buildings */
    var buildings = [];
    var bMat = new THREE.MeshStandardMaterial({ color: 0xd4a853, roughness: 0.25, metalness: 0.75, flatShading: true });

    var b1 = new THREE.Mesh(new THREE.BoxGeometry(1, 2.5, 1), bMat.clone());
    b1.position.set(-2.5, -0.75, 0);
    scene.add(b1);
    buildings.push(b1);

    var b2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), bMat.clone());
    b2.position.set(-1, -1.1, 0.5);
    scene.add(b2);
    buildings.push(b2);

    var b3 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 0.8), bMat.clone());
    b3.position.set(1, -0.9, -0.5);
    scene.add(b3);
    buildings.push(b3);

    var b4 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 0.6), bMat.clone());
    b4.position.set(2.5, -1.25, 0.3);
    scene.add(b4);
    buildings.push(b4);

    /* Wireframe sphere */
    var wire = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xd4a853, wireframe: true, transparent: true, opacity: 0.04 })
    );
    scene.add(wire);

    /* Icosahedron */
    var ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.MeshStandardMaterial({ color: 0xd4a853, roughness: 0.3, metalness: 0.7, wireframe: true })
    );
    ico.position.set(3.5, 1.5, -1);
    scene.add(ico);

    /* Particles */
    var partGeo = new THREE.BufferGeometry();
    var partCount = 350;
    var partPos = new Float32Array(partCount * 3);
    for (var i = 0; i < partCount * 3; i++) {
      partPos[i] = (Math.random() - 0.5) * 25;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    var particles = new THREE.Points(partGeo, new THREE.PointsMaterial({ color: 0xd4a853, size: 0.012, transparent: true, opacity: 0.35 }));
    scene.add(particles);

    /* Animation */
    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.005;

      buildings.forEach(function(b, i) {
        b.rotation.y = t * (0.1 + i * 0.03);
        b.position.y = b.position.y + Math.sin(t * (0.5 + i * 0.1) + i) * 0.0005;
      });

      ico.rotation.y = t * 0.35;
      ico.rotation.x = t * 0.2;

      wire.rotation.y = t * 0.025;

      particles.rotation.y = t * 0.008;

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* Mouse parallax */
    var mx = 0, my = 0;
    document.addEventListener('mousemove', function(e) {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateCamera() {
      camera.position.x += (mx * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-my * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      requestAnimationFrame(updateCamera);
    }
    updateCamera();
  }

})();
