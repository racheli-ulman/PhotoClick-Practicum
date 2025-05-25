"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import { Search, Close, ArrowUpward, ArrowDownward, SortByAlpha, PhotoLibrary } from "@mui/icons-material"

interface SearchAndSortProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  sortBy: string
  setSortBy: (sortBy: string) => void
  sortDirection: "asc" | "desc"
  setSortDirection: (direction: "asc" | "desc") => void
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget)
  }

  const handleSortMenuClose = () => {
    setSortAnchorEl(null)
  }

  const handleSortChange = (sortType: string) => {
    if (sortBy === sortType) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(sortType)
      setSortDirection("asc")
    }
    handleSortMenuClose()
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
      <TextField
        variant="outlined"
        placeholder="חיפוש אלבומים..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="medium"
        sx={{
          width: { xs: "100%", sm: 350 },
          "& .MuiOutlinedInput-root": {
            background: "rgba(87, 112, 223, 0.15)",
            backdropFilter: "blur(20px)",
            borderRadius: 3,
            border: "2px solid transparent",
            borderImage: "linear-gradient(45deg,rgb(162, 75, 156), #f093fb, #00d4ff) 1",
            color: "white",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.2)",
              border: "2px solid rgba(118, 75, 162, 0.7)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 180, 255, 0.3)",
            },
            "&.Mui-focused": {
              background: "rgba(255, 255, 255, 0.25)",
              border: "2px solid rgb(155, 75, 162)",
              boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)",
            },
            "& fieldset": {
              border: "none",
            },
            "& input": {
              color: "black",
              "&::placeholder": {
                color: "rgba(0, 0, 0, 0.7)",
              },
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "rgba(255, 255, 255, 0.8)" }} />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                edge="end"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box>
        <Button
          variant="outlined"
          startIcon={sortDirection === "asc" ? <ArrowUpward /> : <ArrowDownward />}
          endIcon={<SortByAlpha />}
          onClick={handleSortMenuOpen}
          size="medium"
          sx={{
            borderRadius: 3,
            background: "white",
            color: "#6b7280",
            fontWeight: "bold",
            px: 3,
            py: 1,
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
            "& .MuiButton-startIcon, & .MuiButton-endIcon": {
              color: "#9ca3af",
              transition: "all 0.3s ease",
            },
            "&:hover .MuiButton-startIcon, &:hover .MuiButton-endIcon": {
              color: "#6b7280",
            },
          }}
        >
          {sortBy === "name" ? "מיון לפי שם" : "מיון לפי תאריך"}
        </Button>
        <Menu
          anchorEl={sortAnchorEl}
          open={Boolean(sortAnchorEl)}
          onClose={handleSortMenuClose}
          PaperProps={{
            sx: {
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: 2,
              mt: 1,
            },
          }}
        >
          <MenuItem
            onClick={() => handleSortChange("name")}
            selected={sortBy === "name"}
            sx={{
              color: "white",
              "&:hover": {
                background: "rgba(0, 229, 255, 0.2)",
              },
              "&.Mui-selected": {
                background: "rgba(0, 229, 255, 0.3)",
              },
            }}
          >
            <ListItemIcon>
              <SortByAlpha fontSize="small" sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText>לפי שם</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => handleSortChange("date")}
            selected={sortBy === "date"}
            sx={{
              color: "white",
              "&:hover": {
                background: "rgba(0, 229, 255, 0.2)",
              },
              "&.Mui-selected": {
                background: "rgba(0, 229, 255, 0.3)",
              },
            }}
          >
            <ListItemIcon>
              <PhotoLibrary fontSize="small" sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText>לפי תאריך</ListItemText>
          </MenuItem>
          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }} />
          <MenuItem
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            sx={{
              color: "white",
              "&:hover": {
                background: "rgba(0, 229, 255, 0.2)",
              },
            }}
          >
            <ListItemIcon>
              {sortDirection === "asc" ? (
                <ArrowUpward fontSize="small" sx={{ color: "white" }} />
              ) : (
                <ArrowDownward fontSize="small" sx={{ color: "white" }} />
              )}
            </ListItemIcon>
            <ListItemText>{sortDirection === "asc" ? "סדר עולה" : "סדר יורד"}</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  )
}

export default SearchAndSort
