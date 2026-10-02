import React, { useState } from 'react';
import { User, CEFRLevel, UserRole } from '../types/exam';
import { storageService } from '../services/storage';
import { verifyPassword, hashPassword } from '../utils/crypto';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  GraduationCap,
  LogIn,
  UserPlus,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  User as UserIcon,
  Shield,
  BookOpen,
} from 'lucide-react';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
  defaultRole?: UserRole;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  defaultRole = 'student',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'student' | 'teacher' | 'admin' | 'register'>(defaultRole);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Student registration state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLevel, setRegLevel] = useState<CEFRLevel>('A1');
  const [regSuccess, setRegSuccess] = useState(false);

  // Admin Forgot Password / Secret Recovery state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryName, setRecoveryName] = useState('');
  const [recoverySecretCode, setRecoverySecretCode] = useState('');
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const targetUser = storageService.getUserByUsername(username);
      if (!targetUser) {
        setLoginError(t.loginErrorUserNotFound);
        setLoading(false);
        return;
      }

      // Check role matches tab
      if (activeTab === 'admin' && targetUser.role !== 'admin') {
        setLoginError('Dieses Konto besitzt keine Administrator-Rechte.');
        setLoading(false);
        return;
      }

      if (activeTab === 'teacher' && targetUser.role !== 'teacher' && targetUser.role !== 'admin') {
        setLoginError('Dieses Konto besitzt keine Dozenten-Rechte.');
        setLoading(false);
        return;
      }

      const isValid = await verifyPassword(password, targetUser.passwordHash, targetUser.salt);
      if (!isValid) {
        setLoginError(t.loginErrorInvalidPassword);
        setLoading(false);
        return;
      }

      targetUser.lastLoginAt = new Date().toISOString();
      storageService.saveUser(targetUser);
      storageService.setCurrentSession(targetUser);
      storageService.logAuditEvent(
        targetUser.username,
        targetUser.role,
        'LOGIN_SUCCESS',
        `Erfolgreiche Anmeldung im ${targetUser.role === 'admin' ? 'Leitungs' : targetUser.role === 'teacher' ? 'Dozenten' : 'Studenten'}-Portal`,
        'info'
      );

      onLoginSuccess(targetUser);
    } catch {
      setLoginError(t.loginErrorInvalidPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (storageService.getUserByUsername(regUsername)) {
      setLoginError(t.usernameTaken);
      return;
    }

    if (regPassword.length < 6) {
      setLoginError(t.minPasswordLength);
      return;
    }

    setLoading(true);
    try {
      const studentId = `DK-2026-${Math.floor(100 + Math.random() * 900)}`;
      const { hash, salt } = await hashPassword(regPassword);

      const newUser: User = {
        id: 'usr-student-' + Date.now().toString(36),
        username: regUsername.trim(),
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        role: 'student',
        passwordHash: hash,
        salt,
        studentId,
        currentLevel: regLevel,
        targetLevel: regLevel === 'C2' ? 'C2' : levels[levels.indexOf(regLevel) + 1] || 'B2',
        createdAt: new Date().toISOString(),
      };

      storageService.saveUser(newUser);

      // Create initial student admission record
      storageService.saveAdmission({
        id: 'adm-' + Date.now().toString(36),
        studentId,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        phone: regPhone.trim(),
        cnicOrPassport: 'Pending',
        dob: '2000-01-01',
        currentLevel: regLevel,
        targetLevel: newUser.targetLevel || 'B2',
        batchId: 'batch-a1-morn',
        batchName: `Einschreibung GER ${regLevel}`,
        admissionDate: new Date().toISOString().split('T')[0],
        feeAgreed: 300,
        status: 'active',
        promotionHistory: [],
      });

      storageService.logAuditEvent(newUser.username, 'student', 'STUDENT_REGISTER', `Neuer Student registriert: ${studentId} (GER ${regLevel})`, 'info');

      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setActiveTab('student');
        setUsername(newUser.username);
        setPassword('');
      }, 1400);
    } catch {
      setLoginError(t.loginErrorInvalidPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSecretReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);

    if (recoverySecretCode.trim() !== 'admin1234$') {
      setRecoveryError(t.invalidSecretCode);
      return;
    }

    setLoading(true);
    try {
      const success = await storageService.resetAdminPasswordWithSecretCode(recoveryName, recoverySecretCode);
      if (success) {
        setRecoverySuccess(true);
        setTimeout(() => {
          setRecoverySuccess(false);
          setShowForgotModal(false);
          setActiveTab('admin');
          setUsername('admin');
          setPassword('adminadmin');
          setRecoverySecretCode('');
          setRecoveryName('');
        }, 1600);
      } else {
        setRecoveryError(t.invalidSecretCode);
      }
    } catch {
      setRecoveryError(t.invalidSecretCode);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (role: 'student' | 'teacher' | 'admin') => {
    setActiveTab(role);
    setShowForgotModal(false);
    setLoginError(null);
    if (role === 'admin') {
      setUsername('admin');
      setPassword('adminadmin');
    } else if (role === 'teacher') {
      setUsername('teacher');
      setPassword('teacher123');
    } else {
      setUsername('student');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full space-y-6">
        
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-md mb-1">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
            <span>Deutschkurs By Noman</span>
            <span role="img" aria-label="Deutschland Flagge" className="text-2xl">🇩🇪</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {t.loginSubtitle}
          </p>

          {/* Quick Demo Credentials Bar */}
          <div className="pt-2 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mr-1">Demo-Login:</span>
            <button
              type="button"
              onClick={() => fillQuickDemo('student')}
              className="px-2 py-1 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-lg text-[10px] font-bold hover:bg-sky-100 transition-colors"
            >
              👤 Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('teacher')}
              className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
            >
              🎓 Lehrer
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin')}
              className="px-2 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg text-[10px] font-bold hover:bg-amber-100 transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Portal switcher tabs */}
        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setShowForgotModal(false);
              setLoginError(null);
            }}
            className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'student' && !showForgotModal
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Studenten</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setShowForgotModal(false);
              setLoginError(null);
            }}
            className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'teacher' && !showForgotModal
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lehrer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setShowForgotModal(false);
              setLoginError(null);
            }}
            className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'admin' && !showForgotModal
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setShowForgotModal(false);
              setLoginError(null);
            }}
            className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register' && !showForgotModal
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-purple-600" />
            <span>Aufnahme</span>
          </button>
        </div>

        {/* Card Form container */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {loginError && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {regSuccess && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{t.registerSuccess}</span>
            </div>
          )}

          {/* ADMIN FORGOT PASSWORD / SECRET CODE RESET MODAL */}
          {showForgotModal ? (
            <form onSubmit={handleAdminSecretReset} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Admin-Passwort wiederherstellen</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Geben Sie den Institutsschlüssel ein, um das Admin-Passwort zurückzusetzen.
                </p>
              </div>

              {recoveryError && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Passwort wurde auf <strong>adminadmin</strong> zurückgesetzt!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Admin-Benutzername
                </label>
                <input
                  type="text"
                  value={recoveryName}
                  onChange={(e) => setRecoveryName(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Generalschlüssel (Master Secret Code)
                </label>
                <input
                  type="password"
                  value={recoverySecretCode}
                  onChange={(e) => setRecoverySecretCode(e.target.value)}
                  placeholder="admin1234$"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Tipp: admin1234$</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Zurück</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
                >
                  Passwort zurücksetzen
                </button>
              </div>
            </form>
          ) : activeTab === 'register' ? (
            /* STUDENT REGISTRATION FORM */
            <form onSubmit={handleRegisterStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="z. B. Max Mustermann"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {t.username}
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="student.noman"
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Telefonnummer
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+49 170 1234567"
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="student@deutschkurs-noman.de"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Start-Niveau auswählen (A1 bis C2)
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {levels.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setRegLevel(lvl)}
                      className={`py-1.5 text-xs font-extrabold rounded-lg border transition-all ${
                        regLevel === lvl
                          ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 border-slate-900 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.password} (min. 6 Zeichen)
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors shadow-xs"
              >
                {loading ? 'Wird registriert...' : 'Studentenkonto anlegen & einschreiben'}
              </button>
            </form>
          ) : (
            /* STANDARD LOGIN FORM FOR STUDENT / TEACHER / ADMIN */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t.username}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    activeTab === 'admin'
                      ? 'admin'
                      : activeTab === 'teacher'
                      ? 'teacher'
                      : 'student'
                  }
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                    {t.password}
                  </label>
                  {activeTab === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Generalschlüssel?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {activeTab === 'admin'
                    ? 'Als Admin / Institutsleitung anmelden'
                    : activeTab === 'teacher'
                    ? 'Als Dozent / Lehrer anmelden'
                    : 'Als Student anmelden'}
                </span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
