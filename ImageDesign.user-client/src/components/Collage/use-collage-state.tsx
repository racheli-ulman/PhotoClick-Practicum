"use client"

import { useState } from "react"

export type LayoutType = "grid" | "horizontal" | "vertical" | "random"
export type TextPositionType = "top" | "center" | "bottom"
export type FontStyleType = "normal" | "bold" | "italic" | "bold italic"
export type EditorTabType = "layout" | "text" | "draw" | "shapes" | "stickers" | "brush"
export type PlacementMode = "none" | "sticker" | "shape" | "text"

export interface DrawingElement {
  id: string
  type: "brush" | "shape" | "sticker" | "text"
  x: number
  y: number
  width?: number
  height?: number
  rotation?: number
  data: any
  zIndex: number
}

export interface CollageState {
  // Layout states
  layout: LayoutType
  setLayout: (layout: LayoutType) => void
  gapSize: number
  setGapSize: (size: number) => void
  backgroundColor: string
  setBackgroundColor: (color: string) => void
  showPhotoNames: boolean
  setShowPhotoNames: (show: boolean) => void

  // Text overlay states
  overlayText: string
  setOverlayText: (text: string) => void
  textColor: string
  setTextColor: (color: string) => void
  textSize: number
  setTextSize: (size: number) => void
  textPosition: TextPositionType
  setTextPosition: (position: TextPositionType) => void
  textStyle: FontStyleType
  setTextStyle: (style: FontStyleType) => void
  textShadow: boolean
  setTextShadow: (shadow: boolean) => void
  textBackgroundColor: string
  setTextBackgroundColor: (color: string) => void
  showTextBackground: boolean
  setShowTextBackground: (show: boolean) => void

  // Drawing states
  activeTab: EditorTabType
  setActiveTab: (tab: EditorTabType) => void
  drawingMode: boolean
  setDrawingMode: (mode: boolean) => void
  brushColor: string
  setBrushColor: (color: string) => void
  brushSize: number
  setBrushSize: (size: number) => void
  drawingElements: DrawingElement[]
  setDrawingElements: (elements: DrawingElement[]) => void
  selectedElement: string | null
  setSelectedElement: (id: string | null) => void
  undoStack: DrawingElement[][]
  setUndoStack: (stack: DrawingElement[][]) => void
  redoStack: DrawingElement[][]
  setRedoStack: (stack: DrawingElement[][]) => void

  // Placement states
  placementMode: PlacementMode
  setPlacementMode: (mode: PlacementMode) => void
  pendingSticker: string | null
  setPendingSticker: (sticker: string | null) => void
  pendingShape: string | null
  setPendingShape: (shape: string | null) => void
  pendingText: string | null
  setPendingText: (text: string | null) => void

  // Dialog states
  openLayoutDialog: boolean
  setOpenLayoutDialog: (open: boolean) => void
  openTextDialog: boolean
  setOpenTextDialog: (open: boolean) => void
  openDrawDialog: boolean
  setOpenDrawDialog: (open: boolean) => void
  openShapesDialog: boolean
  setOpenShapesDialog: (open: boolean) => void
  openStickersDialog: boolean
  setOpenStickersDialog: (open: boolean) => void
  openBrushDialog: boolean
  setOpenBrushDialog: (open: boolean) => void

  // Methods
  handleOpenDialog: (dialogType: EditorTabType) => void
  addDrawingElement: (element: Omit<DrawingElement, "id" | "zIndex">) => string
  removeDrawingElement: (id: string) => void
  handleUndo: () => void
  handleRedo: () => void
  selectShape: (shapeType: string) => void
  selectSticker: (stickerUrl: string) => void
  selectText: (text: string) => void
}

export const useCollageState = (): CollageState => {
  // Layout states
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [gapSize, setGapSize] = useState<number>(10)
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff")
  const [showPhotoNames, setShowPhotoNames] = useState<boolean>(false)

  // Text overlay states
  const [overlayText, setOverlayText] = useState<string>("")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [textSize, setTextSize] = useState<number>(36)
  const [textPosition, setTextPosition] = useState<TextPositionType>("center")
  const [textStyle, setTextStyle] = useState<FontStyleType>("bold")
  const [textShadow, setTextShadow] = useState<boolean>(true)
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>("rgba(0, 0, 0, 0.3)")
  const [showTextBackground, setShowTextBackground] = useState<boolean>(false)

  // Drawing states
  const [activeTab, setActiveTab] = useState<EditorTabType>("layout")
  const [drawingMode, setDrawingMode] = useState<boolean>(false)
  const [brushColor, setBrushColor] = useState<string>("#000000")
  const [brushSize, setBrushSize] = useState<number>(5)
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [undoStack, setUndoStack] = useState<DrawingElement[][]>([])
  const [redoStack, setRedoStack] = useState<DrawingElement[][]>([])

  // Placement states
  const [placementMode, setPlacementMode] = useState<PlacementMode>("none")
  const [pendingSticker, setPendingSticker] = useState<string | null>(null)
  const [pendingShape, setPendingShape] = useState<string | null>(null)
  const [pendingText, setPendingText] = useState<string | null>(null)

  // Dialog states
  const [openLayoutDialog, setOpenLayoutDialog] = useState<boolean>(false)
  const [openTextDialog, setOpenTextDialog] = useState<boolean>(false)
  const [openDrawDialog, setOpenDrawDialog] = useState<boolean>(false)
  const [openShapesDialog, setOpenShapesDialog] = useState<boolean>(false)
  const [openStickersDialog, setOpenStickersDialog] = useState<boolean>(false)
  const [openBrushDialog, setOpenBrushDialog] = useState<boolean>(false)

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
  }

  // Select a sticker to add to the canvas
  const selectSticker = (stickerUrl: string) => {
    setPlacementMode("sticker")
    setPendingSticker(stickerUrl)
    setPendingShape(null)
    setPendingText(null)
    setOpenStickersDialog(false)
  }

  // Select text to add to the canvas
  const selectText = (text: string) => {
    setPlacementMode("text")
    setPendingText(text)
    setPendingSticker(null)
    setPendingShape(null)
    setOpenTextDialog(false)
  }

  return {
    // Layout states
    layout,
    setLayout,
    gapSize,
    setGapSize,
    backgroundColor,
    setBackgroundColor,
    showPhotoNames,
    setShowPhotoNames,

    // Text overlay states
    overlayText,
    setOverlayText,
    textColor,
    setTextColor,
    textSize,
    setTextSize,
    textPosition,
    setTextPosition,
    textStyle,
    setTextStyle,
    textShadow,
    setTextShadow,
    textBackgroundColor,
    setTextBackgroundColor,
    showTextBackground,
    setShowTextBackground,

    // Drawing states
    activeTab,
    setActiveTab,
    drawingMode,
    setDrawingMode,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    drawingElements,
    setDrawingElements,
    selectedElement,
    setSelectedElement,
    undoStack,
    setUndoStack,
    redoStack,
    setRedoStack,

    // Placement states
    placementMode,
    setPlacementMode,
    pendingSticker,
    setPendingSticker,
    pendingShape,
    setPendingShape,
    pendingText,
    setPendingText,

    // Dialog states
    openLayoutDialog,
    setOpenLayoutDialog,
    openTextDialog,
    setOpenTextDialog,
    openDrawDialog,
    setOpenDrawDialog,
    openShapesDialog,
    setOpenShapesDialog,
    openStickersDialog,
    setOpenStickersDialog,
    openBrushDialog,
    setOpenBrushDialog,

    // Methods
    handleOpenDialog,
    addDrawingElement,
    removeDrawingElement,
    handleUndo,
    handleRedo,
    selectShape,
    selectSticker,
    selectText,
  }
}
