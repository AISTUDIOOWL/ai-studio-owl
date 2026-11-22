const HEROES = [
  {
    key: "lyra", name: "Lyra",
    basic: {
      name: "Moonwall", cooldown: 9,
      target: { pt: "Todos os aliados.", en: "All allies.", es: "Todos los aliados." },
      effect: {
        pt: "Concede escudo com referência de 1,6 × ATK da Lyra + 10% do HP máximo dela.",
        en: "Grants a shield based on 1.6 × Lyra's ATK + 10% of her maximum HP.",
        es: "Concede un escudo basado en 1,6 × ATK de Lyra + 10% de su HP máximo."
      }
    },
    ultimate: {
      name: "Lunar Sanctuary",
      target: { pt: "Todos os aliados.", en: "All allies.", es: "Todos los aliados." },
      effect: {
        pt: "Concede escudo com referência de 3 × ATK + 30% do HP máximo da Lyra e cura cada aliado em 20% do próprio HP máximo.",
        en: "Grants a shield based on 3 × ATK + 30% of Lyra's maximum HP and heals each ally for 20% of their own maximum HP.",
        es: "Concede un escudo basado en 3 × ATK + 30% del HP máximo de Lyra y cura a cada aliado un 20% de su propio HP máximo."
      }
    }
  },
  {
    key: "jax", name: "Jax",
    basic: {
      name: "Eclipse Strike", cooldown: 8,
      target: { pt: "O primeiro inimigo vivo.", en: "The first living enemy.", es: "El primer enemigo vivo." },
      effect: {
        pt: "Causa dano com multiplicador 3,2.",
        en: "Deals damage with a 3.2 multiplier.",
        es: "Inflige daño con multiplicador 3,2."
      }
    },
    ultimate: {
      name: "Eclipse Annihilation",
      target: { pt: "Todos os inimigos.", en: "All enemies.", es: "Todos los enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 4,5.",
        en: "Deals damage with a 4.5 multiplier.",
        es: "Inflige daño con multiplicador 4,5."
      }
    }
  },
  {
    key: "kira", name: "Kira",
    basic: {
      name: "Neural Rupture", cooldown: 7,
      target: { pt: "O inimigo vivo com menor HP atual.", en: "The living enemy with the lowest current HP.", es: "El enemigo vivo con menos HP actual." },
      effect: {
        pt: "Causa dano com multiplicador 1,8 e aplica stun por 2,5 segundos.",
        en: "Deals damage with a 1.8 multiplier and stuns the target for 2.5 seconds.",
        es: "Inflige daño con multiplicador 1,8 y aturde al objetivo durante 2,5 segundos."
      }
    },
    ultimate: {
      name: "Total Blackout",
      target: { pt: "Todos os inimigos.", en: "All enemies.", es: "Todos los enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 3,2 e aplica stun por 3 segundos.",
        en: "Deals damage with a 3.2 multiplier and stuns all targets for 3 seconds.",
        es: "Inflige daño con multiplicador 3,2 y aturde a todos los objetivos durante 3 segundos."
      }
    }
  },
  {
    key: "kai", name: "Kai",
    basic: {
      name: "Restoration Protocol", cooldown: 8,
      target: { pt: "Todos os aliados.", en: "All allies.", es: "Todos los aliados." },
      effect: {
        pt: "Cura cada aliado usando 2,4 × ATK do Kai + 8% do HP máximo daquele aliado.",
        en: "Heals each ally using 2.4 × Kai's ATK + 8% of that ally's maximum HP.",
        es: "Cura a cada aliado usando 2,4 × ATK de Kai + 8% del HP máximo de ese aliado."
      }
    },
    ultimate: {
      name: "Owl Protocol",
      target: { pt: "Todos os aliados.", en: "All allies.", es: "Todos los aliados." },
      effect: {
        pt: "Cura cada aliado em 55% do próprio HP máximo. Os aliados diferentes de Kai recebem mais 25 pontos de energia.",
        en: "Heals each ally for 55% of their own maximum HP. Allies other than Kai gain 25 additional energy points.",
        es: "Cura a cada aliado un 55% de su propio HP máximo. Los aliados que no son Kai reciben 25 puntos adicionales de energía."
      }
    }
  },
  {
    key: "aeon", name: "Aeon",
    basic: {
      name: "Code Storm", cooldown: 9,
      target: { pt: "Todos os inimigos.", en: "All enemies.", es: "Todos los enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 0,9 e aplica stun por 1,5 segundo.",
        en: "Deals damage with a 0.9 multiplier and stuns targets for 1.5 seconds.",
        es: "Inflige daño con multiplicador 0,9 y aturde a los objetivos durante 1,5 segundos."
      }
    },
    ultimate: {
      name: "Quantum Destruction",
      target: { pt: "Todos os inimigos.", en: "All enemies.", es: "Todos los enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 5 e aplica stun por 2 segundos.",
        en: "Deals damage with a 5 multiplier and stuns targets for 2 seconds.",
        es: "Inflige daño con multiplicador 5 y aturde a los objetivos durante 2 segundos."
      }
    }
  },
  {
    key: "orion", name: "Orion",
    basic: {
      name: "Solar Aegis", cooldown: 8,
      target: { pt: "O aliado com menor proporção de HP atual.", en: "The ally with the lowest current HP ratio.", es: "El aliado con la menor proporción de HP actual." },
      effect: {
        pt: "Cura esse aliado usando 4 × ATK do Orion e concede escudo aos aliados com referência de 0,8 × ATK do Orion.",
        en: "Heals that ally using 4 × Orion's ATK and grants allies shields based on 0.8 × Orion's ATK.",
        es: "Cura a ese aliado usando 4 × ATK de Orion y concede escudos a los aliados basados en 0,8 × ATK de Orion."
      }
    },
    ultimate: {
      name: "Solar Judgement",
      target: { pt: "Todos os inimigos e todos os aliados.", en: "All enemies and all allies.", es: "Todos los enemigos y todos los aliados." },
      effect: {
        pt: "Causa dano aos inimigos com multiplicador 3, cura cada aliado em 40% do próprio HP máximo e concede escudo com referência mínima de 2 × ATK do Orion.",
        en: "Deals damage to enemies with a 3 multiplier, heals each ally for 40% of their own maximum HP, and grants shields based on at least 2 × Orion's ATK.",
        es: "Inflige daño a los enemigos con multiplicador 3, cura a cada aliado un 40% de su propio HP máximo y concede escudos basados en al menos 2 × ATK de Orion."
      }
    }
  },
  {
    key: "titan", name: "Titan",
    basic: {
      name: "Bulwark Slam", cooldown: 9,
      target: { pt: "O primeiro inimigo vivo.", en: "The first living enemy.", es: "El primer enemigo vivo." },
      effect: {
        pt: "Causa dano com multiplicador 1,6, aplica stun por 2 segundos e concede a Titan um escudo de referência igual a 20% do HP máximo dele.",
        en: "Deals damage with a 1.6 multiplier, stuns for 2 seconds, and grants Titan a shield based on 20% of his maximum HP.",
        es: "Inflige daño con multiplicador 1,6, aturde durante 2 segundos y concede a Titan un escudo basado en el 20% de su HP máximo."
      }
    },
    ultimate: {
      name: "Obsidian Cataclysm",
      target: { pt: "Todos os inimigos.", en: "All enemies.", es: "Todos los enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 4, aplica stun por 2,5 segundos e concede a Titan um escudo de referência igual a 40% do HP máximo dele.",
        en: "Deals damage with a 4 multiplier, stuns for 2.5 seconds, and grants Titan a shield based on 40% of his maximum HP.",
        es: "Inflige daño con multiplicador 4, aturde durante 2,5 segundos y concede a Titan un escudo basado en el 40% de su HP máximo."
      }
    }
  },
  {
    key: "vex", name: "Vex",
    basic: {
      name: "Echo Execution", cooldown: 8,
      target: { pt: "O inimigo vivo com maior HP atual.", en: "The living enemy with the highest current HP.", es: "El enemigo vivo con más HP actual." },
      effect: {
        pt: "Causa dano com multiplicador 4.",
        en: "Deals damage with a 4 multiplier.",
        es: "Inflige daño con multiplicador 4."
      }
    },
    ultimate: {
      name: "Hex Collapse",
      target: { pt: "O inimigo com maior HP e os demais inimigos.", en: "The enemy with the highest HP and all other enemies.", es: "El enemigo con más HP y los demás enemigos." },
      effect: {
        pt: "Causa dano com multiplicador 9 no inimigo com maior HP e multiplicador 2,5 nos demais inimigos.",
        en: "Deals damage with a 9 multiplier to the enemy with the highest HP and a 2.5 multiplier to all other enemies.",
        es: "Inflige daño con multiplicador 9 al enemigo con más HP y multiplicador 2,5 a los demás enemigos."
      }
    }
  }
];

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function localized(value, lang) {
  if (lang === "en") return value.en;
  if (lang === "es") return value.es;
  return value.pt;
}

function renderSkill(hero, kind, skill, lang) {
  const labels = lang === "en"
    ? { basic: "Basic skill", ultimate: "Ultimate", target: "Target", effect: "Effect", cooldown: "Cooldown", activation: "Activation" }
    : lang === "es"
      ? { basic: "Habilidad básica", ultimate: "Ultimate", target: "Objetivo", effect: "Efecto", cooldown: "Recarga", activation: "Activación" }
      : { basic: "Habilidade básica", ultimate: "Ultimate", target: "Alvo", effect: "Efeito", cooldown: "Recarga", activation: "Ativação" };

  const lines = [
    `${hero.name} — ${kind === "basic" ? labels.basic : labels.ultimate}: ${skill.name}`,
    `${labels.target}: ${localized(skill.target, lang)}`,
    `${labels.effect}: ${localized(skill.effect, lang)}`
  ];

  if (skill.cooldown) {
    const seconds = lang === "en" ? "seconds" : lang === "es" ? "segundos" : "segundos";
    lines.push(`${labels.cooldown}: ${skill.cooldown} ${seconds}.`);
  } else {
    const activation = lang === "en"
      ? "Available when the hero reaches 100 energy; the ultimate consumes the accumulated energy."
      : lang === "es"
        ? "Se activa al alcanzar 100 puntos de energía; la ultimate consume la energía acumulada."
        : "Fica disponível ao atingir 100 pontos de energia; a ultimate consome a energia acumulada.";
    lines.push(`${labels.activation}: ${activation}`);
  }

  return lines.join("\n");
}

export function answerCombatQuestion(question, lang = "pt-BR") {
  const q = normalize(question);
  const safeLang = ["pt-BR", "en", "es"].includes(lang) ? lang : "pt-BR";

  // Ideias e balanceamento permanecem sob responsabilidade do Qwen3 + Creative Guard.
  if (/\b(create|design|suggest|propose|brainstorm|crie|criar|sugira|sugerir|proponha|proposta|ideia|ideias|balanceamento|balancear|invente|inventar|disena|sugiere|propone|equilibrio)\b/.test(q)) return null;

  // STRATEGY / TEAM ROUTING: these questions belong to Qwen3, not the single-hero fact lookup.
  // ("time" was dropped from the English list of the original script: it is also "stun time", "cooldown time".)
  const strategyIntent = /\b(synergy|synergies|sinergia|sinergias|work together|work with|team|teamwork|team composition|team building|squad|tactical|tactics|recommend|recommendation|recommendations|strategy|strategies|strategic|composition|combination|combine|trabalhar juntos|trabalhar com|equipe|formacao|composicao|combinacao|combinar|estrategia|estrategias|recomendacao|recomendacoes|recomende|tatico|taticas)\b/.test(q);
  const mentionedHeroes = HEROES.filter((item) =>
    new RegExp("\\b" + item.key + "\\b", "i").test(q)
  );
  if (strategyIntent || mentionedHeroes.length > 1) return null;

  const hero = HEROES.find((item) => new RegExp("\\b" + item.key + "\\b", "i").test(q));
  if (!hero) return null;

  const hasCombatContext = /\b(skill|skills|ability|abilities|habilidade|habilidades|habilidad|habilidades|ultimate|ultimates|suprema|supremo|recarga|cooldown|stun|atordoamento|aturdimiento|damage|dano|danio|target|alvo|objetivo|multiplier|multiplicador)\b/.test(q);
  if (!hasCombatContext) return null;

  const asksBasic = /\b(basic|active)\s+(skill|ability)\b|\b(habilidade|habilidad|skill|ability)\s+(basica|basic|ativa|active)\b/.test(q);
  const asksUltimate = /\b(ultimate|ultimates|suprema|supremo)\b/.test(q);

  if (asksBasic && !asksUltimate) return renderSkill(hero, "basic", hero.basic, safeLang);
  if (asksUltimate && !asksBasic) return renderSkill(hero, "ultimate", hero.ultimate, safeLang);

  return [
    renderSkill(hero, "basic", hero.basic, safeLang),
    renderSkill(hero, "ultimate", hero.ultimate, safeLang)
  ].join("\n\n");
}
