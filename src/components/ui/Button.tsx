import { cn } from '@/lib/utils'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-[1.02] active:scale-[0.98]',
        {
          'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25': variant === 'primary',
          'bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25': variant === 'secondary',
          'bg-accent hover:bg-accent/90 text-background shadow-lg shadow-accent/25': variant === 'accent',
          'bg-transparent hover:bg-surface text-slate-300 border border-slate-700': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm rounded-lg': size === 'sm',
          'px-5 py-2.5 text-base rounded-xl': size === 'md',
          'px-8 py-3.5 text-lg rounded-xl': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}