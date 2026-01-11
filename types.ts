
export enum JobClass {
  WARRIOR = '전사',
  WIZARD = '마법사',
  THIEF = '도적',
  PRIEST = '성직자'
}

export enum ItemType {
  NORMAL = '일반',
  MAGIC = '마법',
  STOLEN = '장물'
}

// 통합된 스탯 인터페이스
export interface Stats {
  str: number;
  int: number;
  dex: number;
  wis: number;
  // 전투용 파생 스탯 (선택적)
  hp?: number;
  maxHp?: number;
  mp?: number;
  maxMp?: number;
}

export interface Item {
  id: string;
  name: string;
  weight: number;
  type: ItemType;
  price: number;
  basePrice: number;
  originCity?: string; // Added to track where the item was bought
}

export interface Character {
  id: string;
  name: string;
  job: JobClass;
  baseStats: Stats;
  currentStats: Stats;
  inventory: Item[];
  gold: number;
  currentCityId: string;
  isTraveling: boolean;
  targetCityId: string | null;
}

export interface TradeItem extends Omit<Item, 'id'> {
  stock: number;
  maxStock: number;
}

export interface City {
  id: string;
  name: string;
  description: string;
  affinity: JobClass[];
  restrictedJobs: JobClass[];
  inventory: TradeItem[];
  coordinates: { x: number; y: number };
}

export interface JobDefinition {
  type: JobClass;
  maxStats: Stats;
  description: string;
  color: string;
}

export enum EncounterType {
  MERCHANT = '경쟁 상인',
  MARAUDER = '약탈자',
  PLAYER = '라이벌 플레이어',
  MONSTER = '몬스터'
}

export interface Encounter {
  type: EncounterType;
  name: string;
  stats: Stats;
  inventory: Item[];
  description?: string;
  playerId?: string;
  inventoryValue?: number;
  currentHp?: number; // Added for combat state
  maxHp?: number;     // Added for combat state
}

export interface CombatLog {
  id: string;
  message: string;
  type: 'info' | 'combat' | 'trade' | 'error' | 'network' | 'narrative' | 'danger';
}

export interface NetworkState {
  onlineCount: number;
  serverStatus: 'connected' | 'disconnected' | 'connecting';
}

export interface EncounterData {
  name: string;
  description: string;
  level: number;
  stats: Stats;
  visualPrompt: string;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'combat' | 'danger' | 'loot' | 'narrative' | 'info';
  timestamp: number;
}

export interface Entity {
  name: string;
  image?: string;
  level: number;
  type: string;
  stats: Stats;
  description?: string;
}

export enum GameState {
  EXPLORING = 'EXPLORING',
  COMBAT = 'COMBAT'
}

// AI Combat Result Type
export interface CombatTurnResult {
  narrative: string;
  playerDamageTaken: number;
  enemyDamageTaken: number;
  isCritical: boolean;
  isPlayerWin?: boolean; // Optional flag if AI decides the fight is over
}