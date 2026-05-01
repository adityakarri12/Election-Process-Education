import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const chatWithAssistant = async (message: string, history: { role: string, parts: { text: string }[] }[] = []) => {
  if (!API_KEY) {
    throw new Error("Gemini API key is missing. Please add it to your .env file.");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "You are Vote-Wise, a friendly and expert election process education assistant. Your goal is to help citizens understand the election process, timelines, voter rights, and registration steps. Use clear, accessible language. If you don't know something for a specific region, provide general guidance and suggest where they can find official local information. Focus on being unbiased and informative.",
  });

  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
};
