// App.js
import React from 'react'
import { useGetBoards } from './services/board.service'
import Boards from './components/Boards'

function App() {
  const { data: boards, isLoading } = useGetBoards()

  return (
    <div className='App'>
      <h1 style={{ textAlign: 'center' }}>Welcome to Team Tableau!</h1>
      <Boards boards={boards?.data} isBoardsLoading={isLoading} />
    </div>
  )
}

export default App
