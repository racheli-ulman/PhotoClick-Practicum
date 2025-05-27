"use client"

import type React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Slider,
  Box,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Backdrop,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SettingsIcon from "@mui/icons-material/Settings"
import TextFieldsIcon from "@mui/icons-material/TextFields"
import BrushIcon from "@mui/icons-material/Brush"
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"
import ShapeLineIcon from "@mui/icons-material/Hexagon"
import PaletteIcon from "@mui/icons-material/Palette"
import type { CollageState } from "./use-collage-state"
import { ShapesPanel } from "./ShapesPanel"
import { StickersPanel } from "./StickersPanel"
import { BrushPanel } from "./BrushPanel"

interface CollageDialogsProps {
  collageState: CollageState
}

export const CollageDialogs: React.FC<CollageDialogsProps> = ({ collageState }) => {
  const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    collageState.setLayout(event.target.value as any)
  }

  const handleGapSizeChange = (event: Event, newValue: number | number[]) => {
    collageState.setGapSize(newValue as number)
    console.log(event);
    
  }

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    collageState.setBackgroundColor(event.target.value)
  }

  const handleTextSizeChange = (event: Event, newValue: number | number[]) => {
    collageState.setTextSize(newValue as number)
    console.log(event);
    
  }

  return (
    <>
      {/* Layout Dialog */}
      <Dialog
        open={collageState.openLayoutDialog}
        onClose={() => collageState.setOpenLayoutDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SettingsIcon />
          הגדרות פריסה
          <IconButton
            onClick={() => collageState.setOpenLayoutDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
            <FormLabel component="legend" sx={{ fontWeight: "bold", color: "#333" }}>
              פריסה
            </FormLabel>
            <RadioGroup value={collageState.layout} onChange={handleLayoutChange}>
              <FormControlLabel value="grid" control={<Radio sx={{ color: "#4CAF50" }} />} label="רשת" />
              <FormControlLabel value="horizontal" control={<Radio sx={{ color: "#4CAF50" }} />} label="אופקי" />
              <FormControlLabel value="vertical" control={<Radio sx={{ color: "#4CAF50" }} />} label="אנכי" />
              <FormControlLabel value="random" control={<Radio sx={{ color: "#4CAF50" }} />} label="אקראי" />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              מרווח בין תמונות
            </Typography>
            <Slider
              value={collageState.gapSize}
              onChange={handleGapSizeChange}
              min={0}
              max={40}
              step={2}
              valueLabelDisplay="auto"
              sx={{
                color: "#4CAF50",
                "& .MuiSlider-thumb": {
                  background: "linear-gradient(45deg, #4CAF50, #45a049)",
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע רקע
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                value={collageState.backgroundColor}
                onChange={handleBackgroundColorChange}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  background: "rgba(76, 175, 80, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontFamily: "monospace",
                }}
              >
                {collageState.backgroundColor}
              </Typography>
            </Box>
          </Box>

          <FormControl component="fieldset" fullWidth>
            <FormControlLabel
              control={
                <Checkbox
                  checked={collageState.showPhotoNames}
                  onChange={(e) => collageState.setShowPhotoNames(e.target.checked)}
                  sx={{ color: "#4CAF50" }}
                />
              }
              label="הצג שמות תמונות בקולאז'"
            />
          </FormControl>
        </DialogContent>
      </Dialog>

      {/* Text Dialog */}
      <Dialog
        open={collageState.openTextDialog}
        onClose={() => collageState.setOpenTextDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #2196F3, #1976D2)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <TextFieldsIcon />
          הוסף טקסט לקולאז'
          <IconButton
            onClick={() => collageState.setOpenTextDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="טקסט על הקולאז'"
            value={collageState.overlayText}
            onChange={(e) => collageState.setOverlayText(e.target.value)}
            variant="outlined"
            margin="normal"
            placeholder="לדוגמה: BABY"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#2196F3",
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#2196F3",
              },
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="text-position-label">מיקום הטקסט</InputLabel>
            <Select
              labelId="text-position-label"
              value={collageState.textPosition}
              onChange={(e) => collageState.setTextPosition(e.target.value as any)}
              label="מיקום הטקסט"
            >
              <MenuItem value="top">למעלה</MenuItem>
              <MenuItem value="center">מרכז</MenuItem>
              <MenuItem value="bottom">למטה</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="text-style-label">סגנון טקסט</InputLabel>
            <Select
              labelId="text-style-label"
              value={collageState.textStyle}
              onChange={(e) => collageState.setTextStyle(e.target.value as any)}
              label="סגנון טקסט"
            >
              <MenuItem value="normal">רגיל</MenuItem>
              <MenuItem value="bold">מודגש</MenuItem>
              <MenuItem value="italic">נטוי</MenuItem>
              <MenuItem value="bold italic">מודגש ונטוי</MenuItem>
            </Select>
          </FormControl>

          <Typography gutterBottom sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>
            גודל טקסט
          </Typography>
          <Slider
            value={collageState.textSize}
            onChange={handleTextSizeChange}
            min={12}
            max={72}
            step={4}
            valueLabelDisplay="auto"
            sx={{
              color: "#2196F3",
              "& .MuiSlider-thumb": {
                background: "linear-gradient(45deg, #2196F3, #1976D2)",
              },
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 2 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע טקסט
            </Typography>
            <input
              type="color"
              value={collageState.textColor}
              onChange={(e) => collageState.setTextColor(e.target.value)}
              style={{
                width: "60px",
                height: "40px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={collageState.textShadow}
                  onChange={(e) => collageState.setTextShadow(e.target.checked)}
                  sx={{ color: "#2196F3" }}
                />
              }
              label="צל טקסט"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={collageState.showTextBackground}
                  onChange={(e) => collageState.setShowTextBackground(e.target.checked)}
                  sx={{ color: "#2196F3" }}
                />
              }
              label="רקע לטקסט"
            />
          </Box>

          {collageState.showTextBackground && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: 4, gap: 2 }}>
              <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
                צבע רקע לטקסט
              </Typography>
              <input
                type="color"
                value={collageState.textBackgroundColor.replace("rgba", "rgb").replace(/,[^,]*\)/, ")")}
                onChange={(e) => {
                  const rgb = e.target.value
                  const rgba = rgb.replace("rgb", "rgba").replace(")", ",0.3)")
                  collageState.setTextBackgroundColor(rgba)
                }}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (collageState.overlayText.trim()) {
                collageState.selectText(collageState.overlayText)
              }
            }}
            sx={{
              background: "linear-gradient(45deg, #2196F3, #1976D2)",
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2, #1565C0)",
                transform: "translateY(-2px)",
              },
            }}
          >
            הוסף טקסט לקולאז'
          </Button>
        </DialogActions>
      </Dialog>

      {/* Draw Dialog */}
      <Dialog
        open={collageState.openDrawDialog}
        onClose={() => collageState.setOpenDrawDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #FF9800, #F57C00)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <BrushIcon />
          ציור חופשי
          <IconButton
            onClick={() => collageState.setOpenDrawDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              צבע מברשת
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input
                type="color"
                value={collageState.brushColor}
                onChange={(e) => collageState.setBrushColor(e.target.value)}
                style={{
                  width: "60px",
                  height: "40px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  background: "rgba(255, 152, 0, 0.1)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontFamily: "monospace",
                }}
              >
                {collageState.brushColor}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
              גודל מברשת
            </Typography>
            <Slider
              value={collageState.brushSize}
              onChange={(_, newValue) => collageState.setBrushSize(newValue as number)}
              min={1}
              max={20}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#FF9800",
                "& .MuiSlider-thumb": {
                  background: "linear-gradient(45deg, #FF9800, #F57C00)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              collageState.setDrawingMode(!collageState.drawingMode)
              collageState.setOpenDrawDialog(false)
            }}
            startIcon={<BrushIcon />}
            sx={{
              background: collageState.drawingMode
                ? "linear-gradient(45deg, #f44336, #ff9800)"
                : "linear-gradient(45deg, #FF9800, #F57C00)",
              borderRadius: 3,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                background: collageState.drawingMode
                  ? "linear-gradient(45deg, #d32f2f, #f57c00)"
                  : "linear-gradient(45deg, #F57C00, #E65100)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {collageState.drawingMode ? "הפסק ציור" : "התחל ציור"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shapes Dialog */}
      <Dialog
        open={collageState.openShapesDialog}
        onClose={() => collageState.setOpenShapesDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #9C27B0, #7B1FA2)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShapeLineIcon />
          הוסף צורות
          <IconButton
            onClick={() => collageState.setOpenShapesDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ShapesPanel
            onAddShape={collageState.selectShape}
            brushColor={collageState.brushColor}
            onColorChange={(color) => collageState.setBrushColor(color)}
          />
        </DialogContent>
      </Dialog>

      {/* Stickers Dialog */}
      <Dialog
        open={collageState.openStickersDialog}
        onClose={() => collageState.setOpenStickersDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #E91E63, #C2185B)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <EmojiEmotionsIcon />
          הוסף מדבקות
          <IconButton
            onClick={() => collageState.setOpenStickersDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <StickersPanel onAddSticker={collageState.selectSticker} />
        </DialogContent>
      </Dialog>

      {/* Brush Dialog */}
      <Dialog
        open={collageState.openBrushDialog}
        onClose={() => collageState.setOpenBrushDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #607D8B, #455A64)",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <PaletteIcon />
          הגדרות מברשת
          <IconButton
            onClick={() => collageState.setOpenBrushDialog(false)}
            sx={{
              ml: "auto",
              color: "white",
              "&:hover": { background: "rgba(255,255,255,0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <BrushPanel
            brushColor={collageState.brushColor}
            brushSize={collageState.brushSize}
            onColorChange={(color) => collageState.setBrushColor(color)}
            onSizeChange={(size) => collageState.setBrushSize(size)}
          />
        </DialogContent>
      </Dialog>

      {/* Backdrop for dialogs */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(5px)",
        }}
        open={
          collageState.openLayoutDialog ||
          collageState.openTextDialog ||
          collageState.openDrawDialog ||
          collageState.openShapesDialog ||
          collageState.openStickersDialog ||
          collageState.openBrushDialog
        }
      />
    </>
  )
}
