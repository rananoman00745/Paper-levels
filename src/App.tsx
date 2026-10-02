import React, { useState, useEffect } from 'react';
import { User, GoethePruefungFile, TrashItem } from './types/exam';
import { storageService } from './services/storage';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { AuthView } from './components/AuthView';
import { AdminPortal } from './components/admin/AdminPortal';
import { TeacherPortal } from './components/teacher/TeacherPortal';
import { StudentPortal } from './components/student/StudentPortal';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { GoetheFolderModal } from './components/common/GoetheFolderModal';
import { TrashBinModal } from './components/common/TrashBinModal';

function AppContent() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<'admin' | 'teacher' | 'student'>('student');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthViewOpen, setIsAuthViewOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Global modals triggered from Navbar
  const [isGoetheModalOpen, setIsGoetheModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [goetheFiles, setGoetheFiles] = useState<GoethePruefungFile[]>([]);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);

  const refreshGlobalData = () => {
    setGoetheFiles(storageService.getGoetheFiles());
    setTrashItems(storageService.getTrashItems());
  };

  useEffect(() => {
    const init = async () => {
      await storageService.initialize();
      refreshGlobalData();
      const session = storageService.getActiveSession();
      if (session) {
        setCurrentUser(session);
        setActiveView(session.role === 'admin' ? 'admin' : session.role === 'teacher' ? 'teacher' : 'student');
        if (session.role === 'admin' && session.isDefaultPassword) {
          setIsPasswordModalOpen(true);
        }
      }
      setIsReady(true);
    };
    init();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView(user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'student');
    setIsAuthViewOpen(false);

    if (user.role === 'admin' && user.isDefaultPassword) {
      setIsPasswordModalOpen(true);
    }
  };

  const handleLogout = () => {
    storageService.setActiveSession(null);
    setCurrentUser(null);
    setActiveView('student');
  };

  const handlePasswordChanged = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Top Bar Navigation with Language Selector */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onSwitchView={setActiveView}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
        onLogout={handleLogout}
        onOpenLogin={() => setIsAuthViewOpen(true)}
        onOpenGoetheFolder={() => {
          refreshGlobalData();
          setIsGoetheModalOpen(true);
        }}
        onOpenTrashBin={() => {
          refreshGlobalData();
          setIsTrashModalOpen(true);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {!currentUser ? (
          <AuthView onLoginSuccess={handleLoginSuccess} />
        ) : activeView === 'admin' && currentUser.role === 'admin' ? (
          <AdminPortal
            currentUser={currentUser}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />
        ) : activeView === 'teacher' && (currentUser.role === 'teacher' || currentUser.role === 'admin') ? (
          <TeacherPortal
            currentUser={currentUser}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />
        ) : (
          <StudentPortal
            currentUser={currentUser}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />
        )}
      </main>

      {/* Password Change Modal */}
      {currentUser && (
        <PasswordChangeModal
          user={currentUser}
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          onPasswordChanged={handlePasswordChanged}
          isMandatoryPrompt={currentUser.role === 'admin' && !!currentUser.isDefaultPassword}
        />
      )}

      {/* Global Goethe Prüfungen Folder Modal */}
      <GoetheFolderModal
        isOpen={isGoetheModalOpen}
        files={goetheFiles}
        onClose={() => setIsGoetheModalOpen(false)}
        canUpload={currentUser?.role === 'admin' || currentUser?.role === 'teacher'}
        onUploadFile={(newF) => {
          storageService.saveGoetheFile(newF);
          refreshGlobalData();
        }}
      />

      {/* Global Trash Bin Modal */}
      <TrashBinModal
        isOpen={isTrashModalOpen}
        trashItems={trashItems}
        onClose={() => setIsTrashModalOpen(false)}
        onRestore={(id) => {
          storageService.restoreFromTrash(id);
          refreshGlobalData();
        }}
        onPermanentDelete={(id) => {
          storageService.permanentlyDeleteTrashItem(id);
          refreshGlobalData();
        }}
        onEmptyTrash={() => {
          storageService.emptyTrash();
          refreshGlobalData();
        }}
      />

      {/* Global Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-white">{t.brandTitle}</span>
            <span aria-hidden="true">·</span>
            <span>{t.brandSubtitle}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>SHA-256</span>
            <span aria-hidden="true">·</span>
            <span>RBAC (Admin / Lehrer / Student)</span>
            <span aria-hidden="true">·</span>
            <span>GER A1–C2</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
