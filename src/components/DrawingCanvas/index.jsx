import React, { useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import styles from './style.module.scss'
import { useGetBoardDrawings } from '../../services/board.service'

const socket = io('http://localhost:3000', { transports: ['websocket'] })

const DrawingCanvas = () => {
  const canvasRef = useRef(null)
  const { id, name } = useParams()
  console.log('name', name)
  const { data, isLoading } = useGetBoardDrawings({ id })
  const boardData = data?.data

  const onDraw = useCallback((data) => {
    socket.emit('draw', data)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const drawStrokes = (strokes) => {
      strokes.forEach((stroke) => {
        context.beginPath()
        context.strokeStyle = stroke.color
        context.lineWidth = stroke.width
        const coordinates = stroke.coordinates
        if (coordinates.length > 0) {
          context.moveTo(coordinates[0].x, coordinates[0].y)
          coordinates.forEach(({ x, y }) => {
            context.lineTo(x, y)
          })
          context.stroke()
        }
      })
    }

    if (boardData && canvas) {
      boardData.forEach((drawing) => {
        if (drawing.strokes && drawing.strokes.length > 0) {
          drawStrokes(drawing.strokes)
        }
      })
    }
  }, [boardData])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      socket.emit('joinBoard', { boardId: id })
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
  }, [id])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.strokeStyle = '#000000'
    context.lineWidth = 2

    let drawing = false

    let currentStroke = []

    const startDrawing = (e) => {
      const { offsetX, offsetY } = e
      drawing = true
      currentStroke = []
      context.beginPath()
      context.moveTo(offsetX, offsetY)
      currentStroke.push({ x: offsetX, y: offsetY })
    }

    const draw = (e) => {
      if (!drawing) return
      const { offsetX, offsetY } = e
      context.lineTo(offsetX, offsetY)
      context.stroke()
      currentStroke.push({ x: offsetX, y: offsetY })
    }

    const stopDrawing = () => {
      if (!drawing) return
      drawing = false
      context.closePath()
      onDraw({
        board: id,
        strokes: [
          {
            color: context.strokeStyle,
            width: context.lineWidth,
            coordinates: currentStroke
          }
        ]
      })
      currentStroke = []
    }

    canvas.addEventListener('mousedown', (e) => startDrawing(e))
    canvas.addEventListener('mousemove', (e) => draw(e))
    canvas.addEventListener('mouseup', (e) => stopDrawing(e))

    return () => {
      canvas.removeEventListener('mousedown', startDrawing)
      canvas.removeEventListener('mousemove', draw)
      canvas.removeEventListener('mouseup', stopDrawing)
    }
  }, [id, onDraw])

  return (
    <div className={styles.canvasContainer}>
      <div>
        <h2>User: {name}</h2>
      </div>
      <div>
        <h4>{isLoading && 'Loading previous drawings...'}</h4>
      </div>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={800}
        height={800}
      />
    </div>
  )
}

export default DrawingCanvas
