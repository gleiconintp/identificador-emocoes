import { useState } from "react";
import { Sparkles, Loader2, RotateCcw, ArrowRight, Check } from "lucide-react";

/* ---------------------------------------------------------
   DADOS: emoções básicas + tabela de combinações
--------------------------------------------------------- */

const ORDER = ["alegria", "tristeza", "raiva", "medo", "nojo", "surpresa"];

const EMOTIONS = {
  alegria: {
    id: "alegria",
    symbol: "Al",
    nome: "Alegria",
    cor: "#F0B429",
    funcao: "Aproxima você do que faz bem.",
    descricao: "Sinal de que algo está indo bem — vale reconhecer e repetir.",
    dicas: [
      "Perceba o que gerou esse bem-estar.",
      "Compartilhe com alguém — alegria dividida rende mais.",
      "Guarde esse momento como referência para os dias difíceis.",
    ],
  },
  tristeza: {
    id: "tristeza",
    symbol: "Tr",
    nome: "Tristeza",
    cor: "#5B84B1",
    funcao: "Ajuda a processar perdas e pede um tempo de desaceleração.",
    descricao: "Não precisa ser resolvida na hora — às vezes só precisa de espaço.",
    dicas: [
      "Permita-se desacelerar, mesmo que por pouco tempo.",
      "Coloque em palavras o que foi perdido ou não aconteceu.",
      "Busque companhia que não tente te animar à força.",
    ],
  },
  raiva: {
    id: "raiva",
    symbol: "Ra",
    nome: "Raiva",
    cor: "#D64545",
    funcao: "Protege limites e aponta injustiças.",
    descricao: "Costuma indicar que algo importante foi ultrapassado.",
    dicas: [
      "Identifique qual limite foi cruzado antes de agir.",
      "Dê um intervalo antes de responder — a raiva pede ação rápida, nem sempre a certa.",
      "Transforme em um pedido claro, não em ataque.",
    ],
  },
  medo: {
    id: "medo",
    symbol: "Me",
    nome: "Medo",
    cor: "#3F7566",
    funcao: "Promove proteção diante de um risco real ou percebido.",
    descricao: "Prepara o corpo para agir diante de uma ameaça — nem sempre do tamanho que parece.",
    dicas: [
      "Pergunte: o risco é real, provável ou só possível?",
      "Respire fundo antes de decidir — o medo distorce o tamanho das coisas.",
      "Liste o que está sob seu controle agora.",
    ],
  },
  nojo: {
    id: "nojo",
    symbol: "No",
    nome: "Nojo",
    cor: "#7B5EA7",
    funcao: "Afasta você de algo potencialmente prejudicial.",
    descricao: "Pode ser físico ou moral — os dois avisam para manter distância.",
    dicas: [
      "Confie no incômodo: ele geralmente tem um motivo.",
      "Coloque distância física ou emocional do que causou a reação.",
      "Se for sobre uma pessoa ou situação, avalie se é hora de rever o vínculo.",
    ],
  },
  surpresa: {
    id: "surpresa",
    symbol: "Su",
    nome: "Surpresa",
    cor: "#E8873B",
    funcao: "Direciona sua atenção para algo inesperado.",
    descricao: "É a emoção mais curta — logo dá lugar a outra, dependendo do que vem a seguir.",
    dicas: [
      "Dê um instante antes de reagir — a surpresa passa rápido.",
      "Observe qual emoção aparece logo depois dela.",
      "Nem todo inesperado é ameaça; avalie com calma.",
    ],
  },
};

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
    descricao: "Alívio ou alegria ao ver algo dar errado para quem te prejudicou, com raiva ainda não totalmente resolvida.",
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
    descricao: "Sensação de que a perda aconteceu ou vai acontecer e não há muito o que fazer.",
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
    nome: "Vergonha",
    descricao: "Medo de ser rejeitado ou julgado, combinado com autocrítica.",
    dicas: [
      "Lembre que errar não define seu valor.",
      "Fale sobre isso com alguém que não vai te julgar.",
      "Separe o fato do que aconteceu da história que você está contando sobre si mesmo.",
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
    descricao: "Algo parece perigoso e nojento ao mesmo tempo — o corpo pede distância imediata.",
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
    descricao: "Tristeza por algo que foi feito, medo das consequências e desconforto consigo mesmo.",
    dicas: [
      "Separe culpa por algo real de culpa por padrões altos demais.",
      "Se cabe reparo, faça um pedido de desculpas específico.",
      "Aprenda com o episódio e siga — culpa eterna não repara nada.",
    ],
  },
  "medo|surpresa|tristeza": {
    nome: "Ansiedade",
    descricao: "Medo de um futuro incerto, misturado com antecipação de algo ruim e a sensação de não estar preparado.",
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
};

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */

function comboKey(ids) {
  return [...ids].sort().join("|");
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.substring(i, i + 2), 16));
}

function rgbToHex([r, g, b]) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
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

function getResult(selectedIds) {
  if (!selectedIds || selectedIds.length === 0) return null;
  const ids = [...selectedIds].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const componentes = ids.map((id) => ({
    id,
    nome: EMOTIONS[id].nome,
    cor: EMOTIONS[id].cor,
  }));
  const corResultado = blendColors(ids.map((id) => EMOTIONS[id].cor));
  const gradiente =
    ids.length === 1
      ? `linear-gradient(135deg, ${lighten(componentes[0].cor, 0.28)}, ${componentes[0].cor})`
      : `linear-gradient(120deg, ${componentes.map((c) => c.cor).join(", ")})`;
  const nomes = ids.map((id) => EMOTIONS[id].nome);

  if (ids.length === 1) {
    const e = EMOTIONS[ids[0]];
    return {
      tipo: "basica",
      nome: e.nome,
      descricao: e.descricao,
      dicas: e.dicas,
      cor: e.cor,
      gradiente,
      componentes,
    };
  }

  if (ids.length === 2) {
    const combo = PAIRS[comboKey(ids)];
    return {
      tipo: "combinada",
      nome: combo.nome,
      descricao: combo.descricao,
      dicas: combo.dicas,
      cor: corResultado,
      gradiente,
      componentes,
    };
  }

  if (ids.length === 3) {
    const combo = TRIPLES[comboKey(ids)];
    if (combo) {
      return {
        tipo: "combinada",
        nome: combo.nome,
        descricao: combo.descricao,
        dicas: combo.dicas,
        cor: corResultado,
        gradiente,
        componentes,
      };
    }
    return {
      tipo: "rara",
      nome: "Combinação Rara",
      descricao: `Você está sentindo ${nomes.join(", ")} ao mesmo tempo — uma mistura pouco comum, que nem sempre tem um nome pronto.`,
      dicas: [
        "Nomeie cada emoção separadamente, sem tentar encaixar tudo em uma palavra só.",
        "Pergunte-se qual delas está mais forte agora.",
        "Está tudo bem sentir mais de uma coisa ao mesmo tempo.",
      ],
      cor: corResultado,
      gradiente,
      componentes,
    };
  }

  return {
    tipo: "sobrecarga",
    nome: "Sobrecarga Emocional",
    descricao: `${nomes.join(", ")} ativas ao mesmo tempo podem deixar difícil saber por onde começar.`,
    dicas: [
      "Escolha uma emoção para observar primeiro — não precisa resolver tudo agora.",
      "Reduza estímulos por alguns minutos: respire, beba água, mude de ambiente se der.",
      "Se a sobrecarga persistir, vale conversar com alguém de confiança ou um profissional.",
    ],
    cor: corResultado,
    gradiente,
    componentes,
  };
}

/* ---------------------------------------------------------
   COMPONENTE
--------------------------------------------------------- */

export default function App() {
  const [mode, setMode] = useState("click");
  const [selected, setSelected] = useState([]);
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [reflexao, setReflexao] = useState(null);
  const [resultado, setResultado] = useState(null);

  function toggleEmotion(id) {
    setResultado(null);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function analisarClick() {
    if (selected.length === 0) return;
    setResultado(getResult(selected));
    setReflexao(null);
    setErro(null);
  }

  async function analisarTexto() {
    if (!texto.trim() || loading) return;
    setLoading(true);
    setErro(null);
    setResultado(null);
    setReflexao(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Não consegui analisar o texto agora. Tenta de novo em instantes.");
        return;
      }
      const ids = (data.emotions || []).filter((id) => ORDER.includes(id)).slice(0, 4);
      if (ids.length === 0) {
        setErro("Não consegui identificar uma emoção clara nesse texto. Tenta descrever com mais detalhes o que está sentindo no corpo ou na cabeça.");
        return;
      }
      setResultado(getResult(ids));
      setReflexao(data.reflection || null);
    } catch (e) {
      setErro("Não consegui analisar o texto agora. Verifica sua conexão e tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  function novaAnalise() {
    setSelected([]);
    setTexto("");
    setResultado(null);
    setErro(null);
    setReflexao(null);
  }

  function trocarModo(novoModo) {
    setMode(novoModo);
    setResultado(null);
    setErro(null);
    setReflexao(null);
  }

  return (
    <div className="eb-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

        .eb-app {
          --paper: #F6F4F1;
          --ink: #2B2622;
          --ink-soft: #746E6A;
          --line: #E7E1E4;
          --shadow-sm: 0 1px 2px rgba(43,38,34,0.05), 0 1px 1px rgba(43,38,34,0.04);
          --shadow-md: 0 16px 28px -14px rgba(43,38,34,0.20), 0 3px 8px rgba(43,38,34,0.06);
          --font-display: 'Fraunces', serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'IBM Plex Mono', monospace;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font-body);
          min-height: 100%;
          padding: 40px 20px 56px;
          box-sizing: border-box;
        }
        .eb-app * { box-sizing: border-box; }
        .eb-wrap { max-width: 720px; margin: 0 auto; }

        .eb-hero { position: relative; overflow: hidden; padding: 6px 6px 6px; margin: -6px -6px 4px; border-radius: 26px; }
        .eb-blob { position: absolute; border-radius: 50%; filter: blur(46px); pointer-events: none; }
        .eb-blob-a { width: 210px; height: 210px; background: #F0B429; opacity: 0.30; top: -100px; left: -70px; }
        .eb-blob-b { width: 190px; height: 190px; background: #7B5EA7; opacity: 0.26; top: -80px; right: -60px; }

        .eb-eyebrow {
          position: relative; display: flex; align-items: center; gap: 7px;
          font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--ink-soft); margin-bottom: 12px;
        }
        .eb-title {
          position: relative;
          font-family: var(--font-display); font-weight: 500; font-size: 42px;
          line-height: 1.06; margin: 0 0 12px; letter-spacing: -0.01em;
        }
        .eb-title i { font-style: italic; font-weight: 500; }
        .eb-sub {
          position: relative;
          font-size: 15.5px; color: var(--ink-soft); max-width: 480px;
          line-height: 1.55; margin: 0 0 30px;
        }

        .eb-toggle {
          display: inline-flex; background: #fff; border: 1px solid var(--line);
          border-radius: 999px; padding: 4px; gap: 4px; margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
        }
        .eb-toggle button {
          border: none; background: transparent; padding: 9px 18px; border-radius: 999px;
          font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.04em;
          text-transform: uppercase; color: var(--ink-soft); cursor: pointer; transition: 0.15s;
        }
        .eb-toggle button.active { background: var(--ink); color: #fff; }
        .eb-toggle button:not(.active):hover { color: var(--ink); }

        .eb-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 14px; margin-bottom: 24px;
        }
        .eb-tile {
          position: relative; display: flex; flex-direction: column; align-items: center;
          text-align: center; border: 1.5px solid var(--line); border-radius: 22px;
          background: #fff; padding: 26px 14px 20px; cursor: pointer;
          box-shadow: var(--shadow-sm); transition: 0.18s ease; font: inherit;
        }
        .eb-tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .eb-tile:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

        .eb-badge {
          position: relative; overflow: hidden; width: 58px; height: 58px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #fff;
          font-family: var(--font-mono); font-weight: 700; font-size: 19px;
          letter-spacing: 0.01em; margin-bottom: 13px; flex-shrink: 0;
        }
        .eb-badge::after {
          content: ''; position: absolute; top: -45%; left: -25%; width: 75%; height: 75%;
          background: radial-gradient(circle, rgba(255,255,255,0.55), transparent 70%);
          border-radius: 50%;
        }

        .eb-tile-name {
          font-family: var(--font-display); font-size: 17.5px; margin: 2px 0 4px; font-weight: 500;
        }
        .eb-tile-funcao { font-size: 12px; color: var(--ink-soft); line-height: 1.42; }
        .eb-tile-check {
          position: absolute; top: 14px; right: 14px; width: 22px; height: 22px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }

        .eb-primary-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--ink); color: #fff; border: none; border-radius: 999px;
          padding: 13px 24px; font-family: var(--font-mono); font-size: 12.5px;
          letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;
          box-shadow: var(--shadow-sm); transition: 0.18s ease;
        }
        .eb-primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .eb-primary-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .eb-textarea {
          width: 100%; min-height: 130px; border: 1.5px solid var(--line); border-radius: 18px;
          padding: 16px; font-family: var(--font-body); font-size: 15px; resize: vertical;
          background: #fff; color: var(--ink); margin-bottom: 16px; box-shadow: var(--shadow-sm);
        }
        .eb-textarea:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
        .eb-textarea::placeholder { color: #B4AEB2; }

        .eb-error {
          background: #FBEDED; border: 1px solid #EAC3C3; color: #8A3030;
          padding: 14px 16px; border-radius: 14px; font-size: 14px; margin-bottom: 18px; line-height: 1.5;
        }

        .eb-equation {
          display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin: 32px 0 18px;
        }
        .eb-chip {
          font-family: var(--font-mono); font-size: 12px; padding: 7px 14px; border-radius: 999px;
          border: 1.5px solid; text-transform: uppercase; letter-spacing: 0.03em; font-weight: 600;
        }
        .eb-op { font-family: var(--font-mono); color: var(--ink-soft); font-size: 16px; }
        .eb-answer { font-family: var(--font-display); font-style: italic; font-weight: 600; font-size: 23px; }

        .eb-reflection {
          font-family: var(--font-display); font-style: italic; font-size: 16px; color: var(--ink);
          margin: 0 0 20px; padding: 16px 20px; background: #fff; border-radius: 16px;
          border: 1px solid var(--line); box-shadow: var(--shadow-sm); line-height: 1.5;
        }

        .eb-result-card {
          border-radius: 24px; overflow: hidden; background: #fff;
          border: 1px solid var(--line); box-shadow: var(--shadow-md);
        }
        .eb-result-header { padding: 28px 28px 26px; }
        .eb-result-eyebrow {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase; color: rgba(255,255,255,0.88); margin-bottom: 8px;
        }
        .eb-result-name-lg {
          font-family: var(--font-display); font-size: 33px; color: #fff; margin: 0;
          font-weight: 500; text-shadow: 0 1px 14px rgba(0,0,0,0.10);
        }
        .eb-result-body { padding: 26px 28px 28px; }
        .eb-result-desc { font-size: 15.5px; line-height: 1.65; margin: 0 0 26px; }

        .eb-tips-label {
          font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--ink-soft); margin-bottom: 15px;
        }
        .eb-tip { display: flex; gap: 14px; align-items: flex-start; font-size: 14.5px; line-height: 1.55; margin-bottom: 14px; }
        .eb-tip:last-child { margin-bottom: 0; }
        .eb-tip-num {
          flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; color: #fff;
          font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; margin-top: 1px;
        }

        .eb-reset-row { display: flex; justify-content: flex-end; margin-top: 22px; }
        .eb-reset-btn {
          display: inline-flex; align-items: center; gap: 7px; background: #fff;
          border: 1.5px solid var(--line); border-radius: 999px; padding: 9px 18px;
          color: var(--ink); font-family: var(--font-mono); font-size: 11.5px;
          letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;
          box-shadow: var(--shadow-sm); transition: 0.18s ease;
        }
        .eb-reset-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }

        .eb-disclaimer {
          font-size: 12px; color: var(--ink-soft); margin-top: 40px; line-height: 1.6;
          border-top: 1px solid var(--line); padding-top: 18px;
        }

        .spin { animation: eb-spin 0.8s linear infinite; }
        @keyframes eb-spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .eb-title { font-size: 32px; }
          .eb-result-header { padding: 24px 22px 22px; }
          .eb-result-body { padding: 22px 22px 24px; }
          .eb-result-name-lg { font-size: 27px; }
        }
      `}</style>

      <div className="eb-wrap">
        <div className="eb-hero">
          <div className="eb-blob eb-blob-a" />
          <div className="eb-blob eb-blob-b" />
          <div className="eb-eyebrow">
            <Sparkles size={13} />
            Laboratório emocional
          </div>
          <h1 className="eb-title">
            Elementos do <i>Sentimento</i>
          </h1>
          <p className="eb-sub">
            Seis emoções básicas se combinam e formam quase tudo o que você sente.
            Selecione o que está ativo agora, ou descreva com suas palavras.
          </p>
        </div>

        <div className="eb-toggle" role="tablist">
          <button
            className={mode === "click" ? "active" : ""}
            onClick={() => trocarModo("click")}
            role="tab"
            aria-selected={mode === "click"}
          >
            Selecionar emoções
          </button>
          <button
            className={mode === "text" ? "active" : ""}
            onClick={() => trocarModo("text")}
            role="tab"
            aria-selected={mode === "text"}
          >
            Escrever em texto
          </button>
        </div>

        {mode === "click" && (
          <>
            <div className="eb-grid">
              {ORDER.map((id) => {
                const e = EMOTIONS[id];
                const isSelected = selected.includes(id);
                return (
                  <button
                    key={id}
                    className="eb-tile"
                    onClick={() => toggleEmotion(id)}
                    style={{
                      borderColor: isSelected ? e.cor : undefined,
                      background: isSelected ? hexToRgba(e.cor, 0.07) : "#fff",
                      boxShadow: isSelected ? `0 14px 26px -14px ${hexToRgba(e.cor, 0.55)}` : undefined,
                    }}
                    aria-pressed={isSelected}
                  >
                    {isSelected && (
                      <span className="eb-tile-check" style={{ background: e.cor }}>
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className="eb-badge"
                      style={{
                        background: `linear-gradient(145deg, ${lighten(e.cor, 0.24)}, ${e.cor})`,
                        boxShadow: `0 8px 16px -6px ${hexToRgba(e.cor, 0.55)}`,
                      }}
                    >
                      {e.symbol}
                    </span>
                    <div className="eb-tile-name">{e.nome}</div>
                    <div className="eb-tile-funcao">{e.funcao}</div>
                  </button>
                );
              })}
            </div>
            <button className="eb-primary-btn" onClick={analisarClick} disabled={selected.length === 0}>
              Analisar reação <ArrowRight size={14} />
            </button>
          </>
        )}

        {mode === "text" && (
          <>
            <textarea
              className="eb-textarea"
              placeholder="Escreva livremente o que está acontecendo e o que você sente com isso..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <button className="eb-primary-btn" onClick={analisarTexto} disabled={!texto.trim() || loading}>
              {loading ? (
                <>
                  <Loader2 size={14} className="spin" /> Analisando
                </>
              ) : (
                <>
                  Analisar texto <ArrowRight size={14} />
                </>
              )}
            </button>
          </>
        )}

        {erro && <div className="eb-error" style={{ marginTop: 22 }}>{erro}</div>}

        {resultado && (
          <>
            <div className="eb-equation">
              {resultado.componentes.map((c, i) => (
                <span key={c.id}>
                  <span
                    className="eb-chip"
                    style={{ background: hexToRgba(c.cor, 0.13), borderColor: hexToRgba(c.cor, 0.4), color: c.cor }}
                  >
                    {c.nome}
                  </span>
                  {i < resultado.componentes.length - 1 && <span className="eb-op"> + </span>}
                </span>
              ))}
              <span className="eb-op"> = </span>
              <span className="eb-answer" style={{ color: resultado.cor }}>
                {resultado.nome}
              </span>
            </div>

            {reflexao && <p className="eb-reflection">"{reflexao}"</p>}

            <div className="eb-result-card">
              <div className="eb-result-header" style={{ background: resultado.gradiente }}>
                <div className="eb-result-eyebrow">Resultado</div>
                <h2 className="eb-result-name-lg">{resultado.nome}</h2>
              </div>
              <div className="eb-result-body">
                <p className="eb-result-desc">{resultado.descricao}</p>
                <div className="eb-tips-label">Como lidar com isso</div>
                {resultado.dicas.map((dica, i) => (
                  <div className="eb-tip" key={i}>
                    <span
                      className="eb-tip-num"
                      style={{ background: `linear-gradient(145deg, ${lighten(resultado.cor, 0.2)}, ${resultado.cor})` }}
                    >
                      {i + 1}
                    </span>
                    <span>{dica}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="eb-reset-row">
              <button className="eb-reset-btn" onClick={novaAnalise}>
                <RotateCcw size={13} /> Nova análise
              </button>
            </div>
          </>
        )}

        <p className="eb-disclaimer">
          Este é um app de autoconhecimento, não um diagnóstico. Você pode sentir várias
          emoções ao mesmo tempo — isso é normal. Se o que você sente persistir ou pesar
          demais, vale conversar com um profissional de saúde mental.
        </p>
      </div>
    </div>
  );
}
