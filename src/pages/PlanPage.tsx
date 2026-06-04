import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Target, Loader2, RefreshCw, Download, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { NutritionDisplay } from '@/components/features/NutritionDisplay';
import { HealthTags } from '@/components/features/HealthTag';
import { foods } from '@/data/foods';
import { useAppStore } from '@/store';
import { calculateTargetNutrition, getGoalDescription } from '@/utils/nutrition';
import type { UserProfile, Food, MealPlan, GoalType } from '@/types';

const goalOptions = [
  { value: 'lose', label: '减脂' },
  { value: 'gain', label: '增肌' },
  { value: 'sugar', label: '控糖' },
  { value: 'maintain', label: '日常健康' }
];

const genderOptions = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' }
];

const mealsPerDayOptions = [
  { value: '3', label: '三餐' },
  { value: '4', label: '四餐' },
  { value: '5', label: '五餐' }
];

export function PlanPage() {
  const { userProfile, setUserProfile } = useAppStore();
  const [showForm, setShowForm] = useState(!userProfile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  
  const [form, setForm] = useState<Partial<UserProfile>>({
    gender: userProfile?.gender || 'male',
    height: userProfile?.height || 170,
    weight: userProfile?.weight || 60,
    age: userProfile?.age || 20,
    goal: userProfile?.goal || 'lose',
    mealsPerDay: userProfile?.mealsPerDay || 3,
    preferences: userProfile?.preferences || [],
    avoidances: userProfile?.avoidances || []
  });
  
  useEffect(() => {
    if (userProfile) {
      setForm(userProfile);
      generatePlan(userProfile);
    }
  }, [userProfile]);
  
  const generatePlan = async (profile: UserProfile) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const targetNutrition = calculateTargetNutrition(profile);
    const perMealCalories = Math.round(targetNutrition.calories / profile.mealsPerDay);
    
    const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];
    const plans: MealPlan[] = [];
    
    for (const mealType of mealTypes) {
      let targetCalories = perMealCalories;
      if (mealType === 'breakfast') targetCalories = Math.round(perMealCalories * 0.8);
      if (mealType === 'dinner') targetCalories = Math.round(perMealCalories * 0.9);
      
      const suitableFoods = foods.filter((f) => {
        if (profile.goal === 'lose' && f.nutrition.fat > 20) return false;
        if (profile.goal === 'sugar' && f.nutrition.carbs > 20) return false;
        return true;
      });
      
      const selectedFoods: Food[] = [];
      let currentCalories = 0;
      
      const shuffled = [...suitableFoods].sort(() => Math.random() - 0.5);
      
      for (const food of shuffled) {
        if (currentCalories + food.nutrition.calories <= targetCalories * 1.2) {
          selectedFoods.push(food);
          currentCalories += food.nutrition.calories;
          if (currentCalories >= targetCalories * 0.8) break;
        }
      }
      
      const totalNutrition = selectedFoods.reduce(
        (acc, f) => ({
          calories: acc.calories + f.nutrition.calories,
          protein: acc.protein + f.nutrition.protein,
          fat: acc.fat + f.nutrition.fat,
          carbs: acc.carbs + f.nutrition.carbs
        }),
        { calories: 0, protein: 0, fat: 0, carbs: 0 }
      );
      
      const reasons: Record<GoalType, Record<string, string>> = {
        lose: {
          breakfast: '早餐选择高蛋白低脂，提供充足能量开启一天',
          lunch: '午餐营养均衡，蔬菜为主搭配适量蛋白质',
          dinner: '晚餐清淡为主，减少碳水摄入'
        },
        gain: {
          breakfast: '早餐补充优质蛋白和碳水，为训练储备能量',
          lunch: '午餐高蛋白高碳水，满足增肌需求',
          dinner: '晚餐持续补充蛋白质，促进肌肉恢复'
        },
        sugar: {
          breakfast: '早餐选择低GI主食，稳定血糖',
          lunch: '午餐控制碳水总量，增加膳食纤维',
          dinner: '晚餐减少主食，多吃蔬菜和蛋白质'
        },
        maintain: {
          breakfast: '早餐营养全面，提供一天所需能量',
          lunch: '午餐均衡搭配，满足日常活动需求',
          dinner: '晚餐适量清淡，避免过量摄入'
        }
      };
      
      plans.push({
        mealType,
        foods: selectedFoods,
        nutrition: totalNutrition,
        reason: reasons[profile.goal][mealType]
      });
    }
    
    setMealPlans(plans);
    setIsGenerating(false);
  };
  
  const handleSubmit = () => {
    const profile: UserProfile = {
      gender: form.gender as 'male' | 'female',
      height: form.height as number,
      weight: form.weight as number,
      age: form.age as number,
      goal: form.goal as GoalType,
      mealsPerDay: form.mealsPerDay as number,
      preferences: form.preferences || [],
      avoidances: form.avoidances || []
    };
    setUserProfile(profile);
    setShowForm(false);
  };
  
  const targetNutrition = userProfile ? calculateTargetNutrition(userProfile) : null;
  
  const mealTypeLabels: Record<string, string> = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐'
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">个性化饮食计划</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          根据你的身体数据和目标，AI生成专属食堂饮食计划
        </p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="mb-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h2 className="font-semibold text-gray-800 text-base sm:text-lg">个人信息</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Select
                  label="性别"
                  options={genderOptions}
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as 'male' | 'female' })}
                />
                <Input
                  label="年龄"
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  placeholder="20"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Input
                  label="身高(cm)"
                  type="number"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: Number(e.target.value) })}
                  placeholder="170"
                />
                <Input
                  label="体重(kg)"
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                  placeholder="60"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Select
                  label="饮食目标"
                  options={goalOptions}
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value as GoalType })}
                />
                <Select
                  label="每日餐数"
                  options={mealsPerDayOptions}
                  value={String(form.mealsPerDay)}
                  onChange={(e) => setForm({ ...form, mealsPerDay: Number(e.target.value) })}
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full mt-2" size="lg">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                生成饮食计划
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {userProfile && targetNutrition && (
              <>
                <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <h2 className="font-semibold text-gray-800 text-base sm:text-lg">
                        {goalOptions.find((o) => o.value === userProfile.goal)?.label}期每日目标
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                        {getGoalDescription(userProfile.goal)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowForm(true)}
                    >
                      修改
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                    <div className="p-2 sm:p-3 bg-white rounded-xl">
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">{targetNutrition.calories}</p>
                      <p className="text-xs text-gray-500">热量(kcal)</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white rounded-xl">
                      <p className="text-xl sm:text-2xl font-bold text-blue-600">{targetNutrition.protein}g</p>
                      <p className="text-xs text-gray-500">蛋白质</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white rounded-xl">
                      <p className="text-xl sm:text-2xl font-bold text-yellow-600">{targetNutrition.fat}g</p>
                      <p className="text-xs text-gray-500">脂肪</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-white rounded-xl">
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">{targetNutrition.carbs}g</p>
                      <p className="text-xs text-gray-500">碳水</p>
                    </div>
                  </div>
                </Card>
                
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">今日食堂用餐计划</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generatePlan(userProfile)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1" />
                    )}
                    重新生成
                  </Button>
                </div>
                
                {isGenerating ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-green-200" />
                      <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-gray-600 font-medium text-base sm:text-lg">AI正在生成计划...</p>
                    <p className="text-sm text-gray-400 mt-1">根据你的目标匹配最佳菜品</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {mealPlans.map((plan, index) => (
                      <motion.div
                        key={plan.mealType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() =>
                              setExpandedMeal(
                                expandedMeal === plan.mealType ? null : plan.mealType
                              )
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                                  plan.mealType === 'breakfast'
                                    ? 'bg-orange-100'
                                    : plan.mealType === 'lunch'
                                    ? 'bg-green-100'
                                    : 'bg-purple-100'
                                }`}
                              >
                                <span className="text-xl sm:text-2xl">
                                  {plan.mealType === 'breakfast'
                                    ? '🌅'
                                    : plan.mealType === 'lunch'
                                    ? '☀️'
                                    : '🌙'}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                                  {mealTypeLabels[plan.mealType]}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {plan.nutrition.calories}kcal · {plan.foods.length}道菜
                                </p>
                              </div>
                            </div>
                            {expandedMeal === plan.mealType ? (
                              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                            )}
                          </div>
                          
                          <AnimatePresence>
                            {expandedMeal === plan.mealType && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-gray-100"
                              >
                                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                  💡 {plan.reason}
                                </p>
                                <div className="space-y-2 sm:space-y-3 mb-4">
                                  {plan.foods.map((food) => (
                                    <div
                                      key={food.id}
                                      className="flex items-center gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
                                    >
                                      {food.image && (
                                        <img
                                          src={food.image}
                                          alt={food.name}
                                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover"
                                        />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                                          {food.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {food.nutrition.calories}kcal
                                        </p>
                                      </div>
                                      <HealthTags tags={food.healthTags.slice(0, 2)} />
                                    </div>
                                  ))}
                                </div>
                                <NutritionDisplay nutrition={plan.nutrition} compact />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    导出计划
                  </Button>
                  <Button className="flex-1">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    开始执行
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
