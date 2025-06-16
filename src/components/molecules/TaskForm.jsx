import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";

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
  
  // Subtask management state
  const [subtasks, setSubtasks] = useState([])
  const [showSubtaskForm, setShowSubtaskForm] = useState(false)
  const [editingSubtask, setEditingSubtask] = useState(null)
  const [subtaskFormData, setSubtaskFormData] = useState({
    name: '',
    description: '',
    status: 'Not Started'
  })
  const [subtaskErrors, setSubtaskErrors] = useState({})
  const [subtasksExpanded, setSubtasksExpanded] = useState(false)

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
  // Subtask form validation
  const validateSubtaskForm = () => {
    const newErrors = {}
    
    if (!subtaskFormData.name.trim()) {
      newErrors.name = 'Subtask name is required'
    }
    
    setSubtaskErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Subtask handlers
  const handleAddSubtask = () => {
    if (!validateSubtaskForm()) return
    
    const newSubtask = {
      id: Date.now(),
      name: subtaskFormData.name.trim(),
      description: subtaskFormData.description.trim(),
      status: subtaskFormData.status
    }
    
    setSubtasks(prev => [...prev, newSubtask])
    resetSubtaskForm()
  }

  const handleEditSubtask = (subtask) => {
    setSubtaskFormData({
      name: subtask.name,
      description: subtask.description,
      status: subtask.status
    })
    setEditingSubtask(subtask)
    setShowSubtaskForm(true)
  }

  const handleUpdateSubtask = () => {
    if (!validateSubtaskForm()) return
    
    setSubtasks(prev => prev.map(st => 
      st.id === editingSubtask.id 
        ? { ...st, name: subtaskFormData.name.trim(), description: subtaskFormData.description.trim(), status: subtaskFormData.status }
        : st
    ))
    resetSubtaskForm()
  }

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId))
  }

  const resetSubtaskForm = () => {
    setSubtaskFormData({
      name: '',
      description: '',
      status: 'Not Started'
    })
    setEditingSubtask(null)
    setShowSubtaskForm(false)
    setSubtaskErrors({})
  }

  const handleSubtaskSubmit = (e) => {
    e.preventDefault()
    if (editingSubtask) {
      handleUpdateSubtask()
    } else {
      handleAddSubtask()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const taskData = {
      ...formData,
      title: formData.title.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      subtasks: subtasks
}
    
    await onSubmit(taskData)
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

  const handleSubtaskChange = (field) => (e) => {
    setSubtaskFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Clear error when user starts typing
    if (subtaskErrors[field]) {
      setSubtaskErrors(prev => ({
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
      {/* Subtasks Section */}
      {!task && (
        <div className="border-t border-surface-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <Button
              type="button"
              variant="ghost"
              size="small"
              icon={subtasksExpanded ? "ChevronUp" : "ChevronDown"}
              onClick={() => setSubtasksExpanded(!subtasksExpanded)}
              className="text-surface-500 hover:text-surface-700 text-sm"
              disabled={isSubmitting}
            >
              Subtasks (Optional)
              {subtasks.length > 0 && (
                <span className="ml-1 text-xs bg-surface-100 px-1.5 py-0.5 rounded">
                  {subtasks.length}
                </span>
              )}
            </Button>
            {subtasksExpanded && (
              <Button
                type="button"
                variant="ghost"
                size="small"
                icon="Plus"
                onClick={() => setShowSubtaskForm(true)}
                className="text-primary hover:text-primary-dark text-sm"
                disabled={isSubmitting}
              >
                Add
              </Button>
            )}
          </div>

          {subtasksExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Subtask Form */}
              {showSubtaskForm && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubtaskSubmit}
                  className="p-3 border border-surface-200 rounded-md bg-surface-50"
                >
                  <div className="space-y-3">
                    <Input
                      label="Subtask Name"
                      value={subtaskFormData.name}
                      onChange={handleSubtaskChange('name')}
                      placeholder="Enter subtask name..."
                      error={subtaskErrors.name}
                      disabled={isSubmitting}
                      size="small"
                    />
                    
                    <Input
                      label="Description (Optional)"
                      value={subtaskFormData.description}
                      onChange={handleSubtaskChange('description')}
                      placeholder="Enter description..."
                      disabled={isSubmitting}
                      size="small"
                    />
                    
                    <Select
                      label="Status"
                      value={subtaskFormData.status}
                      onChange={handleSubtaskChange('status')}
                      options={[
                        { value: 'Not Started', label: 'Not Started' },
                        { value: 'In Progress', label: 'In Progress' },
                        { value: 'Completed', label: 'Completed' },
                        { value: 'Blocked', label: 'Blocked' }
                      ]}
                      disabled={isSubmitting}
                      size="small"
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="small"
                        onClick={resetSubtaskForm}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="small"
                        disabled={!subtaskFormData.name.trim() || isSubmitting}
                      >
                        {editingSubtask ? 'Update' : 'Add'} Subtask
                      </Button>
                    </div>
                  </div>
                </motion.form>
              )}

              {/* Subtasks List */}
              {subtasks.length > 0 && (
                <div className="space-y-2">
                  {subtasks.map((subtask) => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-3 p-2 border border-surface-200 rounded-md bg-white"
                    >
                      <ApperIcon 
                        name={subtask.status === 'Completed' ? 'CheckCircle' : 
                              subtask.status === 'In Progress' ? 'Clock' : 
                              subtask.status === 'Blocked' ? 'AlertCircle' : 'Circle'}
                        className={`w-4 h-4 mt-0.5 ${
                          subtask.status === 'Completed' ? 'text-success' :
                          subtask.status === 'In Progress' ? 'text-warning' :
                          subtask.status === 'Blocked' ? 'text-error' : 'text-surface-500'
                        }`}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${subtask.status === 'Completed' ? 'line-through text-surface-500' : 'text-surface-900'}`}>
                              {subtask.name}
                            </h4>
                            {subtask.description && (
                              <p className="text-xs text-surface-600 mt-1">
                                {subtask.description}
                              </p>
                            )}
                            <span className={`text-xs ${
                              subtask.status === 'Completed' ? 'text-success' :
                              subtask.status === 'In Progress' ? 'text-warning' :
                              subtask.status === 'Blocked' ? 'text-error' : 'text-surface-500'
                            }`}>
                              {subtask.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="small"
                              icon="Edit2"
                              onClick={() => handleEditSubtask(subtask)}
                              className="p-1 text-surface-400 hover:text-surface-600"
                              disabled={isSubmitting}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="small"
                              icon="Trash2"
                              onClick={() => handleDeleteSubtask(subtask.id)}
                              className="p-1 text-surface-400 hover:text-error"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {subtasks.length === 0 && (
                <div className="text-center py-6 text-surface-500">
                  <ApperIcon name="ListChecks" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No subtasks added yet</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={() => setShowSubtaskForm(true)}
                    className="mt-2 text-primary hover:text-primary-dark"
                    disabled={isSubmitting}
                  >
                    Add your first subtask
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

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
}

export default TaskForm