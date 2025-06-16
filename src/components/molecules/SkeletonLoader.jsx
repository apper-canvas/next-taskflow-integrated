import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-lg border border-surface-200 p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-5 h-5 bg-surface-200 rounded animate-pulse" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-surface-200 rounded animate-pulse w-1/2" />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="h-6 bg-surface-200 rounded-full animate-pulse w-16" />
                <div className="h-4 bg-surface-200 rounded animate-pulse w-12" />
                <div className="h-4 bg-surface-200 rounded animate-pulse w-20" />
              </div>
            </div>
            
            <div className="flex space-x-1">
              <div className="w-8 h-8 bg-surface-200 rounded animate-pulse" />
              <div className="w-8 h-8 bg-surface-200 rounded animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader