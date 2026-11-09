import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  FileCheck,
  Award,
  BookMarked,
  Download,
  Calendar,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Code,
  Laptop,
  HelpCircle,
  FileText,
  X,
  Calculator,
  Eye,
  Check,
  AlertCircle,
  Building,
  School,
  Briefcase,
  Share2,
} from 'lucide-react';
import {
  Language,
  Scholarship,
  EducationalResource,
  TuitionCoaching,
  GovtJobNotification,
} from '../types';
import { t } from '../translations';
import { initialGovtJobNotifications } from '../data/seedData';

interface ModuleEducationProps {
  language: Language;
  scholarships: Scholarship[];
  resources: EducationalResource[];
  tuitions: TuitionCoaching[];
}

export const ModuleEducation: React.FC<ModuleEducationProps> = ({
  language,
  scholarships,
  resources,
  tuitions,
}) => {
  // 5 Key Sections matching prompt
  const [eduTab, setEduTab] = useState<'scholarships' | 'exams' | 'resources' | 'courses' | 'local'>('scholarships');
  const [searchQuery, setSearchQuery] = useState('');
  const [scholarshipFilter, setScholarshipFilter] = useState<'all' | 'School' | 'College' | 'Degree'>('all');

  // Modals
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [selectedExam, setSelectedExam] = useState<GovtJobNotification | null>(null);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [isEligibilityCheckerOpen, setIsEligibilityCheckerOpen] = useState(false);

  // Eligibility Checker State
  const [eligCourse, setEligCourse] = useState('Degree / BTech');
  const [eligIncome, setEligIncome] = useState('150000');
  const [eligCategory, setEligCategory] = useState('BC');
  const [eligMarks, setEligMarks] = useState('75');
  const [matchedSchemes, setMatchedSchemes] = useState<string[] | null>(null);

  // Study planner state
  const [tasks, setTasks] = useState([
    { id: '1', title: 'AP SSC Maths Trigonometry Chapter Revision', done: true },
    { id: '2', title: 'APPSC Group 2 AP History Paper Mock Test', done: false },
    { id: '3', title: 'Submit Jagananna Vidya Deevena Renewal on JnanaBhumi', done: false },
    { id: '4', title: 'AP Police Constable Mental Ability Speed Test', done: true },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Course modules
  const [activeCourseModal, setActiveCourseModal] = useState<any | null>(null);

  const competitiveExams: GovtJobNotification[] = initialGovtJobNotifications;

  const skillCourses = [
    {
      id: 'CRS-01',
      title: 'Digital Literacy, MS Office & Internet Services',
      titleTe: 'కంప్యూటర్ బేసిక్స్, ఎంఎస్ ఆఫీస్ & ఇంటర్నెట్ సేవలు',
      provider: 'AP Skill Development Corporation (APSSDC)',
      duration: '4 Weeks (Free Certificate)',
      mode: 'Blended Online & Center',
      link: 'https://www.apssdc.in',
      syllabus: ['Computer Fundamentals & OS', 'MS Word & Telugu Typing', 'Excel Spreadsheets & Data Entry', 'Digital Payments & Online Govt Portals'],
      jobRole: 'Data Entry Operator / Grama Sachivalayam Assistant',
    },
    {
      id: 'CRS-02',
      title: 'Solar Panel Installation & Inverter Technician',
      titleTe: 'సోలార్ ప్యానెల్ ఇన్‌స్టాలేషన్ & మెయింటెనెన్స్',
      provider: 'National Skill Development Corporation (NSDC)',
      duration: '6 Weeks (Practical Workshop)',
      mode: 'Hands-on Training at District Center',
      link: 'https://nsdcindia.org',
      syllabus: ['Photovoltaic Cell Basics', 'Rooftop Structural Mounting', 'Inverter Wiring & Grid Connection', 'Safety & Preventive Maintenance'],
      jobRole: 'Surya Ghar Rooftop Solar Technician',
    },
    {
      id: 'CRS-03',
      title: 'Smartphone Hardware & PCB Repair Technician',
      titleTe: 'స్మార్ట్‌ఫోన్ హార్డ్‌వేర్ & చిప్-లెవల్ రిపేర్ ట్రైనింగ్',
      provider: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
      duration: '5 Weeks (Self-Employment)',
      mode: 'Vocational Training Center',
      link: 'https://skillindia.gov.in',
      syllabus: ['SMD Component Soldering', 'Screen Replacement & Touch Glass Laminating', 'Battery & Charging Port Replacement', 'Software Flashing & Unlocking'],
      jobRole: 'Independent Mobile Repair Shop Owner',
    },
    {
      id: 'CRS-04',
      title: 'Python Programming & AI Automation for Rural Youth',
      titleTe: 'పైథాన్ ప్రోగ్రామింగ్ & ఏఐ ఆటోమేషన్ కోర్సు',
      provider: 'SWAYAM & NPTEL Free Digital Initiative',
      duration: '8 Weeks',
      mode: '100% Free Online Self-Paced',
      link: 'https://swayam.gov.in',
      syllabus: ['Python Syntax & Loops', 'Data Analysis with Pandas', 'Prompt Engineering Basics', 'Real World Community Project'],
      jobRole: 'Junior Web / Automation Intern',
    },
  ];

  // Helper to trigger realistic PDF/Text download for educational materials
  const handleDownloadResource = (res: EducationalResource) => {
    const documentContent = `=====================================================
GRAMCONNECT EDUCATION HUB - OFFICIAL STUDY RESOURCE
=====================================================
Title: ${res.title}
Telugu Title: ${res.titleTe || 'N/A'}
Class / Category: ${res.classOrExam}
Type: ${res.type}
Publisher: ${res.publisher}
Verified for Academic Year: 2026

SYLLABUS & OVERVIEW:
-----------------------------------------------------
This digital study document provides verified curriculum coverage,
key question blueprints, previous year question trends, and formula
cheatsheets as recognized by the Andhra Pradesh Board of Secondary
Education (BSEAP) and Board of Intermediate Education (BIEAP).

RECOMMENDED STUDY SCHEDULE:
1. Complete foundational concept review within Week 1-2.
2. Solve chapter-end problems and self-assessment test papers.
3. Review AP State board model question papers with marking scheme.

Provided free of charge for students of Andhra Pradesh by GramConnect.
Official Source: ${res.fileUrl}
=====================================================`;

    const blob = new Blob([documentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${res.title.replace(/[^a-zA-Z0-9]/g, '_')}_StudyMaterial.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunEligibilityCheck = () => {
    const income = parseInt(eligIncome, 10);
    const results: string[] = [];

    if (income <= 250000) {
      results.push('AP Jagananna Vidya Deevena (100% College Tuition Fee Reimbursement)');
      results.push('Jagananna Vasathi Deevena (Hostel & Food Allowance: ₹10,000 - ₹20,000/yr)');
    }
    if (eligCategory === 'SC' || eligCategory === 'ST') {
      results.push('Dr. B.R. Ambedkar Overseas Vidya Nidhi (Foreign Studies Grant up to ₹15 Lakhs)');
      results.push('Post-Matric Scholarship for SC/ST Students (Full Fee + Maintenance)');
    }
    if (eligCategory === 'BC' || eligCategory === 'EBC') {
      results.push('Post-Matric Scholarship for Backward Classes (Govt of AP)');
    }
    if (income <= 150000) {
      results.push('National Means-cum-Merit Scholarship (NMMS - ₹12,000/yr)');
      results.push('Jagananna Amma Vodi (School Attendance Support: ₹15,000/yr)');
    }
    if (parseInt(eligMarks, 10) >= 80) {
      results.push('Central Sector Scheme of Scholarships for Meritorious College Students (Govt of India)');
    }

    setMatchedSchemes(results);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: String(Date.now()), title: newTaskTitle, done: false }]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-200 my-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-2xl shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {t('eduTitle', language)}
              </h2>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                Andhra Pradesh Student & Youth Empowerment Cell
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl">
            {language === 'te'
              ? 'ఆంధ్రప్రదేశ్ విద్యార్థులకు ఉచిత పాఠ్యపుస్తకాలు, పోటీ పరీక్షల నోటిఫికేషన్లు, స్కాలర్‌షిప్‌లు మరియు నైపుణ్యాభివృద్ధి కోర్సులు.'
              : 'Free AP SCERT textbooks, APPSC/Police exam alerts, JnanaBhumi scholarships, skill certificates, and student tools.'}
          </p>
        </div>

        {/* Quick Tool: Eligibility Calculator Button */}
        <button
          onClick={() => {
            setIsEligibilityCheckerOpen(true);
            setMatchedSchemes(null);
          }}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer transition-colors"
        >
          <Calculator className="w-4 h-4 text-purple-200" />
          <span>{language === 'te' ? 'స్కాలర్‌షిప్ అర్హత పరీక్షించు' : 'Check Scholarship Eligibility'}</span>
        </button>
      </div>

      {/* 5 Main Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
        <button
          id="edu-tab-scholarships"
          onClick={() => setEduTab('scholarships')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            eduTab === 'scholarships'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>A. {t('scholarships', language)}</span>
        </button>

        <button
          id="edu-tab-exams"
          onClick={() => setEduTab('exams')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            eduTab === 'exams'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>B. Competitive Exams & Jobs</span>
        </button>

        <button
          id="edu-tab-resources"
          onClick={() => setEduTab('resources')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            eduTab === 'resources'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>C. {t('textbooks', language)} & Papers</span>
        </button>

        <button
          id="edu-tab-courses"
          onClick={() => setEduTab('courses')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            eduTab === 'courses'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>D. Skill Courses & APSSDC</span>
        </button>

        <button
          id="edu-tab-local"
          onClick={() => setEduTab('local')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            eduTab === 'local'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <School className="w-4 h-4" />
          <span>E. Local Education & Study Planner</span>
        </button>
      </div>

      {/* SECTION A: SCHOLARSHIPS & FINANCIAL AID */}
      {eduTab === 'scholarships' && (
        <div className="space-y-5">
          {/* JnanaBhumi & NSP Banner */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black uppercase">
                  Active Portals
                </span>
                <h3 className="font-extrabold text-sm sm:text-base">
                  Andhra Pradesh JnanaBhumi & National Scholarship Portal (NSP)
                </h3>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                Direct biometric authentication and application for Jagananna Vidya Deevena, Vasathi Deevena, and Post-Matric DBT schemes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <a
                href="https://jnanabhumi.ap.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-white hover:bg-purple-50 text-purple-900 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>JnanaBhumi AP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://scholarships.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer border border-purple-500"
              >
                <span>NSP National Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">Filter by Level:</span>
            {(['all', 'School', 'College', 'Degree'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setScholarshipFilter(filter)}
                className={`px-3 py-1 rounded-xl font-bold cursor-pointer transition-colors ${
                  scholarshipFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter === 'all' ? 'All Scholarships' : filter}
              </button>
            ))}
          </div>

          {/* Scholarships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {scholarships
              .filter((s) => scholarshipFilter === 'all' || s.category === scholarshipFilter)
              .map((sch) => (
                <div
                  key={sch.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                        {sch.category} Level
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified 2026
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {language === 'te' ? sch.titleTe : sch.title}
                    </h4>

                    <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs space-y-1">
                      <p className="text-purple-950 font-black">
                        Benefit: {sch.amount}
                      </p>
                      <p className="text-slate-600 text-[11px] line-clamp-2">
                        <strong>Eligibility:</strong> {language === 'te' && sch.eligibilityTe ? sch.eligibilityTe : sch.eligibility}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
                      <span className="flex items-center gap-1 text-rose-600 font-bold">
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {sch.deadline}
                      </span>
                      <span>By: {sch.provider}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedScholarship(sch)}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-700" />
                      <span>View Details</span>
                    </button>

                    <a
                      href={sch.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Apply Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION B: COMPETITIVE EXAMS & GOVT JOBS */}
      {eduTab === 'exams' && (
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <h4 className="font-extrabold text-amber-950">Official Recruitment Portal Notifications</h4>
                <p className="text-amber-800 mt-0.5">
                  Direct official links to APPSC (psc.ap.gov.in), Police Board (slprb.ap.gov.in), and SSC / UPSC portals.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full uppercase shrink-0">
              {competitiveExams.length} Active Drives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitiveExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
                      {exam.examCategory}
                    </span>
                    <span className="text-xs font-black text-purple-700">
                      {exam.vacancies} Posts
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                      {language === 'te' && exam.jobTitleTe ? exam.jobTitleTe : exam.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {language === 'te' && exam.organizationTe ? exam.organizationTe : exam.organization}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="text-slate-700">
                      <strong>Qualification:</strong> {exam.qualification}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span><strong>Age:</strong> {exam.ageLimit}</span>
                      <span className="text-rose-600 font-bold"><strong>Last Date:</strong> {exam.lastDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedExam(exam)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-700" />
                    <span>View Syllabus</span>
                  </button>

                  <a
                    href={exam.officialApplyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Apply on Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: TEXTBOOKS & PREVIOUS PAPERS */}
      {eduTab === 'resources' && (
        <div className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-extrabold text-slate-900">AP SCERT Textbooks & Solved Question Papers</h4>
              <p className="text-slate-500 mt-0.5">
                Download formatted textbooks, previous year papers, and key formula summaries directly.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200">
              {resources.length} Verified Documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                      {res.classOrExam}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {res.type}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                    {language === 'te' && res.titleTe ? res.titleTe : res.title}
                  </h4>

                  <p className="text-xs text-slate-500">
                    Publisher: {res.publisher}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedResource(res)}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Study Guide</span>
                  </button>

                  <button
                    onClick={() => handleDownloadResource(res)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D: SKILL DEVELOPMENT & APSSDC COURSES */}
      {eduTab === 'courses' && (
        <div className="space-y-5">
          <div className="bg-teal-50 border border-teal-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-extrabold text-teal-950">APSSDC & National Skill Development Corporation Courses</h4>
              <p className="text-teal-800 mt-0.5">
                Vocational employment certificates, digital literacy, and self-employment training with free enrollment.
              </p>
            </div>
            <a
              href="https://www.apssdc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>APSSDC Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillCourses.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {c.duration}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {c.mode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 leading-snug">
                      {language === 'te' ? c.titleTe : c.title}
                    </h4>
                    <p className="text-xs text-purple-700 font-semibold mt-1">
                      Target Role: {c.jobRole}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Provided by: {c.provider}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">Core Modules:</span>
                    <ul className="space-y-1 text-slate-600">
                      {c.syllabus.map((m: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setActiveCourseModal(c)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    View Curriculum
                  </button>

                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Enroll on Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION E: LOCAL EDUCATION & STUDY PLANNER */}
      {eduTab === 'local' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Local Coaching & Tuition Directory */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-purple-600" />
                Local Coaching & Tuition Centres
              </h3>
              <span className="text-[11px] font-bold text-slate-500">Penumantra & Godavari</span>
            </div>

            <div className="space-y-3">
              {tuitions.map((tut) => (
                <div
                  key={tut.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{tut.centerName}</h4>
                      <p className="text-purple-700 font-bold text-xs">{tut.subjectSpecialty}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                      {tut.village}
                    </span>
                  </div>

                  <div className="text-slate-600 pt-1 border-t border-slate-100 text-[11px] space-y-0.5">
                    <p><strong>Faculty:</strong> {tut.teacherName}</p>
                    <p><strong>Contact Phone:</strong> <span className="font-mono font-bold text-slate-800">{tut.contactPhone}</span></p>
                    <p><strong>Fee Structure:</strong> {tut.feeDetails}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Daily Study Planner */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Daily Student Study Planner
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Track your APPSC syllabus targets, revision chapters, and scholarship deadlines.
              </p>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Revise AP Economy Ch 3 or Practice SSC Reasoning..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                Add Goal
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                    task.done
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-purple-300'
                  }`}
                >
                  <span className="font-medium">{task.title}</span>
                  {task.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SCHOLARSHIP DETAILS MODAL */}
      {selectedScholarship && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-800 px-2.5 py-0.5 rounded-full">
                  {selectedScholarship.category} Level
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {language === 'te' ? selectedScholarship.titleTe : selectedScholarship.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedScholarship.provider}</p>
              </div>
              <button
                onClick={() => setSelectedScholarship(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 font-black">
              Scholarship Benefit: {selectedScholarship.amount}
            </div>

            <div className="text-xs space-y-1.5">
              <span className="font-bold text-slate-700">Scheme Overview:</span>
              <p className="text-slate-600 leading-relaxed">
                {language === 'te' ? selectedScholarship.descriptionTe : selectedScholarship.description}
              </p>
            </div>

            <div className="text-xs space-y-1.5">
              <span className="font-bold text-slate-700">Detailed Eligibility Criteria:</span>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700">
                {language === 'te' && selectedScholarship.eligibilityTe
                  ? selectedScholarship.eligibilityTe
                  : selectedScholarship.eligibility}
              </div>
            </div>

            <div className="text-xs space-y-1.5">
              <span className="font-bold text-slate-700">Required Documents:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {selectedScholarship.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2 bg-slate-100 rounded-xl font-medium text-slate-700 flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t">
              <button
                onClick={() => setSelectedScholarship(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedScholarship.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPETITIVE EXAM SYLLABUS MODAL */}
      {selectedExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full">
                  {selectedExam.examCategory} Notification
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedExam.jobTitle}
                </h3>
                <p className="text-xs text-slate-500">{selectedExam.organization}</p>
              </div>
              <button
                onClick={() => setSelectedExam(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                <span className="text-purple-700 font-bold">Total Vacancies:</span>
                <p className="font-black text-purple-950 text-base">{selectedExam.vacancies}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 font-bold">Application Deadline:</span>
                <p className="font-black text-rose-700 text-sm">{selectedExam.lastDate}</p>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <span className="font-bold text-slate-700">Exam Scheme & Syllabus Modules:</span>
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <p className="font-bold text-purple-900">Paper 1: General Studies & Mental Ability</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Current Affairs, Indian Polity, AP Reorganization Act, Basic Science, Logical Reasoning.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <p className="font-bold text-purple-900">Paper 2: Social History of AP & Constitution</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Social and Cultural History of Andhra Pradesh, Preamble, Fundamental Rights, Directive Principles.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200">
                  <p className="font-bold text-purple-900">Paper 3: Indian and AP Economy</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Planning, Agriculture, Rural Development Schemes, AP State Budget & Economic Survey.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedExam.officialApplyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: STUDY RESOURCE READER */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full">
                  {selectedResource.classOrExam}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {selectedResource.title}
                </h3>
                <p className="text-xs text-slate-500">Publisher: {selectedResource.publisher}</p>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 font-mono leading-relaxed text-slate-700">
              <p className="font-bold text-slate-900 font-sans">Verified Study Outline:</p>
              <p>• Chapter 1: Foundational Principles & Core Formulas</p>
              <p>• Chapter 2: Detailed Illustrations with Worked Solutions</p>
              <p>• Chapter 3: Previous 5 Years AP State Board Exam Questions</p>
              <p>• Chapter 4: Practice Problems with Step-by-Step Marking Rubric</p>
              <p className="text-purple-700 font-sans font-bold pt-1">
                ✓ Free educational material provided under Open Access AP initiative.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadResource(selectedResource);
                  setSelectedResource(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download Study Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ELIGIBILITY CHECKER */}
      {isEligibilityCheckerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-purple-600" />
                  Scholarship Eligibility Calculator
                </h3>
                <p className="text-xs text-slate-500">
                  Instant eligibility check for AP JnanaBhumi & National Scholarships
                </p>
              </div>
              <button
                onClick={() => setIsEligibilityCheckerOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Study Level</label>
                <select
                  value={eligCourse}
                  onChange={(e) => setEligCourse(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="School (Class 1 to 10)">School (Class 1 to 10)</option>
                  <option value="Intermediate (+2)">Intermediate (+2)</option>
                  <option value="Polytechnic / ITI">Polytechnic / ITI</option>
                  <option value="Degree / BTech">Degree / B.Tech / Pharmacy</option>
                  <option value="Post Graduate (PG / MBA / MCA)">Post Graduate (PG / MBA / MCA)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Caste Category</label>
                  <select
                    value={eligCategory}
                    onChange={(e) => setEligCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="BC">BC (Backward Classes)</option>
                    <option value="SC">SC (Scheduled Castes)</option>
                    <option value="ST">ST (Scheduled Tribes)</option>
                    <option value="EBC">EBC / Kapu</option>
                    <option value="Minority">Minority (Muslim / Christian)</option>
                    <option value="General">General / OC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Marks %</label>
                  <input
                    type="number"
                    min="35"
                    max="100"
                    value={eligMarks}
                    onChange={(e) => setEligMarks(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Family Annual Income (₹ per year)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={eligIncome}
                  onChange={(e) => setEligIncome(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
                <span className="text-[10px] text-slate-500">
                  Government scheme income threshold is typically ₹2,50,000 per annum.
                </span>
              </div>

              <button
                onClick={handleRunEligibilityCheck}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer mt-2"
              >
                Calculate Eligible Schemes
              </button>

              {matchedSchemes && (
                <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 mt-3">
                  <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You are eligible for {matchedSchemes.length} Schemes:
                  </span>
                  <ul className="space-y-1.5 text-xs text-purple-900">
                    {matchedSchemes.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 bg-white p-2 rounded-xl border border-purple-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-bold">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: COURSE DETAILS MODAL */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full">
                  {activeCourseModal.duration}
                </span>
                <h3 className="font-black text-lg text-slate-900 mt-1">
                  {activeCourseModal.title}
                </h3>
                <p className="text-xs text-slate-500">By: {activeCourseModal.provider}</p>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-xs text-teal-950 font-bold">
              Job Outcome: {activeCourseModal.jobRole}
            </div>

            <div className="text-xs space-y-2">
              <span className="font-bold text-slate-700">Detailed Module Breakdown:</span>
              <ul className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                {activeCourseModal.syllabus.map((mod: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Module {idx + 1}: {mod}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t">
              <button
                onClick={() => setActiveCourseModal(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <a
                href={activeCourseModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Enroll Free on Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
