import clsx from 'clsx'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'primary', size = 'md', className, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    secondary: 'bg-amber-500 text-slate-900 hover:bg-amber-400 shadow-sm',
    ghost: 'bg-white/0 hover:bg-slate-900/5 text-slate-900',
  }

  const sizes: Record<string, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
}
