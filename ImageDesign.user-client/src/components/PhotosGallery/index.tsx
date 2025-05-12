"use client"

// import { Button } from "@/components/ui/button"

import type React from "react"
import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useParams, useNavigate } from "react-router-dom"
// import { Button } from "@mui/material"

import {
    Box,
    Button,
    Typography,
    Container,
    Grid,
    Breadcrumbs,
    Link as MuiLink,
    IconButton,
    Tooltip,
    Fade,
    Chip,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Skeleton,
    Alert,
    Snackbar,
} from "@mui/material"
import {
    ArrowBack,
    Home,
    Folder,
    Sort,
    ViewModule,
    ViewComfy,
    Add,
    SortByAlpha,
    CalendarMonth,
    AccessTime,
} from "@mui/icons-material"
import PhotoGrid from "./PhotoGrid"
import PhotoDetailModal from "./PhotoDetailModal"
import CopyMoveModal from "./CopyMoveModal"
import photoUploadStore from "../../stores/photoUploaderStore"
import albumStore from "../../stores/albumStore"
import { motion } from "framer-motion"
import { Album } from "../../models/Album"
import { Photo } from "../../models/Photo"

const PhotoGallery: React.FC = observer(() => {
    const { albumId: currentAlbumId } = useParams<{ albumId: string }>()
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [zoomLevel, setZoomLevel] = useState(1)
    const userData = sessionStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null
    const userId = user ? user.user.id : null
    const [copyMoveTargetAlbumId, setCopyMoveTargetAlbumId] = useState<number | "">("")
    const [selectedPhotoIdForOperation, setSelectedPhotoIdForOperation] = useState<number | null>(null)
    const [isCopyMoveDialogOpen, setIsCopyMoveDialogOpen] = useState(false)
    const [isCopyOperation, setIsCopyOperation] = useState(false)
    const [albumName, setAlbumName] = useState<string>("")
    const [viewMode, setViewMode] = useState<"grid" | "compact">("grid")
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
    const [sortBy, setSortBy] = useState<string>("name")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false,
        message: "",
        type: "success",
    })

    // const theme = useTheme()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            if (currentAlbumId) {
                await photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId))
                const album = albumStore.albums.find((album) => album.id === Number(currentAlbumId))
                setAlbumName(album ? album.albumName : "אלבום לא נמצא")
            }
            if (userId) {
                await albumStore.fetchAlbums(userId)
            }
            setLoading(false)
        }

        fetchData()
    }, [currentAlbumId, userId])

    const handlePhotoClick = (index: number) => {
        setSelectedPhotoIndex(index)
        setZoomLevel(1)
    }

    const handleCloseModal = () => {
        setSelectedPhotoIndex(null)
        setZoomLevel(1)
    }

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom * 1.5, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom / 1.5, 1))
    }

    const handleNextPhoto = () => {
        if (selectedPhotoIndex !== null) {
            const nextIndex = (selectedPhotoIndex + 1) % photoUploadStore.photos.length
            setSelectedPhotoIndex(nextIndex)
            setZoomLevel(1)
        }
    }

    const handlePrevPhoto = () => {
        if (selectedPhotoIndex !== null) {
            const prevIndex = (selectedPhotoIndex - 1 + photoUploadStore.photos.length) % photoUploadStore.photos.length
            setSelectedPhotoIndex(prevIndex)
            setZoomLevel(1)
        }
    }

    const openCopyMoveDialog = (photoId: number, isCopy: boolean) => {
        setSelectedPhotoIdForOperation(photoId)
        setIsCopyOperation(isCopy)
        setCopyMoveTargetAlbumId("")
        setIsCopyMoveDialogOpen(true)
    }

    const closeCopyMoveDialog = () => {
        setIsCopyMoveDialogOpen(false)
        setSelectedPhotoIdForOperation(null)
        setIsCopyOperation(false)
        setCopyMoveTargetAlbumId("")
    }

    const handleCopyMoveTargetAlbumChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCopyMoveTargetAlbumId(event.target.value as number)
    }

    const handleCopyMovePhoto = async () => {
        if (!selectedPhotoIdForOperation || !copyMoveTargetAlbumId) {
            showNotification("נא לבחור אלבום יעד", "error")
            return
        }
        try {
            const targetAlbumId = Number(copyMoveTargetAlbumId)
            if (isCopyOperation) {
                await photoUploadStore.copyPhotoToAlbum(selectedPhotoIdForOperation, targetAlbumId)
                showNotification("התמונה הועתקה בהצלחה", "success")
            } else {
                if (currentAlbumId === null) {
                    showNotification("לא ניתן להעביר תמונה מחוץ לאלבום", "error")
                    return
                }
                await photoUploadStore.movePhotoToAlbum(selectedPhotoIdForOperation, Number(currentAlbumId), targetAlbumId)
                showNotification("התמונה הועברה בהצלחה", "success")
                if (currentAlbumId) {
                    photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId))
                }
            }
            closeCopyMoveDialog()
        } catch (error) {
            console.error("שגיאה בפעולת העתקה/העברה:", error)
            showNotification("שגיאה בפעולת העתקה/העברה", "error")
        }
    }

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({
            show: true,
            message,
            type,
        })
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

    const getSortedPhotos = () => {
        if (!photoUploadStore.photos || photoUploadStore.photos.length === 0) return []

        return [...photoUploadStore.photos].sort((a, b) => {
            let comparison = 0
            console.log("a.pphoto name ", a.photoName);

            switch (sortBy) {
                case "name":
                    comparison = a.photoName.localeCompare(b.photoName)
                    break
                // case "date":
                //     // Assuming there's a date field, replace with actual field
                //     comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                //     break
                default:
                    comparison = 0
            }

            return sortDirection === "asc" ? comparison : -comparison
        })
    }

    const sortedPhotos = getSortedPhotos()

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
                <Box sx={{ mb: 4 }}>
                    <Skeleton variant="text" width={300} height={40} />
                    <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} />
                </Box>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                            <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        )
    }

    if (photoUploadStore.error) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
                <Alert severity="error" sx={{ mb: 4 }}>
                    שגיאה: {photoUploadStore.error}
                </Alert>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/personal-area/userAlbums")}>
                    חזרה לאלבומים
                </Button>
            </Container>
        )
    }

    if (!photoUploadStore.photos || photoUploadStore.photos.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                    <Typography variant="h5" gutterBottom>
                        אין תמונות בתקיית {albumName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        התחל להעלות תמונות לאלבום זה
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/personal-area/add-photo")}>
                        העלאת תמונה
                    </Button>
                </Box>
            </Container>
        )
    }

    return (
        <Box
            sx={{
                bgcolor: "background.default",
                minHeight: "100vh",
                pt: 10,
            }}
        >
            <Container maxWidth="lg">
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
                            {albumName}
                        </Typography>
                    </Breadcrumbs>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                color: "text.primary",
                            }}
                        >
                            {albumName}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Tooltip title="מיון תמונות">
                                <IconButton onClick={handleSortMenuOpen}>
                                    <Sort />
                                </IconButton>
                            </Tooltip>
                            <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortMenuClose}>
                                <MenuItem onClick={() => handleSortChange("name")} selected={sortBy === "name"}>
                                    <ListItemIcon>
                                        <SortByAlpha fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>לפי שם</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => handleSortChange("date")} selected={sortBy === "date"}>
                                    <ListItemIcon>
                                        <CalendarMonth fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>לפי תאריך</ListItemText>
                                </MenuItem>
                            </Menu>

                            <Tooltip title={viewMode === "grid" ? "תצוגה קומפקטית" : "תצוגת רשת"}>
                                <IconButton onClick={() => setViewMode(viewMode === "grid" ? "compact" : "grid")}>
                                    {viewMode === "grid" ? <ViewComfy /> : <ViewModule />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="העלאת תמונה">
                                <IconButton color="primary" onClick={() => navigate("/personal-area/add-photo")}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Chip
                        icon={<AccessTime fontSize="small" />}
                        label={`${sortedPhotos.length} תמונות`}
                        size="small"
                        sx={{ mb: 3 }}
                    />
                </Box>
                <PhotoGrid
                    photos={sortedPhotos.filter((photo) => photo.id !== undefined) as Photo[]}
                    onPhotoClick={handlePhotoClick}
                    onCopyMoveClick={openCopyMoveDialog}
                    viewMode={viewMode}
                />

                <CopyMoveModal
                    open={isCopyMoveDialogOpen}
                    onClose={closeCopyMoveDialog}
                    isCopyOperation={isCopyOperation}
                    targetAlbumId={copyMoveTargetAlbumId}
                    albums={albumStore.albums.filter((album) => album.id !== undefined) as Album[]}
                    onAlbumChange={handleCopyMoveTargetAlbumChange}
                    onConfirm={handleCopyMovePhoto}
                />

                {selectedPhotoIndex !== null && photoUploadStore.photos[selectedPhotoIndex] && (
                    <PhotoDetailModal
                        open={selectedPhotoIndex !== null}
                        photo={photoUploadStore.photos[selectedPhotoIndex]}
                        zoomLevel={zoomLevel}
                        onClose={handleCloseModal}
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onNext={handleNextPhoto}
                        onPrev={handlePrevPhoto}
                    />
                )}

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
            </Container>
        </Box>
    )
})

export default PhotoGallery
