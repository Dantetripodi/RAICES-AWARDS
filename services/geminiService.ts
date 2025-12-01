import { GoogleGenAI, Type } from "@google/genai";
import { Category, Vote, VoteAnalysis } from "../types";

// Helper to get client instance
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFunCategories = async (numCategories: number, studentNames: string[]): Promise<Category[]> => {
  const ai = getAiClient();
  
  const prompt = `
    Generate ${numCategories} funny, wholesome, and slightly roasted high school yearbook superlative categories in Spanish.
    The tone should be Gen-Z, fun, and lighthearted.
    Also, assume the class consists of these students: ${studentNames.join(', ')}.
    For each category, include the full list of students provided as nominees.
    Make the descriptions witty.
    Use emojis for each category.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            emoji: { type: Type.STRING },
            nominees: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  avatar: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text || "[]";
  return JSON.parse(text) as Category[];
};

export const generateHighlights = async (categories: Category[], votes: Vote[]): Promise<VoteAnalysis> => {
  const ai = getAiClient();

  // Prepare data summary for AI (don't send raw PII if not needed, just names and counts)
  const summary = categories.map(cat => {
    const catVotes = votes.filter(v => v.categoryId === cat.id);
    const counts: Record<string, number> = {};
    cat.nominees.forEach(n => counts[n.name] = 0);
    catVotes.forEach(v => {
      const nominee = cat.nominees.find(n => n.id === v.nomineeId);
      if (nominee) counts[nominee.name] = (counts[nominee.name] || 0) + 1;
    });
    return {
      category: cat.title,
      id: cat.id,
      counts
    };
  });

  const prompt = `
    Act as an exciting, energetic TV host for a high school awards show.
    Analyze the current voting results provided in JSON format.
    
    1. For each category, create a short "highlightText" (max 15 words) describing the status (e.g., "Juan is crushing the competition!" or "It's a tie between Ana and Luis!").
    2. Determine if it is a "isTightRace" (difference of 2 votes or less between top 2).
    3. Generate a "generalCommentary" (max 50 words) summing up the overall vibe of the voting session. Make it funny and encouraging.
    
    Input Data: ${JSON.stringify(summary)}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categoryHighlights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                categoryId: { type: Type.STRING },
                highlightText: { type: Type.STRING },
                isTightRace: { type: Type.BOOLEAN },
                leaderId: { type: Type.STRING, description: "Name of the leader if applicable" }
              }
            }
          },
          generalCommentary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}") as VoteAnalysis;
}
