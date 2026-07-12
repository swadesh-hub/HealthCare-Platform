import { useState } from "react";
import {
  Phone,
  AlertTriangle,
  Heart,
  MapPin,
  UserCheck,
  Plus,
  Trash2,
  PhoneCall,
  Siren,
  Shield,
  Info
} from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { id: "ec-1", name: "National Ambulance", relation: "Emergency Services", phone: "112" },
  { id: "ec-2", name: "Poison Control", relation: "Medical Helpline", phone: "1800-116-117" },
];

export default function EmergencySOS() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    const saved = localStorage.getItem("sos_contacts");
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countDown, setCountDown] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", relation: "", phone: "" });

  const saveContacts = (data: EmergencyContact[]) => {
    setContacts(data);
    localStorage.setItem("sos_contacts", JSON.stringify(data));
  };

  const addContact = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const newContact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: form.name,
      relation: form.relation || "Family",
      phone: form.phone
    };
    saveContacts([...contacts, newContact]);
    setForm({ name: "", relation: "", phone: "" });
    setShowAddForm(false);
  };

  const removeContact = (id: string) => {
    if (DEFAULT_CONTACTS.find(c => c.id === id)) return; // protect defaults
    saveContacts(contacts.filter(c => c.id !== id));
  };

  const triggerSOS = () => {
    setSosTriggered(true);
    let ct = 5;
    setCountDown(ct);
    const interval = setInterval(() => {
      ct--;
      setCountDown(ct);
      if (ct <= 0) {
        clearInterval(interval);
        setCountDown(null);
      }
    }, 1000);
  };

  const cancelSOS = () => {
    setSosTriggered(false);
    setCountDown(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 via-rose-900 to-orange-900 rounded-3xl p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-500/30 rounded-xl">
                <Siren className="w-6 h-6 text-red-200" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-red-300 uppercase">
                Emergency SOS
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Quick Emergency Help
            </h2>
            <p className="text-red-200 text-sm leading-relaxed max-w-xl">
              One-tap emergency calling for seniors and caregivers. Your emergency contacts are always one press away. Share your location and alert loved ones instantly.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-red-800/40 border border-red-500/30 text-red-200 text-xs font-medium px-4 py-2.5 rounded-xl">
            <Shield className="w-4 h-4 text-red-300" />
            <span>Always Active</span>
          </div>
        </div>
      </div>

      {/* BIG SOS BUTTON */}
      <div className="flex flex-col items-center justify-center py-6">
        {!sosTriggered ? (
          <div className="flex flex-col items-center gap-5">
            <button
              id="sos-trigger-btn"
              onClick={triggerSOS}
              className="relative w-48 h-48 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-full shadow-2xl shadow-red-500/40 flex flex-col items-center justify-center gap-3 border-8 border-red-400/30 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
              <Siren className="w-14 h-14 text-white drop-shadow-lg" />
              <span className="text-2xl font-black tracking-wider">SOS</span>
              <span className="text-xs font-bold text-red-100 uppercase tracking-wide">Press for Help</span>
            </button>
            <p className="text-slate-500 text-sm text-center max-w-xs">
              Press the red button to alert your emergency contacts and show your location.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-48 h-48 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center gap-2 border-8 border-orange-400/30 animate-pulse">
              <AlertTriangle className="w-14 h-14 text-white" />
              {countDown !== null ? (
                <>
                  <span className="text-5xl font-black">{countDown}</span>
                  <span className="text-xs font-bold text-orange-100">Alerting contacts...</span>
                </>
              ) : (
                <>
                  <span className="text-xl font-black">ALERT SENT</span>
                  <span className="text-xs font-bold text-orange-100">Contacts notified!</span>
                </>
              )}
            </div>

            {countDown !== null && (
              <button
                onClick={cancelSOS}
                className="px-8 py-3.5 bg-slate-700 hover:bg-slate-800 text-white text-base font-bold rounded-2xl transition-colors border border-slate-600 shadow-lg"
              >
                ✕ Cancel SOS
              </button>
            )}

            {countDown === null && (
              <div className="space-y-3 w-full max-w-sm">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-sm font-medium text-center">
                  ✅ Emergency alert has been sent to all your contacts (simulation)
                </div>
                <button
                  onClick={cancelSOS}
                  className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors border border-slate-200"
                >
                  Dismiss Alert
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Call Contacts Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-slate-500" />
            <span>Emergency Contacts</span>
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        {/* Add Contact Form */}
        {showAddForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3 animate-scale-up">
            <h4 className="text-sm font-bold text-blue-800">Add New Emergency Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="px-4 py-2.5 border border-blue-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Relation (e.g. Son, Wife)"
                value={form.relation}
                onChange={(e) => setForm({ ...form, relation: e.target.value })}
                className="px-4 py-2.5 border border-blue-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="px-4 py-2.5 border border-blue-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addContact}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Save Contact
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl border border-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => {
            const isDefault = DEFAULT_CONTACTS.find(c => c.id === contact.id);
            return (
              <div
                key={contact.id}
                className={`relative bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group ${
                  isDefault ? "border-red-100 bg-red-50/30" : "border-slate-100"
                }`}
              >
                {!isDefault && (
                  <button
                    onClick={() => removeContact(contact.id)}
                    className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-2xl flex-shrink-0 ${isDefault ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                    {isDefault ? <Siren className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 text-sm truncate">{contact.name}</div>
                    <div className="text-xs text-slate-500 mb-3">{contact.relation}</div>
                    <a
                      href={`tel:${contact.phone}`}
                      className={`inline-flex items-center space-x-2 px-4 py-2.5 text-white text-sm font-bold rounded-xl transition-colors w-full justify-center ${
                        isDefault ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Location Sharing Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Location Information</h3>
            <p className="text-slate-500 text-xs mt-0.5">Your approximate location to share in emergencies</p>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 flex items-start space-x-2">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <span>In a real emergency, press the SOS button and your phone will share your GPS coordinates with emergency contacts via SMS or app notification. Make sure contacts have the CarePlatform app installed.</span>
        </div>
      </div>

      {/* Medical Info Card */}
      <div className="bg-gradient-to-r from-rose-50 to-red-50 border border-red-100 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">My Medical Alert Info</h3>
            <p className="text-slate-500 text-xs mt-0.5">This info is shown to first responders in emergencies</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Blood Type", value: "O+" },
            { label: "Allergies", value: "Penicillin" },
            { label: "Condition", value: "Hypertension" },
            { label: "Doctor", value: "Dr. Jenkins" }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-red-100 rounded-xl p-3.5 text-center">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-sm font-bold text-slate-700">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
