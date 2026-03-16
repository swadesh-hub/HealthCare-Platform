import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Mic, MicOff, Send, HelpCircle, 
  AlertTriangle, ArrowRight, ShieldAlert, HeartHandshake, Globe
} from 'lucide-react';
import { REGIONAL_LANGUAGES, SYMPTOM_DECISION_TREE } from '../data/mockData';

export default function SymptomChecker({ setView, setSpecialtyFilter, setTriageResult }) {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('root');
  const [isListening, setIsListening] = useState(false);
  const [listeningTimer, setListeningTimer] = useState(null);
  const [triageOutput, setTriageOutput] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize messages
  useEffect(() => {
    resetChat();
  }, [language]);

  const resetChat = () => {
    setCurrentStep('root');
    setTriageOutput(null);
    const welcomeMsgs = {
      en: [
        { sender: 'bot', text: 'Hello! I am your AI Symptom Checker & Triage Assistant. How can I help you today?', time: 'Just now' },
        { sender: 'bot', text: 'Please describe your symptoms in natural words, or select one of the common concerns below:', time: 'Just now', suggestions: true }
      ],
      hi: [
        { sender: 'bot', text: 'नमस्ते! मैं आपका एआई लक्षण जांच और ट्राइएज सहायक हूं। आज मैं आपकी क्या मदद कर सकता हूं?', time: 'अभी' },
        { sender: 'bot', text: 'कृपया अपने लक्षणों का विवरण दें या नीचे दिए गए विकल्पों में से चुनें:', time: 'अभी', suggestions: true }
      ]
    };

    setMessages(welcomeMsgs[language] || welcomeMsgs['en']);
  };

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text, time: 'Just now' };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate AI thinking and reply
    setTimeout(() => {
      processInput(text);
    }, 800);
  };

  // Simulating Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      clearInterval(listeningTimer);
      setIsListening(false);
    } else {
      setIsListening(true);
      let count = 0;
      const textChoices = {
        en: [
          "I have been feeling some pain in my chest for the last hour.",
          "I have a mild fever that started yesterday.",
          "I have a severe cough and it is hard to breathe."
        ],
        hi: [
          "मुझे छाती में दर्द महसूस हो रहा है।",
          "मुझे हल्का बुखार है जो कल से शुरू हुआ।"
        ]
      };
      const possibleSpeeches = textChoices[language] || textChoices['en'];
      const textToSimulate = possibleSpeeches[Math.floor(Math.random() * possibleSpeeches.length)];
      
      let speechInput = "";
      const words = textToSimulate.split(" ");
      const interval = setInterval(() => {
        if (count < words.length) {
          speechInput += (count === 0 ? "" : " ") + words[count];
          setInputMessage(speechInput);
          count++;
        } else {
          clearInterval(interval);
          setIsListening(false);
          // Auto send after speech finishes
          setTimeout(() => {
            handleSendMessage(speechInput);
          }, 500);
        }
      }, 250);
      setListeningTimer(interval);
    }
  };

  const processInput = (text) => {
    const lowerText = text.toLowerCase();
    const tree = SYMPTOM_DECISION_TREE[language] || SYMPTOM_DECISION_TREE['en'];

    // If we're at the root, look for symptom keywords
    if (currentStep === 'root') {
      if (lowerText.includes('chest') || lowerText.includes('heart') || lowerText.includes('छाती') || lowerText.includes('दर्द')) {
        setCurrentStep('chest_pain');
        askQuestion(tree.chest_pain);
      } else if (lowerText.includes('fever') || lowerText.includes('temp') || lowerText.includes('बुखार')) {
        setCurrentStep('fever');
        askQuestion(tree.fever);
      } else if (lowerText.includes('cough') || lowerText.includes('breath') || lowerText.includes('coughing') || lowerText.includes('सांस')) {
        setCurrentStep('cough_difficulty_breathing');
        askQuestion(tree.cough_difficulty_breathing);
      } else {
        // Fallback GP diagnosis
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: 'I detected general discomfort. Let us schedule a consultation with a General Practitioner to evaluate this further.',
          time: 'Just now'
        }]);
        triggerTriage({
          triageLevel: "GP_VISIT",
          recommendation: "Consult a General Practitioner. Monitor for any worsening symptoms.",
          conditions: [
            { name: "General Malaise / Mild Viral Syndrome", probability: 60 },
            { name: "Physical Fatigue", probability: 40 }
          ],
          specialty: "General Medicine"
        });
      }
    } else {
      // We are in a decision path. Check if we matched an option.
      const node = tree[currentStep];
      if (node && node.options) {
        // Find matching option
        const matchedOption = node.options.find(opt => 
          lowerText.includes(opt.label.toLowerCase()) || 
          lowerText.includes('yes') || 
          lowerText.includes('हाँ') ||
          lowerText.includes('definitely')
        ) || node.options[0]; // fallback to first option

        const nextStep = matchedOption.next;
        setCurrentStep(nextStep);
        const nextNode = tree[nextStep];

        if (nextNode) {
          if (nextNode.triageLevel) {
            // Reached terminal triage leaf
            setMessages(prev => [...prev, {
              sender: 'bot',
              text: `Understood. Triage complete. Recommendation: ${nextNode.recommendation}`,
              time: 'Just now'
            }]);
            triggerTriage(nextNode);
          } else {
            askQuestion(nextNode);
          }
        }
      }
    }
  };

  const askQuestion = (node) => {
    setMessages(prev => [...prev, {
      sender: 'bot',
      text: node.question,
      time: 'Just now',
      options: node.options
    }]);
  };

  const triggerTriage = (triageData) => {
    setTriageOutput(triageData);
    setTriageResult(triageData);
  };

  const selectOption = (opt) => {
    handleSendMessage(opt.label);
  };

  const getTriageBadgeColor = (level) => {
    switch (level) {
      case 'EMERGENCY': return 'bg-red-50 text-red-700 border-red-200';
      case 'GP_VISIT': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'SELF_CARE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dialogue Chat Interface */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-premium flex flex-col h-[600px] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-md shadow-primary-200">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Symptom AI Engine</h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse" />
                Active Decision Tree v4.12
              </p>
            </div>
          </div>

          {/* Regional Language Select */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none border-none py-1 cursor-pointer"
            >
              {REGIONAL_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-sm ${
                msg.sender === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`text-[9px] mt-1.5 block ${msg.sender === 'user' ? 'text-primary-200' : 'text-slate-400'}`}>
                  {msg.time}
                </span>

                {/* Question Option Buttons */}
                {msg.options && (
                  <div className="mt-3.5 flex flex-wrap gap-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => selectOption(opt)}
                        className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold py-2 px-3.5 rounded-xl text-xs transition-colors border border-primary-100 shadow-sm"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggestions / Prompt Starters */}
                {msg.suggestions && (
                  <div className="mt-3.5 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Select Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleSendMessage(language === 'hi' ? 'छाती में दर्द' : 'I have Chest Pain')}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-200/60"
                      >
                        💔 {language === 'hi' ? 'छाती में दर्द' : 'Chest Pain'}
                      </button>
                      <button 
                        onClick={() => handleSendMessage(language === 'hi' ? 'बुखार है' : 'I have high Fever')}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-200/60"
                      >
                        🤒 {language === 'hi' ? 'बुखार है' : 'High Fever'}
                      </button>
                      <button 
                        onClick={() => handleSendMessage(language === 'hi' ? 'सांस लेने में दिक्कत' : 'Severe Cough & Dyspnea')}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold py-2 px-3 rounded-xl text-xs transition-colors border border-slate-200/60"
                      >
                        💨 {language === 'hi' ? 'सांस लेने में दिक्कत' : 'Difficulty Breathing'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
          {/* Audio Input Button */}
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
            title="Speak symptoms"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            placeholder={isListening ? "Listening..." : "Type symptoms in Hindi, English, Tamil..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            disabled={isListening}
          />

          <button
            onClick={() => handleSendMessage()}
            className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-200 shrink-0"
            disabled={isListening}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Triage Output Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-6 flex flex-col justify-between h-[600px]">
        <div>
          <div className="flex items-center gap-2.5 mb-5 pb-5 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-lg text-slate-800">Triage Engine Result</h3>
          </div>

          {triageOutput ? (
            <div className="space-y-5">
              {/* Triage Level Banner */}
              <div className={`p-4 rounded-2xl border text-center ${getTriageBadgeColor(triageOutput.triageLevel)}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5">Triage Severity Status</p>
                <h4 className="text-xl font-extrabold tracking-tight">
                  {triageOutput.triageLevel.replace('_', ' ')}
                </h4>
              </div>

              {/* Recommendation */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AI Recommendation</p>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {triageOutput.recommendation}
                </p>
              </div>

              {/* Probable Conditions */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ranked Probable Conditions</p>
                <div className="space-y-3">
                  {triageOutput.conditions.map((condition, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{condition.name}</span>
                        <span>{condition.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500 rounded-full" 
                          style={{ width: `${condition.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialty Recommendation */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 items-center">
                <HeartHandshake className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recommended Specialty</p>
                  <p className="text-sm font-extrabold text-slate-800">{triageOutput.specialty}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-500">Awaiting symptoms intake</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Describe your symptoms in the chat dialogue box. The triage model will calculate risk levels here.
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer / Action Button */}
        <div className="space-y-4">
          <div className="flex gap-2 p-3 bg-red-50/50 border border-red-100/50 rounded-xl">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed text-red-700/80">
              <strong className="text-red-800">Medical Disclaimer:</strong> Symptom checks are powered by NLP rules and are not clinical diagnoses. Recommends professional validation.
            </p>
          </div>

          {triageOutput && (
            <button
              onClick={() => {
                setSpecialtyFilter(triageOutput.specialty);
                setView('finder');
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              Find {triageOutput.specialty} Specialists
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {!triageOutput && (
            <button
              onClick={() => resetChat()}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-xl text-sm transition-all text-center"
            >
              Reset Symptom Check
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
