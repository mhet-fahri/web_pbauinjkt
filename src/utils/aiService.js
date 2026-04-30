import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const translateWithAI = async (text, targetLang) => {
  if (!genAI) throw new Error("API Key tidak terbaca.");

  try {
    /**
     * Kita gunakan 'gemini-pro' (Versi 1.0) sebagai model utama
     * karena seri 1.5 (Flash/Pro) terus menerus memberikan error 404 
     * pada project Google Cloud Anda.
     */
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Translate the following text to ${targetLang} professionally. Keep all HTML tags and formatting exactly as they are. Only return the translation:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("FULL ERROR LOG:", error);
    throw new Error("AI Gagal: " + error.message);
  }
};
