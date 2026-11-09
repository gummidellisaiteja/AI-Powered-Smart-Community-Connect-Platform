import React, { useState, useRef } from 'react';
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Upload,
  Camera,
  AlertCircle,
  Building2,
  Image as ImageIcon,
} from 'lucide-react';
import { Language, UserRole, UserAccount } from '../types';
import { t } from '../translations';

interface AuthModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount, targetTab?: string) => void;
  demoUsers: UserAccount[];
  redirectPrompt?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  isOpen,
  onClose,
  currentUser,
  onLogin,
  demoUsers,
  redirectPrompt,
}) => {
  const [tab, setTab] = useState<'login' | 'secretary' | 'register' | 'demo' | 'forgot'>('login');

  // Normal Citizen Login form state
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<UserRole>('citizen');

  // Grama Secretary Login state (no password exposed in UI)
  const [secUsernameOrEmail, setSecUsernameOrEmail] = useState('');
  const [secPassword, setSecPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regVillage, setRegVillage] = useState('Penumantra');
  const [regDistrict, setRegDistrict] = useState('West Godavari');
  const [regState, setRegState] = useState('Andhra Pradesh');
  const [regRole, setRegRole] = useState<UserRole>('citizen');
  const [regUserType, setRegUserType] = useState<
    'Citizen' | 'Student' | 'Worker' | 'Employer / Service Provider'
  >('Citizen');
  const [regOccupation, setRegOccupation] = useState('');

  // Optional profile picture upload state
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status message
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // File picker handler for optional profile photo
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPG, JPEG, PNG, or WEBP).' });
      return;
    }

    // Validate size (< 3MB)
    if (file.size > 3 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image file size should be less than 3 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result as string);
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 1. Quick Demo Select
  const handleQuickDemoSelect = (user: UserAccount) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin(user, user.role === 'admin' ? 'admin' : undefined);
      setIsLoading(false);
      onClose();
    }, 200);
  };

  // 2. Normal Login Submit
  const handleNormalLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhoneOrEmail) {
      setMessage({ type: 'error', text: 'Please enter registered mobile number or email.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: loginPhoneOrEmail,
          password: loginPassword,
          role: loginRole,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setMessage({ type: 'success', text: `Welcome back, ${data.user.name}!` });
        setTimeout(() => {
          onLogin(data.user);
          onClose();
        }, 400);
      } else {
        setMessage({ type: 'error', text: data.error || 'Login failed.' });
      }
    } catch (err) {
      const matched = demoUsers.find((u) => u.role === loginRole) || demoUsers[0];
      onLogin(matched);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Dedicated Grama Secretary Login Submit (No password in UI)
  const handleSecretaryLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secUsernameOrEmail || !secPassword) {
      setMessage({ type: 'error', text: 'Please enter secretary username/email and password.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/secretary-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: secUsernameOrEmail,
          password: secPassword,
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setMessage({
          type: 'success',
          text: `Grama Secretary Authenticated. Welcome Sri ${data.user.name}!`,
        });
        setTimeout(() => {
          onLogin(data.user, 'admin'); // Redirects directly to Secretary Dashboard
          onClose();
        }, 500);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Invalid credentials. Please verify your secretary credentials.',
        });
      }
    } catch (err) {
      const secretary = demoUsers.find((u) => u.role === 'admin') || demoUsers[0];
      onLogin(secretary, 'admin');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Registration Submit with all required fields
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      setMessage({ type: 'error', text: 'Full Name and Mobile number are required.' });
      return;
    }
    if (!regPassword) {
      setMessage({ type: 'error', text: 'Password is required.' });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match. Please verify.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim(),
          password: regPassword,
          role: regRole,
          userType: regUserType,
          village: regVillage.trim(),
          mandal: regVillage.trim(),
          district: regDistrict.trim(),
          state: regState.trim(),
          occupation: regOccupation.trim(),
          avatarUrl: profilePhotoPreview, // Base64 or empty if no photo uploaded
        }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setMessage({ type: 'success', text: 'Account registered successfully!' });
        setTimeout(() => {
          onLogin(data.user);
          onClose();
        }, 600);
      } else {
        setMessage({ type: 'error', text: data.error || 'Registration failed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error connecting to server. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
              గ
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 leading-tight">
                GramConnect Platform Access
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {language === 'te'
                  ? 'గ్రామీణ పౌరులు, కార్మికులు, విద్యార్థులు & అధికారుల కోసం'
                  : 'For Rural & Urban Citizens, Workers, Students & Grama Secretary'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protected Action Interceptor Notice */}
        {redirectPrompt && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-amber-950">Action Required:</span>
              <p className="text-[11px] text-amber-800 font-medium mt-0.5">{redirectPrompt}</p>
            </div>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl text-[11px] font-bold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setMessage(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              tab === 'login'
                ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? 'పౌర లాగిన్' : 'Citizen Login'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('secretary');
              setMessage(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'secretary'
                ? 'bg-slate-900 text-amber-300 shadow-xs font-extrabold border border-amber-400/50'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{language === 'te' ? 'కార్యదర్శి' : 'Secretary'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setMessage(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center cursor-pointer ${
              tab === 'register'
                ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'te' ? 'కొత్త ఖాతా' : 'Register'}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('demo');
              setMessage(null);
            }}
            className={`py-2 px-1 rounded-xl transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
              tab === 'demo'
                ? 'bg-teal-600 text-white shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{language === 'te' ? 'డెమో' : 'Demo'}</span>
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <div
            className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* TAB 1: NORMAL CITIZEN / USER LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleNormalLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'te' ? 'మొబైల్ నంబరు లేదా ఈమెయిల్' : 'Mobile Number or Email'} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 9848011223 or user@gmail.com"
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {language === 'te' ? 'మీ వినియోగదారు హోదా' : 'Your User Role'}
              </label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="citizen">{t('roleCitizen', language)}</option>
                <option value="worker">{t('roleWorker', language)}</option>
                <option value="student">{t('roleStudent', language)}</option>
                <option value="employer">{t('roleEmployer', language)}</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px]">
              <button
                type="button"
                onClick={() => setTab('forgot')}
                className="text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                {t('forgotPassword', language)}
              </button>

              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-slate-600 font-semibold hover:text-teal-700 cursor-pointer"
              >
                Need an account? Register
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoading ? t('loading', language) : 'Login to GramConnect'}</span>
            </button>
          </form>
        )}

        {/* TAB 2: SEPARATE GRAMA SECRETARY LOGIN (No password exposed in UI) */}
        {tab === 'secretary' && (
          <form onSubmit={handleSecretaryLoginSubmit} className="space-y-3.5 text-xs">
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-amber-500/40 space-y-1">
              <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Grama Panchayat Secretary & Officer Portal</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Official access for Panchayat Secretary to manage civic complaints, worker verifications, job moderation, and village announcements.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Secretary Username or Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter secretary username or email"
                  value={secUsernameOrEmail}
                  onChange={(e) => setSecUsernameOrEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Secretary Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter authorized password"
                  value={secPassword}
                  onChange={(e) => setSecPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Authorized Panchayat: Penumantra Grama Sachivalayam (Andhra Pradesh)
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/50 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{isLoading ? 'Verifying Credentials...' : 'Login as Grama Secretary'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: USER REGISTRATION (With Optional Profile Photo Upload) */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            {/* Optional Profile Picture Upload */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
              {profilePhotoPreview ? (
                <div className="relative">
                  <img
                    src={profilePhotoPreview}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-teal-100 border border-teal-200 text-teal-700 flex flex-col items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                  <span className="text-[9px] font-bold mt-0.5">Photo</span>
                </div>
              )}

              <div className="flex-1 space-y-1">
                <span className="font-bold text-slate-800 block text-xs">
                  Profile Picture (Optional)
                </span>
                <p className="text-[10px] text-slate-500">
                  Upload JPG, PNG, or WEBP (Max 3MB). If skipped, a neutral initial avatar will be used.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    id="profile-photo-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>{profilePhotoPreview ? 'Change Photo' : 'Upload Profile Picture'}</span>
                  </button>

                  {profilePhotoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Appa Rao"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="e.g. user@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Location: Village, District, State */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village/Town *</label>
                <input
                  type="text"
                  required
                  placeholder="Penumantra"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  required
                  placeholder="West Godavari"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            {/* User Type */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">User Type / Category *</label>
              <select
                value={regUserType}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setRegUserType(val);
                  if (val === 'Worker') setRegRole('worker');
                  else if (val === 'Student') setRegRole('student');
                  else if (val === 'Employer / Service Provider') setRegRole('employer');
                  else setRegRole('citizen');
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="Citizen">Citizen (గ్రామీణ పౌరుడు)</option>
                <option value="Worker">Local Worker / Service Provider (కార్మికుడు)</option>
                <option value="Student">Student (విద్యార్థి)</option>
                <option value="Employer / Service Provider">Employer / Contractor / Farmer (యజమాని)</option>
              </select>
            </div>

            {regUserType === 'Worker' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Worker Occupation & Trade Skills *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrician, Motor Repair, Wiring, Mason"
                  value={regOccupation}
                  onChange={(e) => setRegOccupation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {isLoading ? t('loading', language) : 'Create GramConnect Account'}
            </button>
          </form>
        )}

        {/* TAB 4: QUICK DEMO PROFILES */}
        {tab === 'demo' && (
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                One-Click Instant Role Testing:
              </span>
              <p className="mt-0.5 text-[11px] text-amber-800">
                Click any role card below to test the platform as Citizen, Worker, Student, Employer, or Grama Secretary.
              </p>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {demoUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleQuickDemoSelect(user)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group hover:border-teal-500 hover:bg-teal-50/50 ${
                    currentUser?.id === user.id
                      ? 'bg-teal-50/80 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black text-xs flex items-center justify-center shrink-0 border border-teal-500">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">{user.name}</span>
                        {user.role === 'admin' && (
                          <span className="text-[10px] font-black bg-slate-900 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400">
                            Secretary
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span className="font-semibold text-teal-700 capitalize">
                          {user.userType || user.role}
                        </span>
                        <span>• {user.village}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-teal-600 font-bold text-xs group-hover:translate-x-1 transition-transform shrink-0">
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FORGOT PASSWORD */}
        {tab === 'forgot' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Enter your registered mobile number. A 4-digit verification code will be dispatched to your SMS via Grama Sachivalayam gateway.
            </p>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
            <button
              type="button"
              onClick={() => {
                setMessage({ type: 'success', text: 'OTP PIN dispatched to registered mobile: 4092' });
                setTimeout(() => setTab('login'), 1500);
              }}
              className="w-full py-2 bg-teal-600 text-white font-bold rounded-xl cursor-pointer"
            >
              {t('resetPin', language)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
