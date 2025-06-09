// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
//   Chip,
//   Alert,
//   CircularProgress,
//   Grid,
//   Stack,
//   IconButton,
//   Tooltip,
//   Paper,
// } from "@mui/material"
// import { styled } from "@mui/material"
// import { Download, AutoAwesome, PhotoCamera, Send, Refresh } from "@mui/icons-material"

// // Styled components with clean design
// const CleanBackground = styled(Box)({
//   minHeight: "100vh",
//   background: "#ffffff",
//   display: "flex",
//   alignItems: "center",
// })

// const GradientBorderCard = styled(Card)({
//   borderRadius: "12px",
//   background: "#ffffff",
//   boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
//   position: "relative",
//   overflow: "hidden",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     height: "4px",
//     background: "linear-gradient(90deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
//   },
// })

// const CleanTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     borderRadius: "8px",
//     "& fieldset": {
//       borderColor: "#e0e0e0",
//     },
//     "&:hover fieldset": {
//       borderColor: "#bdbdbd",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "#bd84f6",
//     },
//   },
//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#bd84f6",
//   },
// })

// const GradientButton = styled(Button)({
//   background: "linear-gradient(90deg, #ea66cb, #bd84f6)",
//   color: "white",
//   borderRadius: "8px",
//   textTransform: "none",
//   fontWeight: 600,
//   padding: "8px 24px",
//   boxShadow: "0 4px 10px rgba(189, 132, 246, 0.3)",
//   "&:hover": {
//     background: "linear-gradient(90deg, #d65bb6, #a96edb)",
//     boxShadow: "0 6px 12px rgba(189, 132, 246, 0.4)",
//   },
//   "&:disabled": {
//     background: "#e0e0e0",
//     color: "#9e9e9e",
//     boxShadow: "none",
//   },
// })

// const SecondaryButton = styled(Button)({
//   background: "linear-gradient(90deg, #00d4ff, #0ea5e9)",
//   color: "white",
//   borderRadius: "8px",
//   textTransform: "none",
//   fontWeight: 600,
//   padding: "8px 16px",
//   boxShadow: "0 4px 10px rgba(0, 212, 255, 0.3)",
//   "&:hover": {
//     background: "linear-gradient(90deg, #00bce2, #0284c7)",
//     boxShadow: "0 6px 12px rgba(0, 212, 255, 0.4)",
//   },
// })

// const ImageGenerator: React.FC = () => {
//   const [prompt, setPrompt] = useState<string>("")
//   const [imageUrl, setImageUrl] = useState<string | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)
//   const [currentPlaceholder, setCurrentPlaceholder] = useState<number>(0)
//   const baseURL = import.meta.env.VITE_API_URL

//   const placeholderTexts = [
//     "תמונה של כלב חמוד משחק בגינה...",
//     "ילדה מחייכת עם פרחים בשיער...",
//     "נוף הרים מדהים בשקיעה...",
//     "חתול ישן על ספר פתוח...",
//     "פרפר צבעוני על פרח אדום...",
//   ]

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length)
//     }, 2500)
//     return () => clearInterval(interval)
//   }, [])

//   const handleGenerateImage = async () => {
//     if (!prompt.trim()) {
//       setError("אנא הכנס תיאור לתמונה")
//       return
//     }

//     setLoading(true)
//     setError(null)
//     setImageUrl(null)

//     try {
//       const response = await fetch(`${baseURL}/Ai/generate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to generate image")
//       }

//       const imageData = await response.text()
//       setImageUrl(imageData)
//     } catch (err) {
//       setError("שגיאה ביצירת התמונה. אנא נסה שוב.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDownloadImage = async () => {
//     if (!imageUrl) return

//     try {
//       const response = await fetch(imageUrl)
//       const blob = await response.blob()
//       const url = URL.createObjectURL(blob)
//       const link = document.createElement("a")
//       link.href = url
//       link.download = `ai-generated-${Date.now()}.png`
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       URL.revokeObjectURL(url)
//     } catch (err) {
//       console.error("Error downloading image:", err)
//       const img = new Image()
//       img.crossOrigin = "anonymous"
//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         const ctx = canvas.getContext("2d")
//         canvas.width = img.width
//         canvas.height = img.height
//         ctx?.drawImage(img, 0, 0)
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const url = URL.createObjectURL(blob)
//             const link = document.createElement("a")
//             link.href = url
//             link.download = `ai-generated-${Date.now()}.png`
//             document.body.appendChild(link)
//             link.click()
//             document.body.removeChild(link)
//             URL.revokeObjectURL(url)
//           }
//         }, "image/png")
//       }
//       img.src = imageUrl
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && e.ctrlKey) {
//       handleGenerateImage()
//     }
//   }

//   return (
//     <CleanBackground>
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         {/* Header */}
//         <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Box
//               sx={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: "8px",
//                 background: "linear-gradient(135deg, #ea66cb, #bd84f6)",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <AutoAwesome sx={{ color: "white", fontSize: 20 }} />
//             </Box>
//             <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
//               AI Image Studio
//             </Typography>
//           </Stack>
//           <Chip
//             label="בחינם • ללא הגבלה"
//             size="small"
//             sx={{
//               background: "linear-gradient(90deg, #f093fb20, #00d4ff20)",
//               border: "1px solid #f093fb40",
//               color: "#bd84f6",
//               fontWeight: 500,
//             }}
//           />
//         </Box>

//         <Grid container spacing={3} sx={{ height: "75vh" }}>
//           {/* Left Panel - Input */}
//           <Grid item xs={12} md={6}>
//             <GradientBorderCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//               <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
//                   תאר את התמונה שאתה רוצה ליצור
//                 </Typography>

//                 <CleanTextField
//                   fullWidth
//                   multiline
//                   rows={5}
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   onKeyDown={handleKeyPress}
//                   placeholder={placeholderTexts[currentPlaceholder]}
//                   InputProps={{
//                     style: { direction: "rtl", textAlign: "right" },
//                   }}
//                   sx={{ mb: 3, flex: 1 }}
//                 />

//                 {error && (
//                   <Alert
//                     severity="error"
//                     sx={{
//                       mb: 2,
//                       borderRadius: "8px",
//                     }}
//                   >
//                     {error}
//                   </Alert>
//                 )}

//                 <Stack direction="row" spacing={2}>
//                   <GradientButton
//                     fullWidth
//                     onClick={handleGenerateImage}
//                     disabled={loading || !prompt.trim()}
//                     startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
//                   >
//                     {loading ? "יוצר..." : "צור תמונה"}
//                   </GradientButton>
//                   <Tooltip title="נקה">
//                     <IconButton
//                       onClick={() => {
//                         setPrompt("")
//                         setError(null)
//                       }}
//                       sx={{
//                         border: "1px solid #e0e0e0",
//                         color: "#9e9e9e",
//                         "&:hover": { background: "#f5f5f5" },
//                       }}
//                     >
//                       <Refresh />
//                     </IconButton>
//                   </Tooltip>
//                 </Stack>

//                 <Typography
//                   variant="caption"
//                   sx={{ color: "#9e9e9e", mt: 2, textAlign: "center", fontSize: "0.75rem" }}
//                 >
//                   Ctrl + Enter לייצור מהיר
//                 </Typography>
//               </CardContent>
//             </GradientBorderCard>
//           </Grid>

//           {/* Right Panel - Result */}
//           <Grid item xs={12} md={6}>
//             <GradientBorderCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//               <CardContent sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//                   <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
//                     התוצאה
//                   </Typography>
//                   {imageUrl && (
//                     <SecondaryButton startIcon={<Download />} onClick={handleDownloadImage} size="small">
//                       הורד
//                     </SecondaryButton>
//                   )}
//                 </Stack>

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     flex: 1,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: "8px",
//                     border: "1px dashed #e0e0e0",
//                     background: "#fafafa",
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {loading ? (
//                     <Stack alignItems="center" spacing={2}>
//                       <CircularProgress size={40} sx={{ color: "#bd84f6" }} />
//                       <Typography sx={{ color: "#757575" }}>יוצר תמונה מדהימה...</Typography>
//                     </Stack>
//                   ) : imageUrl ? (
//                     <CardMedia
//                       component="img"
//                       image={imageUrl}
//                       alt="תמונה שנוצרה"
//                       sx={{
//                         width: "100%",
//                         height: "100%",
//                         objectFit: "contain",
//                       }}
//                     />
//                   ) : (
//                     <Stack alignItems="center" spacing={2}>
//                       <PhotoCamera sx={{ fontSize: 40, color: "#bdbdbd" }} />
//                       <Typography sx={{ color: "#757575", textAlign: "center" }}>
//                         התמונה שלך תופיע כאן
//                         <br />
//                         <Typography component="span" variant="caption" sx={{ color: "#9e9e9e" }}>
//                           הכנס תיאור ולחץ על "צור תמונה"
//                         </Typography>
//                       </Typography>
//                     </Stack>
//                   )}
//                 </Paper>
//               </CardContent>
//             </GradientBorderCard>
//           </Grid>
//         </Grid>

//         {/* Footer */}
//         <Box sx={{ mt: 3, textAlign: "center" }}>
//           <Typography variant="caption" sx={{ color: "#9e9e9e" }}>
//             מופעל על ידי בינה מלאכותית מתקדמת • יצירה מהירה ואיכותית
//           </Typography>
//         </Box>
//       </Container>
//     </CleanBackground>
//   )
// }

// export default ImageGenerator



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  LinearProgress,
} from "@mui/material"
import { styled, keyframes, alpha } from "@mui/material"
import { Download, AutoAwesome, PhotoCamera, Send, Refresh, Palette } from "@mui/icons-material"

// Advanced animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`

// const shimmer = keyframes`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`

// Professional styled components
const ModernBackground = styled(Box)({
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, 
      ${alpha("#ea66cb", 0.03)} 0%, 
      ${alpha("#bd84f6", 0.05)} 25%, 
      ${alpha("#f093fb", 0.03)} 50%, 
      ${alpha("#00d4ff", 0.04)} 75%, 
      transparent 100%
    ),
    radial-gradient(circle at 20% 80%, ${alpha("#ea66cb", 0.08)} 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, ${alpha("#00d4ff", 0.06)} 0%, transparent 50%),
    #ffffff
  `,
  display: "flex",
  alignItems: "center",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, ${alpha("#bd84f6", 0.1)} 0%, transparent 30%),
      radial-gradient(circle at 70% 70%, ${alpha("#f093fb", 0.08)} 0%, transparent 30%)
    `,
    pointerEvents: "none",
  },
})

const GlassMorphCard = styled(Card)({
  borderRadius: "20px",
  background: `
    linear-gradient(135deg, 
      ${alpha("#ffffff", 0.9)} 0%, 
      ${alpha("#ffffff", 0.8)} 100%
    )
  `,
  backdropFilter: "blur(20px)",
  border: `1px solid ${alpha("#ffffff", 0.3)}`,
  boxShadow: `
    0 8px 32px ${alpha("#000000", 0.08)},
    0 2px 8px ${alpha("#000000", 0.04)},
    inset 0 1px 0 ${alpha("#ffffff", 0.6)}
  `,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `
      0 12px 40px ${alpha("#000000", 0.12)},
      0 4px 12px ${alpha("#000000", 0.06)},
      inset 0 1px 0 ${alpha("#ffffff", 0.7)}
    `,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #ea66cb, #bd84f6, #f093fb, #00d4ff)",
  },
})

const ProfessionalTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    background: `linear-gradient(135deg, 
      ${alpha("#ffffff", 0.7)} 0%, 
      ${alpha("#ffffff", 0.5)} 100%
    )`,
    backdropFilter: "blur(10px)",
    border: `1px solid ${alpha("#bd84f6", 0.2)}`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "& fieldset": {
      border: "none",
    },
    "&:hover": {
      background: `linear-gradient(135deg, 
        ${alpha("#ffffff", 0.8)} 0%, 
        ${alpha("#ffffff", 0.6)} 100%
      )`,
      border: `1px solid ${alpha("#bd84f6", 0.3)}`,
      transform: "translateY(-1px)",
    },
    "&.Mui-focused": {
      background: `linear-gradient(135deg, 
        ${alpha("#ffffff", 0.9)} 0%, 
        ${alpha("#ffffff", 0.7)} 100%
      )`,
      border: `1px solid #bd84f6`,
      boxShadow: `0 0 0 3px ${alpha("#bd84f6", 0.1)}`,
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#bd84f6",
  },
})

const GradientButton = styled(Button)({
  background: "linear-gradient(135deg, #ea66cb 0%, #bd84f6 50%, #f093fb 100%)",
  color: "white",
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "12px 32px",
  fontSize: "1rem",
  boxShadow: `
    0 4px 15px ${alpha("#bd84f6", 0.4)},
    0 2px 8px ${alpha("#bd84f6", 0.2)}
  `,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    background: "linear-gradient(135deg, #d65bb6 0%, #a96edb 50%, #e87de6 100%)",
    transform: "translateY(-2px)",
    boxShadow: `
      0 8px 25px ${alpha("#bd84f6", 0.5)},
      0 4px 12px ${alpha("#bd84f6", 0.3)}
    `,
    "&::before": {
      left: "100%",
    },
  },
  "&:disabled": {
    background: `linear-gradient(135deg, ${alpha("#e0e0e0", 0.8)}, ${alpha("#bdbdbd", 0.8)})`,
    color: alpha("#ffffff", 0.7),
    boxShadow: "none",
  },
})

const SecondaryButton = styled(Button)({
  background: "linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)",
  color: "white",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 20px",
  boxShadow: `0 4px 12px ${alpha("#00d4ff", 0.3)}`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #00bce2 0%, #0284c7 100%)",
    transform: "translateY(-1px)",
    boxShadow: `0 6px 16px ${alpha("#00d4ff", 0.4)}`,
  },
})

const FloatingIcon = styled(Box)({
  position: "absolute",
  animation: `${float} 6s ease-in-out infinite`,
  opacity: 0.1,
  pointerEvents: "none",
})

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPlaceholder, setCurrentPlaceholder] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)
  const baseURL = import.meta.env.VITE_API_URL

  const placeholderTexts = [
    "תמונה של כלב חמוד משחק בגינה...",
    "ילדה מחייכת עם פרחים בשיער...",
    "נוף הרים מדהים בשקיעה...",
    "חתול ישן על ספר פתוח...",
    "פרפר צבעוני על פרח אדום...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(timer)
    } else {
      setProgress(0)
    }
  }, [loading])

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("אנא הכנס תיאור לתמונה")
      return
    }

    setLoading(true)
    setError(null)
    setImageUrl(null)
    setProgress(0)

    try {
      const response = await fetch(`${baseURL}/Ai/generate`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
        
      })
console.log("response", response);

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const imageData = await response.text()
      setProgress(100)
      setTimeout(() => setImageUrl(imageData), 300)
    } catch (err) {
      setError("שגיאה ביצירת התמונה. אנא נסה שוב.")
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  // const handleDownloadImage = async () => {
  //   if (!imageUrl) return

  //   try {
  //     const response = await fetch(imageUrl)
  //     const blob = await response.blob()
  //     const url = URL.createObjectURL(blob)
  //     const link = document.createElement("a")
  //     link.href = url
  //     link.download = `ai-generated-${Date.now()}.png`
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //     URL.revokeObjectURL(url)
  //   } catch (err) {
  //     console.error("Error downloading image:", err)
  //     const img = new Image()
  //     img.crossOrigin = "anonymous"
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas")
  //       const ctx = canvas.getContext("2d")
  //       canvas.width = img.width
  //       canvas.height = img.height
  //       ctx?.drawImage(img, 0, 0)
  //       canvas.toBlob((blob) => {
  //         if (blob) {
  //           const url = URL.createObjectURL(blob)
  //           const link = document.createElement("a")
  //           link.href = url
  //           link.download = `ai-generated-${Date.now()}.png`
  //           document.body.appendChild(link)
  //           link.click()
  //           document.body.removeChild(link)
  //           URL.revokeObjectURL(url)
  //         }
  //       }, "image/png")
  //     }
  //     img.src = imageUrl
  //   }
  // }



  const handleDownloadImage = async () => {
  if (!imageUrl) return

  try {
    // נסה תחילה הורדה ישירה
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `ai-generated-${Date.now()}.png`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("שגיאה בהורדה ישירה, מנסה עם fetch:", error)
    
    // אם הורדה ישירה נכשלה, נסה עם fetch
    try {
      const response = await fetch(imageUrl, {
        mode: 'cors',
        headers: {
          'Accept': 'image/*'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `ai-generated-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (fetchError) {
      console.error("שגיאה בהורדת התמונה:", fetchError)
      alert("שגיאה בהורדת התמונה. נסה להקליק על התמונה ולשמור אותה ידנית.")
    }
  }
}


// const handleDownloadImage = async () => {
//   if (!imageUrl) return

//   try {
//     const response = await fetch(imageUrl)
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }
    
//     const blob = await response.blob()
//     const blobUrl = window.URL.createObjectURL(blob)
    
//     // יצירת קישור להורדה
//     const link = document.createElement("a")
//     link.href = blobUrl
//     link.download = `ai-generated-${Date.now()}.png`
//     link.style.display = "none" // הסתרת הקישור
    
//     // הוספה לדום, לחיצה והסרה
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
    
//     // ניקוי הזיכרון
//     setTimeout(() => {
//       window.URL.revokeObjectURL(blobUrl)
//     }, 100)
    
//   } catch (error) {
//     console.error("שגיאה בהורדת התמונה:", error)
    
//     // fallback - ניסיון ליצור canvas ולהוריד
//     try {
//       const img = new Image()
//       img.crossOrigin = "anonymous"
//       img.onload = () => {
//         const canvas = document.createElement("canvas")
//         const ctx = canvas.getContext("2d")
//         canvas.width = img.width
//         canvas.height = img.height
//         ctx?.drawImage(img, 0, 0)
        
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const blobUrl = window.URL.createObjectURL(blob)
//             const link = document.createElement("a")
//             link.href = blobUrl
//             link.download = `ai-generated-${Date.now()}.png`
//             link.style.display = "none"
//             document.body.appendChild(link)
//             link.click()
//             document.body.removeChild(link)
//             window.URL.revokeObjectURL(blobUrl)
//           }
//         }, "image/png")
//       }
//       img.onerror = () => {
//         alert("שגיאה בהורדת התמונה")
//       }
//       img.src = imageUrl
//     } catch (fallbackError) {
//       console.error("גם fallback נכשל:", fallbackError)
//       alert("שגיאה בהורדת התמונה")
//     }
//   }
// }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerateImage()
    }
  }

  return (
    <ModernBackground>
      {/* Floating decorative elements */}
      <FloatingIcon sx={{ top: "15%", left: "10%", animationDelay: "0s" }}>
        <Palette sx={{ fontSize: 60, color: "#ea66cb" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ top: "60%", right: "15%", animationDelay: "2s" }}>
        <AutoAwesome sx={{ fontSize: 40, color: "#00d4ff" }} />
      </FloatingIcon>
      <FloatingIcon sx={{ bottom: "20%", left: "20%", animationDelay: "4s" }}>
        <AutoAwesome sx={{ fontSize: 50, color: "#bd84f6" }} />
      </FloatingIcon>

      <Container maxWidth="lg" sx={{ py: 4, position: "relative", zIndex: 1 }}>
        {/* Professional Header */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ea66cb, #bd84f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 20px ${alpha("#bd84f6", 0.3)}`,
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: "2px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.2), transparent)",
                },
              }}
            >
              <AutoAwesome sx={{ color: "white", fontSize: 28, position: "relative", zIndex: 1 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #333, #666)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 0.5,
                }}
              >
                AI Image Studio
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                מחולל תמונות מתקדם עם בינה מלאכותית
              </Typography>
            </Box>
          </Stack>
          <Chip
            label="בחינם • ללא הגבלה"
            sx={{
              background: `linear-gradient(135deg, 
                ${alpha("#4ade80", 0.1)} 0%, 
                ${alpha("#10b981", 0.1)} 100%
              )`,
              backdropFilter: "blur(10px)",
              border: `1px solid ${alpha("#4ade80", 0.3)}`,
              color: "#059669",
              fontWeight: 600,
              px: 2,
              py: 0.5,
            }}
          />
        </Box>

        <Grid container spacing={4} sx={{ height: "70vh" }}>
          {/* Left Panel - Input */}
          <Grid item xs={12} md={6}>
            <GlassMorphCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PhotoCamera sx={{ color: "#bd84f6" }} />
                  תאר את התמונה שאתה רוצה ליצור
                </Typography>

                <ProfessionalTextField
                  fullWidth
                  multiline
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={placeholderTexts[currentPlaceholder]}
                  InputProps={{
                    style: { direction: "rtl", textAlign: "right", fontSize: "1.1rem" },
                  }}
                  sx={{ mb: 3, flex: 1 }}
                />

                {loading && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        background: alpha("#bd84f6", 0.1),
                        "& .MuiLinearProgress-bar": {
                          background: "linear-gradient(90deg, #ea66cb, #bd84f6)",
                          borderRadius: 3,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: "#666", mt: 0.5, display: "block" }}>
                      {Math.round(progress)}% הושלם
                    </Typography>
                  </Box>
                )}

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, 
                        ${alpha("#f44336", 0.1)} 0%, 
                        ${alpha("#f44336", 0.05)} 100%
                      )`,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${alpha("#f44336", 0.2)}`,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Stack direction="row" spacing={2} alignItems="center">
                  <GradientButton
                    fullWidth
                    onClick={handleGenerateImage}
                    disabled={loading || !prompt.trim()}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  >
                    {loading ? "יוצר..." : "צור תמונה"}
                  </GradientButton>
                  <Tooltip title="נקה הכל">
                    <IconButton
                      onClick={() => {
                        setPrompt("")
                        setError(null)
                        setImageUrl(null)
                      }}
                      sx={{
                        background: `linear-gradient(135deg, 
                          ${alpha("#ffffff", 0.8)} 0%, 
                          ${alpha("#ffffff", 0.6)} 100%
                        )`,
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${alpha("#e0e0e0", 0.5)}`,
                        color: "#666",
                        "&:hover": {
                          background: `linear-gradient(135deg, 
                            ${alpha("#ffffff", 0.9)} 0%, 
                            ${alpha("#ffffff", 0.7)} 100%
                          )`,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Typography
                  variant="caption"
                  sx={{
                    color: alpha("#666", 0.8),
                    mt: 2,
                    textAlign: "center",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  💡 Ctrl + Enter לייצור מהיר
                </Typography>
              </CardContent>
            </GlassMorphCard>
          </Grid>

          {/* Right Panel - Result */}
          <Grid item xs={12} md={6}>
            <GlassMorphCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AutoAwesome sx={{ color: "#00d4ff" }} />
                    התוצאה
                  </Typography>
                  {imageUrl && (
                    <SecondaryButton startIcon={<Download />} onClick={handleDownloadImage} size="small">
                      הורד תמונה
                    </SecondaryButton>
                  )}
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "16px",
                    background: `
                      linear-gradient(135deg, 
                        ${alpha("#f8fafc", 0.8)} 0%, 
                        ${alpha("#f1f5f9", 0.6)} 100%
                      )
                    `,
                    backdropFilter: "blur(10px)",
                    border: `2px dashed ${alpha("#bd84f6", 0.2)}`,
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      border: `2px dashed ${alpha("#bd84f6", 0.4)}`,
                    },
                  }}
                >
                  {loading ? (
                    <Stack alignItems="center" spacing={3}>
                      <Box sx={{ position: "relative" }}>
                        <CircularProgress
                          size={60}
                          thickness={4}
                          sx={{
                            color: "#bd84f6",
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <AutoAwesome sx={{ color: "#bd84f6", fontSize: 24 }} />
                        </Box>
                      </Box>
                      <Typography sx={{ color: "#666", fontWeight: 600, textAlign: "center" }}>
                        יוצר תמונה מדהימה...
                        <br />
                        <Typography component="span" variant="caption" sx={{ color: "#999" }}>
                          זה יכול לקחת כמה שניות
                        </Typography>
                      </Typography>
                    </Stack>
                  ) : imageUrl ? (
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt="תמונה שנוצרה"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "12px",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.02)",
                        },
                      }}
                    />
                  ) : (
                    <Stack alignItems="center" spacing={3}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "20px",
                          background: `linear-gradient(135deg, 
                            ${alpha("#bd84f6", 0.1)} 0%, 
                            ${alpha("#00d4ff", 0.1)} 100%
                          )`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PhotoCamera sx={{ fontSize: 40, color: alpha("#bd84f6", 0.6) }} />
                      </Box>
                      <Typography sx={{ color: "#666", textAlign: "center", fontWeight: 500 }}>
                        התמונה שלך תופיע כאן
                        <br />
                        <Typography component="span" variant="caption" sx={{ color: "#999" }}>
                          הכנס תיאור ולחץ על "צור תמונה"
                        </Typography>
                      </Typography>
                    </Stack>
                  )}
                </Paper>
              </CardContent>
            </GlassMorphCard>
          </Grid>
        </Grid>

        {/* Professional Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{
              color: alpha("#666", 0.8),
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <AutoAwesome sx={{ fontSize: 16, color: "#bd84f6" }} />
            מופעל על ידי בינה מלאכותית מתקדמת • יצירה מהירה ואיכותית
            <AutoAwesome sx={{ fontSize: 16, color: "#00d4ff" }} />
          </Typography>
        </Box>
      </Container>
    </ModernBackground>
  )
}

export default ImageGenerator
