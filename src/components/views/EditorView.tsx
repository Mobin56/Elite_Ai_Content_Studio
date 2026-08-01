'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditorStore, CanvasItem } from '@/store/useEditorStore';
import { useAppStore, Project } from '@/store/useAppStore';
import { useBrandStore } from '@/store/useBrandStore';
import { 
  getSnapGuidelines, getQRCodeUrl, SnapLine,
  generateBarChartSVG, generatePieChartSVG, generateLineChartSVG 
} from '@/utils/canvas-helpers';
import katex from 'katex';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import jsPDF from 'jspdf';
import { 
  Undo, Redo, ZoomIn, ZoomOut, Trash2, Copy, Lock, Unlock, 
  AlignLeft, AlignCenter, AlignRight, FileDown, Layers, 
  Type, Square, Image as ImageIcon, BarChart3, QrCode, Plus, Minus, Move, RotateCw
} from 'lucide-react';

export default function EditorView() {
  const { 
    items, selectedId, canvasWidth, canvasHeight, 
    addItem, updateItem, deleteItem, duplicateItem, selectItem, 
    bringToFront, sendToBack, moveUp, moveDown, alignItem, undo, redo, clearCanvas 
  } = useEditorStore();

  const { saveProject, currentProjectId, setView } = useAppStore();
  const { brandKit } = useBrandStore();

  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Editor view states
  const [zoom, setZoom] = useState(1);
  const [activePanel, setActivePanel] = useState<'text' | 'shapes' | 'brand' | 'charts' | 'qr' | 'layers'>('text');
  
  // Custom tool configuration inputs
  const [qrText, setQrText] = useState('https://eliteacademy.edu');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [chartTitle, setChartTitle] = useState('Quarterly Performance');
  const [chartDataInput, setChartDataInput] = useState('Math:85, Physics:90, Chemistry:78, ICT:95');

  // Snapping lines overlay
  const [activeGuidelines, setActiveGuidelines] = useState<SnapLine[]>([]);

  // Dragging & transformation mouse tracking
  const transformState = useRef<{
    action: 'drag' | 'resize' | 'rotate' | null;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialRotation: number;
    startX: number;
    startY: number;
    handle: string | null;
  }>({
    action: null,
    initialX: 0, initialY: 0, initialWidth: 0, initialHeight: 0, initialRotation: 0,
    startX: 0, startY: 0, handle: null
  });

  // Auto save draft to current project listing
  useEffect(() => {
    if (items.length > 0 && currentProjectId) {
      saveProject({
        id: currentProjectId,
        name: currentProjectId.includes('template') ? "Template Draft" : "Custom Design Draft",
        canvasWidth,
        canvasHeight,
        items
      });
    }
  }, [items, canvasWidth, canvasHeight, currentProjectId]);

  // Insert tools
  const handleAddText = (type: 'heading' | 'subheading' | 'body' | 'latex') => {
    const props = {
      heading: { content: 'Double Click to Edit Heading', fontSize: 36, bold: true },
      subheading: { content: 'Enter sub-details here', fontSize: 20, bold: true },
      body: { content: 'Normal paragraph description text blocks.', fontSize: 14, bold: false },
      latex: { content: '\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)', fontSize: 18, bold: false, isLaTeX: true }
    }[type];

    addItem({
      type: 'text',
      x: (canvasWidth - 300) / 2,
      y: (canvasHeight - 60) / 2,
      width: 350,
      height: 80,
      rotation: 0,
      opacity: 1,
      locked: false,
      textProps: {
        content: props.content,
        fontSize: props.fontSize,
        fontFamily: brandKit.fontFamily || 'Outfit',
        color: '#ffffff',
        bold: props.bold,
        italic: false,
        underline: false,
        align: 'center',
        letterSpacing: 0,
        lineHeight: 1.3,
        glow: false,
        shadow: '',
        isLaTeX: props.isLaTeX
      }
    });
  };

  const handleAddShape = (shapeType: 'rect' | 'circle' | 'triangle' | 'line') => {
    addItem({
      type: 'shape',
      x: (canvasWidth - 100) / 2,
      y: (canvasHeight - 100) / 2,
      width: 120,
      height: 120,
      rotation: 0,
      opacity: 1,
      locked: false,
      shapeProps: {
        shapeType,
        fill: brandKit.secondaryColor || '#3b82f6',
        stroke: '#ffffff',
        strokeWidth: 2
      }
    });
  };

  const handleAddBrandLogo = () => {
    const logoUrl = brandKit.logos.length > 0 ? brandKit.logos[0] : '/logo-transparent.png';
    addItem({
      type: 'logo',
      x: (canvasWidth - 150) / 2,
      y: 60,
      width: 140,
      height: 80,
      rotation: 0,
      opacity: 1,
      locked: false,
      imageProps: {
        src: logoUrl,
        blur: 0, brightness: 1, contrast: 1
      }
    });
  };

  const handleAddQR = () => {
    addItem({
      type: 'qr',
      x: (canvasWidth - 150) / 2,
      y: (canvasHeight - 150) / 2,
      width: 150,
      height: 150,
      rotation: 0,
      opacity: 1,
      locked: false,
      qrProps: {
        dataString: qrText,
        color: brandKit.primaryColor || '#121540'
      }
    });
  };

  const handleAddChart = () => {
    // Parse user chart labels and values e.g. "Math:85, Physics:90"
    const parsedData = chartDataInput.split(',').map(pair => {
      const parts = pair.split(':');
      return {
        label: parts[0]?.trim() || 'Label',
        value: Number(parts[1]?.trim()) || 0
      };
    });

    addItem({
      type: 'chart',
      x: (canvasWidth - 400) / 2,
      y: (canvasHeight - 300) / 2,
      width: 400,
      height: 280,
      rotation: 0,
      opacity: 1,
      locked: false,
      chartProps: {
        chartType,
        title: chartTitle,
        data: parsedData,
        colors: [brandKit.primaryColor, brandKit.secondaryColor, '#fb7185', '#f59e0b', '#10b981']
      }
    });
  };

  // Image upload triggers
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addItem({
          type: 'image',
          x: (canvasWidth - 300) / 2,
          y: (canvasHeight - 200) / 2,
          width: 300,
          height: 200,
          rotation: 0,
          opacity: 1,
          locked: false,
          imageProps: {
            src: reader.result,
            blur: 0, brightness: 1, contrast: 1
          }
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and Transformation logic
  const handlePointerDown = (
    e: React.PointerEvent,
    item: CanvasItem,
    action: 'drag' | 'resize' | 'rotate',
    handle: string | null = null
  ) => {
    e.stopPropagation();
    if (item.locked && action !== 'rotate') return;

    selectItem(item.id);
    transformState.current = {
      action,
      initialX: item.x,
      initialY: item.y,
      initialWidth: item.width,
      initialHeight: item.height,
      initialRotation: item.rotation,
      startX: e.clientX,
      startY: e.clientY,
      handle
    };

    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = transformState.current;
    if (!state.action || !selectedId) return;

    const item = items.find(i => i.id === selectedId);
    if (!item) return;

    const dx = (e.clientX - state.startX) / zoom;
    const dy = (e.clientY - state.startY) / zoom;

    if (state.action === 'drag') {
      let nextX = state.initialX + dx;
      let nextY = state.initialY + dy;

      // Snapping guidelines
      const draggedBounding = { id: item.id, x: nextX, y: nextY, width: item.width, height: item.height };
      const otherItems = items.filter(i => i.id !== item.id);
      const snaps = getSnapGuidelines(draggedBounding, otherItems, canvasWidth, canvasHeight);

      if (snaps.snapX !== null) nextX = snaps.snapX;
      if (snaps.snapY !== null) nextY = snaps.snapY;

      setActiveGuidelines(snaps.guidelines);
      updateItem(selectedId, { x: nextX, y: nextY });
    }
    else if (state.action === 'resize') {
      let nextWidth = state.initialWidth;
      let nextHeight = state.initialHeight;
      let nextX = item.x;
      let nextY = item.y;

      if (state.handle === 'bottom-right') {
        nextWidth = Math.max(20, state.initialWidth + dx);
        nextHeight = Math.max(20, state.initialHeight + dy);
      } else if (state.handle === 'bottom-left') {
        const deltaW = dx;
        nextWidth = Math.max(20, state.initialWidth - deltaW);
        nextHeight = Math.max(20, state.initialHeight + dy);
        nextX = state.initialX + (state.initialWidth - nextWidth);
      } else if (state.handle === 'top-right') {
        const deltaH = dy;
        nextWidth = Math.max(20, state.initialWidth + dx);
        nextHeight = Math.max(20, state.initialHeight - deltaH);
        nextY = state.initialY + (state.initialHeight - nextHeight);
      } else if (state.handle === 'top-left') {
        nextWidth = Math.max(20, state.initialWidth - dx);
        nextHeight = Math.max(20, state.initialHeight - dy);
        nextX = state.initialX + (state.initialWidth - nextWidth);
        nextY = state.initialY + (state.initialHeight - nextHeight);
      }

      updateItem(selectedId, { width: nextWidth, height: nextHeight, x: nextX, y: nextY });
    }
    else if (state.action === 'rotate') {
      // Calculate angle relative to initial point and current pointer
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const centerX = canvasRect.left + (item.x + item.width / 2) * zoom;
      const centerY = canvasRect.top + (item.y + item.height / 2) * zoom;

      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = rad * (180 / Math.PI) - 90; // Offset rotation handle offset angle
      if (deg < 0) deg += 360;

      updateItem(selectedId, { rotation: Math.round(deg) });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {}
    
    transformState.current.action = null;
    setActiveGuidelines([]);
    // Commit to undo state
    useEditorStore.getState().saveToHistory();
  };

  // High resolution exporters
  const handleExport = async (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (!canvasRef.current) return;
    
    selectItem(null); // Deselect items to clean bounding boxes before snapshots
    await new Promise(resolve => setTimeout(resolve, 100)); // Buffer layout updates

    try {
      const options = {
        pixelRatio: 3, // Multiplies pixels to render 300 DPI exports
        style: { transform: 'scale(1)', transformOrigin: 'top left', width: `${canvasWidth}px`, height: `${canvasHeight}px` }
      };

      if (format === 'png') {
        const dataUrl = await toPng(canvasRef.current, options);
        triggerDownload(dataUrl, 'elite-design.png');
      } 
      else if (format === 'jpeg') {
        const dataUrl = await toJpeg(canvasRef.current, { ...options, quality: 0.95 });
        triggerDownload(dataUrl, 'elite-design.jpg');
      } 
      else if (format === 'svg') {
        const dataUrl = await toSvg(canvasRef.current, options);
        triggerDownload(dataUrl, 'elite-design.svg');
      } 
      else if (format === 'pdf') {
        const dataUrl = await toPng(canvasRef.current, options);
        const pdf = new jsPDF({
          orientation: canvasWidth > canvasHeight ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvasWidth, canvasHeight]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, canvasWidth, canvasHeight);
        pdf.save('elite-document.pdf');
      }
    } catch (err) {
      console.error("Export compiled with errors", err);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  };

  // Render content of different item nodes
  const renderItemContent = (item: CanvasItem) => {
    if (item.type === 'text' && item.textProps) {
      if (item.textProps.isLaTeX) {
        try {
          const html = katex.renderToString(item.textProps.content, { throwOnError: false, displayMode: true });
          return (
            <div 
              style={{ fontSize: `${item.textProps.fontSize}px`, color: item.textProps.color }}
              className="w-full h-full overflow-hidden select-none flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <p className="text-red-500 font-mono text-xs">LaTeX Error</p>;
        }
      }
      return (
        <div
          style={{
            fontSize: `${item.textProps.fontSize}px`,
            color: item.textProps.color,
            fontFamily: item.textProps.fontFamily,
            fontWeight: item.textProps.bold ? 'bold' : 'normal',
            fontStyle: item.textProps.italic ? 'italic' : 'normal',
            textDecoration: item.textProps.underline ? 'underline' : 'none',
            textAlign: item.textProps.align,
            letterSpacing: `${item.textProps.letterSpacing}px`,
            lineHeight: item.textProps.lineHeight,
            textShadow: item.textProps.glow ? `0 0 10px ${item.textProps.color}` : item.textProps.shadow
          }}
          className="w-full h-full overflow-hidden select-none outline-none break-words"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            updateItem(item.id, {
              textProps: { ...item.textProps!, content: e.target.innerText }
            });
            useEditorStore.getState().saveToHistory();
          }}
        >
          {item.textProps.content}
        </div>
      );
    }
    
    if ((item.type === 'image' || item.type === 'logo') && item.imageProps) {
      return (
        <img
          src={item.imageProps.src}
          alt="Canvas Element"
          style={{
            filter: `blur(${item.imageProps.blur}px) brightness(${item.imageProps.brightness}) contrast(${item.imageProps.contrast})`,
            opacity: item.opacity
          }}
          className="w-full h-full object-contain pointer-events-none select-none"
        />
      );
    }

    if (item.type === 'shape' && item.shapeProps) {
      const { shapeType, fill, stroke, strokeWidth } = item.shapeProps;
      if (shapeType === 'rect') {
        return <div style={{ backgroundColor: fill, border: `${strokeWidth}px solid ${stroke}`, opacity: item.opacity }} className="w-full h-full rounded" />;
      }
      if (shapeType === 'circle') {
        return <div style={{ backgroundColor: fill, border: `${strokeWidth}px solid ${stroke}`, opacity: item.opacity }} className="w-full h-full rounded-full" />;
      }
      if (shapeType === 'triangle') {
        return (
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="50,0 100,100 0,100" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </svg>
        );
      }
    }

    if (item.type === 'qr' && item.qrProps) {
      return (
        <img
          src={getQRCodeUrl(item.qrProps.dataString, item.qrProps.color)}
          alt="QR Code"
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      );
    }

    if (item.type === 'chart' && item.chartProps) {
      const { chartType, data, title, colors } = item.chartProps;
      let chartSVG = '';
      if (chartType === 'bar') {
        chartSVG = generateBarChartSVG(data, item.width, item.height, colors);
      } else if (chartType === 'pie') {
        chartSVG = generatePieChartSVG(data, item.width, item.height, colors);
      } else if (chartType === 'line') {
        chartSVG = generateLineChartSVG(data, item.width, item.height, colors);
      }
      return (
        <div className="w-full h-full flex flex-col items-center justify-between p-2 pointer-events-none bg-slate-900/40 rounded-xl border border-[var(--glass-border)]">
          <p className="text-[10px] font-bold text-center tracking-wide uppercase text-slate-300 truncate w-full">{title}</p>
          <div className="w-full flex-1 min-h-0" dangerouslySetInnerHTML={{ __html: chartSVG }} />
        </div>
      );
    }

    return null;
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] w-full animate-in fade-in duration-300 select-none">
      
      {/* 1. Left Editor Toolbar Sidebar */}
      <div className="w-80 glass-panel border-r border-[var(--glass-border)] flex h-full">
        {/* Nav chips */}
        <div className="w-16 border-r border-[var(--glass-border)] flex flex-col items-center py-4 gap-4">
          <button 
            onClick={() => setActivePanel('text')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Add Text"
          >
            <Type className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel('shapes')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'shapes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Insert Shapes"
          >
            <Square className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel('brand')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'brand' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Brand Assets"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel('charts')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'charts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Insert Chart"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel('qr')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'qr' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Insert QR"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActivePanel('layers')}
            className={`p-2 rounded-lg cursor-pointer ${activePanel === 'layers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
            title="Layer Control"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>

        {/* Panel View */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          
          {activePanel === 'text' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Typography Studio</h3>
              <button onClick={() => handleAddText('heading')} className="w-full py-3 rounded-lg border border-[var(--glass-border)] text-left px-3 text-sm font-bold hover:border-indigo-500 cursor-pointer">
                Add Academic Heading
              </button>
              <button onClick={() => handleAddText('subheading')} className="w-full py-2.5 rounded-lg border border-[var(--glass-border)] text-left px-3 text-xs font-semibold hover:border-indigo-500 cursor-pointer">
                Add Subtitle Banner
              </button>
              <button onClick={() => handleAddText('body')} className="w-full py-2 rounded-lg border border-[var(--glass-border)] text-left px-3 text-xs text-muted-foreground hover:border-indigo-500 cursor-pointer">
                Add Paragraph Block
              </button>
              <button onClick={() => handleAddText('latex')} className="w-full py-2.5 rounded-lg border border-[var(--glass-border)] text-left px-3 text-xs font-mono text-indigo-400 hover:border-indigo-500 cursor-pointer flex items-center gap-1">
                <span>∑</span> Add LaTeX Math Formula
              </button>
            </div>
          )}

          {activePanel === 'shapes' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Insert Shapes</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAddShape('rect')} className="p-3 border border-[var(--glass-border)] rounded hover:border-indigo-500 flex flex-col items-center gap-1.5 cursor-pointer text-xs">
                  <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500 rounded" />
                  Rectangle
                </button>
                <button onClick={() => handleAddShape('circle')} className="p-3 border border-[var(--glass-border)] rounded hover:border-indigo-500 flex flex-col items-center gap-1.5 cursor-pointer text-xs">
                  <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500 rounded-full" />
                  Circle
                </button>
                <button onClick={() => handleAddShape('triangle')} className="p-3 border border-[var(--glass-border)] rounded hover:border-indigo-500 flex flex-col items-center gap-1.5 cursor-pointer text-xs">
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] border-b-indigo-500/40" />
                  Triangle
                </button>
              </div>
            </div>
          )}

          {activePanel === 'brand' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Institution Kit</h3>
              
              {/* Insert logo */}
              <button 
                onClick={handleAddBrandLogo} 
                className="w-full py-3 bg-slate-900 border border-[var(--glass-border)] rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:border-indigo-500 cursor-pointer"
              >
                Insert Brand Logo
              </button>

              <div className="border-t border-[var(--glass-border)] pt-4 space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Local Uploads</label>
                <input 
                  type="file" 
                  onChange={handleLocalImageUpload}
                  accept="image/*"
                  className="w-full text-xs text-slate-400 border border-[var(--glass-border)] rounded p-1 file:mr-2 file:py-1 file:px-2 file:border-0 file:rounded file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white"
                />
              </div>
            </div>
          )}

          {activePanel === 'charts' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vector Charts</h3>
              
              <div className="space-y-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Chart Type</label>
                  <select value={chartType} onChange={(e: any) => setChartType(e.target.value)} className="w-full p-2 glass-input text-foreground rounded text-xs">
                    <option value="bar">Bar Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="line">Line Chart</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Chart Title</label>
                  <input type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} className="w-full p-2 glass-input text-foreground rounded text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Data Points (Label:Val)</label>
                  <input type="text" value={chartDataInput} onChange={(e) => setChartDataInput(e.target.value)} className="w-full p-2 glass-input text-foreground rounded text-xs font-mono" />
                </div>

                <button onClick={handleAddChart} className="w-full py-2.5 bg-indigo-600 text-white rounded text-xs font-bold cursor-pointer hover:bg-indigo-500">
                  Insert Chart Vector
                </button>
              </div>
            </div>
          )}

          {activePanel === 'qr' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">QR Code Generator</h3>
              
              <div className="space-y-2 text-xs">
                <input 
                  type="text" 
                  value={qrText} 
                  onChange={(e) => setQrText(e.target.value)}
                  className="w-full p-2 glass-input text-foreground rounded text-xs font-sans" 
                  placeholder="Insert website URL / PDF link"
                />
                
                <button onClick={handleAddQR} className="w-full py-2.5 bg-indigo-600 text-white rounded text-xs font-bold cursor-pointer hover:bg-indigo-500">
                  Insert Dynamic QR Code
                </button>
              </div>
            </div>
          )}

          {activePanel === 'layers' && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Z-Index Layers</h3>
              {items.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No canvas elements added yet.</p>
              ) : (
                <div className="space-y-1">
                  {[...items].sort((a, b) => b.zIndex - a.zIndex).map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => selectItem(item.id)}
                      className={`p-2 rounded text-xs flex items-center justify-between border cursor-pointer ${
                        selectedId === item.id 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' 
                          : 'border-[var(--glass-border)] hover:bg-slate-900/10 text-slate-400'
                      }`}
                    >
                      <span className="truncate max-w-[120px] font-mono">
                        {item.type.toUpperCase()}: {item.textProps?.content.substring(0, 10) || item.id.substring(5, 10)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveUp(item.id); }}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white"
                          title="Move Layer Up"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); moveDown(item.id); }}
                          className="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-white"
                          title="Move Layer Down"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                          className="p-0.5 rounded hover:bg-red-500/20 text-slate-500 hover:text-red-500"
                          title="Delete Element"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 2. Center Workbench Canvas Viewport */}
      <div className="flex-1 flex flex-col h-full bg-slate-950/20">
        
        {/* Top Mini Control Toolbar */}
        <div className="h-14 border-b border-[var(--glass-border)] glass-panel px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={undo} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Undo"><Undo className="w-4 h-4" /></button>
            <button onClick={redo} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Redo"><Redo className="w-4 h-4" /></button>
            
            <div className="h-4 w-[1px] bg-slate-800 mx-2" />
            
            <button onClick={() => setZoom(prev => Math.max(0.2, prev - 0.1))} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-mono text-slate-400 font-semibold">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
          </div>

          <div className="flex items-center gap-2">
            {selectedItem && (
              <>
                <button onClick={() => duplicateItem(selectedId!)} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Duplicate"><Copy className="w-4 h-4" /></button>
                <button 
                  onClick={() => updateItem(selectedId!, { locked: !selectedItem.locked })} 
                  className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" 
                  title={selectedItem.locked ? "Unlock" : "Lock"}
                >
                  {selectedItem.locked ? <Lock className="w-4 h-4 text-rose-500" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button onClick={() => deleteItem(selectedId!)} className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 className="w-4 h-4" /></button>
                
                <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                
                {/* Alignment triggers */}
                <button onClick={() => alignItem(selectedId!, 'left')} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
                <button onClick={() => alignItem(selectedId!, 'center')} className="p-1.5 rounded hover:bg-slate-900 text-slate-400 hover:text-white cursor-pointer" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
              </>
            )}

            {/* Downloader drop */}
            <div className="relative group ml-4">
              <button className="gradient-bg hover:scale-[1.01] text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/10">
                <FileDown className="w-4 h-4" />
                Export Design
              </button>
              <div className="absolute right-0 top-9 w-40 glass-panel border border-[var(--glass-border)] rounded-xl py-1 hidden group-hover:block hover:block z-50 shadow-2xl">
                <button onClick={() => handleExport('png')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-900 text-slate-300 hover:text-white font-semibold cursor-pointer">PNG (High Res)</button>
                <button onClick={() => handleExport('jpeg')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-900 text-slate-300 hover:text-white font-semibold cursor-pointer">JPEG (Standard)</button>
                <button onClick={() => handleExport('svg')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-900 text-slate-300 hover:text-white font-semibold cursor-pointer">SVG Vector</button>
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2 text-xs hover:bg-slate-900 text-slate-300 hover:text-white font-semibold cursor-pointer border-t border-[var(--glass-border)]">PDF Print Document</button>
              </div>
            </div>
          </div>
        </div>

        {/* Outer view centering wrapper */}
        <div 
          onClick={() => selectItem(null)}
          className="flex-1 overflow-auto canvas-wrapper p-12 flex items-center justify-center relative"
        >
          {/* Main workspace bounding box */}
          <div
            ref={canvasRef}
            id="editor-canvas"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)'
            }}
            className="bg-[#0f172a] relative overflow-hidden select-none border border-slate-700/60"
            onPointerMove={handlePointerMove}
          >
            {/* Snap line overlays */}
            {activeGuidelines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  backgroundColor: '#22d3ee',
                  boxShadow: '0 0 8px #22d3ee',
                  left: line.type === 'x' ? `${line.position}px` : 0,
                  top: line.type === 'y' ? `${line.position}px` : 0,
                  width: line.type === 'x' ? '1.5px' : '100%',
                  height: line.type === 'y' ? '1.5px' : '100%',
                  zIndex: 9999
                }}
              />
            ))}

            {/* Element layers */}
            {items
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((item) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: `${item.x}px`,
                      top: `${item.y}px`,
                      width: `${item.width}px`,
                      height: `${item.height}px`,
                      transform: `rotate(${item.rotation}deg)`,
                      zIndex: item.zIndex,
                      cursor: item.locked ? 'not-allowed' : 'move'
                    }}
                    className={`group ${isSelected ? 'outline outline-2 outline-indigo-500' : 'hover:outline hover:outline-1 hover:outline-indigo-500/60'}`}
                    onPointerDown={(e) => handlePointerDown(e, item, 'drag')}
                  >
                    
                    {/* Item content wrapper */}
                    <div className="w-full h-full relative">
                      {renderItemContent(item)}
                    </div>

                    {/* Resizer corner anchors when selected */}
                    {isSelected && !item.locked && (
                      <>
                        <div 
                          className="w-3 h-3 bg-white border border-indigo-500 absolute -top-1.5 -left-1.5 cursor-nwse-resize z-50 rounded-full"
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize', 'top-left')}
                        />
                        <div 
                          className="w-3 h-3 bg-white border border-indigo-500 absolute -top-1.5 -right-1.5 cursor-nesw-resize z-50 rounded-full"
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize', 'top-right')}
                        />
                        <div 
                          className="w-3 h-3 bg-white border border-indigo-500 absolute -bottom-1.5 -left-1.5 cursor-nesw-resize z-50 rounded-full"
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize', 'bottom-left')}
                        />
                        <div 
                          className="w-3 h-3 bg-white border border-indigo-500 absolute -bottom-1.5 -right-1.5 cursor-nwse-resize z-50 rounded-full"
                          onPointerDown={(e) => handlePointerDown(e, item, 'resize', 'bottom-right')}
                        />
                        
                        {/* Rotation handle anchor */}
                        <div 
                          className="w-6 h-6 bg-slate-900 border border-indigo-500 absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing z-50 hover:bg-indigo-600 hover:text-white text-indigo-400 shadow-md"
                          onPointerDown={(e) => handlePointerDown(e, item, 'rotate')}
                        >
                          <RotateCw className="w-3.5 h-3.5 pointer-events-none" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

      </div>

      {/* 3. Right Property Control Inspector */}
      {selectedItem && (
        <div className="w-80 glass-panel border-l border-[var(--glass-border)] p-5 overflow-y-auto space-y-6 h-full">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Format Properties</h3>
          
          <div className="space-y-4 text-xs">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Position X</label>
                <input 
                  type="number" 
                  value={Math.round(selectedItem.x)} 
                  onChange={(e) => updateItem(selectedId!, { x: Number(e.target.value) })}
                  className="w-full p-2 glass-input text-foreground rounded font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Position Y</label>
                <input 
                  type="number" 
                  value={Math.round(selectedItem.y)} 
                  onChange={(e) => updateItem(selectedId!, { y: Number(e.target.value) })}
                  className="w-full p-2 glass-input text-foreground rounded font-mono" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Width (px)</label>
                <input 
                  type="number" 
                  value={Math.round(selectedItem.width)} 
                  onChange={(e) => updateItem(selectedId!, { width: Number(e.target.value) })}
                  className="w-full p-2 glass-input text-foreground rounded font-mono" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Height (px)</label>
                <input 
                  type="number" 
                  value={Math.round(selectedItem.height)} 
                  onChange={(e) => updateItem(selectedId!, { height: Number(e.target.value) })}
                  className="w-full p-2 glass-input text-foreground rounded font-mono" 
                />
              </div>
            </div>

            {/* Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] text-slate-400">Element Opacity</label>
                <span className="text-[10px] font-mono">{Math.round(selectedItem.opacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="1" step="0.05"
                value={selectedItem.opacity} 
                onChange={(e) => updateItem(selectedId!, { opacity: Number(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer" 
              />
            </div>

            {/* TEXT PROPERTIES INSPECTOR */}
            {selectedItem.type === 'text' && selectedItem.textProps && (
              <div className="space-y-4 border-t border-[var(--glass-border)] pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Text Formatting</p>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold">Content text</label>
                  <textarea 
                    value={selectedItem.textProps.content}
                    onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, content: e.target.value } })}
                    className="w-full p-2 glass-input text-foreground rounded text-xs h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Font Size</label>
                    <input 
                      type="number" 
                      value={selectedItem.textProps.fontSize} 
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, fontSize: Number(e.target.value) } })}
                      className="w-full p-2 glass-input text-foreground rounded font-mono" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400">Font Family</label>
                    <select
                      value={selectedItem.textProps.fontFamily}
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, fontFamily: e.target.value } })}
                      className="w-full p-2 glass-input text-foreground rounded font-sans text-xs"
                    >
                      <option value="Outfit">Outfit</option>
                      <option value="Inter">Inter</option>
                      <option value="Arial">Arial</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={selectedItem.textProps.color} 
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, color: e.target.value } })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent" 
                    />
                    <input 
                      type="text" 
                      value={selectedItem.textProps.color} 
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, color: e.target.value } })}
                      className="flex-1 p-2 glass-input text-foreground rounded font-mono text-xs" 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1 pt-1">
                  <button 
                    onClick={() => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, bold: !selectedItem.textProps!.bold } })}
                    className={`flex-1 py-1.5 border border-[var(--glass-border)] rounded text-center font-bold cursor-pointer ${selectedItem.textProps.bold ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    B
                  </button>
                  <button 
                    onClick={() => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, italic: !selectedItem.textProps!.italic } })}
                    className={`flex-1 py-1.5 border border-[var(--glass-border)] rounded text-center italic cursor-pointer ${selectedItem.textProps.italic ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    I
                  </button>
                  <button 
                    onClick={() => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, underline: !selectedItem.textProps!.underline } })}
                    className={`flex-1 py-1.5 border border-[var(--glass-border)] rounded text-center underline cursor-pointer ${selectedItem.textProps.underline ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    U
                  </button>
                  <button 
                    onClick={() => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, align: 'left' } })}
                    className={`flex-1 py-1.5 border border-[var(--glass-border)] rounded text-center cursor-pointer ${selectedItem.textProps.align === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    L
                  </button>
                  <button 
                    onClick={() => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, align: 'center' } })}
                    className={`flex-1 py-1.5 border border-[var(--glass-border)] rounded text-center cursor-pointer ${selectedItem.textProps.align === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}
                  >
                    C
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
                  <div>
                    <p className="text-xs font-semibold">LaTeX Math Enabled</p>
                    <p className="text-[9px] text-slate-500">Auto compiles formulas</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!selectedItem.textProps.isLaTeX} 
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, isLaTeX: e.target.checked } })}
                      className="sr-only peer" 
                      id="latex-prop" 
                    />
                    <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--glass-border)] pt-4">
                  <div>
                    <p className="text-xs font-semibold">Glow Effect</p>
                    <p className="text-[9px] text-slate-500">Enable neon radial shadow</p>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!selectedItem.textProps.glow} 
                      onChange={(e) => updateItem(selectedId!, { textProps: { ...selectedItem.textProps!, glow: e.target.checked } })}
                      className="sr-only peer" 
                      id="glow-prop" 
                    />
                    <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                </div>

              </div>
            )}

            {/* IMAGE FILTERS INSPECTOR */}
            {(selectedItem.type === 'image' || selectedItem.type === 'logo') && selectedItem.imageProps && (
              <div className="space-y-4 border-t border-[var(--glass-border)] pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image Filters</p>
                
                <div className="space-y-1">
                  <div className="flex justify-between"><label className="text-[10px] text-slate-400">Blur</label><span className="text-[10px]">{selectedItem.imageProps.blur}px</span></div>
                  <input type="range" min="0" max="20" step="0.5" value={selectedItem.imageProps.blur} onChange={(e) => updateItem(selectedId!, { imageProps: { ...selectedItem.imageProps!, blur: Number(e.target.value) } })} className="w-full accent-indigo-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between"><label className="text-[10px] text-slate-400">Brightness</label><span className="text-[10px]">{Math.round(selectedItem.imageProps.brightness * 100)}%</span></div>
                  <input type="range" min="0.2" max="2" step="0.05" value={selectedItem.imageProps.brightness} onChange={(e) => updateItem(selectedId!, { imageProps: { ...selectedItem.imageProps!, brightness: Number(e.target.value) } })} className="w-full accent-indigo-500" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between"><label className="text-[10px] text-slate-400">Contrast</label><span className="text-[10px]">{Math.round(selectedItem.imageProps.contrast * 100)}%</span></div>
                  <input type="range" min="0.2" max="2" step="0.05" value={selectedItem.imageProps.contrast} onChange={(e) => updateItem(selectedId!, { imageProps: { ...selectedItem.imageProps!, contrast: Number(e.target.value) } })} className="w-full accent-indigo-500" />
                </div>
              </div>
            )}

            {/* SHAPE COLORS INSPECTOR */}
            {selectedItem.type === 'shape' && selectedItem.shapeProps && (
              <div className="space-y-4 border-t border-[var(--glass-border)] pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Shape Fill & Outline</p>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400">Fill Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={selectedItem.shapeProps.fill} 
                      onChange={(e) => updateItem(selectedId!, { shapeProps: { ...selectedItem.shapeProps!, fill: e.target.value } })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent" 
                    />
                    <input 
                      type="text" 
                      value={selectedItem.shapeProps.fill} 
                      onChange={(e) => updateItem(selectedId!, { shapeProps: { ...selectedItem.shapeProps!, fill: e.target.value } })}
                      className="flex-1 p-2 glass-input text-foreground rounded font-mono text-xs" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400">Border Outline Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={selectedItem.shapeProps.stroke} 
                      onChange={(e) => updateItem(selectedId!, { shapeProps: { ...selectedItem.shapeProps!, stroke: e.target.value } })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent" 
                    />
                    <input 
                      type="text" 
                      value={selectedItem.shapeProps.stroke} 
                      onChange={(e) => updateItem(selectedId!, { shapeProps: { ...selectedItem.shapeProps!, stroke: e.target.value } })}
                      className="flex-1 p-2 glass-input text-foreground rounded font-mono text-xs" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between"><label className="text-[10px] text-slate-400">Border Width (px)</label><span className="text-[10px]">{selectedItem.shapeProps.strokeWidth}px</span></div>
                  <input type="range" min="0" max="20" step="0.5" value={selectedItem.shapeProps.strokeWidth} onChange={(e) => updateItem(selectedId!, { shapeProps: { ...selectedItem.shapeProps!, strokeWidth: Number(e.target.value) } })} className="w-full accent-indigo-500" />
                </div>
              </div>
            )}

            {/* QR PROPERTIES INSPECTOR */}
            {selectedItem.type === 'qr' && selectedItem.qrProps && (
              <div className="space-y-4 border-t border-[var(--glass-border)] pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">QR Data Config</p>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Encoded Link / Text</label>
                  <input 
                    type="text"
                    value={selectedItem.qrProps.dataString}
                    onChange={(e) => updateItem(selectedId!, { qrProps: { ...selectedItem.qrProps!, dataString: e.target.value } })}
                    className="w-full p-2 glass-input text-foreground rounded text-xs font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400">QR Code Color</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      value={selectedItem.qrProps.color} 
                      onChange={(e) => updateItem(selectedId!, { qrProps: { ...selectedItem.qrProps!, color: e.target.value } })}
                      className="w-8 h-8 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent" 
                    />
                    <input 
                      type="text" 
                      value={selectedItem.qrProps.color} 
                      onChange={(e) => updateItem(selectedId!, { qrProps: { ...selectedItem.qrProps!, color: e.target.value } })}
                      className="flex-1 p-2 glass-input text-foreground rounded font-mono text-xs" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CHART PROPERTIES INSPECTOR */}
            {selectedItem.type === 'chart' && selectedItem.chartProps && (
              <div className="space-y-4 border-t border-[var(--glass-border)] pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Chart Configurations</p>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Chart Title</label>
                  <input 
                    type="text"
                    value={selectedItem.chartProps.title}
                    onChange={(e) => updateItem(selectedId!, { chartProps: { ...selectedItem.chartProps!, title: e.target.value } })}
                    className="w-full p-2 glass-input text-foreground rounded text-xs font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Data Series (e.g. A:90, B:75)</label>
                  <textarea 
                    value={selectedItem.chartProps.data.map(d => `${d.label}:${d.value}`).join(', ')}
                    onChange={(e) => {
                      const parsed = e.target.value.split(',').map(pair => {
                        const parts = pair.split(':');
                        return {
                          label: parts[0]?.trim() || 'Label',
                          value: Number(parts[1]?.trim()) || 0
                        };
                      });
                      updateItem(selectedId!, { chartProps: { ...selectedItem.chartProps!, data: parsed } });
                    }}
                    className="w-full p-2 glass-input text-foreground rounded text-xs font-mono h-20"
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
