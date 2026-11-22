// Strategy Guard: validates team/strategy answers from Qwen3 against what GRIDBREAKERS actually documents.
// Heuristic (PT/EN/ES, accent-insensitive). Returns null when acceptable or a short reason used for one retry.
import { normalize } from "./creative-guard.js";

const WORDS = { um: 1, uma: 1, one: 1, dois: 2, duas: 2, two: 2, tres: 3, three: 3, quatro: 4, four: 4, cinco: 5, five: 5, tre: 3 };

export function requestedItems(question) {
  const q = normalize(question);
  const m = q.match(/\b(\d+|um|uma|one|dois|duas|two|tres|three|quatro|four|cinco|five)\s+(?:short\s+|curtas?\s+|cortas?\s+)?(?:tactical\s+|taticas?\s+|tacticas?\s+)?(?:recommendations?|recomendacoes|recomendaciones|dicas|tips|itens|items|sugestoes|sugerencias|estrategias|strategies)\b/);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) && n > 0 && n <= 8 ? n : (WORDS[m[1]] ?? null);
}

// Effects that are NOT documented for any hero (see api/_lib/knowledge.js).
const UNDOCUMENTED = [
  [/\b(?:reduz\w*|reduc\w*|reduce\w*|diminu\w*|mitig\w*)\s+(?:o\s+|el\s+|the\s+)?(?:dano|dano\s+recebido|damage|danio)\b|\bdamage\s+reduction\b|\breducao\s+de\s+dano\b/, "Reducao de dano nao esta documentada para nenhum heroi."],
  [/\b(?:critic\w*|crits?|criticals?)\b.{0,60}\b(?:prote\w*|protect\w*|imun\w*|immun\w*|resist\w*|evit\w*|avoid\w*|block\w*|bloque\w*)|\b(?:prote\w*|protect\w*|imun\w*|immun\w*|resist\w*|evit\w*|avoid\w*)\b.{0,60}\b(?:critic\w*|crits?|criticals?)\b/, "Protecao contra criticos nao esta documentada."],
  [/\b(?:provoc\w*|taunt\w*|aggro|agro|atrai\w*\s+(?:os\s+)?ataques|draws?\s+(?:enemy\s+)?(?:attacks|aggro)|chama\w*\s+(?:a\s+)?atencao)\b/, "Provocacao/taunt nao esta documentada."],
  [/\b(?:imun\w*|immun\w*|invulner\w*|invencib\w*)\b/, "Imunidade/invulnerabilidade nao esta documentada."],
  [/\b(?:ressusc\w*|revive\w*|reviv\w*|resurrect\w*|reanim\w*)\b/, "Reviver herois em combate nao esta documentado."],
  [/\b(?:guarante\w*|garant\w*|always\s+win|vitoria\s+certa|victoria\s+segura)\b/, "Nao prometa garantias de dano, sobrevivencia ou vitoria."],
];

/** Sentences are split so a claim is checked in its own context (e.g. "55%" must sit next to "ultimate"). */
function sentences(text) {
  return text.split(/(?<=[.!?;])\s+|\n+/).filter(Boolean);
}

const ULT = /\b(?:ultimate|ultimates|ult|owl protocol|lunar sanctuary|solar judgement|obsidian cataclysm|total blackout|hex collapse|quantum destruction|eclipse annihilation|suprema)\b/;

export function validateStrategyAnswer(question, answer) {
  const full = normalize(answer);
  if (!full.trim()) return "A resposta veio vazia.";

  const wanted = requestedItems(question);
  if (wanted) {
    const items = (answer.match(/^\s*(?:[-*]\s*)?(?:\*\*)?\d+[.)]/gm) || []).length;
    if (items !== wanted) return `Foram pedidos exatamente ${wanted} itens numerados, mas a resposta tem ${items}.`;
  }
  if (!/[.!?)"'”*…]\s*$/.test(answer.trim())) return "A resposta terminou no meio de uma frase; conclua todos os itens.";

  for (const [re, reason] of UNDOCUMENTED) if (re.test(full)) return reason;

  for (const s of sentences(full)) {
    // Kai: 55% heal and +25 energy belong to the ultimate (Owl Protocol), never to the basic skill.
    if (/\bkai\b/.test(s) && /\b55\s*%/.test(s) && !ULT.test(s)) return "A cura de 55% do HP maximo e da ultimate Owl Protocol do Kai, nao da habilidade basica.";
    if (/\b25\s*(?:pontos?\s+de\s+)?(?:energia|energy)\b/.test(s) && !/\bkai\b|owl protocol/.test(s)) return "Os 25 pontos extras de energia sao da ultimate Owl Protocol do Kai.";
    // Titan: shield is for himself only (20% basic / 40% ultimate of his max HP).
    if (/\btitan\b/.test(s) && /\b(?:escudos?|shields?)\b/.test(s) && /\b(?:equipe|time|aliados|allies|team|squad|todos|everyone|aliadas)\b/.test(s) && !/\b(?:proprio|himself|si mesmo|a si)\b/.test(s)) return "O escudo do Titan protege apenas ele mesmo, nao a equipe.";
  }
  return null;
}
