"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Box, Typography, Button, Container } from "@mui/material"
import { PhotoLibrary, ArrowForward, Star } from "@mui/icons-material"

const images: string[] = [
  "/placeholder.svg?height=600&width=1200&query=beautiful family photos",
  "/placeholder.svg?height=600&width=1200&query=wedding photography",
  "/placeholder.svg?height=600&width=1200&query=nature landscape photos",
  "/placeholder.svg?height=600&width=1200&query=children playing photos",
]

const Hero: React.FC = () => {
  // const theme = useTheme()
  const [currentImage, setCurrentImage] = useState<number>(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
    }))
    setParticles(newParticles)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 50 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.8,
  //       ease: "easeOut",
  //     },
  //   },
  // }

  const titleVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.95,
    },
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        color: "white",
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb, #00d4ff)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.3)",
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Background Images with Parallax Effect */}
      <AnimatePresence mode="wait">
        {images.map(
          (image, index) =>
            currentImage === index && (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.3, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 2 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${image})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  zIndex: 1,
                }}
              />
            ),
        )}
      </AnimatePresence>

      {/* Floating Geometric Shapes */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 100,
          height: 100,
          background: "linear-gradient(45deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))",
          borderRadius: "20px",
          zIndex: 2,
        }}
        animate={{
          rotate: 360,
          y: [0, -20, 0],
        }}
        transition={{
          rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          y: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: 80,
          height: 80,
          background: "linear-gradient(45deg, rgba(240, 147, 251, 0.3), rgba(0, 212, 255, 0.3))",
          borderRadius: "50%",
          zIndex: 2,
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 3 }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Box sx={{ textAlign: "center", py: 8 }}>
            {/* Animated Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
                  backdropFilter: "blur(20px)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  mb: 4,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                }}
              >
                <PhotoLibrary sx={{ fontSize: 60, color: "white" }} />
              </Box>
            </motion.div>

            <motion.div variants={titleVariants}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "5rem" },
                  background: "linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  mb: 2,
                }}
              >
                נהלו את התמונות שלכם
                <br />
                <span
                  style={{
                    background: "linear-gradient(45deg, #00d4ff, #667eea)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  בקסם
                </span>
              </Typography>
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <Typography
                variant="h4"
                component="p"
                sx={{
                  mb: 6,
                  maxWidth: "800px",
                  mx: "auto",
                  fontWeight: 300,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
                  lineHeight: 1.6,
                }}
              >
                אפליקציה חדשנית ומודרנית לניהול, ארגון ושיתוף התמונות שלכם
                <br />
                עם אנימציות מרהיבות וחוויית משתמש מטורפת
              </Typography>
            </motion.div>

            <motion.div variants={buttonVariants}>
              <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                      color: "white",
                      py: 2,
                      px: 6,
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      borderRadius: "50px",
                      boxShadow: "0 15px 40px rgba(102, 126, 234, 0.4)",
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
                        boxShadow: "0 20px 50px rgba(102, 126, 234, 0.6)",
                        "&::before": {
                          left: "100%",
                        },
                      },
                    }}
                    component="a"
                    href="/register"
                    endIcon={<ArrowForward />}
                  >
                    הרשמו והתחילו
                  </Button>
                </motion.div>

                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      py: 2,
                      px: 6,
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      borderRadius: "50px",
                      backdropFilter: "blur(20px)",
                      background: "rgba(255, 255, 255, 0.1)",
                      "&:hover": {
                        borderColor: "white",
                        background: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)",
                      },
                    }}
                    startIcon={<Star />}
                  >
                    גלו עוד
                  </Button>
                </motion.div>
              </Box>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 6,
                  mt: 8,
                  flexWrap: "wrap",
                }}
              >
                {[
                  { number: "10K+", label: "משתמשים מרוצים" },
                  { number: "1M+", label: "תמונות נשמרו" },
                  { number: "99%", label: "שביעות רצון" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "20px",
                        p: 3,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
                    >
                      <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
        }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <Box
          sx={{
            width: 30,
            height: 50,
            border: "2px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "25px",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 8,
              background: "white",
              borderRadius: "2px",
              animation: "scroll 2s infinite",
            },
            "@keyframes scroll": {
              "0%": { opacity: 0, transform: "translateX(-50%) translateY(0)" },
              "50%": { opacity: 1 },
              "100%": { opacity: 0, transform: "translateX(-50%) translateY(15px)" },
            },
          }}
        />
      </motion.div>
    </Box>
  )
}

export default Hero
