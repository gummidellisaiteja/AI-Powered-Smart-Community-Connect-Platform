import React from 'react';
import {
  ClipboardList,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Lock,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Language, Complaint, UserAccount } from '../types';

interface ModuleMyComplaintsProps {
  language: Language;
  complaints: Complaint[];
  currentUser: UserAccount | null;
  onOpenAuth: (prompt?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ModuleMyComplaints: React.FC<ModuleMyComplaintsProps> = ({
  language,
  complaints,
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
            ? 'మీరు సమర్పించిన సమస్యల పురోగతి మరియు పరిష్కార స్థితిని ట్రాక్ చేయడానికి మీ ఖాతాలోకి ప్రవేశించండి.'
            : 'Access real-time status updates, officer remarks, and before/after photos for all your filed community grievances.'}
        </p>
        <button
          onClick={() => onOpenAuth('Please Login or Register to view your complaints')}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
        >
          {language === 'te' ? 'లాగిన్ / రిజిస్టర్' : 'Login / Register Now'}
        </button>
      </div>
    );
  }

  // Filter complaints filed by current user
  const userComplaints = complaints.filter(
    (c) =>
      c.raisedBy?.toLowerCase() === currentUser.name.toLowerCase() ||
      c.raisedByPhone === currentUser.phone
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {language === 'te' ? 'నా ఫిర్యాదులు & స్థితి ట్రాకింగ్' : 'My Grievances & Resolution Tracking'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <span className="font-bold text-slate-700">{currentUser.name}</span> ({currentUser.phone}) • {currentUser.village}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('complaints')}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'te' ? 'కొత్త సమస్య నమోదు చేయండి' : 'Raise New Grievance'}</span>
        </button>
      </div>

      {/* Complaints List */}
      {userComplaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">
            {language === 'te' ? 'ఇంకా ఎలాంటి ఫిర్యాదులు నమోదు చేయలేదు' : 'No Grievances Filed Yet'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            If you notice road damage, drinking water leak, or street light issues in your village, raise a complaint with photo evidence.
          </p>
          <button
            onClick={() => onNavigateTab('complaints')}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-teal-700"
          >
            Raise a Grievance Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userComplaints.map((comp) => (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-200 text-xs">
                    {comp.id}
                  </span>
                  <span className="font-bold text-slate-600 text-xs">• {comp.category}</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full self-start sm:self-auto ${
                    comp.status === 'Resolved' || comp.status === 'Closed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : comp.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : comp.status === 'Under Review' || comp.status === 'Assigned'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Status: {comp.status}
                </span>
              </div>

              {/* Title and Description */}
              <div className="space-y-1">
                <h3 className="font-black text-sm text-slate-900">{comp.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{comp.description}</p>
              </div>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{comp.locationAddress || comp.village}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Submitted on: {comp.createdAt}</span>
                </span>
                {comp.assignedOfficer && (
                  <span className="font-semibold text-slate-700">
                    Assigned: {comp.assignedOfficer}
                  </span>
                )}
              </div>

              {/* Photos Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {comp.photoUrl && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Submitted Photo Evidence:
                    </span>
                    <img
                      src={comp.photoUrl}
                      alt="Before"
                      className="w-full h-36 object-cover rounded-2xl border border-slate-200"
                    />
                  </div>
                )}
                {comp.afterPhotoUrl && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolution Evidence:
                    </span>
                    <img
                      src={comp.afterPhotoUrl}
                      alt="After"
                      className="w-full h-36 object-cover rounded-2xl border border-emerald-300"
                    />
                  </div>
                )}
              </div>

              {/* Timeline steps */}
              {comp.history && comp.history.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <span className="font-bold text-slate-800">Action History & Officer Remarks:</span>
                  <div className="space-y-1.5">
                    {comp.history.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-800">[{h.status}]</span>{' '}
                          <span>{h.notes}</span>
                          <span className="text-slate-400 ml-1">({h.timestamp})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
