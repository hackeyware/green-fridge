import { Flame, Leaf, Percent, PiggyBank, Salad, Target, Trash2, Wallet } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { CAR_CO2E_KG_PER_KM } from '../emissions';

function fmtKg(value) {
  return value.toFixed(1);
}

function fmtRange(range) {
  return `${fmtKg(range.low)} – ${fmtKg(range.high)} kg`;
}

// Illustrative comparison only — still a range, never a single precise figure.
function fmtDrivingRange(range) {
  const low = Math.round(range.low / CAR_CO2E_KG_PER_KM);
  const high = Math.round(range.high / CAR_CO2E_KG_PER_KM);
  return `≈ ${low}–${high} km driven`;
}

function SummaryCard({ icon, label, value, sub, valueClassName }) {
  return (
    <Card className="gap-0 rounded-lg py-4">
      <CardContent className="space-y-1 px-4">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {icon}
          {label}
        </div>
        <div className={`text-2xl font-semibold tracking-tight ${valueClassName ?? ''}`}>
          {value}
        </div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </CardContent>
    </Card>
  );
}

// Impact summary row. Rule: no environmental number is shown without its
// range or an explicit "estimate" label.
function ImpactSummary({ impact, baselineKg, weekly }) {
  const {
    savedKg,
    wastedKg,
    moneySaved,
    moneyWasted,
    co2eSaved,
    co2eWasted,
    wasteRate,
  } = impact;
  const { weeklyWastedKg, days, preliminary } = weekly;

  const hasData = savedKg + wastedKg > 0;
  const reduction = weeklyWastedKg === null ? null : baselineKg - weeklyWastedKg;

  return (
    <section aria-label="Impact dashboard" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <SummaryCard
        icon={<Salad className="size-4 text-primary" />}
        label="Food eaten"
        value={`${fmtKg(savedKg)} kg`}
        sub="saved from the bin"
      />
      <SummaryCard
        icon={<Trash2 className="size-4 text-primary" />}
        label="Food thrown away"
        value={`${fmtKg(wastedKg)} kg`}
        sub="logged as waste"
      />
      <SummaryCard
        icon={<Percent className="size-4 text-primary" />}
        label="Waste rate"
        value={wasteRate === null ? '—' : `${Math.round(wasteRate)}%`}
        sub="of resolved food thrown away"
      />
      <SummaryCard
        icon={<Leaf className="size-4 text-primary" />}
        label="CO₂e avoided"
        value={hasData ? fmtRange(co2eSaved) : '—'}
        sub={
          hasData
            ? `estimate, low–high · ${fmtDrivingRange(co2eSaved)} (illustrative)`
            : 'estimate, low–high range'
        }
      />
      <SummaryCard
        icon={<Flame className="size-4 text-primary" />}
        label="CO₂e still wasted"
        value={hasData ? fmtRange(co2eWasted) : '—'}
        sub="estimate, low–high range"
      />
      <SummaryCard
        icon={<PiggyBank className="size-4 text-primary" />}
        label="Money saved"
        value={hasData ? `$${moneySaved.toFixed(2)}` : '—'}
        sub="estimate, average prices"
      />
      <SummaryCard
        icon={<Wallet className="size-4 text-primary" />}
        label="Money lost"
        value={hasData ? `$${moneyWasted.toFixed(2)}` : '—'}
        sub="estimate, value of thrown-away food"
      />
      <SummaryCard
        icon={<Target className="size-4 text-primary" />}
        label="Est. reduction vs baseline"
        value={
          reduction === null
            ? '—'
            : `${reduction >= 0 ? '+' : ''}${reduction.toFixed(1)} kg/wk`
        }
        sub={
          reduction === null
            ? `log items to compare with your ${baselineKg.toFixed(1)} kg baseline`
            : `estimate · ${baselineKg.toFixed(1)} kg baseline − ${weeklyWastedKg.toFixed(1)} kg actual${
                preliminary ? ` · ${days} days, preliminary` : ''
              }`
        }
      />
    </section>
  );
}

export default ImpactSummary;
