// App.js
import React, { useEffect, useRef } from 'react'
import io from 'socket.io-client'
import DrawingCanvas from './components/DrawingCanvas'

const socket = io('http://localhost:3000', { transports: ['websocket'] })
const boardId = '657d8746e672c0ea3c786b98' // This should be dynamic in a real app

function App() {
  const canvasRef = useRef(null) // Initialize the ref

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      // Emit the joinBoard event with the board ID
      socket.emit('joinBoard', { boardId: boardId })
    })

    socket.on('drawing', (data) => {
      console.log('New drawing received', data)
      const canvas = canvasRef.current
      if (canvas && data.strokes) {
        const context = canvas.getContext('2d')
        context.beginPath()
        context.strokeStyle = data.strokes[0].color
        context.lineWidth = data.strokes[0].width
        context.moveTo(
          data.strokes[0].coordinates[0].x,
          data.strokes[0].coordinates[0].y
        )
        data.strokes[0].coordinates.forEach((coord) => {
          context.lineTo(coord.x, coord.y)
        })
        context.stroke()
      }
    })

    return () => {
      socket.off('connect')
      socket.off('drawing')
    }
  }, [])

  const handleDraw = (data) => {
    // Emit drawing data to the server
    socket.emit('draw', data)
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
      <DrawingCanvas onDraw={handleDraw} canvasRef={canvasRef} />
    </div>
  )
}

export default App
