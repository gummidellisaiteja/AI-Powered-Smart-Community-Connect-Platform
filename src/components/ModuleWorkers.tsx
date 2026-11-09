import React, { useState } from 'react';
import {
  Users,
  Search,
  MapPin,
  Star,
  PhoneCall,
  Calendar,
  CheckCircle2,
  XCircle,
  Briefcase,
  UserPlus,
  Clock,
  MessageSquare,
  Bookmark,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Language, WorkerProfile, UserRole } from '../types';
import { t } from '../translations';

interface ModuleWorkersProps {
  language: Language;
  workers: WorkerProfile[];
  onRegisterWorker: (worker: Partial<WorkerProfile>) => void;
  onBookWorker: (booking: any) => void;
  savedWorkers: string[];
  onToggleBookmark: (workerId: string) => void;
  currentRole: UserRole;
}

export const ModuleWorkers: React.FC<ModuleWorkersProps> = ({
  language,
  workers,
  onRegisterWorker,
  onBookWorker,
  savedWorkers,
  onToggleBookmark,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('all');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedWorkerForBook, setSelectedWorkerForBook] = useState<WorkerProfile | null>(null);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOccupation, setRegOccupation] = useState('Electrician & Motor Mechanic');
  const [regSkills, setRegSkills] = useState('');
  const [regExperience, setRegExperience] = useState('5');
  const [regVillage, setRegVillage] = useState('Penumantra');
  const [regWage, setRegWage] = useState('700');
  const [regHourlyWage, setRegHourlyWage] = useState('150');
  const [regBio, setRegBio] = useState('');

  // Booking modal state
  const [bookWorkDesc, setBookWorkDesc] = useState('');
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookWage, setBookWage] = useState('');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const occupationsList = [
    'Electrician & Motor Mechanic',
    'Mason / Concrete Contractor (తాపీ మేస్త్రీ)',
    'Plumber & Borewell Specialist',
    'Tailor & Embroidery Specialist',
    'Painter & Putty Worker',
    'Carpenter & Woodwork',
    'Tractor & Agricultural Worker',
    'Two Wheeler Mechanic',
    'Welder & Fabrication',
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    onRegisterWorker({
      name: regName,
      phone: regPhone,
      occupation: regOccupation,
      skills: regSkills.split(',').map((s) => s.trim()),
      experienceYears: Number(regExperience) || 1,
      village: regVillage,
      mandal: regVillage,
      district: 'West Godavari',
      dailyWage: Number(regWage) || 600,
      hourlyWage: Number(regHourlyWage) || 120,
      bio: regBio,
    });

    setShowRegisterModal(false);
    setRegName('');
    setRegPhone('');
    setRegSkills('');
    setRegBio('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkerForBook || !bookWorkDesc) return;

    onBookWorker({
      workerId: selectedWorkerForBook.id,
      workerName: selectedWorkerForBook.name,
      workerPhone: selectedWorkerForBook.phone,
      workDescription: bookWorkDesc,
      scheduledDate: bookDate,
      wageAgreed: Number(bookWage) || selectedWorkerForBook.dailyWage,
    });

    setBookingSuccessMsg(`Worker ${selectedWorkerForBook.name} booked successfully! SMS notification dispatched.`);
    setTimeout(() => {
      setBookingSuccessMsg('');
      setSelectedWorkerForBook(null);
    }, 2500);
  };

  const filteredWorkers = workers.filter((w) => {
    if (filterSavedOnly && !savedWorkers.includes(w.id)) return false;
    if (availableOnly && !w.isAvailable) return false;
    if (selectedVillage !== 'all' && !w.village.toLowerCase().includes(selectedVillage.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchOcc = w.occupation.toLowerCase().includes(q);
      const matchSkill = w.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchOcc && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('workerTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect directly with verified local electricians, masons, mechanics & daily service workers
          </p>
        </div>

        <button
          id="btn-register-worker-open"
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all border border-amber-500"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('registerWorker', language)}</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="worker-search-input"
            type="text"
            placeholder={t('searchOccupation', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          id="worker-village-filter"
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
          className="py-2 px-3 bg-white text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none"
        >
          <option value="all">All Villages / Areas</option>
          <option value="Penumantra">Penumantra</option>
          <option value="Peddapuram">Peddapuram</option>
          <option value="Tadepalligudem">Tadepalligudem</option>
        </select>

        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white px-3 py-2 border border-slate-300 rounded-xl cursor-pointer">
          <input
            id="worker-available-toggle"
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="rounded text-amber-600 focus:ring-amber-500"
          />
          <span>Available Now ({workers.filter((w) => w.isAvailable).length})</span>
        </label>

        <button
          onClick={() => setFilterSavedOnly(!filterSavedOnly)}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
            filterSavedOnly
              ? 'bg-amber-600 text-white border-amber-500'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedWorkers.length})</span>
        </button>
      </div>

      {/* Worker Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWorkers.map((worker) => {
          const isSaved = savedWorkers.includes(worker.id);
          return (
            <div
              key={worker.id}
              id={`worker-card-${worker.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={worker.photoUrl}
                      alt={worker.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-bold text-sm text-slate-900">{worker.name}</h3>
                        {worker.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-teal-600" title="Panchayat Verified Worker" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-amber-200/60">
                        {worker.occupation}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(worker.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition-colors"
                    title="Save Worker"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-amber-600 text-amber-600' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-3 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {worker.village}, {worker.mandal}
                      </span>
                    </div>

                    {worker.isAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {t('availableNow', language)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                        <XCircle className="w-3 h-3 text-slate-400" />
                        {t('busy', language)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{worker.dailyWage} / day
                    </span>
                    {worker.hourlyWage && (
                      <span className="text-[11px] text-slate-500 font-semibold">
                        (₹{worker.hourlyWage}/hr)
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">• {worker.experienceYears} yrs exp</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs pt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{worker.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({worker.reviewCount} reviews • {worker.completedJobs} jobs done)
                    </span>
                  </div>
                </div>

                {worker.bio && (
                  <p className="text-[11px] text-slate-500 italic mt-2 line-clamp-2">
                    "{worker.bio}"
                  </p>
                )}

                {/* Skills badges */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <a
                  id={`btn-call-worker-${worker.id}`}
                  href={`tel:${worker.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('callNow', language)}</span>
                </a>

                <button
                  id={`btn-book-worker-${worker.id}`}
                  onClick={() => {
                    setSelectedWorkerForBook(worker);
                    setBookWage(String(worker.dailyWage));
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('bookWorker', language)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* REGISTER WORKER MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {t('registerWorker', language)}
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Worker Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. K. Venkataswamy"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9848011223"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation *</label>
                  <select
                    value={regOccupation}
                    onChange={(e) => setRegOccupation(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
                  >
                    {occupationsList.map((occ) => (
                      <option key={occ} value={occ}>
                        {occ}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="House Wiring, Motor Repair, Inverter Fitting"
                  value={regSkills}
                  onChange={(e) => setRegSkills(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exp (yrs)</label>
                  <input
                    type="number"
                    value={regExperience}
                    onChange={(e) => setRegExperience(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Daily (₹)</label>
                  <input
                    type="number"
                    value={regWage}
                    onChange={(e) => setRegWage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hourly (₹)</label>
                  <input
                    type="number"
                    value={regHourlyWage}
                    onChange={(e) => setRegHourlyWage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Short Bio / Experience Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell villagers about your past work and availability..."
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                ></textarea>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  {t('cancel', language)}
                </button>
                <button
                  id="btn-submit-worker-register"
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                >
                  Submit Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK WORKER MODAL */}
      {selectedWorkerForBook && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {t('bookWorkerModal', language)}: {selectedWorkerForBook.name}
              </h3>
              <button
                onClick={() => setSelectedWorkerForBook(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccessMsg ? (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl font-bold text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{bookingSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t('workDescription', language)} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Explain the work required (e.g. Submersible pump motor winding check)..."
                    value={bookWorkDesc}
                    onChange={(e) => setBookWorkDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t('scheduledDate', language)}
                    </label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Agreed Wage (₹)</label>
                    <input
                      type="number"
                      value={bookWage}
                      onChange={(e) => setBookWage(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedWorkerForBook(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    {t('cancel', language)}
                  </button>
                  <button
                    id="btn-confirm-worker-booking"
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow"
                  >
                    Confirm Booking
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
