"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
} from "@mui/material"
import { CloudUpload, Delete, Home, Folder, ArrowBack, Image, Label } from "@mui/icons-material"
import photoUploadStore from "../stores/photoUploaderStore"
import userStore from "../stores/userStore"
import albumStore from "../stores/albumStore"
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

  useEffect(() => {
    const userId = userStore.user?.user?.id ?? null
    if (userId) {
      albumStore.fetchAlbums(userId)
      photoUploadStore.fetchTags()
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const newFiles = selectedFiles.map(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
        return file
      })

      setFiles(newFiles)
      setFileNames(newFiles.map(file => file.name).join(", "))
    }
  }

  const handleAlbumChange = (event: SelectChangeEvent<number>) => {
    setSelectedAlbum(event.target.value as number)
  }

  const handleTagChange = (event: SelectChangeEvent<number>) => {
    setSelectedTagId(event.target.value as number)
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
        pt: 10,
        pb: 8,
      }}
    >
      <Container maxWidth="md">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ mb: 4 }}
        >
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
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

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
              }}
            >
              העלאת תמונה חדשה
            </Typography>

            <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/personal-area/userAlbums")}>
              חזרה לאלבומים
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                בחר תמונה להעלאה
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  bgcolor: "background.default",
                  mb: 3,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <input accept="image/*" type="file" hidden id="upload-file" multiple onChange={handleFileChange} />

                {files.length > 0 ? (
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
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
                        sx={{
                          bgcolor: "rgba(255,255,255,0.8)",
                          "&:hover": {
                            bgcolor: "white",
                          },
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                      {previewImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt="Preview"
                          style={{
                            maxWidth: "100%",
                            maxHeight: 200,
                            objectFit: "contain",
                            borderRadius: 8,
                            marginBottom: 10,
                          }}
                        />
                      ))}
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 2,
                          textAlign: "center",
                          wordBreak: "break-word",
                        }}
                      >
                        {fileNames}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <label htmlFor="upload-file" style={{ width: "100%", cursor: "pointer" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 4,
                      }}
                    >
                      <CloudUpload sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        גרור תמונה לכאן
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        או
                      </Typography>
                      <Button variant="outlined" component="span" sx={{ mt: 2 }}>
                        בחר תמונה מהמחשב
                      </Button>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                        תומך בפורמטים: JPG, PNG, GIF
                      </Typography>
                    </Box>
                  </label>
                )}
              </Box>

              {photoUploadStore.progress > 0 && (
                <Box sx={{ width: "100%", mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      מעלה תמונה...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${photoUploadStore.progress}%`}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={photoUploadStore.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" gutterBottom>
                פרטי התמונה
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <FormControl fullWidth sx={{ mb: 3 }}>
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

              <FormControl fullWidth sx={{ mb: 3 }}>
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
                </Select>
              </FormControl>

              <Box sx={{ mt: "auto", pt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<CloudUpload />}
                  onClick={handleUpload}
                  disabled={files.length === 0 || !selectedAlbum || !selectedTagId || loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? "מעלה תמונה..." : "העלאת תמונה"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

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
