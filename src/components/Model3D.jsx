import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Model3D.css';

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

// ─── USER PORTFOLIO IMAGES (local assets) ─────────────────────────────────────
const SCENERY_URLS = [
  '/textures/img1.jpg', // Alrasul Whey Protein
  '/textures/img2.jpg', // Honor X6C phone
  '/textures/img3.jpg', // Dawae Islami fasting
  '/textures/img4.jpg', // Allah is All-Knowing
  '/textures/img5.jpg', // Lice-Free Salon Hyderabad
  '/textures/img6.jpg', // Rabi-ul-Awwal travel package
  '/textures/img7.jpg', // Arabian Nights perfume box
  '/textures/img8.jpg', // Al-Saad Iternity perfume box
];

// ─── PROCEDURAL SCENERY CANVAS GENERATOR (INSTANT FALLBACK & BASE) ────────────
function createSceneryCanvasTexture(themeIdx) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const themes = [
    // 0: Mountain Sunset
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#2b0938');
      grad.addColorStop(0.5, '#b83b5e');
      grad.addColorStop(1, '#f08a5d');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
      const sunGlow = ctx.createRadialGradient(256, 320, 10, 256, 320, 120);
      sunGlow.addColorStop(0, 'rgba(255, 230, 150, 0.9)');
      sunGlow.addColorStop(1, 'rgba(255, 100, 50, 0)');
      ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(256, 320, 120, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#1a0523';
      ctx.beginPath(); ctx.moveTo(0, 512); ctx.lineTo(0, 360); ctx.lineTo(120, 260); ctx.lineTo(240, 380); ctx.lineTo(380, 240); ctx.lineTo(512, 390); ctx.lineTo(512, 512); ctx.fill();
    },
    // 1: Starry Aurora
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#050a18');
      grad.addColorStop(0.6, '#0a192f');
      grad.addColorStop(1, '#020c1b');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
      const aurora = ctx.createLinearGradient(0, 150, 512, 300);
      aurora.addColorStop(0, 'rgba(0, 255, 170, 0.6)');
      aurora.addColorStop(0.5, 'rgba(0, 200, 255, 0.4)');
      aurora.addColorStop(1, 'rgba(150, 0, 255, 0.5)');
      ctx.fillStyle = aurora;
      ctx.beginPath(); ctx.moveTo(0, 120); ctx.bezierCurveTo(150, 80, 350, 280, 512, 180); ctx.lineTo(512, 380); ctx.bezierCurveTo(300, 420, 100, 220, 0, 320); ctx.fill();
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 80; i++) {
        const sx = (Math.sin(i*12.3)*0.5+0.5)*512;
        const sy = (Math.cos(i*45.6)*0.5+0.5)*350;
        ctx.fillRect(sx, sy, (i%3===0?2.5:1.2), (i%3===0?2.5:1.2));
      }
    },
    // 2: Ocean Sunset
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#3d0c5a');
      grad.addColorStop(0.45, '#e05297');
      grad.addColorStop(0.65, '#ff7b54');
      grad.addColorStop(1, '#0c2440');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
      ctx.fillStyle = 'rgba(255, 200, 100, 0.3)';
      ctx.fillRect(0, 310, 512, 202);
    },
    // 3: Autumn Forest
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#2d0000');
      grad.addColorStop(0.5, '#8c1c13');
      grad.addColorStop(0.85, '#bf4343');
      grad.addColorStop(1, '#1b0000');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    },
    // 4: Desert Dunes
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#190a28');
      grad.addColorStop(0.4, '#6b2d5c');
      grad.addColorStop(0.7, '#e07a5f');
      grad.addColorStop(1, '#3d1308');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
      ctx.fillStyle = '#c8553d';
      ctx.beginPath(); ctx.moveTo(0, 360); ctx.quadraticCurveTo(200, 300, 512, 420); ctx.lineTo(512, 512); ctx.lineTo(0, 512); ctx.fill();
    },
    // 5: Alpine Lake
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0b132b');
      grad.addColorStop(0.5, '#1c2541');
      grad.addColorStop(0.75, '#48cae4');
      grad.addColorStop(1, '#03045e');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    },
    // 6: Cosmic Night Sky
    () => {
      const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 320);
      grad.addColorStop(0, '#7209b7');
      grad.addColorStop(0.5, '#3a0ca3');
      grad.addColorStop(1, '#03071e');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    },
    // 7: Misty Forest
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#10002b');
      grad.addColorStop(0.5, '#5a189a');
      grad.addColorStop(0.8, '#9d4edd');
      grad.addColorStop(1, '#240046');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    },
    // 8: Sunset Canyon
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#3f0008');
      grad.addColorStop(0.5, '#9e0059');
      grad.addColorStop(0.8, '#ff5400');
      grad.addColorStop(1, '#1e0003');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    },
    // 9: Fuji Blossom
    () => {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.5, '#065f46');
      grad.addColorStop(0.8, '#10b981');
      grad.addColorStop(1, '#021f17');
      ctx.fillStyle = grad; ctx.fillRect(0,0,512,512);
    }
  ];

  if (themes[themeIdx % themes.length]) {
    themes[themeIdx % themes.length]();
  }

  const labels = [
    'MOUNTAIN SUNSET', 'STARRY AURORA', 'OCEAN SUNSET', 'AUTUMN FOREST', 'DESERT DUNES',
    'ALPINE LAKE', 'COSMIC NIGHT', 'MISTY FOREST', 'SUNSET CANYON', 'FUJI BLOSSOM'
  ];

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, 464, 464);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.fillRect(40, 420, 432, 50);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(labels[themeIdx % labels.length], 256, 452);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

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
const Model3D = ({ scrollProgress = 0 }) => {
  const mountRef  = useRef(null);
  const scrollRef = useRef(0);

  // Sync scroll value into ref (no re-render needed in RAF loop)
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth  || 520;
    let H = mount.clientHeight || 520;

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // ── Shared uniforms (all panels share same light values) ──────────
    const uniforms = {
      uTime:        { value: 0.0 },
      uLight1Pos:   { value: new THREE.Vector3( 8.5,  7.5, 7.5) },
      uLight2Pos:   { value: new THREE.Vector3(-8.0, -7.5, 7.5) },
      uLight1Dir:   { value: new THREE.Vector3( -0.6, -0.6, -0.8).normalize() },
      uLight2Dir:   { value: new THREE.Vector3(  0.6,  0.6, -0.8).normalize() },
      uLight1Int:   { value: 0.0 },
      uLight2Int:   { value: 0.0 },
      uLight1Color: { value: new THREE.Color('#ffb703') }, // Yellow / Gold Spotlight
      uLight2Color: { value: new THREE.Color('#ffffff') }, // White Spotlight
    };

    // ── Generate Scenery Pool of 10 Textures ───────────────────────────
    const poolTextures = SCENERY_URLS.map((url, idx) => {
      // Create procedural fallback texture first (shows instantly)
      const canvasTex = createSceneryCanvasTexture(idx % 10);

      // Load the local portfolio image
      const loader = new THREE.TextureLoader();
      loader.load(url, (photoTex) => {
        photoTex.colorSpace = THREE.SRGBColorSpace;
        photoTex.needsUpdate = true;
        canvasTex.image = photoTex.image;
        canvasTex.needsUpdate = true;
      });

      return canvasTex;
    });

    // The 4 vertical sides in Three.js BoxGeometry correspond to material indices [0, 1, 4, 5]
    const VERTICAL_SIDE_FACES = [0, 1, 4, 5]; // Right, Left, Front, Back

    // Initial active texture pool index for each of the 6 faces (indices 0-7, pool size = 8)
    // 4 vertical sides [0,1,4,5] start with images 0,1,2,3; top(2)→4; bottom(3)→5
    let currentFaceIndices = [0, 1, 4, 5, 2, 3];

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
    group.scale.set(0.85, 0.85, 0.85);
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

    let nextSideFaceIdx = 0;

    // Timer: Cycle images ONLY on the 4 vertical sides [0, 1, 4, 5] every 2.8 seconds
    const swapInterval = setInterval(() => {
      const targetSideFace = VERTICAL_SIDE_FACES[nextSideFaceIdx];
      nextSideFaceIdx = (nextSideFaceIdx + 1) % VERTICAL_SIDE_FACES.length;

      // Find unused scenery indices in pool that are NOT active on ANY of the 4 vertical sides
      const activeSideSceneries = VERTICAL_SIDE_FACES.map(fIdx => currentFaceIndices[fIdx]);
      const unusedIndices = [];
      for (let i = 0; i < poolTextures.length; i++) {
        if (!activeSideSceneries.includes(i)) {
          unusedIndices.push(i);
        }
      }

      if (unusedIndices.length > 0) {
        const nextPoolIdx = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];

        // Start cross-fade transition on that side
        materials[targetSideFace].uniforms.uNextMap.value = poolTextures[nextPoolIdx];
        transitionState[targetSideFace].active = true;
        transitionState[targetSideFace].progress = 0;
        transitionState[targetSideFace].nextTexIdx = nextPoolIdx;
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

    const yellowGlow = makeGlow('#ffb703', 4.0, new THREE.Vector3( 0.6, 0.6,-0.8));
    const whiteGlow  = makeGlow('#ffffff', 4.0, new THREE.Vector3(-0.6,-0.6,-0.8));

    // ── FIXED BACKGROUND ARCHITECTURAL GRID (STATIC IN BACKGROUND) ─────────────
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.055 });
    const linesGrp = new THREE.Group();
    linesGrp.position.set(0, 0, -3.5); // Fixed deep in the background behind the model
    scene.add(linesGrp);

    const addLine = (x1, y1, z1, x2, y2, z2) => {
      linesGrp.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2),
        ]), lineMat,
      ));
    };

    // Static background architectural grid (Does not rotate with the 3D box)
    for (let x = -14; x <= 14; x += 3.5) {
      addLine(x, -10, 0, x, 10, 0); // Vertical background lines
    }
    for (let y = -9; y <= 9; y += 3) {
      addLine(-14, y, 0, 14, y, 0); // Horizontal background lines
    }
    // Subdued diagonal accent lines
    addLine(-14, 8, 0, 14, -8, 0);
    addLine(-14, -8, 0, 14, 8, 0);
    addLine(-14, 3, 0, 14, -5, 0);
    addLine(-14, -3, 0, 14, 5, 0);

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
      '#ffb703',
      '#ff9100',
      '#ffffff',
      '#e0f2fe',
      '#ffc107',
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

    const ls1 = createLightState(0, 0,  '#ffb703');
    const ls2 = createLightState(2, 60, '#ffffff');

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
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };

    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(mount);
    window.addEventListener('resize', onResize);

    // ── Animate ───────────────────────────────────────────────────────
    let animId, t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.012;

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

      yellowGlow.position.set(light1Pos.x * 0.22, light1Pos.y * 0.22, -0.9);
      yellowGlow.material.uniforms.uIntensity.value = ls1.int * 0.32;
      yellowGlow.material.uniforms.uColor.value.copy(ls1.color);

      whiteGlow.position.set(light2Pos.x * 0.22, light2Pos.y * 0.22, -0.9);
      whiteGlow.material.uniforms.uIntensity.value = ls2.int * 0.28;
      whiteGlow.material.uniforms.uColor.value.copy(ls2.color);

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

  return (
    <div className="model3d__wrapper">
      <div className="model3d__glow-bg" />
      <div ref={mountRef} className="model3d__canvas-mount" />
      <div className="model3d__label">
        <span className="model3d__label-dot" />
        <span className="model3d__label-text">DRAG TO EXPLORE</span>
      </div>
    </div>
  );
};

export default Model3D;
