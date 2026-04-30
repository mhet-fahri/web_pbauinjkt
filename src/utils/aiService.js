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
const translateWithGemini = async (text, targetLang) => {
  if (!genAI) throw new Error("Gemini API Key tidak terbaca.");

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
      continue;
    }
  }
  throw lastError;
};

/**
 * Main AI Translation Service
 */
export const translateWithAI = async (text, targetLang) => {
  try {
    // 1. Coba pakai Cloudflare Workers AI dulu (lebih cepat)
    // Catatan: Jika teks sangat kompleks dengan banyak HTML, 
    // kamu bisa langsung loncat ke Gemini.
    if (text.length < 500 && !text.includes('<')) {
      return await translateWithCloudflare(text, targetLang);
    }
    
    // 2. Gunakan Gemini untuk teks panjang atau yang ada HTML-nya
    return await translateWithGemini(text, targetLang);
  } catch (error) {
    console.warn("Mencoba fallback ke Gemini karena Cloudflare gagal...");
    try {
      return await translateWithGemini(text, targetLang);
    } catch (finalError) {
      throw new Error("Semua layanan AI gagal: " + finalError.message);
    }
  }
};
