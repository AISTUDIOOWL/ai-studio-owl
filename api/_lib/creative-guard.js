// Creative Guard v2 (server-side). Heuristic validator for game-design proposals about GRIDBREAKERS.
// Ported from owlCreativeGuard.ts with fixes: no mojibake (all non-ASCII as \u escapes),
// exclusions are read only from the phrase right after a cue ("sem", "nao use", "evite"),
// negated clauses ("..., mas usa gacha") are split so the affirmative part is still checked.
import { GRIDBREAKERS_KNOWLEDGE } from "./knowledge.js";

export function normalize(value) {
  return String(value).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const DASH = "[:\\-\\u2013\\u2014]";
const SENTENCE_SPLIT = /[.!?;\n]+|,?\s+(?:mas|porem|contudo|exceto|but)\s+/;
const NEGATION = /\b(?:nao\s+(?:(?:deve|ira|vai)\s+)?(?:utiliza|usa|inclui|depende|repete|cria)|sem\s+(?:utilizar|usar|incluir|depender)|diferente\s+de|ao\s+contrario\s+de|em\s+vez\s+de|evita|dispensa)\b/;

export function getFunctionalText(answer) {
  const normalized = normalize(answer);
  const header = new RegExp(`(?:^|\\n)\\s*(?:funcionamento|como funciona|gameplay loop)\\s*(?:${DASH}\\s*)`, "i");
  const match = header.exec(normalized);
  let section = match ? normalized.slice(match.index + match[0].length) : normalized.slice(0, 1800);
  const end = section.search(new RegExp(`\\n\\s*(?:diferencial|novidade|impacto|balanceamento|risco|consideracoes|implementacao|observacao|distincao)\\s*(?:${DASH}|\\n)`, "i"));
  if (end >= 0) section = section.slice(0, end);
  return section.split(SENTENCE_SPLIT).filter((s) => s && !NEGATION.test(s)).join(" . ");
}

const WORDS = { um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9, dez: 10 };

export function getRequestedCount(question) {
  const q = normalize(question);
  const expr = /\b(\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+(?:novas?\s+)?(?:ideias?|mecanicas?|propostas?)\b/g;
  const matches = [...q.matchAll(expr)];
  if (matches.length) {
    const last = matches[matches.length - 1][1];
    const n = Number(last);
    return Number.isFinite(n) && n > 0 ? n : (WORDS[last] ?? 1);
  }
  return /\b(?:algumas|varias|diversas|opcoes|lista)\b/.test(q) ? null : 1; // null = quantity not fixed
}

function getProposalHeadings(answer) {
  const n = normalize(answer);
  const expr = new RegExp(`^\\s*(?:#{1,6}\\s*)?(?:[-*]\\s*)?(?:(\\d+)[.)]\\s*)?(?:\\*\\*)?(?:ideia|mecanica|proposta)(?:\\s+nova)?\\s*(?:n[\\u00ba\\u00b0o]?\\s*)?(\\d+)?(?:\\*\\*)?\\s*(?:${DASH}|$)`, "gim");
  return [...n.matchAll(expr)].filter((m) => Boolean(m[1] || m[2])).map((m) => m[0]);
}

const EXCLUSIONS = [
  [/\bgacha\b/, /\bgacha\b|\bsummon\b|\binvoc(?:a|am|ar|acao)\b/, "A proposta usa invocacao, relacionada ao Gacha de herois."],
  [/\bdungeons?\b|\bmasmorras?\b/, /\bdungeons?\b|\bmasmorras?\b/, "A proposta reutiliza o sistema de Dungeons."],
  [/\becho(?:es)?\b/, /\becho(?:es)?\b/, "A proposta reutiliza o sistema Echoes."],
  [/\bancient\s+tower\b|\btorre\s+ancestral\b/, /\bancient\s+tower\b|\btorre\s+ancestral\b/, "A proposta reutiliza Ancient Tower."],
  [/\bformacao\s+(?:de\s+)?(?:equipe|party)\b|\bteam\s+formation\b/, /\bformacao\s+(?:de\s+)?(?:equipe|party)\b|\bteam\s+formation\b|\bparty\s+formation\b/, "A proposta reutiliza a formacao de equipe."],
  [/\b(?:habilidades?|skills?)\b/, /\b(?:habilidades?|skills?)\b/, "A proposta utiliza habilidades, que foram excluidas do pedido."],
  [/\bultimates?\b/, /\bultimates?\b/, "A proposta utiliza ultimates, que foram excluidas do pedido."],
  [/\benergia\b/, /\benergia\b/, "A proposta utiliza energia, que foi excluida do pedido."],
  [/\b(?:cooldown|recarga)\b/, /\b(?:cooldown|recarga)\b/, "A proposta utiliza recarga/cooldown, que foi excluida do pedido."],
  [/\b(?:ataques?\s+basicos?|basic\s+attacks?)\b/, /\b(?:ataques?\s+basicos?|basic\s+attacks?)\b/, "A proposta utiliza ataques basicos, que foram excluidos do pedido."],
  [/\b(?:cura|curar|curas|healing|heal)\b/, /\b(?:cura|curar|curas|healing|heal)\b/, "A proposta utiliza cura, que foi excluida do pedido."],
  [/\b(?:escudo|escudos|shield|shields)\b/, /\b(?:escudo|escudos|shield|shields)\b/, "A proposta utiliza escudos, que foram excluidos do pedido."],
  [/\b(?:stun|atordoamento|atordoar)\b/, /\b(?:stun|atordoamento|atordoar)\b/, "A proposta utiliza stun/atordoamento, que foi excluido do pedido."],
  [/\b(?:auto[- ]?battle|combate\s+automatico|batalha\s+automatica)\b/, /\b(?:auto[- ]?battle|combate\s+automatico|batalha\s+automatica)\b/, "A proposta reutiliza o combate automatico, que foi excluido do pedido."],
];

/** Text the user explicitly asked to avoid: what follows "sem", "nao use", "evite"... */
function excludedPhrases(q) {
  const out = [];
  const cue = /\b(?:nao\s+(?:use|utilize|inclua|quero)|evite|sem)\b/g;
  for (const m of q.matchAll(cue)) {
    const rest = q.slice(m.index + m[0].length, m.index + m[0].length + 90);
    out.push(rest.split(/[.,;!?\n]|\s+mas\s+|\s+porem\s+/)[0] + " " + (rest.match(/^[^.;!?\n]*?\be\s+[^.,;!?\n]*/)?.[0] ?? ""));
  }
  return out.join(" | ");
}

const DUPLICATES = [
  [/\b(?:bonus|efeito)\s+(?:de\s+)?(?:equipamentos?|sets?|conjuntos?|colecoes?)\b|\b(?:set|conjunto|colecao)\s+de\s+equipamentos?\b/, "Bonus e colecoes de equipamentos ja existem no GRIDBREAKERS."],
  [/\bdificuldade\s+(?:adaptativa|dinamica)\b|\bdynamic\s+difficulty\b/, "A dificuldade adaptativa ja existe no jogo."],
  [/\b(?:modo|expedicao|sistema)\s+(?:de\s+)?(?:dungeon|masmorra)\b/, "Dungeons ja e um modo de expedicao existente; a proposta precisa apresentar uma diferenca funcional, nao apenas renomea-lo."],
  [/\b(?:8|oito)\s+echo(?:es)?\b.{0,80}\b(?:proxima|seguinte)\s+raridade\b/, "A conversao de oito Echoes em um heroi da proxima raridade ja existe."],
  [/\b(?:33|trinta e tres)\s+ondas?\b.{0,100}\b(?:mini[- ]?chefe|chefe final)\b/, "A estrutura de campanha com 33 ondas, mini-chefe e chefe ja existe."],
  [/\bcheckpoint\b.{0,100}\b25\s*%\s*(?:de\s*)?hp\b|\b25\s*%\s*(?:de\s*)?hp\b.{0,100}\bcheckpoint\b/, "O retorno de herois com 25% de HP nos checkpoints ja existe."],
  [/\bultimates?\b.{0,70}\b100\s*(?:de\s*)?energia\b|\b100\s*(?:de\s*)?energia\b.{0,70}\bultimates?\b/, "A ultimate ja e liberada ao atingir 100 de energia."],
  [/\b(?:ataques?\s+basicos?|basic\s+attacks?)\b.{0,50}\b(?:6|seis)\s*(?:pontos?\s+de\s+)?energia\b/, "Ataques basicos ja concedem 6 pontos de energia."],
  [/\b(?:habilidade|skill)\b.{0,50}\b(?:10|dez)\s*(?:pontos?\s+de\s+)?energia\b/, "Usar uma habilidade ja concede 10 pontos de energia."],
  [/\b(?:receber|sofrer)\b.{0,50}\b(?:4|quatro)\s*(?:pontos?\s+de\s+)?energia\b/, "Receber dano ja concede 4 pontos de energia."],
];

const STAT = /([+-]?\s*\d+(?:[.,]\d+)?)\s*%\s*(?:(?:do|de)\s+)?(atk|def|hp|spd|crit)\b|\b(atk|def|hp|spd|crit)\s*(?:de|:)?\s*([+-]?\s*\d+(?:[.,]\d+)?)\s*%/gi;
const statKey = (m) => {
  const v = Number((m[1] ?? m[4]).replace(/[+\s]/g, "").replace(",", "."));
  return Number.isFinite(v) ? `${v}|${(m[2] ?? m[3]).toLowerCase()}` : null;
};
const OFFICIAL = (() => {
  const set = new Set();
  for (const m of normalize(GRIDBREAKERS_KNOWLEDGE).matchAll(STAT)) { const k = statKey(m); if (k) set.add(k); }
  return set;
})();

/** Returns null when the answer is acceptable, otherwise a short reason (Portuguese, fed to the retry prompt). */
export function validateCreativeAnswer(question, answer) {
  const q = normalize(question);
  const full = normalize(answer);
  const functional = getFunctionalText(answer);
  const wanted = getRequestedCount(question);
  const headings = getProposalHeadings(answer);

  if (wanted !== null && headings.length > 0 && headings.length !== wanted)
    return `Foram solicitadas ${wanted} proposta(s), mas a resposta apresentou ${headings.length} titulo(s) de proposta.`;
  if (wanted === 1 && /\b(?:segunda|terceira|quarta|outra)\s+(?:ideia|mecanica|proposta)\b/.test(full))
    return "Foi solicitada uma unica proposta, mas a resposta indica uma ideia adicional.";

  const avoid = excludedPhrases(q);
  if (avoid.trim()) {
    for (const [qRe, aRe, reason] of EXCLUSIONS) if (qRe.test(avoid) && aRe.test(functional)) return reason;
  }
  for (const [re, reason] of DUPLICATES) if (re.test(functional)) return reason;

  if (!/\bexperimental\b|\bvalor de teste\b/.test(functional)) {
    for (const m of functional.matchAll(STAT)) {
      const k = statKey(m);
      if (k && !OFFICIAL.has(k)) {
        const [v, stat] = k.split("|");
        return `Percentual de atributo nao confirmado na documentacao: ${v}% ${stat.toUpperCase()}. Se for apenas um valor de teste, ele precisa ser identificado claramente como experimental.`;
      }
    }
  }
  return null;
}
