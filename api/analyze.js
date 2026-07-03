// Função serverless (Vercel). Roda no servidor, então a chave da API
// fica escondida — nunca é enviada para o navegador da pessoa usando o app.
//
// Usa a API do Google Gemini (nível gratuito).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }

  const { texto } = req.body || {};
  if (!texto || typeof texto !== "string" || !texto.trim()) {
    res.status(400).json({ error: "Envie um texto para analisar." });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor." });
    return;
  }

  const prompt = `Você escreve reflexões curtas para um app de autoconhecimento emocional.
Sua sensibilidade e forma de observar são inspiradas em psicologia e na abordagem
cognitivo-comportamental (TCC) — atenta a padrões de pensamento por trás da emoção,
não só ao rótulo dela. Mas você não é terapeuta, não diagnostica, e não substitui
acompanhamento profissional.

Existem exatamente 6 emoções básicas possíveis: alegria, tristeza, raiva, medo, nojo, surpresa.

Leia o texto abaixo, escrito por uma pessoa descrevendo o que sente, e faça duas coisas:

1. Identifique quais dessas 6 emoções básicas estão presentes nele (normalmente entre 1 e 3).

2. Escreva uma reflexão de 2 a 3 frases (máximo 45 palavras) que vá além de só nomear
a emoção. Pode apontar o que costuma estar por trás dela, um padrão de pensamento comum
nesse tipo de situação, ou uma pergunta gentil que ajude a pessoa a olhar para o que sente
com mais clareza. Seja denso e humano, não prolixo — evite frases prontas de autoajuda e
evite jargão clínico. Não dê conselhos práticos aqui (isso já aparece em outra parte do
app) — o foco é ajudar a pessoa a se entender melhor, não dizer o que fazer.

Texto da pessoa:
"""
${texto}
"""

Responda SOMENTE com um JSON válido, sem markdown, sem texto antes ou depois, exatamente neste formato:
{"emotions": ["medo","tristeza"], "reflection": "sua reflexão de 2 a 3 frases aqui"}

Regras:
- Os ids em "emotions" devem ser exatamente: alegria, tristeza, raiva, medo, nojo ou surpresa (minúsculo).
- Liste no máximo 4 emoções, as mais evidentes no texto.
- Se o texto não permitir identificar nenhuma emoção com clareza, responda {"emotions": [], "reflection": ""}.`;

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      res.status(502).json({ error: `Erro na API do Gemini: ${errText}` });
      return;
    }

    const data = await r.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const parsed = JSON.parse(raw);

    res.status(200).json({
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      reflection: parsed.reflection || "",
    });
  } catch (e) {
    res.status(500).json({ error: "Falha ao interpretar a resposta da IA." });
  }
}
