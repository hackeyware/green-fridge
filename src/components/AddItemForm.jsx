import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { CATEGORIES } from '../emissions';

const EMPTY_FORM = {
  name: '',
  category: 'vegetables',
  quantityKg: '',
  expiryDate: '',
  dateType: 'best-before',
};

function AddItemForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const set = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const quantityKg = parseFloat(form.quantityKg);

    if (!name) return setError('Please give the item a name.');
    if (!Number.isFinite(quantityKg) || quantityKg <= 0) {
      return setError('Quantity must be a number greater than 0.');
    }
    if (!form.expiryDate) return setError('Please pick an expiry date.');

    onAdd({
      id: crypto.randomUUID(),
      name,
      category: form.category,
      quantityKg,
      expiryDate: form.expiryDate,
      dateType: form.dateType,
      status: 'active',
      addedAt: new Date().toISOString(),
    });
    setForm({ ...EMPTY_FORM, category: form.category });
    setError('');
    return undefined;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add food</CardTitle>
        <CardDescription>
          The list sorts by expiry date: red under 2 days, orange under 5, green beyond.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Chicken breast"
              maxLength={60}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-category">Category</Label>
              <Select id="item-category" value={form.category} onChange={set('category')}>
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <option key={key} value={key}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="item-quantity">Quantity (kg)</Label>
              <Input
                id="item-quantity"
                type="number"
                value={form.quantityKg}
                onChange={set('quantityKg')}
                placeholder="0.5"
                min="0.1"
                step="0.1"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="item-expiry">Expiry date</Label>
              <Input id="item-expiry" type="date" value={form.expiryDate} onChange={set('expiryDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="item-date-type">Date type</Label>
              <Select id="item-date-type" value={form.dateType} onChange={set('dateType')}>
                <option value="best-before">Best before</option>
                <option value="use-by">Use by</option>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus />
            Add to fridge
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default AddItemForm;
