// Lucide icons per food category — the single place mapping categories to visuals.
import { Apple, Beef, Carrot, Fish, Milk, Package, Wheat } from 'lucide-react';

export const CATEGORY_ICONS = {
  meat: Beef,
  fish: Fish,
  dairy: Milk,
  vegetables: Carrot,
  fruit: Apple,
  grains: Wheat,
  other: Package,
};

// Expiry urgency → color tokens. Red/orange/green are used ONLY here.
export const URGENCY_STYLES = {
  urgent: {
    badge: 'border-transparent bg-red-100 text-red-700',
    row: 'border-l-red-500',
  },
  soon: {
    badge: 'border-transparent bg-orange-100 text-orange-700',
    row: 'border-l-orange-400',
  },
  ok: {
    badge: 'border-transparent bg-emerald-100 text-emerald-700',
    row: 'border-l-emerald-500',
  },
};
