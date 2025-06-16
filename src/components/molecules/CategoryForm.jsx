import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const CategoryForm = ({ 
  category = null, 
  onSubmit, 
  onCancel,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#5B4CFF'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        color: category.color || '#5B4CFF'
      })
    }
  }, [category])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const categoryData = {
      ...formData,
      name: formData.name.trim()
    }
    
    onSubmit(categoryData)
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

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }))
  }

  const colorOptions = [
    '#5B4CFF', '#4ECDC4', '#FF6B6B', '#FFD93D', '#51CF66',
    '#9C88FF', '#20C997', '#FD7E14', '#E83E8C', '#6F42C1'
  ]

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Category Name"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Enter category name..."
        error={errors.name}
        disabled={isSubmitting}
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-surface-700">
          Color
        </label>
        <div className="grid grid-cols-5 gap-3">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                formData.color === color 
                  ? 'border-surface-700 scale-110 shadow-md' 
                  : 'border-surface-300 hover:border-surface-400'
              }`}
              style={{ backgroundColor: color }}
              disabled={isSubmitting}
            />
          ))}
        </div>
      </div>

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
          icon={category ? "Save" : "Plus"}
        >
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </motion.form>
  )
}

export default CategoryForm