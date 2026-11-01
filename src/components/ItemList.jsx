import { Refrigerator, Sparkles } from 'lucide-react';
import ItemRow from './ItemRow';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { daysLeft } from '../utils';

// Active items only, sorted by expiry date (soonest first).
function ItemList({ items, onResolve, onRemove, onSample, isSample }) {
  const active = items
    .filter((i) => i.status === 'active')
    .sort(
      (a, b) => a.expiryDate.localeCompare(b.expiryDate) || a.name.localeCompare(b.name),
    );

  const urgentCount = active.filter((i) => daysLeft(i.expiryDate) < 2).length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          Your fridge
          {isSample && items.length > 0 && <Badge variant="secondary">Sample data</Badge>}
        </CardTitle>
        {active.length > 0 && (
          <CardDescription>
            {active.length} item{active.length === 1 ? '' : 's'}
            {urgentCount > 0 && (
              <span className="font-medium text-red-600">
                {' · '}
                {urgentCount} expiring within 2 days
              </span>
            )}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          // Designed empty state: nothing tracked yet
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
              <Refrigerator className="size-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Your fridge is empty</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Add your first item to start tracking expiry dates, or explore with sample data.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onSample}>
              <Sparkles />
              Load sample data
            </Button>
          </div>
        ) : active.length === 0 ? (
          // Empty state: everything resolved
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="size-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Everything resolved — well done!</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Check your impact above, add more food, or browse the recipe ideas.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {active.map((item) => (
              <ItemRow key={item.id} item={item} onResolve={onResolve} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default ItemList;
