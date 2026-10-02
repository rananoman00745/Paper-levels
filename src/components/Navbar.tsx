import React, { useState } from 'react';
import { User, UserRole } from '../types/exam';
import { useLanguage } from '../context/LanguageContext';
import { useTheme, Theme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Language } from '../i18n/translations';
import {
  Globe,
  LogOut,
  KeyRound,
  User as UserIcon,
  Sun,
  Moon,
  Laptop,
  Bell,
  CheckCircle2,
  Layers,
  GraduationCap,
  Shield,
  Folder,
  Trash2,
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeView: 'admin' | 'teacher' | 'student';
  onSwitchView: (view: 'admin' | 'teacher' | 'student') => void;
  onOpenPasswordModal: () => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenGoetheFolder?: () => void;
  onOpenTrashBin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onSwitchView,
  onOpenPasswordModal,
  onLogout,
  onOpenLogin,
  onOpenGoetheFolder,
  onOpenTrashBin,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ur', label: 'اردو', flag: '🇵🇰' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Zone 1: Deutschkurs By Noman & German Flag Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* German Tricolor Flag (Schwarz-Rot-Gold) */}
            <div className="flex flex-col h-6 w-8 shrink-0 rounded overflow-hidden shadow-xs ring-1 ring-slate-300 dark:ring-slate-700">
              <span className="h-2 w-full bg-[#000000]" />
              <span className="h-2 w-full bg-[#DD0000]" />
              <span className="h-2 w-full bg-[#FFCE00]" />
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentUser) {
                  onSwitchView(currentUser.role === 'admin' ? 'admin' : currentUser.role === 'teacher' ? 'teacher' : 'student');
                }
              }}
              className="flex items-center gap-2 group"
            >
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors whitespace-nowrap flex items-center gap-1.5">
                <span>Deutschkurs By Noman</span>
                <span className="text-base" role="img" aria-label="Deutschland Flagge">🇩🇪</span>
              </span>
              <span className="hidden lg:inline-block text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 uppercase tracking-wider">
                A1 – C2
              </span>
            </a>
          </div>

          <span className="hidden xl:inline-block text-xs text-slate-400">·</span>
          <span className="hidden xl:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
            {t.brandSubtitle}
          </span>
        </div>

        {/* Zone 2: Role Navigator Switcher */}
        <nav className="hidden md:flex items-center gap-1">
          {currentUser ? (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {currentUser.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => onSwitchView('admin')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'admin'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{t.adminPortal}</span>
                </button>
              )}

              {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                <button
                  type="button"
                  onClick={() => onSwitchView('teacher')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    activeView === 'teacher'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.teacherPortal}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onSwitchView('student')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeView === 'student'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{t.studentPortal}</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.secureCenter}
            </span>
          )}
        </nav>

        {/* Zone 3: Actions (Theme, Goethe Archive, Trash, Notifications, Language, Profile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Goethe Prüfungen Archive Quick Link */}
          {onOpenGoetheFolder && (
            <button
              type="button"
              onClick={onOpenGoetheFolder}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Goethe-Prüfungen Archiv (A1–C2)"
            >
              <Folder className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Goethe-Ordner</span>
            </button>
          )}

          {/* Trash Bin Quick Link (for Admins & Teachers) */}
          {currentUser && currentUser.role === 'admin' && onOpenTrashBin && (
            <button
              type="button"
              onClick={onOpenTrashBin}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title="Papierkorb / Trash Bin"
            >
              <Trash2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </button>
          )}

          {/* Theme Switcher Toggle (Light, Dark, System) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              title={`Theme: ${theme}`}
            >
              {theme === 'dark' ? (
                <Moon className="w-4 h-4 text-indigo-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Laptop className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {themeMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setThemeMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-40 text-xs">
                  <button
                    type="button"
                    onClick={() => { setTheme('light'); setThemeMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${theme === 'light' ? 'font-bold text-amber-600' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Hell</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTheme('dark'); setThemeMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${theme === 'dark' ? 'font-bold text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dunkel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTheme('system'); setThemeMenuOpen(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${theme === 'system' ? 'font-bold text-sky-500' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <Laptop className="w-3.5 h-3.5 text-slate-500" />
                    <span>System</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors relative"
              title="Benachrichtigungen"
            >
              <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setNotifMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-40 text-xs space-y-2 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">Benachrichtigungen</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        Alle gelesen
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                          n.read
                            ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                            : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-slate-900 dark:text-slate-100 font-medium'
                        }`}
                      >
                        <div className="font-bold text-[11px] mb-0.5">{n.title}</div>
                        <div className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{n.message}</div>
                        <div className="text-[9px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              title={t.languageLabel}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">
                {languages.find((l) => l.code === language)?.label || 'Language'}
              </span>
              <span className="sm:hidden uppercase font-bold text-[11px]">{language}</span>
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-40">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        language === l.code ? 'font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                      {language === l.code && <span className="text-emerald-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile / Login status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">
                  {currentUser.role === 'admin' ? 'Institutsleitung' : currentUser.role === 'teacher' ? 'Dozent / Lehrer' : `Student (${currentUser.currentLevel || 'B1'})`}
                </span>
              </div>

              <button
                type="button"
                onClick={onOpenPasswordModal}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title={t.changePassword}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 text-slate-700 dark:text-slate-300 hover:text-red-700 transition-colors"
                title={t.logout}
              >
                <LogOut className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold rounded-lg text-xs hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors shadow-xs"
            >
              {t.login}
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
