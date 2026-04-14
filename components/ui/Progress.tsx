import React from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showLabel?: boolean
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, variant = 'default', showLabel, className = '', ...props }, ref) => {
    const percentage = (value / max) * 100

    const variantClasses: Record<string, string> = {
      default: 'bg-blue',
      success: 'bg-emerald',
      warning: 'bg-amber',
      danger: 'bg-rose',
    }

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        <div className="bg-slate rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${variantClasses[variant]}`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
        {showLabel && <p className="text-sm text-slate-400 mt-1">{Math.round(percentage)}%</p>}
      </div>
    )
  }
)

Progress.displayName = 'Progress'
