import React from 'react';
import {
  Building2,
  ShieldAlert,
  Users,
  Briefcase,
  Store,
  GraduationCap,
  HeartPulse,
  Bot,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../translations';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  language,
}) => {
  const bottomItems = [
    { id: 'home', label: language === 'te' ? 'హోమ్' : 'Home', icon: Building2 },
    { id: 'complaints', label: language === 'te' ? 'ఫిర్యాదు' : 'Grievance', icon: ShieldAlert },
    { id: 'workers', label: language === 'te' ? 'కార్మికులు' : 'Workers', icon: Users },
    { id: 'jobs', label: language === 'te' ? 'ఉపాధి' : 'Jobs', icon: Briefcase },
    { id: 'shops', label: language === 'te' ? 'షాపులు' : 'Shops', icon: Store },
    { id: 'health', label: language === 'te' ? 'వైద్యం' : 'Health', icon: HeartPulse },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-1 py-1.5 shadow-2xl">
      <div className="grid grid-cols-6 gap-0.5 max-w-md mx-auto">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-400 font-extrabold bg-slate-900 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 font-semibold'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-teal-400' : ''}`} />
              <span className="text-[10px] mt-0.5 truncate w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
