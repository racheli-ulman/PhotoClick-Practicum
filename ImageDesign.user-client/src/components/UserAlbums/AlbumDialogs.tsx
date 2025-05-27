// "use client"

// import type React from "react"
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   CircularProgress,
// } from "@mui/material"
// import { Close, Delete } from "@mui/icons-material"
// import type { Album } from "../../models/Album"

// interface AlbumDialogsProps {
//   openEditModal: boolean
//   openDeleteModal: boolean
//   selectedAlbum: Album | null
//   newAlbumName: string
//   newAlbumDescription: string
//   isLoading: boolean
//   onCloseEdit: () => void
//   onCloseDelete: () => void
//   onUpdateAlbum: () => void
//   onConfirmDelete: () => void
//   onNameChange: (name: string) => void
//   onDescriptionChange: (description: string) => void
// }

// const AlbumDialogs: React.FC<AlbumDialogsProps> = ({
//   openEditModal,
//   openDeleteModal,
//   selectedAlbum,
//   newAlbumName,
//   newAlbumDescription,
//   isLoading,
//   onCloseEdit,
//   onCloseDelete,
//   onUpdateAlbum,
//   onConfirmDelete,
//   onNameChange,
//   onDescriptionChange,
// }) => {
//   return (
//     <>
//       <Dialog
//         open={openEditModal}
//         onClose={onCloseEdit}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             background: "rgba(255, 255, 255, 0.15)",
//             backdropFilter: "blur(20px)",
//             border: "2px solid rgba(255, 255, 255, 0.3)",
//             borderRadius: 3,
//             color: "white",
//           },
//         }}
//       >
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography
//               variant="h6"
//               sx={{
//                 color: "white",
//                 fontWeight: "bold",
//                 textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
//               }}
//             >
//               עריכת אלבום
//             </Typography>
//             <IconButton
//               onClick={onCloseEdit}
//               sx={{
//                 color: "white",
//                 "&:hover": {
//                   background: "rgba(255, 255, 255, 0.2)",
//                 },
//               }}
//             >
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}>
//           <Box sx={{ mb: 3 }}>
//             <Typography
//               variant="subtitle1"
//               sx={{
//                 mb: 1,
//                 color: "white",
//                 fontWeight: "bold",
//               }}
//             >
//               שם האלבום
//             </Typography>
//             <TextField
//               fullWidth
//               value={newAlbumName}
//               onChange={(e) => onNameChange(e.target.value)}
//               placeholder="הזן שם חדש לאלבום"
//               required
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   background: "rgba(255, 255, 255, 0.15)",
//                   backdropFilter: "blur(10px)",
//                   borderRadius: 2,
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                   color: "white",
//                   "&:hover": {
//                     border: "1px solid rgba(0, 229, 255, 0.5)",
//                   },
//                   "&.Mui-focused": {
//                     border: "1px solid #00e5ff",
//                     boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
//                   },
//                   "& fieldset": {
//                     border: "none",
//                   },
//                   "& input": {
//                     color: "white",
//                     "&::placeholder": {
//                       color: "rgba(255, 255, 255, 0.7)",
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
//                 color: "white",
//                 fontWeight: "bold",
//               }}
//             >
//               תיאור האלבום
//             </Typography>
//             <TextField
//               fullWidth
//               value={newAlbumDescription}
//               onChange={(e) => onDescriptionChange(e.target.value)}
//               placeholder="הזן תיאור לאלבום (אופציונלי)"
//               multiline
//               rows={3}
//               variant="outlined"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   background: "rgba(255, 255, 255, 0.15)",
//                   backdropFilter: "blur(10px)",
//                   borderRadius: 2,
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                   color: "white",
//                   "&:hover": {
//                     border: "1px solid rgba(0, 229, 255, 0.5)",
//                   },
//                   "&.Mui-focused": {
//                     border: "1px solid #00e5ff",
//                     boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
//                   },
//                   "& fieldset": {
//                     border: "none",
//                   },
//                   "& textarea": {
//                     color: "white",
//                     "&::placeholder": {
//                       color: "rgba(255, 255, 255, 0.7)",
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
//             onClick={onCloseEdit}
//             sx={{
//               color: "white",
//               border: "1px solid rgba(255, 255, 255, 0.3)",
//               "&:hover": {
//                 border: "1px solid rgba(255, 255, 255, 0.5)",
//                 background: "rgba(255, 255, 255, 0.1)",
//               },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button
//             variant="contained"
//             onClick={onUpdateAlbum}
//             disabled={!newAlbumName.trim() || isLoading}
//             startIcon={isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
//             sx={{
//               background: "linear-gradient(45deg, #00e5ff, #00b4ff)",
//               color: "white",
//               fontWeight: "bold",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #00b4ff, #0081ff)",
//               },
//               "&:disabled": {
//                 background: "rgba(255, 255, 255, 0.2)",
//                 color: "rgba(255, 255, 255, 0.5)",
//               },
//             }}
//           >
//             {isLoading ? "שומר..." : "שמור שינויים"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={openDeleteModal}
//         onClose={onCloseDelete}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             background: "rgba(255, 255, 255, 0.15)",
//             backdropFilter: "blur(20px)",
//             border: "2px solid rgba(255, 255, 255, 0.3)",
//             borderRadius: 3,
//             color: "white",
//           },
//         }}
//       >
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography
//               variant="h6"
//               sx={{
//                 color: "white",
//                 fontWeight: "bold",
//                 textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
//               }}
//             >
//               מחיקת אלבום
//             </Typography>
//             <IconButton
//               onClick={onCloseDelete}
//               sx={{
//                 color: "white",
//                 "&:hover": {
//                   background: "rgba(255, 255, 255, 0.2)",
//                 },
//               }}
//             >
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Typography sx={{ color: "linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)", lineHeight: 1.6 }}>
//             האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
//             התמונות באלבום.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button
//             variant="outlined"
//             onClick={onCloseDelete}
//             sx={{
//               color: "white",
//               border: "1px solid rgba(255, 255, 255, 0.3)",
//               "&:hover": {
//                 border: "1px solid rgba(255, 255, 255, 0.5)",
//                 background: "rgba(255, 255, 255, 0.1)",
//               },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={onConfirmDelete}
//             startIcon={<Delete />}
//             sx={{
//               background: "linear-gradient(45deg, #ff5252, #f44336)",
//               color: "white",
//               fontWeight: "bold",
//               "&:hover": {
//                 background: "linear-gradient(45deg, #f44336, #d32f2f)",
//               },
//             }}
//           >
//             מחק אלבום
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   )
// }

// export default AlbumDialogs


"use client"

import React from "react"
import {
  Dialog,
  // DialogActions,
  DialogContent,
  // DialogTitle,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Slide,
  Paper,
  Chip,
  FormHelperText,
} from "@mui/material"
import { Close, Delete, Edit } from "@mui/icons-material"
import { TransitionProps } from "@mui/material/transitions"
import type { Album } from "../../models/Album"

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AlbumDialogsProps {
  openEditModal: boolean
  openDeleteModal: boolean
  selectedAlbum: Album | null
  newAlbumName: string
  newAlbumDescription: string
  isLoading: boolean
  onCloseEdit: () => void
  onCloseDelete: () => void
  onUpdateAlbum: () => void
  onConfirmDelete: () => void
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
}

const AlbumDialogs: React.FC<AlbumDialogsProps> = ({
  openEditModal,
  openDeleteModal,
  selectedAlbum,
  newAlbumName,
  newAlbumDescription,
  isLoading,
  onCloseEdit,
  onCloseDelete,
  onUpdateAlbum,
  onConfirmDelete,
  onNameChange,
  onDescriptionChange,
}) => {
  const maxNameLength = 50;
  const maxDescLength = 150;
  const nameCharactersLeft = maxNameLength - newAlbumName.length;
  const descCharactersLeft = maxDescLength - newAlbumDescription.length;
  const isNameTooLong = nameCharactersLeft < 0;
  const isDescTooLong = descCharactersLeft < 0;

  return (
    <>
      {/* Edit Dialog */}
      <Dialog
        open={openEditModal}
        onClose={onCloseEdit}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            maxWidth: "420px",
            width: "100%",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            direction: "rtl",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            background: "linear-gradient(135deg, #0f766e, #7dd3fc,#f8bbd9,rgb(247, 84, 165))",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={onCloseEdit}
            sx={{
              position: "absolute",
              right: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)"
              },
              transition: "all 0.2s ease"
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Edit sx={{ color: "white", fontSize: 28 }} />
            <Typography
              variant="h6"
              fontWeight="700"
              color="white"
              sx={{ letterSpacing: "0.5px" }}
            >
              עריכת אלבום
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 4, direction: "rtl" }}>
          <form onSubmit={(e) => { e.preventDefault(); onUpdateAlbum(); }}>
            {/* Album Name Field */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Chip
                  label={`${nameCharactersLeft}/${maxNameLength}`}
                  size="small"
                  variant="outlined"
                  color={isNameTooLong ? "error" : "default"}
                  sx={{
                    fontSize: "11px",
                    height: 20,
                    "& .MuiChip-label": { px: 1 }
                  }}
                />
                <Typography variant="subtitle1" fontWeight="600" color="#374151">
                  שם האלבום
                  <Box component="span" color="#dc2626" sx={{ ml: 0.5 }}>*</Box>
                </Typography>
              </Box>

              <TextField
                variant="outlined"
                fullWidth
                value={newAlbumName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="הזן שם חדש לאלבום"
                required
                error={isNameTooLong}
                InputProps={{
                  sx: {
                    height: 48,
                    backgroundColor: "#f8fafc",
                    borderRadius: 2.5,
                    fontSize: "15px",
                    transition: "all 0.2s ease",
                    "& input": {
                      textAlign: "left",
                      direction: "rtl",
                    },
                    "&:hover": {
                      backgroundColor: "#f1f5f9"
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  },
                }}
              />
              {isNameTooLong && (
                <FormHelperText error sx={{ textAlign: "right", mt: 0.5 }}>
                  השם ארוך מדי
                </FormHelperText>
              )}
            </Box>

            {/* Description Field */}
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                <Chip
                  label={`${descCharactersLeft}/${maxDescLength}`}
                  size="small"
                  variant="outlined"
                  color={isDescTooLong ? "error" : "default"}
                  sx={{
                    fontSize: "11px",
                    height: 20,
                    "& .MuiChip-label": { px: 1 }
                  }}
                />
                <Typography variant="subtitle1" fontWeight="600" color="#374151">
                  תיאור האלבום
                </Typography>
              </Box>

              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={newAlbumDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="הזן תיאור לאלבום (אופציונלי)"
                error={isDescTooLong}
                InputProps={{
                  sx: {
                    backgroundColor: "#f8fafc",
                    borderRadius: 2.5,
                    fontSize: "15px",
                    transition: "all 0.2s ease",
                    "& textarea": {
                      textAlign: "left",
                      direction: "rtl",
                    },
                    "&:hover": {
                      backgroundColor: "#f1f5f9"
                    },
                    "&.Mui-focused": {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                    }
                  },
                }}
              />
              {isDescTooLong && (
                <FormHelperText error sx={{ textAlign: "right", mt: 0.5 }}>
                  התיאור ארוך מדי
                </FormHelperText>
              )}
            </Box>

            {/* Action Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                type="submit"
                variant="contained"
                disabled={!newAlbumName.trim() || isLoading || isNameTooLong || isDescTooLong}
                startIcon={isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2.5,
                  fontSize: "15px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                    boxShadow: "0 6px 25px rgba(79, 70, 229, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "#e2e8f0",
                    color: "#94a3b8",
                    boxShadow: "none",
                  }
                }}
              >
                {isLoading ? "שומר..." : "שמור שינויים"}
              </Button>

              <Button
                variant="outlined"
                onClick={onCloseEdit}
                disabled={isLoading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontWeight: 600,
                  borderRadius: 2.5,
                  fontSize: "15px",
                  borderColor: "#d1d5db",
                  color: "#6b7280",
                  textTransform: "none",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    borderColor: "#9ca3af",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                ביטול
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={openDeleteModal}
        onClose={onCloseDelete}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            borderRadius: 5,
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            maxWidth: "420px",
            width: "100%",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            direction: "rtl",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            background: "linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)",
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={onCloseDelete}
            sx={{
              position: "absolute",
              right: 8,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)"
              },
              transition: "all 0.2s ease"
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Delete sx={{ color: "white", fontSize: 28 }} />
            <Typography
              variant="h6"
              fontWeight="700"
              color="white"
              sx={{ letterSpacing: "0.5px" }}
            >
              מחיקת אלבום
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 4, direction: "rtl" }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              p: 3,
              borderRadius: 3,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" fontWeight="500" sx={{ lineHeight: 1.6 }}>
              האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
              התמונות באלבום.
            </Typography>
          </Paper>

          {/* Action Buttons */}
          <Box display="flex" gap={2} mt={4}>
            <Button
              variant="contained"
              color="error"
              onClick={onConfirmDelete}
              startIcon={<Delete />}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2.5,
                fontSize: "15px",
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
                textTransform: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
                  boxShadow: "0 6px 25px rgba(220, 38, 38, 0.4)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              מחק אלבום
            </Button>

            <Button
              variant="outlined"
              onClick={onCloseDelete}
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2.5,
                fontSize: "15px",
                borderColor: "#d1d5db",
                color: "#6b7280",
                textTransform: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#f9fafb",
                  borderColor: "#9ca3af",
                  transform: "translateY(-1px)",
                }
              }}
            >
              ביטול
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AlbumDialogs
