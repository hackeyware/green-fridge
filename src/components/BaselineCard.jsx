import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { DEFAULT_WEEKLY_WASTE_KG } from '../emissions';

// Baseline setting: the user's estimate of how much food they usually
// throw away per week. Default is the cited household average (UNEP
// Food Waste Index Report 2024: 79 kg/capita/year ≈ 1.5 kg/week).
function BaselineCard({ settings, weekly, onSave }) {
  const [value, setValue] = useState(String(settings.weeklyWasteKg));
  const [error, setError] = useState('');

  const { weeklyWastedKg, days, preliminary } = weekly;
  const reduction =
    weeklyWastedKg === null ? null : settings.weeklyWasteKg - weeklyWastedKg;

  const commit = () => {
    const kg = parseFloat(value);
    if (!Number.isFinite(kg) || kg < 0 || kg > 50) {
      setError('Enter a weekly amount in kg between 0 and 50.');
      return;
    }
    setError('');
    setValue(String(kg));
    onSave(kg);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weekly baseline</CardTitle>
        <CardDescription>
          How much food do you usually throw away per week? Used for the
          &quot;reduction vs baseline&quot; estimate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="baseline-input">Usual food waste (kg/week)</Label>
          <Input
            id="baseline-input"
            type="number"
            inputMode="decimal"
            min="0"
            max="50"
            step="0.1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === 'Enter' && commit()}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-1.5 rounded-md border bg-secondary/50 p-3 text-xs">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground">Usual waste (baseline)</span>
            <span className="font-medium">{settings.weeklyWasteKg.toFixed(1)} kg/wk</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-muted-foreground">Actual logged waste</span>
            <span className="font-medium">
              {weeklyWastedKg === null ? '—' : `${weeklyWastedKg.toFixed(1)} kg/wk`}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-t pt-1.5">
            <span className="text-muted-foreground">Estimated reduction</span>
            <span className="font-semibold">
              {reduction === null
                ? '—'
                : `${reduction >= 0 ? '+' : ''}${reduction.toFixed(1)} kg/wk`}
            </span>
          </div>
          <p className="pt-1 leading-relaxed text-muted-foreground">
            {weeklyWastedKg === null
              ? 'Resolve at least one item to compare with your baseline.'
              : `Based on ${days} days of logs${preliminary ? ' — preliminary' : ''}. Estimate, not a measurement.`}
          </p>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Default {DEFAULT_WEEKLY_WASTE_KG} kg — the average household food waste per person
          per week (UNEP Food Waste Index Report 2024: 79 kg/capita/year ÷ 52). Adjust it to
          your household. All baseline comparisons are estimates.
        </p>
      </CardContent>
    </Card>
  );
}

export default BaselineCard;
