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
    // 1. Try Gemini first (now using the new API Key)
    return await translateWithGemini(text, targetLang);
  } catch (error) {
    console.warn("Gemini failed, trying Cloudflare as fallback...");
    try {
      // 2. Fallback to Cloudflare (Llama 3.1)
      return await translateWithCloudflare(text, targetLang);
    } catch (finalError) {
      throw new Error("Semua layanan AI gagal: " + finalError.message);
    }
  }
};

const translateWithGemini = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("Gemini API Key tidak terbaca atau tidak valid.");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Use Gemini 1.5 Flash as primary (Smartest & Most Stable)
  const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError = null;

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        systemInstruction: `You are a professional academic translator for a university website. 
        Your task is to translate Indonesian text into ${targetLang} with high precision.
        
        RULES:
        1. Translate EVERYTHING. Do not skip words like "kompetensi", "ekosistem", or place names.
        2. Keep all HTML tags (<p>, <strong>, etc.) exactly where they are.
        3. Use formal, academic vocabulary appropriate for a university.
        4. Do NOT include any English/Indonesian words in the Arabic output unless it's a proper name.
        5. Return ONLY the translated text. No preamble, no "Here is the translation".`
      }, { apiVersion: "v1beta" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          temperature: 0, // Absolute zero for maximum stability
          topP: 1,
          topK: 1,
          maxOutputTokens: 4096,
        }
      });
      
      const response = await result.response;
      let translated = response.text().trim();
      
      // Safety check for looping
      if (translated.split(' ').length > 10 && new Set(translated.split(' ')).size < (translated.split(' ').length / 3)) {
        throw new Error("Model detected looping, retrying with next model...");
      }

      return translated;
    } catch (error) {
      console.error(`Gagal menggunakan model ${modelName}:`, error);
      lastError = error;
      continue;
    }
  }
  throw lastError;
};
