"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Typography,
    Container,
    // Grid,
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
    // Skeleton,
    Alert,
    Snackbar,
    Select,
    SelectChangeEvent,
    TextField,
    InputAdornment,
    // Card,
    // CardContent,
    // Stack,
    // Divider,
    FormControl,
    InputLabel,
    // Collapse,
    Paper
} from "@mui/material";
import {
    // ArrowBack,
    Home,
    Folder,
    Sort,
    ViewModule,
    ViewComfy,
    Add,
    SortByAlpha,
    CalendarMonth,
    // AccessTime,
    Search,
    Clear,
    FilterList,
    ExpandMore,
    ExpandLess,
    Tag,
    PhotoCamera
} from "@mui/icons-material";
import PhotoGrid from "./PhotoGrid";
import PhotoDetailModal from "./PhotoDetailModal";
import CopyMoveModal from "./CopyMoveModal";
import photoUploadStore from "../../stores/photoUploaderStore";
import albumStore from "../../stores/albumStore";
import { motion, AnimatePresence } from "framer-motion";
import { Album } from "../../models/Album";

const PhotoGallery: React.FC = observer(() => {
    const { albumId: currentAlbumId } = useParams<{ albumId: string }>();
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [copyMoveTargetAlbumId, setCopyMoveTargetAlbumId] = useState<number | "">("");
    const [selectedPhotoIdForOperation, setSelectedPhotoIdForOperation] = useState<number | null>(null);
    const [isCopyMoveDialogOpen, setIsCopyMoveDialogOpen] = useState(false);
    const [isCopyOperation, setIsCopyOperation] = useState(false);
    const [albumName, setAlbumName] = useState<string>("");
    const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
    const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
        show: false,
        message: "",
        type: "success",
    });
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

    // New search states
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (currentAlbumId) {
                await photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId));
                const album = albumStore.albums.find((album) => album.id === Number(currentAlbumId));
                setAlbumName(album ? album.albumName : "אלבום לא נמצא");
            }
            setLoading(false);
        };

        fetchData();
    }, [currentAlbumId]);

    const handlePhotoClick = (index: number) => {
        setSelectedPhotoIndex(index);
        setZoomLevel(1);
    };

    const handleCloseModal = () => {
        setSelectedPhotoIndex(null);
        setZoomLevel(1);
    };

    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom * 1.5, 3));
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom / 1.5, 1));
    };

    const handleNextPhoto = () => {
        if (selectedPhotoIndex !== null) {
            const nextIndex = (selectedPhotoIndex + 1) % filteredAndSortedPhotos.length;
            setSelectedPhotoIndex(nextIndex);
            setZoomLevel(1);
        }
    };

    const handlePrevPhoto = () => {
        if (selectedPhotoIndex !== null) {
            const prevIndex = (selectedPhotoIndex - 1 + filteredAndSortedPhotos.length) % filteredAndSortedPhotos.length;
            setSelectedPhotoIndex(prevIndex);
            setZoomLevel(1);
        }
    };

    const openCopyMoveDialog = (photoId: number, isCopy: boolean) => {
        setSelectedPhotoIdForOperation(photoId);
        setIsCopyOperation(isCopy);
        setCopyMoveTargetAlbumId("");
        setIsCopyMoveDialogOpen(true);
    };

    const closeCopyMoveDialog = () => {
        setIsCopyMoveDialogOpen(false);
        setSelectedPhotoIdForOperation(null);
        setIsCopyOperation(false);
        setCopyMoveTargetAlbumId("");
    };

    const handleCopyMoveTargetAlbumChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCopyMoveTargetAlbumId(event.target.value as number);
    };

    const handleCopyMovePhoto = async () => {
        if (!selectedPhotoIdForOperation || !copyMoveTargetAlbumId) {
            showNotification("נא לבחור אלבום יעד", "error");
            return;
        }
        try {
            const targetAlbumId = Number(copyMoveTargetAlbumId);
            if (isCopyOperation) {
                await photoUploadStore.copyPhotoToAlbum(selectedPhotoIdForOperation, targetAlbumId);
                showNotification("התמונה הועתקה בהצלחה", "success");
            } else {
                if (currentAlbumId === null) {
                    showNotification("לא ניתן להעביר תמונה מחוץ לאלבום", "error");
                    return;
                }
                await photoUploadStore.movePhotoToAlbum(selectedPhotoIdForOperation, Number(currentAlbumId), targetAlbumId);
                showNotification("התמונה הועברה בהצלחה", "success");
                if (currentAlbumId) {
                    photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId));
                }
            }
            closeCopyMoveDialog();
        } catch (error) {
            console.error("שגיאה בפעולת העתקה/העברה:", error);
            showNotification("שגיאה בפעולת העתקה/העברה", "error");
        }
    };

    const showNotification = (message: string, type: "success" | "error") => {
        setNotification({
            show: true,
            message,
            type,
        });
    };

    const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortChange = (sortType: string) => {
        if (sortBy === sortType) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(sortType);
            setSortDirection("asc");
        }
        handleSortMenuClose();
    };

    const handleTagChange = async (event: SelectChangeEvent<string>) => {
        const tagName = event.target.value as string;
        setSelectedTag(tagName);

        if (tagName === "") {
            await photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId));
            setSelectedTagId(null);
        } else {
            const tagId = await photoUploadStore.fetchTagIdByTagName(tagName);
            if (tagId) {
                setSelectedTagId(tagId);
            } else {
                console.error("לא נמצא ID עבור התג:", tagName);
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedTag("");
        setSelectedTagId(null);
    };

    // Enhanced filtering and sorting logic
    const filteredAndSortedPhotos = useMemo(() => {
        if (!photoUploadStore.photos || photoUploadStore.photos.length === 0) return [];

        let filtered = [...photoUploadStore.photos];

        // Filter by tag
        if (selectedTagId !== null) {
            filtered = filtered.filter(photo => Number(photo.tagId) === selectedTagId);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(photo =>
                photo.photoName.toLowerCase().includes(search)
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case "name":
                    comparison = a.photoName.localeCompare(b.photoName);
                    break;
                case "date":
                    // Assuming photos have a date property, adjust as needed
                    comparison = 0;
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return filtered;
    }, [photoUploadStore.photos, selectedTagId, searchTerm, sortBy, sortDirection]);

    const hasActiveFilters = searchTerm.trim() || selectedTag;

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
                <Box sx={{
                    mb: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh'
                }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        //    bolder: '10px solid transparent',
                        border: '8px solid transparent',
                        borderTop: '8px solid rgb(234, 102, 203)',
                        borderRight: '8px solid rgb(189, 132, 246)',
                        borderBottom: '8px solid #f093fb',
                        animation: 'spin 1s linear infinite',
                        mb: 2,
                        '@keyframes spin': {
                            '0%': {
                                transform: 'rotate(0deg)',
                            },
                            '100%': {
                                transform: 'rotate(360deg)',
                            },
                        },
                    }} />
                    <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                        טוען את התמונות...
                    </Typography>
                    {/* <Skeleton variant="text" width={300} height={40} />
               <Skeleton variant="text" width={200} height={24} sx={{ mt: 1 }} /> */}
                </Box>
                {/* <Grid container spacing={3}>
               {[1, 2, 3, 4, 5, 6].map((item) => (
                   <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                       <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                       <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
                   </Grid>
               ))}
           </Grid> */}
            </Container>
        );
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
                        <MuiLink
                            underline="hover"
                            color="inherit"
                            onClick={() => navigate("/")} // שימוש ב-navigate
                            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} // הוספת cursor:pointer
                        >
                            <Home sx={{ mr: 0.5 }} fontSize="small" />
                            ראשי
                        </MuiLink>
                        <MuiLink
                            underline="hover"
                            color="inherit"
                            onClick={() => navigate("/personal-area/userAlbums")} // שימוש ב-navigate
                            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} // הוספת cursor:pointer
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

                            <Tooltip title="סינון וחיפוש">
                                <IconButton
                                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                                    color={hasActiveFilters ? "primary" : "default"}
                                >
                                    <FilterList />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="העלאת תמונה">
                                <IconButton color="primary" onClick={() => navigate("/personal-area/add-photo")}>
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Compact Search and Filter Section */}
                    <AnimatePresence>
                        {filtersExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        mb: 3,
                                        borderRadius: 2,
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                                        {/* Search Field - Compact */}
                                        <TextField
                                            size="small"
                                            variant="outlined"
                                            placeholder="חיפוש לפי שם תמונה..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            sx={{
                                                minWidth: 220,
                                                flex: '1 1 auto',
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'white',
                                                    borderRadius: 1.5,
                                                    height: 40,
                                                    '&:hover': {
                                                        backgroundColor: '#fafafa',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Search sx={{ color: '#666', fontSize: 20 }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: searchTerm && (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={handleClearSearch} size="small">
                                                            <Clear sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        {/* Tag Filter - Compact */}
                                        <FormControl size="small" sx={{ minWidth: 180 }}>
                                            <InputLabel id="tag-filter-label">סינון לפי תג</InputLabel>
                                            <Select
                                                labelId="tag-filter-label"
                                                value={selectedTag}
                                                onChange={handleTagChange}
                                                label="סינון לפי תג"
                                                sx={{
                                                    backgroundColor: 'white',
                                                    borderRadius: 1.5,
                                                    height: 40,
                                                    '&:hover': {
                                                        backgroundColor: '#fafafa',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="">כל התמונות</MenuItem>
                                                {photoUploadStore.tag.map(tag => (
                                                    <MenuItem key={tag.id} value={tag.tagName}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Tag fontSize="small" color="action" />
                                                            {tag.tagName}
                                                        </Box>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        {/* Clear Filters Button - Compact */}
                                        {hasActiveFilters && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<Clear sx={{ fontSize: 16 }} />}
                                                    onClick={handleClearFilters}
                                                    sx={{
                                                        height: 40,
                                                        whiteSpace: 'nowrap',
                                                        borderColor: '#ddd',
                                                        color: '#666',
                                                        '&:hover': {
                                                            borderColor: '#bbb',
                                                            backgroundColor: '#f5f5f5',
                                                        }
                                                    }}
                                                >
                                                    נקה
                                                </Button>
                                            </motion.div>
                                        )}
                                    </Box>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Summary */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                                icon={<PhotoCamera fontSize="small" />}
                                label={`${filteredAndSortedPhotos.length} תמונות`}
                                size="small"
                                color={hasActiveFilters ? "primary" : "default"}
                                variant={hasActiveFilters ? "filled" : "outlined"}
                            />

                            {hasActiveFilters && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Chip
                                        icon={<FilterList fontSize="small" />}
                                        label="מסונן"
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                    />
                                </motion.div>
                            )}
                        </Box>

                        <Button
                            variant="text"
                            size="small"
                            onClick={() => setFiltersExpanded(!filtersExpanded)}
                            endIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                            sx={{ color: 'text.secondary' }}
                        >
                            {filtersExpanded ? 'הסתר מסננים' : 'הצג מסננים'}
                        </Button>
                    </Box>

                    {/* No Results Message */}
                    {filteredAndSortedPhotos.length === 0 && hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body1">
                                    לא נמצאו תמונות התואמות לקריטריונים שנבחרו
                                </Typography>
                                <Button size="small" onClick={handleClearFilters} sx={{ mt: 1 }}>
                                    נקה מסננים
                                </Button>
                            </Alert>
                        </motion.div>
                    )}
                </Box>

                <PhotoGrid
                    photos={filteredAndSortedPhotos}
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

                {selectedPhotoIndex !== null && filteredAndSortedPhotos[selectedPhotoIndex] && (
                    <PhotoDetailModal
                        open={selectedPhotoIndex !== null}
                        photo={filteredAndSortedPhotos[selectedPhotoIndex]}
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
    );
});

export default PhotoGallery;