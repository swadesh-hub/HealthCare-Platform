import { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Square,
  ChevronRight,
  Headphones,
  MessageCircle,
  HelpCircle,
  BookOpen,
  Heart,
  Calendar,
  Activity,
  FileText
} from "lucide-react";
import { VitalLog, Appointment } from "../types";

interface VoiceAssistantProps {
  vitals: VitalLog[];
  appointments: Appointment[];
}

const QUICK_READS = [
  {
    id: "vitals",
    icon: Activity,
    label: "Read My Vitals",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    activeColor: "bg-blue-600 text-white border-blue-700",
  },
  {
    id: "appointments",
    icon: Calendar,
    label: "Read Appointments",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    activeColor: "bg-purple-600 text-white border-purple-700",
  },
  {
    id: "health-tips",
    icon: Heart,
    label: "Daily Health Tips",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    activeColor: "bg-rose-600 text-white border-rose-700",
  },
  {
    id: "guide",
    icon: BookOpen,
    label: "How to Use This App",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    activeColor: "bg-emerald-600 text-white border-emerald-700",
  }
];

const FAQ_ITEMS = [
  { q: "How do I book an appointment?", a: "Click on 'Book Appointment' in the left menu. Choose a doctor, pick a date and time, then click 'Book Now'." },
  { q: "How do I check my blood pressure?", a: "Go to 'Vitals & Logs' in the left menu. Your latest blood pressure reading is shown at the top." },
  { q: "How do I talk to the AI assistant?", a: "Click on 'AI Companion' in the left menu. Type your health question in the box and press Enter or click Send." },
  { q: "What is a wellness score?", a: "Your wellness score is a number from 0 to 100 that shows how healthy you are today, based on your blood pressure, sleep, water intake and blood sugar." },
  { q: "How do I add my medications?", a: "Ask your doctor to complete your appointment in the Doctor Portal. They will add a prescription with your medications automatically." }
];

export default function VoiceAssistant({ vitals, appointments }: VoiceAssistantProps) {
  const [isReading, setIsReading] = useState(false);
  const [activeRead, setActiveRead] = useState<string | null>(null);
  const [isMicListening, setIsMicListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [micSupported, setMicSupported] = useState(true);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(0.9);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  const latestVital = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  const upcomingAppts = appointments.filter(a => a.status === "scheduled");

  useEffect(() => {
    // Check mic support
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setMicSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const getTextForId = (id: string): string => {
    switch (id) {
      case "vitals":
        if (!latestVital) return "No vitals data found. Please log your health data first.";
        return `Here is your latest health report from ${latestVital.date}. 
          Your blood pressure is ${latestVital.systolicBP} over ${latestVital.diastolicBP} millimeters of mercury. 
          Your heart rate is ${latestVital.heartRate} beats per minute. 
          Your blood glucose is ${latestVital.bloodGlucose} milligrams per deciliter. 
          You slept ${latestVital.sleepHours} hours last night. 
          You drank ${latestVital.waterIntake} liters of water. 
          Your mood was ${latestVital.mood}. 
          Overall you are doing ${latestVital.mood === "Excellent" || latestVital.mood === "Good" ? "well" : "okay"}. Keep taking care of yourself!`;
      case "appointments":
        if (upcomingAppts.length === 0) return "You have no upcoming doctor appointments scheduled right now. You can book one by clicking Book Appointment in the menu.";
        return `You have ${upcomingAppts.length} upcoming appointment${upcomingAppts.length > 1 ? "s" : ""}. 
          ${upcomingAppts.map((a, i) => `Appointment ${i + 1}: with Doctor ${a.doctorName}, who is a ${a.doctorSpecialty} specialist, on ${a.date} at ${a.timeSlot}.`).join(" ")} 
          Please remember to arrive 10 minutes early.`;
      case "health-tips":
        return `Here are your daily health tips. 
          One: Drink at least 8 glasses of water today. Staying hydrated keeps your blood pressure and kidneys healthy. 
          Two: Take a 15-minute walk after each meal. This helps control your blood sugar. 
          Three: Take your medications at the same time each day. Set an alarm if you need a reminder. 
          Four: Sleep at least 7 to 8 hours tonight. Good sleep helps your heart and brain. 
          Five: If you feel chest pain, dizziness, or difficulty breathing, call emergency services immediately.`;
      case "guide":
        return `Welcome to CarePlatform. Here is how to use this application. 
          Use the left side menu to navigate between different sections. 
          The Health Dashboard shows your most important health numbers. 
          The Book Appointment section lets you find and schedule a doctor visit. 
          Vitals and Logs is where you record your daily health readings. 
          Medical Records stores all your health documents. 
          The AI Companion lets you chat with an intelligent health assistant. 
          The Emergency SOS button can call for help quickly. 
          If you need bigger text or simpler controls, visit Accessibility Settings in the menu.`;
      default:
        return "Please select what you would like me to read.";
    }
  };

  const speakText = (id: string) => {
    if (!window.speechSynthesis) {
      setSpeechError("Your browser does not support text-to-speech. Try Google Chrome.");
      return;
    }
    window.speechSynthesis.cancel();
    const text = getTextForId(id);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = volume;
    utterance.pitch = 1;
    utterance.lang = "en-IN";

    // Prefer a clear female English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes("en") && v.name.toLowerCase().includes("female"))
      || voices.find(v => v.lang.includes("en"))
      || voices[0];
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setIsReading(true); setActiveRead(id); };
    utterance.onend = () => { setIsReading(false); setActiveRead(null); };
    utterance.onerror = () => { setIsReading(false); setActiveRead(null); };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsReading(false);
    setActiveRead(null);
  };

  const startMic = () => {
    if (!micSupported) return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };
    recognition.onerror = (e: any) => {
      setSpeechError("Microphone error: " + e.error);
      setIsMicListening(false);
    };
    recognition.onend = () => {
      setIsMicListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsMicListening(true);
    setTranscript("");
    setSpeechError(null);
  };

  const stopMic = () => {
    recognitionRef.current?.stop();
    setIsMicListening(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 rounded-3xl p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="relative z-10 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-500/30 rounded-xl">
              <Headphones className="w-6 h-6 text-sky-200" />
            </div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-sky-300 uppercase">
              Voice Assistant
            </span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Speak & Listen
          </h2>
          <p className="text-sky-200 text-sm leading-relaxed max-w-xl">
            Can't read the screen easily? Let CarePlatform <strong className="text-white">read your health info aloud</strong> to you — or use your voice to speak and get answers. Designed for seniors and anyone who prefers audio.
          </p>
        </div>
      </div>

      {speechError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Quick Read Buttons */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider font-mono">
          🔊 Quick Read Aloud
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_READS.map((item) => {
            const Icon = item.icon;
            const isActive = activeRead === item.id;
            return (
              <button
                key={item.id}
                id={`voice-read-${item.id}`}
                onClick={() => isActive ? stopReading() : speakText(item.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  isActive ? item.activeColor : item.color + " hover:brightness-95"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${isActive ? "bg-white/20" : "bg-white shadow-sm"}`}>
                    <Icon className={`w-6 h-6 ${isActive ? "text-white" : ""}`} />
                  </div>
                  <div>
                    <p className={`font-bold text-base ${isActive ? "text-white" : "text-slate-800"}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? "text-white/70" : "text-slate-500"}`}>
                      {isActive ? "Tap to stop reading..." : "Tap to hear this"}
                    </p>
                  </div>
                </div>
                {isActive ? (
                  <Square className="w-6 h-6 text-white animate-pulse" />
                ) : (
                  <Play className="w-5 h-5 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reading Controls */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-700 mb-5 flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-slate-500" />
          <span>Voice Settings</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
              <span>Volume</span>
              <span className="text-blue-600 font-bold">{Math.round(volume * 100)}%</span>
            </label>
            <input
              type="range"
              min={0} max={1} step={0.1}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Quiet</span><span>Loud</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
              <span>Reading Speed</span>
              <span className="text-blue-600 font-bold">{rate === 0.7 ? "Slow" : rate === 0.9 ? "Normal" : "Fast"}</span>
            </label>
            <input
              type="range"
              min={0.6} max={1.4} step={0.1}
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Slow</span><span>Fast</span>
            </div>
          </div>
        </div>
        {isReading && (
          <button
            onClick={stopReading}
            className="mt-4 w-full flex items-center justify-center space-x-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-sm rounded-xl border border-rose-200 transition-colors"
          >
            <VolumeX className="w-4 h-4" />
            <span>Stop Reading</span>
          </button>
        )}
      </div>

      {/* Voice Input */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center space-x-2">
          <Mic className="w-4 h-4 text-slate-500" />
          <span>Voice Input (Speech to Text)</span>
        </h3>
        <p className="text-xs text-slate-500 mb-5">Speak into your microphone — your words will appear as text below.</p>

        {!micSupported ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 text-sm">
            ⚠️ Voice input is not supported in this browser. Please use Google Chrome for voice features.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={isMicListening ? stopMic : startMic}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                isMicListening
                  ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30 animate-pulse"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20"
              }`}
            >
              {isMicListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>
            <p className="text-sm text-slate-500 text-center">
              {isMicListening ? "🔴 Listening... Speak now" : "Tap to start speaking"}
            </p>
            {transcript && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-2 font-mono">What you said:</p>
                <p className="text-base text-slate-700 font-medium leading-relaxed">"{transcript}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider font-mono flex items-center space-x-2">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span>Common Questions (Tap to Hear Answer)</span>
        </h3>
        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
              <button
                id={`faq-read-${i}`}
                onClick={() => speakText(`faq-${i}`)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors group"
                // Override speakText for FAQ inline
                // We'll build this below
              >
                <div className="flex items-start space-x-3">
                  <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg mt-0.5 flex-shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{item.q}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.a}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <span className="text-[10px] text-blue-500 font-bold hidden sm:block">Read aloud</span>
                  <Play className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
