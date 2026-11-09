import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  Bookmark,
  FileText,
  LogOut,
  Edit2,
  CheckCircle2,
  X,
  Shield,
  Calendar,
} from 'lucide-react';
import { Language, UserAccount, Complaint, JobPosting, WorkerProfile, LocalBusiness } from '../types';
import { t } from '../translations';

interface UserProfileDrawerProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onUpdateUser: (updatedUser: Partial<UserAccount>) => void;
  onLogout: () => void;
  userComplaints: Complaint[];
  bookmarks: { jobs: string[]; workers: string[]; shops: string[] };
  jobs: JobPosting[];
  workers: WorkerProfile[];
  shops: LocalBusiness[];
  onNavigateTab: (tab: string) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  language,
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  userComplaints,
  bookmarks,
  jobs,
  workers,
  shops,
  onNavigateTab,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [village, setVillage] = useState(user.village);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ name, phone, village, bio, avatarUrl: avatarUrl || undefined });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const savedJobsList = jobs.filter((j) => bookmarks.jobs.includes(j.id));
  const savedWorkersList = workers.filter((w) => bookmarks.workers.includes(w.id));
  const savedShopsList = shops.filter((s) => bookmarks.shops.includes(s.id));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              {t('myProfile', language)}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-teal-600 text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? t('cancel', language) : 'Edit'}</span>
            </button>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Mobile</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 bg-white border rounded-xl"
                  ></textarea>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Profile Photo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 file:font-semibold"
                    />
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="text-[11px] text-rose-600 underline font-semibold shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Profile Changes
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-teal-700 text-white flex items-center justify-center font-black text-xl border border-teal-600 shadow-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                      {user.name}
                    </h4>
                    <span className="inline-block mt-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 capitalize">
                      {user.userType || user.role}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>
                      {user.village}, {user.mandal}, {user.district}
                    </span>
                  </div>
                  {user.bio && (
                    <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                      "{user.bio}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {savedSuccess && (
            <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Activity & Bookmarks Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
              My Activity & Saved Items
            </h4>

            {/* My Grievances Quick Count */}
            <div
              onClick={() => {
                onNavigateTab('complaints');
                onClose();
              }}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-800">Complaints Filed</span>
              </div>
              <span className="font-extrabold px-2 py-0.5 bg-slate-100 rounded-full text-slate-700">
                {userComplaints.length}
              </span>
            </div>

            {/* Bookmarked Jobs */}
            <div
              onClick={() => {
                onNavigateTab('jobs');
                onClose();
              }}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-800">Saved Jobs</span>
              </div>
              <span className="font-extrabold px-2 py-0.5 bg-blue-50 text-blue-800 rounded-full">
                {savedJobsList.length}
              </span>
            </div>

            {/* Bookmarked Workers */}
            <div
              onClick={() => {
                onNavigateTab('workers');
                onClose();
              }}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-slate-800">Saved Workers</span>
              </div>
              <span className="font-extrabold px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full">
                {savedWorkersList.length}
              </span>
            </div>

            {/* Bookmarked Shops */}
            <div
              onClick={() => {
                onNavigateTab('shops');
                onClose();
              }}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-400 transition-all cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-teal-600" />
                <span className="font-bold text-slate-800">Saved Shops & Businesses</span>
              </div>
              <span className="font-extrabold px-2 py-0.5 bg-teal-50 text-teal-800 rounded-full">
                {savedShopsList.length}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout', language)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
