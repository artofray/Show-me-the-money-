
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzePolitician = async (name: string, context: string = ""): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Perform a deep financial and political analysis for U.S. Politician: ${name}. 
    Focus on their top campaign donors and industry affiliations using OpenSecrets and other public databases.
    Specifically check for ties to Alcohol, Tobacco, Pharmaceuticals, or Energy sectors. 
    Context: ${context || 'General inquiry into financial backing and potential legislative bias.'}
    
    Structure your response as a JSON object with:
    - summary: A 2-3 sentence overview of their financial profile.
    - keyInsights: A list of 3-5 specific bullet points about their voting records vs their donors.
    - donors: An array of top 5 industries/donors with 'industry' (string), 'amount' (number - estimate if needed), and 'percentage' (number).
    
    Return ONLY valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(response.text || "{}");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Reference",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      summary: data.summary || "No summary available.",
      keyInsights: data.keyInsights || [],
      donors: data.donors || [],
      sources: sources
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const runAutonomousAgent = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `You are an autonomous investigative agent specialized in U.S. political finance. 
    Analyze the following query and provide a detailed report following the money: ${query}.
    Focus on specific bills, lobbyists, and PAC contributions from OpenSecrets.
    Address connections between legislative stances (e.g. anti-cannabis, healthcare, energy) and donor industries.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text || "Analysis failed to generate.";
};
