import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  History,
  FileCheck,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  Language,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  UserRole,
} from '../types';
import { t } from '../translations';

interface ModuleComplaintsProps {
  language: Language;
  complaints: Complaint[];
  onRaiseComplaint: (complaint: Partial<Complaint>) => void;
  onUpdateComplaint: (id: string, updateData: Partial<Complaint>) => void;
  currentRole: UserRole;
}

export const ModuleComplaints: React.FC<ModuleComplaintsProps> = ({
  language,
  complaints,
  onRaiseComplaint,
  onUpdateComplaint,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'raise'>('list');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Roads');
  const [description, setDescription] = useState('');
  const [village, setVillage] = useState('Penumantra');
  const [locationAddress, setLocationAddress] = useState('');
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [gpsError, setGpsError] = useState<string>('');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [raisedByName, setRaisedByName] = useState('Citizen');
  const [raisedByPhone, setRaisedByPhone] = useState('9848011223');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample quick photos
  const samplePhotos = [
    { label: 'Pothole Road', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80' },
    { label: 'Broken Streetlight', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80' },
    { label: 'Drainage Overflow', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80' },
    { label: 'Water Pipe Leak', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleCaptureLocation = () => {
    setGpsError('');
    if (!('geolocation' in navigator)) {
      setGpsError(
        language === 'te'
          ? 'మీ పరికరంలో జియోలొకేషన్ సపోర్ట్ లేదు. దయచేసి స్థానాన్ని క్రింద మాన్యువల్‌గా నమోదు చేయండి.'
          : 'Geolocation is not supported by your browser. Please enter the address manually below.'
      );
      return;
    }

    setIsDetectingGps(true);
    setGpsStatus(
      language === 'te'
        ? 'డివైస్ GPS అనుమతిని అభ్యర్థిస్తున్నాము...'
        : 'Requesting device GPS location permission...'
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setIsDetectingGps(false);
        const lat = parseFloat(position.coords.latitude.toFixed(6));
        const lng = parseFloat(position.coords.longitude.toFixed(6));
        setGpsCoords({ lat, lng });
        setGpsStatus(
          language === 'te'
            ? `నిజమైన GPS స్థానం గుర్తించబడింది: ${lat}, ${lng} (ఖచ్చితత్వం: ~${Math.round(position.coords.accuracy)} మీటర్లు)`
            : `Live GPS Detected: ${lat}, ${lng} (Accuracy: ~${Math.round(position.coords.accuracy)}m)`
        );

        // Attempt reverse geocoding via OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            const cleanAddr = data.display_name.split(',').slice(0, 4).join(', ');
            setLocationAddress(cleanAddr);
          } else if (!locationAddress) {
            setLocationAddress(`${village} Area (GPS: ${lat}, ${lng})`);
          }
        } catch (err) {
          if (!locationAddress) {
            setLocationAddress(`${village} Area (GPS: ${lat}, ${lng})`);
          }
        }
      },
      (error) => {
        setIsDetectingGps(false);
        setGpsCoords(null);
        setGpsStatus('');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGpsError(
              language === 'te'
                ? 'స్థాన అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్‌లో అనుమతించండి లేదా క్రింద చిరునామాను మాన్యువల్‌గా నమోదు చేయండి.'
                : 'Location permission was denied. Please allow location access in your browser or enter the address manually below.'
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setGpsError(
              language === 'te'
                ? 'మీ పరికరంలో లొకేషన్ సమాచారం అందుబాటులో లేదు. దయచేసి చిరునామాను మాన్యువల్‌గా టైప్ చేయండి.'
                : 'Location information is unavailable on your device. Please enter the address manually.'
            );
            break;
          case error.TIMEOUT:
            setGpsError(
              language === 'te'
                ? 'లొకేషన్ అభ్యర్థన సమయం ముగిసింది. దయచేసి చిరునామాను మాన్యువల్‌గా టైప్ చేయండి.'
                : 'Location request timed out. Please enter the address manually below.'
            );
            break;
          default:
            setGpsError(
              language === 'te'
                ? 'లొకేషన్ గుర్తించడంలో సమస్య ఏర్పడింది. దయచేసి చిరునామాను మాన్యువల్‌గా నమోదు చేయండి.'
                : 'An error occurred while detecting location. Please enter the address manually.'
            );
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    onRaiseComplaint({
      title,
      category,
      village,
      mandal: village,
      district: 'West Godavari',
      description,
      locationAddress: locationAddress || village,
      gpsCoords: gpsCoords || undefined,
      photoUrl: photoPreview || samplePhotos[0].url,
      beforePhotoUrl: photoPreview || samplePhotos[0].url,
      raisedBy: raisedByName,
      raisedByPhone,
      priority,
    });

    setActiveTab('list');
    setTitle('');
    setDescription('');
    setLocationAddress('');
    setPhotoPreview('');
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-3 h-3 text-slate-600" />
            {t('statusSubmitted', language)}
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            <Eye className="w-3 h-3 text-blue-600" />
            {t('statusUnderReview', language)}
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {t('statusInProgress', language)}
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {t('statusResolved', language)}
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
            <FileCheck className="w-3 h-3 text-purple-600" />
            {t('statusClosed', language)}
          </span>
        );
      default:
        return null;
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (categoryFilter !== 'all' && c.category.toLowerCase() !== categoryFilter.toLowerCase())
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchLoc = c.locationAddress.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchDesc && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('grievanceTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official Grama Sachivalayam 5-stage tracking: Submitted → Under Review → In Progress → Resolved → Closed
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          {activeTab === 'raise' ? (
            <button
              onClick={() => setActiveTab('list')}
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
            >
              ← {t('complaintHistory', language)}
            </button>
          ) : (
            <button
              id="btn-open-raise-complaint"
              onClick={() => setActiveTab('raise')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all border border-emerald-500 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>{t('raiseComplaint', language)}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: RAISE COMPLAINT FORM */}
      {activeTab === 'raise' && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-base text-slate-900 border-b pb-2">
            {t('raiseComplaint', language)}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('complaintCategory', language)} *
              </label>
              <select
                id="complaint-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Roads">{t('categoryRoads', language)}</option>
                <option value="Drainage">{t('categoryDrainage', language)}</option>
                <option value="Garbage">{t('categoryGarbage', language)}</option>
                <option value="Streetlight">{t('categoryStreetlight', language)}</option>
                <option value="Water">{t('categoryWater', language)}</option>
                <option value="Electricity">{t('categoryElectricity', language)}</option>
                <option value="Public Facilities">{t('categoryPublicFacilities', language)}</option>
                <option value="Other">{t('categoryOther', language)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Priority / ప్రాధాన్యత
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-xl"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Emergency">🚨 Emergency / Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Short Issue Title / సమస్య పేరు *
            </label>
            <input
              id="complaint-title-input"
              type="text"
              required
              placeholder="e.g. Deep Pothole on School Road / వీధి దీపాలు వెలగడం లేదు"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('description', language)} *
            </label>
            <textarea
              id="complaint-desc-input"
              required
              rows={3}
              placeholder="Detailed explanation of the issue, landmark, since how many days..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            ></textarea>
          </div>

          {/* Location & GPS */}
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                {language === 'te' ? 'సమస్య ఉన్న ప్రదేశం / లొకేషన్' : 'Issue Location & Address'} *
              </label>
              <span className="text-[10px] text-slate-500 font-medium">
                {language === 'te' ? 'GPS లేదా మాన్యువల్ చిరునామా' : 'GPS or manual address'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="complaint-location-input"
                type="text"
                required
                placeholder={
                  language === 'te'
                    ? 'గ్రామం, వీధి పేరు, ల్యాండ్‌మార్క్ లేదా వార్డు సంఖ్య నమోదు చేయండి...'
                    : 'Village landmark, street name, ward number...'
                }
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                className="flex-1 text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                id="btn-detect-gps"
                onClick={handleCaptureLocation}
                disabled={isDetectingGps}
                className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm disabled:opacity-70"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'te' ? 'గుర్తిస్తోంది...' : 'Detecting...'}</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>{language === 'te' ? 'నా ప్రస్తుత స్థానాన్ని గుర్తించు' : 'Detect My Current Location'}</span>
                  </>
                )}
              </button>
            </div>

            {gpsError && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-amber-800 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{gpsError}</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    {language === 'te'
                      ? 'చింతించకండి, పైన ఉన్న ఫీల్డ్‌లో మీ గ్రామ వీధి లేదా ల్యాండ్‌మార్క్‌ను నేరుగా టైప్ చేయవచ్చు.'
                      : 'You can still proceed by entering your street or landmark manually in the input above.'}
                  </p>
                </div>
              </div>
            )}

            {gpsCoords && (
              <div className="space-y-2">
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      {language === 'te' ? 'GPS గుర్తించబడింది:' : 'GPS Detected:'}{' '}
                      <span className="font-mono font-bold">
                        {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
                      </span>
                    </span>
                  </div>
                  {gpsStatus && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {gpsStatus}
                    </span>
                  )}
                </div>

                {/* OpenStreetMap interactive map preview with pin marker */}
                <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner h-44 bg-slate-100">
                  <iframe
                    title="Complaint Location Map"
                    width="100%"
                    height="100%"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${gpsCoords.lng - 0.005}%2C${gpsCoords.lat - 0.004}%2C${gpsCoords.lng + 0.005}%2C${gpsCoords.lat + 0.004}&layer=mapnik&marker=${gpsCoords.lat}%2C${gpsCoords.lng}`}
                    className="border-0 w-full h-full"
                  />
                  <div className="absolute bottom-1 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] text-slate-600 rounded shadow">
                    © OpenStreetMap contributors
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {t('uploadPhoto', language)}
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                id="complaint-photo-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />

              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <span>Or pick demo photo:</span>
                {samplePhotos.slice(0, 2).map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoPreview(sp.url)}
                    className="underline text-teal-700 font-semibold"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {photoPreview && (
              <div className="relative w-36 h-28 rounded-xl overflow-hidden border border-slate-300 mt-2">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview('')}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Citizen Name
              </label>
              <input
                type="text"
                value={raisedByName}
                onChange={(e) => setRaisedByName(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Mobile
              </label>
              <input
                type="tel"
                value={raisedByPhone}
                onChange={(e) => setRaisedByPhone(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              {t('cancel', language)}
            </button>
            <button
              id="btn-submit-complaint"
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
            >
              {t('submit', language)}
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: COMPLAINTS LISTING */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="search-complaints-input"
                type="text"
                placeholder="Search complaint ID, category, road..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              id="filter-complaint-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 bg-white text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">All Tracking Statuses</option>
              <option value="Submitted">{t('statusSubmitted', language)}</option>
              <option value="Under Review">{t('statusUnderReview', language)}</option>
              <option value="In Progress">{t('statusInProgress', language)}</option>
              <option value="Resolved">{t('statusResolved', language)}</option>
              <option value="Closed">{t('statusClosed', language)}</option>
            </select>

            <select
              id="filter-complaint-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="py-2 px-3 bg-white text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Roads">Roads & Potholes</option>
              <option value="Drainage">Drainage & Sanitation</option>
              <option value="Garbage">Garbage Issues</option>
              <option value="Streetlight">Streetlights</option>
              <option value="Water">Drinking Water</option>
              <option value="Electricity">Electricity</option>
            </select>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                id={`complaint-card-${c.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Before/After tag */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={c.photoUrl || samplePhotos[0].url}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="font-mono text-[10px] font-bold bg-slate-950/80 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {c.id}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5">
                      {getStatusBadge(c.status)}
                    </div>

                    {c.afterPhotoUrl && (
                      <div className="absolute bottom-2 right-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        ✓ Photo Resolved
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span>Filed: {c.createdAt}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1 leading-snug">
                      {c.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="line-clamp-1">{c.locationAddress}</span>
                    </div>

                    {c.assignedOfficer && (
                      <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-600 border border-slate-200">
                        <strong>Officer:</strong> {c.assignedOfficer}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                  >
                    <History className="w-3.5 h-3.5 text-teal-600" />
                    <span>View Timeline & Evidence</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESOLUTION TIMELINE & EVIDENCE MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                    {selectedComplaint.id}
                  </span>
                  {getStatusBadge(selectedComplaint.status)}
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Before vs After Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  {t('beforeImage', language)}
                </span>
                <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={selectedComplaint.beforePhotoUrl || selectedComplaint.photoUrl}
                    alt="Before"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  {t('afterImage', language)}
                </span>
                <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  {selectedComplaint.afterPhotoUrl ? (
                    <img
                      src={selectedComplaint.afterPhotoUrl}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4 text-xs text-slate-400 space-y-1">
                      <Clock className="w-6 h-6 mx-auto text-slate-300" />
                      <span>Resolution evidence photo will be uploaded once field work is completed.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Complaint Meta Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <strong>Category:</strong> {selectedComplaint.category}
                </div>
                <div>
                  <strong>Location:</strong> {selectedComplaint.locationAddress}
                </div>
                <div>
                  <strong>Reported By:</strong> {selectedComplaint.raisedBy} ({selectedComplaint.raisedByPhone})
                </div>
                <div>
                  <strong>Assigned Staff:</strong> {selectedComplaint.assignedOfficer || 'Panchayat Team'}
                </div>
              </div>
              <p className="text-slate-700 pt-1 border-t border-slate-200">
                <strong>Description:</strong> {selectedComplaint.description}
              </p>
              {selectedComplaint.adminNotes && (
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded-xl text-teal-900 mt-2">
                  <strong>Official Panchayat Remarks:</strong> {selectedComplaint.adminNotes}
                </div>
              )}
            </div>

            {/* 5-Stage Status Progress Indicator */}
            <div className="space-y-2 pt-1">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                5-Stage Resolution Pipeline
              </h4>

              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
                {['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'].map((st, idx) => {
                  const stageOrder = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Closed'];
                  const currentIndex = stageOrder.indexOf(selectedComplaint.status);
                  const isPassed = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;

                  return (
                    <div
                      key={st}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                        isCurrent
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-extrabold bg-white/20">
                        {idx + 1}
                      </span>
                      <span className="leading-tight">{st}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* History Timeline */}
            {selectedComplaint.history && selectedComplaint.history.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-teal-600" />
                  Status Audit Trail & Logs
                </h4>
                <div className="space-y-2">
                  {selectedComplaint.history.map((h) => (
                    <div
                      key={h.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-start"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{h.status}</span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            by {h.updatedBy}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1">{h.notes}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {h.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
