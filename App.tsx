import React, { useState, useEffect, useMemo } from 'react';
import { JobClass, Character, Item, City, TradeItem, Encounter, EncounterType, CombatLog, NetworkState } from './types';
import { WEIGHT_LIMIT_MULTIPLIER, INITIAL_CITIES, JOB_DEFINITIONS, INITIAL_PLAYER_STATS, DEFAULT_TRADE_GOODS } from './constants';
import { GameService, TradeSystem, WorldManager, CombatSystem, LootSystem } from './services/gameService';
import { NetworkManager } from './services/networkManager';
import { resolveCombatRound } from './services/geminiService';

// Components
import { GameHeader } from './components/GameHeader';
import { CharacterCreation } from './components/CharacterCreation';
import { BottomNav } from './components/BottomNav';
import { LogConsole } from './components/LogConsole';
import { CombatModal } from './components/CombatModal';

// Views
import { CharacterView } from './views/CharacterView';
import { MarketView } from './views/MarketView';
import { InventoryView } from './views/InventoryView';
import { MapView } from './views/MapView';
import { ImageConverterView } from './views/ImageConverterView';

const world = new WorldManager();
const network = NetworkManager.getInstance();

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isCreating, setIsCreating] = useState(true);
  const [isTraveling, setIsTraveling] = useState(false);
  const [, setTravelProgress] = useState(0);
  const [view, setView] = useState<'inventory' | 'shop' | 'map' | 'character'>('character');
  const [cities, setCities] = useState<City[]>(world.getCities());

  // Network States
  const [networkState, setNetworkState] = useState<NetworkState>({ onlineCount: 0, serverStatus: 'connecting' });
  const [activePlayers, setActivePlayers] = useState<any[]>([]);

  // Encounter & Combat States
  const [encounter, setEncounter] = useState<Encounter | null>(null);
  const [combatAnim, setCombatAnim] = useState<{ playerHp: number, enemyHp: number } | null>(null);
  const [combatNarrative, setCombatNarrative] = useState<string>("");
  const [logs, setLogs] = useState<CombatLog[]>([]);
  const [isCombatProcessing, setIsCombatProcessing] = useState(false);

  const addLog = (message: string, type: CombatLog['type'] = 'info') => {
    const newLog: CombatLog = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type
    };
    setLogs(prev => [...prev.slice(-19), newLog]);
  };

  // Firebase Synchronization Effect
  useEffect(() => {
    network.onMarketUpdate((marketData) => {
      world.syncCities(marketData);
      setCities([...world.getCities()]);
    });

    network.onPlayersUpdate((players) => {
      if (players) {
        const playerList = Object.values(players);
        setActivePlayers(playerList);
        setNetworkState(prev => ({ ...prev, onlineCount: playerList.length }));
      }
    });

    network.onServerStatus((isConnected) => {
      setNetworkState(prev => ({ ...prev, serverStatus: isConnected ? 'connected' : 'disconnected' }));
    });
  }, [character?.id]);

  useEffect(() => {
    if (character) {
      network.syncPlayer({ ...character, isTraveling });
    }
  }, [character, isTraveling]);

  const currentCity = useMemo(() =>
    cities.find(c => c.id === character?.currentCityId) || cities[0]
    , [character?.currentCityId, cities]);

  const handleCreate = (job: JobClass) => {
    const newChar = GameService.createCharacter("플레이어", job);
    network.setUserId(newChar.id);
    setCharacter(newChar);
    setIsCreating(false);
    setView('character');
    addLog(`${job} 클래스로 서버에 접속했습니다!`, 'network');
  };

  const startTravel = async (cityId: string) => {
    if (cityId === character?.currentCityId) return;
    const targetCity = world.getCity(cityId);
    if (targetCity?.restrictedJobs.includes(character!.job)) {
      addLog(`${targetCity.name}은(는) ${character?.job}의 출입을 금지하고 있습니다!`, 'error');
      return;
    }

    setIsTraveling(true);
    setTravelProgress(0);

    addLog(`${targetCity.name}(으)로 이동을 시작합니다...`, 'info');

    const duration = 3000;
    const interval = 50;
    let elapsed = 0;
    let encounterTriggered = false;

    const timer = setInterval(async () => {
      elapsed += interval;
      setTravelProgress((elapsed / duration) * 100);

      // 40% Chance of encounter
      if (!encounterTriggered && elapsed >= duration / 2 && Math.random() < 0.4) {
        encounterTriggered = true;
        clearInterval(timer);
        setIsTraveling(false);

        const newEncounter = CombatSystem.generateEncounter(activePlayers, character!.id);
        // Initialize combat HP
        newEncounter.currentHp = 100;
        newEncounter.maxHp = 100;

        setEncounter(newEncounter);
        setCombatAnim({ playerHp: 100, enemyHp: 100 });
        setCombatNarrative(`${newEncounter.name}이(가) 앞을 가로막았습니다!`);

        if (newEncounter.type === EncounterType.PLAYER) {
          addLog(`${newEncounter.name} 플레이어를 길에서 조우했습니다!`, 'combat');
        } else if (newEncounter.type === EncounterType.MARAUDER) {
          addLog(`위험한 ${newEncounter.name}이(가) 나타났습니다!`, 'danger');
        } else {
          addLog(`${newEncounter.name}을(를) 만났습니다.`, 'info');
        }
        return;
      }

      if (elapsed >= duration) {
        clearInterval(timer);
        setIsTraveling(false);
        setCharacter(prev => prev ? { ...prev, currentCityId: cityId } : null);
        addLog(`${targetCity.name}에 도착했습니다.`, 'info');
        if (character?.job === JobClass.THIEF && cityId === 'ironwall') {
          addLog("경비병에게 발각되어 벌금 500G를 지불했습니다.", 'error');
          setCharacter(prev => prev ? { ...prev, gold: Math.max(0, prev.gold - 500) } : null);
        }
        setView('shop');
      }
    }, interval);
  };

  const handleCombatAction = async (action: 'ATTACK' | 'DEFEND' | 'MAGIC' | 'FLEE') => {
    if (!character || !encounter || isCombatProcessing) return;

    setIsCombatProcessing(true);

    try {
      const result = await resolveCombatRound(
        character.name,
        character.job,
        character.currentStats,
        encounter.name,
        encounter.stats,
        action
      );

      // Update Narrative
      setCombatNarrative(result.narrative);
      addLog(result.narrative, 'combat');

      // Update State
      setCombatAnim(prev => {
        if (!prev) return null;
        const newPlayerHp = Math.max(0, prev.playerHp - result.playerDamageTaken);
        const newEnemyHp = Math.max(0, prev.enemyHp - result.enemyDamageTaken);
        return { playerHp: newPlayerHp, enemyHp: newEnemyHp };
      });

      // Check for End of Combat
      setTimeout(() => {
        setCombatAnim(current => {
          if (!current) return null;

          if (current.enemyHp <= 0) {
            winCombat();
            return current;
          } else if (current.playerHp <= 0) {
            loseCombat();
            return current;
          }
          return current;
        });
        setIsCombatProcessing(false);
      }, 1000);

    } catch (e) {
      console.error(e);
      addLog("전투 처리 중 오류 발생", 'error');
      setIsCombatProcessing(false);
    }
  };

  const winCombat = () => {
    if (!character || !encounter) return;
    addLog(`전투 승리! ${encounter.name}을(를) 제압했습니다.`, 'combat');

    const loot = encounter.inventory;
    const currentWeight = GameService.calculateTotalWeight(character.inventory, character.job);
    const limit = character.currentStats.str * WEIGHT_LIMIT_MULTIPLIER;

    let addedItemsCount = 0;
    const newInventory = [...character.inventory];

    loot.forEach(item => {
      const itemWeight = TradeSystem.getWeight(character.job, item);
      if (currentWeight + itemWeight <= limit && addedItemsCount < 2) {
        // 전리품은 originCity를 'Battlefield' 등으로 설정하거나 비워둘 수 있습니다.
        newInventory.push({
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          originCity: '전리품'
        });
        addedItemsCount++;
        addLog(`${item.name}을(를) 획득했습니다.`, 'trade');
      }
    });

    setCharacter(prev => prev ? { ...prev, inventory: newInventory } : null);
    setEncounter(null);
    setCombatAnim(null);
    setCombatNarrative("");
    setView('shop');
  };

  const loseCombat = () => {
    if (!character) return;

    if (character.inventory.length > 0) {
      const sorted = [...character.inventory].sort((a, b) => b.price - a.price);
      const lost = sorted[0];
      addLog(`전투 패배... 정신을 차려보니 ${lost.name}이(가) 사라졌습니다.`, 'error');
      setCharacter(prev => prev ? {
        ...prev,
        inventory: prev.inventory.filter(i => i.id !== lost.id)
      } : null);
    } else {
      addLog("전투 패배... 다행히 잃어버린 물건은 없습니다.", 'error');
    }

    setEncounter(null);
    setCombatAnim(null);
    setCombatNarrative("");
    setView('shop');
  };

  const handleBribe = () => {
    if (!character) return;
    const bribeAmount = 300;
    if (character.gold >= bribeAmount) {
      addLog(`${bribeAmount}G를 슬그머니 건네자 적이 물러납니다.`, 'trade');
      setCharacter(prev => prev ? { ...prev, gold: prev.gold - bribeAmount } : null);
      setEncounter(null);
      setCombatAnim(null);
      setView('shop');
    } else {
      addLog("골드가 부족합니다! 전투를 피할 수 없습니다.", 'error');
    }
  };

  const handleBuy = async (tradeItem: TradeItem, quantity: number = 1) => {
    if (!character) return;
    const check = TradeSystem.canTrade(character.job, tradeItem, true);
    if (!check.can) { alert(check.reason); return; }

    const pricePerUnit = TradeSystem.getEffectivePrice(character.job, currentCity, tradeItem, true);
    const totalPrice = pricePerUnit * quantity;

    if (character.gold < totalPrice) { alert("골드가 부족합니다."); return; }
    if (tradeItem.stock < quantity) { alert("재고가 부족합니다."); return; }

    const itemWeight = TradeSystem.getWeight(character.job, tradeItem);
    const totalWeightToAdd = itemWeight * quantity;
    const currentWeight = GameService.calculateTotalWeight(character.inventory, character.job);
    const limit = character.currentStats.str * WEIGHT_LIMIT_MULTIPLIER;

    if (currentWeight + totalWeightToAdd > limit) { alert("무게 한도를 초과했습니다."); return; }

    world.updateStock(currentCity.id, tradeItem.name, -quantity);

    const newItems: Item[] = Array.from({ length: quantity }).map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      name: tradeItem.name,
      weight: tradeItem.weight,
      type: tradeItem.type,
      basePrice: tradeItem.basePrice,
      price: pricePerUnit,
      originCity: currentCity.name // 구매 도시 기록
    }));

    setCharacter(prev => prev ? {
      ...prev,
      gold: prev.gold - totalPrice,
      inventory: [...prev.inventory, ...newItems]
    } : null);
    addLog(`${tradeItem.name} ${quantity}개 구매 (${totalPrice}G). 서버에 반영되었습니다.`, 'trade');
  };

  const handleUseItem = (item: Item) => {
    if (!item.name.includes('전리품')) return;

    const newItems = LootSystem.openLootSack(item.name, DEFAULT_TRADE_GOODS);
    if (newItems) {
      setCharacter(prev => {
        if (!prev) return null;
        const remainingInventory = prev.inventory.filter(i => i.id !== item.id);
        return {
          ...prev,
          inventory: [...remainingInventory, ...newItems]
        };
      });

      const itemNames = newItems.map(i => i.name).join(', ');
      addLog(`${item.name}을(를) 개봉하여 [${itemNames}]을(를) 획득했습니다!`, 'trade');
    }
  };

  const handleSell = async (inventoryItem: Item) => {
    if (!character) return;
    const tradeItemTemplate = currentCity.inventory.find(i => i.name === inventoryItem.name);
    if (!tradeItemTemplate) return;
    const check = TradeSystem.canTrade(character.job, inventoryItem, false);
    if (!check.can) { alert(check.reason); return; }

    const sellPrice = TradeSystem.getEffectivePrice(character.job, currentCity, tradeItemTemplate, false);
    world.updateStock(currentCity.id, inventoryItem.name, 1);

    setCharacter(prev => prev ? {
      ...prev,
      gold: prev.gold + sellPrice,
      inventory: prev.inventory.filter(i => i.id !== inventoryItem.id)
    } : null);
    addLog(`${inventoryItem.name} 판매 (+${sellPrice}G). 전역 시세가 변동됩니다.`, 'trade');
  };

  const handleDiscard = (item: Item) => {
    if (!character) return;
    setCharacter(prev => prev ? {
      ...prev,
      inventory: prev.inventory.filter(i => i.id !== item.id)
    } : null);
    addLog(`${item.name}을(를) 버렸습니다.`, 'info');
  };

  const totalWeight = useMemo(() =>
    character ? GameService.calculateTotalWeight(character.inventory, character.job) : 0
    , [character]);

  const weightLimit = useMemo(() =>
    character ? character.currentStats.str * WEIGHT_LIMIT_MULTIPLIER : 0
    , [character]);

  if (isCreating) {
    return <CharacterCreation networkState={networkState} onSelectClass={handleCreate} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200 overflow-hidden relative">
      <div className="bg-slate-950 px-5 py-2 flex justify-between items-center border-b border-slate-900 text-[9px] font-black tracking-widest uppercase">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${networkState.serverStatus === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <span className={networkState.serverStatus === 'connected' ? 'text-emerald-500' : 'text-red-500'}>{networkState.serverStatus}</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            <span>{networkState.onlineCount} Online</span>
          </div>
        </div>
        <div className="text-slate-600">v2.5 AI RPG Core</div>
      </div>

      {character && (
        <GameHeader
          character={character}
          currentCity={currentCity}
          currentView={view}
          onNavigateToMap={() => setView('map')}
        />
      )}

      <main className="flex-1 overflow-y-auto pb-48">
        {character && (
          <>
            {view === 'shop' && (
              <MarketView
                currentCity={currentCity}
                character={character}
                totalWeight={totalWeight}
                weightLimit={weightLimit}
                onBuyItem={handleBuy}
              />
            )}
            {view === 'inventory' && (
              <InventoryView
                character={character}
                currentCity={currentCity}
                onSellItem={handleSell}
                onDiscardItem={handleDiscard}
                onUseItem={handleUseItem}
              />
            )}
            {view === 'map' && (
              <MapView
                cities={cities}
                character={character}
                activePlayers={activePlayers}
                onStartTravel={startTravel}
              />
            )}
            {view === 'character' && (
              <CharacterView
                character={character}
                onSellItem={handleSell}
              />
            )}

          </>
        )}
      </main>

      <LogConsole logs={logs} />
      <CombatModal
        encounter={encounter}
        character={character}
        combatAnim={combatAnim}
        narrative={combatNarrative}
        isProcessing={isCombatProcessing}
        onBattle={() => handleCombatAction('ATTACK')}
        onMagic={() => handleCombatAction('MAGIC')}
        onBribe={handleBribe}
        onFlee={() => handleCombatAction('FLEE')}
      />
      <BottomNav currentView={view} onViewChange={setView} />
    </div>
  );
};

export default App;
