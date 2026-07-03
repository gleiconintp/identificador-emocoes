// Função serverless (Vercel). Roda no servidor, então a chave da API
// fica escondida — nunca é enviada para o navegador da pessoa usando o app.

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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY não configurada no servidor." });
    return;
  }

  const prompt = `Você é um classificador de emoções.

Existem exatamente 6 emoções básicas possíveis: alegria, tristeza, raiva, medo, nojo, surpresa.

Leia o texto abaixo, escrito por uma pessoa descrevendo o que sente, e identifique quais dessas 6 emoções básicas estão presentes nele (normalmente entre 1 e 3).

Texto da pessoa:
"""
${texto}
"""

Responda SOMENTE com um JSON válido, sem markdown, sem texto antes ou depois, exatamente neste formato:
{"emotions": ["medo","tristeza"], "reflection": "uma frase curta e empática (máximo 20 palavras), sem repetir literalmente o texto da pessoa"}

Regras:
- Os ids em "emotions" devem ser exatamente: alegria, tristeza, raiva, medo, nojo ou surpresa (minúsculo).
- Liste no máximo 4 emoções, as mais evidentes no texto.
- Se o texto não permitir identificar nenhuma emoção com clareza, responda {"emotions": [], "reflection": ""}.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        // Tarefa simples de classificação — Haiku é rápido e barato para isso.
        // Troque para "claude-sonnet-4-6" se quiser respostas mais refinadas.
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      res.status(502).json({ error: `Erro na API da Anthropic: ${errText}` });
      return;
    }

    const data = await r.json();
    const raw = (data.content || []).map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.status(200).json({
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      reflection: parsed.reflection || "",
    });
  } catch (e) {
    res.status(500).json({ error: "Falha ao interpretar a resposta da IA." });
  }
}
