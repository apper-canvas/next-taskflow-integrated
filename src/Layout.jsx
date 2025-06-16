import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/organisms/Header'
import CategorySidebar from '@/components/organisms/CategorySidebar'

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
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
    </div>
  )
}

export default Layout