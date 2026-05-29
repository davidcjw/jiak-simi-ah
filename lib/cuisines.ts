export interface Cuisine {
  id: string;
  label: string;
  emoji: string;
  placeTypes: string[];
}

export const CUISINES: Cuisine[] = [
  { id: "hawker", label: "Hawker / Local", emoji: "🍜", placeTypes: ["meal_takeaway", "food_court"] },
  { id: "chinese", label: "Chinese", emoji: "🥢", placeTypes: ["chinese_restaurant"] },
  { id: "malay", label: "Malay", emoji: "🍛", placeTypes: ["malay_restaurant"] },
  { id: "indian", label: "Indian", emoji: "🫓", placeTypes: ["indian_restaurant"] },
  { id: "japanese", label: "Japanese", emoji: "🍣", placeTypes: ["japanese_restaurant", "sushi_restaurant", "ramen_restaurant"] },
  { id: "korean", label: "Korean", emoji: "🥩", placeTypes: ["korean_restaurant"] },
  { id: "thai", label: "Thai", emoji: "🌶️", placeTypes: ["thai_restaurant"] },
  { id: "vietnamese", label: "Vietnamese", emoji: "🍲", placeTypes: ["vietnamese_restaurant"] },
  { id: "western", label: "Western", emoji: "🍔", placeTypes: ["american_restaurant", "hamburger_restaurant", "steak_house"] },
  { id: "italian", label: "Italian", emoji: "🍝", placeTypes: ["italian_restaurant"] },
  { id: "pizza", label: "Pizza", emoji: "🍕", placeTypes: ["pizza_restaurant"] },
  { id: "seafood", label: "Seafood", emoji: "🦞", placeTypes: ["seafood_restaurant"] },
  { id: "cafe", label: "Cafe / Bakery", emoji: "☕", placeTypes: ["cafe", "coffee_shop", "bakery"] },
  { id: "fastfood", label: "Fast Food", emoji: "🍟", placeTypes: ["fast_food_restaurant"] },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥗", placeTypes: ["vegetarian_restaurant"] },
  { id: "brunch", label: "Brunch", emoji: "🥞", placeTypes: ["brunch_restaurant", "breakfast_restaurant"] },
];

export const RADIUS_OPTIONS = [
  { value: 500, label: "500m" },
  { value: 1000, label: "1 km" },
  { value: 2000, label: "2 km" },
  { value: 3000, label: "3 km" },
  { value: 5000, label: "5 km" },
];

export const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

export const PRICE_LEVEL_API_MAP: Record<number, string> = {
  1: "PRICE_LEVEL_INEXPENSIVE",
  2: "PRICE_LEVEL_MODERATE",
  3: "PRICE_LEVEL_EXPENSIVE",
};
