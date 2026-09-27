import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import '../pages/pages.css';

const SERVICES = [
  {
    id: 'branding',
    number: '01',
    title: 'Brand Identity & Visual Architecture',
    category: 'BRAND STRATEGY & LOGOS',
    tagline: 'Comprehensive visual identity frameworks, iconic logo marks, and cohesive design systems.',
    description: 'We forge distinct brand personalities through bespoke logotypes, comprehensive visual design guidelines, bespoke color theories, and multi-platform identity systems.',
    icon: 'bars',
    deliverables: ['Bespoke Logo Suites & Monograms', 'Brand Guidelines & Design Tokens', 'Visual Personality & Moodboards', 'Stationery & Corporate Collateral', 'Sub-Brand Architecture Systems'],
    pricing: 'From $4,500',
    timeline: '3–5 weeks',
  },
  {
    id: 'packaging',
    number: '02',
    title: 'Luxury Packaging & Structural Print',
    category: 'PACKAGING & TACTILE PRINT',
    tagline: 'High-impact physical packaging with custom die-lines, specialty finishes, and foil stamping.',
    description: 'From luxury perfume boxes to organic botanical bottles, we craft tangible packaging that commands retail presence through tactile stocks, foil embossing, and sustainable materials.',
    icon: 'radar',
    deliverables: ['Custom Die-Lines & Unfolded Templates', 'Foil Stamping & Emboss Specifications', 'CMYK & Pantone Spot Color Profiles', 'Sustainable & Recycled Stock Selection', '3D Photorealistic Packaging Mockups'],
    pricing: 'From $5,500',
    timeline: '3–6 weeks',
  },
  {
    id: 'typography',
    number: '03',
    title: 'Kinetic Typography & Custom Type',
    category: 'TYPE DESIGN & MOTION',
    tagline: 'Expressive typographic layouts, custom display fonts, and dynamic motion typography.',
    description: 'Words that move, inspire, and define culture. We design bespoke glyph sets, dynamic typographic scales, and kinetic type animations for screen and space.',
    icon: 'prism',
    deliverables: ['Custom Display & Headline Typefaces', 'Variable Font Weight Configuration', 'Kinetic Typography Motion Loops', 'Editorial Hierarchy & Text Grid Systems', 'Cross-Platform Font Licensing Support'],
    pricing: 'From $3,500',
    timeline: '2–4 weeks',
  },
  {
    id: 'editorial',
    number: '04',
    title: 'Editorial Design & Art Publications',
    category: 'EDITORIAL & PUBLICATIONS',
    tagline: 'Museum-grade monographs, luxury coffee table books, lookbooks, and high-fashion magazines.',
    description: 'Elevated layout design guided by Swiss typographic grids, exquisite white-space balance, custom grid ratios, and tactile paper curation.',
    icon: 'nodes',
    deliverables: ['Swiss Grid Layout Architectures', 'Art Catalog & Book Binding Curation', 'Editorial Page Spreads & Pacing', 'Print Pre-Flight Production Checks', 'Digital Interactive PDF Publications'],
    pricing: 'From $4,000',
    timeline: '3–6 weeks',
  },
  {
    id: 'art-direction',
    number: '05',
    title: 'Creative Direction & Visual Concepts',
    category: 'ART DIRECTION & CAMPAIGNS',
    tagline: 'Cohesive aesthetic narratives for high-end fashion, tech pioneers, and luxury lifestyle brands.',
    description: 'Setting the visual tone through high-concept mood direction, bespoke photoshoot styling guidance, color narrative curation, and cross-media consistency.',
    icon: 'wave',
    deliverables: ['Campaign Moodboards & Creative Briefs', 'Photography & Render Art Direction', 'Color Palette & Tone-of-Voice Guides', 'Cross-Channel Campaign Guidelines', 'Creative Production Supervision'],
    pricing: 'From $6,000',
    timeline: '4–8 weeks',
  },
  {
    id: 'digital-systems',
    number: '06',
    title: 'Digital Design Systems & UI Assets',
    category: 'FIGMA TOKENS & DIGITAL',
    tagline: 'Modular Figma component libraries, responsive iconography, and digital brand toolkits.',
    description: 'Unifying brand consistency across digital ecosystems with scalable vector assets, responsive icon families, and seamless designer-to-developer token handoffs.',
    icon: 'arcs',
    deliverables: ['Scalable SVG Iconography Sets', 'Figma Component & Variable Libraries', 'Responsive Digital Brand Assets', 'Social Media Asset Templates', 'Web & App Design Token Systems'],
    pricing: 'From $5,000',
    timeline: '3–5 weeks',
  },
  {
    id: 'poster-exhibition',
    number: '07',
    title: 'Exhibition Signage & Poster Design',
    category: 'SPATIAL GRAPHICS & POSTERS',
    tagline: 'Large-scale typographic posters, gallery wayfinding, and architectural exhibition graphics.',
    description: 'Translating graphic design into physical spatial environments, large-format silk-screened posters, and intuitive gallery wayfinding systems.',
    icon: 'compass',
    deliverables: ['Screen-Printed Poster Series', 'Architectural Wayfinding & Signage', 'Exhibition Wall Typography & Vinyls', 'Festival & Event Identity Suites', 'Large-Format Billboard Visuals'],
    pricing: 'From $3,500',
    timeline: '2–4 weeks',
  },
  {
    id: 'motion-graphics',
    number: '08',
    title: 'Motion Graphics & Brand Idents',
    category: '2D/3D MOTION & BROADCAST',
    tagline: 'Dynamic logo stings, broadcast idents, and kinetic social media campaigns.',
    description: 'Injecting kinetic energy into static identities through liquid vector morphs, 3D logo reveals, and captivating motion language.',
    icon: 'orbit',
    deliverables: ['Animated 2D/3D Logo Reveals', 'Broadcast & Video Title Sequences', 'Kinetic Social Media Motion Kits', 'Looping Seamless Brand Idents', 'Lottie / SVG Web Motion Assets'],
    pricing: 'From $4,200',
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
          <span className="page-hero__tag-dot" /> Design Disciplines &amp; Studio Services
        </motion.div>

        <motion.h1 className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          Identities crafted<br/>with <em>enduring distinction</em>.
        </motion.h1>

        <motion.p className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          From comprehensive brand architectures and luxury tactile packaging to kinetic typography, editorial monographs, and scalable digital design systems.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{SERVICES.length} Disciplines</span>
          <span className="page-hero__meta-line">Full Brand Ecosystem</span>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="page-section">
        <div className="page-rule page-rule--tight">
          <div className="page-rule__line" />
          <span className="page-rule__text">All Design Disciplines</span>
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
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>Our Creative Process</motion.div>
        <motion.h2 className="page-section__heading page-section__heading--spaced" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          The graphic design &amp;<br/>brand identity journey.
        </motion.h2>
        <motion.ul className="page-numbered-list" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {[
            { n: '01', title: 'Discovery & Visual Strategy', desc: 'We immerse ourselves into your brand heritage, market positioning, target demographics, and creative ambitions to formulate a distinct visual thesis.' },
            { n: '02', title: 'Typographic & Conceptual Exploration', desc: 'Bespoke letterform crafting, custom glyph development, moodboard curation, and iterative mark experimentation guided by Swiss design principles.' },
            { n: '03', title: 'Identity System Architecture', desc: 'Designing comprehensive color systems, modular layout grids, tactile packaging mockups, and corporate collateral suites with meticulous detail.' },
            { n: '04', title: 'Brand Guidelines & Digital Tokens', desc: 'Codifying your visual identity into comprehensive interactive brand guidelines, Figma component libraries, and scalable vector assets.' },
            { n: '05', title: 'Print Production & Multi-Platform Launch', desc: 'Hands-on print pre-flight checks, foil stamp & embossing supervision, and seamless asset deployment across digital and physical touchpoints.' },
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
          <h2 className="about-cta-heading">Ready to elevate your brand identity?</h2>
          <p className="about-cta-sub">Tell us about your brand vision — we'll tailor a bespoke visual design system.</p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project →
            </Link>
            <Link to="/work" className="page-btn page-btn--outline">
              See design showcases
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
