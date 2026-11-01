import test from 'node:test';
import assert from 'node:assert/strict';
import { buildItemsCsv } from './exportCsv.js';

function makeItem(overrides = {}) {
  return {
    id: 'csv-1',
    name: 'Spinach',
    category: 'vegetables',
    quantityKg: 1,
    expiryDate: '2026-01-01',
    dateType: 'best-before',
    status: 'eaten',
    addedAt: '2025-12-20T00:00:00.000Z',
    resolvedAt: '2025-12-28T00:00:00.000Z',
    ...overrides,
  };
}

test('CSV includes item-level estimates and baseline context', () => {
  const csv = buildItemsCsv({
    items: [makeItem()],
    settings: { weeklyWasteKg: 1.4 },
    weekly: { weeklyWastedKg: 0.7, days: 10 },
  });
  const [header, row] = csv.replace(/^\uFEFF/, '').split('\n');

  assert.match(header, /^name,category,quantity_kg/);
  assert.match(header, /co2e_low_kg,co2e_high_kg,price_usd/);
  assert.match(header, /weekly_baseline_kg,weekly_wasted_kg,waste_period_days,exported_at/);
  assert.match(row, /^Spinach,Vegetables,1,2026-01-01,best-before,eaten,/);
  assert.match(row, /0\.60,2\.50,3\.39,1\.4,0\.70,10,/);
});

test('CSV quotes names containing commas or quotes', () => {
  const csv = buildItemsCsv({
    items: [makeItem({ name: 'Rice, "day-old"' })],
    settings: { weeklyWasteKg: 1.4 },
    weekly: { weeklyWastedKg: null, days: null },
  });
  assert.match(csv, /"Rice, ""day-old"""/);
});
