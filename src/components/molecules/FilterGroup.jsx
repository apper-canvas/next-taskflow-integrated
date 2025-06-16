import React from 'react'
import Button from '@/components/atoms/Button'

const FilterGroup = ({ 
  title, 
  options, 
  value, 
  onChange, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-surface-700">{title}</h4>
      <div className="space-y-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'primary' : 'ghost'}
            size="small"
            onClick={() => onChange(option.value)}
            className="w-full justify-start text-left"
          >
            {option.icon && (
              <span 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: option.color }}
              />
            )}
            {option.label}
            {option.count !== undefined && (
              <span className="ml-auto text-xs">
                {option.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default FilterGroup