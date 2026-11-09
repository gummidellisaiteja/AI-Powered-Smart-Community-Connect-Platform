import React from 'react';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Bot,
  Megaphone,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { Language, Announcement } from '../types';
import { t } from '../translations';

interface HeroSectionProps {
  language: Language;
  onNavigate: (tab: string) => void;
  announcements: Announcement[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onNavigate,
  announcements,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-700/60 relative overflow-hidden my-4">
      {/* Background Decorative Rings */}
      <div className="absolute -right-16 -top-16 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Andhra Pradesh Grama Swarajya Digital Mission</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {language === 'te'
              ? 'స్మార్ట్ డిజిటల్ సేవలతో గ్రామీణ సాధికారత'
              : 'Empowering Communities with Smart Digital Services'}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
            {language === 'te'
              ? 'స్థానిక కార్మికులతో అనుసంధానం, ఉపాధి అవకాశాలు, విద్యా వనరులు, గ్రామ సమస్యల నమోదు మరియు ప్రభుత్వ సంక్షేమ పథకాలను ఒకే డిజిటల్ వేదిక ద్వారా పొందండి.'
              : 'Connect with local workers, discover employment opportunities, access education resources, report community problems and explore public services through one platform.'}
          </p>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <button
              id="hero-quick-complaint"
              onClick={() => onNavigate('complaints')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg hover:shadow-teal-900/40 transition-all border border-teal-400/30 group"
            >
              <ShieldAlert className="w-6 h-6 mb-1 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span className="text-center">{t('raiseGrievanceQuick', language)}</span>
            </button>

            <button
              id="hero-quick-worker"
              onClick={() => onNavigate('workers')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs shadow-md border border-slate-600 transition-all group"
            >
              <Users className="w-6 h-6 mb-1 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-center">{t('findWorkerQuick', language)}</span>
            </button>

            <button
              id="hero-quick-jobs"
              onClick={() => onNavigate('jobs')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs shadow-md border border-slate-600 transition-all group"
            >
              <Briefcase className="w-6 h-6 mb-1 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-center">{t('searchJobsQuick', language)}</span>
            </button>

            <button
              id="hero-quick-ai"
              onClick={() => onNavigate('ai')}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg transition-all border border-purple-400/30 group"
            >
              <Bot className="w-6 h-6 mb-1 text-purple-200 group-hover:scale-110 transition-transform" />
              <span className="text-center">{t('askAiQuick', language)}</span>
            </button>
          </div>
        </div>

        {/* Right Feature Card / Village Panchayat Banner */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-2xl backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400 animate-bounce" />
              <h3 className="font-bold text-sm text-amber-300">
                {t('announcements', language)}
              </h3>
            </div>
            <span className="text-[10px] bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
              Live Updates
            </span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {announcements.slice(0, 3).map((ann) => (
              <div
                key={ann.id}
                className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 hover:border-teal-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-[11px] text-teal-400 mb-1">
                  <span className="font-semibold">{ann.category}</span>
                  <span className="text-slate-400">{ann.date}</span>
                </div>
                <h4 className="font-semibold text-xs text-slate-100 line-clamp-1">
                  {language === 'te' ? ann.titleTe : ann.title}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {language === 'te' ? ann.contentTe : ann.content}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Panchayat Digital Gateway
            </span>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-teal-300 hover:text-white flex items-center gap-1 font-semibold text-[11px]"
            >
              View Grievance Status <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
