// import React, { useState, useEffect } from 'react';
// import { Download, Zap, Sparkles, Camera } from 'lucide-react';

// const ImageGenerator: React.FC = () => {
//   const [prompt, setPrompt] = useState<string>('');
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPlaceholder, setCurrentPlaceholder] = useState<number>(0);
//   const baseURL = import.meta.env.VITE_API_URL

//   const placeholderTexts = [
//     'תמונה של כלב חמוד משחק בגינה...',
//     'ילדה מחייכת עם פרחים בשיער...',
//     'נוף הרים מדהים בשקיעה...',
//     'חתול ישן על ספר פתוח...',
//     'פרפר צבעוני על פרח אדום...',
//     'ילד קורא ספר תחת עץ גדול...',
//     'בית קטן ליד אגם שקט...',
//     'עכבר קטן אוכל גבינה...'
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlaceholder(prev => (prev + 1) % placeholderTexts.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleGenerateImage = async () => {
//     if (!prompt.trim()) {
//       setError('אנא הכנס תיאור לתמונה');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setImageUrl(null);

//     try {
//       const response = await fetch(`${baseURL}/Ai/generate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to generate image');
//       }
      
//       const imageData = await response.text();
//       setImageUrl(imageData);
//     } catch (err) {
//       setError('שגיאה ביצירת התמונה. אנא נסה שוב.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadImage = async () => {
//     if (!imageUrl) return;

//     try {
//       // שיטה חדשה להורדה - יצירת canvas וקישור ישיר
//       const img = new Image();
//       img.crossOrigin = 'anonymous';
      
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
        
//         canvas.width = img.width;
//         canvas.height = img.height;
        
//         ctx?.drawImage(img, 0, 0);
        
//         canvas.toBlob((blob) => {
//           if (blob) {
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `ai-generated-${Date.now()}.png`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
//             URL.revokeObjectURL(url);
//           }
//         }, 'image/png');
//       };
      
//       img.onerror = () => {
//         // אם Canvas לא עובד, ננסה שיטה ישירה
//         const link = document.createElement('a');
//         link.href = imageUrl;
//         link.download = `ai-generated-${Date.now()}.png`;
//         link.target = '_blank';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       };
      
//       img.src = imageUrl;
      
//     } catch (err) {
//       console.error('Error downloading image:', err);
//       // כפלן - פתיחה בחלון חדש
//       window.open(imageUrl, '_blank');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-500 to-cyan-400" 
//          style={{
//            background: 'linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)'
//          }}>
      
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-300/30 rounded-full blur-xl animate-bounce delay-500"></div>
//       </div>

//       {/* Header */}
//       <div className="relative z-10 bg-black/10 backdrop-blur-xl border-b border-white/20">
//         <div className="max-w-6xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-2xl">
//                 <Sparkles className="w-8 h-8 text-white animate-pulse" />
//               </div>


              
//               <div>
//                 <h1 className="text-2xl font-bold text-white drop-shadow-lg">AI Image Studio</h1>
//                 <p className="text-sm text-white/80 font-medium">מחולל תמונות מתקדם עם בינה מלאכותית</p>
//               </div>
//             </div>
//             <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
//               <span className="text-sm text-white font-semibold">בחינם • ללא הגבלה</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        
//         {/* Main Card */}
//         <div className="bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden">
          
//           {/* Hero Section */}
//           <div className="px-12 pt-16 pb-12 text-center">
//             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/30 shadow-2xl">
//               <Camera className="w-12 h-12 text-white" />
//             </div>
//             <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
//               צור תמונות מדהימות
//             </h2>
//             <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
//               רק תכתוב מה שאתה רוצה לראות, והבינה המלאכותית תיצור עבורך יצירת אמנות ייחודית ומרהיבה
//             </p>
//           </div>

//           {/* Input Section */}
//           <div className="px-12 pb-8">
//             <div className="max-w-3xl mx-auto">
//               <div className="relative mb-8">
//                 <textarea
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder={placeholderTexts[currentPlaceholder]}
//                   rows={4}
//                   className="w-full px-8 py-6 bg-white/15 backdrop-blur-sm border border-white/30 rounded-3xl text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:bg-white/20 transition-all duration-500 resize-none text-lg font-medium shadow-xl"
//                   style={{
//                     direction: 'rtl',
//                     textAlign: 'right'
//                   }}
//                 />
//                 <div className="absolute top-6 left-6">
//                   <div className="flex items-center space-x-3 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
//                     <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
//                     <span className="text-sm text-white font-semibold">מערכת AI פעילה</span>
//                   </div>
//                 </div>
//               </div>
              
//               <button
//                 onClick={handleGenerateImage}
//                 disabled={loading || !prompt.trim()}
//                 className={`
//                   w-full px-10 py-6 rounded-3xl font-bold text-xl transition-all duration-500 shadow-2xl
//                   ${loading || !prompt.trim() 
//                     ? 'bg-gray-500/30 text-white/50 cursor-not-allowed backdrop-blur-sm' 
//                     : 'bg-gradient-to-r from-white/25 to-white/15 hover:from-white/35 hover:to-white/25 text-white backdrop-blur-sm border border-white/30 hover:scale-[1.02] hover:shadow-3xl transform'
//                   }
//                 `}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="w-7 h-7 border-3 border-white/40 border-t-white rounded-full animate-spin ml-4"></div>
//                     <Zap className="w-6 h-6 ml-2 animate-pulse" />
//                     יוצר תמונה מדהימה...
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center">
//                     <Sparkles className="w-6 h-6 ml-2" />
//                     צור תמונה עכשיו
//                   </div>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="px-12 pb-6">
//               <div className="max-w-3xl mx-auto">
//                 <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl px-6 py-4 text-red-100 shadow-xl">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 bg-red-400 rounded-full ml-3"></div>
//                     {error}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Image Result */}
//           {imageUrl && (
//             <div className="px-12 pb-12">
//               <div className="max-w-2xl mx-auto">
//                 <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
//                   <div className="relative group">
//                     <div className="relative overflow-hidden rounded-2xl shadow-2xl">
//                       <img 
//                         src={imageUrl} 
//                         alt="תמונה שנוצרה" 
//                         className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
//                         <button
//                           onClick={handleDownloadImage}
//                           className="bg-white/20 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-3 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 shadow-xl"
//                         >
//                           <Download className="w-5 h-5 text-white" />
//                           <span className="text-white font-semibold">הורד תמונה</span>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="mt-8 flex items-center justify-between">
//                     <div className="text-white">
//                       <h3 className="text-xl font-bold mb-1">התמונה שלך מוכנה! 🎨</h3>
//                       <p className="text-white/70 font-medium">לחץ על כפתור ההורדה לשמירה</p>
//                     </div>
//                     <button
//                       onClick={handleDownloadImage}
//                       className="bg-gradient-to-r from-cyan-400/80 to-blue-500/80 hover:from-cyan-500/90 hover:to-blue-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center space-x-3 shadow-xl hover:scale-105 border border-white/20"
//                     >
//                       <Download className="w-6 h-6" />
//                       <span>הורד עכשיו</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="mt-16 text-center">
//           <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/20 shadow-xl inline-block">
//             <p className="text-white/90 font-semibold text-lg">
//               ✨ מופעל על ידי בינה מלאכותית מתקדמת • יצירה מהירה ואיכותית ✨
//             </p>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
        
//         .animate-float {
//           animation: float 3s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ImageGenerator;




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
//   Fade,
//   Zoom,
//   Paper,
//   Stack,
//   Avatar,
//   Divider,
// } from "@mui/material"
// import { styled, keyframes } from "@mui/material";
// import { Download, AutoAwesome, PhotoCamera, Brush, Palette, Star } from "@mui/icons-material"

// // Animated background keyframes
// const float = keyframes`
//   0%, 100% { transform: translateY(0px) rotate(0deg); }
//   50% { transform: translateY(-20px) rotate(5deg); }
// `

// const pulse = keyframes`
//   0%, 100% { opacity: 0.4; transform: scale(1); }
//   50% { opacity: 0.8; transform: scale(1.1); }
// `

// const shimmer = keyframes`
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// `

// // Styled components
// const GradientBackground = styled(Box)({
//   minHeight: "100vh",
//   background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
//   position: "relative",
//   overflow: "hidden",
// })

// const FloatingElement = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
//   position: "absolute",
//   borderRadius: "50%",
//   filter: "blur(40px)",
//   animation: `${float} 6s ease-in-out infinite`,
//   animationDelay: `${delay}s`,
//   pointerEvents: "none",
// }))

// const GlassCard = styled(Card)({
//   background: "rgba(255, 255, 255, 0.1)",
//   backdropFilter: "blur(20px)",
//   border: "1px solid rgba(255, 255, 255, 0.2)",
//   borderRadius: "24px",
//   boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
// })

// const GradientButton = styled(Button)({
//   background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
//   backdropFilter: "blur(10px)",
//   border: "1px solid rgba(255, 255, 255, 0.3)",
//   borderRadius: "16px",
//   color: "white",
//   fontWeight: "bold",
//   padding: "12px 32px",
//   fontSize: "1.1rem",
//   textTransform: "none",
//   transition: "all 0.3s ease",
//   "&:hover": {
//     background: "linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))",
//     transform: "translateY(-2px)",
//     boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
//   },
//   "&:disabled": {
//     background: "rgba(255, 255, 255, 0.1)",
//     color: "rgba(255, 255, 255, 0.5)",
//   },
// })

// const ShimmerButton = styled(Button)({
//   background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
//   backgroundSize: "200% 100%",
//   animation: `${shimmer} 2s infinite`,
//   backdropFilter: "blur(10px)",
//   border: "1px solid rgba(255, 255, 255, 0.3)",
//   borderRadius: "16px",
//   color: "white",
//   fontWeight: "bold",
// })

// const StyledTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     background: "rgba(255, 255, 255, 0.1)",
//     backdropFilter: "blur(10px)",
//     borderRadius: "16px",
//     color: "white",
//     fontSize: "1.1rem",
//     "& fieldset": {
//       borderColor: "rgba(255, 255, 255, 0.3)",
//       borderWidth: "1px",
//     },
//     "&:hover fieldset": {
//       borderColor: "rgba(255, 255, 255, 0.5)",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "rgba(255, 255, 255, 0.7)",
//       borderWidth: "2px",
//     },
//   },
//   "& .MuiInputLabel-root": {
//     color: "rgba(255, 255, 255, 0.7)",
//     fontSize: "1.1rem",
//   },
//   "& .MuiInputBase-input::placeholder": {
//     color: "rgba(255, 255, 255, 0.6)",
//     opacity: 1,
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
//     "ילד קורא ספר תחת עץ גדול...",
//     "בית קטן ליד אגם שקט...",
//     "עכבר קטן אוכל גבינה...",
//   ]

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentPlaceholder((prev) => (prev + 1) % placeholderTexts.length)
//     }, 3000)

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
//       // Fetch the image as blob
//       const response = await fetch(imageUrl)
//       const blob = await response.blob()

//       // Create download link
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
//       // Fallback method
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

//   return (
//     <GradientBackground>
//       {/* Floating Background Elements */}
//       <FloatingElement
//         sx={{
//           top: "10%",
//           left: "10%",
//           width: 300,
//           height: 300,
//           background: "rgba(255, 255, 255, 0.1)",
//           animation: `${pulse} 4s ease-in-out infinite`,
//         }}
//       />
//       <FloatingElement
//         delay={2}
//         sx={{
//           bottom: "20%",
//           right: "15%",
//           width: 200,
//           height: 200,
//           background: "rgba(0, 212, 255, 0.2)",
//         }}
//       />
//       <FloatingElement
//         delay={1}
//         sx={{
//           top: "50%",
//           right: "10%",
//           width: 150,
//           height: 150,
//           background: "rgba(240, 147, 251, 0.3)",
//         }}
//       />

//       {/* Header */}
//       <Paper
//         elevation={0}
//         sx={{
//           background: "rgba(0, 0, 0, 0.1)",
//           backdropFilter: "blur(20px)",
//           borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
//           position: "relative",
//           zIndex: 10,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Box sx={{ py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Avatar
//                 sx={{
//                   width: 60,
//                   height: 60,
//                   background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
//                   backdropFilter: "blur(10px)",
//                   border: "1px solid rgba(255, 255, 255, 0.3)",
//                 }}
//               >
//                 <AutoAwesome sx={{ fontSize: 32, color: "white" }} />
//               </Avatar>
//               <Box>
//                 <Typography variant="h4" sx={{ color: "white", fontWeight: "bold", mb: 0.5 }}>
//                   AI Image Studio
//                 </Typography>
//                 <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
//                   מחולל תמונות מתקדם עם בינה מלאכותית
//                 </Typography>
//               </Box>
//             </Stack>
//             <Chip
//               icon={<Star sx={{ color: "white !important" }} />}
//               label="בחינם • ללא הגבלה"
//               sx={{
//                 background: "rgba(255, 255, 255, 0.2)",
//                 backdropFilter: "blur(10px)",
//                 border: "1px solid rgba(255, 255, 255, 0.3)",
//                 color: "white",
//                 fontWeight: "bold",
//               }}
//             />
//           </Box>
//         </Container>
//       </Paper>

//       <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 10 }}>
//         <GlassCard>
//           <CardContent sx={{ p: 6 }}>
//             {/* Hero Section */}
//             <Box sx={{ textAlign: "center", mb: 6 }}>
//               <Zoom in timeout={1000}>
//                 <Avatar
//                   sx={{
//                     width: 100,
//                     height: 100,
//                     mx: "auto",
//                     mb: 4,
//                     background: "linear-gradient(45deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))",
//                     backdropFilter: "blur(10px)",
//                     border: "1px solid rgba(255, 255, 255, 0.3)",
//                   }}
//                 >
//                   <PhotoCamera sx={{ fontSize: 48, color: "white" }} />
//                 </Avatar>
//               </Zoom>

//               <Fade in timeout={1500}>
//                 <Typography
//                   variant="h2"
//                   sx={{
//                     color: "white",
//                     fontWeight: "bold",
//                     mb: 3,
//                     textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
//                   }}
//                 >
//                   צור תמונות מדהימות
//                 </Typography>
//               </Fade>

//               <Fade in timeout={2000}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "rgba(255, 255, 255, 0.9)",
//                     maxWidth: 600,
//                     mx: "auto",
//                     lineHeight: 1.6,
//                     fontWeight: 500,
//                   }}
//                 >
//                   רק תכתוב מה שאתה רוצה לראות, והבינה המלאכותית תיצור עבורך יצירת אמנות ייחודית ומרהיבה
//                 </Typography>
//               </Fade>
//             </Box>

//             <Divider sx={{ mb: 6, borderColor: "rgba(255, 255, 255, 0.2)" }} />

//             {/* Input Section */}
//             <Box sx={{ maxWidth: 600, mx: "auto", mb: 4 }}>
//               <Box sx={{ position: "relative", mb: 4 }}>
//                 <StyledTextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder={placeholderTexts[currentPlaceholder]}
//                   InputProps={{
//                     style: { direction: "rtl", textAlign: "right" },
//                   }}
//                 />

//                 {/* <Chip
//                   icon={
//                     <Box
//                       sx={{
//                         width: 8,
//                         height: 8,
//                         borderRadius: "50%",
//                         bgcolor: "#4ade80",
//                         animation: `${pulse} 2s infinite`,
//                       }}
//                     />
//                   }
//                   label="מערכת AI פעילה"
//                   size="small"
//                   sx={{
//                     position: "absolute",
//                     top: 16,
//                     left: 16,
//                     background: "rgba(34, 197, 94, 0.2)",
//                     backdropFilter: "blur(10px)",
//                     border: "1px solid rgba(34, 197, 94, 0.3)",
//                     color: "white",
//                   }}
//                 /> */}
//               </Box>

//               <GradientButton
//                 fullWidth
//                 size="large"
//                 onClick={handleGenerateImage}
//                 disabled={loading || !prompt.trim()}
//                 startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Brush />}
//                 sx={{ py: 2 }}
//               >
//                 {loading ? "יוצר תמונה מדהימה..." : "צור תמונה עכשיו"}
//               </GradientButton>
//             </Box>

//             {/* Error Message */}
//             {error && (
//               <Fade in>
//                 <Alert
//                   severity="error"
//                   sx={{
//                     maxWidth: 800,
//                     mx: "auto",
//                     mb: 4,
//                     background: "rgba(244, 67, 54, 0.1)",
//                     backdropFilter: "blur(10px)",
//                     border: "1px solid rgba(244, 67, 54, 0.3)",
//                     color: "white",
//                     "& .MuiAlert-icon": { color: "#ff6b6b" },
//                   }}
//                 >
//                   {error}
//                 </Alert>
//               </Fade>
//             )}

//             {/* Image Result */}
//             {imageUrl && (
//               <Zoom in timeout={800}>
//                 <Box sx={{ maxWidth: 600, mx: "auto" }}>
//                   <GlassCard>
//                     <CardMedia
//                       component="img"
//                       image={imageUrl}
//                       alt="תמונה שנוצרה"
//                       sx={{
//                         height: 400,
//                         objectFit: "cover",
//                         transition: "transform 0.3s ease",
//                         "&:hover": { transform: "scale(1.02)" },
//                       }}
//                     />
//                     <CardContent>
//                       <Stack direction="row" justifyContent="space-between" alignItems="center">
//                         <Box>
//                           <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
//                             התמונה שלך מוכנה! 🎨
//                           </Typography>
//                           <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
//                             לחץ על כפתור ההורדה לשמירה
//                           </Typography>
//                         </Box>
//                         <Button
//                           variant="contained"
//                           startIcon={<Download />}
//                           onClick={handleDownloadImage}
//                           sx={{
//                             background: "linear-gradient(45deg, #00d4ff, #0ea5e9)",
//                             "&:hover": {
//                               background: "linear-gradient(45deg, #0ea5e9, #0284c7)",
//                               transform: "translateY(-2px)",
//                             },
//                             borderRadius: "12px",
//                             px: 3,
//                             py: 1.5,
//                             fontWeight: "bold",
//                           }}
//                         >
//                           הורד עכשיו
//                         </Button>
//                       </Stack>
//                     </CardContent>
//                   </GlassCard>
//                 </Box>
//               </Zoom>
//             )}
//           </CardContent>
//         </GlassCard>

//         {/* Footer */}
//         <Box sx={{ mt: 8, textAlign: "center" }}>
//           <Paper
//             elevation={0}
//             sx={{
//               display: "inline-block",
//               background: "rgba(255, 255, 255, 0.1)",
//               backdropFilter: "blur(20px)",
//               border: "1px solid rgba(255, 255, 255, 0.2)",
//               borderRadius: "16px",
//               px: 4,
//               py: 2,
//             }}
//           >
//             <Typography
//               variant="h6"
//               sx={{
//                 color: "rgba(255, 255, 255, 0.9)",
//                 fontWeight: 600,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//               }}
//             >
//               <Palette sx={{ color: "#fbbf24" }} />
//               מופעל על ידי בינה מלאכותית מתקדמת • יצירה מהירה ואיכותית
//               <AutoAwesome sx={{ color: "#fbbf24" }} />
//             </Typography>
//           </Paper>
//         </Box>
//       </Container>
//     </GradientBackground>
//   )
// }

// export default ImageGenerator



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
//   Tooltip
// } from "@mui/material"
// import { styled, alpha } from "@mui/material"
// import { Download, AutoAwesome, PhotoCamera, Send, Refresh } from "@mui/icons-material"

// // Styled components
// const GradientBackground = styled(Box)({
//   height: "100vh",
//   background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
//   display: "flex",
//   alignItems: "center",
//   overflow: "hidden",
// })

// const GlassCard = styled(Card)({
//   background: alpha("#ffffff", 0.15),
//   backdropFilter: "blur(20px)",
//   border: `1px solid ${alpha("#ffffff", 0.2)}`,
//   borderRadius: "16px",
//   boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
// })

// const CompactTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     background: alpha("#ffffff", 0.1),
//     backdropFilter: "blur(10px)",
//     borderRadius: "12px",
//     color: "white",
//     "& fieldset": {
//       borderColor: alpha("#ffffff", 0.3),
//     },
//     "&:hover fieldset": {
//       borderColor: alpha("#ffffff", 0.5),
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: alpha("#ffffff", 0.7),
//     },
//   },
//   "& .MuiInputLabel-root": {
//     color: alpha("#ffffff", 0.7),
//   },
//   "& .MuiInputBase-input::placeholder": {
//     color: alpha("#ffffff", 0.6),
//     opacity: 1,
//   },
// })

// const ModernButton = styled(Button)({
//   background: alpha("#ffffff", 0.2),
//   backdropFilter: "blur(10px)",
//   border: `1px solid ${alpha("#ffffff", 0.3)}`,
//   borderRadius: "12px",
//   color: "white",
//   fontWeight: 600,
//   textTransform: "none",
//   padding: "10px 24px",
//   "&:hover": {
//     background: alpha("#ffffff", 0.25),
//     transform: "translateY(-1px)",
//   },
//   "&:disabled": {
//     background: alpha("#ffffff", 0.1),
//     color: alpha("#ffffff", 0.5),
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
//     <GradientBackground>
//       <Container maxWidth="lg" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
//         <Grid container spacing={3} sx={{ height: "80vh" }}>
//           {/* Left Panel - Input */}
//           <Grid item xs={12} md={6}>
//             <GlassCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//               <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
//                 {/* Header */}
//                 <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
//                   <Box
//                     sx={{
//                       width: 48,
//                       height: 48,
//                       borderRadius: "12px",
//                       background: alpha("#ffffff", 0.2),
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <AutoAwesome sx={{ color: "white", fontSize: 24 }} />
//                   </Box>
//                   <Box>
//                     <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mb: 0.5 }}>
//                       AI Image Studio
//                     </Typography>
//                     <Chip
//                       label="בחינם"
//                       size="small"
//                       sx={{
//                         background: alpha("#4ade80", 0.2),
//                         color: "#4ade80",
//                         border: `1px solid ${alpha("#4ade80", 0.3)}`,
//                         fontSize: "0.75rem",
//                       }}
//                     />
//                   </Box>
//                 </Stack>

//                 {/* Input Section */}
//                 <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//                   <Typography variant="h6" sx={{ color: "white", mb: 2, fontWeight: 600 }}>
//                     תאר את התמונה שאתה רוצה ליצור
//                   </Typography>

//                   <CompactTextField
//                     fullWidth
//                     multiline
//                     rows={4}
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     onKeyDown={handleKeyPress}
//                     placeholder={placeholderTexts[currentPlaceholder]}
//                     InputProps={{
//                       style: { direction: "rtl", textAlign: "right" },
//                     }}
//                     sx={{ mb: 3, flex: 1 }}
//                   />

//                   {error && (
//                     <Alert
//                       severity="error"
//                       sx={{
//                         mb: 2,
//                         background: alpha("#f44336", 0.1),
//                         color: "white",
//                         border: `1px solid ${alpha("#f44336", 0.3)}`,
//                         "& .MuiAlert-icon": { color: "#ff6b6b" },
//                       }}
//                     >
//                       {error}
//                     </Alert>
//                   )}

//                   <Stack direction="row" spacing={2}>
//                     <ModernButton
//                       fullWidth
//                       onClick={handleGenerateImage}
//                       disabled={loading || !prompt.trim()}
//                       startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
//                     >
//                       {loading ? "יוצר..." : "צור תמונה"}
//                     </ModernButton>
//                     <Tooltip title="נקה">
//                       <IconButton
//                         onClick={() => {
//                           setPrompt("")
//                           setError(null)
//                         }}
//                         sx={{
//                           background: alpha("#ffffff", 0.1),
//                           color: "white",
//                           "&:hover": { background: alpha("#ffffff", 0.2) },
//                         }}
//                       >
//                         <Refresh />
//                       </IconButton>
//                     </Tooltip>
//                   </Stack>

//                   <Typography variant="caption" sx={{ color: alpha("#ffffff", 0.6), mt: 2, textAlign: "center" }}>
//                     Ctrl + Enter לייצור מהיר
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </GlassCard>
//           </Grid>

//           {/* Right Panel - Result */}
//           <Grid item xs={12} md={6}>
//             <GlassCard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
//               <CardContent sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
//                 <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
//                   <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
//                     התוצאה
//                   </Typography>
//                   {imageUrl && (
//                     <Button
//                       startIcon={<Download />}
//                       onClick={handleDownloadImage}
//                       sx={{
//                         background: "linear-gradient(45deg, #00d4ff, #0ea5e9)",
//                         color: "white",
//                         borderRadius: "8px",
//                         textTransform: "none",
//                         fontWeight: 600,
//                         "&:hover": {
//                           background: "linear-gradient(45deg, #0ea5e9, #0284c7)",
//                         },
//                       }}
//                     >
//                       הורד
//                     </Button>
//                   )}
//                 </Stack>

//                 <Box
//                   sx={{
//                     flex: 1,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     borderRadius: "12px",
//                     background: alpha("#ffffff", 0.05),
//                     border: `2px dashed ${alpha("#ffffff", 0.2)}`,
//                     position: "relative",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {loading ? (
//                     <Stack alignItems="center" spacing={2}>
//                       <CircularProgress size={48} sx={{ color: "white" }} />
//                       <Typography sx={{ color: alpha("#ffffff", 0.8) }}>יוצר תמונה מדהימה...</Typography>
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
//                         borderRadius: "8px",
//                       }}
//                     />
//                   ) : (
//                     <Stack alignItems="center" spacing={2}>
//                       <PhotoCamera sx={{ fontSize: 48, color: alpha("#ffffff", 0.4) }} />
//                       <Typography sx={{ color: alpha("#ffffff", 0.6), textAlign: "center" }}>
//                         התמונה שלך תופיע כאן
//                         <br />
//                         <Typography component="span" variant="caption">
//                           הכנס תיאור ולחץ על "צור תמונה"
//                         </Typography>
//                       </Typography>
//                     </Stack>
//                   )}
//                 </Box>
//               </CardContent>
//             </GlassCard>
//           </Grid>
//         </Grid>
//       </Container>
//     </GradientBackground>
//   )
// }

// export default ImageGenerator





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
