import React, { useState, useEffect } from 'react';
import { User, ExamPaper, ExamSubmission, StudentAdmission, Batch, FeeRecord, PaymentReceipt, GoethePruefungFile, AttendanceSession } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import { ExamTakingSession } from './ExamTakingSession';
import { ExamResultView } from './ExamResultView';
import { ConfirmModal } from '../common/ConfirmModal';
import { CertificateModal } from './CertificateModal';
import { PerformanceAnalyticsChart } from './PerformanceAnalyticsChart';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  Key,
  Play,
  History,
  AlertCircle,
  FileCheck,
  Clock,
  Award,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Download,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Folder,
  User as UserIcon,
  Printer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface StudentPortalProps {
  currentUser: User;
  onOpenPasswordModal: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  onOpenPasswordModal,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exams' | 'courses' | 'attendance' | 'fees' | 'goethe'>('exams');
  const [paperKeyInput, setPaperKeyInput] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);
  
  // Active test session states
  const [activePaper, setActivePaper] = useState<ExamPaper | null>(null);
  const [completedSubmission, setCompletedSubmission] = useState<ExamSubmission | null>(null);

  // Past submissions
  const [pastSubmissions, setPastSubmissions] = useState<ExamSubmission[]>([]);

  // Certificate Modal state
  const [selectedCertificateSubmission, setSelectedCertificateSubmission] = useState<ExamSubmission | null>(null);

  // Receipt Modal state
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);

  // Institute Student Records
  const [admissionRecord, setAdmissionRecord] = useState<StudentAdmission | null>(null);
  const [enrolledBatch, setEnrolledBatch] = useState<Batch | null>(null);
  const [feeRecord, setFeeRecord] = useState<FeeRecord | null>(null);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [goetheFiles, setGoetheFiles] = useState<GoethePruefungFile[]>([]);

  // Deletion modals
  const [submissionToDelete, setSubmissionToDelete] = useState<ExamSubmission | null>(null);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  const loadStudentData = () => {
    const history = storageService.getSubmissionsForStudent(currentUser.username);
    setPastSubmissions(history);

    const admissions = storageService.getAdmissions();
    const adm = admissions.find((a) => a.studentId === currentUser.studentId || a.username === currentUser.username || a.email === currentUser.email);
    setAdmissionRecord(adm || null);

    const batches = storageService.getBatches();
    const batch = batches.find((b) => b.id === adm?.batchId || (currentUser.assignedBatchIds && currentUser.assignedBatchIds.includes(b.id)));
    setEnrolledBatch(batch || batches[0] || null);

    const fees = storageService.getFees();
    const fee = fees.find((f) => f.studentId === currentUser.studentId || f.studentEmail === currentUser.email);
    setFeeRecord(fee || null);

    const allAtt = storageService.getAttendanceSessions();
    const studentAtt = allAtt.filter((s) => s.entries.some((e) => e.studentId === currentUser.studentId));
    setAttendanceSessions(studentAtt);

    setGoetheFiles(storageService.getGoetheFiles());
  };

  const confirmDeletePastSubmission = () => {
    if (!submissionToDelete) return;
    storageService.deleteSubmission(submissionToDelete.id);
    loadStudentData();
    setSubmissionToDelete(null);
  };

  const confirmClearAllHistory = () => {
    storageService.clearSubmissionsForStudent(currentUser.username);
    loadStudentData();
    setShowClearHistoryConfirm(false);
  };

  useEffect(() => {
    loadStudentData();
  }, [currentUser.username, currentUser.studentId]);

  // Handle entering key to open the specific paper
  const handleUnlockPaper = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);

    const inputRaw = paperKeyInput.trim();
    if (!inputRaw) {
      setKeyError(t.examKeyPlaceholder);
      return;
    }

    // Exact key search with normalization
    const paper = storageService.getPaperByKey(inputRaw);

    if (!paper) {
      setKeyError(`Keine Prüfung mit dem Schlüssel „${inputRaw}“ gefunden. Bitte überprüfen Sie den Code oder fragen Sie Ihren Dozenten.`);
      return;
    }

    if (paper.status === 'paused') {
      setKeyError(`Die Prüfung „${paper.title}“ (${paper.key}) ist vorübergehend PAUSIERT (⏸️ Paused). Bitte warten Sie auf die Freigabe.`);
      return;
    }

    if (paper.status === 'draft') {
      setKeyError(`Die Prüfung „${paper.title}“ (${paper.key}) befindet sich noch im ENTWURF (🟡 Draft) und ist noch nicht LIVE geschaltet.`);
      return;
    }

    if (paper.status === 'saved') {
      setKeyError(`Die Prüfung „${paper.title}“ (${paper.key}) ist GESPEICHERT (⚪ Saved), aber noch nicht LIVE geschaltet.`);
      return;
    }

    if (paper.status !== 'live') {
      setKeyError(`Die Prüfung „${paper.title}“ (${paper.key}) ist derzeit nicht verfügbar (Status: ${paper.status.toUpperCase()}).`);
      return;
    }

    // Open exclusively this specific paper
    setActivePaper(paper);
    setCompletedSubmission(null);
  };

  const handleStartQuickKey = (keyToTest: string) => {
    setPaperKeyInput(keyToTest);
    const paper = storageService.getPaperByKey(keyToTest);
    if (paper && paper.status === 'live') {
      setActivePaper(paper);
      setCompletedSubmission(null);
      setKeyError(null);
    } else if (paper) {
      setKeyError(`Die Prüfung „${paper.title}“ (${paper.key}) ist zurzeit ${paper.status.toUpperCase()}.`);
    } else {
      setKeyError(`Keine Prüfung mit Schlüssel ${keyToTest} gefunden.`);
    }
  };

  // If taking an exam
  if (activePaper) {
    return (
      <ExamTakingSession
        paper={activePaper}
        currentUser={currentUser}
        onFinishExam={(submission) => {
          setActivePaper(null);
          setCompletedSubmission(submission);
          loadStudentData();
        }}
        onExit={() => setActivePaper(null)}
      />
    );
  }

  // If viewing completed submission
  if (completedSubmission) {
    return (
      <ExamResultView
        submission={completedSubmission}
        paper={storageService.getPaperById(completedSubmission.paperId)}
        onRetake={() => {
          const p = storageService.getPaperById(completedSubmission.paperId);
          if (p) {
            setCompletedSubmission(null);
            setActivePaper(p);
          }
        }}
        onBackToDashboard={() => {
          setCompletedSubmission(null);
          loadStudentData();
        }}
      />
    );
  }

  // Get currently active live papers to show available tests
  const livePapers = storageService.getPapers().filter(p => p.status === 'live');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Student Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <span>Deutschkurs By Noman</span>
              <span role="img" aria-label="Deutschland Flagge">🇩🇪</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{t.studentPortal}</span>
            <span aria-hidden="true">·</span>
            <span>{t.studentIdLabel}: {currentUser.studentId || 'STU-9921'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">GER {currentUser.currentLevel || 'A1'} → {currentUser.targetLevel || 'B1'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.welcome}, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.enterExamKeyDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPasswordModal}
          className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-lg transition-colors shadow-2xs"
        >
          {t.changePassword}
        </button>
      </div>

      {/* Student Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'exams'
                ? 'border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Prüfungen & Analysen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'courses'
                ? 'border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Mein Kurs & Stundenplan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Meine Anwesenheit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gebühren & Quittungen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('goethe')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'goethe'
                ? 'border-slate-900 dark:border-amber-400 text-slate-900 dark:text-amber-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-500" />
            <span>Goethe-Prüfungen (A1–C2)</span>
          </button>
        </nav>
      </div>

      {/* TAB CONTENT: EXAMS */}
      {activeTab === 'exams' && (
        <div className="space-y-8">

      {/* Paper Key Access Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            <Key className="w-3.5 h-3.5 text-amber-700" />
            {t.enterExamKeyTitle}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t.enterExamKeyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Geben Sie Ihren individuellen Prüfungsschlüssel ein (z. B. <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">#1234</code> oder <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">#11122</code>). Es öffnet sich genau dieser Prüfungsbogen.
          </p>
        </div>

        <form onSubmit={handleUnlockPaper} className="max-w-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={paperKeyInput}
                onChange={(e) => {
                  setPaperKeyInput(e.target.value);
                  setKeyError(null);
                }}
                placeholder={t.examKeyPlaceholder}
                required
                className="w-full pl-10 pr-3 py-2.5 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-mono font-bold uppercase tracking-wider text-slate-900 bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4" />
              {t.openExamButton}
            </button>
          </div>

          {keyError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{keyError}</span>
            </div>
          )}

          {/* Available LIVE Keys quick chips */}
          {livePapers.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Aktive LIVE-Prüfungen:</span>
              {livePapers.map((lp) => (
                <button
                  key={lp.id}
                  type="button"
                  onClick={() => handleStartQuickKey(lp.key)}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md font-mono font-semibold transition-colors flex items-center gap-1 text-[11px]"
                >
                  {lp.key} ({lp.title.slice(0, 20)}...)
                </button>
              ))}
            </div>
          )}
        </form>

        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-700 shrink-0" />
            <span>{t.instantFeedbackFeature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-700 shrink-0" />
            <span>{t.timerFeature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-700 shrink-0" />
            <span>{t.cefrEvaluationFeature}</span>
          </div>
        </div>
      </div>

      {/* Recharts Historical Performance & Level Progression Chart (A1–C1) */}
      <PerformanceAnalyticsChart submissions={pastSubmissions} />

      {/* Student Exam History */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-700" />
              {t.examHistoryTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {t.examHistorySubtitle}
            </p>
          </div>

          {pastSubmissions.length > 0 && (
            <button
              type="button"
              onClick={() => setShowClearHistoryConfirm(true)}
              className="text-xs text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1"
              title={t.clearAllPastExams}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAllPastExams}</span>
            </button>
          )}
        </div>

        {pastSubmissions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            {t.noPastExams}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pastSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono tabular-nums shrink-0 ${
                    sub.passed || sub.percentage >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {sub.percentage}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {sub.paperTitle}
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                        GER {sub.paperLevel}
                      </span>
                      {(sub.passed || sub.percentage >= 60) && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Bestanden (≥60%)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                      <span>{sub.paperKey}</span>
                      <span aria-hidden="true">·</span>
                      <span>{sub.score}/{sub.totalPoints} {t.points}</span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {(sub.passed || sub.percentage >= 60) && (
                    <button
                      type="button"
                      onClick={() => setSelectedCertificateSubmission(sub)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                      title="Offizielles Prüfungszertifikat ansehen & herunterladen"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>Zertifikat (GER {sub.paperLevel})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCompletedSubmission(sub)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    {t.detailsAndResults}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmissionToDelete(sub)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title={t.removePastSubmission}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        </div>
      )}

      {/* TAB CONTENT: COURSES & SCHEDULE */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Mein Kursverband & Stundenplan</span>
              </h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                Aktiv eingeschrieben
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kursname:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{enrolledBatch?.name || 'Deutsch Intensivkurs'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">GER-Niveau:</span>
                  <span className="font-black px-2 py-0.5 rounded bg-slate-900 text-white">GER {enrolledBatch?.level || currentUser.currentLevel || 'B1'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Leitender Dozent:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">{enrolledBatch?.teacherName || 'Prof. Dr. Anna Lindemann'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Unterrichtszeiten:</span>
                  <span className="font-semibold">{enrolledBatch?.schedule || 'Mo–Do 09:00 – 11:30 Uhr'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Klassenraum / Link:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{enrolledBatch?.roomOrLink || 'Präsenz Raum 101'}</span>
                </div>
              </div>

              {/* Level Progress & Promotion History */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Lernfortschritt & GER-Niveau</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Ziel: GER {currentUser.targetLevel || 'B2'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map((lvl) => {
                    const isPassed = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(lvl) <= ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].indexOf(currentUser.currentLevel || 'A1');
                    return (
                      <div
                        key={lvl}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-center font-bold text-xs border ${
                          isPassed
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-2xs'
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {lvl}
                      </div>
                    );
                  })}
                </div>

                {admissionRecord?.promotionHistory && admissionRecord.promotionHistory.length > 0 ? (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Beförderungshistorie:</span>
                    {admissionRecord.promotionHistory.map((pr) => (
                      <div key={pr.id} className="text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                        <span className="font-bold text-emerald-600">GER {pr.fromLevel} → GER {pr.toLevel}</span>
                        <span className="text-slate-400 block">{new Date(pr.promotedAt).toLocaleDateString()} · {pr.remarks}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Erreichen Sie ≥60% in Ihren Prüfungen, um von Ihrem Dozenten auf das nächste GER-Niveau befördert zu werden.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                <span>Meine Anwesenheitsstatistik</span>
              </h3>
              <p className="text-xs text-slate-500">
                Regelmäßige Teilnahme sichert die Zulassung zur offiziellen Goethe-Prüfung.
              </p>
            </div>

            {/* Attendance % summary card */}
            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl">
              <span className="text-xs text-emerald-900 dark:text-emerald-200 font-bold">Anwesenheitsquote:</span>
              <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {storageService.getStudentAttendanceStats(currentUser.studentId || '').percentage}%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Datum</th>
                  <th className="py-2.5 px-3">Kursverband</th>
                  <th className="py-2.5 px-3">Unterrichtsthema</th>
                  <th className="py-2.5 px-3">Dozent</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceSessions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
                      Bislang keine Anwesenheitseinträge vorhanden.
                    </td>
                  </tr>
                ) : (
                  attendanceSessions.map((sess) => {
                    const myEntry = sess.entries.find((e) => e.studentId === currentUser.studentId);
                    const status = myEntry?.status || 'present';
                    return (
                      <tr key={sess.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3 font-semibold">{sess.date}</td>
                        <td className="py-3 px-3">{sess.batchName}</td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{sess.topicCovered || 'Grammatik & Sprachbausteine'}</td>
                        <td className="py-3 px-3 text-slate-500">{sess.markedBy}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : status === 'late'
                              ? 'bg-amber-100 text-amber-800'
                              : status === 'excused'
                              ? 'bg-sky-100 text-sky-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {status === 'present' ? '✓ Anwesend' : status === 'late' ? '⏱ Verspätet' : status === 'excused' ? 'Entschuldigt' : '✗ Abwesend'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FEES & RECEIPTS */}
      {activeTab === 'fees' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Gebührenkonto & Zahlungsquittungen</span>
              </h3>
              <p className="text-xs text-slate-500">
                Offizielle Quittungen von Deutschkurs By Noman herunterladen und ausdrucken.
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              feeRecord?.status === 'paid'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800'
            }`}>
              Status: {feeRecord?.status ? feeRecord.status.toUpperCase() : 'BEZAHLT'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block text-[11px] mb-1">Kursgebühr gesamt:</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">€{feeRecord?.totalFee || 350}.00</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block text-[11px] mb-1">Bezahlter Betrag:</span>
              <span className="text-xl font-bold text-emerald-600">€{feeRecord?.paidAmount || 350}.00</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 block text-[11px] mb-1">Offener Restbetrag:</span>
              <span className={`text-xl font-bold ${feeRecord?.balanceDue ? 'text-amber-600' : 'text-slate-400'}`}>
                €{feeRecord?.balanceDue || 0}.00
              </span>
            </div>
          </div>

          {/* Transactions list with Receipt download */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verbuchte Zahlungen & Quittungen:
            </h4>

            {feeRecord?.transactions && feeRecord.transactions.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {feeRecord.transactions.map((tx) => {
                  const receiptObj: PaymentReceipt = {
                    receiptNumber: tx.receiptNumber,
                    studentId: feeRecord.studentId,
                    studentName: feeRecord.studentName,
                    studentEmail: feeRecord.studentEmail,
                    batchName: feeRecord.batchName,
                    level: feeRecord.level,
                    transactionDate: tx.date,
                    amountPaid: tx.amount,
                    totalFee: feeRecord.netFee,
                    balanceRemaining: feeRecord.balanceDue,
                    paymentMethod: tx.paymentMethod,
                    recordedBy: tx.recordedBy,
                    instituteTitle: 'Deutschkurs By Noman',
                    note: tx.notes,
                  };

                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">{tx.receiptNumber}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-semibold">{tx.paymentMethod}</span>
                        </div>
                        <span className="text-slate-400 text-[11px]">{tx.date} · {tx.notes || 'Gebührenzahlung für Sprachkurs'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-600 font-mono text-sm">€{tx.amount.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(receiptObj)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Quittung</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Keine Transaktionen verbucht.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GOETHE PRÜFUNGEN ARCHIVE */}
      {activeTab === 'goethe' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-500" />
                <span>Goethe-Prüfungen Ordner (A1–C2)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Offizielle autorisierte Übungsmaterialien und Modelltests zur Prüfungsvorbereitung.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goetheFiles.map((file) => (
              <div key={file.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded font-black text-xs bg-slate-900 text-white">
                      GER {file.level}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {file.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{file.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{file.description}</p>
                  <p className="text-[11px] text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mb-3">
                    {file.contentSnippet}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">{file.filesize}</span>
                  <a
                    href={`#`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Download gestartet: ${file.filename}`);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Übungssatz herunterladen</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Modal for Individual Past Submission */}
      <ConfirmModal
        isOpen={Boolean(submissionToDelete)}
        title="Ergebnis entfernen?"
        message={
          submissionToDelete
            ? `Möchten Sie das Prüfungsergebnis für „${submissionToDelete.paperTitle}“ (${submissionToDelete.percentage}%) wirklich aus Ihrem Verlauf löschen?`
            : ''
        }
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        isDestructive={true}
        onConfirm={confirmDeletePastSubmission}
        onCancel={() => setSubmissionToDelete(null)}
      />

      {/* Confirmation Modal for Clearing All History */}
      <ConfirmModal
        isOpen={showClearHistoryConfirm}
        title="Gesamten Prüfungsverlauf löschen?"
        message="Möchten Sie wirklich alle bisherigen Prüfungsergebnisse unwiderruflich aus Ihrem Verlauf löschen?"
        confirmLabel="Ja, Verlauf leeren"
        cancelLabel="Abbrechen"
        isDestructive={true}
        onConfirm={confirmClearAllHistory}
        onCancel={() => setShowClearHistoryConfirm(false)}
      />

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={Boolean(selectedCertificateSubmission)}
        submission={selectedCertificateSubmission}
        onClose={() => setSelectedCertificateSubmission(null)}
      />

      {/* Payment Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedReceipt)}
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

    </div>
  );
};

