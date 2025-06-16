import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { categoryService, taskService } from '@/services'
import FilterGroup from '@/components/molecules/FilterGroup'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'
const CategorySidebar = ({ 
  selectedCategory, 
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange 
}) => {
const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#5B4CFF')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    loadData()
  }, [])
const loadData = async () => {
    setLoading(true)
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      setCategories(categoriesData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Failed to load sidebar data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required')
      return
    }

    setCreating(true)
    try {
      const newCategory = await categoryService.create({
        name: newCategoryName.trim(),
        color: newCategoryColor
      })
      
      setCategories(prev => [...prev, newCategory])
      setNewCategoryName('')
      setNewCategoryColor('#5B4CFF')
      setShowAddForm(false)
      toast.success('Category created successfully')
    } catch (error) {
      console.error('Failed to create category:', error)
      toast.error('Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm)
    if (showAddForm) {
      setNewCategoryName('')
      setNewCategoryColor('#5B4CFF')
    }
  }

  const handleCancelAdd = () => {
    setShowAddForm(false)
    setNewCategoryName('')
    setNewCategoryColor('#5B4CFF')
  }

  const getCategoryOptions = () => {
    const allCount = tasks.length
    const categoryOptions = [
      { 
        value: 'all', 
        label: 'All Tasks', 
        count: allCount,
        color: '#5B4CFF'
      }
    ]

    categories.forEach(category => {
      const count = tasks.filter(task => task.category === category.id).length
      categoryOptions.push({
        value: category.id,
        label: category.name,
        count,
        color: category.color,
        icon: true
      })
    })

    return categoryOptions
  }

  const getPriorityOptions = () => {
    const priorities = [
      { value: 'all', label: 'All Priorities', color: '#94a3b8' },
      { value: 'high', label: 'High', color: '#FF6B6B', icon: true },
      { value: 'medium', label: 'Medium', color: '#FFD93D', icon: true },
      { value: 'low', label: 'Low', color: '#51CF66', icon: true }
    ]

    return priorities.map(priority => ({
      ...priority,
      count: priority.value === 'all' 
        ? tasks.length 
        : tasks.filter(task => task.priority === priority.value).length
    }))
  }

  const getStatusOptions = () => {
    const completedCount = tasks.filter(task => task.completed).length
    const incompleteCount = tasks.filter(task => !task.completed).length
    
    return [
      { value: 'all', label: 'All Tasks', count: tasks.length },
      { value: 'incomplete', label: 'Incomplete', count: incompleteCount },
      { value: 'completed', label: 'Completed', count: completedCount }
    ]
  }

  if (loading) {
    return (
      <aside className="w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto z-40">
        <div className="p-4 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-surface-200 rounded animate-pulse w-20" />
              <div className="space-y-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-8 bg-surface-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-64 bg-surface-50 border-r border-surface-200 overflow-y-auto z-40">
      <div className="p-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FilterGroup
            title="Categories"
            options={getCategoryOptions()}
            value={selectedCategory}
            onChange={onCategoryChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FilterGroup
            title="Priority"
            options={getPriorityOptions()}
            value={selectedPriority}
            onChange={onPriorityChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FilterGroup
            title="Status"
            options={getStatusOptions()}
            value={selectedStatus}
            onChange={onStatusChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4 border-t border-surface-200"
        >
          <Button
            variant="ghost"
            size="small"
            icon="RotateCcw"
            onClick={() => {
              onCategoryChange('all')
              onPriorityChange('all')
              onStatusChange('all')
            }}
            className="w-full justify-start"
          >
            Clear Filters
          </Button>
</motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4 border-t border-surface-200"
        >
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="small"
              icon="Plus"
              onClick={toggleAddForm}
              className="w-full justify-start"
            >
              Add Category
            </Button>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-3 bg-surface-100 rounded-lg"
              >
                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-1">
                    Category Name
                  </label>
                  <Input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory()
                      } else if (e.key === 'Escape') {
                        handleCancelAdd()
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-surface-700 mb-2">
                    Color
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      '#5B4CFF', '#4ECDC4', '#FF6B6B', '#FFD93D', '#51CF66',
                      '#9C88FF', '#20C997', '#FD7E14', '#E83E8C', '#6F42C1'
                    ].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          newCategoryColor === color 
                            ? 'border-surface-700 scale-110' 
                            : 'border-surface-300 hover:border-surface-400'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleAddCategory}
                    disabled={creating || !newCategoryName.trim()}
                    className="flex-1"
                  >
                    {creating ? 'Creating...' : 'Save'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={handleCancelAdd}
                    disabled={creating}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </aside>
  )
}

export default CategorySidebar