// Canvas calculation and dynamic SVG asset helpers

export interface ChartDataPoint {
  label: string;
  value: number;
}

// Generates an SVG string or React-compatible data for Bar Charts
export const generateBarChartSVG = (
  data: ChartDataPoint[],
  width: number,
  height: number,
  colors: string[] = ['#6366f1', '#22d3ee', '#fb7185', '#f59e0b', '#10b981']
): string => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barWidth = (chartWidth / data.length) * 0.7;
  const gap = (chartWidth / data.length) * 0.3;
  
  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background
  svgContent += `<rect width="100%" height="100%" fill="none" rx="8"/>`;
  
  // Axes
  svgContent += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#94a3b8" stroke-width="1.5"/>`;
  svgContent += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#94a3b8" stroke-width="1.5"/>`;
  
  // Gridlines & Y-axis labels
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const yVal = Math.round((maxVal / steps) * i);
    const yPos = height - padding - (chartHeight / steps) * i;
    svgContent += `<line x1="${padding}" y1="${yPos}" x2="${width - padding}" y2="${yPos}" stroke="#94a3b8" stroke-dasharray="3 3" opacity="0.2"/>`;
    svgContent += `<text x="${padding - 10}" y="${yPos + 4}" fill="#94a3b8" font-size="10" font-family="Arial" text-anchor="end">${yVal}</text>`;
  }

  // Draw Bars
  data.forEach((d, index) => {
    const barHeight = (d.value / maxVal) * chartHeight;
    const x = padding + index * (barWidth + gap) + gap / 2;
    const y = height - padding - barHeight;
    const color = colors[index % colors.length];
    
    // Bar rect
    svgContent += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="3"/>`;
    // Label underneath
    svgContent += `<text x="${x + barWidth / 2}" y="${height - padding + 18}" fill="#94a3b8" font-size="10" font-family="Arial" text-anchor="middle">${d.label}</text>`;
    // Value on top of bar
    svgContent += `<text x="${x + barWidth / 2}" y="${y - 6}" fill="#f8fafc" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle">${d.value}</text>`;
  });
  
  svgContent += `</svg>`;
  return svgContent;
};

// Generates an SVG string for Pie Charts
export const generatePieChartSVG = (
  data: ChartDataPoint[],
  width: number,
  height: number,
  colors: string[] = ['#6366f1', '#22d3ee', '#fb7185', '#f59e0b', '#10b981']
): string => {
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const centerX = width / 2;
  const centerY = height / 2 - 20;
  const radius = Math.min(width, height) / 2.8;
  
  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  svgContent += `<rect width="100%" height="100%" fill="none"/>`;
  
  let accumulatedAngle = 0;
  
  data.forEach((d, index) => {
    const percentage = d.value / total;
    const angle = percentage * 360;
    const color = colors[index % colors.length];
    
    // Coordinates for slice arc
    const x1 = centerX + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y1 = centerY + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
    
    accumulatedAngle += angle;
    
    const x2 = centerX + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
    const y2 = centerY + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // If it is 100%, render a simple circle
    if (percentage >= 0.999) {
      svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${color}"/>`;
    } else {
      const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      svgContent += `<path d="${pathData}" fill="${color}" stroke="#0f172a" stroke-width="1.5"/>`;
    }
  });

  // Legend at bottom
  const legendY = height - 35;
  const itemsPerRow = Math.min(data.length, 4);
  const colWidth = width / itemsPerRow;
  
  data.forEach((d, index) => {
    const row = Math.floor(index / itemsPerRow);
    const col = index % itemsPerRow;
    const x = col * colWidth + 20;
    const y = legendY + row * 15;
    const color = colors[index % colors.length];
    
    svgContent += `<rect x="${x}" y="${y - 8}" width="10" height="10" fill="${color}" rx="2"/>`;
    svgContent += `<text x="${x + 15}" y="${y}" fill="#94a3b8" font-size="10" font-family="Arial">${d.label} (${Math.round((d.value/total)*100)}%)</text>`;
  });
  
  svgContent += `</svg>`;
  return svgContent;
};

// Generates an SVG string for Line Charts
export const generateLineChartSVG = (
  data: ChartDataPoint[],
  width: number,
  height: number,
  colors: string[] = ['#6366f1']
): string => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const color = colors[0];
  
  let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Axes
  svgContent += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="#94a3b8" stroke-width="1.5"/>`;
  svgContent += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#94a3b8" stroke-width="1.5"/>`;
  
  // Gridlines & Y-axis labels
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const yVal = Math.round((maxVal / steps) * i);
    const yPos = height - padding - (chartHeight / steps) * i;
    svgContent += `<line x1="${padding}" y1="${yPos}" x2="${width - padding}" y2="${yPos}" stroke="#94a3b8" stroke-dasharray="3 3" opacity="0.2"/>`;
    svgContent += `<text x="${padding - 10}" y="${yPos + 4}" fill="#94a3b8" font-size="10" font-family="Arial" text-anchor="end">${yVal}</text>`;
  }

  // Draw Line
  let points = '';
  const xStep = chartWidth / (data.length - 1 || 1);
  
  data.forEach((d, index) => {
    const x = padding + index * xStep;
    const y = height - padding - (d.value / maxVal) * chartHeight;
    points += `${x},${y} `;
    
    // Label
    svgContent += `<text x="${x}" y="${height - padding + 18}" fill="#94a3b8" font-size="10" font-family="Arial" text-anchor="middle">${d.label}</text>`;
    // Point circle
    svgContent += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>`;
    // Value text
    svgContent += `<text x="${x}" y="${y - 8}" fill="#f8fafc" font-size="9" font-family="Arial" font-weight="bold" text-anchor="middle">${d.value}</text>`;
  });
  
  // Draw connecting line path
  svgContent += `<polyline points="${points.trim()}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  
  // Area under line
  if (data.length > 1) {
    const firstX = padding;
    const lastX = padding + (data.length - 1) * xStep;
    const areaPoints = `${firstX},${height - padding} ${points} ${lastX},${height - padding}`;
    svgContent += `<polygon points="${areaPoints.trim()}" fill="url(#lineAreaGrad)" opacity="0.15"/>`;
  }
  
  svgContent += `<defs>
    <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>
  </defs></svg>`;
  
  return svgContent;
};

// Custom snapping detection helper
export interface SnapLine {
  type: 'x' | 'y';
  position: number;
}

export const getSnapGuidelines = (
  draggedItem: { id: string; x: number; y: number; width: number; height: number },
  otherItems: { id: string; x: number; y: number; width: number; height: number }[],
  canvasWidth: number,
  canvasHeight: number,
  snapThreshold: number = 8
): { snapX: number | null; snapY: number | null; guidelines: SnapLine[] } => {
  let snapX: number | null = null;
  let snapY: number | null = null;
  const guidelines: SnapLine[] = [];

  const draggedCenterX = draggedItem.x + draggedItem.width / 2;
  const draggedCenterY = draggedItem.y + draggedItem.height / 2;
  const draggedRight = draggedItem.x + draggedItem.width;
  const draggedBottom = draggedItem.y + draggedItem.height;

  // Snap to Canvas Center Horizontal & Vertical
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  // X axis snaps
  if (Math.abs(draggedCenterX - canvasCenterX) < snapThreshold) {
    snapX = canvasCenterX - draggedItem.width / 2;
    guidelines.push({ type: 'x', position: canvasCenterX });
  } else if (Math.abs(draggedItem.x - 0) < snapThreshold) {
    snapX = 0;
    guidelines.push({ type: 'x', position: 0 });
  } else if (Math.abs(draggedRight - canvasWidth) < snapThreshold) {
    snapX = canvasWidth - draggedItem.width;
    guidelines.push({ type: 'x', position: canvasWidth });
  }

  // Y axis snaps
  if (Math.abs(draggedCenterY - canvasCenterY) < snapThreshold) {
    snapY = canvasCenterY - draggedItem.height / 2;
    guidelines.push({ type: 'y', position: canvasCenterY });
  } else if (Math.abs(draggedItem.y - 0) < snapThreshold) {
    snapY = 0;
    guidelines.push({ type: 'y', position: 0 });
  } else if (Math.abs(draggedBottom - canvasHeight) < snapThreshold) {
    snapY = canvasHeight - draggedItem.height;
    guidelines.push({ type: 'y', position: canvasHeight });
  }

  // Check snaps relative to other items
  for (const other of otherItems) {
    if (other.id === draggedItem.id) continue;
    const otherCenterX = other.x + other.width / 2;
    const otherCenterY = other.y + other.height / 2;
    const otherRight = other.x + other.width;
    const otherBottom = other.y + other.height;

    // X alignments
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

    // Y alignments
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
