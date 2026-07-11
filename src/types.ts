export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  availability: string[]; // e.g. ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM"]
  image: string;
  bio: string;
  location: string;
  price: number;
}

export interface Medication {
  name: string;
  dosage: string; // e.g. "500mg"
  frequency: string; // e.g. "Once daily", "Twice daily after meals"
  duration: string; // e.g. "7 days"
}

export interface Prescription {
  medications: Medication[];
  notes: string;
  followUpDate?: string;
  prescribedBy: string;
  date: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  chiefComplaint: string;
  prescription?: Prescription;
}

export interface VitalLog {
  id: string;
  date: string; // YYYY-MM-DD
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  bloodGlucose: number; // mg/dL
  heartRate: number; // bpm
  weight: number; // kg
  temperature: number; // °C
  waterIntake: number; // L
  sleepHours: number; // hrs
  mood: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface MedicalRecord {
  id: string;
  title: string;
  category: 'Lab Report' | 'Imaging' | 'Prescription' | 'Other';
  date: string;
  doctorName: string;
  notes: string;
  contentRaw?: string; // Text content for AI summarization
  contentSummarized?: string; // Stored AI summary
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
