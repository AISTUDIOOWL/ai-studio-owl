import assert from "node:assert/strict";
import fs from "node:fs";
import { answerCombatQuestion } from "../api/_lib/combat-answers.js";
import { selectKnowledge } from "../api/_lib/knowledge.js";

const heroes = [
  ["Lyra", "Moonwall", "Lunar Sanctuary"],
  ["Jax", "Eclipse Strike", "Eclipse Annihilation"],
  ["Kira", "Neural Rupture", "Total Blackout"],
  ["Kai", "Restoration Protocol", "Owl Protocol"],
  ["Aeon", "Code Storm", "Quantum Destruction"],
  ["Orion", "Solar Aegis", "Solar Judgement"],
  ["Titan", "Bulwark Slam", "Obsidian Cataclysm"],
  ["Vex", "Echo Execution", "Hex Collapse"]
];

const languages = ["pt-BR", "en", "es"];
for (const [hero, basic, ultimate] of heroes) {
  for (const lang of languages) {
    const basicAnswer = answerCombatQuestion(`Explain ${hero} basic skill: target, effect and cooldown.`, lang);
    assert.ok(basicAnswer?.includes(basic), `${hero} basic missing in ${lang}`);
    const ultimateAnswer = answerCombatQuestion(`Explain ${hero} ultimate: target and effect.`, lang);
    assert.ok(ultimateAnswer?.includes(ultimate), `${hero} ultimate missing in ${lang}`);
    assert.ok(ultimateAnswer.includes("100"), `${hero} ultimate activation missing in ${lang}`);
  }
}

const strategicQuestions = [
  "How can Kira, Kai and Titan work together? Give exactly three tactical recommendations.",
  "Como melhorar a sinergia entre Kira, Kai e Titan?",
  "Give a team strategy for Kira and Titan."
];
for (const question of strategicQuestions) {
  assert.equal(answerCombatQuestion(question, "en"), null, "Strategic query must go to Qwen3");
}

const teamKnowledge = selectKnowledge(strategicQuestions[0]);
for (const term of ["COMBATE E HABILIDADES", "Kira", "Kai", "Titan"]) {
  assert.ok(teamKnowledge.includes(term), `Selected GRIDBREAKERS knowledge is missing ${term}`);
}

const api = fs.readFileSync(new URL("../api/owl-ai.js", import.meta.url), "utf8");
assert.match(api, /STRATEGY_RULES/);
assert.match(api, /const timeoutMs = 240000/);
assert.match(api, /sent > 400000/);
assert.match(api, /MAX_TOKENS_KB = 480/);

const roadmap = JSON.parse(fs.readFileSync(new URL("../public/data/owl-ai-roadmap.json", import.meta.url), "utf8"));
assert.equal(roadmap.schemaVersion, 1);
assert.equal(roadmap.roadmapVersion, "1.1.0");
assert.ok(roadmap.translations?.en?.intro && roadmap.translations?.es?.intro);
assert.ok(roadmap.currentReleaseTranslations?.en && roadmap.currentReleaseTranslations?.es);
const tasks = roadmap.phases.flatMap((phase) => phase.items);
assert.ok(tasks.length >= 30);
for (const phase of roadmap.phases) {
  assert.ok(phase.translations?.en?.title?.length > 3 && phase.translations?.es?.title?.length > 3, `${phase.id} phase translations must contain full titles`);
  assert.ok(phase.translations?.en?.subtitle?.length > 10 && phase.translations?.es?.subtitle?.length > 10, `${phase.id} phase translations must contain full subtitles`);
  for (const task of phase.items) {
    assert.ok(task.translations?.en?.title && task.translations?.es?.title);
  }
}

console.log(`OWL_AI regression checks passed: ${heroes.length} heroes × ${languages.length} languages, strategy routing, knowledge selection, API limits and roadmap schema (${tasks.length} tasks).`);
