import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const filteredProps = { ...props }
  delete filteredProps.label

  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...filteredProps}
        />
        
        <motion.div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200
            ${checked 
              ? 'bg-accent border-accent' 
              : 'bg-white border-surface-300 hover:border-surface-400'
            }
          `}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <ApperIcon 
              name="Check" 
              className="w-3 h-3 text-white" 
            />
          </motion.div>
        </motion.div>
      </div>
      
      {label && (
        <span className="ml-2 text-sm text-surface-700">
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox