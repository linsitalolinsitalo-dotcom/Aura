
export interface NotificationSettings {
  enabled: boolean;
  intervalMinutes: number; // 60, 120, 180, etc.
  lastNotified?: number; // timestamp
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  waterGoal: number; // ml
  trainingDayBonus: boolean;
  unit: 'ml' | 'l';
  isOnboarded: boolean;
  notifications?: NotificationSettings;
}

export interface FoodItem {
  id: string;
  name: string;
  quantityText: string;
  estimatedGrams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  confidence: number;
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

export interface WaterLog {
  id: string;
  amount: number;
  time: string;
}

export interface DayLog {
  date: string; // ISO YYYY-MM-DD
  waterLogs: WaterLog[];
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
