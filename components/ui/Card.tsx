import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`bg-slate/50 border border-blue/20 rounded-lg p-6 shadow-soft ${className}`}
    {...props}
  />
))

Card.displayName = 'Card'
