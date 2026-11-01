import { Check, Package, Trash2, X } from 'lucide-react';
import { CATEGORIES } from '../emissions';
import { daysLeft, expiryLabel, formatDate, urgencyOf } from '../utils';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CATEGORY_ICONS, URGENCY_STYLES } from './categoryMeta';

const URGENCY_BADGE_TEXT = {
  urgent: 'Expiring soon',
  soon: 'Use soon',
  ok: 'Fresh',
};

// Safety note per date type, shown on every item row.
const DATE_TYPE_NOTES = {
  'use-by': 'Use by — do not eat after this date.',
  'best-before': 'Best before — often still safe after; check smell and look.',
};

function ItemRow({ item, onResolve, onRemove }) {
  const days = daysLeft(item.expiryDate);
  const urgency = urgencyOf(days);
  const cat = CATEGORIES[item.category] ?? { label: 'Other' };
  const Icon = CATEGORY_ICONS[item.category] ?? Package;
  const styles = URGENCY_STYLES[urgency];
  const dateType = item.dateType === 'use-by' ? 'use-by' : 'best-before';

  return (
    <li
      className={`flex flex-wrap items-center gap-3 rounded-lg border border-l-4 bg-card p-3 shadow-xs ${styles.row}`}
    >
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
        aria-hidden="true"
      >
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="truncate text-sm font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">{item.quantityKg} kg</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {cat.label} · {expiryLabel(days)} ({formatDate(item.expiryDate)})
        </div>
        <div className="text-xs text-muted-foreground">{DATE_TYPE_NOTES[dateType]}</div>
      </div>

      <Badge variant="outline" className={styles.badge}>
        {URGENCY_BADGE_TEXT[urgency]}
      </Badge>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onResolve(item.id, 'eaten')}
          title="I ate it — counts toward impact"
        >
          <Check />
          Eaten
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => onResolve(item.id, 'wasted')}
          title="I threw it away — counts as waste"
        >
          <Trash2 />
          Thrown away
        </Button>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="size-7 text-muted-foreground/60 hover:text-foreground"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name} from the list`}
        title="Remove from list (does not count toward impact)"
      >
        <X />
      </Button>
    </li>
  );
}

export default ItemRow;
