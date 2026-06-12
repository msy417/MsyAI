import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  FileText,
  Upload,
  Loader2,
  Check,
  Share2,
  BookmarkPlus,
  ArrowRight,
  Plus,
  X,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Edit3,
  Save,
  Trash2,
  Wand2,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Info,
  Menu,
  ListOrdered
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Input';
import { NutritionDisplay } from '@/components/features/NutritionDisplay';
import { HealthTags } from '@/components/features/HealthTag';
import { foods } from '@/data/foods';
import { useAppStore } from '@/store';
import type { Food } from '@/types';

type InputMode = 'photo' | 'text';
type TextInputMode = 'single' | 'batch';
type PortionSize = 'small' | 'medium' | 'large';
type SaveCategory = 'campus' | 'home' | 'favorite' | 'custom';

const PORTION_MULTIPLIER: Record<PortionSize, number> = {
  small: 0.7,
  medium: 1.0,
  large: 1.3
};

const PORTION_LABELS: Record<PortionSize, string> = {
  small: '小份',
  medium: '中份',
  large: '大份'
};

const CATEGORY_LABELS: Record<SaveCategory, string> = {
  campus: '食堂菜品',
  home: '家常菜',
  favorite: '我的最爱',
  custom: '自定义'
};

const COOKING_METHODS = ['清蒸', '红烧', '炒', '煮', '炸', '凉拌', '蒸', '焖', '烤'];
const COMMON_INGREDIENTS = ['猪肉', '牛肉', '鸡肉', '鱼肉', '虾', '蛋', '豆腐', '青菜', '白菜', '土豆', '番茄', '黄瓜', '茄子', '豆芽'];

const QUICK_MENU_EXAMPLES = [
  { name: '营养均衡套餐', items: ['米饭', '清蒸鱼', '清炒时蔬'] },
  { name: '减脂友好套餐', items: ['小米粥', '蒸蛋羹', '凉拌黄瓜', '清炒时蔬'] },
  { name: '家常套餐', items: ['米饭', '番茄炒蛋', '土豆丝'] },
  { name: '高蛋白套餐', items: ['米饭', '宫保鸡丁', '麻婆豆腐'] }
];

// 模糊匹配算法
function fuzzyMatch(input: string, target: string): number {
  const a = input.toLowerCase().trim();
  const b = target.toLowerCase().trim();
  if (!a || !b) return 0;
  if (a.includes(b) || b.includes(a)) return 1;

  let matchCount = 0;
  const chars = new Set(b);
  for (const c of a) {
    if (chars.has(c)) matchCount++;
  }
  return matchCount / Math.max(a.length, b.length);
}

// 解析单行菜单
function parseMenuLine(line: string): { name: string; portion: PortionSize; quantity: number } {
  let text = line.trim();
  let portion: PortionSize = 'medium';
  let quantity = 1;

  if (text.includes('小份') || text.includes('小') || text.includes('半份')) {
    portion = 'small';
    text = text.replace(/(小份|半份|小)/g, '').trim();
  } else if (text.includes('大份') || text.includes('大') || text.includes('加量')) {
    portion = 'large';
    text = text.replace(/(大份|加量|大)/g, '').trim();
  }

  const qtyMatch = text.match(/(\d+)\s*(份|个|碗|盘|碟)?/);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
    text = text.replace(qtyMatch[0], '').trim();
  }

  text = text.replace(/[、，。,.:：\-\s]+$/g, '').trim();
  return { name: text, portion, quantity };
}

// 查找匹配菜品
function findMatchingFood(input: string): { food: Food | null; score: number; portion: PortionSize; quantity: number } {
  const { name, portion, quantity } = parseMenuLine(input);
  if (!name) return { food: null, score: 0, portion, quantity };

  let bestFood: Food | null = null;
  let bestScore = 0;

  for (const food of foods) {
    const score = fuzzyMatch(name, food.name);
    let ingredientScore = 0;
    for (const ing of food.ingredients || []) {
      if (name.includes(ing)) ingredientScore += 0.3;
    }
    const finalScore = Math.max(score, ingredientScore);

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestFood = food;
    }
  }

  if (bestScore < 0.4) {
    return { food: null, score: bestScore, portion, quantity };
  }

  return { food: bestFood, score: bestScore, portion, quantity };
}

// 智能纠错建议
function getSuggestions(unmatchedText: string): string[] {
  if (!unmatchedText) return [];

  const suggestions: string[] = [];

  for (const food of foods) {
    if (fuzzyMatch(unmatchedText, food.name) >= 0.5) {
      suggestions.push(food.name);
    }
  }

  return suggestions.slice(0, 3);
}

interface SingleFoodInput {
  id: string;
  name: string;
  mainIngredient: string;
  cookingMethod: string;
  portion: PortionSize;
  quantity: number;
}

interface AnalyzedItem {
  id: string;
  originalInput: string;
  matchedFood: Food | null;
  portion: PortionSize;
  quantity: number;
  isSelected: boolean;
  userModified: boolean;
}

interface SaveDialogData {
  isOpen: boolean;
  itemId: string | null;
  customName: string;
  category: SaveCategory;
  customCategory: string;
}

export function AnalyzePage() {
  const [mode, setMode] = useState<InputMode>('photo');
  const [textMode, setTextMode] = useState<TextInputMode>('batch');
  const [menuText, setMenuText] = useState('');
  const [singleInputs, setSingleInputs] = useState<SingleFoodInput[]>([
    { id: '1', name: '', mainIngredient: '', cookingMethod: '', portion: 'medium', quantity: 1 }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedItems, setAnalyzedItems] = useState<AnalyzedItem[]>([]);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isOCRProcessing, setIsOCRProcessing] = useState(false);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [saveDialog, setSaveDialog] = useState<SaveDialogData>({
    isOpen: false,
    itemId: null,
    customName: '',
    category: 'campus',
    customCategory: ''
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageQuality, setImageQuality] = useState<'good' | 'poor' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  const { saveFood } = useAppStore();

  const selectedItems = useMemo(
    () => analyzedItems.filter((item) => item.isSelected && item.matchedFood),
    [analyzedItems]
  );

  const totalNutrition = useMemo(() => {
    return selectedItems.reduce(
      (acc, item) => {
        if (!item.matchedFood) return acc;
        const multiplier = PORTION_MULTIPLIER[item.portion] * item.quantity;
        return {
          calories: acc.calories + item.matchedFood.nutrition.calories * multiplier,
          protein: acc.protein + item.matchedFood.nutrition.protein * multiplier,
          fat: acc.fat + item.matchedFood.nutrition.fat * multiplier,
          carbs: acc.carbs + item.matchedFood.nutrition.carbs * multiplier
        };
      },
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [selectedItems]);

  const displayTotal = {
    calories: Math.round(totalNutrition.calories),
    protein: Math.round(totalNutrition.protein),
    fat: Math.round(totalNutrition.fat),
    carbs: Math.round(totalNutrition.carbs)
  };

  const matchedCount = analyzedItems.filter((i) => i.matchedFood).length;
  const unmatchedCount = analyzedItems.filter((i) => !i.matchedFood).length;

  // 添加单个菜品输入
  const addSingleInput = () => {
    setSingleInputs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        mainIngredient: '',
        cookingMethod: '',
        portion: 'medium',
        quantity: 1
      }
    ]);
  };

  // 删除单个菜品输入
  const removeSingleInput = (id: string) => {
    if (singleInputs.length > 1) {
      setSingleInputs((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // 更新单个输入
  const updateSingleInput = (id: string, field: keyof SingleFoodInput, value: string | number | PortionSize) => {
    setSingleInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // OCR处理（模拟）
  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOCRProcessing(true);
    setOcrPreview(URL.createObjectURL(file));

    // 模拟OCR处理
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 模拟识别结果
    const mockOCRResult = '米饭\n红烧肉\n清蒸鱼\n番茄炒蛋\n清炒时蔬';
    setMenuText(mockOCRResult);
    setIsOCRProcessing(false);
    setTextMode('batch');
  };

  // 照片上传处理
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 显示预览
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 模拟上传进度
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // 模拟图片质量检测
    setTimeout(() => {
      setImageQuality(Math.random() > 0.3 ? 'good' : 'poor');
    }, 1500);
  };

  // 分析处理
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalyzedItems([]);
    setShowGuide(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const items: AnalyzedItem[] = [];

    if (mode === 'text') {
      if (textMode === 'single') {
        // 单菜品模式
        for (const input of singleInputs) {
          if (!input.name.trim()) continue;

          const match = findMatchingFood(input.name);
          let matchedFood = match.food;

          // 如果没匹配到，尝试用食材和烹饪方式组合
          if (!matchedFood && input.mainIngredient) {
            const combined = `${input.name}${input.mainIngredient}${input.cookingMethod}`;
            const combinedMatch = findMatchingFood(combined);
            if (combinedMatch.score >= 0.3) {
              matchedFood = combinedMatch.food;
            }
          }

          items.push({
            id: `item-${Date.now()}-${Math.random()}`,
            originalInput: input.name,
            matchedFood,
            portion: input.portion,
            quantity: input.quantity,
            isSelected: !!matchedFood,
            userModified: false
          });
        }
      } else {
        // 批量模式
        const lines = menuText.split(/[\n、，,;；]+/).filter((l) => l.trim());
        for (const line of lines) {
          const match = findMatchingFood(line);
          items.push({
            id: `item-${Date.now()}-${Math.random()}`,
            originalInput: line.trim(),
            matchedFood: match.food,
            portion: match.portion,
            quantity: match.quantity,
            isSelected: !!match.food,
            userModified: false
          });
        }
      }
    } else {
      // 照片模式
      const randomFoods = [...foods].sort(() => Math.random() - 0.5).slice(0, 3);
      randomFoods.forEach((food) => {
        items.push({
          id: `item-${Date.now()}-${Math.random()}`,
          originalInput: food.name,
          matchedFood: food,
          portion: 'medium',
          quantity: 1,
          isSelected: true,
          userModified: false
        });
      });
    }

    setAnalyzedItems(items);
    setImagePreview(null);
    setUploadProgress(0);
    setImageQuality(null);
    setIsAnalyzing(false);
  };

  const toggleItemSelection = (id: string) => {
    setAnalyzedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSelected: !item.isSelected } : item))
    );
  };

  const updateItemPortion = (id: string, portion: PortionSize) => {
    setAnalyzedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, portion, userModified: true } : item))
    );
  };

  const updateItemQuantity = (id: string, delta: number) => {
    setAnalyzedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta), userModified: true } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setAnalyzedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const selectAllMatched = () => {
    setAnalyzedItems((prev) =>
      prev.map((item) => ({ ...item, isSelected: !!item.matchedFood }))
    );
  };

  const clearSelection = () => {
    setAnalyzedItems((prev) => prev.map((item) => ({ ...item, isSelected: false })));
  };

  const handleSaveSelected = () => {
    if (selectedItems.length === 1) {
      setSaveDialog({
        isOpen: true,
        itemId: selectedItems[0].id,
        customName: selectedItems[0].matchedFood?.name || '',
        category: 'campus',
        customCategory: ''
      });
    } else {
      // 批量保存
      selectedItems.forEach((item) => {
        if (item.matchedFood) {
          saveFood(item.matchedFood);
        }
      });
    }
  };

  const confirmSave = () => {
    const item = analyzedItems.find((i) => i.id === saveDialog.itemId);
    if (item?.matchedFood) {
      const foodToSave = {
        ...item.matchedFood,
        name: saveDialog.customName || item.matchedFood.name,
        category: saveDialog.category === 'custom'
          ? saveDialog.customCategory
          : CATEGORY_LABELS[saveDialog.category]
      };
      saveFood(foodToSave);
    }
    setSaveDialog({
      isOpen: false,
      itemId: null,
      customName: '',
      category: 'campus',
      customCategory: ''
    });
  };

  const handleQuickMenuSelect = (example: { name: string; items: string[] }) => {
    setMenuText(example.items.join('\n'));
    setShowQuickMenu(false);
  };

  const handleRetryPhoto = () => {
    setImagePreview(null);
    setUploadProgress(0);
    setImageQuality(null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAnalyze = useMemo(() => {
    if (mode === 'photo') {
      return !!imagePreview && uploadProgress === 100 && imageQuality === 'good';
    } else {
      if (textMode === 'single') {
        return singleInputs.some((input) => input.name.trim());
      } else {
        return menuText.trim();
      }
    }
  }, [mode, imagePreview, uploadProgress, imageQuality, textMode, singleInputs, menuText]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* 首次使用引导 */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                欢迎使用菜品营养分析
              </h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="font-medium text-gray-800">上传照片或输入菜单</p>
                    <p className="text-sm">支持拍照上传或手动输入菜品名称</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="font-medium text-gray-800">AI智能分析</p>
                    <p className="text-sm">自动识别菜品并计算营养数据</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="font-medium text-gray-800">保存到菜品库</p>
                    <p className="text-sm">一键保存，方便后续快速调用</p>
                  </div>
                </div>
              </div>
              <Button onClick={() => setShowGuide(false)} className="w-full mt-6">
                开始使用
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 保存对话框 */}
      <AnimatePresence>
        {saveDialog.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSaveDialog({ ...saveDialog, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Save className="w-5 h-5 text-green-500" />
                保存到菜品库
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">菜品名称</label>
                  <input
                    type="text"
                    value={saveDialog.customName}
                    onChange={(e) => setSaveDialog({ ...saveDialog, customName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="输入菜品名称"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(CATEGORY_LABELS) as SaveCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSaveDialog({ ...saveDialog, category: cat })}
                        className={`p-2 rounded-lg border transition-colors ${
                          saveDialog.category === cat
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : 'border-gray-200 text-gray-600 hover:border-green-300'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                      </button>
                    ))}
                  </div>
                </div>
                {saveDialog.category === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">自定义分类名称</label>
                    <input
                      type="text"
                      value={saveDialog.customCategory}
                      onChange={(e) => setSaveDialog({ ...saveDialog, customCategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="输入分类名称"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setSaveDialog({ ...saveDialog, isOpen: false })} className="flex-1">
                  取消
                </Button>
                <Button onClick={confirmSave} className="flex-1">
                  确认保存
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 标题 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">菜品营养分析</h1>
          <button
            onClick={() => setShowGuide(true)}
            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <Info className="w-4 h-4" />
            使用指南
          </button>
        </div>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          上传菜品照片或输入菜单文字，AI自动识别并估算营养数据
        </p>
      </motion.div>

      {/* 输入模式切换 */}
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
              mode === 'photo' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            上传照片
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
              mode === 'text' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            输入菜单
          </button>
        </div>
      </motion.div>

      {/* 输入区域 */}
      <AnimatePresence mode="wait">
        {mode === 'photo' ? (
          <motion.div
            key="photo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-6">
              {!imagePreview ? (
                <>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 sm:p-8 text-center hover:border-green-400 transition-colors cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                      <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />
                    </div>
                    <p className="text-gray-600 font-medium mb-1 text-base sm:text-lg">点击上传菜品照片</p>
                    <p className="text-sm text-gray-400">支持拍照或从相册选择</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                    <span>拍照上传</span>
                    <span>相册选择</span>
                    <span>多图上传</span>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* 图片预览 */}
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    {uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                          <p>上传中 {uploadProgress}%</p>
                        </div>
                      </div>
                    )}
                    {uploadProgress === 100 && imageQuality && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {imageQuality === 'good' ? (
                          <div className="text-white text-center">
                            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <p className="text-sm">图片质量良好</p>
                          </div>
                        ) : (
                          <div className="text-white text-center">
                            <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                            <p className="text-sm mb-2">图片质量较差</p>
                            <Button size="sm" variant="outline" onClick={handleRetryPhoto} className="text-white border-white hover:bg-white/20">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              重新上传
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setImagePreview(null); setUploadProgress(0); }} className="flex-1">
                      <X className="w-4 h-4 mr-1" />
                      移除
                    </Button>
                    <Button size="sm" onClick={() => fileInputRef.current?.click()} className="flex-1">
                      <Upload className="w-4 h-4 mr-1" />
                      重新上传
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 text-center mt-3">
                提示：尽量将菜品置于画面中央，避免过度模糊或背光
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
            {/* 单品/批量切换 */}
            <div className="mb-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg inline-flex">
                <button
                  onClick={() => setTextMode('single')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    textMode === 'single' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  单品输入
                </button>
                <button
                  onClick={() => setTextMode('batch')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    textMode === 'batch' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <ListOrdered className="w-4 h-4" />
                  批量输入
                </button>
              </div>
            </div>

            {textMode === 'single' ? (
              /* 单品输入模式 */
              <div className="space-y-4 mb-4">
                {singleInputs.map((input, index) => (
                  <Card key={input.id} className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-sm font-medium text-gray-500">菜品 {index + 1}</span>
                      {singleInputs.length > 1 && (
                        <button
                          onClick={() => removeSingleInput(input.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">菜品名称 *</label>
                        <input
                          type="text"
                          value={input.name}
                          onChange={(e) => updateSingleInput(input.id, 'name', e.target.value)}
                          placeholder="例如：红烧肉"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">主要食材</label>
                          <select
                            value={input.mainIngredient}
                            onChange={(e) => updateSingleInput(input.id, 'mainIngredient', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="">选择食材</option>
                            {COMMON_INGREDIENTS.map((ing) => (
                              <option key={ing} value={ing}>{ing}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">烹饪方式</label>
                          <select
                            value={input.cookingMethod}
                            onChange={(e) => updateSingleInput(input.id, 'cookingMethod', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="">选择方式</option>
                            {COOKING_METHODS.map((method) => (
                              <option key={method} value={method}>{method}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">份量</label>
                          <select
                            value={input.portion}
                            onChange={(e) => updateSingleInput(input.id, 'portion', e.target.value as PortionSize)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          >
                            <option value="small">小份</option>
                            <option value="medium">中份</option>
                            <option value="large">大份</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">数量</label>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateSingleInput(input.id, 'quantity', Math.max(1, input.quantity - 1))}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="flex-1 text-center text-sm">{input.quantity}</span>
                            <button
                              onClick={() => updateSingleInput(input.id, 'quantity', input.quantity + 1)}
                              className="px-3 py-2 hover:bg-gray-100 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                <Button variant="outline" onClick={addSingleInput} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  添加更多菜品
                </Button>
              </div>
            ) : (
              /* 批量输入模式 */
              <>
                <Card className="mb-4">
                  <Textarea
                    value={menuText}
                    onChange={(e) => setMenuText(e.target.value)}
                    placeholder="输入食堂菜单，每行一道菜&#10;支持以下格式：&#10;• 红烧肉&#10;• 小份米饭&#10;• 2份清蒸鱼&#10;• 番茄炒蛋、清炒时蔬（用顿号分隔）"
                    className="min-h-[150px] sm:min-h-[180px]"
                  />

                  {/* OCR上传 */}
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => ocrInputRef.current?.click()}
                      disabled={isOCRProcessing}
                      className="flex-1"
                    >
                      {isOCRProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          OCR识别中...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-4 h-4 mr-2" />
                          上传菜单图片（OCR）
                        </>
                      )}
                    </Button>
                    <input
                      ref={ocrInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleOCRUpload}
                    />
                  </div>

                  {ocrPreview && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Wand2 className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-700 font-medium mb-1">OCR识别结果</p>
                          <p className="text-xs text-blue-600 mb-2">已自动填充以下菜品，可手动编辑修改：</p>
                          <div className="text-xs text-blue-600 bg-white p-2 rounded border border-blue-200">
                            {menuText.split('\n').map((item, i) => (
                              <div key={i}>• {item}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 快捷示例 */}
                  <div className="mt-3">
                    <button
                      onClick={() => setShowQuickMenu(!showQuickMenu)}
                      className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>试试经典套餐组合</span>
                      {showQuickMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {showQuickMenu && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 grid grid-cols-2 gap-2 overflow-hidden"
                        >
                          {QUICK_MENU_EXAMPLES.map((example) => (
                            <button
                              key={example.name}
                              onClick={() => handleQuickMenuSelect(example)}
                              className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
                            >
                              <div className="text-sm font-medium text-green-700 mb-1 group-hover:text-green-800">
                                {example.name}
                              </div>
                              <div className="text-xs text-green-600 line-clamp-2">
                                {example.items.join('、')}
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    提示：支持识别份量（小份/中份/大份）和数量（如"2份"）
                  </p>
                </Card>

                {/* 可识别菜品提示 */}
                <Card className="mb-4 bg-gray-50">
                  <div className="text-xs text-gray-500">
                    <div className="flex items-start gap-2">
                      <Search className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <div>
                        <span className="font-medium text-gray-600">当前可识别 {foods.length} 种菜品</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {foods.slice(0, 10).map((f) => (
                            <span key={f.id} className="bg-white px-2 py-0.5 rounded text-gray-600">
                              {f.name}
                            </span>
                          ))}
                          {foods.length > 10 && (
                            <span className="text-gray-400">...等{foods.length}种</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分析按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !canAnalyze}
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
              <Wand2 className="w-5 h-5 mr-2" />
              开始分析
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        {!canAnalyze && (
          <p className="text-xs text-gray-400 text-center mt-2">
            {mode === 'photo'
              ? '请先上传菜品照片'
              : textMode === 'single'
                ? '请至少输入一个菜品名称'
                : '请输入菜单内容'}
          </p>
        )}
      </motion.div>

      {/* 分析中动画 */}
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

      {/* 分析结果 */}
      <AnimatePresence>
        {analyzedItems.length > 0 && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* 结果标题和统计 */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">分析结果</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  共识别 {matchedCount} 道 · 未匹配 {unmatchedCount} 道 · 已选 {selectedItems.length} 道
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAllMatched}>
                  全选已匹配
                </Button>
                <Button variant="ghost" size="sm" onClick={clearSelection}>
                  清空选择
                </Button>
              </div>
            </div>

            {/* 未匹配提示与纠错建议 */}
            {unmatchedCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-xl"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-700 font-medium mb-1">
                      有 {unmatchedCount} 项未能匹配到数据库中的菜品
                    </p>
                    {analyzedItems
                      .filter((i) => !i.matchedFood)
                      .map((item) => {
                        const suggestions = getSuggestions(item.originalInput);
                        return (
                          <div key={item.id} className="mt-2">
                            <p className="text-sm text-amber-600">
                              "{item.originalInput}" - 是否有以下菜品？
                            </p>
                            {suggestions.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {suggestions.map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    onClick={() => {
                                      const match = findMatchingFood(suggestion);
                                      setAnalyzedItems((prev) =>
                                        prev.map((i) =>
                                          i.id === item.id
                                            ? { ...i, matchedFood: match.food, isSelected: !!match.food }
                                            : i
                                        )
                                      );
                                    }}
                                    className="text-xs bg-white px-2 py-1 rounded border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 菜品列表 */}
            <div className="space-y-3 sm:space-y-4 mb-6">
              {analyzedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover={!!item.matchedFood}
                    onClick={() => item.matchedFood && toggleItemSelection(item.id)}
                    className={`transition-all ${
                      item.isSelected
                        ? 'ring-2 ring-green-500 bg-green-50'
                        : item.matchedFood
                          ? ''
                          : 'bg-gray-50 opacity-70'
                    } ${item.matchedFood ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {item.matchedFood?.image && (
                        <img
                          src={item.matchedFood.image}
                          alt={item.matchedFood.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {item.matchedFood ? (
                              <>
                                <h3 className="font-semibold text-gray-800 text-base sm:text-lg flex items-center gap-2">
                                  {item.matchedFood.name}
                                  {item.quantity > 1 && (
                                    <span className="text-green-600 text-sm">×{item.quantity}</span>
                                  )}
                                  {item.userModified && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                      已调整
                                    </span>
                                  )}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                  {item.matchedFood.cookingMethod} · {item.matchedFood.category}
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="font-semibold text-gray-600 text-base sm:text-lg flex items-center gap-2">
                                  <span className="line-through">{item.originalInput}</span>
                                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                    未匹配
                                  </span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                  请检查菜名或调整输入
                                </p>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {item.matchedFood && (
                              <div
                                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  item.isSelected
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {item.isSelected && (
                                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                )}
                              </div>
                            )}
                            {analyzedItems.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeItem(item.id);
                                }}
                                className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {item.matchedFood && (
                          <>
                            <HealthTags tags={item.matchedFood.healthTags} className="mt-2" />

                            <div className="mt-2 text-xs sm:text-sm text-gray-500">
                              {item.portion !== 'medium' && (
                                <span className="text-green-600 mr-2">
                                  [{PORTION_LABELS[item.portion]}]
                                </span>
                              )}
                              {Math.round(item.matchedFood.nutrition.calories * PORTION_MULTIPLIER[item.portion] * item.quantity)}kcal
                              {' · '}
                              P{Math.round(item.matchedFood.nutrition.protein * PORTION_MULTIPLIER[item.portion] * item.quantity)}g
                              {' · '}
                              F{Math.round(item.matchedFood.nutrition.fat * PORTION_MULTIPLIER[item.portion] * item.quantity)}g
                              {' · '}
                              C{Math.round(item.matchedFood.nutrition.carbs * PORTION_MULTIPLIER[item.portion] * item.quantity)}g
                            </div>

                            <div
                              className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="text-gray-500 mr-1">份量：</span>
                              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                                {(['small', 'medium', 'large'] as PortionSize[]).map((p) => (
                                  <button
                                    key={p}
                                    onClick={() => updateItemPortion(item.id, p)}
                                    className={`px-2 py-1 transition-colors ${
                                      item.portion === p
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    {PORTION_LABELS[p]}
                                  </button>
                                ))}
                              </div>

                              <span className="text-gray-500 ml-2 mr-1">数量：</span>
                              <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                  onClick={() => updateItemQuantity(item.id, -1)}
                                  className="px-2 py-1 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 bg-gray-50 text-gray-700 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateItemQuantity(item.id, 1)}
                                  className="px-2 py-1 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 重新分析按钮 */}
            <Card
              hover
              onClick={() => {
                setAnalyzedItems([]);
              }}
              className="mb-6 border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors text-center py-4"
            >
              <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-green-600 transition-colors">
                <Plus className="w-5 h-5" />
                <span className="font-medium">继续添加菜品</span>
              </div>
            </Card>

            {/* 总营养统计 */}
            {selectedItems.length > 0 && (
              <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="font-semibold text-gray-800 mb-3 text-base sm:text-lg">
                  选中菜品总营养
                  <span className="text-sm font-normal text-gray-500 ml-2">（{selectedItems.length} 道菜）</span>
                </h3>
                <NutritionDisplay nutrition={displayTotal} showBar={false} />
              </Card>
            )}

            {/* 操作按钮 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSaveSelected} disabled={selectedItems.length === 0} className="flex-1">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  保存到菜品库
                </Button>
                <Button variant="outline" disabled={selectedItems.length === 0} className="flex-1">
                  <Menu className="w-4 h-4 mr-2" />
                  添加到饮食计划
                </Button>
              </div>
              <Button variant="ghost" disabled={selectedItems.length === 0} className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                分享分析结果
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-4">
              * 数据为估算值，仅供参考，不构成医疗建议。实际营养含量可能因烹饪方法、食材来源等因素而异。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
