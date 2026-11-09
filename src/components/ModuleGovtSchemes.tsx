import React, { useState } from 'react';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building,
  HelpCircle,
  X,
  Download,
} from 'lucide-react';
import { Language, GovtScheme } from '../types';
import { initialGovtSchemes } from '../data/seedData';

interface ModuleGovtSchemesProps {
  language: Language;
  schemes?: GovtScheme[];
}

export const ModuleGovtSchemes: React.FC<ModuleGovtSchemesProps> = ({
  language,
  schemes: propSchemes,
}) => {
  const schemes = propSchemes && propSchemes.length > 0 ? propSchemes : initialGovtSchemes;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSchemeModal, setActiveSchemeModal] = useState<GovtScheme | null>(null);

  const handleDownloadGuidelines = (scheme: GovtScheme) => {
    const sTitle = scheme.title || scheme.name || 'Welfare Scheme';
    const sTitleTe = scheme.titleTe || scheme.nameTe || '';
    const sDept = scheme.department || scheme.dept || 'Grama Sachivalayam';
    const sBenefit = scheme.financialAssistance || scheme.benefits || 'Direct Benefit Transfer';
    const sDesc = scheme.description || scheme.benefits || 'Government welfare support';
    const sBeneficiary = scheme.beneficiaryType || 'Eligible residents of AP';
    const sPortal = scheme.officialPortalUrl || scheme.portalLink || 'https://navasakam.ap.gov.in';
    const eligList = Array.isArray(scheme.eligibility) ? scheme.eligibility : [scheme.eligibility || 'Eligible Citizen'];

    const textContent = `=====================================================
GOVERNMENT OF ANDHRA PRADESH & GOI WELFARE SCHEME
OFFICIAL IMPLEMENTATION GUIDELINES & CITIZEN CHARTER
=====================================================
Scheme: ${sTitle}
Telugu Name: ${sTitleTe}
Nodal Department: ${sDept}
Category: ${scheme.category}
Target Beneficiary: ${sBeneficiary}
Financial Assistance: ${sBenefit}
Status: Verified Active for FY 2025-2026

OVERVIEW & OBJECTIVES:
-----------------------------------------------------
${sDesc}

ELIGIBILITY CRITERIA:
-----------------------------------------------------
${eligList.map((c, i) => `${i + 1}. ${c}`).join('\n')}

MANDATORY DOCUMENTS REQUIRED:
-----------------------------------------------------
${scheme.requiredDocuments.map((d, i) => `[ ] ${d}`).join('\n')}

STEP-BY-STEP APPLICATION PROCEDURE:
-----------------------------------------------------
1. Visit your local Grama / Ward Sachivalayam (Village Secretariat).
2. Contact the Village Revenue Officer (VRO) or Welfare & Education Assistant.
3. Submit photocopies of Aadhaar, Ration / Rice Card, and Bank Account Passbook.
4. Complete biometric / IRIS e-KYC authentication on the Navasakam portal.
5. Verification by Sachivalayam functionaries within 15 working days.
6. Display on Village Social Audit list; DBT transfer to linked bank account.

Toll-free Citizen Grievance Helpline: 1902
Official Portal: ${sPortal}
=====================================================`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Guidelines_2026.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = [
    { id: 'All', labelEn: 'All Schemes', labelTe: 'అన్ని పథకాలు' },
    { id: 'Farmers', labelEn: 'Farmers & Rythu', labelTe: 'రైతులు & వ్యవసాయం' },
    { id: 'Students', labelEn: 'Students & Youth', labelTe: 'విద్యార్థులు & యువత' },
    { id: 'Women', labelEn: 'Women & DWACRA', labelTe: 'మహిళలు & డ్వాక్రా' },
    { id: 'Pension', labelEn: 'Pension & Welfare', labelTe: 'పెన్షన్ & సామాజిక భద్రత' },
    { id: 'Housing', labelEn: 'Housing & Health', labelTe: 'ఇళ్ళు & ఆరోగ్యశ్రీ' },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      s.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Farmers' && s.category.includes('Agriculture')) ||
      (selectedCategory === 'Students' && s.category.includes('Education')) ||
      (selectedCategory === 'Women' && s.category.includes('Women')) ||
      (selectedCategory === 'Pension' && s.category.includes('Pension')) ||
      (selectedCategory === 'Housing' && (s.category.includes('Housing') || s.category.includes('Health')));

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.titleTe.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.beneficiaryType.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-teal-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-800/60 text-teal-300 text-xs font-bold border border-teal-700/80">
            <Building className="w-3.5 h-3.5" />
            <span>Grama & Ward Sachivalayam Gateway</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
            {language === 'te'
              ? 'ఆంధ్రప్రదేశ్ & కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలు'
              : 'Government Welfare Schemes & Public Services'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'te'
              ? 'రైతు భరోసా, విద్యా దీవెన, పెన్షన్ కానుక, ఆరోగ్యశ్రీ మరియు నవరత్నాలు పథకాల అర్హతలు, అవసరమైన పత్రాలు మరియు దరఖాస్తు మార్గదర్శకాలు.'
              : 'Official guidelines, eligibility criteria, required documents, and application steps for major AP Navaratnalu & Central welfare schemes.'}
          </p>
        </div>

        {/* Quick Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Available Schemes</span>
            <div className="text-lg font-black text-amber-300">{schemes.length} Active</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Target Beneficiaries</span>
            <div className="text-lg font-black text-teal-300">100% Direct DBT</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Sachivalayam Service</span>
            <div className="text-lg font-black text-emerald-300">Doorstep Delivery</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Assistance Helpline</span>
            <div className="text-lg font-black text-blue-300">Dial 1902 (Toll Free)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={
              language === 'te'
                ? 'పథకం పేరు లేదా వర్గం శోధించండి...'
                : 'Search scheme name, farmers, pension...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'te' ? c.labelTe : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {scheme.category}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified: Jan 2026
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                  {language === 'te' ? scheme.titleTe : scheme.title}
                </h3>
                {language === 'te' && (
                  <p className="text-[11px] text-slate-500 font-semibold">{scheme.title}</p>
                )}
                <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
                  Dept: {scheme.department}
                </span>
              </div>

              {/* Assistance highlight pill */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between text-xs">
                <span className="font-bold">Financial Benefit:</span>
                <span className="font-black text-amber-950">{scheme.financialAssistance}</span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {language === 'te' ? scheme.descriptionTe : scheme.description}
              </p>

              {/* Key Beneficiary & Eligibility */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="truncate">For: {scheme.beneficiaryType}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    Eligibility: {Array.isArray(scheme.eligibility) ? scheme.eligibility[0] : scheme.eligibility}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setActiveSchemeModal(scheme)}
                className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'అర్హతలు & దరఖాస్తు' : 'Check & Apply'}</span>
              </button>

              <button
                onClick={() => handleDownloadGuidelines(scheme)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Download Scheme Guidelines"
              >
                <Download className="w-4 h-4 text-slate-600" />
              </button>

              {scheme.officialPortalUrl && (
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-teal-50 text-teal-700 transition-colors"
                  title="Official Government Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Scheme Detail & Application Modal */}
      {activeSchemeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {activeSchemeModal.category}
                </span>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">
                  {language === 'te' ? activeSchemeModal.titleTe : activeSchemeModal.title}
                </h3>
                <p className="text-xs text-slate-500">{activeSchemeModal.department}</p>
              </div>
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Benefit banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center justify-between text-xs">
              <span className="font-bold">Financial Assistance:</span>
              <span className="font-black text-sm text-emerald-950">
                {activeSchemeModal.financialAssistance}
              </span>
            </div>

            {/* Full Description */}
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-700">Scheme Overview:</span>
              <p className="text-slate-600 leading-relaxed">
                {language === 'te'
                  ? activeSchemeModal.descriptionTe
                  : activeSchemeModal.description}
              </p>
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Eligibility Criteria:</span>
              <ul className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {(Array.isArray(activeSchemeModal.eligibility)
                  ? activeSchemeModal.eligibility
                  : [activeSchemeModal.eligibility]
                ).map((crit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Documents */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800">Required Documents for Application:</span>
              <div className="grid grid-cols-2 gap-2">
                {activeSchemeModal.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 text-slate-700 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                    <span className="truncate">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Apply Step-by-Step */}
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs space-y-2">
              <span className="font-extrabold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                How to Apply via Grama Sachivalayam:
              </span>
              <ol className="list-decimal pl-4 space-y-1 text-teal-900 leading-relaxed font-medium">
                <li>Visit your local Grama / Ward Sachivalayam with the required documents above.</li>
                <li>Request the Welfare & Education Assistant / Digital Assistant for scheme registration.</li>
                <li>Digital biometric or IRIS authentication will be completed on the Navasakam portal.</li>
                <li>A social audit draft list will be displayed on the Grama Panchayat Notice Board.</li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setActiveSchemeModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadGuidelines(activeSchemeModal)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Download Guidelines</span>
                </button>

                {activeSchemeModal.officialPortalUrl && (
                  <a
                    href={activeSchemeModal.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Open Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
