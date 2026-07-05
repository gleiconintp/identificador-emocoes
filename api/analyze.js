// Motor de análise unificado. O texto da pessoa é a fonte prioritária;
// emoções marcadas manualmente entram como pistas secundárias.
// Roda no servidor (Vercel) — a chave da API nunca chega ao navegador.

const VOCABULARIO = `BÁSICAS: Alegria, Tristeza, Raiva, Medo, Nojo, Surpresa.
PARES: Saudade (alegria+tristeza) — algo bom que existiu e já passou; Satisfação Revanchista (alegria+raiva); Alívio (alegria+medo); Prazer Culpado (alegria+nojo); Euforia (alegria+surpresa); Frustração (raiva+tristeza); Desamparo (medo+tristeza); Decepção (nojo+tristeza); Consternação (surpresa+tristeza); Fúria Defensiva (medo+raiva); Desprezo (nojo+raiva); Indignação (raiva+surpresa); Repulsa (medo+nojo); Alarme (medo+surpresa); Estranhamento (nojo+surpresa).
TRIOS: Ciúme (medo+raiva+tristeza); Culpa (medo+nojo+tristeza); Ansiedade (medo+surpresa+tristeza); Esperança (alegria+medo+surpresa); Orgulho (alegria+raiva+surpresa); Desânimo (nojo+raiva+tristeza); Gratidão (alegria+surpresa+tristeza); Perplexidade (medo+nojo+surpresa); Vitória Agridoce (alegria+raiva+tristeza); Despedida (alegria+medo+tristeza); Desencanto (alegria+nojo+tristeza); Afronta (alegria+medo+raiva); Fúria Justiceira (alegria+nojo+raiva); Fascínio Mórbido (alegria+medo+nojo); Deleite Bizarro (alegria+nojo+surpresa); Traição (raiva+surpresa+tristeza); Escândalo (nojo+surpresa+tristeza); Vergonha (medo+nojo+raiva); Sobressalto (medo+raiva+surpresa); Ultraje (nojo+raiva+surpresa).`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Método não permitido." });
    return;
  }
  const { texto, marcadas } = req.body || {};
  if (!texto || typeof texto !== "string" || !texto.trim()) {
    res.status(400).json({ error: "Envie um texto para analisar." });
    return;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor." });
    return;
  }

  const listaMarcadas =
    Array.isArray(marcadas) && marcadas.length
      ? marcadas.map((m) => `${m.id}${m.intensidade ? " (" + m.intensidade + ")" : ""}`).join(", ")
      : null;

  const prompt = `Você é o motor de análise de um app de autoconhecimento emocional, com profundidade inspirada na psicologia das emoções e na TCC. Você não é terapeuta e não diagnostica.

O app trabalha com 6 emoções básicas (Ekman): alegria, tristeza, raiva, medo, nojo, surpresa — e nomeia emoções complexas como combinações delas.

VOCABULÁRIO DE EMOÇÕES COMPLEXAS DO APP:
${VOCABULARIO}

RELATO DA PESSOA (fonte prioritária da análise):
"""
${texto}
"""
${listaMarcadas ? `\nEmoções que a pessoa marcou manualmente sobre o que SENTE (com intensidade): ${listaMarcadas}.\nRegra de integração: as marcações são o autorrelato do sentimento e devem ser RESPEITADAS — inclua TODAS elas em "emotions". O relato descreve a SITUAÇÃO e comanda o nome e a interpretação. Se uma emoção marcada não aparecer no relato, NÃO a apague: dê a ela um lugar na explicação ou na hipótese (ex.: "a raiva leve que você marcou pode ser a cobrança interna que quer virar movimento"). Você pode ACRESCENTAR emoções claramente evidentes no relato que não foram marcadas.` : ""}

SUA TAREFA — responda SOMENTE com JSON válido, sem markdown, exatamente neste formato:
{"risk": false, "emotions": ["alegria","tristeza"], "evidencias": {}, "nome": "...", "custom": false, "descricao": "", "dicas": [], "acolhimento": "...", "explicacao": "...", "hipotese": "", "pergunta": "..."}

CALIBRAGEM DE CARGA (leia antes de escrever qualquer campo):
Avalie a carga emocional da pessoa pelo tom do relato e pelas intensidades marcadas.
- Carga ALTA (esgotamento, desespero, intensidades altas, linguagem de peso): priorize validação e alívio. No MÁXIMO UM convite à ação em todo o resultado (somando dicas e pergunta) — o resto deve ser reflexivo ou de autocompaixão. Clareza sim, cobrança não: a pessoa não precisa sair com mais uma tarefa na pilha.
- Carga LEVE/MODERADA com energia disponível: pode haver mais direção prática, mantendo o tom de convite.
Nunca repita a mesma ideia em campos diferentes (acolhimento, explicação e dicas devem se complementar, não se ecoar).

Regras de cada campo:
- "risk": true SOMENTE se o relato indicar ideação suicida, vontade de se machucar ou crise aguda. Tristeza, desabafo ou raiva comuns NÃO são risco. Se true, deixe todos os outros campos vazios.
- "emotions": quando houver emoções marcadas, inclua TODAS elas e acrescente APENAS as que tiverem evidência explícita no relato (máx. 6 no total); sem marcações, identifique as realmente presentes no relato (1 a 4). Ids exatamente em minúsculo: alegria, tristeza, raiva, medo, nojo, surpresa. REGRA CRÍTICA: "emotions" vem SOMENTE do relato e das marcações — NUNCA adicione uma emoção para fechar a fórmula do nome escolhido. O nome NÃO precisa bater com a composição do vocabulário (ex.: o relato pode merecer o nome "Orgulho" com apenas alegria+surpresa presentes — nesse caso NÃO adicione raiva). Se acrescentar uma emoção não marcada, deve conseguir apontar a frase do relato que a evidencia.
- "evidencias": para CADA emoção em "emotions" que NÃO foi marcada pela pessoa, copie um trecho LITERAL e curto do relato (mínimo 3 palavras, copiado exatamente como escrito, sem parafrasear) que comprova essa emoção. Formato: {"raiva": "trecho literal do relato"}. Se não existir trecho que a comprove, a emoção simplesmente NÃO entra em "emotions". Emoções marcadas pela pessoa não precisam de evidência. O sistema confere automaticamente se o trecho existe no relato — trechos inventados fazem a emoção ser descartada.
- Relato puramente positivo (sem conflito no texto): celebre junto. Prefira "hipotese" VAZIA a uma hipótese forçada — alegria não precisa de tratamento nem de problema escondido.
- Os exemplos entre aspas nestas instruções são APENAS ilustrativos de formato e tom: NÃO os reutilize literalmente nem parafraseados de perto — crie formulações próprias para o caso concreto.
- "nome": o nome que melhor traduz a SITUAÇÃO VIVIDA — não basta conter as mesmas emoções básicas; o enredo do nome precisa bater com o enredo do relato. Exemplo do que NÃO fazer: pessoa feliz pelo sucesso de um amigo mas triste na comparação com o próprio negócio NÃO é "Vitória Agridoce" (ela não venceu nada) — é algo como "Inveja Benigna". Use um nome do VOCABULÁRIO somente se a situação típica dele corresponder ao relato. Se nenhum couber com precisão, crie um nome próprio em português (1 a 3 palavras) e marque "custom": true. Melhor um nome novo e certeiro do que um conhecido e errado.
- "descricao": APENAS se custom=true — definição geral dessa emoção em até 35 palavras, tom claro e acolhedor, sem jargão. Se custom=false, string vazia.
- "acolhimento": 1 frase (máx. 22 palavras) que é a PRIMEIRA coisa que a pessoa lê depois do nome. Sua função: amparar antes de qualquer análise — universalizar o sentimento quando ele for genuinamente comum ("sentir isso diante de uma comparação é profundamente humano — e muito mais comum do que se fala") e aliviar de antemão a culpa de senti-lo. NÃO use o nome da emoção nesta frase. Sem positividade forçada, sem mentir: normalize o TER o sentimento, não o declare "bom".
- "dicas": SEMPRE exatamente 3, escritas para ESTA situação específica — cada uma deve fazer referência concreta a elementos do relato (a pessoa, o contexto, o padrão de pensamento descrito), com profundidade inspirada na TCC: uma pode trabalhar o pensamento (ex.: examinar a comparação — o que ela mede e o que ela esconde), uma pode ser um passo comportamental pequeno e concreto, uma pode cuidar da relação da pessoa consigo mesma. Proibido conselho genérico que serviria para qualquer situação ("converse com alguém", "respire fundo") sem amarrar ao caso.
- "explicacao": 2 a 3 frases (máx. 65 palavras) conectando elementos CONCRETOS do relato à emoção nomeada. Ao usar pela primeira vez um nome com carga moral (inveja, ciúme, raiva, desprezo), desarme o estigma no mesmo fôlego: ex. "isso pode ser chamado de inveja benigna — não no sentido ruim da palavra; aqui é só informação sobre o que você deseja para si". NUNCA mencione a mecânica interna do app (combinações, trios, fórmulas). Sem clichês.
- "hipotese": OPCIONAL (string vazia se não houver base no relato). No máximo UMA hipótese sobre um sentimento adjacente que a pessoa talvez ainda não tenha percebido — SOMENTE se o relato der indícios dele e SOMENTE sobre algo que NÃO está em "emotions" (nunca sugira checar um sentimento que o resultado já mostra como presente). Linguagem obrigatoriamente convidativa e verificável pela pessoa: "vale checar se...", "algumas pessoas nessa situação também notam...". NUNCA afirme o que a pessoa sente ("você também sente X" é proibido). Objetivo: ampliar a consciência, não diagnosticar. Ex. (num relato de luto): "vale checar se, junto da saudade, aparece também um alívio — ele costuma vir com culpa, mas é uma reação comum depois de longos períodos de cuidado."
- "pergunta": 1 pergunta socrática gentil (máx. 20 palavras), com UMA única demanda (nunca duas perguntas em uma, nunca "o que você gostaria + o que depende de você"). Calibre pelo estado da pessoa: carga alta → pergunta exploratória ou de autocompaixão ("o que você diria a um amigo que sentisse isso?"); energia disponível → pergunta suave de agência. Nunca soe como "e aí, o que você vai fazer?".`;

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: "application/json" },
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
      risk: parsed.risk === true,
      emotions: Array.isArray(parsed.emotions) ? parsed.emotions : [],
      evidencias: parsed.evidencias && typeof parsed.evidencias === "object" ? parsed.evidencias : {},
      nome: typeof parsed.nome === "string" ? parsed.nome : "",
      custom: parsed.custom === true,
      descricao: typeof parsed.descricao === "string" ? parsed.descricao : "",
      dicas: Array.isArray(parsed.dicas) ? parsed.dicas.slice(0, 3) : [],
      acolhimento: typeof parsed.acolhimento === "string" ? parsed.acolhimento : "",
      explicacao: typeof parsed.explicacao === "string" ? parsed.explicacao : "",
      hipotese: typeof parsed.hipotese === "string" ? parsed.hipotese : "",
      pergunta: typeof parsed.pergunta === "string" ? parsed.pergunta : "",
    });
  } catch (e) {
    res.status(500).json({ error: "Falha ao interpretar a resposta da IA." });
  }
}
