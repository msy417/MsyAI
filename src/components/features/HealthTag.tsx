import { cn } from '@/lib/utils';

interface HealthTagProps {
  tag: string;
  className?: string;
}

const tagColors: Record<string, string> = {
  '低油高蛋白': 'bg-blue-100 text-blue-700',
  '减脂友好': 'bg-green-100 text-green-700',
  '减脂推荐': 'bg-green-100 text-green-700',
  '减脂慎选': 'bg-red-100 text-red-700',
  '控糖友好': 'bg-purple-100 text-purple-700',
  '控糖推荐': 'bg-purple-100 text-purple-700',
  '控糖慎选': 'bg-red-100 text-red-700',
  '增肌推荐': 'bg-orange-100 text-orange-700',
  '高蛋白': 'bg-blue-100 text-blue-700',
  '低卡': 'bg-green-100 text-green-700',
  '高热量': 'bg-red-100 text-red-700',
  '慎选高油': 'bg-yellow-100 text-yellow-700',
  '营养均衡': 'bg-teal-100 text-teal-700',
  '主食': 'bg-gray-100 text-gray-700',
  '高纤维': 'bg-emerald-100 text-emerald-700'
};

export function HealthTag({ tag, className }: HealthTagProps) {
  const colorClass = tagColors[tag] || 'bg-gray-100 text-gray-600';
  
  return (
    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', colorClass, className)}>
      {tag}
    </span>
  );
}

interface HealthTagsProps {
  tags: string[];
  className?: string;
}

export function HealthTags({ tags, className }: HealthTagsProps) {
  if (tags.length === 0) return null;
  
  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <HealthTag key={tag} tag={tag} />
      ))}
    </div>
  );
}
