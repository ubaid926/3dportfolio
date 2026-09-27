import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';
import './Model3D.css';

import img3 from '../assets/(3).jpeg';
import img6 from '../assets/(6).jpeg';

/* ── Texture Generator: Primary Editorial Graphic Poster ── */
function createPoster1Texture(imageSrc) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  function render(loadedImg) {
    // 1. Deep navy architectural gradient background
    const grad = ctx.createLinearGradient(0, 0, 1024, 1440);
    grad.addColorStop(0, '#030d1c');
    grad.addColorStop(0.5, '#061730');
    grad.addColorStop(1, '#020914');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1440);

    // 2. Blueprint / fine microgrid
    ctx.strokeStyle = 'rgba(37, 139, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < 1024; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1440);
      ctx.stroke();
    }
    for (let y = 40; y < 1440; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // 3. Top Header
    ctx.fillStyle = '#F4F7FA';
    ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NEXORA STUDIO', 50, 80);

    ctx.fillStyle = '#8290A3';
    ctx.font = '500 20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('ARCHIVE // 2026', 974, 80);
    ctx.textAlign = 'left';

    // Hairline divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(50, 105);
    ctx.lineTo(974, 105);
    ctx.stroke();

    // 4. Featured Art Frame
    const fx = 50, fy = 135, fw = 924, fh = 680;
    ctx.save();
    ctx.beginPath();
    ctx.rect(fx, fy, fw, fh);
    ctx.clip();

    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      const imgAspect = loadedImg.naturalWidth / loadedImg.naturalHeight;
      const frameAspect = fw / fh;
      let sx = 0, sy = 0, sw = loadedImg.naturalWidth, sh = loadedImg.naturalHeight;
      if (imgAspect > frameAspect) {
        sw = sh * frameAspect;
        sx = (loadedImg.naturalWidth - sw) / 2;
      } else {
        sh = sw / frameAspect;
        sy = (loadedImg.naturalHeight - sh) / 2;
      }
      ctx.drawImage(loadedImg, sx, sy, sw, sh, fx, fy, fw, fh);

      // Dark blue cinematic duotone wash
      ctx.fillStyle = 'rgba(3, 12, 28, 0.35)';
      ctx.fillRect(fx, fy, fw, fh);
      const vGrad = ctx.createLinearGradient(fx, fy, fx, fy + fh);
      vGrad.addColorStop(0, 'rgba(4, 18, 37, 0.15)');
      vGrad.addColorStop(1, 'rgba(4, 18, 37, 0.85)');
      ctx.fillStyle = vGrad;
      ctx.fillRect(fx, fy, fw, fh);
    } else {
      const artGrad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
      artGrad.addColorStop(0, '#051b38');
      artGrad.addColorStop(0.5, '#020b18');
      artGrad.addColorStop(1, '#0b2e59');
      ctx.fillStyle = artGrad;
      ctx.fillRect(fx, fy, fw, fh);

      ctx.beginPath();
      ctx.arc(fx + fw * 0.5, fy + fh * 0.5, 200, 0, Math.PI * 2);
      ctx.strokeStyle = '#258BFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(fx + fw * 0.5, fy + fh * 0.5, 140, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(125, 196, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
    ctx.strokeStyle = 'rgba(37, 139, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(fx, fy, fw, fh);

    // Frame tag
    ctx.fillStyle = '#258BFF';
    ctx.font = '600 16px monospace';
    ctx.fillText('FIG. 01 — IDENTITY SPEC', fx + 16, fy + 32);

    // 5. Lower Content
    ctx.fillStyle = '#F4F7FA';
    ctx.font = '800 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('IDEAS, MADE VISUAL.', 50, 910);

    ctx.fillStyle = '#258BFF';
    ctx.font = '600 24px monospace';
    ctx.fillText('SYSTEM ARCHITECTURE // BRAND IDENTITY', 50, 960);

    // Metadata columns
    ctx.fillStyle = '#8290A3';
    ctx.font = '400 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DISCIPLINE: ART DIRECTION · DIGITAL EXPERIENCES', 50, 1050);
    ctx.fillText('CURATION: SELECTED WORKS 2024–2026', 50, 1085);
    ctx.fillText('STUDIO: NEXORA RESEARCH & CREATIVE LABS', 50, 1120);

    // Big decorative number
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.font = '900 220px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('01', 974, 1150);
    ctx.textAlign = 'left';

    // Swiss Grid Footer
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(50, 1200);
    ctx.lineTo(974, 1200);
    ctx.stroke();

    // Barcode
    let bx = 50;
    const barWidths = [3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 2, 3, 5, 2, 1, 4, 3, 2, 5];
    ctx.fillStyle = 'rgba(244, 247, 250, 0.5)';
    for (const bw of barWidths) {
      ctx.fillRect(bx, 1230, bw, 36);
      bx += bw + 3;
    }

    ctx.fillStyle = '#8290A3';
    ctx.font = '500 16px monospace';
    ctx.fillText('NXR-STUDIO-SYS-2026', 180, 1255);

    ctx.textAlign = 'right';
    ctx.fillText('48°51\'24"N 2°21\'07"E · ALL RIGHTS RESERVED', 974, 1255);
    ctx.textAlign = 'left';
  }

  render(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (imageSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      render(img);
      texture.needsUpdate = true;
    };
    img.src = imageSrc;
  }

  return texture;
}

/* ── Texture Generator: Secondary Monograph Poster ── */
function createPoster2Texture(imageSrc) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  function render(loadedImg) {
    ctx.fillStyle = '#020610';
    ctx.fillRect(0, 0, 1024, 1440);

    const rGrad = ctx.createRadialGradient(800, 300, 50, 800, 300, 600);
    rGrad.addColorStop(0, 'rgba(37, 139, 255, 0.16)');
    rGrad.addColorStop(1, 'rgba(2, 6, 16, 0)');
    ctx.fillStyle = rGrad;
    ctx.fillRect(0, 0, 1024, 1440);

    ctx.fillStyle = '#7DC4FF';
    ctx.font = '700 24px monospace';
    ctx.fillText('DIGITAL SYSTEMS // ARCHIVE', 60, 90);

    ctx.fillStyle = '#8290A3';
    ctx.font = '500 18px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('[VOL. 02]', 964, 90);
    ctx.textAlign = 'left';

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 120);
    ctx.lineTo(964, 120);
    ctx.stroke();

    const gx = 60, gy = 160, gw = 904, gh = 650;
    if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(gx, gy, gw, gh);
      ctx.clip();
      ctx.drawImage(loadedImg, 0, 0, loadedImg.naturalWidth, loadedImg.naturalHeight, gx, gy, gw, gh);
      ctx.fillStyle = 'rgba(2, 6, 16, 0.45)';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.restore();
    } else {
      ctx.fillStyle = '#051326';
      ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = 'rgba(125, 196, 255, 0.25)';
      ctx.lineWidth = 2;
      for (let r = 40; r < 240; r += 40) {
        ctx.beginPath();
        ctx.arc(gx + gw / 2, gy + gh / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = 'rgba(37, 139, 255, 0.3)';
    ctx.strokeRect(gx, gy, gw, gh);

    ctx.fillStyle = '#F4F7FA';
    ctx.font = '800 76px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ART DIRECTION', 60, 920);

    ctx.fillStyle = '#8290A3';
    ctx.font = '400 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('& SPATIAL INTERACTION', 60, 970);

    ctx.fillStyle = '#258BFF';
    ctx.font = '600 20px monospace';
    ctx.fillText('CREATIVE DIRECTION · EXPERIMENTAL LABS', 60, 1050);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(900, 950); ctx.lineTo(940, 950);
    ctx.moveTo(920, 930); ctx.lineTo(920, 970);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(60, 1260); ctx.lineTo(964, 1260);
    ctx.stroke();

    ctx.fillStyle = '#8290A3';
    ctx.font = '500 16px monospace';
    ctx.fillText('NEXORA // VERIFIED GRAPHIC ARCHIVE', 60, 1300);
    ctx.textAlign = 'right';
    ctx.fillText('EDITION 02 / 50', 964, 1300);
    ctx.textAlign = 'left';
  }

  render(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (imageSrc) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      render(img);
      texture.needsUpdate = true;
    };
    img.src = imageSrc;
  }

  return texture;
}

/* ── Texture Generator: Drafting Paper Sheet ── */
function createPaperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  // Off-white tactile paper tone
  ctx.fillStyle = '#f1f5fa';
  ctx.fillRect(0, 0, 1024, 1440);

  // Subtle paper grain
  ctx.fillStyle = 'rgba(15, 23, 42, 0.025)';
  for (let i = 0; i < 3500; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1440;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Left margin drafting ruler
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 60);
  ctx.lineTo(80, 1380);
  ctx.stroke();

  for (let y = 80; y <= 1360; y += 20) {
    const tickLen = (y % 100 === 0) ? 20 : (y % 50 === 0) ? 12 : 6;
    ctx.beginPath();
    ctx.moveTo(80 - tickLen, y);
    ctx.lineTo(80, y);
    ctx.stroke();
  }

  // Corner crop marks
  const mark = (x, y, dx, dy) => {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y - dy); ctx.lineTo(x, y); ctx.lineTo(x - dx, y);
    ctx.stroke();
  };
  mark(40, 40, 20, 20);
  mark(984, 40, -20, 20);
  mark(40, 1400, 20, -20);
  mark(984, 1400, -20, -20);

  // Header
  ctx.fillStyle = '#0f172a';
  ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('DESIGN SPECIFICATION // 04', 120, 120);

  ctx.fillStyle = '#64748b';
  ctx.font = '500 18px monospace';
  ctx.fillText('GRID RATIO: 1.414 · SWISS ARCHITECTURE', 120, 160);

  ctx.strokeStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(120, 190);
  ctx.lineTo(940, 190);
  ctx.stroke();

  // Fine architectural grid lines
  ctx.strokeStyle = '#e2e8f0';
  for (let y = 240; y < 1000; y += 40) {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(940, y);
    ctx.stroke();
  }

  // Type Specimen Content
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('NEXORA TYPE SPECIMEN', 120, 310);

  ctx.font = '400 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText('Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj', 120, 400);
  ctx.fillText('Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt', 120, 455);
  ctx.fillText('Uu Vv Ww Xx Yy Zz  0123456789', 120, 510);

  // Layout color swatch blocks
  ctx.fillStyle = '#258BFF';
  ctx.fillRect(120, 580, 260, 160);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('PRIMARY BLUE', 140, 630);
  ctx.font = '400 16px monospace';
  ctx.fillText('#258BFF / CORE RGB', 140, 665);

  ctx.fillStyle = '#041225';
  ctx.fillRect(410, 580, 260, 160);
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px monospace';
  ctx.fillText('DARK NAVY', 430, 630);
  ctx.font = '400 16px monospace';
  ctx.fillText('#041225 / BASE RGB', 430, 665);

  // Approval Stamp
  ctx.save();
  ctx.translate(760, 850);
  ctx.rotate(-0.15);
  ctx.strokeStyle = '#258BFF';
  ctx.lineWidth = 3;
  ctx.strokeRect(-120, -45, 240, 90);
  ctx.fillStyle = '#258BFF';
  ctx.font = '700 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('APPROVED', 0, -8);
  ctx.font = '600 14px monospace';
  ctx.fillText('NEXORA STUDIO LABS', 0, 18);
  ctx.restore();

  // Bottom specs
  ctx.fillStyle = '#64748b';
  ctx.font = '500 16px monospace';
  ctx.fillText('APPROVED FOR PHYSICAL PRODUCTION // CLIENT REF: NXR-04', 120, 1340);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const Model3D = ({ scrollProgress = 0 }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth || window.innerWidth;
    let H = mount.clientHeight || window.innerHeight;

    // ── Renderer Setup ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ───────────────────────────────────────────────
    const scene = new THREE.Scene();

    // Studio Environment map for realistic PBR chrome & glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv).texture;

    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // ── Cinematic Studio Lighting ────────────────────────────────────
    // 1. Deep navy ambient base
    const ambientLight = new THREE.AmbientLight(0x041225, 1.2);
    scene.add(ambientLight);

    // 2. Main Key Light (Cool white)
    const keyLight = new THREE.DirectionalLight(0xF4F7FA, 2.8);
    keyLight.position.set(5.5, 7.5, 6.0);
    scene.add(keyLight);

    // 3. Electric Blue Rim Light (Positioned to graze dark chrome & glass edges)
    const blueRimLight = new THREE.DirectionalLight(0x258BFF, 3.4);
    blueRimLight.position.set(-5.0, -3.5, 3.5);
    scene.add(blueRimLight);

    // 4. Soft Cyan Specular Point Light
    const cyanPointLight = new THREE.PointLight(0x7DC4FF, 2.4, 12);
    cyanPointLight.position.set(2.5, 2.5, 4.0);
    scene.add(cyanPointLight);

    // 5. Deep Navy Fill
    const navyFillLight = new THREE.PointLight(0x0a2246, 1.6, 15);
    navyFillLight.position.set(-3.0, 1.5, -1.0);
    scene.add(navyFillLight);

    // ── Materials ───────────────────────────────────────────────────
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dce9f8'),
      metalness: 0.98,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
    });

    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0c1b30'),
      metalness: 0.92,
      roughness: 0.20,
    });

    const titaniumRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#142842'),
      metalness: 0.92,
      roughness: 0.18,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#9ec7f5'),
      transmission: 0.88,
      opacity: 1.0,
      transparent: true,
      roughness: 0.15,
      ior: 1.52,
      thickness: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });

    const poster1Tex = createPoster1Texture(img3);
    const poster2Tex = createPoster2Texture(img6);
    const paperTex = createPaperTexture();

    const poster1FrontMat = new THREE.MeshPhysicalMaterial({
      map: poster1Tex,
      roughness: 0.30,
      metalness: 0.08,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
    });

    const poster2FrontMat = new THREE.MeshPhysicalMaterial({
      map: poster2Tex,
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.30,
      clearcoatRoughness: 0.18,
    });

    const paperMat = new THREE.MeshStandardMaterial({
      map: paperTex,
      roughness: 0.92,
      metalness: 0.02,
      side: THREE.DoubleSide,
    });

    // ── Build 3D Objects ─────────────────────────────────────────────
    // NOTE: No background NEXORA text — composition speaks for itself.
    const font = new FontLoader().parse(helvetikerBold);

    // ── Main Group — all objects orbit this pivot ─────────────────────
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // (A) Poster 1: Primary Front Focal Piece — portrait 2:3
    const poster1Geo = new THREE.BoxGeometry(2.0, 2.82, 0.048);
    const poster1Mesh = new THREE.Mesh(poster1Geo, [
      darkMetalMat, darkMetalMat, darkMetalMat, darkMetalMat,
      poster1FrontMat, darkMetalMat,
    ]);
    mainGroup.add(poster1Mesh);

    // (B) Poster 2: Secondary Rear Piece — slightly smaller
    const poster2Geo = new THREE.BoxGeometry(1.78, 2.48, 0.042);
    const poster2Mesh = new THREE.Mesh(poster2Geo, [
      darkMetalMat, darkMetalMat, darkMetalMat, darkMetalMat,
      poster2FrontMat, darkMetalMat,
    ]);
    mainGroup.add(poster2Mesh);

    // (C) Frosted Glass Overlay — partial transparency over poster1
    const glassGeo = new THREE.BoxGeometry(1.22, 1.80, 0.042);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    mainGroup.add(glassMesh);

    // (D) Curved Drafting Paper — lightest, drifts the most
    const paperGeo = new THREE.PlaneGeometry(1.58, 2.20, 32, 32);
    const posAttr = paperGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const px = posAttr.getX(i);
      const py = posAttr.getY(i);
      const arch = Math.sin((px + 0.79) / 1.58 * Math.PI) * 0.14;
      const cornerCurl = Math.max(0, px - 0.18) * Math.max(0, -py - 0.28) * 0.26;
      posAttr.setZ(i, arch + cornerCurl);
    }
    paperGeo.computeVertexNormals();
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    mainGroup.add(paperMesh);

    // (E) Chrome Sphere — foreground jewel accent, lower-left
    const sphereGeo = new THREE.SphereGeometry(0.40, 64, 64);
    const sphereMesh = new THREE.Mesh(sphereGeo, chromeMat);
    mainGroup.add(sphereMesh);

    // (F) Titanium Torus Ring — upper geometric accent
    const ringGeo = new THREE.TorusGeometry(0.45, 0.033, 24, 80);
    const ringMesh = new THREE.Mesh(ringGeo, titaniumRingMat);
    mainGroup.add(ringMesh);

    // (G) 3D "NX" Chrome Monogram — lower right accent
    const nxGeo = new TextGeometry('NX', {
      font,
      size: 0.48,
      depth: 0.13,
      curveSegments: 8,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.012,
      bevelSegments: 4,
    });
    nxGeo.computeVertexNormals();
    nxGeo.center();
    const nxMesh = new THREE.Mesh(nxGeo, chromeMat);
    mainGroup.add(nxMesh);

    // ── Tight Composition — Z-depth layering for organic parallax ────
    //
    //  Layer 0 (bg,   pz ~ -0.75 to -0.25): poster2, paperSheet
    //  Layer 1 (mid,  pz ~  0.08 to  0.25): poster1 (focal), ring
    //  Layer 2 (fg,   pz ~  0.60 to  0.96): glassMesh, sphere, nxMesh
    //
    //  Three.js perspective projection separates layers naturally when
    //  the whole group rotates — no per-object mouse hacks needed.
    //
    const base = {
      poster1:    { px:  0.00, py:  0.02, pz:  0.22, rx:  0.040, ry: -0.165, rz:  0.032 },
      poster2:    { px: -0.68, py:  0.52, pz: -0.78, rx: -0.048, ry:  0.245, rz: -0.042 },
      glassMesh:  { px:  0.52, py:  0.26, pz:  0.62, rx:  0.058, ry: -0.270, rz:  0.036 },
      paperSheet: { px:  1.08, py: -0.58, pz: -0.24, rx:  0.195, ry:  0.355, rz: -0.115 },
      sphere:     { px: -0.82, py: -0.88, pz:  0.90, rx:  0.000, ry:  0.000, rz:  0.000 },
      ring:       { px:  0.82, py:  1.08, pz:  0.08, rx:  1.095, ry:  0.275, rz:  0.175 },
      nxMesh:     { px:  0.78, py: -0.72, pz:  0.35, rx:  0.048, ry: -0.118, rz:  0.018 },
    };

    // Apply initial poses
    [
      [poster1Mesh, base.poster1],
      [poster2Mesh, base.poster2],
      [glassMesh,   base.glassMesh],
      [paperMesh,   base.paperSheet],
      [sphereMesh,  base.sphere],
      [ringMesh,    base.ring],
      [nxMesh,      base.nxMesh],
    ].forEach(([mesh, b]) => {
      mesh.position.set(b.px, b.py, b.pz);
      mesh.rotation.set(b.rx, b.ry, b.rz);
    });

    // ── Responsive Layout Positioning ────────────────────────────────
    let currentDevice = { scale: 0.95, posX: 1.75, posY: 0.0, posZ: 0.0, fov: 36, camZ: 8.5 };

    const updateResponsiveLayout = (width) => {
      if (width <= 768) {
        // Mobile: Stack underneath/behind heading
        currentDevice = { scale: 0.56, posX: 0.0, posY: -1.35, posZ: -0.5, fov: 42, camZ: 9.0 };
      } else if (width <= 1024) {
        // Tablet: Scaled down on the right
        currentDevice = { scale: 0.74, posX: 1.15, posY: -0.1, posZ: 0.0, fov: 38, camZ: 8.6 };
      } else {
        // Desktop: Right side composition overlapping center
        currentDevice = { scale: 0.95, posX: 1.75, posY: 0.0, posZ: 0.0, fov: 36, camZ: 8.5 };
      }
      camera.fov = currentDevice.fov;
      camera.position.z = currentDevice.camZ;
      camera.updateProjectionMatrix();
      mainGroup.scale.setScalar(currentDevice.scale);
    };

    updateResponsiveLayout(W);

    // ── Mouse Parallax Tracking ──────────────────────────────────────
    const targetMouse = { x: 0, y: 0 };
    const curMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      targetMouse.x = nx;
      targetMouse.y = ny;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ── Resize Observer ──────────────────────────────────────────────
    const handleResize = () => {
      if (!mount) return;
      W = mount.clientWidth || window.innerWidth;
      H = mount.clientHeight || window.innerHeight;
      camera.aspect = W / H;
      updateResponsiveLayout(W);
      renderer.setSize(W, H);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);
    window.addEventListener('resize', handleResize);

    // ── Animation Loop ───────────────────────────────────────────────
    let animId;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.010; // slightly slower tick — more deliberate feel

      // Smooth mouse inertia (lerp 0.04 ≈ 40ms settling, very glassy)
      curMouse.x += (targetMouse.x - curMouse.x) * 0.040;
      curMouse.y += (targetMouse.y - curMouse.y) * 0.040;

      // Camera micro-drift — barely perceptible, just enough to feel alive
      camera.position.x = curMouse.x * 0.22;
      camera.position.y = curMouse.y * 0.15;
      camera.lookAt(mainGroup.position);

      // Scroll easing (cubic in-out)
      const sp = scrollRef.current;
      const scrollEase = sp < 0.5 ? 4 * sp * sp * sp : 1 - Math.pow(-2 * sp + 2, 3) / 2;

      // ── Group Transform ────────────────────────────────────────────
      // Group rotation is the PRIMARY depth-parallax driver:
      // objects at different pz naturally diverge in screen-space as the
      // group rotates (Three.js perspective projection handles this for free).
      mainGroup.position.x = currentDevice.posX;
      mainGroup.position.y = currentDevice.posY + scrollEase * 0.5;
      mainGroup.position.z = currentDevice.posZ - scrollEase * 4.2;
      mainGroup.rotation.y = curMouse.x * 0.062;
      mainGroup.rotation.x = -curMouse.y * 0.050;

      // ── Per-object breathing — phase-staggered, speed-varied ───────
      // Each object has its own rhythm so they never move in unison.
      // Mouse delta adds a small individual drift on top of group rotation.

      // Poster 1 — main focal point, very gentle rock
      poster1Mesh.position.y = base.poster1.py + Math.sin(t * 0.62) * 0.060;
      poster1Mesh.position.x = base.poster1.px;
      poster1Mesh.rotation.z = base.poster1.rz + Math.sin(t * 0.38) * 0.010;

      // Poster 2 — slow drift, different phase (offset 1.6 rad)
      poster2Mesh.position.y = base.poster2.py + Math.cos(t * 0.55 + 1.6) * 0.052;
      poster2Mesh.position.x = base.poster2.px;
      poster2Mesh.rotation.z = base.poster2.rz + Math.cos(t * 0.36 + 0.8) * 0.009;

      // Glass overlay — tracks poster1 loosely (slightly faster)
      glassMesh.position.y = base.glassMesh.py + Math.sin(t * 0.68 + 0.9) * 0.055;
      glassMesh.position.x = base.glassMesh.px;
      glassMesh.rotation.y = base.glassMesh.ry + Math.sin(t * 0.42) * 0.013;

      // Paper sheet — lightest, drifts the most, opposite phase to poster1
      paperMesh.position.y = base.paperSheet.py + Math.sin(t * 0.78 + 2.3) * 0.082;
      paperMesh.position.x = base.paperSheet.px;
      paperMesh.rotation.x = base.paperSheet.rx + Math.sin(t * 0.52) * 0.016;

      // Chrome sphere — orbital float (offset 0.5)
      sphereMesh.position.y = base.sphere.py + Math.cos(t * 0.88 + 0.5) * 0.072;
      sphereMesh.position.x = base.sphere.px;
      sphereMesh.rotation.y += 0.0035; // slow continuous spin
      sphereMesh.rotation.x += 0.0018;

      // Ring — slow spin + gentle bob (offset 1.9)
      ringMesh.position.y = base.ring.py + Math.cos(t * 0.72 + 1.9) * 0.060;
      ringMesh.position.x = base.ring.px;
      ringMesh.rotation.z += 0.0022; // very slow rotation

      // NX Monogram — calm settle, different phase
      nxMesh.position.y = base.nxMesh.py + Math.sin(t * 0.60 + 2.7) * 0.048;
      nxMesh.position.x = base.nxMesh.px;

      // Orbital key light — adds moving specular highlights
      cyanPointLight.position.x = 3.0 + Math.sin(t * 0.68) * 0.55;
      cyanPointLight.position.y = 2.8 + Math.cos(t * 0.52) * 0.42;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      renderer.dispose();
      pmremGenerator.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="model3d__wrapper">
      <div className="model3d__glow-bg" />
      <div ref={mountRef} className="model3d__canvas-mount" />
    </div>
  );
};

export default Model3D;
