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
  useTheme,
} from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, Google, Facebook } from "@mui/icons-material"
import { motion } from "framer-motion"

const Login: React.FC = () => {
  const [userEmail, setUserEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

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
    <Grid
      container
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Left Column - Image */}
      <Grid
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
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: 'url("/images/login.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.85)",
            zIndex: 1,
          }}
        />
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          sx={{
            position: "relative",
            zIndex: 2,
            alignSelf: "center",
            textAlign: "center",
            color: "white",
            padding: 4,
            width: "80%",
            mx: "auto",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            ברוכים השבים
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            התחברו כדי לנהל את האלבומים והתמונות שלכם
          </Typography>
        </Box>
      </Grid>

      {/* Right Column - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 4, md: 8 },
        }}
      >
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 2,
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h4" fontWeight="700" color="primary" align="center" sx={{ mb: 4 }}>
              התחברות
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <TextField
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
                    <EmailOutlined color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
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
                    <LockOutlined color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  fontSize: "0.875rem",
                }}
              >
                שכחת סיסמה?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                position: "relative",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "התחברות"}
            </Button>

            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                או
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button variant="outlined" fullWidth startIcon={<Google />} sx={{ py: 1.2 }}>
                Google
              </Button>
              <Button variant="outlined" fullWidth startIcon={<Facebook />} sx={{ py: 1.2 }}>
                Facebook
              </Button>
            </Box>

            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              אין לך חשבון?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                }}
              >
                הירשם עכשיו
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          התחברת בהצלחה! מעביר אותך לאזור האישי...
        </Alert>
      </Snackbar>
    </Grid>
  )
}

export default observer(Login)
