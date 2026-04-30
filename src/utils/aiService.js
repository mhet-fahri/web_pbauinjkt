import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const translateWithAI = async (text, targetLang) => {
  if (!genAI) throw new Error("API Key tidak terbaca.");

  const modelNames = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"];
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const prompt = `Translate the following text to ${targetLang} professionally. Keep all HTML tags and formatting exactly as they are. Only return the translation:\n\n${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Gagal menggunakan model ${modelName}:`, error);
      lastError = error;
      continue; // Coba model selanjutnya
    }
  }

  throw new Error("AI Gagal: " + (lastError?.message || "Semua model gagal merespon"));
};
