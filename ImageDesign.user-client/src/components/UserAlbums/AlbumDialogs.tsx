"use client"

import type React from "react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material"
import { Close, Delete } from "@mui/icons-material"
import type { Album } from "../../models/Album"

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
  return (
    <>
      <Dialog
        open={openEditModal}
        onClose={onCloseEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            color: "white",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              עריכת אלבום
            </Typography>
            <IconButton
              onClick={onCloseEdit}
              sx={{
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.3)" }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                color: "white",
                fontWeight: "bold",
              }}
            >
              שם האלבום
            </Typography>
            <TextField
              fullWidth
              value={newAlbumName}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="הזן שם חדש לאלבום"
              required
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    border: "1px solid rgba(0, 229, 255, 0.5)",
                  },
                  "&.Mui-focused": {
                    border: "1px solid #00e5ff",
                    boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& input": {
                    color: "white",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
              }}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                mb: 1,
                color: "white",
                fontWeight: "bold",
              }}
            >
              תיאור האלבום
            </Typography>
            <TextField
              fullWidth
              value={newAlbumDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="הזן תיאור לאלבום (אופציונלי)"
              multiline
              rows={3}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "white",
                  "&:hover": {
                    border: "1px solid rgba(0, 229, 255, 0.5)",
                  },
                  "&.Mui-focused": {
                    border: "1px solid #00e5ff",
                    boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  "& textarea": {
                    color: "white",
                    "&::placeholder": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={onCloseEdit}
            sx={{
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={onUpdateAlbum}
            disabled={!newAlbumName.trim() || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} sx={{ color: "white" }} /> : null}
            sx={{
              background: "linear-gradient(45deg, #00e5ff, #00b4ff)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #00b4ff, #0081ff)",
              },
              "&:disabled": {
                background: "rgba(255, 255, 255, 0.2)",
                color: "rgba(255, 255, 255, 0.5)",
              },
            }}
          >
            {isLoading ? "שומר..." : "שמור שינויים"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteModal}
        onClose={onCloseDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 3,
            color: "white",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: "bold",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              מחיקת אלבום
            </Typography>
            <IconButton
              onClick={onCloseDelete}
              sx={{
                color: "white",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.9)", lineHeight: 1.6 }}>
            האם אתה בטוח שברצונך למחוק את האלבום "{selectedAlbum?.albumName}"? פעולה זו אינה ניתנת לביטול ותמחק את כל
            התמונות באלבום.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={onCloseDelete}
            sx={{
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              "&:hover": {
                border: "1px solid rgba(255, 255, 255, 0.5)",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={onConfirmDelete}
            startIcon={<Delete />}
            sx={{
              background: "linear-gradient(45deg, #ff5252, #f44336)",
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(45deg, #f44336, #d32f2f)",
              },
            }}
          >
            מחק אלבום
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AlbumDialogs
