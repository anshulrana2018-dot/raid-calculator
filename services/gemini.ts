import { GoogleGenAI } from "@google/genai";
import { RaidConfig } from "../types";

// Note: In a real production app, you might want to proxy this or strictly ensure API_KEY is set.
// For this demo, we assume the environment variable or a safe key is provided.
// Since we can't ask user for key easily in this flow without UI, we will fail gracefully if no key.

export const getRaidAdvice = async (config: RaidConfig): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "To use AI features, please configure your API Key in the environment settings.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Act as a senior storage engineer.
      I am considering a storage configuration with the following specs:
      - RAID Level: ${config.level}
      - Number of Drives: ${config.diskCount}
      - Drive Size: ${config.diskSize} ${config.diskSizeUnit}

      Please provide a concise analysis (max 150 words) covering:
      1. Is this a good choice for general purpose?
      2. What is the biggest risk with this specific setup?
      3. A recommended use case (e.g., database, media server, backup).
      
      Format with clear bullet points.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate advice at this time.";
  } catch (error) {
    console.error("AI Error:", error);
    return "AI Advisor is currently unavailable. Please check your network or API quota.";
  }
};
