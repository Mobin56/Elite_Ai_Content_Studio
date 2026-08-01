'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { generateCopywriting, CopywritingOutput } from '@/utils/ai';
import { Sparkles, Copy, Check, FileText, Share2, ClipboardList } from 'lucide-react';

export default function AICopywriterView() {
  const { deductCredits } = useAppStore();

  const [topic, setTopic] = useState('Admission Open 2026');
  const [platform, setPlatform] = useState('Facebook');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopywritingOutput | null>(null);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic or keyword.");
      return;
    }
    setLoading(true);
    setResult(null);

    const success = deductCredits(3);
    if (!success) {
      alert("Insufficient AI credits!");
      setLoading(false);
      return;
    }

    try {
      const copy = await generateCopywriting(topic.trim(), platform);
      setResult(copy);
    } catch (e) {
      console.error(e);
      alert("Copywriter service failed. Check configurations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Copywriter</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Instantly write educational promotional captions, social posts, taglines, and SEO-optimized summaries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Parameters Column */}
        <div className="p-6 rounded-2xl glass-card space-y-5 h-max">
          <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-400" />
            Writing Parameters
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Topic / Core Focus</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground font-sans"
              placeholder="e.g. Robotics Class, Physics admission"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Primary Channel</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
            >
              <option value="Facebook">Facebook (Detailed & Emojis)</option>
              <option value="Instagram">Instagram (Compact & Hashtags)</option>
              <option value="YouTube">YouTube Description</option>
              <option value="SEO">SEO Title & Meta Keywords</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            {loading ? "Writing copies..." : "Write Content (3 Credits)"}
          </button>
        </div>

        {/* Output Column */}
        <div className="md:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="p-12 text-center border border-dashed border-[var(--glass-border)] rounded-2xl h-full flex flex-col items-center justify-center bg-slate-900/5 dark:bg-slate-900/20">
              <FileText className="w-12 h-12 text-slate-500 mb-4 stroke-1" />
              <h4 className="font-bold text-sm">Copywriter Idle</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Enter your promotion topic on the left and click write to compile headlines, taglines, and Facebook posts.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center rounded-2xl border border-[var(--glass-border)] bg-slate-900/5 dark:bg-slate-900/20 animate-pulse h-full flex flex-col items-center justify-center">
              <Sparkles className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="font-bold text-sm">AI Drafting Promotional Copy...</p>
              <p className="text-xs text-muted-foreground mt-1">Analyzing educational keywords and social hashtags</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Headline */}
              <div className="p-5 rounded-2xl glass-card relative group">
                <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2 mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Suggested Headline</span>
                  <button
                    onClick={() => handleCopy(result.headline, 'headline')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedField === 'headline' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xl font-extrabold font-sans tracking-tight text-foreground">{result.headline}</p>
              </div>

              {/* Descriptions & CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl glass-card relative">
                  <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2 mb-3">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Paragraph Description</span>
                    <button
                      onClick={() => handleCopy(result.description, 'description')}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedField === 'description' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{result.description}</p>
                </div>

                <div className="p-5 rounded-2xl glass-card relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2 mb-3">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Call To Action (CTA)</span>
                      <button
                        onClick={() => handleCopy(result.cta, 'cta')}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedField === 'cta' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="inline-block px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold font-sans">
                      {result.cta}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[var(--glass-border)]">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">SEO Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.seoKeywords.map((kw, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 border border-[var(--glass-border)] px-2 py-0.5 rounded text-slate-400 font-mono">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Caption */}
              <div className="p-5 rounded-2xl glass-card relative">
                <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-2 mb-3">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">
                    Social Copy ({platform})
                  </span>
                  <button
                    onClick={() => handleCopy(
                      platform === 'Facebook' ? result.facebookCaption : 
                      platform === 'Instagram' ? result.instagramCaption : 
                      result.youtubeDescription,
                      'social'
                    )}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedField === 'social' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {platform === 'Facebook' ? result.facebookCaption : 
                   platform === 'Instagram' ? result.instagramCaption : 
                   result.youtubeDescription}
                </pre>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
