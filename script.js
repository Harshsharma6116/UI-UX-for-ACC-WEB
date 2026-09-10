(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* ============ THEME TOGGLE ============ */
  function initTheme() {
    var stored = null;
    try { stored = localStorage.getItem('acc-theme'); } catch (e) {}
    if (stored === 'light' || stored === 'dark') {
      root.setAttribute('data-theme', stored);
    }
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('acc-theme', next); } catch (e) {}
      document.dispatchEvent(new CustomEvent('acc-theme-change', { detail: { theme: next } }));
    });
  }

  /* ============ NAV: scroll shadow + mobile menu ============ */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.getElementById('nav-burger');
    if (!nav) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 12) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }, { passive: true });

    if (burger) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      var links = document.querySelectorAll('.nav-links .nav-link');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ============ CUSTOM CURSOR ============ */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    var mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    function raf() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(raf);
    }
    raf();

    var interactive = document.querySelectorAll('a, button, .project-row, .event-card, .team-card, .team-tab, .tech-chip, input');
    var cursorText = ring.querySelector('.cursor-text');
    interactive.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('is-active');
        if (cursorText) {
          if (el.classList.contains('project-row')) { cursorText.innerText = 'View'; }
          else if (el.classList.contains('event-card')) { cursorText.innerText = 'Join'; }
          else if (el.tagName === 'A' || el.tagName === 'BUTTON') { cursorText.innerText = 'Click'; }
          else { cursorText.innerText = ''; }
        }
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('is-active');
        if (cursorText) { cursorText.innerText = ''; }
      });
    });
  }

  /* ============ EVENTS TABS ============ */
  function initEventsTabs() {
    var tabs = document.querySelectorAll('.events-tab:not(.skip-btn)');
    var tracks = document.querySelectorAll('.events-track');
    var sticker = document.getElementById('hacker-sticker');
    var skipBtn = document.getElementById('skip-past-btn');
    if (!tabs.length || !tracks.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var targetId = entry.target.id.replace('events-', '');
          
          tabs.forEach(function(t) { 
            t.classList.remove('is-active'); 
            t.setAttribute('aria-selected', 'false'); 
            if (t.getAttribute('data-tab') === targetId) {
              t.classList.add('is-active');
              t.setAttribute('aria-selected', 'true');
            }
          });

          // Show skip button only for 'past' events
          if (skipBtn) {
            if (targetId === 'past') {
              skipBtn.style.opacity = '1';
              skipBtn.style.transform = 'translateY(0)';
              skipBtn.style.pointerEvents = 'auto';
            } else {
              skipBtn.style.opacity = '0';
              skipBtn.style.transform = 'translateY(20px)';
              skipBtn.style.pointerEvents = 'none';
            }
          }

          if (sticker) {
            var labels = { 'ongoing': 'HAPPENING', 'upcoming': 'NEXT UP', 'past': 'ARCHIVE' };
            var newText = labels[targetId] || 'EVENTS';
            if (sticker.getAttribute('data-text') !== newText) {
              sticker.setAttribute('data-text', newText);
              // Hacker scramble effect
              var chars = '!<>-_\\/[]{}—=+*^?#_';
              var iterations = 0;
              var interval = setInterval(function() {
                sticker.innerText = newText.split('').map(function(letter, index) {
                  if (index < iterations) return newText[index];
                  return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                if (iterations >= newText.length) clearInterval(interval);
                iterations += 1 / 3;
              }, 30);
            }
          }
        } else {
          // If past events track leaves viewport completely
          if (entry.target.id === 'events-past' && skipBtn) {
            skipBtn.style.opacity = '0';
            skipBtn.style.transform = 'translateY(20px)';
            skipBtn.style.pointerEvents = 'none';
          }
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    tracks.forEach(function(track) { observer.observe(track); });

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var targetId = 'events-' + tab.getAttribute('data-tab');
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          var y = targetEl.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============ SCROLL REVEAL ============ */
  function initReveal() {
    var targets = document.querySelectorAll(
      '.about-copy, .about-visual, .stat-card, .event-card, .project-card, .team-card, .gallery-item, .cta-inner'
    );
    targets.forEach(function (el) { el.classList.add('reveal'); });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-visible'); }, (i % 4) * 70);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ============ STAT COUNT-UP ============ */
  function initCounters() {
    var counters = document.querySelectorAll('.stat-number');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    function animateCount(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      if (prefersReducedMotion) { el.textContent = target; return; }
      var start = 0;
      var duration = 1200;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { io.observe(el); });
  }

  /* ============ PROJECT CARD TILT ============ */
  function initTilt() {
    if (prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;
    var cards = document.querySelectorAll('.project-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (px * 8) + 'deg) rotateX(' + (py * -8) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(600px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  /* ============ CTA FORM ============ */
  function initForm() {
    var form = document.getElementById('join-form');
    var note = document.getElementById('join-note');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input.value || !input.checkValidity()) {
        note.textContent = 'Enter a valid college email to continue.';
        note.style.color = 'var(--danger)';
        return;
      }
      note.style.color = 'var(--secondary)';
      note.textContent = "You're on the list — check your inbox for an invite link.";
      form.reset();
    });
  }

  /* ============ THREE.JS: HERO WAVY BACKGROUND ============ */
  function initHeroScene() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    var hero = canvas.closest('.hero');

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 1.6, 4.2);
    camera.lookAt(0, 0, 0);

    var geometry = new THREE.PlaneGeometry(12, 8, 120, 80);
    geometry.rotateX(-Math.PI / 2.4);

    function themeColors() {
      var dark = root.getAttribute('data-theme') !== 'light';
      return dark
        ? { primary: new THREE.Color(0xFDE047), secondary: new THREE.Color(0x3B82F6) }
        : { primary: new THREE.Color(0x2563EB), secondary: new THREE.Color(0xEAB308) };
    }
    var colors = themeColors();

    var material = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColorA: { value: colors.primary },
        uColorB: { value: colors.secondary }
      },
      vertexShader: [
        'uniform float uTime;',
        'uniform vec2 uMouse;',
        'varying float vElevation;',
        'void main() {',
        '  vec3 pos = position;',
        '  float wave = sin(pos.x * 0.6 + uTime) * 0.35;',
        '  wave += sin(pos.z * 0.9 + uTime * 1.3) * 0.25;',
        '  wave += sin((pos.x + pos.z) * 0.4 - uTime * 0.7) * 0.2;',
        // Add interactive ripple around mouse
        '  float dist = distance(pos.xz, uMouse * 8.0);',
        '  float ripple = sin(dist * 3.0 - uTime * 4.0) * exp(-dist * 0.4) * 0.8;',
        '  pos.y += wave + ripple;',
        '  vElevation = wave + ripple;',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform vec3 uColorA;',
        'uniform vec3 uColorB;',
        'varying float vElevation;',
        'void main() {',
        '  float mixFactor = clamp((vElevation + 0.4) / 0.8, 0.0, 1.0);',
        '  vec3 color = mix(uColorA, uColorB, mixFactor);',
        '  gl_FragColor = vec4(color, 0.75);',
        '}'
      ].join('\n')
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.6;
    scene.add(mesh);

    // Track mouse in normalized coordinates
    var targetMouse = new THREE.Vector2(0, 0);
    window.addEventListener('mousemove', function(e) {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    var clock = new THREE.Clock();
    var mouseX = 0;

    function resize() {
      var w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5);
    });

    document.addEventListener('acc-theme-change', function () {
      var c = themeColors();
      material.uniforms.uColorA.value = c.primary;
      material.uniforms.uColorB.value = c.secondary;
    });

    var speed = prefersReducedMotion ? 0.15 : 1;
    function animate() {
      material.uniforms.uTime.value = clock.getElapsedTime() * speed;
      // Smoothly interpolate the mouse uniform for the shader
      material.uniforms.uMouse.value.lerp(targetMouse, 0.05);
      
      camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.02;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============ THREE.JS: ABOUT ICOSAHEDRON ============ */
  function initAboutScene() {
    // No Three.js canvas anymore — replaced by CSS/SVG ACC logo mark.
    // Add a subtle mouse-tilt parallax to the logo container.
    var mark = document.getElementById('acc-logo-mark');
    if (!mark || window.matchMedia('(hover: none)').matches || prefersReducedMotion) return;

    var tx = 0, ty = 0, cx = 0, cy = 0;

    mark.addEventListener('mousemove', function(e) {
      var r = mark.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width  - 0.5) * 18;
      ty = ((e.clientY - r.top)  / r.height - 0.5) * 18;
    });
    mark.addEventListener('mouseleave', function() { tx = 0; ty = 0; });

    (function tick() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      mark.style.transform = 'perspective(600px) rotateY(' + cx + 'deg) rotateX(' + (-cy) + 'deg)';
      requestAnimationFrame(tick);
    })();
  }

  /* ============ THREE.JS: CTA PARTICLES ============ */
  function initCtaScene() {
    var canvas = document.getElementById('cta-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    var wrap = canvas.closest('.cta-section');

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20);
    camera.position.z = 5;

    var count = 260;
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var material = new THREE.PointsMaterial({ color: 0x3B82F6, size: 0.03, transparent: true, opacity: 0.7 });
    var points = new THREE.Points(geometry, material);
    scene.add(points);

    function updateColor() {
      var dark = root.getAttribute('data-theme') !== 'light';
      material.color.set(dark ? 0x3B82F6 : 0xEAB308);
    }
    updateColor();
    document.addEventListener('acc-theme-change', updateColor);

    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    var speed = prefersReducedMotion ? 0.1 : 1;
    function animate() {
      points.rotation.y += 0.0006 * speed * 16;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ============ GSAP MARQUEE ============ */
  function initMarquees() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;
    
    var marquees = document.querySelectorAll('.marquee-divider');
    marquees.forEach(function (marquee) {
      var track = marquee.querySelector('.marquee-track');
      if (!track) return;
      
      // Make sure track content repeats sufficiently
      var isFlip = marquee.classList.contains('flip');
      var direction = isFlip ? 1 : -1;
      
      // We animate the track from 0 to -50% (since we duplicated items)
      var tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(track, 
        { xPercent: isFlip ? -50 : 0 }, 
        { xPercent: isFlip ? 0 : -50, duration: 15, ease: 'none' }
      );
      
      // Speed up on scroll
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: function(self) {
            var velocity = Math.abs(self.getVelocity());
            var timeScale = 1 + (velocity / 500); // Scale time based on scroll speed
            gsap.to(tl, { timeScale: timeScale, duration: 0.1, overwrite: true });
            gsap.to(tl, { timeScale: 1, duration: 1, delay: 0.1, overwrite: 'auto' });
          }
        });
      }
    });
  }

  /* ============ RENDER DATA ============ */
  function renderData() {
    if (typeof ACC_DATA === 'undefined') return;

    // Render Stats
    var statsGrid = document.getElementById('stats-grid');
    if (statsGrid) {
      statsGrid.innerHTML = ACC_DATA.stats.map(function(s) {
        return '<div class="stat-card"><span class="stat-number" data-count="' + s.count + '">0</span><span class="stat-label">' + s.label + '</span></div>';
      }).join('');
    }

      // Render Events
      var eventsOngoing = document.getElementById('events-ongoing');
      var eventsUpcoming = document.getElementById('events-upcoming');
      var eventsPast = document.getElementById('events-past');
      function createEventHTML(e, index) {
        var topOffset = 100 + (index * 40);
        return '<article class="event-card" style="top: ' + topOffset + 'px"><div class="event-img" style="background-image: url(' + e.img + ')"></div><div class="event-content"><span class="event-date"><span class="event-day">' + e.dateDay + '</span><span class="event-month">' + e.dateMonth + '</span></span><div class="event-body"><h3>' + e.title + '</h3><p>' + e.desc + '</p><span class="event-tag">' + e.tag + '</span></div></div></article>';
      }
      if (eventsOngoing) eventsOngoing.innerHTML = ACC_DATA.events.ongoing.map(createEventHTML).join('');
      if (eventsUpcoming) eventsUpcoming.innerHTML = ACC_DATA.events.upcoming.map(createEventHTML).join('');
      if (eventsPast) eventsPast.innerHTML = ACC_DATA.events.past.map(createEventHTML).join('');

      // Render Gallery
      var galleryGrid = document.getElementById('gallery-grid');
      if (galleryGrid && ACC_DATA.gallery) {
        var html = '<div class="gallery-item bento-hero"><span class="bento-text">Happenings<br>at ACC</span></div>';
        html += ACC_DATA.gallery.map(function(item) {
          return '<div class="gallery-item"><img src="' + item.img + '" alt="' + item.caption + '"><div class="gallery-caption">' + item.caption + '</div></div>';
        }).join('');
        galleryGrid.innerHTML = html;
      }

    // Render Projects
    var projectsList = document.getElementById('projects-list');
    if (projectsList) {
      projectsList.innerHTML = ACC_DATA.projects.map(function(p, i) {
        var num = (i + 1).toString().padStart(2, '0');
        return '<div class="project-row" data-img="' + p.img + '">' +
                 '<span class="project-num">' + num + '</span>' +
                 '<h3 class="project-title-large">' + p.title + '</h3>' +
                 '<span class="project-tag-large">' + p.tag + '</span>' +
               '</div>';
      }).join('');
    }

    // Render Team
    var teamGrid = document.getElementById('team-grid');
    var teamTabs = document.getElementById('team-tabs');
    if (teamGrid && teamTabs && ACC_DATA.team) {
      var categories = Object.keys(ACC_DATA.team);
      if (categories.length > 0) {
        var currentCategory = categories[0];
        
        function renderTeamCards(category) {
            var members = ACC_DATA.team[category] || [];
            return members.map(function(t, idx) {
              var id = 'ID-' + Math.floor(Math.random() * 9000 + 1000) + '-' + t.initials;
                return '<article class="team-card" style="animation-delay: ' + (idx * 0.1) + 's">' +
                '<div class="team-card-header">' +
                  '<span class="team-card-id">' + id + '</span>' +
                  '<span class="team-card-status"></span>' +
                '</div>' +
                '<div class="team-card-body">' +
                  '<div class="team-avatar" aria-hidden="true">' + t.initials + '</div>' +
                  '<div class="team-info">' +
                    '<h3>' + t.name + '</h3>' +
                    '<p class="team-role">&gt; ' + t.role + '</p>' +
                  '</div>' +
                '</div>' +
                '<div class="team-card-footer">' +
                  '<div class="team-links">' +
                    '<a href="' + t.linkedin + '" aria-label="LinkedIn"><i class="ti ti-brand-linkedin"></i></a>' +
                    '<a href="' + t.github + '" aria-label="GitHub"><i class="ti ti-brand-github"></i></a>' +
                  '</div>' +
                '</div>' +
              '</article>';
            }).join('');
          }
        
        teamTabs.innerHTML = categories.map(function(cat) {
          return '<button class="team-tab' + (cat === currentCategory ? ' is-active' : '') + '" data-cat="' + cat + '">' + cat + '</button>';
        }).join('');
        teamGrid.innerHTML = renderTeamCards(currentCategory);
        
        // Tab Interaction
        var tabs = document.querySelectorAll('.team-tab');
        tabs.forEach(function(tab) {
          tab.addEventListener('click', function() {
            if (tab.classList.contains('is-active')) return;
            if (teamGrid.classList.contains('is-animating')) return; // Prevent rapid clicking bugs
            
            tabs.forEach(function(t) { t.classList.remove('is-active'); });
            tab.classList.add('is-active');
            var newCat = tab.getAttribute('data-cat');
            
            // GSAP Animated flip out
            if (typeof gsap !== 'undefined') {
              var oldCards = document.querySelectorAll('.team-card');
              if (oldCards.length === 0) {
                teamGrid.innerHTML = renderTeamCards(newCat);
              } else {
                teamGrid.classList.add('is-animating');
                gsap.to(oldCards, {
                  y: -30, opacity: 0, scale: 0.8,
                  duration: 0.2, stagger: 0.05, ease: 'power2.in'
                });
                // Bulletproof timeout to ensure new cards render regardless of GSAP onComplete nuances
                setTimeout(function() {
                  teamGrid.innerHTML = renderTeamCards(newCat);
                  teamGrid.classList.remove('is-animating');
                }, 200 + (oldCards.length * 50));
              }
            } else {
              teamGrid.innerHTML = renderTeamCards(newCat);
            }
          });
        });
      }
    }
  }

  /* ============ SMOOTH SCROLL (LENIS) ============ */
  function initLenis() {
    if (typeof Lenis !== 'undefined') {
      const lenis = new Lenis({
        duration: 1.2,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      });

      // Integrate with GSAP ScrollTrigger if available
      if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }
  }

  /* ============ PRELOADER & ENTRANCE ============ */
  function initPreloader() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;
    if (typeof gsap === 'undefined') {
      preloader.style.display = 'none';
      return;
    }
    
    document.body.style.overflow = 'hidden';

    var counter = document.getElementById('preloader-counter');
    var progress = document.getElementById('preloader-progress');
    var terminal = document.getElementById('preloader-terminal');
    var brand = document.getElementById('preloader-brand');
    
    // Fake terminal logs
    var logs = [
      "> INITIALIZING CORE SYSTEMS...",
      "> LOADING MODULES [██████░░░░]",
      "> ESTABLISHING SECURE CONNECTION...",
      "> BYPASSING MAINFRAME ENCRYPTION...",
      "> ASSETS LOADED SUCCESSFULLY."
    ];
    var logInterval = setInterval(function() {
      if (logs.length > 0) {
        var el = document.createElement('div');
        el.innerText = logs.shift();
        terminal.appendChild(el);
      } else {
        clearInterval(logInterval);
      }
    }, 250);

    // Text scramble decode
    var chars = '!<>-_\\/[]{}—=+*^?#_';
    var originalText = 'ACC DIGITAL';
    var iterations = 0;
    var brandInterval = setInterval(function() {
      brand.innerText = originalText.split('').map(function(letter, index) {
        if (index < iterations) return originalText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iterations >= originalText.length) clearInterval(brandInterval);
      iterations += 1 / 3;
    }, 40);

    var progressObj = { value: 0 };
    gsap.to(progressObj, {
      value: 100,
      duration: 2.0, // SLIGHTLY LONGER FOR EFFECT
      ease: 'power2.inOut',
      onUpdate: function() {
        var val = Math.round(progressObj.value);
        counter.innerText = val + '%';
        progress.style.width = val + '%';
      },
      onComplete: function() {
        var tl = gsap.timeline();
        tl.to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: function() { preloader.style.display = 'none'; document.body.style.overflow = ''; }
        })
        .to(['.hero-eyebrow', '.hero-title', '.hero-rule', '.hero-actions'], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out'
        }, '-=0.3');
      }
    });
  }

  /* ============ ANIMATED GEOMETRY NAME ============ */
  function initAnimatedName() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- OPTION A: Animate the SVG geometric shapes (idle loop) ---------- */
    var svg = document.getElementById('nav-logo-svg');
    if (svg && typeof gsap !== 'undefined' && !prefersReduced) {

      // A-body: subtle breathe + gentle y drift
      gsap.to('.geo-a-body', {
        scaleY: 0.94, transformOrigin: '22px 44px',
        duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // A top dot: bounce independently (like it's floating above the triangle)
      gsap.to('.geo-a-dot', {
        y: -7, duration: 1.3, yoyo: true, repeat: -1, ease: 'power2.inOut'
      });

      // A inner accent dot: pulse in/out (like a heartbeat)
      gsap.to('.geo-a-accent', {
        scale: 0.2, transformOrigin: '22px 27px',
        duration: 0.9, yoyo: true, repeat: -1, ease: 'power2.inOut', delay: 0.6
      });

      // C1 arc: rocks back and forth around its center
      gsap.to('.geo-c1-arc', {
        rotation: 12, transformOrigin: '20px 23px',
        duration: 1.9, yoyo: true, repeat: -1, ease: 'sine.inOut'
      });

      // C1 dot: orbits the C opening (x + y offset loop)
      gsap.to('.geo-c1-dot', {
        x: 8, y: -9, duration: 1.1, yoyo: true, repeat: -1, ease: 'power1.inOut'
      });

      // C2 arc: rocks opposite direction, slower
      gsap.to('.geo-c2-arc', {
        rotation: -10, transformOrigin: '20px 23px',
        duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4
      });

      // C2 rect accent: spins + scales like a twirling badge
      gsap.to('.geo-c2-rect', {
        rotation: 90, scale: 0.6, transformOrigin: '38px 23px',
        duration: 1.5, yoyo: true, repeat: -1, ease: 'back.inOut(1.5)', delay: 0.8
      });

      // Hover on the whole logo: all shapes pulse outward then snap back
      svg.closest('.nav-logo').addEventListener('mouseenter', function() {
        gsap.fromTo(['.geo-a-body', '.geo-c1-arc', '.geo-c2-arc'], 
          { filter: 'brightness(1)' },
          { filter: 'brightness(1.4)', duration: 0.2, yoyo: true, repeat: 1 }
        );
        gsap.to(['.geo-a-dot', '.geo-c1-dot'], {
          scale: 1.8, transformOrigin: 'center', duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out'
        });
      });
    }

    /* ---------- OPTION B: Autonomous char morph loop for text "Amity Coding Club" ---------- */
    var logoText = document.getElementById('nav-logo-text');
    if (logoText && !prefersReduced) {
      // Use textContent so it works regardless of display state
      var rawText = logoText.textContent || 'Amity Coding Club';
      logoText.innerHTML = '';

      for (var i = 0; i < rawText.length; i++) {
        var wrap = document.createElement('span');
        wrap.className = 'char-wrap';
        var ch = rawText[i] === ' ' ? '\u00A0' : rawText[i];
        
        var orig = document.createElement('span');
        orig.className = 'char-orig';
        orig.textContent = ch;
        
        var sym = document.createElement('span');
        sym.className = 'char-sym';
        
        wrap.setAttribute('data-orig', ch);
        wrap.appendChild(orig);
        wrap.appendChild(sym);
        logoText.appendChild(wrap);
      }

      var codeSymbols = ['{', '}', '\\', '/', '<', '>', '_', '*', '[', ']', ';', '#'];
      var colors = ['#FDE047', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#F97316'];

      function scheduleCharMorph(wrapEl, initialDelay) {
        // Wait between 3 and 8 seconds between animations
        var waitTime = initialDelay !== undefined ? initialDelay : (3000 + Math.random() * 5000);
        setTimeout(function() {
          if (wrapEl.getAttribute('data-orig') === '\u00A0') { scheduleCharMorph(wrapEl); return; }
          
          var origEl = wrapEl.querySelector('.char-orig');
          var symEl = wrapEl.querySelector('.char-sym');
          
          var symbol = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
          var color  = colors[Math.floor(Math.random() * colors.length)];
          
          symEl.textContent = symbol;
          symEl.style.color = color;
          
          // Simultaneous crossfade: fade out original, fade in symbol
          gsap.to(origEl, { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
          gsap.fromTo(symEl, 
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1.15, duration: 0.6, ease: 'power2.out',
              onComplete: function() {
                
                // Hold the symbol for 1.2s, then crossfade back
                setTimeout(function() {
                  gsap.to(symEl, { opacity: 0, scale: 0.9, duration: 0.6, ease: 'power2.inOut' });
                  gsap.to(origEl, { opacity: 1, duration: 0.6, ease: 'power2.inOut',
                    onComplete: function() {
                      scheduleCharMorph(wrapEl); // schedule next cycle
                    }
                  });
                }, 1200);

              }
            }
          );
        }, waitTime);
      }

      // Stagger initial fires so they aren't completely synchronized, but don't fire instantly
      logoText.querySelectorAll('.char-wrap').forEach(function(wrapEl, idx) {
        var initDelay = 1000 + (Math.random() * 2000);
        scheduleCharMorph(wrapEl, initDelay);
      });
    }
  }

  /* ============ HERO RULE VERB CYCLER ============ */
  function initRuleVerb() {
    var verbEl = document.getElementById('hero-rule-verb');
    if (!verbEl || typeof gsap === 'undefined') return;
    var verbs = ['BUILD', 'SHIP', 'BREAK', 'LEARN', 'GROW', 'DEPLOY', 'CREATE', 'LAUNCH'];
    var idx = 0;

    function cycleVerb() {
      idx = (idx + 1) % verbs.length;
      // GSAP flip: slide out up, swap, slide in from below
      gsap.to(verbEl, {
        y: -20, opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: function() {
          verbEl.textContent = verbs[idx];
          gsap.fromTo(verbEl,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' }
          );
        }
      });
    }

    // Start cycling every 1.8 seconds after a 2s initial pause
    setTimeout(function() {
      setInterval(cycleVerb, 1800);
    }, 2000);
  }

  /* ============ ABOUT SPLIT TEXT ============ */
  function initAboutSplitText() {
    var wrap = document.getElementById('about-split-wrap');
    if (!wrap) return;
    var solid = wrap.querySelector('.split-solid');
    if (!solid) return;

    var hasEntered = false;

    // On scroll-into-view: animate fill from 0 → 30% over 1.2s
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !hasEntered) {
          hasEntered = true;
          solid.style.transition = 'clip-path 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
          solid.style.clipPath = 'inset(0 70% 0 0)'; // reveal 30% on entry
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(wrap);

    // Mouse tracking: after entry, fill follows cursor (no CSS transition so it's instant/smooth)
    if (!window.matchMedia('(hover: none)').matches) {
      wrap.addEventListener('mousemove', function(e) {
        var rect = wrap.getBoundingClientRect();
        var pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        solid.style.transition = 'none'; // instant follow on mouse
        solid.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      });
      wrap.addEventListener('mouseleave', function() {
        // Gently retreat to 30% when mouse leaves
        solid.style.transition = 'clip-path 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        solid.style.clipPath = 'inset(0 70% 0 0)';
      });
    }
  }

  /* ============ PROJECT HOVER ============ */
  function initProjectHover() {
    if (window.matchMedia('(hover: none)').matches) return;
    var rows = document.querySelectorAll('.project-row');
    var hoverImg = document.getElementById('project-hover-img');
    if (!hoverImg || !rows.length) return;

    rows.forEach(function(row) {
      row.addEventListener('mouseenter', function() {
        hoverImg.style.backgroundImage = 'url(' + row.getAttribute('data-img') + ')';
        hoverImg.classList.add('is-visible');
      });
      row.addEventListener('mousemove', function(e) {
        hoverImg.style.left = e.clientX + 'px';
        hoverImg.style.top = e.clientY + 'px';
      });
      row.addEventListener('mouseleave', function() {
        hoverImg.classList.remove('is-visible');
      });
    });
  }

  /* ============ INIT ============ */
  document.addEventListener('DOMContentLoaded', function () {
    initLenis();
    renderData();
    initAnimatedName();
    initRuleVerb();
    initAboutSplitText();
    initProjectHover();
    initPreloader();
    initTheme();
    initNav();
    initCursor();
    initEventsTabs();
    initReveal();
    initCounters();
    initTilt();
    initForm();
    initHeroScene();
    initAboutScene();
    initCtaScene();
    initMarquees();
  });
})();
