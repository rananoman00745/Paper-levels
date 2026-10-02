import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppNotification } from '../types/exam';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Neuer Kursstart A1 & B1',
    message: 'Die neuen Intensivkurse für A1 und B1 beginnen nächste Woche. Bitte Stundenpläne prüfen.',
    type: 'info',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    linkTab: 'batches',
  },
  {
    id: 'notif-2',
    title: 'Offizielle Goethe-Modelltests verfügbar',
    message: 'Die neuen Goethe-Prüfungen für Niveaustufen A1 bis C2 wurden in den Ordner hochgeladen.',
    type: 'exam',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    read: false,
    linkTab: 'goethe',
  },
  {
    id: 'notif-3',
    title: 'Gebührennachweis aktualisiert',
    message: 'Zahlungsquittungen können jetzt direkt im PDF-Format mit offizieller Signatur heruntergeladen werden.',
    type: 'fee',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: true,
    linkTab: 'fees',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('deutschkurs_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('deutschkurs_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        showToast,
      }}
    >
      {children}
      {/* Toast Render Overlay */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
