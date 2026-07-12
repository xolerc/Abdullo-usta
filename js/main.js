/* ============================================================
   ABDULLO.USTA — Premium 3D JavaScript
   Three.js + GSAP-like animations
   ============================================================ */
(function () {
  'use strict';

  /* --- Cursor Glow --- */
  var cursorGlow = document.getElementById('cursorGlow');
  var mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', function(e) { mx = e.clientX; my = e.clientY; });
  function animateGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    if (cursorGlow) { cursorGlow.style.left = gx + 'px'; cursorGlow.style.top = gy + 'px'; }
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  /* --- Preloader --- */
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.getElementById('preloader').classList.add('done');
      document.body.style.overflow = '';
      initReveal();
      initCounters();
    }, 2400);
  });
  document.body.style.overflow = 'hidden';

  /* --- Dark/Light Mode --- */
  var html = document.documentElement;
  var saved = localStorage.getItem('abdullo-theme');
  if (saved === 'light') { html.classList.remove('dark'); html.classList.add('light'); }

  document.getElementById('modeToggle').addEventListener('click', function() {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark'); html.classList.add('light');
      localStorage.setItem('abdullo-theme', 'light');
    } else {
      html.classList.remove('light'); html.classList.add('dark');
      localStorage.setItem('abdullo-theme', 'dark');
    }
  });

  /* --- Mobile Menu --- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', function() {
    var isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* --- Smooth Scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

  /* --- Scroll Reveal --- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(function(el) { observer.observe(el); });
  }

  /* --- Counter Animation --- */
  function initCounters() {
    var counters = document.querySelectorAll('.hero-stat-num');
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          counters.forEach(function(counter) {
            var target = parseInt(counter.getAttribute('data-target'));
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
    observer.observe(document.querySelector('.hero-stats'));
  }

  /* --- Before/After Slider --- */
  var baSlider = document.getElementById('baSlider');
  var baBefore = document.getElementById('baBefore');
  var baHandle = document.getElementById('baHandle');
  var isDragging = false;

  function updateSlider(x) {
    var rect = baSlider.getBoundingClientRect();
    var pos = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    baBefore.style.clipPath = 'inset(0 ' + (100 - pos) + '% 0 0)';
    baHandle.style.left = pos + '%';
  }

  baSlider.addEventListener('mousedown', function(e) { isDragging = true; updateSlider(e.clientX); });
  document.addEventListener('mousemove', function(e) { if (isDragging) updateSlider(e.clientX); });
  document.addEventListener('mouseup', function() { isDragging = false; });
  baSlider.addEventListener('touchstart', function(e) { isDragging = true; updateSlider(e.touches[0].clientX); });
  document.addEventListener('touchmove', function(e) { if (isDragging) updateSlider(e.touches[0].clientX); });
  document.addEventListener('touchend', function() { isDragging = false; });

  /* --- Three.js Hero Scene --- */
  if (typeof THREE !== 'undefined') {
    var canvas = document.getElementById('heroCanvas');
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /* Lights */
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    var dirLight = new THREE.DirectionalLight(0xc9a84c, 1);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xc9a84c, 0.5);
    pointLight.position.set(-10, -10, -5);
    scene.add(pointLight);

    /* Main Icosahedron */
    var icoGeo = new THREE.IcosahedronGeometry(2, 1);
    var icoMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    var icoMesh = new THREE.Mesh(icoGeo, icoMat);
    scene.add(icoMesh);

    /* Floating Objects */
    var octGeo = new THREE.OctahedronGeometry(0.6, 0);
    var octMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.4, metalness: 0.7, transparent: true, opacity: 0.5 });
    var octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(3, 1, -2);
    scene.add(octMesh);

    var dodGeo = new THREE.DodecahedronGeometry(0.5, 0);
    var dodMat = new THREE.MeshStandardMaterial({ color: 0xc9a84c, roughness: 0.5, metalness: 0.6, transparent: true, opacity: 0.3 });
    var dodMesh = new THREE.Mesh(dodGeo, dodMat);
    dodMesh.position.set(-3, -1, -1);
    scene.add(dodMesh);

    /* Wireframe sphere */
    var sphereGeo = new THREE.SphereGeometry(3, 32, 32);
    var sphereMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, wireframe: true, transparent: true, opacity: 0.08 });
    var sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    /* Particles */
    var particlesGeo = new THREE.BufferGeometry();
    var particleCount = 200;
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var particlesMat = new THREE.PointsMaterial({ color: 0xc9a84c, size: 0.02, transparent: true, opacity: 0.6 });
    var particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    /* Animation Loop */
    var time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      icoMesh.rotation.y = time * 0.3;
      icoMesh.rotation.x = Math.sin(time * 0.5) * 0.2;
      icoMesh.position.y = Math.sin(time) * 0.2;

      octMesh.rotation.y = time * 0.5;
      octMesh.rotation.x = time * 0.3;
      octMesh.position.y = 1 + Math.sin(time * 1.5) * 0.3;

      dodMesh.rotation.y = time * 0.4;
      dodMesh.rotation.z = time * 0.2;
      dodMesh.position.y = -1 + Math.cos(time * 1.2) * 0.3;

      sphereMesh.rotation.y = time * 0.05;
      sphereMesh.rotation.x = time * 0.02;

      particles.rotation.y = time * 0.02;
      particles.rotation.x = time * 0.01;

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
    document.addEventListener('mousemove', function(e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 2;
      var y = (e.clientY / window.innerHeight - 0.5) * 2;
      camera.position.x = x * 0.5;
      camera.position.y = -y * 0.5;
      camera.lookAt(scene.position);
    });
  }

  /* --- Nav Scroll Effect --- */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(10,10,10,0.95)';
      nav.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(201,168,76,0.1)';
    } else {
      nav.style.background = 'rgba(17,17,17,0.85)';
      nav.style.boxShadow = '';
    }
  });

})();
