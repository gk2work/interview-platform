import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', disabled, children, ...props }, ref) => {
    const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus-ring'

    const variantClasses: Record<string, string> = {
      primary: 'bg-blue text-white hover:bg-blue/90 active:scale-95 disabled:bg-blue/50',
      secondary: 'bg-slate text-white hover:bg-slate/80 active:scale-95 disabled:bg-slate/50',
      ghost: 'bg-transparent text-blue hover:bg-blue/10 active:bg-blue/20 disabled:text-blue/50',
      success: 'bg-emerald text-white hover:bg-emerald/90 active:scale-95 disabled:bg-emerald/50',
      danger: 'bg-rose text-white hover:bg-rose/90 active:scale-95 disabled:bg-rose/50',
    }

    const sizeClasses: Record<string, string> = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? <span className="mr-2">⏳</span> : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
