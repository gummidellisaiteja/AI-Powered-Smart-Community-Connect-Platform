import React from 'react';
import {
  CheckCircle,
  Users,
  Briefcase,
  Store,
  GraduationCap,
  HeartPulse,
} from 'lucide-react';
import { Language, VillageStats } from '../types';
import { t } from '../translations';

interface StatsOverviewProps {
  stats: VillageStats;
  language: Language;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, language }) => {
  const statCards = [
    {
      titleKey: 'resolvedRate',
      value: stats.resolvedGrievances,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      textColor: 'text-emerald-900',
    },
    {
      titleKey: 'registeredWorkers',
      value: stats.activeWorkers,
      icon: <Users className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-900',
    },
    {
      titleKey: 'postedJobs',
      value: stats.jobsPostedCount,
      icon: <Briefcase className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-900',
    },
    {
      titleKey: 'registeredShops',
      value: stats.activeShopsCount || 6,
      icon: <Store className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-200',
      textColor: 'text-teal-900',
    },
    {
      titleKey: 'scholarshipsAvailable',
      value: stats.scholarshipsClaimed,
      icon: <GraduationCap className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-900',
    },
  ];

  return (
    <div className="my-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold text-slate-800">
          {t('statsTitle', language)}
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          AP Grama Sachivalayam Real-Time Sync
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-2xl border ${card.bg} shadow-sm flex items-center gap-3 transition-transform hover:-translate-y-0.5`}
          >
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">{card.icon}</div>
            <div>
              <div className={`text-lg sm:text-xl font-black ${card.textColor}`}>
                {card.value}
              </div>
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 leading-tight">
                {t(card.titleKey as any, language)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
