import React, { useState } from 'react';
import { GoethePruefungFile, CEFRLevel } from '../../types/exam';
import {
  Folder,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Search,
  X,
  ShieldCheck,
  BookOpen,
  Headphones,
  Award,
  Layers,
} from 'lucide-react';

interface GoetheFolderModalProps {
  isOpen: boolean;
  files: GoethePruefungFile[];
  onClose: () => void;
  onUploadFile?: (file: GoethePruefungFile) => void;
  canUpload?: boolean;
}

export const GoetheFolderModal: React.FC<GoetheFolderModalProps> = ({
  isOpen,
  files,
  onClose,
  onUploadFile,
  canUpload = false,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  // New file form state
  const [newTitle, setNewTitle] = useState('');
  const [newLevel, setNewLevel] = useState<CEFRLevel>('B1');
  const [newType, setNewType] = useState<GoethePruefungFile['type']>('Modelltest');
  const [newDesc, setNewDesc] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  if (!isOpen) return null;

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filtered = files.filter((f) => {
    const matchesLevel = selectedLevel === 'ALL' || f.level === selectedLevel;
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const file: GoethePruefungFile = {
      id: 'g-file-' + Date.now().toString(36),
      title: newTitle.trim(),
      level: newLevel,
      type: newType,
      description: newDesc.trim() || `Offizieller Goethe-Prüfungssatz für Niveau GER ${newLevel}.`,
      filename: `${newTitle.replace(/[\s\W]+/g, '_')}_${newLevel}.pdf`,
      filesize: `${(Math.random() * 3 + 2).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Dozententeam Deutschkurs By Noman',
      isAuthorized: true,
      contentSnippet: newSnippet.trim() || 'Beinhaltet Aufgaben zu Hören, Lesen, Schreiben und Mündlichem Ausdruck.',
      answerKeyAvailable: true,
      audioGuideAvailable: true,
    };

    onUploadFile?.(file);
    setShowUploadForm(false);
    setNewTitle('');
    setNewDesc('');
    setNewSnippet('');
  };

  const handleDownloadDoc = (file: GoethePruefungFile) => {
    const content = `
========================================================================
     GOETHE-PRÜFUNGEN ARCHIV · DEUTSCHKURS BY NOMAN 🇩🇪
========================================================================
Dokument:     ${file.title}
GER-Niveau:   ${file.level}
Modultyp:     ${file.type}
Dateiname:    ${file.filename} (${file.filesize})
Datum:        ${file.uploadDate}
Autorisiert:  Offizielle Goethe-Institut Musterprüfung

BESCHREIBUNG & VORGABEN:
${file.description}

TEXTAUSZUG / INHALTSSCHWERPUNKT:
${file.contentSnippet}

LÖSUNGSSCHLÜSSEL & AUDIOMATERIAL:
${file.answerKeyAvailable ? '✓ Vollständiger Lösungsschlüssel verfügbar' : ''}
${file.audioGuideAvailable ? '✓ Audio-Transkription und Leitfaden enthalten' : ''}

Bereitgestellt von: Deutschkurs By Noman Prüfungsarchiv
========================================================================
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename.replace(/\.pdf$/, '.txt');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full overflow-hidden my-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">
                  Goethe Prüfungen Archiv (A1 bis C2)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                  Offizielle Modellsätze
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Strukturierter Ordner für autorisierte Goethe-Institut Übungssätze und Probeprüfungen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canUpload && (
              <button
                type="button"
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{showUploadForm ? 'Abbrechen' : 'Dokument hinzufügen'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <form onSubmit={handleCreateFile} className="p-5 bg-amber-50/70 border-b border-amber-200 space-y-3">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-amber-700" />
              Neues Goethe-Prüfungsdokument in den Ordner hochladen
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titel z.B. Goethe-Zertifikat B2 Modellsatz 02"
                required
                className="sm:col-span-2 px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value as CEFRLevel)}
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-bold"
              >
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>GER {lvl}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Prüfungsbeschreibung & Anweisungen..."
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                value={newSnippet}
                onChange={(e) => setNewSnippet(e.target.value)}
                placeholder="Inhaltlicher Schwerpunkt (z.B. Hören & Lesen)..."
                className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
              >
                Prüfung im Archiv speichern
              </button>
            </div>
          </form>
        )}

        {/* Level Navigation & Search */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Level Tabs A1 - C2 */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedLevel('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Alle Niveaus
            </button>
            {levels.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-2xs font-black'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Prüfungen durchsuchen..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((file) => (
              <div
                key={file.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-700" />
                      GER {file.level}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {file.filesize}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {file.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {file.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-100">
                    <span className="font-semibold text-slate-800">Inhalt: </span>
                    {file.contentSnippet}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Autorisiert</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(file)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Herunterladen</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Folder className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">Keine Prüfungsbögen für dieses Niveau gefunden.</p>
              <p className="text-[11px] text-slate-400">Bitte wählen Sie ein anderes Niveau oder leeren Sie die Suche.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600" />
            Deutschkurs By Noman · Offizielles Goethe-Zertifikat Trainingsarchiv
          </span>
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
