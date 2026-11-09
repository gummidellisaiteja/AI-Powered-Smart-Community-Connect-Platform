# AI-Powered Smart Community Connect Platform (GramConnect)

GramConnect is a digital community platform designed to bridge rural and urban citizens with local governance, civic services, skilled local workers, employment opportunities, educational resources, healthcare assistance, and AI-driven community support across Andhra Pradesh. The platform features bilingual support in **Telugu (తెలుగు)** and **English**.

---

## 🌟 Key Features & Modules

- **Citizen Dashboard & Quick Services**: Quick access to essential village services, civic announcements, and live statistics.
- **Civic Grievances & Complaints Management**: Lodge complaints with geo-tagging, category assignment, priority tracking, and real-time status updates from village authorities.
- **Skilled Workers & Rural Services**: Directory of verified local service providers (electricians, plumbers, carpenters, drivers) with direct calling and booking.
- **Rural Employment & Job Opportunities**: Job postings for agricultural, local business, and community positions with online applications.
- **Education & Skill Development Hub**: Access to APPSC study materials, mock tests, scholarship information, and local tutoring programs.
- **Government Welfare Schemes Directory**: Searchable repository of state and central welfare schemes with eligibility checker and documentation guides.
- **Healthcare & Emergency SOS**: Instant directory of primary health centers, emergency ambulance contacts, and first-aid instructions.
- **AI Community Assistant**: Bilingual AI assistant for citizen inquiries regarding village services, schemes, and procedures.
- **Grama Panchayat Secretary Portal**: Administrative dashboard for grievance resolution, status tracking, worker verification, and announcement broadcasting.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion.
- **Backend / API**: Express.js, Google Gemini GenAI SDK (`@google/genai`), persistent JSON store.
- **Hosting**:
  - **Static Frontend**: Hosted on **GitHub Pages** with automated deployment via **GitHub Actions**.
  - **Live URL**: [https://gummidellisaiteja.github.io/AI-Powered-Smart-Community-Connect-Platform/](https://gummidellisaiteja.github.io/AI-Powered-Smart-Community-Connect-Platform/)

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18 or higher, v20+ recommended)
- npm or bun

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/gummidellisaiteja/AI-Powered-Smart-Community-Connect-Platform.git
   cd AI-Powered-Smart-Community-Connect-Platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for local full-stack server):
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY inside .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment Details

### GitHub Pages (Frontend)
The static frontend is compiled using Vite into the `dist/` directory with base path `/AI-Powered-Smart-Community-Connect-Platform/`.
Automated deployment is configured using GitHub Actions (`.github/workflows/deploy.yml`).

### Backend Services (Express & Gemini AI)
GitHub Pages hosts static files only. The Express backend (`server.ts`) provides dynamic server endpoints:
- `/api/ai-chat`: Gemini AI API integration
- `/api/auth/*`: Secretary and citizen authentication
- Persistent data storage for grievances and applications

To run the live AI chatbot in production:
1. Deploy `server.ts` to a Node.js hosting platform (such as Render, Railway, Fly.io, Google Cloud Run, or AWS).
2. Set the `GEMINI_API_KEY` secret in your backend hosting provider's environment variables.
3. Configure the frontend API base URL to point to your deployed backend.
