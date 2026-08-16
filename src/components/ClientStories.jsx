import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion';

import avatarTechnis from '../assets/avatar_technis_1786869124435.jpg';
import avatarLuxury from '../assets/avatar_luxury_1786869145501.jpg';
import avatarCredible from '../assets/avatar_credible_1786869168589.jpg';
import avatarFastResume from '../assets/avatar_fastresume_1786869197082.jpg';
import avatarVentigence from '../assets/avatar_ventigence_1786869228454.jpg';

import './ClientStories.css';

const STORIES = [
  {
    id: 'luxury-presence',
    name: 'LUXURY PRESENCE',
    quote:
      'Working with Sunny and his team transformed how our ultra-luxury properties are experienced online. The spatial 3D interfaces and attention to micro-details are second to none.',
    author: 'Alexander Vance',
    role: 'VP of Product · USA',
    avatar: avatarLuxury,
  },
  {
    id: 'credible',
    name: 'CREDIBLE',
    quote:
      'An exceptional blend of cutting-edge technology and aesthetic perfection. They delivered beyond expectations, on time, with remarkable craft and attention to performance.',
    author: 'Sarah Jenkins',
    role: 'Head of Brand · UK',
    avatar: avatarCredible,
  },
  {
    id: 'fast-resume',
    name: 'FAST RESUME',
    quote:
      'From initial concept to deployment, their generative AI capabilities and interactive design elevated our platform to enterprise scale seamlessly.',
    author: 'David Chen',
    role: 'Founder & CEO · Singapore',
    avatar: avatarFastResume,
  },
  {
    id: 'technis',
    name: 'TECHNIS',
    quote:
      'Sunny and his team is a very professional, with whom I am used to working on different projects. listening, versatile, very smart, I recommend without hesitation.',
    author: 'Jean-Baptiste Biolay',
    role: 'General Manager · UAE',
    avatar: avatarTechnis,
  },
  {
    id: 'ventigence',
    name: 'VENTIGENCE',
    quote:
      'Unmatched precision and dedication. Their team brought our complex algorithmic vision to life with fluid animations and flawless performance.',
    author: 'Elena Rostova',
    role: 'Director of Engineering · Switzerland',
    avatar: avatarVentigence,
  },
];

const ClientStories = () => {
  const [currentIndex, setCurrentIndex] = useState(3); // Start with TECHNIS (index 3)
  const sectionRef = useRef(null);

  // 3D Perspective Scroll-Linked Entrance Animation (Matching Key Facts entrance)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [18, 0]);
  const rotateY = useTransform(smoothProgress, [0, 1], [-4, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.82, 1]);
  const translateZ = useTransform(smoothProgress, [0, 1], [-260, 0]);
  const opacity = useTransform(smoothProgress, [0, 0.25, 1], [0, 0.65, 1]);
  const y = useTransform(smoothProgress, [0, 1], [110, 0]);

  const currentStory = STORIES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? STORIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === STORIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="stories" ref={sectionRef} className="cs__section">
      <div className="cs__perspective-stage">
        <motion.div
          className="cs__animated-container"
          style={{
            rotateX,
            rotateY,
            scale,
            translateZ,
            opacity,
            y,
          }}
        >
          <div className="cs__container">
            {/* ── TOP HEADER: TITLE ON LEFT, SUBTITLE ON RIGHT ── */}
            <motion.div
              className="cs__header-row"
              initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="cs__title-col">
                <h2 className="cs__main-title">Client stories</h2>
              </div>

              <div className="cs__subtitle-col">
                <p className="cs__subtitle-text">
                  Great work is built through
                  <br />
                  partnership. Here's what
                  <br />
                  our clients say.
                </p>
              </div>
            </motion.div>

            {/* ── HORIZONTAL DIVIDER WITH CENTER CROSSHAIR ── */}
            <div className="cs__divider-wrap">
              <div className="cs__divider-line" />
              <span className="cs__crosshair">+</span>
            </div>

            {/* ── MAIN CONTENT SPLIT GRID ── */}
            <div className="cs__content-grid">
              {/* LEFT COLUMN: Client List & Bottom Navigation Arrows */}
              <div className="cs__left-col">
                <div className="cs__client-list" role="tablist">
                  {STORIES.map((item, index) => {
                    const isActive = index === currentIndex;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        className={`cs__client-btn ${
                          isActive ? 'cs__client-btn--active' : ''
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      >
                        <span className="cs__client-name">{item.name}</span>
                        {isActive && (
                          <motion.span
                            layoutId="csActiveArrow"
                            className="cs__active-arrow"
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 4 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            →
                          </motion.span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Left Square Arrow Nav Buttons */}
                <div className="cs__nav-buttons">
                  <button
                    className="cs__nav-btn"
                    onClick={handlePrev}
                    aria-label="Previous story"
                  >
                    <span className="cs__btn-arrow">←</span>
                  </button>
                  <button
                    className="cs__nav-btn"
                    onClick={handleNext}
                    aria-label="Next story"
                  >
                    <span className="cs__btn-arrow">→</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Testimonial Quote, Avatar/Role & CTA */}
              <div className="cs__right-col">
                <div className="cs__quote-wrapper">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStory.id}
                      className="cs__quote-content"
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <p className="cs__quote-text">{currentStory.quote}</p>

                      {/* Author Info with Photo */}
                      <div className="cs__author-block">
                        <div className="cs__avatar-wrap">
                          <img
                            src={currentStory.avatar}
                            alt={currentStory.author}
                            className="cs__avatar-img"
                          />
                        </div>
                        <div className="cs__author-details">
                          <span className="cs__author-name">
                            {currentStory.author}
                          </span>
                          <span className="cs__author-role">
                            {currentStory.role}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom CTA Link */}
                <div className="cs__cta-row">
                  <a href="#contact" className="cs__cta-link">
                    <span>BECOME A CLIENT</span>
                    <span className="cs__cta-arrow">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientStories;
