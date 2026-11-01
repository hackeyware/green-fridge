// Simple, hardcoded recipe ideas — one less excuse to let food expire.
// Deliberately local (no API calls, no keys). AI-generated recipes would be a
// nice upgrade, but they must be fetched from a small server-side proxy so no
// API key is ever shipped in the frontend.

export const RECIPES = [
  {
    id: 'fridge-clear-stirfry',
    category: 'meat',
    name: 'Fridge-clear stir-fry',
    time: '15 min',
    ingredients: ['Leftover meat, sliced thin', 'Any vegetables nearing expiry', 'Soy sauce, garlic, oil', 'Rice or noodles'],
    steps: [
      'Sear the sliced meat in a very hot pan, 2–3 min.',
      'Add chopped vegetables and stir-fry about 5 min.',
      'Splash in soy sauce and garlic, toss 1 min more.',
      'Serve over rice or noodles.',
    ],
  },
  {
    id: 'crispy-leftover-hash',
    category: 'meat',
    name: 'Crispy leftover hash',
    time: '20 min',
    ingredients: ['Leftover cooked meat, diced', 'Potatoes or root vegetables', 'An egg (optional)', 'Onion, paprika, salt'],
    steps: [
      'Fry diced potatoes and onion in oil until golden, 10 min.',
      'Add the diced meat and press everything flat; crisp 5 min undisturbed.',
      'Flip in patches, season, and top with a fried egg.',
    ],
  },
  {
    id: 'fish-tacos',
    category: 'fish',
    name: '15-minute fish tacos',
    time: '15 min',
    ingredients: ['Fish fillets', 'Tortillas', 'Cabbage or carrot slaw', 'Lime, mayo, sriracha'],
    steps: [
      'Season fillets with salt, pepper and lime juice.',
      'Pan-fry 2–3 min per side until flaky.',
      'Mix mayo + sriracha for the sauce.',
      'Flake the fish into warm tortillas, top with slaw and sauce.',
    ],
  },
  {
    id: 'one-pan-fish-veg',
    category: 'fish',
    name: 'One-pan lemon fish & veg',
    time: '25 min',
    ingredients: ['Fish fillets', 'Any vegetables, chunked', 'Olive oil, lemon, salt'],
    steps: [
      'Heat oven to 200 °C. Toss vegetables with oil and salt on a tray.',
      'Roast 10 min, then nestle the fillets among them.',
      'Squeeze lemon over everything; roast 10–12 min more.',
    ],
  },
  {
    id: 'fridge-cleanout-frittata',
    category: 'dairy',
    name: 'Fridge-cleanout frittata',
    time: '25 min',
    ingredients: ['4–6 eggs', 'Cheese, grated', 'Any vegetables or cooked meat', 'Onion, salt, pepper'],
    steps: [
      'Sauté onion and add-ins in an oven-safe pan, 5 min.',
      'Beat eggs with cheese, pour over and stir gently.',
      'Cook on low 5 min until edges set, then grill 5 min until golden.',
    ],
  },
  {
    id: 'rescue-smoothie-bowl',
    category: 'dairy',
    name: 'Rescue-yogurt smoothie bowl',
    time: '5 min',
    ingredients: ['Yogurt', 'Soft fruit', 'Oats or granola', 'Honey'],
    steps: [
      'Blend yogurt and soft fruit until smooth.',
      'Pour into a bowl, top with oats/granola and honey.',
    ],
  },
  {
    id: 'everything-soup',
    category: 'vegetables',
    name: 'Everything soup',
    time: '30 min',
    ingredients: ['Any wilted vegetables', 'Onion, garlic', 'Stock cube', 'Herbs, salt, pepper'],
    steps: [
      'Sweat onion and garlic in oil, 3 min.',
      'Add chopped vegetables, stock and herbs; simmer 15–20 min.',
      'Blend for a smooth soup, or leave chunky. Grated cheese on top works too.',
    ],
  },
  {
    id: 'roasted-veg-medley',
    category: 'vegetables',
    name: 'Roasted veg medley',
    time: '30 min',
    ingredients: ['Any vegetables', 'Olive oil, salt, pepper', 'Optional: cheese, grains as a side'],
    steps: [
      'Heat oven to 200 °C. Chop everything bite-size.',
      'Toss with oil and salt, spread on a tray.',
      'Roast 25 min, shaking once. Serve with grains or as a side.',
    ],
  },
  {
    id: 'soft-fruit-smoothie',
    category: 'fruit',
    name: 'Soft-fruit rescue smoothie',
    time: '5 min',
    ingredients: ['Soft or bruised fruit', 'Yogurt or milk', 'Oats (optional)', 'Honey to taste'],
    steps: [
      'Peel and chop fruit, discard any mouldy parts.',
      'Blend with yogurt or milk until smooth; sweeten if needed.',
    ],
  },
  {
    id: 'stewed-fruit',
    category: 'fruit',
    name: 'Cinnamon stewed fruit',
    time: '15 min',
    ingredients: ['Soft apples, pears or berries', 'Cinnamon', 'Splash of juice or water', 'Yogurt or granola to serve'],
    steps: [
      'Chop fruit and simmer with cinnamon and a splash of liquid, 10 min.',
      'Serve warm or cold over yogurt or granola.',
    ],
  },
  {
    id: 'loaded-fried-rice',
    category: 'grains',
    name: 'Loaded fried rice',
    time: '15 min',
    ingredients: ['Day-old cooked rice', 'An egg or two', 'Any vegetables, frozen peas', 'Soy sauce, oil'],
    steps: [
      'Scramble the eggs in a hot oiled pan; set aside.',
      'Stir-fry vegetables 3 min, add rice and press to crisp.',
      'Return eggs, add soy sauce, toss and serve.',
    ],
  },
  {
    id: 'pasta-frittata',
    category: 'grains',
    name: 'Pasta frittata',
    time: '20 min',
    ingredients: ['Leftover cooked pasta', '2–3 eggs', 'Cheese', 'Any vegetables or ham'],
    steps: [
      'Beat eggs with cheese and fold in the pasta and add-ins.',
      'Pour into an oiled pan, cook on low 8 min until set.',
      'Flip (or grill) 3 min to finish. Eat warm or cold.',
    ],
  },
  {
    id: 'clean-the-fridge-fritters',
    category: 'other',
    name: 'Clean-the-fridge fritters',
    time: '25 min',
    ingredients: ['Leftover vegetables or grains, mashed', '1–2 eggs', 'Flour or breadcrumbs', 'Oil for frying'],
    steps: [
      'Mix mash, eggs and just enough flour to hold together; season well.',
      'Form small patties.',
      'Fry 2–3 min per side until golden. Great with yogurt-dip.',
    ],
  },
  {
    id: 'open-fridge-toast',
    category: 'other',
    name: 'Open-fridge toast',
    time: '10 min',
    ingredients: ['Bread', 'Whatever needs using: cheese, spreads, vegetables, cooked meat', 'Optional: a fried egg'],
    steps: [
      'Toast the bread.',
      'Pile on whatever needs rescuing — cheese last.',
      'Grill 3 min and top with an egg if you like.',
    ],
  },
];
