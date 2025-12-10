import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSentimentWithGemini = async (text: string) => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  const prompt = `Analyze the sentiment of the following text: "${text}". 
  Return a JSON object with a 'label' (POSITIVE or NEGATIVE), a 'score' (between 0.0 and 1.0 representing confidence), and a short 'explanation' (max 20 words).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            score: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["label", "score", "explanation"],
        },
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Sentiment Error:", error);
    throw error;
  }
};

export const detectObjectsWithGemini = async (base64Image: string) => {
  const ai = getClient();
  if (!ai) throw new Error("API Key missing");

  // We ask Gemini to list objects it sees to compare with the local model
  const prompt = `Identify the main objects in this image. 
  Return a JSON list of objects, where each object has a 'label', a 'confidence' (0.0-1.0), and a brief 'description'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Flash is great for quick image tasks
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              description: { type: Type.STRING },
            },
            required: ["label", "confidence", "description"]
          }
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw error;
  }
};