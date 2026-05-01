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
    // 1. Try Groq (Primary - Best Quality & Speed)
    return await translateWithGroq(text, targetLang);
  } catch (error) {
    console.warn("Groq failed, trying Gemini as fallback...", error);
    try {
      // 2. Try Gemini (Secondary)
      return await translateWithGemini(text, targetLang);
    } catch (geminiError) {
      console.warn("Gemini failed, trying Cloudflare as fallback...", geminiError);
      try {
        // 3. Try Cloudflare (Final Fallback)
        return await translateWithCloudflare(text, targetLang);
      } catch (finalError) {
        throw new Error("Semua layanan AI gagal: " + finalError.message);
      }
    }
  }
};

/**
 * Groq Translation (Primary - Most Powerful)
 * Uses Llama 3.1 70B for superior academic translation
 */
const translateWithGroq = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey || apiKey === "undefined") throw new Error("Groq API Key tidak terbaca.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-70b-versatile",
      messages: [
        { 
          role: "system", 
          content: `You are an expert academic translator for a university website. 
          Translate the text into ${targetLang} professionally.
          RULES:
          1. Keep ALL HTML tags exactly as they are.
          2. Translate EVERYTHING. Do NOT skip any words.
          3. Use formal, academic vocabulary.
          4. Return ONLY the translation.` 
        },
        { role: "user", content: text }
      ],
      temperature: 0,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Groq API Error");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
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
        systemInstruction: `You are an expert translator. Translate the text into ${targetLang}. 
        Keep HTML. Do NOT add preamble. Do NOT mix languages.`
      }, { apiVersion: "v1beta" });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text }] }],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ]
      });
      
      const response = await result.response;
      let translated = response.text().trim();
      
      // Strict check for "cities and cities" or "history of the world" loops
      if (translated.toLowerCase().includes("cities and cities") || translated.toLowerCase().includes("history of the world")) {
        throw new Error("Looping detected");
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
