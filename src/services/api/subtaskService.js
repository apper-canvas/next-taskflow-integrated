const subtaskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "Fields": ['Name', 'Description', 'Status', 'Task'],
        "orderBy": [
          {
            "FieldName": "CreatedOn",
            "SortType": "ASC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('subtask', params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data.map(subtask => ({
        id: subtask.Id,
        name: subtask.Name,
        description: subtask.Description,
        status: subtask.Status,
        taskId: subtask.Task
      }))
    } catch (error) {
      console.error("Error fetching subtasks:", error)
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
        fields: ['Name', 'Description', 'Status', 'Task']
      }
      
      const response = await apperClient.getRecordById('subtask', id, params)
      
      if (!response || !response.data) {
        return null
      }
      
      const subtask = response.data
      return {
        id: subtask.Id,
        name: subtask.Name,
        description: subtask.Description,
        status: subtask.Status,
        taskId: subtask.Task
      }
    } catch (error) {
      console.error(`Error fetching subtask with ID ${id}:`, error)
      return null
    }
  },

  async getByTaskId(taskId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        "Fields": ['Name', 'Description', 'Status', 'Task'],
        "where": [
          {
            "FieldName": "Task",
            "Operator": "ExactMatch",
            "Values": [parseInt(taskId)]
          }
        ],
        "orderBy": [
          {
            "FieldName": "CreatedOn",
            "SortType": "ASC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('subtask', params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }
      
      return response.data.map(subtask => ({
        id: subtask.Id,
        name: subtask.Name,
        description: subtask.Description,
        status: subtask.Status,
        taskId: subtask.Task
      }))
    } catch (error) {
      console.error(`Error fetching subtasks for task ${taskId}:`, error)
      return []
    }
  },

  async create(subtaskData) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      
      const params = {
        records: [
          {
            Name: subtaskData.name,
            Description: subtaskData.description || '',
            Status: subtaskData.status || 'Not Started',
            Task: parseInt(subtaskData.taskId)
          }
        ]
      }
      
      const response = await apperClient.createRecord('subtask', params)
      
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
          const subtask = successfulRecords[0].data
          return {
            id: subtask.Id,
            name: subtask.Name,
            description: subtask.Description,
            status: subtask.Status,
            taskId: subtask.Task
          }
        }
      }
    } catch (error) {
      console.error("Error creating subtask:", error)
      throw error
    }
  },

  async update(id, subtaskData) {
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
      if (subtaskData.name !== undefined) updateData.Name = subtaskData.name
      if (subtaskData.description !== undefined) updateData.Description = subtaskData.description
      if (subtaskData.status !== undefined) updateData.Status = subtaskData.status
      if (subtaskData.taskId !== undefined) updateData.Task = parseInt(subtaskData.taskId)
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('subtask', params)
      
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
          const subtask = successfulUpdates[0].data
          return {
            id: subtask.Id,
            name: subtask.Name,
            description: subtask.Description,
            status: subtask.Status,
            taskId: subtask.Task
          }
        }
      }
    } catch (error) {
      console.error("Error updating subtask:", error)
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
      
      const response = await apperClient.deleteRecord('subtask', params)
      
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
      console.error("Error deleting subtask:", error)
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
        
        if (updates.status !== undefined) updateData.Status = updates.status
        if (updates.name !== undefined) updateData.Name = updates.name
        if (updates.description !== undefined) updateData.Description = updates.description
        
        return updateData
      })
      
      const params = { records }
      
      const response = await apperClient.updateRecord('subtask', params)
      
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
          const subtask = result.data
          return {
            id: subtask.Id,
            name: subtask.Name,
            description: subtask.Description,
            status: subtask.Status,
            taskId: subtask.Task
          }
        })
      }
    } catch (error) {
      console.error("Error bulk updating subtasks:", error)
      throw error
    }
  }
}

export default subtaskService