import React, { useState } from 'react';
import { ExamPaper, CEFRLevel, ExamModule } from '../../types/exam';
import { examGenerator } from '../../services/examGenerator';
import {
  Sparkles,
  Wand2,
  X,
  CheckCircle2,
  Loader2,
  FileText,
  Download,
  Play,
  Printer,
  Key,
  Layers,
  Award,
} from 'lucide-react';

interface AIPaperGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdoptPaper: (paper: ExamPaper) => void;
  authorName: string;
}

export const AIPaperGeneratorModal: React.FC<AIPaperGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAdoptPaper,
  authorName,
}) => {
  const [level, setLevel] = useState<CEFRLevel>('B1');
  const [module, setModule] = useState<ExamModule>('Grammatik');
  const [topicPrompt, setTopicPrompt] = useState('');
  const [questionCount, setQuestionCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<ExamPaper | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const modules = examGenerator.getModules();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedPaper(null);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          module,
          topicPrompt,
          questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const data = resJson.data;
        const newPaper: ExamPaper = {
          id: 'paper-ai-' + Date.now().toString(36),
          title: data.title || `Goethe-Zertifikat ${level}: ${module} (AI)`,
          description: data.description || `Generierte Prüfung für Niveau ${level} im Modul ${module}.`,
          key: data.key || `#${level}-${Math.floor(100 + Math.random() * 900)}`,
          level,
          status: 'live',
          durationMinutes: data.durationMinutes || 25,
          passPercentage: 60,
          category: module,
          authorName: `${authorName} (AI Architect)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          questions: data.questions || [],
          answerKeyNotes: data.answerKeyNotes,
          pdfExportAvailable: true,
        };
        setGeneratedPaper(newPaper);
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      // Local fallback generator
      const fallback = examGenerator.generateExamPaper({
        level,
        module,
        authorName: `${authorName} (AI Assistant)`,
      });
      setGeneratedPaper(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  AI Paper Generator (A1–C2)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                  Gemini Flash 3.8
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Generiert originäre, niveaugerechte Prüfungsbögen, Lösungsschlüssel & PDFs für Deutschkurs By Noman.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Generator Input Form */}
          <form onSubmit={handleGenerate} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
            {/* Level selection A1 to C2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. CEFR-Niveau auswählen (A1 bis C2):
              </label>
              <div className="grid grid-cols-6 gap-2">
                {levels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-2 text-xs font-extrabold rounded-lg border transition-all ${
                      level === lvl
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Module selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. Prüfungsmodul / Fertigkeit:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {modules.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setModule(m.key)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      module === m.key
                        ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">{m.key}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Topic Customization */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                3. Thematischer Schwerpunkt (Optional):
              </label>
              <input
                type="text"
                value={topicPrompt}
                onChange={(e) => setTopicPrompt(e.target.value)}
                placeholder="z. B. Konnektoren mit Inversion, Wechselpräpositionen, Bewerbungsschreiben..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Erstellt komplette Multiple-Choice Aufgaben mit ausführlicher Begründung.
              </span>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>KI generiert Prüfung für GER {level}...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>Prüfungsbogen jetzt generieren</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Generated Result Preview */}
          {generatedPaper && (
            <div className="bg-white rounded-xl border-2 border-emerald-500/40 p-5 space-y-4 shadow-sm animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      GER {generatedPaper.level}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Modul: {generatedPaper.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Schlüssel: {generatedPaper.key}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {generatedPaper.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {generatedPaper.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => examGenerator.downloadAnswerKey(generatedPaper)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    title="Lösungsschlüssel als Textdatei herunterladen"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Lösungsschlüssel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onAdoptPaper(generatedPaper)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>In LIVE-Prüfungen übernehmen</span>
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Enthaltene Prüfungsfragen ({generatedPaper.questions.length}):
                </h4>
                {generatedPaper.questions.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        {idx + 1}. {q.prompt}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Lösung: [{q.correctOption}]
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-1.5 rounded border ${
                            opt.label === q.correctOption
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-600'
                          }`}
                        >
                          <strong>{opt.label}:</strong> {opt.text}
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <strong>Erklärung: </strong>{q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span>Deutschkurs By Noman · Intelligente Prüfungsarchitektur</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-semibold"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
