import type { Nutrition, UserProfile, Food, GoalType } from '@/types';

export function calculateBMR(profile: UserProfile): number {
  const { gender, weight, height, age } = profile;
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityFactor = 1.55;
  return bmr * activityFactor;
}

export function calculateTargetCalories(profile: UserProfile): number {
  const tdee = calculateTDEE(profile);
  switch (profile.goal) {
    case 'lose':
      return tdee - 400;
    case 'gain':
      return tdee + 400;
    case 'sugar':
      return tdee - 200;
    default:
      return tdee;
  }
}

export function calculateTargetNutrition(profile: UserProfile): Nutrition {
  const targetCalories = calculateTargetCalories(profile);
  
  let proteinRatio: number;
  let fatRatio: number;
  let carbsRatio: number;
  
  switch (profile.goal) {
    case 'lose':
      proteinRatio = 0.30;
      fatRatio = 0.25;
      carbsRatio = 0.45;
      break;
    case 'gain':
      proteinRatio = 0.35;
      fatRatio = 0.25;
      carbsRatio = 0.40;
      break;
    case 'sugar':
      proteinRatio = 0.25;
      fatRatio = 0.30;
      carbsRatio = 0.45;
      break;
    default:
      proteinRatio = 0.25;
      fatRatio = 0.25;
      carbsRatio = 0.50;
  }
  
  return {
    calories: Math.round(targetCalories),
    protein: Math.round((targetCalories * proteinRatio) / 4),
    fat: Math.round((targetCalories * fatRatio) / 9),
    carbs: Math.round((targetCalories * carbsRatio) / 4)
  };
}

export function sumNutrition(nutritions: Nutrition[]): Nutrition {
  return nutritions.reduce(
    (acc, curr) => ({
      calories: acc.calories + curr.calories,
      protein: acc.protein + curr.protein,
      fat: acc.fat + curr.fat,
      carbs: acc.carbs + curr.carbs
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function generateHealthTags(food: Food, goal: GoalType): string[] {
  const tags: string[] = [...food.healthTags];
  
  if (goal === 'lose') {
    if (food.nutrition.calories < 100) {
      tags.push('减脂推荐');
    }
    if (food.nutrition.fat > 15) {
      tags.push('减脂慎选');
    }
  }
  
  if (goal === 'gain') {
    if (food.nutrition.protein > 15) {
      tags.push('增肌推荐');
    }
  }
  
  if (goal === 'sugar') {
    if (food.nutrition.carbs < 10) {
      tags.push('控糖推荐');
    }
    if (food.nutrition.carbs > 20) {
      tags.push('控糖慎选');
    }
  }
  
  return [...new Set(tags)];
}

export function getGoalDescription(goal: GoalType): string {
  const descriptions: Record<GoalType, string> = {
    lose: '减脂期建议每日热量缺口300-500kcal，保证蛋白质摄入，减少油脂',
    gain: '增肌期需要热量盈余，重点补充蛋白质，训练后及时补充营养',
    sugar: '控糖期选择低GI食物，控制碳水总量，注意进食顺序',
    maintain: '日常健康饮食，保持营养均衡，规律三餐'
  };
  return descriptions[goal];
}

export function formatNutrition(nutrition: Nutrition): string {
  return `热量${nutrition.calories}kcal | 蛋白质${nutrition.protein}g | 脂肪${nutrition.fat}g | 碳水${nutrition.carbs}g`;
}
