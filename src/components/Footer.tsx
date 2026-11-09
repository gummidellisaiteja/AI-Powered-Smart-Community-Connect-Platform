import React from 'react';
import { ShieldAlert, HeartPulse, Building2, Globe, Users, Store } from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  onNavigate,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 pb-20 lg:pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 font-bold text-white flex items-center justify-center shadow-md">
                గ
              </div>
              <span className="text-lg font-bold text-white">
                {t('appName', language)}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerGovtNotice', language)}
            </p>
            <div className="pt-1">
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'te' : 'en')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 text-amber-400 rounded-lg text-xs font-semibold hover:border-amber-400 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400">
              GramConnect Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('complaints')} className="hover:text-white transition-colors">
                  {t('navComplaints', language)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('workers')} className="hover:text-white transition-colors">
                  {t('navWorkers', language)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jobs')} className="hover:text-white transition-colors">
                  {t('navJobs', language)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shops')} className="hover:text-white transition-colors">
                  {t('navShops', language)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('education')} className="hover:text-white transition-colors">
                  {t('navEducation', language)}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('health')} className="hover:text-white transition-colors">
                  {t('navHealth', language)}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helpline Contacts */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Emergency Helplines
            </h4>
            <ul className="space-y-1 text-xs text-slate-400">
              <li>• AP Police Control: <strong className="text-white">100 / 112</strong></li>
              <li>• 108 Emergency Ambulance: <strong className="text-white">108</strong></li>
              <li>• 104 Mobile Medical Unit: <strong className="text-white">104</strong></li>
              <li>• Women Helpline / Disha: <strong className="text-white">181</strong></li>
              <li>• Citizen Grievance Redressal: <strong className="text-white">1902</strong></li>
            </ul>
          </div>

          {/* Project Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Grama Swarajya 360°
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed for Andhra Pradesh rural & urban communities across West Godavari, Kakinada, Guntur, Krishna, Visakhapatnam, and Ananthapur.
            </p>
            <p className="text-[11px] text-teal-400 font-mono">
              B.Tech CSE Community Service Project (CSP) Full Production Model
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>© 2026 GramConnect. All rights reserved. Supporting Digital India.</div>
          <div>{t('developedFor', language)}</div>
        </div>
      </div>
    </footer>
  );
};
