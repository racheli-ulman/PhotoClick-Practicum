"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Box, Typography, Container, Grid, Paper } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import SearchIcon from "@mui/icons-material/Search"
import ShareIcon from "@mui/icons-material/Share"
import EditIcon from "@mui/icons-material/Edit"
import CollectionsIcon from "@mui/icons-material/Collections"
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum"
import { useNavigate } from "react-router-dom";

interface Feature {
  title: string
  description: string
  icon: React.ReactElement
  color: string
}

const features: Feature[] = [
  {
    title: "אלבומים מאורגנים",
    description: "צרו וארגנו אלבומים לפי נושאים, אירועים או כל דרך שתבחרו עם ממשק חדשני ואינטואיטיבי.",
    icon: <PhotoAlbumIcon fontSize="large" />,
    color: "#667eea",
  },
  {
    title: "גיבוי אוטומטי",
    description: "לעולם לא תאבדו תמונות חשובות עם הגיבוי האוטומטי החכם שלנו בענן המאובטח.",
    icon: <CloudUploadIcon fontSize="large" />,
    color: "#764ba2",
  },
  {
    title: "חיפוש חכם",
    description: "מצאו כל תמונה במהירות עם חיפוש מתקדם לפי תגיות, תאריכים או טקסט חופשי.",
    icon: <SearchIcon fontSize="large" />,
    color: "#f093fb",
  },
  {
    title: "שיתוף קל",
    description: "שתפו אלבומים ותמונות עם משפחה וחברים בלחיצת כפתור עם אפשרויות פרטיות מתקדמות.",
    icon: <ShareIcon fontSize="large" />,
    color: "#00d4ff",
  },
  {
    title: "עריכה מתקדמת",
    description: "ערכו תמונות ישירות באפליקציה עם כלי עריכה מקצועיים וידידותיים למשתמש.",
    icon: <EditIcon fontSize="large" />,
    color: "#667eea",
  },
  {
    title: "יצירת קולאז׳ים",
    description: "צרו קולאז׳ים מרהיבים מהתמונות האהובות עליכם במגוון סגנונות ותבניות יצירתיות.",
    icon: <CollectionsIcon fontSize="large" />,
    color: "#764ba2",
  },
]

const Features: React.FC = () => {
  // const theme = useTheme()
const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  return (
    <Box
      component="section"
      id="features"
      sx={{
        py: 12,
        background: "linear-gradient(135deg, #f8f9ff, #f0f4ff, #e8f2ff)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05), rgba(240, 147, 251, 0.05))",
          backgroundSize: "400% 400%",
          animation: "gradientShift 20s ease infinite",
        },
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Floating Background Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: 200,
          height: 200,
          background: "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 150,
          height: 150,
          background: "linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(0, 212, 255, 0.1))",
          borderRadius: "30px",
          filter: "blur(30px)",
        }}
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              תכונות מרכזיות
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "text.secondary",
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 300,
              }}
            >
              גלו את הכוח של ניהול תמונות מתקדם עם טכנולוגיה חדשנית
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      borderRadius: "25px",
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: "-100%",
                        width: "100%",
                        height: "100%",
                        background: `linear-gradient(90deg, transparent, ${feature.color}20, transparent)`,
                        transition: "left 0.5s",
                      },
                      "&:hover": {
                        boxShadow: `0 20px 60px ${feature.color}30`,
                        transform: "translateY(-10px)",
                        "&::before": {
                          left: "100%",
                        },
                      },
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.6,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
                    >
                      <Box
                        sx={{
                          color: feature.color,
                          mb: 3,
                          p: 2,
                          borderRadius: "20px",
                          background: `linear-gradient(45deg, ${feature.color}15, ${feature.color}25)`,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        duration: 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          color: feature.color,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.1 + 0.5,
                        duration: 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.6,
                          fontWeight: 400,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </motion.div>

                    {/* Decorative corner element */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 15,
                        right: 15,
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: `linear-gradient(45deg, ${feature.color}30, ${feature.color}50)`,
                        opacity: 0.6,
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              מוכנים להתחיל?
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                 onClick={() => navigate("/register")} // שימוש ב-navigate
                sx={{
                  display: "inline-block",
                  px: 6,
                  py: 2,
                  borderRadius: "50px",
                  background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  boxShadow: "0 15px 40px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 20px 50px rgba(102, 126, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                הצטרפו עכשיו בחינם
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Features
