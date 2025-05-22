"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab,
  Tooltip,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SaveIcon from "@mui/icons-material/Save"
import DownloadIcon from "@mui/icons-material/Download"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import BrushIcon from "@mui/icons-material/Brush"
import ImageIcon from "@mui/icons-material/Image"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import ShapeLineIcon from "@mui/icons-material/Hexagon"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import DeleteIcon from "@mui/icons-material/Delete"
import PaletteIcon from "@mui/icons-material/Palette"
import albumStore from "../../stores/albumStore"
import html2canvas from "html2canvas"
import { DrawingCanvas } from "./DrawingCanvas"
import { ShapesPanel } from "./ShapesPanel"
import { StickersPanel } from "./StickersPanel"
import { BrushPanel } from "./BrushPanel"

interface CollageCreatorProps {
  open: boolean
  onClose: () => void
  selectedPhotoIds: number[]
}

type LayoutType = "grid" | "horizontal" | "vertical" | "random"
type TextPositionType = "top" | "center" | "bottom"
type FontStyleType = "normal" | "bold" | "italic" | "bold italic"
type EditorTabType = "layout" | "text" | "draw" | "shapes" | "stickers" | "brush"
type PlacementMode = "none" | "sticker" | "shape" | "text"

// Define the shape of a drawing element
interface DrawingElement {
  id: string
  type: "brush" | "shape" | "sticker" | "text"
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
  data: any // Specific data for each type
  zIndex: number
}

const CollageCreator: React.FC<CollageCreatorProps> = ({ open, onClose, selectedPhotoIds }) => {
  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [gapSize, setGapSize] = useState<number>(10)
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [processing, setProcessing] = useState<boolean>(false)

  // Text overlay states
  const [showPhotoNames, setShowPhotoNames] = useState<boolean>(false)
  const [overlayText, setOverlayText] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [textSize, setTextSize] = useState<number>(36)
  const [textPosition, setTextPosition] = useState<TextPositionType>("center")
  const [textStyle, setTextStyle] = useState<FontStyleType>("bold")
  const [textShadow, setTextShadow] = useState<boolean>(true)
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>("rgba(0, 0, 0, 0.3)")
  const [showTextBackground, setShowTextBackground] = useState<boolean>(false)

  // New states for enhanced features
  const [activeTab, setActiveTab] = useState<EditorTabType>("layout")
  const [drawingMode, setDrawingMode] = useState<boolean>(false)
  const [brushColor, setBrushColor] = useState<string>("#000000")
  const [brushSize, setBrushSize] = useState<number>(5)
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([])
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([])

  // New states for placement mode
  const [placementMode, setPlacementMode] = useState<PlacementMode>("none")
  const [pendingSticker, setPendingSticker] = useState<string | null>(null)
  const [pendingShape, setPendingShape] = useState<string | null>(null)
  const [pendingText, setPendingText] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
  // Reference to store preloaded photos for download/save operations
  const preloadedPhotosRef = useRef<any[]>([])
  const originalPhotosRef = useRef<any[]>([])

  // Add these new functions for dragging and resizing elements
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [resizeStartSize, setResizeStartSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Load selected photos
  useEffect(() => {
    if (open && selectedPhotoIds.length > 0) {
      setLoading(true)

      try {
        // Filter selected photos from albumStore
        const selectedPhotos = albumStore.photos.filter((photo: any) => selectedPhotoIds.includes(photo.id))

        if (selectedPhotos.length > 0) {
          console.log("Selected photos loaded:", selectedPhotos.length)
          setPhotos(selectedPhotos)
          // Store original photos for reference
          originalPhotosRef.current = [...selectedPhotos]
        } else {
          console.warn("No matching photos found in albumStore")
          setNotification({
            open: true,
            message: "לא נמצאו תמונות תואמות",
            severity: "error",
          })
        }
      } catch (error) {
        console.error("Error loading photos:", error)
        setNotification({
          open: true,
          message: "שגיאה בטעינת התמונות",
          severity: "error",
        })
      } finally {
        setLoading(false)
      }
    }
  }, [open, selectedPhotoIds])

  // Reset drawing elements when dialog opens
  useEffect(() => {
    if (open) {
      setDrawingElements([])
      setUndoStack([])
      setRedoStack([])
      setSelectedElement(null)
      setDrawingMode(false)
      setActiveTab("layout")
      setPlacementMode("none")
      setPendingSticker(null)
      setPendingShape(null)
      setPendingText(null)
    }
  }, [open])

  const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(event.target.value as LayoutType)
  }

  const handleGapSizeChange = (event: Event, newValue: number | number[]) => {
    setGapSize(newValue as number)
    console.log(event);
    
  }

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value)
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleTextSizeChange = (event: Event, newValue: number | number[]) => {
    setTextSize(newValue as number)
    console.log(event);
    
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: EditorTabType) => {
    // Cancel any pending placement when switching tabs
    setPlacementMode("none")
    setPendingSticker(null)
    setPendingShape(null)
    setPendingText(null)
console.log(event);

    setActiveTab(newValue)

    // Turn on drawing mode when switching to draw tab
    if (newValue === "draw") {
      setDrawingMode(true)
    } else {
      setDrawingMode(false)
    }
  }

  // Add a new drawing element
  const addDrawingElement = (element: Omit<DrawingElement, "id" | "zIndex">) => {
    // Save current state for undo
    setUndoStack([...undoStack, [...drawingElements]])
    setRedoStack([])

    const newElement: DrawingElement = {
      ...element,
      id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      zIndex: drawingElements.length + 10,
    }

    setDrawingElements([...drawingElements, newElement])
    setSelectedElement(newElement.id)
    return newElement.id
  }

  // Update an existing drawing element
  // const updateDrawingElement = (id: string, updates: Partial<DrawingElement>) => {
  //   setUndoStack([...undoStack, [...drawingElements]])
  //   setRedoStack([])

  //   setDrawingElements((elements) => elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  // }

  // Remove a drawing element
  const removeDrawingElement = (id: string) => {
    setUndoStack([...undoStack, [...drawingElements]])
    setRedoStack([])

    setDrawingElements((elements) => elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  // Handle undo
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack([...redoStack, [...drawingElements]])
      setDrawingElements(previousState)
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  // Handle redo
  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack([...undoStack, [...drawingElements]])
      setDrawingElements(nextState)
      setRedoStack(redoStack.slice(0, -1))
    }
  }

  // Select a shape to add to the canvas
  const selectShape = (shapeType: string) => {
    // Set placement mode to shape
    setPlacementMode("shape")
    setPendingShape(shapeType)
    setPendingSticker(null)
    setPendingText(null)

    // Show notification to guide the user
    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את הצורה",
      severity: "success",
    })
  }

  // Select a sticker to add to the canvas
  const selectSticker = (stickerUrl: string) => {
    // Set placement mode to sticker
    setPlacementMode("sticker")
    setPendingSticker(stickerUrl)
    setPendingShape(null)
    setPendingText(null)

    // Show notification to guide the user
    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את המדבקה",
      severity: "success",
    })
  }

  // Select text to add to the canvas
  const selectText = (text: string) => {
    // Set placement mode to text
    setPlacementMode("text")
    setPendingText(text)
    setPendingSticker(null)
    setPendingShape(null)

    // Show notification to guide the user
    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את הטקסט",
      severity: "success",
    })
  }

  // Handle canvas click for placing elements
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (placementMode === "none") return

    // Get click position relative to canvas
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (placementMode === "shape" && pendingShape) {
      // Add shape at the clicked position
      const newShape = {
        type: "shape" as const,
        x,
        y,
        width: 100,
        height: 100,
        rotation: 0,
        data: {
          type: pendingShape,
          color: brushColor,
          borderWidth: 2,
          borderColor: "#000000",
          fillColor: "rgba(255, 255, 255, 0.5)",
        },
      }

      addDrawingElement(newShape)

      // Reset placement mode
      setPlacementMode("none")
      setPendingShape(null)
    } else if (placementMode === "sticker" && pendingSticker) {
      // Create a new image element to get dimensions
      const img = new Image()
      img.src = pendingSticker

      img.onload = () => {
        // Calculate aspect ratio to maintain proportions
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
            url: pendingSticker,
          },
        }

        addDrawingElement(newSticker)

        // Reset placement mode
        setPlacementMode("none")
        setPendingSticker(null)
      }
    } else if (placementMode === "text" && pendingText) {
      // Add text at the clicked position
      const newText = {
        type: "text" as const,
        x,
        y,
        data: {
          text: pendingText,
          color: textColor,
          fontSize: textSize,
          fontStyle: textStyle,
          shadow: textShadow,
        },
      }

      addDrawingElement(newText)

      // Reset placement mode
      setPlacementMode("none")
      setPendingText(null)
    }
  }

  // Helper function to preload images and convert them to data URLs
  const preloadImages = async (inputPhotos: any[]) => {
    const preloadedPhotos = [...inputPhotos]
    const failedIndices: number[] = []

    setNotification({
      open: true,
      message: "מעבד תמונות, אנא המתן...",
      severity: "success",
    })

    for (let i = 0; i < preloadedPhotos.length; i++) {
      const photo = preloadedPhotos[i]
      try {
        // Create a new image element
        const img = new Image()
        img.crossOrigin = "anonymous"

        // Create a promise to wait for the image to load
        await new Promise<void>((resolve) => {
          img.onload = () => resolve()
          img.onerror = () => {
            console.error(`Failed to load image: ${photo.photoPath}`)
            failedIndices.push(i)
            resolve() // Continue with other images even if this one fails
          }

          // Try to load with cache busting to avoid CORS issues
          img.src = `${photo.photoPath}${photo.photoPath.includes("?") ? "&" : "?"}cacheBust=${new Date().getTime()}`

          // Set a timeout in case the image takes too long to load
          setTimeout(() => {
            if (!img.complete) {
              console.warn(`Image load timeout: ${photo.photoPath}`)
              failedIndices.push(i)
              resolve()
            }
          }, 5000)
        })

        if (!failedIndices.includes(i)) {
          // Create a canvas to draw the image
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")

          if (ctx) {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0)

            try {
              // Convert to data URL
              const dataUrl = canvas.toDataURL("image/png")
              preloadedPhotos[i] = {
                ...photo,
                photoPath: dataUrl,
              }
              console.log(`Successfully converted image ${i} to data URL`)
            } catch (e) {
              console.error(`Error converting image to data URL: ${e}`)
              failedIndices.push(i)
            }
          }
        }
      } catch (error) {
        console.error(`Error preloading image ${photo.photoPath}:`, error)
        failedIndices.push(i)
      }
    }

    if (failedIndices.length > 0) {
      console.warn(`${failedIndices.length} images failed to preload`)
    }

    return preloadedPhotos
  }

  // Helper function to make sure all images are loaded before creating canvas
  const ensureImagesLoaded = () => {
    const images = canvasRef.current?.querySelectorAll("img") || []
    return Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(null)
          } else {
            img.onload = () => resolve(null)
            img.onerror = () => resolve(null)
          }
        })
      }),
    )
  }

  // Helper function to download collage as image
  const downloadCollage = async () => {
    if (!canvasRef.current) return

    try {
      setProcessing(true)

      // If we haven't preloaded images yet or need to refresh them
      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos)
      }

      // Store original photos and use preloaded ones temporarily
      const backupPhotos = [...photos]
      setPhotos(preloadedPhotosRef.current)

      // Allow time for DOM to update with preloaded images
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "מייצר תמונת קולאז׳, אנא המתן...",
        severity: "success",
      })

      const element = canvasRef.current

      // Wait for all images to be loaded before proceeding
      await ensureImagesLoaded()

      // Additional delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      const canvas = await html2canvas(element, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        onclone: (documentClone) => {
          // Ensure all images in the clone are set to complete
          const images = documentClone.querySelectorAll("img")
          images.forEach((img) => {
            if (!img.complete) {
              console.warn("Found incomplete image in clone, forcing complete")
              // Force image complete (this is a hack but can help)
              img.setAttribute("data-html2canvas-ignore", "false")
            }
          })
          return documentClone
        },
      })

      // Create download link
      const link = document.createElement("a")
      link.download = `collage_${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      // Restore original photos
      setPhotos(backupPhotos)

      setNotification({
        open: true,
        message: "הקולאז׳ הורד בהצלחה!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error generating collage:", error)
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes("SecurityError") || error.message.includes("cross-origin")) {
          setNotification({
            open: true,
            message: "שגיאת אבטחה: לא ניתן לעבד תמונות מדומיינים חיצוניים",
            severity: "error",
          })
        } else {
          setNotification({
            open: true,
            message: `אירעה שגיאה בעת יצירת הקולאז׳: ${error.message}`,
            severity: "error",
          })
        }
      } else {
        setNotification({
          open: true,
          message: "אירעה שגיאה לא ידועה בעת יצירת הקולאז׳. נסה שנית.",
          severity: "error",
        })
      }
    } finally {
      setProcessing(false)
    }
  }

  // Helper to save collage to server
  const saveCollage = async () => {
    if (!canvasRef.current) return

    try {
      setProcessing(true)

      // If we haven't preloaded images yet
      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos)
      }

      // Store original photos and use preloaded ones temporarily
      const backupPhotos = [...photos]
      setPhotos(preloadedPhotosRef.current)

      // Allow time for DOM to update with preloaded images
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "שומר את הקולאז׳, אנא המתן...",
        severity: "success",
      })

      const element = canvasRef.current

      // Wait for all images to be loaded before proceeding
      await ensureImagesLoaded()

      // Additional delay to ensure rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 500))

      const canvas = await html2canvas(element, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
      })

      // Convert to image blob
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to create blob"))
        }, "image/png")
      })

      // Here you would send the blob to the server
      console.log("Image blob created, ready to upload:", imageBlob.size, "bytes")

      // Restore original photos
      setPhotos(backupPhotos)

      // Fake server request
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "הקולאז׳ נשמר בהצלחה!",
        severity: "success",
      })

      // Close dialog after saving
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error("Error saving collage:", error)
      setNotification({
        open: true,
        message: "אירעה שגיאה בעת שמירת הקולאז׳. נסה שנית.",
        severity: "error",
      })
    } finally {
      setProcessing(false)
    }
  }

  // When layout or photos change, reset preloaded photos
  useEffect(() => {
    preloadedPhotosRef.current = []
  }, [layout, photos])

  // Preload images when component mounts or photos change
  useEffect(() => {
    if (photos.length > 0 && !loading) {
      // Preload images in the background
      const doPreload = async () => {
        try {
          const preloaded = await preloadImages(photos)
          preloadedPhotosRef.current = preloaded
          console.log("Preloaded all images successfully")
        } catch (error) {
          console.error("Failed to preload images:", error)
        }
      }

      doPreload()
    }
  }, [photos, loading])

  // Debug function to log photo information
  const debugPhotos = () => {
    console.log("Current photos in state:", photos)
    console.log("Selected photo IDs:", selectedPhotoIds)
    console.log("Album store photos:", albumStore.photos)
    console.log("Preloaded photos:", preloadedPhotosRef.current)
    console.log("Drawing elements:", drawingElements)
  }

  // Generate text styles based on user selection
  const getTextStyle = () => {
    let fontStyle = "normal"
    let fontWeight = "normal"

    switch (textStyle) {
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

    // Text shadow style
    const shadow = textShadow
      ? "2px 2px 4px rgba(0,0,0,0.7), -2px -2px 4px rgba(0,0,0,0.7), 2px -2px 4px rgba(0,0,0,0.7), -2px 2px 4px rgba(0,0,0,0.7)"
      : "none"

    // Position styles
    const positionStyle: React.CSSProperties = {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      padding: "10px",
      zIndex: 1000,
      fontWeight,
      fontStyle,
      color: textColor,
      fontSize: `${textSize}px`,
      textShadow: shadow,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }

    // Add background if enabled
    if (showTextBackground) {
      positionStyle.backgroundColor = textBackgroundColor
    }

    // Set position based on user selection
    switch (textPosition) {
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

  // Element dragging functions
  const handleElementDragStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    setSelectedElement(id)
    setIsDragging(true)
    setDragStartPos({ x: e.clientX, y: e.clientY })

    // Add event listeners for drag
    document.addEventListener("mousemove", handleElementDrag)
    document.addEventListener("mouseup", handleElementDragEnd)
  }

  const handleElementDrag = (e: MouseEvent) => {
    if (!isDragging || !selectedElement) return

    // Find the element
    const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
    if (elementIndex === -1) return

    const element = drawingElements[elementIndex]
    const dx = e.clientX - dragStartPos.x
    const dy = e.clientY - dragStartPos.y

    // Update element position
    const updatedElements = [...drawingElements]
    updatedElements[elementIndex] = {
      ...element,
      x: element.x + dx,
      y: element.y + dy,
    }

    setDrawingElements(updatedElements)
    setDragStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleElementDragEnd = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleElementDrag)
    document.removeEventListener("mouseup", handleElementDragEnd)

    // Save state for undo
    if (selectedElement) {
      setUndoStack([...undoStack, [...drawingElements]])
      setRedoStack([])
    }
  }

  // Element resizing functions
  const handleResizeStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedElement(id)
    setIsResizing(true)
    setResizeStartPos({ x: e.clientX, y: e.clientY })

    // Find the element
    const element = drawingElements.find((el) => el.id === id)
    if (!element || !element.width || !element.height) return

    setResizeStartSize({ width: element.width, height: element.height })

    // Add event listeners for resize
    document.addEventListener("mousemove", handleResize)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !selectedElement) return

    // Find the element
    const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
    if (elementIndex === -1) return

    const element = drawingElements[elementIndex]
    if (!element.width || !element.height) return

    const dx = e.clientX - resizeStartPos.x
    const dy = e.clientY - resizeStartPos.y

    // Update element size
    const updatedElements = [...drawingElements]
    updatedElements[elementIndex] = {
      ...element,
      width: Math.max(20, resizeStartSize.width + dx),
      height: Math.max(20, resizeStartSize.height + dy),
    }

    setDrawingElements(updatedElements)
  }

  const handleResizeEnd = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleResize)
    document.removeEventListener("mouseup", handleResizeEnd)

    // Save state for undo
    if (selectedElement) {
      setUndoStack([...undoStack, [...drawingElements]])
      setRedoStack([])
    }
  }

  // Touch event handlers for mobile support
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && selectedElement) {
        e.preventDefault()
        const touch = e.touches[0]
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        })
        handleElementDrag(mouseEvent)
      } else if (isResizing && selectedElement) {
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
  }, [isDragging, isResizing, selectedElement])

  // Render different layouts
  const renderCollage = () => {
    if (!photos || photos.length === 0) {
      return <Typography align="center">אין תמונות נבחרות ליצירת קולאז'</Typography>
    }

    // Log for debugging
    console.log(`Rendering collage with ${photos.length} photos, layout: ${layout}`)

    // Component to render the overlay text
    const TextOverlay = () => (overlayText ? <Box sx={getTextStyle()}>{overlayText}</Box> : null)

    // Render drawing elements
    const renderDrawingElements = () => (
      <>
        {drawingElements.map((element) => {
          const isSelected = selectedElement === element.id
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
                    removeDrawingElement(element.id)
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
                  onClick={() => setSelectedElement(element.id)}
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
                  onClick={() => setSelectedElement(element.id)}
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
                  onClick={() => setSelectedElement(element.id)}
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

    // Using the improved layout rendering from the code shared by the user
    switch (layout) {
      case "grid":
        return (
          <Box sx={{ position: "relative" }}>
            <Grid container spacing={gapSize / 4}>
              {photos.map((photo) => (
                <Grid item xs={6} sm={4} key={photo.id}>
                  <Paper elevation={2}>
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
                    {showPhotoNames && (
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
            <Box sx={{ display: "flex", flexDirection: "row", gap: `${gapSize}px`, overflowX: "auto" }}>
              {photos.map((photo) => (
                <Paper
                  elevation={2}
                  key={photo.id}
                  sx={{ flex: "0 0 auto", width: `${100 / Math.min(photos.length, 3)}%` }}
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
                  {showPhotoNames && (
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: `${gapSize}px` }}>
              {photos.map((photo) => (
                <Paper elevation={2} key={photo.id}>
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
                  {showPhotoNames && (
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
                  {showPhotoNames && (
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

  // Effect to log when photos change
  useEffect(() => {
    console.log("Photos state updated, count:", photos.length)
  }, [photos])

  // Add debug button in development
  const isDevelopment = process.env.NODE_ENV === "development"

  // Render the editor panel based on active tab
  const renderEditorPanel = () => {
    switch (activeTab) {
      case "layout":
        return (
          <Box>
            <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
              <FormLabel component="legend">פריסה</FormLabel>
              <RadioGroup value={layout} onChange={handleLayoutChange}>
                <FormControlLabel value="grid" control={<Radio />} label="רשת" />
                <FormControlLabel value="horizontal" control={<Radio />} label="אופקי" />
                <FormControlLabel value="vertical" control={<Radio />} label="אנכי" />
                <FormControlLabel value="random" control={<Radio />} label="אקראי" />
              </RadioGroup>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>מרווח בין תמונות</Typography>
              <Slider
                value={gapSize}
                onChange={handleGapSizeChange}
                min={0}
                max={40}
                step={2}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>צבע רקע</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  style={{ marginRight: "8px" }}
                />
                <Typography variant="body2">{backgroundColor}</Typography>
              </Box>
            </Box>

            <FormControl component="fieldset" fullWidth sx={{ mb: 2, mt: 2 }}>
              <FormControlLabel
                control={<Checkbox checked={showPhotoNames} onChange={(e) => setShowPhotoNames(e.target.checked)} />}
                label="הצג שמות תמונות בקולאז'"
              />
            </FormControl>
          </Box>
        )

      case "text":
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <TextFieldsIcon sx={{ mr: 1 }} /> טקסט על הקולאז'
            </Typography>

            <TextField
              fullWidth
              label="טקסט על הקולאז'"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              variant="outlined"
              margin="normal"
              placeholder="לדוגמה: BABY"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="text-position-label">מיקום הטקסט</InputLabel>
              <Select
                labelId="text-position-label"
                value={textPosition}
                onChange={(e) => setTextPosition(e.target.value as TextPositionType)}
                label="מיקום הטקסט"
              >
                <MenuItem value="top">למעלה</MenuItem>
                <MenuItem value="center">מרכז</MenuItem>
                <MenuItem value="bottom">למטה</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="text-style-label">סגנון טקסט</InputLabel>
              <Select
                labelId="text-style-label"
                value={textStyle}
                onChange={(e) => setTextStyle(e.target.value as FontStyleType)}
                label="סגנון טקסט"
              >
                <MenuItem value="normal">רגיל</MenuItem>
                <MenuItem value="bold">מודגש</MenuItem>
                <MenuItem value="italic">נטוי</MenuItem>
                <MenuItem value="bold italic">מודגש ונטוי</MenuItem>
              </Select>
            </FormControl>

            <Typography gutterBottom sx={{ mt: 2 }}>
              גודל טקסט
            </Typography>
            <Slider
              value={textSize}
              onChange={handleTextSizeChange}
              min={12}
              max={72}
              step={4}
              valueLabelDisplay="auto"
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
              <Typography gutterBottom sx={{ mr: 2 }}>
                צבע טקסט
              </Typography>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                style={{ marginRight: "8px" }}
              />
            </Box>

            <FormControlLabel
              control={<Checkbox checked={textShadow} onChange={(e) => setTextShadow(e.target.checked)} />}
              label="צל טקסט"
              sx={{ mt: 1 }}
            />

            <FormControlLabel
              control={
                <Checkbox checked={showTextBackground} onChange={(e) => setShowTextBackground(e.target.checked)} />
              }
              label="רקע לטקסט"
              sx={{ mt: 1 }}
            />

            {showTextBackground && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 4 }}>
                <Typography gutterBottom sx={{ mr: 2 }}>
                  צבע רקע לטקסט
                </Typography>
                <input
                  type="color"
                  value={textBackgroundColor.replace("rgba", "rgb").replace(/,[^,]*\)/, ")")}
                  onChange={(e) => {
                    // Convert RGB to RGBA with opacity 0.3
                    const rgb = e.target.value
                    const rgba = rgb.replace("rgb", "rgba").replace(")", ",0.3)")
                    setTextBackgroundColor(rgba)
                  }}
                  style={{ marginRight: "8px" }}
                />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => {
                if (overlayText.trim()) {
                  selectText(overlayText)
                }
              }}
            >
              הוסף טקסט לקולאז'
            </Button>
          </Box>
        )

      case "draw":
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <BrushIcon sx={{ mr: 1 }} /> ציור חופשי
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>צבע מברשת</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                <Typography variant="body2">{brushColor}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>גודל מברשת</Typography>
              <Slider
                value={brushSize}
                onChange={(_, newValue) => setBrushSize(newValue as number)}
                min={1}
                max={20}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              color={drawingMode ? "secondary" : "primary"}
              fullWidth
              onClick={() => setDrawingMode(!drawingMode)}
              startIcon={<BrushIcon />}
            >
              {drawingMode ? "הפסק ציור" : "התחל ציור"}
            </Button>

            <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
              לחץ על הכפתור למעלה כדי להתחיל לצייר על הקולאז'. לחץ שוב כדי להפסיק.
            </Typography>
          </Box>
        )

      case "shapes":
        return (
          <ShapesPanel
            onAddShape={selectShape}
            brushColor={brushColor}
            onColorChange={(color) => setBrushColor(color)}
          />
        )

      case "stickers":
        return <StickersPanel onAddSticker={selectSticker} />

      case "brush":
        return (
          <BrushPanel
            brushColor={brushColor}
            brushSize={brushSize}
            onColorChange={(color) => setBrushColor(color)}
            onSizeChange={(size) => setBrushSize(size)}
          />
        )

      default:
        return null
    }
  }

  // Dummy renderShape function
  const renderShape = (shapeType: string, color: string, fillColor: string, width: number, height: number) => {
    // Replace this with your actual shape rendering logic
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

  // Render cursor based on placement mode
  const getCursorStyle = () => {
    switch (placementMode) {
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
    if (placementMode === "none") return null

    let message = ""
    switch (placementMode) {
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
          backgroundColor: "rgba(25, 118, 210, 0.8)",
          color: "white",
          padding: "8px",
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        {message}
      </Box>
    )
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2">
              יצירת קולאז'
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>טוען תמונות...</Typography>
            </Box>
          ) : (
            <>
              {/* Editor Tabs */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
              >
                <Tab icon={<ImageIcon />} label="פריסה" value="layout" iconPosition="start" />
                <Tab icon={<TextFieldsIcon />} label="טקסט" value="text" iconPosition="start" />
                <Tab icon={<BrushIcon />} label="ציור" value="draw" iconPosition="start" />
                <Tab icon={<ShapeLineIcon />} label="צורות" value="shapes" iconPosition="start" />
                <Tab icon={<EmojiEmotionsIcon />} label="מדבקות" value="stickers" iconPosition="start" />
                <Tab icon={<PaletteIcon />} label="מברשות" value="brush" iconPosition="start" />
              </Tabs>

              {/* Drawing Tools */}
              {(activeTab === "draw" || activeTab === "shapes" || activeTab === "stickers") && (
                <Box sx={{ mb: 2, display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="בטל">
                    <span>
                      <IconButton onClick={handleUndo} disabled={undoStack.length === 0} color="primary">
                        <UndoIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="בצע שוב">
                    <span>
                      <IconButton onClick={handleRedo} disabled={redoStack.length === 0} color="primary">
                        <RedoIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="מחק נבחר">
                    <span>
                      <IconButton
                        onClick={() => selectedElement && removeDrawingElement(selectedElement)}
                        disabled={!selectedElement}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, height: "100%", overflow: "auto" }}>
                    {renderEditorPanel()}

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mt: 3 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() =>
                          preloadImages(photos).then((preloaded) => {
                            preloadedPhotosRef.current = preloaded
                            setNotification({
                              open: true,
                              message: "התמונות עובדו מראש בהצלחה",
                              severity: "success",
                            })
                          })
                        }
                        disabled={processing || photos.length === 0}
                      >
                        עבד תמונות מראש
                      </Button>
                    </Box>

                    {isDevelopment && (
                      <Button variant="outlined" color="info" size="small" onClick={debugPhotos} sx={{ mt: 2 }}>
                        Debug Info
                      </Button>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      height: "100%",
                      bgcolor: backgroundColor,
                      overflow: "auto",
                      minHeight: "500px",
                      position: "relative",
                    }}
                  >
                    {renderPlacementGuide()}
                    <Box
                      ref={canvasRef}
                      sx={{
                        position: "relative",
                        cursor: getCursorStyle(),
                        height: "100%",
                        width: "100%",
                      }}
                      onClick={handleCanvasClick}
                    >
                      {renderCollage()}
                      {drawingMode && (
                        <DrawingCanvas
                          ref={drawingCanvasRef}
                          brushColor={brushColor}
                          brushSize={brushSize}
                          onDrawingComplete={(paths) => {
                            // Add the drawing as a new element
                            addDrawingElement({
                              type: "brush",
                              x: 0,
                              y: 0,
                              data: {
                                paths,
                                color: brushColor,
                                size: brushSize,
                              },
                            })
                            // Turn off drawing mode after completing
                            setDrawingMode(false)
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button startIcon={<DownloadIcon />} onClick={downloadCollage} disabled={photos.length === 0 || processing}>
            {processing ? "מעבד..." : "הורד קולאז'"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={saveCollage}
            disabled={photos.length === 0 || processing}
          >
            {processing ? "מעבד..." : "שמור קולאז'"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* התראות */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CollageCreator
