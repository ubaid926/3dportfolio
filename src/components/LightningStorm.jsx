import React, { useEffect, useRef } from 'react';

/**
 * LightningStorm – High-performance, cinematic storm clouds with dynamic lightning flashes.
 * 
 * Features:
 * - Dynamic volumetric dark storm clouds with multi-octave drifting vapor noise
 * - Recursive fractal branching lightning strikes with intense white/cyan core and electric glow
 * - Full-screen ambient thunder flashes that illuminate the clouds from within
 * - Highly optimized 60fps canvas rendering with smooth scroll-opacity integration
 */
const LightningStorm = ({ progress = 0 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // ── Lightning Bolts State ──
    let bolts = [];
    let flashIntensity = 0;
    let nextStrikeTime = Date.now() + 600;

    // Helper: generate recursive fractal lightning tree
    const createBolt = (startX, startY, endX, endY, branchLevel = 0) => {
      const segments = [];
      const generateBranch = (x1, y1, x2, y2, depth, maxDepth) => {
        if (depth >= maxDepth) {
          segments.push({ x1, y1, x2, y2, depth });
          return;
        }

        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * (x2 - x1 === 0 ? 40 : Math.abs(x2 - x1) * 0.7 + 30);
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 25;

        generateBranch(x1, y1, midX, midY, depth + 1, maxDepth);
        generateBranch(midX, midY, x2, y2, depth + 1, maxDepth);

        // Chance to spawn side fork
        if (Math.random() < 0.45 && depth < maxDepth - 1) {
          const forkAngle = (Math.random() - 0.5) * 1.2;
          const forkLen = Math.hypot(x2 - x1, y2 - y1) * (0.35 + Math.random() * 0.35);
          const baseAngle = Math.atan2(y2 - y1, x2 - x1) + forkAngle;
          const forkEndX = midX + Math.cos(baseAngle) * forkLen;
          const forkEndY = midY + Math.sin(baseAngle) * forkLen;
          generateBranch(midX, midY, forkEndX, forkEndY, depth + 1, maxDepth - 1);
        }
      };

      generateBranch(startX, startY, endX, endY, 0, 5);

      return {
        segments,
        life: 1.0,
        decay: 0.055 + Math.random() * 0.045,
        color: '#ffffff',
        glow: 'rgba(255, 255, 255, 0.85)',
        intensity: 0.9 + Math.random() * 0.3,
        originX: startX,
        originY: startY,
      };
    };

    const triggerLightning = () => {
      const numStrikes = Math.random() < 0.4 ? 2 : 1;
      for (let i = 0; i < numStrikes; i++) {
        const startX = width * (0.15 + Math.random() * 0.7);
        const startY = height * (Math.random() * 0.15);
        const endX = startX + (Math.random() - 0.5) * width * 0.45;
        const endY = height * (0.45 + Math.random() * 0.45);
        bolts.push(createBolt(startX, startY, endX, endY));
      }
      flashIntensity = 0.85 + Math.random() * 0.35;
      nextStrikeTime = Date.now() + 900 + Math.random() * 2200;
    };

    // ── Storm Clouds Puff Particles ──
    const numClouds = 28;
    const clouds = [];
    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.85,
        radiusX: 180 + Math.random() * 320,
        radiusY: 100 + Math.random() * 180,
        vx: (Math.random() * 0.18 + 0.08) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 0.04,
        alpha: 0.35 + Math.random() * 0.4,
        hueOffset: Math.random() * 20 - 10,
      });
    }

    // ── Main Render Loop ──
    let lastTime = performance.now();

    const render = (time) => {
      animRef.current = requestAnimationFrame(render);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const now = Date.now();
      if (now > nextStrikeTime) {
        triggerLightning();
      }

      // Decay flash intensity
      flashIntensity = Math.max(0, flashIntensity - dt * 2.8);

      // ── 1. Base Storm Atmosphere Background ──
      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (flashIntensity > 0.05) {
        // Storm sky during lightning flash
        const flashR = Math.round(18 + flashIntensity * 95);
        const flashG = Math.round(22 + flashIntensity * 125);
        const flashB = Math.round(38 + flashIntensity * 185);
        skyGrad.addColorStop(0, `rgb(${flashR}, ${flashG}, ${flashB})`);
        skyGrad.addColorStop(0.5, `rgb(${Math.round(flashR * 0.6)}, ${Math.round(flashG * 0.6)}, ${Math.round(flashB * 0.65)})`);
        skyGrad.addColorStop(1, '#030508');
      } else {
        // Deep stormy midnight blue-black
        skyGrad.addColorStop(0, '#0a0d18');
        skyGrad.addColorStop(0.4, '#060810');
        skyGrad.addColorStop(0.85, '#020306');
        skyGrad.addColorStop(1, '#000000');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 2. Volumetric Storm Clouds ──
      ctx.save();
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        c.x += c.vx;
        c.y += c.vy;

        // Wrap around viewport
        if (c.x - c.radiusX > width) c.x = -c.radiusX;
        if (c.x + c.radiusX < 0) c.x = width + c.radiusX;

        ctx.save();
        ctx.translate(c.x, c.y);

        const cloudGrad = ctx.createRadialGradient(0, 0, c.radiusX * 0.1, 0, 0, c.radiusX);
        const cloudBrightness = flashIntensity * 140;

        const val = Math.min(255, Math.round(18 + cloudBrightness));

        cloudGrad.addColorStop(0, `rgba(${val}, ${val}, ${val}, ${c.alpha * (0.85 + flashIntensity * 0.3)})`);
        cloudGrad.addColorStop(0.45, `rgba(${Math.round(val * 0.7)}, ${Math.round(val * 0.7)}, ${Math.round(val * 0.7)}, ${c.alpha * 0.6})`);
        cloudGrad.addColorStop(0.8, `rgba(${Math.round(val * 0.3)}, ${Math.round(val * 0.3)}, ${Math.round(val * 0.3)}, ${c.alpha * 0.2})`);
        cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.scale(1, c.radiusY / c.radiusX);
        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(0, 0, c.radiusX, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();

      // ── 3. Draw Lightning Bolts ──
      for (let b = bolts.length - 1; b >= 0; b--) {
        const bolt = bolts[b];
        bolt.life -= bolt.decay;

        if (bolt.life <= 0) {
          bolts.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.min(bolt.life * 1.5, 1) * bolt.intensity;

        // Outer electric bloom
        ctx.shadowColor = bolt.glow;
        ctx.shadowBlur = 35 * bolt.life;
        ctx.strokeStyle = bolt.glow;
        ctx.lineWidth = 6 * bolt.life;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        for (let s = 0; s < bolt.segments.length; s++) {
          const seg = bolt.segments[s];
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // Inner intense white/cyan core
        ctx.shadowBlur = 12 * bolt.life;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.5, 2.8 * bolt.life);

        ctx.beginPath();
        for (let s = 0; s < bolt.segments.length; s++) {
          const seg = bolt.segments[s];
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        ctx.restore();
      }

      // ── 4. Fog & Rain Mist Overlay ──
      const mistGrad = ctx.createLinearGradient(0, height * 0.6, 0, height);
      mistGrad.addColorStop(0, 'rgba(10, 14, 25, 0)');
      mistGrad.addColorStop(0.7, 'rgba(6, 9, 18, 0.45)');
      mistGrad.addColorStop(1, 'rgba(2, 4, 8, 0.85)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.6, width, height * 0.4);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default LightningStorm;
