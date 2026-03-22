// Initialize Lenis for smooth scrolling (guard for pages without the CDN)
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Register GSAP plugins (guard for pages without the CDN)
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Navigation & Year ---
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const body = document.body;

  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      body.classList.remove('nav-open');
    };

    const openNav = () => {
      toggle.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-open');
      body.classList.add('nav-open');
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (toggle.getAttribute('aria-expanded') === 'true') {
          closeNav();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        closeNav();
      }
    });
  }

  // --- 2. Custom Cursor ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  
  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update primary cursor immediately
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Animate follower smoothly
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
      });
    } else {
      // Fallback without GSAP
      function animateFollower() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;
        requestAnimationFrame(animateFollower);
      }
      requestAnimationFrame(animateFollower);
    }

    // Add hover states for interactive elements
    const interactives = document.querySelectorAll('a, button, .chip, input, textarea');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-active');
        follower.classList.add('is-active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-active');
        follower.classList.remove('is-active');
      });
    });
  }

  // --- 3. Preloader Animation ---
  const preloader = document.getElementById('preloader');
  const progressText = document.getElementById('preloader-progress');
  
  if (preloader && progressText) {
    let progress = 0;
    const updateProgress = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 1;
      if (progress >= 100) {
        progress = 100;
        clearInterval(updateProgress);
        
        if (typeof gsap !== 'undefined') {
          // Hide Preloader GSAP Sequence
          gsap.to('.preloader__text', {
            y: -50,
            opacity: 0,
            duration: 0.5,
            ease: "back.in(1.7)"
          });
          
          gsap.to(preloader, {
            height: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power4.inOut",
            onComplete: () => {
              preloader.style.display = 'none';
              initThreeJS();
              initGSAPAnimations();
            }
          });
        } else {
          // Fallback without GSAP
          preloader.style.display = 'none';
        }
      }
      progressText.textContent = progress;
    }, 40);
  } else {
    // If no preloader, init directly
    initThreeJS();
    initGSAPAnimations();
  }
});

function initThreeJS() {
  const container = document.getElementById('hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 120;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles & Lines (Network Graph)
  const particleCount = 150;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 300;

    velocities.push({
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      z: (Math.random() - 0.5) * 0.2
    });
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Material for particles
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x38f8e2, // accent-secondary
    size: 2,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // Lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xf973ff, // accent
    transparent: true,
    opacity: 0.15
  });

  const lineGeometry = new THREE.BufferGeometry();
  const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(linesMesh);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates roughly
    mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    // Smooth camera rotation
    scene.rotation.x += 0.05 * (targetY - scene.rotation.x);
    scene.rotation.y += 0.05 * (targetX - scene.rotation.y);

    // Update particles position
    const positionsAttr = geometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      positionsAttr.array[i * 3] += velocities[i].x;
      positionsAttr.array[i * 3 + 1] += velocities[i].y;
      positionsAttr.array[i * 3 + 2] += velocities[i].z;

      // Wrap around bounds softly
      if (Math.abs(positionsAttr.array[i * 3]) > 150) velocities[i].x *= -1;
      if (Math.abs(positionsAttr.array[i * 3 + 1]) > 150) velocities[i].y *= -1;
      if (Math.abs(positionsAttr.array[i * 3 + 2]) > 150) velocities[i].z *= -1;
    }
    positionsAttr.needsUpdate = true;

    // Connect nearby particles
    const linePositions = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positionsAttr.array[i * 3] - positionsAttr.array[j * 3];
        const dy = positionsAttr.array[i * 3 + 1] - positionsAttr.array[j * 3 + 1];
        const dz = positionsAttr.array[i * 3 + 2] - positionsAttr.array[j * 3 + 2];
        const distSq = dx*dx + dy*dy + dz*dz;

        // Threshold for drawing a line
        if (distSq < 2800) { 
          linePositions.push(
            positionsAttr.array[i * 3], positionsAttr.array[i * 3 + 1], positionsAttr.array[i * 3 + 2],
            positionsAttr.array[j * 3], positionsAttr.array[j * 3 + 1], positionsAttr.array[j * 3 + 2]
          );
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // --- Hero Elements Timeline (only on landing page) ---
  if (document.querySelector('.hero__copy')) {
    const tl = gsap.timeline();
    tl.fromTo(".hero__eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.2);
    tl.fromTo(".hero__copy h1", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 0.4);
    tl.fromTo(".hero__lead", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.6);
    tl.fromTo(".chip-row .chip", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.5)" }, 0.8);
    tl.fromTo(".hero .btn-row a", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 1.0);
    tl.fromTo(".hero__label", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 1.2);
    tl.fromTo(".hero__panel", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 0.6);
    tl.fromTo(".hero__stat-card", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power4.out" }, 1.0);
  }

  // --- Subpage Intro Banner (page-intro) ---
  const pageIntro = document.querySelector('.page-intro');
  if (pageIntro) {
    gsap.fromTo(pageIntro.querySelectorAll('*'),
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3
      }
    );
  }

  // --- Section Headers Reveal (universal) ---
  gsap.utils.toArray('.section__intro').forEach(intro => {
    gsap.fromTo(intro.querySelectorAll('*'), 
      { y: 30, opacity: 0 }, 
      {
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: intro,
          start: "top 85%"
        }
      }
    );
  });

  // --- Stagger Cards (universal — .card, .story-card, .case-card, .stack-card, .cert-card) ---
  gsap.utils.toArray('.card-grid, .constellation__grid, .project-grid, .stack-grid, .cert-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.card, .story-card, .case-card, .stack-card, .cert-card');
    if (cards.length) {
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 82%"
          }
        }
      );
    }
  });

  // --- Timeline Items (universal) ---
  const timelineItems = document.querySelectorAll('.timeline__item');
  if (timelineItems.length) {
    gsap.fromTo(timelineItems, 
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 80%"
        }
      }
    );
  }

  // --- Mosaic Items (hobbies page) ---
  const mosaicItems = document.querySelectorAll('.mosaic__item');
  if (mosaicItems.length) {
    gsap.fromTo(mosaicItems,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".mosaic",
          start: "top 80%"
        }
      }
    );
  }

  // --- CTA Section (universal) ---
  const ctaSections = document.querySelectorAll('.cta');
  ctaSections.forEach(cta => {
    gsap.fromTo(cta.querySelectorAll('*'),
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cta,
          start: "top 85%"
        }
      }
    );
  });
}
