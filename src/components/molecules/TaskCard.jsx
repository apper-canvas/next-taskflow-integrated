import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const TaskCard = forwardRef(({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  categories = [],
  className = '',
  isDragging = false,
  ...props
}, ref) => {
  const category = categories.find(cat => cat.id === task.category)
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF6B6B'
      case 'medium': return '#FFD93D'
      case 'low': return '#51CF66'
      default: return '#94a3b8'
    }
  }

  const getDueDateDisplay = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    const now = new Date()
    
    if (isToday(date)) {
      return { text: 'Today', color: 'text-warning', urgent: true }
    } else if (isTomorrow(date)) {
      return { text: 'Tomorrow', color: 'text-info', urgent: false }
    } else if (isPast(date)) {
      return { text: 'Overdue', color: 'text-error', urgent: true }
    } else {
      return { text: format(date, 'MMM d'), color: 'text-surface-500', urgent: false }
    }
  }

  const dueDateInfo = getDueDateDisplay(task.dueDate)

return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={!isDragging ? { scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' } : {}}
      className={`
        bg-white rounded-lg border border-surface-200 p-4 
        transition-all duration-200 hover:border-surface-300
        ${task.completed ? 'opacity-75' : ''}
        ${isDragging ? 'opacity-50 rotate-3 shadow-lg z-50' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.id, !task.completed)}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`
                text-base font-medium break-words
                ${task.completed 
                  ? 'line-through text-surface-500' 
                  : 'text-surface-900'
                }
              `}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-3 mt-2">
                {category && (
                  <Badge 
                    color={category.color}
                    size="small"
                  >
                    {category.name}
                  </Badge>
                )}
                
                <div className="flex items-center space-x-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                  />
                  <span className="text-xs text-surface-500 capitalize">
                    {task.priority}
                  </span>
                </div>
                
                {dueDateInfo && (
                  <div className={`flex items-center space-x-1 ${dueDateInfo.color}`}>
                    <ApperIcon 
                      name={dueDateInfo.urgent ? "AlertCircle" : "Calendar"} 
                      className="w-3 h-3" 
                    />
                    <span className="text-xs font-medium">
                      {dueDateInfo.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
<div className="flex items-center space-x-1 ml-2">
              <Button
                variant="ghost"
                size="small"
                icon="GripVertical"
                className="p-1.5 text-surface-400 hover:text-surface-600 cursor-grab active:cursor-grabbing"
                title="Drag to reorder"
              />
              <Button
                variant="ghost"
                size="small"
                icon="Edit2"
                onClick={() => onEdit(task)}
                className="p-1.5"
              />
              <Button
                variant="ghost"
                size="small"
                icon="Trash2"
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-error hover:text-error hover:bg-error/10"
              />
            </div>
</div>
        </div>
      </div>
    </motion.div>
  )
})

TaskCard.displayName = 'TaskCard'

export default TaskCard