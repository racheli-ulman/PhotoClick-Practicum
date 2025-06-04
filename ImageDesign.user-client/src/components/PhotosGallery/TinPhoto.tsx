"use client"

import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogContent,
  Container,
  Grid,
  Chip,
  Alert,
} from "@mui/material"
import { Restore, DeleteForever, ZoomIn, Delete, PhotoLibrary } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import photoUploadStore from "../../stores/photoUploaderStore"

const TinPhoto: React.FC = observer(() => {
  const userData = sessionStorage.getItem("user")
  const user = userData ? JSON.parse(userData) : null
  const userId = user ? user.user.id : null

  // State for zoom modal
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      photoUploadStore.fetchRecyclingPhotos(userId)
    }
  }, [userId])

  // Handle permanent delete function
  const handlePermanentDelete = async (photoId: number) => {
    console.log(photoId)

    if (window.confirm("האם אתה בטוח שברצונך למחוק לצמיתות את התמונה?")) {
      await photoUploadStore.deletePhoto(photoId)

      // עדכון הסטייט כדי להסיר את התמונה שנמחקה
      photoUploadStore.recyclingPhotos = photoUploadStore.recyclingPhotos.filter((photo) => photo.id !== photoId)
    }
  }

  // Handle restore photo
  const handleRestorePhoto = async (photoId: number) => {
    await photoUploadStore.restorePhoto(photoId)
  }

  // Handle image zoom
  const handleImageClick = (photoPath: string) => {
    setSelectedPhoto(photoPath)
  }

  // Close the zoom modal
  const closeModal = () => {
    setSelectedPhoto(null)
  }

  if (photoUploadStore.error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#dc2626",
          }}
        >
          <Typography variant="h6" gutterBottom>
            שגיאה
          </Typography>
          <Typography>{photoUploadStore.error}</Typography>
        </Alert>
      </Container>
    )
  }

  const deletedPhotos = photoUploadStore.recyclingPhotos

  if (deletedPhotos.length === 0) {
    return (
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(234, 102, 203, 0.02), rgba(189, 132, 246, 0.02), rgba(240, 147, 251, 0.02), rgba(0, 212, 255, 0.02))",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Delete sx={{ fontSize: 48, color: "rgb(234, 102, 203)" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "700",
                background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              סל המחזור ריק
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
              לא נמצאו תמונות בסל המחזור. תמונות שנמחקות נשמרות כאן למשך 30 יום לפני מחיקה סופית.
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(234, 102, 203, 0.02), rgba(189, 132, 246, 0.02), rgba(240, 147, 251, 0.02), rgba(0, 212, 255, 0.02))",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `}
      </style>

      <Container maxWidth="lg">
        {/* כותרת העמוד */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                סל המחזור
              </Typography>
              <Typography variant="body1" color="text.secondary">
                תמונות נשמרות בסל המחזור למשך 30 יום לפני מחיקה סופית
              </Typography>
            </Box>

            <Chip
              icon={<PhotoLibrary />}
              label={`${deletedPhotos.length} תמונות`}
              sx={{
                background: "linear-gradient(45deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1))",
                border: "1px solid rgba(234, 102, 203, 0.3)",
                color: "rgb(234, 102, 203)",
                fontWeight: "600",
                px: 2,
                py: 1,
              }}
            />
          </Box>
        </Box>

        {/* רשת התמונות */}
        <Grid container spacing={3}>
          <AnimatePresence>
            {deletedPhotos.map((photo, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={`${photo.id}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 40px rgba(234, 102, 203, 0.15)",
                        "& .photo-overlay": {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={photo.photoPath || "/placeholder.svg"}
                        alt={photo.photoName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        onClick={() => photo.photoPath && handleImageClick(photo.photoPath)}
                      />
                      <Box
                        className="photo-overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0, 0, 0, 0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        <IconButton
                          sx={{
                            background: "rgba(255, 255, 255, 0.9)",
                            color: "rgb(234, 102, 203)",
                            "&:hover": {
                              background: "white",
                              transform: "scale(1.1)",
                            },
                          }}
                          onClick={() => photo.photoPath && handleImageClick(photo.photoPath)}
                        >
                          <ZoomIn />
                        </IconButton>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          fontWeight: "600",
                          color: "#1e293b",
                          mb: 2,
                        }}
                      >
                        {photo.photoName}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Restore />}
                          onClick={() => handleRestorePhoto(photo.id!)}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            border: "1px solid rgba(34, 197, 94, 0.3)",
                            color: "#22c55e",
                            fontSize: "0.75rem",
                            py: 0.5,
                            "&:hover": {
                              background: "rgba(34, 197, 94, 0.1)",
                              borderColor: "#22c55e",
                            },
                          }}
                        >
                          שחזור
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DeleteForever />}
                          onClick={() => handlePermanentDelete(photo.id!)}
                          sx={{
                            flex: 1,
                            borderRadius: 2,
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            fontSize: "0.75rem",
                            py: 0.5,
                            "&:hover": {
                              background: "rgba(239, 68, 68, 0.1)",
                              borderColor: "#ef4444",
                            },
                          }}
                        >
                          מחיקה
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>

        {/* מודל זום תמונה */}
        <Dialog
          open={!!selectedPhoto}
          onClose={closeModal}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
            }}
          >
            {selectedPhoto && (
              <img
                src={selectedPhoto || "/placeholder.svg"}
                alt="Zoomed photo"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
            <IconButton
              onClick={closeModal}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255, 255, 255, 0.1)",
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              ×
            </IconButton>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  )
})

export default TinPhoto
