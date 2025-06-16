import mockTasks from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...mockTasks]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(task => task.id === id)
    if (!task) throw new Error('Task not found')
    return { ...task }
  },

  async create(taskData) {
    await delay(300)
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      category: taskData.category || 'personal',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await delay(250)
    const index = tasks.findIndex(task => task.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      completedAt: taskData.completed && !tasks[index].completed 
        ? new Date().toISOString() 
        : taskData.completed === false 
        ? null 
        : tasks[index].completedAt
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(task => task.id === id)
    if (index === -1) throw new Error('Task not found')
    tasks.splice(index, 1)
    return true
  },

  async bulkUpdate(ids, updates) {
    await delay(300)
    const updatedTasks = []
    
    for (const id of ids) {
      const index = tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        const updatedTask = {
          ...tasks[index],
          ...updates,
          completedAt: updates.completed && !tasks[index].completed 
            ? new Date().toISOString() 
            : updates.completed === false 
            ? null 
            : tasks[index].completedAt
        }
        tasks[index] = updatedTask
        updatedTasks.push({ ...updatedTask })
      }
    }
    
    return updatedTasks
  },

  async bulkDelete(ids) {
    await delay(300)
    tasks = tasks.filter(task => !ids.includes(task.id))
    return true
  }
}

export default taskService