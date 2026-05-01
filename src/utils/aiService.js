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
      const model = genAI.getGenerativeModel({ 
        model: config.model,
        generationConfig: {
          temperature: 0.1, // Very low for stable translation
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        }
      }, { apiVersion: config.apiVersion });

      const prompt = `Task: Professional Translation.
Target Language: ${targetLang}
Input Language: Indonesian

Instructions:
1. Translate the input text COMPLETELY into ${targetLang}.
2. Keep ALL HTML tags, styles, and structures exactly as they are.
3. Do NOT mix languages. Ensure the entire output is in ${targetLang}.
4. Do NOT add any notes, explanations, or preamble.
5. Return ONLY the final translated content.

Input Text to Translate:
${text}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let translated = response.text().trim();
      
      // Basic cleaning if AI adds markers
      translated = translated.replace(/^```html/i, '').replace(/```$/i, '').trim();
      
      return translated;
    } catch (error) {
      console.error(`Gagal menggunakan model ${config.model} (${config.apiVersion}):`, error);
      lastError = error;
      continue;
    }
  }
  throw lastError;
};
