import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Sparkles, Activity, AlertTriangle, 
  MapPin, Phone, Star, Calendar, Clock, FileText, 
  CheckCircle, ArrowRight, Languages, RefreshCw, Info, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UI_TRANSLATIONS = {
  en: {
    welcome: "Hi, I am your Healio Patient Copilot",
    subWelcome: "Tell me your symptoms or request healthcare assistance. I will utilize Model Context Protocol (MCP) agents to match hospitals, interpret lab documents, or book consultations.",
    inputPlaceholder: "Type your query (e.g., 'I have high fever' or 'Understand my report')...",
    sendButton: "Send",
    connecting: "Connecting to Healio MCP Server...",
    connected: "Linked to Live MCP Node (Port 3001)",
    offlineSim: "Running Local MCP Simulation (Server Offline)",
    mcpAction: "Invoking MCP Agent Tool",
    triageAlert: "Clinical Triage Recommendation",
    hospitalsNearby: "Recommended Care Centers Nearby",
    bookDoctor: "Book Doctor Appointment",
    selectTime: "Select Appointment Time:",
    bookButton: "Book Consultation",
    vitalsTitle: "Current Vital Signs Dashboard",
    reportBiomarkers: "Biomarker Observations",
    preset1: "Check Chest Pain",
    preset2: "Find Cardiology Hospital",
    preset3: "Interpret Lipid Report",
    preset4: "Check Vitals",
    doctorConsultFee: "Consult Fee:",
    experience: "Exp:",
    rating: "Rating:",
    bedsICU: "ICU Beds:",
    bedsGeneral: "Gen Beds:",
    address: "Address:",
    contact: "Contact:",
    bookingSuccess: "Appointment Booked!",
    refId: "Reference ID",
    findHospBtn: "Find Specialty Hospitals",
    bookNowBtn: "Book Appointment Now"
  },
  hi: {
    welcome: "नमस्ते, मैं आपका हीलियो पेशेंट कोपायलट हूँ",
    subWelcome: "मुझे अपने लक्षण बताएं या स्वास्थ्य सहायता का अनुरोध करें। मैं अस्पतालों से मेल खाने, लैब दस्तावेजों की व्याख्या करने या नियुक्तियों को बुक करने के लिए मॉडल संदर्भ प्रोटोकॉल (MCP) टूल का उपयोग करूंगा।",
    inputPlaceholder: "अपना सवाल लिखें (जैसे, 'मुझे तेज बुखार है' या 'मेरी रिपोर्ट समझाएं')...",
    sendButton: "भेजें",
    connecting: "हीलियो MCP सर्वर से जुड़ रहा है...",
    connected: "लाइव MCP नोड से जुड़ा हुआ है (पोर्ट 3001)",
    offlineSim: "स्थानीय MCP सिमुलेशन चल रहा है (सर्वर ऑफ़लाइन)",
    mcpAction: "MCP एजेंट टूल को कॉल किया जा रहा है",
    triageAlert: "प्राथमिक चिकित्सा सलाह (Triage)",
    hospitalsNearby: "आसपास के अनुशंसित देखभाल केंद्र",
    bookDoctor: "डॉक्टर अपॉइंटमेंट बुक करें",
    selectTime: "अपॉइंटमेंट का समय चुनें:",
    bookButton: "परामर्श बुक करें",
    vitalsTitle: "वर्तमान महत्वपूर्ण स्वास्थ्य संकेतक",
    reportBiomarkers: "बायोमार्कर विश्लेषण परिणाम",
    preset1: "छाती का दर्द जांचें",
    preset2: "हृदय रोग अस्पताल खोजें",
    preset3: "लिपिड रिपोर्ट समझें",
    preset4: "वाइटल्स दिखाएं",
    doctorConsultFee: "परामर्श शुल्क:",
    experience: "अनुभव:",
    rating: "रेटिंग:",
    bedsICU: "आईसीयू बेड:",
    bedsGeneral: "सामान्य बेड:",
    address: "पता:",
    contact: "संपर्क:",
    bookingSuccess: "अपॉइंटमेंट बुक हो गया!",
    refId: "संदर्भ संख्या ID",
    findHospBtn: "विशिष्ट अस्पताल ढूंढें",
    bookNowBtn: "अभी अपॉइंटमेंट बुक करें"
  },
  bn: {
    welcome: "হ্যালো, আমি আপনার হিলিও পেশেন্ট কোপাইলট",
    subWelcome: "আপনার উপসর্গ বলুন বা চিকিৎসকের সাহায্য অনুরোধ করুন। আমি হাসপাতাল নির্বাচন, ল্যাব রিপোর্ট ব্যাখ্যা বা বুকিং করতে মডেল কনটেক্সট প্রোটোকল (MCP) টুল ব্যবহার করব।",
    inputPlaceholder: "আপনার সমস্যা লিখুন (যেমন, 'আমার তীব্র জ্বর হয়েছে' বা 'রিপোর্ট ব্যাখ্যা করুন')...",
    sendButton: "পাঠান",
    connecting: "হিলিও MCP সার্ভারের সাথে সংযোগ করা হচ্ছে...",
    connected: "লাইভ MCP নোড সংযুক্ত (পোর্ট 3001)",
    offlineSim: "স্থানীয় MCP সিমুলেশন সক্রিয় আছে (সার্ভার অফলাইন)",
    mcpAction: "MCP এজেন্ট টুল সক্রিয় করা হচ্ছে",
    triageAlert: "ক্লিনিকাল ট্রায়াজ পরামর্শ",
    hospitalsNearby: "নিকটবর্তী প্রস্তাবিত স্বাস্থ্য কেন্দ্র",
    bookDoctor: "ডাক্তারের অ্যাপয়েন্টমেন্ট বুক করুন",
    selectTime: "অ্যাপয়েন্টমেন্টের সময় নির্ধারণ করুন:",
    bookButton: "অ্যাপয়েন্টমেন্ট বুক করুন",
    vitalsTitle: "আপনার বর্তমান শারীরিক ভাইটাল",
    reportBiomarkers: "বায়োমার্কার বিশ্লেষণ ফলাফল",
    preset1: "বুকে ব্যথা পরীক্ষা করুন",
    preset2: "হার্ট হাসপাতাল খুঁজুন",
    preset3: "লিপিড রিপোর্ট বুঝুন",
    preset4: "ভাইটাল সূচক দেখুন",
    doctorConsultFee: "পরামর্শ ফি:",
    experience: "অভিজ্ঞতা:",
    rating: "রেটিং:",
    bedsICU: "আইসিইউ শয্যা:",
    bedsGeneral: "সাধারণ শয্যা:",
    address: "ঠিকানা:",
    contact: "যোগাযোগ:",
    bookingSuccess: "অ্যাপয়েন্টমেন্ট বুকিং সম্পন্ন!",
    refId: "রেফারেন্স আইডি",
    findHospBtn: "বিশেষজ্ঞ হাসপাতাল খুঁজুন",
    bookNowBtn: "এখনই বুক করুন"
  },
  ta: {
    welcome: "வணக்கம், நான் உங்கள் ஹீலியோ நோயாளி காப்பிலாட்",
    subWelcome: "உங்கள் அறிகுறிகளை விவரிக்கவும் அல்லது சிகிச்சை கோரவும். மருத்துவமனை பொருத்தம், ஆய்வக அறிக்கை அல்லது முன்பதிவு செய்ய மாடல் சூழல் நெறிமுறை (MCP) முகவர்களைப் பயன்படுத்துவேன்.",
    inputPlaceholder: "உங்கள் வினவலை தட்டச்சு செய்யவும் (எ.கா. 'எனக்கு அதிக காய்ச்சல் உள்ளது')...",
    sendButton: "அனுப்பு",
    connecting: "ஹீலியோ MCP சேவையுடன் இணைகிறது...",
    connected: "லைவ் MCP முனையுடன் இணைக்கப்பட்டது (போர்ட் 3001)",
    offlineSim: "உள்ளூர் MCP உருவகப்படுத்துதல் இயங்குகிறது (சர்வர் ஆஃப்லைன்)",
    mcpAction: "MCP முகவர் கருவி பயன்படுத்தப்படுகிறது",
    triageAlert: "சிகிச்சை முன்னுரிமை பரிந்துரை",
    hospitalsNearby: "அருகிலுள்ள பரிந்துரைக்கப்பட்ட மருத்துவமனைகள்",
    bookDoctor: "மருத்துவர் சந்திப்பை முன்பதிவு செய்க",
    selectTime: "சந்திப்பு நேரத்தைத் தேர்ந்தெடுக்கவும்:",
    bookButton: "சந்திப்பை முன்பதிவு செய்",
    vitalsTitle: "தற்போதைய உடல்நிலை அளவீடுகள்",
    reportBiomarkers: "உயிரியல் குறிகாட்டிகள் பகுப்பாய்வு",
    preset1: "நெஞ்சு வலி சோதனை செய்",
    preset2: "கார்டியாலஜி மருத்துவமனை",
    preset3: "லிப்பிட் அறிக்கை விளக்கம்",
    preset4: "அளவீடுகளைக் காட்டு",
    doctorConsultFee: "ஆலோசனைக் கட்டணம்:",
    experience: "அனுபவம்:",
    rating: "மதிப்பீடு:",
    bedsICU: "ICU படுக்கைகள்:",
    bedsGeneral: "பொது படுக்கைகள்:",
    address: "முகவரி:",
    contact: "தொலைபேசி:",
    bookingSuccess: "சந்திப்பு முன்பதிவு செய்யப்பட்டது!",
    refId: "குறிப்பு எண் ID",
    findHospBtn: "சிறப்பு மருத்துவமனைகளைக் கண்டறி",
    bookNowBtn: "இப்போது முன்பதிவு செய்"
  }
};

// Simulation database running on the client in case the actual backend is down.
const SIMULATED_DATA = {
  vitals: {
    patientName: "Amit Sharma",
    age: 48,
    bloodGroup: "B+",
    vitals: { BP: "134/85 mmHg", SugarFasting: "112 mg/dL", HeartRate: "72 bpm", SpO2: "98%" }
  },
  symptoms: {
    chest_pain: {
      triage: "EMERGENCY",
      specialty: "Cardiology",
      conditions: [
        { name: "Acute Coronary Syndrome", prob: "85%" },
        { name: "Pulmonary Embolism", prob: "10%" }
      ],
      advice: {
        en: "Seek emergency treatment immediately. Chest pain radiating to the left arm/jaw is a high risk indicator.",
        hi: "तुरंत आपातकालीन चिकित्सा लें। बाएं हाथ/जबड़े में फैलने वाला छाती का दर्द एक उच्च जोखिम का संकेतक है।",
        bn: "অবিলম্বে জরুরী চিকিত্সা নিন। বাম হাত বা চোয়ালে ছড়িয়ে পড়া বুকের ব্যথা একটি উচ্চ ঝুঁকির লক্ষণ।",
        ta: "உடனடியாக அவசர சிகிச்சை பெறவும். இடது கை அல்லது தாடைக்கு பரவும் நெஞ்சு வலி கடுமையான ஆபத்தின் அறிகுறியாகும்."
      }
    },
    fever: {
      triage: "GP_VISIT",
      specialty: "Internal Medicine",
      conditions: [
        { name: "Viral Influenza / Flu", prob: "60%" },
        { name: "Dengue Fever / Malaria", prob: "30%" }
      ],
      advice: {
        en: "Schedule a general practitioner visit. Stay hydrated and check temperature frequently.",
        hi: "एक सामान्य चिकित्सक से परामर्श लें। शरीर को हाइड्रेटेड रखें और नियमित रूप से तापमान मापें।",
        bn: "সাধারণ চিকিৎসকের পরামর্শ নিন। প্রচুর জল পান করুন এবং শরীরের তাপমাত্রা নিয়মিত মাপুন।",
        ta: "பொது மருத்துவரை அணுகவும். நீர்ச்சத்து குறையாமல் பார்த்துக் கொள்ளுங்கள், காய்ச்சல் அளவை கண்காணிக்கவும்."
      }
    }
  },
  hospitals: [
    {
      id: "hosp-01",
      name: "Metro Cardiac & General Hospital",
      specialties: ["Cardiology", "Gastroenterology"],
      distance: 1.8,
      beds: { ICU: 5, Gen: 18 },
      rating: 4.8,
      address: "7th Main Road, Sector 3, HSR Layout",
      contact: "+91 80 4991 2233",
      doctors: [
        { id: "doc-01", name: "Dr. Arvind Swaminathan", specialty: "Cardiology", fee: 800, experience: 18, rating: 4.9, slots: ["09:00 AM", "11:30 AM", "03:00 PM"] }
      ]
    },
    {
      id: "hosp-02",
      name: "Apex Pulmonology and Multi-Specialty Centre",
      specialties: ["Pulmonology", "Internal Medicine"],
      distance: 3.4,
      beds: { ICU: 2, Gen: 11 },
      rating: 4.5,
      address: "12th Cross, Indiranagar Double Road",
      contact: "+91 80 2525 9988",
      doctors: [
        { id: "doc-03", name: "Dr. Rajesh K. Mehta", specialty: "Pulmonology", fee: 900, experience: 20, rating: 4.8, slots: ["09:30 AM", "12:00 PM"] }
      ]
    }
  ],
  report: {
    lipid_hba1c: {
      fileName: "lipid_profile_hba1c_june_2026.pdf",
      date: "11-Jun-2026",
      patient: "Amit Sharma",
      markers: [
        { name: "HbA1c (Glycated Hb)", value: 6.3, unit: "%", status: "Abnormal", advice: { en: "Borderline prediabetic range. Modify diet.", hi: "सीमा रेखा प्री-डायबिटिक रेंज। आहार में बदलाव करें।" } },
        { name: "Bad LDL Cholesterol", value: 142, unit: "mg/dL", status: "Abnormal", advice: { en: "High. Avoid trans-fats and exercise.", hi: "उच्च स्तर। ट्रांस-वसा से बचें और व्यायाम करें।" } }
      ]
    }
  }
};

export default function PatientCopilot() {
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isServerLive, setIsServerLive] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [activeMcpAction, setActiveMcpAction] = useState(null);

  // States for rendering interactive flow values
  const [bookingDetails, setBookingDetails] = useState({
    hospital: null,
    doctor: null,
    time: ''
  });

  const chatEndRef = useRef(null);
  const t = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.en;

  // Verify server health on mount & register global logger callback for developer tab
  useEffect(() => {
    checkServerConnection();
    
    // Add default welcome message
    setMessages([
      {
        id: 'welcome',
        sender: 'copilot',
        text: t.subWelcome,
        isWelcome: true
      }
    ]);
  }, [lang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const checkServerConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      
      // Test POST request to see if HTTP service is responsive
      const res = await fetch('http://localhost:3001/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {},
          id: 1
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        setIsServerLive(true);
      } else {
        setIsServerLive(false);
      }
    } catch {
      setIsServerLive(false);
    }
  };

  // Helper to execute MCP requests via real Node SSE-HTTP or browser simulation
  const executeMcpCall = async (method, params) => {
    const rpcId = Date.now();
    const payload = { jsonrpc: '2.0', method, params, id: rpcId };

    // Log globally if window developer logger exists
    if (window.logMcpTransaction) {
      window.logMcpTransaction('in', method, payload);
    }

    if (isServerLive) {
      try {
        const response = await fetch('http://localhost:3001/api/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resJSON = await response.json();
        
        if (window.logMcpTransaction) {
          window.logMcpTransaction('out', method, resJSON);
        }

        if (resJSON.error) {
          throw new Error(resJSON.error.message);
        }
        return resJSON.result;
      } catch (e) {
        console.warn('Real MCP Server Call failed, falling back to simulated execution.', e);
      }
    }

    // SIMULATED MCP FALLBACK (Instant Response)
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = {};
        if (method === 'tools/call') {
          const { name: toolName, arguments: args } = params;
          const userLang = args.language || 'en';
          
          if (toolName === 'get_patient_vitals') {
            result = {
              content: [{ type: 'text', text: `Vitals for Amit Sharma:\n- BP: ${SIMULATED_DATA.vitals.vitals.BP}\n- Fasting Glucose: ${SIMULATED_DATA.vitals.vitals.SugarFasting}\n- SpO2: ${SIMULATED_DATA.vitals.vitals.SpO2}` }],
              data: SIMULATED_DATA.vitals
            };
          } else if (toolName === 'check_symptoms') {
            const sym = SIMULATED_DATA.symptoms[args.symptomKey] || SIMULATED_DATA.symptoms.fever;
            const conditionsStr = sym.conditions.map(c => `- ${c.name} (${c.prob})`).join('\n');
            const adv = sym.advice[userLang] || sym.advice.en;

            result = {
              content: [{ type: 'text', text: `Triage Level: ${sym.triage}\nAdvice: ${adv}\n\nConditions:\n${conditionsStr}` }],
              data: { triageLevel: sym.triage, specialty: sym.specialty, conditions: sym.conditions, advice: adv }
            };
          } else if (toolName === 'find_hospitals') {
            const spec = args.specialty.toLowerCase();
            const list = SIMULATED_DATA.hospitals.filter(h => 
              h.specialties.some(s => s.toLowerCase() === spec)
            );
            result = {
              content: [{ type: 'text', text: `Found ${list.length} hospital(s) matching specialty: ${args.specialty}` }],
              data: list
            };
          } else if (toolName === 'book_appointment') {
            result = {
              content: [{ type: 'text', text: `Appointment booked successfully for ${args.patientName} at doctor ${args.doctorId}.` }],
              data: {
                id: `sim-appt-${Date.now()}`,
                hospitalId: args.hospitalId,
                doctorId: args.doctorId,
                timeSlot: args.timeSlot,
                patientName: args.patientName,
                status: 'Confirmed',
                date: new Date().toISOString().split('T')[0]
              }
            };
          } else if (toolName === 'interpret_report') {
            const rep = SIMULATED_DATA.report[args.reportKey];
            result = {
              content: [{ type: 'text', text: `Biomarker analysis complete for report ${args.reportKey}.` }],
              data: rep
            };
          }
        }
        
        const responsePayload = { jsonrpc: '2.0', result, id: rpcId };
        if (window.logMcpTransaction) {
          window.logMcpTransaction('out', method, responsePayload);
        }

        resolve(result);
      }, 700);
    });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, sender: 'user', text }]);
    if (!textToSend) setInputText('');
    setIsPending(true);

    // Analyze Query intent & map to MCP Tools
    const lowercaseText = text.toLowerCase();
    
    // 1. CHEST PAIN / SYMPTOMS
    if (lowercaseText.includes('chest') || lowercaseText.includes('दर्द') || lowercaseText.includes('pain') || lowercaseText.includes('symptom')) {
      let symptomKey = 'chest_pain';
      if (lowercaseText.includes('fever') || lowercaseText.includes('बुखार')) symptomKey = 'fever';

      setActiveMcpAction(`check_symptoms(symptomKey: '${symptomKey}', language: '${lang}')`);
      
      const result = await executeMcpCall('tools/call', {
        name: 'check_symptoms',
        arguments: { symptomKey, language: lang }
      });

      setActiveMcpAction(null);
      setIsPending(false);

      if (result && result.data) {
        const data = result.data;
        const adviceText = data.advice || (result.content && result.content[0]?.text);
        
        setMessages(prev => [...prev, {
          id: `mcp-res-${Date.now()}`,
          sender: 'copilot',
          text: adviceText,
          cardType: 'triage',
          cardData: data
        }]);
      }
    }
    // 2. FIND HOSPITAL / CLINIC
    else if (lowercaseText.includes('hospital') || lowercaseText.includes('doctor') || lowercaseText.includes('अस्पताल') || lowercaseText.includes('clinics') || lowercaseText.includes('cardiologist')) {
      let specialty = 'Cardiology';
      if (lowercaseText.includes('pulmonology') || lowercaseText.includes('lungs') || lowercaseText.includes('cough')) specialty = 'Pulmonology';

      await triggerHospitalFinder(specialty);
    }
    // 3. LABORATORY REPORT
    else if (lowercaseText.includes('report') || lowercaseText.includes('lipid') || lowercaseText.includes('hba1c') || lowercaseText.includes('रिपोर्ट')) {
      setActiveMcpAction(`interpret_report(reportKey: 'lipid_hba1c', language: '${lang}')`);

      const result = await executeMcpCall('tools/call', {
        name: 'interpret_report',
        arguments: { reportKey: 'lipid_hba1c', language: lang }
      });

      setActiveMcpAction(null);
      setIsPending(false);

      if (result && result.data) {
        setMessages(prev => [...prev, {
          id: `mcp-res-${Date.now()}`,
          sender: 'copilot',
          text: lang === 'hi' 
            ? "मैंने आपकी लिपिड और HbA1c रिपोर्ट का विश्लेषण किया है। नीचे बायोमार्कर परिणाम दिए गए हैं:" 
            : "I have translated and analyzed your lipid profile. Biomarkers are rendered below:",
          cardType: 'report',
          cardData: result.data
        }]);
      }
    }
    // 4. VITALS
    else if (lowercaseText.includes('vitals') || lowercaseText.includes('health') || lowercaseText.includes('शरीर') || lowercaseText.includes('sugar') || lowercaseText.includes('bp')) {
      setActiveMcpAction(`get_patient_vitals(patientId: 'amit-sharma')`);

      const result = await executeMcpCall('tools/call', {
        name: 'get_patient_vitals',
        arguments: { patientId: 'amit-sharma' }
      });

      setActiveMcpAction(null);
      setIsPending(false);

      if (result && result.data) {
        setMessages(prev => [...prev, {
          id: `mcp-res-${Date.now()}`,
          sender: 'copilot',
          text: lang === 'hi' 
            ? "यहाँ आपके स्वास्थ्य संकेतकों (Vitals) की सूची है:" 
            : "Here is your vital signs dashboard:",
          cardType: 'vitals',
          cardData: result.data
        }]);
      }
    }
    // FALLBACK CHAT
    else {
      setTimeout(() => {
        setIsPending(false);
        setMessages(prev => [...prev, {
          id: `fallback-${Date.now()}`,
          sender: 'copilot',
          text: lang === 'hi' 
            ? "माफ़ करें, मैं इस प्रश्न का सटीक विश्लेषण नहीं कर सका। कृपया लक्षणों की जाँच करें या 'लक्षणों की जांच करें' बटन पर क्लिक करें।"
            : "I'm not sure how to resolve that query. Try saying 'I have chest pain', 'Find nearest cardiology hospital', or 'Explain report' to trigger MCP tools."
        }]);
      }, 500);
    }
  };

  const triggerHospitalFinder = async (specialty) => {
    setIsPending(true);
    setActiveMcpAction(`find_hospitals(specialty: '${specialty}', maxDistance: 5)`);

    const result = await executeMcpCall('tools/call', {
      name: 'find_hospitals',
      arguments: { specialty, maxDistance: 5 }
    });

    setActiveMcpAction(null);
    setIsPending(false);

    if (result && result.data) {
      setMessages(prev => [...prev, {
        id: `mcp-res-${Date.now()}`,
        sender: 'copilot',
        text: `${t.hospitalsNearby} (${specialty}):`,
        cardType: 'hospitals',
        cardData: { list: result.data, specialty }
      }]);
    }
  };

  const handleBookAppointment = async (hospital, doctor, slot) => {
    setIsPending(true);
    setActiveMcpAction(`book_appointment(hospitalId: '${hospital.id}', doctorId: '${doctor.id}', timeSlot: '${slot}')`);

    const result = await executeMcpCall('tools/call', {
      name: 'book_appointment',
      arguments: {
        hospitalId: hospital.id,
        doctorId: doctor.id,
        timeSlot: slot,
        patientName: "Amit Sharma"
      }
    });

    setActiveMcpAction(null);
    setIsPending(false);

    if (result && result.data) {
      setMessages(prev => [...prev, {
        id: `mcp-res-${Date.now()}`,
        sender: 'copilot',
        text: `Booking response generated via MCP:`,
        cardType: 'booking-success',
        cardData: { ...result.data, doctorName: doctor.name, hospitalName: hospital.name }
      }]);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)] overflow-hidden">
      {/* Sidebar Control Panel */}
      <div className="xl:col-span-1 space-y-6 flex flex-col justify-between">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Languages className="w-5 h-5 text-primary-600 animate-spin-slow" />
            <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">Language & Core Settings</h4>
          </div>

          {/* Lang Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Choose Language</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: 'en', name: 'English' },
                { code: 'hi', name: 'हिन्दी' },
                { code: 'ta', name: 'தமிழ்' },
                { code: 'bn', name: 'বাংলা' }
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code)}
                  className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    lang === item.code 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' 
                      : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Status Indicators */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Service Health</span>
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isServerLive ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold text-slate-600">
                  {isServerLive ? t.connected : t.offlineSim}
                </span>
              </div>
              <button 
                onClick={checkServerConnection}
                className="text-[10px] text-primary-600 font-extrabold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Presets (For Common People) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-5 space-y-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Quick Diagnostic Prompts</span>
          <div className="space-y-2">
            <button
              onClick={() => handleSend(t.preset1)}
              className="w-full text-left p-3 rounded-2xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100/60 transition-colors flex items-center justify-between"
            >
              <span>{t.preset1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSend(t.preset2)}
              className="w-full text-left p-3 rounded-2xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100/60 transition-colors flex items-center justify-between"
            >
              <span>{t.preset2}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSend(t.preset3)}
              className="w-full text-left p-3 rounded-2xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100/60 transition-colors flex items-center justify-between"
            >
              <span>{t.preset3}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleSend(t.preset4)}
              className="w-full text-left p-3 rounded-2xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/60 transition-colors flex items-center justify-between"
            >
              <span>{t.preset4}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-premium flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="p-4.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
              <MessageSquare className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 leading-snug">{t.welcome}</h3>
              <p className="text-[10px] text-slate-400 font-medium">Model Context Protocol Agent Interface</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 animate-pulse" />
            AI Active
          </span>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50/30">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-3xl p-4.5 shadow-sm text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-none shadow-md shadow-primary-600/10'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {/* Message text content */}
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>

                  {/* VISUAL CARD: Symptom Triage Results */}
                  {msg.cardType === 'triage' && msg.cardData && (
                    <div className="mt-4 border border-rose-100 bg-rose-50/50 rounded-2xl p-4 space-y-3 text-slate-800">
                      <div className="flex items-center gap-2 pb-2.5 border-b border-rose-100/50">
                        <AlertTriangle className="w-5.5 h-5.5 text-rose-600" />
                        <span className="font-extrabold text-xs text-rose-800 uppercase tracking-wider">{t.triageAlert}</span>
                        <span className="ml-auto text-[9px] font-black bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
                          {msg.cardData.triageLevel}
                        </span>
                      </div>
                      
                      {msg.cardData.conditions && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Estimated Conditions</p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {msg.cardData.conditions.map((c, i) => (
                              <div key={i} className="flex justify-between bg-white px-3 py-2 rounded-xl border border-rose-100/30 text-xs">
                                <span className="font-bold text-slate-700">{c.name}</span>
                                <span className="font-extrabold text-rose-600">{c.prob || c.probability + '%'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => triggerHospitalFinder(msg.cardData.specialty)}
                        className="w-full mt-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-md transition-colors text-xs flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        {t.findHospBtn} ({msg.cardData.specialty})
                      </button>
                    </div>
                  )}

                  {/* VISUAL CARD: Hospital Finder Results */}
                  {msg.cardType === 'hospitals' && msg.cardData && (
                    <div className="mt-4 space-y-3.5">
                      {msg.cardData.list.map((hosp) => (
                        <div key={hosp.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 text-slate-800 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-extrabold text-xs md:text-sm text-slate-800 leading-snug">{hosp.name}</h5>
                              <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-bold">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-primary-600" />
                                  {hosp.distance} km
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  {hosp.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                              {t.bedsICU} {hosp.beds?.ICU || hosp.liveBeds?.ICU}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-100/50 text-[10px] space-y-1">
                            <p className="text-slate-500 font-bold">{t.address} <span className="text-slate-700 font-medium">{hosp.address}</span></p>
                            <p className="text-slate-500 font-bold">{t.contact} <span className="text-slate-700 font-medium">{hosp.contact}</span></p>
                          </div>

                          {/* Doctors Slots selection inside Hospital */}
                          {hosp.doctors && hosp.doctors.map((doc) => (
                            <div key={doc.id} className="border-t border-slate-200/50 pt-2.5 mt-2.5">
                              <p className="text-xs font-black text-slate-700">{doc.name} ({doc.specialty})</p>
                              <div className="flex gap-2.5 items-center mt-1.5 text-[10px] text-slate-400 font-bold">
                                <span>{t.experience} {doc.experience}y</span>
                                <span>{t.doctorConsultFee} ₹{doc.consultationFee || doc.fee}</span>
                              </div>
                              
                              <div className="mt-2.5 space-y-2">
                                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">{t.selectTime}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {(doc.availability || doc.slots).map((slot) => (
                                    <button
                                      key={slot}
                                      onClick={() => handleBookAppointment(hosp, doc, slot)}
                                      className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200 transition-colors"
                                    >
                                      {slot}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* VISUAL CARD: Lab Report Interpreter */}
                  {msg.cardType === 'report' && msg.cardData && (
                    <div className="mt-4 border border-amber-100 bg-amber-50/35 rounded-2xl p-4 space-y-3.5 text-slate-800">
                      <div className="flex items-center gap-2 pb-2 border-b border-amber-100/50">
                        <FileText className="w-5.5 h-5.5 text-amber-600" />
                        <span className="font-extrabold text-xs text-amber-800 uppercase tracking-wider">{t.reportBiomarkers}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {(msg.cardData.markers || []).map((marker, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-xl border border-amber-100/30 text-xs">
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-700">{marker.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                                marker.status === 'Abnormal' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {marker.value} {marker.unit} ({marker.status})
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                              {marker.interpretation && typeof marker.interpretation === 'object' 
                                ? (marker.interpretation[lang] || marker.interpretation.en)
                                : marker.interpretation || marker.advice?.[lang] || marker.advice?.en}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* VISUAL CARD: Booking success */}
                  {msg.cardType === 'booking-success' && msg.cardData && (
                    <div className="mt-4 border border-emerald-100 bg-emerald-50/50 rounded-2xl p-4 space-y-3.5 text-slate-800 shadow-sm text-center">
                      <CheckCircle className="w-9 h-9 text-emerald-600 mx-auto" />
                      <div>
                        <h5 className="font-extrabold text-sm text-emerald-800">{t.bookingSuccess}</h5>
                        <p className="text-xs text-slate-600 mt-1">
                          Confirmed with <strong>{msg.cardData.doctorName}</strong> at {msg.cardData.hospitalName}.
                        </p>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-emerald-100/40 text-[10px] flex justify-between font-bold text-slate-500">
                        <span>{t.refId}:</span>
                        <span className="text-emerald-700">{msg.cardData.id}</span>
                      </div>

                      <div className="flex gap-2 justify-center text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {msg.cardData.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {msg.cardData.timeSlot}</span>
                      </div>
                    </div>
                  )}

                  {/* VISUAL CARD: Patient vitals dashboard */}
                  {msg.cardType === 'vitals' && msg.cardData && (
                    <div className="mt-4 border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4 space-y-3 text-slate-800">
                      <div className="flex items-center gap-2 pb-2 border-b border-emerald-100/50">
                        <Heart className="w-5.5 h-5.5 text-emerald-600 animate-pulse" />
                        <span className="font-extrabold text-xs text-emerald-800 uppercase tracking-wider">{t.vitalsTitle}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white p-2 rounded-xl border border-emerald-100/20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                          <span className="text-xs md:text-sm font-extrabold text-slate-800">
                            {msg.cardData.vitals?.BP || `${msg.cardData.vitals?.systolicBP}/${msg.cardData.vitals?.diastolicBP} mmHg`}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-emerald-100/20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Glucose Fasting</span>
                          <span className="text-xs md:text-sm font-extrabold text-slate-800">
                            {msg.cardData.vitals?.SugarFasting || `${msg.cardData.vitals?.bloodSugarFasting} mg/dL`}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-emerald-100/20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Heart Rate</span>
                          <span className="text-xs md:text-sm font-extrabold text-slate-800">
                            {msg.cardData.vitals?.HeartRate || `${msg.cardData.vitals?.heartRate} bpm`}
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-emerald-100/20">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Oxygen Saturation</span>
                          <span className="text-xs md:text-sm font-extrabold text-slate-800">
                            {msg.cardData.vitals?.SpO2 || `${msg.cardData.vitals?.spO2}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            ))}

            {/* MCP Loading Notification indicator */}
            {isPending && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start items-center gap-3"
              >
                <div className="bg-primary-50/50 border border-primary-100 rounded-2xl py-2 px-4 text-xs font-bold text-primary-700 flex items-center gap-2.5 shadow-sm">
                  <RefreshCw className="w-4 h-4 text-primary-600 animate-spin" />
                  <span>
                    {activeMcpAction ? `${t.mcpAction}: ${activeMcpAction}` : "AI Agent thinking..."}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.inputPlaceholder}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            className="bg-primary-600 hover:bg-primary-700 text-white font-extrabold px-6 rounded-2xl shadow-md transition-colors text-xs md:text-sm flex items-center justify-center gap-1"
          >
            <span>{t.sendButton}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
