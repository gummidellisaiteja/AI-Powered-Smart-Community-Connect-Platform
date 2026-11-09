import React, { useState } from 'react';
import {
  ShieldAlert,
  HeartPulse,
  PhoneCall,
  MapPin,
  Clock,
  Calendar,
  Building,
  CheckCircle2,
  Users,
  Ambulance,
  AlertTriangle,
  Send,
  BookOpen,
  HelpCircle,
  FileText,
  Volume2,
} from 'lucide-react';
import { Language, Hospital, FirstAidGuide } from '../types';
import { t } from '../translations';
import { initialFirstAidGuides } from '../data/seedData';

interface ModuleHealthEmergencyProps {
  language: Language;
  hospitals: Hospital[];
  onTriggerSos: (locationNote: string) => void;
}

export const ModuleHealthEmergency: React.FC<ModuleHealthEmergencyProps> = ({
  language,
  hospitals,
  onTriggerSos,
}) => {
  const [activeHealthTab, setActiveHealthTab] = useState<'hospitals' | 'firstaid' | 'camps'>('hospitals');
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosLocationNote, setSosLocationNote] = useState('Penumantra Main Road, near Water Tank');
  const [sosDispatched, setSosDispatched] = useState(false);

  // Appointment Token booking modal
  const [selectedHospitalForAppt, setSelectedHospitalForAppt] = useState<Hospital | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [apptDate, setApptDate] = useState(new Date().toISOString().split('T')[0]);
  const [tokenSuccess, setTokenSuccess] = useState('');

  const firstAidList: FirstAidGuide[] = initialFirstAidGuides;

  const handleSosConfirm = () => {
    onTriggerSos(sosLocationNote);
    setSosDispatched(true);

    // Audio beep simulation using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // AudioContext not allowed or unsupported
    }
  };

  const handleBookToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospitalForAppt || !patientName || !patientPhone) return;

    setTokenSuccess(
      `PHC OPD Token #${Math.floor(10 + Math.random() * 90)} booked for ${patientName} on ${apptDate}. Please show SMS/token at OPD registration counter.`
    );
    setTimeout(() => {
      setTokenSuccess('');
      setSelectedHospitalForAppt(null);
      setPatientName('');
      setPatientPhone('');
    }, 3500);
  };

  const helplines = [
    {
      title: 'AP Police Control Room',
      number: '100 / 112',
      desc: 'Local Station, Highway & Town Patrol',
      icon: ShieldAlert,
      bg: 'bg-rose-50 border-rose-200 text-rose-900',
    },
    {
      title: '108 Emergency Ambulance',
      number: '108',
      desc: 'Free YSR 24/7 Emergency Transit',
      icon: Ambulance,
      bg: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      title: '104 Mobile Medical Clinic',
      number: '104',
      desc: 'Doctor Advice, Blood Test & Chronic Care',
      icon: HeartPulse,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    },
    {
      title: '181 Disha Women Safety',
      number: '181',
      desc: 'AP Women & Child Protection Wing',
      icon: Users,
      bg: 'bg-purple-50 border-purple-200 text-purple-900',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('healthTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            24/7 Emergency SOS dispatch, nearby PHC bed status, doctor availability, OPD tokens & First-Aid guides
          </p>
        </div>

        {/* SOS Big Button */}
        <button
          id="btn-trigger-sos-main"
          onClick={() => {
            setShowSosModal(true);
            setSosDispatched(false);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg animate-pulse border-2 border-red-400 transition-all cursor-pointer"
        >
          <AlertTriangle className="w-5 h-5 text-amber-300" />
          <span>{t('emergencySos', language)}</span>
        </button>
      </div>

      {/* Emergency Helplines Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {helplines.map((h, idx) => {
          const Icon = h.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${h.bg} flex flex-col justify-between space-y-3 shadow-xs`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider">{h.title}</h3>
                  <div className="text-xl font-black mt-1">{h.number}</div>
                  <p className="text-[11px] opacity-80 mt-0.5">{h.desc}</p>
                </div>
                <div className="p-2 bg-white/80 rounded-xl shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <a
                href={`tel:${h.number.split(' ')[0]}`}
                className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call {h.number.split(' ')[0]}</span>
              </a>
            </div>
          );
        })}
      </div>

      {/* Sub Navigation */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold w-fit">
        <button
          onClick={() => setActiveHealthTab('hospitals')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeHealthTab === 'hospitals'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('hospitalsNearby', language)}
        </button>
        <button
          onClick={() => setActiveHealthTab('firstaid')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeHealthTab === 'firstaid'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('firstAidTitle', language)}
        </button>
        <button
          onClick={() => setActiveHealthTab('camps')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            activeHealthTab === 'camps'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('healthCamps', language)}
        </button>
      </div>

      {/* VIEW 1: HOSPITALS & PHC DIRECTORY */}
      {activeHealthTab === 'hospitals' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {hospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        {hosp.type}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1">
                        {language === 'te' ? hosp.nameTe : hosp.name}
                      </h4>
                    </div>

                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap">
                      {hosp.availableBeds} Beds Free
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <p>
                      <strong>Doctor In-Charge:</strong> {hosp.doctorInCharge}
                    </p>
                    <p>
                      <strong>Timings:</strong> {hosp.timings}
                    </p>
                    <p className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{hosp.address}</span>
                    </p>
                  </div>

                  {/* Services */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {hosp.servicesAvailable.map((srv, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        ✓ {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${hosp.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Hospital</span>
                  </a>

                  <button
                    id={`btn-book-phc-token-${hosp.id}`}
                    onClick={() => setSelectedHospitalForAppt(hosp)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('bookAppointment', language)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: FIRST AID GUIDES */}
      {activeHealthTab === 'firstaid' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {firstAidList.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                    {guide.emergencyType}
                  </span>
                  <a
                    href={`tel:${guide.emergencyNumber}`}
                    className="text-[11px] font-bold text-rose-600 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call {guide.emergencyNumber}</span>
                  </a>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900">
                  {language === 'te' ? guide.titleTe : guide.title}
                </h4>

                {/* Do List */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-emerald-700 block">
                    ✓ {language === 'te' ? 'తప్పక చేయవలసినవి (DO)' : 'What to DO:'}
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {(language === 'te' ? guide.doListTe : guide.doList).map((d, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Dont List */}
                <div className="space-y-1 text-xs pt-1 border-t border-slate-100">
                  <span className="font-bold text-rose-700 block">
                    ✕ {language === 'te' ? 'చేయకూడనివి (DON’T)' : 'What NOT to do:'}
                  </span>
                  <ul className="space-y-1 text-slate-600 text-[11px]">
                    {(language === 'te' ? guide.dontListTe : guide.dontList).map((d, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: HEALTH SCREENING CAMPS */}
      {activeHealthTab === 'camps' && (
        <div className="space-y-3 pt-1">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                YSR Aarogyasri Free Medical Drive
              </span>
              <h4 className="font-bold text-base text-slate-900 mt-1">
                Free Mega Health, BP & Eye Screening Camp
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Sunday, 8:00 AM – 2:00 PM at MPPS School Compound, Penumantra. Free doctor consultation and generic medicines.
              </p>
            </div>
            <button
              onClick={() => alert('Camp reminder alert set on your mobile.')}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Get SMS Reminder
            </button>
          </div>
        </div>
      )}

      {/* SOS DISPATCH MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-red-500 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-lg text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
                Emergency SOS Alert Dispatch
              </h3>
              <button
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {sosDispatched ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-4 rounded-2xl space-y-2 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Emergency Dispatch Confirmed!</h4>
                <p className="text-xs text-emerald-800">
                  {t('sosHelpText', language)}
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-700">
                  Alert Sent To: Sarpanch Office • AP Police 100 • 108 Ambulance Unit • Disha Wing 181
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  Confirming this SOS will immediately capture your GPS coordinates and notify the local Panchayat Sarpanch, AP Police (100) & 108 Ambulance.
                </p>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Emergency Location Landmark / Note
                  </label>
                  <input
                    type="text"
                    value={sosLocationNote}
                    onChange={(e) => setSosLocationNote(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSosModal(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    {t('cancel', language)}
                  </button>
                  <button
                    id="btn-confirm-sos-dispatch"
                    onClick={handleSosConfirm}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg animate-pulse"
                  >
                    Confirm SOS Dispatch
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* APPOINTMENT TOKEN MODAL */}
      {selectedHospitalForAppt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Book PHC OPD Token ({selectedHospitalForAppt.name})
              </h3>
              <button
                onClick={() => setSelectedHospitalForAppt(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {tokenSuccess ? (
              <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl font-bold text-xs text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p>{tokenSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleBookToken} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S. Appa Rao"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9848011223"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHospitalForAppt(null)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    {t('cancel', language)}
                  </button>
                  <button
                    id="btn-submit-phc-token"
                    type="submit"
                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
                  >
                    Generate Free Token
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
