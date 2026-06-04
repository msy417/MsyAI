import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-5 shadow-sm',
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-3 sm:mb-4', className)}>
      <div>
        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
