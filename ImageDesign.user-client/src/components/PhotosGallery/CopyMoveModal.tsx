"use client"

import type React from "react"
import {
  Box,
  Typography,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Fade,
  Backdrop,
  type SelectChangeEvent,
  IconButton,
  Divider,
} from "@mui/material"
import { Close, FileCopy, DriveFileMove, Folder } from "@mui/icons-material"
import { motion } from "framer-motion"

interface Album {
  id: number
  albumName: string
}

interface CopyMoveModalProps {
  open: boolean
  isCopyOperation: boolean
  targetAlbumId: number | ""
  albums: Album[] | null
  onClose: () => void
  onAlbumChange: (event: React.ChangeEvent<{ value: unknown }>) => void
  onConfirm: () => void
}

const CopyMoveModal: React.FC<CopyMoveModalProps> = ({
  open,
  isCopyOperation,
  targetAlbumId,
  albums,
  onClose,
  onAlbumChange,
  onConfirm,
}) => {
  const handleChange = (event: SelectChangeEvent<unknown>) => {
    onAlbumChange(event as React.ChangeEvent<{ value: unknown }>)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Fade in={open}>
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            width: 400,
            maxWidth: "100%",
            borderRadius: 2,
            p: 0,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: isCopyOperation ? "primary.main" : "secondary.main",
              color: "white",
              p: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isCopyOperation ? <FileCopy /> : <DriveFileMove />}
              <Typography variant="h6">{isCopyOperation ? "העתקת תמונה" : "העברת תמונה"}</Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {isCopyOperation ? "בחר אלבום יעד להעתקת התמונה אליו" : "בחר אלבום יעד להעברת התמונה אליו"}
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="select-album-label">בחר אלבום יעד</InputLabel>
              <Select
                labelId="select-album-label"
                id="select-album"
                value={targetAlbumId}
                label="בחר אלבום יעד"
                onChange={handleChange}
                sx={{
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                {albums &&
                  albums.map((album) => (
                    <MenuItem
                      key={album.id}
                      value={album.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Folder fontSize="small" color="action" />
                      {album.albumName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button variant="outlined" onClick={onClose}>
                ביטול
              </Button>
              <Button
                variant="contained"
                onClick={onConfirm}
                color={isCopyOperation ? "primary" : "secondary"}
                startIcon={isCopyOperation ? <FileCopy /> : <DriveFileMove />}
                disabled={!targetAlbumId}
              >
                {isCopyOperation ? "העתקה" : "העברה"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  )
}

export default CopyMoveModal
