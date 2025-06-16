const categoryService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "Fields": ['Name', 'color', 'task_count']
      }
      
      const response = await apperClient.fetchRecords('category', params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      // Get task counts dynamically
      const taskParams = {
        "Fields": ['category']
      }
      
      const tasksResponse = await apperClient.fetchRecords('task', taskParams)
      const tasks = tasksResponse?.data || []
      
      return response.data.map(category => {
        const taskCount = tasks.filter(task => task.category === category.Id).length
        
        return {
          id: category.Id.toString(),
          name: category.Name,
          color: category.color,
          taskCount: taskCount
        }
      })
    } catch (error) {
      console.error("Error fetching categories:", error)
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
        fields: ['Name', 'color', 'task_count']
      }
      
      const response = await apperClient.getRecordById('category', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      const category = response.data
      return {
        id: category.Id.toString(),
        name: category.Name,
        color: category.color,
        taskCount: category.task_count || 0
      }
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error)
      return null
    }
  },

  async create(categoryData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: categoryData.name,
            color: categoryData.color,
            task_count: 0
          }
        ]
      }
      
      const response = await apperClient.createRecord('category', params)
      
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
          const category = successfulRecords[0].data
          return {
            id: category.Id.toString(),
            name: category.Name,
            color: category.color,
            taskCount: category.task_count || 0
          }
        }
      }
    } catch (error) {
      console.error("Error creating category:", error)
      throw error
    }
  },

  async update(id, categoryData) {
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
      if (categoryData.name !== undefined) updateData.Name = categoryData.name
      if (categoryData.color !== undefined) updateData.color = categoryData.color
      if (categoryData.taskCount !== undefined) updateData.task_count = categoryData.taskCount
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('category', params)
      
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
          const category = successfulUpdates[0].data
          return {
            id: category.Id.toString(),
            name: category.Name,
            color: category.color,
            taskCount: category.task_count || 0
          }
        }
      }
    } catch (error) {
      console.error("Error updating category:", error)
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
      
      const response = await apperClient.deleteRecord('category', params)
      
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
      console.error("Error deleting category:", error)
      throw error
    }
  }
}

export default categoryService