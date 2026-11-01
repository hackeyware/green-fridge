// localStorage persistence. No backend, no accounts.
//
// Items:  { id, name, category, quantityKg, expiryDate, dateType, status,
//           addedAt, resolvedAt? }        status: 'active' | 'eaten' | 'wasted'
//   dateType: 'best-before' | 'use-by'
// Settings: { weeklyWasteKg, isSample } — waste baseline + sample-data flag
// Log:      [{ at, action, name }] — timestamped record of every action

import { DEFAULT_WEEKLY_WASTE_KG } from './emissions.js';

export const ITEMS_KEY = 'green-fridge/items/v2';
export const SETTINGS_KEY = 'green-fridge/settings/v1';
export const LOG_KEY = 'green-fridge/log/v1';
export const LOG_LIMIT = 200;

export function loadItems() {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    // Backfill/normalise the dateType field for robustness
    return parsed.map((i) => ({
      ...i,
      dateType: i.dateType === 'use-by' ? 'use-by' : 'best-before',
    }));
  } catch {
    return [];
  }
}

export function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const kg = Number(parsed.weeklyWasteKg);
    return {
      weeklyWasteKg:
        Number.isFinite(kg) && kg >= 0 && kg <= 50 ? kg : DEFAULT_WEEKLY_WASTE_KG,
      isSample: parsed.isSample === true,
    };
  } catch {
    return { weeklyWasteKg: DEFAULT_WEEKLY_WASTE_KG, isSample: false };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Prepend a timestamped entry, cap the size, persist, and return the new log.
export function addLogEntry({ action, name }) {
  const log = [{ at: new Date().toISOString(), action, name }, ...loadLog()].slice(0, LOG_LIMIT);
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
  return log;
}

// "Reset data": wipe everything the app has stored.
export function clearAllData() {
  localStorage.removeItem(ITEMS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(LOG_KEY);
}

// Demo dataset spread over the past two weeks: a realistic mix of items
// already eaten / thrown away (for the charts and impact) plus active items,
// including two in the red zone.
function daysFromNowISO(days) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function localDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

let counter = 0;
function makeItem({
  name,
  category,
  quantityKg,
  expiryInDays,
  dateType = 'best-before',
  status = 'active',
  resolvedDaysAgo = 0,
  addedDaysAgo = 0,
}) {
  counter += 1;
  return {
    id: `demo-${counter}-${crypto.randomUUID()}`,
    name,
    category,
    quantityKg,
    expiryDate: localDate(expiryInDays),
    dateType,
    status,
    addedAt: daysFromNowISO(-addedDaysAgo),
    resolvedAt: status === 'active' ? undefined : daysFromNowISO(-resolvedDaysAgo),
  };
}

export function sampleItems() {
  return [
    // --- Already resolved, spread over the last two weeks ---
    makeItem({ name: 'Apples', category: 'fruit', quantityKg: 0.6, expiryInDays: -1, status: 'eaten', resolvedDaysAgo: 2, addedDaysAgo: 12 }),
    makeItem({ name: 'Chicken breast', category: 'meat', quantityKg: 0.4, expiryInDays: -2, status: 'eaten', resolvedDaysAgo: 5, addedDaysAgo: 10, dateType: 'use-by' }),
    makeItem({ name: 'Milk', category: 'dairy', quantityKg: 1, expiryInDays: -4, status: 'eaten', resolvedDaysAgo: 8, addedDaysAgo: 14 }),
    makeItem({ name: 'Basmati rice', category: 'grains', quantityKg: 0.8, expiryInDays: -6, status: 'eaten', resolvedDaysAgo: 11, addedDaysAgo: 14 }),
    makeItem({ name: 'Leftover pasta', category: 'other', quantityKg: 0.4, expiryInDays: -3, status: 'eaten', resolvedDaysAgo: 6, addedDaysAgo: 9 }),
    makeItem({ name: 'Bread rolls', category: 'grains', quantityKg: 0.3, expiryInDays: -2, status: 'wasted', resolvedDaysAgo: 4, addedDaysAgo: 9 }),
    makeItem({ name: 'Salad greens', category: 'vegetables', quantityKg: 0.2, expiryInDays: -6, status: 'wasted', resolvedDaysAgo: 9, addedDaysAgo: 13 }),
    makeItem({ name: 'Ground beef', category: 'meat', quantityKg: 0.3, expiryInDays: -7, status: 'wasted', resolvedDaysAgo: 12, addedDaysAgo: 14, dateType: 'use-by' }),

    // --- Still active: two red, two orange, two green ---
    makeItem({ name: 'Spinach', category: 'vegetables', quantityKg: 0.3, expiryInDays: 0, addedDaysAgo: 4 }),
    makeItem({ name: 'Salmon fillet', category: 'fish', quantityKg: 0.4, expiryInDays: 1, dateType: 'use-by', addedDaysAgo: 3 }),
    makeItem({ name: 'Greek yogurt', category: 'dairy', quantityKg: 0.5, expiryInDays: 3, addedDaysAgo: 8 }),
    makeItem({ name: 'Chicken breast', category: 'meat', quantityKg: 0.5, expiryInDays: 4, dateType: 'use-by', addedDaysAgo: 2 }),
    makeItem({ name: 'Tomatoes', category: 'vegetables', quantityKg: 0.6, expiryInDays: 6, addedDaysAgo: 6 }),
    makeItem({ name: 'Basmati rice', category: 'grains', quantityKg: 1, expiryInDays: 9, addedDaysAgo: 5 }),
  ];
}

// Re-export so callers don't need to import from emissions.js too.
export { DEFAULT_WEEKLY_WASTE_KG } from './emissions.js';
