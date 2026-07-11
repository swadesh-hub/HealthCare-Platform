<div align="center">

<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />

<br /><br />

# 🏥 HealthCare Platform

### *Your AI-Powered Personal Health Companion*

> A full-stack intelligent healthcare management platform that combines real-time vitals tracking, smart appointment scheduling, AI-driven symptom analysis, and clinical report interpretation — all in one beautifully designed interface.

<br />

[🚀 Features](#-features) • [🛠️ Tech Stack](#%EF%B8%8F-tech-stack) • [⚡ Quick Start](#-quick-start) • [📁 Project Structure](#-project-structure) • [🤖 AI Features](#-ai-powered-features) • [🖥️ Screenshots](#%EF%B8%8F-screenshots)

</div>

---

## ✨ Features

| Module | Description |
|---|---|
| 📊 **Dashboard** | Real-time health overview with vitals summary, upcoming appointments, and quick-log widgets |
| 🗓️ **Appointments** | Browse doctors, book time slots, manage & cancel appointments with live status tracking |
| 💉 **Vitals Tracker** | Log & visualize blood pressure, glucose, heart rate, sleep, and water intake over time with Recharts |
| 📂 **Medical Records** | Upload, organize, and retrieve your clinical documents (prescriptions, lab reports, imaging) |
| 🤖 **AI Companion** | Chat with "Health Buddy" — a context-aware AI wellness coach powered by Google Gemini |
| 🩺 **Doctor Dashboard** | Practitioner simulation view to complete appointments and issue structured prescriptions |
| 🔍 **Symptom Checker** | AI-powered triage assessment with severity rating, specialist recommendations & next steps |
| 📄 **Report Interpreter** | Paste any medical report text to get a plain-language AI summary with actionable insights |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Latest React with concurrent rendering
- **TypeScript 5.8** — Full type safety across all components
- **Tailwind CSS 4** — Utility-first styling with custom design tokens
- **Recharts** — Interactive charts for vitals visualization
- **Motion (Framer)** — Smooth micro-animations and transitions
- **Lucide React** — Consistent, beautiful icon library
- **Vite 6** — Lightning-fast build tool and dev server

### Backend
- **Express.js 4** — Minimal, fast Node.js web framework
- **Google Gemini AI** (`@google/genai`) — Powers all AI features (symptom checking, report summarization, health coaching)
- **tsx** — TypeScript execution for development
- **esbuild** — Ultra-fast production bundling
- **dotenv** — Secure environment variable management

### Architecture
- **Full-stack SPA** — Vite serves the React frontend in development; Express serves the built bundle in production
- **LocalStorage persistence** — All patient data (vitals, appointments, records, chat) is persisted locally
- **Demo Mode** — All AI features gracefully degrade to rich demo responses when no API key is configured

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** `>= 18.x`
- **npm** `>= 9.x`
- A **Google Gemini API Key** (optional — platform runs in demo mode without it)

### 1. Clone the Repository

```bash
git clone https://github.com/swadesh-hub/HealthCare-Platform.git
cd HealthCare-Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

> **Don't have an API key?** No problem! The platform runs in **Demo Mode** with rich simulated AI responses. Just skip this step.

### 4. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 📁 Project Structure

```
healthcare-platform/
├── 📄 index.html              # HTML entry point
├── 📄 server.ts               # Express backend + Gemini AI endpoints
├── 📄 vite.config.ts          # Vite + React plugin configuration
├── 📄 tsconfig.json           # TypeScript compiler options
├── 📄 package.json            # Dependencies & npm scripts
├── 📄 .env.example            # Environment variable template
│
├── 📁 src/
│   ├── 📄 main.tsx            # React app entry point
│   ├── 📄 App.tsx             # Root component, state management & routing
│   ├── 📄 index.css           # Global styles & Tailwind directives
│   ├── 📄 types.ts            # Shared TypeScript type definitions
│   ├── 📄 data.ts             # Seed data (doctors, vitals, records, appointments)
│   │
│   └── 📁 components/
│       ├── 🖥️  Sidebar.tsx         # Navigation + Patient/Doctor role switcher
│       ├── 📊  Dashboard.tsx       # Main health overview dashboard
│       ├── 🗓️  Appointments.tsx    # Booking system & appointment management
│       ├── 💉  VitalsTracker.tsx   # Vitals logging & Recharts visualization
│       ├── 📂  MedicalRecords.tsx  # Document manager + AI report interpreter
│       ├── 🤖  AICompanion.tsx     # Health Buddy chat + Symptom Checker
│       └── 🩺  DoctorDashboard.tsx # Practitioner view & prescription issuer
│
└── 📁 assets/                 # Static assets
```

---

## 🤖 AI-Powered Features

The platform integrates **Google Gemini** (`gemini-3.5-flash`) through three dedicated API endpoints:

### 🔍 Symptom Checker — `POST /api/gemini/symptom-check`
Input patient symptoms, age, gender, and duration to receive:
- ✅ **Triage Assessment** with severity rating (Low / Medium / High)
- ✅ **Possible Explanations** with educational context
- ✅ **Recommended Specialist** based on symptom profile
- ✅ **At-Home Care Tips** and supportive lifestyle steps
- ✅ **Questions to Ask Your Doctor** during your visit

### 📄 Report Interpreter — `POST /api/gemini/summarize-report`
Paste raw medical report text to receive:
- ✅ **Plain Language Summary** — no medical jargon
- ✅ **Biomarkers Decoded** — what your lab values actually mean
- ✅ **Clinical Interpretation** — what's normal vs. what to monitor
- ✅ **Actionable Next Steps** and follow-up discussion points

### 💬 Health Coach Chat — `POST /api/gemini/health-coach`
A context-aware wellness assistant ("Health Buddy") that:
- ✅ Maintains **conversation history** (last 10 messages)
- ✅ Integrates **real-time vitals context** for personalized advice
- ✅ Covers **nutrition, hydration, sleep, stress management & fitness**
- ✅ Gently redirects acute symptoms to the Symptom Checker module

> **⚠️ Medical Disclaimer:** This platform is for educational and informational purposes only. AI responses are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot-reload at `localhost:3000` |
| `npm run build` | Build the production bundle (frontend + backend) |
| `npm start` | Run the production server from the `dist/` directory |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking |
| `npm run clean` | Remove the `dist/` build directory |

---

## 🌟 Key Design Decisions

- **No Database Required** — All data persists to `localStorage`, making the app fully portable with zero backend infrastructure costs for personal use.
- **Demo Mode First** — The platform is fully functional without a Gemini API key, ensuring accessibility during evaluation or demos.
- **Dual Role System** — Switch between Patient and Doctor views within the same session to simulate real clinical workflows.
- **Prescription Auto-Records** — When a doctor completes an appointment with a prescription, it is automatically saved to the patient's Medical Records.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by [Swadesh Narwariya](https://github.com/swadesh-hub)

⭐ **Star this repo** if you found it helpful!

</div>
