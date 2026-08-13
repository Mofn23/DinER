import { LocalNotifications } from '@capacitor/local-notifications';
import { SubscriptionData } from './initialData';
import { getLocalDateString, formatAmount } from './utils';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const status = await LocalNotifications.requestPermissions();
    if (status.display === 'granted') return true;
  } catch (err) {
    console.warn('Capacitor LocalNotifications permission request error:', err);
  }

  if ('Notification' in window) {
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function sendLocalNotification(
  id: number,
  title: string,
  body: string,
  scheduleDate?: Date
) {
  if (typeof window === 'undefined') return;

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: scheduleDate ? { at: scheduleDate } : undefined,
          sound: 'beep.wav',
          actionTypeId: '',
          extra: null,
        },
      ],
    });
    return;
  } catch (e) {
    console.warn('Native LocalNotifications fallback to Web Notification:', e);
  }

  // Web Notification fallback
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
      });
    } catch (e) {
      console.warn('Web Notification fallback error:', e);
    }
  }
}

export async function checkAndNotifyUpcomingSubscriptions(subscriptions: SubscriptionData[]) {
  if (typeof window === 'undefined') return;

  const today = new Date();
  const currentDay = today.getDate(); // 1-31
  const todayStr = getLocalDateString(today);

  for (let i = 0; i < subscriptions.length; i++) {
    const sub = subscriptions[i];
    const daysDiff = sub.billingDay - currentDay;

    // 1. Same day notification (0 days)
    if (daysDiff === 0 && sub.lastPaidDate !== todayStr) {
      const notifId = Math.abs(hashCode(`same-${sub.id}-${todayStr}`));
      await sendLocalNotification(
        notifId,
        `🚨 ¡Hoy Vence Tu Suscripción!: ${sub.name}`,
        `¡Hoy vence el pago de ${sub.name} por ${formatAmount(-sub.amount)}! Toca para registrar el pago.`
      );
    }
    // 2. 1 day before (1 day)
    else if (daysDiff === 1) {
      const notifId = Math.abs(hashCode(`1day-${sub.id}-${todayStr}`));
      await sendLocalNotification(
        notifId,
        `📺 Próximo Pago Mañana: ${sub.name}`,
        `Mañana vence la suscripción a ${sub.name} por ${formatAmount(-sub.amount)}.`
      );
    }
    // 3. 3 days before (3 days)
    else if (daysDiff === 3) {
      const notifId = Math.abs(hashCode(`3days-${sub.id}-${todayStr}`));
      await sendLocalNotification(
        notifId,
        `🗓️ Próximo Pago en 3 Días: ${sub.name}`,
        `En 3 días vencerá la suscripción a ${sub.name} por ${formatAmount(-sub.amount)}.`
      );
    }
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}
