"use client"

import type React from "react"
import { Box, Paper, IconButton, Tooltip } from "@mui/material"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import DeleteIcon from "@mui/icons-material/Delete"
import type { CollageState } from "./use-collage-state"

interface CollageToolbarProps {
  collageState: CollageState
}

export const CollageToolbar: React.FC<CollageToolbarProps> = ({ collageState }) => {
  if (
    collageState.activeTab !== "draw" &&
    collageState.activeTab !== "shapes" &&
    collageState.activeTab !== "stickers"
  ) {
    return null
  }

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 4,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <Tooltip title="בטל">
          <span>
            <IconButton
              onClick={collageState.handleUndo}
              disabled={collageState.undoStack.length === 0}
              sx={{
                color: "#ea66cb",
                "&:hover": {
                  background: "rgba(234, 102, 203, 0.1)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="בצע שוב">
          <span>
            <IconButton
              onClick={collageState.handleRedo}
              disabled={collageState.redoStack.length === 0}
              sx={{
                color: "#bd84f6",
                "&:hover": {
                  background: "rgba(189, 132, 246, 0.1)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="מחק נבחר">
          <span>
            <IconButton
              onClick={() =>
                collageState.selectedElement && collageState.removeDrawingElement(collageState.selectedElement)
              }
              disabled={!collageState.selectedElement}
              sx={{
                color: "#f44336",
                "&:hover": {
                  background: "rgba(244, 67, 54, 0.1)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Paper>
  )
}
