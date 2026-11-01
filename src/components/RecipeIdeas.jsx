import { useState } from 'react';
import { ChefHat, Clock } from 'lucide-react';
import { RECIPES } from '../recipes';
import { daysLeft } from '../utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const MAX_IDEAS = 3;

// Pick recipes for the categories of the soonest-expiring items (no API, no keys).
function pickRecipes(items) {
  const soonest = items
    .filter((i) => i.status === 'active')
    .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate));

  const categories = [];
  for (const item of soonest) {
    if (!categories.includes(item.category)) categories.push(item.category);
    if (categories.length >= MAX_IDEAS) break;
  }

  const picks = [];
  for (const category of categories) {
    const recipe = RECIPES.find((r) => r.category === category && !picks.includes(r));
    if (recipe) picks.push(recipe);
  }
  // Top up with generic ideas if there is little food in the fridge.
  for (const recipe of RECIPES) {
    if (picks.length >= MAX_IDEAS) break;
    if (!picks.includes(recipe)) picks.push(recipe);
  }
  return picks;
}

function RecipeIdeas({ items }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recipe ideas</CardTitle>
        <CardDescription>Simple recipes that use up whatever is expiring soonest.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!open ? (
          <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
            <ChefHat />
            Get recipe ideas
          </Button>
        ) : (
          <>
            {(() => {
              const soonestNames = items
                .filter((i) => i.status === 'active' && daysLeft(i.expiryDate) >= 0)
                .sort((a, b) => a.expiryDate.localeCompare(b.expiryDate))
                .slice(0, 3)
                .map((i) => i.name);
              return (
                soonestNames.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Based on what&apos;s expiring soonest:{' '}
                    <span className="font-medium text-foreground">
                      {soonestNames.join(', ')}
                    </span>
                    .
                  </p>
                )
              );
            })()}

            {pickRecipes(items).map((recipe) => (
              <article key={recipe.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-medium">{recipe.name}</h3>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {recipe.time}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {recipe.ingredients.join(' · ')}
                </p>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-relaxed">
                  {recipe.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}

            <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
              Hide recipes
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default RecipeIdeas;
