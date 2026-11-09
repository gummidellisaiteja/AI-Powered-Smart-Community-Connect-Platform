import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Globe,
  Bell,
  UserCircle,
  Menu,
  ShieldAlert,
  Users,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Bot,
  Building2,
  AlertTriangle,
  Store,
  Search,
  X,
  Landmark,
  Megaphone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import {
  Language,
  UserRole,
  UserAccount,
  Complaint,
  WorkerProfile,
  JobPosting,
  GovtScheme,
  Scholarship,
  EducationalResource,
  LocalBusiness,
  Announcement,
  Hospital,
} from '../types';
import { t } from '../translations';

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  categoryBadge: string;
  categoryColor: string;
  icon: React.ComponentType<{ className?: string }>;
  targetTab: string;
  recordId?: string;
}

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  currentRole: UserRole;
  onRoleChange: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSos: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: (prompt?: string) => void;
  onOpenProfile: () => void;
  onToggleSidebar: () => void;
  // Search data collections
  complaints: Complaint[];
  workers: WorkerProfile[];
  jobs: JobPosting[];
  schemes: GovtScheme[];
  scholarships: Scholarship[];
  resources: EducationalResource[];
  shops: LocalBusiness[];
  announcements: Announcement[];
  hospitals: Hospital[];
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  onOpenSos,
  unreadNotificationsCount,
  onOpenNotifications,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onToggleSidebar,
  complaints,
  workers,
  jobs,
  schemes,
  scholarships,
  resources,
  shops,
  announcements,
  hospitals,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-entity search across the entire platform
  const searchResults: SearchResultItem[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const list: SearchResultItem[] = [];

    // 1. Complaints
    complaints.forEach((c) => {
      if (
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.village.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      ) {
        list.push({
          id: `comp-${c.id}`,
          title: c.title,
          subtitle: `ID: ${c.id} • Status: ${c.status} • ${c.village}`,
          categoryBadge: 'Grievance',
          categoryColor: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: ShieldAlert,
          targetTab: 'complaints',
          recordId: c.id,
        });
      }
    });

    // 2. Workers
    workers.forEach((w) => {
      if (
        w.name.toLowerCase().includes(q) ||
        w.occupation.toLowerCase().includes(q) ||
        w.village.toLowerCase().includes(q) ||
        w.skills.some((s) => s.toLowerCase().includes(q))
      ) {
        list.push({
          id: `wkr-${w.id}`,
          title: w.name,
          subtitle: `${w.occupation} • ${w.village} • ₹${w.dailyWage}/day`,
          categoryBadge: 'Worker',
          categoryColor: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: Users,
          targetTab: 'workers',
          recordId: w.id,
        });
      }
    });

    // 3. Jobs
    jobs.forEach((j) => {
      if (
        j.title.toLowerCase().includes(q) ||
        j.category.toLowerCase().includes(q) ||
        j.village.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
      ) {
        list.push({
          id: `job-${j.id}`,
          title: j.title,
          subtitle: `${j.village} • ₹${j.wage} (${j.wageType}) • ${j.openingsCount || 1} Openings`,
          categoryBadge: 'Job',
          categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: Briefcase,
          targetTab: 'jobs',
          recordId: j.id,
        });
      }
    });

    // 4. Government Schemes
    schemes.forEach((s) => {
      if (
        s.title.toLowerCase().includes(q) ||
        s.titleTe.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.beneficiaryType.toLowerCase().includes(q)
      ) {
        list.push({
          id: `scheme-${s.id}`,
          title: language === 'te' ? s.titleTe : s.title,
          subtitle: `${s.beneficiaryType} • Benefit: ${s.financialAssistance}`,
          categoryBadge: 'Govt Scheme',
          categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: Landmark,
          targetTab: 'schemes',
          recordId: s.id,
        });
      }
    });

    // 5. Education Scholarships & Resources
    scholarships.forEach((sc) => {
      if (
        sc.name.toLowerCase().includes(q) ||
        sc.category.toLowerCase().includes(q) ||
        sc.targetAudience.toLowerCase().includes(q)
      ) {
        list.push({
          id: `sch-${sc.id}`,
          title: sc.name,
          subtitle: `${sc.targetAudience} • Benefit: ${sc.amount}`,
          categoryBadge: 'Education',
          categoryColor: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: GraduationCap,
          targetTab: 'education',
          recordId: sc.id,
        });
      }
    });

    resources.forEach((r) => {
      if (
        r.title.toLowerCase().includes(q) ||
        r.titleTe?.toLowerCase().includes(q) ||
        r.classOrExam.toLowerCase().includes(q)
      ) {
        list.push({
          id: `res-${r.id}`,
          title: language === 'te' && r.titleTe ? r.titleTe : r.title,
          subtitle: `${r.classOrExam} • ${r.type}`,
          categoryBadge: 'Study Material',
          categoryColor: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: GraduationCap,
          targetTab: 'education',
          recordId: r.id,
        });
      }
    });

    // 6. Shops
    shops.forEach((sh) => {
      if (
        sh.name.toLowerCase().includes(q) ||
        sh.nameTe?.toLowerCase().includes(q) ||
        sh.category.toLowerCase().includes(q) ||
        sh.ownerName.toLowerCase().includes(q)
      ) {
        list.push({
          id: `shop-${sh.id}`,
          title: language === 'te' && sh.nameTe ? sh.nameTe : sh.name,
          subtitle: `${sh.category} • ${sh.village} • Owner: ${sh.ownerName}`,
          categoryBadge: 'Local Shop',
          categoryColor: 'bg-teal-100 text-teal-800 border-teal-200',
          icon: Store,
          targetTab: 'shops',
          recordId: sh.id,
        });
      }
    });

    // 7. Announcements
    announcements.forEach((a) => {
      if (
        a.title.toLowerCase().includes(q) ||
        a.titleTe?.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
      ) {
        list.push({
          id: `ann-${a.id}`,
          title: language === 'te' && a.titleTe ? a.titleTe : a.title,
          subtitle: `${a.category} • ${a.issuedBy}`,
          categoryBadge: 'Notice',
          categoryColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: Megaphone,
          targetTab: 'home',
          recordId: a.id,
        });
      }
    });

    // 8. Health & Emergency
    hospitals.forEach((h) => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.village.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q)
      ) {
        list.push({
          id: `hosp-${h.id}`,
          title: h.name,
          subtitle: `${h.type} • ${h.village} • 📞 ${h.phone}`,
          categoryBadge: 'Health / PHC',
          categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: HeartPulse,
          targetTab: 'health',
          recordId: h.id,
        });
      }
    });

    return list.slice(0, 10);
  }, [searchQuery, complaints, workers, jobs, schemes, scholarships, resources, shops, announcements, hospitals, language]);

  const handleSelectResult = (item: SearchResultItem) => {
    setActiveTab(item.targetTab);
    setIsDropdownOpen(false);
    setMobileSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        handleSelectResult(searchResults[0]);
      } else {
        // Jump to search/directory tab based on query keyword
        const q = searchQuery.toLowerCase();
        if (q.includes('road') || q.includes('drain') || q.includes('water') || q.includes('pothole')) {
          setActiveTab('complaints');
        } else if (q.includes('worker') || q.includes('electrician') || q.includes('plumber')) {
          setActiveTab('workers');
        } else if (q.includes('job') || q.includes('work') || q.includes('wage')) {
          setActiveTab('jobs');
        } else if (q.includes('scheme') || q.includes('bharosa') || q.includes('pension')) {
          setActiveTab('schemes');
        } else if (q.includes('school') || q.includes('exam') || q.includes('book') || q.includes('scholarship')) {
          setActiveTab('education');
        } else {
          setActiveTab('home');
        }
        setIsDropdownOpen(false);
        setMobileSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setMobileSearchOpen(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Utility Ribbon */}
      <div className="bg-slate-950/90 px-4 py-1.5 border-b border-slate-800 text-[11px] flex justify-between items-center text-slate-400">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-black text-teal-400 shrink-0">గ్రామ కనెక్ట్</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="font-semibold text-slate-300 truncate hidden sm:inline">
            One Digital Platform for Rural and Urban Community Services
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden lg:inline bg-teal-950/80 text-teal-300 border border-teal-800/80 px-2 py-0.2 rounded font-semibold text-[10px]">
            Andhra Pradesh Smart Governance
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors bg-slate-800/80 hover:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700 cursor-pointer"
            title="Toggle Telugu / English Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Sidebar Toggle + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Toggle Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-all shrink-0">
                <span className="text-xl font-black text-white">గ</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg text-white tracking-tight">
                    GramConnect
                  </span>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.2 bg-teal-900/80 text-teal-300 rounded border border-teal-700">
                    360°
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate max-w-[190px] sm:max-w-none">
                  AI-Powered Smart Community Connect Platform
                </p>
              </div>
            </div>
          </div>

          {/* Center Interactive Search Bar (Desktop & Tablet) */}
          <div
            ref={searchContainerRef}
            className="hidden md:block relative flex-1 max-w-md lg:max-w-lg mx-2"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-teal-400 absolute left-3 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  language === 'te'
                    ? 'కార్మికులు, పనులు, పథకాలు, సమస్యలు శోధించండి...'
                    : 'Search complaints, workers, jobs, schemes, education...'
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-9 py-2 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsDropdownOpen(false);
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Suggestions Panel */}
            {isDropdownOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 text-slate-900 animate-in fade-in zoom-in-95 max-h-96 overflow-y-auto">
                <div className="p-2.5 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 flex justify-between items-center">
                  <span>Results for "{searchQuery}"</span>
                  <span className="text-teal-700 font-extrabold">{searchResults.length} matches</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-5 text-center text-xs space-y-2">
                    <p className="font-bold text-slate-700">No results found for "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-500">
                      Try searching with other terms:
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {['Electrician', 'Road damage', 'Rythu Bharosa', 'APPSC', 'Kirana', 'Ambulance'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              setIsDropdownOpen(true);
                            }}
                            className="text-[10px] font-semibold bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="p-3 hover:bg-teal-50/70 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white text-slate-700 group-hover:text-teal-700 transition-colors shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="font-bold text-xs text-slate-900 group-hover:text-teal-900 truncate">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${item.categoryColor}`}
                            >
                              {item.categoryBadge}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Mobile Search, SOS, Notifications & User */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Search platform"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Emergency SOS Shortcut Button */}
            <button
              onClick={onOpenSos}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md border border-red-500 transition-all cursor-pointer animate-pulse"
              title="24/7 Emergency SOS Alert (Police 100 / 108 Ambulance)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>SOS</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="View Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {currentUser ? (
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-left cursor-pointer"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black text-[11px] flex items-center justify-center border border-teal-400">
                    {getInitials(currentUser.name)}
                  </div>
                )}
                <div className="hidden sm:block pr-1">
                  <div className="text-[11px] font-bold text-slate-100 leading-tight truncate max-w-[90px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-teal-400 capitalize leading-none">
                    {currentUser.userType || currentUser.role}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                <UserCircle className="w-4 h-4" />
                <span>{language === 'te' ? 'లాగిన్' : 'Login'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Input Drawer (Visible when toggled on mobile) */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-800 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="w-4 h-4 text-teal-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder={
                  language === 'te'
                    ? 'కార్మికులు, పనులు, పథకాలు, సమస్యలు శోధించండి...'
                    : 'Search complaints, workers, jobs, schemes...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full pl-9 pr-9 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Dropdown Suggestions */}
            {searchQuery.trim().length >= 2 && (
              <div className="mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-900 max-h-72 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No results found for "{searchQuery}".
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="p-3 hover:bg-teal-50 cursor-pointer flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <Icon className="w-4 h-4 text-teal-600 shrink-0" />
                            <div className="overflow-hidden">
                              <div className="font-bold text-xs text-slate-900 truncate">
                                {item.title}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${item.categoryColor} shrink-0`}
                          >
                            {item.categoryBadge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
