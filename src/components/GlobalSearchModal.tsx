import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  Briefcase,
  Landmark,
  GraduationCap,
  Store,
  ShieldAlert,
  ArrowRight,
  Megaphone,
} from 'lucide-react';
import {
  Language,
  WorkerProfile,
  JobPosting,
  GovtScheme,
  Scholarship,
  LocalBusiness,
  Announcement,
  Complaint,
} from '../types';

interface GlobalSearchModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  workers: WorkerProfile[];
  jobs: JobPosting[];
  schemes: GovtScheme[];
  scholarships: Scholarship[];
  shops: LocalBusiness[];
  announcements: Announcement[];
  complaints: Complaint[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  language,
  isOpen,
  onClose,
  onNavigateTab,
  workers,
  jobs,
  schemes,
  scholarships,
  shops,
  announcements,
  complaints,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'workers' | 'jobs' | 'schemes' | 'education' | 'shops' | 'complaints'
  >('all');

  if (!isOpen) return null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      type: 'worker' | 'job' | 'scheme' | 'education' | 'shop' | 'complaint' | 'announcement';
      targetTab: string;
      meta?: string;
    }> = [];

    // 1. Workers
    if (filterType === 'all' || filterType === 'workers') {
      workers.forEach((w) => {
        if (
          w.name.toLowerCase().includes(q) ||
          w.occupation.toLowerCase().includes(q) ||
          w.village.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
        ) {
          items.push({
            id: w.id,
            title: w.name,
            subtitle: `${w.occupation} • ${w.village} (₹${w.dailyWage}/day)`,
            type: 'worker',
            targetTab: 'workers',
            meta: `⭐ ${w.rating} Rating`,
          });
        }
      });
    }

    // 2. Jobs
    if (filterType === 'all' || filterType === 'jobs') {
      jobs.forEach((j) => {
        if (
          j.title.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q) ||
          j.village.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q)
        ) {
          items.push({
            id: j.id,
            title: j.title,
            subtitle: `${j.village} • ₹${j.wage} (${j.wageType}) • ${j.openingsCount} Openings`,
            type: 'job',
            targetTab: 'jobs',
            meta: j.category,
          });
        }
      });
    }

    // 3. Schemes
    if (filterType === 'all' || filterType === 'schemes') {
      schemes.forEach((s) => {
        if (
          s.title.toLowerCase().includes(q) ||
          s.titleTe.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.beneficiaryType.toLowerCase().includes(q)
        ) {
          items.push({
            id: s.id,
            title: language === 'te' ? s.titleTe : s.title,
            subtitle: `${s.beneficiaryType} • ${s.financialAssistance}`,
            type: 'scheme',
            targetTab: 'schemes',
            meta: s.category,
          });
        }
      });
    }

    // 4. Education / Scholarships
    if (filterType === 'all' || filterType === 'education') {
      scholarships.forEach((sc) => {
        if (
          sc.name.toLowerCase().includes(q) ||
          sc.targetAudience.toLowerCase().includes(q) ||
          sc.amount.toLowerCase().includes(q)
        ) {
          items.push({
            id: sc.id,
            title: sc.name,
            subtitle: `${sc.targetAudience} • Benefit: ${sc.amount}`,
            type: 'education',
            targetTab: 'education',
            meta: `Deadline: ${sc.deadline}`,
          });
        }
      });
    }

    // 5. Shops
    if (filterType === 'all' || filterType === 'shops') {
      shops.forEach((sh) => {
        if (
          sh.name.toLowerCase().includes(q) ||
          sh.nameTe.toLowerCase().includes(q) ||
          sh.category.toLowerCase().includes(q) ||
          sh.ownerName.toLowerCase().includes(q)
        ) {
          items.push({
            id: sh.id,
            title: language === 'te' ? sh.nameTe : sh.name,
            subtitle: `${sh.category} • ${sh.village} • Owner: ${sh.ownerName}`,
            type: 'shop',
            targetTab: 'shops',
            meta: `📞 ${sh.phone}`,
          });
        }
      });
    }

    // 6. Complaints
    if (filterType === 'all' || filterType === 'complaints') {
      complaints.forEach((c) => {
        if (
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q)
        ) {
          items.push({
            id: c.id,
            title: c.title,
            subtitle: `ID: ${c.id} • ${c.category} • Status: ${c.status}`,
            type: 'complaint',
            targetTab: 'complaints',
            meta: c.status,
          });
        }
      });
    }

    // 7. Announcements
    announcements.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.titleTe.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      ) {
        items.push({
          id: a.id,
          title: language === 'te' ? a.titleTe : a.title,
          subtitle: `${a.category} • ${a.issuedBy} (${a.date})`,
          type: 'announcement',
          targetTab: 'home',
          meta: 'Official Notice',
        });
      }
    });

    return items;
  }, [query, filterType, workers, jobs, schemes, scholarships, shops, complaints, announcements, language]);

  const handleSelect = (targetTab: string) => {
    onNavigateTab(targetTab);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'worker':
        return <Users className="w-4 h-4 text-amber-600" />;
      case 'job':
        return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'scheme':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'shop':
        return <Store className="w-4 h-4 text-teal-600" />;
      case 'complaint':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-start justify-center p-4 sm:pt-16">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-teal-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={
              language === 'te'
                ? 'కార్మికులు, ఉద్యోగాలు, ప్రభుత్వ పథకాలు, స్కాలర్‌షిప్‌లు, దుకాణాలు శోధించండి...'
                : 'Search workers, jobs, welfare schemes, scholarships, shops, complaints...'
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-3 overflow-x-auto border-b border-slate-100 bg-white text-xs">
          {[
            { id: 'all', label: language === 'te' ? 'అన్నీ' : 'All' },
            { id: 'workers', label: language === 'te' ? 'కార్మికులు' : 'Workers' },
            { id: 'jobs', label: language === 'te' ? 'పనులు' : 'Jobs' },
            { id: 'schemes', label: language === 'te' ? 'పథకాలు' : 'Schemes' },
            { id: 'education', label: language === 'te' ? 'విద్య' : 'Education' },
            { id: 'shops', label: language === 'te' ? 'దుకాణాలు' : 'Shops' },
            { id: 'complaints', label: language === 'te' ? 'సమస్యలు' : 'Complaints' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
                filterType === f.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <p className="font-semibold text-slate-600">
                {language === 'te'
                  ? 'శోధించడానికి ఏదైనా టైప్ చేయండి'
                  : 'Type to search across GramConnect 360°'}
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                E.g. "Electrician", "Rythu Bharosa", "Pothole", "Penumantra", "Harvesting", "Pharmacy"
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <p className="font-bold text-slate-600">No matching records found for "{query}"</p>
              <p className="text-[11px] mt-1 text-slate-400">
                Try searching with another keyword or village name.
              </p>
            </div>
          ) : (
            results.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item.targetTab)}
                className="p-3 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white group-hover:scale-105 transition-all shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{item.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.meta && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.meta}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>{results.length} results matching</span>
          <span className="font-bold text-teal-700">Click result to view details</span>
        </div>
      </div>
    </div>
  );
};
