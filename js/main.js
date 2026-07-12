/* ============================================================
   ABDULLO.USTA — Master Professional JS v2.0
   Three.js + Custom Cursor + Smooth Animations
   ============================================================ */
(function () {
  'use strict';

  /* === CUSTOM CURSOR === */
  var cursor = document.getElementById('cursor');
  var follower = document.getElementById('cursorFollower');
  var mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* Hover effects */
  var hoverElements = document.querySelectorAll('a, button, .service, .portfolio-item, .contact-card, .testimonial');
  hoverElements.forEach(function(el) {
    el.addEventListener('mouseenter', function() { follower.classList.add('hover'); });
    el.addEventListener('mouseleave', function() { follower.classList.remove('hover'); });
  });

  /* === PRELOADER === */
  var counter = 0;
  var counterEl = document.getElementById('preloaderCounter');
  var preloader = document.getElementById('preloader');

  function updateCounter() {
    if (counter < 100) {
      counter += Math.floor(Math.random() * 8) + 2;
      if (counter > 100) counter = 100;
      counterEl.textContent = counter;
      setTimeout(updateCounter, 30 + Math.random() * 20);
    } else {
      counterEl.textContent = '100';
      setTimeout(function() {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        initReveal();
        initCounters();
      }, 400);
    }
  }

  window.addEventListener('load', function() {
    document.body.style.overflow = 'hidden';
    setTimeout(updateCounter, 200);
  });

  /* === NAVIGATION === */
  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('menu');
  var menuLinks = menu.querySelectorAll('.menu-link');

  window.addEventListener('scroll', function() {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  burger.addEventListener('click', function() {
    var isOpen = burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      burger.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* === THEME TOGGLE === */
  var html = document.documentElement;
  var themeBtn = document.getElementById('themeToggle');
  var saved = localStorage.getItem('abdullo-theme');
  if (saved === 'light') { html.classList.remove('dark'); html.classList.add('light'); }

  themeBtn.addEventListener('click', function() {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark'); html.classList.add('light');
      localStorage.setItem('abdullo-theme', 'light');
    } else {
      html.classList.remove('light'); html.classList.add('dark');
      localStorage.setItem('abdullo-theme', 'dark');
    }
  });

  /* === SMOOTH SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  /* === SCROLL REVEAL === */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
  }

  /* === COUNTER ANIMATION === */
  function initCounters() {
    var counters = document.querySelectorAll('.hero-stat-value[data-count]');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          counters.forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-count'));
            var suffix = counter.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = null;
            function update(timestamp) {
              if (!start) start = timestamp;
              var progress = Math.min((timestamp - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              counter.textContent = Math.floor(eased * target) + suffix;
              if (progress < 1) requestAnimationFrame(update);
              else counter.textContent = target + suffix;
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

  /* === BEFORE/AFTER SLIDER === */
  var baCompare = document.getElementById('baCompare');
  var baBefore = document.getElementById('baBefore');
  var baLine = document.getElementById('baLine');
  var isDragging = false;

  function updateSlider(x) {
    if (!baCompare) return;
    var rect = baCompare.getBoundingClientRect();
    var pos = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    baBefore.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
    baLine.style.left = pos + '%';
  }

  if (baCompare) {
    baCompare.addEventListener('mousedown', function(e) { isDragging = true; updateSlider(e.clientX); });
    document.addEventListener('mousemove', function(e) { if (isDragging) updateSlider(e.clientX); });
    document.addEventListener('mouseup', function() { isDragging = false; });
    baCompare.addEventListener('touchstart', function(e) { isDragging = true; updateSlider(e.touches[0].clientX); });
    document.addEventListener('touchmove', function(e) { if (isDragging) updateSlider(e.touches[0].clientX); });
    document.addEventListener('touchend', function() { isDragging = false; });
  }

  /* === THREE.JS HERO SCENE === */
  if (typeof THREE !== 'undefined' && document.getElementById('heroCanvas')) {
    var canvas = document.getElementById('heroCanvas');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Lights */
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var dirLight = new THREE.DirectionalLight(0xb8973a, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xb8973a, 0.4);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    /* Main geometry — icosahedron */
    var mainGeo = new THREE.IcosahedronGeometry(1.8, 1);
    var mainMat = new THREE.MeshStandardMaterial({
      color: 0xb8973a,
      roughness: 0.25,
      metalness: 0.85,
      flatShading: true
    });
    var mainMesh = new THREE.Mesh(mainGeo, mainMat);
    scene.add(mainMesh);

    /* Wireframe sphere */
    var wireGeo = new THREE.SphereGeometry(2.8, 24, 24);
    var wireMat = new THREE.MeshBasicMaterial({ color: 0xb8973a, wireframe: true, transparent: true, opacity: 0.06 });
    var wireMesh = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wireMesh);

    /* Floating satellites */
    var sat1Geo = new THREE.OctahedronGeometry(0.4, 0);
    var sat1Mat = new THREE.MeshStandardMaterial({ color: 0xb8973a, roughness: 0.3, metalness: 0.7, transparent: true, opacity: 0.5 });
    var sat1 = new THREE.Mesh(sat1Geo, sat1Mat);
    sat1.position.set(3, 1, -1.5);
    scene.add(sat1);

    var sat2Geo = new THREE.DodecahedronGeometry(0.3, 0);
    var sat2Mat = new THREE.MeshStandardMaterial({ color: 0xb8973a, roughness: 0.4, metalness: 0.6, transparent: true, opacity: 0.35 });
    var sat2 = new THREE.Mesh(sat2Geo, sat2Mat);
    sat2.position.set(-2.5, -1.2, -1);
    scene.add(sat2);

    var sat3Geo = new THREE.TetrahedronGeometry(0.35, 0);
    var sat3Mat = new THREE.MeshStandardMaterial({ color: 0xb8973a, roughness: 0.35, metalness: 0.65, transparent: true, opacity: 0.4 });
    var sat3 = new THREE.Mesh(sat3Geo, sat3Mat);
    sat3.position.set(1.5, -2, -2);
    scene.add(sat3);

    /* Particles */
    var partGeo = new THREE.BufferGeometry();
    var partCount = 300;
    var partPos = new Float32Array(partCount * 3);
    for (var i = 0; i < partCount * 3; i++) {
      partPos[i] = (Math.random() - 0.5) * 25;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    var partMat = new THREE.PointsMaterial({ color: 0xb8973a, size: 0.015, transparent: true, opacity: 0.5 });
    var particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    /* Animation */
    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.008;

      mainMesh.rotation.y = t * 0.25;
      mainMesh.rotation.x = Math.sin(t * 0.4) * 0.15;
      mainMesh.position.y = Math.sin(t * 0.8) * 0.15;

      wireMesh.rotation.y = t * 0.04;
      wireMesh.rotation.x = t * 0.02;

      sat1.rotation.y = t * 0.6;
      sat1.rotation.x = t * 0.3;
      sat1.position.y = 1 + Math.sin(t * 1.2) * 0.3;

      sat2.rotation.y = t * 0.5;
      sat2.rotation.z = t * 0.25;
      sat2.position.y = -1.2 + Math.cos(t * 0.9) * 0.25;

      sat3.rotation.x = t * 0.4;
      sat3.rotation.z = t * 0.3;
      sat3.position.y = -2 + Math.sin(t * 1.1) * 0.2;

      particles.rotation.y = t * 0.015;

      renderer.render(scene, camera);
    }
    animate();

    /* Resize */
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* Mouse parallax */
    var mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', function(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateCamera() {
      camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      requestAnimationFrame(updateCamera);
    }
    updateCamera();
  }

})();
