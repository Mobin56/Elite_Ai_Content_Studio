import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CanvasItem } from './useEditorStore';

export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  canvasWidth: number;
  canvasHeight: number;
  items: CanvasItem[];
  thumbnail?: string;
  category?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalTemplates: number;
  creditsUsed: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  storageUsedBytes: number;
}

interface AppState {
  theme: 'light' | 'dark';
  activeView: 'dashboard' | 'editor' | 'brandkit' | 'templates' | 'ai-mcq' | 'ai-copywriter' | 'admin' | 'settings';
  aiCredits: number;
  projects: Project[];
  currentProjectId: string | null;
  adminStats: AdminStats;
  
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setView: (view: AppState['activeView']) => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  
  // Project management
  saveProject: (project: Omit<Project, 'updatedAt'>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  renameProject: (id: string, name: string) => void;
  duplicateProject: (id: string) => void;
}

const defaultAdminStats: AdminStats = {
  totalUsers: 1420,
  totalTemplates: 45,
  creditsUsed: 28450,
  activeSubscriptions: 382,
  monthlyRevenue: 7640,
  storageUsedBytes: 42 * 1024 * 1024 * 1024, // 42GB
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      activeView: 'dashboard',
      aiCredits: 150,
      projects: [],
      currentProjectId: null,
      adminStats: defaultAdminStats,

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      setView: (activeView) => set({ activeView }),
      
      deductCredits: (amount) => {
        const { aiCredits } = get();
        if (aiCredits >= amount) {
          set({ aiCredits: aiCredits - amount });
          // Increment creditsUsed in admin stats
          set((state) => ({
            adminStats: {
              ...state.adminStats,
              creditsUsed: state.adminStats.creditsUsed + amount
            }
          }));
          return true;
        }
        return false;
      },
      
      addCredits: (amount) => set((state) => ({ aiCredits: state.aiCredits + amount })),

      saveProject: (proj) => {
        const { projects } = get();
        const existingIdx = projects.findIndex((p) => p.id === proj.id);
        const updatedProject: Project = {
          ...proj,
          updatedAt: new Date().toISOString(),
        };

        let newProjects = [...projects];
        if (existingIdx >= 0) {
          newProjects[existingIdx] = updatedProject;
        } else {
          newProjects.unshift(updatedProject);
        }

        set({ projects: newProjects });
      },

      deleteProject: (id) => {
        const { projects, currentProjectId } = get();
        set({
          projects: projects.filter((p) => p.id !== id),
          currentProjectId: currentProjectId === id ? null : currentProjectId,
        });
      },

      setCurrentProject: (id) => set({ currentProjectId: id }),

      renameProject: (id, name) => {
        const { projects } = get();
        set({
          projects: projects.map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p)),
        });
      },

      duplicateProject: (id) => {
        const { projects } = get();
        const source = projects.find((p) => p.id === id);
        if (!source) return;

        const duplicate: Project = {
          ...JSON.parse(JSON.stringify(source)),
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: `${source.name} (Copy)`,
          updatedAt: new Date().toISOString(),
        };

        set({ projects: [duplicate, ...projects] });
      },
    }),
    {
      name: 'elite-app-store',
    }
  )
);
