import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * StoneCanvas – Realistic rocky boulder rendered via Three.js.
 *
 * progress (0 → 1):
 *   0.00 – 0.10 : stone invisible
 *   0.10 – 1.00 : stone flies from far distance toward viewer, rotating
 *
 * Realism features:
 *  - High-res IcosahedronGeometry (detail 7) for dense mesh
 *  - 4-octave fBm-style noise displacement for natural cragginess
 *  - Vertex color variation (dark grey to sandy tan streaks)
 *  - MeshStandardMaterial: rough matte stone texture
 *  - 3-point dramatic lighting (key/fill/rim) + ambient
 *  - Slow tumble rotation on multiple axes
 */
const StoneCanvas = ({ progress = 0 }) => {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  /* ── Setup ────────────────────────────────────────────── */
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
    renderer.toneMappingExposure = 1.1;
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 1000);
    camera.position.set(0, 0.3, 5.5);

    /* ── Lights ──────────────────────────────────────────── */
    // Warm key light from upper-right
    const keyLight = new THREE.DirectionalLight(0xfff5e8, 3.2);
    keyLight.position.set(4, 7, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Cool blue-grey fill from lower left
    const fillLight = new THREE.DirectionalLight(0x8899bb, 1.1);
    fillLight.position.set(-5, -1, 2);
    scene.add(fillLight);

    // Sharp white rim from behind
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
    rimLight.position.set(1, -3, -5);
    scene.add(rimLight);

    // Soft ambient
    scene.add(new THREE.AmbientLight(0x222233, 1.4));

    // Bottom bounce light (adds depth)
    const bounceLight = new THREE.PointLight(0x553322, 0.9, 15);
    bounceLight.position.set(0, -4, 1);
    scene.add(bounceLight);

    /* ── Stone Geometry ──────────────────────────────────── */
    // High detail icosahedron for dense vertex distribution
    const geo = new THREE.IcosahedronGeometry(1.0, 7);
    const pos = geo.attributes.position;

    // fBm-style multi-octave 3D noise
    const hash = (n) => {
      let x = Math.sin(n) * 43758.5453123;
      return x - Math.floor(x);
    };

    const noise3 = (x, y, z) => {
      const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
      const fx = x - ix, fy = y - iy, fz = z - iz;
      // smoothstep
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      const uz = fz * fz * (3 - 2 * fz);

      const n000 = hash(ix + hash(iy + hash(iz)));
      const n100 = hash(ix + 1 + hash(iy + hash(iz)));
      const n010 = hash(ix + hash(iy + 1 + hash(iz)));
      const n110 = hash(ix + 1 + hash(iy + 1 + hash(iz)));
      const n001 = hash(ix + hash(iy + hash(iz + 1)));
      const n101 = hash(ix + 1 + hash(iy + hash(iz + 1)));
      const n011 = hash(ix + hash(iy + 1 + hash(iz + 1)));
      const n111 = hash(ix + 1 + hash(iy + 1 + hash(iz + 1)));

      return (
        n000 * (1 - ux) * (1 - uy) * (1 - uz) +
        n100 * ux * (1 - uy) * (1 - uz) +
        n010 * (1 - ux) * uy * (1 - uz) +
        n110 * ux * uy * (1 - uz) +
        n001 * (1 - ux) * (1 - uy) * uz +
        n101 * ux * (1 - uy) * uz +
        n011 * (1 - ux) * uy * uz +
        n111 * ux * uy * uz
      ) * 2 - 1;
    };

    const fbm = (x, y, z) => {
      let v = 0, amp = 0.5, freq = 1.8, sum = 0;
      for (let i = 0; i < 5; i++) {
        v += amp * noise3(x * freq, y * freq, z * freq);
        sum += amp;
        amp *= 0.52;
        freq *= 2.1;
      }
      return v / sum;
    };

    // Vertex colors for realistic rock streaking
    const colors = [];
    const stoneBase = new THREE.Color('#6b6460');
    const stoneDark = new THREE.Color('#3a3530');
    const stoneMid  = new THREE.Color('#8a8178');
    const stoneSand = new THREE.Color('#948068');

    for (let i = 0; i < pos.count; i++) {
      const ox = pos.getX(i);
      const oy = pos.getY(i);
      const oz = pos.getZ(i);

      // Large-scale shape (0.3 amplitude → bulges and hollows)
      const n1 = fbm(ox * 1.1 + 2.3, oy * 1.1 - 1.7, oz * 1.1 + 0.5);
      // Medium detail (surface features)
      const n2 = fbm(ox * 2.8 + 5.1, oy * 2.8 + 3.2, oz * 2.8 - 4.0);
      // Fine detail (pitting / surface roughness)
      const n3 = fbm(ox * 6.5 - 3.3, oy * 6.5 + 1.8, oz * 6.5 + 7.2);
      // Crack-like variation
      const n4 = fbm(ox * 12.0 + 9.1, oy * 12.0 - 6.5, oz * 12.0 + 2.0);

      const displacement = 1.0 + n1 * 0.30 + n2 * 0.12 + n3 * 0.05 + n4 * 0.018;
      pos.setXYZ(i, ox * displacement, oy * displacement, oz * displacement);

      // Color: mix based on noise
      const colorT = (n1 + 1) * 0.5;
      const colorT2 = (n2 + 1) * 0.5;
      let c = stoneBase.clone();
      c.lerp(stoneDark, colorT * 0.6);
      c.lerp(stoneMid, colorT2 * 0.35);
      if (n3 > 0.4) c.lerp(stoneSand, (n3 - 0.4) * 0.8);
      colors.push(c.r, c.g, c.b);
    }

    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.96,
      metalness: 0.02,
      // Simulate micro-surface detail via roughness variation
    });

    const stone = new THREE.Mesh(geo, mat);
    stone.castShadow = true;
    stone.position.set(0.08, 0.6, -70);
    stone.scale.setScalar(0.01);
    stone.visible = false;
    scene.add(stone);

    // Keep initial rotation so stone doesn't always face same way
    stone.rotation.x = 0.4;
    stone.rotation.z = 0.2;

    stateRef.current = { renderer, scene, camera, stone };

    /* ── Animate loop ────────────────────────────────────── */
    let animId;
    let lastTime = 0;

    const animate = (time) => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (stone.visible) {
        stone.rotation.y += dt * 0.38;
        stone.rotation.x += dt * 0.12;
        stone.rotation.z += dt * 0.07;
      }

      renderer.render(scene, camera);
    };
    animate(0);

    /* ── Resize ──────────────────────────────────────────── */
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
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  /* ── Drive from progress prop ─────────────────────────── */
  useEffect(() => {
    const s = stateRef.current;
    if (!s) return;
    const { stone } = s;

    if (progress < 0.08) {
      stone.visible = false;
      return;
    }

    stone.visible = true;

    // local t: 0.08→1.0 maps to 0→1
    const t = Math.min((progress - 0.08) / 0.92, 1);

    // Smooth ease-out curve — stone decelerates as it gets close
    const eased = 1 - Math.pow(1 - t, 2.6);

    // Z: from -70 → 2.2 (very close, feels massive)
    stone.position.z = -70 + eased * 72.2;

    // Y: starts higher (coming from above horizon) and settles
    stone.position.y = 0.6 + eased * 0.3;

    // Scale: tiny speck → large boulder
    const sc = 0.01 + eased * 1.65;
    stone.scale.setScalar(sc);

    // Fade in opacity over first 20% of travel
    stone.material.opacity = Math.min(t * 5, 1);
    stone.material.transparent = stone.material.opacity < 1;
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

export default StoneCanvas;
