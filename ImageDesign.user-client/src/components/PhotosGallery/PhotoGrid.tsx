"use client"

import React from "react"
import {
    Box,
    Paper,
    Tooltip,
    IconButton,
    Grid,
    Typography,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Fade,
    Card,
    CardMedia,
    CardContent,
    CardActions,
} from "@mui/material"
import {
    DownloadOutlined,
    DeleteOutlined,
    FileCopyOutlined,
    DriveFileMoveOutlined,
    MoreVert,
    ZoomIn,
    Edit,
    Share,
} from "@mui/icons-material"
import photoUploadStore from "../../stores/photoUploaderStore"
import { motion } from "framer-motion"
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW'; // או PaletteIcon

interface Photo {
    id: number
    photoName: string
    photoPath: string
}

interface PhotoGridProps {
    photos: Photo[]
    onPhotoClick: (index: number) => void
    onCopyMoveClick: (photoId: number, isCopy: boolean) => void
    viewMode: "grid" | "compact"
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, onPhotoClick, onCopyMoveClick, viewMode }) => {
    const [anchorEl, setAnchorEl] = React.useState<{ [key: number]: HTMLElement | null }>({})

    const handleDownload = async (photo: { photoName: string; photoPath: string }) => {
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

    const handleDelete = async (photoId: number) => {
        try {
            if (window.confirm("האם אתה בטוח שברצונך למחוק את התמונה?")) {
                await photoUploadStore.deletePhoto(photoId)
            }
        } catch (error) {
            console.error("שגיאה במחיקת התמונה:", error)
            alert("שגיאה במחיקת התמונה")
        }
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, photoId: number) => {
        event.stopPropagation()
        setAnchorEl({ ...anchorEl, [photoId]: event.currentTarget })
    }

    const handleMenuClose = (photoId: number) => {
        setAnchorEl({ ...anchorEl, [photoId]: null })
    }

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

    if (viewMode === "grid") {
        return (
            <Grid container spacing={3} component={motion.div} variants={container} initial="hidden" animate="show">
                {photos.map((photo, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id} component={motion.div} variants={item}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                                },
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 2,
                            }}
                        >
                            <Box sx={{ position: "relative", paddingTop: "75%", overflow: "hidden" }}>
                                <CardMedia
                                    component="img"
                                    image={photo.photoPath}
                                    alt={photo.photoName}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.5s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                        },
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onPhotoClick(index)}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: "linear-gradient(to bottom, rgba(0,0,0,0) 70%, rgba(0,0,0,0.7) 100%)",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&:hover": {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            color: "white",
                                            bgcolor: "rgba(0,0,0,0.3)",
                                            "&:hover": {
                                                bgcolor: "rgba(0,0,0,0.5)",
                                            },
                                        }}
                                        onClick={() => onPhotoClick(index)}
                                    >
                                        <ZoomIn />
                                    </IconButton>
                                </Box>
                            </Box>

                            <CardContent sx={{ flexGrow: 1, py: 1.5 }}>
                                <Typography variant="body2" component="div" noWrap title={photo.photoName}>
                                    {photo.photoName}
                                </Typography>
                            </CardContent>

                            <CardActions sx={{ justifyContent: "space-between", px: 1, py: 0.5 }}>
                                <Box>
                                    <Tooltip title="הורדת תמונה">
                                        <IconButton size="small" onClick={() => handleDownload(photo)}>
                                            <DownloadOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="מחיקת תמונה">
                                        <IconButton size="small" onClick={() => handleDelete(photo.id)}>
                                            <DeleteOutlined fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, photo.id)}
                                        aria-controls={`photo-menu-${photo.id}`}
                                        aria-haspopup="true"
                                    >
                                        <MoreVert fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        id={`photo-menu-${photo.id}`}
                                        anchorEl={anchorEl[photo.id]}
                                        keepMounted
                                        open={Boolean(anchorEl[photo.id])}
                                        onClose={() => handleMenuClose(photo.id)}
                                        TransitionComponent={Fade}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                onCopyMoveClick(photo.id, true)
                                                handleMenuClose(photo.id)
                                            }}
                                        >
                                            <ListItemIcon>
                                                <FileCopyOutlined fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>העתק תמונה</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                onCopyMoveClick(photo.id, false)
                                                handleMenuClose(photo.id)
                                            }}
                                        >
                                            <ListItemIcon>
                                                <DriveFileMoveOutlined fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>העבר תמונה</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                // Handle edit
                                                handleMenuClose(photo.id)
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Edit fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>ערוך תמונה</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                // Handle share
                                                handleMenuClose(photo.id)
                                            }}
                                        >
                                            <FilterBAndWIcon >
                                                <Edit fontSize="small" />
                                            </FilterBAndWIcon >
                                            <ListItemText>שנה את התמונה לשחור לבן</ListItemText>
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                // Handle share
                                                handleMenuClose(photo.id)
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Share fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>שתף תמונה</ListItemText>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        )
    }

    // Compact view
    return (
        <Box
            component={motion.div}
            variants={container}
            initial="hidden"
            animate="show"
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 2,
            }}
        >
            {photos.map((photo, index) => (
                <Paper
                    key={photo.id}
                    component={motion.div}
                    variants={item}
                    sx={{
                        position: "relative",
                        overflow: "hidden",
                        borderRadius: 2,
                        height: 180,
                        transition: "all 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
                        },
                    }}
                >
                    <img
                        src={photo.photoPath || "/placeholder.svg"}
                        alt={photo.photoName}
                        onClick={() => onPhotoClick(index)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                        }}
                    />

                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                            padding: "30px 8px 8px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                color: "white",
                                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                maxWidth: "100px",
                            }}
                        >
                            {photo.photoName}
                        </Typography>

                        <Box sx={{ display: "flex" }}>
                            <IconButton size="small" sx={{ color: "white" }} onClick={(e) => handleMenuOpen(e, photo.id)}>
                                <MoreVert fontSize="small" />
                            </IconButton>
                            <Menu
                                id={`photo-menu-compact-${photo.id}`}
                                anchorEl={anchorEl[photo.id]}
                                keepMounted
                                open={Boolean(anchorEl[photo.id])}
                                onClose={() => handleMenuClose(photo.id)}
                                TransitionComponent={Fade}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleDownload(photo)
                                        handleMenuClose(photo.id)
                                    }}
                                >
                                    <ListItemIcon>
                                        <DownloadOutlined fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>הורדת תמונה</ListItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onCopyMoveClick(photo.id, true)
                                        handleMenuClose(photo.id)
                                    }}
                                >
                                    <ListItemIcon>
                                        <FileCopyOutlined fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>העתק תמונה</ListItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        onCopyMoveClick(photo.id, false)
                                        handleMenuClose(photo.id)
                                    }}
                                >
                                    <ListItemIcon>
                                        <DriveFileMoveOutlined fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>העבר תמונה</ListItemText>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleDelete(photo.id)
                                        handleMenuClose(photo.id)
                                    }}
                                >
                                    <ListItemIcon>
                                        <DeleteOutlined fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>מחק תמונה</ListItemText>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Paper>
            ))}
        </Box>
    )
}

export default PhotoGrid
