import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold mb-2 text-white">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2 bg-navy border border-blue/30 rounded-lg text-white placeholder-slate-500 focus-ring transition resize-none ${
          error ? 'border-rose' : ''
        } ${className}`}
        rows={4}
        {...props}
      />
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
      {helperText && !error && <p className="text-slate-400 text-sm mt-1">{helperText}</p>}
    </div>
  )
)

Textarea.displayName = 'Textarea'
