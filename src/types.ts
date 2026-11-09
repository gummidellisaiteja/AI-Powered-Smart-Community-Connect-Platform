export type Language = 'te' | 'en';

export type UserRole = 'citizen' | 'worker' | 'student' | 'employer' | 'admin' | 'secretary';

export interface UserAccount {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password?: string;
  role: UserRole;
  userType?: 'Citizen' | 'Student' | 'Worker' | 'Employer / Service Provider' | 'Grama Secretary';
  village: string;
  mandal: string;
  district: string;
  state?: string;
  avatarUrl?: string;
  occupation?: string;
  bio?: string;
  createdAt: string;
}

export type ComplaintCategory =
  | 'Damaged Roads'
  | 'Drainage Problems'
  | 'Garbage Collection'
  | 'Streetlight Problems'
  | 'Water Supply'
  | 'Sanitation'
  | 'Public Infrastructure'
  | 'Other Issues'
  | 'Roads'
  | 'Drainage'
  | 'Garbage'
  | 'Streetlight'
  | 'Water'
  | 'Electricity'
  | 'Public Facilities';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected'
  | 'Closed';

export interface ComplaintHistoryItem {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  notes: string;
  photoUrl?: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  village: string;
  mandal: string;
  district: string;
  description: string;
  photoUrl?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  status: ComplaintStatus;
  raisedBy: string; // User ID or Name
  raisedByPhone: string;
  createdAt: string;
  updatedAt: string;
  locationAddress: string;
  gpsCoords?: { lat: number; lng: number };
  adminNotes?: string;
  assignedOfficer?: string;
  assignedDepartment?: string;
  resolutionDetails?: string;
  history?: ComplaintHistoryItem[];
  priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  photoUrl: string;
  phone: string;
  occupation: string;
  skills: string[];
  experienceYears: number;
  village: string;
  mandal: string;
  district: string;
  serviceDescription?: string;
  isAvailable: boolean;
  dailyWage: number;
  hourlyWage?: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  bio?: string;
  isVerified?: boolean;
  verificationStatus?: 'Pending' | 'Verified' | 'Rejected' | 'Suspended';
}

export interface JobPosting {
  id: string;
  title: string;
  category: string;
  wage: number;
  wageType: 'Per Day' | 'Per Hour' | 'Fixed Task' | 'Per Month';
  location: string;
  village: string;
  mandal: string;
  duration: string;
  contactPhone: string;
  postedBy: string;
  postedByName: string;
  datePosted: string;
  status: 'Active' | 'Filled' | 'Expired' | 'Pending Review' | 'Rejected';
  applicantsCount: number;
  openingsCount?: number;
  deadline?: string;
  requiredSkills?: string[];
  description: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantPhone: string;
  applicantRole: 'worker' | 'student' | 'citizen';
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Hired' | 'Rejected';
  appliedAt: string;
  notes?: string;
}

export interface WorkerBooking {
  id: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  employerId: string;
  employerName: string;
  employerPhone: string;
  workCategory: string;
  workDescription: string;
  scheduledDate: string;
  wageAgreed: number;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  ratingGiven?: number;
  reviewGiven?: string;
  createdAt: string;
}

export type ShopCategory =
  | 'Grocery & Kirana'
  | 'Pharmacy & Medical'
  | 'Agriculture & Seeds'
  | 'Tailoring & Textiles'
  | 'Automobile & Repair'
  | 'Food & Bakery'
  | 'MeeSeva & Internet'
  | 'Hardware & Electrical'
  | 'General Store'
  | 'Restaurants';

export interface LocalBusiness {
  id: string;
  name: string;
  nameTe: string;
  category: ShopCategory;
  ownerName: string;
  phone: string;
  address: string;
  village: string;
  mandal: string;
  district: string;
  openingHours: string;
  isOpen: boolean;
  productsAndServices: string[];
  photoUrl?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  titleTe: string;
  provider: string;
  amount: string;
  eligibility: string;
  eligibilityTe?: string;
  requiredDocuments?: string[];
  startDate?: string;
  deadline: string;
  statusTag?: 'Active' | 'Upcoming' | 'Closing Soon' | 'Closed';
  lastUpdatedDate?: string;
  category: 'School' | 'College' | 'Degree' | 'Competitive Exams' | 'Merit Based';
  applicationLink: string;
  description: string;
  descriptionTe: string;
}

export interface GovtJobNotification {
  id: string;
  organization: string;
  organizationTe?: string;
  jobTitle: string;
  jobTitleTe?: string;
  qualification: string;
  ageLimit: string;
  vacancies: number;
  startDate: string;
  lastDate: string;
  officialNotificationLink: string;
  officialApplyLink: string;
  statusTag: 'Active' | 'Upcoming' | 'Closing Soon' | 'Closed';
  examCategory: 'APPSC' | 'UPSC' | 'SSC' | 'Banking' | 'Railway' | 'Police' | 'State Govt';
}

export interface EducationalResource {
  id: string;
  title: string;
  titleTe: string;
  type: 'textbook' | 'notes' | 'question_paper' | 'guidance' | 'exam_prep' | 'course';
  classOrExam: string;
  subject: string;
  fileUrl: string;
  downloadCount: number;
  publisher: string;
}

export interface TuitionCoaching {
  id: string;
  centerName: string;
  subjectSpecialty: string;
  teacherName: string;
  contactPhone: string;
  village: string;
  mandal: string;
  feeDetails: string;
  rating: number;
}

export interface Hospital {
  id: string;
  name: string;
  nameTe: string;
  type: 'PHC (Primary Health Centre)' | 'Community Health Centre' | 'Area Hospital' | '104 Mobile Unit' | 'Private Clinic';
  phone: string;
  village: string;
  mandal: string;
  district: string;
  availableBeds: number;
  doctorInCharge: string;
  timings: string;
  servicesAvailable: string[];
  ambulanceAvailable: boolean;
  address: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleTe: string;
  category: 'Scheme' | 'Panchayat Notice' | 'Health Drive' | 'Water Supply' | 'Power Outage' | 'General';
  content: string;
  contentTe: string;
  date: string;
  village: string;
  isImportant: boolean;
  issuedBy: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: UserRole | 'all';
  title: string;
  titleTe: string;
  message: string;
  messageTe: string;
  type: 'complaint' | 'job' | 'announcement' | 'booking' | 'emergency';
  read: boolean;
  createdAt: string;
  linkTab?: string;
}

export interface FirstAidGuide {
  id: string;
  title: string;
  titleTe: string;
  emergencyType: 'Snakebite' | 'Sunstroke' | 'Dengue & Fever' | 'Heart Emergency' | 'Burn Injury';
  doList: string[];
  doListTe: string[];
  dontList: string[];
  dontListTe: string[];
  emergencyNumber: string;
}

export interface GovtScheme {
  id: string;
  name?: string;
  nameTe?: string;
  title?: string;
  titleTe?: string;
  category: string;
  dept?: string;
  department?: string;
  benefits?: string;
  benefitsTe?: string;
  financialAssistance?: string;
  description?: string;
  descriptionTe?: string;
  beneficiaryType?: string;
  eligibility: string | string[];
  eligibilityTe?: string;
  requiredDocuments: string[];
  procedure?: string;
  procedureTe?: string;
  portalLink?: string;
  officialPortalUrl?: string;
}

export interface VillageStats {
  resolvedGrievances: number;
  pendingGrievances: number;
  inProgressGrievances?: number;
  totalComplaints?: number;
  activeWorkers: number;
  jobsPostedCount: number;
  totalJobApplications?: number;
  activeShopsCount: number;
  scholarshipsClaimed: number;
  activePHCs: number;
  totalCitizens?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  language: Language;
}

export interface HelpFaqItem {
  id: string;
  question: string;
  questionTe: string;
  answer: string;
  answerTe: string;
  category: 'Complaints' | 'Workers' | 'Jobs' | 'Secretary' | 'General';
}
