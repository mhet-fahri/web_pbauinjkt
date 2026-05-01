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

    // 1. Try Groq (Llama 3.1 70B) - BEST QUALITY
    const groqKey = env.VITE_GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.1-70b-versatile",
            messages: [
              { 
                role: "system", 
                content: `You are an expert academic translator for a university. 
                Translate the input into ${targetName} professionally.
                RULES:
                1. Keep ALL HTML tags exactly.
                2. Use formal, academic vocabulary.
                3. Return ONLY the translated string.` 
              },
              { role: "user", content: text }
            ],
            temperature: 0
          })
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          return new Response(JSON.stringify({ translated_text: groqData.choices[0].message.content.trim() }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        console.error("Groq Backend Error:", e);
      }
    }

    // 2. Fallback to Cloudflare AI
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
        messages: [
          { role: "system", content: `Translate to ${targetName}. Keep HTML. Return ONLY translation.` },
          { role: "user", content: text }
        ],
        max_tokens: 4096
      });
      
      if (result && result.response) {
        return new Response(JSON.stringify({ translated_text: result.response }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (e) {
      // 3. Final Fallback to m2m100
      const m2mResult = await env.AI.run("@cf/meta/m2m100-1.2b", {
        text: text,
        source_lang: "indonesian",
        target_lang: lowerLang === 'arabic' || lowerLang === 'ar' ? 'arabic' : 'english'
      });
      return new Response(JSON.stringify(m2mResult), {
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
