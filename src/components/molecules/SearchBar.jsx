import React from 'react'
import Input from '@/components/atoms/Input'

const SearchBar = ({ value, onChange, placeholder = "Search tasks...", className = '' }) => {
  return (
    <div className={className}>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon="Search"
        className="border-0 bg-surface-50 focus:bg-white focus:ring-1"
      />
    </div>
  )
}

export default SearchBar