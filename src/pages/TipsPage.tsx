import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, AlertCircle, Heart, Share2, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { healthTips } from '@/data/foods';
import { useAppStore } from '@/store';
import type { HealthTip } from '@/types';

const categoryIcons = {
  tips: Lightbulb,
  guide: BookOpen,
  myth: AlertCircle
};

const categoryLabels = {
  tips: '用餐技巧',
  guide: '饮食指南',
  myth: '误区解答'
};

const categoryColors = {
  tips: 'bg-yellow-100 text-yellow-600',
  guide: 'bg-blue-100 text-blue-600',
  myth: 'bg-red-100 text-red-600'
};

export function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const { favoriteTips, toggleFavoriteTip, isTipFavorite } = useAppStore();
  
  const filteredTips = healthTips.filter((tip) => {
    if (activeCategory && tip.category !== activeCategory) return false;
    if (activeGoal && tip.targetGoal !== activeGoal) return false;
    return true;
  });
  
  const handleToggleFavorite = (tipId: string) => {
    toggleFavoriteTip(tipId);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">校园健康小贴士</h1>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          食堂用餐技巧、分目标饮食指南、常见误区解答
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
              activeCategory === null
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? null : key)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all ${
                activeCategory === key
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
          <button
            onClick={() => setActiveGoal(null)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeGoal === null
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            全部目标
          </button>
          {['lose', 'gain', 'sugar'].map((goal) => {
            const labels: Record<string, string> = {
              lose: '减脂',
              gain: '增肌',
              sugar: '控糖'
            };
            return (
              <button
                key={goal}
                onClick={() => setActiveGoal(activeGoal === goal ? null : goal)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeGoal === goal
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {labels[goal]}
              </button>
            );
          })}
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredTips.length === 0 ? (
          <Card className="text-center py-8 sm:py-12">
            <Lightbulb className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-2 sm:mb-3" />
            <p className="text-gray-500 text-base sm:text-lg">暂无相关内容</p>
          </Card>
        ) : (
          filteredTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <TipCard
                tip={tip}
                isFavorite={isTipFavorite(tip.id)}
                onToggleFavorite={() => handleToggleFavorite(tip.id)}
              />
            </motion.div>
          ))
        )}
      </motion.div>
      
      {favoriteTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-10"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">我的收藏</h2>
          <div className="space-y-4">
            {healthTips
              .filter((tip) => favoriteTips.includes(tip.id))
              .map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(tip.id)}
                />
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface TipCardProps {
  tip: HealthTip;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function TipCard({ tip, isFavorite, onToggleFavorite }: TipCardProps) {
  const Icon = categoryIcons[tip.category];
  
  const goalLabels: Record<string, string> = {
    lose: '减脂',
    gain: '增肌',
    sugar: '控糖'
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[tip.category]}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
            <span className={`text-xs sm:text-sm px-2 py-0.5 rounded-full ${categoryColors[tip.category]}`}>
              {categoryLabels[tip.category]}
            </span>
            {tip.targetGoal && (
              <span className="text-xs sm:text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {goalLabels[tip.targetGoal]}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 text-base sm:text-lg">{tip.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">{tip.content}</p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
          className={isFavorite ? 'text-red-500' : ''}
        >
          <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? '已收藏' : '收藏'}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-4 h-4 mr-1" />
          分享
        </Button>
      </div>
    </Card>
  );
}
