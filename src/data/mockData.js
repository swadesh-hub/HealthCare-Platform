// Mock data for the AI-Powered Healthcare Assistant & Hospital Recommendation System

export const REGIONAL_LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
];

export const SYMPTOM_DECISION_TREE = {
  en: {
    chest_pain: {
      question: "Is the chest pain accompanied by shortness of breath, sweating, or pain radiating to your left arm/jaw?",
      options: [
        { label: "Yes, definitely", next: "chest_pain_severe" },
        { label: "No, it is a dull ache / burning sensation", next: "chest_pain_mild" }
      ]
    },
    chest_pain_severe: {
      triageLevel: "EMERGENCY",
      recommendation: "Seek immediate emergency medical care. Call 911/112 or go to the nearest emergency room immediately.",
      conditions: [
        { name: "Acute Coronary Syndrome / Myocardial Infarction", probability: 85 },
        { name: "Pulmonary Embolism", probability: 10 }
      ],
      specialty: "Cardiology"
    },
    chest_pain_mild: {
      triageLevel: "GP_VISIT",
      recommendation: "Schedule an appointment with a General Practitioner or Cardiologist within the next 24-48 hours.",
      conditions: [
        { name: "Gastroesophageal Reflux Disease (GERD)", probability: 60 },
        { name: "Costochondritis (rib joint inflammation)", probability: 25 },
        { name: "Stable Angina", probability: 15 }
      ],
      specialty: "Gastroenterology"
    },
    fever: {
      question: "How long have you had the fever and what is your approximate temperature?",
      options: [
        { label: "Above 103°F (39.4°C) OR lasted more than 3 days", next: "fever_high" },
        { label: "Below 102°F (38.9°C) and just started recently", next: "fever_low" }
      ]
    },
    fever_high: {
      triageLevel: "GP_VISIT",
      recommendation: "Consult a General Practitioner. Consider checking for local endemic infections like Dengue, Malaria, or Typhoid.",
      conditions: [
        { name: "Infectious Mononucleosis or Severe Influenza", probability: 50 },
        { name: "Dengue Fever / Malaria", probability: 35 },
        { name: "Bacterial Infection (UTI, Pneumonia)", probability: 15 }
      ],
      specialty: "Internal Medicine"
    },
    fever_low: {
      triageLevel: "SELF_CARE",
      recommendation: "Rest, stay hydrated, and take over-the-counter antipyretics like Acetaminophen/Paracetamol. Monitor temperature.",
      conditions: [
        { name: "Common Cold / Viral Syndrome", probability: 75 },
        { name: "Mild Influenza", probability: 20 }
      ],
      specialty: "General Physician"
    },
    cough_difficulty_breathing: {
      question: "Are you experiencing wheezing, blue lips, or are you struggling to catch your breath even while resting?",
      options: [
        { label: "Yes, I am struggling to breathe", next: "cough_severe" },
        { label: "No, just persistent cough and mild congestion", next: "cough_mild" }
      ]
    },
    cough_severe: {
      triageLevel: "EMERGENCY",
      recommendation: "Seek emergency treatment. High risk of severe respiratory distress.",
      conditions: [
        { name: "Acute Asthma Exacerbation", probability: 55 },
        { name: "Severe Pneumonia", probability: 30 },
        { name: "Acute Bronchitis", probability: 15 }
      ],
      specialty: "Pulmonology"
    },
    cough_mild: {
      triageLevel: "SELF_CARE",
      recommendation: "Use a humidifier, stay hydrated, avoid irritants, and take cough suppressants if needed. Consult GP if it persists > 10 days.",
      conditions: [
        { name: "Viral Upper Respiratory Infection", probability: 70 },
        { name: "Allergic Rhinitis / Post-nasal drip", probability: 25 }
      ],
      specialty: "Pulmonology"
    }
  },
  hi: {
    chest_pain: {
      question: "क्या छाती में दर्द के साथ सांस फूलना, पसीना आना या दर्द बाएं हाथ/जबड़े तक जा रहा है?",
      options: [
        { label: "हाँ, बिल्कुल", next: "chest_pain_severe" },
        { label: "नहीं, यह हल्का दर्द / जलन है", next: "chest_pain_mild" }
      ]
    },
    chest_pain_severe: {
      triageLevel: "EMERGENCY",
      recommendation: "तत्काल आपातकालीन चिकित्सा सहायता लें। नजदीकी अस्पताल के इमरजेंसी वार्ड में जाएं।",
      conditions: [
        { name: "एक्यूट कोरोनरी सिंड्रोम / दिल का दौरा (Heart Attack)", probability: 85 },
        { name: "पल्मोनरी एम्बोलिज्म", probability: 10 }
      ],
      specialty: "Cardiology"
    },
    chest_pain_mild: {
      triageLevel: "GP_VISIT",
      recommendation: "अगले 24-48 घंटों के भीतर किसी सामान्य चिकित्सक (GP) या हृदय रोग विशेषज्ञ से मिलें।",
      conditions: [
        { name: "गैस्ट्रोएसोफेगल रिफ्लक्स डिजीज (एसिडिटी)", probability: 60 },
        { name: "पसलियों में सूजन (Costochondritis)", probability: 25 }
      ],
      specialty: "Gastroenterology"
    }
  }
};

export const HOSPITALS = [
  {
    id: "hosp-01",
    name: "Metro Cardiac & General Hospital",
    specialties: ["Cardiology", "General Medicine", "Emergency Medicine", "Gastroenterology"],
    distance: 1.8, // in km
    liveBeds: { total: 120, ICU: 5, general: 18 },
    rating: 4.8,
    reviewsCount: 1420,
    avgWaitTime: 12, // in mins
    insuranceCovered: ["Star Health", "HDFC Ergo", "Max Bupa", "State Health Scheme"],
    lat: 12.9716,
    lng: 77.5946,
    address: "7th Main Road, Sector 3, HSR Layout",
    contact: "+91 80 4991 2233",
    erWaitPrediction: "10-15 mins (Low Traffic)",
    doctors: [
      { id: "doc-01", name: "Dr. Arvind Swaminathan", specialty: "Cardiology", experience: 18, rating: 4.9, consultationFee: 800, availability: ["09:00 AM", "11:30 AM", "03:00 PM", "04:30 PM"] },
      { id: "doc-02", name: "Dr. Priyamvada Sen", specialty: "Gastroenterology", experience: 12, rating: 4.7, consultationFee: 600, availability: ["10:00 AM", "02:00 PM", "05:00 PM"] }
    ]
  },
  {
    id: "hosp-02",
    name: "Apex Pulmonology and Multi-Specialty Centre",
    specialties: ["Pulmonology", "Internal Medicine", "Pediatrics", "Emergency Medicine"],
    distance: 3.4,
    liveBeds: { total: 85, ICU: 2, general: 11 },
    rating: 4.5,
    reviewsCount: 890,
    avgWaitTime: 28,
    insuranceCovered: ["HDFC Ergo", "ICICI Lombard", "Care Health"],
    lat: 12.9654,
    lng: 77.6085,
    address: "12th Cross, Indiranagar Double Road",
    contact: "+91 80 2525 9988",
    erWaitPrediction: "25-30 mins (Moderate)",
    doctors: [
      { id: "doc-03", name: "Dr. Rajesh K. Mehta", specialty: "Pulmonology", experience: 20, rating: 4.8, consultationFee: 900, availability: ["09:30 AM", "12:00 PM", "04:00 PM"] },
      { id: "doc-04", name: "Dr. Sneha Patil", specialty: "Internal Medicine", experience: 8, rating: 4.6, consultationFee: 500, availability: ["10:30 AM", "11:45 AM", "02:30 PM", "06:00 PM"] }
    ]
  },
  {
    id: "hosp-03",
    name: "City Care Family Hospital",
    specialties: ["General Medicine", "Pediatrics", "Gastroenterology"],
    distance: 0.9,
    liveBeds: { total: 40, ICU: 0, general: 6 },
    rating: 4.2,
    reviewsCount: 340,
    avgWaitTime: 8,
    insuranceCovered: ["Star Health", "LIC Healthcare", "Care Health"],
    lat: 12.9812,
    lng: 77.5899,
    address: "45, Residency Road, Shanthala Nagar",
    contact: "+91 80 2221 4455",
    erWaitPrediction: "5-10 mins (Very Low)",
    doctors: [
      { id: "doc-05", name: "Dr. Vikram Sethi", specialty: "General Medicine", experience: 15, rating: 4.4, consultationFee: 400, availability: ["08:30 AM", "10:30 AM", "01:00 PM", "06:30 PM"] }
    ]
  },
  {
    id: "hosp-04",
    name: "Narayana Health City",
    specialties: ["Cardiology", "Pulmonology", "Gastroenterology", "Oncology", "Neurology", "Emergency Medicine"],
    distance: 8.5,
    liveBeds: { total: 450, ICU: 24, general: 75 },
    rating: 4.9,
    reviewsCount: 4850,
    avgWaitTime: 45,
    insuranceCovered: ["Star Health", "HDFC Ergo", "Max Bupa", "ICICI Lombard", "Care Health", "LIC Healthcare"],
    lat: 12.9221,
    lng: 77.6804,
    address: "258/A, Bommasandra Industrial Area, Anekal Taluk",
    contact: "+91 80 6750 6750",
    erWaitPrediction: "40-50 mins (High Traffic)",
    doctors: [
      { id: "doc-06", name: "Dr. Devi Prasad Shetty", specialty: "Cardiology", experience: 35, rating: 5.0, consultationFee: 1200, availability: ["11:00 AM", "01:00 PM", "03:30 PM"] },
      { id: "doc-07", name: "Dr. Sandeep Alva", specialty: "Neurology", experience: 22, rating: 4.8, consultationFee: 1000, availability: ["10:00 AM", "02:30 PM", "04:45 PM"] }
    ]
  }
];

export const INITIAL_USER_PROFILE = {
  name: "Amit Sharma",
  age: 48,
  gender: "Male",
  bloodGroup: "B+",
  emergencyContact: "Ritu Sharma (Spouse) - +91 98860 12345",
  insurance: {
    provider: "Star Health",
    policyNo: "SH-8829-19283",
    validTill: "2027-12-31"
  },
  vitals: {
    systolicBP: 134,
    diastolicBP: 85,
    heartRate: 72,
    bloodSugarFasting: 112,
    bloodSugarPP: 154,
    spO2: 98,
    weight: 78, // in kg
    height: 172 // in cm
  },
  history: [
    { id: "rec-01", date: "2026-03-15", type: "Lab Report", title: "Lipid Profile & HbA1c", doctor: "Dr. Vikram Sethi", facility: "City Care Lab", summary: "Borderline High LDL (135 mg/dL) and pre-diabetic HbA1c (6.1%). Recommends diet modification." },
    { id: "rec-02", date: "2025-11-20", type: "Prescription", title: "Acute Bronchitis Treatment", doctor: "Dr. Rajesh K. Mehta", facility: "Apex Pulmonology", summary: "Prescribed Azithromycin, Levocetirizine, Cough Syrup. Follow-up after 5 days. Resolved." }
  ]
};

export const MOCK_REPORTS = {
  lipid_hba1c: {
    fileName: "lipid_profile_hba1c_june_2026.pdf",
    date: "2026-06-11",
    extractedData: {
      patientName: "Amit Sharma",
      age: 48,
      date: "11-Jun-2026",
      markers: [
        { name: "HbA1c (Glycated Hemoglobin)", value: 6.3, unit: "%", reference: "4.0 - 5.6 (Normal), 5.7 - 6.4 (Prediabetes), >= 6.5 (Diabetic)", status: "Abnormal", interpretation: "Borderline high. You are in the prediabetic range, which indicates a moderate risk of developing type 2 diabetes. Immediate lifestyle improvements are advised." },
        { name: "Total Cholesterol", value: 228, unit: "mg/dL", reference: "< 200 (Desirable), 200-239 (Borderline), >= 240 (High)", status: "Abnormal", interpretation: "Slightly elevated. Can contribute to plaque build-up in arteries." },
        { name: "LDL Cholesterol (Bad)", value: 142, unit: "mg/dL", reference: "< 100 (Optimal), 100-129 (Near Optimal), 130-159 (Borderline High)", status: "Abnormal", interpretation: "Elevated. Focus on reducing saturated fats and increasing soluble fiber." },
        { name: "HDL Cholesterol (Good)", value: 41, unit: "mg/dL", reference: "> 40 (Acceptable), > 50 (Optimal)", status: "Normal", interpretation: "Within normal limits but on the lower side. Exercise can help raise this." },
        { name: "Triglycerides", value: 185, unit: "mg/dL", reference: "< 150 (Normal), 150-199 (Borderline High)", status: "Abnormal", interpretation: "Mildly elevated, often correlated with carbohydrate intake and lifestyle factors." }
      ]
    },
    trends: [
      { date: "2025-06-10", hba1c: 5.9, ldl: 128, totalChol: 210 },
      { date: "2026-03-15", hba1c: 6.1, ldl: 135, totalChol: 218 },
      { date: "2026-06-11", hba1c: 6.3, ldl: 142, totalChol: 228 }
    ],
    followUpQuestions: [
      "Given my pre-diabetic HbA1c (6.3%) and rising LDL (142 mg/dL), should I start medications or try strict diet modifications for 3 months first?",
      "Would a referral to a certified dietician be helpful for managing my cholesterol and blood sugar?",
      "Do I need to check my kidney or liver function tests before starting any cholesterol-lowering medication?",
      "How frequently should I repeat these blood tests?"
    ]
  }
};
