import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, Clock, MapPin, Sparkles, AlertCircle, 
  CheckCircle, Bell, ArrowRight, Share2, Mail, ExternalLink
} from 'lucide-react';
import { HOSPITALS } from '../data/mockData';

export default function AppointmentBooking({ 
  userProfile, selectedHospital, selectedDoctor, 
  setSelectedHospital, setSelectedDoctor, setAppointmentsList 
}) {
  const [hospital, setHospital] = useState(selectedHospital || HOSPITALS[0]);
  const [doctor, setDoctor] = useState(selectedDoctor || HOSPITALS[0].doctors[0]);
  const [consultMode, setConsultMode] = useState('in_person'); // in_person or video
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [lastBookedAppt, setLastBookedAppt] = useState(null);
  const [notifications, setNotifications] = useState({ sms: true, email: true, push: true });
  const [inVideoRoom, setInVideoRoom] = useState(false);

  // Synchronize component state if parent sends updates
  useEffect(() => {
    if (selectedHospital) setHospital(selectedHospital);
    if (selectedDoctor) setDoctor(selectedDoctor);
  }, [selectedHospital, selectedDoctor]);

  // Adjust doctor choice if hospital changes
  const handleHospitalChange = (e) => {
    const hosp = HOSPITALS.find(h => h.id === e.target.value);
    setHospital(hosp);
    setDoctor(hosp.doctors[0]);
    setSelectedSlot(null);
  };

  const handleDoctorChange = (e) => {
    const doc = hospital.doctors.find(d => d.id === e.target.value);
    setDoctor(doc);
    setSelectedSlot(null);
  };

  // AI-recommended optimal slot logic
  const getAiOptimalSlot = () => {
    if (!doctor) return null;
    // Let's recommend the afternoon slot if available, or the 3rd slot
    if (doctor.availability.length >= 3) {
      return {
        slot: doctor.availability[2],
        reason: `Commute from your HSR Location (${hospital.distance} km) will face heavy congestion at 09:00 AM. Based on your past calendar patterns, you have a 100% attendance rate for appointments after 2:30 PM compared to 60% in mornings.`
      };
    }
    return {
      slot: doctor.availability[0],
      reason: `Recommended based on doctor's optimal diagnostic caseload and your minimum local commute delays.`
    };
  };

  const aiOptimal = getAiOptimalSlot();

  // Booking action
  const handleConfirmBooking = () => {
    if (!selectedSlot) return;

    const newAppointment = {
      id: `appt-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospitalName: hospital.name,
      address: hospital.address,
      date: "Tomorrow (June 12, 2026)",
      time: selectedSlot,
      mode: consultMode === 'video' ? 'Video Consultation' : 'In-Person Visit',
      fee: doctor.consultationFee,
      telehealthLink: consultMode === 'video' ? 'https://telehealth.healthcompanion.ai/room/v-8829' : null
    };

    // Save in parent state
    setAppointmentsList(prev => [newAppointment, ...prev]);
    setLastBookedAppt(newAppointment);
    setBookingConfirmed(true);
  };

  return (
    <div className="space-y-6">
      {!bookingConfirmed ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scheduling Configuration Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <Calendar className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-bold text-lg text-slate-800">Schedule Consultation</h3>
                <p className="text-xs text-slate-400">Book physical clinics or encrypted video consultations</p>
              </div>
            </div>

            {/* Select hospital / doctor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Hospital</label>
                <select
                  value={hospital.id}
                  onChange={handleHospitalChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500"
                >
                  {HOSPITALS.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Doctor</label>
                <select
                  value={doctor?.id}
                  onChange={handleDoctorChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500"
                >
                  {hospital.doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Consultation Mode Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Consultation Channel</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConsultMode('in_person')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    consultMode === 'in_person'
                      ? 'border-primary-500 bg-primary-50/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${consultMode === 'in_person' ? 'text-primary-600' : 'text-slate-400'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Physical Visit</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Meet at: {hospital.address.split(',')[0]}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultMode('video')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                    consultMode === 'video'
                      ? 'border-accent-500 bg-accent-50/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <Video className={`w-5 h-5 ${consultMode === 'video' ? 'text-accent-600' : 'text-slate-400'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">HD Video Consultation</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">Encrypted, FHIR sync post consult</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Availability Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Time Slots (June 12)</label>
              <div className="flex flex-wrap gap-2.5">
                {doctor?.availability.map(slot => {
                  const isOptimal = aiOptimal?.slot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`relative px-4 py-3 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center justify-center min-w-[90px] ${
                        selectedSlot === slot
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                          : isOptimal
                            ? 'bg-white border-amber-400 text-amber-600 hover:bg-amber-50/20'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                      {isOptimal && (
                        <span className="absolute -top-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">
                          AI SUGGESTED
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Confirmation Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation Fee</p>
                <h4 className="text-2xl font-extrabold text-slate-800">₹{doctor?.consultationFee}</h4>
              </div>
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={!selectedSlot}
                className={`py-3 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-1.5 ${
                  selectedSlot 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white transform hover:-translate-y-0.5' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Confirm Booking
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Scheduling Helper */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 flex flex-col justify-between h-[450px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base text-slate-800">AI Scheduling Assist</h3>
              </div>

              {aiOptimal ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2.5">
                    <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                      OPTIMAL SLOT MODELING
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-800">Why {aiOptimal.slot} is best for you:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {aiOptimal.reason}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-500 space-y-2">
                    <div className="flex justify-between">
                      <span>Morning Commute Delays:</span>
                      <strong className="text-red-500 font-semibold">+35 mins (High traffic)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Afternoon Commute Delays:</span>
                      <strong className="text-emerald-500 font-semibold">+8 mins (Low traffic)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Calendar Match Score:</span>
                      <strong className="text-slate-800 font-bold">98%</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a doctor to load scheduling suggestions.</p>
              )}
            </div>

            {/* Smart Reminders settings */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-primary-600" />
                Automation Reminders
              </h5>
              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-slate-600">WhatsApp & SMS Alert (2h before)</span>
                  <input
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                </label>
                <label className="flex items-center justify-between text-xs cursor-pointer">
                  <span className="text-slate-600">Email Calendar Invite (.ics)</span>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Booking Success Confirmation view */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
          {inVideoRoom ? (
            /* HD Video Telehealth Room Simulation */
            <div className="bg-slate-950 text-white h-[480px] relative flex flex-col justify-between p-4">
              <div className="absolute inset-0 bg-slate-900 overflow-hidden flex items-center justify-center">
                {/* Doctor video frame placeholder */}
                <div className="w-full h-full bg-slate-850 flex flex-col items-center justify-center">
                  {/* Doctor placeholder graphic */}
                  <div className="w-24 h-24 bg-primary-100/10 rounded-full border border-primary-500/20 flex items-center justify-center mb-4">
                    <Video className="w-10 h-10 text-primary-400" />
                  </div>
                  <h4 className="font-extrabold text-lg">{doctor.name}</h4>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse" />
                    Connecting Secure FHIR Telehealth Room...
                  </p>
                </div>

                {/* Self View Frame */}
                <div className="absolute bottom-4 right-4 w-36 h-28 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
                  <div className="text-center p-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 mx-auto flex items-center justify-center">
                      🤖
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1">Amit (Self)</p>
                  </div>
                </div>
              </div>

              {/* Top HUD */}
              <div className="relative z-10 flex justify-between items-start bg-gradient-to-b from-slate-950/80 to-transparent p-2 rounded-xl">
                <div>
                  <h4 className="text-sm font-bold">{hospital.name}</h4>
                  <p className="text-[10px] text-slate-400">Secure Consultation Session</p>
                </div>
                <span className="bg-emerald-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full">
                  HD • ENCRYPTED
                </span>
              </div>

              {/* Telehealth Room control bar */}
              <div className="relative z-10 flex justify-center gap-4 bg-slate-950/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-800 w-max mx-auto shadow-xl">
                <button className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white text-xs font-semibold">
                  🎤 Mute
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-full text-white text-xs font-semibold">
                  📹 Cam Off
                </button>
                <button 
                  onClick={() => setInVideoRoom(false)}
                  className="bg-red-600 hover:bg-red-700 p-2.5 px-4 rounded-full text-white text-xs font-bold"
                >
                  End Consult
                </button>
              </div>
            </div>
          ) : (
            /* Booking Confirmation Success Panel */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-800">Booking Confirmed!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Your appointment slot has been reserved. Sync details are below.
                </p>
              </div>

              {/* Ticket Details */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto">
                <div className="flex justify-between items-start pb-4 border-b border-slate-200/60">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-800">{doctor.name}</h4>
                    <p className="text-xs text-primary-600 font-semibold">{doctor.specialty}</p>
                  </div>
                  <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Facility:</span>
                    <strong className="text-slate-800 font-semibold">{hospital.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <strong className="text-slate-800 font-semibold text-right max-w-[200px] truncate">{hospital.address}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule Date:</span>
                    <strong className="text-slate-800 font-semibold">{lastBookedAppt?.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Slot:</span>
                    <strong className="text-slate-800 font-semibold">{lastBookedAppt?.time}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <strong className="text-slate-800 font-semibold">{lastBookedAppt?.mode}</strong>
                  </div>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                {lastBookedAppt?.mode.includes('Video') ? (
                  <button
                    onClick={() => setInVideoRoom(true)}
                    className="flex-1 bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-4.5 h-4.5" />
                    Start Video consultation
                  </button>
                ) : (
                  <a
                    href={`https://maps.google.com/?q=${hospital.lat},${hospital.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4.5 h-4.5" />
                    Get Transit Route
                  </a>
                )}

                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    setSelectedSlot(null);
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl text-xs transition-all"
                >
                  Schedule Another Visit
                </button>
              </div>

              {/* Calendar Sync links */}
              <div className="flex justify-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <button className="hover:text-primary-600 font-semibold flex items-center gap-1">
                  📅 Sync Google Calendar
                </button>
                <button className="hover:text-primary-600 font-semibold flex items-center gap-1">
                  📅 Export iCal File
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
