import { CategoryData } from './initialData';

export function matchCategoryFromDescription(
  description: string,
  categories: CategoryData[]
): string | null {
  if (!description.trim()) return null;
  const descLower = description.toLowerCase().trim();

  // 1. Direct name match
  for (const cat of categories) {
    if (descLower.includes(cat.name.toLowerCase())) {
      return cat.id;
    }
  }

  // 2. Keyword map for smart categorization
  const keywordMap: Record<string, string[]> = {
    'cat-5': ['uber', 'didi', 'cabify', 'taxi', 'transporte', 'pasaje', 'bus', 'metro', 'carrro', 'viaje'], // Uber 🚘
    'cat-4': ['comida', 'kfc', 'qbano', 'arepa', 'arepas', 'mercar', 'supermercado', 'restaurante', 'almuerzo', 'desayuno', 'cena', 'rappi', 'mcdonalds', 'domino', 'pizza', 'burger', 'mercado'], // Comida 🍲
    'cat-3': ['gym', 'fitness', 'bodyfit', 'gimnasio', 'smartfit', 'crossfit', 'entrenamiento'], // Gym 🏋️
    'cat-1': ['mamá', 'mama', 'zara', 'pull', 'falabella', 'rodilleras', 'madre'], // Mamá 👩‍🍼
    'cat-2': ['papá', 'papa', 'padre'], // Papá 👴
    'cat-6': ['suscripción', 'suscripcion', 'icloud', 'whatsapp', 'netflix', 'spotify', 'apple', 'youtube', 'prime'], // Suscripción 📺
    'cat-10': ['bar', 'cóctel', 'coctel', 'cerveza', 'trago', 'drinks', 'fiesta', 'licor'], // Drinks 🍺
    'cat-9': ['barbero', 'corte', 'barberia', 'peluqueria', 'barba'], // Barbero 💈
    'cat-15': ['crédito', 'credito', 'avance', 'banco', 'prestamo'], // Credito 💳
    'cat-13': ['dollarcity', 'personal', 'farmacia', 'drogueria'], // Personal 🧍
    'cat-14': ['salidas', 'entradas', 'boleta', 'cine', 'concierto'], // Salidas 🎉
  };

  for (const [catId, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => descLower.includes(kw))) {
      const exists = categories.some((c) => c.id === catId);
      if (exists) return catId;
    }
  }

  return null;
}
