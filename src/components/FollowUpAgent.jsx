import React, { useState } from 'react';
import { 
  MessageSquare, Bell, ShieldAlert, PhoneCall, Check, 
  Clock, AlertCircle, HeartPulse, UserRound, ArrowRight
} from 'lucide-react';

export default function FollowUpAgent() {
  const [messages, setMessages] = useState([
    {
      sender: 'agent',
      text: "Hi Amit, this is Sarah, your post-visit recovery assistant from Metro Cardiac. I see you had a Cardiology consultation with Dr. Arvind Swaminathan yesterday regarding your lipid profile.",
      time: "09:00 AM"
    },
    {
      sender: 'agent',
      text: "How are you feeling today? Have you started your prescribed Atorvastatin (10mg) and Metformin (500mg)?",
      time: "09:01 AM",
      options: [
        { label: "Feeling fine, taking medicines on time", action: "meds_ok" },
        { label: "Missed a dose / having mild nausea", action: "meds_side_effects" },
        { label: "Experiencing shortness of breath or dizziness", action: "escalate" }
      ]
    }
  ]);
  const [reminders, setReminders] = useState([
    { id: 1, name: "Atorvastatin (10mg) - Cholesterol", time: "09:00 PM Daily", active: true },
    { id: 2, name: "Metformin (500mg) - Blood Sugar", time: "08:00 AM & 08:00 PM Daily", active: true }
  ]);
  const [escalated, setEscalated] = useState(false);

  const handleSelectOption = (option) => {
    // Add user response message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: option.label,
      time: "Just now"
    }]);

    setTimeout(() => {
      if (option.action === "meds_ok") {
        setMessages(prev => [...prev, {
          sender: 'agent',
          text: "That is excellent to hear! Consistency is key for stabilizing plaque and controlling prediabetes glucose. I will check back in 3 days. Let me know if you experience any changes.",
          time: "Just now"
        }]);
      } else if (option.action === "meds_side_effects") {
        setMessages(prev => [...prev, {
          sender: 'agent',
          text: "Mild nausea is a common starting side effect for Metformin. Try taking it in the middle of your meal to protect your stomach lining. If it persists beyond 3 days, let me know so I can notify the clinic team.",
          time: "Just now"
        }]);
      } else if (option.action === "escalate") {
        setEscalated(true);
        setMessages(prev => [...prev, {
          sender: 'agent',
          text: "⚠️ Warning: Shortness of breath and dizziness are critical warning signs. I am initiating an immediate nurse escalation.",
          time: "Just now"
        }, {
          sender: 'agent',
          text: "LOGGED ESCALATION: Nurse Priya Sharma (Metro Cardiac Unit 3) has been paged with your recent vitals and report history. She will call you at +91 98860 12345 within 3 minutes. Please lie down, relax your breathing, and prepare to receive the call.",
          time: "Just now"
        }]);
      }
    }, 600);
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agent Dialogue Screen */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium flex flex-col h-[580px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Sarah — Proactive Follow-up</h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
                Linked to Metro Cardiac Care Team
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
            Patient Agent
          </span>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm ${
                msg.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : msg.text.includes('⚠️')
                    ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none font-semibold'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`text-[9px] mt-1.5 block ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>

                {/* Option buttons */}
                {msg.options && !escalated && messages[messages.length - 1] === msg && (
                  <div className="mt-3.5 space-y-2">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(opt)}
                        className="w-full text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl p-3 text-xs font-semibold text-slate-700 transition-colors shadow-sm block"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation Monitor & Medication reminders */}
      <div className="space-y-6">
        {/* Escalation Alert Center */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6">
          <h4 className="font-bold text-sm text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            Escalation Monitor
          </h4>

          {escalated ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-3.5 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto animate-bounce">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-red-800">Nurse Call Pending</h5>
                <p className="text-xs text-red-700 mt-1 leading-relaxed">
                  Nurse Priya Sharma is dialing you at <strong>+91 98860 12345</strong>. A digital health record summary has been pushed to her EMR console.
                </p>
              </div>
              <div className="bg-white/80 p-2 rounded-xl border border-red-200 text-[10px] text-red-600 font-bold flex justify-between">
                <span>ESTIMATED WAIT:</span>
                <span>1 min 45s</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 text-center text-slate-500 py-6 border border-slate-100">
              <Check className="w-8 h-8 text-emerald-500 bg-emerald-50 rounded-full p-1.5 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">All Vitals Normal</p>
              <p className="text-[10px] text-slate-400 mt-1">No recovery abnormalities reported. Auto-escalation standby active.</p>
            </div>
          )}
        </div>

        {/* Medication Reminders Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              Medication Schedule
            </h4>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              2 Active
            </span>
          </div>

          <div className="space-y-3">
            {reminders.map(rem => (
              <div 
                key={rem.id} 
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  rem.active ? 'border-primary-100 bg-primary-50/10' : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{rem.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {rem.time}
                  </p>
                </div>
                <button
                  onClick={() => toggleReminder(rem.id)}
                  className={`w-9 h-5 rounded-full transition-all relative ${
                    rem.active ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    rem.active ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
