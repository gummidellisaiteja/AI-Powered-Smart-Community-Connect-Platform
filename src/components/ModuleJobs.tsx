import React, { useState } from 'react';
import {
  Briefcase,
  PlusCircle,
  MapPin,
  Clock,
  PhoneCall,
  CheckCircle2,
  Search,
  IndianRupee,
  Calendar,
  Building,
  UserCheck,
  Bookmark,
  Users,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { Language, JobPosting, JobApplication, UserRole } from '../types';
import { t } from '../translations';

interface ModuleJobsProps {
  language: Language;
  jobs: JobPosting[];
  onPostJob: (job: Partial<JobPosting>) => void;
  onApplyJob: (applicationData: {
    jobId: string;
    applicantName: string;
    applicantPhone: string;
    applicantRole: 'worker' | 'student';
  }) => void;
  savedJobs: string[];
  onToggleBookmark: (jobId: string) => void;
  currentRole: UserRole;
  applications?: JobApplication[];
  onUpdateApplicationStatus?: (appId: string, status: string) => void;
}

export const ModuleJobs: React.FC<ModuleJobsProps> = ({
  language,
  jobs,
  onPostJob,
  onApplyJob,
  savedJobs,
  onToggleBookmark,
  currentRole,
  applications = [],
  onUpdateApplicationStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'post' | 'applicants'>('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantRole, setApplicantRole] = useState<'worker' | 'student'>('worker');
  const [applySuccessMsg, setApplySuccessMsg] = useState('');

  // Post Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [category, setCategory] = useState('Agriculture');
  const [wage, setWage] = useState('800');
  const [wageType, setWageType] = useState<'Per Day' | 'Per Hour' | 'Fixed Task' | 'Per Month'>('Per Day');
  const [location, setLocation] = useState('Penumantra Green Fields');
  const [village, setVillage] = useState('Penumantra');
  const [duration, setDuration] = useState('5 Days');
  const [openingsCount, setOpeningsCount] = useState('4');
  const [deadline, setDeadline] = useState('2026-09-30');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [contactPhone, setContactPhone] = useState('9848055667');
  const [description, setDescription] = useState('');

  const categoriesList = [
    'Agriculture',
    'Construction / Masonry',
    'Painting & Decoration',
    'Student Part-time / Office',
    'Shop Helper / Retail',
    'Driving / Transport',
    'Domestic / Tailoring',
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !wage) return;

    onPostJob({
      title: jobTitle,
      category,
      wage: Number(wage) || 500,
      wageType,
      location,
      village,
      mandal: village,
      duration,
      openingsCount: Number(openingsCount) || 1,
      deadline,
      requiredSkills: requiredSkills.split(',').map((s) => s.trim()),
      contactPhone,
      description,
      postedByName: 'Grama Contractor / Employer',
    });

    setActiveTab('listings');
    setJobTitle('');
    setDescription('');
    setRequiredSkills('');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJobId || !applicantName || !applicantPhone) return;

    onApplyJob({
      jobId: applyingJobId,
      applicantName,
      applicantPhone,
      applicantRole,
    });

    setApplySuccessMsg('Job application submitted successfully! Employer will contact you.');
    setTimeout(() => {
      setApplySuccessMsg('');
      setApplyingJobId(null);
      setApplicantName('');
      setApplicantPhone('');
    }, 2500);
  };

  const filteredJobs = jobs.filter((job) => {
    if (filterSavedOnly && !savedJobs.includes(job.id)) return false;
    if (categoryFilter !== 'all' && job.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchLoc = job.location.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('jobTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse daily farm work, construction contracts, and student part-time jobs in Andhra Pradesh
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Employer Applicants Review Tab */}
          {(currentRole === 'employer' || currentRole === 'admin') && (
            <button
              onClick={() => setActiveTab(activeTab === 'applicants' ? 'listings' : 'applicants')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                activeTab === 'applicants'
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Review Applicants ({applications.length})</span>
            </button>
          )}

          {activeTab === 'post' ? (
            <button
              onClick={() => setActiveTab('listings')}
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
            >
              ← View All Jobs
            </button>
          ) : (
            <button
              id="btn-post-job-open"
              onClick={() => setActiveTab('post')}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all border border-blue-500"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postJob', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: POST A JOB FORM */}
      {activeTab === 'post' && (
        <form onSubmit={handlePostSubmit} className="space-y-4 max-w-2xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-base text-slate-900 border-b pb-2">
            {t('postJob', language)} - Employer / Contractor Form
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Title / వర్క్ పేరు *
            </label>
            <input
              id="post-job-title"
              type="text"
              required
              placeholder="e.g. Paddy Harvesting Tractor Drivers Needed"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobCategory', language)}
              </label>
              <select
                id="post-job-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('wageAmount', language)} (₹) *
              </label>
              <div className="flex gap-2">
                <input
                  id="post-job-wage"
                  type="number"
                  required
                  value={wage}
                  onChange={(e) => setWage(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-xl"
                />
                <select
                  value={wageType}
                  onChange={(e) => setWageType(e.target.value as any)}
                  className="text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl"
                >
                  <option value="Per Day">Per Day</option>
                  <option value="Per Hour">Per Hour</option>
                  <option value="Fixed Task">Fixed Task</option>
                  <option value="Per Month">Per Month</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Work Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('jobDuration', language)}
              </label>
              <input
                type="text"
                placeholder="e.g. 3 Days"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. of Openings</label>
              <input
                type="number"
                value={openingsCount}
                onChange={(e) => setOpeningsCount(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Tractor Driving, Loading, Typing"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Requirement details, timing, work location near village landmark..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
            ></textarea>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('listings')}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              id="btn-submit-post-job"
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Publish Job Posting
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: APPLICANTS REVIEW (EMPLOYER DASHBOARD) */}
      {activeTab === 'applicants' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Applicant Triage & Management
          </h3>

          {applications.length === 0 ? (
            <div className="bg-slate-50 p-8 rounded-2xl text-center text-xs text-slate-400">
              No job applications received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{app.applicantName}</h4>
                      <span className="text-[10px] uppercase font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {app.applicantRole}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          app.status === 'Hired'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Shortlisted'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-slate-600 mt-1">
                      Applied for: <strong>{app.jobTitle}</strong> • Date: {app.appliedAt}
                    </p>
                    <p className="text-slate-500 font-semibold mt-0.5">Phone: {app.applicantPhone}</p>
                  </div>

                  {/* Employer Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${app.applicantPhone}`}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call</span>
                    </a>

                    {onUpdateApplicationStatus && (
                      <>
                        <button
                          onClick={() => onUpdateApplicationStatus(app.id, 'Shortlisted')}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-100"
                        >
                          {t('shortlist', language)}
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStatus(app.id, 'Hired')}
                          className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                        >
                          {t('hire', language)}
                        </button>
                        <button
                          onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl hover:bg-rose-100"
                        >
                          {t('reject', language)}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: JOB LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="job-search-input"
                type="text"
                placeholder="Search job title, skill, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              id="job-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 bg-white text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">All Job Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterSavedOnly(!filterSavedOnly)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
                filterSavedOnly
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Jobs ({savedJobs.length})</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.includes(job.id);
              return (
                <div
                  key={job.id}
                  id={`job-card-${job.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                        {job.category}
                      </span>

                      <button
                        onClick={() => onToggleBookmark(job.id)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Bookmark Job"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            isSaved ? 'fill-blue-600 text-blue-600' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{job.title}</h3>

                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-sm">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span>
                          ₹{job.wage} <span className="text-xs font-normal text-slate-500">/ {job.wageType}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>
                          {job.location} ({job.village})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Duration: {job.duration}</span>
                      </div>

                      {job.openingsCount && (
                        <div className="text-[11px] font-semibold text-blue-700">
                          Openings: {job.openingsCount} | Applicants: {job.applicantsCount}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2">{job.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">
                      By: {job.postedByName}
                    </span>

                    <button
                      id={`btn-apply-job-${job.id}`}
                      onClick={() => setApplyingJobId(job.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <span>{t('applyNow', language)}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* APPLY JOB MODAL */}
      {applyingJobId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Apply for Job ({applyingJobId})
              </h3>
              <button
                onClick={() => setApplyingJobId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccessMsg ? (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl font-bold text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{applySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. K. Srinivas"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9848011223"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicant Role</label>
                  <select
                    value={applicantRole}
                    onChange={(e) => setApplicantRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
                  >
                    <option value="worker">Skilled / Daily-Wage Worker</option>
                    <option value="student">Student Part-Time Applicant</option>
                  </select>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyingJobId(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    {t('cancel', language)}
                  </button>
                  <button
                    id="btn-confirm-job-apply"
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
