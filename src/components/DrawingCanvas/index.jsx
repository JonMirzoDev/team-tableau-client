// DrawingCanvas.js
import React, { useCallback, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', { transports: ['websocket'] })
const boardId = '657d8746e672c0ea3c786b98' // This should be dynamic in a real app

const DrawingCanvas = () => {
  const canvasRef = useRef(null) // Initialize the ref

  // Define onDraw using useCallback
  const onDraw = useCallback((data) => {
    // Emit drawing data to the server
    socket.emit('draw', data)
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
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
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.strokeStyle = '#000000' // Default black color
    context.lineWidth = 2

    let drawing = false

    let currentStroke = []

    const startDrawing = (e) => {
      const { offsetX, offsetY } = e
      drawing = true
      currentStroke = []
      context.beginPath()
      context.moveTo(offsetX, offsetY)
      currentStroke.push({ x: offsetX, y: offsetY }) // Start the stroke
    }

    const draw = (e) => {
      if (!drawing) return
      const { offsetX, offsetY } = e
      context.lineTo(offsetX, offsetY)
      context.stroke()
      currentStroke.push({ x: offsetX, y: offsetY }) // Add point to the current stroke
    }

    const stopDrawing = () => {
      if (!drawing) return
      drawing = false
      context.closePath()
      // Emit the entire stroke to the server
      onDraw({
        boardId: '657d8746e672c0ea3c786b98', // Replace with actual board ID
        strokes: [
          {
            color: context.strokeStyle,
            width: context.lineWidth,
            coordinates: currentStroke
          }
        ]
      })
      currentStroke = [] // Clear the current stroke
    }

    // Add event listeners for 'mousedown', 'mousemove', and 'mouseup'
    canvas.addEventListener('mousedown', (e) => startDrawing(e))
    canvas.addEventListener('mousemove', (e) => draw(e))
    canvas.addEventListener('mouseup', (e) => stopDrawing(e))

    // Clean up event listeners on component unmount
    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
    }
  }, [onDraw]) // Include onDraw in the dependency array

  return (
    <canvas
      ref={canvasRef}
      width='800'
      height='600'
      style={{ border: '1px solid black', cursor: 'crosshair' }}
    />
  )
}

export default DrawingCanvas
