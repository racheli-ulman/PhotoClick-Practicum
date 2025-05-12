"use client"

import type React from "react"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  Drawer,
  IconButton,
  Container,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { Link, useNavigate } from "react-router-dom"
import userStore from "../stores/userStore"
import { Home, PhotoLibrary, Login, Logout, Person, Settings, Info, Help } from "@mui/icons-material"

const Header: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const isLoggedIn = !!userStore.user
  const userInitials = isLoggedIn
    ? `${userStore.user.user.firstName?.charAt(0) || ""}${userStore.user.user.lastName?.charAt(0) || ""}`
    : ""

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

  const menuItems = [
    { label: "בית", icon: <Home fontSize="small" />, path: "/" },
    { label: "אודות", icon: <Info fontSize="small" />, path: "#about" },
    { label: "עזרה", icon: <Help fontSize="small" />, path: "#help" },
    { label: "התחברות", icon: <Login fontSize="small" />, path: "/login" },
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
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: "white",
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 70, justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img
              src="/images/logo.jpg"
              alt="Logo"
              style={{ width: 50, height: 50, marginRight: 10, borderRadius: "50%" }}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                color: theme.palette.primary.main,
                display: { xs: "none", sm: "block" },
              }}
            >
              פוטו-קליק
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: "text.primary",
                    "&:hover": { color: theme.palette.primary.main },
                  }}
                  startIcon={item.icon}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu / Login Button */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: theme.palette.primary.main,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: theme.palette.primary.dark,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {userInitials}
                  </Avatar>
                </IconButton>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      minWidth: 200,
                      mt: 1.5,
                      "& .MuiMenuItem-root": {
                        px: 2,
                        py: 1.5,
                        borderRadius: 1,
                        mx: 0.5,
                        my: 0.3,
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
              <Button
                variant="contained"
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
                component={Link}
                to="/login"
                startIcon={<Login />}
              >
                התחברות
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                sx={{
                  ml: 1,
                  color: theme.palette.text.primary,
                }}
                aria-label="open drawer"
                edge="end"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Mobile drawer */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: 280,
                borderRadius: "12px 0 0 12px",
                bgcolor: "background.paper",
                color: "text.primary",
                p: 2,
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3, p: 2 }}>
                <img
                  src="/images/logo.jpg"
                  alt="Logo"
                  style={{ width: 40, height: 40, marginRight: 10, borderRadius: "50%" }}
                />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  פוטו-קליק
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Menu Items */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      justifyContent: "flex-start",
                      px: 2,
                      py: 1.5,
                      color: "text.primary",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      },
                    }}
                    onClick={toggleDrawer(false)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* User Actions */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: "auto" }}>
                {isLoggedIn ? (
                  <>
                    <Box sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {userStore.user?.user?.firstName} {userStore.user?.user?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {userStore.user?.user?.email}
                      </Typography>
                    </Box>
                    {profileMenuItems.map((item) => (
                      <Button
                        key={item.label}
                        startIcon={item.icon}
                        sx={{
                          justifyContent: "flex-start",
                          px: 2,
                          py: 1.5,
                          color: "text.primary",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                          },
                        }}
                        onClick={() => {
                          item.action()
                          toggleDrawer(false)({ type: "click" } as React.MouseEvent)
                        }}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Login />}
                      sx={{ mb: 1 }}
                      component={Link}
                      to="/login"
                      onClick={toggleDrawer(false)}
                    >
                      התחברות
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Person />}
                      component={Link}
                      to="/register"
                      onClick={toggleDrawer(false)}
                    >
                      הרשמה
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Header
