import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily
  let ai: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY is not defined or is placeholder. AI features will run in demo/mock mode.");
        return null;
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // Symptom Checker Endpoint
  app.post("/api/gemini/symptom-check", async (req, res) => {
    const { symptoms, gender, age, duration } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms are required." });
    }

    const aiClient = getGeminiClient();
    if (!aiClient) {
      // Return simulated response for demo if API key is missing
      return res.json({
        isDemo: true,
        text: `### 🏥 Virtual Symptom Assessment (Demo Mode)

You reported: **${symptoms}** (Duration: ${duration || 'unspecified'}, Age: ${age || 'N/A'}, Gender: ${gender || 'N/A'}).

*Note: Since the Gemini API Key is not set up, this is a simulated triage assessment. Set your API key in Secrets to activate the real AI model.*

#### ⚠️ Critical Triage Check (Emergency Warning)
If you experience chest pain, difficulty breathing, sudden slurred speech, weakness on one side of your body, or high fever with a stiff neck, seek **immediate emergency medical attention**.

#### 📋 Possible Considerations
1. **General Fatigue/Ailment**: Often related to lifestyle factors, dehydration, mild viral infection, or stress.
2. **Seasonal/Environmental factors**: Minor allergen exposure or environmental fatigue.

#### 🩺 General Recommendations
- Stay well-hydrated (8+ glasses of water).
- Get adequate rest (7-8 hours).
- Monitor vitals closely (blood pressure, temperature).
- Keep a detailed log of when symptoms worsen or improve.

#### 🩺 Recommended Specialist
- **General Physician** for initial physical evaluation and basic diagnostic tests.`
      });
    }

    try {
      const prompt = `You are an empathetic, highly professional virtual health assistant. Analyze the following symptom report:
Symptoms: ${symptoms}
Patient Age: ${age || "Unspecified"}
Patient Gender: ${gender || "Unspecified"}
Symptom Duration: ${duration || "Unspecified"}

Provide a detailed, structured health assessment in Markdown format. It must contain the following sections:
1. **Triage Assessment & Severity Rating**: (Low / Medium / High - explain why, and list warning signs that require emergency room care).
2. **Possible Explanations / Considerations**: (List 2-4 possible benign or common conditions matching these symptoms. Keep them educational and disclaim that it is not a formal diagnosis).
3. **Recommended Medical Specialists**: (Which kind of doctor they should consult, e.g., Cardiologist, Neurologist, General Practitioner).
4. **Lifestyle & At-Home Supportive Care**: (Practical, safe supportive steps like hydration, rest, specific avoidances).
5. **Questions to Prepare for Your Doctor**: (3-4 concise questions the patient should ask their doctor during a physical exam).

Include a prominent, clear medical disclaimer at the top stating that this is an AI-powered educational assessment and does not replace professional medical advice.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error during symptom check:", error);
      res.status(500).json({ error: error.message || "Failed to analyze symptoms." });
    }
  });

  // Report Summarizer Endpoint
  app.post("/api/gemini/summarize-report", async (req, res) => {
    const { reportText, title } = req.body;
    if (!reportText) {
      return res.status(400).json({ error: "Report text is required." });
    }

    const aiClient = getGeminiClient();
    if (!aiClient) {
      return res.json({
        isDemo: true,
        text: `### 📄 Medical Report Summary: ${title || 'Medical Document'} (Demo Mode)

*Note: Since the Gemini API Key is not set up, this is a simulated plain-language translation. Set your API key in Secrets to activate the real AI model.*

#### 🔑 Key Clinical Findings
- The report suggests standard reference ranges. All main biomarkers are generally stable with minor environmental or lifestyle fluctuations.
- Recommended to monitor blood pressure and ensure regular electrolyte intake.

#### 🧪 Medical Terms Decoded
- **Biomarkers**: Indicators of biological state.
- **Reference Range**: The normal expected interval for healthy individuals.

#### 💡 Actionable Next Steps
- Share this report with your General Physician at your next annual physical.
- Continue tracking daily vitals and logging wellness patterns.`
      });
    }

    try {
      const prompt = `You are a clinical educator who translates complex medical reports into clear, plain language that patients can easily understand. 
Analyze the following medical report text:
Document Title: ${title || "Medical Report"}
Report Content:
"${reportText}"

Provide a structured patient-friendly summary in Markdown format with the following sections:
1. **Plain Language Executive Summary**: (A simple 2-3 sentence overview of what this report is about and its main conclusion).
2. **Key Findings & Biomarkers Decoded**: (Explain key medical jargon, abbreviations, or lab values found, alongside an easy-to-understand translation/interpretation of what they mean).
3. **Clinical Interpretation**: (Explain what these findings mean in practical terms. What's normal and what should be monitored).
4. **Actionable Next Steps**: (3-4 practical suggestions of what the user can do, such as lifestyle alterations or follow-up discussion points with their doctor).
5. **Questions to Discuss with Your Doctor**: (2-3 tailored questions to ask the doctor about this specific report).

Include a medical disclaimer at the top stating that this summary is for educational purposes and should be discussed with a qualified healthcare provider.`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error during report summarization:", error);
      res.status(500).json({ error: error.message || "Failed to summarize report." });
    }
  });

  // AI Health Coach (Chat) Endpoint
  app.post("/api/gemini/health-coach", async (req, res) => {
    const { messages, currentVitals } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const aiClient = getGeminiClient();
    if (!aiClient) {
      return res.json({
        isDemo: true,
        text: `Hello! I am your AI Health Companion (currently running in **Demo Mode**). 

As a health coach, I help you with lifestyle changes, tracking vitals, setting water targets, and healthy habits. 

If you'd like to try me out, I can suggest a general wellness routine:
- **Hydration**: Aim for 2.5 - 3.0 Liters of water daily.
- **Activity**: Walk at least 8,000 steps per day.
- **Sleep**: Target 7 to 8 hours of quality rest.

How can I assist you with your fitness, nutrition, or wellness goals today?`
      });
    }

    try {
      // Format the conversation history for Gemini
      const conversationHistory = messages.slice(-10).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      // Add vitals context if available
      let vitalsContext = "";
      if (currentVitals) {
        vitalsContext = `\n[Patient's Recent Vitals Context: Blood Pressure: ${currentVitals.systolicBP}/${currentVitals.diastolicBP} mmHg, Blood Glucose: ${currentVitals.bloodGlucose} mg/dL, Heart Rate: ${currentVitals.heartRate} bpm, Sleep: ${currentVitals.sleepHours} hrs, Daily Water: ${currentVitals.waterIntake}L]`;
      }

      const systemInstruction = `You are "Health Buddy", a supportive, warm, and highly knowledgeable personal health coach and virtual wellness guide.
Your purpose is to help the user adopt healthy lifestyle habits, understand general nutrition, improve sleep, manage stress, stay physically active, and monitor their vitals.
Rules of conduct:
1. Provide practical, motivational, and evidence-based wellness advice.
2. If the user asks about acute medical symptoms, gently refer them to the Symptom Checker tab or a licensed physician, maintaining your focus on general health coaching and wellness habits.
3. Keep answers concise, highly structured, encouraging, and visually scannable. Use bullet points and bold headers.
4. Integrate any provided vitals context to give personalized wellness insights (e.g. if blood pressure is high, mention stress reduction techniques, low sodium choices, and hydration).
5. Always maintain a professional, optimistic, and caring tone. Do not make diagnostic claims.${vitalsContext}`;

      const lastMessage = conversationHistory.pop() || { role: 'user', parts: [{ text: 'Hello' }] };

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          ...conversationHistory,
          lastMessage
        ],
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API error in health coach:", error);
      res.status(500).json({ error: error.message || "Failed to generate health coach response." });
    }
  });

  // Vite middleware for asset serving or production server setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
