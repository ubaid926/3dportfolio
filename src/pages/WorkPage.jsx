import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { ALL_PROJECTS, WORK_CATEGORIES, MEDIA_TYPES } from '../data/workProjects';
import '../pages/pages.css';
import './WorkPage.css';

/* ── Animation Variants ── */
const staggerGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ── Project Card Component ── */
function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      layout
      variants={cardVariant}
      className={`work-card work-card--${project.aspectRatio} ${
        project.featured ? 'work-card--featured' : ''
      } ${hovered ? 'work-card--active' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(project)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title}`}
    >
      <div className="work-card__media">
        <img
          src={project.image}
          alt={project.title}
          className="work-card__img"
          loading="lazy"
        />

        {/* Featured Tag */}
        {project.featured && (
          <div className="work-card__featured-badge">★ Spotlight</div>
        )}

        {/* Video Badge */}
        {project.mediaType === 'video' && (
          <div className="work-card__video-badge">
            <span className="work-card__video-dot" />
            <span>Reel 3D</span>
          </div>
        )}

        {/* Index number */}
        <div className="work-card__index">#{project.number}</div>

        {/* Hover Overlay */}
        <div className="work-card__overlay">
          <div className="work-card__overlay-tags">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="page-chip">
                {tag}
              </span>
            ))}
          </div>

          {project.stats && (
            <div className="work-card__overlay-stats">
              <div className="work-card__stat-item">
                <span className="work-card__stat-lbl">Target FPS</span>
                <span className="work-card__stat-val">{project.stats.fps}</span>
              </div>
              <div className="work-card__stat-item">
                <span className="work-card__stat-lbl">Polys</span>
                <span className="work-card__stat-val">{project.stats.polygons}</span>
              </div>
            </div>
          )}

          <div className="work-card__action-hint">
            <span>Inspect 3D Specs</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>

      <div className="work-card__footer">
        <div className="work-card__meta">
          <span className="work-card__category">{project.category}</span>
          <span>·</span>
          <span>{project.year}</span>
        </div>
        <h3 className="work-card__title">{project.title}</h3>
        <div className="work-card__client">{project.client}</div>
      </div>
    </motion.article>
  );
}

/* ── Lightbox / Detail Modal ── */
function ProjectModal({ project, onClose, onPrev, onNext, hasPrev, hasNext }) {
  // Handle keyboard events for modal navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!project) return null;

  return (
    <motion.div
      className="work-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="work-modal-card"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="work-modal-close"
          onClick={onClose}
          aria-label="Close project preview"
        >
          ✕
        </button>

        {/* Media Preview Column */}
        <div className="work-modal-media-col">
          {project.mediaType === 'video' && project.videoUrl ? (
            <video
              src={project.videoUrl}
              poster={project.image}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="work-modal-video"
            />
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="work-modal-img"
            />
          )}
        </div>

        {/* Content Column */}
        <div className="work-modal-content-col">
          <div className="work-modal-header">
            <span className="work-modal-category">
              #{project.number} · {project.category} · {project.year}
            </span>
            <h2 className="work-modal-title">{project.title}</h2>
            <div className="work-modal-client">Client: {project.client}</div>
          </div>

          <p className="work-modal-desc">{project.description}</p>

          {/* Technical Specs */}
          {project.stats && (
            <div className="work-modal-specs-box">
              <div className="work-modal-spec">
                <span className="work-modal-spec-lbl">Decimation</span>
                <span className="work-modal-spec-val">{project.stats.polygons}</span>
              </div>
              <div className="work-modal-spec">
                <span className="work-modal-spec-lbl">Draw Calls</span>
                <span className="work-modal-spec-val">{project.stats.drawCalls}</span>
              </div>
              <div className="work-modal-spec">
                <span className="work-modal-spec-lbl">Performance</span>
                <span className="work-modal-spec-val">{project.stats.fps}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="work-modal-tags">
            {project.tags.map((t) => (
              <span key={t} className="page-chip">
                {t}
              </span>
            ))}
          </div>

          {/* Modal Actions */}
          <div className="work-modal-actions">
            <Link
              to="/contact"
              className="page-btn page-btn--primary"
              onClick={onClose}
            >
              Request Similar 3D Build →
            </Link>

            <div className="work-modal-nav-btns">
              <button
                className="work-modal-nav-btn"
                onClick={onPrev}
                disabled={!hasPrev}
                style={{ opacity: hasPrev ? 1 : 0.4 }}
              >
                ← Prev
              </button>
              <button
                className="work-modal-nav-btn"
                onClick={onNext}
                disabled={!hasNext}
                style={{ opacity: hasNext ? 1 : 0.4 }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Work Page Component ── */
export default function WorkPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMediaType, setActiveMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('masonry'); // 'standard' | 'masonry' | 'list'
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter projects based on active selections
  const filteredProjects = useMemo(() => {
    return ALL_PROJECTS.filter((project) => {
      // Category filter
      if (activeCategory !== 'All' && project.category !== activeCategory) {
        return false;
      }

      // Media type filter
      if (activeMediaType === 'image' && project.mediaType !== 'image') return false;
      if (activeMediaType === 'video' && project.mediaType !== 'video') return false;
      if (activeMediaType === 'featured' && !project.featured) return false;

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesClient = project.client.toLowerCase().includes(query);
        const matchesDesc = project.description.toLowerCase().includes(query);
        const matchesCategory = project.category.toLowerCase().includes(query);
        const matchesTag = project.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesClient && !matchesDesc && !matchesCategory && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, activeMediaType, searchQuery]);

  // Display subset for high performance pagination
  const displayedProjects = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  // Modal Next/Prev Handlers
  const currentModalIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return filteredProjects.findIndex((p) => p.id === selectedProject.id);
  }, [selectedProject, filteredProjects]);

  const handlePrevProject = useCallback(() => {
    if (currentModalIndex > 0) {
      setSelectedProject(filteredProjects[currentModalIndex - 1]);
    }
  }, [currentModalIndex, filteredProjects]);

  const handleNextProject = useCallback(() => {
    if (currentModalIndex < filteredProjects.length - 1) {
      setSelectedProject(filteredProjects[currentModalIndex + 1]);
    }
  }, [currentModalIndex, filteredProjects]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setActiveMediaType('all');
    setSearchQuery('');
  };

  const progressPercent = Math.min(
    100,
    Math.round((displayedProjects.length / (filteredProjects.length || 1)) * 100)
  );

  return (
    <div className="page">
      {/* ── HERO ── */}
      <section className="page-hero">
        <div className="page-hero__noise" />
        <div className="page-hero__glow" />

        <motion.div
          className="page-hero__tag"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="page-hero__tag-dot" /> 100+ Baked 3D Works &amp; Interactive Showcases
        </motion.div>

        <motion.h1
          className="page-hero__heading"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Showcases that<br />
          <em>redefine</em> real-time 3D.
        </motion.h1>

        <motion.p
          className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Explore Nexora Studio's comprehensive index of 100+ GPU texture-baked 3D configurators, spatial WebGL environments, radiosity lightmaps, and kinetic character rigs.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">{ALL_PROJECTS.length} 3D Projects</span>
          <span className="page-hero__meta-line">8 Disciplines</span>
          <span className="page-hero__meta-line">120 FPS Standard</span>
        </div>
      </section>

      {/* ── CONTROLS & FILTERS TOOLBAR ── */}
      <section className="work-controls-container">
        <div className="work-toolbar-top">
          {/* Search Box */}
          <div className="work-search-box">
            <span className="work-search-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="work-search-input"
              placeholder="Search 100+ 3D projects, clients, tags, shaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="work-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
                ✕
              </button>
            )}
          </div>

          {/* Media & View Switchers */}
          <div className="work-switchers-group">
            {/* Media Type Filter */}
            <div className="work-media-pills">
              {MEDIA_TYPES.map((m) => (
                <button
                  key={m.id}
                  className={`work-media-btn ${activeMediaType === m.id ? 'work-media-btn--active' : ''}`}
                  onClick={() => setActiveMediaType(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* View Mode Layout */}
            <div className="work-view-toggle-group" title="Switch layout">
              <button
                className={`work-view-btn ${viewMode === 'masonry' ? 'work-view-btn--active' : ''}`}
                onClick={() => setViewMode('masonry')}
                aria-label="Masonry layout"
                title="Dynamic Editorial Layout"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="11" rx="1" />
                  <rect x="14" y="3" width="7" height="6" rx="1" />
                  <rect x="14" y="13" width="7" height="8" rx="1" />
                  <rect x="3" y="18" width="7" height="3" rx="1" />
                </svg>
              </button>
              <button
                className={`work-view-btn ${viewMode === 'standard' ? 'work-view-btn--active' : ''}`}
                onClick={() => setViewMode('standard')}
                aria-label="Standard grid layout"
                title="Standard Grid Layout"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                className={`work-view-btn ${viewMode === 'list' ? 'work-view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List layout"
                title="Cinematic Feed Layout"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="work-category-bar">
          {WORK_CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? ALL_PROJECTS.length
                : ALL_PROJECTS.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`work-cat-chip ${activeCategory === cat ? 'work-cat-chip--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="work-cat-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── RESULTS META BAR ── */}
      <div className="work-results-info">
        <span className="work-results-count">
          Showing <strong>{displayedProjects.length}</strong> of{' '}
          <strong>{filteredProjects.length}</strong> matching projects
          {filteredProjects.length !== ALL_PROJECTS.length && ` (from ${ALL_PROJECTS.length} total)`}
        </span>

        {(activeCategory !== 'All' || activeMediaType !== 'all' || searchQuery) && (
          <button className="work-reset-btn" onClick={handleResetFilters}>
            Reset Filters ↺
          </button>
        )}
      </div>

      {/* ── PROJECTS SHOWCASE GRID ── */}
      <section className="page-section work-grid-section">
        {displayedProjects.length === 0 ? (
          <div className="work-empty-state">
            <div className="work-empty-icon">⌕</div>
            <h3 className="work-empty-heading">No 3D projects match your search</h3>
            <p className="work-empty-desc">
              Try searching with different keywords, selecting another category, or resetting all active filters.
            </p>
            <button className="page-btn page-btn--outline" onClick={handleResetFilters}>
              Reset Filters ↺
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${activeCategory}-${activeMediaType}-${viewMode}-${searchQuery}`}
              className={`work-grid--${viewMode}`}
              initial="hidden"
              animate="show"
              variants={staggerGrid}
            >
              {displayedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={(p) => setSelectedProject(p)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── LOAD MORE / PAGINATION BAR ── */}
        {displayedProjects.length < filteredProjects.length && (
          <div className="work-load-more-container">
            <button
              className="work-load-more-btn"
              onClick={() => setVisibleCount((prev) => prev + 24)}
            >
              <span>Load More Showcases (+24)</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </button>

            <div className="work-progress-bar-wrap">
              <div
                className="work-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="work-progress-text">
              {displayedProjects.length} of {filteredProjects.length} 3D projects revealed ({progressPercent}%)
            </span>
          </div>
        )}
      </section>

      {/* ── PROJECT DETAIL MODAL / LIGHTBOX ── */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onPrev={handlePrevProject}
            onNext={handleNextProject}
            hasPrev={currentModalIndex > 0}
            hasNext={currentModalIndex < filteredProjects.length - 1}
          />
        )}
      </AnimatePresence>

      {/* ── BOTTOM CTA ── */}
      <section className="page-section about-cta-section">
        <motion.div
          className="about-cta-inner"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="about-cta-heading">Ready to build your next 3D experience?</h2>
          <p className="about-cta-sub">
            From 100M+ polygon asset baking to interactive 120 FPS web configurators, let's engineer your vision.
          </p>
          <div className="about-cta-actions">
            <Link to="/contact" className="page-btn page-btn--primary">
              Start a project brief
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link to="/services" className="page-btn page-btn--outline">
              Explore 3D Services
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
