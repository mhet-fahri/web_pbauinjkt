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
    const target = lowerLang === 'arabic' || lowerLang === 'ar' ? 'Arabic' : 
                   (lowerLang === 'english' || lowerLang === 'en' ? 'English' : lowerLang);

    // 1. Try Llama 3 for better quality and Arabic support
    try {
      const result = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
        messages: [
          { role: "system", content: `You are a professional translator. Translate the user text to ${target}. Keep all HTML tags and formatting exactly as they are. Return ONLY the translated text without any explanation.` },
          { role: "user", content: text }
        ]
      });
      
      if (result && result.response) {
        return new Response(JSON.stringify({ translated_text: result.response }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      console.error("Llama 3 translation failed, falling back to m2m100...");
    }

    // 2. Fallback to m2m100
    const m2mResult = await env.AI.run("@cf/meta/m2m100-1.2b", {
      text: text,
      source_lang: "indonesian",
      target_lang: target.toLowerCase()
    });

    return new Response(JSON.stringify(m2mResult), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
