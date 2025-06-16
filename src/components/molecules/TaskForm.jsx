import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'

const TaskForm = ({ 
  task = null, 
  categories = [],
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    priority: 'medium',
    dueDate: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        category: task.category || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd\'T\'HH:mm') : ''
      })
    }
  }, [task])

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
    }
    
    onSubmit(taskData)
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const getTodayDateTime = () => {
    const now = new Date()
    return format(now, 'yyyy-MM-dd\'T\'HH:mm')
  }

  const getTomorrowDateTime = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return format(tomorrow, 'yyyy-MM-dd\'T\'HH:mm')
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Task Title"
        value={formData.title}
        onChange={handleChange('title')}
        placeholder="Enter task title..."
        error={errors.title}
        disabled={isSubmitting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          value={formData.category}
          onChange={handleChange('category')}
          options={categoryOptions}
          placeholder="Select category"
          error={errors.category}
          disabled={isSubmitting}
        />

        <Select
          label="Priority"
          value={formData.priority}
          onChange={handleChange('priority')}
          options={priorityOptions}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-surface-700">
          Due Date (Optional)
        </label>
        
        <div className="flex space-x-2 mb-2">
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => setFormData(prev => ({ ...prev, dueDate: getTodayDateTime() }))}
            disabled={isSubmitting}
          >
            Today
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => setFormData(prev => ({ ...prev, dueDate: getTomorrowDateTime() }))}
            disabled={isSubmitting}
          >
            Tomorrow
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => setFormData(prev => ({ ...prev, dueDate: '' }))}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
        
        <Input
          type="datetime-local"
          value={formData.dueDate}
          onChange={handleChange('dueDate')}
          disabled={isSubmitting}
          icon="Calendar"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          icon={task ? "Save" : "Plus"}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </motion.form>
  )
}

export default TaskForm