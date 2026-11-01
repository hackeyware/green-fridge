import { useState } from 'react';
import {
  CATEGORIES,
  DEFAULT_WEEKLY_WASTE_KG,
  SCENARIO_FOOD_CO2E,
  SOURCES,
} from '../emissions';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';

const ACTION_LABELS = {
  added: 'Added to fridge',
  eaten: 'Eaten',
  'thrown-away': 'Thrown away',
  removed: 'Removed from list',
  'baseline-updated': 'Baseline updated',
  'sample-loaded': 'Sample data loaded',
  'data-exported': 'Data exported (CSV)',
  reset: 'Data reset',
};

// Conservative default scenario: a mid-size pilot, half of the average
// household baseline actually avoided.
const SCENARIO_DEFAULTS = { users: 500, kgAvoidedPerUserWeek: 0.5 };

// Keep small scenarios readable without adding false precision.
function fmtTonnes(value) {
  if (value >= 10) return value.toFixed(0);
  if (value >= 1) return value.toFixed(1);
  return value.toFixed(2);
}

// Formula: users × kg avoided/user/week × 52 × kg CO₂e/kg food ÷ 1000 = t CO₂e/year
function ScaleScenario() {
  const [users, setUsers] = useState(String(SCENARIO_DEFAULTS.users));
  const [kgAvoided, setKgAvoided] = useState(String(SCENARIO_DEFAULTS.kgAvoidedPerUserWeek));

  const n = parseFloat(users);
  const kg = parseFloat(kgAvoided);
  const valid = Number.isFinite(n) && n > 0 && Number.isFinite(kg) && kg > 0;
  const tLow = valid ? (n * kg * 52 * SCENARIO_FOOD_CO2E.low) / 1000 : null;
  const tHigh = valid ? (n * kg * 52 * SCENARIO_FOOD_CO2E.high) / 1000 : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Scale scenario</CardTitle>
        <CardDescription>
          What if a community of users avoided this much food? Deliberately
          conservative defaults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="scenario-users">Number of users</Label>
            <Input
              id="scenario-users"
              type="number"
              min="1"
              value={users}
              onChange={(e) => setUsers(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="scenario-kg">kg avoided / user / week</Label>
            <Input
              id="scenario-kg"
              type="number"
              min="0"
              step="0.1"
              value={kgAvoided}
              onChange={(e) => setKgAvoided(e.target.value)}
            />
          </div>
        </div>

        <p className="rounded-md bg-secondary px-3 py-2 text-xs leading-relaxed text-secondary-foreground">
          users × kg avoided/user/week × 52 weeks × kg CO₂e per kg of food ÷ 1,000 = tonnes
          CO₂e per year
        </p>

        <div>
          {valid ? (
            <p className="text-2xl font-semibold tracking-tight">
              ≈ {fmtTonnes(tLow)} – {fmtTonnes(tHigh)} t CO₂e per year
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Enter positive numbers to see the result.</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Estimate. Assumes {SCENARIO_FOOD_CO2E.low}–{SCENARIO_FOOD_CO2E.high} kg CO₂e per kg of
            food avoided — the 10th–90th percentile range of a plant-heavy basket of 508
            AGRIBALYSE v3.2 products (vegetables, potatoes, fruit, legumes, grains, bread — see
            src/emissions.js). Real results depend heavily on what food is actually saved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionLog({ log }) {
  const [showAll, setShowAll] = useState(false);
  const entries = showAll ? log : log.slice(0, 8);

  return (
    <Section title="Action log">
      <p>
        Every action in the app is logged locally with a timestamp (kept for the last 200
        events). This makes the demo auditable and supports a small pilot.
      </p>
      {log.length === 0 ? (
        <p>No actions recorded yet.</p>
      ) : (
        <>
          <ul className="space-y-1 text-xs">
            {entries.map((entry, index) => (
              <li
                key={`${entry.at}-${index}`}
                className="flex flex-wrap justify-between gap-2 border-b pb-1 last:border-0"
              >
                <span>
                  <strong className="font-medium text-foreground">
                    {ACTION_LABELS[entry.action] ?? entry.action}
                  </strong>
                  {entry.name ? ` — ${entry.name}` : ''}
                </span>
                <span>{new Date(entry.at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {log.length > 8 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll((prev) => !prev)}>
              {showAll ? 'Show fewer actions' : `Show all ${log.length} actions`}
            </Button>
          )}
        </>
      )}
    </Section>
  );
}

function Section({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

function MethodologyPage({ log }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Section title="How the impact is calculated">
        <p>
          Every item is resolved as either <strong className="text-foreground">eaten</strong>{' '}
          (saved) or <strong className="text-foreground">thrown away</strong> (wasted). For each
          item:
        </p>
        <p className="rounded-md bg-secondary px-3 py-2 font-mono text-xs text-secondary-foreground">
          CO₂e of item = quantity (kg) × category factor (kg CO₂e per kg)
          <br />
          money value = quantity (kg) × average price per kg
        </p>
        <p>
          Every category has a <strong className="text-foreground">low and high factor</strong>{' '}
          instead of one number, so all CO₂e figures on the dashboard are shown as ranges. The
          factors come from the AGRIBALYSE® v3.2 database (ADEME, kg CO₂ eq per kg of product as
          consumed — farm to consumer). For each category we pool the relevant AGRIBALYSE
          sub-groups and report the 10th and 90th percentile of all products in them: 10% of
          products sit below the low value and 10% above the high one. This is documented
          product-to-product variation, not a statistical confidence interval. The exact
          sub-groups, product counts and full min–max ranges are documented in{' '}
          <code className="text-foreground">src/emissions.js</code>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-1.5 pr-3 font-medium">Category</th>
                <th className="py-1.5 pr-3 font-medium">kg CO₂e/kg (low–high)</th>
                <th className="py-1.5 font-medium">$ / kg (est.)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <tr key={key} className="border-b last:border-0">
                  <td className="py-1.5 pr-3">{cat.label}</td>
                  <td className="py-1.5 pr-3">
                    {cat.co2eLowPerKg} – {cat.co2eHighPerKg}
                  </td>
                  <td className="py-1.5">{cat.pricePerKg.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Baseline logic">
        <p className="rounded-md bg-secondary px-3 py-2 font-mono text-xs text-secondary-foreground">
          estimated reduction vs baseline = usual weekly waste (baseline) − actual weekly waste
        </p>
        <p>
          The baseline defaults to{' '}
          <strong className="text-foreground">
            {DEFAULT_WEEKLY_WASTE_KG} kg per person per week
          </strong>
          , from the UNEP Food Waste Index Report 2024 (79 kg of household food waste per capita
          per year in 2022 ÷ 52). Users can adjust it to their household on the dashboard.
        </p>
        <p>
          &quot;Actual weekly waste&quot; divides the kg you logged as thrown away by the logged
          period, with a minimum denominator of one week. Short histories are damped rather
          than extrapolated, which can make the reduction look optimistic; anything under four
          weeks is labelled <em>preliminary</em>. Treat this as a rough estimate, not a measured
          saving.
        </p>
      </Section>

      <Section title="Pilot data export">
        <p>
          The <strong className="text-foreground">Export CSV</strong> button downloads every
          item with its category, quantity, date type, status, resolved timestamp and the
          item&apos;s low–high CO₂e estimate. The file also repeats your baseline, the current
          weekly waste estimate, the number of logged days and the export timestamp, so a
          tester can send one file back without extra context.
        </p>
        <p>
          This is a convenience export for a small real-world pilot, not a validated research
          instrument. We do not yet have a large user study, and the exported figures inherit
          every limitation below.
        </p>
      </Section>

      <ScaleScenario />

      <Section title="Limitations">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Emission factors are based on French data (AGRIBALYSE) and prices on US averages (BLS); values are indicative and should be adapted to the user&apos;s country.</li>
          <li>All quantities are manually entered and estimated — nobody weighs their leftovers.</li>
          <li>Category factors pool many products: AGRIBALYSE values range from ~1.4 (some processed meats) to ~35 kg CO₂e/kg (beef) within the meat category alone. The low–high percentile ranges make this explicit rather than solving it.</li>
          <li>AGRIBALYSE models French production and consumption; factors may differ for other countries and diets.</li>
          <li>The fish price is a single-item BLS observation (frozen perch fillets) because BLS discontinued most fish price series; it will not represent shellfish or premium fish.</li>
          <li>The &quot;Other&quot; price is the equal-weight mean of the six category prices — a calculation, not an observed price.</li>
          <li>Waste is assumed to rot aerobically; landfill methane would make the waste figures worse, not better.</li>
          <li>Baseline comparisons only become meaningful after several weeks of consistent logging.</li>
          <li>There is no large user study yet — the scale scenario is a scenario, not a measurement.</li>
          <li>Data lives in one browser only (localStorage); there is no cloud backup.</li>
        </ul>
      </Section>

      <ActionLog log={log} />

      <Section title="Sources">
        <ul className="list-disc space-y-1 pl-5">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm text-foreground underline underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export default MethodologyPage;
