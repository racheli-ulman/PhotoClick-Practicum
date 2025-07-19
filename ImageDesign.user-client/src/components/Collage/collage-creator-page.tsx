"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Chip,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Paper,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import DownloadIcon from "@mui/icons-material/Download"
import albumStore from "../../stores/albumStore"
import html2canvas from "html2canvas"
import { CollageOptionsHeader } from "./collage-options-header"
import { CollageCanvas } from "./collage-canvas"
import { CollageDialogs } from "./collage-dialogs"
import { CollageToolbar } from "./collage-toolbar"
import { useCollageState } from "./use-collage-state"

const CollageCreatorPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Get selected photo IDs from navigation state
  const selectedPhotoIds: number[] = location.state?.selectedPhotoIds || []

  const [photos, setPhotos] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [notification, setNotification] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })
  const [processing, setProcessing] = useState<boolean>(false)

  const canvasRef = useRef<HTMLDivElement>(null)
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null)
  const preloadedPhotosRef = useRef<any[]>([])

  // Use custom hook for collage state management
  const collageState = useCollageState()

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
        const selectedPhotos = albumStore.photos.filter((photo: any) => selectedPhotoIds.includes(photo.id))

        if (selectedPhotos.length > 0) {
          console.log("Selected photos loaded:", selectedPhotos.length)
          setPhotos(selectedPhotos)
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

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false })
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
        backgroundColor: collageState.backgroundColor,
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
      setNotification({
        open: true,
        message: "אירעה שגיאה בעת יצירת הקולאז׳. נסה שנית.",
        severity: "error",
      })
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
        backgroundColor: collageState.backgroundColor,
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
  }, [collageState.layout, photos])

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
        marginTop:"40px",
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

      {/* Collage Options Header */}
      <CollageOptionsHeader collageState={collageState} setNotification={setNotification} />

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Drawing Tools */}
        <CollageToolbar collageState={collageState} />

        {/* Collage Canvas */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: collageState.backgroundColor,
            minHeight: "70vh",
            position: "relative",
            borderRadius: 4,
            background: `${collageState.backgroundColor}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            border: "3px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <CollageCanvas
            ref={canvasRef}
            photos={photos}
            collageState={collageState}
            drawingCanvasRef={drawingCanvasRef}
          />
        </Paper>
      </Container>

      {/* Dialogs */}
      <CollageDialogs collageState={collageState} />

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
