/**
 * Unified AI Translation Service (Backend-driven)
 */
export const translateWithAI = async (text, targetLang) => {
  return await translateWithCloudflare(text, targetLang);
};

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
      throw new Error(errorData.error || 'Terjadi kesalahan pada server translasi');
    }

    const data = await response.json();
    if (!data.translated_text) throw new Error("Hasil translasi kosong");
    
    return data.translated_text;
  } catch (error) {
    console.error("Translation Service Error:", error);
    throw error;
  }
};

// Gemini and Groq are now handled on the backend for security and stability
const translateWithGemini = async (text, targetLang) => translateWithAI(text, targetLang);
const translateWithGroq = async (text, targetLang) => translateWithAI(text, targetLang);
