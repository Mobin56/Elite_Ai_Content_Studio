import { create } from 'zustand';

export interface CanvasItem {
  id: string;
  type: 'text' | 'image' | 'shape' | 'logo' | 'chart' | 'qr' | 'watermark';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  zIndex: number;
  
  textProps?: {
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: 'left' | 'center' | 'right';
    letterSpacing: number;
    lineHeight: number;
    glow: boolean;
    shadow: string;
    isLaTeX?: boolean;
  };
  imageProps?: {
    src: string;
    blur: number;
    brightness: number;
    contrast: number;
    backgroundRemoved?: boolean;
    gradientOverlay?: boolean;
    gradientColors?: [string, string];
  };
  shapeProps?: {
    shapeType: 'rect' | 'circle' | 'triangle' | 'star' | 'line';
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  chartProps?: {
    chartType: 'pie' | 'bar' | 'line';
    data: { label: string; value: number }[];
    title: string;
    colors?: string[];
  };
  qrProps?: {
    dataString: string;
    color: string;
  };
}

interface EditorState {
  items: CanvasItem[];
  selectedId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  history: CanvasItem[][];
  historyIndex: number;
  
  addItem: (item: Omit<CanvasItem, 'id' | 'zIndex'>) => void;
  updateItem: (id: string, fields: Partial<CanvasItem> | ((prev: CanvasItem) => Partial<CanvasItem>)) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  setCanvasSize: (width: number, height: number) => void;
  clearCanvas: () => void;
  loadDesign: (items: CanvasItem[], width: number, height: number) => void;
  
  // Layer controls
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  moveUp: (id: string) => void;
  moveDown: (id: string) => void;
  
  // Undo/Redo
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Alignments
  alignItem: (id: string, alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  items: [],
  selectedId: null,
  canvasWidth: 800,
  canvasHeight: 800,
  history: [[]],
  historyIndex: 0,

  addItem: (newItem) => {
    const { items, history, historyIndex } = get();
    const nextZIndex = items.length > 0 ? Math.max(...items.map((i) => i.zIndex)) + 1 : 1;
    const itemWithId: CanvasItem = {
      ...newItem,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: nextZIndex,
    };
    
    const newItems = [...items, itemWithId];
    const newHistory = history.slice(0, historyIndex + 1);
    
    set({
      items: newItems,
      selectedId: itemWithId.id,
      history: [...newHistory, newItems],
      historyIndex: newHistory.length,
    });
  },

  updateItem: (id, fields) => {
    const { items, history, historyIndex } = get();
    const newItems = items.map((item) => {
      if (item.id === id) {
        if (item.locked && typeof fields !== 'function' && fields.locked === undefined) {
          return item; // Prevent edits on locked items unless unlocking
        }
        const updatedFields = typeof fields === 'function' ? fields(item) : fields;
        
        // Deep merge details
        const textProps = updatedFields.textProps && item.textProps
          ? { ...item.textProps, ...updatedFields.textProps }
          : updatedFields.textProps || item.textProps;
          
        const imageProps = updatedFields.imageProps && item.imageProps
          ? { ...item.imageProps, ...updatedFields.imageProps }
          : updatedFields.imageProps || item.imageProps;
          
        const shapeProps = updatedFields.shapeProps && item.shapeProps
          ? { ...item.shapeProps, ...updatedFields.shapeProps }
          : updatedFields.shapeProps || item.shapeProps;
          
        const chartProps = updatedFields.chartProps && item.chartProps
          ? { ...item.chartProps, ...updatedFields.chartProps }
          : updatedFields.chartProps || item.chartProps;
          
        const qrProps = updatedFields.qrProps && item.qrProps
          ? { ...item.qrProps, ...updatedFields.qrProps }
          : updatedFields.qrProps || item.qrProps;

        return {
          ...item,
          ...updatedFields,
          textProps,
          imageProps,
          shapeProps,
          chartProps,
          qrProps,
        };
      }
      return item;
    });

    set({ items: newItems });
  },

  saveToHistory: () => {
    const { items, history, historyIndex } = get();
    // Only save if current state is different from last history item
    const lastHistoryItem = history[historyIndex];
    if (JSON.stringify(items) === JSON.stringify(lastHistoryItem)) return;

    const newHistory = history.slice(0, historyIndex + 1);
    set({
      history: [...newHistory, items],
      historyIndex: newHistory.length,
    });
  },

  deleteItem: (id) => {
    const { items, history, historyIndex, selectedId } = get();
    const newItems = items.filter((item) => item.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    
    set({
      items: newItems,
      selectedId: selectedId === id ? null : selectedId,
      history: [...newHistory, newItems],
      historyIndex: newHistory.length,
    });
  },

  duplicateItem: (id) => {
    const { items, history, historyIndex } = get();
    const source = items.find((item) => item.id === id);
    if (!source) return;

    const nextZIndex = Math.max(...items.map((i) => i.zIndex)) + 1;
    const duplicated: CanvasItem = {
      ...JSON.parse(JSON.stringify(source)),
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: source.x + 20,
      y: source.y + 20,
      zIndex: nextZIndex,
      locked: false,
    };

    const newItems = [...items, duplicated];
    const newHistory = history.slice(0, historyIndex + 1);
    
    set({
      items: newItems,
      selectedId: duplicated.id,
      history: [...newHistory, newItems],
      historyIndex: newHistory.length,
    });
  },

  selectItem: (id) => {
    set({ selectedId: id });
  },

  setCanvasSize: (width, height) => {
    set({ canvasWidth: width, canvasHeight: height });
  },

  clearCanvas: () => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      items: [],
      selectedId: null,
      history: [...newHistory, []],
      historyIndex: newHistory.length,
    });
  },

  loadDesign: (items, width, height) => {
    set({
      items,
      canvasWidth: width,
      canvasHeight: height,
      selectedId: null,
      history: [items],
      historyIndex: 0,
    });
  },

  bringToFront: (id) => {
    const { items } = get();
    const target = items.find((item) => item.id === id);
    if (!target) return;
    const maxZ = items.length > 0 ? Math.max(...items.map((i) => i.zIndex)) : 0;
    
    const newItems = items.map((item) => {
      if (item.id === id) return { ...item, zIndex: maxZ + 1 };
      return item;
    });
    set({ items: newItems });
    get().saveToHistory();
  },

  sendToBack: (id) => {
    const { items } = get();
    const target = items.find((item) => item.id === id);
    if (!target) return;
    const minZ = items.length > 0 ? Math.min(...items.map((i) => i.zIndex)) : 0;
    
    const newItems = items.map((item) => {
      if (item.id === id) return { ...item, zIndex: minZ - 1 };
      return item;
    });
    set({ items: newItems });
    get().saveToHistory();
  },

  moveUp: (id) => {
    const { items } = get();
    const target = items.find((item) => item.id === id);
    if (!target) return;
    
    // Find item directly above target
    const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((item) => item.id === id);
    if (index === sorted.length - 1) return; // Already at the top
    
    const nextItem = sorted[index + 1];
    const tempZ = target.zIndex;
    
    const newItems = items.map((item) => {
      if (item.id === id) return { ...item, zIndex: nextItem.zIndex };
      if (item.id === nextItem.id) return { ...item, zIndex: tempZ };
      return item;
    });
    
    set({ items: newItems });
    get().saveToHistory();
  },

  moveDown: (id) => {
    const { items } = get();
    const target = items.find((item) => item.id === id);
    if (!target) return;
    
    // Find item directly below target
    const sorted = [...items].sort((a, b) => a.zIndex - b.zIndex);
    const index = sorted.findIndex((item) => item.id === id);
    if (index === 0) return; // Already at the bottom
    
    const prevItem = sorted[index - 1];
    const tempZ = target.zIndex;
    
    const newItems = items.map((item) => {
      if (item.id === id) return { ...item, zIndex: prevItem.zIndex };
      if (item.id === prevItem.id) return { ...item, zIndex: tempZ };
      return item;
    });
    
    set({ items: newItems });
    get().saveToHistory();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({
        items: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
        selectedId: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        items: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
        selectedId: null,
      });
    }
  },

  alignItem: (id, alignment) => {
    const { items, canvasWidth, canvasHeight } = get();
    const item = items.find((i) => i.id === id);
    if (!item || item.locked) return;

    let newX = item.x;
    let newY = item.y;

    switch (alignment) {
      case 'left':
        newX = 0;
        break;
      case 'center':
        newX = (canvasWidth - item.width) / 2;
        break;
      case 'right':
        newX = canvasWidth - item.width;
        break;
      case 'top':
        newY = 0;
        break;
      case 'middle':
        newY = (canvasHeight - item.height) / 2;
        break;
      case 'bottom':
        newY = canvasHeight - item.height;
        break;
    }

    get().updateItem(id, { x: newX, y: newY });
    get().saveToHistory();
  },
}));
