"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react"
import { Box } from "@mui/material"

interface DrawingCanvasProps {
  brushColor: string
  brushSize: number
  onDrawingComplete: (paths: any[]) => void
}

interface Point {
  x: number
  y: number
}

interface Path {
  points: Point[]
  color: string
  size: number
}

export const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(
  ({ brushColor, brushSize, onDrawingComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isDrawing, setIsDrawing] = useState<boolean>(false)
    const [paths, setPaths] = useState<Path[]>([])
    const [currentPath, setCurrentPath] = useState<Path | null>(null)

    // Forward the canvas ref
    useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement)

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas size to match parent
      const resizeCanvas = () => {
        const parent = canvas.parentElement
        if (parent) {
          canvas.width = parent.clientWidth
          canvas.height = parent.clientHeight

          // Redraw all paths when canvas is resized
          redrawCanvas()
        }
      }

      // Initial resize
      resizeCanvas()

      // Listen for window resize
      window.addEventListener("resize", resizeCanvas)

      // Clean up
      return () => {
        window.removeEventListener("resize", resizeCanvas)
      }
    }, [])

    // Redraw all paths on the canvas
    const redrawCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw all paths
      paths.forEach((path) => {
        if (path.points.length < 2) return

        ctx.beginPath()
        ctx.moveTo(path.points[0].x, path.points[0].y)

        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y)
        }

        ctx.strokeStyle = path.color
        ctx.lineWidth = path.size
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      })
    }

    // Start drawing
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true)

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Create a new path
      const newPath = {
        points: [{ x, y }],
        color: brushColor,
        size: brushSize,
      }

      setCurrentPath(newPath)
      setPaths([...paths, newPath])
    }

    // Continue drawing
    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !currentPath) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Add point to current path
      const updatedPath = { ...currentPath }
      updatedPath.points.push({ x, y })
      setCurrentPath(updatedPath)

      // Update the last path in the paths array
      const updatedPaths = [...paths]
      updatedPaths[updatedPaths.length - 1] = updatedPath
      setPaths(updatedPaths)

      // Draw the line segment
      const points = updatedPath.points
      const lastIndex = points.length - 1

      if (lastIndex > 0) {
        ctx.beginPath()
        ctx.moveTo(points[lastIndex - 1].x, points[lastIndex - 1].y)
        ctx.lineTo(points[lastIndex].x, points[lastIndex].y)
        ctx.strokeStyle = updatedPath.color
        ctx.lineWidth = updatedPath.size
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }
    }

    // End drawing
    const handleMouseUp = () => {
      if (isDrawing && currentPath) {
        setIsDrawing(false)

        // Complete the drawing
        if (currentPath.points.length > 1) {
          onDrawingComplete([...paths])
        } else {
          // Remove single-point paths
          const updatedPaths = [...paths]
          updatedPaths.pop()
          setPaths(updatedPaths)
        }

        setCurrentPath(null)
      }
    }

    // Handle touch events for mobile
    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()

      const canvas = canvasRef.current
      if (!canvas) return

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      setIsDrawing(true)

      // Create a new path
      const newPath = {
        points: [{ x, y }],
        color: brushColor,
        size: brushSize,
      }

      setCurrentPath(newPath)
      setPaths([...paths, newPath])
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()

      if (!isDrawing || !currentPath) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const touch = e.touches[0]
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      const y = touch.clientY - rect.top

      // Add point to current path
      const updatedPath = { ...currentPath }
      updatedPath.points.push({ x, y })
      setCurrentPath(updatedPath)

      // Update the last path in the paths array
      const updatedPaths = [...paths]
      updatedPaths[updatedPaths.length - 1] = updatedPath
      setPaths(updatedPaths)

      // Draw the line segment
      const points = updatedPath.points
      const lastIndex = points.length - 1

      if (lastIndex > 0) {
        ctx.beginPath()
        ctx.moveTo(points[lastIndex - 1].x, points[lastIndex - 1].y)
        ctx.lineTo(points[lastIndex].x, points[lastIndex].y)
        ctx.strokeStyle = updatedPath.color
        ctx.lineWidth = updatedPath.size
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }
    }

    const handleTouchEnd = () => {
      handleMouseUp()
    }

    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1000,
          cursor: "crosshair",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            touchAction: "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </Box>
    )
  },
)

DrawingCanvas.displayName = "DrawingCanvas"
