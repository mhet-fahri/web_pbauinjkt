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

    // Cloudflare Workers AI Translation
    // target_lang expect 'arabic' or 'english' (or other supported languages)
    const result = await env.AI.run("@cf/meta/m2m100-1.2b", {
      text: text,
      source_lang: "indonesian",
      target_lang: target_lang === "ar" ? "arabic" : (target_lang === "en" ? "english" : target_lang)
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
