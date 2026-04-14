import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
  error?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold mb-2 text-white">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2 bg-navy border border-blue/30 rounded-lg text-white focus-ring transition ${
          error ? 'border-rose' : ''
        } ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-rose text-sm mt-1">{error}</p>}
    </div>
  )
)

Select.displayName = 'Select'
