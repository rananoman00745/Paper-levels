import React, { useState } from 'react';
import { FeeRecord, PaymentReceipt } from '../../types/exam';
import { storageService } from '../../services/storage';
import { useNotifications } from '../../context/NotificationContext';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  CreditCard,
  Printer,
  Plus,
  Search,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';

interface FeesTabProps {
  fees: FeeRecord[];
  onDataRefresh: () => void;
  adminName: string;
}

export const FeesTab: React.FC<FeesTabProps> = ({
  fees,
  onDataRefresh,
  adminName,
}) => {
  const { showToast, addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'pending'>('all');

  // Payment modal state
  const [feeToPay, setFeeToPay] = useState<FeeRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Card' | 'EasyPaisa/JazzCash'>('Bank Transfer');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Receipt Modal state
  const [receiptToShow, setReceiptToShow] = useState<PaymentReceipt | null>(null);

  const filtered = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(search.toLowerCase()) ||
      f.studentId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeToPay || paymentAmount <= 0) return;

    const receipt = storageService.recordPayment(
      feeToPay.id,
      paymentAmount,
      paymentMethod,
      adminName,
      paymentNotes || 'Reguläre Kursgebührenzahlung'
    );

    onDataRefresh();
    setFeeToPay(null);

    if (receipt) {
      showToast(`✓ Zahlung von €${paymentAmount}.00 für ${feeToPay.studentName} erfolgreich verbucht!`, 'success');
      addNotification({
        title: `Zahlung verbucht: ${feeToPay.studentName}`,
        message: `Betrag: €${paymentAmount}.00 (${paymentMethod}). Quittung: ${receipt.receiptNumber}`,
        type: 'fee',
        linkTab: 'fees',
      });
      setReceiptToShow(receipt);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Kursgebühren & Zahlungsverwaltung</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verfolgen Sie offene Posten, verbuchen Sie Teilzahlungen und drucken Sie offizielle Quittungen aus.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Student oder ID suchen..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Status filtern:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">Alle Status</option>
              <option value="paid">Bezahlt</option>
              <option value="partial">Teilweise bezahlt</option>
              <option value="pending">Ausstehend</option>
            </select>
          </div>
        </div>

        {/* Fees Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3">Student</th>
                <th className="py-3 px-3">Kurs & Niveau</th>
                <th className="py-3 px-3">Gebühr gesamt</th>
                <th className="py-3 px-3">Bezahlt</th>
                <th className="py-3 px-3">Offener Restbetrag</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 dark:text-white block">{f.studentName}</span>
                    <span className="text-[11px] font-mono text-slate-400">{f.studentId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {f.batchName} · <span className="font-bold">GER {f.level}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    €{f.totalFee}.00
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                    €{f.paidAmount}.00
                  </td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={f.balanceDue > 0 ? 'text-amber-600' : 'text-slate-400'}>
                      €{f.balanceDue}.00
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      f.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : f.status === 'partial'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {f.status === 'paid' ? 'BEZAHLT' : f.status === 'partial' ? 'TEILZAHLUNG' : 'OFFEN'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setFeeToPay(f);
                          setPaymentAmount(f.balanceDue > 0 ? f.balanceDue : 50);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors shadow-2xs"
                      >
                        + Zahlung
                      </button>

                      {f.transactions && f.transactions.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const lastTx = f.transactions[0];
                            const receipt: PaymentReceipt = {
                              receiptNumber: lastTx.receiptNumber,
                              studentId: f.studentId,
                              studentName: f.studentName,
                              studentEmail: f.studentEmail,
                              batchName: f.batchName,
                              level: f.level,
                              transactionDate: lastTx.date,
                              amountPaid: lastTx.amount,
                              totalFee: f.netFee,
                              balanceRemaining: f.balanceDue,
                              paymentMethod: lastTx.paymentMethod,
                              recordedBy: lastTx.recordedBy,
                              instituteTitle: 'Deutschkurs By Noman',
                              note: lastTx.notes,
                            };
                            setReceiptToShow(receipt);
                          }}
                          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Letzte Quittung anzeigen"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {feeToPay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Zahlung verbuchen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFeeToPay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block mb-0.5">Teilnehmer:</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {feeToPay.studentName} ({feeToPay.studentId})
                </span>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Offener Betrag:</span>
                  <span className="font-bold text-amber-600 font-mono text-sm">€{feeToPay.balanceDue}.00</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Eingezahlter Betrag (€) *:
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Zahlungsart:
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Cash">Barzahlung (Cash)</option>
                  <option value="Bank Transfer">Banküberweisung</option>
                  <option value="Card">Kredit- / Debitkarte</option>
                  <option value="EasyPaisa/JazzCash">EasyPaisa / JazzCash</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Verwendungszweck / Quittungsnotiz:
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="z. B. Rate 1 für Kurs B1"
                  className="w-full py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setFeeToPay(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Zahlung verbuchen & Quittung generieren</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      <ReceiptModal
        isOpen={Boolean(receiptToShow)}
        receipt={receiptToShow}
        onClose={() => setReceiptToShow(null)}
      />
    </div>
  );
};
