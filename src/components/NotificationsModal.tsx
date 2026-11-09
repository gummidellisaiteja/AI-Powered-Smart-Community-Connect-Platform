import React from 'react';
import {
  Bell,
  CheckCheck,
  X,
  AlertTriangle,
  Briefcase,
  Calendar,
  ShieldAlert,
  Megaphone,
} from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { t } from '../translations';

interface NotificationsModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  language,
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />;
      case 'complaint':
        return <ShieldAlert className="w-5 h-5 text-emerald-600" />;
      case 'job':
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-amber-600" />;
      default:
        return <Calendar className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {t('notifications', language)}
              </h3>
              <p className="text-[11px] text-slate-500">
                {notifications.filter((n) => !n.read).length} unread alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={onMarkAllRead}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{t('markAllRead', language)}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {t('noNotifications', language)}
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkRead(notif.id);
                  if (notif.linkTab) {
                    onNavigateTab(notif.linkTab);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  !notif.read
                    ? 'bg-teal-50/60 border-teal-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="shrink-0 mt-0.5">{getIcon(notif.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {language === 'te' ? notif.titleTe : notif.title}
                    </h4>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {language === 'te' ? notif.messageTe : notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {notif.createdAt}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
