
import { EncounterData, CombatTurnResult, Stats, JobClass } from '../types';

// Local utility for random narrative
const getHitNarrative = (attacker: string, defender: string, damage: number, isCrit: boolean) => {
  if (damage === 0) return `${defender}은(는) ${attacker}의 공격을 가볍게 피했습니다.`;
  if (isCrit) return `${attacker}의 치명적인 일격! ${defender}에게 ${damage}의 큰 피해를 입혔습니다!`;
  return `${attacker}의 공격이 ${defender}에게 적중하여 ${damage}의 피해를 주었습니다.`;
};

/**
 * Generates a description of the current environment (Local Implementation).
 */
export const generateLocationDescription = async (level: number, theme: string): Promise<string> => {
  const descriptions = [
    "안개가 자욱한 길을 걷고 있습니다. 어디선가 까마귀 울음소리가 들립니다.",
    "오래된 나무들이 빽빽하게 들어선 숲길입니다. 발자국 소리가 유난히 크게 울립니다.",
    "바람이 거세게 부는 황량한 평원입니다. 멀리서 짐승의 울음소리가 들려옵니다.",
    "습하고 어두운 늪지대입니다. 발이 푹푹 빠져 걷기가 힘듭니다.",
    "달빛만이 비추는 고요한 밤길입니다. 긴장감이 감돕니다."
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Generates a random enemy based on player level (Local Implementation).
 */
export const generateEnemyEncounter = async (playerLevel: number): Promise<EncounterData> => {
  const enemies = [
    { name: "그림자 추적자", desc: "어둠 속에서 희미하게 빛나는 눈동자가 당신을 노려봅니다.", stats: { str: 12, int: 5, dex: 15, wis: 5 } },
    { name: "숲의 광전사", desc: "거대한 도끼를 든 야만적인 전사입니다.", stats: { str: 18, int: 2, dex: 8, wis: 3 } },
    { name: "타락한 마법사", desc: "보라색 기운을 내뿜는 지팡이를 들고 있습니다.", stats: { str: 5, int: 15, dex: 10, wis: 12 } },
    { name: "고블린 약탈자", desc: "교활한 눈빛으로 당신의 주머니를 노립니다.", stats: { str: 8, int: 8, dex: 14, wis: 8 } }
  ];

  const template = enemies[Math.floor(Math.random() * enemies.length)];
  const scale = 1 + (playerLevel * 0.2);

  return {
    name: template.name,
    description: template.desc,
    level: playerLevel,
    stats: {
      str: Math.floor(template.stats.str * scale),
      int: Math.floor(template.stats.int * scale),
      dex: Math.floor(template.stats.dex * scale),
      wis: Math.floor(template.stats.wis * scale)
    },
    visualPrompt: "Fantasy monster"
  };
};

/**
 * Resolves a combat round using Local Logic (Replaces AI).
 */
export const resolveCombatRound = async (
  playerName: string,
  playerJob: JobClass,
  playerStats: Stats,
  enemyName: string,
  enemyStats: Stats,
  action: 'ATTACK' | 'DEFEND' | 'MAGIC' | 'FLEE'
): Promise<CombatTurnResult> => {
  let narrative = "";
  let playerDamageTaken = 0;
  let enemyDamageTaken = 0;
  let isCritical = Math.random() < 0.15; // 15% crit chance

  // Calculate Base Power
  const playerAtk = Math.max(1, playerStats.str + (action === 'MAGIC' ? playerStats.int * 0.5 : 0));
  const playerMagic = Math.max(1, playerStats.int + playerStats.wis * 0.3);
  const enemyAtk = Math.max(1, enemyStats.str);
  
  // Calculate Defense (Simplified)
  const playerDef = Math.floor(playerStats.dex * 0.3 + playerStats.str * 0.2);
  const enemyDef = Math.floor(enemyStats.dex * 0.2 + enemyStats.str * 0.1);

  switch (action) {
    case 'ATTACK':
      // Player Attack Logic
      const dmgRoll = Math.max(1, playerAtk - enemyDef + Math.floor(Math.random() * 5));
      enemyDamageTaken = isCritical ? Math.floor(dmgRoll * 1.5) : dmgRoll;
      narrative = getHitNarrative(playerName, enemyName, enemyDamageTaken, isCritical);

      // Enemy Counter Attack
      const enemyDmgRoll = Math.max(0, enemyAtk - playerDef + Math.floor(Math.random() * 5));
      playerDamageTaken = enemyDmgRoll;
      narrative += ` 이어서 ${getHitNarrative(enemyName, playerName, playerDamageTaken, false)}`;
      break;

    case 'MAGIC':
      // Magic ignores some defense
      const magicDmg = Math.max(1, playerMagic - (enemyStats.wis * 0.3) + Math.floor(Math.random() * 8));
      enemyDamageTaken = isCritical ? Math.floor(magicDmg * 1.5) : magicDmg;
      narrative = isCritical 
        ? `${playerName}의 강력한 마법이 폭발했습니다! ${enemyName}에게 ${enemyDamageTaken}의 피해!`
        : `${playerName}이(가) 주문을 외워 ${enemyName}에게 ${enemyDamageTaken}의 피해를 입혔습니다.`;

      // Enemy Counter
      const counterDmg = Math.max(0, enemyAtk - playerDef + Math.floor(Math.random() * 5));
      playerDamageTaken = counterDmg;
      narrative += ` ${enemyName}이(가) 반격하여 ${playerDamageTaken}의 피해를 입었습니다.`;
      break;

    case 'DEFEND':
      // Reduced damage taken
      const rawDmg = Math.max(0, enemyAtk - playerDef);
      playerDamageTaken = Math.floor(rawDmg * 0.4); // Take 40% damage
      narrative = `${playerName}은(는) 방어 태세를 취했습니다. ${enemyName}의 공격을 막아내며 피해를 ${playerDamageTaken}로 줄였습니다.`;
      break;

    case 'FLEE':
      // Simple flee mechanic: 50% chance if DEX is high enough
      const fleeChance = 0.5 + ((playerStats.dex - enemyStats.dex) * 0.01);
      if (Math.random() < fleeChance) {
        narrative = `${playerName}은(는) 재빨리 몸을 돌려 전장에서 이탈했습니다! (전투 종료)`;
        // In this app structure, we might need a way to signal combat end. 
        // Currently treating as no damage taken, but logic in App.tsx might need update to handle pure flee.
        // For now, we simulate a "safe" turn.
        playerDamageTaken = 0;
        enemyDamageTaken = 9999; // Hack to force combat end in App.tsx if logic allows (enemyHp <= 0 -> win)
                                 // Ideally App.tsx handles FLEE state separately.
                                 // Let's just make it a failed flee mostly to keep combat loop or consistent with current loop.
      } else {
         playerDamageTaken = Math.floor(enemyAtk * 0.5);
         narrative = `${playerName}은(는) 도망치려 했으나 ${enemyName}에게 덜미를 잡혔습니다! ${playerDamageTaken}의 피해를 입었습니다.`;
      }
      break;
  }

  return {
    narrative,
    playerDamageTaken,
    enemyDamageTaken,
    isCritical
  };
};
