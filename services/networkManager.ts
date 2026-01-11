
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, set, onValue, onDisconnect, get } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { firebaseConfig } from '../firebaseConfig';
import { Character } from '../types';

export class NetworkManager {
  private static instance: NetworkManager;
  private db: any;
  private app: any;
  private userId: string | null = null;

  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  setUserId(id: string) {
    this.userId = id;
  }

  // Update shared market stock in Firebase
  async updateGlobalMarket(cityId: string, itemName: string, delta: number) {
    try {
      const stockRef = ref(this.db, `Global_Market/${cityId}/${itemName}`);
      const snapshot = await get(stockRef);
      const currentStock = snapshot.val() || 0;
      await set(stockRef, Math.max(0, currentStock + delta));
    } catch (e) {
      console.error("Firebase Error:", e);
    }
  }

  // Sync shared market with local state
  onMarketUpdate(callback: (marketData: any) => void) {
    const marketRef = ref(this.db, 'Global_Market');
    onValue(marketRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  // Player Presence
  async syncPlayer(character: Character) {
    if (!this.userId) return;
    
    // Calculate inventory value
    const inventoryValue = character.inventory.reduce((sum, item) => sum + item.price, 0);

    const playerRef = ref(this.db, `Active_Players/${this.userId}`);

    const playerData = {
      id: character.id,
      name: character.name,
      job: character.job,
      cityId: character.currentCityId,
      gold: character.gold,
      inventoryValue: inventoryValue,
      isTraveling: character.isTraveling,
      lastSeen: Date.now()
    };

    // Use a promise to handle potential network issues gracefully
    try {
        await set(playerRef, playerData);
        // Ensure we remove on disconnect
        onDisconnect(playerRef).remove();
    } catch (e) {
        console.error("Sync Player Error:", e);
    }
  }

  onPlayersUpdate(callback: (players: any) => void) {
    const playersRef = ref(this.db, 'Active_Players');
    onValue(playersRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  onServerStatus(callback: (status: boolean) => void) {
    const connectedRef = ref(this.db, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      callback(snapshot.val());
    });
  }
}
