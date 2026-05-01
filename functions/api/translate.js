export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Check if AI binding exists
    if (!env.AI) {
      return new Response(JSON.stringify({ error: "AI binding not found in Cloudflare Pages settings." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { text, target_lang } = await request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const lowerLang = target_lang.toLowerCase();
    const isArabic = lowerLang === 'arabic' || lowerLang === 'ar';
    const targetName = isArabic ? 'Arabic' : 'English';

    // 1. If English, use the fast m2m100 model directly
    if (!isArabic) {
      const m2mResult = await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: text,
        source_lang: "indonesian",
        target_lang: "english"
      });
      return new Response(JSON.stringify(m2mResult), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. If Arabic, use Llama 3 for high quality (a bit slower but better)
    try {
      const result = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { role: "system", content: "Translate to Arabic professionally. Keep HTML tags. Return ONLY translation." },
          { role: "user", content: text }
        ]
      });
      
      if (result && result.response) {
        return new Response(JSON.stringify({ translated_text: result.response }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      // Final fallback
      const finalResult = await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: text,
        source_lang: "indonesian",
        target_lang: "arabic"
      });
      return new Response(JSON.stringify(finalResult), {
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
