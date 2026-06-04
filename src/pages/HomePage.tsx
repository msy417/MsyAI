import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, FileText, Calendar, Sparkles, ChevronRight, Utensils, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const features = [
  {
    icon: Camera,
    title: 'AI营养识别',
    description: '上传菜品照片或输入菜单，AI秒算营养数据',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: Calendar,
    title: '个性化计划',
    description: '按减脂/增肌/控糖目标定制食堂饮食计划',
    color: 'from-green-400 to-green-600'
  },
  {
    icon: TrendingUp,
    title: '健康追踪',
    description: '记录每日用餐，生成周度健康报告',
    color: 'from-orange-400 to-orange-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden rounded-2xl mt-4 p-6 sm:p-8 lg:p-12"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(34,197,94,0.9) 0%, rgba(34,197,94,0.75) 35%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)`,
        }}
      >
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fresh%20colorful%20vegetables%20and%20fruits%20top%20view%2C%20tomatoes%2C%20lettuce%2C%20carrots%2C%20broccoli%2C%20bell%20peppers%2C%20cucumbers%2C%20vibrant%20colors%2C%20fresh%20organic%20produce%2C%20clean%20white%20background%2C%20food%20photography%20style&image_size=landscape_4_3')`,
            backgroundSize: 'cover',
            backgroundPosition: '80% center',
            opacity: 1,
            maskImage: 'linear-gradient(90deg, rgba(0,0,0,0) 35%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0) 35%, rgba(0,0,0,1) 60%, rgba(0,0,0,1) 100%)',
            filter: 'contrast(1.1) brightness(1.05)'
          }}
        />
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 hidden sm:block" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 hidden sm:block" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-3 sm:mb-4"
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base font-medium text-green-100">专为高校学生打造</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight text-white"
          >
            食堂吃饭不用算<br />AI帮你配好营养餐！
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-100 mb-5 sm:mb-6 text-sm sm:text-base lg:text-lg"
          >
            上传菜品照片，AI自动识别营养数据<br />
            根据你的目标生成个性化饮食计划
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link to="/analyze">
              <Button className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 shadow-lg text-base sm:text-lg py-3 sm:py-4 px-6">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                拍菜品查营养
              </Button>
            </Link>
            <Link to="/analyze">
              <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-base sm:text-lg py-3 sm:py-4 px-6">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                输入菜单批量分析
              </Button>
            </Link>
          </motion.div>
        </div>
        
        <div className="absolute right-6 bottom-6 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Utensils className="w-24 h-24 text-white/20" />
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 sm:mt-8"
      >
        <motion.h2 variants={itemVariants} className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
          核心功能
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card hover className="h-full p-5 sm:p-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-base sm:text-lg">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-500">{feature.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 sm:mt-8"
      >
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2 text-base sm:text-lg">今日健康小贴士</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                减脂期打饭技巧：先打蔬菜占半盘，再打蛋白质，最后少量主食。选择清蒸、水煮、凉拌的菜品，避开红烧、糖醋、油炸类。
              </p>
              <Link to="/tips" className="inline-flex items-center text-sm sm:text-base text-orange-600 hover:text-orange-700 font-medium">
                查看更多健康贴士
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="hidden sm:flex items-center justify-center flex-shrink-0">
              <span className="text-6xl sm:text-7xl">👨‍🍳</span>
            </div>
          </div>
        </Card>
      </motion.section>
      
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        <Link to="/analyze">
          <Card hover className="text-center py-5 sm:py-6">
            <Camera className="w-7 h-7 sm:w-8 sm:h-8 mx-auto text-green-500 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base font-medium text-gray-700">菜品分析</p>
          </Card>
        </Link>
        <Link to="/plan">
          <Card hover className="text-center py-5 sm:py-6">
            <Calendar className="w-7 h-7 sm:w-8 sm:h-8 mx-auto text-blue-500 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base font-medium text-gray-700">饮食计划</p>
          </Card>
        </Link>
        <Link to="/record">
          <Card hover className="text-center py-5 sm:py-6">
            <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 mx-auto text-orange-500 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base font-medium text-gray-700">我的记录</p>
          </Card>
        </Link>
        <Link to="/tips">
          <Card hover className="text-center py-5 sm:py-6">
            <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 mx-auto text-purple-500 mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base font-medium text-gray-700">健康贴士</p>
          </Card>
        </Link>
      </motion.section>
      
      <footer className="mt-8 sm:mt-12 py-6 sm:py-8 border-t border-gray-200 text-center">
        <p className="text-sm sm:text-base text-gray-500 mb-2 sm:mb-3">专为高校学生打造的食堂饮食健康工具</p>
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-400">
          <span>使用说明</span>
          <span>·</span>
          <span>意见反馈</span>
          <span>·</span>
          <span>关于我们</span>
        </div>
      </footer>
    </div>
  );
}
