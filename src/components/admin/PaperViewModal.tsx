import React from 'react';
import { ExamPaper, PaperStatus } from '../../types/exam';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  Edit,
  Clock,
  Key,
  Award,
  CheckCircle2,
  Layers,
  Printer,
  BookOpen,
  Trash2,
} from 'lucide-react';

interface PaperViewModalProps {
  paper: ExamPaper;
  onClose: () => void;
  onEdit: (paper: ExamPaper) => void;
  onStatusChange: (paperId: string, status: PaperStatus) => void;
  onDelete?: (paperId: string) => void;
}

export const PaperViewModal: React.FC<PaperViewModalProps> = ({
  paper,
  onClose,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const { t } = useLanguage();

  const statuses: { value: PaperStatus; label: string; color: string }[] = [
    { value: 'live', label: '🟢 LIVE', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { value: 'draft', label: '🟡 DRAFT', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { value: 'saved', label: '⚪ SAVED', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { value: 'paused', label: '⏸️ PAUSED', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
              GER {paper.level}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {paper.title}
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Key: <strong className="text-slate-900">{paper.key}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(paper)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5" />
              Bearbeiten (Edit)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Quick Status Bar with 1-Click Status Switcher */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800">
                Prüfungsstatus direkt ändern (Change Status):
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {statuses.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onStatusChange(paper.id, s.value)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      paper.status === s.value
                        ? `${s.color} ring-2 ring-slate-900 shadow-xs font-extrabold`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              {paper.status === 'live'
                ? '🟢 Dieser Prüfungsbogen ist LIVE und kann von Studenten mit dem Schlüssel ' + paper.key + ' gestartet werden.'
                : paper.status === 'paused'
                ? '⏸️ Diese Prüfung ist vorübergehend pausiert. Studenten können sie erst nach Reaktivierung wieder aufrufen.'
                : paper.status === 'saved'
                ? '⚪ Dieser Prüfungsbogen ist gespeichert, aber für Studenten noch nicht freigegeben.'
                : '🟡 Entwurf: In Bearbeitung durch Dozenten.'}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block">Prüfungsschlüssel</span>
              <code className="text-sm font-bold text-amber-900 font-mono">{paper.key}</code>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block">Zeitlimit</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{paper.durationMinutes} Min.</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block">Bestehensgrenze</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{paper.passPercentage}%</span>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg">
              <span className="text-slate-500 block">Fragenkatalog</span>
              <span className="text-sm font-bold text-slate-900 font-mono">{paper.questions.length} Fragen</span>
            </div>
          </div>

          {paper.description && (
            <div className="text-xs text-slate-600 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-800 block mb-0.5">Anweisungen für Prüflinge:</strong>
              {paper.description}
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-700" />
              Alle Fragen und Musterlösungen ({paper.questions.length})
            </h3>

            <div className="space-y-3">
              {paper.questions.map((q, idx) => (
                <div key={q.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {q.prompt}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                      {q.points} Pkt.
                    </span>
                  </div>

                  {q.contextNote && (
                    <span className="inline-block text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Thema: {q.contextNote}
                    </span>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map(opt => {
                      const isCorrect = opt.label === q.correctOption;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-lg border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 font-semibold text-emerald-900 ring-1 ring-emerald-300'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>
                            <strong>{opt.label}:</strong> {opt.text}
                          </span>
                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700">
                              ✓ Richtige Option
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      <strong className="text-slate-900">Erklärung:</strong> {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Drucken
          </button>

          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(paper.id)}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 flex items-center gap-1"
                title={t.removePaper}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.removePaper}
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(paper)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Prüfung bearbeiten
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
