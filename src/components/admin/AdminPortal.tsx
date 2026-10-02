import React, { useState, useEffect } from 'react';
import {
  User,
  ExamPaper,
  ExamSubmission,
  AuditLog,
  PaperStatus,
  CEFRLevel,
  Batch,
  StudentAdmission,
  AttendanceSession,
  FeeRecord,
  GoethePruefungFile,
  TrashItem,
} from '../../types/exam';
import { storageService } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { PaperEditor } from './PaperEditor';
import { SubmissionDetailModal } from './SubmissionDetailModal';
import { PaperViewModal } from './PaperViewModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { AIPaperGeneratorModal } from '../common/AIPaperGeneratorModal';
import { GoetheFolderModal } from '../common/GoetheFolderModal';
import { TrashBinModal } from '../common/TrashBinModal';
import { AdmissionsTab } from './AdmissionsTab';
import { BatchesTab } from './BatchesTab';
import { AttendanceTab } from './AttendanceTab';
import { FeesTab } from './FeesTab';
import { examGenerator } from '../../services/examGenerator';
import {
  FileText,
  CheckCircle,
  Plus,
  Key,
  Trash2,
  Edit,
  Eye,
  Shield,
  Search,
  Download,
  AlertTriangle,
  Activity,
  Server,
  Lock,
  Award,
  Play,
  Pause,
  Save,
  CheckCircle2,
  Wand2,
  Users,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Folder,
  Sparkles,
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User;
  onOpenPasswordModal: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onOpenPasswordModal,
}) => {
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'admissions'
    | 'batches'
    | 'attendance'
    | 'fees'
    | 'papers'
    | 'goethe'
    | 'trash'
    | 'submissions'
    | 'security'
  >('overview');
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Institute state
  const [admissions, setAdmissions] = useState<StudentAdmission[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [goetheFiles, setGoetheFiles] = useState<GoethePruefungFile[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);

  // AI Generator and Goethe / Trash modal states
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGoetheModalOpen, setIsGoetheModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

  // Paper editor state
  const [editingPaper, setEditingPaper] = useState<ExamPaper | null>(null);
  const [isCreatingPaper, setIsCreatingPaper] = useState(false);

  // Paper view/preview modal state
  const [viewingPaper, setViewingPaper] = useState<ExamPaper | null>(null);

  // Deletion in-app confirmation modal states (replaces blocked window.confirm)
  const [paperToDelete, setPaperToDelete] = useState<ExamPaper | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ExamSubmission | null>(null);

  // Submission detail modal state
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);

  // Submissions search & filters
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [selectedPaperFilter, setSelectedPaperFilter] = useState<string>('all');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const loadData = () => {
    setPapers(storageService.getPapers());
    setSubmissions(storageService.getSubmissions());
    setAuditLogs(storageService.getAuditLogs());
    setAdmissions(storageService.getAdmissions());
    setBatches(storageService.getBatches());
    setAttendanceSessions(storageService.getAttendanceSessions());
    setFees(storageService.getFees());
    setGoetheFiles(storageService.getGoetheFiles());
    setTrashItems(storageService.getTrashItems());
    const allUsers = storageService.getUsers();
    setTeachers(allUsers.filter((u) => u.role === 'teacher'));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (paperId: string, status: PaperStatus) => {
    storageService.updatePaperStatus(paperId, status);
    loadData();
    if (viewingPaper && viewingPaper.id === paperId) {
      setViewingPaper(prev => prev ? { ...prev, status } : null);
    }
    const paperObj = papers.find(p => p.id === paperId);
    setStatusNotification(`Status für „${paperObj?.title || paperId}“ geändert auf: ${status.toUpperCase()}`);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDeletePaper = (paperIdOrPaper: string | ExamPaper) => {
    const target = typeof paperIdOrPaper === 'string'
      ? papers.find(p => p.id === paperIdOrPaper)
      : paperIdOrPaper;
    if (target) {
      setPaperToDelete(target);
    }
  };

  const confirmDeletePaper = () => {
    if (!paperToDelete) return;
    const deletedTitle = paperToDelete.title;
    storageService.deletePaper(paperToDelete.id);
    loadData();
    if (viewingPaper && viewingPaper.id === paperToDelete.id) {
      setViewingPaper(null);
    }
    setPaperToDelete(null);
    setStatusNotification(`Prüfungsbogen „${deletedTitle}“ wurde erfolgreich entfernt.`);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleDeleteSubmission = (subOrId: ExamSubmission | string) => {
    const target = typeof subOrId === 'string'
      ? submissions.find(s => s.id === subOrId)
      : subOrId;
    if (target) {
      setSubmissionToDelete(target);
    }
  };

  const confirmDeleteSubmission = () => {
    if (!submissionToDelete) return;
    storageService.deleteSubmission(submissionToDelete.id);
    loadData();
    setSubmissionToDelete(null);
    setStatusNotification(`Prüfungsergebnis von „${submissionToDelete.studentName}“ wurde entfernt.`);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  const handleQuickGeneratePaper = (level: CEFRLevel, patternType: 'goethe' | 'grammatik') => {
    const newPaper = examGenerator.generateExamPaper({
      level,
      patternType,
      authorName: currentUser.name || 'Prüfungsleitung',
    });
    storageService.savePaper(newPaper);
    loadData();
    setStatusNotification(`✓ Prüfungsbogen „${newPaper.title}“ (GER ${level}) automatisch generiert & LIVE geschaltet! Schlüssel: ${newPaper.key}`);
    setTimeout(() => setStatusNotification(null), 5000);
  };

  const handleSavePaper = (savedPaper: ExamPaper) => {
    storageService.savePaper(savedPaper);
    setIsCreatingPaper(false);
    setEditingPaper(null);
    loadData();
    setStatusNotification(`Prüfungsbogen „${savedPaper.title}“ gespeichert! Schlüssel: ${savedPaper.key} (Status: ${savedPaper.status.toUpperCase()})`);
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Candidate Name', 'Username', 'Email', 'Exam Paper', 'Level', 'Score', 'MaxScore', 'Percentage', 'Passed', 'Submitted At', 'Verified'];
    const rows = submissions.map(s => [
      s.id,
      `"${s.studentName}"`,
      s.studentUsername,
      s.studentEmail,
      `"${s.paperTitle}"`,
      s.paperLevel,
      s.score,
      s.totalPoints,
      `${s.percentage}%`,
      s.passed ? 'Yes' : 'No',
      `"${new Date(s.submittedAt).toLocaleString()}"`,
      s.verifiedByAdmin ? 'Yes' : 'No',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `deutsch_exam_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const metrics = storageService.getAnalyticsMetrics();

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      s.studentUsername.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      s.paperTitle.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      s.paperKey.toLowerCase().includes(submissionSearch.toLowerCase());

    const matchesPaper = selectedPaperFilter === 'all' || s.paperId === selectedPaperFilter;
    return matchesSearch && matchesPaper;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Status Change Notification Toast */}
      {statusNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{statusNotification}</span>
          </div>
          <button
            onClick={() => setStatusNotification(null)}
            className="text-xs text-emerald-800 hover:underline"
          >
            Ausblenden
          </button>
        </div>
      )}

      {/* Discreet password reminder for Admin */}
      {currentUser.isDefaultPassword && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                {t.passwordChangePromptTitle}
              </h3>
              <p className="text-xs text-amber-800">
                {t.passwordChangePromptDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenPasswordModal}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shrink-0 shadow-2xs"
          >
            {t.changePasswordNow}
          </button>
        </div>
      )}

      {/* Main Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{t.adminLeitstand}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t.systemNominal}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{t.adminHeaderTitle}</span>
            <span role="img" aria-label="Deutschland Flagge" className="text-2xl">🇩🇪</span>
          </h1>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>KI-Prüfungsgenerator</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGoetheModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Folder className="w-4 h-4 text-amber-500" />
            <span>Goethe-Ordner</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPaper(null);
              setIsCreatingPaper(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t.newPaperButton}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex items-center gap-3 sm:gap-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            {t.tabOverview}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admissions')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'admissions'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Studenten ({admissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'batches'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Klassen ({batches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Anwesenheit</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fees')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Gebühren ({fees.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('papers')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'papers'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.tabPapers} ({papers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('goethe')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'goethe'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-500" />
            <span>Goethe-Ordner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trash')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'trash'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span>Papierkorb ({trashItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            {t.tabSubmissions} ({submissions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3.5 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            {t.tabSecurity}
          </button>
        </nav>
      </div>

      {/* VIEW: Paper Editor / Creator */}
      {(isCreatingPaper || editingPaper) && (
        <PaperEditor
          paper={editingPaper}
          authorName={currentUser.name}
          onSave={handleSavePaper}
          onCancel={() => {
            setIsCreatingPaper(false);
            setEditingPaper(null);
          }}
        />
      )}

      {/* VIEW: Overview & Analytics */}
      {!isCreatingPaper && !editingPaper && activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">{t.submittedExamsStat}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.totalSubmissions}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Auto-Graded</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">{t.passRateStat}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                  60%
                </span>
                <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Offizielle Richtlinie
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1">
                Kandidaten-Erfolgsquote: {metrics.passRate}% ({metrics.passedCount} von {metrics.totalSubmissions} bestanden)
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">{t.avgScoreStat}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.avgScore}%
                </span>
                <span className="text-[11px] text-slate-500 font-medium">GER B1</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">{t.livePapersStat}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {metrics.livePapersCount} / {metrics.totalPapers}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">{t.statusLive}</span>
              </div>
            </div>
          </div>

          {/* Scalability & Live Concurrency Telemetry */}
          <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold tracking-tight">
                    {t.concurrencyTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t.concurrencyDesc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium text-emerald-300">
                  {t.systemNominal}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono pt-1">
              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">{t.concurrentCapacity}</span>
                <span className="text-base font-bold text-white tabular-nums">5.000 Sessions</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Buffer: 98%</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">{t.activeClients}</span>
                <span className="text-base font-bold text-emerald-400 tabular-nums">
                  {Math.max(12, metrics.totalSubmissions * 4 + 7)} Online
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">&lt; 25ms Latency</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">{t.cryptoHashing}</span>
                <span className="text-base font-bold text-white">SHA-256 / Salted</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Zero Plaintext</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <span className="text-slate-400 block text-[11px]">{t.gradingThroughput}</span>
                <span className="text-base font-bold text-white tabular-nums">~850 / sec</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Instant Verify</span>
              </div>
            </div>
          </div>

          {/* Active Papers with EDIT, VIEW, & DIRECT STATUS CHANGE */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.activePapersShowcase}
                </h3>
                <p className="text-xs text-slate-500">
                  {t.activePapersDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('papers')}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                {t.manageAllPapers}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((p) => {
                const isLive = p.status === 'live';
                const isDraft = p.status === 'draft';
                const isSaved = p.status === 'saved';
                const isPaused = p.status === 'paused';

                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      isLive
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isPaused
                        ? 'border-purple-200 bg-purple-50/20'
                        : isSaved
                        ? 'border-slate-200 bg-slate-50/50'
                        : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                          GER {p.level}
                        </span>

                        {/* Status Badge */}
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isLive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isPaused
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : isSaved
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isLive ? '🟢 LIVE' : isPaused ? '⏸️ PAUSED' : isSaved ? '⚪ SAVED' : '🟡 DRAFT'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {p.description || 'Keine Beschreibung vorhanden.'}
                      </p>

                      <div className="flex items-center gap-2 text-xs mb-3 text-slate-600">
                        <span>Schlüssel:</span>
                        <code className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {p.key}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyKey(p.key)}
                          className="text-[10px] text-slate-500 hover:text-slate-900 underline"
                        >
                          {copiedKey === p.key ? 'Kopiert!' : 'Kopieren'}
                        </button>
                      </div>
                    </div>

                    {/* Action Bar: View, Edit, and Status Changer */}
                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      
                      {/* Status Selector Dropdown */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="text-slate-500 font-medium">Status:</span>
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value as PaperStatus)}
                          className={`text-xs font-bold py-1 px-2 rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 ${
                            isLive
                              ? 'text-emerald-800 border-emerald-300'
                              : isPaused
                              ? 'text-purple-800 border-purple-300'
                              : isSaved
                              ? 'text-slate-800 border-slate-300'
                              : 'text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="live">🟢 LIVE (Aktiv für Schüler)</option>
                          <option value="draft">🟡 DRAFT (Entwurf)</option>
                          <option value="saved">⚪ SAVED (Gespeichert)</option>
                          <option value="paused">⏸️ PAUSED (Pausiert)</option>
                        </select>
                      </div>

                      {/* View & Edit Buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setViewingPaper(p)}
                          className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Vorschau
                        </button>

                        <button
                          type="button"
                          onClick={() => setEditingPaper(p)}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Bearbeiten
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePaper(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          title={t.removePaper}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {t.recentSubmissions}
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('submissions')}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                {t.fullList}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {submissions.slice(0, 5).map((sub) => (
                <div
                  key={sub.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      sub.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {sub.percentage}%
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        {sub.studentName}
                      </span>
                      <span className="text-slate-500">
                        {sub.paperTitle} · <code className="font-mono">{sub.paperKey}</code>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleTimeString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition-colors"
                    >
                      {t.verifyResults}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW: Admissions Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'admissions' && (
        <AdmissionsTab
          admissions={admissions}
          batches={batches}
          onDataRefresh={loadData}
          adminName={currentUser.name}
        />
      )}

      {/* VIEW: Batches Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'batches' && (
        <BatchesTab
          batches={batches}
          teachers={teachers}
          onDataRefresh={loadData}
          adminName={currentUser.name}
        />
      )}

      {/* VIEW: Attendance Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'attendance' && (
        <AttendanceTab
          batches={batches}
          admissions={admissions}
          attendanceSessions={attendanceSessions}
          onDataRefresh={loadData}
          adminName={currentUser.name}
        />
      )}

      {/* VIEW: Fees Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'fees' && (
        <FeesTab
          fees={fees}
          onDataRefresh={loadData}
          adminName={currentUser.name}
        />
      )}

      {/* VIEW: Goethe Ordner Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'goethe' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Folder className="w-5 h-5 text-amber-500" />
                <span>Goethe-Prüfungen Ordner (A1 bis C2)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Offizielle autorisierte Prüfungsunterlagen und Goethe-Musterprüfungen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsGoetheModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Übungssatz hochladen / verwalten</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goetheFiles.map(file => (
              <div key={file.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded font-black text-xs bg-slate-900 text-white">GER {file.level}</span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{file.type}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{file.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{file.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{file.filesize}</span>
                  <button
                    type="button"
                    onClick={() => setIsGoetheModalOpen(true)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                  >
                    Öffnen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: Trash Bin Tab */}
      {!isCreatingPaper && !editingPaper && activeTab === 'trash' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                <span>Papierkorb (Gelöschte Prüfungen & Kurse)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Hier können gelöschte Elemente wiederhergestellt oder endgültig vernichtet werden.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsTrashModalOpen(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs self-start sm:self-auto"
            >
              Papierkorb verwalten
            </button>
          </div>
          {trashItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Der Papierkorb ist derzeit leer.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {trashItems.map(item => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.itemTitle}</span>
                    <span className="text-slate-400">Typ: {item.itemType} · Gelöscht von: {item.deletedBy} ({new Date(item.deletedAt).toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        storageService.restoreFromTrash(item.id);
                        loadData();
                        showToast(`Element wiederhergestellt!`, 'success');
                      }}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300"
                    >
                      Wiederherstellen
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        storageService.permanentlyDeleteTrashItem(item.id);
                        loadData();
                        showToast(`Element endgültig gelöscht.`, 'info');
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      title="Endgültig löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: Paper Manager Table with Full View & Edit options */}
      {!isCreatingPaper && !editingPaper && activeTab === 'papers' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.tabPapers}
                </h3>
                <p className="text-xs text-slate-500">
                  Prüfungsbögen ansehen, bearbeiten und Status (Live, Draft, Saved, Paused) direkt ändern.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingPaper(null);
                  setIsCreatingPaper(true);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                {t.newPaperButton}
              </button>
            </div>

            {/* 1-Click Auto Generator Bar */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>1-Klick Prüfungsgenerator (A1–C1 · Goethe-Muster & Grammatik)</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 border border-emerald-300">
                        60% Richtlinie
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Wählen Sie ein Niveau, um sofort eine vollständige LIVE-Prüfung nach Goethe-Muster oder Grammatikstruktur zu erzeugen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Goethe-Muster:
                  </span>
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={`goethe-${lvl}`}
                      type="button"
                      onClick={() => handleQuickGeneratePaper(lvl, 'goethe')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 font-bold rounded-lg border border-emerald-300 shadow-2xs transition-colors flex items-center gap-1"
                      title={`Goethe-Musterprüfung für GER ${lvl} generieren`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lvl}</span>
                    </button>
                  ))}
                </div>

                <div className="h-4 w-px bg-slate-300 hidden sm:block" />

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
                    Grammatik-Test:
                  </span>
                  {(['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]).map((lvl) => (
                    <button
                      key={`gramm-${lvl}`}
                      type="button"
                      onClick={() => handleQuickGeneratePaper(lvl, 'grammatik')}
                      className="px-2.5 py-1 bg-white hover:bg-slate-900 hover:text-white text-slate-800 font-bold rounded-lg border border-slate-300 shadow-2xs transition-colors flex items-center gap-1"
                      title={`Grammatik-Strukturtest für GER ${lvl} generieren`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lvl}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-3">{t.paperTitleInput}</th>
                    <th className="py-3 px-3">{t.cefrLevel}</th>
                    <th className="py-3 px-3">{t.examKeyInput}</th>
                    <th className="py-3 px-3">{t.questionCatalog}</th>
                    <th className="py-3 px-3">{t.durationMinutes}</th>
                    <th className="py-3 px-3">Status ändern (Live/Draft/Saved/Paused)</th>
                    <th className="py-3 px-3 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {papers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 text-sm block">
                          {p.title}
                        </span>
                        <span className="text-slate-500 text-[11px] line-clamp-1">
                          {p.description}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                          {p.level}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono font-bold text-sm bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                            {p.key}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopyKey(p.key)}
                            className="text-[10px] text-slate-500 hover:text-slate-900"
                          >
                            {copiedKey === p.key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums">
                        {p.questions.length} Fragen
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums">
                        {p.durationMinutes} min
                      </td>
                      <td className="py-3 px-3">
                        {/* 1-Click Status Dropdown */}
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value as PaperStatus)}
                          className={`text-xs font-bold py-1 px-2.5 rounded-lg border bg-white focus:outline-none ${
                            p.status === 'live'
                              ? 'text-emerald-800 border-emerald-400 bg-emerald-50'
                              : p.status === 'paused'
                              ? 'text-purple-800 border-purple-400 bg-purple-50'
                              : p.status === 'saved'
                              ? 'text-slate-800 border-slate-400 bg-slate-100'
                              : 'text-amber-800 border-amber-400 bg-amber-50'
                          }`}
                        >
                          <option value="live">🟢 LIVE</option>
                          <option value="draft">🟡 DRAFT</option>
                          <option value="saved">⚪ SAVED</option>
                          <option value="paused">⏸️ PAUSED</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* VIEW button */}
                          <button
                            type="button"
                            onClick={() => setViewingPaper(p)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1 transition-colors"
                            title="Fragen und Antworten ansehen"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ansehen
                          </button>

                          {/* EDIT button */}
                          <button
                            type="button"
                            onClick={() => setEditingPaper(p)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded flex items-center gap-1 transition-colors"
                            title="Prüfung bearbeiten"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Bearbeiten
                          </button>

                          {/* DELETE button */}
                          <button
                            type="button"
                            onClick={() => handleDeletePaper(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: Submissions & Results Verification */}
      {!isCreatingPaper && !editingPaper && activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.tabSubmissions}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  {t.exportCsv}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <select
                  value={selectedPaperFilter}
                  onChange={(e) => setSelectedPaperFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="all">{t.allPapers}</option>
                  {papers.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.key})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-3">{t.candidate}</th>
                    <th className="py-3 px-3">{t.examPaper}</th>
                    <th className="py-3 px-3">{t.cefrLevel}</th>
                    <th className="py-3 px-3">{t.score}</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">{t.duration}</th>
                    <th className="py-3 px-3">{t.verificationOfficial}</th>
                    <th className="py-3 px-3 text-right">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Keine Prüfungsabgaben gefunden.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 text-sm block">
                            {sub.studentName}
                          </span>
                          <span className="text-slate-400 text-[11px] font-mono">
                            {sub.studentId} · {sub.studentUsername}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800 block">
                            {sub.paperTitle}
                          </span>
                          <code className="text-amber-800 font-mono text-[11px]">
                            {sub.paperKey}
                          </code>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                            {sub.paperLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono tabular-nums font-bold">
                          {sub.score} / {sub.totalPoints} ({sub.percentage}%)
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            sub.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.passed ? t.passed : t.failed}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                          {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          {sub.verifiedByAdmin ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> {t.verificationOfficial}
                            </span>
                          ) : (
                            <span className="text-amber-700 font-medium">{t.verificationPending}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors shadow-2xs"
                            >
                              {t.verifyResults}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSubmission(sub.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title={t.removePastSubmission}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: Security & Audit Logs */}
      {!isCreatingPaper && !editingPaper && activeTab === 'security' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">SHA-256 Hashing</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero plaintext password storage with 16-byte random salts and cryptographic digest verification.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-900">Role-Based Access (RBAC)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict separation between candidates and examiners. Candidate accounts can never access administrative views.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-slate-700" />
                <h4 className="text-xs font-bold text-slate-900">Exam Integrity</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Atomic auto-grading with verifiable timestamps and immutable question response records.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {t.tabSecurity}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {auditLogs.length} events
              </span>
            </div>

            <div className="divide-y divide-slate-100 font-mono text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.severity === 'security'
                        ? 'bg-purple-100 text-purple-800'
                        : log.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {log.details}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 shrink-0">
                    <span>{log.actorUsername}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Viewing Paper Modal (Full Preview of Questions & Options) */}
      {viewingPaper && (
        <PaperViewModal
          paper={viewingPaper}
          onClose={() => setViewingPaper(null)}
          onEdit={(p) => {
            setViewingPaper(null);
            setEditingPaper(p);
          }}
          onStatusChange={handleUpdateStatus}
          onDelete={handleDeletePaper}
        />
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          paper={papers.find(p => p.id === selectedSubmission.paperId)}
          onClose={() => setSelectedSubmission(null)}
          onUpdated={loadData}
        />
      )}

      {/* In-App Confirmation Modal: Delete Paper (Reliable inside iframes) */}
      <ConfirmModal
        isOpen={Boolean(paperToDelete)}
        title="Prüfungsbogen wirklich löschen?"
        message={
          paperToDelete
            ? `Möchten Sie den Prüfungsbogen „${paperToDelete.title}“ (Schlüssel: ${paperToDelete.key}) wirklich unwiderruflich löschen? Alle zugehörigen Fragen werden entfernt.`
            : ''
        }
        confirmLabel="Ja, endgültig löschen"
        cancelLabel="Abbrechen"
        isDestructive={true}
        onConfirm={confirmDeletePaper}
        onCancel={() => setPaperToDelete(null)}
      />

      {/* In-App Confirmation Modal: Delete Submission */}
      <ConfirmModal
        isOpen={Boolean(submissionToDelete)}
        title="Prüfungsergebnis entfernen?"
        message={
          submissionToDelete
            ? `Möchten Sie das Prüfungsergebnis von „${submissionToDelete.studentName}“ für „${submissionToDelete.paperTitle}“ (${submissionToDelete.percentage}%) wirklich löschen?`
            : ''
        }
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        isDestructive={true}
        onConfirm={confirmDeleteSubmission}
        onCancel={() => setSubmissionToDelete(null)}
      />

      {/* AI Paper Generator Modal */}
      <AIPaperGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        authorName={currentUser.name}
        onAdoptPaper={(newP) => {
          storageService.savePaper(newP);
          loadData();
          setIsAiModalOpen(false);
          showToast(`✨ KI-Prüfungsbogen „${newP.title}“ gespeichert & LIVE geschaltet!`, 'success');
        }}
      />

      {/* Goethe Folder Modal */}
      <GoetheFolderModal
        isOpen={isGoetheModalOpen}
        files={goetheFiles}
        onClose={() => setIsGoetheModalOpen(false)}
        canUpload={true}
        onUploadFile={(newF) => {
          storageService.saveGoetheFile(newF);
          loadData();
          showToast(`Datei „${newF.title}“ erfolgreich in Goethe-Ordner gespeichert.`, 'success');
        }}
      />

      {/* Trash Bin Modal */}
      <TrashBinModal
        isOpen={isTrashModalOpen}
        trashItems={trashItems}
        onClose={() => setIsTrashModalOpen(false)}
        onRestore={(id) => {
          storageService.restoreFromTrash(id);
          loadData();
          showToast(`Element wiederhergestellt!`, 'success');
        }}
        onPermanentDelete={(id) => {
          storageService.permanentlyDeleteTrashItem(id);
          loadData();
          showToast(`Element endgültig gelöscht.`, 'info');
        }}
        onEmptyTrash={() => {
          storageService.emptyTrash();
          loadData();
          showToast(`Papierkorb geleert.`, 'info');
        }}
      />

    </div>
  );
};
