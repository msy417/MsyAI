import type { Nutrition } from '@/types';
import { cn } from '@/lib/utils';

interface NutritionBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
}

function NutritionBar({ label, value, max, unit, color }: NutritionBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-16">{label}</span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-800 w-20 text-right">
        {value}{unit}
      </span>
    </div>
  );
}

interface NutritionDisplayProps {
  nutrition: Nutrition;
  target?: Nutrition;
  showBar?: boolean;
  compact?: boolean;
}

export function NutritionDisplay({ nutrition, target, showBar = true, compact = false }: NutritionDisplayProps) {
  const defaultTarget: Nutrition = {
    calories: 2000,
    protein: 60,
    fat: 65,
    carbs: 300
  };
  
  const t = target || defaultTarget;
  
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-2 py-1 bg-orange-50 text-orange-600 rounded-full">
          {nutrition.calories}kcal
        </span>
        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
          P{nutrition.protein}g
        </span>
        <span className="px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">
          F{nutrition.fat}g
        </span>
        <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-full">
          C{nutrition.carbs}g
        </span>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">营养数据</span>
        <span className="text-xs text-gray-400">每100g估算值</span>
      </div>
      {showBar ? (
        <>
          <NutritionBar label="热量" value={nutrition.calories} max={t.calories} unit="kcal" color="bg-orange-400" />
          <NutritionBar label="蛋白质" value={nutrition.protein} max={t.protein} unit="g" color="bg-blue-400" />
          <NutritionBar label="脂肪" value={nutrition.fat} max={t.fat} unit="g" color="bg-yellow-400" />
          <NutritionBar label="碳水" value={nutrition.carbs} max={t.carbs} unit="g" color="bg-purple-400" />
        </>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-orange-50 rounded-xl">
            <p className="text-lg font-bold text-orange-600">{nutrition.calories}</p>
            <p className="text-xs text-gray-500">热量(kcal)</p>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-xl">
            <p className="text-lg font-bold text-blue-600">{nutrition.protein}</p>
            <p className="text-xs text-gray-500">蛋白质(g)</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-xl">
            <p className="text-lg font-bold text-yellow-600">{nutrition.fat}</p>
            <p className="text-xs text-gray-500">脂肪(g)</p>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-xl">
            <p className="text-lg font-bold text-purple-600">{nutrition.carbs}</p>
            <p className="text-xs text-gray-500">碳水(g)</p>
          </div>
        </div>
      )}
    </div>
  );
}
