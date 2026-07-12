export type Language = "en" | "es" | "hi" | "fr" | "de";

export interface TranslationDict {
  dashboard: string;
  appointments: string;
  vitals: string;
  records: string;
  aiCompanion: string;
  voiceAssistant: string;
  emergencySos: string;
  accessibility: string;
  welcomeBack: string;
  bioScore: string;
  optimal: string;
  normal: string;
  high: string;
  systolic: string;
  diastolic: string;
  glucose: string;
  heartRate: string;
  hydrationRest: string;
  waterIntake: string;
  sleepHours: string;
  upcomingAppt: string;
  bookNew: string;
  doctorView: string;
  patientView: string;
  sosTitle: string;
  sosBtn: string;
  sosBtnHelp: string;
  sosContacts: string;
  sosAddContact: string;
  accessibilityTitle: string;
  textSize: string;
  highContrast: string;
  largeButtons: string;
  simplifiedMode: string;
  voiceAssistantTitle: string;
  readAloud: string;
  readVitals: string;
  readAppts: string;
  dailyHealthTips: string;
  howToUseApp: string;
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    dashboard: "Health Dashboard",
    appointments: "Book Appointment",
    vitals: "Vitals & Logs",
    records: "Medical Records",
    aiCompanion: "AI Companion",
    voiceAssistant: "Voice Assistant",
    emergencySos: "Emergency SOS",
    accessibility: "Accessibility Center",
    welcomeBack: "Welcome back, Alex Mercer",
    bioScore: "Daily Bio Score",
    optimal: "Optimal Status",
    normal: "Normal",
    high: "High",
    systolic: "Systolic",
    diastolic: "Diastolic",
    glucose: "Blood Glucose",
    heartRate: "PPG Heart Rate",
    hydrationRest: "Hydration & Rest",
    waterIntake: "Water Intake",
    sleepHours: "Sleep Hours",
    upcomingAppt: "Upcoming Appointment",
    bookNew: "Book New Doctor",
    doctorView: "Switch to Doctor View",
    patientView: "Return to Patient Portal",
    sosTitle: "Quick Emergency Help",
    sosBtn: "SOS",
    sosBtnHelp: "Press for Help",
    sosContacts: "Emergency Contacts",
    sosAddContact: "Add Contact",
    accessibilityTitle: "Easy-to-Use Settings",
    textSize: "Text Size",
    highContrast: "High Contrast Mode",
    largeButtons: "Large Buttons & Icons",
    simplifiedMode: "Simplified Mode",
    voiceAssistantTitle: "Speak & Listen Voice Assistant",
    readAloud: "Quick Read Aloud",
    readVitals: "Read My Vitals",
    readAppts: "Read Appointments",
    dailyHealthTips: "Daily Health Tips",
    howToUseApp: "How to Use This App"
  },
  es: {
    dashboard: "Panel de Salud",
    appointments: "Reservar Cita",
    vitals: "Signos Vitales",
    records: "Historial Médico",
    aiCompanion: "Compañero de IA",
    voiceAssistant: "Asistente de Voz",
    emergencySos: "S.O.S Emergencia",
    accessibility: "Centro de Accesibilidad",
    welcomeBack: "Bienvenido de nuevo, Alex Mercer",
    bioScore: "Puntaje de Salud Diario",
    optimal: "Estado Óptimo",
    normal: "Normal",
    high: "Alto",
    systolic: "Sistólica",
    diastolic: "Diastólica",
    glucose: "Glucosa en Sangre",
    heartRate: "Ritmo Cardíaco PPG",
    hydrationRest: "Hidratación y Descanso",
    waterIntake: "Consumo de Agua",
    sleepHours: "Horas de Sueño",
    upcomingAppt: "Próxima Cita Médica",
    bookNew: "Reservar Nuevo Médico",
    doctorView: "Cambiar a Vista de Doctor",
    patientView: "Volver al Portal del Paciente",
    sosTitle: "Ayuda Rápida de Emergencia",
    sosBtn: "SOS",
    sosBtnHelp: "Presiona para Ayuda",
    sosContacts: "Contactos de Emergencia",
    sosAddContact: "Agregar Contacto",
    accessibilityTitle: "Ajustes Fáciles de Usar",
    textSize: "Tamaño de Texto",
    highContrast: "Modo de Alto Contraste",
    largeButtons: "Botones e Iconos Grandes",
    simplifiedMode: "Modo Simplificado",
    voiceAssistantTitle: "Asistente de Voz Habla y Escucha",
    readAloud: "Lectura Rápida en Voz Alta",
    readVitals: "Leer mis Vitales",
    readAppts: "Leer mis Citas",
    dailyHealthTips: "Consejos Diarios de Salud",
    howToUseApp: "Cómo Usar Esta Aplicación"
  },
  hi: {
    dashboard: "स्वास्थ्य डैशबोर्ड",
    appointments: "अपॉइंटमेंट बुक करें",
    vitals: "महत्वपूर्ण संकेतक",
    records: "चिकित्सा रिकॉर्ड",
    aiCompanion: "एआई साथी",
    voiceAssistant: "आवाज सहायक",
    emergencySos: "आपातकालीन एसओएस",
    accessibility: "पहुंच केंद्र",
    welcomeBack: "वापसी पर स्वागत है, एलेक्स मर्सर",
    bioScore: "दैनिक स्वास्थ्य स्कोर",
    optimal: "इष्टतम स्थिति",
    normal: "सामान्य",
    high: "उच्च",
    systolic: "सिस्टोलिक",
    diastolic: "डायस्टोलिक",
    glucose: "रक्त ग्लूकोज",
    heartRate: "हृदय गति",
    hydrationRest: "जलयोजन और आराम",
    waterIntake: "पानी की खपत",
    sleepHours: "नींद के घंटे",
    upcomingAppt: "आगामी अपॉइंटमेंट",
    bookNew: "नया डॉक्टर बुक करें",
    doctorView: "डॉक्टर दृश्य पर जाएँ",
    patientView: "मरीज पोर्टल पर लौटें",
    sosTitle: "त्वरित आपातकालीन सहायता",
    sosBtn: "SOS",
    sosBtnHelp: "सहायता के लिए दबाएं",
    sosContacts: "आपातकालीन संपर्क",
    sosAddContact: "संपर्क जोड़ें",
    accessibilityTitle: "उपयोग में आसान सेटिंग्स",
    textSize: "अक्षर का आकार",
    highContrast: "उच्च कंट्रास्ट मोड",
    largeButtons: "बड़े बटन और आइकन",
    simplifiedMode: "सरलीकृत मोड",
    voiceAssistantTitle: "बोलें और सुनें आवाज सहायक",
    readAloud: "त्वरित जोर से पढ़ें",
    readVitals: "मेरे संकेतक पढ़ें",
    readAppts: "अपॉइंटमेंट पढ़ें",
    dailyHealthTips: "दैनिक स्वास्थ्य सुझाव",
    howToUseApp: "इस ऐप का उपयोग कैसे करें"
  },
  fr: {
    dashboard: "Tableau de Bord",
    appointments: "Prendre Rendez-vous",
    vitals: "Constantes Vitales",
    records: "Dossiers Médicaux",
    aiCompanion: "Compagnon IA",
    voiceAssistant: "Assistant Vocal",
    emergencySos: "SOS Urgence",
    accessibility: "Accessibilité",
    welcomeBack: "Bon retour, Alex Mercer",
    bioScore: "Score Biologique Quotidien",
    optimal: "État Optimal",
    normal: "Normal",
    high: "Élevé",
    systolic: "Systolique",
    diastolic: "Diastolique",
    glucose: "Glycémie",
    heartRate: "Rythme Cardiaque PPG",
    hydrationRest: "Hydratation & Repos",
    waterIntake: "Apport en Eau",
    sleepHours: "Heures de Sommeil",
    upcomingAppt: "Prochain Rendez-vous",
    bookNew: "Nouveau Médecin",
    doctorView: "Passer en Mode Docteur",
    patientView: "Retour au Portail Patient",
    sosTitle: "Aide d'Urgence Rapide",
    sosBtn: "SOS",
    sosBtnHelp: "Presser pour Aide",
    sosContacts: "Contacts d'Urgence",
    sosAddContact: "Ajouter Contact",
    accessibilityTitle: "Paramètres Faciles à Utiliser",
    textSize: "Taille du Texte",
    highContrast: "Mode Contraste Élevé",
    largeButtons: "Grands Boutons & Icônes",
    simplifiedMode: "Mode Simplifié",
    voiceAssistantTitle: "Assistant Vocal Parler & Écouter",
    readAloud: "Lecture Rapide",
    readVitals: "Lire mes Constantes",
    readAppts: "Lire mes Rendez-vous",
    dailyHealthTips: "Conseils de Santé",
    howToUseApp: "Comment Utiliser l'App"
  },
  de: {
    dashboard: "Gesundheits-Dashboard",
    appointments: "Termin Buchen",
    vitals: "Vitalwerte",
    records: "Krankenakte",
    aiCompanion: "KI-Begleiter",
    voiceAssistant: "Sprachassistent",
    emergencySos: "Notfall SOS",
    accessibility: "Barrierefreiheit",
    welcomeBack: "Willkommen zurück, Alex Mercer",
    bioScore: "Täglicher Bio-Score",
    optimal: "Optimaler Zustand",
    normal: "Normal",
    high: "Hoch",
    systolic: "Systolisch",
    diastolic: "Diastolisch",
    glucose: "Blutzucker",
    heartRate: "PPG Herzfrequenz",
    hydrationRest: "Hydration & Schlaf",
    waterIntake: "Wasserzufuhr",
    sleepHours: "Schlafstunden",
    upcomingAppt: "Nächster Termin",
    bookNew: "Arzt Buchen",
    doctorView: "Zu Arztansicht wechseln",
    patientView: "Zurück zum Patientenportal",
    sosTitle: "Schnelle Notfallhilfe",
    sosBtn: "SOS",
    sosBtnHelp: "Für Hilfe drücken",
    sosContacts: "Notfallkontakte",
    sosAddContact: "Kontakt hinzufügen",
    accessibilityTitle: "Einfache Einstellungen",
    textSize: "Textgröße",
    highContrast: "Kontrastmodus",
    largeButtons: "Große Tasten & Symbole",
    simplifiedMode: "Vereinfachter Modus",
    voiceAssistantTitle: "Sprachassistent Sprechen & Hören",
    readAloud: "Laut Vorlesen",
    readVitals: "Vitalwerte Vorlesen",
    readAppts: "Termine Vorlesen",
    dailyHealthTips: "Tägliche Gesundheitstipps",
    howToUseApp: "Bedienungsanleitung"
  }
};
