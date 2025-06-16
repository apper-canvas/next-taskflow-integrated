import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { taskService } from '@/services'
import TaskCard from '@/components/molecules/TaskCard'
import Button from '@/components/atoms/Button'
import Checkbox from '@/components/atoms/Checkbox'
import EmptyState from '@/components/molecules/EmptyState'
import ErrorState from '@/components/molecules/ErrorState'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
// Sortable Task Card wrapper
const SortableTaskCard = ({ task, categories, onToggleComplete, onEdit, onDelete, className }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        categories={categories}
        onToggleComplete={onToggleComplete}
        onEdit={onEdit}
        onDelete={onDelete}
        className={className}
        isDragging={isDragging}
      />
    </div>
  )
}

const TaskList = ({ 
  tasks = [], 
  categories = [],
  loading = false,
  error = null,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
  onCreateTask,
  onRetry,
  onReorderTasks,
  searchQuery = '',
  selectedCategory = 'all',
  selectedPriority = 'all',
  selectedStatus = 'all'
}) => {
const [selectedTasks, setSelectedTasks] = useState(new Set())
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
// Filter and sort tasks based on current filters
  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (selectedCategory !== 'all' && task.category !== selectedCategory) {
        return false
      }
      
      // Priority filter
      if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
        return false
      }
      
      // Status filter
      if (selectedStatus === 'completed' && !task.completed) {
        return false
      }
      if (selectedStatus === 'incomplete' && task.completed) {
        return false
      }
      
      return true
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await onTaskUpdate(taskId, { completed })
      toast.success(completed ? 'Task completed!' : 'Task marked incomplete')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onTaskDelete(taskId)
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const handleSelectTask = (taskId, selected) => {
    const newSelected = new Set(selectedTasks)
    if (selected) {
      newSelected.add(taskId)
    } else {
      newSelected.delete(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = (selected) => {
    if (selected) {
      setSelectedTasks(new Set(filteredTasks.map(task => task.id)))
    } else {
      setSelectedTasks(new Set())
    }
}

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = filteredTasks.findIndex(task => task.id === active.id)
      const newIndex = filteredTasks.findIndex(task => task.id === over.id)
      
      const reorderedTasks = arrayMove(filteredTasks, oldIndex, newIndex)
      const taskIds = reorderedTasks.map(task => task.id)
      
      try {
        await onReorderTasks(taskIds)
        toast.success('Tasks reordered successfully')
      } catch (error) {
        toast.error('Failed to reorder tasks')
        await onRetry() // Refresh to restore original order
      }
    }
  }

  const handleBulkComplete = async () => {
    if (selectedTasks.size === 0) return
    
    setBulkActionLoading(true)
    try {
      await taskService.bulkUpdate([...selectedTasks], { completed: true })
      setSelectedTasks(new Set())
      await onRetry() // Refresh the task list
      toast.success(`${selectedTasks.size} tasks marked as complete`)
    } catch (error) {
      toast.error('Failed to update tasks')
    } finally {
      setBulkActionLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0) return
    
    if (window.confirm(`Are you sure you want to delete ${selectedTasks.size} tasks?`)) {
      setBulkActionLoading(true)
      try {
        await taskService.bulkDelete([...selectedTasks])
        setSelectedTasks(new Set())
        await onRetry() // Refresh the task list
        toast.success(`${selectedTasks.size} tasks deleted`)
      } catch (error) {
        toast.error('Failed to delete tasks')
      } finally {
        setBulkActionLoading(false)
      }
    }
  }

  if (loading) {
    return <SkeletonLoader count={5} className="p-6" />
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    )
  }

  if (filteredTasks.length === 0) {
    if (searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all') {
      return (
        <div className="p-6">
          <EmptyState
            icon="Search"
            title="No tasks found"
            description="Try adjusting your search or filters to find what you're looking for."
            actionLabel="Clear Filters"
            onAction={() => {
              // This would need to be passed down as a prop or handled by parent
              window.location.reload()
            }}
          />
        </div>
      )
    }

    return (
      <div className="p-6">
        <EmptyState
          icon="CheckSquare"
          title="No tasks yet"
          description="Get started by creating your first task. Stay organized and boost your productivity!"
          actionLabel="Create Your First Task"
          onAction={onCreateTask}
        />
      </div>
    )
  }

  const allSelected = selectedTasks.size === filteredTasks.length
  const someSelected = selectedTasks.size > 0

  return (
    <div className="p-6 space-y-4">
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {filteredTasks.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-lg border border-surface-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  label={`Select all (${filteredTasks.length})`}
                />
                
                {someSelected && (
                  <span className="text-sm text-surface-600">
                    {selectedTasks.size} selected
                  </span>
                )}
              </div>

              {someSelected && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Check"
                    onClick={handleBulkComplete}
                    loading={bulkActionLoading}
                    disabled={bulkActionLoading}
                  >
                    Mark Complete
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="Trash2"
                    onClick={handleBulkDelete}
                    loading={bulkActionLoading}
                    disabled={bulkActionLoading}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

{/* Task Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          <SortableContext 
            items={filteredTasks.map(task => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative"
                >
                  {filteredTasks.length > 1 && (
                    <div className="absolute left-2 top-4 z-10">
                      <Checkbox
                        checked={selectedTasks.has(task.id)}
                        onChange={(e) => handleSelectTask(task.id, e.target.checked)}
                        className="bg-white/90 backdrop-blur-sm rounded"
                      />
                    </div>
                  )}
                  
                  <SortableTaskCard
                    task={task}
                    categories={categories}
                    onToggleComplete={handleToggleComplete}
                    onEdit={onTaskEdit}
                    onDelete={handleDelete}
                    className={filteredTasks.length > 1 ? 'pl-10' : ''}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  )
}

export default TaskList