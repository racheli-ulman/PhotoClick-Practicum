import React, { useState, useEffect, useRef } from 'react';
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
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import albumStore from '../../stores/albumStore';
import html2canvas from 'html2canvas';

interface CollageCreatorProps {
  open: boolean;
  onClose: () => void;
  selectedPhotoIds: number[];
}

type LayoutType = 'grid' | 'horizontal' | 'vertical' | 'random';
type TextPositionType = 'top' | 'center' | 'bottom';
type FontStyleType = 'normal' | 'bold' | 'italic' | 'bold italic';

const CollageCreator: React.FC<CollageCreatorProps> = ({ open, onClose, selectedPhotoIds }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [gapSize, setGapSize] = useState<number>(10);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [notification, setNotification] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [processing, setProcessing] = useState<boolean>(false);
 
  // New states for enhanced features
  const [showPhotoNames, setShowPhotoNames] = useState<boolean>(false); // Default to false - hide photo names
  const [overlayText, setOverlayText] = useState<string>(''); // Custom text to show on collage
  const [textColor, setTextColor] = useState<string>('#ffffff'); // White text by default
  const [textSize, setTextSize] = useState<number>(36); // Font size in pixels
  const [textPosition, setTextPosition] = useState<TextPositionType>('center');
  const [textStyle, setTextStyle] = useState<FontStyleType>('bold');
  const [textShadow, setTextShadow] = useState<boolean>(true); // Enable text shadow by default
  const [textBackgroundColor, setTextBackgroundColor] = useState<string>('rgba(0, 0, 0, 0.3)'); // Semi-transparent background
  const [showTextBackground, setShowTextBackground] = useState<boolean>(false);
 
  const canvasRef = useRef<HTMLDivElement>(null);
  // Reference to store preloaded photos for download/save operations
  const preloadedPhotosRef = useRef<any[]>([]);
  const originalPhotosRef = useRef<any[]>([]);

  // Load selected photos
  useEffect(() => {
    if (open && selectedPhotoIds.length > 0) {
      setLoading(true);
     
      try {
        // Filter selected photos from albumStore
        const selectedPhotos = albumStore.photos.filter(
          (photo: any) => selectedPhotoIds.includes(photo.id)
        );
       
        if (selectedPhotos.length > 0) {
          console.log("Selected photos loaded:", selectedPhotos.length);
          setPhotos(selectedPhotos);
          // Store original photos for reference
          originalPhotosRef.current = [...selectedPhotos];
        } else {
          console.warn("No matching photos found in albumStore");
          setNotification({
            open: true,
            message: 'לא נמצאו תמונות תואמות',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error("Error loading photos:", error);
        setNotification({
          open: true,
          message: 'שגיאה בטעינת התמונות',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  }, [open, selectedPhotoIds]);

  const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayout(event.target.value as LayoutType);
  };

  const handleGapSizeChange = (event: Event, newValue: number | number[]) => {
    setGapSize(newValue as number);
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleTextPositionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTextPosition(event.target.value as TextPositionType);
  };

  const handleTextStyleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTextStyle(event.target.value as FontStyleType);
  };

  const handleTextSizeChange = (event: Event, newValue: number | number[]) => {
    setTextSize(newValue as number);
  };

  // Helper function to preload images and convert them to data URLs
  const preloadImages = async (inputPhotos: any[]) => {
    const preloadedPhotos = [...inputPhotos];
    const failedIndices: number[] = [];
   
    setNotification({
      open: true,
      message: 'מעבד תמונות, אנא המתן...',
      severity: 'success'
    });
   
    for (let i = 0; i < preloadedPhotos.length; i++) {
      const photo = preloadedPhotos[i];
      try {
        // Create a new image element
        const img = new Image();
        img.crossOrigin = "anonymous";
       
        // Create a promise to wait for the image to load
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error(`Failed to load image: ${photo.photoPath}`);
            failedIndices.push(i);
            resolve(); // Continue with other images even if this one fails
          };
         
          // Try to load with cache busting to avoid CORS issues
          img.src = `${photo.photoPath}${photo.photoPath.includes('?') ? '&' : '?'}cacheBust=${new Date().getTime()}`;
         
          // Set a timeout in case the image takes too long to load
          setTimeout(() => {
            if (!img.complete) {
              console.warn(`Image load timeout: ${photo.photoPath}`);
              failedIndices.push(i);
              resolve();
            }
          }, 5000);
        });
       
        if (!failedIndices.includes(i)) {
          // Create a canvas to draw the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
         
          if (ctx) {
            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0);
           
            try {
              // Convert to data URL
              const dataUrl = canvas.toDataURL('image/png');
              preloadedPhotos[i] = {
                ...photo,
                photoPath: dataUrl
              };
              console.log(`Successfully converted image ${i} to data URL`);
            } catch (e) {
              console.error(`Error converting image to data URL: ${e}`);
              failedIndices.push(i);
            }
          }
        }
      } catch (error) {
        console.error(`Error preloading image ${photo.photoPath}:`, error);
        failedIndices.push(i);
      }
    }
   
    if (failedIndices.length > 0) {
      console.warn(`${failedIndices.length} images failed to preload`);
    }
   
    return preloadedPhotos;
  };

  // Helper function to make sure all images are loaded before creating canvas
  const ensureImagesLoaded = () => {
    const images = canvasRef.current?.querySelectorAll('img') || [];
    return Promise.all(
      Array.from(images).map(img => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        });
      })
    );
  };

  // Helper function to download collage as image
  const downloadCollage = async () => {
    if (!canvasRef.current) return;

    try {
      setProcessing(true);
     
      // If we haven't preloaded images yet or need to refresh them
      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos);
      }
     
      // Store original photos and use preloaded ones temporarily
      const backupPhotos = [...photos];
      setPhotos(preloadedPhotosRef.current);
     
      // Allow time for DOM to update with preloaded images
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      setNotification({
        open: true,
        message: 'מייצר תמונת קולאז׳, אנא המתן...',
        severity: 'success'
      });
     
      const element = canvasRef.current;
     
      // Wait for all images to be loaded before proceeding
      await ensureImagesLoaded();
     
      // Additional delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));
     
      const canvas = await html2canvas(element, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        foreignObjectRendering: false,
        imageTimeout: 0,
        onclone: (documentClone) => {
          // Ensure all images in the clone are set to complete
          const images = documentClone.querySelectorAll('img');
          images.forEach(img => {
            if (!img.complete) {
              console.warn('Found incomplete image in clone, forcing complete');
              // Force image complete (this is a hack but can help)
              img.setAttribute('data-html2canvas-ignore', 'false');
            }
          });
          return documentClone;
        }
      });
     
      // Create download link
      const link = document.createElement('a');
      link.download = `collage_${new Date().toISOString().slice(0,10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
     
      // Restore original photos
      setPhotos(backupPhotos);
     
      setNotification({
        open: true,
        message: 'הקולאז׳ הורד בהצלחה!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating collage:', error);
      // More detailed error handling
      if (error instanceof Error) {
        if (error.message.includes('SecurityError') || error.message.includes('cross-origin')) {
          setNotification({
            open: true,
            message: 'שגיאת אבטחה: לא ניתן לעבד תמונות מדומיינים חיצוניים',
            severity: 'error'
          });
        } else {
          setNotification({
            open: true,
            message: `אירעה שגיאה בעת יצירת הקולאז׳: ${error.message}`,
            severity: 'error'
          });
        }
      } else {
        setNotification({
          open: true,
          message: 'אירעה שגיאה לא ידועה בעת יצירת הקולאז׳. נסה שנית.',
          severity: 'error'
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  // Helper to save collage to server
  const saveCollage = async () => {
    if (!canvasRef.current) return;
   
    try {
      setProcessing(true);
     
      // If we haven't preloaded images yet
      if (preloadedPhotosRef.current.length === 0) {
        preloadedPhotosRef.current = await preloadImages(photos);
      }
     
      // Store original photos and use preloaded ones temporarily
      const backupPhotos = [...photos];
      setPhotos(preloadedPhotosRef.current);
     
      // Allow time for DOM to update with preloaded images
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      setNotification({
        open: true,
        message: 'שומר את הקולאז׳, אנא המתן...',
        severity: 'success'
      });
     
      const element = canvasRef.current;
     
      // Wait for all images to be loaded before proceeding
      await ensureImagesLoaded();
     
      // Additional delay to ensure rendering is complete
      await new Promise(resolve => setTimeout(resolve, 500));
     
      const canvas = await html2canvas(element, {
        backgroundColor: backgroundColor,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        foreignObjectRendering: false,
        imageTimeout: 0
      });
     
      // Convert to image blob
      const imageBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png');
      });
     
      // Here you would send the blob to the server
      console.log('Image blob created, ready to upload:', imageBlob.size, 'bytes');
     
      // Restore original photos
      setPhotos(backupPhotos);
     
      // Fake server request
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      setNotification({
        open: true,
        message: 'הקולאז׳ נשמר בהצלחה!',
        severity: 'success'
      });
     
      // Close dialog after saving
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error saving collage:', error);
      setNotification({
        open: true,
        message: 'אירעה שגיאה בעת שמירת הקולאז׳. נסה שנית.',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  // When layout or photos change, reset preloaded photos
  useEffect(() => {
    preloadedPhotosRef.current = [];
  }, [layout, photos]);

  // Preload images when component mounts or photos change
  useEffect(() => {
    if (photos.length > 0 && !loading) {
      // Preload images in the background
      const doPreload = async () => {
        try {
          const preloaded = await preloadImages(photos);
          preloadedPhotosRef.current = preloaded;
          console.log('Preloaded all images successfully');
        } catch (error) {
          console.error('Failed to preload images:', error);
        }
      };
     
      doPreload();
    }
  }, [photos, loading]);

  // Debug function to log photo information
  const debugPhotos = () => {
    console.log("Current photos in state:", photos);
    console.log("Selected photo IDs:", selectedPhotoIds);
    console.log("Album store photos:", albumStore.photos);
    console.log("Preloaded photos:", preloadedPhotosRef.current);
  };

  // Generate text styles based on user selection
  const getTextStyle = () => {
    let fontStyle = 'normal';
    let fontWeight = 'normal';
   
    switch (textStyle) {
      case 'bold':
        fontWeight = 'bold';
        break;
      case 'italic':
        fontStyle = 'italic';
        break;
      case 'bold italic':
        fontWeight = 'bold';
        fontStyle = 'italic';
        break;
      default:
        break;
    }

    // Text shadow style
    const shadow = textShadow
      ? '2px 2px 4px rgba(0,0,0,0.7), -2px -2px 4px rgba(0,0,0,0.7), 2px -2px 4px rgba(0,0,0,0.7), -2px 2px 4px rgba(0,0,0,0.7)'
      : 'none';
   
    // Position styles
    let positionStyle: React.CSSProperties = {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      padding: '10px',
      zIndex: 1000,
      fontWeight,
      fontStyle,
      color: textColor,
      fontSize: `${textSize}px`,
      textShadow: shadow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
   
    // Add background if enabled
    if (showTextBackground) {
      positionStyle.backgroundColor = textBackgroundColor;
    }
   
    // Set position based on user selection
    switch (textPosition) {
      case 'top':
        positionStyle.top = 0;
        break;
      case 'center':
        positionStyle.top = '50%';
        positionStyle.transform = 'translateY(-50%)';
        break;
      case 'bottom':
        positionStyle.bottom = 0;
        break;
    }
   
    return positionStyle;
  };

  // Render different layouts
  const renderCollage = () => {
    if (!photos || photos.length === 0) {
      return (
        <Typography align="center">אין תמונות נבחרות ליצירת קולאז'</Typography>
      );
    }

    // Log for debugging
    console.log(`Rendering collage with ${photos.length} photos, layout: ${layout}`);

    // Component to render the overlay text
    const TextOverlay = () => (
      overlayText ? (
        <Box sx={getTextStyle()}>
          {overlayText}
        </Box>
      ) : null
    );

    switch (layout) {
      case 'grid':
        return (
          <Box sx={{ position: 'relative' }}>
            <Grid container spacing={gapSize / 4}>
              {photos.map((photo) => (
                <Grid item xs={6} sm={4} key={photo.id}>
                  <Paper elevation={2}>
                    <img
                      src={photo.photoPath}
                      alt={photo.photoName || 'תמונה'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        maxHeight: '200px',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error(`Error loading image: ${photo.photoPath}`);
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                      }}
                    />
                    {showPhotoNames && (
                      <Box sx={{ p: 1 }}>
                        <Typography variant="caption" display="block" align="center">
                          {photo.photoName || 'תמונה ללא שם'}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <TextOverlay />
          </Box>
        );
     
      case 'horizontal':
        return (
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: `${gapSize}px`, overflowX: 'auto' }}>
              {photos.map((photo) => (
                <Paper elevation={2} key={photo.id} sx={{ flex: '0 0 auto', width: `${100 / Math.min(photos.length, 3)}%` }}>
                  <img
                    src={photo.photoPath}
                    alt={photo.photoName || 'תמונה'}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
                  {showPhotoNames && (
                    <Box sx={{ p: 1 }}>
                      <Typography variant="caption" display="block" align="center">
                        {photo.photoName || 'תמונה ללא שם'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
            <TextOverlay />
          </Box>
        );
     
      case 'vertical':
        return (
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${gapSize}px` }}>
              {photos.map((photo) => (
                <Paper elevation={2} key={photo.id}>
                  <img
                    src={photo.photoPath}
                    alt={photo.photoName || 'תמונה'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '250px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
                  {showPhotoNames && (
                    <Box sx={{ p: 1 }}>
                      <Typography variant="caption" display="block" align="center">
                        {photo.photoName || 'תמונה ללא שם'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
            <TextOverlay />
          </Box>
        );
     
      case 'random':
        return (
          <Box sx={{ position: 'relative', height: '500px' }}>
            {photos.map((photo, index) => {
              // Generate random positions but ensure all photos are visible
              const left = Math.floor(Math.random() * 60);
              const top = Math.floor(Math.random() * 60);
              const zIndex = index + 1;
              const rotation = Math.floor(Math.random() * 20) - 10;
             
              return (
                <Paper
                  elevation={3}
                  key={photo.id}
                  sx={{
                    position: 'absolute',
                    left: `${left}%`,
                    top: `${top}%`,
                    zIndex,
                    transform: `rotate(${rotation}deg)`,
                    width: '40%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <img
                    src={photo.photoPath}
                    alt={photo.photoName || 'תמונה'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                    }}
                  />
                  {showPhotoNames && (
                    <Box sx={{ p: 1 }}>
                      <Typography variant="caption" display="block" align="center" noWrap>
                        {photo.photoName || 'תמונה ללא שם'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              );
            })}
            <TextOverlay />
          </Box>
        );
     
      default:
        return null;
    }
  };

  // Effect to log when photos change
  useEffect(() => {
    console.log("Photos state updated, count:", photos.length);
  }, [photos]);

  // Add debug button in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="h2">
              יצירת קולאז'
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>טוען תמונות...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    הגדרות קולאז'
                  </Typography>
                 
                  <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
                    <FormLabel component="legend">פריסה</FormLabel>
                    <RadioGroup value={layout} onChange={handleLayoutChange}>
                      <FormControlLabel value="grid" control={<Radio />} label="רשת" />
                      <FormControlLabel value="horizontal" control={<Radio />} label="אופקי" />
                      <FormControlLabel value="vertical" control={<Radio />} label="אנכי" />
                      <FormControlLabel value="random" control={<Radio />} label="אקראי" />
                    </RadioGroup>
                  </FormControl>
                 
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>מרווח בין תמונות</Typography>
                    <Slider
                      value={gapSize}
                      onChange={handleGapSizeChange}
                      min={0}
                      max={40}
                      step={2}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                 
                  <Box sx={{ mb: 2 }}>
                    <Typography gutterBottom>צבע רקע</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={handleBackgroundColorChange}
                        style={{ marginRight: '8px' }}
                      />
                      <Typography variant="body2">{backgroundColor}</Typography>
                    </Box>
                  </Box>
                 
                  <FormControl component="fieldset" fullWidth sx={{ mb: 2, mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showPhotoNames}
                          onChange={(e) => setShowPhotoNames(e.target.checked)}
                        />
                      }
                      label="הצג שמות תמונות בקולאז'"
                    />
                  </FormControl>
                 
                  {/* Text Overlay Settings */}
                  <Box sx={{ mt: 3, mb: 2, borderTop: '1px solid #ddd', pt: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextFieldsIcon sx={{ mr: 1 }} /> טקסט על הקולאז'
                    </Typography>
                   
                    <TextField
                      fullWidth
                      label="טקסט על הקולאז'"
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      variant="outlined"
                      margin="normal"
                      placeholder="לדוגמה: BABY"
                    />
                   
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="text-position-label">מיקום הטקסט</InputLabel>
                      <Select
                        labelId="text-position-label"
                        value={textPosition}
                        onChange={(e) => setTextPosition(e.target.value as TextPositionType)}
                        label="מיקום הטקסט"
                      >
                        <MenuItem value="top">למעלה</MenuItem>
                        <MenuItem value="center">מרכז</MenuItem>
                        <MenuItem value="bottom">למטה</MenuItem>
                      </Select>
                    </FormControl>
                   
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="text-style-label">סגנון טקסט</InputLabel>
                      <Select
                        labelId="text-style-label"
                        value={textStyle}
                        onChange={(e) => setTextStyle(e.target.value as FontStyleType)}
                        label="סגנון טקסט"
                      >
                        <MenuItem value="normal">רגיל</MenuItem>
                        <MenuItem value="bold">מודגש</MenuItem>
                        <MenuItem value="italic">נטוי</MenuItem>
                        <MenuItem value="bold italic">מודגש ונטוי</MenuItem>
                      </Select>
                    </FormControl>
                   
                    <Typography gutterBottom sx={{ mt: 2 }}>גודל טקסט</Typography>
                    <Slider
                      value={textSize}
                      onChange={handleTextSizeChange}
                      min={12}
                      max={72}
                      step={4}
                      valueLabelDisplay="auto"
                    />
                   
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <Typography gutterBottom sx={{ mr: 2 }}>צבע טקסט</Typography>
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        style={{ marginRight: '8px' }}
                      />
                    </Box>
                   
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={textShadow}
                          onChange={(e) => setTextShadow(e.target.checked)}
                        />
                      }
                      label="צל טקסט"
                      sx={{ mt: 1 }}
                    />
                   
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showTextBackground}
                          onChange={(e) => setShowTextBackground(e.target.checked)}
                        />
                      }
                      label="רקע לטקסט"
                      sx={{ mt: 1 }}
                    />
                   
                    {showTextBackground && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, ml: 4 }}>
                        <Typography gutterBottom sx={{ mr: 2 }}>צבע רקע לטקסט</Typography>
                        <input
                          type="color"
                          value={textBackgroundColor.replace('rgba', 'rgb').replace(/,[^,]*\)/, ')')}
                          onChange={(e) => {
                            // Convert RGB to RGBA with opacity 0.3
                            const rgb = e.target.value;
                            const rgba = rgb.replace('rgb', 'rgba').replace(')', ',0.3)');
                            setTextBackgroundColor(rgba);
                          }}
                          style={{ marginRight: '8px' }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => preloadImages(photos).then(preloaded => {
                        preloadedPhotosRef.current = preloaded;
                        setNotification({
                          open: true,
                          message: 'התמונות עובדו מראש בהצלחה',
                          severity: 'success'
                        });
                      })}
                      disabled={processing || photos.length === 0}
                    >
                      עבד תמונות מראש
                    </Button>
                  </Box>

                  {isDevelopment && (
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={debugPhotos}
                      sx={{ mt: 2 }}
                    >
                      Debug Info
                    </Button>
                  )}
                </Box>
              </Grid>
             
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    height: '100%',
                    bgcolor: backgroundColor,
                    overflow: 'auto',
                    minHeight: '500px',
                    position: 'relative'
                  }}
                >
                  <Box ref={canvasRef}>
                    {renderCollage()}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ביטול</Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={downloadCollage}
            disabled={photos.length === 0 || processing}
          >
            {processing ? 'מעבד...' : 'הורד קולאז\''}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={saveCollage}
            disabled={photos.length === 0 || processing}
          >
            {processing ? 'מעבד...' : 'שמור קולאז\''}
          </Button>
        </DialogActions>
      </Dialog>

      {/* התראות */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CollageCreator;

// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   Typography,
//   Slider,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Paper,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Tooltip,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import SaveIcon from '@mui/icons-material/Save';
// import DownloadIcon from '@mui/icons-material/Download';
// import UndoIcon from '@mui/icons-material/Undo';
// import RedoIcon from '@mui/icons-material/Redo';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FlipIcon from '@mui/icons-material/Flip';
// import RotateRightIcon from '@mui/icons-material/RotateRight';
// import LayersIcon from '@mui/icons-material/Layers';
// import albumStore from '../../stores/albumStore';
// import * as fabric from 'fabric';

// interface CollageCreatorProps {
//   open: boolean;
//   onClose: () => void;
//   selectedPhotoIds: number[];
// }

// type LayoutType = 'grid' | 'horizontal' | 'vertical' | 'random' | 'custom';

// const CollageCreator: React.FC<CollageCreatorProps> = ({ open, onClose, selectedPhotoIds }) => {
//   const [photos, setPhotos] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [layout, setLayout] = useState<LayoutType>('grid');
//   const [gapSize, setGapSize] = useState<number>(10);
//   const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
//   const [notification, setNotification] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
//     open: false,
//     message: '',
//     severity: 'success',
//   });
//   const [processing, setProcessing] = useState<boolean>(false);

//   // Fabric.js specific states
//   const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
//   const [zoom, setZoom] = useState<number>(1);
//   const [history, setHistory] = useState<string[]>([]);
//   const [historyIndex, setHistoryIndex] = useState<number>(-1);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fabricRef = useRef<fabric.Canvas | null>(null);
//   const canvasContainerRef = useRef<HTMLDivElement>(null);
//   const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

//   // Load selected photos
//   useEffect(() => {
//     if (open && selectedPhotoIds.length > 0) {
//       setLoading(true);

//       try {
//         const selectedPhotos = albumStore.photos.filter((photo: any) => selectedPhotoIds.includes(photo.id));

//         if (selectedPhotos.length > 0) {
//           setPhotos(selectedPhotos);
//         } else {
//           setNotification({
//             open: true,
//             message: 'לא נמצאו תמונות תואמות',
//             severity: 'error',
//           });
//         }
//       } catch (error) {
//         setNotification({
//           open: true,
//           message: 'שגיאה בטעינת התמונות',
//           severity: 'error',
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, [open, selectedPhotoIds]);

//   // Initialize Fabric.js canvas
//   useEffect(() => {
//     if (open && canvasRef.current && !canvas && !loading) {
//       const fabricCanvas = new fabric.Canvas(canvasRef.current, {
//         width: 800,
//         height: 600,
//         backgroundColor: backgroundColor,
//         preserveObjectStacking: true,
//         selection: true,
//       });

//       fabricRef.current = fabricCanvas;
//       setCanvas(fabricCanvas);

//       fabricCanvas.on('selection:created', () => setSelectedObject(fabricCanvas.getActiveObject()));
//       fabricCanvas.on('selection:updated', () => setSelectedObject(fabricCanvas.getActiveObject()));
//       fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
//       fabricCanvas.on('object:modified', saveCurrentState);

//       if (photos.length > 0) {
//         setTimeout(() => {
//           applyLayout(layout, photos, fabricCanvas);
//         }, 500);
//       }

//       setTimeout(() => {
//         saveCurrentState();
//       }, 1000);

//       return () => {
//         if (fabricRef.current) {
//           fabricRef.current.dispose();
//           fabricRef.current = null;
//           setCanvas(null);
//         }
//       };
//     }
//   }, [open, loading, photos]);

//   // Update canvas background color
//   useEffect(() => {
//     if (canvas) {
//       // החלפת setBackgroundColor בגישה הנכונה
//       canvas.set('backgroundColor', backgroundColor);
//       canvas.renderAll();
//     }
//   }, [backgroundColor, canvas]);

//   // Apply layout when layout changes
//   useEffect(() => {
//     if (canvas && photos.length > 0) {
//       applyLayout(layout, photos, canvas);
//     }
//   }, [layout, gapSize, canvas]);

//   const saveCurrentState = () => {
//     if (canvas) {
//       const json = JSON.stringify(canvas.toJSON(['id', 'photoName']));
//       if (historyIndex < history.length - 1) {
//         setHistory((prev) => prev.slice(0, historyIndex + 1));
//       }
//       setHistory((prev) => [...prev, json]);
//       setHistoryIndex((prev) => prev + 1);
//     }
//   };

//   const handleUndo = () => {
//     if (historyIndex > 0 && canvas) {
//       const newIndex = historyIndex - 1;
//       setHistoryIndex(newIndex);
//       canvas.loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
//     }
//   };

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1 && canvas) {
//       const newIndex = historyIndex + 1;
//       setHistoryIndex(newIndex);
//       canvas.loadFromJSON(history[newIndex], canvas.renderAll.bind(canvas));
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (canvas && canvas.getActiveObject()) {
//       canvas.remove(canvas.getActiveObject());
//       canvas.renderAll();
//       saveCurrentState();
//     }
//   };

//   const handleFlipSelected = () => {
//     if (canvas && canvas.getActiveObject()) {
//       const obj = canvas.getActiveObject();
//       obj.set('flipX', !obj.flipX);
//       canvas.renderAll();
//       saveCurrentState();
//     }
//   };

//   const handleRotateSelected = () => {
//     if (canvas && canvas.getActiveObject()) {
//       const obj = canvas.getActiveObject();
//       obj.rotate((obj.angle || 0) + 15);
//       canvas.renderAll();
//       saveCurrentState();
//     }
//   };

//   const handleBringToFront = () => {
//     if (canvas && canvas.getActiveObject()) {
//       canvas.bringToFront(canvas.getActiveObject());
//       canvas.renderAll();
//       saveCurrentState();
//     }
//   };

//   const handleZoomIn = () => {
//     if (canvas) {
//       const newZoom = Math.min(zoom + 0.1, 3);
//       setZoom(newZoom);
//       canvas.setZoom(newZoom);
//       canvas.renderAll();
//     }
//   };

//   const handleZoomOut = () => {
//     if (canvas) {
//       const newZoom = Math.max(zoom - 0.1, 0.5);
//       setZoom(newZoom);
//       canvas.setZoom(newZoom);
//       canvas.renderAll();
//     }
//   };

//   const applyLayout = async (layoutType: LayoutType, photos: any[], canvas: fabric.Canvas) => {
//     if (!canvas || photos.length === 0) return;

//     canvas.clear();
//     // החלפת setBackgroundColor בגישה הנכונה
//     canvas.set('backgroundColor', backgroundColor);
//     canvas.renderAll();

//     const canvasWidth = canvas.getWidth();
//     const canvasHeight = canvas.getHeight();
//     const padding = 20;
//     const effectiveWidth = canvasWidth - padding * 2;
//     const effectiveHeight = canvasHeight - padding * 2;
//     const gap = gapSize;

//     try {
//       switch (layoutType) {
//         case 'grid': {
//           const numCols = Math.min(3, photos.length);
//           const numRows = Math.ceil(photos.length / numCols);
//           const itemWidth = (effectiveWidth - (numCols - 1) * gap) / numCols;
//           const itemHeight = (effectiveHeight - (numRows - 1) * gap) / numRows;

//           for (let i = 0; i < photos.length; i++) {
//             const row = Math.floor(i / numCols);
//             const col = i % numCols;
//             const left = padding + col * (itemWidth + gap);
//             const top = padding + row * (itemHeight + gap);

//             await loadImageToCanvas(photos[i].photoPath, photos[i].photoName || 'תמונה ללא שם', photos[i].id, left, top, itemWidth, itemHeight, 0, canvas);
//           }
//           break;
//         }
//         case 'horizontal': {
//           const itemWidth = (effectiveWidth - (photos.length - 1) * gap) / photos.length;
//           const itemHeight = effectiveHeight;

//           for (let i = 0; i < photos.length; i++) {
//             const left = padding + i * (itemWidth + gap);
//             const top = padding;

//             await loadImageToCanvas(photos[i].photoPath, photos[i].photoName || 'תמונה ללא שם', photos[i].id, left, top, itemWidth, itemHeight, 0, canvas);
//           }
//           break;
//         }
//         case 'vertical': {
//           const itemWidth = effectiveWidth;
//           const itemHeight = (effectiveHeight - (photos.length - 1) * gap) / photos.length;

//           for (let i = 0; i < photos.length; i++) {
//             const left = padding;
//             const top = padding + i * (itemHeight + gap);

//             await loadImageToCanvas(photos[i].photoPath, photos[i].photoName || 'תמונה ללא שם', photos[i].id, left, top, itemWidth, itemHeight, 0, canvas);
//           }
//           break;
//         }
//         case 'random': {
//           const minSize = Math.min(effectiveWidth, effectiveHeight) / 3;
//           const maxSize = Math.min(effectiveWidth, effectiveHeight) / 1.5;

//           for (let i = 0; i < photos.length; i++) {
//             const size = minSize + Math.random() * (maxSize - minSize);
//             const left = padding + Math.random() * (effectiveWidth - size);
//             const top = padding + Math.random() * (effectiveHeight - size);
//             const angle = Math.random() * 30 - 15;

//             await loadImageToCanvas(photos[i].photoPath, photos[i].photoName || 'תמונה ללא שם', photos[i].id, left, top, size, size, angle, canvas);
//           }
//           break;
//         }
//         case 'custom':
//           if (canvas.getObjects().length === 0) {
//             const size = Math.min(effectiveWidth, effectiveHeight) / Math.sqrt(photos.length);

//             for (let i = 0; i < photos.length; i++) {
//               const left = canvasWidth / 2 - size / 2;
//               const top = canvasHeight / 2 - size / 2;

//               await loadImageToCanvas(photos[i].photoPath, photos[i].photoName || 'תמונה ללא שם', photos[i].id, left + i * 20, top + i * 20, size, size, 0, canvas);
//             }
//           }
//           break;
//       }

//       canvas.renderAll();
//       saveCurrentState();
//     } catch (error) {
//       console.error('Error applying layout:', error);
//     }
//   };

//   const loadImageToCanvas = (
//     imageUrl: string,
//     photoName: string,
//     photoId: number,
//     left: number,
//     top: number,
//     width: number,
//     height: number,
//     angle: number,
//     canvas: fabric.Canvas
//   ): Promise<fabric.Image> => {
//     return new Promise((resolve, reject) => {
//       fabric.Image.fromURL(
//         imageUrl,
//         (img) => {
//           img.scaleToWidth(width);
//           img.set({
//             left,
//             top,
//             angle,
//             cornerSize: 10,
//             cornerStyle: 'circle',
//             borderColor: '#2196f3',
//             cornerColor: '#2196f3',
//             transparentCorners: false,
//             id: photoId,
//             photoName,
//           });
//           canvas.add(img);
//           resolve(img);
//         },
//         { crossOrigin: 'anonymous' }
//       );
//     });
//   };

//   // הוספת סרגל כלים למניפולציה של התמונות
//   const renderToolbar = () => {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//         <Tooltip title="ביטול">
//           <IconButton onClick={handleUndo} disabled={historyIndex <= 0}>
//             <UndoIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="חזרה">
//           <IconButton onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
//             <RedoIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="הגדלה">
//           <IconButton onClick={handleZoomIn}>
//             <ZoomInIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="הקטנה">
//           <IconButton onClick={handleZoomOut}>
//             <ZoomOutIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="מחיקה">
//           <IconButton onClick={handleDeleteSelected} disabled={!selectedObject}>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="היפוך">
//           <IconButton onClick={handleFlipSelected} disabled={!selectedObject}>
//             <FlipIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="סיבוב">
//           <IconButton onClick={handleRotateSelected} disabled={!selectedObject}>
//             <RotateRightIcon />
//           </IconButton>
//         </Tooltip>
//         <Tooltip title="הבא לקדמה">
//           <IconButton onClick={handleBringToFront} disabled={!selectedObject}>
//             <LayersIcon />
//           </IconButton>
//         </Tooltip>
//       </Box>
//     );
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
//       <DialogTitle>
//         <Box display="flex" justifyContent="space-between" alignItems="center">
//           <Typography variant="h6">יצירת קולאז'</Typography>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </DialogTitle>
//       <DialogContent>
//         {loading ? (
//           <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
//             <CircularProgress />
//             <Typography sx={{ ml: 2 }}>טוען תמונות...</Typography>
//           </Box>
//         ) : (
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={3}>
//               <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
//                 <Typography variant="h6" gutterBottom>
//                   הגדרות קולאז'
//                 </Typography>
//                 <FormControl component="fieldset" fullWidth sx={{ mb: 2 }}>
//                   <FormLabel component="legend">פריסה</FormLabel>
//                   <RadioGroup value={layout} onChange={(e) => setLayout(e.target.value as LayoutType)}>
//                     <FormControlLabel value="grid" control={<Radio />} label="רשת" />
//                     <FormControlLabel value="horizontal" control={<Radio />} label="אופקי" />
//                     <FormControlLabel value="vertical" control={<Radio />} label="אנכי" />
//                     <FormControlLabel value="random" control={<Radio />} label="אקראי" />
//                     <FormControlLabel value="custom" control={<Radio />} label="מותאם אישית" />
//                   </RadioGroup>
//                 </FormControl>
//                 <Box sx={{ mb: 2 }}>
//                   <Typography gutterBottom>מרווח בין תמונות</Typography>
//                   <Slider
//                     value={gapSize}
//                     onChange={(e, newValue) => setGapSize(newValue as number)}
//                     min={0}
//                     max={40}
//                     step={2}
//                     valueLabelDisplay="auto"
//                     disabled={layout === 'custom'}
//                   />
//                 </Box>
//                 <Box sx={{ mb: 2 }}>
//                   <Typography gutterBottom>צבע רקע</Typography>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <input
//                       type="color"
//                       value={backgroundColor}
//                       onChange={(e) => setBackgroundColor(e.target.value)}
//                       style={{ marginRight: '8px' }}
//                     />
//                     <Typography variant="body2">{backgroundColor}</Typography>
//                   </Box>
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={9}>
//               {canvas && renderToolbar()}
//               <Paper
//                 elevation={3}
//                 sx={{
//                   p: 2,
//                   height: '100%',
//                   minHeight: '600px',
//                   position: 'relative',
//                   overflow: 'hidden',
//                 }}
//               >
//                 <Box
//                   ref={canvasContainerRef}
//                   sx={{
//                     width: '100%',
//                     height: '100%',
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     bgcolor: '#f5f5f5',
//                     borderRadius: 1,
//                     overflow: 'hidden',
//                   }}
//                 >
//                   <canvas ref={canvasRef} />
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         )}

//         {/* התראה */}
//         <Snackbar
//           open={notification.open}
//           autoHideDuration={6000}
//           onClose={() => setNotification({ ...notification, open: false })}
//         >
//           <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
//             {notification.message}
//           </Alert>
//         </Snackbar>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>ביטול</Button>
//         <Button 
//           startIcon={<DownloadIcon />} 
//           onClick={() => {
//             if (canvas) {
//               const dataUrl = canvas.toDataURL({
//                 format: 'png',
//                 quality: 1,
//                 multiplier: 1
//               });
//               const link = document.createElement('a');
//               link.download = 'collage.png';
//               link.href = dataUrl;
//               document.body.appendChild(link);
//               link.click();
//               document.body.removeChild(link);
//             }
//           }}
//           disabled={!canvas || loading}
//         >
//           הורד קולאז'
//         </Button>
//         <Button 
//           variant="contained" 
//           color="primary" 
//           startIcon={<SaveIcon />} 
//           onClick={() => {
//             setNotification({
//               open: true,
//               message: 'הקולאז׳ נשמר בהצלחה!',
//               severity: 'success',
//             });
//           }}
//           disabled={!canvas || loading}
//         >
//           שמור קולאז'
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CollageCreator;