import React, { useState } from 'react';
import { ExamSubmission, ExamPaper } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import {
  X,
  CheckCircle2,
  Clock,
  Save,
  Printer,
  Award,
  ShieldCheck,
} from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: ExamSubmission;
  paper?: ExamPaper;
  onClose: () => void;
  onUpdated: () => void;
}

export const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({
  submission,
  paper,
  onClose,
  onUpdated,
}) => {
  const { t } = useLanguage();
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || '');
  const [verified, setVerified] = useState(submission.verifiedByAdmin);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveVerification = () => {
    setIsSaving(true);
    storageService.verifySubmission(submission.id, adminNotes);
    setVerified(true);
    setIsSaving(false);
    setSaveSuccess(true);
    onUpdated();
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                GER {submission.paperLevel}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {submission.studentName}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {submission.paperTitle} · <code className="font-mono font-bold text-slate-700">{submission.paperKey}</code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">{t.candidate}</span>
              <span className="font-bold text-slate-900 text-sm">{submission.studentName}</span>
              <span className="text-slate-400 block font-mono text-[11px]">{submission.studentUsername}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.score}</span>
              <span className="font-bold text-slate-900 text-sm font-mono tabular-nums">
                {submission.score} / {submission.totalPoints} {t.pointsLabel}
              </span>
              <span className={`block font-bold ${submission.passed ? 'text-emerald-700' : 'text-red-700'}`}>
                {submission.percentage}% · {submission.passed ? t.passed : t.failed}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.duration}</span>
              <span className="font-bold text-slate-900 text-sm font-mono tabular-nums">
                {formatSeconds(submission.timeSpentSeconds)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">{t.tabAdmin}</span>
              <span className={`inline-flex items-center gap-1 font-bold text-xs mt-1 ${
                verified ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {verified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.verificationOfficial}
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    {t.verificationPending}
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-slate-700" />
              {t.detailedReviewTitle}
            </h3>

            <div className="space-y-3">
              {submission.responses.map((resp, idx) => {
                const questionInPaper = paper?.questions.find(q => q.id === resp.questionId);
                const promptText = questionInPaper?.prompt || `${t.question} ${idx + 1}`;
                const correctOption = questionInPaper?.correctOption;
                const explanation = questionInPaper?.explanation;

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
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          {promptText}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        resp.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {resp.pointsEarned} {t.points}
                      </span>
                    </div>

                    {questionInPaper && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 text-xs">
                        {questionInPaper.options.map(opt => {
                          const isStudentPick = opt.label === resp.selectedOption;
                          const isTheCorrect = opt.label === correctOption;

                          let style = 'bg-slate-50 border-slate-200 text-slate-600';
                          if (isTheCorrect) {
                            style = 'bg-emerald-100/70 border-emerald-400 font-semibold text-emerald-900';
                          } else if (isStudentPick && !resp.isCorrect) {
                            style = 'bg-red-100/70 border-red-400 font-semibold text-red-900 line-through';
                          }

                          return (
                            <div key={opt.id} className={`p-2 rounded-lg border flex items-center justify-between ${style}`}>
                              <span>
                                <strong className="mr-1.5">{opt.label}:</strong> {opt.text}
                              </span>
                              {isStudentPick && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/80">
                                  {t.yourChoice}
                                </span>
                              )}
                              {isTheCorrect && !isStudentPick && (
                                <span className="text-[10px] font-bold text-emerald-700">
                                  ✓ {t.correctSolution}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {explanation && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 mt-2">
                        <strong className="text-slate-800">{t.explanationTitle}</strong> {explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Verification & Notes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-800" />
              {t.verifiedNotesLabel}
            </h4>

            <div>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="button"
                onClick={handleSaveVerification}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                {saveSuccess ? t.verifiedSuccess : t.saveVerification}
              </button>
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
            {t.printScoreSheet}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
