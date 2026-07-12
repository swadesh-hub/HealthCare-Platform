import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Appointments from "./components/Appointments";
import VitalsTracker from "./components/VitalsTracker";
import MedicalRecords from "./components/MedicalRecords";
import AICompanion from "./components/AICompanion";
import DoctorDashboard from "./components/DoctorDashboard";
import AccessibilityPanel, { AccessibilitySettings } from "./components/AccessibilityPanel";
import EmergencySOS from "./components/EmergencySOS";
import VoiceAssistant from "./components/VoiceAssistant";
import { SEED_VITALS, SEED_APPOINTMENTS, SEED_MEDICAL_RECORDS, SEED_DOCTORS } from "./data";
import { VitalLog, Appointment, MedicalRecord, ChatMessage } from "./types";
import { Language, TRANSLATIONS } from "./localization";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<"patient" | "doctor">("patient");

  // Core state managers loaded lazily from localStorage to preserve edits
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Accessibility state hydrated from localStorage
  const [accessSettings, setAccessSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem("care_access_settings");
    return saved ? JSON.parse(saved) : {
      largeText: false,
      highContrast: false,
      simplifiedMode: false,
      fontSize: "normal"
    };
  });

  const saveAccessSettings = (settings: AccessibilitySettings) => {
    setAccessSettings(settings);
    localStorage.setItem("care_access_settings", JSON.stringify(settings));
  };

  // Language state management
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("care_language");
    return (saved as Language) || "en";
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("care_language", lang);
  };

  // Hydrate state from localStorage or use Seed data on mount
  useEffect(() => {
    const cachedVitals = localStorage.getItem("care_vitals");
    const cachedAppts = localStorage.getItem("care_appts");
    const cachedRecords = localStorage.getItem("care_records");
    const cachedChat = localStorage.getItem("care_chat");

    if (cachedVitals) setVitals(JSON.parse(cachedVitals));
    else {
      setVitals(SEED_VITALS);
      localStorage.setItem("care_vitals", JSON.stringify(SEED_VITALS));
    }

    if (cachedAppts) setAppointments(JSON.parse(cachedAppts));
    else {
      setAppointments(SEED_APPOINTMENTS);
      localStorage.setItem("care_appts", JSON.stringify(SEED_APPOINTMENTS));
    }

    if (cachedRecords) setRecords(JSON.parse(cachedRecords));
    else {
      setRecords(SEED_MEDICAL_RECORDS);
      localStorage.setItem("care_records", JSON.stringify(SEED_MEDICAL_RECORDS));
    }

    if (cachedChat) setChatHistory(JSON.parse(cachedChat));
  }, []);

  // Sync state helpers
  const saveVitals = (data: VitalLog[]) => {
    setVitals(data);
    localStorage.setItem("care_vitals", JSON.stringify(data));
  };

  const saveAppointments = (data: Appointment[]) => {
    setAppointments(data);
    localStorage.setItem("care_appts", JSON.stringify(data));
  };

  const saveRecords = (data: MedicalRecord[]) => {
    setRecords(data);
    localStorage.setItem("care_records", JSON.stringify(data));
  };

  const saveChatHistory = (data: ChatMessage[]) => {
    setChatHistory(data);
    localStorage.setItem("care_chat", JSON.stringify(data));
  };

  // State modifier: Add Vitals Log
  const handleAddVitalLog = (newLog: Omit<VitalLog, "id">) => {
    const loggedEntry: VitalLog = {
      ...newLog,
      id: `vit-${Date.now()}`
    };
    const updated = [...vitals, loggedEntry];
    saveVitals(updated);
  };

  // State modifier: Book appointment
  const handleBookAppointment = (
    doctorId: string, 
    date: string, 
    timeSlot: string, 
    chiefComplaint: string
  ) => {
    const doc = SEED_DOCTORS.find(d => d.id === doctorId);
    if (!doc) return;

    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      doctorId,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      patientName: "Alex Mercer",
      date,
      timeSlot,
      status: "scheduled",
      chiefComplaint
    };

    const updated = [...appointments, newAppt];
    saveAppointments(updated);
  };

  // State modifier: Cancel appointment
  const handleCancelAppointment = (appointmentId: string) => {
    const updated = appointments.filter(app => app.id !== appointmentId);
    saveAppointments(updated);
  };

  // State modifier: Complete appointment as simulated doctor
  const handleCompleteAppointment = (
    appointmentId: string, 
    prescription: Appointment["prescription"]
  ) => {
    const updated = appointments.map((app) => {
      if (app.id === appointmentId) {
        return {
          ...app,
          status: "completed" as const,
          prescription
        };
      }
      return app;
    });
    saveAppointments(updated);

    // If prescription has followUpDate, automatically add that practitioner detail to the notes as well
    if (prescription) {
      const newRecord: MedicalRecord = {
        id: `rec-${Date.now()}`,
        title: `Clinical Prescription - ${prescription.prescribedBy}`,
        category: "Prescription",
        date: prescription.date,
        doctorName: prescription.prescribedBy,
        notes: prescription.notes,
        contentRaw: `PRESCRIPTION TRANSCRIPT\nPractitioner: ${prescription.prescribedBy}\nDate: ${prescription.date}\nNotes: ${prescription.notes}\nMedications:\n${prescription.medications.map(m => `- ${m.name} (${m.dosage}): ${m.frequency} for ${m.duration}`).join("\n")}`
      };
      saveRecords([...records, newRecord]);
    }
  };

  // State modifier: Add manual medical record
  const handleAddRecord = (newRec: Omit<MedicalRecord, "id">) => {
    const record: MedicalRecord = {
      ...newRec,
      id: `rec-${Date.now()}`
    };
    saveRecords([...records, record]);
  };

  // State modifier: Update clinical document AI summary
  const handleUpdateRecordSummary = (recordId: string, summary: string) => {
    const updated = records.map((rec) => {
      if (rec.id === recordId) {
        return {
          ...rec,
          contentSummarized: summary
        };
      }
      return rec;
    });
    saveRecords(updated);
  };

  // State modifier: Add chat history bubble
  const handleAddChatMessage = (msg: ChatMessage) => {
    const updated = [...chatHistory, msg];
    saveChatHistory(updated);
  };

  // Active tab renderer helper
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            vitals={vitals} 
            appointments={appointments} 
            records={records}
            onNavigate={(tab) => {
              setActiveTab(tab);
            }}
            onAddVitalLog={handleAddVitalLog}
          />
        );
      case "appointments":
        return (
          <Appointments 
            doctors={SEED_DOCTORS} 
            appointments={appointments}
            onBookAppointment={handleBookAppointment}
            onCancelAppointment={handleCancelAppointment}
          />
        );
      case "vitals":
        return (
          <VitalsTracker 
            vitals={vitals} 
            onAddVitalLog={handleAddVitalLog}
          />
        );
      case "records":
        return (
          <MedicalRecords 
            records={records}
            onAddRecord={handleAddRecord}
            onUpdateRecordSummary={handleUpdateRecordSummary}
          />
        );
      case "ai-companion":
        return (
          <AICompanion 
            chatHistory={chatHistory} 
            onAddChatMessage={handleAddChatMessage}
            latestVitals={vitals.length > 0 ? vitals[vitals.length - 1] : null}
          />
        );
      case "doctor-dashboard":
        return (
          <DoctorDashboard 
            appointments={appointments}
            onCompleteAppointment={handleCompleteAppointment}
          />
        );
      case "voice-assistant":
        return (
          <VoiceAssistant 
            vitals={vitals}
            appointments={appointments}
          />
        );
      case "emergency-sos":
        return (
          <EmergencySOS />
        );
      case "accessibility":
        return (
          <AccessibilityPanel 
            settings={accessSettings}
            onSettingsChange={saveAccessSettings}
          />
        );
      default:
        return (
          <div className="py-20 text-center font-mono text-slate-500 text-xs">
            Module View Not Found
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-slate-50 font-sans transition-all duration-200 ${
      accessSettings.highContrast ? "hc-mode" : ""
    } ${
      accessSettings.largeText ? "large-ui" : ""
    } ${
      accessSettings.fontSize === "large" ? "font-size-large" : accessSettings.fontSize === "xlarge" ? "font-size-xlarge" : ""
    }`}>
      {/* Side Navigation panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole} 
        setUserRole={setUserRole}
        language={language}
        onLanguageChange={handleLanguageChange}
      />


      {/* Main interactive window area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Active Banner Indicator for doctor/patient role switcher context */}
          {userRole === "doctor" && (
            <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3.5 flex items-center justify-between text-xs text-amber-800 animate-pulse">
              <span className="font-semibold">⚠️ You are inside the Practitioner Dashboard Simulator. Complete appointments and write real-time prescriptions!</span>
              <button 
                onClick={() => {
                  setUserRole("patient");
                  setActiveTab("dashboard");
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors text-[10px]"
              >
                Return to Patient Portal
              </button>
            </div>
          )}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
