import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import { taskService, categoryService } from '@/services'
import Header from '@/components/organisms/Header'
import CategorySidebar from '@/components/organisms/CategorySidebar'
import TaskModal from '@/components/organisms/TaskModal'

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleQuickAdd = () => {
    setIsQuickAddModalOpen(true)
  }

  const handleSubmitTask = async (taskData) => {
    setIsSubmitting(true)
    try {
      await taskService.create(taskData)
      toast.success('Task created successfully')
      setIsQuickAddModalOpen(false)
      // Force reload of tasks in the current page if it's the Tasks page
      window.location.reload()
    } catch (error) {
      toast.error('Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsQuickAddModalOpen(false)
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickAdd={handleQuickAdd}
      />
      <div className="flex-1 flex overflow-hidden">
        <CategorySidebar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ 
            searchQuery, 
            selectedCategory, 
            selectedPriority, 
            selectedStatus 
          }} />
        </main>
      </div>

      {/* Quick Add Task Modal */}
      <TaskModal
        isOpen={isQuickAddModalOpen}
        onClose={handleCloseModal}
        task={null}
        categories={categories}
        onSubmit={handleSubmitTask}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

export default Layout