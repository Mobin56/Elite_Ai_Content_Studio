'use client';

import React, { useRef } from 'react';
import { useBrandStore, BrandKit } from '@/store/useBrandStore';
import { useForm } from 'react-hook-form';
import { Palette, Upload, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export default function BrandKitView() {
  const { brandKit, updateBrandKit, resetBrandKit } = useBrandStore();
  
  const { register, handleSubmit, setValue, watch } = useForm<BrandKit>({
    defaultValues: brandKit
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const watchedLogos = watch('logos') || [];
  const watchedWatermark = watch('watermark') || '';

  const onSubmit = (data: BrandKit) => {
    updateBrandKit(data);
    alert('Brand Kit successfully updated! Changes are saved locally and applied to all templates.');
  };

  // Convert uploaded image to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logos' | 'watermark') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (field === 'logos') {
          const updatedLogos = [...watchedLogos, reader.result];
          setValue('logos', updatedLogos);
          updateBrandKit({ logos: updatedLogos });
        } else {
          setValue('watermark', reader.result);
          updateBrandKit({ watermark: reader.result });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = (index: number) => {
    const updated = watchedLogos.filter((_, idx) => idx !== index);
    setValue('logos', updated);
    updateBrandKit({ logos: updated });
  };

  const removeWatermark = () => {
    setValue('watermark', '');
    updateBrandKit({ watermark: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configure Brand Kit</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your brand logo, colors, font choices, and details are automatically integrated into all design templates.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to reset the brand kit to defaults?')) {
              resetBrandKit();
              window.location.reload();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--glass-border)] hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Brand details */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              Corporate Identity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Brand / Institution Name</label>
                <input
                  type="text"
                  {...register('brandName')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                  placeholder="e.g. Harvard University"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Preferred Language</label>
                <select
                  {...register('preferredLanguage')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                >
                  <option value="English">English</option>
                  <option value="Bangla">Bangla (বাংলা)</option>
                  <option value="Arabic">Arabic (العربية)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="Urdu">Urdu (اردو)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Website Address</label>
                <input
                  type="text"
                  {...register('website')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                  placeholder="www.harvard.edu"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Facebook Page</label>
                <input
                  type="text"
                  {...register('facebookPage')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                  placeholder="facebook.com/harvard"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Contact Number</label>
                <input
                  type="text"
                  {...register('phone')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                  placeholder="+1 555-019-2831"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Email Address</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                  placeholder="admissions@harvard.edu"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2">
              Color Palette & Typography
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Primary Brand Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('primaryColor')}
                    className="w-10 h-10 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent"
                  />
                  <input
                    type="text"
                    {...register('primaryColor')}
                    className="flex-1 px-3 py-2 text-xs rounded-lg glass-input text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('secondaryColor')}
                    className="w-10 h-10 rounded cursor-pointer border border-[var(--glass-border)] bg-transparent"
                  />
                  <input
                    type="text"
                    {...register('secondaryColor')}
                    className="flex-1 px-3 py-2 text-xs rounded-lg glass-input text-foreground font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Default Typography Font</label>
                <select
                  {...register('fontFamily')}
                  className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
                >
                  <option value="Outfit">Outfit</option>
                  <option value="Inter">Inter</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save Brand Kit Configuration
          </button>
        </div>

        {/* Right Side: Assets upload logos & watermark */}
        <div className="space-y-6">
          {/* Logo uploads */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center justify-between">
              <span>Brand Logos</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {watchedLogos.length} Uploaded
              </span>
            </h3>
            
            <input
              type="file"
              ref={logoInputRef}
              onChange={(e) => handleImageUpload(e, 'logos')}
              accept="image/*"
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-[var(--glass-border)] rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-foreground hover:border-indigo-500 transition-all cursor-pointer bg-slate-900/5 dark:bg-slate-900/20"
            >
              <Upload className="w-6 h-6 stroke-1 mb-1.5" />
              <span className="text-xs font-semibold">Upload New Logo</span>
              <span className="text-[9px] mt-0.5 text-slate-500">PNG, SVG or JPG supported</span>
            </button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {watchedLogos.map((logo, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg border border-[var(--glass-border)] bg-slate-900/30 p-2 flex items-center justify-center overflow-hidden">
                  <img src={logo} alt="Logo" className="max-h-full max-w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeLogo(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Watermark upload */}
          <div className="p-6 rounded-2xl glass-card space-y-4">
            <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2">
              Default Watermark
            </h3>
            
            {watchedWatermark ? (
              <div className="relative group aspect-video rounded-xl border border-[var(--glass-border)] bg-slate-900/30 p-3 flex items-center justify-center overflow-hidden">
                <img src={watchedWatermark} alt="Watermark" className="max-h-full max-w-full object-contain opacity-50" />
                <button
                  type="button"
                  onClick={removeWatermark}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  ref={watermarkInputRef}
                  onChange={(e) => handleImageUpload(e, 'watermark')}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => watermarkInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-[var(--glass-border)] rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-foreground hover:border-indigo-500 transition-all cursor-pointer bg-slate-900/5 dark:bg-slate-900/20"
                >
                  <Upload className="w-6 h-6 stroke-1 mb-1.5" />
                  <span className="text-xs font-semibold">Upload Watermark</span>
                  <span className="text-[9px] mt-0.5 text-slate-500">Transparent PNG recommended</span>
                </button>
              </>
            )}
          </div>
        </div>

      </form>
    </div>
  );
}
