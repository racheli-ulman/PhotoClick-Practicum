"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Box, Typography, Container, Grid, Paper, Avatar } from "@mui/material"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman"
import BusinessIcon from "@mui/icons-material/Business"
import { Star, Favorite, TrendingUp } from "@mui/icons-material"

interface Audience {
  title: string
  description: string
  icon: React.ReactElement
  color: string
  benefits: string[]
}

const TargetAudience: React.FC = () => {
  const audiences: Audience[] = [
    {
      title: "משפחות",
      description: "נהלו את זכרונות המשפחה שלכם במקום אחד מסודר ושתפו אותם עם קרובים בקלות מרבית.",
      icon: <FamilyRestroomIcon fontSize="large" />,
      color: "#667eea",
      benefits: ["ארגון לפי אירועים", "שיתוף בטוח", "גיבוי אוטומטי"],
    },
    {
      title: "אמהות",
      description: "שמרו על רגעי הילדים היקרים מאורגנים וזמינים לשיתוף עם המשפחה המורחבת בכל זמן.",
      icon: <PregnantWomanIcon fontSize="large" />,
      color: "#f093fb",
      benefits: ["תיעוד התפתחות", "שיתוף עם סבים", "זכרונות מאורגנים"],
    },
    {
      title: "עסקים קטנים",
      description: "נהלו גלריות תמונות לפרויקטים ושתפו אותן עם לקוחות ושותפים בצורה מקצועית.",
      icon: <BusinessIcon fontSize="large" />,
      color: "#00d4ff",
      benefits: ["פורטפוליו דיגיטלי", "שיתוף עם לקוחות", "ניהול פרויקטים"],
    },
  ]

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

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
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
      sx={{
        py: 12,
        background: "linear-gradient(135deg, #667eea, #764ba2, #f093fb, #00d4ff)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 20s ease infinite",
        position: "relative",
        overflow: "hidden",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {/* Animated Background Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 6 + 4,
            height: Math.random() * 6 + 4,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.3)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Floating Geometric Shapes */}
      <motion.div
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 120,
          height: 120,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "30px",
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
      />

      <motion.div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "15%",
          width: 80,
          height: 80,
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 6,
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
                color: "white",
                mb: 3,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
              }}
            >
              למי זה מתאים?
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 300,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              פתרונות מותאמים אישית לכל סוג של משתמש
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
            {audiences.map((audience, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3 },
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
                      background: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
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
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                        transition: "left 0.5s",
                      },
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.25)",
                        transform: "translateY(-10px)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
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
                        delay: index * 0.2,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: audience.color,
                          width: 100,
                          height: 100,
                          mb: 3,
                          boxShadow: `0 15px 40px ${audience.color}40`,
                          border: "3px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {audience.icon}
                      </Avatar>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.2 + 0.3,
                        duration: 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="h4"
                        component="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "white",
                        }}
                      >
                        {audience.title}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.2 + 0.5,
                        duration: 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          lineHeight: 1.6,
                          mb: 3,
                          fontWeight: 400,
                        }}
                      >
                        {audience.description}
                      </Typography>
                    </motion.div>

                    {/* Benefits List */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.2 + 0.7,
                        duration: 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ mt: "auto" }}>
                        {audience.benefits.map((benefit, benefitIndex) => (
                          <motion.div
                            key={benefitIndex}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.2 + 0.8 + benefitIndex * 0.1,
                              duration: 0.4,
                            }}
                            viewport={{ once: true }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                justifyContent: "center",
                              }}
                            >
                              <Star
                                sx={{
                                  color: audience.color,
                                  fontSize: 16,
                                  mr: 1,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "rgba(255, 255, 255, 0.8)",
                                  fontWeight: 500,
                                }}
                              >
                                {benefit}
                              </Typography>
                            </Box>
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>

                    {/* Decorative elements */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: `linear-gradient(45deg, ${audience.color}30, ${audience.color}50)`,
                        opacity: 0.6,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 20,
                        left: 20,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: `linear-gradient(45deg, ${audience.color}50, ${audience.color}70)`,
                        opacity: 0.4,
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 6,
                fontWeight: 600,
                color: "white",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              הצטרפו לקהילה הגדלה שלנו
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {[
                { icon: <Favorite />, number: "50K+", label: "משתמשים פעילים", color: "#f093fb" },
                { icon: <Star />, number: "4.9", label: "דירוג ממוצע", color: "#00d4ff" },
                { icon: <TrendingUp />, number: "99%", label: "שביעות רצון", color: "#667eea" },
              ].map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "20px",
                        p: 4,
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                      }}
                    >
                      <Box sx={{ color: stat.color, mb: 2 }}>{stat.icon}</Box>
                      <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default TargetAudience
