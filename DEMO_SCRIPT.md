# GreenFridge — Demo Video Script (~2 minutes)

Screen recording with voiceover. Tip: record at 1280×720 or higher, then
switch to a phone-sized window for the mobile segment. Use the **Load sample
data** button to jump straight into a populated fridge — the app shows a
"Sample data" banner so the audience knows it is not real tracking.

| Time | On screen | Voiceover |
| --- | --- | --- |
| 0:00–0:15 | Landing view, empty fridge | "Meet GreenFridge — a tiny tool that helps households and students stop throwing away the food they already paid for. A third of all food produced is wasted, and a lot of that happens right here, in our own fridges." |
| 0:15–0:40 | Click **Load sample data** — "Sample data" banner appears, fridge fills, items sorted by expiry with red / orange / green colors | "Adding food takes seconds: name, category, quantity, expiry date. The fridge list is always sorted by expiry date — items expiring in under two days turn red, under five days orange, everything else green. This spinach expires today. And you can see these are clearly marked sample items, not my own tracking." |
| 0:40–1:00 | Click **Add food**, add one item (e.g. Milk, dairy, 1 kg, expiry in a week, **Best before**); toast appears | "Let me add something myself — a liter of milk, best before next week. It lands in the list, correctly sorted. Each row also explains the date rule: use-by means don't eat it after the date; best-before often just means check the smell and look." |
| 1:00–1:20 | Open **Recipe ideas** — three recipes matched to soonest-expiring items | "When something is about to expire, GreenFridge suggests simple recipes that use those categories — a fridge-cleanout frittata for the yogurt, fish tacos for the salmon. One less excuse to throw food away." |
| 1:20–1:40 | Mark Spinach **Eaten**, then one item **Thrown away**; impact row updates live | "Every time you finish food, you log it. Eaten food counts toward your impact; thrown-away food counts as waste. Notice that CO₂e avoided and CO₂e still wasted are ranges — never a single fake-precise number." |
| 1:40–1:55 | Scroll to **Weekly baseline**, then the 4-week chart | "You can set how much you usually waste per week. The default comes from UNEP's Food Waste Index, and the reduction is clearly labelled as an estimate. The chart shows eaten versus thrown away week by week." |
| 1:55–2:10 | Open **Methodology**, show the scale scenario and **Export CSV**, then resize to mobile width | "The Methodology page shows every formula, source and limitation. The scale scenario turns a conservative assumption into a low–high tonnes range — a scenario, not a study result. Testers can export their data as CSV. Everything stays in the browser: no account, no backend. GreenFridge: eat it before it expires." |

Checklist before recording:

- [ ] Fresh browser profile or cleared localStorage (empty first frame)
- [ ] Dev server running (`npm run dev`) or production preview (`npm run preview`)
- [ ] Microphone level checked; speak slowly
- [ ] Browser zoom 100%, notification bell off
- [ ] Practice the flow once: demo data → add item → recipes → eaten/wasted → baseline/chart → methodology/scale/export → mobile
