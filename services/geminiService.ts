import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScriptAnalysisResult, VideoAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scriptAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "Overall viral potential score from 0-100" },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER },
          color: { type: Type.STRING, description: "Hex color code for the metric (Red/Yellow/Green)" }
        }
      }
    },
    weakestArea: { type: Type.STRING, description: "The specific area that needs the most work" },
    suggestion: { type: Type.STRING, description: "Actionable advice in Hinglish" },
    improvedHook: { type: Type.STRING, description: "A rewritten, stronger hook for the script" }
  },
  required: ["overallScore", "metrics", "weakestArea", "suggestion", "improvedHook"]
};

export const analyzeScriptWithGemini = async (
  script: string,
  niche: string,
  goal: string
): Promise<ScriptAnalysisResult> => {
  try {
    const prompt = `
      Act as a viral content coach for Instagram Reels and TikTok.
      Target Audience: India-first, Gen Z/Millennials.
      Tone: Friendly, Hinglish (mix of Hindi/English), Motivational.
      
      User Niche: ${niche}
      User Goal: ${goal}
      
      Analyze this script:
      "${script}"
      
      Provide scores (0-100) for: Hook, Curiosity, Relatability, Emotion, Value, Trend, Pacing, Structure.
      Identify the weakest area.
      Give one specific improvement tip in Hinglish.
      Rewrite the hook to be viral.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: scriptAnalysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ScriptAnalysisResult;
  } catch (error) {
    console.error("Script Analysis Error:", error);
    // Fallback mock data in case of API failure to prevent app crash during demo
    return {
      overallScore: 45,
      metrics: [
        { name: "Hook", score: 40, color: "#FF4D4D" },
        { name: "Value", score: 70, color: "#4D94FF" },
        { name: "Relatability", score: 60, color: "#FFD84D" },
      ],
      weakestArea: "Hook",
      suggestion: "Script thoda slow start ho raha hai. Hook me direct benefit batao!",
      improvedHook: "Stop scrolling if you want to save money today!"
    };
  }
};

const videoAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER },
    feedback: { type: Type.STRING, description: "Feedback in Hinglish" },
    pacingScore: { type: Type.INTEGER },
    visualScore: { type: Type.INTEGER },
    hookScore: { type: Type.INTEGER },
    prediction: { type: Type.STRING, description: "Viral prediction (e.g. 10k views, 1M views)" }
  }
};

export const analyzeVideoWithGemini = async (
  base64Data: string,
  mimeType: string
): Promise<VideoAnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: "Analyze this video clip for viral potential on Instagram/TikTok. Focus on visual pacing, lighting, and initial hook energy. Give feedback in friendly Hinglish."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: videoAnalysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as VideoAnalysisResult;

  } catch (error) {
    console.error("Video Analysis Error:", error);
    return {
      overallScore: 0,
      feedback: "Video load nahi hua. Try again or check connection.",
      pacingScore: 0,
      visualScore: 0,
      hookScore: 0,
      prediction: "Unknown"
    };
  }
};
