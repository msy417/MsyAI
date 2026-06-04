import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Food, MealRecord, DietPlan, ChatMessage, HealthTip } from '@/types';
import { generateId, formatDate } from '@/utils/helpers';

interface AppState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  
  analyzedFoods: Food[];
  addAnalyzedFood: (food: Food) => void;
  clearAnalyzedFoods: () => void;
  
  savedFoods: Food[];
  saveFood: (food: Food) => void;
  removeSavedFood: (foodId: string) => void;
  
  mealRecords: MealRecord[];
  addMealRecord: (record: MealRecord) => void;
  getMealRecordsByDate: (date: string) => MealRecord[];
  
  currentPlan: DietPlan | null;
  setCurrentPlan: (plan: DietPlan) => void;
  
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
  
  favoriteTips: string[];
  toggleFavoriteTip: (tipId: string) => void;
  isTipFavorite: (tipId: string) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      
      analyzedFoods: [],
      addAnalyzedFood: (food) =>
        set((state) => ({ analyzedFoods: [...state.analyzedFoods, food] })),
      clearAnalyzedFoods: () => set({ analyzedFoods: [] }),
      
      savedFoods: [],
      saveFood: (food) =>
        set((state) => ({
          savedFoods: state.savedFoods.find((f) => f.id === food.id)
            ? state.savedFoods
            : [...state.savedFoods, food]
        })),
      removeSavedFood: (foodId) =>
        set((state) => ({
          savedFoods: state.savedFoods.filter((f) => f.id !== foodId)
        })),
      
      mealRecords: [],
      addMealRecord: (record) =>
        set((state) => ({ mealRecords: [...state.mealRecords, record] })),
      getMealRecordsByDate: (date) => {
        return get().mealRecords.filter((r) => r.date === date);
      },
      
      currentPlan: null,
      setCurrentPlan: (plan) => set({ currentPlan: plan }),
      
      chatMessages: [],
      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            {
              ...message,
              id: generateId(),
              timestamp: new Date()
            }
          ]
        })),
      clearChatMessages: () => set({ chatMessages: [] }),
      
      favoriteTips: [],
      toggleFavoriteTip: (tipId) =>
        set((state) => ({
          favoriteTips: state.favoriteTips.includes(tipId)
            ? state.favoriteTips.filter((id) => id !== tipId)
            : [...state.favoriteTips, tipId]
        })),
      isTipFavorite: (tipId) => get().favoriteTips.includes(tipId)
    }),
    {
      name: 'canteen-nutrition-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        savedFoods: state.savedFoods,
        mealRecords: state.mealRecords,
        favoriteTips: state.favoriteTips
      })
    }
  )
);

export function useTodayRecords(): MealRecord[] {
  const { mealRecords } = useAppStore();
  const today = formatDate(new Date());
  return mealRecords.filter((r) => r.date === today);
}
