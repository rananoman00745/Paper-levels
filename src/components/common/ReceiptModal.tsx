import React, { useRef } from 'react';
import { PaymentReceipt } from '../../types/exam';
import {
  Printer,
  Download,
  X,
  CheckCircle2,
  Calendar,
  CreditCard,
  Hash,
  Building,
  User,
  ShieldCheck,
} from 'lucide-react';

interface ReceiptModalProps {
  isOpen: boolean;
  receipt: PaymentReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, receipt, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const content = `
========================================================================
             OFFIZIELLE ZAHLUNGSQUITTUNG / PAYMENT RECEIPT
                     DEUTSCHKURS BY NOMAN 🇩🇪
========================================================================
Quittungsnummer:   ${receipt.receiptNumber}
Datum:             ${receipt.transactionDate}
Status:            BEZAHLT & VERBÜCHT

TEILNEHMER / STUDENT:
Name:              ${receipt.studentName}
Studenten-ID:      ${receipt.studentId}
E-Mail:            ${receipt.studentEmail}

KURS & NIVEAU:
Kurs / Batch:      ${receipt.batchName}
GER-Niveau:        ${receipt.level}

ZAHLUNGSDETAILS:
Zahlungsart:       ${receipt.paymentMethod}
Bezahlter Betrag:  €${receipt.amountPaid.toFixed(2)}
Gesamtkursgebühr:  €${receipt.totalFee.toFixed(2)}
Verbleibender Restbetrag: €${receipt.balanceRemaining.toFixed(2)}

Ausgestellt von:   ${receipt.recordedBy}
Institut:          Deutschkurs By Noman
Offizielles Zentrum für Deutsche Sprachkurse & Prüfungen (A1–C2)
========================================================================
`.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Quittung_${receipt.receiptNumber}_${receipt.studentName.replace(/\s+/g, '_')}.txt`;
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
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <div className="flex flex-col h-4 w-6 shrink-0 rounded-xs overflow-hidden">
              <span className="h-[33.33%] w-full bg-[#000000]" />
              <span className="h-[33.33%] w-full bg-[#DD0000]" />
              <span className="h-[33.33%] w-full bg-[#FFCE00]" />
            </div>
            <span className="text-xs font-bold tracking-wide">
              Deutschkurs By Noman · Zahlungsquittung
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              title="Quittung drucken"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Drucken / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Textdatei</span>
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

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 sm:p-8 bg-slate-50 text-slate-900 select-none print:m-0 print:p-6">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
            
            {/* Stamp Badge */}
            <div className="absolute right-4 top-4 rotate-12 border-2 border-emerald-600 rounded-lg px-2.5 py-1 text-[11px] font-black tracking-widest text-emerald-700 bg-emerald-50/80">
              ✓ BEZAHLT / PAID
            </div>

            {/* Institute Brand */}
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex flex-col h-5 w-7 shrink-0 rounded overflow-hidden shadow-xs ring-1 ring-slate-300">
                  <span className="h-[33.33%] w-full bg-[#000000]" />
                  <span className="h-[33.33%] w-full bg-[#DD0000]" />
                  <span className="h-[33.33%] w-full bg-[#FFCE00]" />
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight font-serif">
                  DEUTSCHKURS BY NOMAN 🇩🇪
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Offizielles Sprachinstitut für Deutschkurse & Prüfungen (A1 bis C2)
              </p>
              <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                <span>Quittung: {receipt.receiptNumber}</span>
                <span>·</span>
                <span>Datum: {receipt.transactionDate}</span>
              </div>
            </div>

            {/* Student & Course Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Teilnehmer</span>
                <span className="font-bold text-slate-900 block text-sm">{receipt.studentName}</span>
                <span className="text-slate-500 font-mono text-[11px]">{receipt.studentId}</span>
                <span className="text-slate-400 block text-[11px]">{receipt.studentEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Kurs & Niveaustufe</span>
                <span className="font-bold text-slate-900 block text-sm">{receipt.batchName}</span>
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px] border border-amber-300">
                  GER Niveau {receipt.level}
                </span>
              </div>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Gesamtkursgebühr:</span>
                <span className="font-mono font-semibold">€{receipt.totalFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Zahlungsmethode:</span>
                <span className="font-semibold text-slate-800">{receipt.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-bold pt-2 border-t border-slate-200 text-sm">
                <span>Geleisteter Zahlungsbetrag:</span>
                <span className="text-base font-mono">€{receipt.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                <span>Verbleibende Restsumme:</span>
                <span className="font-mono font-semibold text-slate-800">
                  €{receipt.balanceRemaining.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Footer with Verification Note */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ausgestellt von: {receipt.recordedBy}</span>
              </div>
              <span className="font-mono">Deutschkurs By Noman · Kassenstelle</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
