import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';
import '../pages/pages.css';

const SERVICES_OPTIONS = [
  'AI & Intelligent Automation',
  'Web & Software Development',
  'Creative Tech & Spatial 3D',
  'Website & Mobile Design',
  'Brand Strategy & Systems',
  'Cloud & DevOps',
];

const BUDGET_OPTIONS = ['< $10,000', '$10,000 – $25,000', '$25,000 – $50,000', '$50,000+'];

const FAQS = [
  {
    q: 'How quickly can we kick off a new project?',
    a: 'We typically start discovery sprints within 1–2 weeks of agreement finalization. For urgent timelines, accelerated sprints are available.',
  },
  {
    q: 'Do you collaborate with startups as well as enterprise brands?',
    a: 'Yes. We partner with ambitious early-stage founders building category-defining products, as well as global enterprises needing high-velocity innovation labs.',
  },
  {
    q: 'What does a typical project team look like?',
    a: 'Every engagement is led by a dedicated creative director, a lead designer, and senior engineers with direct Slack/Teams access.',
  },
  {
    q: 'Can we book a short intro call first?',
    a: 'Absolutely. Use the link on the right to grab a 30-minute discovery slot directly on our calendar.',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('$10,000 – $25,000');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (svc) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

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
          <span className="page-hero__tag-dot" /> Contact &amp; Enquiries
        </motion.div>

        <motion.h1
          className="page-hero__heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          Let's build<br />
          something <em>bold</em>.
        </motion.h1>

        <motion.p
          className="page-hero__subheading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Have an idea, project, or partnership in mind? Fill in the brief below or book a direct
          discovery call.
        </motion.p>

        <div className="page-hero__meta">
          <span className="page-hero__meta-line">Typical reply in &lt; 24h</span>
          <span className="page-hero__meta-line">Global Availability</span>
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ── */}
      <section className="page-section">
        <div className="contact-layout-grid">
          {/* Left Form */}
          <motion.div
            className="contact-form-card"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '3rem 1rem' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✦</div>
                <h3 style={{ fontFamily: 'Syne', fontSize: '2rem', marginBottom: '0.8rem' }}>
                  Thank you, {formData.name}!
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 2rem' }}>
                  We've received your project inquiry. A creative partner will review your brief and get back to you within 24 hours.
                </p>
                <button
                  className="page-btn page-btn--outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', company: '', message: '' });
                    setSelectedServices([]);
                  }}
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div>
                  <h3 className="contact-form-heading">Project Brief</h3>
                  <p className="contact-form-sub">Tell us about what you're creating.</p>
                </div>

                {/* Name & Email */}
                <div className="contact-form-row">
                  <div className="contact-field">
                    <label className="contact-label">Your Name *</label>
                    <input
                      type="text"
                      className="contact-input"
                      placeholder="Alex Vance"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="contact-field">
                    <label className="contact-label">Email Address *</label>
                    <input
                      type="email"
                      className="contact-input"
                      placeholder="alex@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company / Brand */}
                <div className="contact-field">
                  <label className="contact-label">Company / Brand Name</label>
                  <input
                    type="text"
                    className="contact-input"
                    placeholder="Vanguard Innovations Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                {/* Services Needed */}
                <div className="contact-field">
                  <label className="contact-label">Services Required</label>
                  <div className="contact-chip-group">
                    {SERVICES_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`contact-chip-option ${
                          selectedServices.includes(s) ? 'contact-chip-option--selected' : ''
                        }`}
                        onClick={() => toggleService(s)}
                      >
                        {selectedServices.includes(s) ? '✓ ' : '+ '}
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="contact-field">
                  <label className="contact-label">Estimated Budget</label>
                  <div className="contact-chip-group">
                    {BUDGET_OPTIONS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`contact-chip-option ${
                          selectedBudget === b ? 'contact-chip-option--selected' : ''
                        }`}
                        onClick={() => setSelectedBudget(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="contact-field">
                  <label className="contact-label">Project Details &amp; Goals</label>
                  <textarea
                    className="contact-textarea"
                    placeholder="Tell us about your project, timeline, deliverables, and goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="page-btn page-btn--primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                  Send Project Brief
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </form>
            )}
          </motion.div>

          {/* Right Sidebar */}
          <div className="contact-info-sidebar">
            <motion.div
              className="contact-sidebar-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="contact-sidebar-heading">Direct Contact</div>

              <div className="contact-direct-item">
                <span className="contact-direct-title">EMAIL US</span>
                <a href="mailto:hello@studio.com" className="contact-direct-val">
                  hello@studio.com
                </a>
              </div>

              <div className="contact-direct-item">
                <span className="contact-direct-title">CALL US</span>
                <a href="tel:+919824182099" className="contact-direct-val">
                  +91 98241 82099
                </a>
              </div>

              <div className="contact-direct-item">
                <span className="contact-direct-title">CALENDAR</span>
                <a
                  href="https://cal.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-direct-val"
                  style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
                >
                  Book a 30-min discovery call ↗
                </a>
              </div>
            </motion.div>

            <motion.div
              className="contact-sidebar-block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="contact-sidebar-heading">Studio Locations</div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.7)' }}>
                <strong>San Francisco</strong> · California, USA<br />
                <strong>London</strong> · United Kingdom<br />
                <strong>Dubai</strong> · United Arab Emirates
              </p>
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
                Remote-first team distributed across 6 time zones.
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="page-divider" />

      {/* ── FAQS SECTION ── */}
      <section className="page-section page-section--mid">
        <motion.div className="page-section__label" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Frequently Asked
        </motion.div>
        <motion.h2 className="page-section__heading" style={{ marginBottom: '2.5rem' }} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
          Common questions.
        </motion.h2>

        <motion.div className="page-grid-2" initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          {FAQS.map((faq) => (
            <motion.div key={faq.q} className="contact-faq-card" variants={fadeUp}>
              <h4 className="contact-faq-question">{faq.q}</h4>
              <p className="contact-faq-answer">{faq.a}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
