"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Container,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Backdrop,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { Link, useNavigate } from "react-router-dom"
import userStore from "../stores/userStore"
import { Home, PhotoLibrary, Login, Logout, Person, Settings, Info, Help, Close } from "@mui/icons-material"

interface HeaderProps {
  onOpenChat?: () => void
}

const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const isLoggedIn = !!userStore.user
  const userInitials = isLoggedIn
    ? `${userStore.user.user.firstName?.charAt(0) || ""}${userStore.user.user.lastName?.charAt(0) || ""}`
    : ""

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === "keydown" && "key" in event && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setDrawerOpen(open)
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    userStore.logout()
    handleMenuClose()
    navigate("/")
  }

  const handleHelpClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onOpenChat) {
      onOpenChat()
    }
    if (drawerOpen) {
      setDrawerOpen(false)
    }
  }

  const menuItems = [
    { label: "בית", icon: <Home fontSize="small" />, path: "/", action: undefined },
    { label: "אודות", icon: <Info fontSize="small" />, path: "#about", action: undefined },
    { label: "עזרה", icon: <Help fontSize="small" />, path: "#help", action: handleHelpClick },
    { label: "התחברות", icon: <Login fontSize="small" />, path: "/login", action: undefined },
  ]

  const profileMenuItems = isLoggedIn
    ? [
      {
        label: "האלבומים שלי",
        icon: <PhotoLibrary fontSize="small" />,
        action: () => {
          navigate("/personal-area/userAlbums")
          handleMenuClose()
        },
      },
      {
        label: "הגדרות",
        icon: <Settings fontSize="small" />,
        action: () => {
          navigate("/settings")
          handleMenuClose()
        },
      },
      { label: "התנתקות", icon: <Logout fontSize="small" />, action: handleLogout },
    ]
    : [
      {
        label: "התחברות",
        icon: <Login fontSize="small" />,
        action: () => {
          navigate("/login")
          handleMenuClose()
        },
      },
      {
        label: "הרשמה",
        icon: <Person fontSize="small" />,
        action: () => {
          navigate("/register")
          handleMenuClose()
        },
      },
    ]

  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: scrolled
              ? "linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95), rgba(240, 147, 251, 0.95))"
              : "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1), rgba(240, 147, 251, 0.1))",
            backdropFilter: "blur(20px)",
            borderBottom: `1px solid ${alpha("#667eea", 0.2)}`,
            transition: "all 0.3s ease",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb, #00d4ff)",
              backgroundSize: "400% 400%",
              animation: "gradientShift 8s ease infinite",
              opacity: 0.1,
              zIndex: -1,
            },
            "@keyframes gradientShift": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ height: 80, justifyContent: "space-between" }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <img
                      src="/images/logo.jpg"
                      alt="Logo"
                      style={{
                        width: 60,
                        height: 60,
                        marginRight: 16,
                        borderRadius: "50%",
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
                      }}
                    />
                  </motion.div>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      display: { xs: "none", sm: "block" },
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    פוטו-קליק
                  </Typography>
                </Box>
              </motion.div>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        component={item.action ? "button" : Link}
                        to={item.action ? undefined : item.path}
                        onClick={item.action}
                        sx={{
                          color: scrolled ? "white" : "#667eea",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          borderRadius: "25px",
                          position: "relative",
                          overflow: "hidden",
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
                            background: "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                            transform: "translateY(-2px)",
                            "&::before": {
                              left: "100%",
                            },
                          },
                        }}
                        startIcon={item.icon}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              )}

              {/* User Menu / Login Button */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {isLoggedIn ? (
                  <>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton
                        onClick={handleProfileMenuOpen}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls="profile-menu"
                        aria-haspopup="true"
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: "rgba(255, 255, 255, 0.95)",
                            border: "2px solid transparent",
                            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), linear-gradient(45deg, rgb(162, 75, 156), #f093fb, #00d4ff)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "content-box, border-box",
                            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
                            transition: "all 0.3s ease",
                            color: "rgb(162, 75, 156)",
                            fontWeight: "600",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 6px 25px rgba(102, 126, 234, 0.25)",
                              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(45deg, rgb(162, 75, 156), #f093fb, #00d4ff)",
                            },
                          }}
                        >
                          {userInitials}
                        </Avatar>
                      </IconButton>
                    </motion.div>
                    <Menu
                      id="profile-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        elevation: 0,
                        sx: {
                          minWidth: 220,
                          mt: 1.5,
                          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(102, 126, 234, 0.2)",
                          borderRadius: "15px",
                          "& .MuiMenuItem-root": {
                            px: 2,
                            py: 1.5,
                            borderRadius: "10px",
                            mx: 1,
                            my: 0.5,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {userStore.user?.user?.firstName} {userStore.user?.user?.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {userStore.user?.user?.email}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      {profileMenuItems.map((item) => (
                        <MenuItem key={item.label} onClick={item.action}>
                          <ListItemIcon>{item.icon}</ListItemIcon>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "25px",
                        px: 4,
                        py: 1.5,
                        background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                        color: "white",
                        fontWeight: 600,
                        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                        position: "relative",
                        overflow: "hidden",
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
                          boxShadow: "0 12px 40px rgba(102, 126, 234, 0.4)",
                          "&::before": {
                            left: "100%",
                          },
                        },
                      }}
                      component={Link}
                      to="/login"
                      startIcon={<Login />}
                    >
                      התחברות
                    </Button>
                  </motion.div>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      sx={{
                        ml: 1,
                        color: scrolled ? "white" : "#667eea",
                        background: "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
                        borderRadius: "15px",
                      }}
                      aria-label="open drawer"
                      edge="end"
                      onClick={toggleDrawer(true)}
                    >
                      <MenuIcon />
                    </IconButton>
                  </motion.div>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <Backdrop open={drawerOpen} onClick={toggleDrawer(false)} sx={{ zIndex: 1200 }} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ position: "fixed", top: 0, right: 0, zIndex: 1300 }}
            >
              <Box
                sx={{
                  width: 320,
                  height: "100vh",
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95), rgba(240, 147, 251, 0.95))",
                  backdropFilter: "blur(20px)",
                  color: "white",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src="/images/logo.jpg"
                      alt="Logo"
                      style={{ width: 50, height: 50, marginRight: 16, borderRadius: "50%" }}
                    />
                    <Typography variant="h6" fontWeight="bold">
                      פוטו-קליק
                    </Typography>
                  </Box>
                  <IconButton onClick={toggleDrawer(false)} sx={{ color: "white" }}>
                    <Close />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.2)" }} />

                {/* Menu Items */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <Button
                        component={item.action ? "button" : Link}
                        to={item.action ? undefined : item.path}
                        startIcon={item.icon}
                        onClick={
                          item.action
                            ? (e: any) => {
                              item.action && item.action(e)
                              if (!item.action) toggleDrawer(false)({ type: "click" } as React.MouseEvent)
                            }
                            : toggleDrawer(false)
                        }
                        sx={{
                          justifyContent: "flex-start",
                          px: 3,
                          py: 2,
                          color: "white",
                          borderRadius: "15px",
                          "&:hover": {
                            bgcolor: "rgba(255, 255, 255, 0.1)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </Box>

                <Divider sx={{ mb: 3, borderColor: "rgba(255,255,255,0.2)" }} />

                {/* User Actions */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
                  {isLoggedIn ? (
                    <>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {userStore.user?.user?.firstName} {userStore.user?.user?.lastName}
                        </Typography>
                        <Typography variant="body2" color="rgba(255,255,255,0.8)" noWrap>
                          {userStore.user?.user?.email}
                        </Typography>
                      </Box>
                      {profileMenuItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                        >
                          <Button
                            startIcon={item.icon}
                            sx={{
                              justifyContent: "flex-start",
                              px: 3,
                              py: 2,
                              color: "white",
                              borderRadius: "15px",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                              },
                            }}
                            onClick={() => {
                              item.action()
                              toggleDrawer(false)({ type: "click" } as React.MouseEvent)
                            }}
                          >
                            {item.label}
                          </Button>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Login />}
                          sx={{
                            mb: 1,
                            background: "linear-gradient(45deg, #00d4ff, #667eea)",
                            borderRadius: "15px",
                            py: 1.5,
                          }}
                          component={Link}
                          to="/login"
                          onClick={toggleDrawer(false)}
                        >
                          התחברות
                        </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<Person />}
                          sx={{
                            borderColor: "white",
                            color: "white",
                            borderRadius: "15px",
                            py: 1.5,
                            "&:hover": {
                              borderColor: "white",
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                          component={Link}
                          to="/register"
                          onClick={toggleDrawer(false)}
                        >
                          הרשמה
                        </Button>
                      </motion.div>
                    </>
                  )}
                </Box>
              </Box>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header