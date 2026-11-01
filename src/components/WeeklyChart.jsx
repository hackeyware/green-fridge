import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const DAY_MS = 86_400_000;
const WEEKS_SHOWN = 4;

// kg eaten vs thrown away, grouped per week over the last 4 weeks.
// Bars: green = eaten (primary), neutral gray = thrown away (red/orange/green
// are reserved for expiry urgency, so waste is not shown in red).
function buildWeeklySeries(items) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mondayOffset = (today.getDay() + 6) % 7; // Monday = start of week
  const currentMonday = today.getTime() - mondayOffset * DAY_MS;

  const weeks = [];
  for (let i = WEEKS_SHOWN - 1; i >= 0; i -= 1) {
    const start = new Date(currentMonday - i * 7 * DAY_MS);
    weeks.push({
      start: start.getTime(),
      label: start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      eaten: 0,
      thrown: 0,
    });
  }

  for (const item of items) {
    if (item.status === 'active' || !item.resolvedAt) continue;
    const resolved = new Date(item.resolvedAt).setHours(0, 0, 0, 0);
    const index = Math.floor((resolved - weeks[0].start) / (7 * DAY_MS));
    if (index < 0 || index >= weeks.length) continue;
    if (item.status === 'eaten') weeks[index].eaten += item.quantityKg;
    else weeks[index].thrown += item.quantityKg;
  }
  return weeks;
}

function WeeklyChart({ items }) {
  const series = buildWeeklySeries(items);
  const hasData = series.some((w) => w.eaten > 0 || w.thrown > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Food eaten vs thrown away — last 4 weeks</CardTitle>
        <CardDescription>
          {hasData
            ? 'Weekly totals from the items you resolved (kg).'
            : 'Resolve items (eaten or thrown away) to build your weekly history.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                width={44}
              />
              <Tooltip
                cursor={{ fill: 'var(--secondary)' }}
                contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 12 }}
                formatter={(value) => [`${value.toFixed(1)} kg`]}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                formatter={(value) => (value === 'eaten' ? 'Eaten' : 'Thrown away')}
              />
              <Bar dataKey="eaten" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              <Bar
                dataKey="thrown"
                fill="var(--muted-foreground)"
                fillOpacity={0.55}
                radius={[4, 4, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default WeeklyChart;
