import React, { useState, useEffect } from 'react';
import { Batch, StudentAdmission, AttendanceSession } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useNotifications } from '../../context/NotificationContext';
import {
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  Search,
} from 'lucide-react';

interface AttendanceTabProps {
  batches: Batch[];
  admissions: StudentAdmission[];
  attendanceSessions: AttendanceSession[];
  onDataRefresh: () => void;
  adminName: string;
}

export const AttendanceTab: React.FC<AttendanceTabProps> = ({
  batches,
  admissions,
  attendanceSessions,
  onDataRefresh,
  adminName,
}) => {
  const { showToast, addNotification } = useNotifications();
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [entries, setEntries] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }>>({});

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];
  const studentsInBatch = admissions.filter((a) => !activeBatch || a.batchId === activeBatch.id || a.currentLevel === activeBatch?.level);

  useEffect(() => {
    if (!activeBatch) return;

    const existing = attendanceSessions.find((s) => s.batchId === activeBatch.id && s.date === date);
    const map: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; note: string }> = {};

    studentsInBatch.forEach((st) => {
      const match = existing?.entries.find((e) => e.studentId === st.studentId);
      map[st.studentId] = {
        status: match ? match.status : 'present',
        note: match?.note || '',
      };
    });

    setEntries(map);
    if (existing?.topicCovered) {
      setTopic(existing.topicCovered);
    }
  }, [selectedBatchId, date, attendanceSessions.length]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!activeBatch) return;

    const entryList = studentsInBatch.map((st) => ({
      studentId: st.studentId,
      studentName: st.name,
      status: entries[st.studentId]?.status || 'present',
      note: entries[st.studentId]?.note || '',
    }));

    const session: AttendanceSession = {
      id: `att-${activeBatch.id}-${date}`,
      batchId: activeBatch.id,
      batchName: activeBatch.name,
      date,
      markedBy: adminName,
      markedByRole: 'admin',
      topicCovered: topic,
      entries: entryList,
      createdAt: new Date().toISOString(),
    };

    storageService.saveAttendanceSession(session);
    onDataRefresh();

    showToast(`✓ Anwesenheit für „${activeBatch.name}“ (${date}) erfolgreich erfasst!`, 'success');
    addNotification({
      title: `Anwesenheitsliste gespeichert: ${activeBatch.name}`,
      message: `${entryList.filter((e) => e.status === 'present').length} von ${entryList.length} anwesend am ${date}.`,
      type: 'attendance',
      linkTab: 'attendance',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              <span>Zentrales Anwesenheitsregister</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Erfassen und überwachen Sie die Anwesenheit der Teilnehmer über alle Kurse hinweg.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveAttendance}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 self-start sm:self-auto transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Anwesenheit speichern</span>
          </button>
        </div>

        {/* Batch & Date Picker Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Kurs / Batch wählen:
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
              Unterrichtsdatum:
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Thema der Unterrichtsstunde:
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="z. B. Passiv mit Modalverben & B2 Textanalyse"
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Student-ID</th>
                <th className="py-3 px-3">Name</th>
                <th className="py-3 px-3">Niveau</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3">Notiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentsInBatch.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    Keine Teilnehmer in dieser Gruppe eingetragen.
                  </td>
                </tr>
              ) : (
                studentsInBatch.map((st) => {
                  const currentStatus = entries[st.studentId]?.status || 'present';
                  const currentNote = entries[st.studentId]?.note || '';

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
                          GER {st.currentLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st.studentId, 'present')}
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
                            onClick={() => handleStatusChange(st.studentId, 'absent')}
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
                            onClick={() => handleStatusChange(st.studentId, 'late')}
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
                            onClick={() => handleStatusChange(st.studentId, 'excused')}
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
                          placeholder="Bemerkung..."
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
    </div>
  );
};
