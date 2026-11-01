# GreenFridge

**Track what's in your fridge, eat it before it expires, and see the impact on food waste, CO₂e and your wallet.**

Built for the **Green Shift Hacks** sustainability hackathon. No backend, no accounts — everything runs in your browser and stays in `localStorage`.

---

## The problem

Roughly **one third of all food produced for humans is lost or wasted** (FAO). A large share of that waste happens at home: food is bought, forgotten at the back of the fridge, and thrown away — along with all the water, land, feed and energy that went into producing it, and the money that paid for it.

Households and students rarely have a simple picture of *what expires soon* and *what that waste actually costs*.

## Who it's for

- **Households** that want to stop throwing away groceries they already paid for.
- **Students** on a budget, cooking for themselves for the first time.
- Anyone who wants to see the climate impact of their food waste in concrete numbers.

## What it does

- **Add food** — name, category (meat, fish, dairy, vegetables, fruit, grains, other), quantity in kg, expiry date, and date type (**Best before** or **Use by**).
- **Priority list** — always sorted by expiry date and color-coded:
  - red — expiring in under 2 days
  - orange — under 5 days
  - green — 5 days or more
- **Date-type safety notes** — "Use by" items show *do not eat after this date*; "Best before" items show *often still safe, check smell and look*.
- **"Eaten" / "Thrown away"** buttons on every item — eaten food counts toward your impact, thrown-away food counts as waste. Every action is logged with a timestamp.
- **Impact dashboard** — kg eaten/saved, kg thrown away, waste rate, CO₂e avoided (low–high range), CO₂e still wasted (range), money saved, money lost, and an estimated reduction versus your baseline.
- **Baseline setting** — your usual weekly food waste in kg, with a cited default; the dashboard shows *estimated reduction = baseline − actual weekly waste* and labels it as an estimate.
- **Weekly chart** — Recharts bar chart of kg eaten vs. thrown away over the last 4 weeks.
- **Recipe ideas** — simple hardcoded recipes matched to the categories of whatever is expiring soonest.
- **Methodology page** — formulas, sources, baseline logic, scale scenario, limitations, action log and pilot-export notes.
- **Scale scenario** — number of users × kg avoided per user per week × 52 weeks, shown as a low–high tonnes CO₂e/year range with deliberately conservative defaults.
- **Export data** — one-click CSV for testers, including item-level low/high CO₂e estimates and the baseline settings.
- **Load sample data** — one click to fill the fridge with a realistic two-week history, clearly badged **Sample data** in the UI so it is never mistaken for real tracking.
- **Persistence** — localStorage only. No backend, no accounts, no tracking.

## Impact calculation method

All figures are **estimates**. No item is weighed, every quantity is entered by the user, and category factors pool many products. The app therefore shows ranges wherever it reports an environmental number.

```
CO₂e of an item   =  quantity (kg)  ×  category factor (kg CO₂e per kg)
CO₂e avoided      =  Σ CO₂e of items marked "eaten"
CO₂e still wasted =  Σ CO₂e of items marked "thrown away"
Money saved/lost  =  quantity (kg)  ×  average retail price of the category ($/kg)
Waste rate        =  kg thrown away  ÷  (kg eaten + kg thrown away)
Weekly waste      =  kg thrown away  ÷  logged period in weeks (minimum one week)
Est. reduction    =  baseline weekly waste  −  actual weekly waste
```

Every category has a low and high CO₂e factor, so all CO₂e outputs are displayed as a low–high range (`src/emissions.js`). The factors were computed by us from the **AGRIBALYSE® v3.2** database (ADEME): the Synthèse table (2,454 products, kg CO₂ eq per kg of product as consumed, farm to consumer) was downloaded on 2026-10-31, the relevant product sub-groups pooled per category, and the **10th and 90th percentile** computed. Low = P10, high = P90. This is documented product-to-product variation, not a statistical confidence interval.

| Category | AGRIBALYSE sub-groups pooled (n) | kg CO₂e/kg, P10–P90 | Est. price $/kg |
| --- | --- | --- | --- |
| Meat | raw meats + charcuterie (280) | 3.38 – 27.45 | 10.74 |
| Fish & seafood | fish raw/cooked, shellfish, fish products (222) | 2.77 – 14.97 | 21.69 |
| Dairy & eggs | milk, cheese, fresh dairy, cream, eggs (244) | 1.60 – 6.62 | 6.14 |
| Vegetables | vegetables + potatoes/tubers (242) | 0.60 – 2.50 | 3.39 |
| Fruit | fruit (98) | 0.54 – 1.90 | 3.38 |
| Grains, rice & pasta | pasta/rice/cereals + breads (132) | 0.74 – 2.50 | 2.68 |
| Other | prepared dishes, sandwiches, soups, salads (308) | 1.14 – 9.63 | 8.00 |

Prices are **U.S. Bureau of Labor Statistics** average retail prices, September 2026, converted to USD per kg (each value's basket is named in `src/emissions.js`). Two caveats, kept explicit in code and in the Methodology page: the fish price is a single-item BLS observation (frozen perch fillets — BLS discontinued most fish series), and the "Other" price is the equal-weight mean of the six category prices, not an observed price.

The dashboard's "km driven" comparison uses **0.17 kg CO₂e/km** (UK DESNZ 2024 conversion factors, average car; cross-checked with EEA) and is always shown as a range labelled *illustrative*.

### Baseline logic

The user enters how much food they estimate they usually throw away per week. The default is **1.5 kg per person per week**, derived from the UNEP Food Waste Index Report 2024 (79 kg of household food waste per capita per year in 2022 ÷ 52). The dashboard shows:

```
estimated reduction vs baseline = baseline − actual weekly waste
```

This is explicitly labelled as an estimate. "Actual weekly waste" is normalised over the period covered by the user's logged actions, with a minimum denominator of one week. Short histories are damped rather than extrapolated, which can make the reduction look optimistic, so fewer than four weeks of logs is marked *preliminary*.

### Scale scenario

The Methodology page includes an interactive scenario:

```
users × kg avoided/user/week × 52 weeks × kg CO₂e per kg food ÷ 1,000 = tonnes CO₂e/year
```

It uses a plant-heavy basket of 508 AGRIBALYSE v3.2 products (vegetables, potatoes, fruit, legumes, grains, bread): **0.58–2.29 kg CO₂e per kg of avoided food** (P10–P90), and outputs a low–high range. It is a scenario, not a measurement.

## Sources

- [AGRIBALYSE® v3.2 (ADEME)](https://data.ademe.fr/datasets/agribalyse-synthese) — food lifecycle inventory, kg CO₂ eq per kg as consumed; persistent DOI [10.57745/XTENSJ](https://doi.org/10.57745/XTENSJ). Basis of all CO₂e factors and the scale-scenario basket.
- [U.S. Bureau of Labor Statistics — Average Retail Food and Energy Prices](https://www.bls.gov/regions/mid-atlantic/data/averageretailfoodandenergyprices_usandmidwest_table.htm), September 2026 — retail prices. Fish price from BLS public API series [APU0000703511](https://api.bls.gov/publicAPI/v1/timeseries/data/APU0000703511) (frozen perch fillets, $/lb).
- [UNEP Food Waste Index Report 2024](https://www.unep.org/resources/publication/food-waste-index-report-2024) — 79 kg household food waste per capita per year (2022 data), the baseline default.
- [FAO — Food loss and food waste](https://www.fao.org/food-loss-and-food-waste/flw-data) — the "one third wasted" framing.
- [UK DESNZ — Greenhouse gas reporting: conversion factors 2024](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024) — average car factor for the driving comparison.
- [European Environment Agency — CO₂ performance of new passenger cars](https://www.eea.europa.eu/en/analysis/indicators/co2-performance-of-new-passenger) — cross-check of the car factor.

Every factor and its exact source comment lives in [`src/emissions.js`](src/emissions.js). Nothing in the app is presented as verified that is not.

## Limitations

- **All numbers are order-of-magnitude estimates**, not measurements. Quantities are manually entered and nobody weighs their leftovers.
- Emission factors are based on French data (AGRIBALYSE) and prices on US averages (BLS); values are indicative and should be adapted to the user's country.
- Category factors pool many products: AGRIBALYSE values span ~1.4 (some processed meats) to ~35 kg CO₂e/kg (beef) within the meat category alone. The low–high percentile ranges make this explicit rather than solving it, and P10–P90 is not a confidence interval.
- AGRIBALYSE models French production and consumption; factors may differ for other countries and diets.
- The fish price is a single-item BLS observation (frozen perch fillets); it will not represent shellfish or premium fish. The "Other" price is a derived mean of the six category prices.
- Food thrown away is assumed to rot aerobically; landfill methane emissions would make the waste figures worse, not better.
- The baseline comparison is noisy with less than four weeks of consistent logging, and it compares against a self-reported estimate, not a measured counterfactual.
- The scale scenario is an illustrative calculation, not a result from a user study — we have no large user study yet.
- The impact history is per browser and resets when you clear your localStorage — there is no cloud backup by design.
- Recipe matching is intentionally simple (category-based, hardcoded) and does not know what else you own.
- The CSV export is a convenience for a small pilot, not a validated research instrument.

## Tech stack

React 19 + Vite, Tailwind CSS v4 with shadcn/ui-style components, lucide-react icons, Recharts, sonner toasts, Inter typeface. No other runtime dependencies; data never leaves the browser.

## Setup

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build in dist/
npm run preview  # preview the production build
npm run lint
npm test         # impact-maths tests (Node test runner)
```

## Deployment (GitHub Pages)

1. Push this project to a GitHub repository.
2. In the repo: **Settings → Pages → Source: GitHub Actions**.
3. That's it — the included workflow (`.github/workflows/deploy.yml`) builds with the correct base path and publishes on every push to `main`, at `https://<user>.github.io/<repo-name>/`.

Netlify works too: `netlify.toml` is included, so connecting the repo on netlify.com is enough.

## Team

- **Mouhammad El Amine Coly**

## Possible next steps

- Barcode / receipt-scan input to make adding food effortless.
- Optional Claude-powered recipe generation behind a small server-side proxy (the API key must never ship in the frontend).
- Notifications (email/push) when something enters the red zone.
- Multiple fridges / households and shared stats.
