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
  Paper,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Alert,
  Snackbar,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material"
import { CloudUpload, Delete, Home, Folder, ArrowBack, Image, Label, Add } from "@mui/icons-material"
import photoUploadStore from "../stores/photoUploaderStore"
import userStore from "../stores/userStore"
import albumStore from "../stores/albumStore"
import tagStore from "../stores/tag" // Import tagStore
import { motion } from "framer-motion"

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
    console.log(fileNames);
    
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
      
      // בדיקה אם העכבר יצא מהאזור (ולא רק נכנס לאלמנט ילד)
      if (e.currentTarget === dropArea && !dropArea.contains(e.relatedTarget as Node)) {
        setIsDragging(false)
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      
      if (e.dataTransfer?.files) {
        const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
          file.type.startsWith('image/')
        )
        
        if (droppedFiles.length > 0) {
          handleFiles(droppedFiles)
        }
      }
    }

    // הוספת מאזינים לאירועים
    dropArea.addEventListener('dragover', handleDragOver)
    dropArea.addEventListener('dragenter', handleDragEnter)
    dropArea.addEventListener('dragleave', handleDragLeave)
    dropArea.addEventListener('drop', handleDrop)

    // ניקוי המאזינים בעת פירוק הקומפוננטה
    return () => {
      dropArea.removeEventListener('dragover', handleDragOver)
      dropArea.removeEventListener('dragenter', handleDragEnter)
      dropArea.removeEventListener('dragleave', handleDragLeave)
      dropArea.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleFiles = (selectedFiles: File[]) => {
    // תומך רק בתמונות
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      showNotification("נא לבחור רק קבצי תמונה", "error")
      return
    }

    const newFiles = imageFiles.map(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
      return file
    })

    setFiles(prev => [...prev, ...newFiles])
    setFileNames(prev => {
      const newNames = newFiles.map(file => file.name).join(", ")
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

  // Handle new tag dialog open/close
  const handleCloseTagDialog = () => {
    setOpenTagDialog(false)
    setNewTagName("")
  }

  // Handle new tag creation
  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      showNotification("שם התגית לא יכול להיות ריק", "error")
      return
    }

    setTagCreationLoading(true)

    try {
      const newTag = await tagStore.addTag(newTagName.trim())
      
      if (newTag) {
        // Refresh tags list
        await photoUploadStore.fetchTags()
        
        // Select the newly created tag
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

      // Short delay before redirecting
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
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
    
    // עדכון שמות הקבצים
    const updatedFiles = files.filter((_, i) => i !== index)
    setFileNames(updatedFiles.map(file => file.name).join(", "))
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pt: { xs: 1, sm: 2 },
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* ראש העמוד - כותרת וניווט */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          sx={{ mb: 2 }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <MuiLink underline="hover" color="inherit" href="/" sx={{ display: "flex", alignItems: "center" }}>
              <Home sx={{ mr: 0.5 }} fontSize="small" />
              ראשי
            </MuiLink>
            <MuiLink
              underline="hover"
              color="inherit"
              href="/personal-area/userAlbums"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Folder sx={{ mr: 0.5 }} fontSize="small" />
              האלבומים שלי
            </MuiLink>
            <Typography color="text.primary" sx={{ display: "flex", alignItems: "center" }}>
              <Image sx={{ mr: 0.5 }} fontSize="small" />
              העלאת תמונה
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              העלאת תמונה חדשה
            </Typography>

            <Button 
              variant="outlined" 
              startIcon={<ArrowBack />} 
              onClick={() => navigate("/personal-area/userAlbums")}
              size="small"
            >
              חזרה לאלבומים
            </Button>
          </Box>
        </Box>

        {/* הטופס המקוצר */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          elevation={2}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            maxHeight: "calc(100vh - 200px)"
          }}
        >
          <Grid container>
            {/* חלק ימני - הגדרות ופרטים */}
            <Grid item xs={12} md={4} sx={{ 
              borderLeft: { md: '1px solid rgba(0, 0, 0, 0.12)' }, 
              p: 2.5,
              bgcolor: "rgba(0, 0, 0, 0.02)"
            }}>
              <Stack spacing={2.5}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 0 }}>
                  פרטי התמונה
                </Typography>

                <FormControl fullWidth size="small">
                  <InputLabel id="album-select-label">בחר אלבום יעד</InputLabel>
                  <Select
                    labelId="album-select-label"
                    id="album-select"
                    value={selectedAlbum || ""}
                    label="בחר אלבום יעד"
                    onChange={handleAlbumChange}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    {albumStore.albums.map((album) => (
                      <MenuItem
                        key={album.id}
                        value={album.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Folder fontSize="small" color="action" />
                        {album.albumName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel id="tag-select-label">בחר תגית</InputLabel>
                  <Select
                    labelId="tag-select-label"
                    id="tag-select"
                    value={selectedTagId || ""}
                    label="בחר תגית"
                    onChange={handleTagChange}
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    {photoUploadStore.tag.map((tag) => (
                      <MenuItem
                        key={tag.id}
                        value={tag.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Label fontSize="small" color="action" />
                        {tag.tagName}
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem 
                      value="add_new_tag"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "primary.main",
                        fontWeight: "medium",
                      }}
                    >
                      <Add fontSize="small" color="primary" />
                      הוסף תגית חדשה
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CloudUpload />}
                  onClick={handleUpload}
                  disabled={files.length === 0 || !selectedAlbum || !selectedTagId || loading}
                  sx={{ 
                    py: 1,
                    mt: 1
                  }}
                >
                  {loading ? "מעלה תמונה..." : "העלאת תמונה"}
                </Button>

                {photoUploadStore.progress > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        מעלה תמונה...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {`${photoUploadStore.progress}%`}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={photoUploadStore.progress}
                      sx={{
                        height: 4,
                        borderRadius: 3,
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Grid>
            
            {/* חלק שמאלי - אזור הגרירה והתצוגה המקדימה */}
            <Grid item xs={12} md={8} sx={{ p: 2.5 }}>
              <Typography 
                variant="subtitle1" 
                gutterBottom 
                sx={{ 
                  mb: 2, 
                  fontWeight: 500, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1 
                }}
              >
                <Image fontSize="small" color="primary" />
                בחר תמונות להעלאה
              </Typography>

              <Box
                ref={dropAreaRef}
                sx={{
                  border: "1px dashed",
                  borderColor: isDragging ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  p: 2,
                  textAlign: "center",
                  bgcolor: isDragging ? 'rgba(25, 118, 210, 0.04)' : 'background.default',
                  height: { xs: '180px', md: '220px' },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <input accept="image/*" type="file" hidden id="upload-file" multiple onChange={handleFileChange} />

                {files.length > 0 ? (
                  <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: 'auto' }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 1,
                      }}
                    >
                      <IconButton
                        onClick={handleRemoveFile}
                        color="error"
                        size="small"
                        sx={{
                          bgcolor: "rgba(255,255,255,0.8)",
                          m: 1,
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ 
                      display: "flex", 
                      flexWrap: "wrap", 
                      gap: 2, 
                      padding: 1, 
                      justifyContent: "center",
                      alignItems: "flex-start", 
                      height: "100%",
                      overflow: "auto",
                      pt: 4, // מקום לכפתור מחיקה
                    }}>
                      {previewImages.map((image, index) => (
                        <Box 
                          key={index} 
                          sx={{ 
                            position: 'relative',
                            width: { xs: '80px', sm: '100px' },
                            height: { xs: '80px', sm: '100px' },
                            borderRadius: 1,
                            overflow: 'hidden',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                          }}
                        >
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveSingleFile(index)}
                            sx={{
                              position: 'absolute',
                              top: 2,
                              right: 2,
                              bgcolor: 'rgba(255,255,255,0.8)',
                              width: 20,
                              height: 20,
                              '& .MuiSvgIcon-root': {
                                fontSize: 14
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          <img
                            src={image}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                    {files.length > 0 && (
                      <Typography
                        variant="caption"
                        sx={{
                          textAlign: "center",
                          color: "text.secondary",
                          display: "block",
                          mt: 1,
                        }}
                      >
                        {`נבחרו ${files.length} קבצים`}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <label htmlFor="upload-file" style={{ width: "100%", height: "100%", cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <CloudUpload 
                        sx={{ 
                          fontSize: 40, 
                          color: isDragging ? "primary.main" : "text.secondary", 
                          mb: 1.5,
                          animation: isDragging ? 'pulse 1.5s infinite' : 'none',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.1)' },
                            '100%': { transform: 'scale(1)' },
                          }
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        color={isDragging ? "primary.main" : "text.secondary"} 
                        gutterBottom
                        sx={{ fontWeight: isDragging ? 'bold' : 'regular' }}
                      >
                        {isDragging ? 'שחרר את העכבר כדי להעלות' : 'גרור תמונות לכאן'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        או
                      </Typography>
                      <Button variant="outlined" component="span" size="small" sx={{ mt: 1 }}>
                        בחר תמונות מהמחשב
                      </Button>
                    </Box>
                  </label>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                תומך בפורמטים: JPG, PNG, GIF • גודל מקסימלי: 10MB
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* New Tag Dialog */}
      <Dialog open={openTagDialog} onClose={handleCloseTagDialog} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Label fontSize="small" />
            הוספת תגית חדשה
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="שם התגית"
            type="text"
            fullWidth
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseTagDialog} color="inherit">
            ביטול
          </Button>
          <Button 
            onClick={handleCreateTag} 
            variant="contained" 
            color="primary"
            disabled={!newTagName.trim() || tagCreationLoading}
          >
            {tagCreationLoading ? "יוצר תגית..." : "צור תגית"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
        TransitionComponent={Fade}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification({ ...notification, show: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
})

export default FileUploader