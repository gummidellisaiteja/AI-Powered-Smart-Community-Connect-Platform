import React, { useState } from 'react';
import {
  Building2,
  Megaphone,
  ShieldAlert,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  BarChart2,
  UserCheck,
  Download,
  Printer,
  Camera,
  Eye,
  Check,
  AlertCircle,
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  ShieldCheck,
  User,
  ArrowRight,
  Edit,
  Trash2,
  Lock,
  KeyRound,
  Landmark,
  X,
} from 'lucide-react';
import {
  Language,
  Complaint,
  Announcement,
  VillageStats,
  ComplaintStatus,
  WorkerProfile,
  JobPosting,
  UserAccount,
  GovtScheme,
} from '../types';
import { t } from '../translations';

interface ModuleAdminDashboardProps {
  language: Language;
  complaints: Complaint[];
  announcements: Announcement[];
  stats: VillageStats;
  onPostAnnouncement: (ann: Partial<Announcement>) => void;
  onUpdateAnnouncement?: (id: string, ann: Partial<Announcement>) => void;
  onDeleteAnnouncement?: (id: string) => void;
  onUpdateComplaint: (id: string, updateData: Partial<Complaint>) => void;
  workers?: WorkerProfile[];
  onUpdateWorkerStatus?: (id: string, status: 'Verified' | 'Pending' | 'Rejected') => void;
  jobs?: JobPosting[];
  onDeleteJob?: (id: string) => void;
  users?: UserAccount[];
  schemes?: GovtScheme[];
  onAddScheme?: (scheme: Partial<GovtScheme>) => void;
  currentUser?: UserAccount | null;
}

export const ModuleAdminDashboard: React.FC<ModuleAdminDashboardProps> = ({
  language,
  complaints,
  announcements,
  stats,
  onPostAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onUpdateComplaint,
  workers = [],
  onUpdateWorkerStatus,
  jobs = [],
  onDeleteJob,
  users = [],
  schemes = [],
  onAddScheme,
  currentUser,
}) => {
  // 8 Secretary Sub-Tabs
  const [adminTab, setAdminTab] = useState<
    'triage' | 'citizens' | 'workers' | 'jobs' | 'announcements' | 'schemes' | 'analytics' | 'profile'
  >('triage');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<
    'Scheme' | 'Panchayat Notice' | 'Health Drive' | 'Water Supply' | 'Power Outage' | 'General'
  >('Panchayat Notice');
  const [annSuccessMsg, setAnnSuccessMsg] = useState('');
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);

  // Complaint Triage modal
  const [triageComplaint, setTriageComplaint] = useState<Complaint | null>(null);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('Under Review');
  const [targetDepartment, setTargetDepartment] = useState('Panchayat Public Health & Sanitation');
  const [assignedOfficer, setAssignedOfficer] = useState('Sri K. Ramaiah (Panchayat Engineering Assistant)');
  const [adminNotes, setAdminNotes] = useState('');
  const [afterPhotoUrl, setAfterPhotoUrl] = useState('');

  // Filters for Complaints Triage
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Citizen management search
  const [citizenSearch, setCitizenSearch] = useState('');

  // Scheme creation state
  const [schemeTitle, setSchemeTitle] = useState('');
  const [schemeTitleTe, setSchemeTitleTe] = useState('');
  const [schemeCategory, setSchemeCategory] = useState('Agriculture & Rythu');
  const [schemeDept, setSchemeDept] = useState('Agriculture & Cooperation Dept, AP');
  const [schemeAssistance, setSchemeAssistance] = useState('₹13,500 per year DBT');
  const [schemeDesc, setSchemeDesc] = useState('');
  const [schemeEligibility, setSchemeEligibility] = useState('');
  const [schemePortal, setSchemePortal] = useState('https://navasakam.ap.gov.in');
  const [schemeSuccessMsg, setSchemeSuccessMsg] = useState('');

  // Secretary Password Change state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwStatus, setPwStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const departments = [
    'Panchayat Public Health & Sanitation',
    'Rural Water Supply & Sanitation (RWSS)',
    'Roads & Buildings (R&B) / PR Engineering',
    'Electricity (APCPDCL / APEPDCL)',
    'Revenue & Land Administration',
    'Women & Child Welfare / Anganwadi',
    'Primary Health & Medical Unit (PHC)',
  ];

  const sampleResolutionPhotos = [
    { label: 'Re-surfaced Bitumen Road', url: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80' },
    { label: 'Repaired Streetlight Unit', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80' },
    { label: 'Cleared Drainage Canal', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
  ];

  const handlePostAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    if (editingAnnId && onUpdateAnnouncement) {
      onUpdateAnnouncement(editingAnnId, {
        title: annTitle,
        titleTe: annTitle,
        category: annCategory,
        content: annContent,
        contentTe: annContent,
      });
      setAnnSuccessMsg('Official Panchayat announcement updated successfully!');
      setEditingAnnId(null);
    } else {
      onPostAnnouncement({
        title: annTitle,
        titleTe: annTitle,
        category: annCategory,
        content: annContent,
        contentTe: annContent,
        village: 'Penumantra Grama Sachivalayam',
        isImportant: true,
        issuedBy: 'Sri Srinu (Grama Panchayat Secretary)',
      });
      setAnnSuccessMsg('New official Panchayat announcement posted successfully!');
    }

    setAnnTitle('');
    setAnnContent('');
    setTimeout(() => setAnnSuccessMsg(''), 3000);
  };

  const handleStartEditAnnouncement = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setAnnTitle(ann.title);
    setAnnContent(ann.content);
    setAnnCategory(ann.category as any);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCancelEditAnnouncement = () => {
    setEditingAnnId(null);
    setAnnTitle('');
    setAnnContent('');
  };

  const handleTriageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!triageComplaint) return;

    onUpdateComplaint(triageComplaint.id, {
      status: targetStatus,
      assignedDepartment: targetDepartment,
      assignedOfficer,
      adminNotes,
      afterPhotoUrl: afterPhotoUrl || (targetStatus === 'Resolved' ? sampleResolutionPhotos[0].url : undefined),
    });

    setTriageComplaint(null);
    setAdminNotes('');
    setAfterPhotoUrl('');
  };

  const handleAddSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schemeTitle || !schemeDesc || !onAddScheme) return;

    onAddScheme({
      title: schemeTitle,
      titleTe: schemeTitleTe || schemeTitle,
      category: schemeCategory,
      department: schemeDept,
      financialAssistance: schemeAssistance,
      description: schemeDesc,
      descriptionTe: schemeDesc,
      beneficiaryType: 'Eligible Residents & Beneficiaries of AP',
      eligibility: schemeEligibility ? schemeEligibility.split(',').map((s) => s.trim()) : ['Resident of Andhra Pradesh', 'Annual income below threshold'],
      requiredDocuments: ['Aadhaar Card', 'Ration Card / Rice Card', 'Bank Passbook'],
      officialPortalUrl: schemePortal,
    });

    setSchemeSuccessMsg('Welfare Scheme published and verified successfully!');
    setSchemeTitle('');
    setSchemeTitleTe('');
    setSchemeDesc('');
    setSchemeEligibility('');
    setTimeout(() => setSchemeSuccessMsg(''), 3000);
  };

  const handleChangeSecretaryPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      setPwStatus({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }
    if (newPw.length < 4) {
      setPwStatus({ type: 'error', message: 'Password must be at least 4 characters.' });
      return;
    }

    setIsChangingPw(true);
    setPwStatus(null);
    try {
      const res = await fetch('/api/auth/secretary/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (data.success) {
        setPwStatus({ type: 'success', message: 'Secretary password updated successfully.' });
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
      } else {
        setPwStatus({ type: 'error', message: data.message || 'Failed to update password.' });
      }
    } catch (err) {
      setPwStatus({ type: 'error', message: 'Network error while updating password.' });
    } finally {
      setIsChangingPw(false);
    }
  };

  // CSV Report Generator
  const handleExportCsv = () => {
    const headers = ['Complaint ID', 'Category', 'Title', 'Village', 'Department', 'Status', 'Date Filed', 'Assigned Officer'];
    const rows = complaints.map((c) => [
      c.id,
      c.category,
      `"${c.title.replace(/"/g, '""')}"`,
      c.village,
      `"${c.assignedDepartment || 'General Panchayat'}"`,
      c.status,
      c.createdAt,
      `"${c.assignedOfficer || 'Unassigned'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Penumantra_Panchayat_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.locationAddress && c.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-900 text-amber-300 rounded-2xl shadow-sm border border-amber-400/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'te' ? 'గ్రామ కార్యదర్శి అధికారిక నియంత్రణ కేంద్రం' : 'Grama Secretary Control Room'}
                </h2>
                <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-300">
                  AP Govt Authorized
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Panchayat Secretary: <strong className="text-slate-800">Sri Srinu</strong> • Penumantra Sachivalayam (Code: 104082)
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-700" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 text-white p-5 rounded-3xl shadow-md border border-slate-800">
        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
            Total Grievances
          </span>
          <div className="text-2xl font-black text-amber-300 mt-1">{complaints.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Logged across mandal</div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
            Resolved & Closed
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats.resolvedGrievances} / {complaints.length}
          </div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">
            {Math.round((stats.resolvedGrievances / (complaints.length || 1)) * 100)}% Success Rate
          </div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
            Verified Workers
          </span>
          <div className="text-2xl font-black text-teal-300 mt-1">{stats.activeWorkers}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Directory enrolled</div>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wide">
            Active Job Tasks
          </span>
          <div className="text-2xl font-black text-blue-300 mt-1">{stats.jobsPostedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Farm & Local Tasks</div>
        </div>
      </div>

      {/* Secretary Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'triage', labelEn: 'Grievance Triage (6-Stage)', labelTe: 'ఫిర్యాదుల పరిష్కార ప్రక్రియ', icon: ShieldAlert },
          { id: 'citizens', labelEn: 'Citizens Directory', labelTe: 'గ్రామస్తుల జాబితా', icon: Users },
          { id: 'workers', labelEn: 'Worker Moderation', labelTe: 'కార్మికుల ధృవీకరణ', icon: UserCheck },
          { id: 'jobs', labelEn: 'Job Openings Review', labelTe: 'ఉపాధి పనుల పరిశీలన', icon: Briefcase },
          { id: 'announcements', labelEn: 'Notice Board (CRUD)', labelTe: 'ప్రకటనల నిర్వహణ', icon: Megaphone },
          { id: 'schemes', labelEn: 'Welfare Schemes', labelTe: 'సంక్షేమ పథకాలు', icon: Landmark },
          { id: 'analytics', labelEn: 'Analytics & Reports', labelTe: 'గణాంకాలు & నివేదికలు', icon: BarChart2 },
          { id: 'profile', labelEn: 'Secretary Profile & Security', labelTe: 'కార్యదర్శి ప్రొఫైల్ & పాస్‌వర్డ్', icon: KeyRound },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-teal-600 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'te' ? tab.labelTe : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: GRIEVANCE TRIAGE PIPELINE (6 STATUSES) */}
      {adminTab === 'triage' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ID, title, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-xl font-semibold text-xs"
              >
                <option value="all">All 6 Statuses</option>
                <option value="Submitted">1. Submitted</option>
                <option value="Under Review">2. Under Review</option>
                <option value="Assigned">3. Assigned</option>
                <option value="In Progress">4. In Progress</option>
                <option value="Resolved">5. Resolved</option>
                <option value="Rejected">6. Rejected</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 bg-white border border-slate-300 rounded-xl font-semibold text-xs"
              >
                <option value="all">All Categories</option>
                <option value="Roads">Roads & Transport</option>
                <option value="Drainage">Drainage Overflow</option>
                <option value="Garbage">Garbage & Sanitation</option>
                <option value="Streetlight">Streetlight Maintenance</option>
                <option value="Water">Drinking Water Supply</option>
                <option value="Electricity">Electricity Transformer</option>
              </select>
            </div>
          </div>

          {/* Grievance Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">ID & Priority</th>
                  <th className="p-3">Issue Title & Category</th>
                  <th className="p-3">Citizen Contact</th>
                  <th className="p-3">Assigned Department & Officer</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Secretary Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                      No complaints match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{c.id}</div>
                        <span
                          className={`inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                            c.priority === 'Emergency'
                              ? 'bg-rose-100 text-rose-800'
                              : c.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.priority}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 text-sm max-w-xs">{c.title}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {c.category} • {c.locationAddress || c.village}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-800">{c.raisedBy}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{c.raisedByPhone}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-slate-800 max-w-xs">
                          {c.assignedDepartment || 'Panchayat Desk'}
                        </div>
                        <div className="text-slate-500 text-[11px]">{c.assignedOfficer || 'Unassigned'}</div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                            c.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : c.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : c.status === 'Assigned'
                              ? 'bg-teal-100 text-teal-800 border border-teal-300'
                              : c.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setTriageComplaint(c);
                            setTargetStatus(c.status);
                            setTargetDepartment(c.assignedDepartment || departments[0]);
                            setAssignedOfficer(c.assignedOfficer || 'Sri K. Ramaiah (Panchayat Engineering Assistant)');
                            setAdminNotes(c.adminNotes || '');
                            setAfterPhotoUrl(c.afterPhotoUrl || '');
                          }}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Triage & Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CITIZEN DIRECTORY & eKYC */}
      {adminTab === 'citizens' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search registered citizens by name, mobile, village..."
                value={citizenSearch}
                onChange={(e) => setCitizenSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
              />
            </div>
            <span className="text-slate-500 font-semibold">
              Total Enrolled Citizens: <strong>{users.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Citizen Name</th>
                  <th className="p-3">Category / Role</th>
                  <th className="p-3">Mobile Contact</th>
                  <th className="p-3">Village / Mandal</th>
                  <th className="p-3">Enrolled Date</th>
                  <th className="p-3">eKYC Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter(
                    (u) =>
                      !citizenSearch ||
                      u.name.toLowerCase().includes(citizenSearch.toLowerCase()) ||
                      u.phone.includes(citizenSearch) ||
                      u.village.toLowerCase().includes(citizenSearch.toLowerCase())
                  )
                  .map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-[11px]">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-teal-700 capitalize bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {u.userType || u.role}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-medium">{u.phone}</td>
                      <td className="p-3 text-slate-600">{u.village}</td>
                      <td className="p-3 text-slate-500">{u.createdAt}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          eKYC Verified
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WORKER DIRECTORY MODERATION */}
      {adminTab === 'workers' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                Verified Panchayat Worker Registry ({workers.length} Registered)
              </span>
              <span className="text-slate-500 text-[11px]">
                Approve, verify, or suspend worker profiles appearing on the public directory.
              </span>
            </div>
            <span className="px-2.5 py-1 bg-teal-100 text-teal-900 font-bold rounded-lg text-[10px]">
              Grama Sachivalayam Verification Desk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((w) => (
              <div
                key={w.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.photoUrl}
                      alt={w.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 text-sm">{w.name}</span>
                        {w.isVerified ? (
                          <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded border border-teal-300">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300">
                            Pending
                          </span>
                        )}
                      </div>
                      <div className="text-slate-700 font-bold">{w.occupation}</div>
                      <div className="text-slate-500 text-[11px]">
                        {w.village} • ₹{w.dailyWage}/day • 📞 {w.phone}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      w.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {w.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <span className="font-bold text-slate-500">
                    Aadhaar Status: <strong className="text-emerald-700">Matched</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {onUpdateWorkerStatus && (
                      <>
                        <button
                          onClick={() => onUpdateWorkerStatus(w.id, 'Verified')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onUpdateWorkerStatus(w.id, 'Pending')}
                          className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-lg cursor-pointer"
                        >
                          Suspend
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: JOB POSTINGS REVIEW */}
      {adminTab === 'jobs' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 block text-sm">
                Community Labor & Contractor Jobs ({jobs.length} Active Posts)
              </span>
              <span className="text-slate-500 text-[11px]">
                Monitored by Grama Sachivalayam to ensure fair wage compliance and remove spam.
              </span>
            </div>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-900 font-bold rounded-lg text-[10px]">
              Wage Compliance Desk
            </span>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{job.title}</span>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                      {job.category}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 max-w-xl">{job.description}</p>
                  <div className="text-slate-500 text-[11px] mt-1">
                    Employer: <strong className="text-slate-700">{job.employerName}</strong> ({job.employerPhone}) • Location: {job.location} • Posted: {job.createdAt}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span className="text-emerald-700 font-black text-sm">{job.wageRate}</span>
                  {onDeleteJob && (
                    <button
                      onClick={() => onDeleteJob(job.id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      title="Remove job posting"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Post</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: NOTICE BOARD CRUD */}
      {adminTab === 'announcements' && (
        <div className="space-y-6">
          <div className="max-w-2xl bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-teal-600" />
                {editingAnnId ? 'Edit Panchayat Announcement' : 'Publish New Village Announcement'}
              </h3>
              {editingAnnId && (
                <button
                  onClick={handleCancelEditAnnouncement}
                  className="text-xs text-rose-600 underline font-bold cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {annSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{annSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handlePostAnnSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Category</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold"
                >
                  <option value="Panchayat Notice">Panchayat Notice</option>
                  <option value="Water Supply">Drinking Water Supply Maintenance</option>
                  <option value="Power Outage">Scheduled Power Outage Notice</option>
                  <option value="Health Drive">Free Medical & Health Drive</option>
                  <option value="Scheme">Government Scheme Enrollment</option>
                  <option value="General">General Village Information</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drinking Water Pipeline Maintenance Schedule for Ward 4"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Content / Official Notice *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write notice in Telugu or English for village notice board..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {editingAnnId ? 'Update Notice on Board' : 'Broadcast Notice to Village Platform'}
              </button>
            </form>
          </div>

          {/* List of Existing Announcements with Edit & Delete */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">
              Active Village Announcements ({announcements.length})
            </h4>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{ann.title}</span>
                      <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1 max-w-2xl">{ann.content}</p>
                    <div className="text-slate-400 text-[11px] mt-1">
                      Issued by: {ann.issuedBy} • {ann.createdAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEditAnnouncement(ann)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-teal-700" />
                      <span>Edit</span>
                    </button>
                    {onDeleteAnnouncement && (
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: WELFARE SCHEMES MANAGEMENT */}
      {adminTab === 'schemes' && (
        <div className="space-y-6">
          <div className="max-w-2xl bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-teal-600" />
              Publish Verified Welfare Scheme (DBT / Beneficiary)
            </h3>

            {schemeSuccessMsg && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{schemeSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddSchemeSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheme Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. YSR Rythu Bharosa"
                    value={schemeTitle}
                    onChange={(e) => setSchemeTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheme Title (Telugu)</label>
                  <input
                    type="text"
                    placeholder="e.g. వైఎస్సార్ రైతు భరోసా"
                    value={schemeTitleTe}
                    onChange={(e) => setSchemeTitleTe(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={schemeCategory}
                    onChange={(e) => setSchemeCategory(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Agriculture & Rythu">Agriculture & Rythu</option>
                    <option value="Education & Scholarships">Education & Scholarships</option>
                    <option value="Women Welfare & DWACRA">Women Welfare & DWACRA</option>
                    <option value="Pensions & Social Security">Pensions & Social Security</option>
                    <option value="Housing & Urban Development">Housing & Urban Development</option>
                    <option value="Healthcare & Aarogyasri">Healthcare & Aarogyasri</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Financial Benefit / Assistance</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹13,500 per year DBT"
                    value={schemeAssistance}
                    onChange={(e) => setSchemeAssistance(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheme Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Summary of benefits and citizen welfare coverage..."
                  value={schemeDesc}
                  onChange={(e) => setSchemeDesc(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligibility Criteria (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Farmer holding pattadar passbook, Resident of AP, Below ₹2.5L income"
                  value={schemeEligibility}
                  onChange={(e) => setSchemeEligibility(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Portal URL</label>
                <input
                  type="url"
                  placeholder="https://navasakam.ap.gov.in"
                  value={schemePortal}
                  onChange={(e) => setSchemePortal(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Publish Scheme to Public Directory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: ANALYTICS & REPORTS */}
      {adminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="font-black text-sm text-slate-900">
                Grievance Volume by Civic Category
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { cat: 'Damaged Roads', count: complaints.filter(c => c.category === 'Damaged Roads' || c.category === 'Roads').length, color: 'bg-emerald-500' },
                  { cat: 'Drainage Overflow', count: complaints.filter(c => c.category === 'Drainage Overflow' || c.category === 'Drainage').length, color: 'bg-blue-500' },
                  { cat: 'Streetlight Fault', count: complaints.filter(c => c.category === 'Streetlight Fault' || c.category === 'Streetlight').length, color: 'bg-amber-500' },
                  { cat: 'Water Supply Issue', count: complaints.filter(c => c.category === 'Water Supply Issue' || c.category === 'Water').length, color: 'bg-teal-500' },
                  { cat: 'Garbage & Sanitation', count: complaints.filter(c => c.category === 'Garbage & Sanitation' || c.category === 'Garbage').length, color: 'bg-rose-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>{item.cat}</span>
                      <span>{item.count} complaints</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${item.color} h-full rounded-full`}
                        style={{ width: `${Math.max(10, (item.count / (complaints.length || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 space-y-3">
              <h4 className="font-black text-sm text-slate-900">
                Grama Sachivalayam Service Performance
              </h4>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Average Turnaround Time (TAT)</span>
                  <span className="font-black text-emerald-700">36 Hours (Within SLA)</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Citizen Satisfaction Score</span>
                  <span className="font-black text-teal-700">4.8 / 5.0 ⭐</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Active Sachivalayam Staff</span>
                  <span className="font-black text-slate-900">11 Field Functionaries</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Government Portal Sync Status</span>
                  <span className="font-black text-emerald-700">Online & Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: SECRETARY PROFILE & PASSWORD CHANGE */}
      {adminTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Official Profile Badge */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              Grama Panchayat Secretary Credentials
            </h3>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-teal-800 text-teal-100 flex items-center justify-center font-black text-xl border border-teal-600 shadow-xs">
                  S
                </div>
                <div>
                  <h4 className="font-black text-base text-slate-900">Sri Srinu</h4>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                    Panchayat Secretary (Grade-V)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-slate-700">
                <p><strong>Designation:</strong> Village Executive Authority</p>
                <p><strong>Sachivalayam:</strong> Penumantra Grama Sachivalayam (104082)</p>
                <p><strong>Mandal & District:</strong> Penumantra, West Godavari District, AP</p>
                <p><strong>Official Contact Email:</strong> srinu@gmail.com</p>
                <p><strong>Contact Phone:</strong> 9848011223</p>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-teal-600" />
              Update Secretary Password
            </h3>

            {pwStatus && (
              <div
                className={`p-3 rounded-xl font-bold flex items-center gap-2 ${
                  pwStatus.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {pwStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{pwStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangeSecretaryPassword} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPw}
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors disabled:opacity-50"
              >
                {isChangingPw ? 'Updating...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COMPLAINT TRIAGE MODAL */}
      {triageComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {triageComplaint.id}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {triageComplaint.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Filed by: {triageComplaint.raisedBy} ({triageComplaint.raisedByPhone}) • {triageComplaint.locationAddress || triageComplaint.village}
                </p>
              </div>
              <button
                onClick={() => setTriageComplaint(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTriageSubmit} className="space-y-3.5 text-xs">
              {/* Status Selection (6 Official Stages) */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Update Resolution Status (6 Official States) *
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as ComplaintStatus)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  <option value="Submitted">1. Submitted (సమర్పించబడింది)</option>
                  <option value="Under Review">2. Under Review (పరిశీలనలో ఉంది)</option>
                  <option value="Assigned">3. Assigned (అధికారికి కేటాయించబడింది)</option>
                  <option value="In Progress">4. In Progress (పని జరుగుతున్నది)</option>
                  <option value="Resolved">5. Resolved (సమస్య పరిష్కరించబడింది)</option>
                  <option value="Rejected">6. Rejected (నిబంధనల ప్రకారం తిరస్కరించబడింది)</option>
                </select>
              </div>

              {/* Red warning & required justification if Rejected */}
              {targetStatus === 'Rejected' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1">
                  <span className="font-bold block">Rejection Justification Required:</span>
                  <p className="text-[11px] text-rose-700">
                    State the specific government regulation, private property restriction, or duplicate complaint ID why this grievance cannot be entertained.
                  </p>
                </div>
              )}

              {/* Department Assignment */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Assign Responsible Government Department *
                </label>
                <select
                  value={targetDepartment}
                  onChange={(e) => setTargetDepartment(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned Officer */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Assigned Field Officer / Staff *
                </label>
                <input
                  type="text"
                  required
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              {/* Officer Remarks / Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  {targetStatus === 'Rejected'
                    ? 'Official Rejection Reason (Mandatory) *'
                    : 'Panchayat Officer Remark & Progress Timeline *'}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={
                    targetStatus === 'Rejected'
                      ? 'Detailed reason for rejection to be communicated to citizen...'
                      : 'Detail action taken, contractor assigned, or resolution notes...'
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                ></textarea>
              </div>

              {/* Resolution Photo Evidence */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Resolution Photo Evidence URL (Before vs After)
                </label>
                <input
                  type="url"
                  placeholder="Paste URL or select preset below..."
                  value={afterPhotoUrl}
                  onChange={(e) => setAfterPhotoUrl(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto">
                  {sampleResolutionPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAfterPhotoUrl(photo.url)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 whitespace-nowrap cursor-pointer"
                    >
                      {photo.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTriageComplaint(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save & Dispatch Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
