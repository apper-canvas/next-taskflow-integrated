import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    appearance-none bg-white pr-10
    ${error ? 'border-error focus:border-error focus:ring-error/50' : 'border-surface-300'}
    ${className}
  `

  const filteredProps = { ...props }
  delete filteredProps.label
  delete filteredProps.options
  delete filteredProps.placeholder
  delete filteredProps.error

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClasses}
          {...filteredProps}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon 
            name="ChevronDown" 
            className="w-5 h-5 text-surface-400" 
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Select