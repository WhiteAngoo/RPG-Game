
import { JobClass, Stats, Character, Item, ItemType, City, TradeItem, Encounter, EncounterType } from '../types';
import { JOB_DEFINITIONS, WEIGHT_LIMIT_MULTIPLIER, INITIAL_CITIES, INITIAL_PLAYER_STATS } from '../constants';
import { NetworkManager } from './networkManager';

export class CombatSystem {
  static calculatePower(stats: Stats, isAttacker: boolean, job?: JobClass): number {
    const randomBonus = Math.floor(Math.random() * 20) + 1;
    let power = 0;
    
    if (isAttacker) {
      power = (stats.str * 0.6) + (stats.dex * 0.4) + randomBonus;
      if (job === JobClass.WARRIOR) power += 15;
    } else {
      power = (stats.str * 0.7) + (stats.wis * 0.3) + randomBonus;
    }
    
    return power;
  }

  static generateEncounter(activePlayers: any[] = [], currentUserId: string = ''): Encounter {
    // 40% probability of player encounter if other players are online
    const otherPlayers = activePlayers.filter(p => p.id !== currentUserId);
    
    if (otherPlayers.length > 0 && Math.random() < 0.4) {
      const targetPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
      return {
        type: EncounterType.PLAYER,
        name: targetPlayer.name || '알 수 없는 방랑자',
        description: `${targetPlayer.job} 클래스의 경쟁 상인입니다.`,
        stats: { str: 40, int: 40, dex: 40, wis: 40 }, // Base stats for player encounter
        inventory: [{ id: 'player_gold', name: "금화 주머니", weight: 1, type: ItemType.NORMAL, basePrice: 1000, price: 1000 }],
        playerId: targetPlayer.id,
        inventoryValue: targetPlayer.inventoryValue
      };
    }

    const isMarauder = Math.random() > 0.5;
    const type = isMarauder ? EncounterType.MARAUDER : EncounterType.MERCHANT;
    const name = isMarauder ? "숲의 도적" : "떠돌이 상인";
    const description = isMarauder ? "숲속에서 당신의 짐을 노리고 나타난 도적입니다." : "지나가던 상인이 거래를 제안...하지 않고 시비를 겁니다.";
    
    // Explicitly define stats
    const stats: Stats = {
      str: Math.floor(Math.random() * 40) + 20,
      int: Math.floor(Math.random() * 40) + 10,
      dex: Math.floor(Math.random() * 40) + 10,
      wis: Math.floor(Math.random() * 40) + 10,
    };

    const loot: Item[] = [
      { id: 'loot1', name: "전리품 보따리", weight: 5, type: ItemType.NORMAL, basePrice: 300, price: 300 },
      { id: 'loot2', name: "금화 주머니", weight: 1, type: ItemType.NORMAL, basePrice: 800, price: 800 },
    ];

    return { type, name, description, stats, inventory: loot };
  }
}

export class TradeSystem {
  static getPrice(item: TradeItem): number {
    const scarcityRatio = 1 + (item.maxStock - item.stock) / item.maxStock;
    return Math.floor(item.basePrice * scarcityRatio);
  }

  static canTrade(job: JobClass, item: TradeItem | Item, isBuying: boolean): { can: boolean; reason?: string } {
    const itemType = item.type;
    if (job === JobClass.WARRIOR && itemType === ItemType.MAGIC) {
      return { can: false, reason: "지능이 부족하여 마법 물품을 다룰 수 없습니다." };
    }
    if (job === JobClass.PRIEST && itemType === ItemType.STOLEN) {
      return { can: false, reason: "신념에 따라 장물을 거래할 수 없습니다." };
    }
    if (job !== JobClass.THIEF && itemType === ItemType.STOLEN && isBuying) {
      return { can: false, reason: "일반인은 장물을 취급할 수 없습니다." };
    }
    return { can: true };
  }

  static getWeight(job: JobClass, item: TradeItem | Item): number {
    if (job === JobClass.WIZARD && item.weight >= 8) {
      return item.weight * 2;
    }
    return item.weight;
  }

  static getEffectivePrice(job: JobClass, city: City, item: TradeItem, isBuying: boolean): number {
    let price = this.getPrice(item);
    if (city.affinity.includes(job)) {
      price = isBuying ? Math.floor(price * 0.9) : Math.floor(price * 1.1);
    }
    if (job === JobClass.PRIEST && item.name === "식량") {
      price = isBuying ? Math.floor(price * 0.8) : Math.floor(price * 1.2);
    }
    return price;
  }
}

export class WorldManager {
  private cities: City[];
  private network: NetworkManager;

  constructor() {
    this.cities = INITIAL_CITIES;
    this.network = NetworkManager.getInstance();
  }

  getCities() {
    return this.cities;
  }

  getCity(id: string) {
    return this.cities.find(c => c.id === id);
  }

  // Update stock locally and globally
  async updateStock(cityId: string, itemName: string, delta: number) {
    const city = this.getCity(cityId);
    if (!city) return;
    const item = city.inventory.find(i => i.name === itemName);
    if (item) {
      // Optimistic update
      item.stock = Math.max(0, Math.min(item.maxStock, item.stock + delta));
      // Network sync
      await this.network.updateGlobalMarket(cityId, itemName, delta);
    }
  }

  // Synchronize local city data with firebase data
  syncCities(marketData: any) {
    if (!marketData) return;
    this.cities.forEach(city => {
      const cityMarket = marketData[city.id];
      if (cityMarket) {
        city.inventory.forEach(item => {
          if (cityMarket[item.name] !== undefined) {
            item.stock = cityMarket[item.name];
          }
        });
      }
    });
  }
}

export class GameService {
  static generateRandomStats(job: JobClass): Pick<Stats, 'str' | 'int' | 'dex' | 'wis'> {
    const limits = JOB_DEFINITIONS[job].maxStats;
    const getRandom = (max: number, min: number = 5) => 
      Math.floor(Math.random() * (max - min + 1) + min);

    return {
      str: getRandom(limits.str, Math.floor(limits.str * 0.4)),
      int: getRandom(limits.int, Math.floor(limits.int * 0.4)),
      dex: getRandom(limits.dex, Math.floor(limits.dex * 0.4)),
      wis: getRandom(limits.wis, Math.floor(limits.wis * 0.4)),
    };
  }

  static calculateTotalWeight(inventory: Item[], job: JobClass): number {
    return Number(inventory.reduce((sum, item) => sum + TradeSystem.getWeight(job, item), 0).toFixed(2));
  }

  static createCharacter(name: string, job: JobClass): Character {
    const randomStats = this.generateRandomStats(job);
    const id = Math.random().toString(36).substr(2, 9);
    
    const fullStats: Stats = {
      ...INITIAL_PLAYER_STATS,
      ...randomStats
    };

    return {
      id,
      name,
      job,
      baseStats: { ...fullStats },
      currentStats: { ...fullStats },
      inventory: [],
      gold: 5000,
      currentCityId: 'goldhaven',
      isTraveling: false,
      targetCityId: null
    };
  }
}
