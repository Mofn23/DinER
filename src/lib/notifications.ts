import { SubscriptionData } from './initialData';
import { getLocalDateString, formatAmount } from './utils';

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...options,
        });
      });
    } else {
      try {
        new Notification(title, {
          icon: '/icon-192.png',
          ...options,
        });
      } catch (e) {
        console.warn('Fallback Notification error:', e);
      }
    }
  }
}

export function checkAndNotifyUpcomingSubscriptions(subscriptions: SubscriptionData[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const today = new Date();
  const currentDay = today.getDate(); // 1-31
  const todayStr = getLocalDateString(today);

  subscriptions.forEach((sub) => {
    const daysDiff = sub.billingDay - currentDay;

    if (daysDiff === 0 && sub.lastPaidDate !== todayStr) {
      sendLocalNotification(`📺 Suscripción Hoy: ${sub.name}`, {
        body: `¡Hoy vence tu suscripción de ${sub.name} por ${formatAmount(-sub.amount)}! Toca para pagar en DinER.`,
        tag: `sub-due-${sub.id}-${todayStr}`,
      });
    } else if (daysDiff === 1) {
      sendLocalNotification(`📺 Próximo Pago: ${sub.name}`, {
        body: `Mañana vence tu suscripción de ${sub.name} por ${formatAmount(-sub.amount)}.`,
        tag: `sub-upcoming-${sub.id}-${todayStr}`,
      });
    }
  });
}
