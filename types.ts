
export interface UserAccount {
  id: string;
  name: string;
  identifier: string;
  passwordHash: string;
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  waterGoal: number;
  trainingDayBonus: boolean;
  unit: 'ml' | 'l';
  isOnboarded: boolean;
  notifications?: {
    enabled: boolean;
    intervalMinutes: number;
    lastNotified?: number;
  };
}

export type FoodSource = 'TACO' | 'TBCA' | 'USDA' | 'AI-ESTIMATED' | 'MANUAL';

export interface FoodItem {
  id: string;
  foodId?: string;
  name: string;
  source: FoodSource;
  quantityText: string;
  selectedQuantity: number;
  selectedUnit: string;
  estimatedGrams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  sodium_mg?: number;
  sugar_g?: number;
  confidence: number;
  notes?: string;
}

export interface DatabaseFood {
  id: string;
  name: string;
  category: string;
  state: 'cru' | 'cozido' | 'grelhado' | 'assado' | 'frito' | 'natural';
  synonyms: string[];
  per_100g: {
    kcal: number;
    carb_g: number;
    prot_g: number;
    fat_g: number;
    fiber_g: number | null;
    sodium_mg: number | null;
  };
  source: 'TACO' | 'TBCA';
  servingSizes: {
    unit: string;
    grams: number;
  }[];
  notes?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  time: string;
  description: string;
  items: FoodItem[];
  totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
  disclaimer: string;
}

export interface DayLog {
  date: string;
  waterLogs: { id: string; amount: number; time: string }[];
  meals: Meal[];
  notes: string;
}

export interface AIResponse {
  mealName: string;
  items: FoodItem[];
  totals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
  };
  disclaimer: string;
  followUpQuestions: string[];
}
