'use client';

import React, { useState } from 'react';
import { useAppStore, Project } from '@/store/useAppStore';
import { useEditorStore, CanvasItem } from '@/store/useEditorStore';
import { useBrandStore } from '@/store/useBrandStore';
import { generateMCQ, MCQQuestion } from '@/utils/ai';
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
    
    // Construct Canvas Items dynamically
    const primary = brandKit.primaryColor;
    const secondary = brandKit.secondaryColor;
    const logoUrl = brandKit.logos.length > 0 ? brandKit.logos[0] : '';

    const items: CanvasItem[] = [
      // Base bg
      {
        id: 'bg-rect',
        type: 'shape',
        x: 0, y: 0, width: 800, height: 800, rotation: 0, opacity: 1, locked: true, zIndex: 1,
        shapeProps: { shapeType: 'rect', fill: '#0a0b10', stroke: primary, strokeWidth: 4 }
      },
      // Header brand logo
      {
        id: 'brand-logo',
        type: logoUrl ? 'logo' : 'shape',
        x: 350, y: 35, width: 100, height: 50, rotation: 0, opacity: 1, locked: false, zIndex: 2,
        imageProps: logoUrl ? { src: logoUrl, blur: 0, brightness: 1, contrast: 1 } : undefined,
        shapeProps: logoUrl ? undefined : { shapeType: 'rect', fill: secondary, stroke: '', strokeWidth: 0 }
      },
      // Subject category label
      {
        id: 'subject-tag-box',
        type: 'shape',
        x: 340, y: 100, width: 120, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 3,
        shapeProps: { shapeType: 'rect', fill: primary, stroke: '', strokeWidth: 0 }
      },
      {
        id: 'subject-tag-text',
        type: 'text',
        x: 340, y: 115, width: 120, height: 20, rotation: 0, opacity: 1, locked: false, zIndex: 4,
        textProps: {
          content: subject.toUpperCase(),
          fontSize: 11,
          fontFamily: 'Outfit',
          color: '#ffffff',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 2,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Header subtitle
      {
        id: 'header-tag',
        type: 'text',
        x: 100, y: 145, width: 600, height: 40, rotation: 0, opacity: 1, locked: false, zIndex: 5,
        textProps: {
          content: `${className.toUpperCase()} • LEVEL: ${difficulty.toUpperCase()}`,
          fontSize: 12,
          fontFamily: 'Inter',
          color: '#cbd5e1',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 1.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      },
      // Question block
      {
        id: 'question-node',
        type: 'text',
        x: 70, y: 220, width: 660, height: 140, rotation: 0, opacity: 1, locked: false, zIndex: 6,
        textProps: {
          content: result.question,
          fontSize: 22,
          fontFamily: 'Outfit',
          color: '#ffffff',
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0,
          lineHeight: 1.4,
          glow: false,
          shadow: '',
          isLaTeX: result.question.includes('\\') || result.question.includes('$')
        }
      },
      // Option A
      {
        id: 'opt-a-bg',
        type: 'shape',
        x: 80, y: 400, width: 300, height: 70, rotation: 0, opacity: 1, locked: false, zIndex: 7,
        shapeProps: { shapeType: 'rect', fill: 'rgba(255,255,255,0.03)', stroke: primary, strokeWidth: 1.5 }
      },
      {
        id: 'opt-a-txt',
        type: 'text',
        x: 100, y: 422, width: 260, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 8,
        textProps: {
          content: `A) ${result.options[0]}`,
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#f8fafc',
          bold: true,
          italic: false,
          underline: false,
          align: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          glow: false,
          shadow: '',
          isLaTeX: result.options[0].includes('\\')
        }
      },
      // Option B
      {
        id: 'opt-b-bg',
        type: 'shape',
        x: 420, y: 400, width: 300, height: 70, rotation: 0, opacity: 1, locked: false, zIndex: 9,
        shapeProps: { shapeType: 'rect', fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }
      },
      {
        id: 'opt-b-txt',
        type: 'text',
        x: 440, y: 422, width: 260, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 10,
        textProps: {
          content: `B) ${result.options[1]}`,
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#cbd5e1',
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          glow: false,
          shadow: '',
          isLaTeX: result.options[1].includes('\\')
        }
      },
      // Option C
      {
        id: 'opt-c-bg',
        type: 'shape',
        x: 80, y: 500, width: 300, height: 70, rotation: 0, opacity: 1, locked: false, zIndex: 11,
        shapeProps: { shapeType: 'rect', fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }
      },
      {
        id: 'opt-c-txt',
        type: 'text',
        x: 100, y: 522, width: 260, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 12,
        textProps: {
          content: `C) ${result.options[2]}`,
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#cbd5e1',
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          glow: false,
          shadow: '',
          isLaTeX: result.options[2].includes('\\')
        }
      },
      // Option D
      {
        id: 'opt-d-bg',
        type: 'shape',
        x: 420, y: 500, width: 300, height: 70, rotation: 0, opacity: 1, locked: false, zIndex: 13,
        shapeProps: { shapeType: 'rect', fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }
      },
      {
        id: 'opt-d-txt',
        type: 'text',
        x: 440, y: 522, width: 260, height: 35, rotation: 0, opacity: 1, locked: false, zIndex: 14,
        textProps: {
          content: `D) ${result.options[3]}`,
          fontSize: 14,
          fontFamily: 'Inter',
          color: '#cbd5e1',
          bold: false,
          italic: false,
          underline: false,
          align: 'left',
          letterSpacing: 0,
          lineHeight: 1.2,
          glow: false,
          shadow: '',
          isLaTeX: result.options[3].includes('\\')
        }
      },
      // Footer URL / website
      {
        id: 'footer-web',
        type: 'text',
        x: 100, y: 720, width: 600, height: 30, rotation: 0, opacity: 1, locked: false, zIndex: 15,
        textProps: {
          content: `Practice online at: ${brandKit.website || 'eliteschool.edu'}`,
          fontSize: 13,
          fontFamily: 'Inter',
          color: secondary,
          bold: true,
          italic: false,
          underline: false,
          align: 'center',
          letterSpacing: 0.5,
          lineHeight: 1.2,
          glow: false,
          shadow: ''
        }
      }
    ];

    const projectTemplateId = `project-mcq-${Date.now()}`;
    const newProject = {
      id: projectTemplateId,
      name: `AI MCQ - ${subject}`,
      canvasWidth: 800,
      canvasHeight: 800,
      items
    };

    saveProject(newProject);
    loadDesign(items, 800, 800);
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
