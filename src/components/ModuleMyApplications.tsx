import React from 'react';
import {
  FileCheck2,
  Briefcase,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  Lock,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Language, JobApplication, JobPosting, UserAccount } from '../types';

interface ModuleMyApplicationsProps {
  language: Language;
  applications: JobApplication[];
  jobs: JobPosting[];
  currentUser: UserAccount | null;
  onOpenAuth: (prompt?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ModuleMyApplications: React.FC<ModuleMyApplicationsProps> = ({
  language,
  applications,
  jobs,
  currentUser,
  onOpenAuth,
  onNavigateTab,
}) => {
  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto border border-slate-200 shadow-sm space-y-4 my-8">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="font-black text-xl text-slate-900">
          {language === 'te' ? 'దయచేసి లాగిన్ అవ్వండి' : 'Please Login or Register to Continue'}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {language === 'te'
            ? 'మీరు దరఖాస్తు చేసుకున్న స్థానిక ఉపాధి పనుల స్థితిని వీక్షించడానికి మీ ఖాతాలోకి ప్రవేశించండి.'
            : 'Track the hiring status of your job applications, wage confirmations, and employer communication.'}
        </p>
        <button
          onClick={() => onOpenAuth('Please Login or Register to view your job applications')}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          {language === 'te' ? 'లాగిన్ / రిజిస్టర్' : 'Login / Register Now'}
        </button>
      </div>
    );
  }

  // Filter applications submitted by this user
  const userApps = applications.filter(
    (a) =>
      a.applicantName.toLowerCase() === currentUser.name.toLowerCase() ||
      a.applicantPhone === currentUser.phone ||
      a.applicantId === currentUser.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'te' ? 'నా ఉద్యోగ దరఖాస్తులు' : 'My Job Applications & Status'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-bold text-slate-700">{currentUser.name}</span> • Candidate Profile
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('jobs')}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Briefcase className="w-4 h-4" />
          <span>{language === 'te' ? 'మరిన్ని పనులు వెతకండి' : 'Explore Open Jobs'}</span>
        </button>
      </div>

      {userApps.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">
            {language === 'te' ? 'ఇంకా ఎలాంటి దరఖాస్తులు సమర్పించలేదు' : 'No Job Applications Yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse daily wage farm tasks, construction jobs, and part-time student roles available in nearby mandals.
          </p>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-700"
          >
            Find & Apply for Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userApps.map((app) => {
            const matchingJob = jobs.find((j) => j.id === app.jobId);
            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono font-bold text-blue-700 text-xs bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Application ID: {app.id}
                    </span>
                    <h3 className="font-black text-base text-slate-900 mt-1">
                      {matchingJob?.title || app.jobTitle}
                    </h3>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full self-start sm:self-auto ${
                      app.status === 'Hired'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : app.status === 'Shortlisted'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Application Status: {app.status}
                  </span>
                </div>

                {matchingJob && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-500 font-semibold">Location:</span>
                      <div className="font-bold text-slate-800">{matchingJob.village}</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Agreed Wage:</span>
                      <div className="font-bold text-emerald-700">₹{matchingJob.wage} ({matchingJob.wageType})</div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Employer:</span>
                      <div className="font-bold text-slate-800">{matchingJob.postedByName}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Applied on: {app.appliedAt}</span>
                  {app.notes && (
                    <span className="font-semibold text-slate-700">Employer Note: {app.notes}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
