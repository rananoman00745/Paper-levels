import React, { useState } from 'react';
import { StudentAdmission, CEFRLevel, Batch } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useNotifications } from '../../context/NotificationContext';
import {
  Users,
  UserPlus,
  Search,
  TrendingUp,
  X,
  Check,
  Award,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface AdmissionsTabProps {
  admissions: StudentAdmission[];
  batches: Batch[];
  onDataRefresh: () => void;
  adminName: string;
}

export const AdmissionsTab: React.FC<AdmissionsTabProps> = ({
  admissions,
  batches,
  onDataRefresh,
  adminName,
}) => {
  const { showToast, addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  // New Student Admission Modal State
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnicOrPassport, setCnicOrPassport] = useState('');
  const [dob, setDob] = useState('2001-01-01');
  const [currentLevel, setCurrentLevel] = useState<CEFRLevel>('A1');
  const [targetLevel, setTargetLevel] = useState<CEFRLevel>('B1');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [feeAgreed, setFeeAgreed] = useState(350);

  // Student Promotion Modal State
  const [studentToPromote, setStudentToPromote] = useState<StudentAdmission | null>(null);
  const [promoTargetLevel, setPromoTargetLevel] = useState<CEFRLevel>('B1');
  const [promoScore, setPromoScore] = useState<number>(85);
  const [promoRemarks, setPromoRemarks] = useState('');

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filtered = admissions.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(search.toLowerCase()) ||
      st.studentId.toLowerCase().includes(search.toLowerCase()) ||
      st.email.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || st.currentLevel === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const studentId = `DK-2026-${Math.floor(100 + Math.random() * 900)}`;
    const batchObj = batches.find((b) => b.id === selectedBatchId) || batches[0];

    const newAdmission: StudentAdmission = {
      id: 'adm-' + Date.now().toString(36),
      studentId,
      username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || '+49 150 0000000',
      cnicOrPassport: cnicOrPassport.trim() || 'Pending',
      dob,
      currentLevel,
      targetLevel,
      batchId: batchObj?.id || 'batch-a1-morn',
      batchName: batchObj?.name || 'Deutsch Intensivkurs',
      admissionDate: new Date().toISOString().split('T')[0],
      feeAgreed,
      status: 'active',
      promotionHistory: [],
    };

    storageService.saveAdmission(newAdmission);

    // Also create initial fee record
    storageService.saveFeeRecord({
      id: 'fee-' + Date.now().toString(36),
      studentId,
      studentName: newAdmission.name,
      studentEmail: newAdmission.email,
      batchId: newAdmission.batchId,
      batchName: newAdmission.batchName,
      level: currentLevel,
      totalFee: feeAgreed,
      discount: 0,
      netFee: feeAgreed,
      paidAmount: 0,
      balanceDue: feeAgreed,
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      status: 'pending',
      transactions: [],
      updatedAt: new Date().toISOString(),
    });

    onDataRefresh();
    setIsEnrollModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    showToast(`✓ Neuer Student „${newAdmission.name}“ (${studentId}) erfolgreich aufgenommen!`, 'success');
    addNotification({
      title: `Neuer Student aufgenommen: ${newAdmission.name}`,
      message: `Eingeschrieben für Niveau GER ${currentLevel} in ${newAdmission.batchName}.`,
      type: 'info',
      linkTab: 'admissions',
    });
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToPromote) return;

    const success = storageService.promoteStudent(
      studentToPromote.studentId,
      promoTargetLevel,
      adminName,
      promoRemarks || `Offizielle Niveaubeförderung nach bestandener Prüfung.`,
      promoScore
    );

    if (success) {
      showToast(`🎓 ${studentToPromote.name} wurde erfolgreich auf GER ${promoTargetLevel} befördert!`, 'success');
      addNotification({
        title: `Student befördert: ${studentToPromote.name}`,
        message: `Erfolgreicher Aufstieg von GER ${studentToPromote.currentLevel} nach ${promoTargetLevel}.`,
        type: 'success',
        linkTab: 'admissions',
      });
      onDataRefresh();
      setStudentToPromote(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Studentenaufnahme & Niveaustufen-Management (A1–C2)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verwalten Sie alle eingeschriebenen Teilnehmer, weisen Sie Kurse zu und befördern Sie Absolventen.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Neuen Student aufnehmen</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, ID oder E-Mail suchen..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 whitespace-nowrap">Niveau filtern:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="py-1.5 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Alle Niveaustufen (A1–C2)</option>
              {levels.map((l) => (
                <option key={l} value={l}>GER {l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Student-ID</th>
                <th className="py-3 px-3">Name & Kontakt</th>
                <th className="py-3 px-3">Niveau (Aktuell / Ziel)</th>
                <th className="py-3 px-3">Zugewiesener Kurs</th>
                <th className="py-3 px-3">Gebühr vereinbart</th>
                <th className="py-3 px-3">Anwesenheit</th>
                <th className="py-3 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((st) => {
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
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded font-black text-[10px] bg-emerald-600 text-white">
                          GER {st.currentLevel}
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          GER {st.targetLevel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {st.batchName}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      €{st.feeAgreed}.00
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${attStats.percentage >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {attStats.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setStudentToPromote(st);
                          const nextIdx = levels.indexOf(st.currentLevel) + 1;
                          setPromoTargetLevel(levels[nextIdx] || st.currentLevel);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1 ml-auto shadow-2xs"
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

      {/* ENROLLMENT MODAL */}
      {isEnrollModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Neuen Studenten einschreiben
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEnrollModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Vollständiger Name *:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z. B. Max Mustermann"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    E-Mail-Adresse *:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@beispiel.de"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Telefonnummer:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+49 170 1234567"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Pass / CNIC Nummer:
                  </label>
                  <input
                    type="text"
                    value={cnicOrPassport}
                    onChange={(e) => setCnicOrPassport(e.target.value)}
                    placeholder="P94821034"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Einstufung (Aktuelles Niveau):
                  </label>
                  <select
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value as CEFRLevel)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>GER {lvl}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Zielniveau:
                  </label>
                  <select
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value as CEFRLevel)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>GER {lvl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kurs / Batch zuweisen:
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  >
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} (GER {b.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Vereinbarte Kursgebühr (€):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={feeAgreed}
                    onChange={(e) => setFeeAgreed(Number(e.target.value))}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Jetzt aufnehmen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROMOTION MODAL */}
      {studentToPromote && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
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

            <form onSubmit={handlePromoteSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-0.5">Teilnehmer:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {studentToPromote.name} ({studentToPromote.studentId})
                </span>
                <span className="text-emerald-600 font-bold block mt-1">
                  Aktuelles Niveau: GER {studentToPromote.currentLevel}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Neues GER-Niveau:
                </label>
                <select
                  value={promoTargetLevel}
                  onChange={(e) => setPromoTargetLevel(e.target.value as CEFRLevel)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>GER {lvl}</option>
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
                  value={promoScore}
                  onChange={(e) => setPromoScore(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Begründung / Prüfungszertifikat-Notiz:
                </label>
                <textarea
                  rows={2}
                  value={promoRemarks}
                  onChange={(e) => setPromoRemarks(e.target.value)}
                  placeholder="Erfolgreich Goethe-Musterprüfung mit 85% absolviert."
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStudentToPromote(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Jetzt befördern</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
