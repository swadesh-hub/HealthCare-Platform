import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, VitalLog } from "../types";
import { 
  Bot, 
  Sparkles, 
  Send, 
  AlertTriangle, 
  Activity, 
  Apple, 
  Heart,
  Droplet,
  User,
  Brain,
  AlertCircle
} from "lucide-react";

interface AICompanionProps {
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
  latestVitals: VitalLog | null;
}

export default function AICompanion({ 
  chatHistory, 
  onAddChatMessage,
  latestVitals 
}: AICompanionProps) {
  const [subTab, setSubTab] = useState<"coach" | "checker">("coach");
  
  // Chat state
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Symptom Checker state
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState("Male");
  const [duration, setDuration] = useState("2 days");
  const [checkerLoading, setCheckerLoading] = useState(false);
  const [checkerResult, setCheckerResult] = useState<string | null>(null);
  const [checkerError, setCheckerError] = useState<string | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  // Symptom Checker assessment submission
  const handleSymptomCheckSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setCheckerLoading(true);
    setCheckerError(null);
    setCheckerResult(null);

    try {
      const res = await fetch("/api/gemini/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: symptoms.trim(),
          age,
          gender,
          duration
        })
      });

      if (!res.ok) {
        throw new Error("Failed to process symptom check.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setCheckerResult(data.text);
    } catch (err: any) {
      console.error(err);
      setCheckerError(err.message || "Triage processor encountered an error.");
    } finally {
      setCheckerLoading(false);
    }
  };

  // Health Coach Chat submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    setChatInput("");
    setChatError(null);

    // Create user message object
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddChatMessage(userMsg);
    setChatLoading(true);

    try {
      // Collect messages history for API
      const updatedMessages = [...chatHistory, userMsg];

      const res = await fetch("/api/gemini/health-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          currentVitals: latestVitals
        })
      });

      if (!res.ok) {
        throw new Error("Failed to reach Health Coach AI service.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Add model message
      const modelMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: "model",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      onAddChatMessage(modelMsg);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "AI Health Companion encountered an unexpected interruption.");
    } finally {
      setChatLoading(false);
    }
  };

  // Helper to safely render markdown formatted text
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 border-b border-slate-100 pb-0.5">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="text-xs font-bold text-slate-700 mt-3 mb-1 font-mono">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      // Unordered list items
      if (line.trim().startsWith("- ")) {
        const itemText = line.trim().substring(2);
        const boldParts = itemText.split("**");
        return (
          <li key={idx} className="text-xs text-slate-600 ml-4 list-disc py-0.5">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part)}
          </li>
        );
      }
      // Numbered list items
      if (/^\d+\.\s/.test(line.trim())) {
        const itemText = line.trim().replace(/^\d+\.\s/, "");
        const boldParts = itemText.split("**");
        return (
          <li key={idx} className="text-xs text-slate-600 ml-5 list-decimal py-0.5">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part)}
          </li>
        );
      }
      if (line.trim() === "") return <div key={idx} className="h-2" />;

      // Match bold segments
      const boldParts = line.split("**");
      if (boldParts.length > 1) {
        return (
          <p key={idx} className="text-xs text-slate-600 leading-relaxed py-0.5">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-slate-800">{part}</strong> : part)}
          </p>
        );
      }

      return <p key={idx} className="text-xs text-slate-600 leading-relaxed py-0.5">{line}</p>;
    });
  };

  const samplePrompts = [
    { label: "Give me a healthy dinner recipe", icon: Apple },
    { label: "Assess my blood pressure", icon: Heart },
    { label: "Tips for staying active", icon: Activity },
    { label: "Simple stress reduction workout", icon: Brain }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Sub-tab selection row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">AI Health Companion</h2>
          <p className="text-sm text-slate-500 mt-1">Get virtual healthcare insights, log questions, or chat about personal wellness targets.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setSubTab("coach")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              subTab === "coach" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Health Coach</span>
          </button>
          <button
            onClick={() => setSubTab("checker")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              subTab === "checker" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Symptom Triage</span>
          </button>
        </div>
      </div>

      {subTab === "coach" ? (
        /* Workspace 1: Health Coach Chat */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Chat Panel column */}
          <div className="lg:col-span-8 flex flex-col h-[520px] bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            {/* Chat message logs */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 scrollbar-thin">
              {chatHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 space-y-4">
                  <div className="p-3.5 bg-blue-50 text-blue-600 rounded-full shadow-xs animate-bounce">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Meet Health Buddy</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Ask me about nutrition tips, stress relief strategies, core exercises, and healthy hydration protocols.
                    </p>
                  </div>
                  
                  {/* Sample suggestions */}
                  <div className="grid grid-cols-2 gap-2.5 max-w-md pt-2">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChatInput(p.label);
                        }}
                        className="p-3 text-left border border-slate-100 hover:border-blue-500/30 hover:bg-slate-50/50 rounded-xl transition-all duration-150 flex items-start space-x-2.5"
                      >
                        <p.icon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-snug">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Disclaimer banner at top of logs */}
                  <div className="bg-amber-50/40 border border-amber-100/40 rounded-xl p-3 text-[10px] text-amber-700 leading-relaxed flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Disclaimer:</strong> This AI Health Coach provides general lifestyle guidance and nutritional/wellness suggestions. It is not an alternative to licensed clinical evaluation or immediate triage.</span>
                  </div>

                  {chatHistory.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        msg.role === "user" 
                          ? "bg-slate-100 text-slate-600 border border-slate-200" 
                          : "bg-blue-600 text-white shadow-sm"
                      }`}>
                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Bubble */}
                      <div className={`max-w-[80%] rounded-2xl p-4 text-xs shadow-xs space-y-2 ${
                        msg.role === "user" 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                      }`}>
                        {msg.role === "user" ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="prose max-w-none text-slate-700 leading-relaxed">
                            {renderMarkdown(msg.content)}
                          </div>
                        )}
                        <div className={`text-[9px] font-mono mt-1 ${
                          msg.role === "user" ? "text-blue-200 text-right" : "text-slate-400"
                        }`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {chatLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white shadow-sm flex items-center justify-center">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 rounded-tl-none text-xs text-slate-500 flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {chatError && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                  <span>{chatError}</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleChatSubmit} className="mt-4 pt-3 border-t border-slate-50 flex items-center space-x-2">
              <input
                type="text"
                required
                disabled={chatLoading}
                placeholder="Ask Health Buddy about hydration, sleep, dynamic workouts..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

          {/* Vitals Context sidebar column */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Vitals Context Panel</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Vitals data is automatically integrated into AI sessions for personalized coaching.</p>
            </div>

            {latestVitals ? (
              <div className="space-y-3.5">
                {/* Integration status indicator */}
                <div className="flex items-center space-x-2 py-1.5 px-2.5 bg-emerald-50 border border-emerald-100/60 rounded-xl text-emerald-700 text-[10px] font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>ACTIVE VITALS SYNCED</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 border border-slate-50 bg-slate-50/50 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Blood Pressure</span>
                    <span className="font-bold text-slate-800">{latestVitals.systolicBP}/{latestVitals.diastolicBP} mmHg</span>
                  </div>
                  <div className="p-2.5 border border-slate-50 bg-slate-50/50 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Blood Glucose</span>
                    <span className="font-bold text-slate-800">{latestVitals.bloodGlucose} mg/dL</span>
                  </div>
                  <div className="p-2.5 border border-slate-50 bg-slate-50/50 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Heart Rate</span>
                    <span className="font-bold text-slate-800">{latestVitals.heartRate} bpm</span>
                  </div>
                  <div className="p-2.5 border border-slate-50 bg-slate-50/50 rounded-xl space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-mono block">Hydration</span>
                    <span className="font-bold text-slate-800">{latestVitals.waterIntake} L / Day</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/30 border border-indigo-100/50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-indigo-700 font-mono block">Tailored Suggestions:</span>
                  <p className="text-[10px] text-indigo-600/90 leading-relaxed">
                    Based on your logged glucose ({latestVitals.bloodGlucose} mg/dL) and daily sleep hours ({latestVitals.sleepHours} hrs), ask Health Buddy: *"What is a good evening snack for lipid and sleep regulation?"*
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 italic text-xs font-medium border border-dashed border-slate-100 rounded-xl bg-slate-50/30">
                Log your vitals in the Vitals tab to feed diagnostic context to your health buddy.
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Workspace 2: Virtual Symptom Checker */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Intake Intake form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Virtual Symptom Intake</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Define your symptoms objectively to receive a clinical triage report.</p>
            </div>

            <form onSubmit={handleSymptomCheckSubmit} className="space-y-4">
              
              <div className="grid grid-cols-3 gap-3 text-xs">
                {/* Age */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-500 font-mono block">Age</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Gender */}
                <div className="space-y-1 col-span-2">
                  <label className="font-semibold text-slate-500 font-mono block">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Symptom Duration */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-500 font-mono block">Symptom Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 days, 3 weeks, sudden onset"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Symptoms Description */}
              <div className="space-y-1 text-xs">
                <label className="font-semibold text-slate-500 font-mono block">Describe Symptoms</label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. Mild continuous headache behind the eyes, sensitivity to light, slight fatigue, no fever."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={checkerLoading || !symptoms.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Symptoms Triage</span>
              </button>
            </form>
          </div>

          {/* Results column */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[420px] flex flex-col justify-between">
            {checkerLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-9 h-9 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Processing Symptom Assessment...</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">Sifting severity parameters, specialist recommendations, and at-home supportive care targets.</p>
                </div>
              </div>
            ) : checkerError ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{checkerError}</span>
              </div>
            ) : checkerResult ? (
              <div className="space-y-5">
                <div className="border-b border-slate-50 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm">Triage Clinical Assessment</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Education summary provided by the Gemini virtual health analyzer.</p>
                </div>

                <div className="bg-indigo-50/15 border border-indigo-100 p-5 rounded-2xl max-h-[350px] overflow-y-auto space-y-3 shadow-xs">
                  {renderMarkdown(checkerResult)}
                </div>

                {/* Important triage safety prompt */}
                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl text-[10.5px] text-amber-800 leading-relaxed">
                  <strong>⚠️ Critical Emergency Directive:</strong> This report is clinical education material. If symptoms are severe, include difficulty speaking, swallowing, chest compression, severe breath loss, or limb numbness, seek **immediate local emergency department** support.
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="text-xs font-semibold text-slate-500 font-mono">No Assessment Generated</div>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Fill in your symptoms description, age, and duration inside the Virtual Symptom Intake panel on the left to activate Gemini's triage guidelines.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
