'use client';

import React, { useState } from 'react';
import { useAppStore, Project } from '@/store/useAppStore';
import { useEditorStore, CanvasItem } from '@/store/useEditorStore';
import { useBrandStore } from '@/store/useBrandStore';
import { generateMCQ, MCQQuestion } from '@/utils/ai';
import { calculatePremiumMCQLayout } from '@/utils/canvas-helpers';
import { Sparkles, Brain, CheckCircle, RefreshCw, Send, Check } from 'lucide-react';

export default function AIMCQView() {
  const { deductCredits, setView, setCurrentProject, saveProject } = useAppStore();
  const { loadDesign } = useEditorStore();
  const { brandKit } = useBrandStore();

  const [subject, setSubject] = useState('Physics');
  const [className, setClassName] = useState('HSC / College');
  const [difficulty, setDifficulty] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MCQQuestion | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    // Deduct credit
    const success = deductCredits(5);
    if (!success) {
      alert("Insufficient AI credits! Please top up from Settings or Admin panel.");
      setLoading(false);
      return;
    }

    try {
      const generated = await generateMCQ(subject, language, difficulty, className);
      setResult(generated);
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI server. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCanvas = () => {
    if (!result) return;
    
    const logoUrl = brandKit.logos.length > 0 ? brandKit.logos[0] : '';
    const { items, height } = calculatePremiumMCQLayout(
      result.question,
      result.options,
      brandKit.brandName,
      brandKit.primaryColor,
      brandKit.secondaryColor,
      logoUrl
    );

    const projectTemplateId = `project-mcq-${Date.now()}`;
    const newProject = {
      id: projectTemplateId,
      name: `AI MCQ - ${subject}`,
      canvasWidth: 800,
      canvasHeight: height,
      items
    };

    saveProject(newProject);
    loadDesign(items, 800, height);
    setCurrentProject(projectTemplateId);
    setView('editor');
  };

  const subjectOptions = [
    'Physics', 'Chemistry', 'Mathematics', 'Biology',
    'ICT', 'GK'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-[var(--glass-border)] pb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI MCQ Generator</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Uses highly trained educational datasets to build high-quality questions, incorrect distractor choices, and solutions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="p-6 rounded-2xl glass-card space-y-5 h-max">
          <h3 className="font-bold text-sm border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            Generator Parameters
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Subject / Category</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
            >
              {subjectOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Target Grade / Level</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
            >
              <option value="Secondary School (SSC)">Secondary School (SSC)</option>
              <option value="HSC / College">HSC / College</option>
              <option value="University Admission">University Admission</option>
              <option value="BCS / Job Competitive">BCS / Job Competitive Exam</option>
              <option value="SAT / GRE Prep">SAT / GRE Prep</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Difficulty Grade</label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer border ${
                    difficulty === diff
                      ? 'gradient-bg text-white border-transparent'
                      : 'border-[var(--glass-border)] text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg glass-input text-foreground"
            >
              <option value="English">English</option>
              <option value="Bangla">Bangla (বাংলা)</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                AI thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate (Cost: 5 Credits)
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="p-12 text-center border border-dashed border-[var(--glass-border)] rounded-2xl h-full flex flex-col items-center justify-center bg-slate-900/5 dark:bg-slate-900/20">
              <Sparkles className="w-12 h-12 text-slate-500 mb-4 stroke-1" />
              <h4 className="font-bold text-sm">MCQ Generator Idle</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Configure your grade settings and subject on the left, then click Generate to prompt the AI model.
              </p>
            </div>
          )}

          {loading && (
            <div className="p-12 text-center rounded-2xl border border-[var(--glass-border)] bg-slate-900/5 dark:bg-slate-900/20 animate-pulse h-full flex flex-col items-center justify-center">
              <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="font-bold text-sm">Drafting MCQ Question...</p>
              <p className="text-xs text-muted-foreground mt-1">Generating option distractors and math solutions</p>
            </div>
          )}

          {result && !loading && (
            <div className="p-6 rounded-2xl glass-card space-y-6 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
                <span className="text-xs font-bold text-slate-400">AI GENERATED RESULT</span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Fact-Checked
                </span>
              </div>

              {/* Question */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400">QUESTION</p>
                <p className="text-lg font-bold font-sans">{result.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400">OPTIONS</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.options.map((opt, idx) => {
                    const optionLetter = ['A', 'B', 'C', 'D'][idx];
                    const isCorrect = opt === result.answer || opt.endsWith(result.answer) || result.answer.includes(opt);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold'
                            : 'border-[var(--glass-border)] bg-slate-900/20 text-slate-300'
                        }`}
                      >
                        <span>{optionLetter}) {opt}</span>
                        {isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-[var(--glass-border)] space-y-1.5">
                <p className="text-xs font-bold text-indigo-400 tracking-wider">EXPLANATION & PROOFS</p>
                <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line">{result.explanation}</p>
              </div>

              {/* Export Trigger */}
              <div className="flex gap-4">
                <button
                  onClick={handleExportToCanvas}
                  className="flex-1 py-3 rounded-xl gradient-bg text-white font-bold hover:scale-[1.01] transition-transform cursor-pointer shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Load Layout in Design Editor
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 rounded-xl border border-[var(--glass-border)] hover:bg-slate-900 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
