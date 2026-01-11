
import { JobClass, JobDefinition, ItemType, City, TradeItem, Stats } from './types';

// 임시 이미지 URL 사용 (실제 파일이 준비되면 로컬 경로로 변경하세요)
// 예: '/images/heroes/warrior.png'
export const JOB_IMAGES: Record<JobClass, string> = {
  [JobClass.WARRIOR]: './images/heroes/warrior.png', // Dark Red
  [JobClass.WIZARD]: './images/heroes/wizard.png',   // Dark Blue
  [JobClass.THIEF]: './images/heroes/thief.png',     // Dark Green
  [JobClass.PRIEST]: './images/heroes/priest.png'    // Dark Amber
};

export const JOB_DEFINITIONS: Record<JobClass, JobDefinition> = {
  [JobClass.WARRIOR]: {
    type: JobClass.WARRIOR,
    maxStats: { str: 100, int: 40, dex: 60, wis: 40 },
    description: "높은 체력과 강력한 근력을 지닌 전장 선봉장",
    color: "bg-red-600"
  },
  [JobClass.WIZARD]: {
    type: JobClass.WIZARD,
    maxStats: { str: 30, int: 100, dex: 40, wis: 60 },
    description: "강력한 원소 마법으로 적을 섬멸하는 지식의 탐구자",
    color: "bg-blue-600"
  },
  [JobClass.THIEF]: {
    type: JobClass.THIEF,
    maxStats: { str: 60, int: 40, dex: 100, wis: 30 },
    description: "민첩한 움직임과 치명적인 기습의 달인",
    color: "bg-emerald-600"
  },
  [JobClass.PRIEST]: {
    type: JobClass.PRIEST,
    maxStats: { str: 40, int: 80, dex: 40, wis: 100 },
    description: "신성한 힘으로 아군을 치유하고 강화하는 보호자",
    color: "bg-amber-500"
  }
};

export const WEIGHT_LIMIT_MULTIPLIER = 5;

const DEFAULT_TRADE_GOODS: TradeItem[] = [
  { name: "식량", weight: 2, type: ItemType.NORMAL, basePrice: 50, price: 50, stock: 100, maxStock: 200 },
  { name: "철광석", weight: 10, type: ItemType.NORMAL, basePrice: 200, price: 200, stock: 50, maxStock: 100 },
  { name: "마법 시약", weight: 1, type: ItemType.MAGIC, basePrice: 500, price: 500, stock: 20, maxStock: 50 },
  { name: "고대 유물", weight: 5, type: ItemType.MAGIC, basePrice: 2500, price: 2500, stock: 5, maxStock: 10 },
  { name: "장물", weight: 3, type: ItemType.STOLEN, basePrice: 1000, price: 1000, stock: 10, maxStock: 30 }
];

export const INITIAL_CITIES: City[] = [
  {
    id: 'goldhaven',
    name: '골드헤이븐',
    description: '대륙의 중앙에 위치한 상업의 요충지.',
    affinity: [JobClass.THIEF],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 50, y: 50 }
  },
  {
    id: 'arcana',
    name: '아르카나',
    description: '북쪽 하늘에 떠 있는 마법사들의 공중 도시.',
    affinity: [JobClass.WIZARD, JobClass.PRIEST],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 50, y: 15 }
  },
  {
    id: 'ironwall',
    name: '아이언월',
    description: '서쪽 산맥을 지키는 난공불락의 요새.',
    affinity: [JobClass.WARRIOR],
    restrictedJobs: [JobClass.THIEF],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 15, y: 40 }
  },
  {
    id: 'frosthold',
    name: '프로스트홀드',
    description: '극한의 추위 속에 있는 북동쪽 얼음 성.',
    affinity: [JobClass.WARRIOR],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 80, y: 20 }
  },
  {
    id: 'shadowfen',
    name: '섀도우펜',
    description: '남동쪽 늪지대에 숨겨진 도적들의 은신처.',
    affinity: [JobClass.THIEF],
    restrictedJobs: [JobClass.PRIEST],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 80, y: 80 }
  },
  {
    id: 'sunspear',
    name: '선스피어',
    description: '남쪽 사막의 태양이 작열하는 오아시스 도시.',
    affinity: [JobClass.WARRIOR, JobClass.THIEF],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 50, y: 90 }
  },
  {
    id: 'eldertree',
    name: '엘더트리',
    description: '동쪽 대삼림 깊은 곳에 있는 엘프들의 마을.',
    affinity: [JobClass.PRIEST],
    restrictedJobs: [JobClass.WARRIOR],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 90, y: 50 }
  },
  {
    id: 'stormpeak',
    name: '스톰피크',
    description: '북서쪽 폭풍이 휘몰아치는 산 꼭대기의 사원.',
    affinity: [JobClass.PRIEST, JobClass.WIZARD],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 20, y: 10 }
  },
  {
    id: 'crystalbay',
    name: '크리스탈 베이',
    description: '남서쪽 해안가의 보석처럼 빛나는 항구.',
    affinity: [JobClass.WIZARD],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 20, y: 80 }
  },
  {
    id: 'ashencrag',
    name: '애쉬크래그',
    description: '중앙 산맥 근처의 화산 지대에 위치한 광산 마을.',
    affinity: [JobClass.WARRIOR],
    restrictedJobs: [],
    inventory: JSON.parse(JSON.stringify(DEFAULT_TRADE_GOODS)),
    coordinates: { x: 35, y: 60 }
  }
];

export const INITIAL_PLAYER_STATS: Stats = {
  str: 10,
  int: 10,
  dex: 10,
  wis: 10
};
