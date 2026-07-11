import React, { useState } from "react";
import { Appointment, Medication } from "../types";
import { 
  Stethoscope, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  AlertCircle
} from "lucide-react";

interface DoctorDashboardProps {
  appointments: Appointment[];
  onCompleteAppointment: (appointmentId: string, prescription: Appointment["prescription"]) => void;
}

export default function DoctorDashboard({ 
  appointments, 
  onCompleteAppointment 
}: DoctorDashboardProps) {
  const [activeConsultation, setActiveConsultation] = useState<Appointment | null>(null);
  
  // Prescription builder state
  const [medsList, setMedsList] = useState<Medication[]>([]);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [medFreq, setMedFreq] = useState("Once daily");
  const [medDur, setMedDur] = useState("7 days");
  const [doctorNotes, setDoctorNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const scheduledAppts = appointments.filter(a => a.status === "scheduled");
  const completedAppts = appointments.filter(a => a.status === "completed");

  const handleAddMedication = () => {
    if (!medName.trim() || !medDosage.trim()) return;
    setMedsList([
      ...medsList,
      {
        name: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFreq,
        duration: medDur
      }
    ]);
    
    // Reset medication builder inputs
    setMedName("");
    setMedDosage("");
  };

  const handleRemoveMedication = (idx: number) => {
    setMedsList(medsList.filter((_, i) => i !== idx));
  };

  const handleCompleteConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConsultation) return;

    const prescriptionData = {
      medications: medsList,
      notes: doctorNotes,
      followUpDate: followUpDate || undefined,
      prescribedBy: activeConsultation.doctorName,
      date: new Date().toISOString().split('T')[0]
    };

    onCompleteAppointment(activeConsultation.id, prescriptionData);

    // Reset state
    setActiveConsultation(null);
    setMedsList([]);
    setDoctorNotes("");
    setFollowUpDate("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-mono tracking-widest uppercase text-slate-400">Clinical Administrator Portal</span>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Stethoscope className="w-6 h-6 text-sky-400" />
            <span>Simulated Practitioner Panel</span>
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            This module simulates a physician's workstation. Select scheduled appointments, perform consultation assessments, write digital prescriptions, and record diagnoses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Roster Queue Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Scheduled Appointments Queue */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Patients Queue ({scheduledAppts.length})
            </h3>
            
            {scheduledAppts.length > 0 ? (
              <div className="space-y-3">
                {scheduledAppts.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => {
                      setActiveConsultation(app);
                      setMedsList([]);
                      setDoctorNotes("");
                      setFollowUpDate("");
                    }}
                    className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-blue-500/50 transition-all ${
                      activeConsultation?.id === app.id ? "border-blue-500 ring-2 ring-blue-500/5" : "border-slate-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{app.patientName}</h4>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5">Assigned: {app.doctorName}</div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {app.timeSlot}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 italic">
                      "Complaint: {app.chiefComplaint}"
                    </p>
                    <button className="mt-3 text-[11px] font-bold text-blue-600 hover:underline">
                      Consult Patient →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50">
                No patients waiting in queue. Schedule an appointment in the Booking tab first!
              </div>
            )}
          </div>

          {/* Completed History */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Completed Records Today
            </h3>
            {completedAppts.length > 0 ? (
              <div className="space-y-2">
                {completedAppts.map((app) => (
                  <div key={app.id} className="bg-slate-50 border border-slate-100/60 p-3 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">{app.patientName}</span>
                      <span className="text-[10px] text-slate-400">Handled by: {app.doctorName}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400 text-xs italic">
                No consultations completed in this session.
              </div>
            )}
          </div>

        </div>

        {/* Prescription Worksheet Column */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[450px]">
            {activeConsultation ? (
              <form onSubmit={handleCompleteConsultation} className="space-y-6">
                <div className="border-b border-slate-50 pb-4 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Visitation Worksheet</h3>
                    <div className="text-xs text-slate-500 flex items-center space-x-2 mt-1">
                      <span className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5" />
                        <span>{activeConsultation.patientName}</span>
                      </span>
                      <span>•</span>
                      <span>Assigned specialty: {activeConsultation.doctorSpecialty}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setActiveConsultation(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear Work
                  </button>
                </div>

                {/* Chief Complaint display */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Patient Chief Complaint</span>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-amber-50/30 p-3 border border-amber-100/40 rounded-xl">
                    "{activeConsultation.chiefComplaint}"
                  </p>
                </div>

                {/* Prescription Builder */}
                <div className="space-y-4 pt-3 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Digital Prescription Builder</span>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{medsList.length} items added</span>
                  </div>

                  {/* Medications list */}
                  {medsList.length > 0 && (
                    <div className="space-y-2 border border-slate-100 rounded-xl p-3">
                      {medsList.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                          <div>
                            <span className="font-semibold text-slate-800">{med.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2">({med.dosage}) - {med.frequency} for {med.duration}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(idx)}
                            className="text-slate-400 hover:text-red-500 p-0.5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Medication mini-form */}
                  <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500 font-mono">Medication Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Paracetamol"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500 font-mono">Dosage Strength</label>
                        <input
                          type="text"
                          placeholder="e.g. 500mg, 1 tablet"
                          value={medDosage}
                          onChange={(e) => setMedDosage(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500 font-mono">Frequency</label>
                        <select
                          value={medFreq}
                          onChange={(e) => setMedFreq(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                        >
                          <option value="Once daily">Once daily</option>
                          <option value="Once daily after dinner">Once daily after dinner</option>
                          <option value="Twice daily (1-0-1)">Twice daily (1-0-1)</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="As needed (PRN)">As needed (PRN)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-semibold text-slate-500 font-mono">Duration</label>
                        <input
                          type="text"
                          value={medDur}
                          onChange={(e) => setMedDur(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="py-1.5 px-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 font-bold rounded-lg transition-colors inline-block w-fit"
                    >
                      + Add Medication
                    </button>
                  </div>
                </div>

                {/* Follow-up Date & Doctor Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-50">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 font-mono block">Follow-up Visitation</label>
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-500 font-mono block">Clinical Recommendations Notes</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ensure physical rest, high water hydration index, review blood pressure..."
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Save consult button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Consultation & Prescribe</span>
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
                  <Stethoscope className="w-8 h-8 text-slate-500" />
                </div>
                <div className="text-xs font-semibold text-slate-500">Practitioner Worksheet Empty</div>
                <p className="text-[11px] text-slate-400 max-w-sm mt-1 leading-relaxed">
                  Select an active patient from the Patients Queue list on the left to start checking chief complaints and writing digital clinical prescriptions.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
