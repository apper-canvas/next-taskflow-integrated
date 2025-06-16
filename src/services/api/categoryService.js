import mockCategories from '../mockData/categories.json'
import { taskService } from '../index.js'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...mockCategories]

const categoryService = {
  async getAll() {
    await delay(200)
    // Update task counts dynamically
    const tasks = await taskService.getAll()
    const updatedCategories = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.category === category.id).length
    }))
    return [...updatedCategories]
  },

  async getById(id) {
    await delay(150)
    const category = categories.find(cat => cat.id === id)
    if (!category) throw new Error('Category not found')
    return { ...category }
  },

  async create(categoryData) {
    await delay(250)
    const newCategory = {
      id: Date.now().toString(),
      name: categoryData.name,
      color: categoryData.color,
      taskCount: 0
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, categoryData) {
    await delay(200)
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    
    const updatedCategory = { ...categories[index], ...categoryData }
    categories[index] = updatedCategory
    return { ...updatedCategory }
  },

  async delete(id) {
    await delay(200)
    const index = categories.findIndex(cat => cat.id === id)
    if (index === -1) throw new Error('Category not found')
    categories.splice(index, 1)
    return true
  }
}

export default categoryService