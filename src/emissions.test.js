// Focused tests for the impact maths — the part judges and testers rely on.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORIES,
  co2eOfItem,
  computeImpact,
  computeWeeklyWaste,
} from './emissions.js';

let nextId = 0;

function makeItem(overrides = {}) {
  nextId += 1;
  return {
    id: `test-${nextId}`,
    name: 'Test item',
    category: 'vegetables',
    quantityKg: 1,
    expiryDate: '2026-01-01',
    dateType: 'best-before',
    status: 'active',
    addedAt: '2025-12-01T00:00:00.000Z',
    ...overrides,
  };
}

test('every category exposes a valid low–high range and a positive price', () => {
  for (const [key, category] of Object.entries(CATEGORIES)) {
    assert.ok(category.label, `${key} has a label`);
    assert.ok(category.co2eLowPerKg >= 0, `${key} low factor is non-negative`);
    assert.ok(
      category.co2eHighPerKg >= category.co2eLowPerKg,
      `${key} high factor is at least the low factor`,
    );
    assert.ok(category.pricePerKg > 0, `${key} price is positive`);
  }
});

test('co2eOfItem multiplies quantity by both range bounds', () => {
  const veg = co2eOfItem(makeItem({ category: 'vegetables', quantityKg: 2 }));
  assert.equal(veg.low, 1.2);
  assert.equal(veg.high, 5.0);
});

test('computeImpact separates eaten food from waste', () => {
  const impact = computeImpact([
    makeItem({ category: 'vegetables', quantityKg: 1, status: 'eaten' }),
    makeItem({ category: 'meat', quantityKg: 2, status: 'wasted' }),
    makeItem({ category: 'fruit', quantityKg: 5, status: 'active' }),
  ]);

  assert.equal(impact.savedKg, 1);
  assert.equal(impact.wastedKg, 2);
  assert.equal(impact.moneySaved, 3.39);
  assert.equal(impact.moneyWasted, 21.48);
  assert.equal(impact.co2eSaved.low, 0.6);
  assert.equal(impact.co2eSaved.high, 2.5);
  assert.equal(impact.co2eWasted.low, 6.76);
  assert.equal(impact.co2eWasted.high, 54.9);
  assert.ok(Math.abs(impact.wasteRate - 66.666) < 0.01);
});

test('computeImpact returns a null waste rate when nothing is resolved', () => {
  const impact = computeImpact([makeItem({ status: 'active' })]);
  assert.equal(impact.wasteRate, null);
  assert.equal(impact.savedKg, 0);
  assert.equal(impact.wastedKg, 0);
});

test('computeWeeklyWaste normalises waste over the logged period', () => {
  const weekly = computeWeeklyWaste([
    makeItem({
      status: 'wasted',
      quantityKg: 1,
      resolvedAt: '2026-01-01T12:00:00.000Z',
    }),
    makeItem({
      status: 'wasted',
      quantityKg: 1,
      resolvedAt: '2026-01-11T12:00:00.000Z',
    }),
  ]);

  assert.equal(weekly.days, 10);
  assert.equal(weekly.preliminary, true);
  assert.ok(Math.abs(weekly.weeklyWastedKg - 1.4) < 0.0001);
});

test('computeWeeklyWaste uses a minimum period of one week', () => {
  const weekly = computeWeeklyWaste([
    makeItem({ status: 'wasted', quantityKg: 0.8, resolvedAt: '2026-01-01T12:00:00.000Z' }),
  ]);

  assert.equal(weekly.days, 7);
  assert.equal(weekly.weeks, 1);
  assert.equal(weekly.weeklyWastedKg, 0.8);
});

test('computeWeeklyWaste returns nulls with no resolved history', () => {
  const weekly = computeWeeklyWaste([makeItem({ status: 'active' })]);
  assert.equal(weekly.weeklyWastedKg, null);
  assert.equal(weekly.days, null);
});
