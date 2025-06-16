import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-4">
        <ApperIcon 
          name="AlertCircle" 
          className="w-16 h-16 text-error mx-auto" 
        />
      </div>
      
      <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          icon="RefreshCw"
          variant="secondary"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState