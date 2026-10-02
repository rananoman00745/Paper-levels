import React, { useState } from 'react';
import { TrashItem } from '../../types/exam';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
  FileText,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';

interface TrashBinModalProps {
  isOpen: boolean;
  trashItems: TrashItem[];
  onClose: () => void;
  onRestore: (trashId: string) => void;
  onPermanentDelete: (trashId: string) => void;
  onEmptyTrash: () => void;
}

export const TrashBinModal: React.FC<TrashBinModalProps> = ({
  isOpen,
  trashItems,
  onClose,
  onRestore,
  onPermanentDelete,
  onEmptyTrash,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'paper' | 'batch' | 'file'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = trashItems.filter((item) => {
    const matchesFilter = filterType === 'all' || item.itemType === filterType;
    const matchesSearch = item.itemTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-4 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Papierkorb / Trash Bin
              </h3>
              <p className="text-xs text-slate-400">
                Gelöschte Prüfungsbögen, Kurse & Dateien wiederherstellen oder unwiderruflich entfernen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trashItems.length > 0 && (
              <button
                type="button"
                onClick={onEmptyTrash}
                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                title="Papierkorb vollständig leeren"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Alles leeren</span>
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

        {/* Filter & Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-lg text-xs font-semibold w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Alle ({trashItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('paper')}
              className={`px-3 py-1 rounded-md transition-all ${
                filterType === 'paper' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Prüfungsbögen
            </button>
            <button
              type="button"
              onClick={() => setFilterType('batch')}
              className={`px-3 py-1 rounded-md transition-all ${
                filterType === 'batch' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Kurse / Batches
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Im Papierkorb suchen..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Trash2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">Der Papierkorb ist leer.</p>
              <p className="text-[11px] text-slate-400">Keine gelöschten Elemente vorhanden.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                    {item.itemType === 'paper' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Users className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.itemTitle}
                      </span>
                      {item.itemLevel && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-700">
                          GER {item.itemLevel}
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {item.itemType}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Gelöscht von: <span className="font-medium text-slate-600">{item.deletedBy}</span> · {new Date(item.deletedAt).toLocaleString('de-DE')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => onRestore(item.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Element wiederherstellen"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Wiederherstellen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onPermanentDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Unwiderruflich löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
          <span>{filtered.length} Elemente im Papierkorb</span>
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
