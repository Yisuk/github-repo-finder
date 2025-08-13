import { useState } from 'react'
import './App.css'
import SearchInput from './components/SearchInput'
import SearchResults from './components/SearchResults'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    setIsSearching(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>GitHub Repository Finder</h1>
        <p>Search and discover GitHub repositories</p>
      </header>
      
      <main className="app-main">
        <SearchInput onSearch={handleSearch} loading={isSearching} />
        <SearchResults query={searchQuery} />
      </main>
    </div>
  )
}

export default App
