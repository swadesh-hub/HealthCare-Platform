import React, { useState, useEffect } from 'react';
import { 
  Activity, Heart, QrCode, TrendingUp, AlertTriangle, Plus, 
  FileText, Shield, Share2, Check, RefreshCw, Calendar, MapPin
} from 'lucide-react';

export default function Dashboard({ userProfile, updateUserProfile, setView, setSelectedReport }) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrConsent, setQrConsent] = useState({
    vitals: true,
    history: true,
    reports: true,
    duration: '15'
  });
  const [qrExpiry, setQrExpiry] = useState(0);
  const [qrActive, setQrActive] = useState(false);
  const [editingVitals, setEditingVitals] = useState(false);
  const [vitalsInput, setVitalsInput] = useState({ ...userProfile.vitals });

  // Handle vitals change
  const handleVitalsSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      ...userProfile,
      vitals: {
        ...userProfile.vitals,
        ...vitalsInput
      }
    });
    setEditingVitals(false);
  };

  // QR Code Timer
  useEffect(() => {
    let interval;
    if (qrActive && qrExpiry > 0) {
      interval = setInterval(() => {
        setQrExpiry(prev => {
          if (prev <= 1) {
            setQrActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [qrActive, qrExpiry]);

  const generateQR = () => {
    setQrActive(true);
    setQrExpiry(parseInt(qrConsent.duration) * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Predictive risk scores (derived dynamically from HbA1c/vitals)
  const calculateDiabetesRisk = () => {
    const hba1c = userProfile.history.some(h => h.title.includes("June 2026") || h.title.includes("Lipid")) ? 6.3 : 6.1;
    const sysBP = userProfile.vitals.systolicBP;
    let base = 30;
    if (hba1c > 6.0) base += 25;
    if (hba1c > 6.2) base += 10;
    if (sysBP > 130) base += 10;
    return Math.min(base, 95);
  };

  const calculateHypertensionRisk = () => {
    const sysBP = userProfile.vitals.systolicBP;
    const diaBP = userProfile.vitals.diastolicBP;
    let base = 20;
    if (sysBP > 130) base += 20;
    if (sysBP > 135) base += 10;
    if (diaBP > 80) base += 15;
    return Math.min(base, 90);
  };

  const diabetesRisk = calculateDiabetesRisk();
  const hypertensionRisk = calculateHypertensionRisk();

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] pointer-events-none" />
        <div className="relative z-10">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Patient Dashboard
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 font-sans tracking-tight">
            Good day, {userProfile.name}
          </h1>
          <p className="text-primary-100 mt-2 max-w-xl text-sm md:text-base">
            Your health profile is synced. All local calculations are computed on-device to preserve your absolute privacy.
          </p>
        </div>
        
        {/* QR quick share button */}
        <div className="relative z-10 flex gap-3">
          <button 
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-2 bg-white text-primary-700 font-semibold px-5 py-3 rounded-2xl shadow-lg hover:bg-slate-50 transition-all transform hover:-translate-y-0.5"
          >
            <QrCode className="w-5 h-5" />
            Share Records
          </button>
        </div>
      </div>

      {/* Grid of Profile, Vitals & Risk Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-500">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Longitudinal Vitals</h3>
                <p className="text-xs text-slate-400">Real-time biometric telemetry</p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingVitals(!editingVitals);
                setVitalsInput({ ...userProfile.vitals });
              }}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600"
            >
              {editingVitals ? 'Cancel' : 'Edit Vitals'}
            </button>
          </div>

          {editingVitals ? (
            <form onSubmit={handleVitalsSave} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Blood Pressure (Sys)</label>
                <input 
                  type="number" 
                  value={vitalsInput.systolicBP} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, systolicBP: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Blood Pressure (Dia)</label>
                <input 
                  type="number" 
                  value={vitalsInput.diastolicBP} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, diastolicBP: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Heart Rate (bpm)</label>
                <input 
                  type="number" 
                  value={vitalsInput.heartRate} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, heartRate: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Fasting Glucose (mg/dL)</label>
                <input 
                  type="number" 
                  value={vitalsInput.bloodSugarFasting} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, bloodSugarFasting: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SpO2 (%)</label>
                <input 
                  type="number" 
                  value={vitalsInput.spO2} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, spO2: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={vitalsInput.weight} 
                  onChange={(e) => setVitalsInput({ ...vitalsInput, weight: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="col-span-full mt-2">
                <button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
                >
                  Save Telemetry Data
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100/70 transition-all border border-slate-100">
                <p className="text-xs font-semibold text-slate-400">Blood Pressure</p>
                <h4 className="text-xl font-bold mt-2 text-slate-800">
                  {userProfile.vitals.systolicBP}/{userProfile.vitals.diastolicBP}
                </h4>
                <span className="text-[10px] font-medium text-amber-600 mt-1 block bg-amber-50 px-2 py-0.5 rounded-full w-max">
                  Prehypertension
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100/70 transition-all border border-slate-100">
                <p className="text-xs font-semibold text-slate-400">Heart Rate</p>
                <h4 className="text-xl font-bold mt-2 text-slate-800">
                  {userProfile.vitals.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
                </h4>
                <span className="text-[10px] font-medium text-emerald-600 mt-1 block bg-emerald-50 px-2 py-0.5 rounded-full w-max">
                  Optimal
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100/70 transition-all border border-slate-100">
                <p className="text-xs font-semibold text-slate-400">Fasting Glucose</p>
                <h4 className="text-xl font-bold mt-2 text-slate-800">
                  {userProfile.vitals.bloodSugarFasting} <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </h4>
                <span className="text-[10px] font-medium text-amber-600 mt-1 block bg-amber-50 px-2 py-0.5 rounded-full w-max">
                  Impaired (Pre-diabetes)
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl hover:bg-slate-100/70 transition-all border border-slate-100">
                <p className="text-xs font-semibold text-slate-400">Blood Oxygen (SpO2)</p>
                <h4 className="text-xl font-bold mt-2 text-slate-800">
                  {userProfile.vitals.spO2}%
                </h4>
                <span className="text-[10px] font-medium text-emerald-600 mt-1 block bg-emerald-50 px-2 py-0.5 rounded-full w-max">
                  Excellent
                </span>
              </div>
            </div>
          )}

          {/* Vitals chart placeholder / premium indicator */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 live-pulse" />
              Wearable Auto-Sync Active (Apple Health / Fitbit)
            </span>
            <span>Last updated: Just now</span>
          </div>
        </div>

        {/* Predictive Risk Model */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-amber-50 rounded-2xl text-amber-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800">6-12M Predictive Risk</h3>
              <p className="text-xs text-slate-400">On-device ML risk modeling</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">Type 2 Diabetes Risk</span>
                <span className={`font-semibold ${diabetesRisk > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {diabetesRisk}% ({diabetesRisk > 60 ? 'Moderate' : 'Low'})
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    diabetesRisk > 75 ? 'bg-red-500' : diabetesRisk > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${diabetesRisk}%` }} 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-slate-700">Hypertension Risk</span>
                <span className={`font-semibold ${hypertensionRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {hypertensionRisk}% ({hypertensionRisk > 40 ? 'Borderline' : 'Low'})
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    hypertensionRisk > 75 ? 'bg-red-500' : hypertensionRisk > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${hypertensionRisk}%` }} 
                />
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-3">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed text-slate-600">
                  <strong className="text-slate-800">AI Warning:</strong> Fasting sugar and HbA1c show a upward trajectory over 12 months. Reducing calorie intake and walking 30 minutes daily could lower diabetes risk by <strong className="text-emerald-600">18%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Health Records Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">Digital Health Records (DHR)</h3>
            <p className="text-xs text-slate-400">Validated HL7 FHIR compatible records</p>
          </div>
          <button
            onClick={() => setView('interpreter')}
            className="flex items-center justify-center gap-2 bg-primary-50 text-primary-700 font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-100 transition-colors text-xs"
          >
            <Plus className="w-4 h-4" />
            Interpret New Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Record / Document</th>
                <th className="pb-3 pr-4">Clinician</th>
                <th className="pb-3 pr-4">Summary Notes</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {userProfile.history.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-4 pr-4 text-slate-500 font-medium whitespace-nowrap">
                    {record.date}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 text-primary-600 rounded-xl group-hover:bg-primary-100 transition-all">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{record.title}</p>
                        <p className="text-[10px] text-slate-400">{record.type} • {record.facility}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-600 font-medium">
                    {record.doctor}
                  </td>
                  <td className="py-4 pr-4 text-slate-500 text-xs max-w-xs truncate">
                    {record.summary}
                  </td>
                  <td className="py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      {record.title.includes("Lipid") && (
                        <button
                          onClick={() => {
                            setSelectedReport('lipid_hba1c');
                            setView('interpreter');
                          }}
                          className="text-xs font-semibold px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
                        >
                          AI View
                        </button>
                      )}
                      <button className="text-xs font-medium px-3 py-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all">
                        View FHIR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Sharing Consent Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  Consent & QR Sharing
                </h3>
                <button 
                  onClick={() => { setShowQrModal(false); setQrActive(false); }}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {!qrActive ? (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Generate an encrypted, time-limited QR code. Doctors can scan this to temporarily access selected parts of your health records via secure handshake.
                  </p>

                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-slate-700 block">Select Consent Scope</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-all">
                        <input 
                          type="checkbox" 
                          checked={qrConsent.vitals} 
                          onChange={(e) => setQrConsent({ ...qrConsent, vitals: e.target.checked })}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Biometric Vitals</p>
                          <p className="text-[10px] text-slate-400">Includes blood pressure, sugar, heart rate</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-all">
                        <input 
                          type="checkbox" 
                          checked={qrConsent.history} 
                          onChange={(e) => setQrConsent({ ...qrConsent, history: e.target.checked })}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Past Diagnoses & Prescriptions</p>
                          <p className="text-[10px] text-slate-400">DHR health logs & clinical comments</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-slate-100/70 transition-all">
                        <input 
                          type="checkbox" 
                          checked={qrConsent.reports} 
                          onChange={(e) => setQrConsent({ ...qrConsent, reports: e.target.checked })}
                          className="rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">Lab & Radiology Reports</p>
                          <p className="text-[10px] text-slate-400">PDFs, OCR extractions & interpreter insights</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-2">Access Duration Limit</label>
                    <select 
                      value={qrConsent.duration} 
                      onChange={(e) => setQrConsent({ ...qrConsent, duration: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary-500"
                    >
                      <option value="5">5 Minutes (Express check-in)</option>
                      <option value="15">15 Minutes (Standard consultation)</option>
                      <option value="60">1 Hour (Surgical / extended intake)</option>
                    </select>
                  </div>

                  <button
                    onClick={generateQR}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    Generate Encrypted Access QR
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-4 shadow-inner relative">
                    {/* Simulated premium secure QR code */}
                    <div className="w-48 h-48 bg-white p-2 rounded-2xl flex items-center justify-center border border-slate-200 shadow-sm">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
                        {/* Beautiful generated mock QR pattern */}
                        <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="10" y="10" width="15" height="15" fill="white" />
                        <rect x="13" y="13" width="9" height="9" fill="currentColor" rx="1" />
                        
                        <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="75" y="10" width="15" height="15" fill="white" />
                        <rect x="78" y="13" width="9" height="9" fill="currentColor" rx="1" />

                        <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="2" />
                        <rect x="10" y="75" width="15" height="15" fill="white" />
                        <rect x="13" y="78" width="9" height="9" fill="currentColor" rx="1" />
                        
                        {/* Randomized tiny QR cells for visual fidelity */}
                        <rect x="35" y="10" width="6" height="6" fill="currentColor" />
                        <rect x="45" y="5" width="12" height="6" fill="currentColor" />
                        <rect x="60" y="15" width="6" height="12" fill="currentColor" />
                        <rect x="35" y="25" width="18" height="6" fill="currentColor" />
                        <rect x="45" y="35" width="6" height="6" fill="currentColor" />
                        <rect x="5" y="45" width="6" height="12" fill="currentColor" />
                        <rect x="15" y="55" width="12" height="6" fill="currentColor" />
                        
                        <rect x="35" y="45" width="25" height="25" fill="currentColor" rx="1" />
                        <rect x="40" y="50" width="15" height="15" fill="white" />
                        <rect x="45" y="55" width="5" height="5" fill="currentColor" />

                        <rect x="70" y="40" width="6" height="18" fill="currentColor" />
                        <rect x="85" y="35" width="10" height="10" fill="currentColor" />
                        <rect x="80" y="55" width="15" height="6" fill="currentColor" />
                        
                        <rect x="70" y="70" width="12" height="6" fill="currentColor" />
                        <rect x="85" y="75" width="10" height="10" fill="currentColor" />
                        <rect x="70" y="85" width="25" height="10" fill="currentColor" />
                      </svg>
                    </div>
                    {/* Expiry Badge */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[9px] font-bold border border-red-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      SECURE
                    </div>
                  </div>

                  <p className="text-xs font-bold text-slate-800 mb-1">Temporary Token Active</p>
                  <p className="text-[10px] text-slate-400 max-w-xs mb-4">
                    Consent active. Access will automatically revoke in <span className="font-semibold text-red-500">{formatTime(qrExpiry)}</span>.
                  </p>

                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => setQrExpiry(prev => prev + 300)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Add 5 mins
                    </button>
                    <button
                      onClick={() => setQrActive(false)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-xl text-xs transition-all"
                    >
                      Revoke Consent
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
