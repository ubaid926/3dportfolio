import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const SERVICES = [
  {
    id: 'baking',
    number: '01',
    title: 'Real-Time GPU Texture Baking & UVs',
    category: 'TEXTURE SYNTHESIS & CAGES',
    tagline: 'High-to-low poly cage baking and multi-channel PBR synthesis with zero artifacts.',
    description: 'Hardware-accelerated texture baking that projects 100M+ poly sculpts into micro-displacement, normal, AO, and curvature maps.',
    icon: 'bars',
    deliverables: ['High-to-Low Poly Normal Cage Baking', 'Ambient Occlusion & Curvature Extraction', 'Automated UV Unwrapping & Seam Packing', 'Roughness & Metalness Map Compilation', 'Multi-Texture Atlas Channel Consolidation'],
    pricing: 'From $5,000',
    timeline: '1–3 weeks',
  },
  {
    id: 'configurator',
    number: '02',
    title: 'Interactive 3D Web Configurators',
    category: 'WEBGL 3D CONFIGURATION',
    tagline: 'Hyper-responsive, customized 3D product viewports for web and spatial commerce.',
    description: 'Scalable WebGL 3D configurators with real-time part swapping, procedural material customization, and camera director controls.',
    icon: 'radar',
    deliverables: ['Three.js & WebGL 2.0 Configurator Engines', 'Instantaneous Texture & Material Swapping', 'Modular Part Assembly & Attachment Logic', 'Interactive Exploded View Presentations', 'Mobile-Optimized Touch Orbit Gestures'],
    pricing: 'From $12,000',
    timeline: '4–8 weeks',
  },
  {
    id: 'animation',
    number: '03',
    title: 'Skeletal Rigging & 3D Animation',
    category: 'KINETIC RIGS & MOTION',
    tagline: 'Kinematic skeletal animation, blendshapes, and secondary physics.',
    description: 'Professional bone rigging, morph target facial animation, and physics-driven spring dynamics for interactive 3D web models.',
    icon: 'prism',
    deliverables: ['Dual-Quaternion Skeletal Rigging', 'ARKit 52 Facial Blendshape Calibration', 'Procedural Inverse Kinematics (IK) Rigs', 'Cinematic Camera Motion Choreography', 'Interactive State Machine Animation Graphs'],
    pricing: 'From $8,000',
    timeline: '3–6 weeks',
  },
  {
    id: 'lightmaps',
    number: '04',
    title: 'Global Illumination & Lightmap Baking',
    category: 'RADIOSITY & LIGHTMAPS',
    tagline: 'Pre-computed radiosity and raytraced bounce lighting for 120 FPS web playback.',
    description: 'Bake complex ray-traced lighting, contact shadow penumbras, and caustics into lightweight HDR lightmap textures.',
    icon: 'nodes',
    deliverables: ['Multi-Bounce Radiosity GI Computation', 'Daylight & Artificial Lightmap Mixing', 'High-Dynamic Range (HDR) Lightmaps', 'Indirect Reflection Probe Precomputation', 'Zero-Overhead Static Scene Rendering'],
    pricing: 'From $6,000',
    timeline: '2–4 weeks',
  },
  {
    id: 'shaders',
    number: '05',
    title: 'Custom GLSL Shaders & Material Lab',
    category: 'PBR SHADER GRAPH',
    tagline: 'Bespoke GLSL and Three.js custom shaders for exotic optical materials.',
    description: 'Custom shader development for anisotropic carbon fiber, clearcoat car paint, thin-film iridescence, and refractive dispersion.',
    icon: 'wave',
    deliverables: ['Custom GLSL Fragment & Vertex Shaders', 'Anisotropic Brushed Metal & Carbon Weaves', 'Clearcoat Lacquer & Orange-Peel Bump', 'Subsurface Scattering (SSS) Approximation', 'Refractive Glass Dispersion & Fresnel Rims'],
    pricing: 'From $7,000',
    timeline: '2–5 weeks',
  },
  {
    id: 'optimization',
    number: '06',
    title: 'Mesh Decimation & LOD Pipelines',
    category: 'DRAWCALL MINIMIZATION',
    tagline: 'Drastic draw call reduction and geometric decimation for instant load times.',
    description: 'Transform heavy 500MB CAD files into snappy 5MB WebGL assets with intelligent polygon reduction and draw-call merging.',
    icon: 'arcs',
    deliverables: ['Quadric Error Metric Mesh Decimation', 'Automated Hierarchical LOD Generation', 'Draw-Call Batching & Material Merging', 'Draco & Meshopt Compression Pipelines', 'Sub-50ms Initial Asset Hydration'],
    pricing: 'From $4,000',
    timeline: '1–3 weeks',
  },
  {
    id: 'spatial-webxr',
    number: '07',
    title: 'Spatial 3D & WebXR Environments',
    category: 'SPATIAL COMPUTING',
    tagline: 'Immersive AR product placement and browser-based VR showrooms.',
    description: 'WebXR-enabled 3D product showrooms allowing users to place baked 3D models in their physical spaces with realistic scale and shadows.',
    icon: 'compass',
    deliverables: ['WebXR Augmented Reality (AR) Placement', 'Virtual Reality 3D Showroom Walkthroughs', 'Real-Time Spatial Audio Spatialization', 'Environmental Lighting Adaptation (HDR)', 'Cross-Device Apple Vision Pro Compatibility'],
    pricing: 'From $14,000',
    timeline: '6–10 weeks',
  },
  {
    id: 'export',
    number: '08',
    title: 'Multi-Format Export & Asset Pipeline',
    category: 'PRODUCTION ASSET DELIVERY',
    tagline: 'Production-ready glTF/GLB, USDZ, and FBX generation for web and game engines.',
    description: 'Seamless automated export pipelines generating production-grade 3D assets ready for Shopify, Unreal Engine, Unity, and iOS QuickLook.',
    icon: 'orbit',
    deliverables: ['glTF 2.0 / GLB Binary Optimization', 'Apple iOS QuickLook USDZ Packaging', 'Unreal Engine & Unity Asset Presets', 'Automated Headless Cloud Baking API', 'Cloud CDN Texture Streaming Architecture'],
    pricing: 'From $5,000',
    timeline: '2–4 weeks',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function ServiceRow({ service }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className={`srv-row ${expanded ? 'srv-row--expanded' : ''}`}
      variants={fadeUp}
      layout
    >
      <button className="srv-row__header" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <div className="srv-row__left">
          <span className="srv-row__num">{service.number}</span>
          <div className="srv-row__titles">
            <span className="srv-row__category">{service.category}</span>
            <h3 className="srv-row__title">{service.title}</h3>
          </div>
        </div>
        <div className="srv-row__right">
          <span className="srv-row__pricing">{service.pricing}</span>
          <span className="srv-row__timeline">{service.timeline}</span>
          <span className={`srv-row__toggle ${expanded ? 'srv-row__toggle--open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              {!expanded && <line x1="12" y1="5" x2="12" y2="19" />}
            </svg>
          </span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="srv-row__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="srv-row__content">
              <div className="srv-row__desc-col">
                <p className="srv-row__tagline">{service.tagline}</p>
                <p className="srv-row__desc">{service.description}</p>
                <div className="srv-row__mobile-meta">
                  <span className="srv-row__mobile-badge">{service.pricing}</span>
                  <span className="srv-row__mobile-badge">{service.timeline}</span>
                </div>
                <Link to="/contact" className="page-btn page-btn--primary srv-row__cta-btn">
                  Get a quote
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
              <div className="srv-row__deliverables-col">
                <div className="srv-row__deliv-label">WHAT'S INCLUDED</div>
                <ul className="srv-row__deliv-list">
                  {service.deliverables.map((d) => (
                    <li key={d} className="srv-row__deliv-item">
                      <span className="srv-row__deliv-dot">→</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ServicesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div className="page-hero__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="page-hero__tag-dot" /> 3D Capabilities &amp; Services
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Pipelines built<br/>for <em>120 FPS</em> 3D.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          From GPU texture baking and radiosity lightmaps to interactive 3D WebGL configurators and skeletal kinematics.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{SERVICES.length} Disciplines</span>
          <span className="page-hero__meta-line">End-to-End Pipeline</span>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="page-section">
        <div className="page-rule page-rule--tight">
          <div className="page-rule__line" />
          <span className="page-rule__text">All 3D Disciplines</span>
          <div className="page-rule__line" />
        </div>
        <motion.div
          className="srv-accordion"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
        >
          {SERVICES.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
        </motion.div>
      </section>

      <div className="page-divider" />

      {/* ── PROCESS ── */}
      <section className="page-section page-section--mid">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>Our Baking Pipeline</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          The 3D baking &amp;<br/>animation process.
        </motion.h2>
        <motion.ul className="page-numbered-list" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {[
            { n: '01', title: 'High-Poly Ingestion & Topology', desc: 'We ingest heavy CAD, ZBrush sculpts, or Maya assemblies, analyzing surface curvature and preparing clean low-poly retopology.' },
            { n: '02', title: 'UV Packing & Cage Setup', desc: 'Optimal automated UV packing with maximum texel density and custom projection cages to prevent normal skewing.' },
            { n: '03', title: 'GPU Texture & Lightmap Baking', desc: 'Hardware-accelerated baking of 4K/8K Normal, AO, Curvature, Roughness, and Radiosity GI lightmaps in seconds.' },
            { n: '04', title: 'Rigging, Animation & Shaders', desc: 'Kinematic skeletal rigging, facial blendshapes, and custom GLSL shaders engineered for browser viewport interaction.' },
            { n: '05', title: 'Configurator Assembly & Deployment', desc: 'Full Three.js / WebGL integration with modular part swapping, touch orbit controls, and Shopify/WebXR export.' },
          ].map((step) => (
            <motion.li key={step.n} className="page-numbered-item" variants={fadeUp}>
              <span className="page-numbered-item__num">{step.n}</span>
              <div className="page-numbered-item__body">
                <h4 className="page-numbered-item__title">{step.title}</h4>
                <p className="page-numbered-item__desc">{step.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ── CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div className="about-cta-inner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="about-cta-heading">Ready to build with Nexora Studio?</h2>
          <p className="about-cta-sub">Tell us about your 3D vision — we'll tailor a custom real-time pipeline.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project →
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See 3D showcases
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
