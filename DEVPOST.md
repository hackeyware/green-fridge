# Devpost Page — GreenFridge

> Copy-paste ready content for the Devpost submission. Fill in the placeholders
> marked with `[ ]` before submitting.

---

## Project name

GreenFridge

## Tagline

Eat it before it expires — track your fridge, cut food waste, and see your impact in kg, CO₂e and dollars.

## About the project (short, shown on the hackathon gallery)

GreenFridge is a zero-backend web app that tells you what's about to expire,
suggests recipes to use it up, and shows what your food waste really costs —
in kilograms, CO₂e and money. Everything is stored locally in your browser.

## Inspiration

About one third of all food produced for humans is lost or wasted (FAO), and a
large share of that waste happens at home. We kept finding forgotten yogurt and
sad spinach at the back of our own fridges. Existing inventory apps demand
accounts, cloud sync and barcode scanners — too much friction for a student on
a Tuesday night. We wanted the smallest possible tool that changes behavior:
see what expires soon, get a reason to use it, and understand the cost of
throwing it away.

## What it does

- Add food items with name, category, quantity, expiry date and date type
  (Best before / Use by). The list is sorted by expiry and color-coded: red
  under 2 days, orange under 5, green beyond. Each row explains the relevant
  date-type rule, so a "Use by" item is never confused with "Best before".
- "Eaten" and "Thrown away" buttons log outcomes — eaten food builds your
  impact, thrown-away food counts toward your waste rate. Every action gets a
  timestamp in a local audit log.
- An impact dashboard shows kg saved, kg wasted, waste rate, CO₂e avoided and
  CO₂e still wasted as low–high ranges, money saved/lost, and an estimated
  reduction versus your weekly baseline.
- A baseline card lets users enter their usual weekly food waste. The default
  (1.5 kg/person/week) is derived from the UNEP Food Waste Index Report 2024,
  and the comparison is explicitly labelled as an estimate.
- Recharts bar chart of kg eaten vs. thrown away over the last four weeks.
- A Methodology page documents formulas, sources, the baseline logic, the
  scale scenario and honest limitations.
- A scale scenario turns "users × kg avoided per user per week" into a
  low–high tonnes CO₂e/year range, with conservative defaults.
- One-click CSV export for testers, plus demo data and localStorage
  persistence; no accounts, no backend.

## How we built it

- React 19 + Vite, JavaScript only — no backend, no database.
- Tailwind CSS v4 with shadcn/ui-style components, lucide-react icons,
  Inter typeface, Recharts for the weekly chart, sonner for toasts.
- Impact math lives in `src/emissions.js`: quantity × per-category low/high
  emission factors that we computed from the AGRIBALYSE® v3.2 database (ADEME)
  as the 10th–90th percentile of each category's products, plus BLS average
  retail prices (September 2026). Every environmental output is a range or
  carries an explicit "estimate" label, and each value's source and method are
  documented in the file.
- The baseline is user-editable, with a cited default from the UNEP Food Waste
  Index. The scale scenario uses the same factor ranges and shows its formula
  in the UI.
- Items persist in localStorage; a CSV export gives pilot testers a portable
  dataset. No personal data ever leaves the device.

## Challenges we ran into

- Getting the urgency thresholds right: anything "expiring" felt alarming, so
  we tuned the color bands (2/5 days) to match how people actually plan meals.
- Designing emission factors that are honest: category averages hide variance,
  so we computed real 10th–90th percentile ranges from AGRIBALYSE v3.2 and
  label all outputs as estimates.
- Keeping the impact history without a backend — we tag each resolved item
  with a timestamp and aggregate it per week client-side.

## Accomplishments we're proud of

- A complete, deployable product in a weekend with zero runtime dependencies
  beyond the UI stack — and no data leaving the browser.
- Impact numbers that are traceable: every factor has a cited source in the
  README and in code comments.

## What we learned

- Food waste is a climate and money problem at the same time — showing both
  (kg CO₂e and $) makes the message land with different people.
- Simple client-only apps can still be rigorous: clear formulas + cited
  sources beat vague "eco scores".

## What's next for GreenFridge

- Barcode / receipt-scan input.
- Optional AI recipe generation behind a small server-side proxy (API keys
  never ship in the frontend).
- Notifications when items enter the red zone.
- Shared household stats.

## Limitations

Emission factors are based on French data (AGRIBALYSE) and prices on US averages (BLS); values are indicative and should be adapted to the user's country.

## Built with

react, vite, tailwindcss, shadcn/ui, lucide-react, recharts, sonner, localStorage

## Links

- Try it out: `[GitHub Pages URL — https://<user>.github.io/<repo>/]`
- GitHub repository: `[repo URL]`
- Demo video: `[video URL]`

## Team

- Mouhammad El Amine Coly
