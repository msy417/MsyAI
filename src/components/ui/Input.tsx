import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'placeholder:text-gray-400 text-gray-800',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
            'placeholder:text-gray-400 text-gray-800 resize-none',
            error && 'border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
