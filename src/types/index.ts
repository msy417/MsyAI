export interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface Food {
  id: string;
  name: string;
  ingredients: string[];
  cookingMethod: string;
  nutrition: Nutrition;
  healthTags: string[];
  image?: string;
  category: string;
}

export interface UserProfile {
  gender: 'male' | 'female';
  height: number;
  weight: number;
  age: number;
  goal: 'lose' | 'gain' | 'sugar' | 'maintain';
  mealsPerDay: number;
  preferences: string[];
  avoidances: string[];
}

export interface MealPlan {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  foods: Food[];
  nutrition: Nutrition;
  reason: string;
}

export interface DietPlan {
  id: string;
  date: string;
  meals: MealPlan[];
  totalNutrition: Nutrition;
  targetNutrition: Nutrition;
}

export interface MealRecord {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  foods: Food[];
  nutrition: Nutrition;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'tips' | 'guide' | 'myth';
  targetGoal?: 'lose' | 'gain' | 'sugar' | 'maintain';
  image?: string;
  isFavorite: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type GoalType = 'lose' | 'gain' | 'sugar' | 'maintain';

export const goalLabels: Record<GoalType, string> = {
  lose: '减脂',
  gain: '增肌',
  sugar: '控糖',
  maintain: '日常健康'
};

export const mealTypeLabels: Record<'breakfast' | 'lunch' | 'dinner', string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐'
};
