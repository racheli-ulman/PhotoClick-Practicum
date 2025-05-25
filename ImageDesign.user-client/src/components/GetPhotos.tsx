// import React, { useState, useEffect } from 'react';
// import { observer } from "mobx-react-lite";
// import { useParams } from "react-router-dom";
// import {
//     Box,
//     Typography,
//     Paper,
//     Modal,
//     IconButton,
//     Tooltip,
//     ThemeProvider,
//     createTheme,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel
// } from "@mui/material";
// import CloseIcon from '@mui/icons-material/Close';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import DownloadIcon from '@mui/icons-material/Download';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FileCopyIcon from '@mui/icons-material/FileCopy';
// import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
// import photoUploadStore from "../stores/photoUploaderStore";
// import albumStore from '../stores/albumStore'; // ודא שיש לך את הסטור הזה
// import { Photo } from '../models/Photo';
// import { SelectChangeEvent } from '@mui/material'; // ודא שאתה מייבא את SelectChangeEvent

// const theme = createTheme();

// const GetPhotos: React.FC = observer(() => {
//     const { albumId: currentAlbumId } = useParams<{ albumId: string }>();
//     const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const userData = sessionStorage.getItem("user");
//     const user = userData ? JSON.parse(userData) : null;
//     const userId = user ? user.user.id : null;
//     const [copyMoveTargetAlbumId, setCopyMoveTargetAlbumId] = useState<number | ''>('');
//     const [selectedPhotoIdForOperation, setSelectedPhotoIdForOperation] = useState<number | null>(null);
//     const [isCopyMoveDialogOpen, setIsCopyMoveDialogOpen] = useState(false);
//     const [isCopyOperation, setIsCopyOperation] = useState(false);

//     useEffect(() => {
//         if (currentAlbumId) {
//             photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId));
//         }
//         if (userId) {
//             albumStore.fetchAlbums(userId);
//         }
//     }, [currentAlbumId, userId]);

//     const handlePhotoClick = (index: number) => {
//         setSelectedPhotoIndex(index);
//         setZoomLevel(1);
//     };

//     const handleCloseModal = () => {
//         setSelectedPhotoIndex(null);
//         setZoomLevel(1);
//     };

//     const handleZoomIn = () => {
//         setZoomLevel(prevZoom => Math.min(prevZoom * 1.5, 3));
//     };

//     const handleZoomOut = () => {
//         setZoomLevel(prevZoom => Math.max(prevZoom / 1.5, 1));
//     };

//     const handleNextPhoto = () => {
//         if (selectedPhotoIndex !== null) {
//             const nextIndex = (selectedPhotoIndex + 1) % photoUploadStore.photos.length;
//             setSelectedPhotoIndex(nextIndex);
//             setZoomLevel(1);
//         }
//     };

//     const handlePrevPhoto = () => {
//         if (selectedPhotoIndex !== null) {
//             const prevIndex = (selectedPhotoIndex - 1 + photoUploadStore.photos.length) % photoUploadStore.photos.length;
//             setSelectedPhotoIndex(prevIndex);
//             setZoomLevel(1);
//         }
//     };

//     const handleDownload = async (photo: { photoName: string, photoPath: string }) => {
//         try {
//             const downloadUrl = await photoUploadStore.getDownloadUrl(photo.photoName);
//             if (downloadUrl) {
//                 const response = await fetch(downloadUrl);
//                 const blob = await response.blob();
//                 const link = document.createElement('a');
//                 link.href = window.URL.createObjectURL(blob);
//                 link.download = photo.photoName;
//                 document.body.appendChild(link);
//                 link.click();
//                 document.body.removeChild(link);
//                 window.URL.revokeObjectURL(link.href);
//             }
//         } catch (error) {
//             console.error('שגיאה בהורדת התמונה:', error);
//             alert('שגיאה בהורדת התמונה');
//         }
//     };

//     const handleDelete = async (photoId: number) => {
//         try {
//             photoUploadStore.photos = photoUploadStore.photos.filter(photo => photo.id !== photoId);
//             await photoUploadStore.deletePhoto(photoId);
//         } catch (error) {
//             console.error('שגיאה במחיקת התמונה:', error);
//             alert('שגיאה במחיקת התמונה');
//         }
//     };

//     const openCopyMoveDialog = (photoId: number, isCopy: boolean) => {
//         setSelectedPhotoIdForOperation(photoId);
//         setIsCopyOperation(isCopy);
//         setCopyMoveTargetAlbumId('');
//         setIsCopyMoveDialogOpen(true);
//     };

//     const closeCopyMoveDialog = () => {
//         setIsCopyMoveDialogOpen(false);
//         setSelectedPhotoIdForOperation(null);
//         setIsCopyOperation(false);
//         setCopyMoveTargetAlbumId('');
//     };

//     const handleCopyMoveTargetAlbumChange = (event: SelectChangeEvent<number>) => {
//         setCopyMoveTargetAlbumId(event.target.value as number);
//     };

//     const handleCopyMovePhoto = async () => {
//         if (!selectedPhotoIdForOperation || !copyMoveTargetAlbumId) {
//             alert('נא לבחור אלבום יעד.');
//             return;
//         }
//         try {
//             const targetAlbumId = Number(copyMoveTargetAlbumId);
//             if (isCopyOperation) {
//                 await photoUploadStore.copyPhotoToAlbum(selectedPhotoIdForOperation, targetAlbumId);
//                 alert('התמונה הועתקה בהצלחה.');
//             } else {
//                 if (currentAlbumId === null) {
//                     alert('לא ניתן להעביר תמונה מחוץ לאלבום.');
//                     return;
//                 }
//                 await photoUploadStore.movePhotoToAlbum(selectedPhotoIdForOperation, Number(currentAlbumId), targetAlbumId);
//                 alert('התמונה הועברה בהצלחה.');
//                 if (currentAlbumId) {
//                     photoUploadStore.fetchPhotosByAlbumId(Number(currentAlbumId)); // רענון התמונות באלבום הנוכחי
//                 }
//             }
//             closeCopyMoveDialog();
//         } catch (error) {
//             console.error('שגיאה בפעולת העתקה/העברה:', error);
//             alert('שגיאה בפעולת העתקה/העברה.');
//         }
//     };

//     if (photoUploadStore.error) return <div>שגיאה: {photoUploadStore.error}</div>;
//     if (!photoUploadStore.photos || photoUploadStore.photos.length === 0) {
//         return <div>אין תמונות להצגה</div>;
//     }

//     return (
//         <ThemeProvider theme={theme}>
//             <Box sx={{
//                 padding: 3,
//                 backgroundColor: '#f5f5f5',
//                 minHeight: '100vh'
//             }}>
//                 <Typography
//                     variant="h4"
//                     sx={{
//                         marginBottom: 3,
//                         textAlign: "center",
//                         fontWeight: 'bold',
//                         color: '#333'
//                     }}
//                 >
//                     התמונות שלי
//                 </Typography>
//                 <Box
//                     sx={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//                         gap: 3,
//                         justifyContent: "center",
//                     }}
//                 >
//                     {photoUploadStore.photos.map((photo: Photo, index) => (
//                         <Paper
//                             key={photo.id!}
//                             sx={{
//                                 padding: 2,
//                                 textAlign: "center",
//                                 position: 'relative',
//                                 borderRadius: 3,
//                                 transition: "all 0.3s ease",
//                                 boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//                                 "&:hover": {
//                                     transform: "scale(1.05)",
//                                     boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
//                                 },
//                             }}
//                         >
//                             <img
//                                 src={photo.photoPath}
//                                 alt={photo.photoName}
//                                 onClick={() => handlePhotoClick(index)}
//                                 style={{
//                                     maxHeight: 200,
//                                     maxWidth: "100%",
//                                     objectFit: "cover",
//                                     borderRadius: 12,
//                                     cursor: 'pointer'
//                                 }}
//                             />
//                             <Box sx={{
//                                 position: 'absolute',
//                                 bottom: 10,
//                                 left: 10,
//                                 right: 10,
//                                 display: 'flex',
//                                 justifyContent: 'space-around',
//                                 alignItems: 'center',
//                             }}>
//                                 <Tooltip title="העתק תמונה">
//                                     <IconButton onClick={() => openCopyMoveDialog(photo.id!, true)}>
//                                         <FileCopyIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="העבר תמונה">
//                                     <IconButton onClick={() => openCopyMoveDialog(photo.id!, false)}>
//                                         <DriveFileMoveIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="הורדת תמונה">
//                                     <IconButton onClick={() => handleDownload({ ...photo, photoPath: photo.photoPath ?? '' })}>                                        <DownloadIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                                 <Tooltip title="מחק תמונה">
//                                     <IconButton onClick={() => handleDelete(photo.id!)}>
//                                         <DeleteIcon />
//                                     </IconButton>
//                                 </Tooltip>
//                             </Box>
//                         </Paper>
//                     ))}
//                 </Box>

//                 {/* Modal for Copy/Move */}
//                 <Modal open={isCopyMoveDialogOpen} onClose={closeCopyMoveDialog}>
//                     <Box sx={{
//                         position: 'absolute',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         width: 400,
//                         bgcolor: 'background.paper',
//                         border: '2px solid #000',
//                         boxShadow: 24,
//                         p: 4,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: 2,
//                     }}>
//                         <Typography variant="h6" component="h2">
//                             {isCopyOperation ? 'העתקת תמונה' : 'העברת תמונה'}
//                         </Typography>
//                         <FormControl fullWidth>
//                             <InputLabel id="select-album-label">בחר אלבום יעד</InputLabel>
//                             <Select
//                                 labelId="select-album-label"
//                                 id="select-album"
//                                 value={copyMoveTargetAlbumId}
//                                 label="בחר אלבום יעד"
//                                 onChange={handleCopyMoveTargetAlbumChange}
//                             >
//                                 {albumStore.albums && albumStore.albums.map((album) => (
//                                     <MenuItem key={album.id} value={album.id}>
//                                         {album.albumName}
//                                     </MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <Box sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
//                             <button onClick={handleCopyMovePhoto}>
//                                 {isCopyOperation ? 'העתקה' : 'העברה'}
//                             </button>
//                             <button onClick={closeCopyMoveDialog}>ביטול</button>
//                         </Box>
//                     </Box>
//                 </Modal>

//                 {/* Modal for enlarged image */}
//                 {selectedPhotoIndex !== null && photoUploadStore.photos[selectedPhotoIndex] && (
//                     <Modal
//                         open={selectedPhotoIndex !== null}
//                         onClose={handleCloseModal}
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             justifyContent: 'center',
//                         }}
//                     >
//                         <Box
//                             sx={{
//                                 position: 'relative',
//                                 maxWidth: '90vw',
//                                 maxHeight: '90vh',
//                                 display: 'flex',
//                                 flexDirection: 'column',
//                                 alignItems: 'center',
//                             }}
//                         >
//                             <IconButton
//                                 onClick={handleCloseModal}
//                                 sx={{
//                                     position: 'absolute',
//                                     top: 10,
//                                     right: 10,
//                                     zIndex: 1000,
//                                     backgroundColor: 'rgba(255,255,255,0.7)',
//                                     '&:hover': {
//                                         backgroundColor: 'rgba(255,255,255,0.9)',
//                                     }
//                                 }}
//                             >
//                                 <CloseIcon />
//                             </IconButton>

//                             <Box sx={{
//                                 position: 'absolute',
//                                 top: '50%',
//                                 left: 10,
//                                 transform: 'translateY(-50%)',
//                                 zIndex: 1000,
//                             }}>
//                                 <IconButton
//                                     onClick={handlePrevPhoto}
//                                     sx={{
//                                         backgroundColor: 'rgba(255,255,255,0.7)',
//                                         margin: 1,
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255,255,255,0.9)',
//                                         }
//                                     }}
//                                 >
//                                     <ArrowBackIosIcon />
//                                 </IconButton>
//                             </Box>

//                             <Box sx={{
//                                 position: 'absolute',
//                                 top: '50%',
//                                 right: 10,
//                                 transform: 'translateY(-50%)',
//                                 zIndex: 1000,
//                             }}>
//                                 <IconButton
//                                     onClick={handleNextPhoto}
//                                     sx={{
//                                         backgroundColor: 'rgba(255,255,255,0.7)',
//                                         margin: 1,
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255,255,255,0.9)',
//                                         }
//                                     }}
//                                 >
//                                     <ArrowForwardIosIcon />
//                                 </IconButton>
//                             </Box>

//                             <Box sx={{
//                                 position: 'absolute',
//                                 bottom: 10,
//                                 left: '50%',
//                                 transform: 'translateX(-50%)',
//                                 zIndex: 1000,
//                                 display: 'flex',
//                                 gap: 2,
//                             }}>
//                                 <IconButton
//                                     onClick={handleZoomOut}
//                                     sx={{
//                                         backgroundColor: 'rgba(255,255,255,0.7)',
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255,255,255,0.9)',
//                                         }
//                                     }}
//                                 >
//                                     <ZoomOutIcon />
//                                 </IconButton>
//                                 <IconButton
//                                     onClick={handleZoomIn}
//                                     sx={{
//                                         backgroundColor: 'rgba(255,255,255,0.7)',
//                                         '&:hover': {
//                                             backgroundColor: 'rgba(255,255,255,0.9)',
//                                         }
//                                     }}
//                                 >
//                                     <ZoomInIcon />
//                                 </IconButton>
//                             </Box>

//                             <img
//                                 src={photoUploadStore.photos[selectedPhotoIndex].photoPath}
//                                 alt="Enlarged"
//                                 style={{
//                                     maxWidth: '90vw',
//                                     maxHeight: '90vh',
//                                     objectFit: 'contain',
//                                     transform: `scale(${zoomLevel})`,
//                                     transition: 'transform 0.3s ease',
//                                 }}
//                             />
//                         </Box>
//                     </Modal>
//                 )}
//             </Box>
//         </ThemeProvider>
//     );
// });

// export default GetPhotos;