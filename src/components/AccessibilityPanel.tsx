import { useState, useEffect } from "react";
import { 
  Eye, 
  Type, 
  Sun, 
  Moon, 
  ZoomIn,
  ZoomOut,
  Contrast,
  Check,
  Settings2,
  Accessibility
} from "lucide-react";

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  simplifiedMode: boolean;
  fontSize: "normal" | "large" | "xlarge";
}

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onSettingsChange: (s: AccessibilitySettings) => void;
}

const FONT_LABELS: Record<string, string> = {
  normal: "Normal (14px)",
  large: "Large (18px)",
  xlarge: "Extra Large (22px)"
};

export default function AccessibilityPanel({ settings, onSettingsChange }: AccessibilityPanelProps) {
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof AccessibilitySettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    onSettingsChange(updated);
    flash();
  };

  const setFontSize = (size: "normal" | "large" | "xlarge") => {
    const updated = { ...settings, fontSize: size };
    onSettingsChange(updated);
    flash();
  };

  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const resetAll = () => {
    const defaults: AccessibilitySettings = {
      largeText: false,
      highContrast: false,
      simplifiedMode: false,
      fontSize: "normal"
    };
    onSettingsChange(defaults);
    flash();
  };

  return (
    <div className={`space-y-8 animate-fade-in ${settings.highContrast ? "hc-mode" : ""}`}>
      
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-3xl p-7 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-violet-500/30 rounded-xl">
                <Accessibility className="w-6 h-6 text-violet-200" />
              </div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-violet-300 uppercase">
                Accessibility Center
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Easy-to-Use Settings
            </h2>
            <p className="text-violet-200 text-sm leading-relaxed max-w-xl">
              Make CarePlatform comfortable for <strong className="text-white">everyone</strong> — including seniors, people with low vision, or anyone who prefers a simpler, clearer interface.
            </p>
          </div>
          {saved && (
            <div className="flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl animate-scale-up">
              <Check className="w-3.5 h-3.5" />
              <span>Saved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Font Size Section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Text Size</h3>
            <p className="text-slate-500 text-xs mt-0.5">Choose how big you want the text to appear across the app</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["normal", "large", "xlarge"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 gap-2 ${
                settings.fontSize === size
                  ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                  : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              <ZoomIn className={`${size === "xlarge" ? "w-8 h-8" : size === "large" ? "w-6 h-6" : "w-5 h-5"} ${settings.fontSize === size ? "text-blue-600" : "text-slate-400"}`} />
              <span className={`font-bold ${size === "xlarge" ? "text-xl" : size === "large" ? "text-base" : "text-sm"} ${settings.fontSize === size ? "text-blue-700" : "text-slate-600"}`}>
                {size === "normal" ? "A" : size === "large" ? "A" : "A"}
              </span>
              <span className={`text-xs font-medium ${settings.fontSize === size ? "text-blue-600" : "text-slate-500"}`}>
                {FONT_LABELS[size]}
              </span>
              {settings.fontSize === size && (
                <span className="flex items-center space-x-1 text-[10px] text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> <span>Active</span>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* High Contrast Mode */}
        <div className={`bg-white border rounded-2xl p-6 shadow-xs transition-all ${settings.highContrast ? "border-amber-300 bg-amber-50/40" : "border-slate-100"}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${settings.highContrast ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                <Contrast className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">High Contrast Mode</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Makes text and borders much bolder and darker for easier reading
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("highContrast")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ml-3 ${
                settings.highContrast ? "bg-amber-500" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings.highContrast ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          {settings.highContrast && (
            <div className="mt-4 text-xs text-amber-700 font-medium bg-amber-100 rounded-xl p-3 border border-amber-200">
              ✅ High contrast is active — text is darker and borders are bolder throughout the app.
            </div>
          )}
        </div>

        {/* Large Text Mode */}
        <div className={`bg-white border rounded-2xl p-6 shadow-xs transition-all ${settings.largeText ? "border-blue-300 bg-blue-50/40" : "border-slate-100"}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${settings.largeText ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Large Buttons & Icons</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Enlarges all clickable buttons and icons for easier tapping
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("largeText")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ml-3 ${
                settings.largeText ? "bg-blue-500" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings.largeText ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          {settings.largeText && (
            <div className="mt-4 text-xs text-blue-700 font-medium bg-blue-100 rounded-xl p-3 border border-blue-200">
              ✅ Buttons and icons are now larger for easier interaction.
            </div>
          )}
        </div>

        {/* Simplified Mode */}
        <div className={`bg-white border rounded-2xl p-6 shadow-xs transition-all ${settings.simplifiedMode ? "border-emerald-300 bg-emerald-50/40" : "border-slate-100"}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${settings.simplifiedMode ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Simplified Mode</h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Hides technical jargon and shows plain, simple language
                </p>
              </div>
            </div>
            <button
              onClick={() => toggle("simplifiedMode")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ml-3 ${
                settings.simplifiedMode ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings.simplifiedMode ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
          {settings.simplifiedMode && (
            <div className="mt-4 text-xs text-emerald-700 font-medium bg-emerald-100 rounded-xl p-3 border border-emerald-200">
              ✅ Simple language mode is on — complex medical terms are explained in plain words.
            </div>
          )}
        </div>

        {/* Dark / Light toggle */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Quick Tips for Seniors</h3>
              <p className="text-slate-500 text-xs mt-1">Recommended settings for older users</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { icon: "🔠", tip: "Set Text Size to 'Extra Large' for most comfort" },
              { icon: "🎨", tip: "Enable High Contrast for clear border visibility" },
              { icon: "📱", tip: "Enable Large Buttons for easier tapping" },
              { icon: "🗣️", tip: "Use Voice Reader (in sidebar) to hear your health info" },
              { icon: "🆘", tip: "Set Emergency SOS contacts for quick help" },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center space-x-2">
          <Settings2 className="w-4 h-4 text-slate-500" />
          <span>Current Settings Summary</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Text Size", value: settings.fontSize.toUpperCase(), active: settings.fontSize !== "normal" },
            { label: "High Contrast", value: settings.highContrast ? "ON" : "OFF", active: settings.highContrast },
            { label: "Large Buttons", value: settings.largeText ? "ON" : "OFF", active: settings.largeText },
            { label: "Simple Mode", value: settings.simplifiedMode ? "ON" : "OFF", active: settings.simplifiedMode },
          ].map((item, i) => (
            <div key={i} className={`p-3.5 rounded-xl border text-center ${item.active ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white"}`}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
              <p className={`text-sm font-extrabold ${item.active ? "text-violet-700" : "text-slate-400"}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <button
          onClick={resetAll}
          className="mt-4 w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
          <span>Reset All to Default</span>
        </button>
      </div>

    </div>
  );
}
