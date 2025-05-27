"use client"

import type React from "react"
import { Box, Button, Paper } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import BrushIcon from "@mui/icons-material/Brush"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import ShapeLineIcon from "@mui/icons-material/Hexagon"
import PaletteIcon from "@mui/icons-material/Palette"
import type { CollageState } from "./use-collage-state"

interface CollageOptionsHeaderProps {
  collageState: CollageState
  setNotification: (notification: { open: boolean; message: string; severity: "success" | "error" }) => void
}

export const CollageOptionsHeader: React.FC<CollageOptionsHeaderProps> = ({ collageState }) => {
  const options = [
    {
      id: "layout",
      label: "פריסה",
      icon: <SettingsIcon />,
      color: "#4CAF50", // ירוק - הגדרות
      hoverColor: "#45a049",
      description: "הגדרות פריסה ורקע",
    },
    {
      id: "text",
      label: "טקסט",
      icon: <TextFieldsIcon />,
      color: "#2196F3", // כחול - טקסט
      hoverColor: "#1976D2",
      description: "הוסף טקסט לקולאז'",
    },
    {
      id: "draw",
      label: "ציור",
      icon: <BrushIcon />,
      color: "#FF9800", // כתום - ציור
      hoverColor: "#F57C00",
      description: "ציור חופשי",
    },
    {
      id: "shapes",
      label: "צורות",
      icon: <ShapeLineIcon />,
      color: "#9C27B0", // סגול - צורות
      hoverColor: "#7B1FA2",
      description: "הוסף צורות גיאומטריות",
    },
    {
      id: "stickers",
      label: "מדבקות",
      icon: <EmojiEmotionsIcon />,
      color: "#E91E63", // ורוד - מדבקות
      hoverColor: "#C2185B",
      description: "הוסף מדבקות ואימוג'ים",
    },
    {
      id: "brush",
      label: "מברשת",
      icon: <PaletteIcon />,
      color: "#607D8B", // אפור-כחול - מברשת
      hoverColor: "#455A64",
      description: "הגדרות מברשת וצבעים",
    },
  ]

  return (
    <Paper
      elevation={3}
      sx={{
        mx: 3,
        mt: 2,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
          p: 2,
          flexWrap: "wrap",
        }}
      >
        {options.map((option) => (
          <Button
            key={option.id}
            variant="contained"
            startIcon={option.icon}
            onClick={() => collageState.handleOpenDialog(option.id as any)}
            sx={{
              backgroundColor: option.color,
              color: "white",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "14px",
              minWidth: "120px",
              boxShadow: `0 4px 15px ${option.color}40`,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: option.hoverColor,
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${option.color}60`,
              },
              "&:active": {
                transform: "translateY(0)",
              },
            }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    </Paper>
  )
}
