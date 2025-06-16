import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-md',
    secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 focus:ring-surface-300 border border-surface-300',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50',
    ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-surface-300',
    success: 'bg-success text-white hover:bg-success/90 focus:ring-success/50'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm rounded-md',
    medium: 'px-4 py-2 text-sm rounded-lg',
    large: 'px-6 py-3 text-base rounded-lg'
  }

  const filteredProps = { ...props }
  delete filteredProps.variant
  delete filteredProps.size
  delete filteredProps.icon
  delete filteredProps.iconPosition
  delete filteredProps.loading

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...filteredProps}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 mr-2 animate-spin" 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 mr-2" 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 ml-2" 
        />
      )}
    </motion.button>
  )
}

export default Button