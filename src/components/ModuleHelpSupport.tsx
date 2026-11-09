import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building2,
  Users,
  Search,
} from 'lucide-react';
import { Language } from '../types';
import { initialFaqItems } from '../data/seedData';

interface ModuleHelpSupportProps {
  language: Language;
}

export const ModuleHelpSupport: React.FC<ModuleHelpSupportProps> = ({ language }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackPhone, setFeedbackPhone] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const helplines = [
    { number: '1902', nameEn: 'Spandana / Jaganannaku Chebudam', nameTe: 'స్పందన ప్రజా సమస్యల పరిష్కారం', desc: 'Chief Minister Public Grievance Redressal Portal' },
    { number: '108', nameEn: 'YSR Emergency Ambulance Service', nameTe: '108 అత్యవసర అంబులెన్స్ సేవలు', desc: 'Immediate emergency medical transport & accident support' },
    { number: '104', nameEn: 'Mobile Medical & Health Helpline', nameTe: '104 మొబైల్ మెడికల్ & హెల్త్ యూనిట్', desc: 'Medical consultation, health camp schedule & medicine advice' },
    { number: '100 / 112', nameEn: 'AP Police Control Room', nameTe: 'ఆంధ్రప్రదేశ్ పోలీస్ కంట్రోల్ రూమ్', desc: 'Law and order emergency & local police station dispatch' },
    { number: '181', nameEn: 'Disha Women & Child Protection', nameTe: 'దిశ మహిళా భద్రత & సంరక్షణ విభాగం', desc: 'Women distress safety, family counseling & legal aid' },
    { number: '155333', nameEn: 'APCPDCL / Power Supply Complaint', nameTe: 'విద్యుత్ శాఖ కంట్రోల్ రూమ్', desc: 'Electricity breakdown, transformer damage & billing queries' },
    { number: '1962', nameEn: 'Toll-Free Veterinary Ambulance', nameTe: 'పశు సంవర్ధక శాఖ సంచార అంబులెన్స్', desc: 'Livestock and cattle emergency veterinary care at farm' },
    { number: '1098', nameEn: 'Childline 24/7 Protection Service', nameTe: 'చైల్డ్‌లైన్ బాలల సంరక్షణ సేవ', desc: 'Child protection, education dropout & rescue helpline' },
  ];

  const filteredFaqs = initialFaqItems.filter(
    (item) => faqCategory === 'All' || item.category === faqCategory
  );

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackMessage) return;
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackName('');
      setFeedbackPhone('');
      setFeedbackMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 text-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-800">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-700/80">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Citizen Assistance Center</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            {language === 'te' ? 'పౌర సహాయ కేంద్రం & మార్గదర్శకాలు' : 'Help, Citizen FAQs & Emergency Helplines'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'te'
              ? 'గ్రామ సమస్యలు, కార్మికులు, ఉపాధి పనులు మరియు సంక్షేమ పథకాల గురించి సందేహాలు, అత్యవసర ఫోన్ నంబర్లు మరియు సచివాలయ సంప్రదింపులు.'
              : 'Official guidelines, 24/7 toll-free emergency phone numbers, and answers to common questions about GramConnect village services.'}
          </p>
        </div>
      </div>

      {/* Emergency Toll-Free Helplines Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <span>{language === 'te' ? 'అత్యవసర టోల్-ఫ్రీ హెల్ప్‌లైన్లు (ఆంధ్రప్రదేశ్)' : 'Emergency & Public Service Toll-Free Helplines'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helplines.map((h, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-xl border border-teal-200">
                    {h.number}
                  </span>
                  <a
                    href={`tel:${h.number.split('/')[0].trim()}`}
                    className="p-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 font-bold text-xs"
                    title="Direct Call"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
                <h4 className="font-bold text-xs text-slate-900 mt-2">
                  {language === 'te' ? h.nameTe : h.nameEn}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How GramConnect Works: 4 Step Guide */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>{language === 'te' ? 'గ్రామ కనెక్ట్ ఎలా పనిచేస్తుంది?' : 'How GramConnect 360° Works for Citizens'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900">
              {language === 'te' ? 'సమస్యను ఫోటోతో నమోదు చేయండి' : 'Report Civic Problem with Photo'}
            </h4>
            <p className="text-slate-600 text-[11px]">
              Capture photo of damaged road, broken streetlight, or garbage with GPS location.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900">
              {language === 'te' ? 'కార్యదర్శి & సిబ్బంది పరిశీలన' : 'Panchayat Officer Triage'}
            </h4>
            <p className="text-slate-600 text-[11px]">
              Grama Secretary reviews grievance and assigns field officer with timeline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900">
              {language === 'te' ? 'స్థానిక కార్మికులు & ఉపాధి పనులు' : 'Connect with Local Workers'}
            </h4>
            <p className="text-slate-600 text-[11px]">
              Call electricians, masons, mechanics or find farm harvesting work near your village.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-black flex items-center justify-center">
              4
            </div>
            <h4 className="font-bold text-slate-900">
              {language === 'te' ? 'సంక్షేమ పథకాలు & ప్రయోజనాలు' : 'Welfare Schemes & Scholarships'}
            </h4>
            <p className="text-slate-600 text-[11px]">
              Check eligibility for Navaratnalu schemes, college scholarships and hospital services.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions (FAQ)'}
            </h3>
            <p className="text-xs text-slate-500">
              Clear answers regarding complaints, workers, job applications, and Grama Sachivalayam rules.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'Grievances', 'Workers', 'Jobs', 'Schemes'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFaqCategory(cat)}
                className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  faqCategory === cat
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {language === 'te' ? faq.questionTe : faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    <p>{language === 'te' ? faq.answerTe : faq.answer}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact & Feedback Form for Sachivalayam */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Send className="w-5 h-5 text-teal-700" />
          <span>{language === 'te' ? 'సచివాలయ అధికారులకు సందేశం పంపండి' : 'Send Inquiry / Feedback to Grama Sachivalayam'}</span>
        </h3>

        {feedbackSubmitted ? (
          <div className="p-4 bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Thank you! Your inquiry has been routed to the Penumantra Grama Sachivalayam desk.</span>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S. Appa Rao"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="9848011223"
                  value={feedbackPhone}
                  onChange={(e) => setFeedbackPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Inquiry / Message *</label>
              <textarea
                required
                rows={3}
                placeholder="Write your feedback, question, or suggestions in Telugu or English..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
              ></textarea>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Message to Panchayat</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
