
import { GoogleGenAI, Type } from "@google/genai";
import { AIResponse } from "../types";

export const analyzeMeal = async (description: string): Promise<AIResponse> => {
  // Initialize the Gemini API client using the environment variable.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Aja como um nutricionista brasileiro especializado em estimativa nutricional rápida.
    Analise a descrição desta refeição: "${description}".
    
    Regras:
    1. Estime calorias, proteínas, carboidratos, gorduras e fibras.
    2. Use porções e gramaturas típicas brasileiras (ex: arroz, feijão, pão francês).
    3. Retorne APENAS um JSON válido.
    4. Se a descrição for vaga, use as 'followUpQuestions' para sugerir esclarecimentos em uma nova análise.
    5. Nunca invente dados se for impossível estimar, mas tente dar uma média segura.
    6. Identifique cada item separadamente no array 'items'.
  `;

  try {
    // Using gemini-3-pro-preview for tasks requiring complex nutritional reasoning and estimation.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantityText: { type: Type.STRING },
                  estimatedGrams: { type: Type.NUMBER },
                  calories: { type: Type.NUMBER },
                  protein_g: { type: Type.NUMBER },
                  carbs_g: { type: Type.NUMBER },
                  fat_g: { type: Type.NUMBER },
                  fiber_g: { type: Type.NUMBER },
                  confidence: { type: Type.NUMBER },
                  notes: { type: Type.STRING }
                },
                required: ["name", "quantityText", "calories"]
              }
            },
            totals: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein_g: { type: Type.NUMBER },
                carbs_g: { type: Type.NUMBER },
                fat_g: { type: Type.NUMBER },
                fiber_g: { type: Type.NUMBER }
              }
            },
            disclaimer: { type: Type.STRING },
            followUpQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["mealName", "items", "totals", "disclaimer"]
        }
      }
    });

    // Accessing the .text property of GenerateContentResponse directly.
    const resultText = response.text || "{}";
    return JSON.parse(resultText) as AIResponse;
  } catch (error) {
    console.error("AI Analysis error:", error);
    throw new Error("Falha ao analisar refeição com IA.");
  }
};
