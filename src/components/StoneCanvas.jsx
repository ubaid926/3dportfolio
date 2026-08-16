import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * StoneCanvas – Loads the stone_wall_texture GLTF model from /public/models.
 *
 * progress (0 → 1):
 *   0.00 – 0.05 : stone invisible
 *   0.05 – 1.00 : stone flies from far distance toward viewer, rotating
 */
const StoneCanvas = ({ progress = 0 }) => {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  /* ── Setup ───────────────────────────────────────────────── */
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth || 800;
    const H = el.clientHeight || 600;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    camera.position.set(0, 0.3, 5.5);

    /* ── Cinematic Lighting ──────────────────────────────────── */
    // Key: warm dramatic light from upper right
    const keyLight = new THREE.DirectionalLight(0xfff0d0, 3.5);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill: cool blue-grey from lower left
    const fillLight = new THREE.DirectionalLight(0x7799cc, 1.2);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    // Rim: white highlight from behind
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, -4, -6);
    scene.add(rimLight);

    // Storm atmosphere: subtle blue-electric ambient
    scene.add(new THREE.AmbientLight(0x1a2240, 2.0));

    // Electric accent light (cyan-blue flash under the stone)
    const electricLight = new THREE.PointLight(0x40a8ff, 1.8, 20);
    electricLight.position.set(0, -3, 2);
    scene.add(electricLight);

    /* ── Stone mesh placeholder (used before model loads) ─── */
    let stoneMesh = null;

    /* ── GLTF Load ───────────────────────────────────────────── */
    const loader = new GLTFLoader();
    loader.load(
      '/models/stone_wall_texture/scene.gltf',
      (gltf) => {
        const model = gltf.scene;

        // Centre the model on its bounding box
        const box = new THREE.Box3().setFromObject(model);
        const centre = new THREE.Vector3();
        box.getCenter(centre);
        model.position.sub(centre);

        // Normalise size to ~1 unit
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(1 / maxDim);

        // Apply cinematic material tweaks to every mesh
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              // Boost contrast for dramatic look under storm lighting
              child.material.roughness = Math.min(child.material.roughness ?? 0.85, 0.92);
              child.material.metalness = child.material.metalness ?? 0.05;
              child.material.envMapIntensity = 0.4;
            }
          }
        });

        // Start hidden far away
        model.position.set(0.08, 0.6, -70);
        model.scale.setScalar(0.01);
        model.visible = false;

        // Slight initial tilt so it doesn't face flat-on
        model.rotation.x = 0.3;
        model.rotation.z = 0.15;

        scene.add(model);
        stoneMesh = model;

        if (stateRef.current) {
          stateRef.current.stone = model;
        }
      },
      undefined,
      (err) => {
        console.warn('GLTFLoader error, falling back to procedural stone:', err);
        stoneMesh = buildFallbackStone(scene);
        if (stateRef.current) stateRef.current.stone = stoneMesh;
      }
    );

    stateRef.current = { renderer, scene, camera, stone: null };

    /* ── Animate ─────────────────────────────────────────────── */
    let animId;
    let lastTime = 0;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (stoneMesh && stoneMesh.visible) {
        stoneMesh.rotation.y += dt * 0.30;
        stoneMesh.rotation.x += dt * 0.10;
        stoneMesh.rotation.z += dt * 0.05;
      }

      // Subtle electric light pulse
      electricLight.intensity = 1.8 + Math.sin(time * 0.004) * 0.6;

      renderer.render(scene, camera);
    };
    animate(0);

    /* ── Resize ──────────────────────────────────────────────── */
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  /* ── Drive from progress prop ────────────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    if (!s || !s.stone) return;
    const { stone } = s;

    // Stone starts appearing as background transitions past 0.10
    if (progress < 0.10) {
      stone.visible = false;
      return;
    }

    stone.visible = true;

    // Check if mobile screen
    const isMobile = window.innerWidth <= 768 || (mountRef.current && mountRef.current.clientWidth <= 768);

    // Stone completes travel between progress 0.10 and 0.50
    const t = Math.max(0, Math.min(1, (progress - 0.10) / 0.40));

    // Ease-out deceleration
    const eased = 1 - Math.pow(1 - t, 2.8);

    // Target Z, Y, and Scale (compact on mobile so it fits gracefully above cards)
    const targetZ = isMobile ? 1.4 : 1.8;
    const targetY = isMobile ? 0.72 : 0.4;
    const maxScale = isMobile ? 1.05 : 1.75;

    // Z: from -70 → targetZ
    stone.position.z = -70 + eased * (70 + targetZ);

    // Y: settles in optimal visual center
    stone.position.y = targetY - (1 - eased) * 0.2;

    // Scale: from tiny to maxScale
    const sc = 0.01 + eased * maxScale;
    stone.scale.setScalar(sc);

    // Opacity fade-in over first 30% of travel
    stone.traverse((child) => {
      if (child.isMesh && child.material) {
        const op = Math.min(t * 3.5, 1);
        child.material.opacity = op;
        child.material.transparent = op < 1;
      }
    });
  }, [progress]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};

/* ── Procedural fallback (if GLTF fails to load) ────────────── */
function buildFallbackStone(scene) {
  const hash = (n) => { const x = Math.sin(n) * 43758.5453123; return x - Math.floor(x); };
  const noise3 = (x, y, z) => {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const fx = x - ix, fy = y - iy, fz = z - iz;
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz);
    return (
      hash(ix + hash(iy + hash(iz))) * (1 - ux) * (1 - uy) * (1 - uz) +
      hash(ix + 1 + hash(iy + hash(iz))) * ux * (1 - uy) * (1 - uz) +
      hash(ix + hash(iy + 1 + hash(iz))) * (1 - ux) * uy * (1 - uz) +
      hash(ix + 1 + hash(iy + 1 + hash(iz))) * ux * uy * (1 - uz) +
      hash(ix + hash(iy + hash(iz + 1))) * (1 - ux) * (1 - uy) * uz +
      hash(ix + 1 + hash(iy + hash(iz + 1))) * ux * (1 - uy) * uz +
      hash(ix + hash(iy + 1 + hash(iz + 1))) * (1 - ux) * uy * uz +
      hash(ix + 1 + hash(iy + 1 + hash(iz + 1))) * ux * uy * uz
    ) * 2 - 1;
  };
  const fbm = (x, y, z) => {
    let v = 0, amp = 0.5, freq = 1.8, sum = 0;
    for (let i = 0; i < 5; i++) { v += amp * noise3(x * freq, y * freq, z * freq); sum += amp; amp *= 0.52; freq *= 2.1; }
    return v / sum;
  };

  const geo = new THREE.IcosahedronGeometry(1.0, 7);
  const pos = geo.attributes.position;
  const colors = [];
  const base = new THREE.Color('#6b6460'), dark = new THREE.Color('#3a3530');
  const mid = new THREE.Color('#8a8178'), sand = new THREE.Color('#948068');

  for (let i = 0; i < pos.count; i++) {
    const ox = pos.getX(i), oy = pos.getY(i), oz = pos.getZ(i);
    const n1 = fbm(ox * 1.1 + 2.3, oy * 1.1 - 1.7, oz * 1.1 + 0.5);
    const n2 = fbm(ox * 2.8 + 5.1, oy * 2.8 + 3.2, oz * 2.8 - 4.0);
    const n3 = fbm(ox * 6.5 - 3.3, oy * 6.5 + 1.8, oz * 6.5 + 7.2);
    const n4 = fbm(ox * 12.0 + 9.1, oy * 12.0 - 6.5, oz * 12.0 + 2.0);
    const d = 1.0 + n1 * 0.30 + n2 * 0.12 + n3 * 0.05 + n4 * 0.018;
    pos.setXYZ(i, ox * d, oy * d, oz * d);
    const c = base.clone();
    c.lerp(dark, ((n1 + 1) * 0.5) * 0.6);
    c.lerp(mid, ((n2 + 1) * 0.5) * 0.35);
    if (n3 > 0.4) c.lerp(sand, (n3 - 0.4) * 0.8);
    colors.push(c.r, c.g, c.b);
  }
  geo.computeVertexNormals();
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.96, metalness: 0.02 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.position.set(0.08, 0.6, -70);
  mesh.scale.setScalar(0.01);
  mesh.visible = false;
  mesh.rotation.x = 0.4;
  mesh.rotation.z = 0.2;
  scene.add(mesh);
  return mesh;
}

export default StoneCanvas;
