import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, TrendingUp, Target, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore, useTodayRecords } from '@/store';
import { formatDate, getWeekDates } from '@/utils/helpers';
import type { Nutrition } from '@/types';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export function RecordPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  
  const { mealRecords, userProfile } = useAppStore();
  const todayRecords = useTodayRecords();
  
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  
  const todayNutrition = todayRecords.reduce(
    (acc, r) => ({
      calories: acc.calories + r.nutrition.calories,
      protein: acc.protein + r.nutrition.protein,
      fat: acc.fat + r.nutrition.fat,
      carbs: acc.carbs + r.nutrition.carbs
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
  
  const targetNutrition: Nutrition = userProfile
    ? {
        calories: Math.round(10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + (userProfile.gender === 'male' ? 5 : -161)) * 1.55 - (userProfile.goal === 'lose' ? 400 : userProfile.goal === 'gain' ? -400 : 0),
        protein: 60,
        fat: 65,
        carbs: 300
      }
    : { calories: 2000, protein: 60, fat: 65, carbs: 300 };
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const getRecordsForDate = (date: string) => {
    return mealRecords.filter((r) => r.date === date);
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentDate(newDate);
  };
  
  const weeklyStats = useMemo(() => {
    const stats = {
      totalDays: 0,
     达标Days: 0,
      avgCalories: 0,
      totalRecords: 0
    };
    
    let totalCalories = 0;
    
    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      const records = getRecordsForDate(dateStr);
      if (records.length > 0) {
        stats.totalDays++;
        stats.totalRecords += records.length;
        const dayCalories = records.reduce((sum, r) => sum + r.nutrition.calories, 0);
        totalCalories += dayCalories;
        if (dayCalories >= targetNutrition.calories * 0.8 && dayCalories <= targetNutrition.calories * 1.2) {
          stats.达标Days++;
        }
      }
    });
    
    stats.avgCalories = stats.totalDays > 0 ? Math.round(totalCalories / stats.totalDays) : 0;
    
    return stats;
  }, [weekDates, mealRecords, targetNutrition]);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">我的饮食记录</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          追踪每日用餐，查看健康趋势报告
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-base sm:text-lg">今日摄入</h2>
            <span className="text-sm text-gray-500">{formatDate(new Date())}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="p-3 sm:p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base text-gray-600">热量</span>
                <span className="text-xs text-gray-400">
                  {getProgressPercentage(todayNutrition.calories, targetNutrition.calories)}%
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-orange-600">{todayNutrition.calories}</span>
                <span className="text-sm text-gray-400 mb-1">/ {targetNutrition.calories}kcal</span>
              </div>
              <div className="mt-2 h-2 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(todayNutrition.calories, targetNutrition.calories)}%` }}
                />
              </div>
            </div>
            
            <div className="p-3 sm:p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-base text-gray-600">蛋白质</span>
                <span className="text-xs text-gray-400">
                  {getProgressPercentage(todayNutrition.protein, targetNutrition.protein)}%
                </span>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">{todayNutrition.protein}g</span>
                <span className="text-sm text-gray-400 mb-1">/ {targetNutrition.protein}g</span>
              </div>
              <div className="mt-2 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(todayNutrition.protein, targetNutrition.protein)}%` }}
                />
              </div>
            </div>
          </div>
          
          {todayRecords.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-400">
              <CalendarIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
              <p className="text-sm sm:text-base">今天还没有记录</p>
              <p className="text-xs sm:text-sm">去分析菜品后保存记录吧</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm sm:text-base font-medium text-gray-800">
                      {record.mealType === 'breakfast' ? '🌅 早餐' : record.mealType === 'lunch' ? '☀️ 午餐' : '🌙 晚餐'}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 ml-2 block sm:inline truncate">
                      {record.foods.map((f) => f.name).join('、')}
                    </span>
                  </div>
                  <span className="text-sm sm:text-base text-gray-600 flex-shrink-0 ml-2">
                    {record.nutrition.calories}kcal
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 text-base sm:text-lg">本周概览</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-gray-400 py-1">
                {day}
              </div>
            ))}
            {weekDates.map((date) => {
              const dateStr = formatDate(date);
              const records = getRecordsForDate(dateStr);
              const isToday = dateStr === formatDate(new Date());
              const isSelected = dateStr === selectedDate;
              const hasRecords = records.length > 0;
              
              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : isToday
                      ? 'bg-green-50 text-green-600'
                      : hasRecords
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {hasRecords && !isSelected && (
                    <span className="w-1 h-1 bg-green-500 rounded-full mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-green-600">{weeklyStats.totalDays}</p>
              <p className="text-xs sm:text-sm text-gray-500">记录天数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{weeklyStats.avgCalories}</p>
              <p className="text-xs sm:text-sm text-gray-500">日均热量</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-orange-600">{weeklyStats.达标Days}</p>
              <p className="text-xs sm:text-sm text-gray-500">达标天数</p>
            </div>
          </div>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">
                {weeklyStats.totalDays >= 5 ? '太棒了！坚持记录！' : '继续加油！'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {weeklyStats.totalDays >= 5
                  ? '你本周已经记录了' + weeklyStats.totalDays + '天，保持这个好习惯，健康饮食从记录开始！'
                  : '每天记录饮食可以帮助你更好地了解自己的饮食习惯，建议每天至少记录一次。'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
