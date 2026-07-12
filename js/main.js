/* ============================================================
   ABDULLO.USTA v3.0 — ARCHITECTURAL CANVAS
   Three.js + Cursor Trail + Magnetic Interactions
   ============================================================ */
(function () {
  'use strict';

  /* === CURSOR === */
  var cursor = document.getElementById('magneticCursor');
  var mx = 0, my = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  /* Magnetic elements */
  var magneticEls = document.querySelectorAll('[data-magnetic]');
  magneticEls.forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      cursor.classList.add('hover');
      var text = el.getAttribute('data-cursor-text');
      if (text) document.getElementById('magneticText').textContent = text;
    });
    el.addEventListener('mouseleave', function() {
      cursor.classList.remove('hover');
      document.getElementById('magneticText').textContent = '';
    });
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
    });
  });

  /* === CURSOR TRAIL === */
  var trailCanvas = document.getElementById('cursorTrail');
  if (trailCanvas) {
    var ctx = trailCanvas.getContext('2d');
    var trailPoints = [];
    var maxTrail = 20;

    function resizeTrail() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    resizeTrail();
    window.addEventListener('resize', resizeTrail);

    document.addEventListener('mousemove', function(e) {
      trailPoints.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trailPoints.length > maxTrail) trailPoints.shift();
    });

    function drawTrail() {
      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
      for (var i = 0; i < trailPoints.length; i++) {
        var p = trailPoints[i];
        p.life -= 0.04;
        if (p.life <= 0) { trailPoints.splice(i, 1); i--; continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 197, 71, ' + (p.life * 0.3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(drawTrail);
    }
    drawTrail();
  }

  /* === PRELOADER === */
  var loader = document.getElementById('loader');
  var loaderFill = document.getElementById('loaderFill');
  var loaderPercent = document.getElementById('loaderPercent');
  var loadProgress = 0;

  function updateLoader() {
    if (loadProgress < 100) {
      loadProgress += Math.random() * 6 + 1;
      if (loadProgress > 100) loadProgress = 100;
      loaderFill.style.width = loadProgress + '%';
      loaderPercent.textContent = Math.floor(loadProgress) + '%';
      setTimeout(updateLoader, 25 + Math.random() * 15);
    } else {
      setTimeout(function() {
        loader.classList.add('done');
        document.body.style.overflow = '';
        initReveal();
        initCounters();
      }, 300);
    }
  }

  window.addEventListener('load', function() {
    document.body.style.overflow = 'hidden';
    setTimeout(updateLoader, 100);
  });

  /* === FULLSCREEN MENU === */
  var menuBtn = document.getElementById('orbitalMenuBtn');
  var fullscreenMenu = document.getElementById('fullscreenMenu');
  var menuLinks = fullscreenMenu.querySelectorAll('.fullscreen-menu-item');

  menuBtn.addEventListener('click', function() {
    var isOpen = menuBtn.classList.toggle('open');
    fullscreenMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  menuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      menuBtn.classList.remove('open');
      fullscreenMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* === TIME === */
  function updateTime() {
    var now = new Date();
    var h = String(now.getHours()).padStart(2, '0');
    var m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('orbitalTime').textContent = h + ':' + m;
  }
  updateTime();
  setInterval(updateTime, 30000);

  /* === SCROLL PROGRESS === */
  var scrollFill = document.getElementById('scrollProgress');
  window.addEventListener('scroll', function() {
    var scrollTop = window.pageYOffset;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrollPercent = (scrollTop / docHeight) * 100;
    scrollFill.style.width = scrollPercent + '%';
  });

  /* === SECTION INDICATOR === */
  var indicatorCurrent = document.querySelector('.section-indicator-current');
  var sections = document.querySelectorAll('.scene');

  function updateIndicator() {
    var scrollY = window.pageYOffset + window.innerHeight / 2;
    sections.forEach(function(section, i) {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        indicatorCurrent.textContent = String(i + 1).padStart(2, '0');
      }
    });
  }
  window.addEventListener('scroll', updateIndicator);

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
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.scene-header, .blueprint-card, .gallery-item, .timeline-step, .review, .contact-block, .hero-tag, .hero-headline, .hero-description, .hero-cta-row, .hero-stat-orb, .contact-left, .contact-right').forEach(function(el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }

  /* Reveal class */
  var style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  /* === COUNTER === */
  function initCounters() {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          document.querySelectorAll('.hero-stat-orb-value').forEach(function(el) {
            var text = el.textContent;
            var match = text.match(/(\d+)/);
            if (match) {
              var target = parseInt(match[1]);
              var suffix = text.replace(match[1], '');
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
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    var statsEl = document.querySelector('.hero-stats-orb');
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
    var dirLight = new THREE.DirectionalLight(0xe8c547, 0.9);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);
    var pointLight = new THREE.PointLight(0xe8c547, 0.5);
    pointLight.position.set(-5, -5, -5);
    scene.add(pointLight);

    /* Building-like geometry */
    var buildingGeo = new THREE.BoxGeometry(1.2, 3, 1.2);
    var buildingMat = new THREE.MeshStandardMaterial({
      color: 0xe8c547, roughness: 0.2, metalness: 0.8, flatShading: true
    });
    var building = new THREE.Mesh(buildingGeo, buildingMat);
    building.position.set(-2, -0.5, 0);
    scene.add(building);

    var building2Geo = new THREE.BoxGeometry(0.8, 2, 0.8);
    var building2 = new THREE.Mesh(building2Geo, buildingMat.clone());
    building2.position.set(-0.5, -1, 0.5);
    scene.add(building2);

    var building3Geo = new THREE.BoxGeometry(1.5, 2.5, 1);
    var building3 = new THREE.Mesh(building3Geo, buildingMat.clone());
    building3.position.set(1.5, -0.75, -0.5);
    scene.add(building3);

    /* Icosahedron accent */
    var icoGeo = new THREE.IcosahedronGeometry(0.8, 0);
    var icoMat = new THREE.MeshStandardMaterial({
      color: 0xe8c547, roughness: 0.3, metalness: 0.7, wireframe: true
    });
    var ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(3.5, 1, -1);
    scene.add(ico);

    /* Wireframe sphere */
    var wireGeo = new THREE.SphereGeometry(3.5, 20, 20);
    var wireMat = new THREE.MeshBasicMaterial({ color: 0xe8c547, wireframe: true, transparent: true, opacity: 0.04 });
    var wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    /* Particles */
    var partGeo = new THREE.BufferGeometry();
    var partCount = 400;
    var partPos = new Float32Array(partCount * 3);
    for (var i = 0; i < partCount * 3; i++) {
      partPos[i] = (Math.random() - 0.5) * 30;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    var partMat = new THREE.PointsMaterial({ color: 0xe8c547, size: 0.012, transparent: true, opacity: 0.4 });
    var particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    /* Animation */
    var t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.006;

      building.rotation.y = t * 0.15;
      building.position.y = -0.5 + Math.sin(t * 0.8) * 0.1;

      building2.rotation.y = t * 0.2;
      building2.position.y = -1 + Math.sin(t * 0.6 + 1) * 0.08;

      building3.rotation.y = t * 0.12;
      building3.position.y = -0.75 + Math.sin(t * 0.7 + 2) * 0.1;

      ico.rotation.y = t * 0.4;
      ico.rotation.x = t * 0.2;

      wire.rotation.y = t * 0.03;
      wire.rotation.x = t * 0.01;

      particles.rotation.y = t * 0.01;

      renderer.render(scene, camera);
    }
    animate();

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
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);
      requestAnimationFrame(updateCamera);
    }
    updateCamera();
  }

})();
