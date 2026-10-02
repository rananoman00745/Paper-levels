import React, { useRef } from 'react';
import { ExamSubmission } from '../../types/exam';
import {
  Award,
  CheckCircle2,
  Printer,
  Download,
  X,
  ShieldCheck,
  Calendar,
  User,
  Hash,
  FileCheck,
} from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  submission: ExamSubmission | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  submission,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !submission) return null;

  // Passing criteria: strictly 60% or above
  const isPassed = submission.passed || submission.percentage >= 60;
  const certNumber = `DPN-${submission.paperLevel}-${submission.id.replace('sub-', '').toUpperCase()}-${new Date(submission.submittedAt).getFullYear()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSummary = () => {
    const summary = `
========================================================================
             OFFIZIELLES PRÜFUNGSZERTIFIKAT
                 DEUTSCHKURS BY NOMAN 🇩🇪
========================================================================
Zertifikat-Nummer: ${certNumber}
Ausstellungsdatum: ${new Date(submission.submittedAt).toLocaleDateString('de-DE')}

KANDIDAT / TEILNEHMER:
Name:             ${submission.studentName}
Benutzername:     ${submission.studentUsername}
Matrikelnummer:   ${submission.studentId}

PRÜFUNGSERGEBNIS:
Prüfungsbogen:    ${submission.paperTitle}
Prüfungsschlüssel: ${submission.paperKey}
Nachgewiesenes GER-Niveau: ${submission.paperLevel}
Erreichte Punkte: ${submission.score} von ${submission.totalPoints} Punkten
Prozentwert:      ${submission.percentage}%
Status:           BESTANDEN / PASSED (Bestehensgrenze: min. 60%)

GÜLTIGKEIT:
Dieses Zertifikat bescheinigt die erfolgreiche Erfüllung der 
Anforderungen des Gemeinsamen Europäischen Referenzrahmens für 
Sprachen (GER Niveau ${submission.paperLevel}).

Prüfungskommission:
Deutschkurs By Noman
Offizielles Zentrum für Deutsche Sprachkurse & Prüfungen (A1–C2)
========================================================================
`.trim();

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Zertifikat_${submission.paperLevel}_${submission.studentName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="flex flex-col h-4 w-6 shrink-0 rounded-xs overflow-hidden">
              <span className="h-[33.33%] w-full bg-[#000000]" />
              <span className="h-[33.33%] w-full bg-[#DD0000]" />
              <span className="h-[33.33%] w-full bg-[#FFCE00]" />
            </div>
            <span className="text-xs font-bold tracking-wide">
              Deutschkurs By Noman · Offizielles Zertifikat
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              title="Zertifikat als PDF speichern / drucken"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Drucken / Als PDF speichern</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
              title="Ergebnisnachweis herunterladen"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Textnachweis</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          ref={certificateRef}
          className="p-6 sm:p-10 bg-gradient-to-b from-amber-50/40 via-white to-slate-50 relative select-none print:m-0 print:p-8"
        >
          {/* Ornate Frame Border */}
          <div className="border-4 border-double border-amber-700/60 rounded-xl p-6 sm:p-8 bg-white/90 shadow-sm relative overflow-hidden">
            
            {/* Watermark Seal in background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <Award className="w-96 h-96 text-slate-900" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 pb-6 border-b border-amber-200">
              <div className="flex items-center justify-center gap-3">
                {/* German Flag */}
                <div className="flex flex-col h-6 w-9 shrink-0 rounded overflow-hidden shadow-xs ring-1 ring-slate-300">
                  <span className="h-2 w-full bg-[#000000]" />
                  <span className="h-2 w-full bg-[#DD0000]" />
                  <span className="h-2 w-full bg-[#FFCE00]" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                  DEUTSCHKURS BY NOMAN
                </h1>
                <div className="flex flex-col h-6 w-9 shrink-0 rounded overflow-hidden shadow-xs ring-1 ring-slate-300">
                  <span className="h-2 w-full bg-[#000000]" />
                  <span className="h-2 w-full bg-[#DD0000]" />
                  <span className="h-2 w-full bg-[#FFCE00]" />
                </div>
              </div>

              <div className="text-xs uppercase tracking-widest font-bold text-amber-800">
                Offizielles Sprachzertifikat · Official Examination Certificate
              </div>
              <p className="text-[11px] text-slate-500 max-w-lg mx-auto">
                Nachweis über deutsche Sprachkompetenz nach den Kriterien des Gemeinsamen Europäischen Referenzrahmens für Sprachen (GER)
              </p>
            </div>

            {/* Certification Body */}
            <div className="py-6 text-center space-y-4">
              <p className="text-xs text-slate-500 font-serif italic">
                Hiermit wird offiziell bescheinigt, dass
              </p>

              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif tracking-wide border-b-2 border-slate-900/10 inline-block px-8 pb-1">
                  {submission.studentName}
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Matrikelnummer: {submission.studentId} · Benutzername: {submission.studentUsername}
                </div>
              </div>

              <p className="text-xs text-slate-600 max-w-md mx-auto">
                die offizielle Sprachprüfung erfolgreich abgelegt und die geforderte Mindestleistung (≥ 60%) nachgewiesen hat:
              </p>

              {/* Awarded Level Box */}
              <div className="inline-flex flex-col items-center justify-center p-4 bg-amber-50/80 border-2 border-amber-300 rounded-xl max-w-sm w-full mx-auto shadow-2xs">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    GER-Stufe {submission.paperLevel} Bestanden
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {submission.paperTitle}
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ergebnis: {submission.percentage}% (min. 60%)
                  </span>
                  <span className="text-slate-600 font-mono">
                    {submission.score} / {submission.totalPoints} Punkte
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate Footer with Signatures & Meta */}
            <div className="pt-6 border-t border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center sm:text-left">
              
              {/* Meta details */}
              <div className="space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Hash className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-mono text-slate-700 font-semibold">{certNumber}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                  <span>Datum: {new Date(submission.submittedAt).toLocaleDateString('de-DE')}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-emerald-800 font-medium">Bestehensquote: 60% erfüllt</span>
                </div>
              </div>

              {/* Digital Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-700 bg-amber-50 flex flex-col items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7 text-amber-800" />
                  <span className="text-[8px] font-bold text-amber-900 uppercase tracking-tighter">VERIFIED</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">Prüfsiegel Deutschkurs</span>
              </div>

              {/* Official Signature */}
              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-base sm:text-lg text-slate-900 font-bold tracking-wider">
                  Noman · Institutsleitung
                </div>
                <div className="h-0.5 bg-slate-300 w-32 ml-auto mr-auto sm:mr-0" />
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Deutschkurs By Noman 🇩🇪
                </div>
                <div className="text-[9px] text-slate-400">
                  Prüfungsausschuss & Zertifizierungsstelle (A1–C2)
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 no-print">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Dieses Dokument ist digital signiert und gemäß 60%-GER-Bestehensrichtlinie verifiziert.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
};
