import AsyncStorage from '@react-native-async-storage/async-storage';

// Serviço leve de notificações usando expo-notifications.
// Este arquivo mantém tipagem mais flexível para evitar incompatibilidades entre versões do SDK.

const MAP_KEY = '@FlowPay:notificationMap';

async function loadMap(): Promise<Record<string, string[]>> {
  try {
    const raw = await AsyncStorage.getItem(MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

async function saveMap(map: Record<string, string[]>) {
  try {
    await AsyncStorage.setItem(MAP_KEY, JSON.stringify(map));
  } catch (e) {
    // ignorar falhas de persistência
  }
}

async function requestPermissionsIfNeeded() {
  try {
    const Notifications = require('expo-notifications');
    const { status } = await Notifications.getPermissionsAsync?.() ?? { status: 'undetermined' };
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync?.();
    }
  } catch (e) {
    // expo-notifications não está instalada ou ocorreu um erro — ignorar silenciosamente
  }
}

function msUntil(dateIso?: string | undefined) {
  if (!dateIso) return null;
  const target = new Date(String(dateIso));
  const now = new Date();
  const ms = target.getTime() - now.getTime();
  return ms > 0 ? ms : null;
}

const NotificationsService = {
  async scheduleNotificationsForPayment(opts: { id: string; name?: string | null; date?: string | undefined; recurring?: boolean; recurrence?: string | undefined }) {
    await requestPermissionsIfNeeded();
    try {
      const Notifications = require('expo-notifications');
      const ms = msUntil(opts.date);
      if (ms == null) return [] as string[];
      // Para compatibilidade com Expo Go, agendamos uma notificação de intervalo de tempo (em segundos).
      const seconds = Math.max(1, Math.round(ms / 1000));
      const trigger: any = { seconds, repeats: false };

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: opts.name ? `${opts.name} • Pagamento` : 'Pagamento agendado',
          body: 'Chegou a data do pagamento.',
          data: { paymentId: opts.id },
        },
        trigger: trigger as any,
      });

      const map = await loadMap();
      map[opts.id] = (map[opts.id] || []).concat(String(id));
      await saveMap(map);
      return [String(id)];
    } catch (e) {
      return [] as string[];
    }
  },

  async cancelNotificationsForPayment(paymentId: string) {
    try {
      const Notifications = require('expo-notifications');
      const map = await loadMap();
      const list = map[paymentId] || [];
      await Promise.all(list.map((id) => Notifications.cancelScheduledNotificationAsync?.(id).catch(() => {})));
      delete map[paymentId];
      await saveMap(map);
    } catch (e) {
      // ignorar erros de cancelamento
    }
  },

  async requestPermissions() {
    try {
      const Notifications = require('expo-notifications');
      return Notifications.requestPermissionsAsync?.();
    } catch (e) {
      return null;
    }
  },
};

export default NotificationsService;
