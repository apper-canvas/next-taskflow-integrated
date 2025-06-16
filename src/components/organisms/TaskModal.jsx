import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '@/components/molecules/TaskForm'
import ApperIcon from '@/components/ApperIcon'

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  categories = [],
  onSubmit,
  isSubmitting = false 
}) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <h2 className="text-lg font-heading font-semibold text-surface-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 transition-colors"
              disabled={isSubmitting}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          {/* Form */}
          <div className="p-6">
            <TaskForm
              task={task}
              categories={categories}
              onSubmit={onSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal