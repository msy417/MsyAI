import type { Food } from '@/types';
import { Card } from '@/components/ui/Card';
import { NutritionDisplay } from '@/components/features/NutritionDisplay';
import { HealthTags } from '@/components/features/HealthTag';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  food: Food;
  onAdd?: () => void;
  onRemove?: () => void;
  isSelected?: boolean;
  showNutrition?: boolean;
  compact?: boolean;
  className?: string;
}

export function FoodCard({
  food,
  onAdd,
  onRemove,
  isSelected = false,
  showNutrition = true,
  compact = false,
  className
}: FoodCardProps) {
  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100',
          isSelected && 'border-green-500 bg-green-50',
          className
        )}
      >
        {food.image && (
          <img src={food.image} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 truncate">{food.name}</h4>
          <p className="text-xs text-gray-500">{food.nutrition.calories}kcal</p>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
            )}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
  }
  
  return (
    <Card className={cn('overflow-hidden', className)} hover>
      {food.image && (
        <div className="relative -mx-4 -mt-4 mb-3">
          <img src={food.image} alt={food.name} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{food.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {food.cookingMethod} · {food.category}
          </p>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
            )}
          >
            {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
      <HealthTags tags={food.healthTags} className="mb-3" />
      {showNutrition && <NutritionDisplay nutrition={food.nutrition} compact />}
    </Card>
  );
}
