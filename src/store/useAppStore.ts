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

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Designer' | 'Editor' | 'Viewer';
  credits: number;
  activeProjects: number;
  lastActive: string;
}

interface AppState {
  theme: 'light' | 'dark';
  activeView: 'dashboard' | 'editor' | 'brandkit' | 'templates' | 'ai-mcq' | 'ai-copywriter' | 'admin' | 'settings';
  aiCredits: number;
  projects: Project[];
  currentProjectId: string | null;
  adminStats: AdminStats;
  
  // Super Admin Credentials
  adminPassword: string;
  members: Member[];
  
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

  // Member & Super Admin management
  addMember: (name: string, email: string, role: Member['role']) => void;
  deleteMember: (id: string) => void;
  allocateCredits: (memberId: string, amount: number) => void;
  changeAdminPassword: (password: string) => void;
}

const defaultAdminStats: AdminStats = {
  totalUsers: 1420,
  totalTemplates: 45,
  creditsUsed: 28450,
  activeSubscriptions: 382,
  monthlyRevenue: 7640,
  storageUsedBytes: 42 * 1024 * 1024 * 1024,
};

const defaultMembers: Member[] = [
  { id: 'user-1', name: 'Dr. Sarah Connor', email: 'sconnor@eliteschool.edu', role: 'Admin', credits: 250, activeProjects: 24, lastActive: '2 mins ago' },
  { id: 'user-2', name: 'John Doe', email: 'jdoe@eliteschool.edu', role: 'Designer', credits: 45, activeProjects: 12, lastActive: '1 hour ago' },
  { id: 'user-3', name: 'Professor Charles', email: 'charles@eliteschool.edu', role: 'Editor', credits: 10, activeProjects: 5, lastActive: '1 day ago' },
  { id: 'user-4', name: 'Albert Einstein', email: 'albert@eliteschool.edu', role: 'Viewer', credits: 10, activeProjects: 2, lastActive: '3 days ago' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      activeView: 'dashboard',
      aiCredits: 150,
      projects: [],
      currentProjectId: null,
      adminStats: defaultAdminStats,
      
      // Admin configurations
      adminPassword: 'admin123',
      members: defaultMembers,

      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      setView: (activeView) => set({ activeView }),
      
      deductCredits: (amount) => {
        const { aiCredits } = get();
        if (aiCredits >= amount) {
          set({ aiCredits: aiCredits - amount });
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

      addMember: (name, email, role) => set((state) => {
        const newMember: Member = {
          id: `user-${Date.now()}`,
          name,
          email,
          role,
          credits: 10, // Default 10 free credits for everyone!
          activeProjects: 0,
          lastActive: 'Never'
        };
        return { 
          members: [...state.members, newMember],
          adminStats: {
            ...state.adminStats,
            totalUsers: state.adminStats.totalUsers + 1
          }
        };
      }),

      deleteMember: (id) => set((state) => ({
        members: state.members.filter(m => m.id !== id),
        adminStats: {
          ...state.adminStats,
          totalUsers: Math.max(0, state.adminStats.totalUsers - 1)
        }
      })),

      allocateCredits: (memberId, amount) => set((state) => {
        return {
          members: state.members.map(m => 
            m.id === memberId ? { ...m, credits: m.credits + amount } : m
          )
        };
      }),

      changeAdminPassword: (adminPassword) => set({ adminPassword }),
    }),
    {
      name: 'elite-app-store',
    }
  )
);
