// // // "use client"

// // import { observer } from "mobx-react-lite"
// // import type React from "react"
// // import { useEffect, useState } from "react"
// // import { useNavigate } from "react-router-dom"
// // import albumStore from "../stores/albumStore"
// // import photoUploadStore from "../stores/photoUploaderStore"
// // import CreateNewAlbum from "./CreateNewAlbum"
// // import type { Album } from "../models/Album"
// // import userStore from "../stores/userStore"
// // import {
// //   Box,
// //   Button,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   IconButton,
// //   Typography,
// //   TextField,
// //   Container,
// //   Grid,
// //   Card,
// //   CardContent,
// //   CardActions,
// //   InputAdornment,
// //   Skeleton,
// //   Menu,
// //   MenuItem,
// //   ListItemIcon,
// //   ListItemText,
// //   Fab,
// //   Divider,
// //   Chip,
// //   Alert,
// //   Snackbar,
// //   Fade,
// //   CircularProgress,
// // } from "@mui/material"
// // import {
// //   Add,
// //   Search,
// //   Edit,
// //   Delete,
// //   Folder,
// //   MoreVert,
// //   SortByAlpha,
// //   PhotoLibrary,
// //   Info,
// //   Share,
// //   ArrowUpward,
// //   ArrowDownward,
// //   Close,
// // } from "@mui/icons-material"
// // import { motion, AnimatePresence } from "framer-motion"

// // const UserAlbums: React.FC = () => {
// //   const navigate = useNavigate()
// //   const userId = userStore.user?.user?.id ?? null
// //   const [loading, setLoading] = useState<boolean>(true)
// //   const [error, setError] = useState<string | null>(null)
// //   const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
// //   const [openEditModal, setOpenEditModal] = useState<boolean>(false)
// //   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
// //   const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
// //   const [newAlbumName, setNewAlbumName] = useState<string>("")
// //   const [newAlbumDescription, setNewAlbumDescription] = useState<string>("")
// //   const [searchTerm, setSearchTerm] = useState<string>("")
// //   const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({})
// //   const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
// //   const [sortBy, setSortBy] = useState<string>("name")
// //   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
// //   const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
// //     show: false,
// //     message: "",
// //     type: "success",
// //   })
// //   const [photoCounts, setPhotoCounts] = useState<{ [key: number]: number }>({})
// //   const [isLoading, setIsLoading] = useState<boolean>(false)

// //   useEffect(() => {
// //     const fetchAlbumsAndPhotos = async () => {
// //       if (userId) {
// //         try {
// //           setLoading(true)
// //           await albumStore.fetchAlbums(userId)

// //           const counts: { [key: number]: number } = {}
// //           for (const album of albumStore.albums) {
// //             if (!album.id) continue
// //             const count = await photoUploadStore.fetchPhotosByAlbumId(album.id)
// //             counts[album.id] = count
// //           }
// //           setPhotoCounts(counts)
// //           setLoading(false)
// //         } catch (err: any) {
// //           setError(err.message)
// //           setLoading(false)
// //         }
// //       }
// //     }
// //     fetchAlbumsAndPhotos()
// //   }, [userId])

// //   const handleAlbumClick = (albumId: number) => {
// //     navigate(`/personal-area/get-photos/${albumId}`)
// //   }

// //   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, albumId: number) => {
// //     event.stopPropagation()
// //     setMenuAnchorEl({ ...menuAnchorEl, [albumId]: event.currentTarget })
// //   }

// //   const handleMenuClose = (albumId: number) => {
// //     setMenuAnchorEl({ ...menuAnchorEl, [albumId]: null })
// //   }

// //   const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
// //     setSortAnchorEl(event.currentTarget)
// //   }

// //   const handleSortMenuClose = () => {
// //     setSortAnchorEl(null)
// //   }

// //   const handleSortChange = (sortType: string) => {
// //     if (sortBy === sortType) {
// //       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
// //     } else {
// //       setSortBy(sortType)
// //       setSortDirection("asc")
// //     }
// //     handleSortMenuClose()
// //   }

// //   const handleEditAlbum = (album: Album) => {
// //     setSelectedAlbum(album)
// //     setNewAlbumName(album.albumName || "")
// //     setNewAlbumDescription(album.description || "")
// //     setOpenEditModal(true)
// //     handleMenuClose(album.id!)
// //   }

// //   const handleDeleteAlbum = (album: Album) => {
// //     setSelectedAlbum(album)
// //     setOpenDeleteModal(true)
// //     handleMenuClose(album.id!)
// //   }

// //   const handleUpdateAlbum = async () => {
// //     if (!selectedAlbum || !newAlbumName.trim()) {
// //       showNotification("שם האלבום לא יכול להיות ריק", "error")
// //       return
// //     }

// //     setIsLoading(true)

// //     try {
// //       const updatedAlbum: Album = {
// //         id: selectedAlbum.id,
// //         albumName: newAlbumName.trim(),
// //         userId: userId,
// //         description: newAlbumDescription.trim(),
// //         createdAt: selectedAlbum.createdAt,
// //       }

// //       await albumStore.updateAlbum(updatedAlbum)
// //       setOpenEditModal(false)
// //       setSelectedAlbum(null)
// //       setNewAlbumName("")
// //       setNewAlbumDescription("")
// //       showNotification("האלבום עודכן בהצלחה", "success")
// //     } catch (err: any) {
// //       setError(err.message)
// //       showNotification("שגיאה בעדכון האלבום", "error")
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleConfirmDelete = async () => {
// //     if (!selectedAlbum) return

// //     try {
// //       await albumStore.deleteAlbum(selectedAlbum.id!)
// //       setOpenDeleteModal(false)
// //       setSelectedAlbum(null)
// //       showNotification("האלבום נמחק בהצלחה", "success")
// //     } catch (err: any) {
// //       setError(err.message)
// //       showNotification("שגיאה במחיקת האלבום", "error")
// //     }
// //   }

// //   const showNotification = (message: string, type: "success" | "error") => {
// //     setNotification({
// //       show: true,
// //       message,
// //       type,
// //     })
// //   }

// //   const getSortedAlbums = () => {
// //     if (!albumStore.albums || albumStore.albums.length === 0) return []

// //     return [...albumStore.albums].sort((a, b) => {
// //       let comparison = 0

// //       switch (sortBy) {
// //         case "name":
// //           comparison = a.albumName.localeCompare(b.albumName)
// //           break
// //         case "date":
// //           comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
// //           break
// //         default:
// //           comparison = 0
// //       }

// //       return sortDirection === "asc" ? comparison : -comparison
// //     })
// //   }

// //   const filteredAlbums = getSortedAlbums().filter((album) =>
// //     album.albumName.toLowerCase().includes(searchTerm.toLowerCase()),
// //   )

// //   const container = {
// //     hidden: { opacity: 0 },
// //     show: {
// //       opacity: 1,
// //       transition: {
// //         staggerChildren: 0.05,
// //       },
// //     },
// //   }

// //   const item = {
// //     hidden: { opacity: 0, y: 20 },
// //     show: { opacity: 1, y: 0 },
// //   }

// //   if (loading) {
// //     return (
// //       <Box
// //         sx={{
// //           background: 'linear-gradient(135deg, #ff7043 0%, #ff5722 25%, #e64a19 50%, #d84315 75%, #bf360c 100%)',
// //           minHeight: "100vh",
// //           position: "relative",
// //           "&::before": {
// //             content: '""',
// //             position: "absolute",
// //             top: 0,
// //             left: 0,
// //             right: 0,
// //             bottom: 0,
// //             background: 'radial-gradient(circle at 20% 50%, rgba(0, 191, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 140, 0, 0.3) 0%, transparent 50%)',
// //             animation: 'pulse 4s ease-in-out infinite alternate',
// //           },
// //         }}
// //       >
// //         <style>
// //           {`
// //             @keyframes pulse {
// //               0% { opacity: 0.7; }
// //               100% { opacity: 1; }
// //             }
// //           `}
// //         </style>
// //         <Container maxWidth="lg" sx={{ py: 8, mt: 8, position: "relative", zIndex: 1 }}>
// //           <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //             <Skeleton 
// //               variant="text" 
// //               width={300} 
// //               height={40} 
// //               sx={{ 
// //                 bgcolor: 'rgba(255, 255, 255, 0.3)',
// //                 borderRadius: 2,
// //               }} 
// //             />
// //             <Skeleton 
// //               variant="rectangular" 
// //               width={120} 
// //               height={36} 
// //               sx={{ 
// //                 borderRadius: 3,
// //                 bgcolor: 'rgba(255, 255, 255, 0.3)',
// //               }} 
// //             />
// //           </Box>
// //           <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
// //             <Skeleton 
// //               variant="rectangular" 
// //               width={300} 
// //               height={40} 
// //               sx={{ 
// //                 borderRadius: 3,
// //                 bgcolor: 'rgba(255, 255, 255, 0.3)',
// //               }} 
// //             />
// //             <Skeleton 
// //               variant="rectangular" 
// //               width={100} 
// //               height={36} 
// //               sx={{ 
// //                 borderRadius: 3,
// //                 bgcolor: 'rgba(255, 255, 255, 0.3)',
// //               }} 
// //             />
// //           </Box>
// //           <Grid container spacing={3}>
// //             {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
// //               <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
// //                 <Skeleton 
// //                   variant="rectangular" 
// //                   width="100%" 
// //                   height={200} 
// //                   sx={{ 
// //                     borderRadius: 3,
// //                     bgcolor: 'rgba(255, 255, 255, 0.3)',
// //                   }} 
// //                 />
// //                 <Skeleton 
// //                   variant="text" 
// //                   width="60%" 
// //                   height={24} 
// //                   sx={{ 
// //                     mt: 1,
// //                     bgcolor: 'rgba(255, 255, 255, 0.3)',
// //                     borderRadius: 1,
// //                   }} 
// //                 />
// //                 <Skeleton 
// //                   variant="text" 
// //                   width="40%" 
// //                   height={20} 
// //                   sx={{ 
// //                     mt: 0.5,
// //                     bgcolor: 'rgba(255, 255, 255, 0.3)',
// //                     borderRadius: 1,
// //                   }} 
// //                 />
// //               </Grid>
// //             ))}
// //           </Grid>
// //         </Container>
// //       </Box>
// //     )
// //   }

// //   return (
// //     <Box 
// //       sx={{ 
// //         background: 'white',
// //         minHeight: "100vh", 
// //         pt: 1, 
// //         pb: 8,
// //         position: "relative",
// //         "&::before": {
// //           content: '""',
// //           position: "absolute",
// //           top: 0,
// //           left: 0,
// //           right: 0,
// //           bottom: 0,
// //           background: 'radial-gradient(circle at 20% 50%, rgba(0, 191, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 229, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 140, 0, 0.3) 0%, transparent 50%)',
// //           animation: 'pulse 4s ease-in-out infinite alternate',
// //         },
// //       }}
// //     >
// //       <style>
// //         {`
// //           @keyframes pulse {
// //             0% { opacity: 0.7; }
// //             100% { opacity: 1; }
// //           }
// //           @keyframes float {
// //             0%, 100% { transform: translateY(0px); }
// //             50% { transform: translateY(-10px); }
// //           }
// //           @keyframes glow {
// //             0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(255, 140, 0, 0.2); }
// //             50% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.5), 0 0 60px rgba(255, 140, 0, 0.3); }
// //           }
// //           @keyframes shimmer {
// //             0% { background-position: -200% 0; }
// //             100% { background-position: 200% 0; }
// //           }
// //         `}
// //       </style>
// //       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
// //         <Box
// //           component={motion.div}
// //           initial={{ opacity: 0, y: -20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.3 }}
// //           sx={{ mb: 4 }}
// //         >
// //           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
// //             <Typography 
// //               variant="h4" 
// //               sx={{ 
// //                 fontWeight: "bold", 
// //                 color: "white",
// //                 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
// //                 background: 'linear-gradient(45deg,rgb(252, 77, 23), #00b4ff)',
// //                 backgroundClip: 'text',
// //                 WebkitBackgroundClip: 'text',
// //                 WebkitTextFillColor: 'transparent',
// //                 filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
// //               }}
// //             >
// //               האלבומים שלי
// //             </Typography>

// //             <Button
// //               variant="contained"
// //               startIcon={<Add />}
// //               onClick={() => setOpenCreateModal(true)}
// //               sx={{ 
// //                 px: 3, 
// //                 py: 1.5, 
// //                 borderRadius: 3,
// //                 background: 'linear-gradient(45deg,rgb(252, 77, 23), #00b4ff)',
// //                 color: 'white',
// //                 fontWeight: 'bold',
// //                 fontSize: '1rem',
// //                 boxShadow: '0 8px 20px rgba(0, 180, 255, 0.4)',
// //                 border: '2px solid rgba(255, 255, 255, 0.3)',
// //                 backdropFilter: 'blur(10px)',
// //                 animation: 'glow 3s ease-in-out infinite',
// //                 transition: 'all 0.3s ease',
// //                 '&:hover': {
// //                   background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
// //                   transform: 'translateY(-2px) scale(1.05)',
// //                   boxShadow: '0 12px 30px rgba(0, 180, 255, 0.6)',
// //                 },
// //                 '&:active': {
// //                   transform: 'translateY(0) scale(1.02)',
// //                 },
// //               }}
// //             >
// //               אלבום חדש
// //             </Button>
// //           </Box>

// //           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
// //             <TextField
// //               variant="outlined"
// //               placeholder="חיפוש אלבומים..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               size="medium"
// //               sx={{
// //                 width: { xs: "100%", sm: 350 },
// //                 '& .MuiOutlinedInput-root': {
// //                   background: 'rgba(240, 87, 5, 0.15)',
// //                   backdropFilter: 'blur(20px)',
// //                   borderRadius: 3,
// //                   border: '2px solid #ff7632',
// //                   color: 'white',
// //                   fontSize: '1.1rem',
// //                   transition: 'all 0.3s ease',
// //                   '&:hover': {
// //                     background: 'rgba(255, 255, 255, 0.2)',
// //                     border: '2px solid rgba(0, 229, 255, 0.5)',
// //                     transform: 'translateY(-2px)',
// //                     boxShadow: '0 8px 25px rgba(0, 180, 255, 0.3)',
// //                   },
// //                   '&.Mui-focused': {
// //                     background: 'rgba(255, 255, 255, 0.25)',
// //                     border: '2px solid #00e5ff',
// //                     boxShadow: '0 0 20px rgba(0, 229, 255, 0.5)',
// //                   },
// //                   '& fieldset': {
// //                     border: 'none',
// //                   },
// //                   '& input': {
// //                     color: 'white',
// //                     '&::placeholder': {
// //                       color: 'rgba(0, 0, 0, 0.7)',
// //                     },
// //                   },
// //                 },
// //               }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <Search sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
// //                   </InputAdornment>
// //                 ),
// //                 endAdornment: searchTerm && (
// //                   <InputAdornment position="end">
// //                     <IconButton 
// //                       size="small" 
// //                       onClick={() => setSearchTerm("")} 
// //                       edge="end"
// //                       sx={{
// //                         color: 'rgba(255, 255, 255, 0.8)',
// //                         '&:hover': {
// //                           background: 'rgba(255, 255, 255, 0.2)',
// //                         },
// //                       }}
// //                     >
// //                       <Close fontSize="small" />
// //                     </IconButton>
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <Box>
// //               <Button
// //                 variant="outlined"
// //                 startIcon={sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
// //                 endIcon={<SortByAlpha />}
// //                 onClick={handleSortMenuOpen}
// //                 size="medium"
// //                 sx={{ 
// //                   borderRadius: 3,
// //                   background: 'rgba(255, 255, 255, 0.15)',
// //                   backdropFilter: 'blur(20px)',
// //                   border: '2px solid rgba(255, 255, 255, 0.3)',
// //                   color: 'white',
// //                   fontWeight: 'bold',
// //                   px: 3,
// //                   py: 1,
// //                   transition: 'all 0.3s ease',
// //                   '&:hover': {
// //                     background: 'rgba(255, 255, 255, 0.25)',
// //                     border: '2px solid rgba(0, 229, 255, 0.5)',
// //                     transform: 'translateY(-2px)',
// //                     boxShadow: '0 8px 25px rgba(0, 180, 255, 0.3)',
// //                   },
// //                 }}
// //               >
// //                 {sortBy === "name" ? "מיון לפי שם" : "מיון לפי תאריך"}
// //               </Button>
// //               <Menu 
// //                 anchorEl={sortAnchorEl} 
// //                 open={Boolean(sortAnchorEl)} 
// //                 onClose={handleSortMenuClose}
// //                 PaperProps={{
// //                   sx: {
// //                     background: 'rgba(255, 255, 255, 0.15)',
// //                     backdropFilter: 'blur(20px)',
// //                     border: '1px solid rgba(255, 255, 255, 0.3)',
// //                     borderRadius: 2,
// //                     mt: 1,
// //                   },
// //                 }}
// //               >
// //                 <MenuItem 
// //                   onClick={() => handleSortChange("name")} 
// //                   selected={sortBy === "name"}
// //                   sx={{ 
// //                     color: 'white',
// //                     '&:hover': {
// //                       background: 'rgba(0, 229, 255, 0.2)',
// //                     },
// //                     '&.Mui-selected': {
// //                       background: 'rgba(0, 229, 255, 0.3)',
// //                     },
// //                   }}
// //                 >
// //                   <ListItemIcon>
// //                     <SortByAlpha fontSize="small" sx={{ color: 'white' }} />
// //                   </ListItemIcon>
// //                   <ListItemText>לפי שם</ListItemText>
// //                 </MenuItem>
// //                 <MenuItem 
// //                   onClick={() => handleSortChange("date")} 
// //                   selected={sortBy === "date"}
// //                   sx={{ 
// //                     color: 'white',
// //                     '&:hover': {
// //                       background: 'rgba(0, 229, 255, 0.2)',
// //                     },
// //                     '&.Mui-selected': {
// //                       background: 'rgba(0, 229, 255, 0.3)',
// //                     },
// //                   }}
// //                 >
// //                   <ListItemIcon>
// //                     <PhotoLibrary fontSize="small" sx={{ color: 'white' }} />
// //                   </ListItemIcon>
// //                   <ListItemText>לפי תאריך</ListItemText>
// //                 </MenuItem>
// //                 <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
// //                 <MenuItem 
// //                   onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
// //                   sx={{ 
// //                     color: 'white',
// //                     '&:hover': {
// //                       background: 'rgba(0, 229, 255, 0.2)',
// //                     },
// //                   }}
// //                 >
// //                   <ListItemIcon>
// //                     {sortDirection === "asc" ? 
// //                       <ArrowUpward fontSize="small" sx={{ color: 'white' }} /> : 
// //                       <ArrowDownward fontSize="small" sx={{ color: 'white' }} />
// //                     }
// //                   </ListItemIcon>
// //                   <ListItemText>{sortDirection === "asc" ? "סדר עולה" : "סדר יורד"}</ListItemText>
// //                 </MenuItem>
// //               </Menu>
// //             </Box>
// //           </Box>

// //           {error && (
// //             <Alert 
// //               severity="error" 
// //               sx={{ 
// //                 mb: 4,
// //                 background: 'rgba(255, 82, 82, 0.2)',
// //                 backdropFilter: 'blur(10px)',
// //                 border: '1px solid rgba(255, 82, 82, 0.3)',
// //                 color: 'white',
// //                 borderRadius: 2,
// //                 '& .MuiAlert-icon': {
// //                   color: '#ff5252',
// //                 },
// //               }}
// //             >
// //               {error}
// //             </Alert>
// //           )}

// //           {filteredAlbums.length === 0 ? (
// //             <Box 
// //               sx={{ 
// //                 textAlign: "center", 
// //                 py: 8,
// //                 background: 'rgba(255, 255, 255, 0.1)',
// //                 backdropFilter: 'blur(20px)',
// //                 borderRadius: 4,
// //                 border: '2px solid rgba(255, 255, 255, 0.2)',
// //               }}
// //             >
// //               <Folder sx={{ fontSize: 120, color: 'rgba(255, 255, 255, 0.6)', opacity: 0.8, mb: 2 }} />
// //               <Typography 
// //                 variant="h5" 
// //                 sx={{ 
// //                   mt: 2, 
// //                   mb: 3,
// //                   color: 'rgba(255, 255, 255, 0.9)',
// //                   fontWeight: 'bold',
// //                   textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
// //                 }}
// //               >
// //                 {searchTerm ? "לא נמצאו אלבומים התואמים את החיפוש" : "אין אלבומים להצגה"}
// //               </Typography>
// //               <Button 
// //                 variant="contained" 
// //                 startIcon={<Add />} 
// //                 onClick={() => setOpenCreateModal(true)} 
// //                 sx={{ 
// //                   mt: 2,
// //                   px: 4,
// //                   py: 1.5,
// //                   borderRadius: 3,
// //                   background: 'linear-gradient(45deg, #00e5ff, #00b4ff)',
// //                   color: 'white',
// //                   fontWeight: 'bold',
// //                   fontSize: '1.1rem',
// //                   boxShadow: '0 8px 20px rgba(0, 180, 255, 0.4)',
// //                   '&:hover': {
// //                     background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
// //                     transform: 'translateY(-2px) scale(1.05)',
// //                   },
// //                 }}
// //               >
// //                 צור אלבום חדש
// //               </Button>
// //             </Box>
// //           ) : (
// //             <Grid container spacing={4} component={motion.div} variants={container} initial="hidden" animate="show">
// //               <AnimatePresence>
// //                 {filteredAlbums.map((album, index) => (
// //                   <Grid item xs={12} sm={6} md={4} lg={3} key={album.id} component={motion.div} variants={item} layout>
// //                     <Card
// //                       sx={{
// //                         height: "100%",
// //                         display: "flex",
// //                         flexDirection: "column",
// //                         borderRadius: 4,
// //                         overflow: "hidden",
// //                         cursor: "pointer",
// //                         background: 'rgba(255, 255, 255, 0.15)',
// //                         backdropFilter: 'blur(20px)',
// //                         border: '2px solid rgba(255, 255, 255, 0.2)',
// //                         transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
// //                         animation: `float 6s ease-in-out infinite`,
// //                         animationDelay: `${index * 0.2}s`,
// //                         '&:hover': {
// //                           transform: 'translateY(-15px) scale(1.03)',
// //                           background: 'rgba(255, 255, 255, 0.25)',
// //                           border: '2px solid rgba(0, 229, 255, 0.5)',
// //                           boxShadow: '0 20px 40px rgba(0, 180, 255, 0.3), 0 0 20px rgba(255, 140, 0, 0.2)',
// //                         },
// //                       }}
// //                       onClick={() => {
// //                         if (album.id !== undefined) {
// //                           handleAlbumClick(album.id)
// //                         }
// //                       }}
// //                     >
// //                       <Box
// //                         sx={{
// //                           height: 160,
// //                           background: 'linear-gradient(135deg,rgba(0, 229, 255, 0.6) 0%,rgba(28, 185, 253, 0.55) 50%,rgba(0, 128, 255, 0.52) 100%)',
// //                           display: "flex",
// //                           alignItems: "center",
// //                           justifyContent: "center",
// //                           position: "relative",
// //                           overflow: "hidden",
// //                           '&::before': {
// //                             content: '""',
// //                             position: 'absolute',
// //                             top: 0,
// //                             left: 0,
// //                             right: 0,
// //                             bottom: 0,
// //                             background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
// //                             backgroundSize: '200% 200%',
// //                             animation: 'shimmer 3s infinite',
// //                           },
// //                         }}
// //                       >
// //                         <Folder 
// //                           sx={{ 
// //                             fontSize: 90, 
// //                             color: 'rgba(255, 255, 255, 0.9)',
// //                             filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
// //                             zIndex: 1,
// //                           }} 
// //                         />
// //                         <Box
// //                           sx={{
// //                             position: "absolute",
// //                             top: 12,
// //                             right: 12,
// //                             zIndex: 2,
// //                           }}
// //                           onClick={(e) => e.stopPropagation()}
// //                         >
// //                           <IconButton
// //                             size="small"
// //                             sx={{
// //                               background: 'rgba(255, 255, 255, 0.2)',
// //                               backdropFilter: 'blur(10px)',
// //                               border: '1px solid rgba(255, 255, 255, 0.3)',
// //                               color: 'white',
// //                               transition: 'all 0.3s ease',
// //                               "&:hover": {
// //                                 background: 'rgba(255, 255, 255, 0.3)',
// //                                 transform: 'scale(1.1)',
// //                               },
// //                             }}
// //                             onClick={(e) => handleMenuOpen(e, album.id!)}
// //                           >
// //                             <MoreVert fontSize="small" />
// //                           </IconButton>
// //                           <Menu
// //                             id={`album-menu-${album.id}`}
// //                             anchorEl={menuAnchorEl[album.id!]}
// //                             keepMounted
// //                             open={Boolean(menuAnchorEl[album.id!])}
// //                             onClose={() => handleMenuClose(album.id!)}
// //                             PaperProps={{
// //                               sx: {
// //                                 background: 'rgba(255, 255, 255, 0.15)',
// //                                 backdropFilter: 'blur(20px)',
// //                                 border: '1px solid rgba(255, 255, 255, 0.3)',
// //                                 borderRadius: 2,
// //                                 mt: 1,
// //                               },
// //                             }}
// //                           >
// //                             <MenuItem 
// //                               onClick={() => handleEditAlbum(album)}
// //                               sx={{ 
// //                                 color: 'white',
// //                                 '&:hover': {
// //                                   background: 'rgba(8, 8, 8, 0.2)',
// //                                 },
// //                               }}
// //                             >
// //                               <ListItemIcon>
// //                                 <Edit fontSize="small" sx={{ color: 'white' }} />
// //                               </ListItemIcon>
// //                               <ListItemText>ערוך אלבום</ListItemText>
// //                             </MenuItem>
// //                             <MenuItem 
// //                               onClick={() => handleDeleteAlbum(album)}
// //                               sx={{ 
// //                                 color: 'white',
// //                                 '&:hover': {
// //                                   background: 'rgba(255, 82, 82, 0.2)',
// //                                 },
// //                               }}
// //                             >
// //                               <ListItemIcon>
// //                                 <Delete fontSize="small" sx={{ color: '#ff5252' }} />
// //                               </ListItemIcon>
// //                               <ListItemText>מחק אלבום</ListItemText>
// //                             </MenuItem>
// //                             <MenuItem
// //                               onClick={() => {
// //                                 handleMenuClose(album.id!)
// //                               }}
// //                               sx={{ 
// //                                 color: 'white',
// //                                 '&:hover': {
// //                                   background: 'rgba(0, 229, 255, 0.2)',
// //                                 },
// //                               }}
// //                             >
// //                               <ListItemIcon>
// //                                 <Share fontSize="small" sx={{ color: 'white' }} />
// //                               </ListItemIcon>
// //                               <ListItemText>שתף אלבום</ListItemText>
// //                             </MenuItem>
// //                             <MenuItem
// //                               onClick={() => {
// //                                 handleMenuClose(album.id!)
// //                               }}
// //                               sx={{ 
// //                                 color: 'white',
// //                                 '&:hover': {
// //                                   background: 'rgba(0, 229, 255, 0.2)',
// //                                 },
// //                               }}
// //                             >
// //                               <ListItemIcon>
// //                                 <Info fontSize="small" sx={{ color: 'white' }} />
// //                               </ListItemIcon>
// //                               <ListItemText>פרטי אלבום</ListItemText>
// //                             </MenuItem>
// //                           </Menu>
// //                         </Box>
// //                       </Box>

// //                       <CardContent sx={{ flexGrow: 1, pt: 3, pb: 2 }}>
// //                         <Typography 
// //                           variant="h6" 
// //                           component="h2" 
// //                           gutterBottom 
// //                           noWrap
// //                           sx={{
// //                             color: 'white',
// //                             fontWeight: 'bold',
// //                             fontSize: '1.2rem',
// //                             textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
// //                           }}
// //                         >
// //                           {album.albumName}
// //                         </Typography>
// //                         <Typography
// //                           variant="body2"
// //                           sx={{
// //                             color: 'rgba(255, 255, 255, 0.8)',
// //                             display: "-webkit-box",
// //                             WebkitLineClamp: 2,
// //                             WebkitBoxOrient: "vertical",
// //                             overflow: "hidden",
// //                             textOverflow: "ellipsis",
// //                             height: 40,
// //                             lineHeight: 1.5,
// //                           }}
// //                         >
// //                           {album.description || "אין תיאור"}
// //                         </Typography>
// //                       </CardContent>

// //                       <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
// //                         <Chip
// //                           icon={<PhotoLibrary fontSize="small" />}
// //                           label={`${photoCounts[album.id!] || 0} תמונות`}
// //                           size="small"
// //                           sx={{
// //                             background: 'rgba(255, 255, 255, 0.2)',
// //                             backdropFilter: 'blur(10px)',
// //                             border: '1px solid rgba(255, 255, 255, 0.3)',
// //                             color: 'white',
// //                             fontWeight: 'bold',
// //                             '& .MuiChip-icon': {
// //                               color: 'rgba(255, 255, 255, 0.9)',
// //                             },
// //                           }}
// //                         />
// //                         <Button
// //                           size="small"
// //                           variant="text"
// //                           onClick={(e) => {
// //                             e.stopPropagation()
// //                             if (album.id !== undefined) {
// //                               handleAlbumClick(album.id)
// //                             }
// //                           }}
// //                           sx={{
// //                             color: 'white',
// //                             fontWeight: 'bold',
// //                             background: 'rgba(0, 229, 255, 0.2)',
// //                             backdropFilter: 'blur(10px)',
// //                             border: '1px solid rgba(0, 229, 255, 0.3)',
// //                             borderRadius: 2,
// //                             px: 2,
// //                             transition: 'all 0.3s ease',
// //                             '&:hover': {
// //                               background: 'rgba(0, 229, 255, 0.3)',
// //                               transform: 'scale(1.05)',
// //                             },
// //                           }}
// //                         >
// //                           פתח
// //                         </Button>
// //                       </CardActions>
// //                     </Card>
// //                   </Grid>
// //                 ))}
// //               </AnimatePresence>
// //             </Grid>
// //           )}
// //         </Box>
// //       </Container>

// //       <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 24, right: 24 }}>
// //         <Fab 
// //           color="primary" 
// //           aria-label="add album" 
// //           onClick={() => setOpenCreateModal(true)}
// //           sx={{
// //             background: 'linear-gradient(45deg, #00e5ff, #00b4ff)',
// //             boxShadow: '0 8px 20px rgba(0, 180, 255, 0.4)',
// //             animation: 'glow 3s ease-in-out infinite',
// //             border: '2px solid rgba(255, 255, 255, 0.3)',
// //             '&:hover': {
// //               background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
// //               transform: 'scale(1.1)',
// //             },
// //           }}
// //         >
// //           <Add />
// //         </Fab>
// //       </Box>

// //       {openCreateModal && <CreateNewAlbum onClose={() => setOpenCreateModal(false)} />}

// //       <Dialog 
// //         open={openEditModal} 
// //         onClose={() => setOpenEditModal(false)} 
// //         maxWidth="sm" 
// //         fullWidth
// //         PaperProps={{
// //           sx: {
// //             background: 'rgba(255, 255, 255, 0.15)',
// //             backdropFilter: 'blur(20px)',
// //             border: '2px solid rgba(255, 255, 255, 0.3)',
// //             borderRadius: 3,
// //             color: 'white',
// //           },
// //         }}
// //       >
// //         <DialogTitle>
// //           <Box display="flex" justifyContent="space-between" alignItems="center">
// //             <Typography 
// //               variant="h6" 
// //               sx={{ 
// //                 color: 'white', 
// //                 fontWeight: 'bold',
// //                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
// //               }}
// //             >
// //               עריכת אלבום
// //             </Typography>
// //             <IconButton 
// //               onClick={() => setOpenEditModal(false)}
// //               sx={{
// //                 color: 'white',
// //                 '&:hover': {
// //                   background: 'rgba(255, 255, 255, 0.2)',
// //                 },
// //               }}
// //             >
// //               <Close />
// //             </IconButton>
// //           </Box>
// //         </DialogTitle>
// //         <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
// //           <Box sx={{ mb: 3 }}>
// //             <Typography 
// //               variant="subtitle1" 
// //               sx={{ 
// //                 mb: 1, 
// //                 color: 'white', 
// //                 fontWeight: 'bold',
// //               }}
// //             >
// //               שם האלבום
// //             </Typography>
// //             <TextField
// //               fullWidth
// //               value={newAlbumName}
// //               onChange={(e) => setNewAlbumName(e.target.value)}
// //               placeholder="הזן שם חדש לאלבום"
// //               required
// //               variant="outlined"
// //               sx={{
// //                 '& .MuiOutlinedInput-root': {
// //                   background: 'rgba(255, 255, 255, 0.15)',
// //                   backdropFilter: 'blur(10px)',
// //                   borderRadius: 2,
// //                   border: '1px solid rgba(255, 255, 255, 0.3)',
// //                   color: 'white',
// //                   '&:hover': {
// //                     border: '1px solid rgba(0, 229, 255, 0.5)',
// //                   },
// //                   '&.Mui-focused': {
// //                     border: '1px solid #00e5ff',
// //                     boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
// //                   },
// //                   '& fieldset': {
// //                     border: 'none',
// //                   },
// //                   '& input': {
// //                     color: 'white',
// //                     '&::placeholder': {
// //                       color: 'rgba(255, 255, 255, 0.7)',
// //                     },
// //                   },
// //                 },
// //               }}
// //             />
// //           </Box>
// //           <Box>
// //             <Typography 
// //               variant="subtitle1" 
// //               sx={{ 
// //                 mb: 1, 
// //                 color: 'white', 
// //                 fontWeight: 'bold',
// //               }}
// //             >
// //               תיאור האלבום
// //             </Typography>
// //             <TextField
// //               fullWidth
// //               value={newAlbumDescription}
// //               onChange={(e) => setNewAlbumDescription(e.target.value)}
// //               placeholder="הזן תיאור לאלבום (אופציונלי)"
// //               multiline
// //               rows={3}
// //               variant="outlined"
// //               sx={{
// //                 '& .MuiOutlinedInput-root': {
// //                   background: 'rgba(255, 255, 255, 0.15)',
// //                   backdropFilter: 'blur(10px)',
// //                   borderRadius: 2,
// //                   border: '1px solid rgba(255, 255, 255, 0.3)',
// //                   color: 'white',
// //                   '&:hover': {
// //                     border: '1px solid rgba(0, 229, 255, 0.5)',
// //                   },
// //                   '&.Mui-focused': {
// //                     border: '1px solid #00e5ff',
// //                     boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
// //                   },
// //                   '& fieldset': {
// //                     border: 'none',
// //                   },
// //                   '& textarea': {
// //                     color: 'white',
// //                     '&::placeholder': {
// //                       color: 'rgba(255, 255, 255, 0.7)',
// //                     },
// //                   },
// //                 },
// //               }}
// //             />
// //           </Box>
// //         </DialogContent>
// //         <DialogActions sx={{ p: 2 }}>
// //           <Button 
// //             variant="outlined" 
// //             onClick={() => setOpenEditModal(false)}
// //             sx={{
// //               color: 'white',
// //               border: '1px solid rgba(255, 255, 255, 0.3)',
// //               '&:hover': {
// //                 border: '1px solid rgba(255, 255, 255, 0.5)',
// //                 background: 'rgba(255, 255, 255, 0.1)',
// //               },
// //             }}
// //           >
// //             ביטול
// //           </Button>
// //           <Button
// //             variant="contained"
// //             onClick={handleUpdateAlbum}
// //             disabled={!newAlbumName.trim() || isLoading}
// //             startIcon={isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
// //             sx={{
// //               background: 'linear-gradient(45deg, #00e5ff, #00b4ff)',
// //               color: 'white',
// //               fontWeight: 'bold',
// //               '&:hover': {
// //                 background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
// //               },
// //               '&:disabled': {
// //                 background: 'rgba(255, 255, 255, 0.2)',
// //                 color: 'rgba(255, 255, 255, 0.5)',
// //               },
// //             }}
// //           >
// //             {isLoading ? "שומר..." : "שמור שינויים"}
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       <Dialog 
// //         open={openDeleteModal} 
// //         onClose={() => setOpenDeleteModal(false)} 
// //         maxWidth="xs" 
// //         fullWidth
// //         PaperProps={{
// //           sx: {
// //             background: 'rgba(255, 255, 255, 0.15)',
// //             backdropFilter: 'blur(20px)',
// //             border: '2px solid rgba(255, 255, 255, 0.3)',
// //             borderRadius: 3,
// //             color: 'white',
// //           },
// //         }}
// //       >
// //         <DialogTitle>
// //           <Box display="flex" justifyContent="space-between" alignItems="center">
// //             <Typography 
// //               variant="h6" 
// //               sx={{ 
// //                 color: 'white', 
// //                 fontWeight: 'bold',
// //                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
// //               }}
// //             >
// //               מחיקת אלבום
// //             </Typography>
// //             <IconButton 
// //               onClick={() => setOpenDeleteModal(false)}
// //               sx={{
// //                 color: 'white',
// //                 '&:hover': {
// //                   background: 'rgba(255, 255, 255, 0.2)',
// //                 },
// //               }}
// //             >
// //               <Close />
// //             </IconButton>
// //           </Box>
// //         </DialogTitle>
// //         <DialogContent>
// //           <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
// //             האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
// //             התמונות באלבום.
// //           </Typography>
// //         </DialogContent>
// //         <DialogActions sx={{ p: 2 }}>
// //           <Button 
// //             variant="outlined" 
// //             onClick={() => setOpenDeleteModal(false)}
// //             sx={{
// //               color: 'white',
// //               border: '1px solid rgba(255, 255, 255, 0.3)',
// //               '&:hover': {
// //                 border: '1px solid rgba(255, 255, 255, 0.5)',
// //                 background: 'rgba(255, 255, 255, 0.1)',
// //               },
// //             }}
// //           >
// //             ביטול
// //           </Button>
// //           <Button 
// //             variant="contained" 
// //             color="error" 
// //             onClick={handleConfirmDelete} 
// //             startIcon={<Delete />}
// //             sx={{
// //               background: 'linear-gradient(45deg, #ff5252, #f44336)',
// //               color: 'white',
// //               fontWeight: 'bold',
// //               '&:hover': {
// //                 background: 'linear-gradient(45deg, #f44336, #d32f2f)',
// //               },
// //             }}
// //           >
// //             מחק אלבום
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       <Snackbar
// //         open={notification.show}
// //         autoHideDuration={4000}
// //         onClose={() => setNotification({ ...notification, show: false })}
// //         TransitionComponent={Fade}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //       >
// //         <Alert
// //           severity={notification.type}
// //           variant="filled"
// //           onClose={() => setNotification({ ...notification, show: false })}
// //           sx={{
// //             background: notification.type === 'success' 
// //               ? 'linear-gradient(45deg, #4caf50, #66bb6a)' 
// //               : 'linear-gradient(45deg, #f44336, #ef5350)',
// //             color: 'white',
// //             fontWeight: 'bold',
// //             borderRadius: 2,
// //             backdropFilter: 'blur(10px)',
// //             border: '1px solid rgba(255, 255, 255, 0.3)',
// //           }}
// //         >
// //           {notification.message}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   )
// // }

// // export default observer(UserAlbums)





// "use client"

// import { observer } from "mobx-react-lite"
// import type React from "react"
// import { useEffect, useState } from "react"
// import { useNavigate } from "react-router-dom"
// import albumStore from "../stores/albumStore"
// import photoUploadStore from "../stores/photoUploaderStore"
// import CreateNewAlbum from "./CreateNewAlbum"
// import type { Album } from "../models/Album"
// import userStore from "../stores/userStore"
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Typography,
//   TextField,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   InputAdornment,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Fab,
//   Divider,
//   Chip,
//   Alert,
//   Snackbar,
//   Fade,
//   CircularProgress,
// } from "@mui/material"
// import {
//   Add,
//   Search,
//   Edit,
//   Delete,
//   Folder,
//   MoreVert,
//   SortByAlpha,
//   PhotoLibrary,
//   Info,
//   Share,
//   ArrowUpward,
//   ArrowDownward,
//   Close,
// } from "@mui/icons-material"
// import { motion, AnimatePresence } from "framer-motion"

// const UserAlbums: React.FC = () => {
//   const navigate = useNavigate()
//   const userId = userStore.user?.user?.id ?? null
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
//   const [openEditModal, setOpenEditModal] = useState<boolean>(false)
//   const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
//   const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
//   const [newAlbumName, setNewAlbumName] = useState<string>("")
//   const [newAlbumDescription, setNewAlbumDescription] = useState<string>("")
//   const [searchTerm, setSearchTerm] = useState<string>("")
//   const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: number]: HTMLElement | null }>({})
//   const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
//   const [sortBy, setSortBy] = useState<string>("name")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
//   const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
//     show: false,
//     message: "",
//     type: "success",
//   })
//   const [photoCounts, setPhotoCounts] = useState<{ [key: number]: number }>({})
//   const [isLoading, setIsLoading] = useState<boolean>(false)

//   useEffect(() => {
//     const fetchAlbumsAndPhotos = async () => {
//       if (userId) {
//         try {
//           setLoading(true)
//           await albumStore.fetchAlbums(userId)

//           const counts: { [key: number]: number } = {}
//           for (const album of albumStore.albums) {
//             if (!album.id) continue
//             const count = await photoUploadStore.fetchPhotosByAlbumId(album.id)
//             counts[album.id] = count
//           }
//           setPhotoCounts(counts)
//           setLoading(false)
//         } catch (err: any) {
//           setError(err.message)
//           setLoading(false)
//         }
//       }
//     }
//     fetchAlbumsAndPhotos()
//   }, [userId])

//   const handleAlbumClick = (albumId: number) => {
//     navigate(`/personal-area/get-photos/${albumId}`)
//   }

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, albumId: number) => {
//     event.stopPropagation()
//     setMenuAnchorEl({ ...menuAnchorEl, [albumId]: event.currentTarget })
//   }

//   const handleMenuClose = (albumId: number) => {
//     setMenuAnchorEl({ ...menuAnchorEl, [albumId]: null })
//   }

//   const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setSortAnchorEl(event.currentTarget)
//   }

//   const handleSortMenuClose = () => {
//     setSortAnchorEl(null)
//   }

//   const handleSortChange = (sortType: string) => {
//     if (sortBy === sortType) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc")
//     } else {
//       setSortBy(sortType)
//       setSortDirection("asc")
//     }
//     handleSortMenuClose()
//   }

//   const handleEditAlbum = (album: Album) => {
//     setSelectedAlbum(album)
//     setNewAlbumName(album.albumName || "")
//     setNewAlbumDescription(album.description || "")
//     setOpenEditModal(true)
//     handleMenuClose(album.id!)
//   }

//   const handleDeleteAlbum = (album: Album) => {
//     setSelectedAlbum(album)
//     setOpenDeleteModal(true)
//     handleMenuClose(album.id!)
//   }

//   const handleUpdateAlbum = async () => {
//     if (!selectedAlbum || !newAlbumName.trim()) {
//       showNotification("שם האלבום לא יכול להיות ריק", "error")
//       return
//     }

//     setIsLoading(true)

//     try {
//       const updatedAlbum: Album = {
//         id: selectedAlbum.id,
//         albumName: newAlbumName.trim(),
//         userId: userId,
//         description: newAlbumDescription.trim(),
//         createdAt: selectedAlbum.createdAt,
//       }

//       await albumStore.updateAlbum(updatedAlbum)
//       setOpenEditModal(false)
//       setSelectedAlbum(null)
//       setNewAlbumName("")
//       setNewAlbumDescription("")
//       showNotification("האלבום עודכן בהצלחה", "success")
//     } catch (err: any) {
//       setError(err.message)
//       showNotification("שגיאה בעדכון האלבום", "error")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleConfirmDelete = async () => {
//     if (!selectedAlbum) return

//     try {
//       await albumStore.deleteAlbum(selectedAlbum.id!)
//       setOpenDeleteModal(false)
//       setSelectedAlbum(null)
//       showNotification("האלבום נמחק בהצלחה", "success")
//     } catch (err: any) {
//       setError(err.message)
//       showNotification("שגיאה במחיקת האלבום", "error")
//     }
//   }

//   const showNotification = (message: string, type: "success" | "error") => {
//     setNotification({
//       show: true,
//       message,
//       type,
//     })
//   }

//   const getSortedAlbums = () => {
//     if (!albumStore.albums || albumStore.albums.length === 0) return []

//     return [...albumStore.albums].sort((a, b) => {
//       let comparison = 0

//       switch (sortBy) {
//         case "name":
//           comparison = a.albumName.localeCompare(b.albumName)
//           break
//         case "date":
//           comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
//           break
//         default:
//           comparison = 0
//       }

//       return sortDirection === "asc" ? comparison : -comparison
//     })
//   }

//   const filteredAlbums = getSortedAlbums().filter((album) =>
//     album.albumName.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   }

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   }

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           background: 'white',
//         }}
//       >
//         <div
//           style={{
//             width: 100,
//             height: 100,
//             borderRadius: '50%',
//             background: 'linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//             animation: 'spin 1s linear infinite',
//             position: 'relative',
//           }}
//         >
//           <div
//             style={{
//               position: 'absolute',
//               top: '10px',
//               left: '10px',
//               right: '10px',
//               bottom: '10px',
//               borderRadius: '50%',
//               background: 'white',
//             }}
//           />
//         </div>
//         <style>
//           {`
//             @keyframes spin {
//               0% { transform: rotate(0deg); }
//               100% { transform: rotate(360deg); }
//             }
//           `}
//         </style>
//       </div>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         background: 'white',
//         minHeight: "100vh",
//         pt: 1,
//         pb: 8,
//         position: "relative",
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: 'white',
//           animation: 'pulse 4s ease-in-out infinite alternate',
//         },
//       }}
//     >
//       <style>
//         {`
//           @keyframes pulse {
//             0% { opacity: 0.7; }
//             100% { opacity: 1; }
//           }
//           @keyframes float {
//             0%, 100% { transform: translateY(0px); }
//             50% { transform: translateY(-10px); }
//           }
//           @keyframes glow {
//             0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(255, 140, 0, 0.2); }
//             50% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.5), 0 0 60px rgba(255, 140, 0, 0.3); }
//           }
//           @keyframes shimmer {
//             0% { background-position: -200% 0; }
//             100% { background-position: 200% 0; }
//           }
//         `}
//       </style>
//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//         <Box
//           component={motion.div}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           sx={{ mb: 4 }}
//         >
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
//             <Typography
//               variant="h4"
//               sx={{
//                 fontWeight: "bold",
//                 color: "white",
//                 textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
//                 background: "linear-gradient(135deg,rgb(162, 75, 156), #f093fb, #00d4ff)",
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
//               }}
//             >
//               האלבומים שלי
//             </Typography>

//             <Button
//               variant="outlined"
//               startIcon={<Add />}
//               onClick={() => setOpenCreateModal(true)}
//               sx={{
//                 px: 3,
//                 py: 1.5,
//                 borderRadius: 3,
//                 background: 'white',
//                 color: '#6b7280',
//                 fontWeight: 'bold',
//                 fontSize: '1rem',
//                 border: '2px solid transparent',
//                 backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//                 backgroundOrigin: 'border-box',
//                 backgroundClip: 'padding-box, border-box',
//                 boxShadow: 'none',
//                 transition: 'all 0.3s ease',
//                 '&:hover': {
//                   background: 'linear-gradient(#f9fafb, #f9fafb), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//                   backgroundOrigin: 'border-box',
//                   backgroundClip: 'padding-box, border-box',
//                   transform: 'translateY(-1px) scale(1.02)',
//                   boxShadow: 'none',
//                   color: '#374151',
//                 },
//                 '&:active': {
//                   transform: 'translateY(0) scale(1.01)',
//                 },
//                 '& .MuiButton-startIcon': {
//                   color: '#9ca3af',
//                   transition: 'all 0.3s ease',
//                 },
//                 '&:hover .MuiButton-startIcon': {
//                   color: '#6b7280',
//                   transform: 'rotate(90deg)',
//                 },
//               }}
//             >
//               אלבום חדש
//             </Button>

//           </Box>

//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
//             <TextField
//               variant="outlined"
//               placeholder="חיפוש אלבומים..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               size="medium"
//               sx={{
//                 width: { xs: "100%", sm: 350 },
//                 '& .MuiOutlinedInput-root': {
//                   background: 'rgba(87, 112, 223, 0.15)',
//                   backdropFilter: 'blur(20px)',
//                   borderRadius: 3,
//                   border: "2px solid transparent",
//                   borderImage: "linear-gradient(45deg,rgb(162, 75, 156), #f093fb, #00d4ff) 1",
//                   color: 'white',
//                   fontSize: '1.1rem',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     background: 'rgba(255, 255, 255, 0.2)',
//                     border: '2px solid rgba(118, 75, 162, 0.7)',
//                     transform: 'translateY(-2px)',
//                     boxShadow: '0 8px 25px rgba(0, 180, 255, 0.3)',
//                   },
//                   '&.Mui-focused': {
//                     background: 'rgba(255, 255, 255, 0.25)',
//                     border: '2px solid rgb(155, 75, 162)',
//                     boxShadow: '0 0 20px rgba(102, 126, 234, 0.5)',
//                   },
//                   '& fieldset': {
//                     border: 'none',
//                   },
//                   '& input': {
//                     color: 'black',
//                     '&::placeholder': {
//                       color: 'rgba(0, 0, 0, 0.7)',
//                     },
//                   },
//                 },
//               }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Search sx={{ color: 'rgba(255, 255, 255, 0.8)' }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: searchTerm && (
//                   <InputAdornment position="end">
//                     <IconButton
//                       size="small"
//                       onClick={() => setSearchTerm("")}
//                       edge="end"
//                       sx={{
//                         color: 'rgba(255, 255, 255, 0.8)',
//                         '&:hover': {
//                           background: 'rgba(255, 255, 255, 0.2)',
//                         },
//                       }}
//                     >
//                       <Close fontSize="small" />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />

//             <Box>
//               <Button
//                 variant="outlined"
//                 startIcon={sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
//                 endIcon={<SortByAlpha />}
//                 onClick={handleSortMenuOpen}
//                 size="medium"
//                 sx={{
//                   borderRadius: 3,
//                   background: 'white',
//                   color: '#6b7280',
//                   fontWeight: 'bold',
//                   px: 3,
//                   py: 1,
//                   border: '2px solid transparent',
//                   backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//                   backgroundOrigin: 'border-box',
//                   backgroundClip: 'padding-box, border-box',
//                   boxShadow: 'none',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     background: 'linear-gradient(#f9fafb, #f9fafb), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//                     backgroundOrigin: 'border-box',
//                     backgroundClip: 'padding-box, border-box',
//                     transform: 'translateY(-1px) scale(1.02)',
//                     boxShadow: 'none',
//                     color: '#374151',
//                   },
//                   '&:active': {
//                     transform: 'translateY(0) scale(1.01)',
//                   },
//                   '& .MuiButton-startIcon, & .MuiButton-endIcon': {
//                     color: '#9ca3af',
//                     transition: 'all 0.3s ease',
//                   },
//                   '&:hover .MuiButton-startIcon, &:hover .MuiButton-endIcon': {
//                     color: '#6b7280',
//                   },
//                 }}
//               >
//                 {sortBy === "name" ? "מיון לפי שם" : "מיון לפי תאריך"}
//               </Button>
//               <Menu
//                 anchorEl={sortAnchorEl}
//                 open={Boolean(sortAnchorEl)}
//                 onClose={handleSortMenuClose}
//                 PaperProps={{
//                   sx: {
//                     background: 'rgba(255, 255, 255, 0.15)',
//                     backdropFilter: 'blur(20px)',
//                     border: '1px solid rgba(255, 255, 255, 0.3)',
//                     borderRadius: 2,
//                     mt: 1,
//                   },
//                 }}
//               >
//                 <MenuItem
//                   onClick={() => handleSortChange("name")}
//                   selected={sortBy === "name"}
//                   sx={{
//                     color: 'white',
//                     '&:hover': {
//                       background: 'rgba(0, 229, 255, 0.2)',
//                     },
//                     '&.Mui-selected': {
//                       background: 'rgba(0, 229, 255, 0.3)',
//                     },
//                   }}
//                 >
//                   <ListItemIcon>
//                     <SortByAlpha fontSize="small" sx={{ color: 'white' }} />
//                   </ListItemIcon>
//                   <ListItemText>לפי שם</ListItemText>
//                 </MenuItem>
//                 <MenuItem
//                   onClick={() => handleSortChange("date")}
//                   selected={sortBy === "date"}
//                   sx={{
//                     color: 'white',
//                     '&:hover': {
//                       background: 'rgba(0, 229, 255, 0.2)',
//                     },
//                     '&.Mui-selected': {
//                       background: 'rgba(0, 229, 255, 0.3)',
//                     },
//                   }}
//                 >
//                   <ListItemIcon>
//                     <PhotoLibrary fontSize="small" sx={{ color: 'white' }} />
//                   </ListItemIcon>
//                   <ListItemText>לפי תאריך</ListItemText>
//                 </MenuItem>
//                 <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }} />
//                 <MenuItem
//                   onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
//                   sx={{
//                     color: 'white',
//                     '&:hover': {
//                       background: 'rgba(0, 229, 255, 0.2)',
//                     },
//                   }}
//                 >
//                   <ListItemIcon>
//                     {sortDirection === "asc" ?
//                       <ArrowUpward fontSize="small" sx={{ color: 'white' }} /> :
//                       <ArrowDownward fontSize="small" sx={{ color: 'white' }} />
//                     }
//                   </ListItemIcon>
//                   <ListItemText>{sortDirection === "asc" ? "סדר עולה" : "סדר יורד"}</ListItemText>
//                 </MenuItem>
//               </Menu>
//             </Box>
//           </Box>

//           {error && (
//             <Alert
//               severity="error"
//               sx={{
//                 mb: 4,
//                 background: 'rgba(255, 82, 82, 0.2)',
//                 backdropFilter: 'blur(10px)',
//                 border: '1px solid rgba(255, 82, 82, 0.3)',
//                 color: 'white',
//                 borderRadius: 2,
//                 '& .MuiAlert-icon': {
//                   color: '#ff5252',
//                 },
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {filteredAlbums.length === 0 ? (
//             <Box
//               sx={{
//                 textAlign: "center",
//                 py: 8,
//                 background: 'rgba(255, 255, 255, 0.1)',
//                 backdropFilter: 'blur(20px)',
//                 borderRadius: 4,
//                 border: '2px solid rgba(255, 255, 255, 0.2)',
//               }}
//             >
//               <Folder sx={{ fontSize: 120, color: 'rgba(255, 255, 255, 0.6)', opacity: 0.8, mb: 2 }} />
//               <Typography
//                 variant="h5"
//                 sx={{
//                   mt: 2,
//                   mb: 3,
//                   color: 'rgba(255, 255, 255, 0.9)',
//                   fontWeight: 'bold',
//                   textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//                 }}
//               >
//                 {searchTerm ? "לא נמצאו אלבומים התואמים את החיפוש" : "אין אלבומים להצגה"}
//               </Typography>
//               <Button
//                 variant="contained"
//                 startIcon={<Add />}
//                 onClick={() => setOpenCreateModal(true)}
//                 sx={{
//                   mt: 2,
//                   px: 4,
//                   py: 1.5,
//                   borderRadius: 3,
//                   background: 'linear-gradient(45deg, #667eea, #764ba2)',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   fontSize: '1.1rem',
//                   boxShadow: '0 8px 20px rgba(0, 180, 255, 0.4)',
//                   '&:hover': {
//                     background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
//                     transform: 'translateY(-2px) scale(1.05)',
//                   },
//                 }}
//               >
//                 צור אלבום חדש
//               </Button>
//             </Box>
//           ) : (
//             <Grid container spacing={4} component={motion.div} variants={container} initial="hidden" animate="show">
//               <AnimatePresence>
//                 {filteredAlbums.map((album, index) => (
//                   <Grid item xs={12} sm={6} md={4} lg={3} key={album.id} component={motion.div} variants={item} layout>
//                     <Card
//                       sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         borderRadius: 4,
//                         overflow: "hidden",
//                         cursor: "pointer",
//                         background: 'rgba(255, 255, 255, 0.95)',
//                         backdropFilter: 'blur(20px)',
//                         border: '1px solid rgba(255, 255, 255, 0.3)',
//                         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//                         transition: 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)',
//                         animation: `float 6s ease-in-out infinite`,
//                         animationDelay: `${index * 0.2}s`,
//                         '&:hover': {
//                           transform: 'translateY(-8px) scale(1.02)',
//                           background: 'rgba(255, 255, 255, 0.98)',
//                           border: '1px solid rgba(102, 126, 234, 0.3)',
//                           boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)',
//                         },
//                       }}
//                       onClick={() => {
//                         if (album.id !== undefined) {
//                           handleAlbumClick(album.id)
//                         }
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           height: 160,
//                           background: "linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           position: "relative",
//                           overflow: "hidden",
//                           '&::before': {
//                             content: '""',
//                             position: 'absolute',
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             bottom: 0,
//                             background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)',
//                             backgroundSize: '200% 200%',
//                             animation: 'shimmer 3s infinite',
//                           },
//                         }}
//                       >
//                         <Folder
//                           sx={{
//                             fontSize: 90,
//                             color: 'rgba(255, 255, 255, 0.9)',
//                             filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
//                             zIndex: 1,
//                           }}
//                         />
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             top: 12,
//                             right: 12,
//                             zIndex: 2,
//                           }}
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <IconButton
//                             size="small"
//                             sx={{
//                               background: 'rgba(255, 255, 255, 0.2)',
//                               backdropFilter: 'blur(10px)',
//                               border: '1px solid rgba(255, 255, 255, 0.3)',
//                               color: 'white',
//                               transition: 'all 0.3s ease',
//                               "&:hover": {
//                                 background: 'rgba(255, 255, 255, 0.3)',
//                                 transform: 'scale(1.1)',
//                               },
//                             }}
//                             onClick={(e) => handleMenuOpen(e, album.id!)}
//                           >
//                             <MoreVert fontSize="small" />
//                           </IconButton>
//                           <Menu
//                             id={`album-menu-${album.id}`}
//                             anchorEl={menuAnchorEl[album.id!]}
//                             keepMounted
//                             open={Boolean(menuAnchorEl[album.id!])}
//                             onClose={() => handleMenuClose(album.id!)}
//                             PaperProps={{
//                               sx: {
//                                 background: 'rgba(255, 255, 255, 0.15)',
//                                 backdropFilter: 'blur(20px)',
//                                 border: '1px solid rgba(255, 255, 255, 0.3)',
//                                 borderRadius: 2,
//                                 mt: 1,
//                               },
//                             }}
//                           >
//                             <MenuItem
//                               onClick={() => handleEditAlbum(album)}
//                               sx={{
//                                 color: 'white',
//                                 '&:hover': {
//                                   background: 'rgba(8, 8, 8, 0.2)',
//                                 },
//                               }}
//                             >
//                               <ListItemIcon>
//                                 <Edit fontSize="small" sx={{ color: 'white' }} />
//                               </ListItemIcon>
//                               <ListItemText>ערוך אלבום</ListItemText>
//                             </MenuItem>
//                             <MenuItem
//                               onClick={() => handleDeleteAlbum(album)}
//                               sx={{
//                                 color: 'white',
//                                 '&:hover': {
//                                   background: 'rgba(255, 82, 82, 0.2)',
//                                 },
//                               }}
//                             >
//                               <ListItemIcon>
//                                 <Delete fontSize="small" sx={{ color: '#ff5252' }} />
//                               </ListItemIcon>
//                               <ListItemText>מחק אלבום</ListItemText>
//                             </MenuItem>
//                             <MenuItem
//                               onClick={() => {
//                                 handleMenuClose(album.id!)
//                               }}
//                               sx={{
//                                 color: 'white',
//                                 '&:hover': {
//                                   background: 'rgba(0, 229, 255, 0.2)',
//                                 },
//                               }}
//                             >
//                               <ListItemIcon>
//                                 <Share fontSize="small" sx={{ color: 'white' }} />
//                               </ListItemIcon>
//                               <ListItemText>שתף אלבום</ListItemText>
//                             </MenuItem>
//                             <MenuItem
//                               onClick={() => {
//                                 handleMenuClose(album.id!)
//                               }}
//                               sx={{
//                                 color: 'white',
//                                 '&:hover': {
//                                   background: 'rgba(0, 229, 255, 0.2)',
//                                 },
//                               }}
//                             >
//                               <ListItemIcon>
//                                 <Info fontSize="small" sx={{ color: 'white' }} />
//                               </ListItemIcon>
//                               <ListItemText>פרטי אלבום</ListItemText>
//                             </MenuItem>
//                           </Menu>
//                         </Box>
//                       </Box>

//                       <CardContent sx={{ flexGrow: 1, pt: 3, pb: 2 }}>
//                         <Typography
//                           variant="h6"
//                           component="h2"
//                           gutterBottom
//                           noWrap
//                           sx={{
//                             color: '#2d3748',
//                             fontWeight: 'bold',
//                             fontSize: '1.2rem',
//                             textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//                           }}
//                         >
//                           {album.albumName}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#4a5568',
//                             display: "-webkit-box",
//                             WebkitLineClamp: 2,
//                             WebkitBoxOrient: "vertical",
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             height: 40,
//                             lineHeight: 1.5,
//                           }}
//                         >
//                           {album.description || "אין תיאור"}
//                         </Typography>
//                       </CardContent>

//                       <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
//                         <Chip
//                           icon={<PhotoLibrary fontSize="small" />}
//                           label={`${photoCounts[album.id!] || 0} תמונות`}
//                           size="small"
//                           sx={{
//                             background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
//                             border: '1px solid rgba(102, 126, 234, 0.3)',
//                             color: '#667eea',
//                             fontWeight: 'bold',
//                             '& .MuiChip-icon': {
//                               color: 'rgba(255, 255, 255, 0.9)',
//                             },
//                           }}
//                         />
//                         <Button
//                           size="small"
//                           variant="text"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             if (album.id !== undefined) {
//                               handleAlbumClick(album.id)
//                             }
//                           }}
//                           sx={{
//                             color: '#667eea',
//                             fontWeight: 'bold',
//                             background: 'rgba(102, 126, 234, 0.1)',
//                             backdropFilter: 'blur(10px)',
//                             border: '1px solid rgba(102, 126, 234, 0.3)',
//                             borderRadius: 2,
//                             px: 2,
//                             transition: 'all 0.3s ease',
//                             '&:hover': {
//                               background: 'rgba(102, 126, 234, 0.2)',
//                               transform: 'scale(1.05)',
//                             },
//                           }}
//                         >
//                           פתח
//                         </Button>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                 ))}
//               </AnimatePresence>
//             </Grid>
//           )}
//         </Box>
//       </Container>

//       <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 24, right: 24 }}>
//         <Fab
//           color="primary"
//           aria-label="add album"
//           onClick={() => setOpenCreateModal(true)}
//           sx={{
//             background: 'linear-gradient(45deg, #00e5ff, #00b4ff)',
//             boxShadow: '0 8px 20px rgba(0, 180, 255, 0.4)',
//             animation: 'glow 3s ease-in-out infinite',
//             border: '2px solid rgba(255, 255, 255, 0.3)',
//             '&:hover': {
//               background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
//               transform: 'scale(1.1)',
//             },
//           }}
//         >
//           <Add />
//         </Fab>
//       </Box>

//       {openCreateModal && <CreateNewAlbum onClose={() => setOpenCreateModal(false)} />}

//       <Dialog
//         open={openEditModal}
//         onClose={() => setOpenEditModal(false)}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             background: 'rgba(255, 255, 255, 0.15)',
//             backdropFilter: 'blur(20px)',
//             border: '2px solid rgba(255, 255, 255, 0.3)',
//             borderRadius: 3,
//             color: 'white',
//           },
//         }}
//       >
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography
//               variant="h6"
//               sx={{
//                 color: 'white',
//                 fontWeight: 'bold',
//                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//               }}
//             >
//               עריכת אלבום
//             </Typography>
//             <IconButton
//               onClick={() => setOpenEditModal(false)}
//               sx={{
//                 color: 'white',
//                 '&:hover': {
//                   background: 'rgba(255, 255, 255, 0.2)',
//                 },
//               }}
//             >
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}>
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 mb: 1,
//                 color: 'white',
//                 fontWeight: 'bold',
//               }}
//             >
//               שם האלבום
//             </Typography>
//             <TextField
//               fullWidth
//               value={newAlbumName}
//               onChange={(e) => setNewAlbumName(e.target.value)}
//               placeholder="הזן שם חדש לאלבום"
//               required
//               variant="outlined"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   background: 'rgba(255, 255, 255, 0.15)',
//                   backdropFilter: 'blur(10px)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255, 255, 255, 0.3)',
//                   color: 'white',
//                   '&:hover': {
//                     border: '1px solid rgba(0, 229, 255, 0.5)',
//                   },
//                   '&.Mui-focused': {
//                     border: '1px solid #00e5ff',
//                     boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
//                   },
//                   '& fieldset': {
//                     border: 'none',
//                   },
//                   '& input': {
//                     color: 'white',
//                     '&::placeholder': {
//                       color: 'rgba(255, 255, 255, 0.7)',
//                     },
//                   },
//                 },
//               }}
//             />
//           </Box>
//           <Box>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 mb: 1,
//                 color: 'white',
//                 fontWeight: 'bold',
//               }}
//             >
//               תיאור האלבום
//             </Typography>
//             <TextField
//               fullWidth
//               value={newAlbumDescription}
//               onChange={(e) => setNewAlbumDescription(e.target.value)}
//               placeholder="הזן תיאור לאלבום (אופציונלי)"
//               multiline
//               rows={3}
//               variant="outlined"
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   background: 'rgba(255, 255, 255, 0.15)',
//                   backdropFilter: 'blur(10px)',
//                   borderRadius: 2,
//                   border: '1px solid rgba(255, 255, 255, 0.3)',
//                   color: 'white',
//                   '&:hover': {
//                     border: '1px solid rgba(0, 229, 255, 0.5)',
//                   },
//                   '&.Mui-focused': {
//                     border: '1px solid #00e5ff',
//                     boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
//                   },
//                   '& fieldset': {
//                     border: 'none',
//                   },
//                   '& textarea': {
//                     color: 'white',
//                     '&::placeholder': {
//                       color: 'rgba(255, 255, 255, 0.7)',
//                     },
//                   },
//                 },
//               }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={() => setOpenEditModal(false)}
//             sx={{
//               color: 'white',
//               border: '1px solid rgba(255, 255, 255, 0.3)',
//               '&:hover': {
//                 border: '1px solid rgba(255, 255, 255, 0.5)',
//                 background: 'rgba(255, 255, 255, 0.1)',
//               },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleUpdateAlbum}
//             disabled={!newAlbumName.trim() || isLoading}
//             startIcon={isLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : null}
//             sx={{
//               background: 'linear-gradient(45deg, #00e5ff, #00b4ff)',
//               color: 'white',
//               fontWeight: 'bold',
//               '&:hover': {
//                 background: 'linear-gradient(45deg, #00b4ff, #0081ff)',
//               },
//               '&:disabled': {
//                 background: 'rgba(255, 255, 255, 0.2)',
//                 color: 'rgba(255, 255, 255, 0.5)',
//               },
//             }}
//           >
//             {isLoading ? "שומר..." : "שמור שינויים"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openDeleteModal}
//         onClose={() => setOpenDeleteModal(false)}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             background: 'rgba(255, 255, 255, 0.15)',
//             backdropFilter: 'blur(20px)',
//             border: '2px solid rgba(255, 255, 255, 0.3)',
//             borderRadius: 3,
//             color: 'white',
//           },
//         }}
//       >
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography
//               variant="h6"
//               sx={{
//                 color: 'white',
//                 fontWeight: 'bold',
//                 textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
//               }}
//             >
//               מחיקת אלבום
//             </Typography>
//             <IconButton
//               onClick={() => setOpenDeleteModal(false)}
//               sx={{
//                 color: 'white',
//                 '&:hover': {
//                   background: 'rgba(255, 255, 255, 0.2)',
//                 },
//               }}
//             >
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6 }}>
//             האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
//             התמונות באלבום.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={() => setOpenDeleteModal(false)}
//             sx={{
//               color: 'white',
//               border: '1px solid rgba(255, 255, 255, 0.3)',
//               '&:hover': {
//                 border: '1px solid rgba(255, 255, 255, 0.5)',
//                 background: 'rgba(255, 255, 255, 0.1)',
//               },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleConfirmDelete}
//             startIcon={<Delete />}
//             sx={{
//               background: 'linear-gradient(45deg, #ff5252, #f44336)',
//               color: 'white',
//               fontWeight: 'bold',
//               '&:hover': {
//                 background: 'linear-gradient(45deg, #f44336, #d32f2f)',
//               },
//             }}
//           >
//             מחק אלבום
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={notification.show}
//         autoHideDuration={4000}
//         onClose={() => setNotification({ ...notification, show: false })}
//         TransitionComponent={Fade}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert
//           severity={notification.type}
//           variant="filled"
//           onClose={() => setNotification({ ...notification, show: false })}
//           sx={{
//             background: notification.type === 'success'
//               ? 'linear-gradient(45deg, #4caf50, #66bb6a)'
//               : 'linear-gradient(45deg, #f44336, #ef5350)',
//             color: 'white',
//             fontWeight: 'bold',
//             borderRadius: 2,
//             backdropFilter: 'blur(10px)',
//             border: '1px solid rgba(255, 255, 255, 0.3)',
//           }}
//         >
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   )
// }

// export default observer(UserAlbums)