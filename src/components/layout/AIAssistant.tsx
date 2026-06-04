import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/utils/helpers';

const quickQuestions = [
  '这道菜减脂期能吃吗？',
  '我今天吃超了怎么办？',
  '食堂怎么选低卡菜品？',
  '增肌期要吃多少蛋白质？'
];

const aiResponses: Record<string, string> = {
  '这道菜减脂期能吃吗？': '减脂期选择菜品要看热量和营养比例哦！建议选择清蒸、水煮、凉拌类菜品，避开红烧、糖醋、油炸类。每餐热量控制在500-600kcal左右，蛋白质要充足。记住：低油高蛋白是你的好朋友！💪',
  '我今天吃超了怎么办？': '别焦虑！偶尔一天吃超没关系的~ 明天可以适当减少热量摄入，或者增加一些运动消耗。重点是长期坚持，不是每一天都完美。建议明天选择更清淡的菜品，多补充蔬菜增加饱腹感。加油！🌟',
  '食堂怎么选低卡菜品？': '食堂选低卡菜品小技巧：\n1️⃣ 先看烹饪方式：清蒸<凉拌<炒<红烧<油炸\n2️⃣ 多选绿叶蔬菜，少选吸油蔬菜（茄子、土豆）\n3️⃣ 荤菜选鱼虾鸡，少选五花肉\n4️⃣ 主食减半，粗粮优先\n5️⃣ 汤汁少浇，减少隐形热量',
  '增肌期要吃多少蛋白质？': '增肌期蛋白质需求：每公斤体重1.5-2g蛋白质。\n\n比如你60kg，每天需要90-120g蛋白质。\n\n食堂高蛋白选择：\n• 清蒸鱼（约22g/100g）\n• 宫保鸡丁（约20g/100g）\n• 水煮牛肉（约25g/100g）\n• 蒸蛋羹（约6g/个）\n\n训练后30分钟内记得补充蛋白质哦！💪'
};

function generateAIResponse(question: string): string {
  if (aiResponses[question]) {
    return aiResponses[question];
  }
  
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('减脂') || lowerQ.includes('减肥')) {
    return '减脂期建议每日热量缺口300-500kcal，选择低油高蛋白的菜品，多吃蔬菜增加饱腹感。避开红烧、糖醋、油炸类菜品，主食可以减半。坚持就是胜利！💪';
  }
  
  if (lowerQ.includes('增肌') || lowerQ.includes('肌肉')) {
    return '增肌期需要热量盈余+充足蛋白质！每公斤体重1.5-2g蛋白质，训练后及时补充。食堂选择鱼、鸡、牛肉等高蛋白菜品，搭配适量碳水。加油增肌！🏋️';
  }
  
  if (lowerQ.includes('控糖') || lowerQ.includes('血糖')) {
    return '控糖期选择低GI食物，主食优先杂粮、小米粥。避免白粥、糯米、甜点。进食顺序：先蔬菜→再蛋白质→最后主食。稳住血糖，健康生活！🌿';
  }
  
  return '我是你的食堂营养小助手！可以问我关于减脂、增肌、控糖的饮食建议，或者某道菜的营养分析哦~ 数据为估算值，仅供参考，不构成医疗建议。😊';
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { chatMessages, addChatMessage, clearChatMessages } = useAppStore();
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    addChatMessage({ role: 'user', content: input.trim() });
    
    setTimeout(() => {
      const response = generateAIResponse(input.trim());
      addChatMessage({ role: 'assistant', content: response });
    }, 500);
    
    setInput('');
  };
  
  const handleQuickQuestion = (question: string) => {
    addChatMessage({ role: 'user', content: question });
    setTimeout(() => {
      const response = generateAIResponse(question);
      addChatMessage({ role: 'assistant', content: response });
    }, 500);
  };
  
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Bot className="w-5 h-5" />
                <span className="font-medium">营养小助手</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center py-6">
                  <Bot className="w-10 h-10 mx-auto text-green-500 mb-2" />
                  <p className="text-sm text-gray-500 mb-3">有什么可以帮你的？</p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-green-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-700 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入你的问题..."
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                数据为估算值，仅供参考
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
