import { Doctor, VitalLog, Appointment, MedicalRecord } from "./types";

export const SEED_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Elena Rostova",
    specialty: "General Physician",
    rating: 4.95,
    experience: 12,
    availability: ["09:00 AM", "10:30 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    bio: "Your partner in long-term wellness, specialized in comprehensive primary family care, chronic disease management, and proactive preventative medicine.",
    location: "Metro Health Clinic, Block C, Suite 102",
    price: 80
  },
  {
    id: "doc-2",
    name: "Dr. Sarah Jenkins",
    specialty: "Cardiologist",
    rating: 4.90,
    experience: 15,
    availability: ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:00 PM"],
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
    bio: "Dedicated cardiovascular specialist focused on modern preventative cardiology, hypertension control, cholesterol management, and personalized heart care.",
    location: "Heart & Vascular Center, Plaza Level, Room 405",
    price: 130
  },
  {
    id: "doc-3",
    name: "Dr. Marcus Vance",
    specialty: "Neurologist",
    rating: 4.85,
    experience: 14,
    availability: ["10:00 AM", "11:00 AM", "02:30 PM", "04:00 PM"],
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    bio: "Expert in brain and cognitive health, specialized in diagnosing and treating chronic headaches, sleep disorders, neuropathic pain, and focus optimization.",
    location: "Brain Science Associates, Suite 501",
    price: 150
  },
  {
    id: "doc-4",
    name: "Dr. Amir Patel",
    specialty: "Pediatrician",
    rating: 4.80,
    experience: 10,
    availability: ["08:30 AM", "09:30 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    bio: "Dedicated to establishing a warm, safe, and engaging healthcare experience for newborns, children, and teenagers, specializing in child development.",
    location: "Happy Kids Pediatrics, Lower Level A",
    price: 90
  },
  {
    id: "doc-5",
    name: "Dr. Chloe Sterling",
    specialty: "Dermatologist",
    rating: 4.88,
    experience: 9,
    availability: ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "04:30 PM"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    bio: "Compassionate dermatologist providing evidence-based acne treatments, preventative skin screening, mole mapping, and restorative clinical skincare regimens.",
    location: "ClearSkin Dermatology, Floor 2, Suite 210",
    price: 110
  }
];

export const SEED_VITALS: VitalLog[] = [
  {
    id: "vit-1",
    date: "2026-07-06",
    systolicBP: 122,
    diastolicBP: 80,
    bloodGlucose: 105,
    heartRate: 72,
    weight: 74.2,
    temperature: 36.6,
    waterIntake: 1.8,
    sleepHours: 6.5,
    mood: "Fair"
  },
  {
    id: "vit-2",
    date: "2026-07-07",
    systolicBP: 120,
    diastolicBP: 78,
    bloodGlucose: 98,
    heartRate: 68,
    weight: 74.0,
    temperature: 36.5,
    waterIntake: 2.2,
    sleepHours: 7.2,
    mood: "Good"
  },
  {
    id: "vit-3",
    date: "2026-07-08",
    systolicBP: 124,
    diastolicBP: 81,
    bloodGlucose: 112,
    heartRate: 74,
    weight: 74.1,
    temperature: 36.7,
    waterIntake: 1.5,
    sleepHours: 6.0,
    mood: "Fair"
  },
  {
    id: "vit-4",
    date: "2026-07-09",
    systolicBP: 118,
    diastolicBP: 76,
    bloodGlucose: 92,
    heartRate: 65,
    weight: 73.8,
    temperature: 36.4,
    waterIntake: 2.8,
    sleepHours: 8.0,
    mood: "Excellent"
  },
  {
    id: "vit-5",
    date: "2026-07-10",
    systolicBP: 119,
    diastolicBP: 77,
    bloodGlucose: 95,
    heartRate: 67,
    weight: 73.9,
    temperature: 36.5,
    waterIntake: 2.5,
    sleepHours: 7.5,
    mood: "Good"
  }
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    doctorId: "doc-2",
    doctorName: "Dr. Sarah Jenkins",
    doctorSpecialty: "Cardiologist",
    patientName: "Alex Mercer",
    date: "2026-07-08",
    timeSlot: "11:30 AM",
    status: "completed",
    chiefComplaint: "Mild chest pressure during fast walks, feeling occasional palpitations.",
    prescription: {
      medications: [
        {
          name: "Coenzyme Q10 (CoQ10)",
          dosage: "100mg",
          frequency: "Once daily with breakfast",
          duration: "30 days"
        },
        {
          name: "Lisinopril",
          dosage: "5mg",
          frequency: "Once daily in the morning",
          duration: "90 days"
        }
      ],
      notes: "Palpitations seem benign, likely aggravated by moderate stress. Systolic blood pressure at checkout was 128/82. Follow salt reduction guidelines and keep a 5-day vitals blood pressure log. Regular cardio exercise (brisk walk) for 30 mins, 4 times a week.",
      followUpDate: "2026-08-08",
      prescribedBy: "Dr. Sarah Jenkins",
      date: "2026-07-08"
    }
  },
  {
    id: "appt-2",
    doctorId: "doc-1",
    doctorName: "Dr. Elena Rostova",
    doctorSpecialty: "General Physician",
    patientName: "Alex Mercer",
    date: "2026-07-14",
    timeSlot: "10:30 AM",
    status: "scheduled",
    chiefComplaint: "Annual routine health assessment, checking standard lab results and vaccine boosters."
  }
];

export const SEED_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "rec-1",
    title: "Complete Blood Count (CBC) & Lipid Panel",
    category: "Lab Report",
    date: "2026-07-05",
    doctorName: "Dr. Elena Rostova",
    notes: "Patient lipid panel shows mild borderline elevated low-density lipoprotein (LDL). Fasting glucose stable.",
    contentRaw: `LABORATORY ANALYSIS REPORT - METRO DIAGNOSTICS
PATIENT ID: AM-99832 | DATE: JULY 5, 2026
REFERRED BY: DR. ELENA ROSTOVA

TEST: COMPLETE BLOOD COUNT (CBC) WITH DIFF
- White Blood Cells (WBC): 6.4 x10^3/uL  (Ref: 4.5 - 11.0) - NORMAL
- Red Blood Cells (RBC): 4.82 x10^6/uL  (Ref: 4.30 - 5.90) - NORMAL
- Hemoglobin (Hgb): 15.2 g/dL         (Ref: 13.5 - 17.5) - NORMAL
- Hematocrit (Hct): 45.1%              (Ref: 41.0 - 50.0) - NORMAL
- Platelets: 245 x10^3/uL              (Ref: 150 - 450) - NORMAL

TEST: LIPID PANEL (FASTING)
- Total Cholesterol: 212 mg/dL         (Ref: < 200) - BORDERLINE HIGH
- Triglycerides: 142 mg/dL             (Ref: < 150) - NORMAL
- HDL ('Good') Cholesterol: 48 mg/dL    (Ref: > 40) - NORMAL
- LDL ('Bad') Cholesterol: 135 mg/dL     (Ref: < 100) - ELEVATED
- VLDL Cholesterol: 29 mg/dL           (Ref: 5 - 40) - NORMAL

TEST: COMPREHENSIVE METABOLIC PANEL (CMP)
- Fasting Glucose: 95 mg/dL            (Ref: 70 - 99) - NORMAL
- HbA1c: 5.4%                          (Ref: < 5.7%) - NORMAL
- BUN (Blood Urea Nitrogen): 16 mg/dL  (Ref: 7 - 20) - NORMAL
- Serum Creatinine: 0.92 mg/dL          (Ref: 0.60 - 1.30) - NORMAL
- eGFR: 104 mL/min/1.73m2              (Ref: > 90) - NORMAL
- Sodium: 139 mEq/L                    (Ref: 136 - 145) - NORMAL
- Potassium: 4.1 mEq/L                 (Ref: 3.5 - 5.1) - NORMAL

CLINICAL IMPRESSION:
Borderline hypercholesterolemia with elevated low-density lipoprotein cholesterol (LDL-C). Patient exhibits normal renal and hepatic indicators. Glucose control lies in the healthy reference threshold. Recommended dietary shifts including fiber upregulation, saturated fat restriction, and moderate aerobic conditioning.`
  },
  {
    id: "rec-2",
    title: "12-Lead Electrocardiogram (ECG)",
    category: "Imaging",
    date: "2026-07-08",
    doctorName: "Dr. Sarah Jenkins",
    notes: "ECG shows sinus rhythm with no ST-segment or T-wave abnormalities. PR and QTc intervals fall well within normal physiological thresholds.",
    contentRaw: `CARDIAC CLINICAL EVALUATION REPORT
HEALTHCARE SYSTEM HEART & VASCULAR CLINIC
PATIENT NAME: ALEX MERCER | DATE: JULY 8, 2026

ECG INTERPRETATION REPORT:
- Heart Rate: 68 BPM
- Rhythm: Normal Sinus Rhythm (NSR)
- P Wave: Normal duration and morphology
- PR Interval: 152 ms (Normal range: 120 - 200 ms)
- QRS Complex: 92 ms (Normal range: 80 - 120 ms)
- QT Interval: 395 ms
- QTc (corrected): 421 ms (Normal range: < 450 ms)
- Axis: Normal axis (+45 degrees)
- ST Segment: Isoelectric. No acute elevations or depressions.
- T Wave: Normal orientation and amplitude. No inversions.

DIAGNOSTIC CONCLUSION:
1. Normal Sinus Rhythm at 68 bpm.
2. Normative cardiac axis and physiological conduction intervals.
3. No diagnostic ECG evidence of myocardial ischemia, ventricular hypertrophy, or cardiac strain patterns.

SIGNED: DR. SARAH JENKINS, FACC`
  }
];
