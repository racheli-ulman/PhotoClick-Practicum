"use client"

import React, { forwardRef, useRef, useEffect } from "react"
import { Box, Typography, Paper, Grid, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import type { CollageState } from "./use-collage-state"
import { DrawingCanvas } from "./DrawingCanvas"

interface CollageCanvasProps {
  photos: any[]
  collageState: CollageState
  drawingCanvasRef: React.RefObject<HTMLCanvasElement|null>
}

export const CollageCanvas = forwardRef<HTMLDivElement, CollageCanvasProps>(
  ({ photos, collageState, drawingCanvasRef }, ref) => {
    const [isDragging, setIsDragging] = React.useState<boolean>(false)
    const [dragStartPos, setDragStartPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [isResizing, setIsResizing] = React.useState<boolean>(false)
    const [resizeStartSize, setResizeStartSize] = React.useState<{ width: number; height: number }>({
      width: 0,
      height: 0,
    })
    const [resizeStartPos, setResizeStartPos] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 })

    // Handle canvas click for placing elements
    const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (collageState.placementMode === "none") return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (collageState.placementMode === "shape" && collageState.pendingShape) {
        const newShape = {
          type: "shape" as const,
          x,
          y,
          width: 100,
          height: 100,
          rotation: 0,
          data: {
            type: collageState.pendingShape,
            color: collageState.brushColor,
            borderWidth: 2,
            borderColor: "#000000",
            fillColor: "rgba(255, 255, 255, 0.5)",
          },
        }

        collageState.addDrawingElement(newShape)
        collageState.setPlacementMode("none")
        collageState.setPendingShape(null)
      } else if (collageState.placementMode === "sticker" && collageState.pendingSticker) {
        const img = new Image()
        img.src = collageState.pendingSticker

        img.onload = () => {
          const aspectRatio = img.width / img.height
          const width = 100
          const height = width / aspectRatio

          const newSticker = {
            type: "sticker" as const,
            x,
            y,
            width,
            height,
            rotation: 0,
            data: {
              url: collageState.pendingSticker,
            },
          }

          collageState.addDrawingElement(newSticker)
          collageState.setPlacementMode("none")
          collageState.setPendingSticker(null)
        }
      } else if (collageState.placementMode === "text" && collageState.pendingText) {
        const newText = {
          type: "text" as const,
          x,
          y,
          data: {
            text: collageState.pendingText,
            color: collageState.textColor,
            fontSize: collageState.textSize,
            fontStyle: collageState.textStyle,
            shadow: collageState.textShadow,
          },
        }

        collageState.addDrawingElement(newText)
        collageState.setPlacementMode("none")
        collageState.setPendingText(null)
      }
    }

    // Element dragging functions
    const handleElementDragStart = (e: React.MouseEvent, id: string) => {
      e.preventDefault()
      collageState.setSelectedElement(id)
      setIsDragging(true)
      setDragStartPos({ x: e.clientX, y: e.clientY })

      document.addEventListener("mousemove", handleElementDrag)
      document.addEventListener("mouseup", handleElementDragEnd)
    }

    const handleElementDrag = (e: MouseEvent) => {
      if (!isDragging || !collageState.selectedElement) return

      const elementIndex = collageState.drawingElements.findIndex((el) => el.id === collageState.selectedElement)
      if (elementIndex === -1) return

      const element = collageState.drawingElements[elementIndex]
      const dx = e.clientX - dragStartPos.x
      const dy = e.clientY - dragStartPos.y

      const updatedElements = [...collageState.drawingElements]
      updatedElements[elementIndex] = {
        ...element,
        x: element.x + dx,
        y: element.y + dy,
      }

      collageState.setDrawingElements(updatedElements)
      setDragStartPos({ x: e.clientX, y: e.clientY })
    }

    const handleElementDragEnd = () => {
      setIsDragging(false)
      document.removeEventListener("mousemove", handleElementDrag)
      document.removeEventListener("mouseup", handleElementDragEnd)

      if (collageState.selectedElement) {
        collageState.setUndoStack([...collageState.undoStack, [...collageState.drawingElements]])
        collageState.setRedoStack([])
      }
    }

    // Element resizing functions
    const handleResizeStart = (e: React.MouseEvent, id: string) => {
      e.preventDefault()
      e.stopPropagation()
      collageState.setSelectedElement(id)
      setIsResizing(true)
      setResizeStartPos({ x: e.clientX, y: e.clientY })

      const element = collageState.drawingElements.find((el) => el.id === id)
      if (!element || !element.width || !element.height) return

      setResizeStartSize({ width: element.width, height: element.height })

      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", handleResizeEnd)
    }

    const handleResize = (e: MouseEvent) => {
      if (!isResizing || !collageState.selectedElement) return

      const elementIndex = collageState.drawingElements.findIndex((el) => el.id === collageState.selectedElement)
      if (elementIndex === -1) return

      const element = collageState.drawingElements[elementIndex]
      if (!element.width || !element.height) return

      const dx = e.clientX - resizeStartPos.x
      const dy = e.clientY - resizeStartPos.y

      const updatedElements = [...collageState.drawingElements]
      updatedElements[elementIndex] = {
        ...element,
        width: Math.max(20, resizeStartSize.width + dx),
        height: Math.max(20, resizeStartSize.height + dy),
      }

      collageState.setDrawingElements(updatedElements)
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleResize)
      document.removeEventListener("mouseup", handleResizeEnd)

      if (collageState.selectedElement) {
        collageState.setUndoStack([...collageState.undoStack, [...collageState.drawingElements]])
        collageState.setRedoStack([])
      }
    }

    // Touch event handlers for mobile support
    useEffect(() => {
      const handleTouchMove = (e: TouchEvent) => {
        if (isDragging && collageState.selectedElement) {
          e.preventDefault()
          const touch = e.touches[0]
          const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
          })
          handleElementDrag(mouseEvent)
        } else if (isResizing && collageState.selectedElement) {
          e.preventDefault()
          const touch = e.touches[0]
          const mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY,
          })
          handleResize(mouseEvent)
        }
      }

      const handleTouchEnd = () => {
        if (isDragging) {
          handleElementDragEnd()
        } else if (isResizing) {
          handleResizeEnd()
        }
      }

      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      return () => {
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)
      }
    }, [isDragging, isResizing, collageState.selectedElement])

    // Generate text styles based on user selection
    const getTextStyle = () => {
      let fontStyle = "normal"
      let fontWeight = "normal"

      switch (collageState.textStyle) {
        case "bold":
          fontWeight = "bold"
          break
        case "italic":
          fontStyle = "italic"
          break
        case "bold italic":
          fontWeight = "bold"
          fontStyle = "italic"
          break
        default:
          break
      }

      const shadow = collageState.textShadow
        ? "2px 2px 4px rgba(0,0,0,0.7), -2px -2px 4px rgba(0,0,0,0.7), 2px -2px 4px rgba(0,0,0,0.7), -2px 2px 4px rgba(0,0,0,0.7)"
        : "none"

      const positionStyle: React.CSSProperties = {
        position: "absolute",
        width: "100%",
        textAlign: "center",
        padding: "10px",
        zIndex: 1000,
        fontWeight,
        fontStyle,
        color: collageState.textColor,
        fontSize: `${collageState.textSize}px`,
        textShadow: shadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }

      if (collageState.showTextBackground) {
        positionStyle.backgroundColor = collageState.textBackgroundColor
      }

      switch (collageState.textPosition) {
        case "top":
          positionStyle.top = 0
          break
        case "center":
          positionStyle.top = "50%"
          positionStyle.transform = "translateY(-50%)"
          break
        case "bottom":
          positionStyle.bottom = 0
          break
      }

      return positionStyle
    }

    // Render cursor based on placement mode
    const getCursorStyle = () => {
      switch (collageState.placementMode) {
        case "shape":
          return "crosshair"
        case "sticker":
          return "crosshair"
        case "text":
          return "text"
        default:
          return "default"
      }
    }

    // Render placement guide
    const renderPlacementGuide = () => {
      if (collageState.placementMode === "none") return null

      let message = ""
      switch (collageState.placementMode) {
        case "shape":
          message = "לחץ על הקולאז' כדי למקם את הצורה"
          break
        case "sticker":
          message = "לחץ על הקולאז' כדי למקם את המדבקה"
          break
        case "text":
          message = "לחץ על הקולאז' כדי למקם את הטקסט"
          break
      }

      return (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            background: "linear-gradient(135deg, rgba(234, 102, 203, 0.9), rgba(189, 132, 246, 0.9))",
            color: "white",
            padding: "12px",
            textAlign: "center",
            zIndex: 1000,
            borderRadius: "8px 8px 0 0",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          {message}
        </Box>
      )
    }

    const TextOverlay = () =>
      collageState.overlayText ? <Box sx={getTextStyle()}>{collageState.overlayText}</Box> : null

    const renderDrawingElements = () => (
      <>
        {collageState.drawingElements.map((element) => {
          const isSelected = collageState.selectedElement === element.id
          const elementStyle: React.CSSProperties = {
            position: "absolute",
            left: `${element.x}px`,
            top: `${element.y}px`,
            zIndex: element.zIndex,
            transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
            cursor: "move",
            border: isSelected ? "2px dashed #1976d2" : "none",
            padding: isSelected ? "4px" : "0",
          }

          // Add resize handles if element is selected
          const resizeHandles = isSelected ? (
            <>
              <div
                key="bottom-right"
                style={{
                  position: "absolute",
                  right: "-8px",
                  bottom: "-8px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  cursor: "nwse-resize",
                  zIndex: 1001,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleResizeStart(e, element.id)
                }}
              />
              <div
                key="top-right"
                style={{
                  position: "absolute",
                  right: "-8px",
                  top: "-8px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  cursor: "nesw-resize",
                  zIndex: 1001,
                }}
              />
              <div
                key="bottom-left"
                style={{
                  position: "absolute",
                  left: "-8px",
                  bottom: "-8px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  cursor: "nesw-resize",
                  zIndex: 1001,
                }}
              />
              <div
                key="top-left"
                style={{
                  position: "absolute",
                  left: "-8px",
                  top: "-8px",
                  width: "16px",
                  height: "16px",
                  backgroundColor: "#1976d2",
                  borderRadius: "50%",
                  cursor: "nwse-resize",
                  zIndex: 1001,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "0",
                  zIndex: 1001,
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    collageState.removeDrawingElement(element.id)
                  }}
                  key={`delete-${element.id}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            </>
          ) : null

          switch (element.type) {
            case "shape":
              return (
                <div
                  key={element.id}
                  style={{
                    ...elementStyle,
                    width: element.width,
                    height: element.height,
                  }}
                  onClick={() => collageState.setSelectedElement(element.id)}
                  onMouseDown={(e) => handleElementDragStart(e, element.id)}
                >
                  {renderShape(
                    element.data.type,
                    element.data.color,
                    element.data.fillColor,
                    element.width ?? 0,
                    element.height ?? 0,
                  )}
                  {resizeHandles}
                </div>
              )

            case "sticker":
              return (
                <div
                  key={element.id}
                  style={{
                    ...elementStyle,
                    width: element.width,
                    height: element.height,
                  }}
                  onClick={() => collageState.setSelectedElement(element.id)}
                  onMouseDown={(e) => handleElementDragStart(e, element.id)}
                >
                  <img
                    src={element.data.url || "/placeholder.svg"}
                    alt="Sticker"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                  {resizeHandles}
                </div>
              )

            case "text":
              return (
                <div
                  key={element.id}
                  style={{
                    ...elementStyle,
                    color: element.data.color,
                    fontSize: `${element.data.fontSize}px`,
                    fontWeight: element.data.fontStyle.includes("bold") ? "bold" : "normal",
                    fontStyle: element.data.fontStyle.includes("italic") ? "italic" : "normal",
                    textShadow: element.data.shadow ? "2px 2px 4px rgba(0,0,0,0.7)" : "none",
                    padding: "5px",
                  }}
                  onClick={() => collageState.setSelectedElement(element.id)}
                  onMouseDown={(e) => handleElementDragStart(e, element.id)}
                >
                  {element.data.text}
                  {resizeHandles}
                </div>
              )

            case "brush":
              return (
                <div
                  key={element.id}
                  style={{
                    ...elementStyle,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  <BrushStrokes paths={element.data.paths} />
                </div>
              )

            default:
              return null
          }
        })}
      </>
    )

    // Add this component to render brush strokes
    const BrushStrokes = ({ paths }: { paths: any[] }) => {
      const canvasRef = useRef<HTMLCanvasElement>(null)

      useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Set canvas size
        if (canvasRef.current && canvasRef.current.parentElement) {
          canvas.width = canvasRef.current.parentElement.clientWidth
          canvas.height = canvasRef.current.parentElement.clientHeight
        } else {
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight
        }

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
      }, [paths])

      return (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )
    }

    // Dummy renderShape function
    const renderShape = (shapeType: string, color: string, fillColor: string, width: number, height: number) => {
      return (
        <Box
          sx={{
            width: width,
            height: height,
            backgroundColor: fillColor,
            border: `2px solid ${color}`,
            borderRadius: shapeType === "circle" ? "50%" : 0,
          }}
        />
      )
    }

    // Render different layouts
    const renderCollage = () => {
      if (!photos || photos.length === 0) {
        return <Typography align="center">אין תמונות נבחרות ליצירת קולאז'</Typography>
      }

      console.log(`Rendering collage with ${photos.length} photos, layout: ${collageState.layout}`)

      switch (collageState.layout) {
        case "grid":
          return (
            <Box sx={{ position: "relative" }}>
              <Grid container spacing={collageState.gapSize / 4}>
                {photos.map((photo) => (
                  <Grid item xs={6} sm={4} key={photo.id}>
                    <Paper
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "transform 0.2s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    >
                      <img
                        src={photo.photoPath || "/placeholder.svg"}
                        alt={photo.photoName || "תמונה"}
                        style={{
                          width: "100%",
                          height: "auto",
                          display: "block",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          console.error(`Error loading image: ${photo.photoPath}`)
                          ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
                        }}
                      />
                      {collageState.showPhotoNames && (
                        <Box sx={{ p: 1 }}>
                          <Typography variant="caption" display="block" align="center">
                            {photo.photoName || "תמונה ללא שם"}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <TextOverlay />
              {renderDrawingElements()}
            </Box>
          )

        case "horizontal":
          return (
            <Box sx={{ position: "relative" }}>
              <Box sx={{ display: "flex", flexDirection: "row", gap: `${collageState.gapSize}px`, overflowX: "auto" }}>
                {photos.map((photo) => (
                  <Paper
                    elevation={2}
                    key={photo.id}
                    sx={{
                      flex: "0 0 auto",
                      width: `${100 / Math.min(photos.length, 3)}%`,
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <img
                      src={photo.photoPath || "/placeholder.svg"}
                      alt={photo.photoName || "תמונה"}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
                      }}
                    />
                    {collageState.showPhotoNames && (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" display="block" align="center">
                          {photo.photoName || "תמונה ללא שם"}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
              <TextOverlay />
              {renderDrawingElements()}
            </Box>
          )

        case "vertical":
          return (
            <Box sx={{ position: "relative" }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: `${collageState.gapSize}px` }}>
                {photos.map((photo) => (
                  <Paper
                    elevation={2}
                    key={photo.id}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <img
                      src={photo.photoPath || "/placeholder.svg"}
                      alt={photo.photoName || "תמונה"}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "250px",
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
                      }}
                    />
                    {collageState.showPhotoNames && (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" display="block" align="center">
                          {photo.photoName || "תמונה ללא שם"}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                ))}
              </Box>
              <TextOverlay />
              {renderDrawingElements()}
            </Box>
          )

        case "random":
          return (
            <Box sx={{ position: "relative", height: "500px" }}>
              {photos.map((photo, index) => {
                // Generate random positions but ensure all photos are visible
                const left = Math.floor(Math.random() * 60)
                const top = Math.floor(Math.random() * 60)
                const zIndex = index + 1
                const rotation = Math.floor(Math.random() * 20) - 10

                return (
                  <Paper
                    elevation={3}
                    key={photo.id}
                    sx={{
                      position: "absolute",
                      left: `${left}%`,
                      top: `${top}%`,
                      zIndex,
                      transform: `rotate(${rotation}deg)`,
                      width: "40%",
                      transition: "all 0.3s ease",
                      borderRadius: 3,
                      overflow: "hidden",
                      "&:hover": {
                        transform: `rotate(${rotation}deg) scale(1.05)`,
                      },
                    }}
                  >
                    <img
                      src={photo.photoPath || "/placeholder.svg"}
                      alt={photo.photoName || "תמונה"}
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
                      }}
                    />
                    {collageState.showPhotoNames && (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" display="block" align="center" noWrap>
                          {photo.photoName || "תמונה ללא שם"}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )
              })}
              <TextOverlay />
              {renderDrawingElements()}
            </Box>
          )

        default:
          return <Typography align="center">פריסת קולאז' לא חוקית</Typography>
      }
    }

    return (
      <>
        {renderPlacementGuide()}
        <Box
          ref={ref}
          sx={{
            position: "relative",
            cursor: getCursorStyle(),
            height: "100%",
            width: "100%",
          }}
          onClick={handleCanvasClick}
        >
          {renderCollage()}
          {collageState.drawingMode && (
            <DrawingCanvas
              ref={drawingCanvasRef}
              brushColor={collageState.brushColor}
              brushSize={collageState.brushSize}
              onDrawingComplete={(paths) => {
                collageState.addDrawingElement({
                  type: "brush",
                  x: 0,
                  y: 0,
                  data: {
                    paths,
                    color: collageState.brushColor,
                    size: collageState.brushSize,
                  },
                })
                collageState.setDrawingMode(false)
              }}
            />
          )}
        </Box>
      </>
    )
  },
)

CollageCanvas.displayName = "CollageCanvas"
