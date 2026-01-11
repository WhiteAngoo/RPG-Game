
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EncounterData, CombatTurnResult, Stats, JobClass } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_TEXT = 'gemini-3-flash-preview';

/**
 * Generates a description of the current environment.
 */
export const generateLocationDescription = async (level: number, theme: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Describe a dangerous fantasy RPG road or landscape between cities in 2 sentences. Theme: ${theme}. Difficulty Level: ${level}. Keep it atmospheric. Korean language.`,
    });
    return response.text || "안개가 자욱한 길을 걷고 있습니다.";
  } catch (error) {
    console.error("Gemini Location Error:", error);
    return "적막한 숲길을 지나고 있습니다.";
  }
};

/**
 * Generates a random enemy based on player level.
 */
export const generateEnemyEncounter = async (playerLevel: number): Promise<EncounterData> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: `Create a fantasy RPG enemy for a level ${playerLevel} player. 
      Return JSON with name, description, and stats (str, int, dex, wis). 
      Scale stats between ${playerLevel * 5} and ${playerLevel * 10}. Korean language for name/description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            level: { type: Type.NUMBER },
            stats: {
              type: Type.OBJECT,
              properties: {
                str: { type: Type.NUMBER },
                int: { type: Type.NUMBER },
                dex: { type: Type.NUMBER },
                wis: { type: Type.NUMBER },
              },
              required: ["str", "int", "dex", "wis"]
            },
            visualPrompt: { type: Type.STRING, description: "A short prompt to describe this enemy visually" }
          },
          required: ["name", "description", "level", "stats"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data as EncounterData;
  } catch (error) {
    console.error("Gemini Enemy Error:", error);
    return {
      name: "그림자 추적자",
      description: "어둠 속에서 희미하게 빛나는 눈동자가 당신을 노려봅니다.",
      level: playerLevel,
      stats: { str: 10, int: 5, dex: 15, wis: 5 },
      visualPrompt: "Shadow monster"
    };
  }
};

/**
 * Resolves a combat round using AI.
 */
export const resolveCombatRound = async (
  playerName: string,
  playerJob: JobClass,
  playerStats: Stats,
  enemyName: string,
  enemyStats: Stats,
  action: 'ATTACK' | 'DEFEND' | 'MAGIC' | 'FLEE'
): Promise<CombatTurnResult> => {
  const prompt = `
    Roleplay a combat turn in a fantasy RPG.
    Attacker: ${playerName} (${playerJob}) - Stats: STR${playerStats.str}, INT${playerStats.int}, DEX${playerStats.dex}
    Defender: ${enemyName} - Stats: STR${enemyStats.str}, INT${enemyStats.int}, DEX${enemyStats.dex}
    
    Action: ${action}
    
    Calculate damage logically based on stats and class match-ups.
    If action is FLEE, calculate damage taken while running.
    
    Output JSON:
    - narrative: A vivid 1-2 sentence description of the action and result in Korean.
    - playerDamageTaken: Integer (0-30).
    - enemyDamageTaken: Integer (0-40).
    - isCritical: Boolean.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING },
            playerDamageTaken: { type: Type.INTEGER },
            enemyDamageTaken: { type: Type.INTEGER },
            isCritical: { type: Type.BOOLEAN },
          },
          required: ["narrative", "playerDamageTaken", "enemyDamageTaken", "isCritical"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as CombatTurnResult;
  } catch (error) {
    console.error("Gemini Combat Error:", error);
    // Fallback logic
    const dmg = Math.floor(playerStats.str * 0.5);
    return {
      narrative: `${playerName}의 공격이 ${enemyName}에게 적중했습니다!`,
      playerDamageTaken: 5,
      enemyDamageTaken: dmg,
      isCritical: false
    };
  }
};
