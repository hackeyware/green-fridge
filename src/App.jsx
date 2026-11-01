import { useEffect, useState } from 'react';
import { Download, Info, Leaf, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import AddItemForm from './components/AddItemForm';
import BaselineCard from './components/BaselineCard';
import ImpactSummary from './components/ImpactDashboard';
import ItemList from './components/ItemList';
import MethodologyPage from './components/MethodologyPage';
import RecipeIdeas from './components/RecipeIdeas';
import WeeklyChart from './components/WeeklyChart';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { cn } from './lib/utils';
import { computeImpact, computeWeeklyWaste, co2eOfItem } from './emissions';
import {
  addLogEntry,
  clearAllData,
  loadItems,
  loadLog,
  loadSettings,
  sampleItems,
  saveItems,
  saveSettings,
} from './storage';
import { buildItemsCsv, downloadCsv } from './exportCsv';

// App state is the single source of truth; every change is mirrored to localStorage.
function App() {
  const [tab, setTab] = useState('dashboard'); // 'dashboard' | 'methodology'
  const [items, setItems] = useState(loadItems);
  const [settings, setSettings] = useState(loadSettings);
  const [log, setLog] = useState(loadLog);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
    setLog(addLogEntry({ action: 'added', name: item.name }));
    toast.success(`"${item.name}" added to your fridge.`);
  };

  const resolveItem = (id, status) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status, resolvedAt: new Date().toISOString() } : i,
      ),
    );
    setLog(addLogEntry({ action: status === 'eaten' ? 'eaten' : 'thrown-away', name: item.name }));
    const co2e = co2eOfItem(item);
    const range = `${co2e.low.toFixed(1)}–${co2e.high.toFixed(1)} kg CO₂e (estimate)`;
    if (status === 'eaten') {
      toast.success(`"${item.name}" eaten — ${item.quantityKg} kg saved, ~${range} avoided.`);
    } else {
      toast.warning(`"${item.name}" logged as waste — ~${range} lost.`);
    }
  };

  const removeItem = (id) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      setLog(addLogEntry({ action: 'removed', name: item.name }));
      toast(`"${item.name}" removed from the list.`);
    }
  };

  // Sample data is clearly flagged everywhere so a screenshot or a live demo
  // can never be mistaken for the visitor's own tracked food.
  const loadSample = () => {
    setItems(sampleItems());
    setSettings((prev) => {
      const next = { ...prev, isSample: true };
      saveSettings(next);
      return next;
    });
    setLog(addLogEntry({ action: 'sample-loaded', name: 'Two-week sample dataset' }));
    toast.info('Sample data loaded — two items are about to expire. Try the recipe ideas!');
  };

  const startFresh = () => {
    clearAllData();
    const next = { weeklyWasteKg: loadSettings().weeklyWasteKg, isSample: false };
    saveSettings(next);
    setItems([]);
    setSettings(next);
    setLog([]);
    toast.success('Sample data cleared — your fridge is ready for real items.');
  };

  const resetData = () => {
    if (window.confirm('Reset all data? This deletes items, the baseline and the action log.')) {
      clearAllData();
      setItems([]);
      setSettings(loadSettings());
      setLog([]);
      toast('All data reset.');
    }
  };

  const updateBaseline = (kg) => {
    setSettings((prev) => ({ ...prev, weeklyWasteKg: kg }));
    saveSettings({ ...settings, weeklyWasteKg: kg });
    setLog(addLogEntry({ action: 'baseline-updated', name: `${kg} kg/week` }));
    toast.success(`Baseline updated to ${kg} kg per week.`);
  };

  const weekly = computeWeeklyWaste(items);

  const exportCsv = () => {
    if (items.length === 0) {
      toast('Nothing to export yet — add or load some items first.');
      return;
    }
    downloadCsv(
      'green-fridge-data.csv',
      buildItemsCsv({ items, settings, weekly }),
    );
    setLog(addLogEntry({ action: 'data-exported', name: `${items.length} items` }));
    toast.success('CSV exported — check your downloads.');
  };

  const impact = computeImpact(items);

  return (
    <div className="min-h-svh">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">GreenFridge</h1>
              <p className="text-sm text-muted-foreground">Eat it before it expires.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportCsv}>
              <Download />
              Export CSV
            </Button>
            <Button variant="outline" onClick={loadSample}>
              <Sparkles />
              Load sample data
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={resetData}
            >
              <RotateCcw />
              Reset data
            </Button>
          </div>
        </header>

        {/* Dashboard / Methodology tabs */}
        <nav aria-label="Main navigation" className="mt-6">
          <div className="inline-flex gap-1 rounded-lg bg-secondary p-1">
            {[
              ['dashboard', 'Dashboard'],
              ['methodology', 'Methodology'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={tab === key}
                onClick={() => setTab(key)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring',
                  tab === key
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {settings.isSample && (
          <div
            role="status"
            className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed bg-secondary px-4 py-3 text-sm text-secondary-foreground sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-start gap-2">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                <Badge variant="outline" className="mr-2 align-middle">
                  Sample data
                </Badge>
                These items are examples for the demo. Impacts shown are illustrative, not your
                own — add your food or start fresh to track real savings.
              </span>
            </p>
            <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={startFresh}>
              Start fresh
            </Button>
          </div>
        )}

        {tab === 'dashboard' ? (
          <main className="mt-6 space-y-6">
            <ImpactSummary
              impact={impact}
              baselineKg={settings.weeklyWasteKg}
              weekly={weekly}
            />

            <div className="grid gap-6 lg:grid-cols-5">
              <section aria-label="Fridge items" className="lg:col-span-3">
                <ItemList items={items} onResolve={resolveItem} onRemove={removeItem} onSample={loadSample} isSample={settings.isSample} />
              </section>
              <div className="space-y-6 lg:col-span-2">
                <section aria-label="Add food">
                  <AddItemForm onAdd={addItem} />
                </section>
                <section aria-label="Weekly baseline">
                  <BaselineCard
                    key={settings.weeklyWasteKg}
                    settings={settings}
                    weekly={weekly}
                    onSave={updateBaseline}
                  />
                </section>
                <section aria-label="Recipe ideas">
                  <RecipeIdeas items={items} />
                </section>
              </div>
            </div>

            <WeeklyChart items={items} />
          </main>
        ) : (
          <main className="mt-6">
            <MethodologyPage log={log} />
          </main>
        )}

        <footer className="mt-10 border-t pt-4 text-xs leading-relaxed text-muted-foreground">
          <p>
            All impact figures are estimates shown as low–high ranges: quantity × published
            lifecycle emission factors (ADEME AGRIBALYSE v3.2, field to consumer) and average
            U.S. retail prices (BLS, September 2026). See the Methodology page for formulas,
            baseline logic (UNEP Food Waste Index 2024) and limitations. Sample data is labelled
            as such. Data stays in your browser (localStorage) — no backend, no accounts.
          </p>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
