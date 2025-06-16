import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon = "Package",
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-4"
      >
        <ApperIcon 
          name={icon} 
          className="w-16 h-16 text-surface-300 mx-auto" 
        />
      </motion.div>
      
      <h3 className="text-lg font-heading font-medium text-surface-900 mb-2">
        {title}
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onAction}
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default EmptyState