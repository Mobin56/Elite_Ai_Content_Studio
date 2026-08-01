// Educational AI Generator helper for Elite AI Content Studio

export interface MCQQuestion {
  question: string;
  options: [string, string, string, string];
  answer: string; // The correct option content or index A/B/C/D
  explanation: string;
}

export interface CopywritingOutput {
  headline: string;
  description: string;
  facebookCaption: string;
  instagramCaption: string;
  youtubeDescription: string;
  seoKeywords: string[];
  cta: string;
}

// High quality mock databases for educational categories in English
const mockMCQData: Record<string, MCQQuestion[]> = {
  Physics: [
    {
      question: "Which of the following describes the rate of change of momentum of an object?",
      options: ["Velocity", "Acceleration", "Force", "Kinetic Energy"],
      answer: "Force",
      explanation: "According to Newton's Second Law of Motion, the rate of change of momentum is directly proportional to the applied force and takes place in the direction in which the force acts. (F = dp/dt)."
    },
    {
      question: "The escape velocity from the surface of the Earth is approximately:",
      options: ["9.8 km/s", "11.2 km/s", "42.1 km/s", "7.5 km/s"],
      answer: "11.2 km/s",
      explanation: "Escape velocity is the minimum speed needed for a free, non-propelled object to escape from the gravitational influence of a primary body. For Earth, v_e = \\sqrt{2GM/R} \\approx 11.2 \\text{ km/s}."
    },
    {
      question: "What is the speed of light in a vacuum?",
      options: ["3.00 × 10⁸ m/s", "3.00 × 10⁵ m/s", "1.50 × 10⁸ m/s", "9.81 m/s"],
      answer: "3.00 × 10⁸ m/s",
      explanation: "The speed of light in a vacuum, commonly denoted as c, is a universal physical constant exactly equal to 299,792,458 meters per second (approx. 3.00 × 10⁸ m/s)."
    }
  ],
  Chemistry: [
    {
      question: "What is the molecular geometry of SF₆ (Sulfur Hexafluoride)?",
      options: ["Tetrahedral", "Trigonal Bipyramidal", "Octahedral", "Square Planar"],
      answer: "Octahedral",
      explanation: "Sulfur hexafluoride has six bonding pairs around the central sulfur atom and zero lone pairs, giving it an octahedral shape with bond angles of 90 degrees."
    },
    {
      question: "Which indicator turns pink in basic solutions?",
      options: ["Methyl Orange", "Phenolphthalein", "Litmus Paper", "Bromothymol Blue"],
      answer: "Phenolphthalein",
      explanation: "Phenolphthalein is a chemical compound commonly used as a pH indicator. It remains colorless in acidic solutions but turns magenta or pink in basic solutions (pH > 8.2)."
    }
  ],
  Mathematics: [
    {
      question: "Evaluate the limit: \\lim_{x \\to 0} \\frac{\\sin(x)}{x}.",
      options: ["0", "1", "Infinity", "Undefined"],
      answer: "1",
      explanation: "Using L'Hopital's rule or geometric limits, \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = \\lim_{x \\to 0} \\frac{\\cos(x)}{1} = \\cos(0) = 1."
    },
    {
      question: "Solve the derivative: \\frac{d}{dx} (e^{x^2}).",
      options: ["e^{x^2}", "2x e^{x^2}", "x^2 e^{x^2-1}", "2 e^{x^2}"],
      answer: "2x e^{x^2}",
      explanation: "Applying the Chain Rule: let u = x^2, then d/dx(e^u) = e^u * du/dx. Since du/dx = 2x, the derivative is 2x * e^{x^2}."
    }
  ],
  Biology: [
    {
      question: "Which organelle is responsible for cellular respiration and ATP generation?",
      options: ["Chloroplast", "Golgi Apparatus", "Mitochondria", "Lysosome"],
      answer: "Mitochondria",
      explanation: "Mitochondria are known as the powerhouses of the cell. They convert oxygen and nutrients into adenosine triphosphate (ATP), the primary energy currency of the cell."
    },
    {
      question: "During which phase of mitosis do sister chromatids separate?",
      options: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
      answer: "Anaphase",
      explanation: "In Anaphase, the spindle fibers shorten, pulling the sister chromatids apart toward opposite poles of the dividing cell."
    }
  ],
  ICT: [
    {
      question: "What does IP stand for in network terminology?",
      options: ["Intranet Protocol", "Information Provider", "Internet Protocol", "Instant Portability"],
      answer: "Internet Protocol",
      explanation: "IP stands for Internet Protocol. It is the principal communications protocol in the Internet protocol suite for relaying datagrams across network boundaries."
    }
  ],
  GK: [
    {
      question: "Which river is the longest in the world?",
      options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
      answer: "Nile River",
      explanation: "The Nile River is traditionally considered the longest river in the world, stretching approximately 6,650 kilometers (4,132 miles) through northeastern Africa."
    }
  ]
};

// High quality mock databases for educational categories in Bangla
const mockBanglaMCQData: Record<string, MCQQuestion[]> = {
  Physics: [
    {
      question: "কোনটি বস্তুর ভরবেগের পরিবর্তনের হারের সমান?",
      options: ["বেগ", "ত্বরণ", "বল", "গতিশক্তি"],
      answer: "বল",
      explanation: "নিউটনের গতির দ্বিতীয় সূত্রানুসারে, বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকেই ঘটে। (F = dp/dt)।"
    },
    {
      question: "পৃথিবীর পৃষ্ঠ থেকে মুক্তিবেগ (Escape velocity) কত?",
      options: ["৯.৮ কিমি/সে.", "১১.২ কিমি/সে.", "৪২.১ কিমি/সে.", "৭.৫ কিমি/সে."],
      answer: "১১.২ কিমি/সে.",
      explanation: "পৃথিবী পৃষ্ঠ থেকে যেকোনো বস্তুকে সেকেন্ডে ১১.২ কিমি বেগে উপরের দিকে নিক্ষেপ করলে তা আর পৃথিবীতে ফিরে আসে না। একে মুক্তিবেগ বলে।"
    }
  ],
  Chemistry: [
    {
      question: "ক্ষারীয় দ্রবণে কোন নির্দেশকটি গোলাপী বর্ণ ধারণ করে?",
      options: ["মিথাইল অরেঞ্জ", "ফেনলফথ্যালিন", "লিটমাস পেপার", "ব্রোমোথাইমল ব্লু"],
      answer: "ফেনলফথ্যালিন",
      explanation: "ফেনলফথ্যালিন অম্লীয় দ্রবণে বর্ণহীন থাকে কিন্তু ক্ষারীয় দ্রবণে (pH > ৪.২) গোলাপী বা বেগুনি বর্ণ ধারণ করে।"
    },
    {
      question: "পানির রাসায়নিক সংকেত কোনটি?",
      options: ["H2O", "CO2", "NaCl", "HCl"],
      answer: "H2O",
      explanation: "পানির অণু দুটি হাইড্রোজেন পরমাণু এবং একটি অক্সিজেন পরমাণু দ্বারা গঠিত।"
    }
  ],
  Mathematics: [
    {
      question: "সীমা মূল্যায়ন করুন: \\lim_{x \\to 0} \\frac{\\sin(x)}{x}।",
      options: ["০", "১", "অসীম", "অসংজ্ঞায়িত"],
      answer: "১",
      explanation: "L'Hopital এর সূত্র বা জ্যামিতিক সীমা ব্যবহার করে, \\lim_{x \\to 0} \\frac{\\sin(x)}{x} = ১।"
    },
    {
      question: "একটি বৃত্তের ব্যাসার্ধ r হলে, তার ক্ষেত্রফলের সূত্র কী?",
      options: ["২\\pi r", "\\pi r^2", "\\pi d", "\\frac{4}{3}\\pi r^3"],
      answer: "\\pi r^2",
      explanation: "r ব্যাসার্ধের একটি বৃত্তের ক্ষেত্রফল হলো \\pi r^2।"
    }
  ],
  Biology: [
    {
      question: "উদ্ভিদ কোষের শক্তিঘর (Powerhouse) বলা হয় কোন অঙ্গাণুটিকে?",
      options: ["প্লাস্টিড", "গলজি বডি", "مাইটোকন্ড্রিয়া", "লাইসোসোম"],
      answer: "মাইটোকন্ড্রিয়া",
      explanation: "মাইটোকন্ড্রিয়ায় কোষের সমস্ত শক্তির বিপাকীয় কাজ সম্পন্ন হয় এবং ATP উৎপন্ন হয়, তাই একে কোষের শক্তিঘর বলা হয়।"
    }
  ],
  ICT: [
    {
      question: "IP-এর পূর্ণরূপ কী?",
      options: ["Internet Protocol", "Internet Provider", "Information Port", "Instant Packet"],
      answer: "Internet Protocol",
      explanation: "IP হলো Internet Protocol যা ইন্টারনেটে ডাটা প্যাকেট আদান-প্রদানের প্রধান নিয়মাবলী বা অ্যাড্রেস নির্ধারণ করে।"
    }
  ],
  GK: [
    {
      question: "বিশ্বের দীর্ঘতম নদী কোনটি?",
      options: ["আমাজন নদী", "নীল নদ", "ইয়াংসি নদী", "মিসিসিপি নদী"],
      answer: "নীল নদ",
      explanation: "নীল নদ হলো বিশ্বের দীর্ঘতম নদী, যার দৈর্ঘ্য প্রায় ৬,৬৫০ কিলোমিটার এবং এটি আফ্রিকায় অবস্থিত।"
    }
  ]
};

const defaultMCQ: MCQQuestion = {
  question: "What is the primary function of DNA in living organisms?",
  options: ["Energy storage", "Storage of genetic information", "Catalyzing metabolic reactions", "Forming cellular membranes"],
  answer: "Storage of genetic information",
  explanation: "Deoxyribonucleic acid (DNA) is a molecule that carries the genetic instructions used in the growth, development, functioning, and reproduction of all known living organisms."
};

// SVG illustration drawings for educational subjects
export const mockSVGIllustrations: Record<string, string> = {
  Science: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="url(#sciGrad)" stroke-width="2" stroke-dasharray="4 2"/>
    <path d="M40 30L60 70M60 30L40 70" stroke="#22d3ee" stroke-width="1.5"/>
    <circle cx="40" cy="30" r="5" fill="#f43f5e"/>
    <circle cx="60" cy="70" r="5" fill="#6366f1"/>
    <circle cx="60" cy="30" r="3" fill="#3b82f6"/>
    <circle cx="40" cy="70" r="3" fill="#10b981"/>
    <path d="M50 20C65 20 65 80 50 80C35 80 35 20 50 20Z" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="1 1"/>
    <defs>
      <linearGradient id="sciGrad" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#22d3ee"/>
      </linearGradient>
    </defs>
  </svg>`,
  Biology: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 20C40 30 60 30 70 20M30 40C40 50 60 50 70 40M30 60C40 70 60 70 70 60M30 80C40 90 60 90 70 80" stroke="#10b981" stroke-width="2"/>
    <path d="M70 20C60 30 40 30 30 20M70 40C60 50 40 50 30 40M70 60C60 70 40 70 30 60M70 80C60 90 40 90 30 80" stroke="#3b82f6" stroke-width="2"/>
    <line x1="40" y1="23" x2="60" y2="23" stroke="#a855f7" stroke-width="2"/>
    <line x1="37" y1="45" x2="63" y2="45" stroke="#fb7185" stroke-width="2"/>
    <line x1="37" y1="65" x2="63" y2="65" stroke="#f59e0b" stroke-width="2"/>
  </svg>`,
  Physics: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#6366f1" stroke-width="1.5" transform="rotate(30 50 50)"/>
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#22d3ee" stroke-width="1.5" transform="rotate(-30 50 50)"/>
    <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#a855f7" stroke-width="1.5" transform="rotate(90 50 50)"/>
    <circle cx="50" cy="50" r="6" fill="#fb7185"/>
    <circle cx="48" cy="48" r="3" fill="#ffffff" opacity="0.5"/>
    <circle cx="15" cy="40" r="3" fill="#6366f1"/>
    <circle cx="85" cy="60" r="3" fill="#22d3ee"/>
    <circle cx="50" cy="90" r="3" fill="#a855f7"/>
  </svg>`,
  Mathematics: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="15" width="70" height="70" rx="8" stroke="#3b82f6" stroke-width="2" stroke-dasharray="2 2"/>
    <path d="M30 65 L50 35 L70 65 Z" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" stroke-width="2"/>
    <line x1="50" y1="35" x2="50" y2="65" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 2"/>
    <circle cx="50" cy="35" r="3" fill="#f43f5e"/>
    <text x="47" y="30" fill="#f9fafb" font-size="6" font-family="monospace">A</text>
    <text x="26" y="72" fill="#f9fafb" font-size="6" font-family="monospace">B</text>
    <text x="68" y="72" fill="#f9fafb" font-size="6" font-family="monospace">C</text>
    <text x="53" y="52" fill="#fb7185" font-size="5" font-family="monospace">h</text>
  </svg>`,
  Technology: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="25" y="20" width="50" height="40" rx="4" stroke="#6366f1" stroke-width="2"/>
    <line x1="35" y1="60" x2="25" y2="75" stroke="#6366f1" stroke-width="2"/>
    <line x1="65" y1="60" x2="75" y2="75" stroke="#6366f1" stroke-width="2"/>
    <line x1="25" y1="75" x2="75" y2="75" stroke="#6366f1" stroke-width="2"/>
    <circle cx="50" cy="40" r="8" stroke="#22d3ee" stroke-width="1.5"/>
    <path d="M45 40 H55" stroke="#22d3ee" stroke-width="1.5"/>
    <path d="M50 35 V45" stroke="#22d3ee" stroke-width="1.5"/>
  </svg>`,
  Books: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 70V30C20 25 35 25 50 30V70C35 65 20 65 20 70Z" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" stroke-width="2"/>
    <path d="M80 70V30C80 25 65 25 50 30V70C65 65 80 65 80 70Z" fill="rgba(34, 211, 238, 0.15)" stroke="#22d3ee" stroke-width="2"/>
    <path d="M20 70C35 65 50 70 50 70C50 70 65 65 80 70" stroke="#f43f5e" stroke-width="2"/>
  </svg>`
};

export const generateMCQ = async (
  subject: string,
  language: string,
  difficulty: string,
  className: string,
  apiKey?: string
): Promise<MCQQuestion> => {
  if (apiKey) {
    try {
      const response = await fetch('/api/ai/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, language, difficulty, className, apiKey }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Real OpenAI call failed, falling back to simulated engine", e);
    }
  }

  // Simulated AI response
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate networking
  
  if (language === 'Bangla') {
    const list = mockBanglaMCQData[subject] || mockBanglaMCQData['Physics'];
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex] || list[0];
  }

  const list = mockMCQData[subject] || mockMCQData['Physics'];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex] || defaultMCQ;
};

export const generateCopywriting = async (
  topic: string,
  platform: string,
  apiKey?: string
): Promise<CopywritingOutput> => {
  if (apiKey) {
    try {
      const response = await fetch('/api/ai/copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, apiKey }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn("Real copywriter API failed, using simulated helper", e);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    headline: `Unlock Excellence: ${topic}`,
    description: `Accelerate your educational journey with our professional masterclasses on "${topic}". Developed by elite university professors and industry practitioners to elevate student competencies.`,
    facebookCaption: `🎓 READY TO SCALE YOUR SKILLS? 🚀\n\nJoin our interactive cohort on "${topic}" starting this week! We break down complex methodologies into simple, digestible models.\n\n✨ Features:\n- Live Interactive Labs\n- Premium Courseware & Cheat-sheets\n- Certification from Elite Studio\n\n👉 Enrol now: link-in-bio\n#Education #Learning #OnlineClasses #Success`,
    instagramCaption: `Struggling with ${topic}? We've got you covered. 📚✨ Our masterclass breaks it down from first principles to advanced methodologies. Link in bio to reserve your early bird discount! 🚀\n\n#learn #students #coaching #collegelife #stemeducation #achievement`,
    youtubeDescription: `Welcome to the ultimate guide on ${topic}. In this lesson, we will explore key concepts, practical equations, and answer past exam questions.\n\nTimestamps:\n0:00 - Introduction\n4:15 - Core Concepts Explained\n12:30 - Formulas & Rules\n22:15 - Sample MCQs & Explanations\n\nDon't forget to Like, Share, and Subscribe for more educational content!`,
    seoKeywords: [topic, "education", "tutorial", "online course", "coaching center", "lecture notes", "exam preparation"],
    cta: "Join Cohort Today"
  };
};

export const generateIllustration = (subject: string): string => {
  // Returns SVG content
  return mockSVGIllustrations[subject] || mockSVGIllustrations['Science'];
};
