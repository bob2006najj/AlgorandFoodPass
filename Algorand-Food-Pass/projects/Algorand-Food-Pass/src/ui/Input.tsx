import clsx from 'clsx'
import React from 'react'

export default function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm ' +
          'outline-none focus:ring-2 focus:ring-emerald-400/40',
        className,
      )}
      {...props}
    />
  )
}
