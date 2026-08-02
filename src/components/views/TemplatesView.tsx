'use client';

import React, { useState } from 'react';
import { useAppStore, Project } from '@/store/useAppStore';
import { useEditorStore, CanvasItem } from '@/store/useEditorStore';
import { useBrandStore } from '@/store/useBrandStore';
import { Layers, Search, Bookmark, ArrowRight } from 'lucide-react';
import { calculateDynamicMCQLayout } from '@/utils/canvas-helpers';

interface PresetTemplate {
  name: string;
  category: 'MCQ' | 'Promotional' | 'Academic' | 'Social' | 'Prints';
  width: number;
  height: number;
  description: string;
  createItems: (brandName: string, primaryColor: string, secondaryColor: string, logo: string) => CanvasItem[];
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    name: "Quiz Show Premium Grid Template",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "3D Metallic MCQ Quiz header, double blue neon outline cards, circular option badges with vertical separators. Premium arcade layout.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "quiz-show",
      "জবা ফুলের অমরাবিন্যাস কোন ধরনের?",
      ["অক্ষীয়", "গাত্রীয়", "প্রান্তীয়", "শীর্ষদেশীয়"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Glowing Neon Pink & Cyan MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Cyberpunk themed glowing pink backgrounds and cyan highlights with ambient neon lights.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "neon",
      "Which describes the rate of change of momentum of an object?",
      ["Velocity", "Acceleration", "Force", "Kinetic Energy"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Cyberpunk MCQ Yellow & Magenta",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "High-contrast cyberpunk styling with yellow frames and magenta accent details.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "cyberpunk",
      "What is the molecular geometry of SF6 (Sulfur Hexafluoride)?",
      ["Tetrahedral", "Trigonal Bipyramidal", "Octahedral", "Square Planar"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Retro Synthwave Purple MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Retro grid synthwave aesthetics with pink, purple, and magenta gradients.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "retro-wave",
      "Evaluate the limit: \\lim_{x \\to 0} \\frac{\\sin(x)}{x}.",
      ["0", "1", "Infinity", "Undefined"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Carbon Slate & Hot Red MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Dark carbon background with hot red accent highlights for speed-run quizes.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "speed-run",
      "During which phase of mitosis do sister chromatids separate?",
      ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Frosted Glassmorphism MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Sleek frosted glass look using semi-transparent containers and soft blurred neon spots.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "glassmorphic",
      "Which organelle is responsible for cellular respiration and ATP generation?",
      ["Chloroplast", "Golgi Apparatus", "Mitochondria", "Lysosome"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Classroom Chalkboard Green MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Traditional green chalkboard design with white chalk-styled outline cards and monospaced text.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "chalkboard",
      "পৃথিবীর পৃষ্ঠ থেকে মুক্তিবেগ (Escape velocity) কত?",
      ["৯.৮ কিমি/সে.", "১১.২ কিমি/সে.", "৪২.১ কিমি/সে.", "৭.৫ কিমি/সে."],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Blueprint Sheet Grid MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Technical mathematical blueprint sheet grid with bright cyan outlines.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "math-sheets",
      "Solve the derivative: \\frac{d}{dx} (e^{x^2}).",
      ["e^{x^2}", "2x e^{x^2}", "x^2 e^{x^2-1}", "2 e^{x^2}"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Indigo Interactive Poll MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Clean interactive style poll template with checkbox outline indicators.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "interactive-poll",
      "What does IP stand for in network terminology?",
      ["Intranet Protocol", "Information Provider", "Internet Protocol", "Instant Portability"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Soft Pastel & Cream Card MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Charming pastel cream card setup using soft colors and spacious layouts.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "pastel",
      "Which river is the longest in the world?",
      ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Minimalist Academic Serif MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Clean book style academic outline with serif typography and maximum spacing.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "minimalist",
      "What is the primary function of DNA in living organisms?",
      ["Energy storage", "Storage of genetic information", "Catalyzing metabolic reactions", "Forming cellular membranes"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Golden Amber & Dark Navy MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Luxury dark navy card design with golden amber decorations.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "classic-board",
      "সীма মূল্যায়ন করুন: \\lim_{x \\to 0} \\frac{\\sin(x)}{x}।",
      ["০", "১", "অসীম", "অসংজ্ঞায়িত"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Modern Academy Slate Card MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Clean slate-grey layout optimized for digital classrooms and academies.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "modern-academy",
      "ক্ষারীয় দ্রবণে কোন নির্দেশকটি গোলাপী বর্ণ ধারণ করে?",
      ["মিথাইল অরেঞ্জ", "ফেনলফথ্যালিন", "লিটমাস পেপার", "ব্রোমোথাইমল ব্লু"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Sunset Orange & Purple MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Vibrant sunset glow layout with warm orange accents and purple backdrops.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "sunset-gradient",
      "উদ্ভিদ কোষের শক্তিঘর (Powerhouse) বলা হয় কোন অঙ্গাণুটিকে?",
      ["প্লাস্টিড", "গলজি বডি", "মাইটোকন্ড্রিয়া", "লাইসোসোম"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Coaching Special Red & White MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "High-contrast red banner with white card text blocks for local coaching centers.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "coaching-special",
      "কোনটি বস্তুর ভরবেগের পরিবর্তনের হারের সমান?",
      ["বেগ", "ত্বরণ", "বল", "গতিশক্তি"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Stealth Black & Zn-zinc Outline MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Stealth look using pitch-black backgrounds and clean zinc-gray borders.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "dark-stealth",
      "What is the speed of light in a vacuum?",
      ["3.00 × 10⁸ m/s", "3.00 × 10⁵ m/s", "1.50 × 10⁸ m/s", "9.81 m/s"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Royal Emerald & Gold Accent MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Premium emerald green layout with amber gold card decorations.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "royal-gold",
      "একটি বৃত্তের ব্যাসার্ধ r হলে, তার ক্ষেত্রফলের সূত্র কী?",
      ["২\\pi r", "\\pi r^2", "\\pi d", "\\frac{4}{3}\\pi r^3"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Corporate Clean Navy Blue MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Clean corporate layout with solid navy blue headers and minimal branding.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "corporate-clean",
      "IP-এর পূর্ণরূপ কী?",
      ["Internet Protocol", "Internet Provider", "Information Port", "Instant Packet"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Standard Vertical Stack MCQ",
    category: "MCQ",
    width: 800,
    height: 900,
    description: "Spacious vertical stack layout ideal for long questions and explanations.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "stacked",
      "What is the result of evaluating the derivative:\n\\frac{d}{dx} (x^2 \\sin(x))?",
      ["2x \\sin(x) + x^2 \\cos(x)", "2x \\cos(x)", "x^2 \\cos(x) - 2x", "None of these"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Quizizz 2x2 Grid MCQ",
    category: "MCQ",
    width: 800,
    height: 800,
    description: "Balanced 2x2 grid layout resembling classic quiz game systems.",
    createItems: (brand, primary, secondary, logo) => calculateDynamicMCQLayout(
      "grid",
      "What is the speed of light in a vacuum?",
      ["3.00 × 10⁸ m/s", "3.00 × 10⁵ m/s", "1.50 × 10⁸ m/s", "9.81 m/s"],
      brand,
      primary,
      secondary,
      logo
    ).items
  },
  {
    name: "Admission Open Flyer",
    category: "Promotional",
    width: 800,
    height: 1000,
    description: "Standard poster layout for enrollment announcements, features listing, and call-to-actions.",
    createItems: (brand, primary, secondary, logo) => [
      // Base
      {
        id: 'flyer-bg',
        type: 'shape',
        x: 0, y: 0, width: 800, height: 1000, rotation: 0, opacity: 1, locked: true, zIndex: 1,
        shapeProps: { shapeType: 'rect', fill: '#0a0d14', stroke: secondary, strokeWidth: 2 }
      },
      // Top header banner background shape
      {
        id: 'flyer-banner',
        type: 'shape',
        x: 0, y: 0, width: 800, height: 260, rotation: 0, opacity: 1, locked: false, zIndex: 2,
        shapeProps: { shapeType: 'rect', fill: primary, stroke: '', strokeWidth: 0 }
      },
      // Brand Name in header
      {
        id: 'header-brand',
        type: 'text',
        x: 50, y: 60, width: 700, height: 40, rotation: 0, opacity: 1, locked: false, zIndex: 3,
        textProps: {
          content: brand.toUpperCase(),
          fontSize: 20,
          fontFamily: 'Outfit',
          color: '#ffffff',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 3,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Admission Open Text
      {
        id: 'admission-title',
        type: 'text',
        x: 50, y: 110, width: 700, height: 80, rotation: 0, opacity: 1, locked: false, zIndex: 4,
        textProps: {
          content: "ADMISSIONS OPEN",
          fontSize: 48,
          fontFamily: 'Outfit',
          color: '#ffffff',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 2,
          lineHeight: 1.2,
          glow: true,
          shadow: ''
        }
      },
      // Session info
      {
        id: 'session-text',
        type: 'text',
        x: 50, y: 190, width: 700, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 5,
        textProps: {
          content: "Academic Session 2026 - 2027",
          fontSize: 18,
          fontFamily: 'Inter',
          color: secondary,
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 1,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Large graphics outline
      {
        id: 'sci-graphic',
        type: 'shape', // Fallback illustration shape
        x: 275, y: 340, width: 250, height: 250, rotation: 0, opacity: 0.9, locked: false, zIndex: 6,
        shapeProps: { shapeType: 'circle', fill: 'rgba(255,255,255,0.02)', stroke: secondary, strokeWidth: 2 }
      },
      // Facilities text
      {
        id: 'facilities-title',
        type: 'text',
        x: 100, y: 650, width: 600, height: 40, rotation: 0, opacity: 1, locked: false, zIndex: 7,
        textProps: {
          content: "Why Choose Elite Workspace?",
          fontSize: 24,
          fontFamily: 'Outfit',
          color: secondary,
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      {
        id: 'facilities-list',
        type: 'text',
        x: 150, y: 710, width: 500, height: 120, rotation: 0, opacity: 1, locked: false, zIndex: 8,
        textProps: {
          content: "✓ World Class STEM Laboratory & Research Hubs\n✓ Expert International Ph.D. Faculty & Consultants\n✓ Standardized University-level Prep and Olympiads\n✓ 100% Scholarship options for meritorious candidates",
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#cbd5e1',
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
          letterSpacing: 0,
          lineHeight: 1.8,
          glow: false,
          shadow: ''
        }
      },
      // CTA Button
      {
        id: 'cta-box',
        type: 'shape',
        x: 300, y: 860, width: 200, height: 50, rotation: 0, opacity: 1, locked: false, zIndex: 9,
        shapeProps: { shapeType: 'rect', fill: secondary, stroke: '', strokeWidth: 0 }
      },
      {
        id: 'cta-text',
        type: 'text',
        x: 300, y: 875, width: 200, height: 25, rotation: 0, opacity: 1, locked: false, zIndex: 10,
        textProps: {
          content: "APPLY NOW",
          fontSize: 14,
          fontFamily: 'Outfit',
          color: '#090d14',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 1.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      }
    ]
  },
  {
    name: "Certificate of Merit",
    category: "Prints",
    width: 1123, // A4 landscape ratio
    height: 794,
    description: "Elegant layout for student achievements, complete with double gold-bordered frames and signature nodes.",
    createItems: (brand, primary, secondary, logo) => [
      // Certificate boundary
      {
        id: 'cert-bg',
        type: 'shape',
        x: 0, y: 0, width: 1123, height: 794, rotation: 0, opacity: 1, locked: true, zIndex: 1,
        shapeProps: { shapeType: 'rect', fill: '#fafaf9', stroke: '#d97706', strokeWidth: 10 }
      },
      {
        id: 'cert-inner-frame',
        type: 'shape',
        x: 20, y: 20, width: 1083, height: 754, rotation: 0, opacity: 1, locked: true, zIndex: 2,
        shapeProps: { shapeType: 'rect', fill: 'transparent', stroke: '#fbbf24', strokeWidth: 2 }
      },
      // Institution Header
      {
        id: 'cert-institution',
        type: 'text',
        x: 200, y: 80, width: 723, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 3,
        textProps: {
          content: brand.toUpperCase(),
          fontSize: 22,
          fontFamily: 'Outfit',
          color: '#1e293b',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 3,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Certificate Title
      {
        id: 'cert-title',
        type: 'text',
        x: 200, y: 130, width: 723, height: 70, rotation: 0, opacity: 1, locked: false, zIndex: 4,
        textProps: {
          content: "CERTIFICATE OF MERIT",
          fontSize: 42,
          fontFamily: 'Georgia',
          color: '#92400e',
          bold: true,
          italic: true,
          underline: false,
          align: 'center',
          letterSpacing: 2,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Presentation sentence
      {
        id: 'cert-presented-to',
        type: 'text',
        x: 200, y: 240, width: 723, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 5,
        textProps: {
          content: "This is proudly presented to",
          fontSize: 16,
          fontFamily: 'Georgia',
          color: '#475569',
          bold: false,
          italic: true,
          underline: false,
          align: 'center',
          letterSpacing: 1,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Student Name placeholder
      {
        id: 'cert-student-name',
        type: 'text',
        x: 200, y: 290, width: 723, height: 60, rotation: 0, opacity: 1, locked: false, zIndex: 6,
        textProps: {
          content: "Jane Doe",
          fontSize: 36,
          fontFamily: 'Outfit',
          color: '#0f172a',
          bold: true,
          italic: false,
          underline: true,
          align: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Accomplishment detail
      {
        id: 'cert-reason',
        type: 'text',
        x: 150, y: 390, width: 823, height: 80, rotation: 0, opacity: 1, locked: false, zIndex: 7,
        textProps: {
          content: "for outstanding academic performance and securing the 1st Rank in the Science Olympiad, showcasing exemplary logical reasoning and problem solving excellence.",
          fontSize: 16,
          fontFamily: 'Georgia',
          color: '#334155',
          bold: false,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0,
          lineHeight: 1.6,
          glow: false,
          shadow: ''
        }
      },
      // Signature lines
      {
        id: 'sig-line-1',
        type: 'shape',
        x: 200, y: 620, width: 250, height: 2, rotation: 0, opacity: 1, locked: false, zIndex: 8,
        shapeProps: { shapeType: 'line', fill: '#475569', stroke: '#475569', strokeWidth: 1.5 }
      },
      {
        id: 'sig-label-1',
        type: 'text',
        x: 200, y: 630, width: 250, height: 25, rotation: 0, opacity: 1, locked: false, zIndex: 9,
        textProps: {
          content: "Olympiad Organizer",
          fontSize: 12,
          fontFamily: 'Inter',
          color: '#475569',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      {
        id: 'sig-line-2',
        type: 'shape',
        x: 673, y: 620, width: 250, height: 2, rotation: 0, opacity: 1, locked: false, zIndex: 10,
        shapeProps: { shapeType: 'line', fill: '#475569', stroke: '#475569', strokeWidth: 1.5 }
      },
      {
        id: 'sig-label-2',
        type: 'text',
        x: 673, y: 630, width: 250, height: 25, rotation: 0, opacity: 1, locked: false, zIndex: 11,
        textProps: {
          content: "Institution Principal",
          fontSize: 12,
          fontFamily: 'Inter',
          color: '#475569',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      }
    ]
  }
];

export default function TemplatesView() {
  const { setView, setCurrentProject, saveProject } = useAppStore();
  const { loadDesign } = useEditorStore();
  const { brandKit } = useBrandStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | PresetTemplate['category']>('All');

  const handleSelectTemplate = (template: PresetTemplate) => {
    // Compile items from brand kit settings
    const logoUrl = brandKit.logos.length > 0 ? brandKit.logos[0] : '';
    const initialItems = template.createItems(
      brandKit.brandName,
      brandKit.primaryColor,
      brandKit.secondaryColor,
      logoUrl
    );

    const newProjectId = `project-template-${Date.now()}`;
    const newProject = {
      id: newProjectId,
      name: `${template.name} Draft`,
      canvasWidth: template.width,
      canvasHeight: template.height,
      items: initialItems,
      category: template.category
    };

    // Save into list and load editor
    saveProject(newProject);
    loadDesign(initialItems, template.width, template.height);
    setCurrentProject(newProjectId);
    setView('editor');
  };

  const filteredTemplates = PRESET_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'MCQ', 'Promotional', 'Academic', 'Social', 'Prints'] as const;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Template Library</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select one of our preset educational designs. They auto-bind to your custom logo and primary colors.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg glass-input text-foreground"
            placeholder="Search templates..."
          />
        </div>
      </div>

      {/* Categories chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
              activeCategory === cat
                ? 'gradient-bg text-white'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-[var(--glass-border)] text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center p-12 rounded-2xl border border-dashed border-[var(--glass-border)]">
          <Layers className="w-10 h-10 text-slate-500 mx-auto stroke-1" />
          <p className="font-semibold text-sm mt-3">No templates matched your query</p>
          <p className="text-xs text-muted-foreground mt-1">Try relaxing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map((t, idx) => (
            <div
              key={idx}
              className="group border border-[var(--glass-border)] rounded-2xl bg-slate-900/10 dark:bg-slate-900/50 p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                    {t.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {t.width} x {t.height} px
                  </span>
                </div>
                <h4 className="font-bold text-base mt-2">{t.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{t.description}</p>
              </div>

              <button
                onClick={() => handleSelectTemplate(t)}
                className="mt-5 w-full py-2.5 rounded-lg border border-indigo-500/50 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-indigo-400"
              >
                Use Preset Layout
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
