import React from 'react'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  color,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error'
  }
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-sm'
  }

  const customStyle = color ? {
    backgroundColor: `${color}15`,
    color: color
  } : {}

  const filteredProps = { ...props }
  delete filteredProps.variant
  delete filteredProps.size
  delete filteredProps.color

  return (
    <span
      className={`${baseClasses} ${color ? '' : variants[variant]} ${sizes[size]} ${className}`}
      style={customStyle}
      {...filteredProps}
    >
      {children}
    </span>
  )
}

export default Badge