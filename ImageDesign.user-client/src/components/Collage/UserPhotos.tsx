"use client"

import type React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    CircularProgress,
    TextField,
    Checkbox,
    Paper,
    Chip,
    InputAdornment,
    Fade,
    Divider,
    useTheme,
    useMediaQuery,
    Badge,
    Card,
    CardContent,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary"
import SearchIcon from "@mui/icons-material/Search"
import ImageIcon from "@mui/icons-material/Image"
// import CheckCircleIcon from "@mui/icons-material/CheckCircle"
// import SelectAllIcon from "@mui/icons-material/SelectAll"
// import ClearAllIcon from "@mui/icons-material/ClearAll"
import { motion, AnimatePresence } from "framer-motion"
import albumStore from "../../stores/albumStore"

interface UserPhotosDialogProps {
    open: boolean
    onClose: () => void
}

const UserPhotosDialog: React.FC<UserPhotosDialogProps> = observer(({ open, onClose }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const navigate = useNavigate()

    const userData = sessionStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null
    const userId = user ? user.user.id : null

    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null)

    console.log(isMobile)
    console.log(setError)

    useEffect(() => {
        if (open && userId) {
            setLoading(true)
            albumStore.fetchPhotos(userId).finally(() => setLoading(false))
        } else if (!open) {
            setSelectedPhotos([])
        }
    }, [open, userId])

    const handlePhotoSelect = useCallback((photoId: number, isSelected: boolean) => {
        setSelectedPhotos((prevSelected) => {
            if (isSelected) {
                return [...prevSelected, photoId]
            } else {
                return prevSelected.filter((id) => id !== photoId)
            }
        })
    }, [])

    const filteredPhotos = useMemo(() => {
        return albumStore.photos.filter((photo: any) => photo.photoName?.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [albumStore.photos, searchTerm])

    const handleCreateCollage = () => {
        // Navigate to the collage creator page with selected photo IDs
        navigate("/personal-area/create-collage", {
            state: { selectedPhotoIds: selectedPhotos },
        })
        onClose()
    }

    const handleSelectAll = () => {
        if (selectedPhotos.length === filteredPhotos.length) {
            setSelectedPhotos([])
        } else {
            setSelectedPhotos(filteredPhotos.map((photo: any) => photo.id))
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            PaperProps={{
                sx: {
                    width: "700px", // הגדלתי רוחב
                    height: "85vh",
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                    direction: "rtl",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
            BackdropProps={{
                sx: {
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                },
            }}
        >
            <style>
                {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-2px); }
          }
        `}
            </style>

            {/* כותרת מעוצבת */}
            <DialogTitle
                sx={{
                    p: 0,
                    background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    justifyContent: "space-between", // זה חשוב להוסיף
                    alignItems: "center" // זה חשוב להוסיף
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{
                        color: "white",
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        width: 36,
                        height: 36,
                        transition: "all 0.2s ease",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.25)",
                            transform: "scale(1.05)",
                        },
                        order: -1, // זה יזיז את הכפתור לצד שמאל
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "flex-end", flexGrow: 1 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)",
                        }}
                    >
                        <PhotoLibraryIcon sx={{ color: "white", fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                color: "white",
                                fontWeight: "700",
                                textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                fontSize: "1.1rem",
                            }}
                        >
                            בחירת תמונות לקולאז'
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "rgba(255, 255, 255, 0.9)",
                                fontWeight: "500",
                                fontSize: "0.75rem",
                            }}
                        >
                            בחר את התמונות שתרצה לכלול
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            {/* פאנל חיפוש ובקרה */}
            {/* פאנל חיפוש ובקרה */}
            <Box
                sx={{
                    p: 1, // הקטנתי את ה-padding
                    background: "linear-gradient(135deg, rgba(234, 102, 203, 0.05), rgba(189, 132, 246, 0.05))",
                    borderBottom: "1px solid rgba(234, 102, 203, 0.1)",
                    flexShrink: 0,
                    display: "flex", // הוספתי display: flex
                    alignItems: "center", // הוספתי alignItems
                    justifyContent: "space-between" // הוספתי justifyContent
                }}
            >


                <Chip
                    // icon={selectedPhotos.length === filteredPhotos.length ? <ClearAllIcon /> : <SelectAllIcon />}
                    label={selectedPhotos.length === filteredPhotos.length ? "בטל הכל" : "בחר הכל"}
                    onClick={handleSelectAll}
                    size="small"
                    sx={{
                        marginLeft: 1, // הוספתי marginLeft כדי להפריד בין השניים
                        background:
                            selectedPhotos.length === filteredPhotos.length
                                ? "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))"
                                : "linear-gradient(45deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1))",
                        border: `1px solid ${selectedPhotos.length === filteredPhotos.length ? "rgba(239, 68, 68, 0.3)" : "rgba(234, 102, 203, 0.3)"
                            }`,
                        color: selectedPhotos.length === filteredPhotos.length ? "#ef4444" : "rgb(234, 102, 203)",
                        fontWeight: "600",
                        fontSize: "0.75rem",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            transform: "scale(1.02)",
                        },
                    }}
                />


                <TextField
                    placeholder="חיפוש תמונות..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        //   flexGrow: 1, // הוספתי flexGrow כדי למלא את השטח
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(234, 102, 203, 0.2)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                background: "rgba(255, 255, 255, 0.9)",
                                borderColor: "rgba(234, 102, 203, 0.4)",
                            },
                            "&.Mui-focused": {
                                background: "white",
                                borderColor: "rgb(234, 102, 203)",
                                boxShadow: "0 0 15px rgba(234, 102, 203, 0.2)",
                            },
                            "& fieldset": {
                                border: "none",
                            },
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "rgb(234, 102, 203)", fontSize: 20 }} />
                            </InputAdornment>
                        ),
                        sx: { textAlign: 'right', direction: 'rtl', right: '0' }, // הוספתי את direction: 'rtl'

                    }}
                />


            </Box>


            {/* תוכן התמונות */}
            <DialogContent
                sx={{
                    p: 2,
                    overflow: "auto",
                    flexGrow: 1,
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(234, 102, 203, 0.1)",
                        borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                        borderRadius: "3px",
                    },
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "300px",
                        }}
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                                animation: "float 2s ease-in-out infinite",
                            }}
                        >
                            <CircularProgress sx={{ color: "white" }} size={30} />
                        </Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "rgb(234, 102, 203)",
                                fontWeight: "600",
                                mb: 1,
                            }}
                        >
                            טוען תמונות...
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                            אנא המתן בזמן שאנו טוענים את התמונות
                        </Typography>
                    </Box>
                ) : error ? (
                    <Card
                        sx={{
                            background: "linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.1))",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: 2,
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                            <Typography color="error" variant="subtitle1" gutterBottom>
                                שגיאה בטעינת התמונות
                            </Typography>
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        </CardContent>
                    </Card>
                ) : filteredPhotos.length === 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "300px",
                            p: 3,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                            }}
                        >
                            <ImageIcon sx={{ fontSize: 40, color: "rgb(234, 102, 203)" }} />
                        </Box>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "rgb(234, 102, 203)",
                                fontWeight: "600",
                                mb: 1,
                            }}
                        >
                            לא נמצאו תמונות
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: "0.875rem" }}>
                            {searchTerm ? "נסה לשנות את מונחי החיפוש" : "העלה תמונות חדשות כדי ליצור קולאז'"}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        <AnimatePresence>
                            {filteredPhotos.map((photo: any, index: number) => (
                                <Grid item xs={4} key={photo.id}> {/* שיניתי מ-xs={6} ל-xs={4} לתמונות גדולות יותר */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3, delay: index * 0.03 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                position: "relative",
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                background: "rgba(255, 255, 255, 0.8)",
                                                backdropFilter: "blur(10px)",
                                                border: selectedPhotos.includes(photo.id)
                                                    ? "2px solid rgb(234, 102, 203)"
                                                    : "1px solid rgba(255, 255, 255, 0.3)",
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                    boxShadow: selectedPhotos.includes(photo.id)
                                                        ? "0 8px 25px rgba(234, 102, 203, 0.3)"
                                                        : "0 8px 25px rgba(0, 0, 0, 0.15)",
                                                },
                                            }}
                                            onMouseEnter={() => setHoveredPhotoId(photo.id)}
                                            onMouseLeave={() => setHoveredPhotoId(null)}
                                            onClick={() => handlePhotoSelect(photo.id, !selectedPhotos.includes(photo.id))}
                                        >
                                            {/* Checkbox מעוצב */}
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 8,
                                                    zIndex: 2,
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: "50%",
                                                    background: selectedPhotos.includes(photo.id)
                                                        ? "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))"
                                                        : "rgba(255, 255, 255, 0.9)",
                                                    backdropFilter: "blur(10px)",
                                                    border: selectedPhotos.includes(photo.id)
                                                        ? "2px solid white"
                                                        : "2px solid rgba(234, 102, 203, 0.3)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    opacity: selectedPhotos.includes(photo.id) || hoveredPhotoId === photo.id ? 1 : 0.7,
                                                    transition: "all 0.3s ease",
                                                    transform: selectedPhotos.includes(photo.id) ? "scale(1.1)" : "scale(1)",
                                                }}
                                            >
                                                <Checkbox
                                                    checked={selectedPhotos.includes(photo.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation()
                                                        // תיקון: אני לא קורא שוב ל-handlePhotoSelect כאן
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        p: 0,
                                                        color: selectedPhotos.includes(photo.id) ? "white" : "rgb(234, 102, 203)",
                                                        "&.Mui-checked": {
                                                            color: "white",
                                                        },
                                                    }}
                                                />
                                            </Box>

                                            {/* תמונה */}
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    paddingTop: "100%", // שיניתי מ-75% ל-100% ליחס 1:1 (ריבוע)
                                                }}
                                            >
                                                <img
                                                    src={photo.photoPath || "/placeholder.svg"}
                                                    alt={photo.photoName}
                                                    style={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        transition: "transform 0.3s ease",
                                                        transform: selectedPhotos.includes(photo.id) ? "scale(1.05)" : "scale(1)",
                                                    }}
                                                />

                                                {/* אפקט overlay כשנבחר */}
                                                <Fade in={selectedPhotos.includes(photo.id)}>
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 0,
                                                            left: 0,
                                                            width: "100%",
                                                            height: "100%",
                                                            background: "linear-gradient(45deg, rgba(234, 102, 203, 0.2), rgba(189, 132, 246, 0.2))",
                                                            display: selectedPhotos.includes(photo.id) ? "block" : "none",
                                                        }}
                                                    />
                                                </Fade>

                                                {/* מספר סידורי */}
                                                {selectedPhotos.includes(photo.id) && (
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            bottom: 6,
                                                            left: 6,
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: "50%",
                                                            background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                                                            color: "white",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "bold",
                                                            fontSize: "0.75rem",
                                                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                                                        }}
                                                    >
                                                        {selectedPhotos.indexOf(photo.id) + 1}
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* שם התמונה */}
                                            <Box sx={{ p: 1.5 }}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        fontWeight: "600",
                                                        color: selectedPhotos.includes(photo.id) ? "rgb(234, 102, 203)" : "#1e293b",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        textAlign: "center",
                                                        transition: "color 0.2s ease",
                                                        fontSize: "0.75rem",
                                                        display: "block",
                                                    }}
                                                >
                                                    {photo.photoName}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </AnimatePresence>
                    </Grid>
                )}
            </DialogContent>

            <Divider sx={{ borderColor: "rgba(234, 102, 203, 0.1)" }} />

            {/* כפתורי פעולה */}
            <DialogActions
                sx={{
                    p: 2,
                    justifyContent: "space-between",
                    background: "linear-gradient(135deg, rgba(234, 102, 203, 0.02), rgba(189, 132, 246, 0.02))",
                    flexShrink: 0,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        color: "rgb(234, 102, 203)",
                        fontWeight: "600",
                        fontSize: "0.875rem",
                    }}
                >
                    {selectedPhotos.length > 0 ? `${selectedPhotos.length} תמונות נבחרו` : "לא נבחרו תמונות"}
                </Typography>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Button
                        onClick={onClose}
                        size="small"
                        sx={{
                            color: "#64748b",
                            fontWeight: "600",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.875rem",
                            "&:hover": {
                                background: "rgba(100, 116, 139, 0.1)",
                            },
                        }}
                    >
                        ביטול
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateCollage}
                        disabled={selectedPhotos.length === 0}
                        size="small"
                        sx={{
                            background:
                                selectedPhotos.length > 0
                                    ? "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)"
                                    : "#e2e8f0",
                            backgroundSize: "300% 300%",
                            animation: selectedPhotos.length > 0 ? "shimmer 3s ease-in-out infinite" : "none",
                            color: selectedPhotos.length > 0 ? "white" : "#94a3b8",
                            fontWeight: "700",
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            fontSize: "0.875rem",
                            boxShadow: selectedPhotos.length > 0 ? "0 6px 20px rgba(234, 102, 203, 0.4)" : "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: selectedPhotos.length > 0 ? "translateY(-1px)" : "none",
                                boxShadow: selectedPhotos.length > 0 ? "0 8px 25px rgba(234, 102, 203, 0.5)" : "none",
                            },
                            "&:disabled": {
                                background: "#e2e8f0",
                                color: "#94a3b8",
                                transform: "none",
                                boxShadow: "none",
                            },
                        }}
                    >
                        <Badge
                            badgeContent={selectedPhotos.length}
                            sx={{
                                "& .MuiBadge-badge": {
                                    background: "rgba(255, 255, 255, 0.9)",
                                    color: "rgb(234, 102, 203)",
                                    fontWeight: "bold",
                                    fontSize: "0.7rem",
                                },
                            }}
                        >
                            צור קולאז'
                        </Badge>
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    )
})

export default UserPhotosDialog