/**
 * Three.js scenes.
 * - HeroScene: wireframe sphere + rings + floating particles that react to
 *   mouse position, scroll and (where available) device orientation.
 * - ContactScene: a lighter particle field behind the contact form.
 * Both scenes reduce particle count / disable heavy effects on mobile and
 * respect prefers-reduced-motion.
 */
(function () {
  if (typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth < 760;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = reducedMotion ? 0 : (isMobile ? 500 : 1600);

  // ---------------------------------------------------------------
  // HERO SCENE
  // ---------------------------------------------------------------
  function createHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const group = new THREE.Group();
    scene.add(group);

    // Central wireframe sphere ("abstract digital planet")
    const sphereGeo = new THREE.IcosahedronGeometry(1.7, isMobile ? 1 : 2);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x4cf3ff, wireframe: true, transparent: true, opacity: 0.32 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // Inner glow core
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x8b6bff, wireframe: true, transparent: true, opacity: 0.5 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Orbiting rings
    const rings = [];
    [2.4, 2.9].forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.008, 8, 120);
      const ringMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0xff4fb8 : 0x8b6bff, transparent: true, opacity: 0.45 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i * 0.4);
      ring.rotation.y = i * 0.3;
      group.add(ring);
      rings.push(ring);
    });

    // Small floating cubes
    const cubes = [];
    if (!isMobile) {
      for (let i = 0; i < 6; i++) {
        const size = 0.08 + Math.random() * 0.1;
        const cubeGeo = new THREE.BoxGeometry(size, size, size);
        const cubeMat = new THREE.MeshBasicMaterial({ color: 0x4cf3ff, wireframe: true, transparent: true, opacity: 0.6 });
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        const angle = (i / 6) * Math.PI * 2;
        const radius = 3.4 + Math.random() * 0.6;
        cube.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2.2, Math.sin(angle) * radius);
        cube.userData.speed = 0.002 + Math.random() * 0.003;
        group.add(cube);
        cubes.push(cube);
      }
    }

    // Particle field
    let particles = null;
    if (particleCount > 0) {
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ color: 0xaab1c5, size: 0.014, transparent: true, opacity: 0.55 });
      particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);
    }

    // Lighting (mostly ambient — materials are basic/wireframe, but kept for future PBR swaps)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const point = new THREE.PointLight(0x4cf3ff, 1.2);
    point.position.set(4, 4, 4);
    scene.add(point);

    let mouseX = 0, mouseY = 0, targetRotX = 0, targetRotY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    if (window.DeviceOrientationEvent && isMobile) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma === null) return;
        mouseX = THREE.MathUtils.clamp(e.gamma / 45, -1, 1);
        mouseY = THREE.MathUtils.clamp(e.beta / 45, -1, 1);
      });
    }

    let scrollFactor = 0;
    window.addEventListener('scroll', () => {
      scrollFactor = Math.min(window.scrollY / window.innerHeight, 1.2);
    }, { passive: true });

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();

      targetRotX += (mouseY * 0.35 - targetRotX) * 0.04;
      targetRotY += (mouseX * 0.35 - targetRotY) * 0.04;

      group.rotation.x = targetRotX + t * 0.03;
      group.rotation.y = targetRotY + t * 0.05;
      group.position.y = -scrollFactor * 1.4;
      group.scale.setScalar(1 - scrollFactor * 0.18);

      core.rotation.y -= 0.01;
      rings.forEach((r, i) => { r.rotation.z += 0.0015 * (i + 1); });
      cubes.forEach((c) => {
        c.rotation.x += c.userData.speed;
        c.rotation.y += c.userData.speed;
      });

      if (particles) {
        particles.rotation.y = t * 0.008;
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else animate();
    });

    return { scene, renderer };
  }

  // ---------------------------------------------------------------
  // CONTACT SCENE — lighter particle drift
  // ---------------------------------------------------------------
  function createContactScene() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas || reducedMotion) return null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const count = isMobile ? 200 : 500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0x8b6bff, size: 0.02, transparent: true, opacity: 0.4 });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let raf;
    function animate() {
      points.rotation.y += 0.0008;
      points.rotation.x += 0.0003;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, renderer };
  }

  window.PortfolioScenes = {
    init() {
      createHeroScene();
      // Contact scene only needs to exist once its section is near viewport —
      // cheap enough to just init on load, but lazy-init keeps first paint fast.
      const contactSection = document.getElementById('contact');
      if (contactSection && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              createContactScene();
              io.disconnect();
            }
          });
        }, { rootMargin: '200px' });
        io.observe(contactSection);
      }
    }
  };
})();
