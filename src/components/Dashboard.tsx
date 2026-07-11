import { useState, useEffect } from "react";
import { VitalLog, Appointment, MedicalRecord } from "../types";
import { 
  Heart, 
  Droplet, 
  Clock, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  FileText,
  AlertCircle,
  Activity,
  Cpu,
  Zap,
  Sparkles,
  Award,
  RefreshCw,
  Plus,
  Compass,
  CheckCircle,
  RotateCcw
} from "lucide-react";

interface DashboardProps {
  vitals: VitalLog[];
  appointments: Appointment[];
  records: MedicalRecord[];
  onNavigate: (tab: string) => void;
  onAddVitalLog: (log: Omit<VitalLog, "id">) => void;
}

export default function Dashboard({ 
  vitals, 
  appointments, 
  records, 
  onNavigate,
  onAddVitalLog
}: DashboardProps) {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showAutoAdvice, setShowAutoAdvice] = useState(true);
  const [adviceAccepted, setAdviceAccepted] = useState(false);
  const [adviceType, setAdviceType] = useState(0); // index of rotating automated suggestion

  // Get latest vitals entry
  const latestVitals = vitals.length > 0 ? vitals[vitals.length - 1] : null;
  
  // Calculate upcoming appointments
  const upcomingAppointments = appointments.filter(
    (app) => app.status === "scheduled"
  );

  // Get completed appointments
  const completedAppointments = appointments.filter(
    (app) => app.status === "completed"
  );

  // Function to evaluate Blood Pressure status
  const getBPStatus = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { label: "Normal", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (sys < 130 && dia < 80) return { label: "Elevated", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { label: "High (Stage 1/2)", color: "text-rose-600 bg-rose-50 border-rose-100" };
  };

  // Function to evaluate Blood Glucose status
  const getGlucoseStatus = (gl: number) => {
    if (gl < 100) return { label: "Normal (Fasting)", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (gl < 126) return { label: "Prediabetes", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { label: "High (Diabetic Level)", color: "text-rose-600 bg-rose-50 border-rose-100" };
  };

  const bpEval = latestVitals ? getBPStatus(latestVitals.systolicBP, latestVitals.diastolicBP) : null;
  const glucoseEval = latestVitals ? getGlucoseStatus(latestVitals.bloodGlucose) : null;

  // Calculate dynamic "Daily Wellness Score"
  const calculateWellnessScore = () => {
    if (!latestVitals) return 50;
    let score = 70;
    
    // BP check
    if (latestVitals.systolicBP < 125 && latestVitals.diastolicBP < 82) score += 10;
    else if (latestVitals.systolicBP > 135) score -= 10;
    
    // Glucose
    if (latestVitals.bloodGlucose < 100) score += 10;
    else if (latestVitals.bloodGlucose > 125) score -= 5;

    // Water
    if (latestVitals.waterIntake >= 2.5) score += 5;
    else if (latestVitals.waterIntake < 1.8) score -= 5;

    // Sleep
    if (latestVitals.sleepHours >= 7) score += 5;
    else if (latestVitals.sleepHours < 6) score -= 5;

    return Math.min(Math.max(score, 30), 100);
  };

  const wellnessScore = calculateWellnessScore();

  // Get custom feedback text based on wellness score
  const getWellnessFeedback = (score: number) => {
    if (score >= 90) return { title: "Optimal Homeostasis", desc: "Superb alignment across bio-telemetry. Maintain your hydration index." };
    if (score >= 80) return { title: "Excellent Status", desc: "Circulatory rhythm & recovery indicators are stable. Keep going!" };
    if (score >= 70) return { title: "Good Balance", desc: "Minor room for sleep and hydration optimization. Keep a log." };
    return { title: "Requires Care", desc: "Elevated biomarker indexes found. We highly recommend consulting Dr. Jenkins." };
  };

  const wellnessFeedback = getWellnessFeedback(wellnessScore);

  // Auto wearable sync simulation logic
  const handleSimulatedWearableSync = () => {
    if (syncing) return;
    setSyncing(true);
    setSyncStatus("Connecting to smart wearable...");
    
    setTimeout(() => {
      setSyncStatus("Syncing real-time PPG sensor data...");
      setTimeout(() => {
        // Generate automatic slightly varied, healthy real-time metrics
        const baseBP = latestVitals ? latestVitals.systolicBP : 120;
        const baseHR = latestVitals ? latestVitals.heartRate : 70;
        const currentWater = latestVitals ? latestVitals.waterIntake : 1.8;

        // Fluctuations
        const systolic = Math.max(115, Math.min(125, baseBP + Math.floor(Math.random() * 5) - 2));
        const diastolic = Math.max(75, Math.min(82, 80 + Math.floor(Math.random() * 4) - 2));
        const glucose = Math.max(88, Math.min(108, 95 + Math.floor(Math.random() * 12) - 6));
        const hr = Math.max(62, Math.min(80, baseHR + Math.floor(Math.random() * 6) - 3));
        const water = parseFloat((currentWater + 0.5).toFixed(1)); // Automatically add 0.5L water on sync!
        const sleep = latestVitals ? latestVitals.sleepHours : 7.2;

        onAddVitalLog({
          date: new Date().toISOString().split('T')[0],
          systolicBP: systolic,
          diastolicBP: diastolic,
          bloodGlucose: glucose,
          heartRate: hr,
          weight: latestVitals ? latestVitals.weight : 74.0,
          temperature: 36.5,
          waterIntake: water,
          sleepHours: sleep,
          mood: "Excellent"
        });

        setSyncing(false);
        setSyncStatus("✅ Telemetry payload synchronized successfully!");
        setTimeout(() => setSyncStatus(null), 4000);
      }, 1500);
    }, 1200);
  };

  // Rotating automated health insights triggers
  const automatedSuggestions = [
    {
      title: "Automated Hydration Trigger",
      desc: "PPG sensor estimates a 4% decline in blood viscosity. Click to automatically log 500mL of mineralized spring water.",
      actionLabel: "Auto-Log 500ml Water",
      action: () => {
        if (!latestVitals) return;
        onAddVitalLog({
          ...latestVitals,
          waterIntake: parseFloat((latestVitals.waterIntake + 0.5).toFixed(1)),
          mood: "Excellent"
        });
        setAdviceAccepted(true);
      }
    },
    {
      title: "Circadian Rhythm Calibration",
      desc: "Last night's restorative sleep was 7.5 hrs. To auto-optimize morning cortisol levels, complete a 10-minute deep breathing challenge.",
      actionLabel: "Start Deep Breathing AI",
      action: () => {
        onNavigate("ai-companion");
      }
    },
    {
      title: "Biomarker Optimization",
      desc: "Glucose logged at 95 mg/dL. An auto-calculated moderate post-meal stretch will flatten your glycemic curve.",
      actionLabel: "View Fitness Guide",
      action: () => {
        onNavigate("ai-companion");
      }
    }
  ];

  const currentSuggestion = automatedSuggestions[adviceType];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Interactive Automated Smart Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/40 text-white rounded-3xl p-6 lg:p-8 shadow-xl">
        
        {/* Animated background glowing spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] tracking-wider font-bold uppercase text-indigo-300 font-mono flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-indigo-400 animate-pulse" />
                <span>Smart Wearable Integrator Status: ACTIVE</span>
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-4.5xl font-extrabold tracking-tight text-white leading-tight">
              Optimize Your Biology <br/>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                With Automated Biometrics
              </span>
            </h2>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
              Welcome back, <strong className="text-white font-semibold">Alex Mercer</strong>. Your cloud-linked continuous health hub is evaluating biomarkers automatically to prevent fatigue, normalize cardiovascular stress, and predict metabolic stability.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={handleSimulatedWearableSync}
                disabled={syncing}
                className="relative px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center space-x-2 border border-blue-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? "Automated Syncing..." : "Simulate Live Wearable Sync"}</span>
              </button>
              
              <button 
                onClick={() => onNavigate("ai-companion")}
                className="px-5 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700/60 transition-colors flex items-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Talk to Care Buddy AI</span>
              </button>
            </div>
          </div>

          {/* Glowing Wellness Ring Widget */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 w-full max-w-[260px] text-center space-y-3 shadow-2xl relative">
              <div className="absolute top-2 right-2">
                <Award className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Daily Bio Score</span>
              
              {/* Circular Gauge Ring */}
              <div className="relative flex items-center justify-center h-28 w-28 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-indigo-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${wellnessScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="url(#blue_gradient)"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <defs>
                    <linearGradient id="blue_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{wellnessScore}</span>
                  <span className="text-[9px] text-indigo-300 font-mono font-semibold uppercase">Optimal</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-100">{wellnessFeedback.title}</h4>
                <p className="text-[10px] text-slate-400 leading-normal">{wellnessFeedback.desc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sync Progress Alert Toast */}
        {syncStatus && (
          <div className="mt-4 p-3 bg-indigo-900/60 border border-indigo-500/30 rounded-xl text-xs flex items-center justify-between animate-scale-up">
            <div className="flex items-center space-x-2 text-indigo-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>{syncStatus}</span>
            </div>
            {syncing && (
              <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Proactive Health Recommendation - Automatic Trigger Agent */}
      {showAutoAdvice && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs relative animate-fade-in">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button 
              onClick={() => {
                setAdviceType((prev) => (prev + 1) % automatedSuggestions.length);
                setAdviceAccepted(false);
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
              title="Next automated advisory"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowAutoAdvice(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>

          <div className="flex items-start space-x-3.5 pr-12">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                  AUTOMATIC BIOMETRIC AGENT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Advisory 0{adviceType + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{currentSuggestion.title}</h4>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                {currentSuggestion.desc}
              </p>

              <div className="pt-1.5">
                {adviceAccepted ? (
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Payload Logged Automatically!</span>
                  </span>
                ) : (
                  <button
                    onClick={currentSuggestion.action}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{currentSuggestion.actionLabel}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Vitals Snapshot Grid Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Latest Vital Indicators ({latestVitals?.date || "No Entry"})
          </h3>
          <button
            onClick={() => onNavigate("vitals")}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-0.5"
          >
            <span>Telemetry History</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        
        {latestVitals ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Blood Pressure Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200/60 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 font-mono">Blood Pressure</span>
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2.5xl font-extrabold text-slate-800 tracking-tight">
                  {latestVitals.systolicBP}/{latestVitals.diastolicBP} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </div>
                {bpEval && (
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${bpEval.color} font-mono`}>
                    {bpEval.label}
                  </span>
                )}
              </div>
            </div>

            {/* Blood Glucose Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200/60 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 font-mono">Blood Glucose</span>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2.5xl font-extrabold text-slate-800 tracking-tight">
                  {latestVitals.bloodGlucose} <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </div>
                {glucoseEval && (
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${glucoseEval.color} font-mono`}>
                    {glucoseEval.label}
                  </span>
                )}
              </div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200/60 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 font-mono">PPG Heart Rate</span>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2.5xl font-extrabold text-slate-800 tracking-tight">
                  {latestVitals.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
                </div>
                <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded font-mono">
                  Pulse Rhythm Normal
                </span>
              </div>
            </div>

            {/* Sleep & Water Goals Tracker */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-slate-200/60 transition-all flex flex-col justify-between group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 font-mono">Hydration & Rest</span>
                <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl group-hover:scale-105 transition-transform">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-slate-800 flex items-center justify-between">
                  <span className="font-extrabold">💤 {latestVitals.sleepHours} hrs</span>
                  <span className="font-extrabold text-indigo-600">💧 {latestVitals.waterIntake} L</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((latestVitals.waterIntake / 3) * 100, 100)}%` }} 
                  />
                </div>
                <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-mono mt-1">
                  Target: 3.0 L
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-sm">No recent vitals entries found. Log your daily stats to monitor health analytics!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Appointments & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Appointments Section */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Medical Consultations
            </h3>
            <button 
              onClick={() => onNavigate("appointments")}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Book New Doctor
            </button>
          </div>

          <div className="space-y-4">
            {/* Upcoming Appointments Card */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">
                Upcoming Appointment
              </h4>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((app) => (
                  <div key={app.id} className="flex items-start justify-between border-l-4 border-indigo-500 pl-4 py-1">
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-800 text-sm">{app.doctorName}</div>
                      <div className="text-xs text-slate-500 font-medium">{app.doctorSpecialty}</div>
                      <div className="text-xs text-slate-400 flex items-center space-x-1.5 pt-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{app.date} at {app.timeSlot}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider font-mono">
                      Confirmed
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  No upcoming appointments scheduled.
                </div>
              )}
            </div>

            {/* Past Visits with Prescriptions */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">
                Recent Past Visits & Diagnostics
              </h4>
              {completedAppointments.length > 0 ? (
                <div className="space-y-4">
                  {completedAppointments.map((app) => (
                    <div key={app.id} className="flex items-start justify-between border-b border-slate-50 last:border-0 pb-3.5 last:pb-0">
                      <div className="space-y-1.5">
                        <div className="text-sm font-bold text-slate-800">{app.doctorName}</div>
                        <p className="text-xs text-slate-500 italic max-w-md truncate">
                          "Complaint: {app.chiefComplaint}"
                        </p>
                        {app.prescription && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                              PRESCRIPTION LOGGED
                            </span>
                            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center space-x-0.5 font-mono">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{app.prescription.medications.length} items</span>
                            </span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => onNavigate("appointments")}
                        className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs font-medium">
                  No medical consultations completed yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Records Summary Section */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Medical Documents
            </h3>
            <button 
              onClick={() => onNavigate("records")}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Manage Files
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Recent Clinical Uploads
            </h4>
            {records.length > 0 ? (
              <div className="space-y-3">
                {records.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-xl border border-slate-100/60 hover:bg-slate-50/50 transition-colors">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{rec.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1">
                        <span className="font-semibold bg-slate-100 border px-1.5 py-0.5 rounded text-slate-600">{rec.category}</span>
                        <span className="font-mono">{rec.date}</span>
                      </div>
                      
                      {rec.contentSummarized ? (
                        <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span className="bg-emerald-50 px-1 rounded font-mono">AI Translated Summary Available</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => onNavigate("records")}
                          className="mt-2 text-[10px] text-blue-600 font-bold hover:underline flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          <span>Summarize with Gemini</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No clinical documents uploaded.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
