import React, { useState } from 'react';
import {
  Store,
  Search,
  MapPin,
  Clock,
  PhoneCall,
  PlusCircle,
  Bookmark,
  CheckCircle2,
  Tag,
  Star,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Language, LocalBusiness, ShopCategory, UserRole } from '../types';
import { t } from '../translations';

interface ModuleShopsProps {
  language: Language;
  shops: LocalBusiness[];
  onRegisterShop: (shopData: Partial<LocalBusiness>) => void;
  savedShops: string[];
  onToggleBookmark: (shopId: string) => void;
  currentRole: UserRole;
}

export const ModuleShops: React.FC<ModuleShopsProps> = ({
  language,
  shops,
  onRegisterShop,
  savedShops,
  onToggleBookmark,
  currentRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [villageFilter, setVillageFilter] = useState('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regNameTe, setRegNameTe] = useState('');
  const [regCategory, setRegCategory] = useState<ShopCategory>('Grocery & Kirana');
  const [regOwner, setRegOwner] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regVillage, setRegVillage] = useState('Penumantra');
  const [regHours, setRegHours] = useState('7:00 AM – 9:00 PM');
  const [regProducts, setRegProducts] = useState('');
  const [regPhoto, setRegPhoto] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const categories: { key: string; labelEn: string; labelTe: string }[] = [
    { key: 'all', labelEn: 'All Businesses', labelTe: 'అన్ని దుకాణాలు' },
    { key: 'Grocery & Kirana', labelEn: 'Grocery & Kirana (కిరాణా)', labelTe: 'కిరాణా దుకాణాలు' },
    { key: 'Pharmacy & Medical', labelEn: 'Pharmacy & Medical (మెడికల్)', labelTe: 'మెడికల్ & ఫార్మసీ' },
    { key: 'Agriculture & Seeds', labelEn: 'Agri & Seeds (ఎరువులు, విత్తనాలు)', labelTe: 'ఎరువులు & విత్తనాలు' },
    { key: 'Tailoring & Textiles', labelEn: 'Tailoring & Clothes (టైలరింగ్)', labelTe: 'టైలరింగ్ & బట్టలు' },
    { key: 'Automobile & Repair', labelEn: 'Auto Garage & Repair (రిపేర్)', labelTe: 'మోటార్ & రిపేర్' },
    { key: 'Food & Bakery', labelEn: 'Food & Bakery (హోటల్, బేకరీ)', labelTe: 'హోటళ్ళు & బేకరీలు' },
    { key: 'MeeSeva & Internet', labelEn: 'MeeSeva & Xerox (మీసేవ)', labelTe: 'మీసేవ & నెట్ సెంటర్' },
    { key: 'Hardware & Electrical', labelEn: 'Hardware & Electrical (హార్డ్‌వేర్)', labelTe: 'హార్డ్‌వేర్' },
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regAddress) return;

    onRegisterShop({
      name: regName,
      nameTe: regNameTe || regName,
      category: regCategory,
      ownerName: regOwner || 'Shop Owner',
      phone: regPhone,
      address: regAddress,
      village: regVillage,
      mandal: regVillage,
      district: 'West Godavari',
      openingHours: regHours,
      isOpen: true,
      productsAndServices: regProducts.split(',').map((p) => p.trim()),
      photoUrl:
        regPhoto ||
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80',
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegisterModal(false);
      setRegName('');
      setRegNameTe('');
      setRegPhone('');
      setRegAddress('');
      setRegProducts('');
    }, 2000);
  };

  const filteredShops = shops.filter((shop) => {
    if (filterSavedOnly && !savedShops.includes(shop.id)) return false;
    if (categoryFilter !== 'all' && shop.category !== categoryFilter) return false;
    if (villageFilter !== 'all' && !shop.village.toLowerCase().includes(villageFilter.toLowerCase()))
      return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = shop.name.toLowerCase().includes(q) || shop.nameTe.toLowerCase().includes(q);
      const matchOwner = shop.ownerName.toLowerCase().includes(q);
      const matchProduct = shop.productsAndServices.some((p) => p.toLowerCase().includes(q));
      if (!matchName && !matchOwner && !matchProduct) return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('shopsTitle', language)}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('shopsSubtitle', language)}
          </p>
        </div>

        <button
          id="btn-register-shop-open"
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-md transition-all border border-teal-600"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('registerShop', language)}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            id="shop-search-input"
            type="text"
            placeholder={t('searchShops', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <select
          id="shop-category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="py-2 px-3 bg-white text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {language === 'te' ? c.labelTe : c.labelEn}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilterSavedOnly(!filterSavedOnly)}
          className={`py-2 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
            filterSavedOnly
              ? 'bg-teal-600 text-white border-teal-500'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved ({savedShops.length})</span>
        </button>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShops.map((shop) => {
          const isSaved = savedShops.includes(shop.id);
          return (
            <div
              key={shop.id}
              id={`shop-card-${shop.id}`}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Status */}
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img
                    src={shop.photoUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900/80 text-white backdrop-blur-xs">
                      {shop.category}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(shop.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-slate-700 hover:text-teal-600 transition-colors shadow-sm"
                    title="Bookmark Shop"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-teal-600 text-teal-600' : 'text-slate-600'
                      }`}
                    />
                  </button>

                  <div className="absolute bottom-2 left-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      {shop.isOpen ? t('shopOpenNow', language) : t('shopClosed', language)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {language === 'te' ? shop.nameTe : shop.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      <strong>{t('owner', language)}:</strong> {shop.ownerName}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{shop.openingHours}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs pt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{shop.rating}</span>
                      <span className="text-slate-400 font-normal">
                        ({shop.reviewCount} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Products & Services Chips */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      {t('productsServices', language)}:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {shop.productsAndServices.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Call Button */}
              <div className="p-4 pt-0">
                <a
                  href={`tel:${shop.phone}`}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>
                    {t('callNow', language)}: {shop.phone}
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* REGISTER SHOP MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {t('registerShop', language)}
              </h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {regSuccess ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm">Business Registered Successfully!</h4>
                <p className="text-xs text-emerald-800">
                  Your shop is now listed on GramConnect local business directory.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shop / Business Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Lakshmi Super Kirana"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    దుకాణం పేరు (తెలుగులో)
                  </label>
                  <input
                    type="text"
                    placeholder="ఉదా: శ్రీ లక్ష్మి సూపర్ కిరాణా"
                    value={regNameTe}
                    onChange={(e) => setRegNameTe(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Business Category *
                    </label>
                    <select
                      value={regCategory}
                      onChange={(e) => setRegCategory(e.target.value as ShopCategory)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold"
                    >
                      <option value="Grocery & Kirana">Grocery & Kirana</option>
                      <option value="Pharmacy & Medical">Pharmacy & Medical</option>
                      <option value="Agriculture & Seeds">Agriculture & Seeds</option>
                      <option value="Tailoring & Textiles">Tailoring & Textiles</option>
                      <option value="Automobile & Repair">Automobile & Repair</option>
                      <option value="Food & Bakery">Food & Bakery</option>
                      <option value="MeeSeva & Internet">MeeSeva & Internet</option>
                      <option value="Hardware & Electrical">Hardware & Electrical</option>
                      <option value="General Store">General Store</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Proprietor / Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B. Appa Rao"
                      value={regOwner}
                      onChange={(e) => setRegOwner(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Contact Mobile Number *
                    </label>
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
                    <label className="block font-bold text-slate-700 mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 7:00 AM – 9:00 PM"
                      value={regHours}
                      onChange={(e) => setRegHours(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shop Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Near Ramalayam Temple, Main Bazar, Penumantra"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Products & Key Services (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Rice, Oil, Milk, Masalas, UPI Payment"
                    value={regProducts}
                    onChange={(e) => setRegProducts(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Shop Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={regPhoto}
                    onChange={(e) => setRegPhoto(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  />
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
                    id="btn-submit-shop-register"
                    type="submit"
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow"
                  >
                    Submit Business Listing
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
