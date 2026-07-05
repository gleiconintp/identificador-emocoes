import { useState, useEffect } from "react";
import {
  Sparkles, Loader2, RotateCcw, ArrowRight, Check, BookOpen,
  History, Download, Upload, FileText, HeartHandshake, X, Trash2
} from "lucide-react";

/* =========================================================
   DADOS — 6 emoções básicas (Ekman)
========================================================= */

const ORDER = ["alegria", "tristeza", "raiva", "medo", "nojo", "surpresa"];

const EMOTIONS = {
  alegria: {
    id: "alegria", symbol: "Al", nome: "Alegria", cor: "#F0B429",
    funcao: "Aproxima você do que faz bem.",
    descricao: "Sinal de que algo está indo bem — vale reconhecer e repetir.",
    dicas: [
      "Perceba o que gerou esse bem-estar.",
      "Compartilhe com alguém — alegria dividida rende mais.",
      "Guarde esse momento como referência para os dias difíceis.",
    ],
  },
  tristeza: {
    id: "tristeza", symbol: "Tr", nome: "Tristeza", cor: "#5B84B1",
    funcao: "Ajuda a processar perdas e pede desaceleração.",
    descricao: "Não precisa ser resolvida na hora — às vezes só precisa de espaço.",
    dicas: [
      "Permita-se desacelerar, mesmo que por pouco tempo.",
      "Coloque em palavras o que foi perdido ou não aconteceu.",
      "Busque companhia que não tente te animar à força.",
    ],
  },
  raiva: {
    id: "raiva", symbol: "Ra", nome: "Raiva", cor: "#D64545",
    funcao: "Protege limites e aponta injustiças.",
    descricao: "Costuma indicar que algo importante foi ultrapassado.",
    dicas: [
      "Identifique qual limite foi cruzado antes de agir.",
      "Dê um intervalo antes de responder — a raiva pede ação rápida, nem sempre a certa.",
      "Transforme em um pedido claro, não em ataque.",
    ],
  },
  medo: {
    id: "medo", symbol: "Me", nome: "Medo", cor: "#3F7566",
    funcao: "Promove proteção diante de um risco.",
    descricao: "Prepara o corpo para agir diante de uma ameaça — nem sempre do tamanho que parece.",
    dicas: [
      "Pergunte: o risco é real, provável ou só possível?",
      "Respire fundo antes de decidir — o medo distorce o tamanho das coisas.",
      "Liste o que está sob seu controle agora.",
    ],
  },
  nojo: {
    id: "nojo", symbol: "No", nome: "Nojo", cor: "#7B5EA7",
    funcao: "Afasta você de algo potencialmente prejudicial.",
    descricao: "Pode ser físico ou moral — os dois avisam para manter distância.",
    dicas: [
      "Confie no incômodo: ele geralmente tem um motivo.",
      "Coloque distância física ou emocional do que causou a reação.",
      "Se for sobre uma pessoa ou situação, avalie se é hora de rever o vínculo.",
    ],
  },
  surpresa: {
    id: "surpresa", symbol: "Su", nome: "Surpresa", cor: "#E8873B",
    funcao: "Direciona sua atenção para o inesperado.",
    descricao: "É a emoção mais curta — logo dá lugar a outra, dependendo do que vem a seguir.",
    dicas: [
      "Dê um instante antes de reagir — a surpresa passa rápido.",
      "Observe qual emoção aparece logo depois dela.",
      "Nem todo inesperado é ameaça; avalie com calma.",
    ],
  },
};

/* =========================================================
   COMBINAÇÕES DE 2 — 15/15 cobertas
========================================================= */

const PAIRS = {
  "alegria|tristeza": {
    nome: "Saudade",
    descricao: "Alegria por algo bom que existiu, misturada com a tristeza de que já passou.",
    dicas: [
      "Permita-se sorrir e sentir o aperto no peito ao mesmo tempo — os dois cabem juntos.",
      "Registre a lembrança em vez de tentar apressá-la a ir embora.",
      "Se possível, reconecte-se com quem ou o que gerou essa saudade.",
    ],
  },
  "alegria|raiva": {
    nome: "Satisfação Revanchista",
    descricao: "Alívio ou alegria ao ver algo dar errado para quem te prejudicou, com raiva ainda não resolvida.",
    dicas: [
      "Reconheça a raiva de fundo — ela ainda pede algo seu.",
      "Cuidado para não confundir desforra com resolução real do conflito.",
      "Se possível, converse sobre o que ainda incomoda.",
    ],
  },
  "alegria|medo": {
    nome: "Alívio",
    descricao: "O medo perde força e dá espaço para a alegria de estar seguro de novo.",
    dicas: [
      "Note no corpo onde estava a tensão e deixe ela se soltar.",
      "Não pule direto para a próxima tarefa — dê um instante para o corpo assimilar.",
      "Se fizer sentido, agradeça a quem ajudou a resolver a situação.",
    ],
  },
  "alegria|nojo": {
    nome: "Prazer Culpado",
    descricao: "Gostar de algo que, ao mesmo tempo, você julga errado, exagerado ou de mau gosto.",
    dicas: [
      "Separe o prazer real do julgamento que vem em seguida.",
      "Pergunte de quem é esse julgamento — seu ou de outra pessoa?",
      "Nem todo prazer precisa ser justificado.",
    ],
  },
  "alegria|surpresa": {
    nome: "Euforia",
    descricao: "Alegria potencializada por algo bom e inesperado ao mesmo tempo.",
    dicas: [
      "Aproveite o pico, mas evite decisões importantes nesse estado.",
      "Compartilhe a notícia com alguém de confiança.",
      "Deixe a euforia assentar antes de fazer planos grandes.",
    ],
  },
  "raiva|tristeza": {
    nome: "Frustração",
    descricao: "Algo não saiu como esperado e você se sente impotente para mudar.",
    dicas: [
      "Separe o que ainda pode ser ajustado do que já não depende de você.",
      "Coloque em palavras o que exatamente não saiu como esperado.",
      "Dê um passo pequeno em vez de tentar resolver tudo de uma vez.",
    ],
  },
  "medo|tristeza": {
    nome: "Desamparo",
    descricao: "A sensação de que algo ruim aconteceu ou vai acontecer — e de que não há o que fazer.",
    dicas: [
      "Busque apoio — desamparo diminui quando é dividido.",
      "Foque em uma ação pequena e possível, não na situação inteira.",
      "Se persistir por muito tempo, considere conversar com um profissional.",
    ],
  },
  "nojo|tristeza": {
    nome: "Decepção",
    descricao: "Algo ou alguém não correspondeu ao que você esperava.",
    dicas: [
      "Compare a expectativa real com o que aconteceu — às vezes a distância é menor do que parece.",
      "Dê um tempo antes de decidir o que fazer com a decepção.",
      "Converse com quem gerou a decepção, se a relação valer a pena.",
    ],
  },
  "surpresa|tristeza": {
    nome: "Consternação",
    descricao: "Uma notícia ruim e inesperada tira o chão por um instante.",
    dicas: [
      "Dê tempo para a informação ser processada antes de reagir.",
      "Evite decisões grandes logo após o choque inicial.",
      "Procure alguém para compartilhar o que aconteceu.",
    ],
  },
  "medo|raiva": {
    nome: "Fúria Defensiva",
    descricao: "A raiva que aparece quando você se sente ameaçado ou encurralado — o ataque aqui é, no fundo, defesa.",
    dicas: [
      "Nomeie a ameaça real por trás da raiva — isso desarma metade dela.",
      "Se der, saia da situação antes de responder.",
      "Depois que o corpo baixar, avalie se a ameaça era do tamanho que pareceu.",
    ],
  },
  "nojo|raiva": {
    nome: "Desprezo",
    descricao: "Sensação de que algo ou alguém está muito abaixo do que você considera aceitável.",
    dicas: [
      "Cuidado: desprezo tende a fechar o diálogo — avalie se é isso que você quer.",
      "Verifique se há mágoa por trás do julgamento.",
      "Se a relação importa, foque no comportamento específico, não na pessoa inteira.",
    ],
  },
  "raiva|surpresa": {
    nome: "Indignação",
    descricao: "Algo inesperado e injusto acontece, e a reação é de revolta imediata.",
    dicas: [
      "Use a energia da indignação para agir, não só para reclamar.",
      "Verifique os fatos antes de reagir publicamente.",
      "Canalize para um pedido ou ação concreta.",
    ],
  },
  "medo|nojo": {
    nome: "Repulsa",
    descricao: "Algo parece perigoso e repugnante ao mesmo tempo — o corpo pede distância imediata.",
    dicas: [
      "Confie no impulso de se afastar.",
      "Depois de seguro, avalie racionalmente o que causou a reação.",
      "Se a repulsa for recorrente com algo específico, observe o padrão.",
    ],
  },
  "medo|surpresa": {
    nome: "Alarme",
    descricao: "Um susto repentino ativa o corpo antes mesmo de você entender o que houve.",
    dicas: [
      "Respire fundo — o corpo dispara antes da mente entender.",
      "Espere alguns segundos antes de reagir ou decidir algo.",
      "Confirme se a ameaça é real assim que possível.",
    ],
  },
  "nojo|surpresa": {
    nome: "Estranhamento",
    descricao: "Algo inesperado incomoda de um jeito que ainda não faz sentido.",
    dicas: [
      "Dê nome ao que especificamente causou o incômodo.",
      "Não force uma conclusão rápida — estranhamento pode levar tempo para clarear.",
      "Observe se a reação se repete em situações parecidas.",
    ],
  },
};

/* =========================================================
   COMBINAÇÕES DE 3 — 20/20 cobertas
========================================================= */

const TRIPLES = {
  "medo|raiva|tristeza": {
    nome: "Ciúme",
    descricao: "Medo de perder alguém ou algo importante, com tristeza antecipada e raiva de quem ameaça esse vínculo.",
    dicas: [
      "Nomeie o medo específico por trás do ciúme — geralmente é sobre perda, não sobre a outra pessoa.",
      "Evite agir por impulso: ciúme tende a exagerar ameaças.",
      "Converse diretamente com quem está envolvido, em vez de vigiar ou controlar.",
    ],
  },
  "medo|nojo|tristeza": {
    nome: "Culpa",
    descricao: "Tristeza pelo que foi feito, medo das consequências e incômodo com o próprio comportamento — com o ato, não com quem você é.",
    dicas: [
      "Separe 'eu fiz algo ruim' de 'eu sou ruim' — culpa saudável fala do comportamento.",
      "Se cabe reparo, faça um pedido de desculpas específico.",
      "Aprenda com o episódio e siga — culpa eterna não repara nada.",
    ],
  },
  "medo|surpresa|tristeza": {
    nome: "Ansiedade",
    descricao: "Medo de um futuro incerto, com antecipação de algo ruim e a sensação de não estar preparado.",
    dicas: [
      "Traga a atenção para o presente — pergunte o que é real agora.",
      "Escreva os cenários que imagina e avalie a chance real de cada um.",
      "Se a ansiedade for constante, vale buscar apoio profissional.",
    ],
  },
  "alegria|medo|surpresa": {
    nome: "Esperança",
    descricao: "Acreditar que algo bom pode acontecer, mesmo sem certeza — o medo da incerteza convive com o desejo de que dê certo.",
    dicas: [
      "Aja em direção ao que espera, não só espere.",
      "Aceite que esperança convive com incerteza — isso é normal.",
      "Celebre pequenos sinais de que o caminho está certo.",
    ],
  },
  "alegria|raiva|surpresa": {
    nome: "Orgulho",
    descricao: "Alegria por uma conquista, com a firmeza de quem defendeu algo importante — inclusive contra obstáculos inesperados.",
    dicas: [
      "Reconheça o esforço específico, não só o resultado.",
      "Compartilhe a conquista sem minimizar o que custou chegar lá.",
      "Use esse orgulho como lembrete do que você é capaz de sustentar.",
    ],
  },
  "nojo|raiva|tristeza": {
    nome: "Desânimo",
    descricao: "Depois de muita frustração acumulada, vem a sensação de que não vale mais a pena tentar.",
    dicas: [
      "Reduza a meta para o menor passo possível — só isso já ajuda a destravar.",
      "Identifique se o desânimo é sobre a tarefa ou sobre um cansaço maior.",
      "Peça ajuda para dividir o peso — desânimo cresce no isolamento.",
    ],
  },
  "alegria|surpresa|tristeza": {
    nome: "Gratidão",
    descricao: "Alegria por receber algo bom, com um toque de vulnerabilidade ao perceber que poderia não ter acontecido.",
    dicas: [
      "Diga a quem contribuiu, de forma específica, o que isso significou.",
      "Registre o momento — gratidão lembrada dura mais.",
      "Deixe-se sentir, sem pressa de retribuir na mesma hora.",
    ],
  },
  "medo|nojo|surpresa": {
    nome: "Perplexidade",
    descricao: "Algo inesperado, ameaçador e incômodo ao mesmo tempo, difícil de processar na hora.",
    dicas: [
      "Dê um tempo antes de tentar entender tudo de uma vez.",
      "Fale em voz alta ou escreva o que aconteceu — ajuda a organizar.",
      "Não tome decisões importantes nesse estado; volte quando estiver mais claro.",
    ],
  },
  "alegria|raiva|tristeza": {
    nome: "Vitória Agridoce",
    descricao: "Você conquistou algo importante, mas a vitória veio com uma perda ou uma injustiça no caminho — e as duas coisas são reais ao mesmo tempo.",
    dicas: [
      "Permita-se celebrar sem apagar o que doeu — um não anula o outro.",
      "Reconheça o custo da conquista em vez de fingir que não existiu.",
      "Fale sobre a parte difícil com alguém, não só sobre o troféu.",
    ],
  },
  "alegria|medo|tristeza": {
    nome: "Despedida",
    descricao: "Um ciclo se fecha: gratidão pelo que foi, tristeza pelo que fica para trás e receio do que vem.",
    dicas: [
      "Crie um pequeno ritual de encerramento — despedidas precisam de forma.",
      "Deixe a tristeza e a expectativa coexistirem, sem escolher uma.",
      "Dê um primeiro passo pequeno e concreto no capítulo novo.",
    ],
  },
  "alegria|nojo|tristeza": {
    nome: "Desencanto",
    descricao: "Algo ou alguém que você admirava se revelou diferente — a lembrança boa convive com o incômodo da decepção.",
    dicas: [
      "Separe o que foi real do que foi idealizado — nem tudo era ilusão.",
      "Evite apagar a história inteira por causa do final.",
      "Use o desencanto para calibrar expectativas, não para se fechar.",
    ],
  },
  "alegria|medo|raiva": {
    nome: "Afronta",
    descricao: "Diante de uma ameaça, em vez de recuar, surge o impulso de enfrentar — coragem, raiva e medo misturados no calor do momento.",
    dicas: [
      "Coragem não é ausência de medo — é agir apesar dele; reconheça os dois.",
      "Avalie o risco real antes de partir para o enfrentamento.",
      "Canalize a energia para uma ação firme, não para uma explosão.",
    ],
  },
  "alegria|nojo|raiva": {
    nome: "Fúria Justiceira",
    descricao: "A satisfação de ver uma injustiça exposta, junto com a raiva de quem a cometeu e a repulsa pelo que foi feito.",
    dicas: [
      "Verifique os fatos antes de amplificar — indignação com base errada machuca inocentes.",
      "Cuidado com o prazer de punir: ele pode desumanizar o outro.",
      "Transforme a energia em ação construtiva, não só em condenação.",
    ],
  },
  "alegria|medo|nojo": {
    nome: "Fascínio Mórbido",
    descricao: "Atração por aquilo que assusta ou repugna — o corpo diz 'afasta' e a curiosidade diz 'olha mais um pouco'.",
    dicas: [
      "É uma reação humana comum — em dose controlada, inofensiva.",
      "Observe se o consumo desse tipo de conteúdo está pesando seu humor.",
      "Use a curiosidade como pista do que te intriga, não como vício de sustos.",
    ],
  },
  "alegria|nojo|surpresa": {
    nome: "Deleite Bizarro",
    descricao: "Você se pegou gostando de algo estranho, inesperado, que 'não deveria' agradar — e isso diverte e desconcerta ao mesmo tempo.",
    dicas: [
      "Humor e estranheza andam juntos — rir do bizarro é válvula de escape.",
      "Nem todo gosto precisa de justificativa.",
      "Compartilhe com quem entende a graça — piada explicada perde metade.",
    ],
  },
  "raiva|surpresa|tristeza": {
    nome: "Traição",
    descricao: "A descoberta repentina de que alguém não era quem parecia — o chão some, e a dor vem junto com a revolta.",
    dicas: [
      "Não decida nada no impacto — traição pede tempo antes de resposta.",
      "Busque apoio antes de confrontar, não depois.",
      "A confiança quebrada fala sobre a escolha do outro, não sobre o seu valor.",
    ],
  },
  "nojo|surpresa|tristeza": {
    nome: "Escândalo",
    descricao: "Uma revelação chocante e repulsiva, que além de indignar, machuca — algo em que você acreditava foi manchado.",
    dicas: [
      "Dê tempo para processar antes de reagir publicamente.",
      "Separe o que é fato confirmado do que é versão.",
      "Decida com calma o que fazer com a informação — nem todo choque pede resposta imediata.",
    ],
  },
  "medo|nojo|raiva": {
    nome: "Vergonha",
    descricao: "Medo do julgamento, um olhar duro contra si mesmo e a 'fúria humilhada' — a raiva que aparece quando nos sentimos expostos.",
    dicas: [
      "Vergonha fala de um momento, não do seu valor como pessoa.",
      "Contar a alguém seguro é o que mais encolhe a vergonha — ela cresce no segredo.",
      "Separe 'eu errei' de 'eu sou um erro' — são coisas muito diferentes.",
    ],
  },
  "medo|raiva|surpresa": {
    nome: "Sobressalto",
    descricao: "Uma ameaça repentina pega você desprevenido — o corpo dispara em alerta e ataque antes da mente entender.",
    dicas: [
      "Respire e espere o corpo baixar — ele dispara antes da razão chegar.",
      "Confira se a ameaça é real antes de reagir a ela.",
      "Evite responder a alguém no pico dessa ativação.",
    ],
  },
  "nojo|raiva|surpresa": {
    nome: "Ultraje",
    descricao: "Testemunhar algo chocante e moralmente inaceitável — a indignação aqui é visceral, mesmo quando não te atinge diretamente.",
    dicas: [
      "Transforme a indignação em uma ação proporcional e concreta.",
      "Cuidado com a espiral de revolta — especialmente online.",
      "Escolha as batalhas: ultraje constante esgota e pouco muda.",
    ],
  },
};

/* Camadas para 4+ emoções */
const LAYER_NOTES = {
  alegria: "um fio de alegria que ainda encontra algo bom no meio disso",
  tristeza: "uma camada de tristeza, sinal de que algo importante foi tocado",
  raiva: "uma camada de raiva, indicando algum limite atravessado",
  medo: "um fundo de medo, trazendo insegurança sobre o que vem",
  nojo: "uma nota de repulsa por algo nessa situação",
  surpresa: "o impacto do inesperado ainda presente",
};

/* Modo "Sinto no corpo": sinais físicos → emoções prováveis */
const BODY_SIGNALS = [
  { id: "coracao", label: "Coração acelerado", map: ["medo", "surpresa"] },
  { id: "no-garganta", label: "Nó na garganta", map: ["tristeza", "medo"] },
  { id: "aperto-peito", label: "Aperto no peito", map: ["tristeza", "medo"] },
  { id: "tensao", label: "Tensão nos ombros / mandíbula", map: ["raiva", "medo"] },
  { id: "calor-rosto", label: "Calor no rosto", map: ["raiva", "nojo"] },
  { id: "estomago", label: "Estômago embrulhado", map: ["nojo", "medo"] },
  { id: "energia", label: "Energia, leveza no corpo", map: ["alegria"] },
  { id: "sorriso", label: "Vontade de sorrir", map: ["alegria"] },
  { id: "cansaco", label: "Cansaço sem esforço físico", map: ["tristeza"] },
  { id: "punhos", label: "Punhos fechados, impulso de explodir", map: ["raiva"] },
  { id: "fugir", label: "Vontade de sair / evitar", map: ["medo", "nojo"] },
  { id: "olhos", label: "Olhos arregalados, atenção presa", map: ["surpresa"] },
  { id: "respiracao", label: "Respiração curta", map: ["medo"] },
  { id: "arrepio", label: "Arrepio de repulsa", map: ["nojo"] },
];

const INTENSITY_LABELS = { 1: "leve", 2: "moderada", 3: "intensa" };

const SCIENCE_ITEMS = [
  {
    t: "As 6 emoções básicas — Paul Ekman",
    d: "Pesquisa transcultural identificou alegria, tristeza, raiva, medo, nojo e surpresa como emoções universais, reconhecidas em todas as culturas estudadas. É a base dos blocos deste app.",
  },
  {
    t: "Combinação de emoções — Robert Plutchik",
    d: "A 'Roda das Emoções' de Plutchik propõe que emoções complexas surgem da combinação de emoções básicas — a mesma lógica das equações que você vê aqui. É um modelo teórico consagrado para ensino e autoconhecimento.",
  },
  {
    t: "Função das emoções — Terapia Cognitivo-Comportamental (TCC)",
    d: "A ideia de que toda emoção tem uma função (medo protege, raiva defende limites) e de que nomear o que se sente é o primeiro passo para regulá-lo vem da psicoeducação usada na TCC.",
  },
  {
    t: "Vergonha vs. Culpa — June Tangney e Helen Block Lewis",
    d: "A distinção usada aqui — culpa foca no comportamento ('fiz algo ruim'), vergonha foca no self ('sou ruim'), muitas vezes com a 'fúria humilhada' — vem da pesquisa clássica dessas autoras.",
  },
  {
    t: "Desamparo — Martin Seligman",
    d: "A sensação de que 'não há o que fazer' diante do que acontece ecoa o conceito de desamparo aprendido, um dos achados mais estudados da psicologia.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function comboKey(ids) {
  return [...ids].sort().join("|");
}
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.substring(i, i + 2), 16));
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) =>
    Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
}
function blendColors(hexArr) {
  if (hexArr.length === 1) return hexArr[0];
  const rgbs = hexArr.map(hexToRgb);
  const avg = [0, 1, 2].map((i) => rgbs.reduce((s, c) => s + c[i], 0) / rgbs.length);
  return rgbToHex(avg);
}
function hexToRgba(hex, alpha) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function lighten(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c) => c + (255 - c) * amount;
  return rgbToHex([mix(r), mix(g), mix(b)]);
}

/* selecionadas: [{id, intensity}] */
function getResult(selecionadas) {
  if (!selecionadas || selecionadas.length === 0) return null;
  const sorted = [...selecionadas].sort((a, b) => {
    if (b.intensity !== a.intensity) return b.intensity - a.intensity;
    return ORDER.indexOf(a.id) - ORDER.indexOf(b.id);
  });
  const ids = selecionadas
    .map((s) => s.id)
    .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const componentes = ids.map((id) => {
    const sel = selecionadas.find((s) => s.id === id);
    return { id, nome: EMOTIONS[id].nome, cor: EMOTIONS[id].cor, intensity: sel.intensity };
  });
  const cor = blendColors(ids.map((id) => EMOTIONS[id].cor));
  const gradiente =
    ids.length === 1
      ? `linear-gradient(135deg, ${lighten(EMOTIONS[ids[0]].cor, 0.28)}, ${EMOTIONS[ids[0]].cor})`
      : `linear-gradient(120deg, ${ids.map((id) => EMOTIONS[id].cor).join(", ")})`;

  if (ids.length === 1) {
    const e = EMOTIONS[ids[0]];
    return { tipo: "basica", nome: e.nome, descricao: e.descricao, dicas: e.dicas, cor: e.cor, gradiente, componentes, camadas: [] };
  }
  if (ids.length === 2) {
    const c = PAIRS[comboKey(ids)];
    return { tipo: "combinada", nome: c.nome, descricao: c.descricao, dicas: c.dicas, cor, gradiente, componentes, camadas: [] };
  }
  if (ids.length === 3) {
    const c = TRIPLES[comboKey(ids)];
    return { tipo: "combinada", nome: c.nome, descricao: c.descricao, dicas: c.dicas, cor, gradiente, componentes, camadas: [] };
  }
  /* 4+ : núcleo (3 mais intensas) + camadas */
  const coreIds = sorted.slice(0, 3).map((s) => s.id);
  const layerIds = sorted.slice(3).map((s) => s.id);
  const core = TRIPLES[comboKey(coreIds)];
  return {
    tipo: "nucleo",
    nome: core.nome,
    descricao: core.descricao,
    dicas: core.dicas,
    cor,
    gradiente,
    componentes,
    coreIds,
    camadas: layerIds.map((id) => ({ id, nome: EMOTIONS[id].nome, cor: EMOTIONS[id].cor, nota: LAYER_NOTES[id] })),
  };
}

/* ---------- Histórico (somente no aparelho) ---------- */

const HIST_KEY = "es_historico_v1";

function loadHist() {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function persistHist(entries) {
  try { localStorage.setItem(HIST_KEY, JSON.stringify(entries)); } catch {}
}
function fmtData(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" }) +
    " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* =========================================================
   COMPONENTE
========================================================= */

export default function App() {
  const [mode, setMode] = useState("click");
  const [selected, setSelected] = useState([]); // [{id, intensity}]
  const [signals, setSignals] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [crise, setCrise] = useState(false);
  const [explicacao, setExplicacao] = useState(null);
  const [acolhimento, setAcolhimento] = useState(null);
  const [hipotese, setHipotese] = useState(null);
  const [pergunta, setPergunta] = useState(null);
  const [nota, setNota] = useState("");
  const [hist, setHist] = useState([]);
  const [showHist, setShowHist] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const [lastEntryId, setLastEntryId] = useState(null);

  useEffect(() => { setHist(loadHist()); }, []);

  function limparResultado() {
    setResultado(null); setErro(null); setCrise(false);
    setExplicacao(null); setPergunta(null); setAcolhimento(null); setHipotese(null);
    setLastEntryId(null);
  }

  function trocarModo(m) { setMode(m); setNota(""); limparResultado(); }

  function cycleEmotion(id) {
    setResultado(null); setExplicacao(null); setPergunta(null); setAcolhimento(null); setHipotese(null);
    setSelected((prev) => {
      const found = prev.find((s) => s.id === id);
      if (!found) return [...prev, { id, intensity: 1 }];
      if (found.intensity >= 3) return prev.filter((s) => s.id !== id);
      return prev.map((s) => (s.id === id ? { ...s, intensity: s.intensity + 1 } : s));
    });
  }

  function toggleSignal(id) {
    setResultado(null);
    setSignals((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function signalsToEmotions() {
    const score = {};
    signals.forEach((sid) => {
      const sig = BODY_SIGNALS.find((s) => s.id === sid);
      sig.map.forEach((eid, idx) => { score[eid] = (score[eid] || 0) + (idx === 0 ? 1 : 0.6); });
    });
    const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
    if (ranked.length === 0) return [];
    const max = ranked[0][1];
    return ranked
      .filter(([, v]) => v >= Math.max(0.6, max * 0.45))
      .slice(0, 3)
      .map(([id]) => ({ id, intensity: 2 }));
  }

  function salvarNoHistorico(res, origem, textoBase) {
    const entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      ts: Date.now(),
      origem,
      nome: res.nome,
      emocoes: res.componentes.map((c) => ({ id: c.id, i: c.intensity || 2 })),
      nota: textoBase ? textoBase.slice(0, 400) : "",
    };
    const novo = [entry, ...loadHist()].slice(0, 500);
    persistHist(novo);
    setHist(novo);
    setLastEntryId(entry.id);
  }

  const VOCABULARIO = `BÁSICAS: Alegria, Tristeza, Raiva, Medo, Nojo, Surpresa.
PARES: Saudade (alegria+tristeza) — algo bom que existiu e já passou; Satisfação Revanchista (alegria+raiva); Alívio (alegria+medo); Prazer Culpado (alegria+nojo); Euforia (alegria+surpresa); Frustração (raiva+tristeza); Desamparo (medo+tristeza); Decepção (nojo+tristeza); Consternação (surpresa+tristeza); Fúria Defensiva (medo+raiva); Desprezo (nojo+raiva); Indignação (raiva+surpresa); Repulsa (medo+nojo); Alarme (medo+surpresa); Estranhamento (nojo+surpresa).
TRIOS: Ciúme (medo+raiva+tristeza); Culpa (medo+nojo+tristeza); Ansiedade (medo+surpresa+tristeza); Esperança (alegria+medo+surpresa); Orgulho (alegria+raiva+surpresa); Desânimo (nojo+raiva+tristeza); Gratidão (alegria+surpresa+tristeza); Perplexidade (medo+nojo+surpresa); Vitória Agridoce (alegria+raiva+tristeza); Despedida (alegria+medo+tristeza); Desencanto (alegria+nojo+tristeza); Afronta (alegria+medo+raiva); Fúria Justiceira (alegria+nojo+raiva); Fascínio Mórbido (alegria+medo+nojo); Deleite Bizarro (alegria+nojo+surpresa); Traição (raiva+surpresa+tristeza); Escândalo (nojo+surpresa+tristeza); Vergonha (medo+nojo+raiva); Sobressalto (medo+raiva+surpresa); Ultraje (nojo+raiva+surpresa).`;

  function buildPromptMotor(textoBase, marcadasPayload) {
    const listaMarcadas =
      Array.isArray(marcadasPayload) && marcadasPayload.length
        ? marcadasPayload.map((m) => `${m.id}${m.intensidade ? " (" + m.intensidade + ")" : ""}`).join(", ")
        : null;
    return `Você é o motor de análise de um app de autoconhecimento emocional, com profundidade inspirada na psicologia das emoções e na TCC. Você não é terapeuta e não diagnostica.

O app trabalha com 6 emoções básicas (Ekman): alegria, tristeza, raiva, medo, nojo, surpresa — e nomeia emoções complexas como combinações delas.

VOCABULÁRIO DE EMOÇÕES COMPLEXAS DO APP:
${VOCABULARIO}

RELATO DA PESSOA (fonte prioritária da análise):
"""
${textoBase}
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
  }

  async function chamarMotor(textoBase, marcadasPayload) {
    // 1) Backend próprio (site publicado — usa Gemini com a chave protegida)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: textoBase, marcadas: marcadasPayload }),
      });
      const ct = (res.headers.get("content-type") || "").toLowerCase();
      if (ct.includes("application/json")) {
        const data = await res.json();
        if (res.ok) return data;
        throw new Error(data.error || "Erro no servidor.");
      }
      // resposta não-JSON = backend inexistente (ambiente de teste) → cai no fallback
    } catch (e) { /* segue para o fallback */ }

    // 2) Fallback: chamada direta (funciona no ambiente de teste dentro do Claude)
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: buildPromptMotor(textoBase, marcadasPayload) }],
      }),
    });
    const data = await r.json();
    const raw = (data.content || []).map((b) => b.text || "").join("");
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  }

  function findByName(nome) {
    const alvo = (nome || "").trim().toLowerCase();
    for (const id of ORDER) if (EMOTIONS[id].nome.toLowerCase() === alvo) return EMOTIONS[id];
    for (const k in PAIRS) if (PAIRS[k].nome.toLowerCase() === alvo) return PAIRS[k];
    for (const k in TRIPLES) if (TRIPLES[k].nome.toLowerCase() === alvo) return TRIPLES[k];
    return null;
  }

  async function analisarComIA(textoBase, marcadasPayload, origem, histNota) {
    setLoading(true);
    limparResultado();
    try {
      const data = await chamarMotor(textoBase, marcadasPayload);
      if (data.risk) { setCrise(true); return; }
      const MAPA_INT = { leve: 1, moderada: 2, intensa: 3 };
      const normalizar = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
      const relatoNorm = normalizar(textoBase);
      const marcadasIds = (marcadasPayload || []).map((m) => m.id).filter((id) => ORDER.includes(id));
      const iaIds = (data.emotions || []).filter((id) => ORDER.includes(id));
      // Emoções acrescentadas pela IA só entram se o trecho de evidência existir de fato no relato
      const evidencias = data.evidencias || {};
      const extrasBrutos = iaIds.filter((id) => !marcadasIds.includes(id));
      const extrasComProva = extrasBrutos.filter((id) => {
        const trecho = normalizar(evidencias[id]);
        return trecho.length >= 8 && relatoNorm.includes(trecho);
      });
      // Modo texto puro (sem marcações): se o filtro zerar tudo, mantém a leitura da IA
      const extras = marcadasIds.length > 0 ? extrasComProva : (extrasComProva.length > 0 ? extrasComProva : iaIds);
      // Garantia: emoções marcadas pela pessoa SEMPRE entram no resultado
      const ids = [...new Set([...marcadasIds, ...extras])].slice(0, 6);
      if (ids.length === 0) {
        setErro("Não consegui identificar uma emoção clara nesse relato. Tenta descrever com mais detalhes o que está sentindo no corpo ou na cabeça.");
        return;
      }
      const sel = ids.map((id) => {
        const marcada = (marcadasPayload || []).find((m) => m.id === id);
        return { id, intensity: (marcada && MAPA_INT[marcada.intensidade]) || 2 };
      });
      const base = getResult(sel);
      let final = { ...base };
      if (data.nome) {
        if (data.custom) {
          final = {
            ...base,
            tipo: "personalizada",
            nome: data.nome,
            descricao: data.descricao || base.descricao,
            dicas: Array.isArray(data.dicas) && data.dicas.length === 3 ? data.dicas : base.dicas,
            camadas: [],
          };
        } else {
          const found = findByName(data.nome);
          if (found) final = { ...base, nome: found.nome, descricao: found.descricao, dicas: found.dicas, camadas: base.camadas };
        }
        if (Array.isArray(data.dicas) && data.dicas.length === 3) final = { ...final, dicas: data.dicas };
      }
      setResultado(final);
      setSelected(sel);
      if (data.acolhimento) setAcolhimento(data.acolhimento);
      if (data.explicacao) setExplicacao(data.explicacao);
      if (data.hipotese) setHipotese(data.hipotese);
      if (data.pergunta) setPergunta(data.pergunta);
      salvarNoHistorico(final, origem, histNota);
    } catch {
      setErro("Não consegui analisar agora. Verifica sua conexão e tenta de novo.");
    } finally { setLoading(false); }
  }

  function analisarClick() {
    if (selected.length === 0 || loading) return;
    if (nota.trim()) {
      const marcadasPayload = selected.map((s) => ({ id: s.id, intensidade: INTENSITY_LABELS[s.intensity] }));
      analisarComIA(nota.trim(), marcadasPayload, "seleção", nota.trim());
      return;
    }
    limparResultado();
    const res = getResult(selected);
    setResultado(res);
    salvarNoHistorico(res, "seleção", "");
  }

  function analisarCorpo() {
    if (signals.length === 0 || loading) return;
    const emocoes = signalsToEmotions();
    if (emocoes.length === 0) return;
    const sinaisTxt = "Sinais no corpo: " + signals.map((sid) => BODY_SIGNALS.find((s) => s.id === sid).label).join(", ");
    if (nota.trim()) {
      const marcadasPayload = emocoes.map((s) => ({ id: s.id, intensidade: "moderada" }));
      analisarComIA(sinaisTxt + "\n" + nota.trim(), marcadasPayload, "corpo", sinaisTxt + " — " + nota.trim());
      return;
    }
    limparResultado();
    const res = getResult(emocoes);
    setResultado(res);
    setSelected(emocoes);
    salvarNoHistorico(res, "corpo", sinaisTxt);
  }

  function analisarTexto() {
    if (!texto.trim() || loading) return;
    analisarComIA(texto.trim(), [], "texto", texto.trim());
  }

  function novaAnalise() {
    setSelected([]); setSignals([]); setTexto(""); setNota("");
    limparResultado();
  }

  function apagarHistorico() {
    if (!window.confirm("Apagar todo o histórico deste aparelho? Essa ação não pode ser desfeita.")) return;
    persistHist([]); setHist([]);
  }

  function exportarBackup() {
    downloadFile("elementos-do-sentimento-backup.json", JSON.stringify({ v: 1, entries: hist }, null, 2), "application/json");
  }

  function importarBackup(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
        const ids = new Set(hist.map((e) => e.id));
        const merged = [...hist, ...entries.filter((e) => e && e.id && !ids.has(e.id))]
          .sort((a, b) => b.ts - a.ts).slice(0, 500);
        persistHist(merged); setHist(merged);
        alert("Backup importado: " + entries.length + " registros lidos.");
      } catch { alert("Arquivo inválido. Use um backup gerado por este app."); }
    };
    reader.readAsText(file);
    ev.target.value = "";
  }

  function exportarRelatorio() {
    const linhas = [
      "ELEMENTOS DO SENTIMENTO — RELATÓRIO DE REGISTROS EMOCIONAIS",
      "Gerado em: " + fmtData(Date.now()),
      "Total de registros: " + hist.length,
      "",
      "Este relatório foi gerado por um app de autoconhecimento (não é um instrumento clínico).",
      "Framework: 6 emoções básicas (Ekman) + combinações (inspirado em Plutchik).",
      "".padEnd(60, "-"),
      "",
    ];
    hist.forEach((e) => {
      linhas.push("[" + fmtData(e.ts) + "] " + e.nome);
      linhas.push("  Emoções: " + e.emocoes.map((x) => EMOTIONS[x.id].nome + " (" + (INTENSITY_LABELS[x.i] || "moderada") + ")").join(", "));
      if (e.nota) linhas.push("  Contexto: " + e.nota);
      linhas.push("");
    });
    downloadFile("relatorio-emocional.txt", linhas.join("\n"), "text/plain;charset=utf-8");
  }

  /* estatística simples: emoções mais frequentes nos últimos 30 dias */
  const corte = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const contagem = {};
  hist.filter((e) => e.ts >= corte).forEach((e) =>
    e.emocoes.forEach((x) => { contagem[x.id] = (contagem[x.id] || 0) + 1; }));
  const topEmocoes = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
  const maxCont = topEmocoes.length ? topEmocoes[0][1] : 1;

  return (
    <div className="eb-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .eb-app {
          --paper:#F6F4F1; --ink:#2B2622; --ink-soft:#746E6A; --line:#E7E1E4;
          --shadow-sm:0 1px 2px rgba(43,38,34,.05),0 1px 1px rgba(43,38,34,.04);
          --shadow-md:0 16px 28px -14px rgba(43,38,34,.2),0 3px 8px rgba(43,38,34,.06);
          --font-display:'Fraunces',serif; --font-body:'Inter',sans-serif; --font-mono:'IBM Plex Mono',monospace;
          background:var(--paper); color:var(--ink); font-family:var(--font-body);
          min-height:100%; padding:40px 20px 56px; box-sizing:border-box;
        }
        .eb-app *{box-sizing:border-box}
        .eb-wrap{max-width:720px;margin:0 auto}
        .eb-hero{position:relative;overflow:hidden;padding:6px;margin:-6px -6px 4px;border-radius:26px}
        .eb-blob{position:absolute;border-radius:50%;filter:blur(46px);pointer-events:none}
        .eb-blob-a{width:210px;height:210px;background:#F0B429;opacity:.3;top:-100px;left:-70px}
        .eb-blob-b{width:190px;height:190px;background:#7B5EA7;opacity:.26;top:-80px;right:-60px}
        .eb-eyebrow{position:relative;display:flex;align-items:center;gap:7px;font-family:var(--font-mono);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:12px}
        .eb-title{position:relative;font-family:var(--font-display);font-weight:500;font-size:42px;line-height:1.06;margin:0 0 12px;letter-spacing:-.01em}
        .eb-title i{font-style:italic;font-weight:500}
        .eb-sub{position:relative;font-size:15.5px;color:var(--ink-soft);max-width:500px;line-height:1.55;margin:0 0 24px}
        .eb-topbar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:24px}
        .eb-toggle{display:inline-flex;background:#fff;border:1px solid var(--line);border-radius:999px;padding:4px;gap:4px;box-shadow:var(--shadow-sm)}
        .eb-toggle button{border:none;background:transparent;padding:9px 15px;border-radius:999px;font-family:var(--font-mono);font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-soft);cursor:pointer;transition:.15s}
        .eb-toggle button.active{background:var(--ink);color:#fff}
        .eb-toggle button:not(.active):hover{color:var(--ink)}
        .eb-iconbtn{display:inline-flex;align-items:center;gap:6px;background:#fff;border:1.5px solid var(--line);border-radius:999px;padding:9px 15px;color:var(--ink);font-family:var(--font-mono);font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;box-shadow:var(--shadow-sm);transition:.18s}
        .eb-iconbtn:hover{transform:translateY(-1px);box-shadow:var(--shadow-md)}
        .eb-intensity-hint{font-size:12.5px;color:var(--ink-soft);margin:-8px 0 16px;line-height:1.5}
        .eb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:24px}
        .eb-tile{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;border:1.5px solid var(--line);border-radius:22px;background:#fff;padding:26px 14px 18px;cursor:pointer;box-shadow:var(--shadow-sm);transition:.18s;font:inherit}
        .eb-tile:hover{transform:translateY(-3px);box-shadow:var(--shadow-md)}
        .eb-tile:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
        .eb-badge{position:relative;overflow:hidden;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-mono);font-weight:700;font-size:19px;margin-bottom:13px;flex-shrink:0}
        .eb-badge::after{content:'';position:absolute;top:-45%;left:-25%;width:75%;height:75%;background:radial-gradient(circle,rgba(255,255,255,.55),transparent 70%);border-radius:50%}
        .eb-tile-name{font-family:var(--font-display);font-size:17.5px;margin:2px 0 4px;font-weight:500}
        .eb-tile-funcao{font-size:12px;color:var(--ink-soft);line-height:1.42}
        .eb-dots{display:flex;gap:4px;margin-top:10px;height:8px}
        .eb-dot{width:8px;height:8px;border-radius:50%;background:var(--line)}
        .eb-int-label{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;margin-top:6px;height:12px}
        .eb-signal{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--line);border-radius:999px;background:#fff;padding:10px 16px;font-size:13.5px;cursor:pointer;box-shadow:var(--shadow-sm);transition:.15s;font-family:var(--font-body);color:var(--ink)}
        .eb-signal:hover{transform:translateY(-1px)}
        .eb-signal.on{border-color:var(--ink);background:#2B2622;color:#fff}
        .eb-signals-wrap{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px}
        .eb-primary-btn{display:inline-flex;align-items:center;gap:8px;background:var(--ink);color:#fff;border:none;border-radius:999px;padding:13px 24px;font-family:var(--font-mono);font-size:12.5px;letter-spacing:.05em;text-transform:uppercase;cursor:pointer;box-shadow:var(--shadow-sm);transition:.18s}
        .eb-primary-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:var(--shadow-md)}
        .eb-primary-btn:disabled{opacity:.35;cursor:not-allowed}
        .eb-textarea{width:100%;min-height:130px;border:1.5px solid var(--line);border-radius:18px;padding:16px;font-family:var(--font-body);font-size:15px;resize:vertical;background:#fff;color:var(--ink);margin-bottom:16px;box-shadow:var(--shadow-sm)}
        .eb-textarea:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
        .eb-textarea::placeholder{color:#B4AEB2}
        .eb-error{background:#FBEDED;border:1px solid #EAC3C3;color:#8A3030;padding:14px 16px;border-radius:14px;font-size:14px;margin:18px 0;line-height:1.5}
        .eb-equation{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:32px 0 18px}
        .eb-chip{font-family:var(--font-mono);font-size:12px;padding:7px 14px;border-radius:999px;border:1.5px solid;text-transform:uppercase;letter-spacing:.03em;font-weight:600}
        .eb-op{font-family:var(--font-mono);color:var(--ink-soft);font-size:16px}
        .eb-answer{font-family:var(--font-display);font-style:italic;font-weight:600;font-size:23px}
        .eb-reflection{font-family:var(--font-display);font-style:italic;font-size:16px;color:var(--ink);margin:0 0 20px;padding:16px 20px;background:#fff;border-radius:16px;border:1px solid var(--line);box-shadow:var(--shadow-sm);line-height:1.5}
        .eb-result-card{border-radius:24px;overflow:hidden;background:#fff;border:1px solid var(--line);box-shadow:var(--shadow-md)}
        .eb-result-header{padding:28px 28px 26px}
        .eb-result-eyebrow{font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.88);margin-bottom:8px}
        .eb-result-name-lg{font-family:var(--font-display);font-size:33px;color:#fff;margin:0;font-weight:500;text-shadow:0 1px 14px rgba(0,0,0,.1)}
        .eb-result-body{padding:26px 28px 28px}
        .eb-result-desc{font-size:15.5px;line-height:1.65;margin:0 0 22px}
        .eb-personal{background:#FBF8F3;border:1px solid #EFE7D8;border-radius:16px;padding:16px 18px;margin-bottom:22px}
        .eb-personal-label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#9A8558;margin-bottom:8px;display:flex;align-items:center;gap:6px}
        .eb-personal p{margin:0;font-size:14.5px;line-height:1.6}
        .eb-personal .eb-hipotese{margin-top:12px;padding-top:12px;border-top:1px dashed #EFE7D8;font-style:italic;color:#7A6E52}
        .eb-acolhimento{font-family:var(--font-display);font-style:italic;font-size:16.5px;line-height:1.5;margin:0 0 18px;color:var(--ink)}
        .eb-layers{margin:0 0 22px;padding:14px 18px;border-left:3px solid var(--line);font-size:14px;line-height:1.6;color:var(--ink)}
        .eb-tips-label{font-family:var(--font-mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:15px}
        .eb-tip{display:flex;gap:14px;align-items:flex-start;font-size:14.5px;line-height:1.55;margin-bottom:14px}
        .eb-tip:last-child{margin-bottom:0}
        .eb-tip-num{flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-mono);font-size:11.5px;font-weight:700;margin-top:1px}
        .eb-question{margin-top:20px;padding:18px 20px;border-radius:16px;background:#2B2622;color:#F6F4F1}
        .eb-question-label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(246,244,241,.6);margin-bottom:8px}
        .eb-question p{margin:0;font-family:var(--font-display);font-style:italic;font-size:17px;line-height:1.5}
        .eb-note-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
        .eb-reset-row{display:flex;justify-content:flex-end;margin-top:22px}
        .eb-crisis{background:#fff;border:1.5px solid #E3B7B7;border-radius:22px;padding:28px;margin-top:26px;box-shadow:var(--shadow-md)}
        .eb-crisis h2{font-family:var(--font-display);font-size:24px;margin:0 0 12px;font-weight:500}
        .eb-crisis p{font-size:15px;line-height:1.65;margin:0 0 14px}
        .eb-crisis .eb-cvv{background:#FBF3F3;border-radius:14px;padding:16px 18px;font-size:15px;line-height:1.7}
        .eb-crisis .eb-cvv strong{font-size:19px}
        .eb-panel{background:#fff;border:1px solid var(--line);border-radius:22px;padding:24px 26px;margin-top:26px;box-shadow:var(--shadow-sm)}
        .eb-panel h2{font-family:var(--font-display);font-size:22px;margin:0 0 6px;font-weight:500;display:flex;align-items:center;justify-content:space-between}
        .eb-panel-sub{font-size:13px;color:var(--ink-soft);line-height:1.55;margin:0 0 18px}
        .eb-hist-entry{display:flex;flex-direction:column;gap:5px;padding:13px 0;border-top:1px solid var(--line)}
        .eb-hist-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
        .eb-hist-date{font-family:var(--font-mono);font-size:11px;color:var(--ink-soft)}
        .eb-hist-nome{font-family:var(--font-display);font-size:16.5px;font-weight:500}
        .eb-hist-emos{display:flex;gap:6px;flex-wrap:wrap}
        .eb-mini-chip{font-family:var(--font-mono);font-size:10px;padding:3px 9px;border-radius:999px;border:1px solid;text-transform:uppercase}
        .eb-hist-nota{font-size:12.5px;color:var(--ink-soft);line-height:1.5}
        .eb-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
        .eb-bar-name{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;width:76px;flex-shrink:0}
        .eb-bar-track{flex:1;height:10px;border-radius:999px;background:#F0EDE8;overflow:hidden}
        .eb-bar-fill{height:100%;border-radius:999px}
        .eb-bar-count{font-family:var(--font-mono);font-size:11px;color:var(--ink-soft);width:22px;text-align:right}
        .eb-sci-item{padding:14px 0;border-top:1px solid var(--line)}
        .eb-sci-item h3{font-family:var(--font-display);font-size:16px;margin:0 0 6px;font-weight:500}
        .eb-sci-item p{font-size:13.5px;color:var(--ink);line-height:1.6;margin:0}
        .eb-sci-disclaimer{margin-top:16px;font-size:12.5px;color:var(--ink-soft);line-height:1.6;border-top:1px solid var(--line);padding-top:14px}
        .eb-privacy{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;color:var(--ink-soft);line-height:1.55;margin-top:14px}
        .eb-disclaimer{font-size:12px;color:var(--ink-soft);margin-top:40px;line-height:1.6;border-top:1px solid var(--line);padding-top:18px}
        .eb-hidden-file{display:none}
        .spin{animation:eb-spin .8s linear infinite}
        @keyframes eb-spin{to{transform:rotate(360deg)}}
        @media (max-width:480px){
          .eb-title{font-size:32px}
          .eb-result-header{padding:24px 22px 22px}
          .eb-result-body{padding:22px 22px 24px}
          .eb-result-name-lg{font-size:27px}
        }
      `}</style>

      <div className="eb-wrap">
        <div className="eb-hero">
          <div className="eb-blob eb-blob-a" />
          <div className="eb-blob eb-blob-b" />
          <div className="eb-eyebrow"><Sparkles size={13} />Laboratório emocional</div>
          <h1 className="eb-title">Elementos do <i>Sentimento</i></h1>
          <p className="eb-sub">
            Seis emoções básicas se combinam e formam quase tudo o que você sente.
            Selecione o que está ativo agora, descreva com suas palavras, ou comece pelo que sente no corpo.
          </p>
        </div>

        <div className="eb-topbar">
          <div className="eb-toggle" role="tablist">
            <button className={mode === "click" ? "active" : ""} onClick={() => trocarModo("click")} role="tab" aria-selected={mode === "click"}>Selecionar</button>
            <button className={mode === "text" ? "active" : ""} onClick={() => trocarModo("text")} role="tab" aria-selected={mode === "text"}>Escrever</button>
            <button className={mode === "body" ? "active" : ""} onClick={() => trocarModo("body")} role="tab" aria-selected={mode === "body"}>Sinto no corpo</button>
          </div>
          <button className="eb-iconbtn" onClick={() => { setShowHist(!showHist); setShowScience(false); }}>
            <History size={13} /> Histórico{hist.length ? ` (${hist.length})` : ""}
          </button>
          <button className="eb-iconbtn" onClick={() => { setShowScience(!showScience); setShowHist(false); }}>
            <BookOpen size={13} /> Base científica
          </button>
        </div>

        {mode === "click" && (
          <>
            <p className="eb-intensity-hint">
              Toque para selecionar e ajustar a intensidade: <strong>leve</strong> → <strong>moderada</strong> → <strong>intensa</strong> → desmarcar.
            </p>
            <div className="eb-grid">
              {ORDER.map((id) => {
                const e = EMOTIONS[id];
                const sel = selected.find((s) => s.id === id);
                return (
                  <button key={id} className="eb-tile" onClick={() => cycleEmotion(id)}
                    style={{
                      borderColor: sel ? e.cor : undefined,
                      borderWidth: sel && sel.intensity === 3 ? "2.5px" : undefined,
                      background: sel ? hexToRgba(e.cor, [0, 0.06, 0.14, 0.24][sel.intensity]) : "#fff",
                      boxShadow: sel ? `0 14px 26px -14px ${hexToRgba(e.cor, [0, 0.35, 0.55, 0.75][sel.intensity])}` : undefined,
                    }}
                    aria-pressed={!!sel}>
                    <span className="eb-badge" style={{ background: `linear-gradient(145deg, ${lighten(e.cor, 0.24)}, ${e.cor})`, boxShadow: `0 8px 16px -6px ${hexToRgba(e.cor, 0.55)}` }}>
                      {e.symbol}
                    </span>
                    <div className="eb-tile-name">{e.nome}</div>
                    <div className="eb-tile-funcao">{e.funcao}</div>
                    <div className="eb-dots">
                      {[1, 2, 3].map((n) => (
                        <span key={n} className="eb-dot" style={{ background: sel && sel.intensity >= n ? e.cor : undefined }} />
                      ))}
                    </div>
                    <div className="eb-int-label" style={{ color: e.cor }}>
                      {sel ? INTENSITY_LABELS[sel.intensity] : ""}
                    </div>
                  </button>
                );
              })}
            </div>
            <textarea className="eb-textarea" style={{ minHeight: 84 }}
              placeholder="Quer contar o que está acontecendo? (opcional — deixa a análise conectada com a sua situação)"
              value={nota} onChange={(e) => setNota(e.target.value)} />
            <button className="eb-primary-btn" onClick={analisarClick} disabled={selected.length === 0 || loading}>
              {loading ? (<><Loader2 size={14} className="spin" /> Analisando</>) : (<>Analisar reação <ArrowRight size={14} /></>)}
            </button>
          </>
        )}

        {mode === "text" && (
          <>
            <textarea className="eb-textarea"
              placeholder="Escreva livremente o que está acontecendo e o que você sente com isso..."
              value={texto} onChange={(e) => setTexto(e.target.value)} />
            <button className="eb-primary-btn" onClick={analisarTexto} disabled={!texto.trim() || loading}>
              {loading ? (<><Loader2 size={14} className="spin" /> Analisando</>) : (<>Analisar texto <ArrowRight size={14} /></>)}
            </button>
          </>
        )}

        {mode === "body" && (
          <>
            <p className="eb-intensity-hint">
              Às vezes o corpo percebe antes da mente. Marque o que você sente fisicamente agora — a gente traduz em emoção.
            </p>
            <div className="eb-signals-wrap">
              {BODY_SIGNALS.map((s) => (
                <button key={s.id} className={"eb-signal" + (signals.includes(s.id) ? " on" : "")} onClick={() => toggleSignal(s.id)}>
                  {signals.includes(s.id) && <Check size={13} strokeWidth={3} />}
                  {s.label}
                </button>
              ))}
            </div>
            <textarea className="eb-textarea" style={{ minHeight: 84 }}
              placeholder="Quer contar o que está acontecendo? (opcional — deixa a análise conectada com a sua situação)"
              value={nota} onChange={(e) => setNota(e.target.value)} />
            <button className="eb-primary-btn" onClick={analisarCorpo} disabled={signals.length === 0 || loading}>
              {loading ? (<><Loader2 size={14} className="spin" /> Analisando</>) : (<>Traduzir em emoção <ArrowRight size={14} /></>)}
            </button>
          </>
        )}

        {erro && <div className="eb-error">{erro}</div>}

        {crise && (
          <div className="eb-crisis">
            <h2><HeartHandshake size={22} style={{ verticalAlign: "-4px", marginRight: 8 }} />Antes de qualquer análise, você importa</h2>
            <p>
              Pelo que você escreveu, parece que o peso que você está carregando agora é grande demais
              para um app de emoções — e está tudo bem admitir isso. Nesse momento, o mais importante
              não é nomear o que você sente, é você não ficar sozinho com isso.
            </p>
            <div className="eb-cvv">
              <strong>CVV — 188</strong> (ligação gratuita, 24 horas, todo o Brasil)<br />
              Também por chat em <strong>cvv.org.br</strong><br />
              Se houver risco imediato, ligue <strong>192</strong> (SAMU).
            </div>
            <p style={{ marginTop: 14, marginBottom: 0 }}>
              Falar com alguém de confiança — um amigo, familiar ou profissional — também é um passo real.
              Este app continua aqui depois, quando fizer sentido.
            </p>
          </div>
        )}

        {resultado && !crise && (
          <>
            <div className="eb-equation">
              {resultado.componentes.map((c, i) => (
                <span key={c.id}>
                  <span className="eb-chip" style={{ background: hexToRgba(c.cor, 0.13), borderColor: hexToRgba(c.cor, 0.4), color: c.cor }}>
                    {c.nome}
                  </span>
                  {i < resultado.componentes.length - 1 && <span className="eb-op"> + </span>}
                </span>
              ))}
              <span className="eb-op"> = </span>
              <span className="eb-answer" style={{ color: resultado.cor }}>{resultado.nome}</span>
            </div>

            <div className="eb-result-card">
              <div className="eb-result-header" style={{ background: resultado.gradiente }}>
                <div className="eb-result-eyebrow">{resultado.tipo === "nucleo" ? "Emoção central" : "Resultado"}</div>
                <h2 className="eb-result-name-lg">{resultado.nome}</h2>
              </div>
              <div className="eb-result-body">
                {acolhimento && <p className="eb-acolhimento">{acolhimento}</p>}
                <p className="eb-result-desc">{resultado.descricao}</p>

                {resultado.camadas.length > 0 && (
                  <div className="eb-layers">
                    <strong>E há mais acontecendo junto:</strong>{" "}
                    {resultado.camadas.map((c, i) => (
                      <span key={c.id}>
                        <span style={{ color: c.cor, fontWeight: 600 }}>{c.nome}</span> — {c.nota}
                        {i < resultado.camadas.length - 1 ? "; " : "."}
                      </span>
                    ))}
                    {" "}Sentir várias coisas ao mesmo tempo não é confusão — é a situação sendo complexa de verdade.
                  </div>
                )}

                {explicacao && (
                  <div className="eb-personal">
                    <div className="eb-personal-label"><Sparkles size={11} /> Conectando com o que você contou</div>
                    <p>{explicacao}</p>
                    {hipotese && <p className="eb-hipotese">{hipotese}</p>}
                  </div>
                )}

                <div className="eb-tips-label">Como lidar com isso</div>
                {resultado.dicas.map((dica, i) => (
                  <div className="eb-tip" key={i}>
                    <span className="eb-tip-num" style={{ background: `linear-gradient(145deg, ${lighten(resultado.cor, 0.2)}, ${resultado.cor})` }}>{i + 1}</span>
                    <span>{dica}</span>
                  </div>
                ))}

                {pergunta && (
                  <div className="eb-question">
                    <div className="eb-question-label">Para levar com você</div>
                    <p>{pergunta}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="eb-reset-row">
              <button className="eb-iconbtn" onClick={novaAnalise}><RotateCcw size={13} /> Nova análise</button>
            </div>
          </>
        )}

        {showHist && (
          <div className="eb-panel">
            <h2>
              Meu histórico
              <button className="eb-iconbtn" onClick={() => setShowHist(false)} style={{ padding: "6px 10px" }}><X size={13} /></button>
            </h2>
            <p className="eb-panel-sub">
              Registros salvos automaticamente com data e hora. Tudo fica <strong>somente neste aparelho</strong> —
              nada é enviado a servidores. Baixe um backup para guardar ou restaurar em outro aparelho.
            </p>

            {hist.length === 0 && <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>Nenhum registro ainda — faça sua primeira análise.</p>}

            {topEmocoes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="eb-tips-label">Emoções mais presentes (últimos 30 dias)</div>
                {topEmocoes.slice(0, 4).map(([id, count]) => (
                  <div className="eb-bar-row" key={id}>
                    <span className="eb-bar-name" style={{ color: EMOTIONS[id].cor }}>{EMOTIONS[id].nome}</span>
                    <div className="eb-bar-track">
                      <div className="eb-bar-fill" style={{ width: `${(count / maxCont) * 100}%`, background: EMOTIONS[id].cor }} />
                    </div>
                    <span className="eb-bar-count">{count}</span>
                  </div>
                ))}
              </div>
            )}

            {hist.slice(0, 30).map((e) => (
              <div className="eb-hist-entry" key={e.id}>
                <div className="eb-hist-top">
                  <span className="eb-hist-date">{fmtData(e.ts)}</span>
                  <span className="eb-hist-nome">{e.nome}</span>
                  <span className="eb-hist-emos">
                    {e.emocoes.map((x) => (
                      <span key={x.id} className="eb-mini-chip" style={{ borderColor: hexToRgba(EMOTIONS[x.id].cor, 0.5), color: EMOTIONS[x.id].cor }}>
                        {EMOTIONS[x.id].nome}
                      </span>
                    ))}
                  </span>
                </div>
                {e.nota && <div className="eb-hist-nota">{e.nota}</div>}
              </div>
            ))}
            {hist.length > 30 && <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 10 }}>Mostrando os 30 mais recentes — o restante está incluído nos exports.</p>}

            {hist.length > 0 && (
              <div className="eb-note-actions" style={{ marginTop: 18 }}>
                <button className="eb-iconbtn" onClick={exportarRelatorio}><FileText size={13} /> Relatório p/ terapeuta</button>
                <button className="eb-iconbtn" onClick={exportarBackup}><Download size={13} /> Backup (.json)</button>
                <label className="eb-iconbtn" style={{ cursor: "pointer" }}>
                  <Upload size={13} /> Restaurar backup
                  <input type="file" accept="application/json" className="eb-hidden-file" onChange={importarBackup} />
                </label>
                <button className="eb-iconbtn" onClick={apagarHistorico} style={{ color: "#8A3030", borderColor: "#EAC3C3" }}>
                  <Trash2 size={13} /> Apagar tudo
                </button>
              </div>
            )}
            {hist.length === 0 && (
              <div className="eb-note-actions" style={{ marginTop: 10 }}>
                <label className="eb-iconbtn" style={{ cursor: "pointer" }}>
                  <Upload size={13} /> Restaurar backup
                  <input type="file" accept="application/json" className="eb-hidden-file" onChange={importarBackup} />
                </label>
              </div>
            )}
          </div>
        )}

        {showScience && (
          <div className="eb-panel">
            <h2>
              De onde vem tudo isso
              <button className="eb-iconbtn" onClick={() => setShowScience(false)} style={{ padding: "6px 10px" }}><X size={13} /></button>
            </h2>
            <p className="eb-panel-sub">
              As análises deste app não foram inventadas do zero — elas se apoiam em conceitos consolidados
              da psicologia das emoções:
            </p>
            {SCIENCE_ITEMS.map((s, i) => (
              <div className="eb-sci-item" key={i}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
            <p className="eb-sci-disclaimer">
              Importante ser transparente: este app é um framework <em>inspirado</em> nesses estudos, montado
              para autoconhecimento e psicoeducação — não é um instrumento clínico validado, não faz diagnóstico
              e não substitui acompanhamento psicológico profissional.
            </p>
          </div>
        )}

        <p className="eb-disclaimer">
          Este é um app de autoconhecimento, não um diagnóstico. Você pode sentir várias emoções ao mesmo
          tempo — isso é normal. Se o que você sente persistir ou pesar demais, vale conversar com um
          profissional de saúde mental. Seus registros ficam apenas no seu aparelho.
        </p>
      </div>
    </div>
  );
}
