import { CanvasItem } from '@/store/useEditorStore';

// Dynamic chart helpers for Admin view
export const generateBarChartSVG = (
  data: { label: string; value: number }[],
  width: number = 400,
  height: number = 200,
  colors: string[] = ['#4f46e5']
): string => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data.map(d => d.value), 1);

  let bars = '';
  let labels = '';
  const barWidth = chartWidth / data.length - 10;

  data.forEach((d, idx) => {
    const x = padding + idx * (chartWidth / data.length) + 5;
    const barHeight = (d.value / maxValue) * chartHeight;
    const y = height - padding - barHeight;
    const color = colors[idx % colors.length];

    bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" />`;
    labels += `<text x="${x + barWidth / 2}" y="${height - padding + 15}" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="sans-serif">${d.label}</text>`;
    labels += `<text x="${x + barWidth / 2}" y="${y - 5}" fill="#ffffff" font-size="9" text-anchor="middle" font-family="monospace">${d.value}</text>`;
  });

  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#334155" stroke-width="1" />
      ${bars}
      ${labels}
    </svg>
  `;
};

export const generatePieChartSVG = (
  data: { label: string; value: number }[],
  width: number = 400,
  height: number = 200,
  colors: string[] = ['#4f46e5', '#06b6d4', '#ec4899', '#f59e0b']
): string => {
  const radius = Math.min(width, height) / 2 - 30;
  const cx = width / 3 + 20;
  const cy = height / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let accumulatedAngle = 0;
  let paths = '';
  let legends = '';

  data.forEach((d, idx) => {
    const percentage = d.value / total;
    const angle = percentage * 360;
    const color = colors[idx % colors.length];

    // Coordinates for slice
    const x1 = cx + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y1 = cy + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
    accumulatedAngle += angle;
    const x2 = cx + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y2 = cy + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;
    paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z" fill="${color}" stroke="#0b0f19" stroke-width="2" />`;

    // Legend
    const legendX = cx + radius + 30;
    const legendY = cy - radius + 20 + idx * 25;
    legends += `
      <rect x="${legendX}" y="${legendY}" width="12" height="12" fill="${color}" rx="2" />
      <text x="${legendX + 20}" y="${legendY + 10}" fill="#e2e8f0" font-size="10" font-family="sans-serif">${d.label} (${(percentage * 100).toFixed(0)}%)</text>
    `;
  });

  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${paths}
      ${legends}
    </svg>
  `;
};

export const generateLineChartSVG = (
  data: { label: string; value: number }[],
  width: number = 400,
  height: number = 200,
  colors: string[] = ['#4f46e5']
): string => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const color = colors[0] || '#4f46e5';

  let points = '';
  let labels = '';
  let dots = '';

  data.forEach((d, idx) => {
    const x = padding + idx * (chartWidth / (data.length - 1 || 1));
    const yHeight = (d.value / maxValue) * chartHeight;
    const y = height - padding - yHeight;

    points += `${idx === 0 ? 'M' : 'L'} ${x} ${y} `;
    dots += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.5" />`;
    labels += `<text x="${x}" y="${height - padding + 15}" fill="#94a3b8" font-size="10" text-anchor="middle" font-family="sans-serif">${d.label}</text>`;
    labels += `<text x="${x}" y="${y - 8}" fill="#ffffff" font-size="9" text-anchor="middle" font-family="monospace">${d.value}</text>`;
  });

  return `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#334155" stroke-width="1" />
      <path d="${points}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
      ${labels}
    </svg>
  `;
};

// Generates snap guidelines
export const getSnapGuidelines = (
  draggedItem: { id: string; x: number; y: number; width: number; height: number },
  otherItems: { id: string; x: number; y: number; width: number; height: number }[],
  canvasWidth: number,
  canvasHeight: number,
  snapThreshold: number = 8
): { snapX: number | null; snapY: number | null; guidelines: { type: 'x' | 'y'; position: number }[] } => {
  let snapX: number | null = null;
  let snapY: number | null = null;
  const guidelines: { type: 'x' | 'y'; position: number }[] = [];

  const draggedCenterX = draggedItem.x + draggedItem.width / 2;
  const draggedCenterY = draggedItem.y + draggedItem.height / 2;
  const draggedRight = draggedItem.x + draggedItem.width;
  const draggedBottom = draggedItem.y + draggedItem.height;

  // Snaps relative to Canvas Bounds
  if (Math.abs(draggedItem.x) < snapThreshold) {
    snapX = 0;
    guidelines.push({ type: 'x', position: 0 });
  } else if (Math.abs(draggedRight - canvasWidth) < snapThreshold) {
    snapX = canvasWidth - draggedItem.width;
    guidelines.push({ type: 'x', position: canvasWidth });
  } else if (Math.abs(draggedCenterX - canvasWidth / 2) < snapThreshold) {
    snapX = canvasWidth / 2 - draggedItem.width / 2;
    guidelines.push({ type: 'x', position: canvasWidth / 2 });
  }

  if (Math.abs(draggedItem.y) < snapThreshold) {
    snapY = 0;
    guidelines.push({ type: 'y', position: 0 });
  } else if (Math.abs(draggedBottom - canvasHeight) < snapThreshold) {
    snapY = canvasHeight - draggedItem.height;
    guidelines.push({ type: 'y', position: canvasHeight });
  }

  for (const other of otherItems) {
    if (other.id === draggedItem.id) continue;
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    const otherRight = other.x + other.width;
    const otherBottom = other.y + other.height;

    if (Math.abs(draggedItem.x - other.x) < snapThreshold) {
      snapX = other.x;
      guidelines.push({ type: 'x', position: other.x });
    } else if (Math.abs(draggedRight - otherRight) < snapThreshold) {
      snapX = otherRight - draggedItem.width;
      guidelines.push({ type: 'x', position: otherRight });
    } else if (Math.abs(draggedCenterX - otherCenterX) < snapThreshold) {
      snapX = otherCenterX - draggedItem.width / 2;
      guidelines.push({ type: 'x', position: otherCenterX });
    } else if (Math.abs(draggedItem.x - otherRight) < snapThreshold) {
      snapX = otherRight;
      guidelines.push({ type: 'x', position: otherRight });
    } else if (Math.abs(draggedRight - other.x) < snapThreshold) {
      snapX = other.x - draggedItem.width;
      guidelines.push({ type: 'x', position: other.x });
    }

    if (Math.abs(draggedItem.y - other.y) < snapThreshold) {
      snapY = other.y;
      guidelines.push({ type: 'y', position: other.y });
    } else if (Math.abs(draggedBottom - otherBottom) < snapThreshold) {
      snapY = otherBottom - draggedItem.height;
      guidelines.push({ type: 'y', position: otherBottom });
    } else if (Math.abs(draggedCenterY - otherCenterY) < snapThreshold) {
      snapY = otherCenterY - draggedItem.height / 2;
      guidelines.push({ type: 'y', position: otherCenterY });
    } else if (Math.abs(draggedItem.y - otherBottom) < snapThreshold) {
      snapY = otherBottom;
      guidelines.push({ type: 'y', position: otherBottom });
    } else if (Math.abs(draggedBottom - other.y) < snapThreshold) {
      snapY = other.y - draggedItem.height;
      guidelines.push({ type: 'y', position: other.y });
    }
  }

  return { snapX, snapY, guidelines };
};

// Generates QR Code Server API url
export const getQRCodeUrl = (data: string, color: string = '000000'): string => {
  const cleanColor = color.replace('#', '');
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}&color=${cleanColor}&bgcolor=ffffff`;
};

// DYNAMIC BANNER COMPILER supporting exactly 21 premium layouts (including Quiz Show Premium)
export const calculateDynamicMCQLayout = (
  style: string,
  question: string,
  options: string[],
  brandName: string,
  primaryColor: string,
  secondaryColor: string,
  logoUrl: string
): { items: any[]; height: number } => {
  const width = 800;
  let canvasHeight = 800;

  // Fallbacks
  const pc = primaryColor || '#121540';
  const sc = secondaryColor || '#3b82f6';
  const logo = logoUrl || '/logo-transparent.png';

  // Config variables
  let bgFill = '#0a0d17';
  let bgStroke = sc;
  let bgStrokeWidth = 4;
  let textTheme = '#ffffff';
  let fontTheme = 'Outfit';
  let optFill = 'rgba(255, 255, 255, 0.01)';
  let optStroke = 'rgba(255, 255, 255, 0.08)';
  let optTextTheme = '#cbd5e1';
  let glowOpacity = 0.12;
  let cornerBrackets = false;
  let gridLayout = false;
  let chalkboardDecor = false;
  let cyberpunkDecor = false;
  let popQuizShadow = false;
  let goldDecor = false;
  let mathGrid = false;
  let checkboxDecor = false;

  // Detect Bengali characters to automatically translate layout badges
  const isBangla = /[\u0980-\u09FF]/.test(question);

  // Match style definitions
  switch (style) {
    case 'grid':
      gridLayout = true;
      break;
    case 'quiz-show':
      bgFill = '#02040a';
      bgStroke = '#0052cc';
      bgStrokeWidth = 5;
      gridLayout = true;
      break;
    case 'neon':
      bgFill = '#040209';
      bgStroke = '#ec4899'; // Pink
      optStroke = '#06b6d4'; // Cyan
      optFill = 'rgba(6, 182, 212, 0.02)';
      cornerBrackets = true;
      break;
    case 'glassmorphic':
      bgFill = '#0f172a';
      bgStroke = 'rgba(255, 255, 255, 0.1)';
      optFill = 'rgba(255, 255, 255, 0.06)';
      optStroke = 'rgba(255, 255, 255, 0.15)';
      glowOpacity = 0.25;
      break;
    case 'pastel':
      bgFill = '#fdfbf7'; // Pastel Cream
      bgStroke = '#f5e0c3';
      textTheme = '#2d3748';
      optFill = '#ffffff';
      optStroke = '#e2e8f0';
      optTextTheme = '#4a5568';
      break;
    case 'chalkboard':
      bgFill = '#1b3b22'; // Chalkboard Green
      bgStroke = '#ffffff';
      bgStrokeWidth = 3;
      optStroke = 'rgba(255, 255, 255, 0.4)';
      optFill = 'transparent';
      fontTheme = 'monospace';
      chalkboardDecor = true;
      break;
    case 'cyberpunk':
      bgFill = '#000000';
      bgStroke = '#facc15'; // Yellow
      optStroke = '#38bdf8'; // Cyan
      optFill = 'rgba(56, 189, 248, 0.01)';
      cyberpunkDecor = true;
      break;
    case 'minimalist':
      bgFill = '#ffffff';
      bgStroke = '#000000';
      textTheme = '#000000';
      optFill = 'transparent';
      optStroke = '#000000';
      optTextTheme = '#000000';
      fontTheme = 'serif';
      bgStrokeWidth = 2;
      break;
    case 'classic-board':
      bgFill = '#080c14';
      bgStroke = '#b45309'; // Dark Gold
      optStroke = '#d97706'; // Golden
      optFill = 'rgba(217, 119, 6, 0.02)';
      fontTheme = 'serif';
      break;
    case 'retro-wave':
      bgFill = '#170a2c';
      bgStroke = '#f43f5e'; // Pink
      optStroke = '#a21caf'; // Magenta
      optFill = 'rgba(162, 28, 175, 0.03)';
      break;
    case 'pop-quiz':
      bgFill = '#fbbf24'; // High contrast Amber Yellow
      bgStroke = '#000000';
      textTheme = '#000000';
      optFill = '#ffffff';
      optStroke = '#000000';
      optTextTheme = '#000000';
      popQuizShadow = true;
      bgStrokeWidth = 5;
      break;
    case 'modern-academy':
      bgFill = '#f8fafc';
      bgStroke = '#0f172a';
      textTheme = '#0f172a';
      optFill = '#ffffff';
      optStroke = '#cbd5e1';
      optTextTheme = '#334155';
      break;
    case 'sunset-gradient':
      bgFill = '#1c0d24'; // Violet
      bgStroke = '#ea580c'; // Orange
      optStroke = '#f97316';
      break;
    case 'coaching-special':
      bgFill = '#991b1b'; // Crimson Red
      bgStroke = '#ffffff';
      optFill = '#ffffff';
      optStroke = '#991b1b';
      optTextTheme = '#7f1d1d';
      break;
    case 'math-sheets':
      bgFill = '#0369a1'; // Sky Blue
      bgStroke = '#ffffff';
      mathGrid = true;
      break;
    case 'speed-run':
      bgFill = '#111827';
      bgStroke = '#dc2626'; // Hot Red
      optStroke = '#dc2626';
      break;
    case 'interactive-poll':
      bgFill = '#090d16';
      bgStroke = '#6366f1';
      checkboxDecor = true;
      break;
    case 'dark-stealth':
      bgFill = '#020205';
      bgStroke = '#18181b';
      optStroke = '#27272a';
      optFill = '#000000';
      break;
    case 'royal-gold':
      bgFill = '#022c22'; // Luxury Emerald Green
      bgStroke = '#d97706'; // Gold
      optStroke = '#fbbf24';
      optFill = 'rgba(251, 191, 36, 0.02)';
      goldDecor = true;
      break;
    default:
      // stacked
      break;
  }

  // Question sizes
  const charLimit = 42;
  const questionLines = Math.ceil(question.length / charLimit);
  const questionHeight = Math.max(90, questionLines * 26 + 24);

  const items: any[] = [
    // 0: Background base
    {
      id: 'bg-rect',
      type: 'shape',
      x: 0, y: 0, width: 800, height: 800, rotation: 0, opacity: 1, locked: false, zIndex: 1,
      shapeProps: { shapeType: 'rect', fill: bgFill, stroke: bgStroke, strokeWidth: bgStrokeWidth }
    }
  ];

  // 1: Add ambient glows
  items.push({
    id: 'glow-top-left',
    type: 'shape',
    x: -120, y: -120, width: 350, height: 350, rotation: 0, opacity: glowOpacity, locked: false, zIndex: 2,
    shapeProps: { shapeType: 'circle', fill: sc, stroke: '', strokeWidth: 0 }
  });
  items.push({
    id: 'glow-bottom-right',
    type: 'shape',
    x: 570, y: 570, width: 350, height: 350, rotation: 0, opacity: glowOpacity, locked: false, zIndex: 3,
    shapeProps: { shapeType: 'circle', fill: sc, stroke: '', strokeWidth: 0 }
  });

  // 2: Extra decorative shapes
  if (cornerBrackets) {
    items.push(
      { id: 'cb-tl-h', type: 'shape', x: 25, y: 25, width: 50, height: 4, rotation: 0, opacity: 0.8, locked: false, zIndex: 4, shapeProps: { shapeType: 'rect', fill: sc } },
      { id: 'cb-tl-v', type: 'shape', x: 25, y: 25, width: 4, height: 50, rotation: 0, opacity: 0.8, locked: false, zIndex: 5, shapeProps: { shapeType: 'rect', fill: sc } },
      { id: 'cb-br-h', type: 'shape', x: 725, y: 771, width: 50, height: 4, rotation: 0, opacity: 0.8, locked: false, zIndex: 6, shapeProps: { shapeType: 'rect', fill: sc } },
      { id: 'cb-br-v', type: 'shape', x: 771, y: 725, width: 4, height: 50, rotation: 0, opacity: 0.8, locked: false, zIndex: 7, shapeProps: { shapeType: 'rect', fill: sc } }
    );
  }

  // 3: Branding / Top Header segments
  if (style === 'quiz-show') {
    // Ultra-Premium "MCQ Quiz" badge
    items.push(
      {
        id: 'badge-shield',
        type: 'shape',
        x: 230, y: 20, width: 340, height: 120, rotation: 0, opacity: 1, locked: false, zIndex: 8,
        shapeProps: { shapeType: 'rect', fill: '#050a18', stroke: '#00e5ff', strokeWidth: 3 }
      },
      {
        id: 'badge-mcq',
        type: 'text',
        x: 240, y: 30, width: 320, height: 55, rotation: 0, opacity: 1, locked: false, zIndex: 9,
        textProps: { content: "MCQ", fontSize: 54, fontFamily: 'Outfit', color: '#ffffff', bold: true, align: 'center', glow: true }
      },
      {
        id: 'badge-quiz',
        type: 'text',
        x: 240, y: 88, width: 320, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 10,
        textProps: { content: "Quiz", fontSize: 28, fontFamily: 'Outfit', color: '#fbbf24', bold: true, align: 'center' }
      }
    );
  } else {
    // Standard branding headers
    items.push(
      {
        id: 'brand-logo',
        type: logo ? 'logo' : 'shape',
        x: 350, y: 35, width: 100, height: 50, rotation: 0, opacity: 1, locked: false, zIndex: 8,
        imageProps: logo ? { src: logo, blur: 0, brightness: 1, contrast: 1 } : undefined,
        shapeProps: logo ? undefined : { shapeType: 'circle', fill: sc, stroke: '', strokeWidth: 0 }
      },
      {
        id: 'brand-label',
        type: 'text',
        x: 100, y: 95, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 9,
        textProps: {
          content: brandName.toUpperCase(),
          fontSize: 16,
          fontFamily: fontTheme,
          color: textTheme === '#ffffff' ? '#e2e8f0' : textTheme,
          bold: true,
          align: 'center',
          letterSpacing: 2.5
        }
      },
      {
        id: 'subtitle-banner',
        type: 'text',
        x: 100, y: 130, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 10,
        textProps: {
          content: "DAILY MCQ CHALLENGE",
          fontSize: 22,
          fontFamily: fontTheme,
          color: sc,
          bold: true,
          align: 'center',
          letterSpacing: 1.5,
          glow: true
        }
      }
    );
  }

  // 4: Layout specific cards rendering
  if (gridLayout) {
    if (style === 'quiz-show') {
      // PREMIUM QUIZ SHOW CARD
      items.push(
        {
          id: 'question-card',
          type: 'shape',
          x: 80, y: 175, width: 640, height: 210, rotation: 0, opacity: 1, locked: false, zIndex: 11,
          shapeProps: { shapeType: 'rect', fill: 'rgba(2, 4, 10, 0.75)', stroke: '#0066ff', strokeWidth: 3 }
        },
        {
          id: 'question-text',
          type: 'text',
          x: 100, y: 200, width: 600, height: 160, rotation: 0, opacity: 1, locked: false, zIndex: 12,
          textProps: {
            content: question,
            fontSize: 22,
            fontFamily: fontTheme,
            color: '#ffffff',
            bold: true,
            align: 'center',
            isLaTeX: question.includes('\\') || question.includes('$')
          }
        }
      );

      const gridPos = [
        { bx: 80, by: 420, tx: 170, ty: 448 },
        { bx: 415, by: 420, tx: 505, ty: 448 },
        { bx: 80, by: 525, tx: 170, ty: 553 },
        { bx: 415, by: 525, tx: 505, ty: 553 }
      ];

      const optionLetters = isBangla ? ["ক", "খ", "গ", "ঘ"] : ["A", "B", "C", "D"];

      options.forEach((opt, idx) => {
        const letter = optionLetters[idx];
        const pos = gridPos[idx];

        // Card backing
        items.push({
          id: `opt-${idx}-bg`,
          type: 'shape',
          x: pos.bx, y: pos.by, width: 305, height: 80, rotation: 0, opacity: 1, locked: false, zIndex: 20 + idx * 4,
          shapeProps: { shapeType: 'rect', fill: 'rgba(2, 4, 10, 0.5)', stroke: '#0066ff', strokeWidth: 2 }
        });

        // Circle Badge
        items.push({
          id: `opt-${idx}-circle`,
          type: 'shape',
          x: pos.bx + 15, y: pos.by + 18, width: 44, height: 44, rotation: 0, opacity: 1, locked: false, zIndex: 21 + idx * 4,
          shapeProps: { shapeType: 'circle', fill: '#02040a', stroke: '#00e5ff', strokeWidth: 2 }
        });

        // Letter
        items.push({
          id: `opt-${idx}-letter`,
          type: 'text',
          x: pos.bx + 15, y: pos.by + 28, width: 44, height: 24, rotation: 0, opacity: 1, locked: false, zIndex: 22 + idx * 4,
          textProps: { content: letter, fontSize: 18, fontFamily: fontTheme, color: '#fbbf24', bold: true, align: 'center' }
        });

        // Separator line
        items.push({
          id: `opt-${idx}-sep`,
          type: 'shape',
          x: pos.bx + 75, y: pos.by + 20, width: 2, height: 40, rotation: 0, opacity: 1, locked: false, zIndex: 23 + idx * 4,
          shapeProps: { shapeType: 'rect', fill: 'rgba(255, 255, 255, 0.15)' }
        });

        // Option Content text
        items.push({
          id: `opt-${idx}-text`,
          type: 'text',
          x: pos.bx + 92, y: pos.by + 28, width: 200, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 24 + idx * 4,
          textProps: { content: opt, fontSize: 16, fontFamily: fontTheme, color: '#ffffff', bold: true, align: 'left', isLaTeX: opt.includes('\\') || opt.includes('$') }
        });
      });

      // Footer call-to-action with neon dots
      items.push(
        {
          id: 'footer-details',
          type: 'text',
          x: 100, y: 730, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 40,
          textProps: { content: isBangla ? "সঠিক উত্তর কমেন্ট করো" : "COMMENT YOUR ANSWER BELOW", fontSize: 16, fontFamily: fontTheme, color: '#fbbf24', bold: true, align: 'center' }
        },
        {
          id: 'footer-dot-l',
          type: 'shape',
          x: 230, y: 742, width: 8, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 41,
          shapeProps: { shapeType: 'circle', fill: '#00e5ff' }
        },
        {
          id: 'footer-dot-r',
          type: 'shape',
          x: 560, y: 742, width: 8, height: 8, rotation: 0, opacity: 1, locked: false, zIndex: 42,
          shapeProps: { shapeType: 'circle', fill: '#00e5ff' }
        }
      );
    } else {
      // STANDARD GRID LAYOUT
      items.push(
        {
          id: 'question-card',
          type: 'shape',
          x: 110, y: 190, width: 580, height: 210, rotation: 0, opacity: 1, locked: false, zIndex: 11,
          shapeProps: { shapeType: 'rect', fill: 'rgba(255, 255, 255, 0.02)', stroke: sc, strokeWidth: 3 }
        },
        {
          id: 'question-mark-icon',
          type: 'text',
          x: 82, y: 168, width: 60, height: 60, rotation: 0, opacity: 1, locked: false, zIndex: 12,
          textProps: { content: "?", fontSize: 64, fontFamily: fontTheme, color: textTheme, bold: true, align: 'center', glow: true }
        },
        {
          id: 'question-text',
          type: 'text',
          x: 140, y: 210, width: 520, height: 170, rotation: 0, opacity: 1, locked: false, zIndex: 13,
          textProps: { content: question, fontSize: 18, fontFamily: fontTheme, color: textTheme, bold: true, align: 'center', isLaTeX: question.includes('\\') || question.includes('$') }
        }
      );

      const gridPos = [
        { bx: 110, by: 440, tx: 130, ty: 458 },
        { bx: 405, by: 440, tx: 425, ty: 458 },
        { bx: 110, by: 530, tx: 130, ty: 548 },
        { bx: 405, by: 530, tx: 425, ty: 548 }
      ];

      options.forEach((opt, idx) => {
        const optionLetter = ['A', 'B', 'C', 'D'][idx];
        const pos = gridPos[idx];
        const isOptionB = idx === 1;

        items.push({
          id: `opt-${optionLetter.toLowerCase()}-bg`,
          type: 'shape',
          x: pos.bx, y: pos.by, width: 285, height: 65, rotation: 0, opacity: 1, locked: false, zIndex: 20 + idx * 2,
          shapeProps: {
            shapeType: 'rect',
            fill: isOptionB ? (style === 'pastel' ? '#fb7185' : '#e11d48') : optFill,
            stroke: isOptionB ? '' : optStroke,
            strokeWidth: isOptionB ? 0 : 2
          }
        });

        items.push({
          id: `opt-${optionLetter.toLowerCase()}-text`,
          type: 'text',
          x: pos.tx, y: pos.ty, width: 245, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 21 + idx * 2,
          textProps: {
            content: `${optionLetter}) ${opt}`,
            fontSize: 13,
            fontFamily: fontTheme,
            color: isOptionB ? '#ffffff' : optTextTheme,
            bold: isOptionB,
            align: 'left',
            isLaTeX: opt.includes('\\') || opt.includes('$')
          }
        });
      });

      items.push({
        id: 'footer-details',
        type: 'text',
        x: 100, y: 720, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 40,
        textProps: { content: `Join online: ${brandName} • Learn Today, Lead Tomorrow`, fontSize: 12, fontFamily: fontTheme, color: '#64748b', italic: true, align: 'center' }
      });
    }
  } else {
    // STACKED VERTICAL LAYOUT RENDERING
    let currentY = 185;

    items.push(
      {
        id: 'question-card',
        type: 'shape',
        x: 80, y: currentY, width: 640, height: questionHeight, rotation: 0, opacity: 1, locked: false, zIndex: 11,
        shapeProps: { shapeType: 'rect', fill: 'rgba(255, 255, 255, 0.02)', stroke: optStroke, strokeWidth: 1 }
      },
      {
        id: 'question-text',
        type: 'text',
        x: 100, y: currentY + 12, width: 600, height: questionHeight - 24, rotation: 0, opacity: 1, locked: false, zIndex: 12,
        textProps: { content: question, fontSize: 20, fontFamily: fontTheme, color: textTheme, bold: true, align: 'center', isLaTeX: question.includes('\\') || question.includes('$') }
      }
    );

    currentY += questionHeight + 30;

    options.forEach((opt, idx) => {
      const optionLetter = ['A', 'B', 'C', 'D'][idx];
      const optLines = Math.ceil(opt.length / 50);
      const optHeight = Math.max(55, optLines * 22 + 16);

      // Pop shadow offset for pop-quiz style
      if (popQuizShadow) {
        items.push({
          id: `opt-${optionLetter.toLowerCase()}-shadow`,
          type: 'shape',
          x: 84, y: currentY + 4, width: 640, height: optHeight, rotation: 0, opacity: 1, locked: false, zIndex: 14 + idx * 3,
          shapeProps: { shapeType: 'rect', fill: '#000000', stroke: '', strokeWidth: 0 }
        });
      }

      items.push({
        id: `opt-${optionLetter.toLowerCase()}-bg`,
        type: 'shape',
        x: 80, y: currentY, width: 640, height: optHeight, rotation: 0, opacity: 1, locked: false, zIndex: 15 + idx * 3,
        shapeProps: {
          shapeType: 'rect',
          fill: idx === 0 ? (style === 'pastel' ? '#eff6ff' : 'rgba(59, 130, 246, 0.05)') : optFill,
          stroke: idx === 0 ? sc : optStroke,
          strokeWidth: idx === 0 ? 1.5 : 1
        }
      });

      items.push({
        id: `opt-${optionLetter.toLowerCase()}-text`,
        type: 'text',
        x: 100, y: currentY + (optHeight - 20) / 2 - 2, width: 600, height: 26, rotation: 0, opacity: 1, locked: false, zIndex: 16 + idx * 3,
        textProps: {
          content: `${optionLetter}) ${opt}`,
          fontSize: 14,
          fontFamily: fontTheme,
          color: idx === 0 && style !== 'pop-quiz' ? (style === 'pastel' ? '#1e3a8a' : '#ffffff') : optTextTheme,
          bold: idx === 0,
          align: 'left',
          isLaTeX: opt.includes('\\') || opt.includes('$')
        }
      });

      currentY += optHeight + 15;
    });

    currentY += 20;
    items.push({
      id: 'footer-details',
      type: 'text',
      x: 100, y: currentY, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 40,
      textProps: { content: `Join online: ${brandName} • Learn Today, Lead Tomorrow`, fontSize: 12, fontFamily: fontTheme, color: '#64748b', italic: true, align: 'center' }
    });

    canvasHeight = Math.max(800, currentY + 50);
    items[0].height = canvasHeight;
    items[2].y = canvasHeight - 250; // Re-adjust bottom glow
  }

  return { items, height: canvasHeight };
};

// Retro-compatibility Wrappers
export const calculatePremiumMCQLayout = (
  question: string,
  options: string[],
  brandName: string,
  primaryColor: string,
  secondaryColor: string,
  logoUrl: string
): { items: any[]; height: number } => {
  return calculateDynamicMCQLayout('stacked', question, options, brandName, primaryColor, secondaryColor, logoUrl);
};

export const calculateQuizizzGridMCQLayout = (
  question: string,
  options: string[],
  brandName: string,
  primaryColor: string,
  secondaryColor: string,
  logoUrl: string
): { items: any[]; height: number } => {
  return calculateDynamicMCQLayout('grid', question, options, brandName, primaryColor, secondaryColor, logoUrl);
};
