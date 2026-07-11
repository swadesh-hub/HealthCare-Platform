import React, { useState } from "react";
import { MedicalRecord } from "../types";
import { 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  Sparkles, 
  FileDown, 
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";

interface MedicalRecordsProps {
  records: MedicalRecord[];
  onAddRecord: (record: Omit<MedicalRecord, "id">) => void;
  onUpdateRecordSummary: (recordId: string, summary: string) => void;
}

export default function MedicalRecords({ 
  records, 
  onAddRecord,
  onUpdateRecordSummary 
}: MedicalRecordsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MedicalRecord["category"]>("Lab Report");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState("");
  const [notes, setNotes] = useState("");
  const [contentRaw, setContentRaw] = useState("");

  const [activeRecord, setActiveRecord] = useState<MedicalRecord | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !doctorName.trim() || !notes.trim()) return;

    onAddRecord({
      title,
      category,
      date,
      doctorName,
      notes,
      contentRaw: contentRaw.trim() || undefined
    });

    // Reset form
    setTitle("");
    setCategory("Lab Report");
    setDoctorName("");
    setNotes("");
    setContentRaw("");
    setShowAddForm(false);
  };

  const handleAISummarize = async (record: MedicalRecord) => {
    if (!record.contentRaw) return;
    
    setIsSummarizing(true);
    setSummaryError(null);

    try {
      const res = await fetch("/api/gemini/summarize-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportText: record.contentRaw,
          title: record.title
        })
      });

      if (!res.ok) {
        throw new Error("Failed to reach AI Summarizer service.");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Update state
      onUpdateRecordSummary(record.id, data.text);
      
      // Update local view
      setActiveRecord({
        ...record,
        contentSummarized: data.text
      });
    } catch (err: any) {
      console.error(err);
      setSummaryError(err.message || "Summarizer encountered an unexpected server error.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Helper to safely render simple Markdown text into HTML structures
  const renderMarkdown = (text: string) => {
    if (!text) return null;

    return text.split("\n").map((line, idx) => {
      // Bold Header level 3
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="text-sm font-bold text-slate-800 mt-4 mb-2 border-b border-slate-100 pb-1 font-sans">
            {line.replace("### ", "")}
          </h4>
        );
      }
      // Bold Header level 4
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="text-xs font-bold text-slate-700 mt-3 mb-1.5 font-sans">
            {line.replace("#### ", "")}
          </h5>
        );
      }
      // Unordered list item
      if (line.trim().startsWith("- ")) {
        const itemText = line.trim().substring(2);
        // Look for basic bold matching within bullet points
        const boldParts = itemText.split("**");
        if (boldParts.length > 1) {
          return (
            <li key={idx} className="text-xs text-slate-600 ml-4 list-disc py-0.5">
              {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-800">{part}</strong> : part)}
            </li>
          );
        }
        return <li key={idx} className="text-xs text-slate-600 ml-4 list-disc py-0.5">{itemText}</li>;
      }
      // Numbered list item
      if (/^\d+\.\s/.test(line.trim())) {
        const itemText = line.trim().replace(/^\d+\.\s/, "");
        const boldParts = itemText.split("**");
        return (
          <li key={idx} className="text-xs text-slate-600 ml-5 list-decimal py-0.5">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-800">{part}</strong> : part)}
          </li>
        );
      }
      // Table Row matcher (crude but works beautifully for medical tables)
      if (line.trim().startsWith("|") && line.trim().endsWith("|") && !line.includes("---")) {
        const cells = line.split("|").slice(1, -1).map(c => c.trim());
        return (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-2 py-1 px-3 bg-slate-50 border-b border-slate-100 last:border-0 text-xs font-medium">
            {cells.map((cell, cIdx) => (
              <span key={cIdx} className={cIdx === 0 ? "font-semibold text-slate-800" : "text-slate-600"}>{cell}</span>
            ))}
          </div>
        );
      }
      
      // Standard line translation
      if (line.trim() === "") return <div key={idx} className="h-2" />;

      // Scan for simple bold text inside normal paragraphs
      const boldParts = line.split("**");
      if (boldParts.length > 1) {
        return (
          <p key={idx} className="text-xs text-slate-600 leading-relaxed py-0.5">
            {boldParts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-800">{part}</strong> : part)}
          </p>
        );
      }

      return <p key={idx} className="text-xs text-slate-600 leading-relaxed py-0.5">{line}</p>;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Records Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Clinical Records</h2>
          <p className="text-sm text-slate-500 mt-1">Review diagnostic logs, laboratory details, and download AI summaries.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Report</span>
        </button>
      </div>

      {/* Add Document Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 className="font-bold text-slate-800 text-lg">Add Clinical Report</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Report Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lipids panel, CBC, Thorax MRI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MedicalRecord["category"])}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block font-mono">Issued Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Doctor Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block font-mono">Referring Practitioner</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Elena Rostova"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Brief Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 block font-mono">Clinical Note / Summary Outline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blood analysis showing minor LDL elevation"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Raw clinical report content for AI */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 font-mono">Detailed Clinical Content (For AI Translation)</label>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 rounded font-bold font-mono">AI COMPATIBLE</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Paste laboratory results, biomarkers, ultrasound text transcripts or dense diagnostic parameters here. Gemini will summarize this..."
                  value={contentRaw}
                  onChange={(e) => setContentRaw(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors pt-3"
              >
                Save Document Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Records Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Document Cards List */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider font-mono">
            Stored Documents
          </h3>
          
          <div className="space-y-3.5">
            {records.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => {
                  setActiveRecord(rec);
                  setSummaryError(null);
                }}
                className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-xs transition-all ${
                  activeRecord?.id === rec.id ? "border-blue-500 ring-2 ring-blue-500/5" : "border-slate-100"
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border px-2 py-0.5 rounded font-mono">
                        {rec.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{rec.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1.5 truncate">{rec.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Ref: {rec.doctorName}</p>
                    <p className="text-xs text-slate-400 italic line-clamp-1 mt-1">"{rec.notes}"</p>
                    
                    {/* Badge indicator */}
                    {rec.contentSummarized ? (
                      <span className="inline-flex items-center space-x-1 mt-3 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold font-mono">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>AI Summarized</span>
                      </span>
                    ) : rec.contentRaw ? (
                      <span className="inline-flex items-center space-x-1 mt-3 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-bold font-mono">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Ready for AI summary</span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Document Details & AI Companion translation */}
        <div className="lg:col-span-6">
          <div className="sticky top-20 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[450px] flex flex-col justify-between">
            {activeRecord ? (
              <div className="space-y-6 flex-1">
                {/* Heading details */}
                <div className="border-b border-slate-50 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Document Record</span>
                    <span className="text-xs text-slate-500 font-mono">{activeRecord.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{activeRecord.title}</h3>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{activeRecord.doctorName}</span>
                    </span>
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {activeRecord.category}
                    </span>
                  </div>
                </div>

                {/* Patient Summary and Raw Content toggle tabs */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">General Outlined Notes</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{activeRecord.notes}"
                    </p>
                  </div>

                  {/* AI Summarized Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        <span>AI Patient Summary</span>
                      </h4>
                      {activeRecord.contentRaw && !activeRecord.contentSummarized && (
                        <button
                          onClick={() => handleAISummarize(activeRecord)}
                          disabled={isSummarizing}
                          className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-xs hover:opacity-90 transition-opacity flex items-center space-x-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Generate Summary</span>
                        </button>
                      )}
                    </div>

                    {isSummarizing ? (
                      <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                        <div className="text-xs font-semibold text-slate-600">Gemini is translating medical jargon...</div>
                        <p className="text-[10px] text-slate-400 max-w-xs">Deciphering bio-indicators, cardiac intervals, and lab values into patient-friendly metrics.</p>
                      </div>
                    ) : summaryError ? (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>{summaryError}</span>
                      </div>
                    ) : activeRecord.contentSummarized ? (
                      <div className="bg-indigo-50/20 border border-indigo-100/50 p-5 rounded-xl space-y-3 prose max-w-none shadow-xs max-h-[300px] overflow-y-auto">
                        {renderMarkdown(activeRecord.contentSummarized)}
                      </div>
                    ) : activeRecord.contentRaw ? (
                      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-2">
                        <p className="text-xs text-slate-500">
                          This report includes complex lab data. Press the **Generate Summary** button to activate the server-side Gemini clinical model.
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        No raw clinical content was provided to generate an AI clinical translation.
                      </div>
                    )}
                  </div>

                  {/* Raw Report Transcript accordion */}
                  {activeRecord.contentRaw && (
                    <details className="group border border-slate-100 rounded-xl">
                      <summary className="list-none flex items-center justify-between p-3 cursor-pointer text-xs font-bold text-slate-400 uppercase tracking-wider font-mono select-none hover:bg-slate-50 transition-colors">
                        <span>Raw Clinical Transcript</span>
                        <span className="transition-transform group-open:rotate-180 text-slate-400 font-bold font-sans">↓</span>
                      </summary>
                      <div className="p-4 border-t border-slate-50 bg-slate-50/30 text-[11px] text-slate-500 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {activeRecord.contentRaw}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center flex-1 py-12">
                <div className="p-3 bg-slate-50 text-slate-400 rounded-full mb-3">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="text-xs font-semibold text-slate-500 font-mono">No Document Selected</div>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1 leading-relaxed">
                  Select an available document card on the left to review referring details, raw diagnostic parameters, and download plain-language clinical summaries.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
