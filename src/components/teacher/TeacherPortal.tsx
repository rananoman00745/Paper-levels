import React, { useState, useEffect } from 'react';
import {
  User,
  Batch,
  StudentAdmission,
  AttendanceSession,
  ExamPaper,
  ExamSubmission,
  CEFRLevel,
  ExamModule,
  PaperStatus,
  GoethePruefungFile,
} from '../../types/exam';
import { storageService } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { examGenerator } from '../../services/examGenerator';
import { PaperEditor } from '../admin/PaperEditor';
import { PaperViewModal } from '../admin/PaperViewModal';
import { SubmissionDetailModal } from '../admin/SubmissionDetailModal';
import { AIPaperGeneratorModal } from '../common/AIPaperGeneratorModal';
import { GoetheFolderModal } from '../common/GoetheFolderModal';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  GraduationCap,
  Users,
  Calendar,
  ClipboardCheck,
  FileText,
  Award,
  Sparkles,
  Wand2,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Folder,
  Download,
  AlertCircle,
  FileCheck,
  Check,
  X,
  TrendingUp,
} from 'lucide-react';

interface TeacherPortalProps {
  currentUser: User;
  onOpenPasswordModal: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  currentUser,
  onOpenPasswordModal,
}) => {
  const { t } = useLanguage();
  const { showToast, addNotification } = useNotifications();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'batches' | 'attendance' | 'students' | 'exams' | 'submissions' | 'goethe'>('batches');

  // Core Data
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [admissions, setAdmissions] = useState<StudentAdmission[]>([]);
  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [submissions, setSubmissions] = useState<ExamSubmission[]>([]);
  const [goetheFiles, setGoetheFiles] = useState<GoethePruefungFile[]>([]);
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>([]);

  // Attendance marking state
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attTopic, setAttTopic] = useState('');
  const [currentAttendanceEntries, setCurrentAttendanceEntries] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }>>({});

  // Student Promotion Modal
  const [studentToPromote, setStudentToPromote] = useState<StudentAdmission | null>(null);
  const [promotionTargetLevel, setPromotionTargetLevel] = useState<CEFRLevel>('B1');
  const [promotionRemarks, setPromotionRemarks] = useState('');
  const [promotionScore, setPromotionScore] = useState<number>(85);

  // Modals
  const [isCreatingPaper, setIsCreatingPaper] = useState(false);
  const [editingPaper, setEditingPaper] = useState<ExamPaper | null>(null);
  const [viewingPaper, setViewingPaper] = useState<ExamPaper | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ExamSubmission | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGoetheModalOpen, setIsGoetheModalOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState<ExamPaper | null>(null);

  // Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [studentLevelFilter, setStudentLevelFilter] = useState<string>('all');
  const [paperSearch, setPaperSearch] = useState('');
  const [paperLevelFilter, setPaperLevelFilter] = useState<string>('all');

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const loadData = () => {
    const allBatches = storageService.getBatches();
    // Teacher sees batches assigned to them, or all if none specifically assigned
    const teacherBatches = currentUser.assignedBatchIds && currentUser.assignedBatchIds.length > 0
      ? allBatches.filter((b) => currentUser.assignedBatchIds?.includes(b.id) || b.teacherId === currentUser.id || b.teacherId === currentUser.teacherId)
      : allBatches;

    setBatches(teacherBatches);
    if (!selectedBatchId && teacherBatches.length > 0) {
      setSelectedBatchId(teacherBatches[0].id);
    }

    setAdmissions(storageService.getAdmissions());
    setPapers(storageService.getPapers());
    setSubmissions(storageService.getSubmissions());
    setGoetheFiles(storageService.getGoetheFiles());
    setAttendanceSessions(storageService.getAttendanceSessions());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update attendance entries when selected batch or date changes
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const studentsInBatch = admissions.filter((a) => !activeBatch || a.batchId === activeBatch.id || a.currentLevel === activeBatch?.level);

  useEffect(() => {
    if (!activeBatch) return;

    // Check if attendance session exists for this date and batch
    const existing = attendanceSessions.find((s) => s.batchId === activeBatch.id && s.date === attDate);
    const initialMap: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }> = {};

    studentsInBatch.forEach((st) => {
      const match = existing?.entries.find((e) => e.studentId === st.studentId);
      initialMap[st.studentId] = {
        status: match ? match.status : 'present',
        note: match?.note || '',
      };
    });

    setCurrentAttendanceEntries(initialMap);
    if (existing?.topicCovered) {
      setAttTopic(existing.topicCovered);
    }
  }, [selectedBatchId, attDate, attendanceSessions.length]);

  const handleStatusToggle = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setCurrentAttendanceEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setCurrentAttendanceEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!activeBatch) return;

    const entries = studentsInBatch.map((st) => ({
      studentId: st.studentId,
      studentName: st.name,
      status: currentAttendanceEntries[st.studentId]?.status || 'present',
      note: currentAttendanceEntries[st.studentId]?.note || '',
    }));

    const session: AttendanceSession = {
      id: `att-${activeBatch.id}-${attDate}`,
      batchId: activeBatch.id,
      batchName: activeBatch.name,
      date: attDate,
      markedBy: currentUser.name,
      markedByRole: currentUser.role,
      topicCovered: attTopic,
      entries,
      createdAt: new Date().toISOString(),
    };

    storageService.saveAttendanceSession(session);
    loadData();

    showToast(`✓ Anwesenheit für „${activeBatch.name}“ (${attDate}) erfolgreich gespeichert!`, 'success');
    addNotification({
      title: `Anwesenheit erfasst: ${activeBatch.name}`,
      message: `${entries.filter((e) => e.status === 'present').length} von ${entries.length} Teilnehmern anwesend am ${attDate}.`,
      type: 'attendance',
      linkTab: 'attendance',
    });
  };

  const handlePromoteStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToPromote) return;

    const success = storageService.promoteStudent(
      studentToPromote.studentId,
      promotionTargetLevel,
      currentUser.name,
      promotionRemarks || `Erfolgreiche Einstufung durch Dozent ${currentUser.name}.`,
      promotionScore
    );

    if (success) {
      showToast(`🎓 ${studentToPromote.name} wurde erfolgreich auf Niveau GER ${promotionTargetLevel} befördert!`, 'success');
      addNotification({
        title: `Student befördert: ${studentToPromote.name}`,
        message: `Erreichtes Niveau: GER ${promotionTargetLevel} (Dozent: ${currentUser.name}).`,
        type: 'success',
        linkTab: 'students',
      });
      loadData();
      setStudentToPromote(null);
    }
  };

  const handleQuickGenerate = (lvl: CEFRLevel, pattern: 'goethe' | 'grammatik') => {
    const paper = examGenerator.generateExamPaper({
      level: lvl,
      patternType: pattern,
      authorName: currentUser.name,
    });
    storageService.savePaper(paper);
    loadData();
    showToast(`✓ Prüfung „${paper.title}“ (${paper.key}) erstellt & LIVE geschaltet!`, 'success');
  };

  const handleAdoptAiPaper = (newPaper: ExamPaper) => {
    storageService.savePaper(newPaper);
    loadData();
    setIsAiModalOpen(false);
    showToast(`✨ KI-Prüfungsbogen „${newPaper.title}“ gespeichert & LIVE! Schlüssel: ${newPaper.key}`, 'success');
  };

  const handleSavePaper = (paper: ExamPaper) => {
    storageService.savePaper(paper);
    setIsCreatingPaper(false);
    setEditingPaper(null);
    loadData();
    showToast(`Prüfungsbogen „${paper.title}“ (${paper.key}) gespeichert!`, 'success');
  };

  const handleUpdateStatus = (paperId: string, status: PaperStatus) => {
    storageService.updatePaperStatus(paperId, status);
    loadData();
    showToast(`Status auf ${status.toUpperCase()} aktualisiert.`, 'info');
  };

  const confirmDeletePaper = () => {
    if (!paperToDelete) return;
    storageService.deletePaper(paperToDelete.id);
    loadData();
    setPaperToDelete(null);
    showToast(`Prüfungsbogen in den Papierkorb verschoben.`, 'info');
  };

  // Filtered lists
  const filteredStudents = admissions.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
      st.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesLevel = studentLevelFilter === 'all' || st.currentLevel === studentLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const filteredPapers = papers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(paperSearch.toLowerCase()) ||
      p.key.toLowerCase().includes(paperSearch.toLowerCase());
    const matchesLevel = paperLevelFilter === 'all' || p.level === paperLevelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Teacher Profile & Leitstand Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Dozentenportal</span>
              <span>·</span>
              <span>ID: {currentUser.teacherId || 'TCH-001'}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Aktiv
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span role="img" aria-label="Flagge" className="text-xl">🇩🇪</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deutschkurs By Noman · Betreute Kurse: {batches.length} Gruppen · {admissions.length} eingeschriebene Studenten
            </p>
          </div>
        </div>

        {/* Quick Teacher Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>KI-Prüfungsgenerator</span>
          </button>

          <button
            type="button"
            onClick={() => setIsGoetheModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Folder className="w-4 h-4 text-amber-500" />
            <span>Goethe-Ordner</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'batches'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Meine Kurse & Klassen ({batches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Anwesenheit erfassen</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Studenten & Beförderung ({admissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('exams')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'exams'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prüfungsbögen ({papers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'submissions'
                ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 font-bold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ergebnisse & Korrektur ({submissions.length})</span>
          </button>
        </nav>
      </div>

      {/* TAB 1: BATCHES & CLASSES */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {batches.map((batch) => {
              const count = admissions.filter((a) => a.batchId === batch.id).length;
              return (
                <div
                  key={batch.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950">
                        GER {batch.level}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                        {batch.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      {batch.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {batch.notes || 'Regulärer Kursverband mit Goethe-Prüfungsvorbereitung.'}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Zeiten:</span>
                        <span className="font-semibold">{batch.schedule}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Raum/Link:</span>
                        <span className="font-semibold truncate max-w-[150px]">{batch.roomOrLink}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Teilnehmer:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {count} / {batch.capacity} Plätze
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBatchId(batch.id);
                        setActiveTab('attendance');
                      }}
                      className="flex-1 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Anwesenheit prüfen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStudentLevelFilter(batch.level);
                        setActiveTab('students');
                      }}
                      className="py-2 px-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold rounded-xl transition-colors"
                      title="Teilnehmerliste ansehen"
                    >
                      <Users className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE MANAGEMENT */}
      {activeTab === 'attendance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Anwesenheit erfassen & archivieren
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Wählen Sie einen Kursverband und das Datum aus, um die Anwesenheit der Schüler festzuhalten.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAttendance}
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Anwesenheit speichern</span>
            </button>
          </div>

          {/* Filter Bar: Batch selection & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Kurs / Gruppe:
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (GER {b.level})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Datum der Unterrichtseinheit:
              </label>
              <input
                type="date"
                value={attDate}
                onChange={(e) => setAttDate(e.target.value)}
                className="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Unterrichtsthema / Modul:
              </label>
              <input
                type="text"
                value={attTopic}
                onChange={(e) => setAttTopic(e.target.value)}
                placeholder="z. B. Konjunktiv II & B1 Sprachbausteine"
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Student attendance roster table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Student-ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Niveau</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3">Dozentennotiz</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentsInBatch.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      Keine eingeschriebenen Studenten in diesem Kursverband gefunden.
                    </td>
                  </tr>
                ) : (
                  studentsInBatch.map((st) => {
                    const currentStatus = currentAttendanceEntries[st.studentId]?.status || 'present';
                    const currentNote = currentAttendanceEntries[st.studentId]?.note || '';

                    return (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {st.studentId}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{st.name}</span>
                          <span className="text-[11px] text-slate-400">{st.email}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-900 text-white">
                            {st.currentLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(st.studentId, 'present')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                currentStatus === 'present'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              ✓ Anwesend
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(st.studentId, 'absent')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                currentStatus === 'absent'
                                  ? 'bg-red-600 text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              ✗ Abwesend
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(st.studentId, 'late')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                currentStatus === 'late'
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              ⏱ Verspätet
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusToggle(st.studentId, 'excused')}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                                currentStatus === 'excused'
                                  ? 'bg-sky-600 text-white shadow-2xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              Entschuldigt
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={currentNote}
                            onChange={(e) => handleNoteChange(st.studentId, e.target.value)}
                            placeholder="Notiz (z.B. aktiv mitgearbeitet)..."
                            className="w-full text-xs py-1 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          />
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

      {/* TAB 3: STUDENTS & PROMOTION */}
      {activeTab === 'students' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Studentenverwaltung & GER-Niveaubeförderung
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prüfen Sie den Lernfortschritt Ihrer Schüler und befördern Sie erfolgreiche Absolventen auf das nächste GER-Niveau.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Student suchen..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <select
                value={studentLevelFilter}
                onChange={(e) => setStudentLevelFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="all">Alle Niveaus (A1–C2)</option>
                {levels.map((l) => (
                  <option key={l} value={l}>GER {l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Student-ID</th>
                  <th className="py-3 px-3">Name & Kontakt</th>
                  <th className="py-3 px-3">Aktuelles Niveau</th>
                  <th className="py-3 px-3">Zielniveau</th>
                  <th className="py-3 px-3">Kurs / Batch</th>
                  <th className="py-3 px-3">Anwesenheitsquote</th>
                  <th className="py-3 px-3 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((st) => {
                  const attStats = storageService.getStudentAttendanceStats(st.studentId);
                  return (
                    <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {st.studentId}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{st.name}</span>
                        <span className="text-[11px] text-slate-400">{st.email} · {st.phone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-2xs">
                          GER {st.currentLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        GER {st.targetLevel}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {st.batchName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full ${
                                attStats.percentage >= 80 ? 'bg-emerald-500' : attStats.percentage >= 60 ? 'bg-amber-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${attStats.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {attStats.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setStudentToPromote(st);
                            const nextLvlIndex = levels.indexOf(st.currentLevel) + 1;
                            setPromotionTargetLevel(levels[nextLvlIndex] || st.currentLevel);
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-lg transition-all shadow-2xs flex items-center gap-1 ml-auto"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Befördern</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EXAM PAPERS & 1-CLICK GENERATOR */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Prüfungskatalog & AI-Paper Generator
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Erstellen Sie originalgetreue Prüfungen für Niveaustufen A1 bis C2 in Grammatik, Lesen, Hören, Schreiben, Sprechen & Wortschatz.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Generator</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPaper(null);
                    setIsCreatingPaper(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Manuelle Prüfung</span>
                </button>
              </div>
            </div>

            {/* Quick 1-Click Generator Bar */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 border border-emerald-200 dark:border-slate-700 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  1-Klick Schnellgenerator (A1–C2 Goethe-Muster & Grammatik):
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap text-xs">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 mr-1">Goethe-Muster:</span>
                  {levels.map((lvl) => (
                    <button
                      key={`g-${lvl}`}
                      type="button"
                      onClick={() => handleQuickGenerate(lvl, 'goethe')}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-bold rounded-lg border border-emerald-300 dark:border-slate-700 shadow-2xs transition-colors"
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 mr-1">Grammatik:</span>
                  {levels.map((lvl) => (
                    <button
                      key={`gr-${lvl}`}
                      type="button"
                      onClick={() => handleQuickGenerate(lvl, 'grammatik')}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-900 hover:text-white font-bold rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors"
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Papers List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Prüfungstitel</th>
                    <th className="py-3 px-3">Niveau & Modul</th>
                    <th className="py-3 px-3">Prüfungsschlüssel</th>
                    <th className="py-3 px-3">Dauer / Fragen</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPapers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white max-w-[250px]">
                        {p.title}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-900 text-white">
                            {p.level}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">{p.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <code className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-amber-400 border border-slate-200 dark:border-slate-700">
                          {p.key}
                        </code>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {p.durationMinutes} Min. · {p.questions?.length || 0} Fragen
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value as PaperStatus)}
                          className={`text-xs font-bold py-1 px-2 rounded-lg border bg-white dark:bg-slate-800 ${
                            p.status === 'live'
                              ? 'text-emerald-700 border-emerald-300'
                              : p.status === 'paused'
                              ? 'text-purple-700 border-purple-300'
                              : 'text-amber-700 border-amber-300'
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
                          <button
                            type="button"
                            onClick={() => setViewingPaper(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Vorschau"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPaper(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => examGenerator.downloadAnswerKey(p)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                            title="Lösungsschlüssel herunterladen"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaperToDelete(p)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            title="In Papierkorb"
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

      {/* TAB 5: SUBMISSIONS & GRADING */}
      {activeTab === 'submissions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Prüfungsergebnisse & Auswertung
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automatisch ausgewertete Prüfungen Ihrer Kandidaten mit 60% Bestehensregel.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Kandidat</th>
                  <th className="py-3 px-3">Prüfung & Schlüssel</th>
                  <th className="py-3 px-3">Niveau</th>
                  <th className="py-3 px-3">Ergebnis</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Abgegeben am</th>
                  <th className="py-3 px-3 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{sub.studentName}</span>
                      <span className="text-[11px] text-slate-400">{sub.studentEmail}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {sub.paperTitle} · <code className="font-mono text-[11px]">{sub.paperKey}</code>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-900 text-white">
                        {sub.paperLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {sub.score} / {sub.totalPoints} Pkt. ({sub.percentage}%)
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        sub.passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}>
                        {sub.passed ? 'BESTANDEN (≥60%)' : 'NICHT BESTANDEN'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(sub.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT PROMOTION MODAL */}
      {studentToPromote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Student befördern
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStudentToPromote(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePromoteStudentSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-0.5">Kandidat:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {studentToPromote.name} ({studentToPromote.studentId})
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold block mt-1">
                  Derzeitiges Niveau: GER {studentToPromote.currentLevel}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Neues GER-Niveau:
                </label>
                <select
                  value={promotionTargetLevel}
                  onChange={(e) => setPromotionTargetLevel(e.target.value as CEFRLevel)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      GER {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Prüfungsergebnis (% Score):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={promotionScore}
                  onChange={(e) => setPromotionScore(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dozenten-Begründung / Bemerkung:
                </label>
                <textarea
                  rows={2}
                  value={promotionRemarks}
                  onChange={(e) => setPromotionRemarks(e.target.value)}
                  placeholder="Hervorragende Leistung in Sprachbausteine & Grammatik..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStudentToPromote(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Jetzt befördern</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAPER EDITOR MODAL */}
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

      {/* PAPER VIEW MODAL */}
      {viewingPaper && (
        <PaperViewModal
          paper={viewingPaper}
          onClose={() => setViewingPaper(null)}
          onEdit={() => {
            setEditingPaper(viewingPaper);
            setViewingPaper(null);
          }}
          onStatusChange={(paperId, status) => handleUpdateStatus(paperId, status)}
        />
      )}

      {/* SUBMISSION DETAIL MODAL */}
      {selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          paper={papers.find((p) => p.id === selectedSubmission.paperId)}
          onClose={() => setSelectedSubmission(null)}
          onUpdated={() => {
            loadData();
            showToast('Ergebnis aktualisiert!', 'success');
          }}
        />
      )}

      {/* AI PAPER GENERATOR MODAL */}
      <AIPaperGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAdoptPaper={handleAdoptAiPaper}
        authorName={currentUser.name}
      />

      {/* GOETHE FOLDER MODAL */}
      <GoetheFolderModal
        isOpen={isGoetheModalOpen}
        files={goetheFiles}
        onClose={() => setIsGoetheModalOpen(false)}
        canUpload={true}
        onUploadFile={(newF) => {
          storageService.saveGoetheFile(newF);
          loadData();
          showToast(`Datei „${newF.title}“ erfolgreich in Goethe-Ordner geladen.`, 'success');
        }}
      />

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!paperToDelete}
        title="Prüfungsbogen in Papierkorb verschieben?"
        message={`Möchten Sie „${paperToDelete?.title}“ (${paperToDelete?.key}) wirklich in den Papierkorb verschieben?`}
        confirmLabel="In Papierkorb"
        isDestructive={true}
        onConfirm={confirmDeletePaper}
        onCancel={() => setPaperToDelete(null)}
      />
    </div>
  );
};
