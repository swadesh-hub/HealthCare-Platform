import http from 'http';

const PORT = 3001;

// Multi-language medical translations
const TRANSLATIONS = {
  en: {
    emergency: "EMERGENCY ALERT: Seek immediate medical care. Call emergency services (911/112) or head to the nearest ER.",
    gp_visit: "RECOMMENDATION: Schedule an appointment with a General Practitioner or specialist within 24-48 hours.",
    self_care: "RECOMMENDATION: Rest, stay hydrated, and monitor vitals. Take over-the-counter medication if appropriate.",
    symptoms_triage: "Symptom Triage Report",
    conditions: "Possible Conditions",
    hospitals_found: "Hospitals Found",
    booking_success: "Appointment Confirmed successfully!",
    report_title: "Lab Report Summary",
    report_normal: "Normal",
    report_abnormal: "Abnormal / Action Recommended"
  },
  hi: {
    emergency: "आपातकालीन चेतावनी: तत्काल चिकित्सा सहायता लें। आपातकालीन सेवाओं (112) को कॉल करें या निकटतम आपातकालीन कक्ष में जाएं।",
    gp_visit: "सुझाव: अगले 24-48 घंटों के भीतर किसी सामान्य चिकित्सक या विशेषज्ञ के साथ अपॉइंटमेंट बुक करें।",
    self_care: "सुझाव: आराम करें, हाइड्रेटेड रहें और लक्षणों की निगरानी करें। आवश्यकतानुसार दवा लें।",
    symptoms_triage: "लक्षण जांच रिपोर्ट",
    conditions: "संभावित स्वास्थ्य स्थितियां",
    hospitals_found: "पाए गए अस्पताल",
    booking_success: "अपॉइंटमेंट सफलतापूर्वक बुक हो गया है!",
    report_title: "लैब रिपोर्ट सारांश",
    report_normal: "सामान्य",
    report_abnormal: "असामान्य / ध्यान देने योग्य"
  },
  ta: {
    emergency: "அவசரகால எச்சரிக்கை: உடனடியாக அவசர சிகிச்சை பெறவும். 112 ஐ அழைக்கவும் அல்லது அருகில் உள்ள அவசர சிகிச்சைப் பிரிவுக்குச் செல்லவும்.",
    gp_visit: "பரிந்துரை: அடுத்த 24-48 மணி நேரத்திற்குள் ஒரு பொது மருத்துவர் அல்லது நிபுணரை அணுகவும்.",
    self_care: "பரிந்துரை: ஓய்வெடுங்கள், போதுமான அளவு தண்ணீர் குடிக்கவும், அறிகுறிகளைக் கண்காணிக்கவும்.",
    symptoms_triage: "அறிகுறி பகுப்பாய்வு அறிக்கை",
    conditions: "சாத்தியமான உடல்நலப் பிரச்சினைகள்",
    hospitals_found: "கண்டறியப்பட்ட மருத்துவமனைகள்",
    booking_success: "முன்பதிவு வெற்றிகரமாக உறுதி செய்யப்பட்டது!",
    report_title: "ஆய்வக அறிக்கை சுருக்கம்",
    report_normal: "சாதாரண அளவு",
    report_abnormal: "அசாதாரண அளவு / உடனே கவனிக்கவும்"
  },
  bn: {
    emergency: "জরুরী সতর্কতা: অবিলম্বে চিকিৎসকের পরামর্শ নিন। ১১২ নম্বরে কল করুন অথবা নিকটস্থ হাসপাতালের জরুরী বিভাগে যান।",
    gp_visit: "পরামর্শ: পরবর্তী ২৪-৪৮ ঘণ্টার মধ্যে একজন জেনারেল ফিজিশিয়ান বা বিশেষজ্ঞের সাথে অ্যাপয়েন্টমেন্ট করুন।",
    self_care: "পরামর্শ: বিশ্রাম নিন, পর্যাপ্ত জল পান করুন এবং শরীরের তাপমাত্রা বা উপসর্গগুলি পর্যবেক্ষণ করুন।",
    symptoms_triage: "উপসর্গ মূল্যায়ন রিপোর্ট",
    conditions: "সম্ভাব্য রোগসমূহ",
    hospitals_found: "খোঁজ পাওয়া হাসপাতাল",
    booking_success: "অ্যাপয়েন্টমেন্ট সফলভাবে নিশ্চিত করা হয়েছে!",
    report_title: "ল্যাব রিপোর্টের সংক্ষিপ্তসার",
    report_normal: "স্বাভাবিক",
    report_abnormal: "অস্বাভাবিক / পরামর্শ প্রয়োজন"
  },
  te: {
    emergency: "అత్యవసర హెచ్చరిక: వెంటనే వైద్య సహాయం పొందండి. 112 కి కాల్ చేయండి లేదా సమీప అత్యవసర విభాగానికి వెళ్ళండి.",
    gp_visit: "సిఫార్సు: రాబోయే 24-48 గంటల్లో జనరల్ ఫిజీషియన్ లేదా స్పెషలిస్ట్‌ను సంప్రదించండి.",
    self_care: "సిఫార్సు: విశ్రాంతి తీసుకోండి, పుష్కలంగా నీరు త్రాగండి మరియు లక్షణాలను గమనించండి.",
    symptoms_triage: "లక్షణాల నివేదిక",
    conditions: "అవకాశం ఉన్న ఆరోగ్య సమస్యలు",
    hospitals_found: "లభ్యమైన ఆసుపత్రులు",
    booking_success: "అపాయింట్‌మెంట్ విజయవంతంగా ఖరారైంది!",
    report_title: "ల్యాబ్ రిపోర్ట్ సారాంశం",
    report_normal: "సాధారణం",
    report_abnormal: "అసాధారణం / తగిన జాగ్రత్తలు అవసరం"
  },
  mr: {
    emergency: "अतितातडीची चेतावणी: त्वरित वैद्यकीय मदत घ्या. ११२ वर कॉल करा किंवा जवळच्या आपत्कालीन कक्षात जा.",
    gp_visit: "शिफारस: पुढील २४-४८ तासांत सामान्य डॉक्टर किंवा तज्ञांशी संपर्क साधा.",
    self_care: "शिफारस: विश्रांती घ्या, भरपूर पाणी प्या आणि लक्षणांवर लक्ष ठेवा.",
    symptoms_triage: "लक्षणे विश्लेषण अहवाल",
    conditions: "संभाव्य आजार",
    hospitals_found: "शोधलेले रुग्णालय",
    booking_success: "अपॉइंटमेंट यशस्वीरीत्या बुक झाली आहे!",
    report_title: "लॅब रिपोर्टचा गोषवारा",
    report_normal: "सामान्य",
    report_abnormal: "असामान्य / डॉक्टरांचा सल्ला आवश्यक"
  }
};

// Medical Datasets
const MEDICAL_KNOWLEDGE = {
  chest_pain: {
    specialty: "Cardiology",
    conditions: {
      en: [
        { name: "Acute Coronary Syndrome", prob: "85%" },
        { name: "Pulmonary Embolism", prob: "10%" },
        { name: "GERD (Acid Reflux)", prob: "5%" }
      ],
      hi: [
        { name: "एक्यूट कोरोनरी सिंड्रोम (हार्ट अटैक)", prob: "85%" },
        { name: "पल्मोनरी एम्बोलिज्म (फेफड़ों की नस में थक्का)", prob: "10%" },
        { name: "एसिडिटी (GERD)", prob: "5%" }
      ],
      bn: [
        { name: "অ্যাকিউট করোনারি সিন্ড্রোম (হার্ট অ্যাটাক)", prob: "৮৫%" },
        { name: "পালমোনারি এমবোলিজম", prob: "১০%" },
        { name: "অ্যাসিডিটি (GERD)", prob: "৫%" }
      ],
      ta: [
        { name: "அக்யூட் கரோனரி சிண்ட்ரோம் (மாரடைப்பு)", prob: "85%" },
        { name: "நுரையீரல் இரத்த உறைவு", prob: "10%" },
        { name: "நெஞ்செரிச்சல் / அசிடிட்டி", prob: "5%" }
      ]
    },
    triage: "emergency"
  },
  fever: {
    specialty: "Internal Medicine",
    conditions: {
      en: [
        { name: "Viral Infection (Flu/Influenza)", prob: "60%" },
        { name: "Endemic Infection (Dengue/Malaria)", prob: "30%" },
        { name: "Bacterial Infection (UTI/Strep)", prob: "10%" }
      ],
      hi: [
        { name: "वायरल बुखार (फ्लू)", prob: "60%" },
        { name: "स्थानीय संक्रमण (डेंगू / मलेरिया)", prob: "30%" },
        { name: "बैक्टीरियल संक्रमण (UTI)", prob: "10%" }
      ],
      bn: [
        { name: "ভাইরাল ইনফেকশন (ফ্লু)", prob: "৬০%" },
        { name: "ডেঙ্গু / ম্যালেরিয়া", prob: "৩০%" },
        { name: "ব্যাকটেরিয়াল ইনফেকশন", prob: "১০%" }
      ],
      ta: [
        { name: "வைரஸ் காய்ச்சல்", prob: "60%" },
        { name: "டெங்கு / மலேரியா", prob: "30%" },
        { name: "பாக்டீரியா தொற்று", prob: "10%" }
      ]
    },
    triage: "gp_visit"
  },
  cough_difficulty_breathing: {
    specialty: "Pulmonology",
    conditions: {
      en: [
        { name: "Bronchial Asthma / COPD Exacerbation", prob: "50%" },
        { name: "Severe Pneumonia", prob: "35%" },
        { name: "Acute Bronchitis", prob: "15%" }
      ],
      hi: [
        { name: "अस्थमा / दमा का दौरा", prob: "50%" },
        { name: "गंभीर निमोनिया", prob: "35%" },
        { name: "एक्यूट ब्रोंकाइटिस (श्वसन नली की सूजन)", prob: "15%" }
      ],
      bn: [
        { name: "অ্যাজমা / হাঁপানির সমস্যা", prob: "৫০%" },
        { name: "তীব্র নিউমোনিয়া", prob: "৩৫%" },
        { name: "ব্রঙ্কাইটিস", prob: "১৫%" }
      ],
      ta: [
        { name: "ஆஸ்துமா / மூச்சுக்குழாய் அழற்சி", prob: "50%" },
        { name: "கடுமையான நிமோனியா", prob: "35%" },
        { name: "மூச்சுக்குழாய் அழற்சி (Bronchitis)", prob: "15%" }
      ]
    },
    triage: "emergency"
  }
};

const HOSPITALS = [
  {
    id: "hosp-01",
    name: "Metro Cardiac & General Hospital",
    specialties: ["Cardiology", "General Medicine", "Emergency Medicine", "Gastroenterology"],
    distance: 1.8,
    liveBeds: { total: 120, ICU: 5, general: 18 },
    rating: 4.8,
    reviewsCount: 1420,
    avgWaitTime: 12,
    address: "7th Main Road, Sector 3, HSR Layout",
    contact: "+91 80 4991 2233",
    doctors: [
      { id: "doc-01", name: "Dr. Arvind Swaminathan", specialty: "Cardiology", experience: 18, consultationFee: 800, availability: ["09:00 AM", "11:30 AM", "03:00 PM"] },
      { id: "doc-02", name: "Dr. Priyamvada Sen", specialty: "Gastroenterology", experience: 12, consultationFee: 600, availability: ["10:00 AM", "02:00 PM"] }
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
    address: "12th Cross, Indiranagar Double Road",
    contact: "+91 80 2525 9988",
    doctors: [
      { id: "doc-03", name: "Dr. Rajesh K. Mehta", specialty: "Pulmonology", experience: 20, consultationFee: 900, availability: ["09:30 AM", "12:00 PM", "04:00 PM"] },
      { id: "doc-04", name: "Dr. Sneha Patil", specialty: "Internal Medicine", experience: 8, consultationFee: 500, availability: ["10:30 AM", "11:45 AM"] }
    ]
  }
];

const PATIENT_PROFILE = {
  id: "amit-sharma",
  name: "Amit Sharma",
  age: 48,
  gender: "Male",
  bloodGroup: "B+",
  emergencyContact: "Ritu Sharma (Spouse) - +91 98860 12345",
  vitals: {
    systolicBP: 134,
    diastolicBP: 85,
    heartRate: 72,
    bloodSugarFasting: 112,
    bloodSugarPP: 154,
    spO2: 98,
    weight: 78,
    height: 172
  },
  history: [
    { id: "rec-01", date: "2026-03-15", type: "Lab Report", title: "Lipid Profile & HbA1c", doctor: "Dr. Vikram Sethi", facility: "City Care Lab", summary: "Borderline High LDL (135 mg/dL) and pre-diabetic HbA1c (6.1%)." }
  ]
};

const MEDICAL_REPORTS = {
  lipid_hba1c: {
    fileName: "lipid_profile_hba1c_june_2026.pdf",
    date: "2026-06-11",
    extractedData: {
      patientName: "Amit Sharma",
      age: 48,
      date: "11-Jun-2026",
      markers: [
        { name: "HbA1c (Glycated Hemoglobin)", value: 6.3, unit: "%", reference: "4.0 - 5.6 (Normal), 5.7 - 6.4 (Prediabetes), >= 6.5 (Diabetic)", status: "Abnormal", interpretation: { en: "Borderline high. You are in the prediabetic range.", hi: "सीमा रेखा से अधिक। आप प्री-डायबिटिक रेंज में हैं।" } },
        { name: "Total Cholesterol", value: 228, unit: "mg/dL", reference: "< 200 (Desirable)", status: "Abnormal", interpretation: { en: "Slightly elevated. Can contribute to plaque build-up.", hi: "थोड़ा बढ़ा हुआ। धमनियों में रुकावट पैदा कर सकता है।" } },
        { name: "LDL Cholesterol (Bad)", value: 142, unit: "mg/dL", reference: "< 100 (Optimal)", status: "Abnormal", interpretation: { en: "Elevated. Reduce fats, increase fiber.", hi: "बढ़ा हुआ। वसा कम करें, फाइबर बढ़ाएं।" } }
      ]
    }
  }
};

const APPOINTMENTS = [];
const REMINDERS = [
  { id: 1, name: "Atorvastatin (10mg) - Cholesterol", time: "09:00 PM Daily", active: true },
  { id: 2, name: "Metformin (500mg) - Blood Sugar", time: "08:00 AM & 08:00 PM Daily", active: true }
];

// Active SSE clients list
let sseClients = [];

// Helper to write JSON response
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
};

// Handle OPTIONS (CORS preflight)
const handleOptions = (res) => {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  res.end();
};

// JSON-RPC Handlers
const handleJSONRPC = (body) => {
  const { jsonrpc, method, params, id } = body;
  if (jsonrpc !== '2.0') {
    return { jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id };
  }

  // Log incoming request to stdout
  console.log(`[MCP Server] JSON-RPC request received: ${method} (id=${id})`);

  // Broadcast to all SSE clients so the developer console updates live!
  broadcastToSSE({
    type: 'log',
    direction: 'in',
    timestamp: new Date().toISOString(),
    message: `Received request: ${method}`,
    payload: body
  });

  let result = null;
  let error = null;

  try {
    switch (method) {
      case 'initialize':
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {},
            prompts: {}
          },
          serverInfo: {
            name: 'healio-mcp-server',
            version: '1.0.0'
          }
        };
        break;

      case 'tools/list':
        result = {
          tools: [
            {
              name: 'get_patient_vitals',
              description: 'Retrieve latest vitals and background info for the patient.',
              inputSchema: {
                type: 'object',
                properties: {
                  patientId: { type: 'string', description: 'Unique identifier of the patient, e.g., amit-sharma' }
                },
                required: ['patientId']
              }
            },
            {
              name: 'check_symptoms',
              description: 'Perform symptom checks and return localized medical advice, triage level, and possible conditions.',
              inputSchema: {
                type: 'object',
                properties: {
                  symptomKey: { type: 'string', enum: ['chest_pain', 'fever', 'cough_difficulty_breathing'], description: 'Primary symptom identifier' },
                  language: { type: 'string', description: 'Desired response language: en, hi, ta, bn, te, mr. Default is en.' }
                },
                required: ['symptomKey']
              }
            },
            {
              name: 'find_hospitals',
              description: 'Search for clinics or multi-specialty hospitals near the patient.',
              inputSchema: {
                type: 'object',
                properties: {
                  specialty: { type: 'string', description: 'Medical specialty, e.g., Cardiology, Pulmonology, Gastroenterology' },
                  maxDistance: { type: 'number', description: 'Max search radius in kilometers. Defaults to 5.' },
                  language: { type: 'string', description: 'Language of output names: en, hi, ta' }
                },
                required: ['specialty']
              }
            },
            {
              name: 'book_appointment',
              description: 'Schedule a doctor appointment at a hospital.',
              inputSchema: {
                type: 'object',
                properties: {
                  hospitalId: { type: 'string', description: 'Hospital identifier' },
                  doctorId: { type: 'string', description: 'Doctor identifier' },
                  timeSlot: { type: 'string', description: 'Time of consultation, e.g., 09:00 AM' },
                  patientName: { type: 'string', description: 'Name of the patient booking the consultation' }
                },
                required: ['hospitalId', 'doctorId', 'timeSlot', 'patientName']
              }
            },
            {
              name: 'interpret_report',
              description: 'Analyze biological reports and translate jargon into plain layperson terms.',
              inputSchema: {
                type: 'object',
                properties: {
                  reportKey: { type: 'string', description: 'Identifier of the report, e.g., lipid_hba1c' },
                  language: { type: 'string', description: 'Output translation code, e.g., en, hi' }
                },
                required: ['reportKey']
              }
            },
            {
              name: 'add_medication_reminder',
              description: 'Schedule a new daily medication reminder alert.',
              inputSchema: {
                type: 'object',
                properties: {
                  name: { type: 'string', description: 'Medication name and dosage, e.g., Aspirin 75mg' },
                  time: { type: 'string', description: 'Time frequency, e.g., 08:00 AM Daily' }
                },
                required: ['name', 'time']
              }
            }
          ]
        };
        break;

      case 'tools/call': {
        const { name: toolName, arguments: args = {} } = params;
        const lang = args.language || 'en';
        const trans = TRANSLATIONS[lang] || TRANSLATIONS.en;

        if (toolName === 'get_patient_vitals') {
          if (args.patientId === 'amit-sharma') {
            result = {
              content: [
                {
                  type: 'text',
                  text: `Vitals for Amit Sharma (48M):\n- Blood Pressure: ${PATIENT_PROFILE.vitals.systolicBP}/${PATIENT_PROFILE.vitals.diastolicBP} mmHg\n- Fasting Blood Glucose: ${PATIENT_PROFILE.vitals.bloodSugarFasting} mg/dL\n- SpO2: ${PATIENT_PROFILE.vitals.spO2}%\n- Heart Rate: ${PATIENT_PROFILE.vitals.heartRate} bpm\n- Blood Group: ${PATIENT_PROFILE.bloodGroup}\n- Medical History: HbA1c of 6.1% in March 2026.`
                }
              ],
              data: PATIENT_PROFILE
            };
          } else {
            error = { code: -32602, message: `Patient profile '${args.patientId}' not found.` };
          }
        } else if (toolName === 'check_symptoms') {
          const symptom = MEDICAL_KNOWLEDGE[args.symptomKey];
          if (symptom) {
            const triageMsg = trans[symptom.triage] || symptom.triage;
            const conditionsList = symptom.conditions[lang] || symptom.conditions.en;
            const conditionsStr = conditionsList.map(c => `  - ${c.name} (${c.prob})`).join('\n');

            result = {
              content: [
                {
                  type: 'text',
                  text: `*** ${trans.symptoms_triage} ***\n\n${triageMsg}\n\n${trans.conditions}:\n${conditionsStr}\n\nRecommended Specialty: ${symptom.specialty}`
                }
              ],
              data: {
                triageLevel: symptom.triage.toUpperCase(),
                specialty: symptom.specialty,
                conditions: conditionsList
              }
            };
          } else {
            error = { code: -32602, message: `Symptom key '${args.symptomKey}' not found.` };
          }
        } else if (toolName === 'find_hospitals') {
          const spec = args.specialty.toLowerCase();
          const limit = args.maxDistance || 5;

          const matched = HOSPITALS.filter(h => 
            h.distance <= limit && 
            h.specialties.some(s => s.toLowerCase() === spec)
          );

          if (matched.length > 0) {
            const listStr = matched.map(h => 
              `- ${h.name} (${h.distance} km away)\n  Wait Time: ${h.avgWaitTime} mins | Rating: ${h.rating}\n  Address: ${h.address}`
            ).join('\n\n');

            result = {
              content: [
                {
                  type: 'text',
                  text: `*** ${trans.hospitals_found} (${args.specialty}) ***\n\n${listStr}`
                }
              ],
              data: matched
            };
          } else {
            result = {
              content: [
                {
                  type: 'text',
                  text: `No hospitals matching specialty "${args.specialty}" within ${limit} km.`
                }
              ],
              data: []
            };
          }
        } else if (toolName === 'book_appointment') {
          const newAppt = {
            id: `appt-${Date.now()}`,
            hospitalId: args.hospitalId,
            doctorId: args.doctorId,
            timeSlot: args.timeSlot,
            patientName: args.patientName,
            status: 'Confirmed',
            date: new Date().toISOString().split('T')[0]
          };
          APPOINTMENTS.push(newAppt);

          // Find Doctor/Hospital Names
          const hospital = HOSPITALS.find(h => h.id === args.hospitalId);
          const doctor = hospital ? hospital.doctors.find(d => d.id === args.doctorId) : null;
          const docName = doctor ? doctor.name : args.doctorId;
          const hospName = hospital ? hospital.name : args.hospitalId;

          result = {
            content: [
              {
                type: 'text',
                text: `✅ ${trans.booking_success}\n\nDetails:\n- Hospital: ${hospName}\n- Doctor: ${docName}\n- Time Slot: ${args.timeSlot}\n- Date: ${newAppt.date}\n- Patient: ${args.patientName}\n- Reference ID: ${newAppt.id}`
              }
            ],
            data: newAppt
          };
        } else if (toolName === 'interpret_report') {
          const report = MEDICAL_REPORTS[args.reportKey];
          if (report) {
            const markersStr = report.extractedData.markers.map(m => {
              const interpretationText = m.interpretation[lang] || m.interpretation.en;
              return `- ${m.name}: ${m.value} ${m.unit} [${m.status}]\n  Interpretation: ${interpretationText}`;
            }).join('\n\n');

            result = {
              content: [
                {
                  type: 'text',
                  text: `*** ${trans.report_title}: ${report.fileName} ***\n\nDate: ${report.date}\nPatient: ${report.extractedData.patientName} (Age ${report.extractedData.age})\n\nMarkers Evaluated:\n${markersStr}`
                }
              ],
              data: report.extractedData
            };
          } else {
            error = { code: -32602, message: `Report '${args.reportKey}' not found.` };
          }
        } else if (toolName === 'add_medication_reminder') {
          const newRem = {
            id: REMINDERS.length + 1,
            name: args.name,
            time: args.time,
            active: true
          };
          REMINDERS.push(newRem);

          result = {
            content: [
              {
                type: 'text',
                text: `Reminder set: Take "${args.name}" at ${args.time}.`
              }
            ],
            data: newRem
          };
        } else {
          error = { code: -32601, message: `Tool '${toolName}' not supported.` };
        }
        break;
      }

      case 'resources/list':
        result = {
          resources: [
            {
              uri: 'healio://patients/amit-sharma/profile',
              name: 'Amit Sharma Profile Schema',
              description: 'Core metadata, medical record listing, and current vitals.',
              mimeType: 'application/json'
            },
            {
              uri: 'healio://reports/lipid_hba1c',
              name: 'Lipid Profile & HbA1c Lab Report June 2026',
              description: 'Detailed biomarker analysis for sugar, LDL, and cholesterol trends.',
              mimeType: 'application/json'
            },
            {
              uri: 'healio://hospitals/all',
              name: 'Healio Associated Hospitals Registry',
              description: 'List of all partner clinics, including live ICU bed counts and specialty indexes.',
              mimeType: 'application/json'
            }
          ]
        };
        break;

      case 'resources/read': {
        const { uri } = params;
        if (uri === 'healio://patients/amit-sharma/profile') {
          result = {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(PATIENT_PROFILE, null, 2)
              }
            ]
          };
        } else if (uri === 'healio://reports/lipid_hba1c') {
          result = {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(MEDICAL_REPORTS.lipid_hba1c, null, 2)
              }
            ]
          };
        } else if (uri === 'healio://hospitals/all') {
          result = {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(HOSPITALS, null, 2)
              }
            ]
          };
        } else {
          error = { code: -32602, message: `Resource URI '${uri}' not found.` };
        }
        break;
      }

      case 'prompts/list':
        result = {
          prompts: [
            {
              name: 'summarize-health',
              description: 'Generate an executive medical brief suitable for a newly matched cardiologist.',
              arguments: [
                {
                  name: 'detailLevel',
                  description: 'Brief or detailed analysis format.',
                  required: false
                }
              ]
            }
          ]
        };
        break;

      case 'prompts/get': {
        const { name: promptName, arguments: promptArgs = {} } = params;
        if (promptName === 'summarize-health') {
          const detail = promptArgs.detailLevel || 'brief';
          const detailsText = detail === 'detailed' 
            ? `Vitals Log:\n- Fasting Glucose: 112 mg/dL\n- Postprandial Glucose: 154 mg/dL\n- Heart Rate: 72 bpm\n\nRecent History:\n- Active reminders for Metformin and Atorvastatin.\n- Risk Profile: Borderline HbA1c (6.3%) indicates progression of prediabetes.`
            : `Fasting Blood Glucose is mildly elevated at 112 mg/dL. LDL is elevated at 142 mg/dL.`;

          result = {
            description: `Summarized health data for Amit Sharma (Age 48). Format: ${detail}.`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please generate a medical consultation brief for Amit Sharma (48, Male, B+ Blood Group).\n\n${detailsText}\n\nIdentify major concerns, key questions for the physician, and suggest potential therapeutic goals.`
                }
              }
            ]
          };
        } else {
          error = { code: -32601, message: `Prompt template '${promptName}' not found.` };
        }
        break;
      }

      default:
        error = { code: -32601, message: `Method '${method}' not found.` };
    }
  } catch (err) {
    error = { code: -32000, message: err.message };
  }

  const responsePayload = { jsonrpc: '2.0', id };
  if (error) {
    responsePayload.error = error;
  } else {
    responsePayload.result = result;
  }

  // Broadcast output log to SSE client
  broadcastToSSE({
    type: 'log',
    direction: 'out',
    timestamp: new Date().toISOString(),
    message: `Sending response for ${method}`,
    payload: responsePayload
  });

  return responsePayload;
};

// SSE Broadcasting
const broadcastToSSE = (msg) => {
  sseClients.forEach(client => {
    client.write(`event: message\ndata: ${JSON.stringify(msg)}\n\n`);
  });
};

// Main Server Request Router
const server = http.createServer((req, res) => {
  // CORS check
  if (req.method === 'OPTIONS') {
    handleOptions(res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/sse') {
    // Establish SSE Connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    // Send the absolute endpoint link where requests must be POSTed
    const host = req.headers.host || `localhost:${PORT}`;
    const endpoint = `http://${host}/api/mcp`;
    
    res.write(`event: endpoint\ndata: ${endpoint}\n\n`);
    console.log(`[MCP Server] SSE client connected. Target endpoint: ${endpoint}`);

    // Register SSE connection
    sseClients.push(res);

    req.on('close', () => {
      console.log(`[MCP Server] SSE client disconnected`);
      sseClients = sseClients.filter(c => c !== res);
    });

  } else if (url.pathname === '/api/mcp' && req.method === 'POST') {
    // Parse POST JSON-RPC Request body
    let bodyStr = '';
    req.on('data', chunk => {
      bodyStr += chunk;
    });

    req.on('end', () => {
      try {
        const bodyJSON = JSON.parse(bodyStr);
        const responseJSON = handleJSONRPC(bodyJSON);
        sendJSON(res, 200, responseJSON);
      } catch (err) {
        sendJSON(res, 400, {
          jsonrpc: '2.0',
          error: { code: -32700, message: 'Parse error' },
          id: null
        });
      }
    });

  } else {
    // 404 Route
    sendJSON(res, 404, { error: 'Not Found. Use /sse or POST /api/mcp' });
  }
});

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  Healio MCP Server running at:`);
  console.log(`  ➜ SSE Connection: http://localhost:${PORT}/sse`);
  console.log(`  ➜ POST RPC Node:  http://localhost:${PORT}/api/mcp`);
  console.log(`===============================================`);
});
