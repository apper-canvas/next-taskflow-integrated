import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import { taskService, categoryService } from '@/services'
import TaskList from '@/components/organisms/TaskList'
import TaskModal from '@/components/organisms/TaskModal'
import Header from '@/components/organisms/Header'

const Tasks = () => {
  const { 
    searchQuery, 
    selectedCategory, 
    selectedPriority, 
    selectedStatus 
  } = useOutletContext()
  
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSubmitTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, taskData)
        toast.success('Task updated successfully')
      } else {
        await taskService.create(taskData)
        toast.success('Task created successfully')
      }
      
      setIsModalOpen(false)
      setEditingTask(null)
      await loadData() // Refresh the task list
    } catch (error) {
      toast.error(editingTask ? 'Failed to update task' : 'Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await taskService.update(taskId, updates)
      await loadData() // Refresh the task list
    } catch (error) {
      throw error // Let the calling component handle the error
    }
}

  const handleReorderTasks = async (taskIds) => {
    try {
      await taskService.reorderTasks(taskIds)
      await loadData() // Refresh the task list
    } catch (error) {
      throw error // Let the calling component handle the error
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId)
      await loadData() // Refresh the task list
    } catch (error) {
      throw error // Let the calling component handle the error
    }
  }
  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
      setEditingTask(null)
    }
  }

return (
    <>
      <TaskList
        tasks={tasks}
tasks={tasks}
        categories={categories}
        loading={loading}
        error={error}
        onTaskUpdate={handleUpdateTask}
        onTaskDelete={handleDeleteTask}
        onTaskEdit={handleEditTask}
        onCreateTask={handleCreateTask}
        onReorderTasks={handleReorderTasks}
        onRetry={loadData}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        selectedPriority={selectedPriority}
        selectedStatus={selectedStatus}
      />
      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
        categories={categories}
        onSubmit={handleSubmitTask}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

export default Tasks