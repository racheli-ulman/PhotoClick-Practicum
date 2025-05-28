// // import React, { useState } from 'react';
// // import { observer } from 'mobx-react-lite';
// // import userStore from '../stores/userStore'; // יש לוודא שהנתיב נכון

// // const Register = observer(() => {
// //   const [firstName, setFirstName] = useState('');
// //   const [lastName, setLastName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [roleName, setRoleName] = useState('User'); // ברירת מחדל היא User

// //   const handleRegister = async () => {
// //     await userStore.register(firstName, lastName, email, password, roleName);
// //     if (userStore.error) {
// //       alert(userStore.error); // הצגת שגיאה אם יש
// //     } else {
// //       alert('User registered successfully!'); // הודעה על הצלחה
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Register</h2>
// //       <input
// //         type="text"
// //         placeholder="First Name"
// //         value={firstName}
// //         onChange={(e) => setFirstName(e.target.value)}
// //       />
// //       <input
// //         type="text"
// //         placeholder="Last Name"
// //         value={lastName}
// //         onChange={(e) => setLastName(e.target.value)}
// //       />
// //       <input
// //         type="email"
// //         placeholder="Email"
// //         value={email}
// //         onChange={(e) => setEmail(e.target.value)}
// //       />
// //       <input
// //         type="password"
// //         placeholder="Password"
// //         value={password}
// //         onChange={(e) => setPassword(e.target.value)}
// //       />
// //       <select value={roleName} onChange={(e) => setRoleName(e.target.value)}>
// //         <option value="User">User</option>
// //         <option value="Admin">Admin</option>
// //       </select>
// //       <button onClick={handleRegister}>Register</button>
// //       {userStore.error && <p style={{ color: 'red' }}>{userStore.error}</p>}
// //     </div>
// //   );
// // });

// // export default Register;



// import React, { useState } from 'react';
// import { observer } from 'mobx-react-lite';
// import userStore from '../stores/userStore';
// import { 
//   TextField, 
//   Button, 
//   Typography, 
//   Box, 
//   Paper, 
//   Grid, 
//   InputAdornment,
//   IconButton
// } from '@mui/material';
// import { 
//   Visibility, 
//   VisibilityOff,
//   EmailOutlined, 
//   LockOutlined, 
//   PersonOutlined, 
//   BadgeOutlined 
// } from '@mui/icons-material';
// import { useNavigate, Link } from 'react-router-dom';

// const Register: React.FC = observer(() => {
//   const [firstName, setFirstName] = useState<string>('');
//   const [lastName, setLastName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const navigate = useNavigate();

//   const handleRegister = async () => {
//     // Input validation
//     if (!firstName || !lastName || !email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }

//     // Email validation
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//       setError('כתובת מייל לא חוקית');
//       return;
//     }

//     try {
//       await userStore.register(firstName, lastName, email, password, 'User'); // Set roleName to 'User' directly
      
//       if (userStore.error) {
//         setError(userStore.error);
//       } else {
//         setError('');
//         navigate('/personal-area/userAlbums');
//       }
//     } catch (err) {
//       setError('Registration failed. Please try again.');
//     }
//   };

//   return (
//     <Grid 
//       container 
//       sx={{ 
//         height: "100vh", 
//         overflow: "hidden",
//         background: 'linear-gradient(135deg, #e6f2ff 0%, #b3d9ff 100%)'
//       }}
//     >
//       {/* Right Column - Image */}
//       <Grid 
//         item 
//         xs={12} 
//         md={6} 
//         sx={{ 
//           display: "flex", 
//           justifyContent: "center", 
//           alignItems: "center", 
//           backgroundColor: "#c46868", 
//           height: "100%",
//           position: 'relative',
//           overflow: 'hidden'
//         }}
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '-10%',
//             left: '-10%',
//             width: '120%',
//             height: '120%',
//             backgroundImage: 'url("/images/15.jpg")',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             filter: 'brightness(0.8) blur(5px)',
//             transform: 'rotate(-5deg)',
//             zIndex: 1
//           }}
//         />
//         <Box
//           sx={{
//             zIndex: 2,
//             textAlign: 'center',
//             color: 'white',
//             padding: 4,
//             backgroundColor: '#c46868',
//             borderRadius: 2
//           }}
//         >
//           <Typography variant="h3" fontWeight="bold" gutterBottom>
//             Create Your Account
//           </Typography>
//           <Typography variant="subtitle1">
//             Join our creative community
//           </Typography>
//         </Box>
//       </Grid>

//       {/* Left Column - Registration Form */}
//       <Grid 
//         item 
//         xs={12} 
//         md={6} 
//         sx={{ 
//           display: "flex", 
//           justifyContent: "center", 
//           alignItems: "center", 
//           height: "100%",
//           backgroundColor: 'white'
//         }}
//       >
//         <Paper
//           elevation={10}
//           sx={{
//             padding: 5,
//             borderRadius: "20px",
//             width: "400px",
//             textAlign: "center",
//             boxShadow: "0 10px 30px rgba(0, 51, 102, 0.1)",
//             transition: 'transform 0.3s ease-in-out',
//             '&:hover': {
//               transform: 'scale(1.02)'
//             }
//           }}
//         >
//           <Typography 
//             variant="h4" 
//             fontWeight="700" 
//             color="text.primary" 
//             sx={{ 
//               marginBottom: 3,
//               background: 'linear-gradient(45deg, #c46868 0%,rgb(210, 132, 189) 100%)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent'
//             }}
//           >
//             Sign Up
//           </Typography>
          
//           <TextField
//             label="First Name"
//             value={firstName}
//             required
//             onChange={({ target }) => setFirstName(target.value)}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <PersonOutlined color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
          
//           <TextField
//             label="Last Name"
//             value={lastName}
//             required
//             onChange={({ target }) => setLastName(target.value)}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <BadgeOutlined color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
          
//           <TextField
//             label="Email Address"
//             type="email"
//             value={email}
//             required
//             onChange={({ target }) => setEmail(target.value)}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <EmailOutlined color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
          
//           <TextField
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             value={password}
//             required
//             onChange={({ target }) => setPassword(target.value)}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <LockOutlined color="action" />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
          
//           <Button 
//             variant="contained" 
//             fullWidth 
//             size="large" 
//             onClick={handleRegister} 
//             sx={{ 
//               marginBottom: 2,
//               background: 'linear-gradient(45deg, #c46868 0%, #d59a9a 100%)', // צבע חלש יותר
//               '&:hover': { 
//                 background: 'linear-gradient(45deg, #d59a9a 0%, #c46868 100%)' // צבע חלש יותר בה-hover
//               }
//             }}
            
//           >
//             Create Account
//           </Button>
          
//           {error && (
//             <Typography 
//               color="error" 
//               sx={{ 
//                 marginTop: 2,
//                 textAlign: 'center'
//               }}
//             >
//               {error}
//             </Typography>
//           )}
          
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               marginTop: 2,
//               color: '#c46868'
//             }}
//           >
//             Already have an account? 
//             <Link 
//               to="/login" 
//               style={{ 
//                 color: '#c46868', 
//                 marginLeft: 5,
//                 textDecoration: 'none',
//                 fontWeight: 'bold'
//               }}
//             >
//               Sign In
//             </Link>
//           </Typography>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// });

// export default Register;






"use client"

import type React from "react"
import { useState } from "react"
import { observer } from "mobx-react-lite"
import userStore from "../../stores/userStore"
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
  // Divider,
  // useTheme,
  styled,
  keyframes,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { 
  Visibility, 
  VisibilityOff, 
  EmailOutlined, 
  LockOutlined, 
  PersonOutlined, 
  BadgeOutlined, 
  // Google, 
  // Facebook 
} from "@mui/icons-material"
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

// const SocialButton = styled(Button)({
//   background: "rgba(255, 255, 255, 0.9)",
//   border: "2px solid transparent",
//   borderRadius: "12px",
//   color: "#333",
//   fontWeight: "600",
//   padding: "12px 20px",
//   position: "relative",
//   transition: "all 0.3s ease",
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: "12px",
//     padding: "2px",
//     background: "linear-gradient(45deg, rgba(234, 102, 203, 0.5), rgba(189, 132, 246, 0.5))",
//     mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//     maskComposite: "xor",
//     WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//     WebkitMaskComposite: "xor",
//     zIndex: -1,
//   },
//   "&:hover": {
//     transform: "translateY(-2px)",
//     boxShadow: "0 8px 25px rgba(234, 102, 203, 0.2)",
//     "&::before": {
//       background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
//     },
//   },
// })

const Register: React.FC = observer(() => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Input validation
    if (!firstName || !lastName || !email || !password) {
      setError('נא למלא את כל השדות')
      return
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('כתובת מייל לא חוקית')
      return
    }

    setLoading(true)
    setError('')

    try {
      await userStore.register(firstName, lastName, email, password, 'User')
      
      if (userStore.error) {
        setError(userStore.error)
      } else {
        setSuccess(true)
        // Short delay before redirecting
        setTimeout(() => {
          navigate('/personal-area/userAlbums')
        }, 1000)
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
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
        {/* עמודה ימנית - טופס הרשמה */}
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
            <Box component="form" onSubmit={handleRegister} noValidate>
              <Typography 
                variant="h3" 
                fontWeight="700" 
                align="center" 
                sx={{ 
                  mb: 1,
                  mt:-5,
                  background: "linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(2px 2px 4px rgba(234, 102, 203, 0.3))",
                }}
              >
                הרשמה
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
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <StyledTextField
                  label="שם פרטי"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlined sx={{ color: "rgb(234, 102, 203)" }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <StyledTextField
                  label="שם משפחה"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeOutlined sx={{ color: "rgb(234, 102, 203)" }} />
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
                  label="כתובת מייל"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  sx={{ mb: 1 }}
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
                transition={{ delay: 0.4, duration: 0.5 }}
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
                  sx={{ mb: 4 }}
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <GradientButton
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "הרשמה"
                  )}
                </GradientButton>
              </motion.div>

              {/* <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
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
                transition={{ delay: 0.6, duration: 0.5 }}
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
              </motion.div> */}

              <Typography 
                variant="body1" 
                align="center" 
                sx={{ 
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                יש לך כבר חשבון?{" "}
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                >
                  התחבר עכשיו
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
          נרשמת בהצלחה! מעביר אותך לאזור האישי...
        </Alert>
      </Snackbar>
    </StyledContainer>
  )
})

export default Register
