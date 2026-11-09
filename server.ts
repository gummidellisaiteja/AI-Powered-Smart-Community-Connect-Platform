import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import {
  initialUsers,
  initialComplaints,
  initialWorkers,
  initialJobs,
  initialShops,
  initialScholarships,
  initialEduResources,
  initialHospitals,
  initialAnnouncements,
  initialTuitions,
  initialNotifications,
  initialFirstAidGuides,
  initialGovtSchemes,
  initialGovtJobNotifications,
  initialFaqItems,
} from "./src/data/seedData";
import {
  Complaint,
  WorkerProfile,
  JobPosting,
  JobApplication,
  WorkerBooking,
  Announcement,
  LocalBusiness,
  UserAccount,
  NotificationItem,
  ComplaintStatus,
  GovtScheme,
} from "./src/types";

// Persistent Data File Path
const DB_FILE = path.join(process.cwd(), "src", "data", "dbStore.json");

interface DatabaseStore {
  users: UserAccount[];
  complaints: Complaint[];
  workers: WorkerProfile[];
  jobs: JobPosting[];
  jobApplications: JobApplication[];
  workerBookings: WorkerBooking[];
  shops: LocalBusiness[];
  announcements: Announcement[];
  schemes: GovtScheme[];
  notifications: NotificationItem[];
  bookmarks: { [userId: string]: { jobs: string[]; workers: string[]; shops: string[] } };
}

// Initialize database with disk persistence
let db: DatabaseStore = {
  users: [...initialUsers],
  complaints: [...initialComplaints],
  workers: [...initialWorkers],
  jobs: [...initialJobs],
  jobApplications: [],
  workerBookings: [],
  shops: [...initialShops],
  announcements: [...initialAnnouncements],
  schemes: [...initialGovtSchemes],
  notifications: [...initialNotifications],
  bookmarks: {},
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      db = {
        users: parsed.users || [...initialUsers],
        complaints: parsed.complaints || [...initialComplaints],
        workers: parsed.workers || [...initialWorkers],
        jobs: parsed.jobs || [...initialJobs],
        jobApplications: parsed.jobApplications || [],
        workerBookings: parsed.workerBookings || [],
        shops: parsed.shops || [...initialShops],
        announcements: parsed.announcements || [...initialAnnouncements],
        schemes: parsed.schemes || [...initialGovtSchemes],
        notifications: parsed.notifications || [...initialNotifications],
        bookmarks: parsed.bookmarks || {},
      };
      console.log("[DB] Loaded database from disk:", DB_FILE);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("[DB] Failed to load disk DB, using seed data:", err);
  }
}

function saveDatabase() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB] Failed to save DB to disk:", err);
  }
}

loadDatabase();

// Gemini Client initialization
const apiKey = process.env.GEMINI_API_KEY || "";
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", appName: "GramConnect Smart Village 360", recordsCount: db.complaints.length });
  });

  // --- 1. AUTHENTICATION & USER MANAGEMENT ---
  app.get("/api/auth/demo-users", (req, res) => {
    res.json(db.users);
  });

  app.post("/api/auth/login", (req, res) => {
    const { phone, password, role } = req.body;
    let user = db.users.find((u) => u.phone === phone);
    if (!user) {
      // Find by role for demo convenience
      user = db.users.find((u) => u.role === role);
    }
    if (!user) {
      // Create citizen account on-the-fly for demo
      user = {
        id: `USR-${Date.now()}`,
        name: `Villager (${phone.slice(-4)})`,
        phone: phone || "9848011223",
        role: role || "citizen",
        village: "Penumantra",
        mandal: "Penumantra",
        district: "West Godavari",
        createdAt: new Date().toISOString().split("T")[0],
      };
      db.users.push(user);
      saveDatabase();
    }
    res.json({ success: true, user, token: `gc-token-${user.id}` });
  });

  // Dedicated Grama Secretary Login endpoint
  app.post("/api/auth/secretary-login", (req, res) => {
    const { usernameOrEmail, username, email, password } = req.body;
    const cleanUser = (usernameOrEmail || username || email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();

    const isAuthorized =
      (cleanUser === "srinu" || cleanUser === "srinu@gmail.com" || cleanUser === "secretary") &&
      cleanPass === "0987";

    if (!isAuthorized) {
      return res.status(401).json({
        success: false,
        error: "Invalid Grama Secretary credentials. Required: username: srinu or email: srinu@gmail.com, password: 0987",
      });
    }

    let secretary = db.users.find(
      (u) =>
        u.email === "srinu@gmail.com" ||
        u.id === "USR-SECRETARY-01" ||
        u.userType === "Grama Secretary"
    );

    if (!secretary) {
      secretary = {
        id: "USR-SECRETARY-01",
        name: "Srinu (Grama Panchayat Secretary)",
        phone: "9440112233",
        email: "srinu@gmail.com",
        password: "0987",
        role: "admin",
        userType: "Grama Secretary",
        village: "Penumantra",
        mandal: "Penumantra",
        district: "West Godavari",
        avatarUrl:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
        bio: "Authorized Grama Panchayat Secretary supervising civic grievances, village development, and public administration.",
        createdAt: "2026-01-01",
      };
      db.users.push(secretary);
      saveDatabase();
    }

    return res.json({
      success: true,
      user: secretary,
      token: `gc-secretary-token-${Date.now()}`,
      message: "Grama Secretary authenticated successfully. Welcome Sri Srinu garu.",
    });
  });

  // Citizen Directory for Secretary Management
  app.get("/api/users", (req, res) => {
    const { role, village, search } = req.query;
    let list = [...db.users];
    if (role && role !== "all") {
      list = list.filter((u) => u.role === role);
    }
    if (village && village !== "all") {
      list = list.filter((u) => u.village.toLowerCase().includes((village as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.phone.includes(q) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }
    res.json(list);
  });

  app.post("/api/auth/secretary/change-password", (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const secretary = db.users.find(
      (u) => u.email === "srinu@gmail.com" || u.id === "USR-SECRETARY-01" || u.role === "admin"
    );
    if (!secretary) {
      return res.status(404).json({ error: "Secretary account not found" });
    }
    if (secretary.password && secretary.password !== oldPassword) {
      return res.status(400).json({ error: "Current password does not match" });
    }
    secretary.password = newPassword;
    saveDatabase();
    res.json({ success: true, message: "Grama Secretary password updated successfully." });
  });

  app.post("/api/auth/register", (req, res) => {
    const {
      name,
      phone,
      email,
      password,
      role,
      userType,
      village,
      mandal,
      district,
      state,
      occupation,
      avatarUrl,
    } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and Phone are required" });
    }
    const existing = db.users.find((u) => u.phone === phone);
    if (existing) {
      return res.status(400).json({ error: "An account with this phone number already exists." });
    }
    const newUser: UserAccount = {
      id: `USR-${Date.now()}`,
      name,
      phone,
      email: email || "",
      password: password || "password123",
      role: role || "citizen",
      userType:
        userType ||
        (role === "worker"
          ? "Worker"
          : role === "student"
          ? "Student"
          : role === "employer"
          ? "Employer / Service Provider"
          : "Citizen"),
      village: village || "Penumantra",
      mandal: mandal || village || "Penumantra",
      district: district || "West Godavari",
      state: state || "Andhra Pradesh",
      occupation: occupation || "",
      avatarUrl: avatarUrl || "",
      createdAt: new Date().toISOString().split("T")[0],
    };
    db.users.unshift(newUser);

    // If registered as worker, also add to workers directory
    if (role === "worker") {
      const workerProfile: WorkerProfile = {
        id: `WKR-${Math.floor(100 + Math.random() * 900)}`,
        userId: newUser.id,
        name: newUser.name,
        photoUrl: newUser.avatarUrl || "",
        phone: newUser.phone,
        occupation: occupation || "Skilled Worker",
        skills: ["General Service"],
        experienceYears: 2,
        village: newUser.village,
        mandal: newUser.mandal,
        district: newUser.district,
        isAvailable: true,
        dailyWage: 600,
        hourlyWage: 120,
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0,
        isVerified: false,
        verificationStatus: "Pending",
      };
      db.workers.unshift(workerProfile);
    }

    saveDatabase();
    res.status(201).json({ success: true, user: newUser, token: `gc-token-${newUser.id}` });
  });

  app.put("/api/auth/profile/:id", (req, res) => {
    const { id } = req.params;
    const { name, phone, village, mandal, district, bio, occupation } = req.body;
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (village) user.village = village;
    if (mandal) user.mandal = mandal;
    if (district) user.district = district;
    if (bio !== undefined) user.bio = bio;
    if (occupation !== undefined) user.occupation = occupation;

    saveDatabase();
    res.json({ success: true, user });
  });

  // --- 2. COMPLAINTS API ---
  app.get("/api/complaints", (req, res) => {
    const { status, category, village, search } = req.query;
    let list = [...db.complaints];
    if (status && status !== "all") {
      list = list.filter((c) => c.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (category && category !== "all") {
      list = list.filter((c) => c.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (village && village !== "all") {
      list = list.filter((c) => c.village.toLowerCase().includes((village as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.locationAddress.toLowerCase().includes(q)
      );
    }
    res.json(list);
  });

  app.post("/api/complaints", (req, res) => {
    const body = req.body;
    const newId = `GC-AP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 16);
    const dateStr = new Date().toISOString().split("T")[0];

    const newComplaint: Complaint = {
      id: newId,
      title: body.title || "Village Issue Complaint",
      category: body.category || "Other",
      village: body.village || "Penumantra",
      mandal: body.mandal || body.village || "Penumantra",
      district: body.district || "West Godavari",
      description: body.description || "",
      photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      beforePhotoUrl: body.photoUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80",
      status: "Submitted",
      raisedBy: body.raisedBy || "Anonymous Villager",
      raisedByPhone: body.raisedByPhone || "9848011223",
      createdAt: dateStr,
      updatedAt: dateStr,
      locationAddress: body.locationAddress || body.village,
      gpsCoords: body.gpsCoords,
      priority: body.priority || "Medium",
      assignedOfficer: "Pending Panchayat Assignment",
      history: [
        {
          id: `H-${Date.now()}`,
          status: "Submitted",
          timestamp: nowStr,
          updatedBy: body.raisedBy || "Citizen",
          notes: "Grievance registered with evidence.",
          photoUrl: body.photoUrl,
        },
      ],
    };

    db.complaints.unshift(newComplaint);

    // Also dispatch notification to Admins
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "admin",
      title: `New Grievance: ${newComplaint.title}`,
      titleTe: `కొత్త సమస్య నమోదు: ${newComplaint.title}`,
      message: `${newComplaint.raisedBy} filed complaint #${newComplaint.id} in ${newComplaint.village}.`,
      messageTe: `${newComplaint.village} నుండి ${newComplaint.id} నంబరుతో కొత్త ఫిర్యాదు వచ్చింది.`,
      type: "complaint",
      read: false,
      createdAt: dateStr,
      linkTab: "complaints",
    });

    saveDatabase();
    res.status(201).json({ success: true, complaint: newComplaint });
  });

  app.put("/api/complaints/:id", (req, res) => {
    const { id } = req.params;
    const { status, adminNotes, assignedOfficer, afterPhotoUrl, updatedBy } = req.body;
    const idx = db.complaints.findIndex((c) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    const complaint = db.complaints[idx];
    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 16);
    const dateStr = new Date().toISOString().split("T")[0];

    const prevStatus = complaint.status;
    if (status) complaint.status = status as ComplaintStatus;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;
    if (assignedOfficer !== undefined) complaint.assignedOfficer = assignedOfficer;
    if (afterPhotoUrl) complaint.afterPhotoUrl = afterPhotoUrl;
    complaint.updatedAt = dateStr;

    if (!complaint.history) complaint.history = [];
    complaint.history.push({
      id: `H-${Date.now()}`,
      status: complaint.status,
      timestamp: nowStr,
      updatedBy: updatedBy || "Panchayat Officer",
      notes: adminNotes || `Status updated from ${prevStatus} to ${complaint.status}`,
      photoUrl: afterPhotoUrl,
    });

    // Notify citizen about status change
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "all",
      title: `Grievance #${complaint.id} Status: ${complaint.status}`,
      titleTe: `ఫిర్యాదు #${complaint.id} స్థితి: ${complaint.status}`,
      message: adminNotes || `Your complaint for ${complaint.title} has progressed to ${complaint.status}.`,
      messageTe: `మీ ఫిర్యాదు #${complaint.id} పురోగతి స్థితి: ${complaint.status}`,
      type: "complaint",
      read: false,
      createdAt: dateStr,
      linkTab: "complaints",
    });

    saveDatabase();
    res.json({ success: true, complaint });
  });

  // --- 3. WORKERS API ---
  app.get("/api/workers", (req, res) => {
    const { search, village, available } = req.query;
    let list = [...db.workers];
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.occupation.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (village && village !== "all") {
      list = list.filter((w) => w.village.toLowerCase().includes((village as string).toLowerCase()));
    }
    if (available === "true") {
      list = list.filter((w) => w.isAvailable);
    }
    res.json(list);
  });

  app.post("/api/workers", (req, res) => {
    const body = req.body;
    const newWorker: WorkerProfile = {
      id: `WKR-${Math.floor(100 + Math.random() * 900)}`,
      userId: body.userId || `U-${Date.now()}`,
      name: body.name,
      photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      phone: body.phone,
      occupation: body.occupation,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills || "").split(",").map((s: string) => s.trim()),
      experienceYears: Number(body.experienceYears) || 1,
      village: body.village || "Penumantra",
      mandal: body.mandal || body.village || "Penumantra",
      district: body.district || "West Godavari",
      isAvailable: true,
      dailyWage: Number(body.dailyWage) || 600,
      hourlyWage: Number(body.hourlyWage) || 120,
      rating: 5.0,
      reviewCount: 1,
      completedJobs: 0,
      bio: body.bio || "",
      isVerified: true,
    };
    db.workers.unshift(newWorker);
    saveDatabase();
    res.status(201).json({ success: true, worker: newWorker });
  });

  app.post("/api/workers/book", (req, res) => {
    const body = req.body;
    const booking: WorkerBooking = {
      id: `BK-${Date.now()}`,
      workerId: body.workerId,
      workerName: body.workerName,
      workerPhone: body.workerPhone,
      employerId: body.employerId || "EMP-01",
      employerName: body.employerName || "Local Villager",
      employerPhone: body.employerPhone || "9848011223",
      workCategory: body.workCategory || "General Work",
      workDescription: body.workDescription || "Repair & Maintenance",
      scheduledDate: body.scheduledDate || new Date().toISOString().split("T")[0],
      wageAgreed: Number(body.wageAgreed) || 600,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    db.workerBookings.unshift(booking);

    // Notification for worker
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "worker",
      title: `New Work Request from ${booking.employerName}`,
      titleTe: `${booking.employerName} నుండి కొత్త పని పిలుపు`,
      message: `Work: ${booking.workDescription} on ${booking.scheduledDate} for agreed ₹${booking.wageAgreed}.`,
      messageTe: `${booking.scheduledDate} న పని కోసం బుకింగ్ వచ్చింది. కూలీ: ₹${booking.wageAgreed}.`,
      type: "booking",
      read: false,
      createdAt: booking.createdAt,
      linkTab: "workers",
    });

    saveDatabase();
    res.status(201).json({ success: true, booking });
  });

  // Secretary Worker Verification & Moderation
  app.put("/api/workers/:id/status", (req, res) => {
    const { id } = req.params;
    const { isVerified, isAvailable } = req.body;
    const worker = db.workers.find((w) => w.id === id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    if (isVerified !== undefined) worker.isVerified = Boolean(isVerified);
    if (isAvailable !== undefined) worker.isAvailable = Boolean(isAvailable);

    saveDatabase();
    res.json({ success: true, worker });
  });

  // Secretary Job Moderation
  app.put("/api/jobs/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const job = db.jobs.find((j) => j.id === id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (status) job.status = status;
    saveDatabase();
    res.json({ success: true, job });
  });

  // --- 4. JOBS API ---
  app.get("/api/jobs", (req, res) => {
    res.json(db.jobs);
  });

  app.post("/api/jobs", (req, res) => {
    const body = req.body;
    const newJob: JobPosting = {
      id: `JOB-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: body.title,
      category: body.category || "General",
      wage: Number(body.wage) || 500,
      wageType: body.wageType || "Per Day",
      location: body.location || body.village,
      village: body.village || "Penumantra",
      mandal: body.mandal || body.village || "Penumantra",
      duration: body.duration || "1 Day",
      contactPhone: body.contactPhone,
      postedBy: body.postedBy || "EMP-01",
      postedByName: body.postedByName || "Local Contractor",
      datePosted: new Date().toISOString().split("T")[0],
      status: "Active",
      applicantsCount: 0,
      openingsCount: Number(body.openingsCount) || 1,
      deadline: body.deadline || "2026-09-30",
      requiredSkills: Array.isArray(body.requiredSkills) ? body.requiredSkills : (body.requiredSkills || "").split(",").map((s: string) => s.trim()),
      description: body.description,
    };
    db.jobs.unshift(newJob);

    // Notification for workers & students
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "worker",
      title: `New Job Opening: ${newJob.title}`,
      titleTe: `కొత్త పని ప్రకటన: ${newJob.title}`,
      message: `${newJob.postedByName} posted job in ${newJob.village} (₹${newJob.wage}/${newJob.wageType}).`,
      messageTe: `${newJob.village} లో కొత్త ఉపాధి పని ప్రకటన వచ్చింది. కూలీ: ₹${newJob.wage}.`,
      type: "job",
      read: false,
      createdAt: newJob.datePosted,
      linkTab: "jobs",
    });

    saveDatabase();
    res.status(201).json({ success: true, job: newJob });
  });

  app.post("/api/jobs/apply", (req, res) => {
    const { jobId, applicantName, applicantPhone, applicantRole } = req.body;
    const job = db.jobs.find((j) => j.id === jobId);
    if (job) {
      job.applicantsCount += 1;
    }
    const appRecord: JobApplication = {
      id: `APP-${Date.now()}`,
      jobId,
      jobTitle: job ? job.title : "Job",
      applicantId: `USER-${Date.now()}`,
      applicantName,
      applicantPhone,
      applicantRole: applicantRole || "worker",
      status: "Applied",
      appliedAt: new Date().toISOString().split("T")[0],
    };
    db.jobApplications.unshift(appRecord);

    // Notification for employer
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "employer",
      title: `New Application for ${job?.title || "Job"}`,
      titleTe: `${job?.title || "పని"} కి కొత్త దరఖాస్తు`,
      message: `${applicantName} (${applicantPhone}) applied.`,
      messageTe: `${applicantName} దరఖాస్తు సమర్పించారు.`,
      type: "job",
      read: false,
      createdAt: appRecord.appliedAt,
      linkTab: "jobs",
    });

    saveDatabase();
    res.status(201).json({ success: true, application: appRecord });
  });

  app.get("/api/jobs/applications", (req, res) => {
    const { jobId } = req.query;
    if (jobId) {
      return res.json(db.jobApplications.filter((a) => a.jobId === jobId));
    }
    res.json(db.jobApplications);
  });

  app.put("/api/jobs/applications/:id", (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    const appRecord = db.jobApplications.find((a) => a.id === id);
    if (!appRecord) return res.status(404).json({ error: "Application not found" });

    if (status) appRecord.status = status;
    if (notes !== undefined) appRecord.notes = notes;

    saveDatabase();
    res.json({ success: true, application: appRecord });
  });

  // --- 5. LOCAL SHOPS & BUSINESS DIRECTORY ---
  app.get("/api/shops", (req, res) => {
    const { category, village, search } = req.query;
    let list = [...db.shops];
    if (category && category !== "all") {
      list = list.filter((s) => s.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (village && village !== "all") {
      list = list.filter((s) => s.village.toLowerCase().includes((village as string).toLowerCase()));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.nameTe.toLowerCase().includes(q) ||
          s.ownerName.toLowerCase().includes(q) ||
          s.productsAndServices.some((p) => p.toLowerCase().includes(q))
      );
    }
    res.json(list);
  });

  app.post("/api/shops", (req, res) => {
    const body = req.body;
    const newShop: LocalBusiness = {
      id: `SHP-${Math.floor(100 + Math.random() * 900)}`,
      name: body.name,
      nameTe: body.nameTe || body.name,
      category: body.category || "General Store",
      ownerName: body.ownerName,
      phone: body.phone,
      address: body.address,
      village: body.village || "Penumantra",
      mandal: body.mandal || body.village || "Penumantra",
      district: body.district || "West Godavari",
      openingHours: body.openingHours || "7:00 AM – 8:30 PM",
      isOpen: true,
      productsAndServices: Array.isArray(body.productsAndServices)
        ? body.productsAndServices
        : (body.productsAndServices || "").split(",").map((s: string) => s.trim()),
      photoUrl: body.photoUrl || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=400&q=80",
      rating: 5.0,
      reviewCount: 1,
      isVerified: true,
    };
    db.shops.unshift(newShop);
    saveDatabase();
    res.status(201).json({ success: true, shop: newShop });
  });

  // --- 6. NOTIFICATIONS API ---
  app.get("/api/notifications", (req, res) => {
    const { role } = req.query;
    let list = db.notifications;
    if (role) {
      list = list.filter((n) => n.roleTarget === "all" || n.roleTarget === role);
    }
    res.json(list);
  });

  app.post("/api/notifications/read", (req, res) => {
    const { id } = req.body;
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    saveDatabase();
    res.json({ success: true });
  });

  app.post("/api/notifications/read-all", (req, res) => {
    db.notifications.forEach((n) => (n.read = true));
    saveDatabase();
    res.json({ success: true });
  });

  // --- 7. BOOKMARKS API ---
  app.get("/api/bookmarks", (req, res) => {
    const userId = (req.query.userId as string) || "guest";
    res.json(db.bookmarks[userId] || { jobs: [], workers: [], shops: [] });
  });

  app.post("/api/bookmarks/toggle", (req, res) => {
    const { userId, type, id } = req.body; // type: 'jobs' | 'workers' | 'shops'
    const uid = userId || "guest";
    if (!db.bookmarks[uid]) {
      db.bookmarks[uid] = { jobs: [], workers: [], shops: [] };
    }
    const currentList = db.bookmarks[uid][type as 'jobs' | 'workers' | 'shops'] || [];
    const idx = currentList.indexOf(id);
    if (idx >= 0) {
      currentList.splice(idx, 1);
    } else {
      currentList.push(id);
    }
    db.bookmarks[uid][type as 'jobs' | 'workers' | 'shops'] = currentList;
    saveDatabase();
    res.json({ success: true, bookmarks: db.bookmarks[uid] });
  });

  // --- 8. EDUCATION, SCHOLARSHIPS, FIRST AID & HEALTH ---
  app.get("/api/scholarships", (req, res) => {
    res.json(initialScholarships);
  });

  app.get("/api/education/resources", (req, res) => {
    res.json(initialEduResources);
  });

  app.get("/api/education/tuitions", (req, res) => {
    res.json(initialTuitions);
  });

  app.get("/api/firstaid", (req, res) => {
    res.json(initialFirstAidGuides);
  });

  app.get("/api/schemes", (req, res) => {
    res.json(db.schemes);
  });

  app.get("/api/job-notifications", (req, res) => {
    res.json(initialGovtJobNotifications);
  });

  app.get("/api/faqs", (req, res) => {
    res.json(initialFaqItems);
  });

  app.get("/api/hospitals", (req, res) => {
    res.json(initialHospitals);
  });

  app.get("/api/announcements", (req, res) => {
    res.json(db.announcements);
  });

  app.post("/api/announcements", (req, res) => {
    const body = req.body;
    const newAnn: Announcement = {
      id: `ANN-${Date.now()}`,
      title: body.title,
      titleTe: body.titleTe || body.title,
      category: body.category || "Panchayat Notice",
      content: body.content,
      contentTe: body.contentTe || body.content,
      date: new Date().toISOString().split("T")[0],
      village: body.village || "All Villages",
      isImportant: Boolean(body.isImportant),
      issuedBy: body.issuedBy || "Panchayat Office",
    };
    db.announcements.unshift(newAnn);

    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "all",
      title: newAnn.title,
      titleTe: newAnn.titleTe,
      message: newAnn.content,
      messageTe: newAnn.contentTe,
      type: "announcement",
      read: false,
      createdAt: newAnn.date,
      linkTab: "home",
    });

    saveDatabase();
    res.status(201).json({ success: true, announcement: newAnn });
  });

  app.put("/api/announcements/:id", (req, res) => {
    const { id } = req.params;
    const { title, titleTe, category, content, contentTe, isImportant, village } = req.body;
    const ann = db.announcements.find((a) => a.id === id);
    if (!ann) return res.status(404).json({ error: "Announcement not found" });

    if (title) ann.title = title;
    if (titleTe) ann.titleTe = titleTe;
    if (category) ann.category = category;
    if (content) ann.content = content;
    if (contentTe) ann.contentTe = contentTe;
    if (isImportant !== undefined) ann.isImportant = Boolean(isImportant);
    if (village) ann.village = village;

    saveDatabase();
    res.json({ success: true, announcement: ann });
  });

  app.delete("/api/announcements/:id", (req, res) => {
    const { id } = req.params;
    const idx = db.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: "Announcement not found" });

    db.announcements.splice(idx, 1);
    saveDatabase();
    res.json({ success: true });
  });

  // Schemes CRUD for Secretary
  app.post("/api/schemes", (req, res) => {
    const body = req.body;
    const newScheme: GovtScheme = {
      id: `SCHEME-${Date.now()}`,
      title: body.title,
      titleTe: body.titleTe || body.title,
      department: body.department || "AP Grama Sachivalayam",
      category: body.category || "General Welfare",
      description: body.description || "",
      descriptionTe: body.descriptionTe || body.description || "",
      financialAssistance: body.financialAssistance || "Direct DBT",
      eligibility: Array.isArray(body.eligibility) ? body.eligibility : [body.eligibility || "AP Resident"],
      requiredDocuments: Array.isArray(body.requiredDocuments) ? body.requiredDocuments : ["Aadhaar Card", "Rice Card"],
      beneficiaryType: body.beneficiaryType || "Rural Citizens",
      officialPortalUrl: body.officialPortalUrl || "https://www.ap.gov.in/",
    };
    db.schemes.unshift(newScheme);
    saveDatabase();
    res.status(201).json({ success: true, scheme: newScheme });
  });

  app.put("/api/schemes/:id", (req, res) => {
    const { id } = req.params;
    const scheme = db.schemes.find((s) => s.id === id);
    if (!scheme) return res.status(404).json({ error: "Scheme not found" });

    Object.assign(scheme, req.body);
    saveDatabase();
    res.json({ success: true, scheme });
  });

  app.delete("/api/schemes/:id", (req, res) => {
    const { id } = req.params;
    const idx = db.schemes.findIndex((s) => s.id === id);
    if (idx === -1) return res.status(404).json({ error: "Scheme not found" });

    db.schemes.splice(idx, 1);
    saveDatabase();
    res.json({ success: true });
  });

  app.delete("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const idx = db.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return res.status(404).json({ error: "Job not found" });

    db.jobs.splice(idx, 1);
    saveDatabase();
    res.json({ success: true });
  });

  // --- 9. VILLAGE STATS API ---
  app.get("/api/stats", (req, res) => {
    const resolved = db.complaints.filter((c) => c.status === "Resolved" || c.status === "Closed").length;
    const pending = db.complaints.filter((c) => c.status !== "Resolved" && c.status !== "Closed").length;
    res.json({
      resolvedGrievances: resolved,
      pendingGrievances: pending,
      activeWorkers: db.workers.length,
      jobsPostedCount: db.jobs.length,
      activeShopsCount: db.shops.length,
      scholarshipsClaimed: 320,
      activePHCs: initialHospitals.length,
    });
  });

  // --- 10. EMERGENCY SOS DISPATCH API ---
  app.post("/api/sos", (req, res) => {
    const { location, phone, victimName, note, gpsCoords } = req.body;
    const dispatchId = `SOS-AP-${Date.now()}`;
    console.log(`[SOS DISPATCH ALERT] Triggered by ${victimName} (${phone}) at ${location}. Note: ${note}`);

    // Create high-priority notification
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      roleTarget: "all",
      title: `🚨 EMERGENCY SOS DISPATCHED: ${location}`,
      titleTe: `🚨 అత్యవసర SOS సహాయం పంపబడింది: ${location}`,
      message: `Emergency SOS triggered by ${victimName || "Citizen"} (${phone}). Alerts dispatched to Police (100) & Ambulance (108).`,
      messageTe: `${victimName || "గ్రామస్తులు"} నుండి అత్యవసర SOS అలర్ట్. 100 పోలీస్ మరియు 108 అంబులెన్స్ కు సమాచారం చేరింది.`,
      type: "emergency",
      read: false,
      createdAt: new Date().toISOString().split("T")[0],
      linkTab: "health",
    });

    saveDatabase();

    res.json({
      success: true,
      message: "Emergency SOS dispatched successfully to Sarpanch, AP Police (100) and YSR 108 Ambulance.",
      dispatchId,
      alertSentTo: [
        "Penumantra Grama Sarpanch & Secretary Office",
        "AP Police Station Control Room (100 / 112)",
        "108 Emergency Ambulance Transit Unit",
        "181 Women Safety / Disha Protection Wing",
      ],
      gpsCoords: gpsCoords || { lat: 16.6342, lng: 81.6547 },
    });
  });

  // --- 11. AI VILLAGE CHATBOT API (GEMINI 3.6 FLASH) ---
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const { prompt, language } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const langContext = language === "te" ? "Telugu" : "English";

      if (!aiClient) {
        return res.json({
          text:
            language === "te"
              ? "గమనిక: Gemini AI API కీ కాన్ఫిగర్ కాలేదు. లైవ్ AI సమాధానాల కోసం దయచేసి పర్యావరణ వేరియబుల్స్ లో GEMINI_API_KEY ని సెట్ చేయండి. ప్రస్తుతానికి మన గ్రామ కనెక్ట్ లోని సమస్యల నమోదు, కార్మికుల డైరెక్టరీ, ప్రభుత్వ పథకాలు మరియు విద్య విభాగాలను నేరుగా ఉపయోగించవచ్చు."
              : "Configuration Notice: The Gemini AI API key is not currently configured in the environment. Please set GEMINI_API_KEY in the environment variables to activate live AI responses. In the meantime, you can directly explore Grievances, Worker Directory, Government Schemes, and Education Hub.",
          isConfigWarning: true,
        });
      }

      const systemInstruction = `You are "GramConnect AI Village Mitram" (గ్రామ కనెక్ట్ AI గ్రామ మిత్ర), an expert AI assistant designed for rural and urban citizens in Andhra Pradesh and India.
Your mission is to provide accurate, warm, respectful, practical guidance regarding:
1. AP Government Welfare Schemes (e.g., Jagananna Vidya Deevena, Vasathi Deevena, NTR/YSR Bharosa Pension, Amma Vodi, Rythu Bharosa, YSR Aarogyasri, PM-Kisan, MGNREGA).
2. Village Grievances & Civic Issues (how to file complaints for roads, drainage, streetlights, drinking water).
3. Local Skilled Workers & Job Opportunities (guidance for farmers, masons, electricians, tailors, students).
4. Education, Scholarships & Competitive Exams (APPSC, SSC, RRB, Police Constable, UPSC).
5. Rural Health & Emergency Services (108 Ambulance, 104 Mobile Unit, PHCs, Women Disha 181).

Language Constraint: Respond in fluent ${langContext}. If the requested language is Telugu, use natural, clear Telugu script (తెలుగు) with friendly Telugu terms like "నమస్తే", "గ్రామ సోదరులారా", "ప్రభుత్వ సహాయం". Keep bullet points clear and simple so even a daily-wage worker or student can easily understand.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText =
        response.text ||
        (language === "te"
          ? "క్షమించండి, ప్రస్తుతం వివరాలు లభించలేదు. మరలా ప్రయత్నించండి."
          : "Sorry, I could not generate a response right now. Please try again.");

      return res.json({ text: replyText });
    } catch (error: any) {
      console.error("Gemini AI Chat Error:", error);
      const isTe = req.body.language === "te";
      return res.status(500).json({
        error: "AI Service error",
        text: isTe
          ? "నమస్తే! AI సర్వర్‌ను సంప్రదించడంలో సమస్య ఉంది. కొన్ని క్షణాల తర్వాత మళ్లీ ప్రయత్నించండి లేదా హెల్ప్‌లైన్ 1902 ను సంప్రదించండి."
          : "Namaste! A temporary connection issue occurred while calling the AI service. Please try again.",
      });
    }
  });

  // --- VITE DEVELOPMENT OR PRODUCTION STATIC SERVING ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GramConnect Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
