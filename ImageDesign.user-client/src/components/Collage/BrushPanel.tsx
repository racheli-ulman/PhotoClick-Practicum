// "use client"

// import type React from "react"
// import { Box, Typography, Slider, Grid, Paper } from "@mui/material"
// import { useRef, useEffect } from "react"

// interface BrushPanelProps {
//   brushColor: string
//   brushSize: number
//   onColorChange: (color: string) => void
//   onSizeChange: (size: number) => void
// }

// export const BrushPanel: React.FC<BrushPanelProps> = ({ brushColor, brushSize, onColorChange, onSizeChange }) => {
//   // Predefined colors
//   const colorPalette = [
//     "#000000",
//     "#ffffff",
//     "#ff0000",
//     "#00ff00",
//     "#0000ff",
//     "#ffff00",
//     "#00ffff",
//     "#ff00ff",
//     "#ff9900",
//     "#9900ff",
//     "#990000",
//     "#009900",
//     "#000099",
//     "#999999",
//     "#555555",
//   ]

//   // Reference to the brush preview canvas
//   const previewCanvasRef = useRef<HTMLCanvasElement>(null)

//   // Update the brush preview when color or size changes
//   useEffect(() => {
//     const canvas = previewCanvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     // Draw a line to preview the brush
//     const centerY = canvas.height / 2
//     ctx.beginPath()
//     ctx.moveTo(20, centerY)
//     ctx.lineTo(canvas.width - 20, centerY)
//     ctx.strokeStyle = brushColor
//     ctx.lineWidth = brushSize
//     ctx.lineCap = "round"
//     ctx.stroke()

//     // Draw brush size indicator
//     ctx.beginPath()
//     ctx.arc(canvas.width / 2, centerY, brushSize / 2, 0, Math.PI * 2)
//     ctx.fillStyle = brushColor
//     ctx.fill()
//   }, [brushColor, brushSize])

//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//         הגדרות מברשת
//       </Typography>

//       {/* Brush Preview */}
//       <Box sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
//         <Typography gutterBottom>תצוגה מקדימה של המברשת</Typography>
//         <canvas
//           ref={previewCanvasRef}
//           width={300}
//           height={100}
//           style={{ width: "100%", height: "80px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}
//         />
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <Typography gutterBottom>צבע מברשת</Typography>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//           <input
//             type="color"
//             value={brushColor}
//             onChange={(e) => onColorChange(e.target.value)}
//             style={{ marginRight: "8px", width: "40px", height: "40px" }}
//           />
//           <Typography variant="body2">{brushColor}</Typography>
//         </Box>

//         <Typography gutterBottom>צבעים מהירים</Typography>
//         <Grid container spacing={1} sx={{ mb: 2 }}>
//           {colorPalette.map((color) => (
//             <Grid item key={color}>
//               <Paper
//                 elevation={2}
//                 sx={{
//                   width: 30,
//                   height: 30,
//                   bgcolor: color,
//                   cursor: "pointer",
//                   border: color === brushColor ? "2px solid #1976d2" : "1px solid #ddd",
//                   "&:hover": { opacity: 0.8 },
//                 }}
//                 onClick={() => onColorChange(color)}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Box sx={{ mb: 3 }}>
//         <Typography gutterBottom>גודל מברשת: {brushSize}px</Typography>
//         <Slider
//           value={brushSize}
//           onChange={(_, newValue) => onSizeChange(newValue as number)}
//           min={1}
//           max={30}
//           step={1}
//           valueLabelDisplay="auto"
//         />

//         <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//           {[1, 5, 10, 15, 20, 25, 30].map((size) => (
//             <Paper
//               key={size}
//               elevation={2}
//               sx={{
//                 width: size,
//                 height: size,
//                 borderRadius: "50%",
//                 bgcolor: brushColor,
//                 cursor: "pointer",
//                 border: size === brushSize ? "2px solid #1976d2" : "none",
//                 "&:hover": { opacity: 0.8 },
//                 minWidth: "10px", // Ensure small sizes are still clickable
//               }}
//               onClick={() => onSizeChange(size)}
//             />
//           ))}
//         </Box>
//       </Box>

//       <Typography variant="body2" sx={{ color: "text.secondary" }}>
//         בחר צבע וגודל מברשת לפני שתתחיל לצייר. עבור לכרטיסיית "ציור" כדי להתחיל לצייר על הקולאז'.
//       </Typography>
//     </Box>
//   )
// }


"use client"

import type React from "react"
import { Box, Typography, Slider, Grid, Paper } from "@mui/material"
import { useRef, useEffect } from "react"

interface BrushPanelProps {
  brushColor: string
  brushSize: number
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
}

export const BrushPanel: React.FC<BrushPanelProps> = ({ brushColor, brushSize, onColorChange, onSizeChange }) => {
  // Predefined colors
  const colorPalette = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff",
    "#ff9900",
    "#9900ff",
    "#990000",
    "#009900",
    "#000099",
    "#999999",
    "#555555",
  ]

  // Reference to the brush preview canvas
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)

  // Update the brush preview when color or size changes
  useEffect(() => {
    const canvas = previewCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a line to preview the brush
    const centerY = canvas.height / 2
    ctx.beginPath()
    ctx.moveTo(20, centerY)
    ctx.lineTo(canvas.width - 20, centerY)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw brush size indicator
    ctx.beginPath()
    ctx.arc(canvas.width / 2, centerY, brushSize / 2, 0, Math.PI * 2)
    ctx.fillStyle = brushColor
    ctx.fill()
  }, [brushColor, brushSize])

  return (
    <Box>
      {/* Brush Preview */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, rgba(189, 132, 246, 0.1), rgba(0, 212, 255, 0.1))",
          border: "2px solid rgba(189, 132, 246, 0.2)",
        }}
      >
        <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          תצוגה מקדימה של המברשת
        </Typography>
        <canvas
          ref={previewCanvasRef}
          width={300}
          height={100}
          style={{
            width: "100%",
            height: "80px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "2px solid rgba(189, 132, 246, 0.1)",
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          צבע מברשת
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => onColorChange(e.target.value)}
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
              background: "rgba(189, 132, 246, 0.1)",
              px: 2,
              py: 1,
              borderRadius: 2,
              fontFamily: "monospace",
            }}
          >
            {brushColor}
          </Typography>
        </Box>

        <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          צבעים מהירים
        </Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {colorPalette.map((color) => (
            <Grid item key={color}>
              <Paper
                elevation={color === brushColor ? 4 : 2}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color,
                  cursor: "pointer",
                  border: color === brushColor ? "3px solid #bd84f6" : "2px solid rgba(189, 132, 246, 0.2)",
                  borderRadius: 2,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: "0 4px 15px rgba(189, 132, 246, 0.3)",
                  },
                }}
                onClick={() => onColorChange(color)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          גודל מברשת: {brushSize}px
        </Typography>
        <Slider
          value={brushSize}
          onChange={(_, newValue) => onSizeChange(newValue as number)}
          min={1}
          max={30}
          step={1}
          valueLabelDisplay="auto"
          sx={{
            color: "#bd84f6",
            "& .MuiSlider-thumb": {
              background: "linear-gradient(45deg, #bd84f6, #00d4ff)",
              width: 24,
              height: 24,
              "&:hover": {
                boxShadow: "0 0 0 8px rgba(189, 132, 246, 0.16)",
              },
            },
            "& .MuiSlider-track": {
              background: "linear-gradient(45deg, #bd84f6, #00d4ff)",
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, gap: 1 }}>
          {[1, 5, 10, 15, 20, 25, 30].map((size) => (
            <Paper
              key={size}
              elevation={size === brushSize ? 4 : 2}
              sx={{
                width: Math.max(size, 20),
                height: Math.max(size, 20),
                borderRadius: "50%",
                bgcolor: brushColor,
                cursor: "pointer",
                border: size === brushSize ? "3px solid #bd84f6" : "2px solid rgba(189, 132, 246, 0.2)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)",
                  boxShadow: "0 4px 15px rgba(189, 132, 246, 0.3)",
                },
                minWidth: "20px",
                minHeight: "20px",
              }}
              onClick={() => onSizeChange(size)}
            />
          ))}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: "#666",
          background: "rgba(189, 132, 246, 0.05)",
          p: 2,
          borderRadius: 2,
          border: "1px solid rgba(189, 132, 246, 0.1)",
        }}
      >
        בחר צבע וגודל מברשת לפני שתתחיל לצייר. עבור לכרטיסיית "ציור" כדי להתחיל לצייר על הקולאז'.
      </Typography>
    </Box>
  )
}

