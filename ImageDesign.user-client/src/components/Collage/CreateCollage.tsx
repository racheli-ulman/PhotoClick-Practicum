// "use client"

// import type React from "react"
// import { useState, useEffect, useRef } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import {
//   Box,
//   Button,
//   Grid,
//   IconButton,
//   Typography,
//   Slider,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   TextField,
//   Checkbox,
//   Select,
//   MenuItem,
//   InputLabel,
//   Tabs,
//   Tab,
//   Tooltip,
//   Divider,
//   Container,
//   AppBar,
//   Toolbar,
// } from "@mui/material"
// // import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import SaveIcon from "@mui/icons-material/Save"
// import DownloadIcon from "@mui/icons-material/Download"
// import TextFieldsIcon from "@mui/icons-material/TextFields"
// import BrushIcon from "@mui/icons-material/Brush"
// import ImageIcon from "@mui/icons-material/Image"
// import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
// import ShapeLineIcon from "@mui/icons-material/Hexagon"
// import UndoIcon from "@mui/icons-material/Undo"
// import RedoIcon from "@mui/icons-material/Redo"
// import DeleteIcon from "@mui/icons-material/Delete"
// import PaletteIcon from "@mui/icons-material/Palette"
// import albumStore from "../../stores/albumStore"
// import html2canvas from "html2canvas"
// import { DrawingCanvas } from "./DrawingCanvas"
// import { ShapesPanel } from "./ShapesPanel"
// import { StickersPanel } from "./StickersPanel"
// import { BrushPanel } from "./BrushPanel"

// type LayoutType = "grid" | "horizontal" | "vertical" | "random"
// type TextPositionType = "top" | "center" | "bottom"
// type FontStyleType = "normal" | "bold" | "italic" | "bold italic"
// type EditorTabType = "layout" | "text" | "draw" | "shapes" | "stickers" | "brush"
// type PlacementMode = "none" | "sticker" | "shape" | "text"

// // Define the shape of a drawing element
// interface DrawingElement {
//   id: string
//   type: "brush" | "shape" | "sticker" | "text"
//   x: number
//   y: number
//   width?: number
//   height?: number
//   rotation?: number
//   data: any // Specific data for each type
//   zIndex: number
// }

// const CollageCreatorPage: React.FC = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
  
//   // Get selected photo IDs from navigation state
//   const selectedPhotoIds: number[] = location.state?.selectedPhotoIds || []

//   const [photos, setPhotos] = useState<any[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [layout, setLayout] = useState<LayoutType>("grid")
//   const [gapSize, setGapSize] = useState<number>(10)
//   const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
//   const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
//     open: false,
//     message: "",
//     severity: "success",
//   })
//   const [processing, setProcessing] = useState<boolean>(false)

//   // Text overlay states
//   const [showPhotoNames, setShowPhotoNames] = useState<boolean>(false)
//   const [overlayText, setOverlayText] = useState<string>("")
//   const [textColor, setTextColor] = useState<string>("#ffffff")
//   const [textSize, setTextSize] = useState<number>(36)
//   const [textPosition, setTextPosition] = useState<TextPositionType>("center")
//   const [textStyle, setTextStyle] = useState<FontStyleType>("bold")
//   const [textShadow, setTextShadow] = useState<boolean>(true)
//   const [textBackgroundColor, setTextBackgroundColor] = useState<string>("rgba(0, 0, 0, 0.3)")
//   const [showTextBackground, setShowTextBackground] = useState<boolean>(false)

//   // New states for enhanced features
//   const [activeTab, setActiveTab] = useState<EditorTabType>("layout")
//   const [drawingMode, setDrawingMode] = useState<boolean>(false)
//   const [brushColor, setBrushColor] = useState<string>("#000000")
//   const [brushSize, setBrushSize] = useState<number>(5)
//   const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([])
//   const [selectedElement, setSelectedElement] = useState<string | null>(null)
//   const [undoStack, setUndoStack] = useState<DrawingElement[][]>([])
//   const [redoStack, setRedoStack] = useState<DrawingElement[][]>([])

//   // New states for placement mode
//   const [placementMode, setPlacementMode] = useState<PlacementMode>("none")
//   const [pendingSticker, setPendingSticker] = useState<string | null>(null)
//   const [pendingShape, setPendingShape] = useState<string | null>(null)
//   const [pendingText, setPendingText] = useState<string | null>(null)

//   const canvasRef = useRef<HTMLDivElement>(null)
//   const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
//   const preloadedPhotosRef = useRef<any[]>([])
//   const originalPhotosRef = useRef<any[]>([])

//   // Add these new functions for dragging and resizing elements
//   const [isDragging, setIsDragging] = useState<boolean>(false)
//   const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
//   const [isResizing, setIsResizing] = useState<boolean>(false)
//   const [resizeStartSize, setResizeStartSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
//   const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

//   // Check if user came from photo selection, if not redirect
//   useEffect(() => {
//     if (selectedPhotoIds.length === 0) {
//       navigate('/personal-area/all-photoes-of-user')
//       return
//     }
//   }, [selectedPhotoIds, navigate])

//   // Load selected photos
//   useEffect(() => {
//     if (selectedPhotoIds.length > 0) {
//       setLoading(true)

//       try {
//         // Filter selected photos from albumStore
//         const selectedPhotos = albumStore.photos.filter((photo: any) => selectedPhotoIds.includes(photo.id))

//         if (selectedPhotos.length > 0) {
//           console.log("Selected photos loaded:", selectedPhotos.length)
//           setPhotos(selectedPhotos)
//           originalPhotosRef.current = [...selectedPhotos]
//         } else {
//           console.warn("No matching photos found in albumStore")
//           setNotification({
//             open: true,
//             message: "לא נמצאו תמונות תואמות",
//             severity: "error",
//           })
//         }
//       } catch (error) {
//         console.error("Error loading photos:", error)
//         setNotification({
//           open: true,
//           message: "שגיאה בטעינת התמונות",
//           severity: "error",
//         })
//       } finally {
//         setLoading(false)
//       }
//     }
//   }, [selectedPhotoIds])

//   // Reset drawing elements when component mounts
//   useEffect(() => {
//     setDrawingElements([])
//     setUndoStack([])
//     setRedoStack([])
//     setSelectedElement(null)
//     setDrawingMode(false)
//     setActiveTab("layout")
//     setPlacementMode("none")
//     setPendingSticker(null)
//     setPendingShape(null)
//     setPendingText(null)
//   }, [])

//   // const handleGoBack = () => {
//   //   navigate('/personal-area/all-photoes-of-user')
//   // }

//   const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setLayout(event.target.value as LayoutType)
//   }

//   const handleGapSizeChange = (event: Event, newValue: number | number[]) => {
//     setGapSize(newValue as number)
//     console.log(event);
//   }

//   const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setBackgroundColor(event.target.value)
//   }

//   const handleCloseNotification = () => {
//     setNotification({ ...notification, open: false })
//   }

//   const handleTextSizeChange = (event: Event, newValue: number | number[]) => {
//     setTextSize(newValue as number)
//     console.log(event);
//   }

//   const handleTabChange = (event: React.SyntheticEvent, newValue: EditorTabType) => {
//     setPlacementMode("none")
//     setPendingSticker(null)
//     setPendingShape(null)
//     setPendingText(null)
//     console.log(event);

//     setActiveTab(newValue)

//     if (newValue === "draw") {
//       setDrawingMode(true)
//     } else {
//       setDrawingMode(false)
//     }
//   }

//   // Add a new drawing element
//   const addDrawingElement = (element: Omit<DrawingElement, "id" | "zIndex">) => {
//     setUndoStack([...undoStack, [...drawingElements]])
//     setRedoStack([])

//     const newElement: DrawingElement = {
//       ...element,
//       id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       zIndex: drawingElements.length + 10,
//     }

//     setDrawingElements([...drawingElements, newElement])
//     setSelectedElement(newElement.id)
//     return newElement.id
//   }

//   // Remove a drawing element
//   const removeDrawingElement = (id: string) => {
//     setUndoStack([...undoStack, [...drawingElements]])
//     setRedoStack([])

//     setDrawingElements((elements) => elements.filter((el) => el.id !== id))
//     setSelectedElement(null)
//   }

//   // Handle undo
//   const handleUndo = () => {
//     if (undoStack.length > 0) {
//       const previousState = undoStack[undoStack.length - 1]
//       setRedoStack([...redoStack, [...drawingElements]])
//       setDrawingElements(previousState)
//       setUndoStack(undoStack.slice(0, -1))
//     }
//   }

//   // Handle redo
//   const handleRedo = () => {
//     if (redoStack.length > 0) {
//       const nextState = redoStack[redoStack.length - 1]
//       setUndoStack([...undoStack, [...drawingElements]])
//       setDrawingElements(nextState)
//       setRedoStack(redoStack.slice(0, -1))
//     }
//   }

//   // Select a shape to add to the canvas
//   const selectShape = (shapeType: string) => {
//     setPlacementMode("shape")
//     setPendingShape(shapeType)
//     setPendingSticker(null)
//     setPendingText(null)

//     setNotification({
//       open: true,
//       message: "לחץ על הקולאז' כדי למקם את הצורה",
//       severity: "success",
//     })
//   }

//   // Select a sticker to add to the canvas
//   const selectSticker = (stickerUrl: string) => {
//     setPlacementMode("sticker")
//     setPendingSticker(stickerUrl)
//     setPendingShape(null)
//     setPendingText(null)

//     setNotification({
//       open: true,
//       message: "לחץ על הקולאז' כדי למקם את המדבקה",
//       severity: "success",
//     })
//   }

//   // Select text to add to the canvas
//   const selectText = (text: string) => {
//     setPlacementMode("text")
//     setPendingText(text)
//     setPendingSticker(null)
//     setPendingShape(null)

//     setNotification({
//       open: true,
//       message: "לחץ על הקולאז' כדי למקם את הטקסט",
//       severity: "success",
//     })
//   }

//   // Handle canvas click for placing elements
//   const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (placementMode === "none") return

//     const rect = e.currentTarget.getBoundingClientRect()
//     const x = e.clientX - rect.left
//     const y = e.clientY - rect.top

//     if (placementMode === "shape" && pendingShape) {
//       const newShape = {
//         type: "shape" as const,
//         x,
//         y,
//         width: 100,
//         height: 100,
//         rotation: 0,
//         data: {
//           type: pendingShape,
//           color: brushColor,
//           borderWidth: 2,
//           borderColor: "#000000",
//           fillColor: "rgba(255, 255, 255, 0.5)",
//         },
//       }

//       addDrawingElement(newShape)
//       setPlacementMode("none")
//       setPendingShape(null)
//     } else if (placementMode === "sticker" && pendingSticker) {
//       const img = new Image()
//       img.src = pendingSticker

//       img.onload = () => {
//         const aspectRatio = img.width / img.height
//         const width = 100
//         const height = width / aspectRatio

//         const newSticker = {
//           type: "sticker" as const,
//           x,
//           y,
//           width,
//           height,
//           rotation: 0,
//           data: {
//             url: pendingSticker,
//           },
//         }

//         addDrawingElement(newSticker)
//         setPlacementMode("none")
//         setPendingSticker(null)
//       }
//     } else if (placementMode === "text" && pendingText) {
//       const newText = {
//         type: "text" as const,
//         x,
//         y,
//         data: {
//           text: pendingText,
//           color: textColor,
//           fontSize: textSize,
//           fontStyle: textStyle,
//           shadow: textShadow,
//         },
//       }

//       addDrawingElement(newText)
//       setPlacementMode("none")
//       setPendingText(null)
//     }
//   }

//   // Helper function to preload images and convert them to data URLs
//   const preloadImages = async (inputPhotos: any[]) => {
//     const preloadedPhotos = [...inputPhotos]
//     const failedIndices: number[] = []

//     setNotification({
//       open: true,
//       message: "מעבד תמונות, אנא המתן...",
//       severity: "success",
//     })

//     for (let i = 0; i < preloadedPhotos.length; i++) {
//       const photo = preloadedPhotos[i]
//       try {
//         const img = new Image()
//         img.crossOrigin = "anonymous"

//         await new Promise<void>((resolve) => {
//           img.onload = () => resolve()
//           img.onerror = () => {
//             console.error(`Failed to load image: ${photo.photoPath}`)
//             failedIndices.push(i)
//             resolve()
//           }

//           img.src = `${photo.photoPath}${photo.photoPath.includes("?") ? "&" : "?"}cacheBust=${new Date().getTime()}`

//           setTimeout(() => {
//             if (!img.complete) {
//               console.warn(`Image load timeout: ${photo.photoPath}`)
//               failedIndices.push(i)
//               resolve()
//             }
//           }, 5000)
//         })

//         if (!failedIndices.includes(i)) {
//           const canvas = document.createElement("canvas")
//           canvas.width = img.width
//           canvas.height = img.height
//           const ctx = canvas.getContext("2d")

//           if (ctx) {
//             ctx.drawImage(img, 0, 0)

//             try {
//               const dataUrl = canvas.toDataURL("image/png")
//               preloadedPhotos[i] = {
//                 ...photo,
//                 photoPath: dataUrl,
//               }
//               console.log(`Successfully converted image ${i} to data URL`)
//             } catch (e) {
//               console.error(`Error converting image to data URL: ${e}`)
//               failedIndices.push(i)
//             }
//           }
//         }
//       } catch (error) {
//         console.error(`Error preloading image ${photo.photoPath}:`, error)
//         failedIndices.push(i)
//       }
//     }

//     if (failedIndices.length > 0) {
//       console.warn(`${failedIndices.length} images failed to preload`)
//     }

//     return preloadedPhotos
//   }

//   // Helper function to make sure all images are loaded before creating canvas
//   const ensureImagesLoaded = () => {
//     const images = canvasRef.current?.querySelectorAll("img") || []
//     return Promise.all(
//       Array.from(images).map((img) => {
//         return new Promise((resolve) => {
//           if (img.complete) {
//             resolve(null)
//           } else {
//             img.onload = () => resolve(null)
//             img.onerror = () => resolve(null)
//           }
//         })
//       }),
//     )
//   }

//   // Helper function to download collage as image
//   const downloadCollage = async () => {
//     if (!canvasRef.current) return

//     try {
//       setProcessing(true)

//       if (preloadedPhotosRef.current.length === 0) {
//         preloadedPhotosRef.current = await preloadImages(photos)
//       }

//       const backupPhotos = [...photos]
//       setPhotos(preloadedPhotosRef.current)

//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       setNotification({
//         open: true,
//         message: "מייצר תמונת קולאז׳, אנא המתן...",
//         severity: "success",
//       })

//       const element = canvasRef.current

//       await ensureImagesLoaded()
//       await new Promise((resolve) => setTimeout(resolve, 500))

//       const canvas = await html2canvas(element, {
//         backgroundColor: backgroundColor,
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: true,
//         foreignObjectRendering: false,
//         imageTimeout: 0,
//         onclone: (documentClone) => {
//           const images = documentClone.querySelectorAll("img")
//           images.forEach((img) => {
//             if (!img.complete) {
//               console.warn("Found incomplete image in clone, forcing complete")
//               img.setAttribute("data-html2canvas-ignore", "false")
//             }
//           })
//           return documentClone
//         },
//       })

//       const link = document.createElement("a")
//       link.download = `collage_${new Date().toISOString().slice(0, 10)}.png`
//       link.href = canvas.toDataURL("image/png")
//       link.click()

//       setPhotos(backupPhotos)

//       setNotification({
//         open: true,
//         message: "הקולאז׳ הורד בהצלחה!",
//         severity: "success",
//       })
//     } catch (error) {
//       console.error("Error generating collage:", error)
//       if (error instanceof Error) {
//         if (error.message.includes("SecurityError") || error.message.includes("cross-origin")) {
//           setNotification({
//             open: true,
//             message: "שגיאת אבטחה: לא ניתן לעבד תמונות מדומיינים חיצוניים",
//             severity: "error",
//           })
//         } else {
//           setNotification({
//             open: true,
//             message: `אירעה שגיאה בעת יצירת הקולאז׳: ${error.message}`,
//             severity: "error",
//           })
//         }
//       } else {
//         setNotification({
//           open: true,
//           message: "אירעה שגיאה לא ידועה בעת יצירת הקולאז׳. נסה שנית.",
//           severity: "error",
//         })
//       }
//     } finally {
//       setProcessing(false)
//     }
//   }

//   // Helper to save collage to server
//   const saveCollage = async () => {
//     if (!canvasRef.current) return

//     try {
//       setProcessing(true)

//       if (preloadedPhotosRef.current.length === 0) {
//         preloadedPhotosRef.current = await preloadImages(photos)
//       }

//       const backupPhotos = [...photos]
//       setPhotos(preloadedPhotosRef.current)

//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       setNotification({
//         open: true,
//         message: "שומר את הקולאז׳, אנא המתן...",
//         severity: "success",
//       })

//       const element = canvasRef.current

//       await ensureImagesLoaded()
//       await new Promise((resolve) => setTimeout(resolve, 500))

//       const canvas = await html2canvas(element, {
//         backgroundColor: backgroundColor,
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         logging: true,
//         foreignObjectRendering: false,
//         imageTimeout: 0,
//       })

//       const imageBlob = await new Promise<Blob>((resolve, reject) => {
//         canvas.toBlob((blob) => {
//           if (blob) resolve(blob)
//           else reject(new Error("Failed to create blob"))
//         }, "image/png")
//       })

//       console.log("Image blob created, ready to upload:", imageBlob.size, "bytes")

//       setPhotos(backupPhotos)

//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       setNotification({
//         open: true,
//         message: "הקולאז׳ נשמר בהצלחה!",
//         severity: "success",
//       })

//       setTimeout(() => {
//         navigate('/personal-area/userAlbums')
//       }, 1500)
//     } catch (error) {
//       console.error("Error saving collage:", error)
//       setNotification({
//         open: true,
//         message: "אירעה שגיאה בעת שמירת הקולאז׳. נסה שנית.",
//         severity: "error",
//       })
//     } finally {
//       setProcessing(false)
//     }
//   }

//   // When layout or photos change, reset preloaded photos
//   useEffect(() => {
//     preloadedPhotosRef.current = []
//   }, [layout, photos])

//   // Preload images when component mounts or photos change
//   useEffect(() => {
//     if (photos.length > 0 && !loading) {
//       const doPreload = async () => {
//         try {
//           const preloaded = await preloadImages(photos)
//           preloadedPhotosRef.current = preloaded
//           console.log("Preloaded all images successfully")
//         } catch (error) {
//           console.error("Failed to preload images:", error)
//         }
//       }

//       doPreload()
//     }
//   }, [photos, loading])

//   // Generate text styles based on user selection
//   const getTextStyle = () => {
//     let fontStyle = "normal"
//     let fontWeight = "normal"

//     switch (textStyle) {
//       case "bold":
//         fontWeight = "bold"
//         break
//       case "italic":
//         fontStyle = "italic"
//         break
//       case "bold italic":
//         fontWeight = "bold"
//         fontStyle = "italic"
//         break
//       default:
//         break
//     }

//     const shadow = textShadow
//       ? "2px 2px 4px rgba(0,0,0,0.7), -2px -2px 4px rgba(0,0,0,0.7), 2px -2px 4px rgba(0,0,0,0.7), -2px 2px 4px rgba(0,0,0,0.7)"
//       : "none"

//     const positionStyle: React.CSSProperties = {
//       position: "absolute",
//       width: "100%",
//       textAlign: "center",
//       padding: "10px",
//       zIndex: 1000,
//       fontWeight,
//       fontStyle,
//       color: textColor,
//       fontSize: `${textSize}px`,
//       textShadow: shadow,
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     }

//     if (showTextBackground) {
//       positionStyle.backgroundColor = textBackgroundColor
//     }

//     switch (textPosition) {
//       case "top":
//         positionStyle.top = 0
//         break
//       case "center":
//         positionStyle.top = "50%"
//         positionStyle.transform = "translateY(-50%)"
//         break
//       case "bottom":
//         positionStyle.bottom = 0
//         break
//     }

//     return positionStyle
//   }

//   // Element dragging functions
//   const handleElementDragStart = (e: React.MouseEvent, id: string) => {
//     e.preventDefault()
//     setSelectedElement(id)
//     setIsDragging(true)
//     setDragStartPos({ x: e.clientX, y: e.clientY })

//     document.addEventListener("mousemove", handleElementDrag)
//     document.addEventListener("mouseup", handleElementDragEnd)
//   }

//   const handleElementDrag = (e: MouseEvent) => {
//     if (!isDragging || !selectedElement) return

//     const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
//     if (elementIndex === -1) return

//     const element = drawingElements[elementIndex]
//     const dx = e.clientX - dragStartPos.x
//     const dy = e.clientY - dragStartPos.y

//     const updatedElements = [...drawingElements]
//     updatedElements[elementIndex] = {
//       ...element,
//       x: element.x + dx,
//       y: element.y + dy,
//     }

//     setDrawingElements(updatedElements)
//     setDragStartPos({ x: e.clientX, y: e.clientY })
//   }

//   const handleElementDragEnd = () => {
//     setIsDragging(false)
//     document.removeEventListener("mousemove", handleElementDrag)
//     document.removeEventListener("mouseup", handleElementDragEnd)

//     if (selectedElement) {
//       setUndoStack([...undoStack, [...drawingElements]])
//       setRedoStack([])
//     }
//   }

//   // Element resizing functions
//   const handleResizeStart = (e: React.MouseEvent, id: string) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setSelectedElement(id)
//     setIsResizing(true)
//     setResizeStartPos({ x: e.clientX, y: e.clientY })

//     const element = drawingElements.find((el) => el.id === id)
//     if (!element || !element.width || !element.height) return

//     setResizeStartSize({ width: element.width, height: element.height })

//     document.addEventListener("mousemove", handleResize)
//     document.addEventListener("mouseup", handleResizeEnd)
//   }

//   const handleResize = (e: MouseEvent) => {
//     if (!isResizing || !selectedElement) return

//     const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
//     if (elementIndex === -1) return

//     const element = drawingElements[elementIndex]
//     if (!element.width || !element.height) return

//     const dx = e.clientX - resizeStartPos.x
//     const dy = e.clientY - resizeStartPos.y

//     const updatedElements = [...drawingElements]
//     updatedElements[elementIndex] = {
//       ...element,
//       width: Math.max(20, resizeStartSize.width + dx),
//       height: Math.max(20, resizeStartSize.height + dy),
//     }

//     setDrawingElements(updatedElements)
//   }

//   const handleResizeEnd = () => {
//     setIsResizing(false)
//     document.removeEventListener("mousemove", handleResize)
//     document.removeEventListener("mouseup", handleResizeEnd)

//     if (selectedElement) {
//       setUndoStack([...undoStack, [...drawingElements]])
//       setRedoStack([])
//     }
//   }

//   // Touch event handlers for mobile support
//   useEffect(() => {
//     const handleTouchMove = (e: TouchEvent) => {
//       if (isDragging && selectedElement) {
//         e.preventDefault()
//         const touch = e.touches[0]
//         const mouseEvent = new MouseEvent("mousemove", {
//           clientX: touch.clientX,
//           clientY: touch.clientY,
//         })
//         handleElementDrag(mouseEvent)
//       } else if (isResizing && selectedElement) {
//         e.preventDefault()
//         const touch = e.touches[0]
//         const mouseEvent = new MouseEvent("mousemove", {
//           clientX: touch.clientX,
//           clientY: touch.clientY,
//         })
//         handleResize(mouseEvent)
//       }
//     }

//     const handleTouchEnd = () => {
//       if (isDragging) {
//         handleElementDragEnd()
//       } else if (isResizing) {
//         handleResizeEnd()
//       }
//     }

//     document.addEventListener("touchmove", handleTouchMove, { passive: false })
//     document.addEventListener("touchend", handleTouchEnd)

//     return () => {
//       document.removeEventListener("touchmove", handleTouchMove)
//       document.removeEventListener("touchend", handleTouchEnd)
//     }
//   }, [isDragging, isResizing, selectedElement])

//   // Render different layouts
//   const renderCollage = () => {
//     if (!photos || photos.length === 0) {
//       return <Typography align="center">אין תמונות נבחרות ליצירת קולאז'</Typography>
//     }

//     console.log(`Rendering collage with ${photos.length} photos, layout: ${layout}`)

//     const TextOverlay = () => (overlayText ? <Box sx={getTextStyle()}>{overlayText}</Box> : null)

//     const renderDrawingElements = () => (
//       <>
//         {drawingElements.map((element) => {
//           const isSelected = selectedElement === element.id
//           const elementStyle: React.CSSProperties = {
//             position: "absolute",
//             left: `${element.x}px`,
//             top: `${element.y}px`,
//             zIndex: element.zIndex,
//             transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
//             cursor: "move",
//             border: isSelected ? "2px dashed #1976d2" : "none",
//             padding: isSelected ? "4px" : "0",
//           }

//           // Add resize handles if element is selected
//           const resizeHandles = isSelected ? (
//             <>
//               <div
//                 key="bottom-right"
//                 style={{
//                   position: "absolute",
//                   right: "-8px",
//                   bottom: "-8px",
//                   width: "16px",
//                   height: "16px",
//                   backgroundColor: "#1976d2",
//                   borderRadius: "50%",
//                   cursor: "nwse-resize",
//                   zIndex: 1001,
//                 }}
//                 onMouseDown={(e) => {
//                   e.stopPropagation()
//                   handleResizeStart(e, element.id)
//                 }}
//               />
//               <div
//                 key="top-right"
//                 style={{
//                   position: "absolute",
//                   right: "-8px",
//                   top: "-8px",
//                   width: "16px",
//                   height: "16px",
//                   backgroundColor: "#1976d2",
//                   borderRadius: "50%",
//                   cursor: "nesw-resize",
//                   zIndex: 1001,
//                 }}
//               />
//               <div
//                 key="bottom-left"
//                 style={{
//                   position: "absolute",
//                   left: "-8px",
//                   bottom: "-8px",
//                   width: "16px",
//                   height: "16px",
//                   backgroundColor: "#1976d2",
//                   borderRadius: "50%",
//                   cursor: "nesw-resize",
//                   zIndex: 1001,
//                 }}
//               />
//               <div
//                 key="top-left"
//                 style={{
//                   position: "absolute",
//                   left: "-8px",
//                   top: "-8px",
//                   width: "16px",
//                   height: "16px",
//                   backgroundColor: "#1976d2",
//                   borderRadius: "50%",
//                   cursor: "nwse-resize",
//                   zIndex: 1001,
//                 }}
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   top: "-30px",
//                   right: "0",
//                   zIndex: 1001,
//                 }}
//               >
//                 <IconButton
//                   size="small"
//                   color="error"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     removeDrawingElement(element.id)
//                   }}
//                   key={`delete-${element.id}`}
//                 >
//                   <DeleteIcon fontSize="small" />
//                 </IconButton>
//               </div>
//             </>
//           ) : null

//           switch (element.type) {
//             case "shape":
//               return (
//                 <div
//                   key={element.id}
//                   style={{
//                     ...elementStyle,
//                     width: element.width,
//                     height: element.height,
//                   }}
//                   onClick={() => setSelectedElement(element.id)}
//                   onMouseDown={(e) => handleElementDragStart(e, element.id)}
//                 >
//                   {renderShape(
//                     element.data.type,
//                     element.data.color,
//                     element.data.fillColor,
//                     element.width ?? 0,
//                     element.height ?? 0,
//                   )}
//                   {resizeHandles}
//                 </div>
//               )

//             case "sticker":
//               return (
//                 <div
//                   key={element.id}
//                   style={{
//                     ...elementStyle,
//                     width: element.width,
//                     height: element.height,
//                   }}
//                   onClick={() => setSelectedElement(element.id)}
//                   onMouseDown={(e) => handleElementDragStart(e, element.id)}
//                 >
//                   <img
//                     src={element.data.url || "/placeholder.svg"}
//                     alt="Sticker"
//                     style={{ width: "100%", height: "100%", objectFit: "contain" }}
//                   />
//                   {resizeHandles}
//                 </div>
//               )

//             case "text":
//               return (
//                 <div
//                   key={element.id}
//                   style={{
//                     ...elementStyle,
//                     color: element.data.color,
//                     fontSize: `${element.data.fontSize}px`,
//                     fontWeight: element.data.fontStyle.includes("bold") ? "bold" : "normal",
//                     fontStyle: element.data.fontStyle.includes("italic") ? "italic" : "normal",
//                     textShadow: element.data.shadow ? "2px 2px 4px rgba(0,0,0,0.7)" : "none",
//                     padding: "5px",
//                   }}
//                   onClick={() => setSelectedElement(element.id)}
//                   onMouseDown={(e) => handleElementDragStart(e, element.id)}
//                 >
//                   {element.data.text}
//                   {resizeHandles}
//                 </div>
//               )

//             case "brush":
//               return (
//                 <div
//                   key={element.id}
//                   style={{
//                     ...elementStyle,
//                     width: "100%",
//                     height: "100%",
//                     pointerEvents: "none",
//                   }}
//                 >
//                   <BrushStrokes paths={element.data.paths} />
//                 </div>
//               )

//             default:
//               return null
//           }
//         })}
//       </>
//     )

//     // Add this component to render brush strokes
//     const BrushStrokes = ({ paths }: { paths: any[] }) => {
//       const canvasRef = useRef<HTMLCanvasElement>(null)

//       useEffect(() => {
//         const canvas = canvasRef.current
//         if (!canvas) return

//         const ctx = canvas.getContext("2d")
//         if (!ctx) return

//         // Set canvas size
//         if (canvasRef.current && canvasRef.current.parentElement) {
//           canvas.width = canvasRef.current.parentElement.clientWidth
//           canvas.height = canvasRef.current.parentElement.clientHeight
//         } else {
//           canvas.width = window.innerWidth
//           canvas.height = window.innerHeight
//         }

//         // Clear canvas
//         ctx.clearRect(0, 0, canvas.width, canvas.height)

//         // Draw all paths
//         paths.forEach((path) => {
//           if (path.points.length < 2) return

//           ctx.beginPath()
//           ctx.moveTo(path.points[0].x, path.points[0].y)

//           for (let i = 1; i < path.points.length; i++) {
//             ctx.lineTo(path.points[i].x, path.points[i].y)
//           }

//           ctx.strokeStyle = path.color
//           ctx.lineWidth = path.size
//           ctx.lineCap = "round"
//           ctx.lineJoin = "round"
//           ctx.stroke()
//         })
//       }, [paths])

//       return (
//         <canvas
//           ref={canvasRef}
//           style={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             pointerEvents: "none",
//           }}
//         />
//       )
//     }

//     // Using the improved layout rendering from the code shared by the user
//     switch (layout) {
//       case "grid":
//         return (
//           <Box sx={{ position: "relative" }}>
//             <Grid container spacing={gapSize / 4}>
//               {photos.map((photo) => (
//                 <Grid item xs={6} sm={4} key={photo.id}>
//                   <Paper elevation={2}>
//                     <img
//                       src={photo.photoPath || "/placeholder.svg"}
//                       alt={photo.photoName || "תמונה"}
//                       style={{
//                         width: "100%",
//                         height: "auto",
//                         display: "block",
//                         maxHeight: "200px",
//                         objectFit: "cover",
//                       }}
//                       onError={(e) => {
//                         console.error(`Error loading image: ${photo.photoPath}`)
//                         ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
//                       }}
//                     />
//                     {showPhotoNames && (
//                       <Box sx={{ p: 1 }}>
//                         <Typography variant="caption" display="block" align="center">
//                           {photo.photoName || "תמונה ללא שם"}
//                         </Typography>
//                       </Box>
//                     )}
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//             <TextOverlay />
//             {renderDrawingElements()}
//           </Box>
//         )

//       case "horizontal":
//         return (
//           <Box sx={{ position: "relative" }}>
//             <Box sx={{ display: "flex", flexDirection: "row", gap: `${gapSize}px`, overflowX: "auto" }}>
//               {photos.map((photo) => (
//                 <Paper
//                   elevation={2}
//                   key={photo.id}
//                   sx={{ flex: "0 0 auto", width: `${100 / Math.min(photos.length, 3)}%` }}
//                 >
//                   <img
//                     src={photo.photoPath || "/placeholder.svg"}
//                     alt={photo.photoName || "תמונה"}
//                     style={{
//                       width: "100%",
//                       height: "200px",
//                       objectFit: "cover",
//                       display: "block",
//                     }}
//                     onError={(e) => {
//                       ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
//                     }}
//                   />
//                   {showPhotoNames && (
//                     <Box sx={{ p: 1 }}>
//                       <Typography variant="caption" display="block" align="center">
//                         {photo.photoName || "תמונה ללא שם"}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               ))}
//             </Box>
//             <TextOverlay />
//             {renderDrawingElements()}
//           </Box>
//         )

//       case "vertical":
//         return (
//           <Box sx={{ position: "relative" }}>
//             <Box sx={{ display: "flex", flexDirection: "column", gap: `${gapSize}px` }}>
//               {photos.map((photo) => (
//                 <Paper elevation={2} key={photo.id}>
//                   <img
//                     src={photo.photoPath || "/placeholder.svg"}
//                     alt={photo.photoName || "תמונה"}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       maxHeight: "250px",
//                       objectFit: "cover",
//                       display: "block",
//                     }}
//                     onError={(e) => {
//                       ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
//                     }}
//                   />
//                   {showPhotoNames && (
//                     <Box sx={{ p: 1 }}>
//                       <Typography variant="caption" display="block" align="center">
//                         {photo.photoName || "תמונה ללא שם"}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               ))}
//             </Box>
//             <TextOverlay />
//             {renderDrawingElements()}
//           </Box>
//         )

//       case "random":
//         return (
//           <Box sx={{ position: "relative", height: "500px" }}>
//             {photos.map((photo, index) => {
//               // Generate random positions but ensure all photos are visible
//               const left = Math.floor(Math.random() * 60)
//               const top = Math.floor(Math.random() * 60)
//               const zIndex = index + 1
//               const rotation = Math.floor(Math.random() * 20) - 10

//               return (
//                 <Paper
//                   elevation={3}
//                   key={photo.id}
//                   sx={{
//                     position: "absolute",
//                     left: `${left}%`,
//                     top: `${top}%`,
//                     zIndex,
//                     transform: `rotate(${rotation}deg)`,
//                     width: "40%",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   <img
//                     src={photo.photoPath || "/placeholder.svg"}
//                     alt={photo.photoName || "תמונה"}
//                     style={{
//                       width: "100%",
//                       height: "auto",
//                       display: "block",
//                     }}
//                     onError={(e) => {
//                       ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Error"
//                     }}
//                   />
//                   {showPhotoNames && (
//                     <Box sx={{ p: 1 }}>
//                       <Typography variant="caption" display="block" align="center" noWrap>
//                         {photo.photoName || "תמונה ללא שם"}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Paper>
//               )
//             })}
//             <TextOverlay />
//             {renderDrawingElements()}
//           </Box>
//         )

//       default:
//         return <Typography align="center">פריסת קולאז' לא חוקית</Typography>
//     }
//   }

//   // Render the editor panel based on active tab
//   const renderEditorPanel = () => {
//     switch (activeTab) {
//       case "layout":
//         return (
//           <Box>
//             <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
//               <FormLabel component="legend">פריסה</FormLabel>
//               <RadioGroup value={layout} onChange={handleLayoutChange}>
//                 <FormControlLabel value="grid" control={<Radio />} label="רשת" />
//                 <FormControlLabel value="horizontal" control={<Radio />} label="אופקי" />
//                 <FormControlLabel value="vertical" control={<Radio />} label="אנכי" />
//                 <FormControlLabel value="random" control={<Radio />} label="אקראי" />
//               </RadioGroup>
//             </FormControl>

//             <Box sx={{ mb: 2 }}>
//               <Typography gutterBottom>מרווח בין תמונות</Typography>
//               <Slider
//                 value={gapSize}
//                 onChange={handleGapSizeChange}
//                 min={0}
//                 max={40}
//                 step={2}
//                 valueLabelDisplay="auto"
//               />
//             </Box>

//             <Box sx={{ mb: 2 }}>
//               <Typography gutterBottom>צבע רקע</Typography>
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <input
//                   type="color"
//                   value={backgroundColor}
//                   onChange={handleBackgroundColorChange}
//                   style={{ marginRight: "8px" }}
//                 />
//                 <Typography variant="body2">{backgroundColor}</Typography>
//               </Box>
//             </Box>

//             <FormControl component="fieldset" fullWidth sx={{ mb: 2, mt: 2 }}>
//               <FormControlLabel
//                 control={<Checkbox checked={showPhotoNames} onChange={(e) => setShowPhotoNames(e.target.checked)} />}
//                 label="הצג שמות תמונות בקולאז'"
//               />
//             </FormControl>
//           </Box>
//         )

//       case "text":
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
//               <TextFieldsIcon sx={{ mr: 1 }} /> טקסט על הקולאז'
//             </Typography>

//             <TextField
//               fullWidth
//               label="טקסט על הקולאז'"
//               value={overlayText}
//               onChange={(e) => setOverlayText(e.target.value)}
//               variant="outlined"
//               margin="normal"
//               placeholder="לדוגמה: BABY"
//             />

//             <FormControl fullWidth margin="normal">
//               <InputLabel id="text-position-label">מיקום הטקסט</InputLabel>
//               <Select
//                 labelId="text-position-label"
//                 value={textPosition}
//                 onChange={(e) => setTextPosition(e.target.value as TextPositionType)}
//                 label="מיקום הטקסט"
//               >
//                 <MenuItem value="top">למעלה</MenuItem>
//                 <MenuItem value="center">מרכז</MenuItem>
//                 <MenuItem value="bottom">למטה</MenuItem>
//               </Select>
//             </FormControl>

//             <FormControl fullWidth margin="normal">
//               <InputLabel id="text-style-label">סגנון טקסט</InputLabel>
//               <Select
//                 labelId="text-style-label"
//                 value={textStyle}
//                 onChange={(e) => setTextStyle(e.target.value as FontStyleType)}
//                 label="סגנון טקסט"
//               >
//                 <MenuItem value="normal">רגיל</MenuItem>
//                 <MenuItem value="bold">מודגש</MenuItem>
//                 <MenuItem value="italic">נטוי</MenuItem>
//                 <MenuItem value="bold italic">מודגש ונטוי</MenuItem>
//               </Select>
//             </FormControl>

//             <Typography gutterBottom sx={{ mt: 2 }}>
//               גודל טקסט
//             </Typography>
//             <Slider
//               value={textSize}
//               onChange={handleTextSizeChange}
//               min={12}
//               max={72}
//               step={4}
//               valueLabelDisplay="auto"
//             />

//             <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
//               <Typography gutterBottom sx={{ mr: 2 }}>
//                 צבע טקסט
//               </Typography>
//               <input
//                 type="color"
//                 value={textColor}
//                 onChange={(e) => setTextColor(e.target.value)}
//                 style={{ marginRight: "8px" }}
//               />
//             </Box>

//             <FormControlLabel
//               control={<Checkbox checked={textShadow} onChange={(e) => setTextShadow(e.target.checked)} />}
//               label="צל טקסט"
//               sx={{ mt: 1 }}
//             />

//             <FormControlLabel
//               control={
//                 <Checkbox checked={showTextBackground} onChange={(e) => setShowTextBackground(e.target.checked)} />
//               }
//               label="רקע לטקסט"
//               sx={{ mt: 1 }}
//             />

//             {showTextBackground && (
//               <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 4 }}>
//                 <Typography gutterBottom sx={{ mr: 2 }}>
//                   צבע רקע לטקסט
//                 </Typography>
//                 <input
//                   type="color"
//                   value={textBackgroundColor.replace("rgba", "rgb").replace(/,[^,]*\)/, ")")}
//                   onChange={(e) => {
//                     // Convert RGB to RGBA with opacity 0.3
//                     const rgb = e.target.value
//                     const rgba = rgb.replace("rgb", "rgba").replace(")", ",0.3)")
//                     setTextBackgroundColor(rgba)
//                   }}
//                   style={{ marginRight: "8px" }}
//                 />
//               </Box>
//             )}

//             <Button
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//               onClick={() => {
//                 if (overlayText.trim()) {
//                   selectText(overlayText)
//                 }
//               }}
//             >
//               הוסף טקסט לקולאז'
//             </Button>
//           </Box>
//         )

//       case "draw":
//         return (
//           <Box>
//             <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
//               <BrushIcon sx={{ mr: 1 }} /> ציור חופשי
//             </Typography>

//             <Box sx={{ mb: 2 }}>
//               <Typography gutterBottom>צבע מברשת</Typography>
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <input
//                   type="color"
//                   value={brushColor}
//                   onChange={(e) => setBrushColor(e.target.value)}
//                   style={{ marginRight: "8px" }}
//                 />
//                 <Typography variant="body2">{brushColor}</Typography>
//               </Box>
//             </Box>

//             <Box sx={{ mb: 2 }}>
//               <Typography gutterBottom>גודל מברשת</Typography>
//               <Slider
//                 value={brushSize}
//                 onChange={(_, newValue) => setBrushSize(newValue as number)}
//                 min={1}
//                 max={20}
//                 step={1}
//                 valueLabelDisplay="auto"
//               />
//             </Box>

//             <Button
//               variant="contained"
//               color={drawingMode ? "secondary" : "primary"}
//               fullWidth
//               onClick={() => setDrawingMode(!drawingMode)}
//               startIcon={<BrushIcon />}
//             >
//               {drawingMode ? "הפסק ציור" : "התחל ציור"}
//             </Button>

//             <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
//               לחץ על הכפתור למעלה כדי להתחיל לצייר על הקולאז'. לחץ שוב כדי להפסיק.
//             </Typography>
//           </Box>
//         )

//       case "shapes":
//         return (
//           <ShapesPanel
//             onAddShape={selectShape}
//             brushColor={brushColor}
//             onColorChange={(color) => setBrushColor(color)}
//           />
//         )

//       case "stickers":
//         return <StickersPanel onAddSticker={selectSticker} />

//       case "brush":
//         return (
//           <BrushPanel
//             brushColor={brushColor}
//             brushSize={brushSize}
//             onColorChange={(color) => setBrushColor(color)}
//             onSizeChange={(size) => setBrushSize(size)}
//           />
//         )

//       default:
//         return null
//     }
//   }

//   // Dummy renderShape function
//   const renderShape = (shapeType: string, color: string, fillColor: string, width: number, height: number) => {
//     return (
//       <Box
//         sx={{
//           width: width,
//           height: height,
//           backgroundColor: fillColor,
//           border: `2px solid ${color}`,
//           borderRadius: shapeType === "circle" ? "50%" : 0,
//         }}
//       />
//     )
//   }

//   // Render cursor based on placement mode
//   const getCursorStyle = () => {
//     switch (placementMode) {
//       case "shape":
//         return "crosshair"
//       case "sticker":
//         return "crosshair"
//       case "text":
//         return "text"
//       default:
//         return "default"
//     }
//   }

//   // Render placement guide
//   const renderPlacementGuide = () => {
//     if (placementMode === "none") return null

//     let message = ""
//     switch (placementMode) {
//       case "shape":
//         message = "לחץ על הקולאז' כדי למקם את הצורה"
//         break
//       case "sticker":
//         message = "לחץ על הקולאז' כדי למקם את המדבקה"
//         break
//       case "text":
//         message = "לחץ על הקולאז' כדי למקם את הטקסט"
//         break
//     }

//     return (
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: "rgba(25, 118, 210, 0.8)",
//           color: "white",
//           padding: "8px",
//           textAlign: "center",
//           zIndex: 1000,
//         }}
//       >
//         {message}
//       </Box>
//     )
//   }

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//           <Box textAlign="center">
//             <CircularProgress sx={{ mb: 2 }} />
//             <Typography>טוען תמונות...</Typography>
//           </Box>
//         </Box>
//       </Container>
//     )
//   }

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
//       {/* App Bar */}
//       <AppBar position="static" sx={{ bgcolor: "#c46868" }}>
//         <Toolbar>
//           {/* <IconButton
//             edge="start"
//             color="inherit"
//             onClick={handleGoBack}
//             sx={{ mr: 2 }}
//           >
//             <ArrowBackIcon />
//           </IconButton> */}
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             יצירת קולאז' - {selectedPhotoIds.length} תמונות נבחרו
//           </Typography>
//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Button
//               color="inherit"
//               startIcon={<DownloadIcon />}
//               onClick={downloadCollage}
//               disabled={photos.length === 0 || processing}
//             >
//               {processing ? "מעבד..." : "הורד"}
//             </Button>
//             <Button
//               color="inherit"
//               startIcon={<SaveIcon />}
//               onClick={saveCollage}
//               disabled={photos.length === 0 || processing}
//               variant="outlined"
//               sx={{ borderColor: "white", "&:hover": { borderColor: "white" } }}
//             >
//               {processing ? "מעבד..." : "שמור"}
//             </Button>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="xl" sx={{ py: 3 }}>
//         {/* Editor Tabs */}
//         <Paper sx={{ mb: 3 }}>
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             sx={{ borderBottom: 1, borderColor: "divider" }}
//           >
//             <Tab icon={<ImageIcon />} label="פריסה" value="layout" iconPosition="start" />
//             <Tab icon={<TextFieldsIcon />} label="טקסט" value="text" iconPosition="start" />
//             <Tab icon={<BrushIcon />} label="ציור" value="draw" iconPosition="start" />
//             <Tab icon={<ShapeLineIcon />} label="צורות" value="shapes" iconPosition="start" />
//             <Tab icon={<EmojiEmotionsIcon />} label="מדבקות" value="stickers" iconPosition="start" />
//             <Tab icon={<PaletteIcon />} label="מברשות" value="brush" iconPosition="start" />
//           </Tabs>
//         </Paper>

//         {/* Drawing Tools */}
//         {(activeTab === "draw" || activeTab === "shapes" || activeTab === "stickers") && (
//           <Paper sx={{ p: 2, mb: 3 }}>
//             <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
//               <Tooltip title="בטל">
//                 <span>
//                   <IconButton onClick={handleUndo} disabled={undoStack.length === 0} color="primary">
//                     <UndoIcon />
//                   </IconButton>
//                 </span>
//               </Tooltip>

//               <Tooltip title="בצע שוב">
//                 <span>
//                   <IconButton onClick={handleRedo} disabled={redoStack.length === 0} color="primary">
//                     <RedoIcon />
//                   </IconButton>
//                 </span>
//               </Tooltip>

//               <Tooltip title="מחק נבחר">
//                 <span>
//                   <IconButton
//                     onClick={() => selectedElement && removeDrawingElement(selectedElement)}
//                     disabled={!selectedElement}
//                     color="error"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </span>
//               </Tooltip>
//             </Box>
//           </Paper>
//         )}

//         <Grid container spacing={3}>
//           {/* Control Panel */}
//           <Grid item xs={12} lg={3}>
//             <Paper sx={{ p: 3, height: "fit-content", position: "sticky", top: 20 }}>
//               {renderEditorPanel()}

//               <Divider sx={{ my: 2 }} />

//               <Box sx={{ mt: 3 }}>
//                 <Button
//                   variant="outlined"
//                   color="primary"
//                   size="small"
//                   fullWidth
//                   onClick={() =>
//                     preloadImages(photos).then((preloaded) => {
//                       preloadedPhotosRef.current = preloaded
//                       setNotification({
//                         open: true,
//                         message: "התמונות עובדו מראש בהצלחה",
//                         severity: "success",
//                       })
//                     })
//                   }
//                   disabled={processing || photos.length === 0}
//                 >
//                   עבד תמונות מראש
//                 </Button>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Collage Canvas */}
//           <Grid item xs={12} lg={9}>
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 3,
//                 bgcolor: backgroundColor,
//                 minHeight: "70vh",
//                 position: "relative",
//               }}
//             >
//               {renderPlacementGuide()}
//               <Box
//                 ref={canvasRef}
//                 sx={{
//                   position: "relative",
//                   cursor: getCursorStyle(),
//                   height: "100%",
//                   width: "100%",
//                 }}
//                 onClick={handleCanvasClick}
//               >
//                 {renderCollage()}
//                 {drawingMode && (
//                   <DrawingCanvas
//                     ref={drawingCanvasRef}
//                     brushColor={brushColor}
//                     brushSize={brushSize}
//                     onDrawingComplete={(paths) => {
//                       addDrawingElement({
//                         type: "brush",
//                         x: 0,
//                         y: 0,
//                         data: {
//                           paths,
//                           color: brushColor,
//                           size: brushSize,
//                         },
//                       })
//                       setDrawingMode(false)
//                     }}
//                   />
//                 )}
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Notifications */}
//       <Snackbar
//         open={notification.open}
//         autoHideDuration={6000}
//         onClose={handleCloseNotification}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: "100%" }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// export default CollageCreatorPage



"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Box,
  Button,
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
  Tooltip,
  Container,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Backdrop,
  Card,
  CardContent,
  Chip,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import DownloadIcon from "@mui/icons-material/Download"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import BrushIcon from "@mui/icons-material/Brush"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import ShapeLineIcon from "@mui/icons-material/Hexagon"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import DeleteIcon from "@mui/icons-material/Delete"
import PaletteIcon from "@mui/icons-material/Palette"
import CloseIcon from "@mui/icons-material/Close"
import SettingsIcon from "@mui/icons-material/Settings"
import albumStore from "../../stores/albumStore"
import html2canvas from "html2canvas"
import { DrawingCanvas } from "./DrawingCanvas"
import { ShapesPanel } from "./ShapesPanel"
import { StickersPanel } from "./StickersPanel"
import { BrushPanel } from "./BrushPanel"

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

const CollageCreatorPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get selected photo IDs from navigation state
  const selectedPhotoIds: number[] = location.state?.selectedPhotoIds || []

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

  // Dialog states for popup windows
  const [openLayoutDialog, setOpenLayoutDialog] = useState<boolean>(false)
  const [openTextDialog, setOpenTextDialog] = useState<boolean>(false)
  const [openDrawDialog, setOpenDrawDialog] = useState<boolean>(false)
  const [openShapesDialog, setOpenShapesDialog] = useState<boolean>(false)
  const [openStickersDialog, setOpenStickersDialog] = useState<boolean>(false)
  const [openBrushDialog, setOpenBrushDialog] = useState<boolean>(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
  const preloadedPhotosRef = useRef<any[]>([])
  const originalPhotosRef = useRef<any[]>([])

  // Add these new functions for dragging and resizing elements
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [resizeStartSize, setResizeStartSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Check if user came from photo selection, if not redirect
  useEffect(() => {
    if (selectedPhotoIds.length === 0) {
      navigate("/personal-area/all-photoes-of-user")
      return
    }
  }, [selectedPhotoIds, navigate])

  // Load selected photos
  useEffect(() => {
    if (selectedPhotoIds.length > 0) {
      setLoading(true)

      try {
        // Filter selected photos from albumStore
        const selectedPhotos = albumStore.photos.filter((photo: any) => selectedPhotoIds.includes(photo.id))

        if (selectedPhotos.length > 0) {
          console.log("Selected photos loaded:", selectedPhotos.length)
          setPhotos(selectedPhotos)
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
  }, [selectedPhotoIds])

  // Reset drawing elements when component mounts
  useEffect(() => {
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
  }, [])

  const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(event.target.value as LayoutType)
  }

  const handleGapSizeChange = (event: Event, newValue: number | number[]) => {
    setGapSize(newValue as number)
    console.log(event)
  }

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value)
  }

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
  }

  const handleTextSizeChange = (event: Event, newValue: number | number[]) => {
    setTextSize(newValue as number)
    console.log(event)
  }

  // Handle dialog opening
  const handleOpenDialog = (dialogType: EditorTabType) => {
    // Close all dialogs first
    setOpenLayoutDialog(false)
    setOpenTextDialog(false)
    setOpenDrawDialog(false)
    setOpenShapesDialog(false)
    setOpenStickersDialog(false)
    setOpenBrushDialog(false)

    // Open the requested dialog
    switch (dialogType) {
      case "layout":
        setOpenLayoutDialog(true)
        break
      case "text":
        setOpenTextDialog(true)
        break
      case "draw":
        setOpenDrawDialog(true)
        break
      case "shapes":
        setOpenShapesDialog(true)
        break
      case "stickers":
        setOpenStickersDialog(true)
        break
      case "brush":
        setOpenBrushDialog(true)
        break
    }

    setActiveTab(dialogType)

    if (dialogType === "draw") {
      setDrawingMode(true)
    } else {
      setDrawingMode(false)
    }
  }

  // Add a new drawing element
  const addDrawingElement = (element: Omit<DrawingElement, "id" | "zIndex">) => {
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
    setPlacementMode("shape")
    setPendingShape(shapeType)
    setPendingSticker(null)
    setPendingText(null)
    setOpenShapesDialog(false)

    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את הצורה",
      severity: "success",
    })
  }

  // Select a sticker to add to the canvas
  const selectSticker = (stickerUrl: string) => {
    setPlacementMode("sticker")
    setPendingSticker(stickerUrl)
    setPendingShape(null)
    setPendingText(null)
    setOpenStickersDialog(false)

    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את המדבקה",
      severity: "success",
    })
  }

  // Select text to add to the canvas
  const selectText = (text: string) => {
    setPlacementMode("text")
    setPendingText(text)
    setPendingSticker(null)
    setPendingShape(null)
    setOpenTextDialog(false)

    setNotification({
      open: true,
      message: "לחץ על הקולאז' כדי למקם את הטקסט",
      severity: "success",
    })
  }

  // Handle canvas click for placing elements
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (placementMode === "none") return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (placementMode === "shape" && pendingShape) {
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
      setPlacementMode("none")
      setPendingShape(null)
    } else if (placementMode === "sticker" && pendingSticker) {
      const img = new Image()
      img.src = pendingSticker

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
            url: pendingSticker,
          },
        }

        addDrawingElement(newSticker)
        setPlacementMode("none")
        setPendingSticker(null)
      }
    } else if (placementMode === "text" && pendingText) {
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
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise<void>((resolve) => {
          img.onload = () => resolve()
          img.onerror = () => {
            console.error(`Failed to load image: ${photo.photoPath}`)
            failedIndices.push(i)
            resolve()
          }

          img.src = `${photo.photoPath}${photo.photoPath.includes("?") ? "&" : "?"}cacheBust=${new Date().getTime()}`

          setTimeout(() => {
            if (!img.complete) {
              console.warn(`Image load timeout: ${photo.photoPath}`)
              failedIndices.push(i)
              resolve()
            }
          }, 5000)
        })

        if (!failedIndices.includes(i)) {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")

          if (ctx) {
            ctx.drawImage(img, 0, 0)

            try {
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

      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos)
      }

      const backupPhotos = [...photos]
      setPhotos(preloadedPhotosRef.current)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "מייצר תמונת קולאז׳, אנא המתן...",
        severity: "success",
      })

      const element = canvasRef.current

      await ensureImagesLoaded()
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
          const images = documentClone.querySelectorAll("img")
          images.forEach((img) => {
            if (!img.complete) {
              console.warn("Found incomplete image in clone, forcing complete")
              img.setAttribute("data-html2canvas-ignore", "false")
            }
          })
          return documentClone
        },
      })

      const link = document.createElement("a")
      link.download = `collage_${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()

      setPhotos(backupPhotos)

      setNotification({
        open: true,
        message: "הקולאז׳ הורד בהצלחה!",
        severity: "success",
      })
    } catch (error) {
      console.error("Error generating collage:", error)
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

      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos)
      }

      const backupPhotos = [...photos]
      setPhotos(preloadedPhotosRef.current)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "שומר את הקולאז׳, אנא המתן...",
        severity: "success",
      })

      const element = canvasRef.current

      await ensureImagesLoaded()
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

      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to create blob"))
        }, "image/png")
      })

      console.log("Image blob created, ready to upload:", imageBlob.size, "bytes")

      setPhotos(backupPhotos)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        open: true,
        message: "הקולאז׳ נשמר בהצלחה!",
        severity: "success",
      })

      setTimeout(() => {
        navigate("/personal-area/userAlbums")
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

    const shadow = textShadow
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
      color: textColor,
      fontSize: `${textSize}px`,
      textShadow: shadow,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }

    if (showTextBackground) {
      positionStyle.backgroundColor = textBackgroundColor
    }

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

    document.addEventListener("mousemove", handleElementDrag)
    document.addEventListener("mouseup", handleElementDragEnd)
  }

  const handleElementDrag = (e: MouseEvent) => {
    if (!isDragging || !selectedElement) return

    const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
    if (elementIndex === -1) return

    const element = drawingElements[elementIndex]
    const dx = e.clientX - dragStartPos.x
    const dy = e.clientY - dragStartPos.y

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

    const element = drawingElements.find((el) => el.id === id)
    if (!element || !element.width || !element.height) return

    setResizeStartSize({ width: element.width, height: element.height })

    document.addEventListener("mousemove", handleResize)
    document.addEventListener("mouseup", handleResizeEnd)
  }

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || !selectedElement) return

    const elementIndex = drawingElements.findIndex((el) => el.id === selectedElement)
    if (elementIndex === -1) return

    const element = drawingElements[elementIndex]
    if (!element.width || !element.height) return

    const dx = e.clientX - resizeStartPos.x
    const dy = e.clientY - resizeStartPos.y

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

    console.log(`Rendering collage with ${photos.length} photos, layout: ${layout}`)

    const TextOverlay = () => (overlayText ? <Box sx={getTextStyle()}>{overlayText}</Box> : null)

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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ mb: 2, color: "#ea66cb" }} size={60} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
              טוען תמונות...
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
              מכין את הקולאז' המושלם שלך
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
      }}
    >
      {/* App Bar */}
      <AppBar
        position="static"
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "#333",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            🎨 יצירת קולאז' מקצועי
            <Chip
              label={`${selectedPhotoIds.length} תמונות`}
              size="small"
              sx={{
                ml: 2,
                background: "linear-gradient(45deg, #ea66cb, #bd84f6)",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadCollage}
              disabled={photos.length === 0 || processing}
              sx={{
                background: "linear-gradient(45deg, #ea66cb, #bd84f6)",
                borderRadius: 3,
                px: 3,
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(234, 102, 203, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #d455b8, #a970e3)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(234, 102, 203, 0.4)",
                },
              }}
            >
              {processing ? "מעבד..." : "הורד"}
            </Button>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveCollage}
              disabled={photos.length === 0 || processing}
              sx={{
                borderColor: "#ea66cb",
                color: "#ea66cb",
                borderRadius: 3,
                px: 3,
                fontWeight: "bold",
                borderWidth: 2,
                "&:hover": {
                  borderColor: "#d455b8",
                  color: "#d455b8",
                  background: "rgba(234, 102, 203, 0.05)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {processing ? "מעבד..." : "שמור"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Floating Action Buttons */}
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            right: 20,
            transform: "translateY(-50%)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Tooltip title="הגדרות פריסה" placement="left">
            <Fab
              color="primary"
              onClick={() => handleOpenDialog("layout")}
              sx={{
                background: "linear-gradient(45deg, #ea66cb, #bd84f6)",
                boxShadow: "0 4px 20px rgba(234, 102, 203, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #d455b8, #a970e3)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <SettingsIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="הוסף טקסט" placement="left">
            <Fab
              onClick={() => handleOpenDialog("text")}
              sx={{
                background: "linear-gradient(45deg, #f093fb, #00d4ff)",
                color: "white",
                boxShadow: "0 4px 20px rgba(240, 147, 251, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #e080f8, #00c4ef)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <TextFieldsIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="ציור חופשי" placement="left">
            <Fab
              onClick={() => handleOpenDialog("draw")}
              sx={{
                background: "linear-gradient(45deg, #bd84f6, #ea66cb)",
                color: "white",
                boxShadow: "0 4px 20px rgba(189, 132, 246, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #a970e3, #d455b8)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <BrushIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="הוסף צורות" placement="left">
            <Fab
              onClick={() => handleOpenDialog("shapes")}
              sx={{
                background: "linear-gradient(45deg, #00d4ff, #f093fb)",
                color: "white",
                boxShadow: "0 4px 20px rgba(0, 212, 255, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #00c4ef, #e080f8)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <ShapeLineIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="הוסף מדבקות" placement="left">
            <Fab
              onClick={() => handleOpenDialog("stickers")}
              sx={{
                background: "linear-gradient(45deg, #ea66cb, #f093fb)",
                color: "white",
                boxShadow: "0 4px 20px rgba(234, 102, 203, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #d455b8, #e080f8)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <EmojiEmotionsIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="הגדרות מברשת" placement="left">
            <Fab
              onClick={() => handleOpenDialog("brush")}
              sx={{
                background: "linear-gradient(45deg, #bd84f6, #00d4ff)",
                color: "white",
                boxShadow: "0 4px 20px rgba(189, 132, 246, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #a970e3, #00c4ef)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <PaletteIcon />
            </Fab>
          </Tooltip>
        </Box>

        {/* Drawing Tools */}
        {(activeTab === "draw" || activeTab === "shapes" || activeTab === "stickers") && (
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Tooltip title="בטל">
                <span>
                  <IconButton
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                    sx={{
                      color: "#ea66cb",
                      "&:hover": {
                        background: "rgba(234, 102, 203, 0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="בצע שוב">
                <span>
                  <IconButton
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    sx={{
                      color: "#bd84f6",
                      "&:hover": {
                        background: "rgba(189, 132, 246, 0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <RedoIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="מחק נבחר">
                <span>
                  <IconButton
                    onClick={() => selectedElement && removeDrawingElement(selectedElement)}
                    disabled={!selectedElement}
                    sx={{
                      color: "#f44336",
                      "&:hover": {
                        background: "rgba(244, 67, 54, 0.1)",
                        transform: "scale(1.1)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Paper>
        )}

        {/* Collage Canvas */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: backgroundColor,
            minHeight: "70vh",
            position: "relative",
            borderRadius: 4,
            background: `${backgroundColor}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "3px solid rgba(255, 255, 255, 0.2)",
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
                  setDrawingMode(false)
                }}
              />
            )}
          </Box>
        </Paper>
      </Container>

      {/* Layout Dialog */}
      <Dialog
        open={openLayoutDialog}
        onClose={() => setOpenLayoutDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #ea66cb, #bd84f6)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SettingsIcon />
          הגדרות פריסה
          <IconButton
            onClick={() => setOpenLayoutDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ fontWeight: "bold", color: "#333" }}>
              פריסה
            </FormLabel>
            <RadioGroup value={layout} onChange={handleLayoutChange}>
              <FormControlLabel value="grid" control={<Radio sx={{ color: "#ea66cb" }} />} label="רשת" />
              <FormControlLabel value="horizontal" control={<Radio sx={{ color: "#ea66cb" }} />} label="אופקי" />
              <FormControlLabel value="vertical" control={<Radio sx={{ color: "#ea66cb" }} />} label="אנכי" />
              <FormControlLabel value="random" control={<Radio sx={{ color: "#ea66cb" }} />} label="אקראי" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              מרווח בין תמונות
            </Typography>
            <Slider
              value={gapSize}
              onChange={handleGapSizeChange}
              min={0}
              max={40}
              step={2}
              valueLabelDisplay="auto"
              sx={{
                color: "#ea66cb",
                "& .MuiSlider-thumb": {
                  background: "linear-gradient(45deg, #ea66cb, #bd84f6)",
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע רקע
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                value={backgroundColor}
                onChange={handleBackgroundColorChange}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  background: "rgba(234, 102, 203, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontFamily: "monospace",
                }}
              >
                {backgroundColor}
              </Typography>
            </Box>
          </Box>

          <FormControl component="fieldset" fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPhotoNames}
                  onChange={(e) => setShowPhotoNames(e.target.checked)}
                  sx={{ color: "#ea66cb" }}
                />
              }
              label="הצג שמות תמונות בקולאז'"
            />
          </FormControl>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog
        open={openTextDialog}
        onClose={() => setOpenTextDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #f093fb, #00d4ff)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextFieldsIcon />
          הוסף טקסט לקולאז'
          <IconButton
            onClick={() => setOpenTextDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="טקסט על הקולאז'"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            variant="outlined"
            margin="normal"
            placeholder="לדוגמה: BABY"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#f093fb",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f093fb",
              },
            }}
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

          <Typography gutterBottom sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>
            גודל טקסט
          </Typography>
          <Slider
            value={textSize}
            onChange={handleTextSizeChange}
            min={12}
            max={72}
            step={4}
            valueLabelDisplay="auto"
            sx={{
              color: "#f093fb",
              "& .MuiSlider-thumb": {
                background: "linear-gradient(45deg, #f093fb, #00d4ff)",
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 2 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע טקסט
            </Typography>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              style={{
                width: "60px",
                height: "40px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={textShadow}
                  onChange={(e) => setTextShadow(e.target.checked)}
                  sx={{ color: "#f093fb" }}
                />
              }
              label="צל טקסט"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={showTextBackground}
                  onChange={(e) => setShowTextBackground(e.target.checked)}
                  sx={{ color: "#f093fb" }}
                />
              }
              label="רקע לטקסט"
            />
          </Box>

          {showTextBackground && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 4, gap: 2 }}>
              <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                צבע רקע לטקסט
              </Typography>
              <input
                type="color"
                value={textBackgroundColor.replace("rgba", "rgb").replace(/,[^,]*\)/, ")")}
                onChange={(e) => {
                  const rgb = e.target.value
                  const rgba = rgb.replace("rgb", "rgba").replace(")", ",0.3)")
                  setTextBackgroundColor(rgba)
                }}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (overlayText.trim()) {
                selectText(overlayText)
              }
            }}
            sx={{
              background: "linear-gradient(45deg, #f093fb, #00d4ff)",
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                background: "linear-gradient(45deg, #e080f8, #00c4ef)",
                transform: "translateY(-2px)",
              },
            }}
          >
            הוסף טקסט לקולאז'
          </Button>
        </DialogActions>
      </Dialog>

      {/* Draw Dialog */}
      <Dialog
        open={openDrawDialog}
        onClose={() => setOpenDrawDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #bd84f6, #ea66cb)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BrushIcon />
          ציור חופשי
          <IconButton
            onClick={() => setOpenDrawDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע מברשת
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  background: "rgba(189, 132, 246, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontFamily: "monospace",
                }}
              >
                {brushColor}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              גודל מברשת
            </Typography>
            <Slider
              value={brushSize}
              onChange={(_, newValue) => setBrushSize(newValue as number)}
              min={1}
              max={20}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#bd84f6",
                "& .MuiSlider-thumb": {
                  background: "linear-gradient(45deg, #bd84f6, #ea66cb)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setDrawingMode(!drawingMode)
              setOpenDrawDialog(false)
            }}
            startIcon={<BrushIcon />}
            sx={{
              background: drawingMode
                ? "linear-gradient(45deg, #f44336, #ff9800)"
                : "linear-gradient(45deg, #bd84f6, #ea66cb)",
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                background: drawingMode
                  ? "linear-gradient(45deg, #d32f2f, #f57c00)"
                  : "linear-gradient(45deg, #a970e3, #d455b8)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {drawingMode ? "הפסק ציור" : "התחל ציור"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shapes Dialog */}
      <Dialog
        open={openShapesDialog}
        onClose={() => setOpenShapesDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #00d4ff, #f093fb)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShapeLineIcon />
          הוסף צורות
          <IconButton
            onClick={() => setOpenShapesDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ShapesPanel
            onAddShape={selectShape}
            brushColor={brushColor}
            onColorChange={(color) => setBrushColor(color)}
          />
        </DialogContent>
      </Dialog>

      {/* Stickers Dialog */}
      <Dialog
        open={openStickersDialog}
        onClose={() => setOpenStickersDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #ea66cb, #f093fb)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EmojiEmotionsIcon />
          הוסף מדבקות
          <IconButton
            onClick={() => setOpenStickersDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <StickersPanel onAddSticker={selectSticker} />
        </DialogContent>
      </Dialog>

      {/* Brush Dialog */}
      <Dialog
        open={openBrushDialog}
        onClose={() => setOpenBrushDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #bd84f6, #00d4ff)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PaletteIcon />
          הגדרות מברשת
          <IconButton
            onClick={() => setOpenBrushDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <BrushPanel
            brushColor={brushColor}
            brushSize={brushSize}
            onColorChange={(color) => setBrushColor(color)}
            onSizeChange={(size) => setBrushSize(size)}
          />
        </DialogContent>
      </Dialog>

      {/* Backdrop for dialogs */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
        }}
        open={
          openLayoutDialog ||
          openTextDialog ||
          openDrawDialog ||
          openShapesDialog ||
          openStickersDialog ||
          openBrushDialog
        }
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{
            width: "100%",
            borderRadius: 3,
            fontWeight: "bold",
            "& .MuiAlert-icon": {
              fontSize: "24px",
            },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CollageCreatorPage
