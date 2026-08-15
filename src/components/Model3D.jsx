import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './Model3D.css';

import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';

// ─── Rounded rect shape ───────────────────────────────────────────────────────
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  s.moveTo(-hw + r, -hh);
  s.lineTo(hw - r, -hh);
  s.quadraticCurveTo(hw, -hh, hw, -hh + r);
  s.lineTo(hw, hh - r);
  s.quadraticCurveTo(hw, hh, hw - r, hh);
  s.lineTo(-hw + r, hh);
  s.quadraticCurveTo(-hw, hh, -hw, hh - r);
  s.lineTo(-hw, -hh + r);
  s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
  return s;
}

// ─── USER PORTFOLIO IMAGES (from src/assets) ──────────────────────────────────
const SCENERY_URLS = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
];

// ─── VERTEX SHADER ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos     = worldPos.xyz;
    vNormal       = normalize(mat3(transpose(inverse(modelMatrix))) * normal);
    vViewDir      = normalize(cameraPosition - worldPos.xyz);
    gl_Position   = projectionMatrix * viewMatrix * worldPos;
  }
`;

// ─── FRAGMENT SHADER ──────────────────────────────────────────────────────────
// Dark sleek graphite base + texture blend + corner spotlights (Yellow & White)
const fragmentShader = /* glsl */`
  uniform float uTime;
  uniform sampler2D uMap;
  uniform sampler2D uNextMap;
  uniform float uBlend;
  uniform bool uHasMap;

  uniform vec3  uLight1Pos;
  uniform vec3  uLight2Pos;
  uniform vec3  uLight1Dir;
  uniform vec3  uLight2Dir;
  uniform float uLight1Int;
  uniform float uLight2Int;
  uniform vec3  uLight1Color;
  uniform vec3  uLight2Color;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewDir;
  varying vec2 vUv;

  vec3 calcSpotlight(vec3 N, vec3 V, vec3 lPos, vec3 lDir, float coneAngle, float lInt, vec3 lColor) {
    vec3  L    = lPos - vWorldPos;
    float dist = length(L);
    L          = normalize(L);

    float att  = exp(-dist * 0.22);
    float spotEffect = dot(normalize(-lDir), L);
    float spotFactor = smoothstep(cos(coneAngle), cos(coneAngle * 0.3), spotEffect);

    float diff = pow(max(dot(N, L), 0.0), 5.5);

    vec3  H    = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 120.0);

    float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float edgeGlow = fresnel * pow(max(dot(N, L), 0.0), 2.2) * 4.5;

    return lColor * (diff * 0.25 + spec * 1.8 + edgeGlow * 2.0) * att * spotFactor * lInt;
  }

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDir);

    vec3 base = vec3(0.015, 0.018, 0.022);
    if (uHasMap) {
      vec4 texColor1 = texture2D(uMap, vUv);
      vec4 texColor2 = texture2D(uNextMap, vUv);
      vec4 finalTex  = mix(texColor1, texColor2, uBlend);
      base = mix(base, finalTex.rgb, 0.92);
    }

    float baseFresnel = pow(1.0 - max(dot(N, V), 0.0), 4.2);
    vec3 metallicRim  = vec3(0.08, 0.10, 0.14) * baseFresnel;

    vec3 light1 = calcSpotlight(N, V, uLight1Pos, uLight1Dir, 0.32, uLight1Int, uLight1Color);
    vec3 light2 = calcSpotlight(N, V, uLight2Pos, uLight2Dir, 0.28, uLight2Int, uLight2Color);

    vec3 color = base + metallicRim + light1 + light2;

    float ambient = max(dot(N, vec3(0.0, 1.0, 0.5)), 0.0) * 0.015;
    color += vec3(0.04, 0.05, 0.07) * ambient;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── GLOW SPRITE: additive soft bloom behind panels ──────────────────────────
const glowVert = /* glsl */`
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`;
const glowFrag = /* glsl */`
  uniform float uIntensity;
  uniform vec3  uColor;
  varying vec2 vUv;
  void main(){
    float d    = length(vUv - 0.5);
    float glow = exp(-d * 4.5) * uIntensity;
    gl_FragColor = vec4(uColor * glow, glow * 0.85);
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const Model3D = ({ scrollProgress = 0, portfolioImage }) => {
  const mountRef  = useRef(null);
  const scrollRef = useRef(0);
  // Reactive copy for the HTML frame (causes re-render on scroll, lightweight)
  const [frameProgress, setFrameProgress] = useState(0);

  // Mouse-tilt state for holographic card
  const frameRef   = useRef(null);
  const tiltRafRef = useRef(null);
  const tiltTarget = useRef({ x: 0, y: 0 });
  const tiltCurrent = useRef({ x: 0, y: 0 });

  // Sync scroll value into ref (no re-render needed in RAF loop)
  // Also push into state for the HTML frame overlay
  useEffect(() => {
    scrollRef.current = scrollProgress;
    setFrameProgress(scrollProgress);
  }, [scrollProgress]);

  /* ── Mouse-tracking 3D tilt for holographic frame ── */
  useEffect(() => {
    const onMove = (e) => {
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      tiltTarget.current = { x: dy * -22, y: dx * 22 };
    };
    const onLeave = () => {
      tiltTarget.current = { x: 0, y: 0 };
    };

    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      const el = frameRef.current;
      if (el) {
        tiltCurrent.current.x = lerp(tiltCurrent.current.x, tiltTarget.current.x, 0.08);
        tiltCurrent.current.y = lerp(tiltCurrent.current.y, tiltTarget.current.y, 0.08);
        el.style.setProperty('--tilt-x', `${tiltCurrent.current.x}deg`);
        el.style.setProperty('--tilt-y', `${tiltCurrent.current.y}deg`);
        // Move holographic sheen based on tilt
        const sheenX = 50 + tiltCurrent.current.y * 1.2;
        const sheenY = 50 + tiltCurrent.current.x * 1.2;
        el.style.setProperty('--sheen-x', `${sheenX}%`);
        el.style.setProperty('--sheen-y', `${sheenY}%`);
      }
      tiltRafRef.current = requestAnimationFrame(tick);
    };
    tiltRafRef.current = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(tiltRafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth  || 520;
    let H = mount.clientHeight || 520;

    // ── Responsive helpers — recalculated on every resize ─────────────
    // Group scale: balanced medium scale on mobile so it looks proportional behind text
    const getGroupScale = (w) => {
      if (w <= 480) return 0.62;
      if (w <= 768) return 0.70;
      if (w <= 1024) return 0.80;
      return 0.85;
    };
    // Camera Z distance: optimal viewing distance
    const getCameraZ = (w) => {
      if (w <= 480) return 8.8;
      if (w <= 768) return 8.4;
      if (w <= 1024) return 8.2;
      return 8.2;
    };
    // FOV: balanced perspective
    const getCameraFov = (w) => {
      if (w <= 480) return 42;
      if (w <= 768) return 40;
      if (w <= 1024) return 38;
      return 38;
    };

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(getCameraFov(W), W / H, 0.1, 100);
    camera.position.set(0, 0, getCameraZ(W));

    // ── Shared uniforms (all panels share same light values) ──────────
    const uniforms = {
      uTime:        { value: 0.0 },
      uLight1Pos:   { value: new THREE.Vector3( 8.5,  7.5, 7.5) },
      uLight2Pos:   { value: new THREE.Vector3(-8.0, -7.5, 7.5) },
      uLight1Dir:   { value: new THREE.Vector3( -0.6, -0.6, -0.8).normalize() },
      uLight2Dir:   { value: new THREE.Vector3(  0.6,  0.6, -0.8).normalize() },
      uLight1Int:   { value: 0.0 },
      uLight2Int:   { value: 0.0 },
      uLight1Color: { value: new THREE.Color('#38bdf8') }, // Electric Cyan/Blue Spotlight
      uLight2Color: { value: new THREE.Color('#60a5fa') }, // Soft Blue Spotlight
    };

    // ── Load Texture Pool directly from src/assets ──────────────────────
    const loader = new THREE.TextureLoader();
    const poolTextures = SCENERY_URLS.map((url) => {
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });

    // All 6 faces of the 3D cube model: 0:Right, 1:Left, 2:Top, 3:Bottom, 4:Front, 5:Back
    const ALL_SIX_FACES = [0, 1, 2, 3, 4, 5];

    // Initial active texture pool index for each of the 6 faces (indices 0 to 5)
    let currentFaceIndices = [0, 1, 2, 3, 4, 5];

    // Create 6 face materials with initial textures & blend uniforms
    const materials = currentFaceIndices.map((texIdx) => {
      const tex = poolTextures[texIdx];
      return new THREE.ShaderMaterial({
        uniforms: {
          ...uniforms,
          uMap:     { value: tex },
          uNextMap: { value: tex },
          uBlend:   { value: 0.0 },
          uHasMap:  { value: true },
        },
        vertexShader,
        fragmentShader,
      });
    });

    // ── Build 6 3D Face Panels that form Box at Home & Explode on Scroll ──
    const group = new THREE.Group();
    group.scale.setScalar(getGroupScale(W));
    scene.add(group);

    const panelGeo = new THREE.BoxGeometry(2.3, 2.3, 0.12);

    const panelRight  = new THREE.Mesh(panelGeo, materials[0]);
    const panelLeft   = new THREE.Mesh(panelGeo, materials[1]);
    const panelTop    = new THREE.Mesh(panelGeo, materials[2]);
    const panelBottom = new THREE.Mesh(panelGeo, materials[3]);
    const panelFront  = new THREE.Mesh(panelGeo, materials[4]);
    const panelBack   = new THREE.Mesh(panelGeo, materials[5]);

    group.add(panelRight, panelLeft, panelTop, panelBottom, panelFront, panelBack);

    // ── Base positions (Home: forms solid closed 3D Box) ───────────────
    const slabHome = [
      { mesh: panelRight,  px:  1.15, py:  0.00, pz:  0.00, rx:  0.00, ry:  Math.PI/2, rz: 0.00 },
      { mesh: panelLeft,   px: -1.15, py:  0.00, pz:  0.00, rx:  0.00, ry: -Math.PI/2, rz: 0.00 },
      { mesh: panelTop,    px:  0.00, py:  1.15, pz:  0.00, rx: -Math.PI/2, ry:  0.00, rz: 0.00 },
      { mesh: panelBottom, px:  0.00, py: -1.15, pz:  0.00, rx:  Math.PI/2, ry:  0.00, rz: 0.00 },
      { mesh: panelFront,  px:  0.00, py:  0.00, pz:  1.15, rx:  0.00, ry:  0.00,      rz: 0.00 },
      { mesh: panelBack,   px:  0.00, py:  0.00, pz: -1.15, rx:  0.00, ry:  Math.PI,   rz: 0.00 },
    ];

    // ── Explode / Collapse targets on scroll (TRIONN style) ────────────
    const slabExplode = [
      { px:  4.8, py:  2.2, pz: -1.8, rx:  0.8, ry:  1.6, rz:  0.4 }, // panelRight → Top Right
      { px: -5.2, py:  2.5, pz: -2.2, rx: -0.6, ry: -1.4, rz: -0.5 }, // panelLeft → Top Left
      { px:  0.6, py:  5.2, pz: -3.2, rx:  1.4, ry:  0.3, rz:  0.6 }, // panelTop → Top Center
      { px: -0.5, py: -5.2, pz: -2.8, rx: -1.2, ry: -0.4, rz: -0.5 }, // panelBottom → Bottom Center
      { px:  3.8, py: -3.6, pz:  2.2, rx:  0.9, ry: -0.8, rz:  0.6 }, // panelFront → Bottom Right
      { px: -4.2, py: -3.8, pz: -2.5, rx: -1.0, ry:  0.9, rz: -0.7 }, // panelBack → Bottom Left
    ];

    // ── Texture Transition State Tracker for 6 materials ─────────────
    const transitionState = materials.map(() => ({
      active: false,
      progress: 0,
      nextTexIdx: -1,
    }));

    let nextFaceIdx = 0;

    // Timer: Cycle images across ALL 6 sides every 2.8 seconds
    const swapInterval = setInterval(() => {
      const targetFace = ALL_SIX_FACES[nextFaceIdx];
      nextFaceIdx = (nextFaceIdx + 1) % ALL_SIX_FACES.length;

      // Find unused asset image indices in pool that are NOT active on ANY of the 6 sides
      const activeImages = ALL_SIX_FACES.map(fIdx => currentFaceIndices[fIdx]);
      const unusedIndices = [];
      for (let i = 0; i < poolTextures.length; i++) {
        if (!activeImages.includes(i)) {
          unusedIndices.push(i);
        }
      }

      if (unusedIndices.length > 0) {
        const nextPoolIdx = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];

        // Start cross-fade transition on that side
        materials[targetFace].uniforms.uNextMap.value = poolTextures[nextPoolIdx];
        transitionState[targetFace].active = true;
        transitionState[targetFace].progress = 0;
        transitionState[targetFace].nextTexIdx = nextPoolIdx;
      }
    }, 2800);

    // ── Glow sprites (dynamic color bloom behind active light angle) ─
    const makeGlow = (color, size, pos) => {
      const mat = new THREE.ShaderMaterial({
        uniforms: { uIntensity: { value: 0.0 }, uColor: { value: new THREE.Color(color) } },
        vertexShader: glowVert,
        fragmentShader: glowFrag,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), mat);
      m.position.copy(pos);
      scene.add(m);
      return m;
    };

    const blueGlow1 = makeGlow('#38bdf8', 4.0, new THREE.Vector3( 0.6, 0.6,-0.8));
    const blueGlow2 = makeGlow('#60a5fa', 4.0, new THREE.Vector3(-0.6,-0.6,-0.8));

    // ── ANIMATED DYNAMIC 3D CYBER NET GRID ─────────────────────────────────────
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    const linesGrp = new THREE.Group();
    linesGrp.position.set(0, 0, -3.5);
    scene.add(linesGrp);

    const animatedLines = [];

    const addSegmentedLine = (x1, y1, x2, y2, segments = 16) => {
      const positions = new Float32Array((segments + 1) * 3);
      const initialCoords = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = 0;
        initialCoords.push({ x, y });
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const lineMesh = new THREE.Line(geo, lineMat);
      linesGrp.add(lineMesh);

      animatedLines.push({ geo, initialCoords, positions });
    };

    // Build vertical and horizontal grid lines
    const gridNodes = [];
    for (let x = -14; x <= 14; x += 3.5) {
      addSegmentedLine(x, -10, x, 10, 20);
    }
    for (let y = -9; y <= 9; y += 3) {
      addSegmentedLine(-14, y, 14, y, 24);
    }
    // Subdued diagonal accent lines
    addSegmentedLine(-14, 8, 14, -8, 20);
    addSegmentedLine(-14, -8, 14, 8, 20);
    addSegmentedLine(-14, 3, 14, -5, 20);
    addSegmentedLine(-14, -3, 14, 5, 20);

    // Glowing Node Dots at Grid Intersections
    const nodePositions = [];
    for (let x = -14; x <= 14; x += 3.5) {
      for (let y = -9; y <= 9; y += 3) {
        nodePositions.push(x, y, 0);
        gridNodes.push({ x, y });
      }
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.13,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    linesGrp.add(nodePoints);

    // ── ELECTRIC CURRENT PULSES TRAVELING ALONG NET LINES ──────────────────────
    const NUM_PULSES = 16;
    const currentPulses = [];
    const PULSE_COLORS = [0x00f0ff, 0x38bdf8, 0xffaa00, 0xffffff, 0x60a5fa, 0xff7700];

    const getInterpolatedPointOnLine = (lineData, tNorm) => {
      const { initialCoords } = lineData;
      const count = initialCoords.length;
      if (count < 2) return { x: 0, y: 0 };
      const clampedT = Math.max(0, Math.min(1, tNorm));
      const idxF = clampedT * (count - 1);
      const idx1 = Math.floor(idxF);
      const idx2 = Math.min(idx1 + 1, count - 1);
      const subT = idxF - idx1;
      const p1 = initialCoords[idx1];
      const p2 = initialCoords[idx2];
      return {
        x: p1.x + (p2.x - p1.x) * subT,
        y: p1.y + (p2.y - p1.y) * subT,
      };
    };

    const resetPulse = (pulse) => {
      pulse.lineIndex = Math.floor(Math.random() * animatedLines.length);
      pulse.progress = -Math.random() * 0.4;
      pulse.speed = 0.006 + Math.random() * 0.010;
      pulse.length = 0.12 + Math.random() * 0.18;
      const colHex = PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)];
      pulse.mesh.material.color.setHex(colHex);
    };

    for (let i = 0; i < NUM_PULSES; i++) {
      const pulseGeo = new THREE.BufferGeometry();
      const pulsePos = new Float32Array(8 * 3); // 8-segment smooth glowing current trail
      pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));

      const pulseMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const pulseMesh = new THREE.Line(pulseGeo, pulseMat);
      linesGrp.add(pulseMesh);

      const pulse = {
        mesh: pulseMesh,
        geo: pulseGeo,
        positions: pulsePos,
        lineIndex: 0,
        progress: 0,
        speed: 0.01,
        length: 0.18,
      };
      resetPulse(pulse);
      currentPulses.push(pulse);
    }

    // ── REALISTIC LIGHTNING ARC SYSTEM (TRIONN REFERENCE STYLE) ────────────────
    const lightningGrp = new THREE.Group();
    lightningGrp.position.set(0, 0, -3.4);
    scene.add(lightningGrp);

    const activeLightningBolts = [];

    // Midpoint displacement to generate jagged realistic lightning bolt points
    const subdivideBolt = (p1, p2, displacement, depth) => {
      if (depth === 0) return [p1, p2];
      const mid = p1.clone().lerp(p2, 0.5);
      // Perpendicular jitter (cross product with z axis gives 2D perpendicular)
      const dir = p2.clone().sub(p1);
      const perp = new THREE.Vector3(-dir.y, dir.x, 0).normalize();
      const offset = (Math.random() - 0.5) * displacement;
      mid.addScaledVector(perp, offset);
      return [
        ...subdivideBolt(p1, mid, displacement * 0.6, depth - 1),
        ...subdivideBolt(mid, p2, displacement * 0.6, depth - 1).slice(1),
      ];
    };

    const spawnBolt = (start, end, layerOpacityScale = 1.0, depth = 4, isRoot = true) => {
      const points = subdivideBolt(start, end, start.distanceTo(end) * 0.42, depth);
      const decay  = 0.045 + Math.random() * 0.055;

      // Layer 1: wide cyan outer glow
      const geoGlow = new THREE.BufferGeometry().setFromPoints(points);
      const matGlow = new THREE.LineBasicMaterial({
        color: 0x00bfff,
        transparent: true,
        opacity: 0.28 * layerOpacityScale,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const meshGlow = new THREE.Line(geoGlow, matGlow);
      lightningGrp.add(meshGlow);
      activeLightningBolts.push({ lineMesh: meshGlow, geo: geoGlow, life: 1.0, decay, baseOpacity: 0.28 * layerOpacityScale });

      // Layer 2: medium bright cyan
      const geoMid = new THREE.BufferGeometry().setFromPoints(points);
      const matMid = new THREE.LineBasicMaterial({
        color: 0x55d4ff,
        transparent: true,
        opacity: 0.55 * layerOpacityScale,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const meshMid = new THREE.Line(geoMid, matMid);
      lightningGrp.add(meshMid);
      activeLightningBolts.push({ lineMesh: meshMid, geo: geoMid, life: 1.0, decay, baseOpacity: 0.55 * layerOpacityScale });

      // Layer 3: tight white hot core
      const geoCore = new THREE.BufferGeometry().setFromPoints(points);
      const matCore = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9 * layerOpacityScale,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const meshCore = new THREE.Line(geoCore, matCore);
      lightningGrp.add(meshCore);
      activeLightningBolts.push({ lineMesh: meshCore, geo: geoCore, life: 1.0, decay, baseOpacity: 0.9 * layerOpacityScale });

      // Spawn recursive branches off mid-points of the bolt (realistic fork lightning)
      if (isRoot) {
        const numBranches = 1 + Math.floor(Math.random() * 3);
        for (let b = 0; b < numBranches; b++) {
          const t = 0.25 + Math.random() * 0.55;
          const branchStart = new THREE.Vector3().lerpVectors(start, end, t);
          const dir = end.clone().sub(start).normalize();
          const perp = new THREE.Vector3(-dir.y, dir.x, 0);
          const bLen = start.distanceTo(end) * (0.25 + Math.random() * 0.35);
          const branchEnd = branchStart.clone()
            .addScaledVector(dir, bLen * 0.5)
            .addScaledVector(perp, (Math.random() - 0.5) * bLen * 1.4);
          spawnBolt(branchStart, branchEnd, layerOpacityScale * 0.55, 3, false);
        }
      }
    };

    // Convert NDC mouse position → scene world coords (at z = -3.4 plane)
    const ndcToWorld = (nx, ny) => new THREE.Vector3(nx * 8.5, ny * 5.0, 0);

    const triggerElectricCurrentAt = (nx, ny) => {
      const end = ndcToWorld(nx, ny);
      // Pick a random grid-snapped node as bolt origin
      const gx = Math.round((nx * 8.5) / 3.5) * 3.5 + (Math.random() > 0.5 ? 3.5 : -3.5);
      const gy = Math.round((ny * 5.0) / 3.0) * 3.0 + (Math.random() > 0.5 ? 3.0 : -3.0);
      const start = new THREE.Vector3(gx, gy, 0);
      spawnBolt(start, end, 1.0, 4, true);
    };

    // ── Discrete light positions targeting specific model corners ─────────────────
    const LIGHT_POSITIONS = [
      { name: 'top-right',    pos: [  3.5,  3.5, 3.8] },
      { name: 'top-left',     pos: [ -3.5,  3.5, 3.8] },
      { name: 'bottom-left',  pos: [ -3.2, -3.5, 3.8] },
      { name: 'bottom-right', pos: [  3.2, -3.5, 3.8] },
      { name: 'bottom-center',pos: [  0.0, -4.2, 3.5] },
      { name: 'top-center',   pos: [  0.0,  4.2, 3.5] },
    ];

    const ALL_COLORS = [
      '#38bdf8',
      '#2563eb',
      '#60a5fa',
      '#00bfff',
      '#93c5fd',
    ];

    const pickRandomPos = (currentIdx) => {
      let n;
      do { n = Math.floor(Math.random() * LIGHT_POSITIONS.length); } while (n === currentIdx);
      return n;
    };

    const pickRandomColor = () => ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];

    const createLightState = (initialPosIdx, delayFrames, defaultHexColor) => ({
      idx:        initialPosIdx,
      pos:        new THREE.Vector3(...LIGHT_POSITIONS[initialPosIdx].pos),
      color:      new THREE.Color(defaultHexColor),
      int:        0.0,
      phase:      'fadein',
      frame:      -delayFrames,
      FADEIN:     35,
      HOLD:       90 + Math.floor(Math.random() * 50),
      FADEOUT:    35,
    });

    const ls1 = createLightState(0, 0,  '#38bdf8');
    const ls2 = createLightState(2, 60, '#60a5fa');

    const tickLight = (ls) => {
      ls.frame++;
      if (ls.frame < 0) { ls.int = 0; return; }

      if (ls.phase === 'fadein') {
        ls.int = Math.min(ls.frame / ls.FADEIN, 1.0);
        if (ls.frame >= ls.FADEIN) {
          ls.phase = 'hold';
          ls.frame = 0;
        }
      } else if (ls.phase === 'hold') {
        ls.int = 1.0;
        if (ls.frame >= ls.HOLD) {
          ls.phase = 'fadeout';
          ls.frame = 0;
        }
      } else if (ls.phase === 'fadeout') {
        ls.int = Math.max(1.0 - (ls.frame / ls.FADEOUT), 0.0);
        if (ls.frame >= ls.FADEOUT) {
          ls.int = 0.0;
          ls.idx = pickRandomPos(ls.idx);
          ls.pos.set(...LIGHT_POSITIONS[ls.idx].pos);
          ls.color.setStyle(pickRandomColor());
          ls.phase = 'fadein';
          ls.frame = 0;
          ls.HOLD = 100 + Math.floor(Math.random() * 70);
        }
      }
    };

    // ── Mouse / drag ──────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const tgt = { rx: -0.12, ry: 0.30 };
    const cur = { rx: -0.12, ry: 0.30 };
    let drag = false, autoSpin = true;
    let last = { x:0, y:0 }, vel = { x:0, y:0 };

    let lastSparkTime = 0;
    const onMM  = (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x =  ((e.clientX-r.left)/r.width )*2-1;
      mouse.y = -((e.clientY-r.top) /r.height)*2+1;

      // Trigger electric current arc on mouse movement over grid
      const now = performance.now();
      if (now - lastSparkTime > 45) { // ~22fps spark rate for super smooth crackle
        lastSparkTime = now;
        triggerElectricCurrentAt(mouse.x * 7.5, mouse.y * 4.5);
      }
    };
    const onDown = (e) => {
      drag=true; autoSpin=false;
      last.x=e.clientX; last.y=e.clientY; vel.x=vel.y=0;
      mount.style.cursor='grabbing';
    };
    const onMove = (e) => {
      if(!drag) return;
      vel.x=(e.clientX-last.x)*0.006; vel.y=(e.clientY-last.y)*0.005;
      tgt.ry+=vel.x; tgt.rx+=vel.y;
      last.x=e.clientX; last.y=e.clientY;
    };
    const onUp = () => {
      drag=false; mount.style.cursor='grab';
      setTimeout(()=>{ autoSpin=true; },2200);
    };
    window.addEventListener('mousemove', onMM);
    mount.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      W = mount.clientWidth || 520;
      H = mount.clientHeight || 520;
      // Update camera to match new viewport size
      camera.aspect = W / H;
      camera.fov    = getCameraFov(W);
      camera.position.z = getCameraZ(W);
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      // Rescale the 3D group so the box stays proportional on screen
      group.scale.setScalar(getGroupScale(W));
    };

    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(mount);
    window.addEventListener('resize', onResize);

    // ── Animate ───────────────────────────────────────────────────────
    let animId, t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.012;

      // ── Animate 3D Cyber Net Grid Wave & Parallax ──────────────────────
      const waveT = t * 1.5;
      const mouseW = { x: mouse.x * 7.5, y: mouse.y * 4.5 };

      animatedLines.forEach(({ geo, initialCoords, positions }) => {
        for (let i = 0; i < initialCoords.length; i++) {
          const { x, y } = initialCoords[i];
          const distToM = Math.hypot(x - mouseW.x, y - mouseW.y);
          const mouseWarp = Math.exp(-distToM * 0.35) * 0.45;
          const waveZ = Math.sin(x * 0.35 + waveT) * Math.cos(y * 0.35 + waveT * 0.8) * 0.22;

          positions[i * 3 + 2] = waveZ + mouseWarp;
        }
        geo.attributes.position.needsUpdate = true;
      });

      // Animate node points Z & opacity pulse
      const nodePosAttr = nodeGeo.attributes.position;
      for (let i = 0; i < gridNodes.length; i++) {
        const { x, y } = gridNodes[i];
        const distToM = Math.hypot(x - mouseW.x, y - mouseW.y);
        const mouseWarp = Math.exp(-distToM * 0.35) * 0.45;
        const waveZ = Math.sin(x * 0.35 + waveT) * Math.cos(y * 0.35 + waveT * 0.8) * 0.22;

        nodePosAttr.setZ(i, waveZ + mouseWarp);
      }
      nodePosAttr.needsUpdate = true;

      // ── Animate Electric Current Pulses along Net Lines ────────────────
      currentPulses.forEach((pulse) => {
        pulse.progress += pulse.speed;
        if (pulse.progress - pulse.length > 1.0) {
          resetPulse(pulse);
        }

        const lineData = animatedLines[pulse.lineIndex];
        if (!lineData) return;

        const segs = 7;
        const positions = pulse.positions;

        for (let i = 0; i <= segs; i++) {
          const subFactor = i / segs;
          const currentT = pulse.progress - (1 - subFactor) * pulse.length;
          const pt = getInterpolatedPointOnLine(lineData, currentT);

          const distToM = Math.hypot(pt.x - mouseW.x, pt.y - mouseW.y);
          const mouseWarp = Math.exp(-distToM * 0.35) * 0.45;
          const waveZ = Math.sin(pt.x * 0.35 + waveT) * Math.cos(pt.y * 0.35 + waveT * 0.8) * 0.22;

          positions[i * 3]     = pt.x;
          positions[i * 3 + 1] = pt.y;
          positions[i * 3 + 2] = waveZ + mouseWarp + 0.02; // elevated for vivid electric current glow
        }

        pulse.geo.attributes.position.needsUpdate = true;

        const headT = pulse.progress;
        const opacityScale = headT < 0.1 ? headT / 0.1 : headT > 0.9 ? (1 - headT) / 0.1 : 1.0;
        pulse.mesh.material.opacity = Math.max(0, Math.min(1, opacityScale)) * 0.95;
      });

      // Parallax rotation & subtle opacity pulse on grid net
      linesGrp.rotation.x = Math.sin(t * 0.3) * 0.03 + mouse.y * 0.04;
      linesGrp.rotation.y = Math.cos(t * 0.25) * 0.03 + mouse.x * 0.04;
      lineMat.opacity = 0.07 + Math.sin(t * 1.8) * 0.03;
      nodeMat.opacity = 0.35 + Math.sin(t * 2.2) * 0.15;

      // ── Animate & fade out active electric current lightning arcs ──────
      for (let i = activeLightningBolts.length - 1; i >= 0; i--) {
        const bolt = activeLightningBolts[i];
        bolt.life -= bolt.decay;
        if (bolt.life <= 0) {
          lightningGrp.remove(bolt.lineMesh);
          bolt.geo.dispose();
          bolt.lineMesh.material.dispose();
          activeLightningBolts.splice(i, 1);
        } else {
          // Ease-out fade: fast initial flash then slow trail — like real lightning
          const eased = bolt.life * bolt.life;
          bolt.lineMesh.material.opacity = eased * bolt.baseOpacity;
        }
      }

      // Ambient electric crackle — rare, random, feels like static electricity
      if (Math.random() < 0.022) {
        const nx = (Math.random() - 0.5) * 2.0;
        const ny = (Math.random() - 0.5) * 2.0;
        triggerElectricCurrentAt(nx, ny);
      }

      // Smooth cross-fade texture transitions on faces
      transitionState.forEach((st, faceIdx) => {
        if (!st.active) return;
        st.progress += 0.035;
        if (st.progress >= 1.0) {
          st.progress = 1.0;
          st.active = false;
          materials[faceIdx].uniforms.uMap.value = poolTextures[st.nextTexIdx];
          materials[faceIdx].uniforms.uBlend.value = 0.0;
          currentFaceIndices[faceIdx] = st.nextTexIdx;
        } else {
          materials[faceIdx].uniforms.uBlend.value = st.progress;
        }
      });

      // rotation
      if (autoSpin && !drag) {
        tgt.ry += 0.0045;
        tgt.rx  = -0.08 + mouse.y * 0.10;
      }
      if (!drag) { vel.x *= 0.92; vel.y *= 0.92; }
      cur.rx += (tgt.rx - cur.rx) * 0.058;
      cur.ry += (tgt.ry - cur.ry) * 0.058;
      group.rotation.x = cur.rx;
      group.rotation.y = cur.ry;
      group.position.y = Math.sin(t * 0.5) * 0.08;
      uniforms.uTime.value = t;

      // Tick lights
      tickLight(ls1);
      tickLight(ls2);

      const light1Pos = new THREE.Vector3(
        ls1.pos.x + Math.sin(t * 0.9) * 0.25,
        ls1.pos.y + Math.cos(t * 0.7) * 0.25,
        ls1.pos.z
      );
      const light1Dir = new THREE.Vector3(0, 0, 0).sub(light1Pos).normalize();

      uniforms.uLight1Pos.value.copy(light1Pos);
      uniforms.uLight1Dir.value.copy(light1Dir);
      uniforms.uLight1Int.value = ls1.int * 2.8;
      uniforms.uLight1Color.value.copy(ls1.color);

      const light2Pos = new THREE.Vector3(
        ls2.pos.x + Math.cos(t * 0.8 + 1.2) * 0.25,
        ls2.pos.y + Math.sin(t * 1.0 + 1.2) * 0.25,
        ls2.pos.z
      );
      const light2Dir = new THREE.Vector3(0, 0, 0).sub(light2Pos).normalize();

      uniforms.uLight2Pos.value.copy(light2Pos);
      uniforms.uLight2Dir.value.copy(light2Dir);
      uniforms.uLight2Int.value = ls2.int * 2.4;
      uniforms.uLight2Color.value.copy(ls2.color);

      blueGlow1.position.set(light1Pos.x * 0.22, light1Pos.y * 0.22, -0.9);
      blueGlow1.material.uniforms.uIntensity.value = ls1.int * 0.32;
      blueGlow1.material.uniforms.uColor.value.copy(ls1.color);

      blueGlow2.position.set(light2Pos.x * 0.22, light2Pos.y * 0.22, -0.9);
      blueGlow2.material.uniforms.uIntensity.value = ls2.int * 0.28;
      blueGlow2.material.uniforms.uColor.value.copy(ls2.color);

      // Scroll interpolation
      const sp = scrollRef.current;
      const ease = sp < 0.5
        ? 4 * sp * sp * sp
        : 1 - Math.pow(-2 * sp + 2, 3) / 2;

      slabHome.forEach((h, i) => {
        const e = slabExplode[i];
        const m = h.mesh;
        m.position.x = h.px + (e.px - h.px) * ease;
        m.position.y = h.py + (e.py - h.py) * ease;
        m.position.z = h.pz + (e.pz - h.pz) * ease;

        const osc = 1 - ease;
        m.rotation.x = h.rx + (e.rx - h.rx) * ease + Math.sin(t * 0.48 + i) * 0.013 * osc;
        m.rotation.y = h.ry + (e.ry - h.ry) * ease + Math.sin(t * 0.36 + i * 1.2) * 0.011 * osc;
        m.rotation.z = h.rz + (e.rz - h.rz) * ease + Math.sin(t * 0.40 + i * 0.8) * 0.014 * osc;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      clearInterval(swapInterval);
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── Derive frame transform from scrollProgress ────────────────────────────
  // Same cubic-ease-in-out as the box panels for perfect sync
  const sp = frameProgress;
  const ease = sp < 0.5
    ? 4 * sp * sp * sp
    : 1 - Math.pow(-2 * sp + 2, 3) / 2;

  // At ease=0: frame is tiny and dim, sitting inside the closed box.
  // At ease=1: frame is full-size, centered, fully opaque.
  const frameScale   = 0.16 + ease * 0.84;
  const frameZ       = ease * 90;
  const frameOpacity = 0.0 + ease * 1.0;
  const frameRotY    = (1 - ease) * -24;
  const frameRotX    = (1 - ease) * 10;

  return (
    <div className="model3d__wrapper">
      <div className="model3d__glow-bg" />
      <div ref={mountRef} className="model3d__canvas-mount" />

      {/* ── Portfolio image frame — Holographic 3D card ── */}
      {portfolioImage && (
        <div className="model3d__frame-wrap">
          <div
            ref={frameRef}
            className="model3d__frame"
            style={{
              '--tilt-x': '0deg',
              '--tilt-y': '0deg',
              '--sheen-x': '50%',
              '--sheen-y': '50%',
              transform: `
                perspective(900px)
                translateZ(${frameZ}px)
                rotateY(${frameRotY}deg)
                rotateX(${frameRotX}deg)
                scale(${frameScale})
              `,
              opacity: frameOpacity,
            }}
          >
            {/* Holographic shimmer overlay */}
            <div className="model3d__frame-holo" />

            {/* Scanline overlay */}
            <div className="model3d__frame-scanlines" />

            {/* Glare spot that follows mouse */}
            <div className="model3d__frame-glare" />

            {/* Decorative corner brackets */}
            <span className="model3d__frame-corner model3d__frame-corner--tl" />
            <span className="model3d__frame-corner model3d__frame-corner--tr" />
            <span className="model3d__frame-corner model3d__frame-corner--bl" />
            <span className="model3d__frame-corner model3d__frame-corner--br" />

            {/* Side accent line */}
            <div className="model3d__frame-side-accent" />

            <img
              src={portfolioImage}
              alt="Portfolio owner"
              className="model3d__frame-img"
              draggable={false}
            />

            {/* Data badge row */}
            <div className="model3d__frame-badge">
              <span className="model3d__frame-badge-dot" />
              <span>PORTFOLIO OWNER</span>
              <span className="model3d__frame-badge-sep">|</span>
              <span className="model3d__frame-badge-tag">FULL STACK</span>
            </div>

            {/* Top floating chip */}
            <div className="model3d__frame-chip">
              <span className="model3d__frame-chip-dot" />
              <span>AVAILABLE</span>
            </div>
          </div>
        </div>
      )}

      <div className="model3d__label">
        <span className="model3d__label-dot" />
        <span className="model3d__label-text">DRAG TO EXPLORE</span>
      </div>
    </div>
  );
};

export default Model3D;
