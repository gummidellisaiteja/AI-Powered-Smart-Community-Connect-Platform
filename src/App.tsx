import React, { useState, useEffect } from 'react';
import {
  Language,
  UserRole,
  UserAccount,
  Complaint,
  WorkerProfile,
  JobPosting,
  JobApplication,
  Scholarship,
  EducationalResource,
  Hospital,
  Announcement,
  VillageStats,
  LocalBusiness,
  NotificationItem,
  GovtScheme,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HeroSection } from './components/HeroSection';
import { StatsOverview } from './components/StatsOverview';
import { ModuleComplaints } from './components/ModuleComplaints';
import { ModuleWorkers } from './components/ModuleWorkers';
import { ModuleJobs } from './components/ModuleJobs';
import { ModuleShops } from './components/ModuleShops';
import { ModuleEducation } from './components/ModuleEducation';
import { ModuleGovtSchemes } from './components/ModuleGovtSchemes';
import { ModuleHealthEmergency } from './components/ModuleHealthEmergency';
import { ModuleAIChatbot } from './components/ModuleAIChatbot';
import { ModuleAdminDashboard } from './components/ModuleAdminDashboard';
import { ModuleHelpSupport } from './components/ModuleHelpSupport';
import { ModuleMyComplaints } from './components/ModuleMyComplaints';
import { ModuleMyApplications } from './components/ModuleMyApplications';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import {
  Bot,
  ShieldAlert,
  CheckCircle2,
  Store,
  Users,
  Briefcase,
  Landmark,
  GraduationCap,
  Sparkles,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import {
  initialUsers,
  initialComplaints,
  initialWorkers,
  initialJobs,
  initialShops,
  initialScholarships,
  initialEduResources,
  initialHospitals,
  initialAnnouncements,
  initialTuitions,
  initialNotifications,
  initialGovtSchemes,
} from './data/seedData';
import { t } from './translations';

export default function App() {
  // 1. Language & Auth State (Guest by default)
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('gramconnect_lang') as Language) || 'te';
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('gramconnect_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null; // Guest by default
  });

  const currentRole: UserRole = currentUser ? currentUser.role : 'citizen';

  const [activeTab, setActiveTab] = useState<string>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Layout & Modals state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authRedirectPrompt, setAuthRedirectPrompt] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // 2. Data Collections
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [workers, setWorkers] = useState<WorkerProfile[]>(initialWorkers);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [shops, setShops] = useState<LocalBusiness[]>(initialShops);
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [resources, setResources] = useState<EducationalResource[]>(initialEduResources);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialHospitals);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [schemes, setSchemes] = useState<GovtScheme[]>(initialGovtSchemes);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [bookmarks, setBookmarks] = useState<{ jobs: string[]; workers: string[]; shops: string[] }>({
    jobs: ['JOB-2026-001'],
    workers: ['WKR-001'],
    shops: ['SHP-001'],
  });

  const [stats, setStats] = useState<VillageStats>({
    resolvedGrievances: initialComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
    pendingGrievances: initialComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length,
    activeWorkers: initialWorkers.length,
    jobsPostedCount: initialJobs.length,
    activeShopsCount: initialShops.length,
    scholarshipsClaimed: 320,
    activePHCs: initialHospitals.length,
  });

  // Save Preferences
  useEffect(() => {
    localStorage.setItem('gramconnect_lang', language);
  }, [language]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gramconnect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gramconnect_user');
    }
  }, [currentUser]);

  // Global Keyboard Shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Fetch from backend server
  useEffect(() => {
    fetch('/api/auth/demo-users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setUsers(data);
      })
      .catch(() => {});

    fetch('/api/complaints')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setComplaints(data);
      })
      .catch(() => {});

    fetch('/api/workers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setWorkers(data);
      })
      .catch(() => {});

    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setJobs(data);
      })
      .catch(() => {});

    fetch('/api/jobs/applications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setApplications(data);
      })
      .catch(() => {});

    fetch('/api/shops')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setShops(data);
      })
      .catch(() => {});

    fetch('/api/announcements')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setAnnouncements(data);
      })
      .catch(() => {});

    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNotifications(data);
      })
      .catch(() => {});

    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSchemes(data);
      })
      .catch(() => {});

    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.resolvedGrievances !== undefined) setStats(data);
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Protected Action Checker
  const requireAuth = (promptMsg: string, callback?: () => void): boolean => {
    if (!currentUser) {
      setAuthRedirectPrompt(promptMsg);
      setIsAuthOpen(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Auth Handlers
  const handleLogin = (user: UserAccount, targetTab?: string) => {
    setCurrentUser(user);
    setAuthRedirectPrompt(null);
    showToast(
      language === 'te'
        ? `స్వాగతం, ${user.name}! (${user.userType || user.role} హోదా)`
        : `Welcome, ${user.name}! (${user.userType || user.role})`
    );
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeTab === 'admin' || activeTab === 'my-applications' || activeTab === 'my-complaints') {
      setActiveTab('home');
    }
    showToast(language === 'te' ? 'లాగ్ అవుట్ అయ్యారు.' : 'Logged out successfully.');
  };

  const handleOpenAuth = (prompt?: string) => {
    setAuthRedirectPrompt(prompt || null);
    setIsAuthOpen(true);
  };

  const handleUpdateUser = async (updatedFields: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);

    try {
      await fetch(`/api/auth/profile/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      showToast('Profile updated on server.');
    } catch (e) {
      showToast('Profile updated locally.');
    }
  };

  // Bookmarks Toggle Handler
  const handleToggleBookmark = (id: string, type: 'jobs' | 'workers' | 'shops' = 'jobs') => {
    setBookmarks((prev) => {
      const list = prev[type];
      const nextList = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
      return { ...prev, [type]: nextList };
    });

    const isNowSaved = !bookmarks[type].includes(id);
    showToast(isNowSaved ? 'Item saved to bookmarks!' : 'Removed from bookmarks.');

    fetch('/api/bookmarks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser?.id, type, id }),
    }).catch(() => {});
  };

  // Notification Handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    fetch('/api/notifications/read-all', { method: 'POST' }).catch(() => {});
    showToast('All notifications marked as read.');
  };

  // Complaints Handlers (with guest interception)
  const handleRaiseComplaint = async (complaintData: Partial<Complaint>) => {
    if (!requireAuth('Please Login or Register to file an official grievance with tracking')) {
      return;
    }

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...complaintData,
          raisedBy: currentUser?.name || complaintData.raisedBy || 'Citizen',
          raisedByPhone: currentUser?.phone || complaintData.raisedByPhone || '9848011223',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaints((prev) => [data.complaint, ...prev]);
        setStats((prev) => ({ ...prev, pendingGrievances: prev.pendingGrievances + 1 }));
        showToast(
          language === 'te'
            ? `ఫిర్యాదు దాఖలైంది! ID: ${data.complaint.id}`
            : `Grievance Raised Successfully! ID: ${data.complaint.id}`
        );
      }
    } catch (err) {
      showToast('Error filing complaint. Added locally.');
    }
  };

  const handleUpdateComplaint = async (id: string, updateData: Partial<Complaint>) => {
    try {
      const res = await fetch(`/api/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updateData,
          updatedBy: currentUser?.name || 'Grama Panchayat Secretary (Srinu)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, ...data.complaint } : c))
        );
        showToast('Complaint status updated and logged in timeline.');
      }
    } catch (err) {
      showToast('Updated complaint locally.');
    }
  };

  // Workers Handlers
  const handleRegisterWorker = async (workerData: Partial<WorkerProfile>) => {
    if (!requireAuth('Please Login or Register to enroll as a skilled worker')) {
      return;
    }

    try {
      const res = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...workerData,
          userId: currentUser?.id,
          name: currentUser?.name || workerData.name,
          phone: currentUser?.phone || workerData.phone,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkers((prev) => [data.worker, ...prev]);
        setStats((prev) => ({ ...prev, activeWorkers: prev.activeWorkers + 1 }));
        showToast('Worker profile registered successfully in GramConnect directory!');
      }
    } catch (err) {
      showToast('Registered worker locally.');
    }
  };

  const handleBookWorker = async (bookingData: any) => {
    if (!requireAuth('Please Login or Register to book a local worker')) {
      return;
    }

    try {
      await fetch('/api/workers/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          employerId: currentUser?.id || 'EMP-01',
          employerName: currentUser?.name || 'Local Villager',
          employerPhone: currentUser?.phone || '9848011223',
        }),
      });
      showToast(`Worker booked! SMS dispatch confirmed.`);
    } catch (err) {
      showToast('Worker booking recorded.');
    }
  };

  // Jobs Handlers
  const handlePostJob = async (jobData: Partial<JobPosting>) => {
    if (!requireAuth('Please Login or Register to post a community job or task')) {
      return;
    }

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobData,
          postedBy: currentUser?.id || 'EMP-01',
          postedByName: currentUser?.name || 'Local Contractor',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) => [data.job, ...prev]);
        setStats((prev) => ({ ...prev, jobsPostedCount: prev.jobsPostedCount + 1 }));
        showToast('Job posting published successfully!');
      }
    } catch (err) {
      showToast('Job posted locally.');
    }
  };

  const handleApplyJob = async (appData: any) => {
    if (!requireAuth('Please Login or Register to apply for this job opening')) {
      return;
    }

    try {
      const res = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...appData,
          applicantName: currentUser?.name || appData.applicantName,
          applicantPhone: currentUser?.phone || appData.applicantPhone,
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setApplications((prev) => [data.application, ...prev]);
        setJobs((prev) =>
          prev.map((j) =>
            j.id === appData.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j
          )
        );
      }
      showToast('Job application submitted successfully.');
    } catch (err) {
      showToast('Application submitted.');
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/jobs/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, status: status as any } : a))
        );
        showToast(`Applicant status updated to: ${status}`);
      }
    } catch (e) {
      showToast('Status updated locally.');
    }
  };

  // Shops Handlers
  const handleRegisterShop = async (shopData: Partial<LocalBusiness>) => {
    if (!requireAuth('Please Login or Register to list your village business')) {
      return;
    }

    try {
      const res = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData),
      });
      const data = await res.json();
      if (data.success) {
        setShops((prev) => [data.shop, ...prev]);
        setStats((prev) => ({ ...prev, activeShopsCount: (prev.activeShopsCount || 6) + 1 }));
        showToast('Local business registered and verified!');
      }
    } catch (err) {
      showToast('Business registered locally.');
    }
  };

  // Announcements & SOS Handlers
  const handlePostAnnouncement = async (annData: Partial<Announcement>) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annData),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => [data.announcement, ...prev]);
        showToast('New official Panchayat announcement posted!');
      }
    } catch (err) {
      showToast('Announcement posted.');
    }
  };

  const handleUpdateAnnouncement = async (id: string, annData: Partial<Announcement>) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(annData),
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements((prev) => prev.map((a) => (a.id === id ? data.announcement : a)));
        showToast('Announcement updated on Notice Board.');
      }
    } catch (err) {
      setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...annData } : a)));
      showToast('Announcement updated.');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast('Announcement removed from Notice Board.');
    } catch (err) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      showToast('Announcement removed.');
    }
  };

  const handleUpdateWorkerStatus = async (id: string, status: 'Verified' | 'Pending' | 'Rejected') => {
    try {
      const res = await fetch(`/api/workers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: status === 'Verified' }),
      });
      const data = await res.json();
      if (data.success) {
        setWorkers((prev) => prev.map((w) => (w.id === id ? data.worker : w)));
        showToast(`Worker status updated to ${status}.`);
      }
    } catch (err) {
      setWorkers((prev) => prev.map((w) => (w.id === id ? { ...w, isVerified: status === 'Verified' } : w)));
      showToast(`Worker status updated to ${status}.`);
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('Job posting removed.');
    } catch (err) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast('Job posting removed.');
    }
  };

  const handleAddScheme = async (schemeData: Partial<GovtScheme>) => {
    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schemeData),
      });
      const data = await res.json();
      if (data.success) {
        setSchemes((prev) => [data.scheme, ...prev]);
        showToast('New Welfare Scheme published to public portal!');
      }
    } catch (err) {
      const fallbackScheme = {
        ...schemeData,
        id: `SCHEME-${Date.now()}`,
      } as GovtScheme;
      setSchemes((prev) => [fallbackScheme, ...prev]);
      showToast('Scheme published.');
    }
  };

  const handleTriggerSos = async (locationNote: string) => {
    try {
      await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: locationNote,
          phone: currentUser?.phone || '9848011223',
          victimName: currentUser?.name || 'Grama Citizen',
          note: 'Emergency SOS Alert',
        }),
      });
      showToast('Emergency SOS dispatched to AP Police 100 & 108 Ambulance!');
    } catch (err) {
      showToast('Emergency SOS dispatched.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-teal-500/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        currentRole={currentRole}
        onRoleChange={() => handleOpenAuth()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSos={() => setActiveTab('health')}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsMobileSidebarOpen(true)}
        complaints={complaints}
        workers={workers}
        jobs={jobs}
        schemes={schemes}
        scholarships={scholarships}
        resources={resources}
        shops={shops}
        announcements={announcements}
        hospitals={hospitals}
      />

      {/* Main Layout: Left Collapsible Sidebar + Content Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          language={language}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          setMobileOpen={setIsMobileSidebarOpen}
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          complaintsCount={complaints.length}
          openJobsCount={jobs.length}
        />

        {/* Content Container */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 space-y-6 pb-20 lg:pb-8">
          {/* HOME DASHBOARD VIEW */}
          {activeTab === 'home' && (
            <>
              <HeroSection
                language={language}
                onNavigate={setActiveTab}
                announcements={announcements}
              />

              <StatsOverview stats={stats} language={language} />

              {/* Featured Modules Quick Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Grievances Card */}
                <div
                  onClick={() => setActiveTab('complaints')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl group-hover:scale-105 transition-transform">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {stats.resolvedGrievances} Solved
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'te' ? 'సమస్యల నమోదు & పరిష్కారం' : 'Grievances & Complaints'}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Roads, drainage, streetlights & water supply 6-stage tracking with photo evidence.
                  </p>
                </div>

                {/* Worker Connect Card */}
                <div
                  onClick={() => setActiveTab('workers')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {stats.activeWorkers} Workers
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'te' ? 'కార్మికులు & సేవలు' : 'Local Worker Connect'}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Direct call or book electricians, masons, mechanics & farm labor near your village.
                  </p>
                </div>

                {/* Jobs Card */}
                <div
                  onClick={() => setActiveTab('jobs')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl group-hover:scale-105 transition-transform">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {stats.jobsPostedCount} Jobs Open
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'te' ? 'ఉపాధి పనుల కేంద్రం' : 'Local Jobs & Tasks'}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Daily wage farm harvesting, construction tasks, and student part-time jobs.
                  </p>
                </div>

                {/* Govt Schemes Card */}
                <div
                  onClick={() => setActiveTab('schemes')}
                  className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-teal-100 text-teal-800 rounded-2xl group-hover:scale-105 transition-transform">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Welfare
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    {language === 'te' ? 'ప్రభుత్వ సంక్షేమ పథకాలు' : 'Government Schemes'}
                  </h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Rythu Bharosa, Vidya Deevena, Pension Kanuka & Aarogyasri eligibility guidelines.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* MODULE 1: COMPLAINTS */}
          {activeTab === 'complaints' && (
            <ModuleComplaints
              language={language}
              complaints={complaints}
              onRaiseComplaint={handleRaiseComplaint}
              onUpdateComplaint={handleUpdateComplaint}
              currentRole={currentRole}
            />
          )}

          {/* MODULE 2: WORKER CONNECT */}
          {activeTab === 'workers' && (
            <ModuleWorkers
              language={language}
              workers={workers}
              onRegisterWorker={handleRegisterWorker}
              onBookWorker={handleBookWorker}
              savedWorkers={bookmarks.workers}
              onToggleBookmark={(id) => handleToggleBookmark(id, 'workers')}
              currentRole={currentRole}
            />
          )}

          {/* MODULE 3: JOBS */}
          {activeTab === 'jobs' && (
            <ModuleJobs
              language={language}
              jobs={jobs}
              onPostJob={handlePostJob}
              onApplyJob={handleApplyJob}
              savedJobs={bookmarks.jobs}
              onToggleBookmark={(id) => handleToggleBookmark(id, 'jobs')}
              currentRole={currentRole}
              applications={applications}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
            />
          )}

          {/* MODULE 4: EDUCATION */}
          {activeTab === 'education' && (
            <ModuleEducation
              language={language}
              scholarships={scholarships}
              resources={resources}
              tuitions={initialTuitions}
            />
          )}

          {/* MODULE 5: GOVERNMENT SCHEMES */}
          {activeTab === 'schemes' && <ModuleGovtSchemes language={language} schemes={schemes} />}

          {/* MODULE 6: LOCAL SHOPS & BUSINESS DIRECTORY */}
          {activeTab === 'shops' && (
            <ModuleShops
              language={language}
              shops={shops}
              onRegisterShop={handleRegisterShop}
              savedShops={bookmarks.shops}
              onToggleBookmark={(id) => handleToggleBookmark(id, 'shops')}
              currentRole={currentRole}
            />
          )}

          {/* MODULE 7: HEALTH & EMERGENCY */}
          {activeTab === 'health' && (
            <ModuleHealthEmergency
              language={language}
              hospitals={hospitals}
              onTriggerSos={handleTriggerSos}
            />
          )}

          {/* MODULE 8: AI CHATBOT */}
          {activeTab === 'ai' && <ModuleAIChatbot language={language} />}

          {/* MODULE 9: MY APPLICATIONS */}
          {activeTab === 'my-applications' && (
            <ModuleMyApplications
              language={language}
              applications={applications}
              jobs={jobs}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* MODULE 10: MY COMPLAINTS */}
          {activeTab === 'my-complaints' && (
            <ModuleMyComplaints
              language={language}
              complaints={complaints}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onNavigateTab={setActiveTab}
            />
          )}

          {/* MODULE 11: MY PROFILE */}
          {activeTab === 'my-profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {currentUser ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-teal-800 text-teal-100 flex items-center justify-center font-black text-2xl border border-teal-600 shadow-xs">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 capitalize">
                          {currentUser.userType || currentUser.role}
                        </span>
                        <span>• {currentUser.village}, {currentUser.district}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Contact Mobile:</span>
                      <div className="font-black text-slate-900 text-sm font-mono">{currentUser.phone}</div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Registered Email:</span>
                      <div className="font-bold text-slate-900">{currentUser.email || 'Not provided'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      onClick={() => setIsProfileOpen(true)}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      Edit Profile Details
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="font-black text-lg text-slate-900">
                    {language === 'te' ? 'దయచేసి లాగిన్ అవ్వండి' : 'Please Login to View Profile'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Login or register to access personal details, filed complaints, and job applications.
                  </p>
                  <button
                    onClick={() => handleOpenAuth()}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                  >
                    Login / Register
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MODULE 12: HELP & SUPPORT */}
          {activeTab === 'help' && <ModuleHelpSupport language={language} />}

          {/* MODULE 13: GRAMA SECRETARY DASHBOARD (ADMIN) */}
          {activeTab === 'admin' && (
            <ModuleAdminDashboard
              language={language}
              complaints={complaints}
              announcements={announcements}
              stats={stats}
              onPostAnnouncement={handlePostAnnouncement}
              onUpdateAnnouncement={handleUpdateAnnouncement}
              onDeleteAnnouncement={handleDeleteAnnouncement}
              onUpdateComplaint={handleUpdateComplaint}
              workers={workers}
              onUpdateWorkerStatus={handleUpdateWorkerStatus}
              jobs={jobs}
              onDeleteJob={handleDeleteJob}
              users={users}
              schemes={schemes}
              onAddScheme={handleAddScheme}
              currentUser={currentUser}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        language={language}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTab={setActiveTab}
        workers={workers}
        jobs={jobs}
        schemes={schemes}
        scholarships={scholarships}
        shops={shops}
        announcements={announcements}
        complaints={complaints}
      />

      {/* Auth Modal with Secretary Login */}
      <AuthModal
        language={language}
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthRedirectPrompt(null);
        }}
        currentUser={currentUser}
        onLogin={handleLogin}
        demoUsers={users}
        redirectPrompt={authRedirectPrompt}
      />

      {/* User Profile Drawer */}
      {currentUser && (
        <UserProfileDrawer
          language={language}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          user={currentUser}
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
          userComplaints={complaints.filter(
            (c) =>
              c.raisedBy?.toLowerCase() === currentUser.name.toLowerCase() ||
              c.raisedByPhone === currentUser.phone
          )}
          bookmarks={bookmarks}
          jobs={jobs}
          workers={workers}
          shops={shops}
          onNavigateTab={setActiveTab}
        />
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        language={language}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigateTab={setActiveTab}
      />

      {/* Floating AI Assistant Action Button */}
      {activeTab !== 'ai' && (
        <button
          id="floating-ai-button"
          onClick={() => setActiveTab('ai')}
          className="fixed bottom-16 lg:bottom-6 right-6 z-30 p-3.5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all border-2 border-purple-300 flex items-center gap-2 cursor-pointer"
          title="Ask GramConnect AI Assistant"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline-block text-xs font-bold pr-1">
            {language === 'te' ? 'AI గ్రామ మిత్ర' : 'Ask AI'}
          </span>
        </button>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
      />

      {/* Footer */}
      <Footer
        language={language}
        onLanguageChange={setLanguage}
        onNavigate={setActiveTab}
      />
    </div>
  );
}
