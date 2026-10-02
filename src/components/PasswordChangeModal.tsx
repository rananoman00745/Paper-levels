import React, { useState } from 'react';
import { User } from '../types/exam';
import { verifyPassword, evaluatePasswordStrength } from '../utils/crypto';
import { storageService } from '../services/storage';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, ShieldCheck, X, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface PasswordChangeModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged: (updatedUser: User) => void;
  isMandatoryPrompt?: boolean;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  user,
  isOpen,
  onClose,
  onPasswordChanged,
  isMandatoryPrompt = false,
}) => {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError(t.currentPasswordIncorrect);
      return;
    }

    if (newPassword.length < 6) {
      setError(t.minPasswordLength);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    setLoading(true);

    try {
      // Verify current password
      const isValidCurrent = await verifyPassword(currentPassword, user.passwordHash, user.salt);
      if (!isValidCurrent) {
        setError(t.currentPasswordIncorrect);
        setLoading(false);
        return;
      }

      // Update password
      await storageService.updateUserPassword(user.id, newPassword);
      const updatedUser = storageService.getUserByUsername(user.username);

      if (updatedUser) {
        storageService.setActiveSession(updatedUser);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          onPasswordChanged(updatedUser);
          onClose();
        }, 1200);
      }
    } catch {
      setError(t.currentPasswordIncorrect);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t.changePasswordTitle}</h2>
              <p className="text-xs text-slate-500">
                {user.username} ({user.role === 'admin' ? t.tabAdmin : t.tabStudent})
              </p>
            </div>
          </div>
          {!isMandatoryPrompt && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Warning banner for default admin credentials - without exposing the secret password! */}
        {user.isDefaultPassword && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              <strong>{t.passwordChangePromptTitle}:</strong> {t.passwordChangePromptDesc}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.passwordChangedSuccess}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.currentPasswordLabel}
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.newPasswordLabel}
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono"
            />
            {newPassword.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{t.passwordStrengthLabel}:</span>
                  <span className="font-semibold text-slate-700">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {t.confirmPasswordLabel}
            </label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-mono"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {!isMandatoryPrompt && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-xs"
            >
              {loading ? '...' : t.updatePasswordButton}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
