// // "use client"

// // import type React from "react"
// // import { useState, useEffect } from "react"
// // import { observer } from "mobx-react-lite"
// // import userStore from "../stores/userStore"
// // import { Link } from "react-router-dom"
// // import {
// //   TextField,
// //   Button,
// //   Typography,
// //   Box,
// //   Paper,
// //   Grid,
// //   InputAdornment,
// //   IconButton,
// //   Alert,
// //   Snackbar,
// //   CircularProgress,
// //   Divider,
// //   useTheme,
// // } from "@mui/material"
// // import { useNavigate } from "react-router-dom"
// // import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, Google, Facebook } from "@mui/icons-material"
// // import { motion } from "framer-motion"

// // const Login: React.FC = () => {
// //   const [userEmail, setUserEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [error, setError] = useState("")
// //   const [loading, setLoading] = useState(false)
// //   const [success, setSuccess] = useState(false)
// //   const navigate = useNavigate()
// //   const theme = useTheme()

// //   useEffect(() => {
// //     // Clear any previous errors
// //     userStore.logout()
// //   }, [])

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()

// //     // Validation
// //     if (!userEmail || !password) {
// //       setError("נא למלא את כל השדות")
// //       return
// //     }

// //     setLoading(true)
// //     setError("")

// //     try {
      
// //       await userStore.login(userEmail, password)

// //       if (userStore.error) {
// //         setError(userStore.error)
// //       } else {
// //         setSuccess(true)
// //         // Short delay before redirecting
// //         setTimeout(() => {
// //           navigate("/personal-area")
// //         }, 1000)
// //       }
// //     } catch (error: any) {
// //       setError(error.message || "התחברות נכשלה, נסה שוב")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleClickShowPassword = () => {
// //     setShowPassword(!showPassword)
// //   }

// //   return (
// //     <Grid
// //       container
// //       sx={{
// //         minHeight: "100vh",
// //         bgcolor: "background.default",
// //       }}
// //     >
// //       {/* Left Column - Image */}
// //       <Grid
// //         item
// //         xs={12}
// //         md={6}
// //         sx={{
// //           display: { xs: "none", md: "flex" },
// //           position: "relative",
// //           overflow: "hidden",
// //         }}
// //       >
// //         <Box
// //           component={motion.div}
// //           initial={{ opacity: 0, scale: 1.1 }}
// //           animate={{ opacity: 1, scale: 1 }}
// //           transition={{ duration: 0.8 }}
// //           sx={{
// //             position: "absolute",
// //             top: 0,
// //             left: 0,
// //             width: "100%",
// //             height: "100%",
// //             backgroundImage: 'url("/images/login.jpg")',
// //             backgroundSize: "cover",
// //             backgroundPosition: "center",
// //             filter: "brightness(0.85)",
// //             zIndex: 1,
// //           }}
// //         />
// //         <Box
// //           component={motion.div}
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ delay: 0.3, duration: 0.5 }}
// //           sx={{
// //             position: "relative",
// //             zIndex: 2,
// //             alignSelf: "center",
// //             textAlign: "center",
// //             color: "white",
// //             padding: 4,
// //             width: "80%",
// //             mx: "auto",
// //           }}
// //         >
// //           <Typography variant="h3" fontWeight="bold" gutterBottom>
// //             ברוכים השבים
// //           </Typography>
// //           <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
// //             התחברו כדי לנהל את האלבומים והתמונות שלכם
// //           </Typography>
// //         </Box>
// //       </Grid>

// //       {/* Right Column - Login Form */}
// //       <Grid
// //         item
// //         xs={12}
// //         md={6}
// //         sx={{
// //           display: "flex",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           p: { xs: 2, sm: 4, md: 8 },
// //         }}
// //       >
// //         <Paper
// //           component={motion.div}
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //           elevation={3}
// //           sx={{
// //             p: { xs: 3, sm: 5 },
// //             borderRadius: 2,
// //             width: "100%",
// //             maxWidth: 500,
// //           }}
// //         >
// //           <Box component="form" onSubmit={handleSubmit} noValidate>
// //             <Typography variant="h4" fontWeight="700" color="primary" align="center" sx={{ mb: 4 }}>
// //               התחברות
// //             </Typography>

// //             {error && (
// //               <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setError("")}>
// //                 {error}
// //               </Alert>
// //             )}

// //             <TextField
// //               label="כתובת מייל"
// //               type="email"
// //               value={userEmail}
// //               onChange={(e) => setUserEmail(e.target.value)}
// //               fullWidth
// //               required
// //               margin="normal"
// //               variant="outlined"
// //               sx={{ mb: 3 }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <EmailOutlined color="action" />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <TextField
// //               label="סיסמה"
// //               type={showPassword ? "text" : "password"}
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               fullWidth
// //               required
// //               margin="normal"
// //               variant="outlined"
// //               sx={{ mb: 3 }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <LockOutlined color="action" />
// //                   </InputAdornment>
// //                 ),
// //                 endAdornment: (
// //                   <InputAdornment position="end">
// //                     <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
// //                       {showPassword ? <VisibilityOff /> : <Visibility />}
// //                     </IconButton>
// //                   </InputAdornment>
// //                 ),
// //               }}
// //             />

// //             <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
// //               <Link
// //                 to="/forgot-password"
// //                 style={{
// //                   textDecoration: "none",
// //                   color: theme.palette.primary.main,
// //                   fontSize: "0.875rem",
// //                 }}
// //               >
// //                 שכחת סיסמה?
// //               </Link>
// //             </Box>

// //             <Button
// //               type="submit"
// //               variant="contained"
// //               fullWidth
// //               size="large"
// //               disabled={loading}
// //               sx={{
// //                 py: 1.5,
// //                 position: "relative",
// //               }}
// //             >
// //               {loading ? <CircularProgress size={24} color="inherit" /> : "התחברות"}
// //             </Button>

// //             <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
// //               <Divider sx={{ flex: 1 }} />
// //               <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
// //                 או
// //               </Typography>
// //               <Divider sx={{ flex: 1 }} />
// //             </Box>

// //             <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
// //               <Button variant="outlined" fullWidth startIcon={<Google />} sx={{ py: 1.2 }}>
// //                 Google
// //               </Button>
// //               <Button variant="outlined" fullWidth startIcon={<Facebook />} sx={{ py: 1.2 }}>
// //                 Facebook
// //               </Button>
// //             </Box>

// //             <Typography variant="body1" align="center" sx={{ mt: 2 }}>
// //               אין לך חשבון?{" "}
// //               <Link
// //                 to="/register"
// //                 style={{
// //                   textDecoration: "none",
// //                   color: theme.palette.primary.main,
// //                   fontWeight: "bold",
// //                 }}
// //               >
// //                 הירשם עכשיו
// //               </Link>
// //             </Typography>
// //           </Box>
// //         </Paper>
// //       </Grid>

// //       <Snackbar
// //         open={success}
// //         autoHideDuration={3000}
// //         onClose={() => setSuccess(false)}
// //         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
// //       >
// //         <Alert severity="success" variant="filled">
// //           התחברת בהצלחה! מעביר אותך לאזור האישי...
// //         </Alert>
// //       </Snackbar>
// //     </Grid>
// //   )
// // }

// // export default observer(Login)






// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { observer } from "mobx-react-lite"
// import userStore from "../stores/userStore"
// import { Link } from "react-router-dom"
// import {
//   TextField,
//   Button,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   InputAdornment,
//   IconButton,
//   Alert,
//   Snackbar,
//   CircularProgress,
//   Divider,
//   useTheme,
//   styled,
//   keyframes,
// } from "@mui/material"
// import { useNavigate } from "react-router-dom"
// import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, Google, Facebook } from "@mui/icons-material"
// import { motion } from "framer-motion"

// // אנימציות מותאמות אישית
// const floatingAnimation = keyframes`
//   0%, 100% { transform: translateY(0px) rotate(0deg); }
//   33% { transform: translateY(-15px) rotate(2deg); }
//   66% { transform: translateY(-8px) rotate(-2deg); }
// `

// const gradientShift = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `

// const sparkleAnimation = keyframes`
//   0%, 100% { opacity: 0; transform: scale(0); }
//   50% { opacity: 1; transform: scale(1); }
// `

// const pulseGlow = keyframes`
//   0%, 100% { box-shadow: 0 0 20px rgba(234, 102, 203, 0.3); }
//   50% { box-shadow: 0 0 40px rgba(234, 102, 203, 0.8), 0 0 60px rgba(189, 132, 246, 0.6); }
// `

// // רכיבי UI מעוצבים
// const StyledContainer = styled(Box)({
//   minHeight: "100vh",
//   background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
//   backgroundSize: "400% 400%",
//   animation: `${gradientShift} 8s ease infinite`,
//   position: "relative",
//   overflow: "hidden",
// })

// const FloatingElement = styled(Box)<{ delay?: number }>(({ delay = 0 }) => ({
//   position: "absolute",
//   width: "60px",
//   height: "60px",
//   borderRadius: "50%",
//   background: "rgba(255, 255, 255, 0.1)",
//   backdropFilter: "blur(10px)",
//   animation: `${floatingAnimation} 6s ease-in-out infinite`,
//   animationDelay: `${delay}s`,
// }))

// const SparkleElement = styled(Box)<{ top: string; left: string; delay: number }>(({ top, left, delay }) => ({
//   position: "absolute",
//   top,
//   left,
//   width: "4px",
//   height: "4px",
//   borderRadius: "50%",
//   background: "rgba(255, 255, 255, 0.8)",
//   animation: `${sparkleAnimation} 3s ease-in-out infinite`,
//   animationDelay: `${delay}s`,
// }))

// const GlassCard = styled(Paper)({
//   background: "white", // צבע לבן
//   border: "1px solid rgba(0, 0, 0, 0.1)", // גבול קל כדי להפריד את הכרטיס מהרקע
//   borderRadius: "24px",
//   // הסר את האנימציה אם לא נדרשת
//   // animation: `${pulseGlow} 4s ease-in-out infinite`,
// });


// const StyledTextField = styled(TextField)({
//   "& .MuiOutlinedInput-root": {
//     background: "rgba(255, 255, 255, 0.9)",
//     borderRadius: "12px",
//     transition: "all 0.3s ease",
//     "&:hover": {
//       background: "rgba(255, 255, 255, 0.95)",
//       transform: "translateY(-2px)",
//       boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
//     },
//     "&.Mui-focused": {
//       background: "rgba(255, 255, 255, 1)",
//       transform: "translateY(-2px)",
//       boxShadow: "0 12px 35px rgba(234, 102, 203, 0.3)",
//     },
//   },
// })

// const GradientButton = styled(Button)({
//   background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
//   borderRadius: "12px",
//   textTransform: "none",
//   fontSize: "1.1rem",
//   fontWeight: "600",
//   padding: "14px 28px",
//   position: "relative",
//   overflow: "hidden",
//   transition: "all 0.3s ease",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: "-100%",
//     width: "100%",
//     height: "100%",
//     background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
//     transition: "left 0.5s ease",
//   },
//   "&:hover": {
//     transform: "translateY(-3px)",
//     boxShadow: "0 15px 35px rgba(234, 102, 203, 0.4)",
//     "&::before": {
//       left: "100%",
//     },
//   },
// })

// const Login: React.FC = () => {
//   const [userEmail, setUserEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)
//   const navigate = useNavigate()
//   const theme = useTheme()

//   useEffect(() => {
//     // Clear any previous errors
//     userStore.logout()
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation
//     if (!userEmail || !password) {
//       setError("נא למלא את כל השדות")
//       return
//     }

//     setLoading(true)
//     setError("")

//     try {
//       await userStore.login(userEmail, password)

//       if (userStore.error) {
//         setError(userStore.error)
//       } else {
//         setSuccess(true)
//         // Short delay before redirecting
//         setTimeout(() => {
//           navigate("/personal-area")
//         }, 1000)
//       }
//     } catch (error: any) {
//       setError(error.message || "התחברות נכשלה, נסה שוב")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword)
//   }

//   return (
//     <StyledContainer>
//       {/* אלמנטים צפים דקורטיביים */}
//       <FloatingElement sx={{ top: "10%", left: "10%" }} delay={0} />
//       <FloatingElement sx={{ top: "70%", right: "15%" }} delay={2} />
//       <FloatingElement sx={{ top: "40%", left: "5%" }} delay={4} />
//       <FloatingElement sx={{ top: "20%", right: "8%" }} delay={1} />
      
//       {/* נצנוצים */}
//       <SparkleElement top="15%" left="25%" delay={0} />
//       <SparkleElement top="35%" left="80%" delay={1} />
//       <SparkleElement top="75%" left="20%" delay={2} />
//       <SparkleElement top="60%" left="90%" delay={0.5} />
//       <SparkleElement top="25%" left="70%" delay={1.5} />
//       <SparkleElement top="85%" left="60%" delay={2.5} />

//       <Grid container sx={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
//         {/* <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             display: { xs: "none", md: "flex" },
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <Box
//             component={motion.div}
//             initial={{ opacity: 0, scale: 1.2 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1.2, ease: "easeOut" }}
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               backgroundImage: 'url("/images/login.jpg")',
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               filter: "brightness(0.7) saturate(1.2)",
//               zIndex: 1,
//             }}
//           />
//           <Box
//             sx={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               background: "linear-gradient(45deg, rgba(234, 102, 203, 0.3), rgba(189, 132, 246, 0.3))",
//               zIndex: 2,
//             }}
//           />
//           <Box
//             component={motion.div}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.8 }}
//             sx={{
//               position: "relative",
//               zIndex: 3,
//               alignSelf: "center",
//               textAlign: "center",
//               color: "white",
//               padding: 4,
//               width: "80%",
//               mx: "auto",
//             }}
//           >
//             <Typography 
//               variant="h2" 
//               fontWeight="800" 
//               gutterBottom
//               sx={{
//                 textShadow: "2px 2px 20px rgba(0,0,0,0.5)",
//                 background: "linear-gradient(45deg, #fff, #f0f0f0)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               ברוכים השבים
//             </Typography>
//             <Typography 
//               variant="h5" 
//               sx={{ 
//                 mb: 4, 
//                 opacity: 0.95,
//                 textShadow: "1px 1px 10px rgba(0,0,0,0.5)",
//                 fontWeight: 300,
//               }}
//             >
//               התחברו כדי לנהל את האלבומים והתמונות שלכם
//             </Typography>
//           </Box>
//         </Grid> */}

//         {/* עמודה ימנית - טופס התחברות */}
//         <Grid
//           item
//           xs={8}
//           md={6}
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             left: "25%",
//             p: { xs: 2, sm: 4, md: 8 },
//             position: "relative",
//           }}
//         >
//           <GlassCard
//             component={motion.div}
//             initial={{ opacity: 0, y: 30, scale: 0.9 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             elevation={0}
//             sx={{
//               p: { xs: 4, sm: 6 },
//               width: "100%",
//               maxWidth: 500,
//               position: "relative",
//             }}
//           >
//             <Box component="form" onSubmit={handleSubmit} noValidate>
//               <Typography 
//                 variant="h3" 
//                 fontWeight="700" 
//                 align="center" 
//                 sx={{ 
//                   mb: 5,
//                   background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   textShadow: "0 2px 10px rgba(234, 102, 203, 0.3)",
//                 }}
//               >
//                 התחברות
//               </Typography>

//               {error && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                 >
//                   <Alert 
//                     severity="error" 
//                     sx={{ 
//                       mb: 3, 
//                       borderRadius: 2,
//                       background: "rgba(255, 255, 255, 0.9)",
//                     }} 
//                     onClose={() => setError("")}
//                   >
//                     {error}
//                   </Alert>
//                 </motion.div>
//               )}

//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//               >
//                 <StyledTextField
//                   label="כתובת מייל"
//                   type="email"
//                   value={userEmail}
//                   onChange={(e) => setUserEmail(e.target.value)}
//                   fullWidth
//                   required
//                   margin="normal"
//                   variant="outlined"
//                   sx={{ mb: 3 }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <EmailOutlined sx={{ color: "rgb(234, 102, 203)" }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//               >
//                 <StyledTextField
//                   label="סיסמה"
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   fullWidth
//                   required
//                   margin="normal"
//                   variant="outlined"
//                   sx={{ mb: 3 }}
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <LockOutlined sx={{ color: "rgb(234, 102, 203)" }} />
//                       </InputAdornment>
//                     ),
//                     endAdornment: (
//                       <InputAdornment position="end">
//                         <IconButton 
//                           aria-label="toggle password visibility" 
//                           onClick={handleClickShowPassword} 
//                           edge="end"
//                           sx={{ color: "rgb(189, 132, 246)" }}
//                         >
//                           {showPassword ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </motion.div>

//               <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
//                 <Link
//                   to="/forgot-password"
//                   style={{
//                     textDecoration: "none",
//                     color: "rgb(234, 102, 203)",
//                     fontSize: "0.9rem",
//                     fontWeight: "500",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   שכחת סיסמה?
//                 </Link>
//               </Box>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//               >
//                 <GradientButton
//                   type="submit"
//                   variant="contained"
//                   fullWidth
//                   size="large"
//                   disabled={loading}
//                   sx={{ mb: 4 }}
//                 >
//                   {loading ? (
//                     <CircularProgress size={24} color="inherit" />
//                   ) : (
//                     "התחברות"
//                   )}
//                 </GradientButton>
//               </motion.div>

//               <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
//                 <Divider sx={{ flex: 1, bgcolor: "rgba(255, 255, 255, 0.3)" }} />
//                 <Typography 
//                   variant="body2" 
//                   sx={{ 
//                     px: 2, 
//                     color: "rgba(255, 255, 255, 0.8)",
//                     fontWeight: "500",
//                   }}
//                 >
//                   או
//                 </Typography>
//                 <Divider sx={{ flex: 1, bgcolor: "rgba(255, 255, 255, 0.3)" }} />
//               </Box>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
//                   <Button 
//                     variant="outlined" 
//                     fullWidth 
//                     startIcon={<Google />} 
//                     sx={{ 
//                       py: 1.5,
//                       background: "rgba(255, 255, 255, 0.9)",
//                       border: "none",
//                       borderRadius: "12px",
//                       color: "#333",
//                       fontWeight: "600",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background: "rgba(255, 255, 255, 1)",
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
//                       },
//                     }}
//                   >
//                     Google
//                   </Button>
//                   <Button 
//                     variant="outlined" 
//                     fullWidth 
//                     startIcon={<Facebook />} 
//                     sx={{ 
//                       py: 1.5,
//                       background: "rgba(255, 255, 255, 0.9)",
//                       border: "none",
//                       borderRadius: "12px",
//                       color: "#333",
//                       fontWeight: "600",
//                       transition: "all 0.3s ease",
//                       "&:hover": {
//                         background: "rgba(255, 255, 255, 1)",
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
//                       },
//                     }}
//                   >
//                     Facebook
//                   </Button>
//                 </Box>
//               </motion.div>

//               <Typography 
//                 variant="body1" 
//                 align="center" 
//                 sx={{ 
//                   color: "black",
//                   fontWeight: "500",
//                 }}
//               >
//                 אין לך חשבון?{" "}
//                 <Link
//                   to="/register"
//                   style={{
//                     textDecoration: "none",
//                     color: "black",
//                     fontWeight: "bold",
//                     textShadow: "0 2px 10px rgba(255, 255, 255, 0.3)",
//                     transition: "all 0.3s ease",
//                   }}
//                 >
//                   הירשם עכשיו
//                 </Link>
//               </Typography>
//             </Box>
//           </GlassCard>
//         </Grid>
//       </Grid>

//       <Snackbar
//         open={success}
//         autoHideDuration={3000}
//         onClose={() => setSuccess(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert 
//           severity="success" 
//           variant="filled"
//           sx={{
//             background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
//             borderRadius: "12px",
//           }}
//         >
//           התחברת בהצלחה! מעביר אותך לאזור האישי...
//         </Alert>
//       </Snackbar>
//     </StyledContainer>
//   )
// }

// export default observer(Login)









"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import userStore from "../stores/userStore"
import { Link } from "react-router-dom"
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Divider,
  // useTheme,
  styled,
  keyframes,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, Google, Facebook } from "@mui/icons-material"
import { motion } from "framer-motion"

// אנימציות מטורפות
const floatingBubbles = keyframes`
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) scale(1); opacity: 0; }
`

const spinningOrbs = keyframes`
  0% { transform: rotate(0deg) translateX(50px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); }
`

const pulseWave = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`

const morphingShape = keyframes`
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
`

const colorShift = keyframes`
  0% { background: linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246)); }
  25% { background: linear-gradient(45deg, rgb(189, 132, 246), #f093fb); }
  50% { background: linear-gradient(45deg, #f093fb, #00d4ff); }
  75% { background: linear-gradient(45deg, #00d4ff, rgb(234, 102, 203)); }
  100% { background: linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246)); }
`

const zigzagMove = keyframes`
  0% { transform: translateX(-50px) translateY(0px); }
  25% { transform: translateX(50px) translateY(-30px); }
  50% { transform: translateX(-30px) translateY(-60px); }
  75% { transform: translateX(40px) translateY(-30px); }
  100% { transform: translateX(-50px) translateY(0px); }
`

// רכיבי אנימציה מטורפים
const FloatingBubble = styled(Box)<{ delay: number; duration: number; left: string }>(({ delay, duration, left }) => ({
  position: "absolute",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
  left,
  animation: `${floatingBubbles} ${duration}s linear infinite`,
  animationDelay: `${delay}s`,
}))

const SpinningOrb = styled(Box)<{ top: string; left: string; delay: number }>(({ top, left, delay }) => ({
  position: "absolute",
  top,
  left,
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  background: "linear-gradient(45deg, #f093fb, #00d4ff)",
  animation: `${spinningOrbs} 8s linear infinite`,
  animationDelay: `${delay}s`,
}))

const PulseWaveElement = styled(Box)<{ top: string; left: string; delay: number }>(({ top, left, delay }) => ({
  position: "absolute",
  top,
  left,
  width: "2px",
  height: "2px",
  borderRadius: "50%",
  background: "rgb(234, 102, 203)",
  animation: `${pulseWave} 3s ease-out infinite`,
  animationDelay: `${delay}s`,
}))

const MorphingShape = styled(Box)<{ top: string; right: string; delay: number }>(({ top, right, delay }) => ({
  position: "absolute",
  top,
  right,
  width: "80px",
  height: "80px",
  background: "linear-gradient(135deg, rgba(234, 102, 203, 0.3), rgba(189, 132, 246, 0.3))",
  animation: `${morphingShape} 6s ease-in-out infinite, ${colorShift} 8s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}))

const ZigzagElement = styled(Box)<{ top: string; delay: number }>(({ top, delay }) => ({
  position: "absolute",
  top,
  left: "10%",
  width: "12px",
  height: "12px",
  borderRadius: "2px",
  background: "linear-gradient(45deg, #00d4ff, #f093fb)",
  animation: `${zigzagMove} 5s ease-in-out infinite, ${colorShift} 4s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}))

const StyledContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
  position: "relative",
  overflow: "hidden",
})

const GlassCard = styled(Paper)({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(234, 102, 203, 0.2)",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(234, 102, 203, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "24px",
    padding: "2px",
    background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "xor",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
  },
})

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 255, 255, 0.9)",
    borderRadius: "12px",
    border: "2px solid transparent",
    backgroundClip: "padding-box",
    transition: "all 0.3s ease",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: "12px",
      padding: "2px",
      background: "linear-gradient(45deg, rgba(234, 102, 203, 0.3), rgba(189, 132, 246, 0.3))",
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "xor",
      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      zIndex: -1,
    },
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 25px rgba(234, 102, 203, 0.2)",
      "&::before": {
        background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
      },
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 12px 35px rgba(234, 102, 203, 0.3)",
      "&::before": {
        background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
      },
    },
  },
})

const GradientButton = styled(Button)({
  background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
  borderRadius: "12px",
  textTransform: "none",
  fontSize: "1.1rem",
  fontWeight: "600",
  padding: "14px 28px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
  color: "white",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
    transition: "left 0.5s ease",
  },
  "&:hover": {
    transform: "translateY(-3px)",
    background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
    boxShadow: "0 15px 35px rgba(234, 102, 203, 0.4)",
    "&::before": {
      left: "100%",
    },
  },
})

const SocialButton = styled(Button)({
  background: "rgba(255, 255, 255, 0.9)",
  border: "2px solid transparent",
  borderRadius: "12px",
  color: "#333",
  fontWeight: "600",
  padding: "12px 20px",
  position: "relative",
  transition: "all 0.3s ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "12px",
    padding: "2px",
    background: "linear-gradient(45deg, rgba(234, 102, 203, 0.5), rgba(189, 132, 246, 0.5))",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "xor",
    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    zIndex: -1,
  },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(234, 102, 203, 0.2)",
    "&::before": {
      background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
    },
  },
})

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  // const theme = useTheme()

  useEffect(() => {
    // Clear any previous errors
    userStore.logout()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!userEmail || !password) {
      setError("נא למלא את כל השדות")
      return
    }

    setLoading(true)
    setError("")

    try {
      await userStore.login(userEmail, password)

      if (userStore.error) {
        setError(userStore.error)
      } else {
        setSuccess(true)
        // Short delay before redirecting
        setTimeout(() => {
          navigate("/personal-area")
        }, 1000)
      }
    } catch (error: any) {
      setError(error.message || "התחברות נכשלה, נסה שוב")
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <StyledContainer>
      {/* אנימציות רקע מטורפות */}
      {/* בועות צפות */}
      <FloatingBubble delay={0} duration={12} left="5%" />
      <FloatingBubble delay={2} duration={15} left="15%" />
      <FloatingBubble delay={4} duration={10} left="25%" />
      <FloatingBubble delay={1} duration={18} left="35%" />
      <FloatingBubble delay={6} duration={14} left="45%" />
      <FloatingBubble delay={3} duration={16} left="55%" />
      <FloatingBubble delay={8} duration={11} left="65%" />
      <FloatingBubble delay={5} duration={13} left="75%" />
      <FloatingBubble delay={7} duration={17} left="85%" />
      <FloatingBubble delay={9} duration={12} left="95%" />

      {/* כדורים מסתובבים */}
      <SpinningOrb top="20%" left="10%" delay={0} />
      <SpinningOrb top="60%" left="20%" delay={2} />
      <SpinningOrb top="30%" left="80%" delay={1} />
      <SpinningOrb top="70%" left="90%" delay={3} />

      {/* גלי דופק */}
      <PulseWaveElement top="15%" left="30%" delay={0} />
      <PulseWaveElement top="40%" left="70%" delay={1} />
      <PulseWaveElement top="65%" left="25%" delay={2} />
      <PulseWaveElement top="80%" left="80%" delay={0.5} />
      <PulseWaveElement top="25%" left="60%" delay={1.5} />

      {/* צורות משתנות */}
      <MorphingShape top="10%" right="15%" delay={0} />
      <MorphingShape top="50%" right="5%" delay={2} />
      <MorphingShape top="75%" right="25%" delay={4} />

      {/* אלמנטים זיגזג */}
      <ZigzagElement top="20%" delay={0} />
      <ZigzagElement top="60%" delay={2} />
      <ZigzagElement top="35%" delay={1} />

      <Grid container sx={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {/* עמודה שמאלית - תמונה */}
        {/* <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: "none", md: "flex" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: 'url("/images/login.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.8) saturate(1.1)",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(234, 102, 203, 0.1), rgba(189, 132, 246, 0.1), rgba(240, 147, 251, 0.1))",
              zIndex: 2,
            }}
          />
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            sx={{
              position: "relative",
              zIndex: 3,
              alignSelf: "center",
              textAlign: "center",
              color: "white",
              padding: 4,
              width: "80%",
              mx: "auto",
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight="800" 
              gutterBottom
              sx={{
                textShadow: "2px 2px 20px rgba(0,0,0,0.5)",
                background: "linear-gradient(45deg, #fff, #f0f0f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ברוכים השבים
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.95,
                textShadow: "1px 1px 10px rgba(0,0,0,0.5)",
                fontWeight: 300,
              }}
            >
              התחברו כדי לנהל את האלבומים והתמונות שלכם
            </Typography>
          </Box>
        </Grid> */}

        {/* עמודה ימנית - טופס התחברות */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: { xs: 2, sm: 4, md: 8 },
            position: "relative",
            left: "25%",
          }}
        >
          <GlassCard
            // component={motion.div}
            // initial={{ opacity: 0, y: 30, scale: 0.9 }}
            // animate={{ opacity: 1, y: 0, scale: 1 }}
            // transition={{ duration: 0.8, ease: "easeOut" }}
            // elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              width: "100%",
              maxWidth: 500,
              position: "relative",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Typography 
                variant="h3" 
                fontWeight="700" 
                align="center" 
                sx={{ 
                  mb: 5,
                  background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(2px 2px 4px rgba(234, 102, 203, 0.3))",
                }}
              >
                התחברות
              </Typography>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid rgba(244, 67, 54, 0.3)",
                    }} 
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <StyledTextField
                  label="כתובת מייל"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlined sx={{ color: "rgb(234, 102, 203)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <StyledTextField
                  label="סיסמה"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "rgb(234, 102, 203)" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          aria-label="toggle password visibility" 
                          onClick={handleClickShowPassword} 
                          edge="end"
                          sx={{ color: "rgb(189, 132, 246)" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    textDecoration: "none",
                    background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                >
                  שכחת סיסמה?
                </Link>
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <GradientButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ mb: 4 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "התחברות"
                  )}
                </GradientButton>
              </motion.div>

              <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
                <Divider sx={{ flex: 1, bgcolor: "rgba(234, 102, 203, 0.3)" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    px: 2, 
                    color: "#666",
                    fontWeight: "500",
                  }}
                >
                  או
                </Typography>
                <Divider sx={{ flex: 1, bgcolor: "rgba(234, 102, 203, 0.3)" }} />
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                  <SocialButton 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Google />}
                  >
                    Google
                  </SocialButton>
                  <SocialButton 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Facebook />}
                  >
                    Facebook
                  </SocialButton>
                </Box>
              </motion.div>

              <Typography 
                variant="body1" 
                align="center" 
                sx={{ 
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                אין לך חשבון?{" "}
                <Link
                  to="/register"
                  style={{
                    textDecoration: "none",
                    background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                >
                  הירשם עכשיו
                </Link>
              </Typography>
            </Box>
          </GlassCard>
        </Grid>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          severity="success" 
          variant="filled"
          sx={{
            background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
            borderRadius: "12px",
          }}
        >
          התחברת בהצלחה! מעביר אותך לאזור האישי...
        </Alert>
      </Snackbar>
    </StyledContainer>
  )
}

export default observer(Login)
