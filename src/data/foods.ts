import type { Food, HealthTip } from '@/types';

export const foods: Food[] = [
  {
    id: '1',
    name: '红烧肉',
    ingredients: ['五花肉', '酱油', '糖', '八角'],
    cookingMethod: '红烧',
    nutrition: { calories: 350, protein: 15, fat: 30, carbs: 8 },
    healthTags: ['高热量', '慎选高油'],
    category: '荤菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20pork%20belly%20in%20brown%20sauce%2C%20Chinese%20canteen%20style%2C%20appetizing&image_size=square'
  },
  {
    id: '2',
    name: '清蒸鱼',
    ingredients: ['草鱼', '姜', '葱', '蒸鱼豉油'],
    cookingMethod: '清蒸',
    nutrition: { calories: 120, protein: 22, fat: 3, carbs: 2 },
    healthTags: ['低油高蛋白', '减脂友好'],
    category: '荤菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=steamed%20fish%20with%20ginger%20and%20scallion%2C%20Chinese%20canteen%20style%2C%20healthy&image_size=square'
  },
  {
    id: '3',
    name: '宫保鸡丁',
    ingredients: ['鸡胸肉', '花生', '干辣椒', '葱姜蒜'],
    cookingMethod: '爆炒',
    nutrition: { calories: 180, protein: 20, fat: 8, carbs: 10 },
    healthTags: ['高蛋白', '适量油脂'],
    category: '荤菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kung%20pao%20chicken%20with%20peanuts%2C%20Chinese%20canteen%20style%2C%20colorful&image_size=square'
  },
  {
    id: '4',
    name: '番茄炒蛋',
    ingredients: ['番茄', '鸡蛋', '葱'],
    cookingMethod: '炒',
    nutrition: { calories: 100, protein: 8, fat: 6, carbs: 8 },
    healthTags: ['营养均衡', '家常美味'],
    category: '家常菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20scrambled%20eggs%2C%20Chinese%20canteen%20style%2C%20bright%20red%20and%20yellow&image_size=square'
  },
  {
    id: '5',
    name: '清炒时蔬',
    ingredients: ['青菜', '蒜', '盐'],
    cookingMethod: '清炒',
    nutrition: { calories: 35, protein: 2, fat: 2, carbs: 4 },
    healthTags: ['低卡', '高纤维', '控糖友好'],
    category: '素菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stir%20fried%20green%20vegetables%2C%20Chinese%20canteen%20style%2C%20fresh%20and%20green&image_size=square'
  },
  {
    id: '6',
    name: '麻婆豆腐',
    ingredients: ['豆腐', '肉末', '豆瓣酱', '花椒'],
    cookingMethod: '烧',
    nutrition: { calories: 140, protein: 10, fat: 8, carbs: 6 },
    healthTags: ['高蛋白', '适量辣'],
    category: '素菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mapo%20tofu%20with%20minced%20meat%2C%20Chinese%20canteen%20style%2C%20spicy%20red&image_size=square'
  },
  {
    id: '7',
    name: '米饭',
    ingredients: ['大米'],
    cookingMethod: '蒸',
    nutrition: { calories: 116, protein: 2.6, fat: 0.3, carbs: 25.6 },
    healthTags: ['主食', '碳水来源'],
    category: '主食',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=steamed%20white%20rice%20in%20bowl%2C%20Chinese%20canteen%20style%2C%20fluffy&image_size=square'
  },
  {
    id: '8',
    name: '小米粥',
    ingredients: ['小米'],
    cookingMethod: '煮',
    nutrition: { calories: 46, protein: 1.4, fat: 0.3, carbs: 9.7 },
    healthTags: ['养胃', '低GI', '控糖友好'],
    category: '主食',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=millet%20porridge%20in%20bowl%2C%20Chinese%20canteen%20style%2C%20warm%20and%20comforting&image_size=square'
  },
  {
    id: '9',
    name: '糖醋排骨',
    ingredients: ['排骨', '糖', '醋', '番茄酱'],
    cookingMethod: '糖醋',
    nutrition: { calories: 280, protein: 18, fat: 15, carbs: 18 },
    healthTags: ['高热量', '控糖慎选'],
    category: '荤菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sweet%20and%20sour%20pork%20ribs%2C%20Chinese%20canteen%20style%2C%20glossy%20red&image_size=square'
  },
  {
    id: '10',
    name: '水煮牛肉',
    ingredients: ['牛肉', '豆芽', '生菜', '辣椒'],
    cookingMethod: '水煮',
    nutrition: { calories: 200, protein: 25, fat: 10, carbs: 5 },
    healthTags: ['高蛋白', '重辣'],
    category: '荤菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sichuan%20boiled%20beef%20with%20vegetables%2C%20Chinese%20canteen%20style%2C%20spicy%20red&image_size=square'
  },
  {
    id: '11',
    name: '蒸蛋羹',
    ingredients: ['鸡蛋', '温水', '盐'],
    cookingMethod: '蒸',
    nutrition: { calories: 60, protein: 6, fat: 4, carbs: 1 },
    healthTags: ['低卡', '高蛋白', '易消化'],
    category: '家常菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=steamed%20egg%20custard%2C%20Chinese%20canteen%20style%2C%20smooth%20and%20yellow&image_size=square'
  },
  {
    id: '12',
    name: '凉拌黄瓜',
    ingredients: ['黄瓜', '蒜', '醋', '香油'],
    cookingMethod: '凉拌',
    nutrition: { calories: 25, protein: 1, fat: 1, carbs: 4 },
    healthTags: ['低卡', '清爽', '减脂友好'],
    category: '素菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cucumber%20salad%20with%20garlic%2C%20Chinese%20canteen%20style%2C%20fresh%20green&image_size=square'
  },
  {
    id: '13',
    name: '土豆丝',
    ingredients: ['土豆', '醋', '辣椒'],
    cookingMethod: '炒',
    nutrition: { calories: 80, protein: 2, fat: 3, carbs: 14 },
    healthTags: ['碳水较高', '控糖适量'],
    category: '素菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stir%20fried%20shredded%20potatoes%2C%20Chinese%20canteen%20style%2C%20golden%20and%20crispy&image_size=square'
  },
  {
    id: '14',
    name: '红烧茄子',
    ingredients: ['茄子', '蒜', '酱油'],
    cookingMethod: '红烧',
    nutrition: { calories: 90, protein: 2, fat: 5, carbs: 10 },
    healthTags: ['吸油较多', '适量食用'],
    category: '素菜',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20eggplant%2C%20Chinese%20canteen%20style%2C%20dark%20and%20glossy&image_size=square'
  },
  {
    id: '15',
    name: '馒头',
    ingredients: ['面粉', '酵母'],
    cookingMethod: '蒸',
    nutrition: { calories: 220, protein: 7, fat: 1, carbs: 45 },
    healthTags: ['主食', '精制碳水'],
    category: '主食',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=steamed%20Chinese%20bun%20mantou%2C%20Chinese%20canteen%20style%2C%20white%20and%20fluffy&image_size=square'
  }
];

export const healthTips: HealthTip[] = [
  {
    id: '1',
    title: '减脂期打饭小技巧',
    content: '1. 先打蔬菜占半盘，再打蛋白质，最后少量主食\n2. 选择清蒸、水煮、凉拌的菜品\n3. 避开红烧、糖醋、油炸类\n4. 汤汁少浇，减少隐形热量',
    category: 'tips',
    targetGoal: 'lose',
    isFavorite: false
  },
  {
    id: '2',
    title: '控糖期主食选择建议',
    content: '1. 优先选择杂粮饭、小米粥等低GI主食\n2. 白米饭减半，搭配蔬菜增加饱腹感\n3. 避免白粥、馒头等精制碳水\n4. 主食放在最后吃，先吃菜和肉',
    category: 'tips',
    targetGoal: 'sugar',
    isFavorite: false
  },
  {
    id: '3',
    title: '增肌期蛋白质摄入指南',
    content: '1. 每餐保证一份优质蛋白（鱼、鸡、牛肉、蛋）\n2. 目标：每公斤体重1.5-2g蛋白质\n3. 训练后30分钟内补充蛋白质\n4. 可选择多个荤菜搭配',
    category: 'tips',
    targetGoal: 'gain',
    isFavorite: false
  },
  {
    id: '4',
    title: '食堂"清淡菜"真的低卡吗？',
    content: '很多看似清淡的菜其实热量不低！\n\n• 清炒时蔬：可能放了很多油\n• 凉拌菜：香油、花生碎热量高\n• 蒸蛋：可能加了肉末\n\n建议：观察菜品的油光程度，油亮亮的要慎重。',
    category: 'myth',
    isFavorite: false
  },
  {
    id: '5',
    title: '只吃菜不吃主食就能瘦吗？',
    content: '这是一个常见误区！\n\n• 完全不吃主食会导致代谢下降\n• 容易暴饮暴食，反弹更快\n• 可能导致营养不均衡\n\n正确做法：减少主食量而非完全不吃，选择粗粮代替精米白面。',
    category: 'myth',
    isFavorite: false
  },
  {
    id: '6',
    title: '减脂期饮食原则',
    content: '【热量缺口】每日摄入比消耗少300-500kcal\n\n【营养比例】\n• 蛋白质：25-30%\n• 脂肪：20-25%\n• 碳水：45-50%\n\n【饮食技巧】\n• 细嚼慢咽，增加饱腹感\n• 多喝水，饭前一杯水\n• 规律三餐，避免夜宵',
    category: 'guide',
    targetGoal: 'lose',
    isFavorite: false
  },
  {
    id: '7',
    title: '增肌期饮食原则',
    content: '【热量盈余】每日摄入比消耗多300-500kcal\n\n【营养比例】\n• 蛋白质：30-35%\n• 脂肪：20-25%\n• 碳水：45-50%\n\n【饮食技巧】\n• 训练前1小时补充碳水\n• 训练后补充蛋白质+碳水\n• 少食多餐，保证营养摄入',
    category: 'guide',
    targetGoal: 'gain',
    isFavorite: false
  },
  {
    id: '8',
    title: '控糖期饮食原则',
    content: '【血糖控制】选择低GI食物，控制碳水总量\n\n【食物选择】\n• 主食：杂粮、燕麦、小米\n• 避免：白粥、糯米、甜点\n• 蔬菜：多吃绿叶菜\n\n【进食顺序】\n先吃蔬菜→再吃蛋白质→最后吃主食',
    category: 'guide',
    targetGoal: 'sugar',
    isFavorite: false
  }
];
