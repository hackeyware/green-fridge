import { CATEGORIES, co2eOfItem, priceOfItem } from './emissions.js';

function csvCell(value) {
  const text = String(value ?? '');
  // Quote cells containing commas, quotes or newlines (RFC 4180)
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

// Build a CSV of all items with their resolved impact figures, plus the
// baseline/weekly settings so testers can analyse a real-world pilot.
// CO₂e columns are low/high estimates, never a single measured value.
export function buildItemsCsv({ items, settings, weekly }) {
  const exportedAt = new Date().toISOString();
  const baselineKg = settings?.weeklyWasteKg ?? '';
  const weeklyWastedKg =
    weekly?.weeklyWastedKg == null ? '' : weekly.weeklyWastedKg.toFixed(2);
  const periodDays = weekly?.days ?? '';
  const dataSource = settings?.isSample ? 'sample' : 'user';

  const header = [
    'name',
    'category',
    'quantity_kg',
    'expiry_date',
    'date_type',
    'status',
    'added_at',
    'resolved_at',
    'co2e_low_kg',
    'co2e_high_kg',
    'price_usd',
    'weekly_baseline_kg',
    'weekly_wasted_kg',
    'waste_period_days',
    'exported_at',
    'data_source',
  ].join(',');

  const rows = items.map((item) => {
    const co2e = co2eOfItem(item);
    return [
      item.name,
      CATEGORIES[item.category]?.label ?? item.category,
      item.quantityKg,
      item.expiryDate,
      item.dateType === 'use-by' ? 'use-by' : 'best-before',
      item.status,
      item.addedAt ?? '',
      item.resolvedAt ?? '',
      co2e.low.toFixed(2),
      co2e.high.toFixed(2),
      priceOfItem(item).toFixed(2),
      baselineKg,
      weeklyWastedKg,
      periodDays,
      exportedAt,
      dataSource,
    ]
      .map(csvCell)
      .join(',');
  });

  // BOM so Excel opens UTF-8 correctly
  return `\uFEFF${[header, ...rows].join('\n')}`;
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
