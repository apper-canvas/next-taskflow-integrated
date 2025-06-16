const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "Fields": ['Name', 'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'completed_at', 'order'],
        "orderBy": [
          {
            "FieldName": "order",
            "SortType": "ASC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('task', params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data.map(task => ({
        id: task.Id,
        title: task.title,
        completed: task.completed,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        completedAt: task.completed_at,
        order: task.order
      }))
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return []
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        fields: ['Name', 'title', 'completed', 'category', 'priority', 'due_date', 'created_at', 'completed_at', 'order']
      }
      
      const response = await apperClient.getRecordById('task', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      const task = response.data
      return {
        id: task.Id,
        title: task.title,
        completed: task.completed,
        category: task.category,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        completedAt: task.completed_at,
        order: task.order
      }
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error)
      return null
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      // Get max order for category
      const existingTasks = await this.getAll()
      const categoryTasks = existingTasks.filter(t => t.category === (taskData.category || 'personal'))
      const maxOrder = categoryTasks.length > 0 
        ? Math.max(...categoryTasks.map(t => t.order || 0))
        : 0
      
      const params = {
        records: [
          {
            title: taskData.title,
            completed: false,
            category: parseInt(taskData.category) || null,
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || null,
            order: maxOrder + 1,
            created_at: new Date().toISOString(),
            completed_at: null
          }
        ]
      }
      
      const response = await apperClient.createRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            completedAt: task.completed_at,
            order: task.order
          }
        }
      }
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  },

  async update(id, taskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const updateData = {
        Id: parseInt(id)
      }
      
      // Only include updateable fields that are provided
      if (taskData.title !== undefined) updateData.title = taskData.title
      if (taskData.completed !== undefined) {
        updateData.completed = taskData.completed
        updateData.completed_at = taskData.completed ? new Date().toISOString() : null
      }
      if (taskData.category !== undefined) updateData.category = parseInt(taskData.category) || null
      if (taskData.priority !== undefined) updateData.priority = taskData.priority
      if (taskData.dueDate !== undefined) updateData.due_date = taskData.dueDate
      if (taskData.order !== undefined) updateData.order = taskData.order
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            completedAt: task.completed_at,
            order: task.order
          }
        }
      }
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return true
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },

  async bulkUpdate(ids, updates) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const records = ids.map(id => {
        const updateData = { Id: parseInt(id) }
        
        if (updates.completed !== undefined) {
          updateData.completed = updates.completed
          updateData.completed_at = updates.completed ? new Date().toISOString() : null
        }
        if (updates.priority !== undefined) updateData.priority = updates.priority
        if (updates.category !== undefined) updateData.category = parseInt(updates.category) || null
        
        return updateData
      })
      
      const params = { records }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.map(result => {
          const task = result.data
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            completedAt: task.completed_at,
            order: task.order
          }
        })
      }
    } catch (error) {
      console.error("Error bulk updating tasks:", error)
      throw error
    }
  },

  async bulkDelete(ids) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      }
      
      const response = await apperClient.deleteRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
        }
        
        return true
      }
    } catch (error) {
      console.error("Error bulk deleting tasks:", error)
      throw error
    }
  },

  async reorderTasks(taskIds) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const records = taskIds.map((taskId, index) => ({
        Id: parseInt(taskId),
        order: index + 1
      }))
      
      const params = { records }
      
      const response = await apperClient.updateRecord('task', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to reorder ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
        }
        
        return successfulUpdates.map(result => {
          const task = result.data
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            category: task.category,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            completedAt: task.completed_at,
            order: task.order
          }
        })
      }
    } catch (error) {
      console.error("Error reordering tasks:", error)
      throw error
    }
  }
}

export default taskService