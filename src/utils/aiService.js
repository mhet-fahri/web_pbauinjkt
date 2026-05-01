import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Cloudflare Workers AI Translation (Primary)
 * Faster and integrated with Cloudflare Pages
 */
const translateWithCloudflare = async (text, targetLang) => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text, 
        target_lang: targetLang 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Cloudflare AI error');
    }

    const data = await response.json();
    return data.translated_text;
  } catch (error) {
    console.error("Cloudflare Translation failed:", error);
    throw error;
  }
};

/**
 * Google Gemini Translation (Fallback)
 * Better at preserving HTML tags and complex formatting
 */
export const translateWithAI = async (text, targetLang) => {
  try {
    // 1. Try Cloudflare first (using Llama 3 / m2m100)
    // Now Cloudflare can handle HTML and longer text because we use Llama 3 fallback
    return await translateWithCloudflare(text, targetLang);
  } catch (error) {
    console.warn("Cloudflare failed, trying Gemini as fallback...");
    try {
      return await translateWithGemini(text, targetLang);
    } catch (finalError) {
      throw new Error("Semua layanan AI gagal: " + finalError.message);
    }
  }
};

const translateWithGemini = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("Gemini API Key tidak terbaca atau tidak valid.");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try different model naming conventions and API versions
  const modelConfigs = [
    { model: "gemini-1.0-pro", apiVersion: "v1" },
    { model: "gemini-pro", apiVersion: "v1" },
    { model: "gemini-1.5-flash", apiVersion: "v1" },
    { model: "gemini-1.5-flash-latest", apiVersion: "v1" },
    { model: "gemini-2.0-flash-exp", apiVersion: "v1beta" }
  ];
  
  let lastError = null;

  for (const config of modelConfigs) {
    try {
      const model = genAI.getGenerativeModel({ model: config.model }, { apiVersion: config.apiVersion });
      const prompt = `Translate the following text to ${targetLang} professionally. 
      Keep all HTML tags, line breaks, and formatting EXACTLY as they are. 
      Do not add any explanations or preamble. Only return the translated text:
      
      ${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error(`Gagal menggunakan model ${config.model} (${config.apiVersion}):`, error);
      lastError = error;
      continue;
    }
  }
  throw lastError;
};
