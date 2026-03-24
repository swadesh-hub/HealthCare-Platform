import React, { useState, useEffect } from 'react';
import { 
  MapPin, Star, Filter, ShieldCheck, Compass, Info, 
  Activity, Clock, ChevronDown, ChevronUp, CalendarRange
} from 'lucide-react';
import { HOSPITALS } from '../data/mockData';

export default function HospitalFinder({ 
  userProfile, view, setView, selectedSpecialty, 
  setSelectedHospital, setSelectedDoctor, triageResult 
}) {
  const [specialty, setSpecialty] = useState(selectedSpecialty || 'All');
  const [maxDistance, setMaxDistance] = useState(10);
  const [insurance, setInsurance] = useState('All');
  const [onlyAvailableBeds, setOnlyAvailableBeds] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [selectedHospId, setSelectedHospId] = useState(null);
  const [expandedHospId, setExpandedHospId] = useState(null);

  // Sync parent selection if any
  useEffect(() => {
    if (selectedSpecialty) {
      setSpecialty(selectedSpecialty);
    }
  }, [selectedSpecialty]);

  // Unique lists for filters
  const allSpecialties = ['All', 'Cardiology', 'Pulmonology', 'Gastroenterology', 'General Medicine', 'Neurology'];
  const allInsurances = ['All', 'Star Health', 'HDFC Ergo', 'Max Bupa', 'ICICI Lombard', 'Care Health'];

  // Filter & Sort Hospitals
  const filteredHospitals = HOSPITALS.filter(hosp => {
    if (specialty !== 'All' && !hosp.specialties.includes(specialty)) return false;
    if (hosp.distance > maxDistance) return false;
    if (insurance !== 'All' && !hosp.insuranceCovered.includes(insurance)) return false;
    if (onlyAvailableBeds && hosp.liveBeds.ICU === 0 && hosp.liveBeds.general === 0) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'waitTime') return a.avgWaitTime - b.avgWaitTime;
    if (sortBy === 'beds') return (b.liveBeds.ICU + b.liveBeds.general) - (a.liveBeds.ICU + a.liveBeds.general);
    return 0;
  });

  const handleBookDoctor = (hosp, doc) => {
    setSelectedHospital(hosp);
    setSelectedDoctor(doc);
    setView('booking');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Search and Filters Sidebar */}
      <div className="xl:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 space-y-5 flex flex-col justify-between h-[620px] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary-600" />
              Search & Filters
            </h3>
            {triageResult && (
              <span className="bg-primary-50 text-primary-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                Triage Guided
              </span>
            )}
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Specialty / Treatment</label>
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              {allSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Distance Filter */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              <span>Max Distance</span>
              <span className="text-primary-600 font-extrabold text-sm">{maxDistance} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
          </div>

          {/* Insurance Coverage */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Insurance Support</label>
            <select
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            >
              {allInsurances.map(ins => (
                <option key={ins} value={ins}>{ins}</option>
              ))}
            </select>
          </div>

          {/* Live Bed Checkbox */}
          <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl hover:bg-slate-100/70 transition-all border border-slate-100">
            <input
              type="checkbox"
              id="liveBeds"
              checked={onlyAvailableBeds}
              onChange={(e) => setOnlyAvailableBeds(e.target.checked)}
              className="rounded text-primary-600 focus:ring-primary-500 w-4.5 h-4.5"
            />
            <label htmlFor="liveBeds" className="cursor-pointer select-none">
              <span className="text-xs font-bold text-slate-700 block">Live Bed Availability Only</span>
              <span className="text-[10px] text-slate-400">Filters out hospitals with 0 vacant beds</span>
            </label>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sort Results By</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'distance', label: 'Distance' },
                { value: 'rating', label: 'Patient Rating' },
                { value: 'waitTime', label: 'Wait Time' },
                { value: 'beds', label: 'Vacant Beds' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all border ${
                    sortBy === opt.value
                      ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Current Geo Coordinate Status */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-center">
          <Compass className="w-5 h-5 text-primary-600 shrink-0" />
          <div className="text-left">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Simulated Geolocation</p>
            <p className="text-xs font-bold text-slate-800">Bangalore Central Office</p>
            <p className="text-[10px] text-slate-500 font-medium">Lat: 12.9716, Lng: 77.5946</p>
          </div>
        </div>
      </div>

      {/* Hospital List and SVG Interactive Map */}
      <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-6 h-[620px]">
        {/* Hospital Card List */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium p-4 space-y-3 flex flex-col overflow-y-auto">
          <div className="px-2 pb-2">
            <h4 className="font-bold text-sm text-slate-800">Nearby Facilities ({filteredHospitals.length})</h4>
            <p className="text-[10px] text-slate-400">Scored based on location, live occupancy & reviews</p>
          </div>

          {filteredHospitals.length > 0 ? (
            filteredHospitals.map(hosp => (
              <div 
                key={hosp.id}
                onClick={() => setSelectedHospId(hosp.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                  selectedHospId === hosp.id 
                    ? 'border-primary-500 bg-primary-50/20 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 bg-white shadow-sm'
                }`}
              >
                {/* Distance Badge */}
                <span className="absolute top-3 right-3 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {hosp.distance} km
                </span>

                <div className="space-y-2">
                  <div>
                    <h5 className="font-bold text-sm text-slate-800 pr-12">{hosp.name}</h5>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {hosp.address}
                    </p>
                  </div>

                  {/* Badges / Rating */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {hosp.rating}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {hosp.avgWaitTime}m wait
                    </span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Activity className="w-3.5 h-3.5" />
                      {hosp.liveBeds.ICU + hosp.liveBeds.general} beds
                    </span>
                  </div>

                  {/* Bed details */}
                  <div className="text-[10px] text-slate-500 flex justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                    <span>ICU Vacant: <strong className="text-slate-800">{hosp.liveBeds.ICU}</strong></span>
                    <span>General Vacant: <strong className="text-slate-800">{hosp.liveBeds.general}</strong></span>
                  </div>

                  {/* Expanded Specialist/Doctor Booking List */}
                  {expandedHospId === hosp.id ? (
                    <div className="pt-3.5 mt-3.5 border-t border-slate-100 space-y-3.5">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available Specialists</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setExpandedHospId(null); }}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
                        >
                          Hide Doctors
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        {hosp.doctors.map(doc => (
                          <div key={doc.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-800">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.specialty} • {doc.experience} yrs exp</p>
                              <p className="text-[10px] font-bold text-primary-600 mt-1">₹{doc.consultationFee} Consultation</p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookDoctor(hosp, doc);
                              }}
                              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-1.5 px-3 rounded-lg text-[10px] transition-all flex items-center gap-1 shadow-sm"
                            >
                              <CalendarRange className="w-3.5 h-3.5" />
                              Book Slots
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandedHospId(hosp.id); }}
                      className="w-full pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      <span>Show Matching Doctors ({hosp.doctors.length})</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <MapPin className="w-10 h-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-500">No matching facilities</p>
              <p className="text-xs text-slate-400 mt-1">
                Try widening your distance limit or changing the filters.
              </p>
            </div>
          )}
        </div>

        {/* SVG Interactive Map */}
        <div className="md:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 shadow-premium overflow-hidden relative flex flex-col justify-between p-4 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pointer-events-none" />

          {/* Map Grid and Streets SVG */}
          <div className="absolute inset-0 opacity-40 z-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" preserveAspectRatio="none">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="60" x2="100" y2="60" stroke="currentColor" strokeWidth="0.1" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeWidth="0.1" />
              <line x1="20" y1="0" x2="20" y2="100" stroke="currentColor" strokeWidth="0.1" />
              <line x1="40" y1="0" x2="40" y2="100" stroke="currentColor" strokeWidth="0.1" />
              <line x1="60" y1="0" x2="60" y2="100" stroke="currentColor" strokeWidth="0.1" />
              <line x1="80" y1="0" x2="80" y2="100" stroke="currentColor" strokeWidth="0.1" />

              {/* Roads / Arteries */}
              <path d="M 0,50 Q 50,50 100,50" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              <path d="M 50,0 Q 50,50 50,100" stroke="#1e293b" strokeWidth="1.5" fill="none" />
              <path d="M 10,10 Q 50,30 90,90" stroke="#0f172a" strokeWidth="0.8" fill="none" />
              <path d="M 5,85 Q 40,60 95,15" stroke="#0f172a" strokeWidth="0.8" fill="none" />
            </svg>
          </div>

          {/* Map Controls HUD */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 text-[10px]">
              <p className="font-bold text-slate-400 uppercase tracking-wider">Map Layer</p>
              <h5 className="font-extrabold text-white">Live ER Telemetry & Bed Status</h5>
            </div>
            <div className="flex gap-2">
              <button className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                2D Flat Map
              </button>
            </div>
          </div>

          {/* SVG Map Markers Layer */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <svg viewBox="0 0 500 500" className="w-full h-full">
              {/* User Center Coordinate (Latitude/Longitude transformed) */}
              {/* Transformed coordinates: User center at X=250, Y=250 */}
              <g transform="translate(250, 250)" className="pointer-events-auto cursor-help">
                <circle r="22" fill="#22c55e" fillOpacity="0.15" className="animate-ping" />
                <circle r="8" fill="#22c55e" stroke="white" strokeWidth="2" className="shadow-lg" />
                <title>Your Geolocation</title>
              </g>

              {/* Hospital Markers relative to User Center */}
              {HOSPITALS.map(hosp => {
                // Calculate offsets from user coordinates (12.9716, 77.5946)
                // Scaled to fit 500x500 map area
                const xOffset = (hosp.lng - 77.5946) * 2500 + 250;
                const yOffset = -(hosp.lat - 12.9716) * 2500 + 250;

                const isSelected = selectedHospId === hosp.id;
                const isFiltered = filteredHospitals.some(fh => fh.id === hosp.id);

                if (!isFiltered) return null;

                return (
                  <g 
                    key={hosp.id} 
                    transform={`translate(${xOffset}, ${yOffset})`}
                    className="pointer-events-auto cursor-pointer"
                    onClick={() => setSelectedHospId(hosp.id)}
                  >
                    {/* Pulsing ring for selected pin */}
                    {isSelected && (
                      <circle r="18" fill="#3b82f6" fillOpacity="0.25" className="animate-pulse" />
                    )}
                    
                    {/* Pin Shape */}
                    <path 
                      d="M0 -14 C-7 -14 -8 -6 0 0 C8 -6 7 -14 0 -14 Z" 
                      fill={isSelected ? '#3b82f6' : '#ef4444'} 
                      stroke="white" 
                      strokeWidth="1.5" 
                    />
                    <circle cy="-8" r="3" fill="white" />

                    {/* Miniature label */}
                    <text 
                      y="12" 
                      textAnchor="middle" 
                      fill="white" 
                      fontSize="9" 
                      fontWeight="bold" 
                      className="bg-slate-950/80 px-1 py-0.5 rounded shadow-sm select-none"
                    >
                      {hosp.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Hospital HUD Overlay */}
          <div className="relative z-10 mt-auto bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 text-left space-y-3">
            {selectedHospId ? (() => {
              const selectedHosp = HOSPITALS.find(h => h.id === selectedHospId);
              if (!selectedHosp) return null;
              return (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm">{selectedHosp.name}</h4>
                      <p className="text-[10px] text-slate-400">{selectedHosp.address}</p>
                    </div>
                    <span className="bg-blue-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {selectedHosp.distance} km away
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <p className="text-slate-500 uppercase tracking-wider font-bold">ER Wait Time</p>
                      <p className="font-bold text-sm text-amber-500">{selectedHosp.erWaitPrediction}</p>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <p className="text-slate-500 uppercase tracking-wider font-bold">Live Beds Vacant</p>
                      <p className="font-bold text-sm text-emerald-500">{selectedHosp.liveBeds.ICU + selectedHosp.liveBeds.general} Beds</p>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <p className="text-slate-500 uppercase tracking-wider font-bold">Insurance coverage</p>
                      <p className="font-bold text-[9px] text-blue-400 truncate">{selectedHosp.insuranceCovered[0]} + others</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setExpandedHospId(selectedHosp.id)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-xl text-xs transition-all text-center"
                    >
                      View Doctor Rosters
                    </button>
                    <a 
                      href={`tel:${selectedHosp.contact}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all text-center"
                    >
                      Call ER
                    </a>
                  </div>
                </>
              );
            })() : (
              <div className="text-center py-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <Info className="w-4 h-4 text-slate-400" />
                Select a hospital marker on the map or from the list to view live ER details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
