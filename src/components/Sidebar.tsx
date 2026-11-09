import React from 'react';
import {
  Home,
  ShieldAlert,
  Users,
  Briefcase,
  GraduationCap,
  Landmark,
  Store,
  HeartPulse,
  Bot,
  FileCheck2,
  ClipboardList,
  User,
  HelpCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { t } from '../translations';

interface SidebarMenuItem {
  id: string;
  labelEn: string;
  labelTe: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth: boolean;
  badge?: string;
  highlight?: boolean;
  authPrompt?: string;
}

interface SidebarProps {
  language: Language;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  currentUser: UserAccount | null;
  onOpenAuth: (prompt?: string) => void;
  onLogout: () => void;
  complaintsCount?: number;
  openJobsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  language,
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  currentUser,
  onOpenAuth,
  onLogout,
  complaintsCount,
  openJobsCount,
}) => {
  const menuItems: SidebarMenuItem[] = [
    {
      id: 'home',
      labelEn: 'Home Dashboard',
      labelTe: 'ప్రధాన డాష్‌బోర్డ్',
      icon: Home,
      requiresAuth: false,
    },
    {
      id: 'complaints',
      labelEn: 'Grievances & Complaints',
      labelTe: 'సమస్యల నమోదు & పరిష్కారం',
      icon: ShieldAlert,
      requiresAuth: false,
      badge: complaintsCount ? `${complaintsCount}` : undefined,
    },
    {
      id: 'workers',
      labelEn: 'Worker Directory',
      labelTe: 'కార్మికులు & సేవల విభాగం',
      icon: Users,
      requiresAuth: false,
    },
    {
      id: 'jobs',
      labelEn: 'Jobs & Part-Time Work',
      labelTe: 'ఉపాధి & పనుల కేంద్రం',
      icon: Briefcase,
      requiresAuth: false,
      badge: openJobsCount ? `${openJobsCount}` : undefined,
    },
    {
      id: 'education',
      labelEn: 'Education & Career Hub',
      labelTe: 'విద్య, స్కాలర్‌షిప్‌లు & కెరీర్',
      icon: GraduationCap,
      requiresAuth: false,
    },
    {
      id: 'schemes',
      labelEn: 'Government Schemes',
      labelTe: 'ప్రభుత్వ సంక్షేమ పథకాలు',
      icon: Landmark,
      requiresAuth: false,
    },
    {
      id: 'shops',
      labelEn: 'Local Shops & Services',
      labelTe: 'స్థానిక దుకాణాలు & సేవలు',
      icon: Store,
      requiresAuth: false,
    },
    {
      id: 'health',
      labelEn: 'Health & Emergency',
      labelTe: 'ఆరోగ్యం & అత్యవసర సేవలు',
      icon: HeartPulse,
      requiresAuth: false,
    },
    {
      id: 'ai',
      labelEn: 'AI Village Assistant',
      labelTe: 'AI గ్రామ మిత్ర అసిస్టెంట్',
      icon: Bot,
      requiresAuth: false,
      highlight: true,
    },
    {
      id: 'my-applications',
      labelEn: 'My Applications',
      labelTe: 'నా ఉద్యోగ దరఖాస్తులు',
      icon: FileCheck2,
      requiresAuth: true,
      authPrompt: 'Please Login or Register to view your job applications status',
    },
    {
      id: 'my-complaints',
      labelEn: 'My Complaints',
      labelTe: 'నా సమస్యల జాబితా',
      icon: ClipboardList,
      requiresAuth: true,
      authPrompt: 'Please Login or Register to view and track your submitted complaints',
    },
    {
      id: 'my-profile',
      labelEn: 'My Profile',
      labelTe: 'నా ప్రొఫైల్ వివరాలు',
      icon: User,
      requiresAuth: true,
      authPrompt: 'Please Login or Register to access your account profile',
    },
    {
      id: 'help',
      labelEn: 'Help & Support',
      labelTe: 'సహాయం & మార్గదర్శకాలు',
      icon: HelpCircle,
      requiresAuth: false,
    },
  ];

  // If user is Grama Secretary / admin, add secretary dashboard
  if (currentUser?.role === 'admin') {
    menuItems.splice(1, 0, {
      id: 'admin',
      labelEn: 'Grama Secretary Dashboard',
      labelTe: 'గ్రామ కార్యదర్శి డ్యాష్‌బోర్డు',
      icon: ShieldCheck,
      requiresAuth: true,
      authPrompt: 'Authorized Grama Secretary access only',
      highlight: true,
    });
  }

  const handleSelectTab = (item: (typeof menuItems)[0]) => {
    if (item.requiresAuth && !currentUser) {
      onOpenAuth(item.authPrompt);
      return;
    }
    setActiveTab(item.id);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      {/* Top Header / Branding */}
      <div>
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-md group-hover:scale-105 transition-transform shrink-0">
              గ
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="overflow-hidden">
                <div className="font-black text-sm text-white tracking-tight leading-none truncate">
                  GramConnect
                </div>
                <div className="text-[10px] text-teal-400 font-semibold truncate mt-0.5">
                  {language === 'te' ? 'స్మార్ట్ విలేజ్ 360°' : 'Smart Community'}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Pill if logged in */}
        {(!isCollapsed || mobileOpen) && currentUser && (
          <div className="mx-3 my-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-teal-300 capitalize truncate leading-none">
                  {currentUser.userType || currentUser.role}
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = language === 'te' ? item.labelTe : item.labelEn;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => handleSelectTab(item)}
                title={isCollapsed && !mobileOpen ? label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30 font-extrabold'
                    : item.highlight
                    ? 'text-teal-300 bg-teal-950/40 hover:bg-teal-900/40 hover:text-teal-200'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="relative shrink-0">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-400'
                    }`}
                  />
                  {item.badge && isCollapsed && !mobileOpen && (
                    <span className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full bg-teal-400"></span>
                  )}
                </div>

                {(!isCollapsed || mobileOpen) && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate text-left">{label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-800 text-teal-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Secretary Login Prompt if Guest */}
      {(!isCollapsed || mobileOpen) && (
        <div className="p-3 border-t border-slate-800 text-[11px] space-y-2">
          {!currentUser ? (
            <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'అధికారిక లాగిన్' : 'Official Login'}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {language === 'te'
                  ? 'గ్రామ సమస్యలు, కార్యదర్శి విధుల కోసం లాగిన్ అవ్వండి.'
                  : 'Login to access Grama Secretary panel, raise complaints, or apply for jobs.'}
              </p>
              <button
                onClick={() => onOpenAuth()}
                className="w-full py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-bold text-xs shadow-xs transition-colors"
              >
                {language === 'te' ? 'లాగిన్ / రిజిస్టర్' : 'Login / Register'}
              </button>
            </div>
          ) : (
            <div className="text-slate-400 text-[10px] text-center">
              <span>GramConnect 360° AP</span>
              <div className="text-teal-400 font-bold">One Digital Platform</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block bg-slate-900 border-r border-slate-800 text-slate-100 transition-all duration-300 shrink-0 sticky top-0 h-screen z-30 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-out Drawer with Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-900 border-r border-slate-800 text-slate-100 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
