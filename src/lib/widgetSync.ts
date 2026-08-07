import { getLocalDateString } from './utils';

export interface WidgetDataPayload {
  netTotal: number;
  totalExpense: number;
  currency: string;
  updatedAt: string;
}

export function updateWidgetCache(netTotal: number, totalExpense: number, currency = 'COP') {
  if (typeof window === 'undefined') return;

  const payload: WidgetDataPayload = {
    netTotal,
    totalExpense,
    currency,
    updatedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem('diner_widget_data', JSON.stringify(payload));
    // Post message to Capacitor native layer if available
    if ((window as any).Capacitor?.isNativePlatform?.()) {
      (window as any).Capacitor.Plugins?.NativeBridge?.updateWidget?.(payload);
    }
  } catch (e) {
    console.warn('Widget cache update failed:', e);
  }
}

export function getWidgetCache(): WidgetDataPayload {
  if (typeof window === 'undefined') {
    return { netTotal: 841738, totalExpense: 2559223, currency: 'COP', updatedAt: new Date().toISOString() };
  }

  try {
    const raw = localStorage.getItem('diner_widget_data');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed reading widget cache:', e);
  }

  return { netTotal: 841738, totalExpense: 2559223, currency: 'COP', updatedAt: new Date().toISOString() };
}
