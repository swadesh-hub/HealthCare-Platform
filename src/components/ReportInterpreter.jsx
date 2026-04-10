import React, { useState, useEffect } from 'react';
import { 
  FileUp, FileText, CheckCircle, AlertTriangle, TrendingUp, 
  HelpCircle, Copy, Check, Sparkles, RefreshCw, PlusCircle
} from 'lucide-react';
import { MOCK_REPORTS } from '../data/mockData';

export default function ReportInterpreter({ userProfile, updateUserProfile, selectedReportKey, setSelectedReport }) {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [reportResult, setReportResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  // Sync with global selections
  useEffect(() => {
    if (selectedReportKey && MOCK_REPORTS[selectedReportKey]) {
      loadReport(selectedReportKey);
    }
  }, [selectedReportKey]);

  const loadReport = (key) => {
    setAnalyzing(true);
    setAnalysisProgress(10);
    setIsSaved(false);

    // Simulate OCR steps
    const intervals = [
      { p: 30, t: 300 },
      { p: 60, t: 800 },
      { p: 90, t: 1400 },
      { p: 100, t: 2000 }
    ];

    intervals.forEach(step => {
      setTimeout(() => {
        setAnalysisProgress(step.p);
        if (step.p === 100) {
          setReportResult(MOCK_REPORTS[key]);
          setAnalyzing(false);
        }
      }, step.t);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    // Simulate drop
    setFile({ name: "lipid_profile_hba1c_june_2026.pdf" });
    loadReport('lipid_hba1c');
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      loadReport('lipid_hba1c');
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Save parsed report values into patient DHR records
  const handleSaveToDHR = () => {
    if (!reportResult) return;

    // Check if it's already saved
    const exists = userProfile.history.some(h => h.title.includes("June 2026"));
    if (exists) {
      setIsSaved(true);
      return;
    }

    const newRecord = {
      id: `rec-${Math.floor(1000 + Math.random() * 9000)}`,
      date: reportResult.extractedData.date,
      type: "Lab Report",
      title: "Lipid Profile & HbA1c (June 2026)",
      doctor: "Dr. Arvind Swaminathan",
      facility: "Metro Cardiac Lab",
      summary: `Extracted HbA1c is ${reportResult.extractedData.markers[0].value}% (Prediabetic). Extracted LDL is ${reportResult.extractedData.markers[2].value} mg/dL (Elevated). Auto-parsed by AI Interpreter.`
    };

    // Update global user profile state
    updateUserProfile({
      ...userProfile,
      history: [newRecord, ...userProfile.history]
    });
    setIsSaved(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Column */}
      <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 space-y-6 flex flex-col justify-between h-[600px] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <FileUp className="w-6 h-6 text-primary-600" />
            <div>
              <h3 className="font-bold text-lg text-slate-800">Upload Report</h3>
              <p className="text-xs text-slate-400">PDF, PNG, or JPG lab scans</p>
            </div>
          </div>

          {/* Drag and drop zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-200 hover:border-primary-400 rounded-3xl p-6 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-slate-50 flex flex-col items-center justify-center h-48 relative"
          >
            <input 
              type="file" 
              accept=".pdf,.png,.jpg,.jpeg" 
              onChange={handleFileSelect} 
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileText className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-xs font-bold text-slate-700">Drag & Drop Report Here</p>
            <p className="text-[10px] text-slate-400 mt-1">or click to browse from device</p>
          </div>

          {/* Demo sample reports */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Sandbox Reports:</p>
            <button
              onClick={() => {
                setFile({ name: "lipid_profile_hba1c_june_2026.pdf" });
                loadReport('lipid_hba1c');
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-2xl p-3 text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <div className="text-xs">
                  <p className="font-bold text-slate-700">Lipid & HbA1c Lab Panel</p>
                  <p className="text-[9px] text-slate-400">June 2026 (Abnormal Markers)</p>
                </div>
              </div>
              <PlusCircle className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* OCR scanner overlay indicator */}
        {analyzing && (
          <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary-500" />
                AI OCR Extracting...
              </span>
              <span>{analysisProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${analysisProgress}%` }} />
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              {analysisProgress < 40 && "Preprocessing document image..."}
              {analysisProgress >= 40 && analysisProgress < 70 && "Parsing clinical values via vision transformers..."}
              {analysisProgress >= 70 && analysisProgress < 100 && "Correlating findings with past reports and clinical guidelines..."}
              {analysisProgress === 100 && "OCR extraction completed!"}
            </p>
          </div>
        )}
      </div>

      {/* Analysis Output Columns */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium p-6 flex flex-col justify-between h-[600px] overflow-y-auto">
        {reportResult ? (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Extracted JSON Formatted
                </span>
                <h4 className="font-extrabold text-slate-800 text-lg mt-1">{reportResult.fileName}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Processed on: June 11, 2026 • Patient: {reportResult.extractedData.patientName} (Age {reportResult.extractedData.age})</p>
              </div>

              <button
                onClick={handleSaveToDHR}
                disabled={isSaved}
                className={`text-xs font-bold py-2 px-4 rounded-xl shadow-sm transition-all ${
                  isSaved 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default' 
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isSaved ? '✓ Saved to DHR' : 'Save to DHR Record'}
              </button>
            </div>

            {/* Flagged Markers list */}
            <div>
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Extracted Biomarker Analysis</h5>
              <div className="space-y-3">
                {reportResult.extractedData.markers.map((marker, i) => (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-2xl border transition-all ${
                      marker.status === 'Abnormal'
                        ? 'border-red-100 bg-red-50/10 hover:bg-red-50/20'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-800">{marker.name}</p>
                          {marker.status === 'Abnormal' && (
                            <span className="bg-red-50 text-red-600 text-[8px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-red-100">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              ABNORMAL
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">Reference bounds: {marker.reference}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-base ${marker.status === 'Abnormal' ? 'text-red-600' : 'text-slate-800'}`}>
                          {marker.value} <span className="text-xs font-medium text-slate-400">{marker.unit}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2.5 border-t border-slate-100 pt-2 leading-relaxed font-medium">
                      {marker.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend analysis */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-primary-600" />
                Longitudinal Biomarker Trends
              </h5>

              <div className="grid grid-cols-3 gap-3">
                {reportResult.trends.map((t, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-150 text-center shadow-sm">
                    <p className="text-[9px] font-bold text-slate-400">{t.date}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">HbA1c:</span>
                        <strong className="text-slate-700 font-extrabold">{t.hba1c}%</strong>
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">LDL:</span>
                        <strong className="text-slate-700 font-extrabold">{t.ldl}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                📈 HbA1c has steadily risen from <strong className="text-slate-600">5.9%</strong> (June 2025) to <strong className="text-slate-600">6.3%</strong> today, highlighting metabolic drift. LDL shows a similar upward slope of <strong className="text-slate-600">+10%</strong> YoY.
              </p>
            </div>

            {/* Doctor questions */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4.5 h-4.5 text-primary-600" />
                Recommended Follow-up Questions for Doctor
              </h5>
              <div className="space-y-2">
                {reportResult.followUpQuestions.map((q, i) => (
                  <div key={i} className="p-3 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs gap-3">
                    <p className="text-slate-600 leading-relaxed font-semibold">{q}</p>
                    <button
                      onClick={() => copyToClipboard(q, i)}
                      className="text-slate-400 hover:text-slate-600 shrink-0"
                      title="Copy question"
                    >
                      {copiedIndex === i ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[9px] text-slate-400 text-center leading-relaxed">
              * AI report analysis does not replace formal clinical consultation. Keep your GP informed of all parsed report values.
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-200">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-600 text-sm">Awaiting Medical Report Upload</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
              Drag in a lipid profile or HbA1c PDF report, or click a sample card in the sidebar to simulatevision models parsing abnormal parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
