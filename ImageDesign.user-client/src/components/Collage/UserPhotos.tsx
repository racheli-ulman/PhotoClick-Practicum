import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
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
    Zoom,
    Divider,
    useTheme,
    useMediaQuery,
    Badge
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SearchIcon from '@mui/icons-material/Search';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import SortIcon from '@mui/icons-material/Sort';
import ImageIcon from '@mui/icons-material/Image';
import albumStore from '../../stores/albumStore';
import CollageCreator from './CreateCollage';

interface UserPhotosDialogProps {
    open: boolean;
    onClose: () => void;
}

const UserPhotosDialog: React.FC<UserPhotosDialogProps> = observer(({ open, onClose }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    console.log(isMobile);

    const userData = sessionStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.user.id : null;

    const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [collageDialogOpen, setCollageDialogOpen] = useState<boolean>(false);
    const [hoveredPhotoId, setHoveredPhotoId] = useState<number | null>(null);
    console.log(setError);

    useEffect(() => {
        if (open && userId) {
            setLoading(true);
            albumStore.fetchPhotos(userId)
                .finally(() => setLoading(false));
        } else if (!open) {
            setSelectedPhotos([]);
        }
    }, [open, userId]);

    const handlePhotoSelect = useCallback((photoId: number, isSelected: boolean) => {
        setSelectedPhotos(prevSelected => {
            if (isSelected) {
                return [...prevSelected, photoId];
            } else {
                return prevSelected.filter(id => id !== photoId);
            }
        });
    }, []);

    const filteredPhotos = useMemo(() => {
        return albumStore.photos.filter((photo: any) =>
            photo.photoName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [albumStore.photos, searchTerm]);

    const handleCreateCollage = () => {
        setCollageDialogOpen(true);
    };

    const handleCollageDialogClose = () => {
        setCollageDialogOpen(false);
    };

    const handleSelectAll = () => {
        if (selectedPhotos.length === filteredPhotos.length) {
            setSelectedPhotos([]);
        } else {
            setSelectedPhotos(filteredPhotos.map((photo: any) => photo.id));
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                        direction: 'rtl' // RTL support
                    }
                }}
            >
                <DialogTitle sx={{
                    p: 2,
                    bgcolor: 'rgba(196, 104, 104, 0.05)',
                    borderBottom: '1px solid rgba(196, 104, 104, 0.1)'
                }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <IconButton
                            onClick={onClose}
                            sx={{
                                color: '#c46868',
                                '&:hover': {
                                    bgcolor: 'rgba(196, 104, 104, 0.1)'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" component="h2" sx={{
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight: 600,
                            color: '#c46868'
                        }}>
                            <PhotoLibraryIcon sx={{ mr: 1 }} /> בחר תמונות לקולאז'
                        </Typography>

                    </Box>
                </DialogTitle>

                <Box sx={{ p: 2, bgcolor: 'rgba(196, 104, 104, 0.03)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="חיפוש תמונות..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#c46868' }} />
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        borderRadius: 2,
                                        '&.Mui-focused': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#c46868'
                                            }
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                            {/* <Chip
                                icon={<FilterListIcon />}
                                label="סינון"
                                variant="outlined"
                                onClick={() => { }}
                                sx={{ borderColor: '#c46868', color: '#c46868' }}
                            />
                            <Chip
                                icon={<SortIcon />}
                                label="מיון"
                                variant="outlined"
                                onClick={() => { }}
                                sx={{ borderColor: '#c46868', color: '#c46868' }}
                            /> */}
                            <Chip
                                label={selectedPhotos.length === filteredPhotos.length ? "בטל הכל" : "בחר הכל"}
                                variant="outlined"
                                onClick={handleSelectAll}
                                sx={{
                                    borderColor: '#c46868',
                                    color: '#c46868',
                                    bgcolor: selectedPhotos.length === filteredPhotos.length ? 'rgba(196, 104, 104, 0.1)' : 'transparent'
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <DialogContent sx={{ p: 3, height: '60vh', overflow: 'auto' }}>
                    {loading ? (
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress sx={{ color: '#c46868', mb: 2 }} />
                            <Typography variant="body1" color="text.secondary">טוען תמונות...</Typography>
                        </Box>
                    ) : error ? (
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: '#fff5f5',
                                borderRadius: 2,
                                border: '1px solid #ffcccc',
                                textAlign: 'center'
                            }}
                        >
                            <Typography color="error">{error}</Typography>
                        </Box>
                    ) : filteredPhotos.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                p: 3
                            }}
                        >
                            <ImageIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">לא נמצאו תמונות</Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                נסה לשנות את מונחי החיפוש או להעלות תמונות חדשות
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {filteredPhotos.map((photo: any) => (
                                <Grid item xs={12} sm={6} md={4} key={photo.id}>
                                    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                position: 'relative',
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                transition: 'all 0.3s ease',
                                                transform: selectedPhotos.includes(photo.id) ? 'scale(0.98)' : 'scale(1)',
                                                border: selectedPhotos.includes(photo.id) ? '2px solid #c46868' : 'none',
                                                '&:hover': {
                                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                                                    transform: selectedPhotos.includes(photo.id) ? 'scale(0.98)' : 'scale(1.02)'
                                                }
                                            }}
                                            onMouseEnter={() => setHoveredPhotoId(photo.id)}
                                            onMouseLeave={() => setHoveredPhotoId(null)}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex: 2,
                                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '50%',
                                                    width: 32,
                                                    height: 32,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: selectedPhotos.includes(photo.id) || hoveredPhotoId === photo.id ? 1 : 0,
                                                    transition: 'opacity 0.2s ease'
                                                }}
                                            >
                                                <Checkbox
                                                    checked={selectedPhotos.includes(photo.id)}
                                                    onChange={(e) => handlePhotoSelect(photo.id, e.target.checked)}
                                                    sx={{
                                                        p: 0,
                                                        color: '#c46868',
                                                        '&.Mui-checked': {
                                                            color: '#c46868',
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    paddingTop: '75%', // 4:3 aspect ratio
                                                }}
                                            >
                                                <img
                                                    src={photo.photoPath || "/placeholder.svg"}
                                                    alt={photo.photoName}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        transition: 'transform 0.3s ease',
                                                        transform: selectedPhotos.includes(photo.id) ? 'scale(1.05)' : 'scale(1)'
                                                    }}
                                                />
                                                <Fade in={selectedPhotos.includes(photo.id)}>
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            bgcolor: 'rgba(196, 104, 104, 0.2)',
                                                            display: selectedPhotos.includes(photo.id) ? 'block' : 'none'
                                                        }}
                                                    />
                                                </Fade>
                                            </Box>
                                            <Box sx={{ p: 1.5 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 500,
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {photo.photoName}
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Zoom>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                        {selectedPhotos.length} תמונות נבחרו
                    </Typography>
                    <Box>
                        <Button
                            onClick={onClose}
                            sx={{
                                color: '#666',
                                mr: 1,
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            ביטול
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleCreateCollage}
                            disabled={selectedPhotos.length === 0}
                            sx={{
                                bgcolor: '#c46868',
                                '&:hover': {
                                    bgcolor: '#b45757'
                                },
                                '&:disabled': {
                                    bgcolor: '#e0e0e0'
                                }
                            }}
                        >
                            <Badge
                                badgeContent={selectedPhotos.length}
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: 'white',
                                        color: '#c46868'
                                    }
                                }}
                            >
                                צור קולאז'
                            </Badge>
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            <CollageCreator
                open={collageDialogOpen}
                onClose={handleCollageDialogClose}
                selectedPhotoIds={selectedPhotos}
            />
        </>
    );
});

export default UserPhotosDialog;
