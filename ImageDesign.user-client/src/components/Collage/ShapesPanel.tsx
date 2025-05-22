"use client"

import React from "react"
import { Box, Typography, Grid, Paper, Tooltip } from "@mui/material"
import SquareIcon from "@mui/icons-material/Square"
import CircleIcon from "@mui/icons-material/Circle"
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory"
import StarIcon from "@mui/icons-material/Star"

interface ShapesPanelProps {
  onAddShape: (shapeType: string) => void
  brushColor: string
  onColorChange?: (color: string) => void
}

// Component to render a shape
export const ShapeComponent = ({
  type,
  color,
  borderWidth = 2,
//   borderColor = "#000000",
  fillColor = "rgba(255, 255, 255, 0.5)",
}: {
  type: string
  color: string
  borderWidth?: number
  borderColor?: string
  fillColor?: string
}) => {
  switch (type) {
    case "rectangle":
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: fillColor,
            border: `${borderWidth}px solid ${color}`,
          }}
        />
      )
    case "circle":
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: fillColor,
            border: `${borderWidth}px solid ${color}`,
            borderRadius: "50%",
          }}
        />
      )
    case "triangle":
      return (
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: "50px solid transparent",
            borderRight: "50px solid transparent",
            borderBottom: `100px solid ${fillColor}`,
            position: "relative",
            margin: "0 auto",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              borderLeft: "48px solid transparent",
              borderRight: "48px solid transparent",
              borderBottom: `96px solid ${fillColor}`,
              top: "2px",
              left: "-48px",
            }}
          />
        </Box>
      )
    case "star":
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: fillColor,
            border: `${borderWidth}px solid ${color}`,
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
        />
      )
    default:
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: fillColor,
            border: `${borderWidth}px solid ${color}`,
          }}
        />
      )
  }
}

export const ShapesPanel: React.FC<ShapesPanelProps> = ({ onAddShape, brushColor, onColorChange }) => {
  const shapes = [
    { id: "rectangle", name: "מלבן", icon: <SquareIcon fontSize="large" /> },
    { id: "circle", name: "עיגול", icon: <CircleIcon fontSize="large" /> },
    { id: "triangle", name: "משולש", icon: <ChangeHistoryIcon fontSize="large" /> },
    { id: "star", name: "כוכב", icon: <StarIcon fontSize="large" /> },
  ]

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        הוסף צורות
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>צבע צורה</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => onColorChange && onColorChange(e.target.value)}
            style={{ marginRight: "8px" }}
          />
          <Typography variant="body2">{brushColor}</Typography>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {shapes.map((shape) => (
          <Grid item xs={6} key={shape.id}>
            <Tooltip title={shape.name}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => onAddShape(shape.id)}
              >
                {React.cloneElement(shape.icon, { color: "primary" })}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {shape.name}
                </Typography>
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        לחץ על צורה כדי לבחור אותה, ואז לחץ על הקולאז' כדי למקם אותה. לאחר הוספה, תוכל לשנות את גודלה ומיקומה.
      </Typography>
    </Box>
  )
}
