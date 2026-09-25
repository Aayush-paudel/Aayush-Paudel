/**
 * Loading screen — animated progress + a tiny Three.js wireframe object.
 * Runs before the main hero scene boots, then fades out.
 */
(function () {
  const loader = document.getElementById('loader');
  const barFill = document.getElementById('loader-bar-fill');
  const pctLabel = document.getElementById('loader-pct');
  const initials = document.getElementById('loader-initials');

  if (window.SITE_DATA && SITE_DATA.PERSONAL_INFO && SITE_DATA.PERSONAL_INFO.initials) {
    initials.textContent = SITE_DATA.PERSONAL_INFO.initials;
  }

  // --- tiny wireframe scene on the loader canvas ---
  let loaderScene, loaderCamera, loaderRenderer, loaderMesh, loaderRaf;
  function initLoaderScene() {
    const canvas = document.getElementById('loader-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    loaderScene = new THREE.Scene();
    loaderCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    loaderCamera.position.z = 4;

    loaderRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    loaderRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    loaderRenderer.setSize(window.innerWidth, window.innerHeight);

    const geo = new THREE.IcosahedronGeometry(1.3, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x4cf3ff, wireframe: true, transparent: true, opacity: 0.55 });
    loaderMesh = new THREE.Mesh(geo, mat);
    loaderScene.add(loaderMesh);

    animateLoader();
  }

  function animateLoader() {
    if (!loaderMesh) return;
    loaderMesh.rotation.x += 0.004;
    loaderMesh.rotation.y += 0.006;
    loaderRenderer.render(loaderScene, loaderCamera);
    loaderRaf = requestAnimationFrame(animateLoader);
  }

  function destroyLoaderScene() {
    if (loaderRaf) cancelAnimationFrame(loaderRaf);
    if (loaderRenderer) loaderRenderer.dispose();
  }

  initLoaderScene();

  // --- fake-but-honest progress: track real asset loads, floor with a minimum time ---
  let progress = 0;
  const target = { value: 0 };
  const minDuration = 1400; // ms — keeps the loader from flashing on fast connections
  const start = performance.now();

  function tick() {
    const elapsed = performance.now() - start;
    const timeProgress = Math.min(1, elapsed / minDuration);
    progress = Math.max(progress, timeProgress * 0.92); // ease toward 92% on time alone
    const pct = Math.round(progress * 100);
    barFill.style.width = pct + '%';
    pctLabel.textContent = pct + '%';

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }
  requestAnimationFrame(tick);

  window.addEventListener('load', () => {
    const elapsed = performance.now() - start;
    const remaining = Math.max(0, minDuration - elapsed);
    setTimeout(finishLoading, remaining);
  });

  // Fallback in case `load` never fires cleanly
  setTimeout(finishLoading, 6000);

  let finished = false;
  function finishLoading() {
    if (finished) return;
    finished = true;
    progress = 1;
    barFill.style.width = '100%';
    pctLabel.textContent = '100%';

    setTimeout(() => {
      loader.classList.add('hidden');
      destroyLoaderScene();
      document.body.classList.add('loaded');
      window.dispatchEvent(new CustomEvent('site:loaded'));
    }, 350);
  }

  window.addEventListener('resize', () => {
    if (!loaderRenderer) return;
    loaderCamera.aspect = window.innerWidth / window.innerHeight;
    loaderCamera.updateProjectionMatrix();
    loaderRenderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
