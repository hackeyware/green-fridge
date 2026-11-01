// Impact factors per food category. ALL VALUES ARE ESTIMATES.
//
// CO₂e factors: AGRIBALYSE® v3.2 (ADEME), "Synthèse" table, "Changement
// climatique" indicator — kg CO₂ eq per kg of product as consumed
// (farm → processing → packaging → transport → consumer).
//   Dataset: https://data.ademe.fr/datasets/agribalyse-synthese (version 3.2)
//   Persistent DOI: https://doi.org/10.57745/XTENSJ
//
// METHOD (reproducible): the Synthèse CSV (2,454 products) was downloaded from
// data.ademe.fr on 2026-10-31. For each app category the relevant
// "Sous-groupe d'aliment" sub-groups are pooled, the values sorted, and the
// 10th/90th percentile computed with linear interpolation. Low = P10, high =
// P90. This is documented product-to-product variation within the category
// (10% of products sit below the low value, 10% above the high), NOT a
// statistical confidence interval. The full min–max of the pooled products is
// given in each comment. n = number of products in the pool.
//
// Prices: U.S. Bureau of Labor Statistics, "Average Retail Food and Energy
// Prices, U.S. city average", September 2026, converted to USD per kg
// (1 lb = 0.45359237 kg).
//   https://www.bls.gov/regions/mid-atlantic/data/averageretailfoodandenergyprices_usandmidwest_table.htm
// BLS notes these are weighted averages of retail prices (CPI sample),
// excluding sales tax, for narrowly defined homogeneous items.

export const CATEGORIES = {
  meat: {
    label: 'Meat',
    // AGRIBALYSE v3.2 sub-groups "viandes crues" + "charcuteries" (n = 280):
    // P10 = 3.38, P90 = 27.45 kg CO₂ eq/kg. Low end is chicken/pork cuts, high
    // end is beef. Full range in the data: 1.39–34.89.
    co2eLowPerKg: 3.38,
    co2eHighPerKg: 27.45,
    // BLS Sep 2026 basket ($/lb): whole chicken 2.064, boneless chicken breast
    // 4.203, ground beef 6.792, boneless pork chops 4.550, sliced bacon 6.756.
    // Mean 4.873 $/lb ÷ 0.45359237 = 10.74 $/kg.
    pricePerKg: 10.74,
  },
  fish: {
    label: 'Fish & seafood',
    // AGRIBALYSE v3.2 sub-groups "poissons crus", "poissons cuits", "mollusques
    // et crustacés crus/cuits" and "produits à base de poissons et produits de
    // la mer" (n = 222): P10 = 2.77, P90 = 14.97 kg CO₂ eq/kg. Full range
    // 1.86–41.82 (shellfish and processed products reach the top).
    co2eLowPerKg: 2.77,
    co2eHighPerKg: 14.97,
    // BLS no longer publishes most fish average-price series; the last
    // remaining fish item is "Frozen perch fillets, per lb" (series
    // APU0000703511): $9.838/lb in September 2026 (queried via the BLS public
    // API) → 21.69 $/kg. Single-item basket: frozen white-fish fillets, so it
    // will not represent shellfish or premium fish. Listed as a limitation in
    // the README.
    pricePerKg: 21.69,
  },
  dairy: {
    label: 'Dairy & eggs',
    // AGRIBALYSE v3.2 sub-groups "laits", "fromages", "produits laitiers frais
    // et assimilés", "crèmes et spécialités à base de crème" and "œufs"
    // (n = 244): P10 = 1.60, P90 = 6.62 kg CO₂ eq/kg. Low end is milk, high
    // end is hard cheese. Full range 0.89–14.08.
    co2eLowPerKg: 1.6,
    co2eHighPerKg: 6.62,
    // BLS Sep 2026 basket: whole milk 4.106 $/gal (÷ 3.78541 L × 1.03 kg/L =
    // 1.12 $/kg), natural cheddar 6.133 $/lb = 13.52 $/kg, grade A large eggs
    // 2.272 $/dozen (0.6 kg edible) = 3.79 $/kg. Mean 6.14 $/kg.
    pricePerKg: 6.14,
  },
  vegetables: {
    label: 'Vegetables',
    // AGRIBALYSE v3.2 sub-groups "légumes" + "pommes de terre et autres
    // tubercules" (n = 242): P10 = 0.60, P90 = 2.50 kg CO₂ eq/kg. Full range
    // 0.37–11.15 (air-freighted/out-of-season produce at the top).
    co2eLowPerKg: 0.6,
    co2eHighPerKg: 2.5,
    // BLS Sep 2026 basket ($/lb): white potatoes 0.989, iceberg lettuce 1.636,
    // field-grown tomatoes 1.992. Mean 1.539 $/lb = 3.39 $/kg.
    pricePerKg: 3.39,
  },
  fruit: {
    label: 'Fruit',
    // AGRIBALYSE v3.2 sub-group "fruits" (n = 98): P10 = 0.54, P90 = 1.90 kg
    // CO₂ eq/kg. Full range 0.49–11.80 (air-freighted fruit at the top; the
    // app range deliberately does not cover that tail).
    co2eLowPerKg: 0.54,
    co2eHighPerKg: 1.9,
    // BLS Sep 2026 basket ($/lb): bananas 0.656, navel oranges 1.723, lemons
    // 2.128, grapefruit 1.624. Mean 1.533 $/lb = 3.38 $/kg.
    pricePerKg: 3.38,
  },
  grains: {
    label: 'Grains, rice & pasta',
    // AGRIBALYSE v3.2 sub-groups "pâtes, riz et céréales" + "pains et
    // viennoiseries" (n = 132): P10 = 0.74, P90 = 2.50 kg CO₂ eq/kg. Full
    // range 0.42–5.42.
    co2eLowPerKg: 0.74,
    co2eHighPerKg: 2.5,
    // BLS Sep 2026 basket ($/lb): white rice 1.118, spaghetti/macaroni 1.375,
    // white bread 1.830, all-purpose flour 0.545. Mean 1.217 $/lb = 2.68 $/kg.
    pricePerKg: 2.68,
  },
  other: {
    label: 'Other',
    // AGRIBALYSE v3.2 sub-group "entrées et plats composés" minus drinks and
    // infant food (plats composés, plats végétariens, pizzas/tartes/crêpes
    // salées, sandwichs, soupes, salades composées, feuilletées; n = 308):
    // P10 = 1.14, P90 = 9.63 kg CO₂ eq/kg. Full range 0.09–24.26; the wide
    // span is genuine variation in mixed dishes (vegetable soups vs
    // meat-heavy quiches).
    co2eLowPerKg: 1.14,
    co2eHighPerKg: 9.63,
    // No single BLS item covers prepared/mixed food. Derived estimate: the
    // equal-weight mean of the six category prices above = 8.00 $/kg. This is
    // a calculation, not an observed retail price; see README limitations.
    pricePerKg: 8.0,
  },
};

// Comparison factor for the dashboard "km of driving" equivalent. Used only to
// turn a CO₂e range into an illustrative distance range.
// Source: UK DESNZ, "Greenhouse gas reporting: conversion factors 2024",
// average car (unknown fuel), real-world factor ≈ 0.17 kg CO₂e/km (2025
// edition also available).
// https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024
// Cross-check: EEA average new EU passenger car was 106.7 g CO₂/km on the
// test cycle in 2024; 0.17 reflects real-world driving and an older fleet.
// https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger
export const CAR_CO2E_KG_PER_KM = 0.17;

// Default weekly household food-waste baseline.
// Source: UNEP Food Waste Index Report 2024 (published March 2024), global
// average household food waste = 79 kg per capita per year (2022 data).
// 79 / 52 = 1.52 → 1.5 kg per person per week.
// https://www.unep.org/resources/publication/food-waste-index-report-2024
export const DEFAULT_WEEKLY_WASTE_KG = 1.5;

// Scale-scenario assumption: CO₂e per kg of AVOIDED food. Derived from the
// same AGRIBALYSE v3.2 dataset for a plant-heavy basket (légumes, pommes de
// terre/tubercules, fruits, légumineuses, pâtes-riz-céréales, pains; n = 508):
// P10 = 0.58, P90 = 2.29 kg CO₂ eq/kg. This is a scenario input, not a
// measurement.
export const SCENARIO_FOOD_CO2E = { low: 0.58, high: 2.29 };

export const SOURCES = [
  {
    label:
      'AGRIBALYSE® v3.2 (ADEME) — food lifecycle inventory, kg CO₂ eq per kg as consumed (Synthèse table)',
    url: 'https://data.ademe.fr/datasets/agribalyse-synthese',
  },
  {
    label: 'AGRIBALYSE v3.2 DOI — persistent dataset identifier',
    url: 'https://doi.org/10.57745/XTENSJ',
  },
  {
    label:
      'U.S. Bureau of Labor Statistics — Average Retail Food and Energy Prices, U.S. city average, September 2026',
    url: 'https://www.bls.gov/regions/mid-atlantic/data/averageretailfoodandenergyprices_usandmidwest_table.htm',
  },
  {
    label: 'BLS API series APU0000703511 — frozen perch fillets, $/lb (fish price, Sep 2026)',
    url: 'https://api.bls.gov/publicAPI/v1/timeseries/data/APU0000703511',
  },
  {
    label:
      'UNEP Food Waste Index Report 2024 — 79 kg household food waste per capita per year (2022 data)',
    url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
  },
  {
    label: 'FAO — Food loss and food waste data (the "one third" framing)',
    url: 'https://www.fao.org/food-loss-and-food-waste/flw-data',
  },
  {
    label:
      'UK DESNZ — Greenhouse gas reporting: conversion factors 2024 (average car, driving comparison)',
    url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024',
  },
  {
    label:
      'European Environment Agency — CO₂ emissions performance of new passenger cars (cross-check)',
    url: 'https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger',
  },
];

const FALLBACK = { co2eLowPerKg: 1, co2eHighPerKg: 5, pricePerKg: 3.5 };

// CO₂e of one item as an honest low–high range (kg).
export function co2eOfItem(item) {
  const cat = CATEGORIES[item.category] ?? FALLBACK;
  return {
    low: item.quantityKg * cat.co2eLowPerKg,
    high: item.quantityKg * cat.co2eHighPerKg,
  };
}

export function priceOfItem(item) {
  return item.quantityKg * (CATEGORIES[item.category] ?? FALLBACK).pricePerKg;
}

// Aggregate impact of every resolved item ("eaten" = saved, "wasted" = thrown away).
export function computeImpact(items) {
  let savedKg = 0;
  let wastedKg = 0;
  let moneySaved = 0;
  let moneyWasted = 0;
  const co2eSaved = { low: 0, high: 0 };
  const co2eWasted = { low: 0, high: 0 };

  for (const item of items) {
    if (item.status === 'active') continue;
    const co2e = co2eOfItem(item);
    if (item.status === 'eaten') {
      savedKg += item.quantityKg;
      moneySaved += priceOfItem(item);
      co2eSaved.low += co2e.low;
      co2eSaved.high += co2e.high;
    } else if (item.status === 'wasted') {
      wastedKg += item.quantityKg;
      moneyWasted += priceOfItem(item);
      co2eWasted.low += co2e.low;
      co2eWasted.high += co2e.high;
    }
  }

  const resolvedKg = savedKg + wastedKg;
  return {
    savedKg,
    wastedKg,
    moneySaved,
    moneyWasted,
    co2eSaved,
    co2eWasted,
    // % of resolved food that was thrown away
    wasteRate: resolvedKg > 0 ? (wastedKg / resolvedKg) * 100 : null,
  };
}

// Actual weekly waste, normalised over the period the user actively logged.
// The period runs from the first to the last resolved item — not to "now" —
// so a long gap in logging does not artificially lower the weekly average.
// Short histories use a one-week denominator instead of extrapolating a few
// days. This damping can make the estimated reduction optimistic, so the UI
// marks anything under four weeks as preliminary.
export function computeWeeklyWaste(items) {
  const resolved = items
    .filter((i) => i.status !== 'active' && i.resolvedAt)
    .map((item) => ({ item, at: new Date(item.resolvedAt).getTime() }))
    .filter(({ at }) => Number.isFinite(at));

  if (resolved.length === 0) {
    return { weeks: null, days: null, weeklyWastedKg: null, preliminary: true };
  }

  const first = Math.min(...resolved.map(({ at }) => at));
  const last = Math.max(...resolved.map(({ at }) => at));
  const DAY_MS = 86_400_000;
  const days = Math.max(7, (last - first) / DAY_MS);
  const weeks = days / 7;
  const wastedKg = resolved
    .filter(({ item }) => item.status === 'wasted')
    .reduce((sum, { item }) => sum + item.quantityKg, 0);

  return {
    weeks,
    days: Math.round(days),
    weeklyWastedKg: wastedKg / weeks,
    // Fewer than four weeks of logs is noisy; the UI labels it accordingly.
    preliminary: days < 28,
  };
}
