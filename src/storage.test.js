import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleItems } from './storage.js';

test('demo data is a realistic two-week dataset with active and resolved items', () => {
  const items = sampleItems();
  const active = items.filter((item) => item.status === 'active');
  const resolved = items.filter((item) => item.status !== 'active');
  const wasted = items.filter((item) => item.status === 'wasted');

  assert.ok(items.length >= 10, 'enough items for a populated demo');
  assert.ok(active.length >= 4, 'active items to show in the fridge');
  assert.ok(resolved.length >= 4, 'resolved items for the dashboard and chart');
  assert.ok(wasted.length >= 1, 'at least one waste entry');

  for (const item of items) {
    assert.ok(item.id);
    assert.ok(item.name);
    assert.ok(item.category);
    assert.ok(item.quantityKg > 0);
    assert.match(item.expiryDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['best-before', 'use-by'].includes(item.dateType));
  }

  const resolvedTimes = resolved.map((item) => new Date(item.resolvedAt).getTime());
  assert.ok(Number.isFinite(Math.min(...resolvedTimes)));
  assert.ok(Number.isFinite(Math.max(...resolvedTimes)));
  const spanDays = (Math.max(...resolvedTimes) - Math.min(...resolvedTimes)) / 86_400_000;
  assert.ok(spanDays >= 7, 'resolved history spans more than a week');
});
