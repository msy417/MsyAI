import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import { AIAssistant } from './AIAssistant';
import { Utensils, Leaf, Droplets, Apple, Carrot, ChefHat } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10">
        {/* 主渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-yellow-50 to-emerald-50" />
        
        {/* 装饰性彩色圆形 */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-yellow-300/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        <div className="absolute top-2/3 -left-20 w-64 h-64 bg-orange-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '1s' }} />
        
        {/* 网格图案 */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
          backgroundSize: '25px 25px'
        }} />
        
        {/* 装饰性图标 */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-10">
            <Leaf className="w-32 h-32 text-green-500" />
          </div>
          <div className="absolute top-40 right-20">
            <Apple className="w-28 h-28 text-red-500" />
          </div>
          <div className="absolute bottom-40 left-20">
            <Carrot className="w-36 h-36 text-orange-500" />
          </div>
          <div className="absolute bottom-20 right-1/4">
            <Utensils className="w-24 h-24 text-blue-500" />
          </div>
          <div className="absolute top-1/2 left-5">
            <Droplets className="w-20 h-20 text-cyan-500" />
          </div>
          <div className="absolute top-60 right-1/3">
            <ChefHat className="w-28 h-28 text-purple-500" />
          </div>
        </div>
        
        {/* 微妙的食物纹理 */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='2' fill='%2322c55e'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <Navbar />
      <main className="pt-14 pb-6 relative z-10">
        {children}
      </main>
      <AIAssistant />
    </div>
  );
}
