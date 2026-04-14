import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold mb-2 text-white">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2 bg-navy border border-blue/30 rounded-lg text-white placeholder-slate-500 focus-ring transition ${
          error ? 'border-rose' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-slate-400 text-sm mt-1">{helperText}</p>}
    </div>
  )
)

Input.displayName = 'Input'
