import React from 'react'
import { motion } from 'framer-motion'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ searchQuery, onSearchChange, onQuickAdd }) => {
  return (
    <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
      <div className="h-full px-6 flex items-center justify-between max-w-full">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-heading font-bold text-surface-900">
              TaskFlow
            </h1>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search tasks..."
            className="flex-1"
          />
        </div>

        <div className="flex items-center space-x-3">
          <Button
            icon="Plus"
            onClick={onQuickAdd}
            className="hidden sm:flex"
          >
            Quick Add
          </Button>
          
          <Button
            icon="Plus"
            onClick={onQuickAdd}
            className="sm:hidden p-2"
            variant="primary"
          />
        </div>
      </div>
    </header>
  )
}

export default Header