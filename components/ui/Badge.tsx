import React from 'react'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const variantClasses: Record<string, string> = {
      primary: 'bg-blue/20 text-blue',
      success: 'bg-emerald/20 text-emerald',
      warning: 'bg-amber/20 text-amber',
      danger: 'bg-rose/20 text-rose',
      info: 'bg-slate/30 text-slate-300',
    }

    return (
      <span
        ref={ref}
        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
