import React, { useState } from 'react';
import { ExamSubmission, ExamPaper } from '../../types/exam';
import { useLanguage } from '../../context/LanguageContext';
import { CertificateModal } from './CertificateModal';
import {
  Printer,
  RotateCcw,
  ShieldCheck,
  BookOpen,
  Award,
  Download,
  FileCheck,
} from 'lucide-react';

interface ExamResultViewProps {
  submission: ExamSubmission;
  paper?: ExamPaper;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  submission,
  paper,
  onRetake,
  onBackToDashboard,
}) => {
  const { t } = useLanguage();
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const isPassed = submission.passed || submission.percentage >= 60;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner Card */}
      <div className={`p-6 sm:p-8 rounded-2xl border shadow-xs space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:space-y-0 ${
        isPassed
          ? 'bg-emerald-50/70 border-emerald-300'
          : 'bg-red-50/70 border-red-300'
      }`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1 bg-white/80 shadow-2xs">
            GER {submission.paperLevel} · {isPassed ? t.passed : t.failed}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {isPassed ? t.congratulations : t.examFailedTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {isPassed ? t.passedDesc : t.failedDesc}
          </p>
        </div>

        <div className="flex flex-col items-center sm:items-end shrink-0">
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono tabular-nums">
            {submission.percentage}%
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {submission.score} / {submission.totalPoints} {t.pointsLabel}
          </span>
        </div>
      </div>

      {/* Official Certificate Banner (when score >= 60%) */}
      {isPassed && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
              <Award className="w-7 h-7 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full text-amber-100">
                  Offiziell Bestanden (≥ 60%)
                </span>
                <span className="text-xs text-amber-100">GER {submission.paperLevel}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Prüfungszertifikat von Deutschkurs By Noman freigeschaltet! 🇩🇪
              </h2>
              <p className="text-xs text-amber-100 max-w-xl">
                Herzlichen Glückwunsch! Sie haben mit {submission.percentage}% die Bestehensquote erreicht. Laden Sie Ihr anerkanntes Prüfungszertifikat jetzt herunter.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0 border border-amber-300/30"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Zertifikat ansehen & herunterladen</span>
          </button>
        </div>
      )}

      {/* Meta Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-0.5">{t.candidate}</span>
          <span className="font-bold text-slate-900 text-sm">{submission.studentName}</span>
          <span className="text-[11px] text-slate-400 block font-mono">{submission.studentUsername}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-0.5">{t.examPaper}</span>
          <span className="font-bold text-slate-900 text-sm line-clamp-1">{submission.paperTitle}</span>
          <code className="text-[11px] text-amber-800 font-mono">{submission.paperKey}</code>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-0.5">{t.duration}</span>
          <span className="font-bold text-slate-900 text-sm font-mono tabular-nums">
            {formatSeconds(submission.timeSpentSeconds)}
          </span>
          <span className="text-[11px] text-slate-400 block">/ {paper?.durationMinutes || 25} min</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 block mb-0.5">{t.tabAdmin}</span>
          <span className="font-bold text-slate-900 text-sm flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Auto-Graded
          </span>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-700" />
            {t.detailedReviewTitle}
          </h2>
          <span className="text-xs text-slate-500">
            {submission.responses.filter(r => r.isCorrect).length} {t.of} {submission.responses.length}
          </span>
        </div>

        <div className="space-y-4">
          {submission.responses.map((resp, index) => {
            const question = paper?.questions.find(q => q.id === resp.questionId);
            if (!question) return null;

            return (
              <div
                key={resp.questionId}
                className={`p-4 rounded-xl border transition-all ${
                  resp.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-red-200 bg-red-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      resp.isCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {question.prompt}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    resp.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {resp.pointsEarned} {t.points}
                  </span>
                </div>

                {/* Options representation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-xs">
                  {question.options.map(opt => {
                    const isPicked = opt.label === resp.selectedOption;
                    const isCorrect = opt.label === question.correctOption;

                    let optClass = 'bg-white border-slate-200 text-slate-700';
                    if (isCorrect) {
                      optClass = 'bg-emerald-100/80 border-emerald-400 font-semibold text-emerald-900';
                    } else if (isPicked && !resp.isCorrect) {
                      optClass = 'bg-red-100/80 border-red-400 font-semibold text-red-900 line-through';
                    }

                    return (
                      <div key={opt.id} className={`p-2 rounded-lg border flex items-center justify-between ${optClass}`}>
                        <span>
                          <strong>{opt.label}:</strong> {opt.text}
                        </span>
                        {isPicked && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/90">
                            {t.yourChoice}
                          </span>
                        )}
                        {isCorrect && !isPicked && (
                          <span className="text-[10px] font-bold text-emerald-700">
                            ✓ {t.correctSolution}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Grammar note */}
                <div className="mt-2.5 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                  <strong className="text-slate-900">{t.explanationTitle}</strong> {question.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Printer className="w-4 h-4" />
          {t.printDocument}
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRetake}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t.retakeExam}
          </button>
          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            {t.backToOverview}
          </button>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        submission={submission}
        onClose={() => setIsCertModalOpen(false)}
      />

    </div>
  );
};
