import React, { useState } from 'react';
import { Batch, CEFRLevel, User } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useNotifications } from '../../context/NotificationContext';
import {
  Calendar,
  Plus,
  Trash2,
  Users,
  Clock,
  MapPin,
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface BatchesTabProps {
  batches: Batch[];
  teachers: User[];
  onDataRefresh: () => void;
  adminName: string;
}

export const BatchesTab: React.FC<BatchesTabProps> = ({
  batches,
  teachers,
  onDataRefresh,
  adminName,
}) => {
  const { showToast, addNotification } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New batch form state
  const [name, setName] = useState('');
  const [level, setLevel] = useState<CEFRLevel>('A1');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || 'usr-teacher-1');
  const [schedule, setSchedule] = useState('Mo–Do 09:00 – 11:30 Uhr');
  const [roomOrLink, setRoomOrLink] = useState('Präsenz Raum 101');
  const [capacity, setCapacity] = useState(20);
  const [notes, setNotes] = useState('');

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const teacherObj = teachers.find((t) => t.id === teacherId) || teachers[0];

    const newBatch: Batch = {
      id: 'batch-' + Date.now().toString(36),
      name: name.trim(),
      level,
      teacherId: teacherObj?.id || 'usr-teacher-1',
      teacherName: teacherObj?.name || 'Prof. Dr. Anna Lindemann',
      schedule,
      roomOrLink,
      capacity,
      enrolledCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 90).toISOString().split('T')[0],
      status: 'active',
      notes,
    };

    storageService.saveBatch(newBatch);
    onDataRefresh();
    setIsModalOpen(false);
    setName('');
    showToast(`✓ Kursgruppe „${newBatch.name}“ erfolgreich angelegt!`, 'success');
    addNotification({
      title: `Neuer Kurs angelegt: ${newBatch.name}`,
      message: `GER ${level} unter Leitung von ${newBatch.teacherName}.`,
      type: 'info',
      linkTab: 'batches',
    });
  };

  const handleDeleteBatch = (batch: Batch) => {
    storageService.deleteBatch(batch.id, adminName);
    onDataRefresh();
    showToast(`Kursgruppe „${batch.name}“ in den Papierkorb verschoben.`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Kurs- & Klassenverwaltung (A1–C2)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Erstellen Sie Kursverbände, teilen Sie Dozenten ein und weisen Sie Unterrichtszeiten und Räume zu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Neuen Kursverband anlegen</span>
          </button>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {batches.map((b) => (
            <div
              key={b.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-slate-900 text-white">
                    GER {b.level}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  {b.name}
                </h4>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {b.notes || 'Regulärer Deutschkurs mit Goethe-Zertifikats Vorbereitung.'}
                </p>

                <div className="space-y-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Dozent:</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{b.teacherName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Zeiten:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{b.schedule}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ort/Link:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{b.roomOrLink}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Kapazität:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{b.enrolledCount} / {b.capacity} Plätze</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDeleteBatch(b)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title="In Papierkorb verschieben"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE BATCH MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Neuen Kursverband anlegen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kursbezeichnung *:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z. B. Intensivkurs A2.1 Abendklasse"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    GER-Niveau:
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as CEFRLevel)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>GER {lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dozent:
                  </label>
                  <select
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Unterrichtszeiten:
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Mo–Do 09:00 – 11:30 Uhr"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Raum oder Zoom-Link:
                  </label>
                  <input
                    type="text"
                    value={roomOrLink}
                    onChange={(e) => setRoomOrLink(e.target.value)}
                    placeholder="Raum 102 / Zoom"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kapazität (Plätze):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Didaktische Hinweise:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Schwerpunkte, Lehrbuch, Prüfungsvorbereitung..."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Klasse anlegen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
