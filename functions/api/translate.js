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
    const target = lowerLang === 'arabic' || lowerLang === 'ar' ? 'arabic' : 
                   (lowerLang === 'english' || lowerLang === 'en' ? 'english' : lowerLang);

    // Cloudflare Workers AI Translation
    const result = await env.AI.run("@cf/meta/m2m100-1.2b", {
      text: text,
      source_lang: "indonesian",
      target_lang: target
    });

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
