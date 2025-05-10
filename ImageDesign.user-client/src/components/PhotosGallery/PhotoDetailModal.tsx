"use client"

import type React from "react"
import { useState } from "react"
import { Box, IconButton, Modal, Typography, Paper, Fade, Backdrop, Tooltip, Slider, Divider } from "@mui/material"
import {
  Close,
  ZoomIn,
  ZoomOut,
  NavigateBefore,
  NavigateNext,
  Download,
  Share,
  Info,
  Fullscreen,
  FullscreenExit,
} from "@mui/icons-material"
import { motion } from "framer-motion"
import photoUploadStore from "../../stores/photoUploaderStore"

interface Photo {
  photoPath: string
  photoName: string
}

interface PhotoDetailModalProps {
  open: boolean
  photo: Photo
  zoomLevel: number
  onClose: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onNext: () => void
  onPrev: () => void
}

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  open,
  photo,
  zoomLevel,
  onClose,
  onZoomIn,
  onZoomOut,
  onNext,
  onPrev,
}) => {
  const [showInfo, setShowInfo] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleDownload = async () => {
    try {
      const downloadUrl = await photoUploadStore.getDownloadUrl(photo.photoName)
      if (downloadUrl) {
        const response = await fetch(downloadUrl)
        const blob = await response.blob()
        const link = document.createElement("a")
        link.href = window.URL.createObjectURL(blob)
        link.download = photo.photoName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
      }
    } catch (error) {
      console.error("שגיאה בהורדת התמונה:", error)
      alert("שגיאה בהורדת התמונה")
    }
  }
  const handleShare = () => {
    const shareData = {
        title: photo.photoName,
        text: `בדוק את התמונה הזו: ${photo.photoName}`,
        url: photo.photoPath,
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('תמונה שותפה בהצלחה'))
            .catch((error) => console.error('שגיאה בשיתוף התמונה:', error));
    } else {
        // אם אפשרות השיתוף לא זמינה, העתק את ה-URL ללוח
        navigator.clipboard.writeText(photo.photoPath)
            .then(() => alert('הקישור הועתק ללוח'))
            .catch((error) => console.error('שגיאה בהעתקת הקישור:', error));
    }
};

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`)
        })
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
            setIsFullscreen(false)
          })
          .catch((err) => {
            console.error(`Error attempting to exit fullscreen: ${err.message}`)
          })
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Controls */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 1000,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {photo.photoName}
              </Typography>
            </Box>

            <Box>
              <IconButton
                onClick={onClose}
                sx={{
                  color: "white",
                  bgcolor: "rgba(0,0,0,0.3)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.5)",
                  },
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </Box>

          {/* Left Navigation */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={onPrev}
              sx={{
                color: "white",
                bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.5)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <NavigateBefore />
            </IconButton>
          </Box>

          {/* Right Navigation */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              zIndex: 1000,
            }}
          >
            <IconButton
              onClick={onNext}
              sx={{
                color: "white",
                bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.5)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>

          {/* Main Image */}
          <motion.img
            src={photo.photoPath}
            alt={photo.photoName}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: "90vw",
              maxHeight: "80vh",
              objectFit: "contain",
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.3s ease",
            }}
          />

          {/* Bottom Controls */}
          <Paper
            sx={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 8,
              bgcolor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
              gap: 2,
            }}
          >
            <Tooltip title="הקטנה">
              <IconButton onClick={onZoomOut} sx={{ color: "white" }} size="small">
                <ZoomOut />
              </IconButton>
            </Tooltip>

            <Slider
              value={(zoomLevel * 100) / 3}
              min={33}
              max={100}
              sx={{
                width: 100,
                color: "white",
                "& .MuiSlider-thumb": {
                  width: 12,
                  height: 12,
                },
              }}
              onChange={(_, newValue) => {
                const newZoom = ((newValue as number) * 3) / 100
                if (newZoom > zoomLevel) {
                  onZoomIn()
                } else {
                  onZoomOut()
                }
              }}
            />

            <Tooltip title="הגדלה">
              <IconButton onClick={onZoomIn} sx={{ color: "white" }} size="small">
                <ZoomIn />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

            <Tooltip title="הורדה">
              <IconButton onClick={handleDownload} sx={{ color: "white" }} size="small">
                <Download />
              </IconButton>
            </Tooltip>

            <Tooltip title="שיתוף">
            <IconButton onClick={handleShare} sx={{ color: "white" }} size="small">
            <Share />
              </IconButton>
            </Tooltip>

            <Tooltip title="פרטי תמונה">
              <IconButton onClick={() => setShowInfo(!showInfo)} sx={{ color: "white" }} size="small">
                <Info />
              </IconButton>
            </Tooltip>

            <Tooltip title={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"}>
              <IconButton onClick={toggleFullscreen} sx={{ color: "white" }} size="small">
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Paper>

          {/* Info Panel */}
          {showInfo && (
            <Paper
              sx={{
                position: "absolute",
                bottom: 80,
                right: 16,
                zIndex: 1000,
                padding: 2,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                color: "white",
                maxWidth: 300,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                פרטי תמונה
              </Typography>
              <Typography variant="body2">
                <strong>שם:</strong> {photo.photoName}
              </Typography>
              <Typography variant="body2">
                <strong>גודל:</strong> 1920x1080
              </Typography>
              <Typography variant="body2">
                <strong>תאריך העלאה:</strong> 01/01/2023
              </Typography>
            </Paper>
          )}
        </Box>
      </Fade>
    </Modal>
  )
}

export default PhotoDetailModal
