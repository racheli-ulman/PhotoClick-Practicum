"use client"

import type React from "react"
import { Grid, Box, Typography, Button } from "@mui/material"
import { Add, Folder } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import type { Album } from "../../models/Album"
import AlbumCard from "./AlbumCard"

interface AlbumGridProps {
  filteredAlbums: Album[]
  photoCounts: { [key: number]: number }
  onAlbumClick: (albumId: number) => void
  onEditAlbum: (album: Album) => void
  onDeleteAlbum: (album: Album) => void
  onCreateNew: () => void
  searchTerm: string
}

const AlbumGrid: React.FC<AlbumGridProps> = ({
  filteredAlbums,
  photoCounts,
  onAlbumClick,
  onEditAlbum,
  onDeleteAlbum,
  onCreateNew,
  searchTerm,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (filteredAlbums.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: 4,
          border: "2px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Folder sx={{ fontSize: 120, color: "rgba(255, 255, 255, 0.6)", opacity: 0.8, mb: 2 }} />
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            mb: 3,
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {searchTerm ? "לא נמצאו אלבומים התואמים את החיפוש" : "אין אלבומים להצגה"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onCreateNew}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: "linear-gradient(45deg, #667eea, #764ba2)",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: "0 8px 20px rgba(0, 180, 255, 0.4)",
            "&:hover": {
              background: "linear-gradient(45deg, #00b4ff, #0081ff)",
              transform: "translateY(-2px) scale(1.05)",
            },
          }}
        >
          צור אלבום חדש
        </Button>
      </Box>
    )
  }

  return (
    <Grid container spacing={4} component={motion.div} variants={container} initial="hidden" animate="show">
      <AnimatePresence>
        {filteredAlbums.map((album, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={album.id} component={motion.div} variants={item} layout>
            <AlbumCard
              album={album}
              index={index}
              photoCount={photoCounts[album.id!] || 0}
              onAlbumClick={onAlbumClick}
              onEditAlbum={onEditAlbum}
              onDeleteAlbum={onDeleteAlbum}
            />
          </Grid>
        ))}
      </AnimatePresence>
    </Grid>
  )
}

export default AlbumGrid
