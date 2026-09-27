/**
 * ==============================================================================
 * NEXORA STUDIO — GRAPHIC DESIGN & VISUAL ART DIRECTION PORTFOLIO
 * ==============================================================================
 */

import img1 from '../assets/(1).jpeg';
import img2 from '../assets/(2).jpeg';
import img3 from '../assets/(3).jpeg';
import img4 from '../assets/(4).jpeg';
import img5 from '../assets/(5).jpeg';
import img6 from '../assets/(6).jpeg';
import img7 from '../assets/(7).jpeg';
import img8 from '../assets/(8).jpeg';
import cardOrangeAi from '../assets/card_orange_ai.jpg';
import lionTeam from '../assets/lion_team.png';
import lionTrophy from '../assets/lion_trophy.png';
import downloadAsset from '../assets/download.png';

export const WORK_CATEGORIES = [
  'All',
  'Brand Identity',
  'Packaging & Print',
  'Motion & Typography',
  'Editorial Design',
  'Art Direction',
  'Poster Design',
  'Digital Systems',
];

export const MEDIA_TYPES = [
  { id: 'all', label: 'All Projects' },
  { id: 'image', label: 'Case Studies' },
  { id: 'video', label: 'Kinetic & Motion' },
  { id: 'featured', label: 'Featured Spotlight' },
];

export const RAW_PROJECTS = [
  {
    title: 'Aura Skincare — Luxury Brand Identity & Packaging',
    category: 'Packaging & Print',
    client: 'Aura Laboratories Paris',
    year: '2026',
    mediaType: 'image',
    tags: ['Brand Identity', 'Packaging Design', 'Hot Foil Stamping', 'Custom Boxes', 'Embossing'],
    description: 'An architectural luxury packaging architecture featuring blind debossed textured cotton papers, custom amber glass vessels, and a bespoke display logotype.',
    stats: { deliverable: '32 Packaging SKUs', finish: 'Gold Foil & Deboss', impact: '+400% Shelf Velocity' },
    featured: true,
    aspectRatio: 'landscape',
    image: img1,
  },
  {
    title: 'Kinetics Poster Triennial — Animated Typographic Series',
    category: 'Motion & Typography',
    client: 'International Type Festival Berlin',
    year: '2025',
    mediaType: 'video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['Kinetic Typography', 'Poster Design', 'Variable Fonts', 'Motion Graphics', 'Silkscreen'],
    description: 'A kinetic identity and silkscreen poster system celebrating expressive letterforms, variable weight transitions, and chromatic optical layout vibrations.',
    stats: { deliverable: '12 Animated Posters', finish: 'Hand Silkscreen', impact: '2.4M Social Reach' },
    featured: true,
    aspectRatio: 'portrait',
    image: img2,
  },
  {
    title: 'Vanguard Architecture Monograph — Hardcover Book Design',
    category: 'Editorial Design',
    client: 'Vanguard Architectural Review',
    year: '2025',
    mediaType: 'image',
    tags: ['Editorial Design', 'Book Layout', 'Swiss Grid', 'Linen Binding', 'Custom Type'],
    description: 'A 320-page hardcover architectural monograph designed with a rigorous 12-column Swiss grid, curated duo-tone photography plates, and metallic foil debossing.',
    stats: { deliverable: '320 Pages Hardcover', finish: 'Natural Linen & Foil', impact: 'Design Award Winner' },
    featured: false,
    aspectRatio: 'landscape',
    image: img3,
  },
  {
    title: 'Chrono Genève — Haute Horlogerie Visual Universe',
    category: 'Brand Identity',
    client: 'Chrono Genève Horology',
    year: '2026',
    mediaType: 'video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tags: ['Luxury Branding', 'Custom Serif Font', 'Brand Guidelines', 'Macro Photography', 'Embossing'],
    description: 'Complete brand universe for an independent Swiss horologist, including custom crafted serif numerals, leather-bound brand manual, and prestige collectors catalog.',
    stats: { deliverable: 'Full Brand Ecosystem', finish: 'Leather & Blind Deboss', impact: '100% Collector Sellout' },
    featured: true,
    aspectRatio: 'square',
    image: img4,
  },
  {
    title: 'Hyperion Soundworks — Sonic Identity & Holographic Vinyl',
    category: 'Motion & Typography',
    client: 'Hyperion Records London',
    year: '2025',
    mediaType: 'image',
    tags: ['Vinyl Sleeve', 'Holographic Foil', 'Generative Art', 'Sonic Branding', 'Typographic Systems'],
    description: 'Multi-sensory vinyl record packaging featuring generative sound-wave patterns, iridescent holographic foil stamping, and animated audio-reactive social visualizers.',
    stats: { deliverable: 'Gatefold Vinyl & Motion', finish: 'Rainbow Holo Foil', impact: '50K Units Pressed' },
    featured: false,
    aspectRatio: 'portrait',
    image: img5,
  },
  {
    title: 'NeoFlora Botanical Spirits — Sustainable Label Architecture',
    category: 'Packaging & Print',
    client: 'NeoFlora Distilleries',
    year: '2026',
    mediaType: 'image',
    tags: ['Packaging Design', 'Botanical Linework', 'Custom Label', 'Textured Paper', 'Copper Foil'],
    description: 'Organic craft spirits packaging incorporating intricate hand-drawn botanical linework, micro-embossed textured recycled cotton stock, and copper foil neck bands.',
    stats: { deliverable: '6 Spirit Varieties', finish: 'Micro-Emboss & Copper', impact: 'Top Shelf Spirits 2026' },
    featured: true,
    aspectRatio: 'landscape',
    image: img6,
  },
  {
    title: 'Prism Collective — Modular Brand Design System & Tokens',
    category: 'Digital Systems',
    client: 'Prism Creative Network Tokyo',
    year: '2026',
    mediaType: 'image',
    tags: ['Design Systems', 'Figma Token Library', 'Responsive Brandmark', 'Digital Guidelines'],
    description: 'An adaptive visual identity framework built for digital-first creative agencies, complete with responsive vector marks, dynamic typography scales, and motion tokens.',
    stats: { deliverable: 'Design System Library', finish: '140+ Figma Components', impact: 'Adopted across 14 Teams' },
    featured: false,
    aspectRatio: 'square',
    image: img7,
  },
  {
    title: 'Monolith Contemporary Art — Exhibition Identity & Wayfinding',
    category: 'Poster Design',
    client: 'Monolith Foundation Zurich',
    year: '2025',
    mediaType: 'image',
    tags: ['Exhibition Identity', 'Wayfinding', 'Large-Format Banners', 'Typography', 'Catalogs'],
    description: 'Complete spatial and graphic identity for an international modern art exhibition, featuring 15-meter outdoor typographic banners, gallery signage, and merchandise.',
    stats: { deliverable: 'Museum Identity Suite', finish: 'Screenprint & Vinyl', impact: '180K Exhibition Visitors' },
    featured: true,
    aspectRatio: 'portrait',
    image: img8,
  },
  {
    title: 'Aether Sound — Minimalist Tech Branding & Identity Kit',
    category: 'Brand Identity',
    client: 'Aether Acoustics',
    year: '2025',
    mediaType: 'image',
    tags: ['Brand Guidelines', 'Logo Design', 'Geometric Grid', 'Iconography'],
    description: 'A minimalist Scandinavian brand system for high-fidelity audio hardware, engineered with strict geometric grid systems and monolithic monochrome typography.',
    stats: { deliverable: 'Brand Manual & Collateral', finish: 'Spot Matte UV', impact: 'Red Dot Nominee' },
    featured: false,
    aspectRatio: 'landscape',
    image: cardOrangeAi,
  },
  {
    title: 'Studio Morph — Haute Fashion Lookbook & Art Direction',
    category: 'Art Direction',
    client: 'Studio Morph Milan',
    year: '2026',
    mediaType: 'image',
    tags: ['Art Direction', 'Editorial Lookbook', 'High-Fashion Photography', 'Print Direction'],
    description: 'Editorial art direction and lookbook layout for an avant-garde Milanese fashion house, merging brutalist typography with cinematic studio portraiture.',
    stats: { deliverable: 'Spring/Summer Lookbook', finish: 'Japanese Exposed Spine', impact: 'Featured in Vogue & 032c' },
    featured: false,
    aspectRatio: 'portrait',
    image: lionTeam,
  },
  {
    title: 'Solstice Cultural Film Festival — Key Visuals & Billboards',
    category: 'Poster Design',
    client: 'Solstice Cinema Trust',
    year: '2025',
    mediaType: 'image',
    tags: ['Poster Design', 'Key Visual', 'City Banners', 'Program Guide'],
    description: 'Striking high-contrast key visuals, city billboard takeovers, and pocket festival guides celebrating independent cinema through bold geometric typography.',
    stats: { deliverable: 'Festival Collateral Suite', finish: 'UV Outdoor Print', impact: 'Citywide Takeover' },
    featured: false,
    aspectRatio: 'square',
    image: lionTrophy,
  },
  {
    title: 'Quantum AI — Visual Identity & Digital Guidelines',
    category: 'Digital Systems',
    client: 'Quantum AI Systems',
    year: '2026',
    mediaType: 'image',
    tags: ['Brand Identity', 'Generative Motifs', 'Design Tokens', 'Web UI'],
    description: 'Futuristic corporate identity and digital visual guidelines for an artificial intelligence research laboratory, using programmatic gradient grids and custom icons.',
    stats: { deliverable: 'Identity & Web Guidelines', finish: 'Digital Brand System', impact: 'Global Launch 2026' },
    featured: false,
    aspectRatio: 'landscape',
    image: downloadAsset,
  },
];

export const ALL_PROJECTS = RAW_PROJECTS.map((proj, idx) => ({
  ...proj,
  id: `proj-${idx + 1}`,
  number: String(idx + 1).padStart(2, '0'),
}));
