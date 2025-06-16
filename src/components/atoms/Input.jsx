import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props 
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-error focus:border-error focus:ring-error/50' : 'border-surface-300'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `

  const filteredProps = { ...props }
  delete filteredProps.label
  delete filteredProps.error
  delete filteredProps.icon
  delete filteredProps.iconPosition

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-surface-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <ApperIcon 
              name={icon} 
              className="w-5 h-5 text-surface-400" 
            />
          </div>
        )}
        
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          {...filteredProps}
        />
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

export default Input