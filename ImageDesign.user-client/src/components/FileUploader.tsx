"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react-lite"
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Grid,
  Container,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Alert,
  Snackbar,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
  Card,
  CardContent,
} from "@mui/material"
import {
  CloudUpload,
  Delete,
  Image,
  Label,
  Add,
  Folder,
  CheckCircle,
  PhotoLibrary,
  ArrowBack,
} from "@mui/icons-material"
import photoUploadStore from "../stores/photoUploaderStore"
import userStore from "../stores/userStore"
import albumStore from "../stores/albumStore"
import tagStore from "../stores/tag"
import { motion, AnimatePresence } from "framer-motion"

const FileUploader = observer(() => {
  const navigate = useNavigate()
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null)
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string>("")
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dropAreaRef = useRef<HTMLDivElement>(null)

  // New tag creation states
  const [openTagDialog, setOpenTagDialog] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [tagCreationLoading, setTagCreationLoading] = useState(false)

  useEffect(() => {
    console.log(fileNames)

    const userId = userStore.user?.user?.id ?? null
    if (userId) {
      albumStore.fetchAlbums(userId)
      photoUploadStore.fetchTags()
    }
  }, [])

  // הגדרת מאזיני אירועי גרירה
  useEffect(() => {
    const dropArea = dropAreaRef.current
    if (!dropArea) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.currentTarget === dropArea && !dropArea.contains(e.relatedTarget as Node)) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer?.files) {
        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

        if (droppedFiles.length > 0) {
          handleFiles(droppedFiles)
        }
      }
    }

    dropArea.addEventListener("dragover", handleDragOver)
    dropArea.addEventListener("dragenter", handleDragEnter)
    dropArea.addEventListener("dragleave", handleDragLeave)
    dropArea.addEventListener("drop", handleDrop)

    return () => {
      dropArea.removeEventListener("dragover", handleDragOver)
      dropArea.removeEventListener("dragenter", handleDragEnter)
      dropArea.removeEventListener("dragleave", handleDragLeave)
      dropArea.removeEventListener("drop", handleDrop)
    }
  }, [])

  const handleFiles = (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      showNotification("נא לבחור רק קבצי תמונה", "error")
      return
    }

    const newFiles = imageFiles.map((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
      return file
    })

    setFiles((prev) => [...prev, ...newFiles])
    setFileNames((prev) => {
      const newNames = newFiles.map((file) => file.name).join(", ")
      return prev ? `${prev}, ${newNames}` : newNames
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleAlbumChange = (event: SelectChangeEvent<number>) => {
    setSelectedAlbum(event.target.value as number)
  }

  const handleTagChange = (event: SelectChangeEvent<number | string>) => {
    const value = event.target.value
    if (value === "add_new_tag") {
      setOpenTagDialog(true)
    } else {
      setSelectedTagId(value as number)
    }
  }

  const handleCloseTagDialog = () => {
    setOpenTagDialog(false)
    setNewTagName("")
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      showNotification("שם התגית לא יכול להיות ריק", "error")
      return
    }

    setTagCreationLoading(true)

    try {
      const newTag = await tagStore.addTag(newTagName.trim())

      if (newTag) {
        await photoUploadStore.fetchTags()

        if (typeof newTag.id === "number") {
          setSelectedTagId(newTag.id)
        }

        showNotification("התגית נוצרה בהצלחה!", "success")
        handleCloseTagDialog()
      } else {
        showNotification("שגיאה ביצירת התגית", "error")
      }
    } catch (error: any) {
      showNotification(error.message || "שגיאה ביצירת התגית", "error")
    } finally {
      setTagCreationLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedTagId) {
      showNotification("אנא בחר תגית לפני העלאת התמונות", "error")
      return
    }

    if (!selectedAlbum) {
      showNotification("אנא בחר אלבום לפני העלאת התמונות", "error")
      return
    }

    if (files.length === 0) {
      showNotification("אנא בחר קבצים להעלאה", "error")
      return
    }

    setLoading(true)

    try {
      for (const file of files) {
        await photoUploadStore.uploadFile(file, selectedAlbum, selectedTagId)
        if (photoUploadStore.error) {
          showNotification(photoUploadStore.error, "error")
          return
        }
      }
      showNotification("הקבצים הועלו בהצלחה!", "success")

      setTimeout(() => {
        navigate(`/personal-area/get-photos/${selectedAlbum}`)
      }, 2000)
    } catch (error: any) {
      showNotification(error.message || "שגיאה בהעלאת הקבצים", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    setFiles([])
    setPreviewImages([])
    setFileNames("")
  }

  const handleRemoveSingleFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))

    const updatedFiles = files.filter((_, i) => i !== index)
    setFileNames(updatedFiles.map((file) => file.name).join(", "))
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  const selectedAlbumName = albumStore.albums.find((album) => album.id === selectedAlbum)?.albumName
  const selectedTagName = photoUploadStore.tag.find((tag) => tag.id === selectedTagId)?.tagName

  return (
    <Box
      sx={{
        background:
          "linear-gradient(135deg, rgba(234, 102, 203, 0.03) 0%, rgba(189, 132, 246, 0.03) 25%, rgba(240, 147, 251, 0.03) 50%, rgba(0, 212, 255, 0.03) 100%)",
        minHeight: "100vh",
        pt: 3,
        pb: 4,
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
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
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
                העלאת תמונות
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "400" }}>
                העלה תמונות חדשות לאלבומים שלך בקלות ובמהירות
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/personal-area/userAlbums")}
              sx={{
                borderRadius: 3,
                background: "white",
                color: "#6b7280",
                fontWeight: "600",
                px: 3,
                py: 1.5,
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(234, 102, 203, 0.25)",
                },
              }}
            >
              חזרה לאלבומים
            </Button>
          </Box>

          {/* סטטוס בר */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Chip
              icon={<Folder fontSize="small" />}
              label={selectedAlbumName || "לא נבחר אלבום"}
              variant={selectedAlbum ? "filled" : "outlined"}
              sx={{
                background: selectedAlbum
                  ? "linear-gradient(45deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1))"
                  : "transparent",
                border: selectedAlbum ? "1px solid rgba(234, 102, 203, 0.3)" : "1px solid #e2e8f0",
                color: selectedAlbum ? "rgb(234, 102, 203)" : "#64748b",
                fontWeight: "500",
              }}
            />
            <Chip
              icon={<Label fontSize="small" />}
              label={selectedTagName || "לא נבחרה תגית"}
              variant={selectedTagId ? "filled" : "outlined"}
              sx={{
                background: selectedTagId
                  ? "linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(0, 212, 255, 0.1))"
                  : "transparent",
                border: selectedTagId ? "1px solid rgba(240, 147, 251, 0.3)" : "1px solid #e2e8f0",
                color: selectedTagId ? "#f093fb" : "#64748b",
                fontWeight: "500",
              }}
            />
            <Chip
              icon={<PhotoLibrary fontSize="small" />}
              label={`${files.length} תמונות`}
              variant={files.length > 0 ? "filled" : "outlined"}
              sx={{
                background:
                  files.length > 0
                    ? "linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(234, 102, 203, 0.1))"
                    : "transparent",
                border: files.length > 0 ? "1px solid rgba(0, 212, 255, 0.3)" : "1px solid #e2e8f0",
                color: files.length > 0 ? "#00d4ff" : "#64748b",
                fontWeight: "500",
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* אזור העלאת תמונות */}
          <Grid item xs={12} lg={8}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#1f2937",
                  }}
                >
                  <Image sx={{ color: "rgb(234, 102, 203)" }} />
                  בחירת תמונות
                </Typography>

                <Box
                  ref={dropAreaRef}
                  sx={{
                    border: "2px dashed",
                    borderColor: isDragging ? "rgb(234, 102, 203)" : "#e2e8f0",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    background: isDragging
                      ? "linear-gradient(135deg, rgba(234, 102, 203, 0.05), rgba(189, 132, 246, 0.05))"
                      : "rgba(248, 250, 252, 0.5)",
                    minHeight: "220px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      borderColor: "rgba(234, 102, 203, 0.5)",
                      background: "linear-gradient(135deg, rgba(234, 102, 203, 0.02), rgba(189, 132, 246, 0.02))",
                    },
                  }}
                >
                  <input accept="image/*" type="file" hidden id="upload-file" multiple onChange={handleFileChange} />

                  {files.length > 0 ? (
                    <Box sx={{ width: "100%", height: "100%" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="600" color="text.primary">
                          תמונות שנבחרו ({files.length})
                        </Typography>
                        <IconButton
                          onClick={handleRemoveFile}
                          sx={{
                            bgcolor: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                            "&:hover": {
                              bgcolor: "rgba(239, 68, 68, 0.2)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                          gap: 2,
                          maxHeight: "200px",
                          overflowY: "auto",
                          pr: 1,
                        }}
                      >
                        <AnimatePresence>
                          {previewImages.map((image, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Box
                                sx={{
                                  position: "relative",
                                  width: "100%",
                                  height: "120px",
                                  borderRadius: 2,
                                  overflow: "hidden",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                  border: "2px solid rgba(255, 255, 255, 0.8)",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                                  },
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveSingleFile(index)}
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "rgba(255, 255, 255, 0.9)",
                                    color: "#ef4444",
                                    width: 24,
                                    height: 24,
                                    zIndex: 1,
                                    "&:hover": {
                                      bgcolor: "white",
                                      transform: "scale(1.1)",
                                    },
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt="Preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </Box>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </Box>
                    </Box>
                  ) : (
                    <label htmlFor="upload-file" style={{ width: "100%", cursor: "pointer" }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          py: 2,
                        }}
                      >
                        <CloudUpload
                          sx={{
                            fontSize: 48,
                            color: isDragging ? "rgb(234, 102, 203)" : "#94a3b8",
                            mb: 2,
                            animation: isDragging ? "pulse 1.5s infinite" : "none",
                          }}
                        />
                        <Typography
                          variant="h6"
                          color={isDragging ? "rgb(234, 102, 203)" : "text.secondary"}
                          gutterBottom
                          sx={{ fontWeight: "600" }}
                        >
                          {isDragging ? "שחרר כדי להעלות" : "גרור תמונות לכאן"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          או לחץ לבחירת קבצים מהמחשב
                        </Typography>
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1,
                            border: "2px solid rgba(234, 102, 203, 0.3)",
                            color: "rgb(234, 102, 203)",
                            fontWeight: "600",
                            "&:hover": {
                              background: "rgba(234, 102, 203, 0.05)",
                              borderColor: "rgb(234, 102, 203)",
                            },
                          }}
                        >
                          בחר תמונות
                        </Button>
                      </Box>
                    </label>
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 2,
                    display: "block",
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  תומך בפורמטים: JPG, PNG, GIF • גודל מקסימלי: 10MB לקובץ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* פאנל הגדרות */}
          <Grid item xs={12} lg={4}>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              sx={{
                borderRadius: 4,
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(20px)",
                height: "fit-content",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  הגדרות העלאה
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        color: "#6b7280",
                        "&.Mui-focused": {
                          color: "rgb(234, 102, 203)",
                        },
                      }}
                    >
                      בחר אלבום יעד
                    </InputLabel>
                    <Select
                      value={selectedAlbum || ""}
                      label="בחר אלבום יעד"
                      onChange={handleAlbumChange}
                      sx={{
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(234, 102, 203, 0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgb(234, 102, 203)",
                        },
                      }}
                    >
                      {albumStore.albums.map((album) => (
                        <MenuItem key={album.id} value={album.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Folder fontSize="small" sx={{ color: "rgb(189, 132, 246)" }} />
                            {album.albumName}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel
                      sx={{
                        color: "#6b7280",
                        "&.Mui-focused": {
                          color: "#f093fb",
                        },
                      }}
                    >
                      בחר תגית
                    </InputLabel>
                    <Select
                      value={selectedTagId || ""}
                      label="בחר תגית"
                      onChange={handleTagChange}
                      sx={{
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#e2e8f0",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(240, 147, 251, 0.5)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f093fb",
                        },
                      }}
                    >
                      {photoUploadStore.tag.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Label fontSize="small" sx={{ color: "#f093fb" }} />
                            {tag.tagName}
                          </Box>
                        </MenuItem>
                      ))}
                      <MenuItem
                        value="add_new_tag"
                        sx={{
                          color: "#00d4ff",
                          fontWeight: "600",
                          borderTop: "1px solid #e2e8f0",
                          mt: 1,
                          pt: 1,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Add fontSize="small" sx={{ color: "#00d4ff" }} />
                          הוסף תגית חדשה
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {photoUploadStore.progress > 0 && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight="500">
                          מעלה תמונות...
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight="600">
                          {`${photoUploadStore.progress}%`}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={photoUploadStore.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(234, 102, 203, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(45deg, rgb(234, 102, 203), #f093fb)",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={loading ? <CloudUpload /> : <CheckCircle />}
                    onClick={handleUpload}
                    disabled={files.length === 0 || !selectedAlbum || !selectedTagId || loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                      backgroundSize: "300% 300%",
                      animation: loading ? "shimmer 2s ease-in-out infinite" : "none",
                      fontWeight: "700",
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 8px 25px rgba(234, 102, 203, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(234, 102, 203, 0.5)",
                      },
                      "&:disabled": {
                        background: "#e2e8f0",
                        color: "#94a3b8",
                        boxShadow: "none",
                      },
                    }}
                  >
                    {loading ? "מעלה תמונות..." : "העלה תמונות"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* דיאלוג יצירת תגית */}
      <Dialog
        open={openTagDialog}
        onClose={handleCloseTagDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(45deg, rgba(234, 102, 203, 0.1), rgba(240, 147, 251, 0.1))",
            color: "#1f2937",
            fontWeight: "600",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Label sx={{ color: "#f093fb" }} />
            הוספת תגית חדשה
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="שם התגית"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f093fb",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#f093fb",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCloseTagDialog}
            sx={{
              color: "#6b7280",
              fontWeight: "600",
            }}
          >
            ביטול
          </Button>
          <Button
            onClick={handleCreateTag}
            variant="contained"
            disabled={!newTagName.trim() || tagCreationLoading}
            sx={{
              background: "linear-gradient(45deg, #f093fb, #00d4ff)",
              fontWeight: "600",
              borderRadius: 2,
              px: 3,
              "&:hover": {
                background: "linear-gradient(45deg, #e084f0, #00c4e6)",
              },
            }}
          >
            {tagCreationLoading ? "יוצר..." : "צור תגית"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* הודעות */}
      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification({ ...notification, show: false })}
          sx={{
            background:
              notification.type === "success"
                ? "linear-gradient(45deg, #10b981, #34d399)"
                : "linear-gradient(45deg, #ef4444, #f87171)",
            fontWeight: "600",
            borderRadius: 2,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
})

export default FileUploader
