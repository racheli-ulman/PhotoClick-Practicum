"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
} from "@mui/material"
// import { Folder, MoreVert, Edit, Delete, Share, Info, PhotoLibrary } from "@mui/icons-material"
import { Folder, MoreVert, Edit, Delete, PhotoLibrary } from "@mui/icons-material"
import type { Album } from "../../models/Album"

interface AlbumCardProps {
  album: Album
  index: number
  photoCount: number
  onAlbumClick: (albumId: number) => void
  onEditAlbum: (album: Album) => void
  onDeleteAlbum: (album: Album) => void
}

// מערך צבעים עדינים לפי אינדקס
const getAlbumColorByIndex = (index: number) => {
  const colorPattern = [
    {
      background: "rgba(234, 102, 203, 0.05)", // סגול בהיר עדין
      accent: "rgb(234, 102, 203)",
      folderColor: "rgb(234, 102, 203)",
    },
    {
      background: "rgba(189, 132, 246, 0.05)", // ורוד עדין
      accent: "rgb(189, 132, 246)",
      folderColor: "rgb(189, 132, 246)",
    },
    {
      background: "rgba(240, 147, 251, 0.05)", // תכלת עדין
      accent: "#f093fb",
      folderColor: "#f093fb",
    },
    {
      background: "rgba(0, 212, 255, 0.05)", // כחול עדין
      accent: "#00d4ff",
      folderColor: "#00d4ff",
    },
  ]

  return colorPattern[index % 4] // חזרה על הדפוס כל 4 אלבומים
}

const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  index,
  photoCount,
  onAlbumClick,
  onEditAlbum,
  onDeleteAlbum,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const albumColors = getAlbumColorByIndex(index)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const handleEdit = () => {
    onEditAlbum(album)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDeleteAlbum(album)
    handleMenuClose()
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        background: "white",
        border: "1px solid #f1f5f9",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
          borderColor: albumColors.accent,
          "& .folder-icon": {
            transform: "scale(1.1)",
          },
        },
      }}
      onClick={() => {
        if (album.id !== undefined) {
          onAlbumClick(album.id)
        }
      }}
    >
      <Box
        sx={{
          height: 140,
          background: albumColors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderBottom: `1px solid ${albumColors.accent}15`,
        }}
      >
        <Folder
          className="folder-icon"
          sx={{
            fontSize: 64,
            color: albumColors.folderColor,
            opacity: 0.8,
            transition: "all 0.3s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              color: "#64748b",
              width: 32,
              height: 32,
              transition: "all 0.2s ease",
              "&:hover": {
                background: "white",
                color: albumColors.accent,
                transform: "scale(1.05)",
              },
            }}
            onClick={handleMenuOpen}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            id={`album-menu-${album.id}`}
            anchorEl={menuAnchorEl}
            keepMounted
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                mt: 1,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <MenuItem
              onClick={handleEdit}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                py: 1,
                "&:hover": {
                  background: `${albumColors.accent}10`,
                  color: albumColors.accent,
                },
              }}
            >
              <ListItemIcon>
                <Edit fontSize="small" sx={{ color: "#64748b" }} />
              </ListItemIcon>
              <ListItemText>ערוך אלבום</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={handleDelete}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                py: 1,
                "&:hover": {
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                },
              }}
            >
              <ListItemIcon>
                <Delete fontSize="small" sx={{ color: "#ef4444" }} />
              </ListItemIcon>
              <ListItemText>מחק אלבום</ListItemText>
            </MenuItem>
            {/* <MenuItem
              onClick={handleMenuClose}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                py: 1,
                "&:hover": {
                  background: `${albumColors.accent}10`,
                  color: albumColors.accent,
                },
              }}
            >
              <ListItemIcon>
                <Share fontSize="small" sx={{ color: "#64748b" }} />
              </ListItemIcon>
              <ListItemText>שתף אלבום</ListItemText>
            </MenuItem> */}
            {/* <MenuItem
              onClick={handleMenuClose}
              sx={{
                color: "#374151",
                fontSize: "0.875rem",
                py: 1,
                "&:hover": {
                  background: `${albumColors.accent}10`,
                  color: albumColors.accent,
                },
              }}
            >
              <ListItemIcon>
                <Info fontSize="small" sx={{ color: "#64748b" }} />
              </ListItemIcon>
              <ListItemText>פרטי אלבום</ListItemText>
            </MenuItem> */}
          </Menu>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          noWrap
          sx={{
            color: "#1e293b",
            fontWeight: "600",
            fontSize: "1.1rem",
            mb: 1,
          }}
        >
          {album.albumName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: 40,
            lineHeight: 1.5,
            fontSize: "0.875rem",
          }}
        >
          {album.description || "אין תיאור"}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
        <Chip
          icon={<PhotoLibrary fontSize="small" />}
          label={`${photoCount} תמונות`}
          size="small"
          sx={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            color: "#64748b",
            fontSize: "0.75rem",
            height: 28,
            "& .MuiChip-icon": {
              color: albumColors.accent,
            },
          }}
        />
        <Button
          size="small"
          variant="text"
          onClick={(e) => {
            e.stopPropagation()
            if (album.id !== undefined) {
              onAlbumClick(album.id)
            }
          }}
          sx={{
            color: albumColors.accent,
            fontSize: "0.875rem",
            fontWeight: "500",
            textTransform: "none",
            minWidth: "auto",
            px: 2,
            py: 0.5,
            borderRadius: 1.5,
            transition: "all 0.2s ease",
            "&:hover": {
              background: `${albumColors.accent}10`,
              transform: "scale(1.02)",
            },
          }}
        >
          פתח
        </Button>
      </CardActions>
    </Card>
  )
}

export default AlbumCard
