import React, { useState } from 'react';
import OpenAI from 'openai';
import { Sparkles, Loader2, Globe } from 'lucide-react';

// Initialize OpenAI with NVIDIA NIM endpoint
const openai = new OpenAI({
  apiKey: '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',
  baseURL: import.meta.env.DEV 
    ? `${window.location.origin}/api/nvidia` 
    : 'https://integrate.api.nvidia.com/v1',
  dangerouslyAllowBrowser: true
});

const GenerateAi = ({ formData, setFormData, lang }) => {
  const [loading, setLoading] = useState(false);

  const isArabic = lang === 'ar';
  const langLabel = isArabic ? 'Arabic' : 'English';

  const generateTranslation = async () => {
    // Basic validation
    if (!formData.title || !formData.content) {
      alert('Mohon isi judul dan konten dalam Bahasa Indonesia terlebih dahulu.');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Translate this Indonesian news to ${langLabel}. 
Return a JSON object with these exact keys: "title_${lang}", "content_${lang}". 
Keep HTML tags.

Title: ${formData.title}
Content: ${formData.content}`;

      const completion = await openai.chat.completions.create({
        model: "google/gemma-3n-e4b-it",
        response_format: { type: "json_object" },
        messages: [
          { 
            role: "system", 
            content: `You are a professional ${langLabel} translator. You ONLY output valid JSON.` 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.1,
        top_p: 1,
        max_tokens: 3000,
        stream: false
      });

      const responseText = completion.choices[0]?.message?.content;
      console.log(`AI Raw Response (${lang}):`, responseText);
      
      try {
        // Use regex to extract JSON object in case model adds extra text or backticks
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found in response');
        
        const result = JSON.parse(jsonMatch[0]);
        console.log(`Parsed Result (${lang}):`, result);

        // Deep scan for keys if exact matches fail
        const findKey = (pattern) => Object.keys(result).find(k => k.toLowerCase().includes(pattern));
        
        const titleKey = findKey('title') || findKey('judul');
        const contentKey = findKey('content') || findKey('isi') || findKey('body');

        const translatedTitle = result[`title_${lang}`] || (titleKey ? result[titleKey] : null);
        const translatedContent = result[`content_${lang}`] || (contentKey ? result[contentKey] : null);

        console.log(`Mapped Values (${lang}):`, { title: translatedTitle, content: translatedContent });

        setFormData(prev => ({
          ...prev,
          [`title_${lang}`]: translatedTitle || prev[`title_${lang}`],
          [`content_${lang}`]: translatedContent || prev[`content_${lang}`]
        }));
        
        alert(`Berhasil menerjemahkan ke Bahasa ${isArabic ? 'Arab' : 'Inggris'}!`);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError, 'Response:', responseText);
        throw new Error('Gagal memproses format respon dari AI.');
      }
    } catch (error) {
      console.error('AI Generation Error:', error);
      alert('Terjadi kesalahan: ' + (error.message || 'Gagal menghubungi server AI'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={generateTranslation}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-lg transition-all disabled:opacity-50 active:scale-95 ${
        isArabic 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20' 
          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
      }`}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Globe size={14} />
      )}
      <span>{loading ? 'Translating...' : `AI ${langLabel}`}</span>
    </button>
  );
};

export default GenerateAi;