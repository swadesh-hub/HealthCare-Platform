import React, { useState } from "react";
import { VitalLog } from "../types";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Heart, 
  Activity, 
  TrendingUp, 
  Droplet, 
  Plus, 
  Calendar, 
  Smile, 
  Clock
} from "lucide-react";

interface VitalsTrackerProps {
  vitals: VitalLog[];
  onAddVitalLog: (log: Omit<VitalLog, "id">) => void;
}

export default function VitalsTracker({ vitals, onAddVitalLog }: VitalsTrackerProps) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [systolicBP, setSystolicBP] = useState("120");
  const [diastolicBP, setDiastolicBP] = useState("80");
  const [bloodGlucose, setBloodGlucose] = useState("95");
  const [heartRate, setHeartRate] = useState("72");
  const [weight, setWeight] = useState("74.0");
  const [temperature, setTemperature] = useState("36.5");
  const [waterIntake, setWaterIntake] = useState("2.5");
  const [sleepHours, setSleepHours] = useState("7.5");
  const [mood, setMood] = useState<VitalLog["mood"]>("Good");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVitalLog({
      date,
      systolicBP: parseFloat(systolicBP) || 120,
      diastolicBP: parseFloat(diastolicBP) || 80,
      bloodGlucose: parseFloat(bloodGlucose) || 95,
      heartRate: parseFloat(heartRate) || 72,
      weight: parseFloat(weight) || 74.0,
      temperature: parseFloat(temperature) || 36.5,
      waterIntake: parseFloat(waterIntake) || 2.5,
      sleepHours: parseFloat(sleepHours) || 7.5,
      mood
    });
    
    // Close modal
    setShowLogForm(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Vitals Tracker Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Vitals & Health Logs</h2>
          <p className="text-sm text-slate-500 mt-1">Track chronic metrics and log physical markers to monitor your long-term wellness.</p>
        </div>
        <button
          onClick={() => setShowLogForm(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Log Entry</span>
        </button>
      </div>

      {/* Log Form Modal / Backdrop */}
      {showLogForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Daily Vitals Logger</h3>
              <button 
                onClick={() => setShowLogForm(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Date Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block font-mono">Log Entry Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Grid 1: BP & Heart Rate */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Systolic BP</label>
                  <input
                    type="number"
                    required
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(e.target.value)}
                    placeholder="e.g. 120"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Diastolic BP</label>
                  <input
                    type="number"
                    required
                    value={diastolicBP}
                    onChange={(e) => setDiastolicBP(e.target.value)}
                    placeholder="e.g. 80"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Heart Rate</label>
                  <input
                    type="number"
                    required
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">BPM</span>
                </div>
              </div>

              {/* Grid 2: Glucose & Temp */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Fasting Glucose</label>
                  <input
                    type="number"
                    required
                    value={bloodGlucose}
                    onChange={(e) => setBloodGlucose(e.target.value)}
                    placeholder="e.g. 95"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">mg/dL</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Body Temp</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 36.5"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">°C</span>
                </div>
              </div>

              {/* Grid 3: Water, Sleep, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Water Intake</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={waterIntake}
                    onChange={(e) => setWaterIntake(e.target.value)}
                    placeholder="e.g. 2.5"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">Liters</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    placeholder="e.g. 7.5"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">Hours</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 74.0"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400 font-mono">kg</span>
                </div>
              </div>

              {/* Mood Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 block font-mono">General Daily Mood</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["Excellent", "Good", "Fair", "Poor"] as VitalLog["mood"][]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`py-2 text-xs font-semibold border rounded-lg transition-colors ${
                        mood === m
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Log */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors pt-3"
              >
                Save Daily Health Log
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {vitals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Blood Pressure Trends */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h4 className="text-sm font-bold text-slate-800">Blood Pressure History</h4>
              <span className="text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-full font-mono">
                Target: &lt;120/80
              </span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis domain={[60, 150]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", borderColor: "#f1f5f9" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="systolicBP" stroke="#f43f5e" strokeWidth={2.5} name="Systolic BP" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="diastolicBP" stroke="#fb7185" strokeWidth={2} name="Diastolic BP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Blood Glucose Trends */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h4 className="text-sm font-bold text-slate-800">Blood Glucose History</h4>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full font-mono">
                Fasting Normal: 70-99
              </span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis domain={[60, 140]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", borderColor: "#f1f5f9" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="bloodGlucose" stroke="#10b981" strokeWidth={2.5} name="Fasting Glucose" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heart Rate and Body Temperature */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h4 className="text-sm font-bold text-slate-800">Heart Rate Trends</h4>
              <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full font-mono">
                BPM Resting
              </span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vitals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", borderColor: "#f1f5f9" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="heartRate" stroke="#3b82f6" strokeWidth={2.5} name="Pulse Rate" activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Water Intake & Sleep */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <h4 className="text-sm font-bold text-slate-800">Daily Sleep & Hydration Analytics</h4>
              <span className="text-[10px] font-semibold bg-sky-50 text-sky-600 border border-sky-100 px-1.5 py-0.5 rounded-full font-mono">
                Dual Metric
              </span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vitals} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ fontSize: "12px", borderRadius: "8px", borderColor: "#f1f5f9" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="waterIntake" fill="#0284c7" name="Water (Liters)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sleepHours" fill="#6366f1" name="Sleep (Hours)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto">
          <TrendingUp className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h4 className="font-semibold text-slate-800 text-sm">No historical analytics available</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Add logs using the "Daily Vitals Logger" form to see beautiful trend graphs and analyze blood pressure, glucose, and pulse data.
          </p>
        </div>
      )}

      {/* Log History list */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-800">Historical Log History</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono font-bold uppercase">
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Blood Pressure</th>
                <th className="py-3 px-2">Glucose (Fasting)</th>
                <th className="py-3 px-2">Heart Rate</th>
                <th className="py-3 px-2">Water</th>
                <th className="py-3 px-2">Sleep</th>
                <th className="py-3 px-2">Temp / Weight</th>
                <th className="py-3 px-2">Mood</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {[...vitals].reverse().map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-slate-500">{v.date}</td>
                  <td className="py-3 px-2 text-rose-600 font-bold">{v.systolicBP}/{v.diastolicBP} mmHg</td>
                  <td className="py-3 px-2 text-emerald-600 font-bold">{v.bloodGlucose} mg/dL</td>
                  <td className="py-3 px-2 text-blue-600">{v.heartRate} bpm</td>
                  <td className="py-3 px-2 font-mono">{v.waterIntake}L</td>
                  <td className="py-3 px-2 font-mono">{v.sleepHours}h</td>
                  <td className="py-3 px-2 font-mono text-slate-400">{v.temperature}°C / {v.weight}kg</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      v.mood === "Excellent" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      v.mood === "Good" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      v.mood === "Fair" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {v.mood}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
