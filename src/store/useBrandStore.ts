import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrandKit {
  brandName: string;
  website: string;
  facebookPage: string;
  phone: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  preferredLanguage: string;
  logos: string[]; // URLs or base64 data
  watermark: string; // URL or base64 data
}

interface BrandState {
  brandKit: BrandKit;
  updateBrandKit: (fields: Partial<BrandKit>) => void;
  resetBrandKit: () => void;
}

const defaultBrandKit: BrandKit = {
  brandName: "Elite Academic & Admission Aid",
  website: "www.eliteacademy.edu",
  facebookPage: "facebook.com/eliteacademic",
  phone: "+880 1234-567890",
  email: "info@eliteacademic.edu",
  primaryColor: "#121540", // Dark Blue from logo
  secondaryColor: "#3b82f6", // Light Blue from logo
  fontFamily: "Outfit",
  preferredLanguage: "Bangla",
  logos: ["/logo-transparent.png"],
  watermark: "/logo-transparent.png",
};

export const useBrandStore = create<BrandState>()(
  persist(
    (set) => ({
      brandKit: defaultBrandKit,
      updateBrandKit: (fields) =>
        set((state) => ({
          brandKit: { ...state.brandKit, ...fields },
        })),
      resetBrandKit: () => set({ brandKit: defaultBrandKit }),
    }),
    {
      name: 'elite-brand-kit',
    }
  )
);
