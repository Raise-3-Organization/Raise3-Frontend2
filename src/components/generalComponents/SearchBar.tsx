"use client"

import React from "react"
import { Search } from "lucide-react"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search", onSearch }) => {
  const [query, setQuery] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className="relative" style={{ width: '366px' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-12 pr-4 h-[38px] rounded-[1000px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ marginTop: '16px', marginLeft: '38px' }}
      />
      <div className="absolute inset-y-0 left-0 pl-[50px] flex items-center pointer-events-none" style={{ marginTop: '16px' }}>
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  )
}

export default SearchBar 