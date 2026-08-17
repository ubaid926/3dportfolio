import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';
import '../pages/pages.css';

const ALL_PROJECTS = [
  { id: 'aerodynamic-hypercar', title: 'AeroDynamic GT Configurator', category: '3D Configurator',    year: '2026', client: 'AeroDynamic Motors',   image: img1, tags: ['WebGL', 'PBR Baking', 'Three.js', 'Anisotropy'],  description: 'Ultra-high fidelity automotive configurator with real-time clearcoat reflections and carbon fiber anisotropy.' },
  { id: 'cybermech-studio',     title: 'CyberMech Rig & Motion',     category: 'Animation & Rigging', year: '2025', client: 'Apex Robotics',        image: img2, tags: ['Skeletal Animation', 'Normal Cages', 'IK'],       description: 'Interactive mech configurator with high-poly to low-poly baked normal maps and dynamic gait animations.' },
  { id: 'spatial-archviz',      title: 'Spatial ArchViz Lightmaps',  category: 'Lightmap Baking',     year: '2025', client: 'Vanguard Architecture', image: img3, tags: ['Lightmap GI', 'Radiosity', '4K HDR'],            description: 'Architectural visualizer pre-computing radiosity bounce lighting into lightweight 4K HDR lightmaps.' },
  { id: 'chronowatch-horology', title: 'ChronoWatch Horology Studio',category: '3D Configurator',    year: '2026', client: 'Chrono Genève',         image: img4, tags: ['Micro PBR', 'Exploded Animation', 'Jewels'],      description: 'Luxury timepiece configurator with micro-displacement normal baking and exploded mechanical gear animations.' },
  { id: 'biosculpt-character',  title: 'BioSculpt Organic Avatar',   category: 'Texture Baking',      year: '2025', client: 'BioSculpt Media',       image: img5, tags: ['SSS Baking', 'Blendshapes', 'Skin Shader'],       description: 'Digital avatar suite featuring baked subsurface scattering irradiance maps and 52 ARKit blendshapes.' },
  { id: 'exosuit-combat',       title: 'ExoSuit Armor Customizer',   category: '3D Configurator',    year: '2026', client: 'Aegis Armament',        image: img6, tags: ['Curvature Baking', 'Modular Rigs', 'Wear'],        description: 'Combat exoskeleton configurator simulating realistic armor wear degradation and modular plating swaps.' },
  { id: 'quantum-visualizer',   title: 'Quantum Volumetric Engine',  category: 'Spatial WebGL',       year: '2026', client: 'Quantum Labs',          image: img7, tags: ['Volumetrics', 'Vector Fields', 'GPU Compute'],    description: 'Real-time simulation engine baking high-density fluid voxels and vector fields into 3D texture lookups.' },
  { id: 'neurodrone-flight',    title: 'NeuroDrone Flight Twin',     category: 'Animation & Rigging', year: '2025', client: 'NeuroAero Dynamics',   image: img8, tags: ['Photogrammetry', 'Wind Tunnel', 'Twin OS'],       description: 'Industrial drone configurator with photogrammetric surface baking and aerodynamic streamline animations.' },
];

const CATEGORIES = ['All', '3D Configurator', 'Texture Baking', 'Animation & Rigging', 'Lightmap Baking', 'Spatial WebGL'];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article
      className="work-card"
      variants={fadeUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="work-card__media">
        <img src={project.image} alt={project.title} className="work-card__img" loading="lazy" />
        <div className={`work-card__overlay ${hovered ? 'work-card__overlay--visible' : ''}`}>
          <div className="work-card__overlay-tags">
            {project.tags.map((t) => (
              <span key={t} className="page-chip">{t}</span>
            ))}
          </div>
          <p className="work-card__overlay-desc">{project.description}</p>
        </div>
        <div className="work-card__index">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <div className="work-card__footer">
        <div className="work-card__meta">
          <span className="work-card__category">{project.category}</span>
          <span className="work-card__sep">·</span>
          <span className="work-card__year">{project.year}</span>
        </div>
        <h3 className="work-card__title">{project.title}</h3>
        <div className="work-card__client">{project.client}</div>
      </div>
    </motion.article>
  );
}

export default function WorkPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? ALL_PROJECTS
    : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div className="page-hero__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className="page-hero__tag-dot" /> 3D Configurators &amp; Baked Assets
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Configurators that<br/><em>redefine</em> real-time 3D.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          Explore our collection of real-time 3D product configurators, high-to-low poly cage bakes, radiosity lightmaps, and skeletal animation systems.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{ALL_PROJECTS.length} 3D Projects</span>
          <span className="page-hero__meta-line">2024–2026</span>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <section className="work-filter-bar">
        <div className="work-filter-inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`work-filter-btn ${activeFilter === cat ? 'work-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="work-filter-count">
                  {ALL_PROJECTS.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── PROJECTS GRID ── */}
      <section className="page-section work-grid-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="work-projects-grid"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            variants={stagger}
          >
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div className="about-cta-inner" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <h2 className="about-cta-heading">Have a project in mind?</h2>
          <p className="about-cta-sub">Let's talk about what we can build together.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a conversation
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
