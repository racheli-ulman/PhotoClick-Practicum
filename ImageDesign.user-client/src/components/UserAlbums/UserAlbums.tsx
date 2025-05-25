"use client"

import { observer } from "mobx-react-lite"
import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import albumStore from "../../stores/albumStore"
import photoUploadStore from "../../stores/photoUploaderStore"
import CreateNewAlbum from "./CreateNewAlbum"
import type { Album } from "../../models/Album"
import userStore from "../../stores/userStore"
import { Box, Container, Typography, Button, Fab, Alert, Snackbar, Fade } from "@mui/material"
import { Add } from "@mui/icons-material"
import { motion } from "framer-motion"
import LoadingState from "./LoadingState"
import SearchAndSort from "./SearchAndSort"
import AlbumGrid from "./AlbumGrid"
import AlbumDialogs from "./AlbumDialogs"

const UserAlbums: React.FC = () => {
  const navigate = useNavigate()
  const userId = userStore.user?.user?.id ?? null
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [newAlbumName, setNewAlbumName] = useState<string>("")
  const [newAlbumDescription, setNewAlbumDescription] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  })
  const [photoCounts, setPhotoCounts] = useState<{ [key: number]: number }>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAlbumsAndPhotos = async () => {
      if (userId) {
        try {
          setLoading(true)
          await albumStore.fetchAlbums(userId)

          const counts: { [key: number]: number } = {}
          for (const album of albumStore.albums) {
            if (!album.id) continue
            const count = await photoUploadStore.fetchPhotosByAlbumId(album.id)
            counts[album.id] = count
          }
          setPhotoCounts(counts)
          setLoading(false)
        } catch (err: any) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    fetchAlbumsAndPhotos()
  }, [userId])

  const handleAlbumClick = (albumId: number) => {
    navigate(`/personal-area/get-photos/${albumId}`)
  }

  const handleEditAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setNewAlbumName(album.albumName || "")
    setNewAlbumDescription(album.description || "")
    setOpenEditModal(true)
  }

  const handleDeleteAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setOpenDeleteModal(true)
  }

  const handleUpdateAlbum = async () => {
    if (!selectedAlbum || !newAlbumName.trim()) {
      showNotification("שם האלבום לא יכול להיות ריק", "error")
      return
    }

    setIsLoading(true)

    try {
      const updatedAlbum: Album = {
        id: selectedAlbum.id,
        albumName: newAlbumName.trim(),
        userId: userId,
        description: newAlbumDescription.trim(),
        createdAt: selectedAlbum.createdAt,
      }

      await albumStore.updateAlbum(updatedAlbum)
      setOpenEditModal(false)
      setSelectedAlbum(null)
      setNewAlbumName("")
      setNewAlbumDescription("")
      showNotification("האלבום עודכן בהצלחה", "success")
    } catch (err: any) {
      setError(err.message)
      showNotification("שגיאה בעדכון האלבום", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedAlbum) return

    try {
      await albumStore.deleteAlbum(selectedAlbum.id!)
      setOpenDeleteModal(false)
      setSelectedAlbum(null)
      showNotification("האלבום נמחק בהצלחה", "success")
    } catch (err: any) {
      setError(err.message)
      showNotification("שגיאה במחיקת האלבום", "error")
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({
      show: true,
      message,
      type,
    })
  }

  const getSortedAlbums = () => {
    if (!albumStore.albums || albumStore.albums.length === 0) return []

    return [...albumStore.albums].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "name":
          comparison = a.albumName.localeCompare(b.albumName)
          break
        case "date":
          comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }

  const filteredAlbums = getSortedAlbums().filter((album) =>
    album.albumName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <LoadingState />
  }

  return (
    <Box
      sx={{
        background: "white",
        minHeight: "100vh",
        pt: 1,
        pb: 8,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "white",
          animation: "pulse 4s ease-in-out infinite alternate",
        },
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(255, 140, 0, 0.2); }
            50% { box-shadow: 0 0 30px rgba(0, 229, 255, 0.5), 0 0 60px rgba(255, 140, 0, 0.3); }
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "white",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
                background: "linear-gradient(135deg,rgb(162, 75, 156), #f093fb, #00d4ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
              }}
            >
              האלבומים שלי
            </Typography>

            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setOpenCreateModal(true)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 3,
                background: "white",
                color: "#6b7280",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  background:
                    "linear-gradient(#f9fafb, #f9fafb), linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  transform: "translateY(-1px) scale(1.02)",
                  boxShadow: "none",
                  color: "#374151",
                },
                "&:active": {
                  transform: "translateY(0) scale(1.01)",
                },
                "& .MuiButton-startIcon": {
                  color: "#9ca3af",
                  transition: "all 0.3s ease",
                },
                "&:hover .MuiButton-startIcon": {
                  color: "#6b7280",
                  transform: "rotate(90deg)",
                },
              }}
            >
              אלבום חדש
            </Button>
          </Box>

          <SearchAndSort
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                background: "rgba(255, 82, 82, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 82, 82, 0.3)",
                color: "white",
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  color: "#ff5252",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <AlbumGrid
            filteredAlbums={filteredAlbums}
            photoCounts={photoCounts}
            onAlbumClick={handleAlbumClick}
            onEditAlbum={handleEditAlbum}
            onDeleteAlbum={handleDeleteAlbum}
            onCreateNew={() => setOpenCreateModal(true)}
            searchTerm={searchTerm}
          />
        </Box>
      </Container>

      <Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", bottom: 24, right: 24 }}>
        <Fab
          color="primary"
          aria-label="add album"
          onClick={() => setOpenCreateModal(true)}
          sx={{
            background: "linear-gradient(45deg, #00e5ff, #00b4ff)",
            boxShadow: "0 8px 20px rgba(0, 180, 255, 0.4)",
            animation: "glow 3s ease-in-out infinite",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #00b4ff, #0081ff)",
              transform: "scale(1.1)",
            },
          }}
        >
          <Add />
        </Fab>
      </Box>

      {openCreateModal && <CreateNewAlbum onClose={() => setOpenCreateModal(false)} />}

      <AlbumDialogs
        openEditModal={openEditModal}
        openDeleteModal={openDeleteModal}
        selectedAlbum={selectedAlbum}
        newAlbumName={newAlbumName}
        newAlbumDescription={newAlbumDescription}
        isLoading={isLoading}
        onCloseEdit={() => setOpenEditModal(false)}
        onCloseDelete={() => setOpenDeleteModal(false)}
        onUpdateAlbum={handleUpdateAlbum}
        onConfirmDelete={handleConfirmDelete}
        onNameChange={setNewAlbumName}
        onDescriptionChange={setNewAlbumDescription}
      />

      <Snackbar
        open={notification.show}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, show: false })}
        TransitionComponent={Fade}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification({ ...notification, show: false })}
          sx={{
            background:
              notification.type === "success"
                ? "linear-gradient(45deg, #4caf50, #66bb6a)"
                : "linear-gradient(45deg, #f44336, #ef5350)",
            color: "white",
            fontWeight: "bold",
            borderRadius: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default observer(UserAlbums)
