// "use client"

import { observer } from "mobx-react-lite"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import albumStore from "../stores/albumStore"
import photoUploadStore from "../stores/photoUploaderStore"
import CreateNewAlbum from "./CreateNewAlbum"
import type { Album} from "../models/Album"
import userStore from "../stores/userStore"
// import { Button } from "@mui/material"

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Skeleton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Divider,
  Chip,
  Alert,
  Snackbar,
  Fade,
} from "@mui/material"
import {
  Add,
  Search,
  Edit,
  Delete,
  Folder,
  MoreVert,
  SortByAlpha,
  PhotoLibrary,
  Info,
  Share,
  ArrowUpward,
  ArrowDownward,
  Close,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

const UserAlbums: React.FC = () => {
  const navigate = useNavigate()
  const userId = userStore.user?.user?.id ?? null
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [newAlbumName, setNewAlbumName] = useState<string>("")
  const [newAlbumDescription, setNewAlbumDescription] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({})
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })

  const [photoCounts, setPhotoCounts] = useState<{ [key: number]: number }>({})

useEffect(() => {
  const fetchAlbumsAndPhotos = async () => {
    if (userId) {
      try {
        setLoading(true)
        await albumStore.fetchAlbums(userId)

        // טוען את מספר התמונות עבור כל אלבום
        const counts: { [key: number]: number } = {}
        for (const  album of albumStore.albums) {
       
          if (!album.id) continue // Skip if album ID is not available
          const count = await photoUploadStore.fetchPhotosByAlbumId(album.id)   
          console.log("album ",album);
          console.log("album-id",album.id);
          console.log("album-name",album.albumName);
          console.log("count",count);
          
          counts[album.id] = count
        }
        setPhotoCounts(counts)
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
  }
  fetchAlbumsAndPhotos()
}, [userId])


  const handleAlbumClick = (albumId: number) => {
    navigate(`/personal-area/get-photos/${albumId}`)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, albumId: number) => {
    event.stopPropagation()
    setMenuAnchorEl({ ...menuAnchorEl, [albumId]: event.currentTarget })
  }

  const handleMenuClose = (albumId: number) => {
    setMenuAnchorEl({ ...menuAnchorEl, [albumId]: null })
  }

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortMenuClose = () => {
    setSortAnchorEl(null)
  }

  const handleSortChange = (sortType: string) => {
    if (sortBy === sortType) {
      // Toggle direction if same sort type
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(sortType)
      setSortDirection("asc")
    }
    handleSortMenuClose()
  }

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setNewAlbumName(album.albumName || "")
    setNewAlbumDescription(album.description || "")
    setOpenEditModal(true)
    handleMenuClose(album.id!)
  }

  const handleDeleteAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setOpenDeleteModal(true)
    handleMenuClose(album.id!)
  }

  const handleUpdateAlbum = async () => {
    if (!selectedAlbum || !newAlbumName.trim()) {
      showNotification("שם האלבום לא יכול להיות ריק", "error")
      return
    }

    try {
      const updatedAlbum: Album = {
        id: selectedAlbum.id,
        albumName: newAlbumName.trim(),
        userId: userId,
        description: newAlbumDescription.trim(),
        createdAt: selectedAlbum.createdAt, // Ensure createdAt is included
      }

      await albumStore.updateAlbum(updatedAlbum)
      setOpenEditModal(false)
      setSelectedAlbum(null)
      setNewAlbumName("")
      setNewAlbumDescription("")
      showNotification("האלבום עודכן בהצלחה", "success")
    } catch (err: any) {
      setError(err.message)
      showNotification("שגיאה בעדכון האלבום", "error")
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedAlbum) return

    try {
      await albumStore.deleteAlbum(selectedAlbum.id!)
      setOpenDeleteModal(false)
      setSelectedAlbum(null)
      showNotification("האלבום נמחק בהצלחה", "success")
    } catch (err: any) {
      setError(err.message)
      showNotification("שגיאה במחיקת האלבום", "error")
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  const getSortedAlbums = () => {
    if (!albumStore.albums || albumStore.albums.length === 0) return []

    return [...albumStore.albums].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.albumName.localeCompare(b.albumName)
          break
        case "date":
          // Assuming there's a date field, replace with actual field
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  const filteredAlbums = getSortedAlbums().filter((album) =>
    album.albumName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
        </Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: 10, pb: 8 }}>
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
              }}
            >
              האלבומים שלי
            </Typography>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              אלבום חדש
            </Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <TextField
              variant="outlined"
              placeholder="חיפוש אלבומים..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                width: { xs: "100%", sm: 300 },
                bgcolor: "background.paper",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "divider",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")} edge="end">
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Button
                variant="outlined"
                startIcon={sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
                endIcon={<SortByAlpha />}
                onClick={handleSortMenuOpen}
                size="small"
                sx={{ borderRadius: 2 }}
              >
                {sortBy === "name" ? "מיון לפי שם" : "מיון לפי תאריך"}
              </Button>
              <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortMenuClose}>
                <MenuItem onClick={() => handleSortChange("name")} selected={sortBy === "name"}>
                  <ListItemIcon>
                    <SortByAlpha fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>לפי שם</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleSortChange("date")} selected={sortBy === "date"}>
                  <ListItemIcon>
                    <PhotoLibrary fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>לפי תאריך</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}>
                  <ListItemIcon>
                    {sortDirection === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                  </ListItemIcon>
                  <ListItemText>{sortDirection === "asc" ? "סדר עולה" : "סדר יורד"}</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {filteredAlbums.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Folder sx={{ fontSize: 80, color: "text.secondary", opacity: 0.3 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
                {searchTerm ? "לא נמצאו אלבומים התואמים את החיפוש" : "אין אלבומים להצגה"}
              </Typography>
              <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreateModal(true)} sx={{ mt: 3 }}>
                צור אלבום חדש
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3} component={motion.div} variants={container} initial="hidden" animate="show">
              <AnimatePresence>
                {filteredAlbums.map((album) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={album.id} component={motion.div} variants={item} layout>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                        },
                      }}
                      onClick={() => {
                        if (album.id !== undefined) {
                          handleAlbumClick(album.id)
                        }
                      }}
                    >
                      <Box
                        sx={{
                          height: 140,
                          bgcolor: "primary.light",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Folder sx={{ fontSize: 80, color: "white", opacity: 0.8 }} />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              bgcolor: "rgba(255,255,255,0.8)",
                              "&:hover": {
                                bgcolor: "white",
                              },
                            }}
                            onClick={(e) => handleMenuOpen(e, album.id!)}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                          <Menu
                            id={`album-menu-${album.id}`}
                            anchorEl={menuAnchorEl[album.id!]}
                            keepMounted
                            open={Boolean(menuAnchorEl[album.id!])}
                            onClose={() => handleMenuClose(album.id!)}
                          >
                            <MenuItem onClick={() => handleEditAlbum(album)}>
                              <ListItemIcon>
                                <Edit fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>ערוך אלבום</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteAlbum(album)}>
                              <ListItemIcon>
                                <Delete fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>מחק אלבום</ListItemText>
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                // Handle share
                                handleMenuClose(album.id!)
                              }}
                            >
                              <ListItemIcon>
                                <Share fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>שתף אלבום</ListItemText>
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                // Handle info
                                handleMenuClose(album.id!)
                              }}
                            >
                              <ListItemIcon>
                                <Info fontSize="small" />
                              </ListItemIcon>
                              <ListItemText>פרטי אלבום</ListItemText>
                            </MenuItem>
                          </Menu>
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                        <Typography variant="h6" component="h2" gutterBottom noWrap>
                          {album.albumName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            height: 40,
                          }}
                        >
                          {album.description || "אין תיאור"}
                        </Typography>
                      </CardContent>

                      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
                        <Chip
                          icon={<PhotoLibrary fontSize="small" />}
                          label={`${photoCounts[album.id!] || 0} תמונות`}
                          size="small"
                          variant="outlined"
                        />
                        <Button
                          size="small"
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (album.id !== undefined) {
                              handleAlbumClick(album.id)
                            }
                          }}
                        >
                          פתח
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>
      </Container>

      {/* Floating Action Button for mobile */}
      <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 16, right: 16 }}>
        <Fab color="primary" aria-label="add album" onClick={() => setOpenCreateModal(true)}>
          <Add />
        </Fab>
      </Box>

      {/* Create Album Modal */}
      {openCreateModal && <CreateNewAlbum onClose={() => setOpenCreateModal(false)} />}

      {/* Edit Album Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">עריכת אלבום</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              שם האלבום
            </Typography>
            <TextField
              fullWidth
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="הזן שם חדש לאלבום"
              required
              variant="outlined"
            />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              תיאור האלבום
            </Typography>
            <TextField
              fullWidth
              value={newAlbumDescription}
              onChange={(e) => setNewAlbumDescription(e.target.value)}
              placeholder="הזן תיאור לאלבום (אופציונלי)"
              multiline
              rows={3}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
            ביטול
          </Button>
          <Button variant="contained" onClick={handleUpdateAlbum} disabled={!newAlbumName.trim()}>
            שמור שינויים
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Album Modal */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">מחיקת אלבום</Typography>
            <IconButton onClick={() => setOpenDeleteModal(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
            התמונות באלבום.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
            ביטול
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete} startIcon={<Delete />}>
            מחק אלבום
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
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
}

export default observer(UserAlbums)
