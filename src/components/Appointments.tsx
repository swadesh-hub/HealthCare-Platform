import React, { useState } from "react";
import { Doctor, Appointment } from "../types";
import { SEED_DOCTORS } from "../data";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  DollarSign, 
  CheckCircle, 
  FileText,
  AlertCircle
} from "lucide-react";

interface AppointmentsProps {
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (doctorId: string, date: string, timeSlot: string, chiefComplaint: string) => void;
  onCancelAppointment: (appointmentId: string) => void;
}

export default function Appointments({ 
  doctors = SEED_DOCTORS, 
  appointments, 
  onBookAppointment,
  onCancelAppointment
}: AppointmentsProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingSlot, setBookingSlot] = useState<string>("");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [activeSegment, setActiveSegment] = useState<"book" | "my">("book");
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState<Appointment | null>(null);

  // Filter lists
  const scheduledAppts = appointments.filter(a => a.status === "scheduled");
  const completedAppts = appointments.filter(a => a.status === "completed");

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !bookingSlot || !chiefComplaint.trim()) return;
    
    onBookAppointment(selectedDoctor.id, bookingDate, bookingSlot, chiefComplaint);
    
    // Reset booking state
    setBookingDate("");
    setBookingSlot("");
    setChiefComplaint("");
    setSelectedDoctor(null);
    setActiveSegment("my");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Roster Header and Segment Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Clinical Consultations</h2>
          <p className="text-sm text-slate-500 mt-1">Book specialized practitioners or check your active prescription records.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveSegment("book")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeSegment === "book" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Practitioners Roster
          </button>
          <button
            onClick={() => setActiveSegment("my")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeSegment === "my" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <span>My Consultations</span>
            <span className="bg-blue-100 text-blue-800 font-mono text-[10px] px-1.5 py-0.5 rounded-full">
              {appointments.length}
            </span>
          </button>
        </div>
      </div>

      {activeSegment === "book" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Doctors List Column */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
              Available Medical Specialists
            </h3>
            
            <div className="space-y-4">
              {doctors.map((doc) => (
                <div 
                  key={doc.id}
                  className={`bg-white border rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 cursor-pointer ${
                    selectedDoctor?.id === doc.id ? "border-blue-500 ring-2 ring-blue-500/5" : "border-slate-100"
                  }`}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setBookingSlot("");
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <img 
                      src={doc.image} 
                      alt={doc.name} 
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-semibold text-slate-800 truncate">{doc.name}</h4>
                        <div className="flex items-center space-x-1 text-amber-500 text-xs">
                          <Star className="w-4.5 h-4.5 fill-amber-500" />
                          <span className="font-bold">{doc.rating.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-blue-600 font-mono mt-0.5">{doc.specialty}</div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{doc.bio}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{doc.location}</span>
                        </span>
                        <span className="flex items-center space-x-0.5 text-slate-700 font-semibold font-mono">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{doc.price} / Visit</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="font-bold text-slate-800 text-base">Booking Scheduler</h3>
                <p className="text-xs text-slate-400 mt-1">Select a practitioner from the roster list to schedule a slot.</p>
              </div>

              {selectedDoctor ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Selected Doctor Summary */}
                  <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-3 flex items-center space-x-3">
                    <img 
                      src={selectedDoctor.image} 
                      alt={selectedDoctor.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-blue-900">{selectedDoctor.name}</div>
                      <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider font-mono">{selectedDoctor.specialty}</div>
                    </div>
                  </div>

                  {/* Booking Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block font-mono">Appointment Date</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-sans"
                    />
                  </div>

                  {/* Available Time Slots */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 block font-mono">Available Time Slots</label>
                    {bookingDate ? (
                      <div className="grid grid-cols-2 gap-2">
                        {selectedDoctor.availability.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingSlot(slot)}
                            className={`py-2 text-xs font-semibold border rounded-lg transition-colors ${
                              bookingSlot === slot
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-slate-200 hover:border-slate-300 text-slate-600"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-lg text-center border border-slate-100">
                        Please specify an appointment date first.
                      </div>
                    )}
                  </div>

                  {/* Chief Complaint */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block font-mono">Chief Complaint / Symptoms</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Please describe symptoms, previous diagnoses, or reasons for scheduling..."
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!bookingDate || !bookingSlot || !chiefComplaint.trim()}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm Booking Schedule
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500">No Practitioner Selected</div>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Select a specialist from the practitioners roster on the left to set up an appointment slot.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* My Appointments / Consultations List */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main List of Scheduled/Past Appointments */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Scheduled appointments */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Active / Scheduled Appointments
              </h3>
              
              {scheduledAppts.length > 0 ? (
                <div className="space-y-4">
                  {scheduledAppts.map((app) => (
                    <div key={app.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {app.doctorName.split(' ').pop()?.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{app.doctorName}</h4>
                            <div className="text-xs font-medium text-slate-500">{app.doctorSpecialty}</div>
                            <p className="text-xs text-slate-400 mt-2 italic">
                              Complaint: "{app.chiefComplaint}"
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono">
                          Scheduled
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3 text-slate-500 font-mono">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{app.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{app.timeSlot}</span>
                          </span>
                        </div>
                        <button
                          onClick={() => onCancelAppointment(app.id)}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider font-mono hover:bg-red-50 px-2.5 py-1 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-xl bg-slate-50">
                  No active scheduled appointments.
                </div>
              )}
            </div>

            {/* Historical completed consultations */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Past Consultations & Diagnoses
              </h3>

              {completedAppts.length > 0 ? (
                <div className="space-y-4">
                  {completedAppts.map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => setSelectedPrescriptionAppt(app)}
                      className={`bg-white border rounded-2xl p-5 hover:shadow-xs transition-all cursor-pointer ${
                        selectedPrescriptionAppt?.id === app.id ? "border-emerald-500 ring-2 ring-emerald-500/5" : "border-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {app.doctorName.split(' ').pop()?.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-sm">{app.doctorName}</h4>
                            <div className="text-xs font-medium text-slate-500">{app.doctorSpecialty}</div>
                            <p className="text-xs text-slate-400 mt-2 truncate max-w-md">
                              Complaint: "{app.chiefComplaint}"
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono">
                          Completed
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-mono">
                        <span>Visit Date: {app.date}</span>
                        {app.prescription ? (
                          <span className="text-emerald-600 font-bold flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Prescription Logged</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Diagnosis Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  No previous consultation records.
                </div>
              )}
            </div>

          </div>

          {/* Detailed Prescription Display Card Column */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="font-bold text-slate-800 text-base">Prescription Details</h3>
                <p className="text-xs text-slate-400 mt-1">Review diagnostic insights and medication protocols.</p>
              </div>

              {selectedPrescriptionAppt ? (
                selectedPrescriptionAppt.prescription ? (
                  <div className="space-y-5">
                    {/* Prescription Metadata */}
                    <div className="bg-slate-50 rounded-xl p-3.5 space-y-1 text-xs border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Prescribing Doctor:</span>
                        <span className="font-bold text-slate-700">{selectedPrescriptionAppt.prescription.prescribedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Issue Date:</span>
                        <span className="font-bold text-slate-700">{selectedPrescriptionAppt.prescription.date}</span>
                      </div>
                      {selectedPrescriptionAppt.prescription.followUpDate && (
                        <div className="flex justify-between text-blue-600 font-semibold pt-1 border-t border-slate-100/60 mt-1">
                          <span>Follow-up Date:</span>
                          <span>{selectedPrescriptionAppt.prescription.followUpDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Medications Table */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Medication Protocol</span>
                      <div className="space-y-2">
                        {selectedPrescriptionAppt.prescription.medications.map((med, idx) => (
                          <div key={idx} className="p-3 rounded-xl border border-slate-100 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-slate-800 text-sm">{med.name}</span>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 rounded">{med.dosage}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500">
                              <span>🔄 {med.frequency}</span>
                              <span>⏳ {med.duration}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Doctor Clinical Notes */}
                    {selectedPrescriptionAppt.prescription.notes && (
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Clinical Notes</span>
                        <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100/30">
                          {selectedPrescriptionAppt.prescription.notes}
                        </p>
                      </div>
                    )}

                    {/* Print / Export Hint */}
                    <button
                      onClick={() => alert("Simulating document export. In a production environment, this generates a secure, signed digital prescription PDF.")}
                      className="w-full py-2.5 px-4 text-center bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                    >
                      Export PDF Clinical Record
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto mb-3">
                      <AlertCircle className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">Prescription Pending</div>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-1 mx-auto">
                      This visitation record does not contain an active prescription record.
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-fit mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-500 font-mono">No Selection</div>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1 mx-auto">
                    Select a completed visit record from the consultation logs on the left to review prescriptions.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
