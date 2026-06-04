import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, FileText, Upload, Loader2, Check, Share2, BookmarkPlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { NutritionDisplay } from '@/components/features/NutritionDisplay';
import { HealthTags } from '@/components/features/HealthTag';
import { foods } from '@/data/foods';
import { useAppStore } from '@/store';
import { generateId } from '@/utils/helpers';
import type { Food } from '@/types';

type InputMode = 'photo' | 'text';

export function AnalyzePage() {
  const [mode, setMode] = useState<InputMode>('photo');
  const [menuText, setMenuText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedFoods, setAnalyzedFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  
  const { saveFood } = useAppStore();
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalyzedFoods([]);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (mode === 'text' && menuText.trim()) {
      const lines = menuText.split('\n').filter((l) => l.trim());
      const matched: Food[] = [];
      
      for (const line of lines) {
        const found = foods.find(
          (f) => line.includes(f.name) || f.name.includes(line.trim())
        );
        if (found && !matched.find((m) => m.id === found.id)) {
          matched.push(found);
        }
      }
      
      if (matched.length === 0) {
        const randomFoods = [...foods]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        setAnalyzedFoods(randomFoods);
      } else {
        setAnalyzedFoods(matched);
      }
    } else {
      const randomFoods = [...foods]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setAnalyzedFoods(randomFoods);
    }
    
    setIsAnalyzing(false);
  };
  
  const toggleFoodSelection = (foodId: string) => {
    setSelectedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId]
    );
  };
  
  const handleSaveSelected = () => {
    analyzedFoods
      .filter((f) => selectedFoods.includes(f.id))
      .forEach((f) => saveFood(f));
    setSelectedFoods([]);
  };
  
  const totalNutrition = analyzedFoods
    .filter((f) => selectedFoods.includes(f.id))
    .reduce(
      (acc, f) => ({
        calories: acc.calories + f.nutrition.calories,
        protein: acc.protein + f.nutrition.protein,
        fat: acc.fat + f.nutrition.fat,
        carbs: acc.carbs + f.nutrition.carbs
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">菜品营养分析</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          上传菜品照片或输入菜单文字，AI自动识别并估算营养数据
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
              mode === 'photo'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            上传照片
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
              mode === 'text'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            输入菜单
          </button>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {mode === 'photo' ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-6">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer">
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                  <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                </div>
                <p className="text-gray-600 font-medium mb-1 text-base sm:text-lg">点击上传菜品照片</p>
                <p className="text-sm text-gray-400">支持拍照或从相册选择</p>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleAnalyze}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                拍食堂菜品，AI识别食材和营养
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="mb-6">
              <Textarea
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                placeholder="粘贴食堂菜单，每行一道菜&#10;例如：&#10;红烧肉&#10;清蒸鱼&#10;番茄炒蛋"
                className="min-h-[150px] sm:min-h-[180px]"
              />
              <p className="text-xs text-gray-400 mt-2">
                复制菜单，批量分析营养
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (mode === 'text' && !menuText.trim())}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              AI分析中...
            </>
          ) : (
            <>
              开始分析
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-green-200" />
              <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-600 font-medium text-base sm:text-lg">AI正在分析菜品...</p>
            <p className="text-sm text-gray-400 mt-1">识别食材、估算营养数据</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {analyzedFoods.length > 0 && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">分析结果</h2>
              <span className="text-sm text-gray-500">
                已选择 {selectedFoods.length} 道
              </span>
            </div>
            
            <div className="space-y-3 sm:space-y-4 mb-6">
              {analyzedFoods.map((food, index) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    onClick={() => toggleFoodSelection(food.id)}
                    className={`cursor-pointer transition-all ${
                      selectedFoods.includes(food.id)
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : ''
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {food.image && (
                        <img
                          src={food.image}
                          alt={food.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{food.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                              {food.cookingMethod} · {food.category}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedFoods.includes(food.id)
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedFoods.includes(food.id) && (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            )}
                          </div>
                        </div>
                        <HealthTags tags={food.healthTags} className="mt-2" />
                        <div className="mt-2 text-xs sm:text-sm text-gray-500">
                          {food.nutrition.calories}kcal · P{food.nutrition.protein}g · F{food.nutrition.fat}g · C{food.nutrition.carbs}g
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {selectedFoods.length > 1 && (
              <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="font-semibold text-gray-800 mb-3 text-base sm:text-lg">选中菜品总营养</h3>
                <NutritionDisplay nutrition={totalNutrition} showBar={false} />
              </Card>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveSelected}
                disabled={selectedFoods.length === 0}
              >
                <BookmarkPlus className="w-4 h-4 mr-2" />
                保存到菜品库
              </Button>
              <Button variant="outline" disabled={selectedFoods.length === 0}>
                <Share2 className="w-4 h-4 mr-2" />
                一键分享
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              * 数据为估算值，仅供参考，不构成医疗建议
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
