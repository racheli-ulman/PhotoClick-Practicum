"use client"
import { motion } from "framer-motion"
import { Box } from "@mui/material"
import Features from "./Features"
import Hero from "./Hero"
import TargetAudience from "./TargetAudience"
import Footer from "./Footer"

const Home = () => {
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.8,
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(45deg, rgba(102, 126, 234, 0.02), rgba(118, 75, 162, 0.02), rgba(240, 147, 251, 0.02))",
            backgroundSize: "400% 400%",
            animation: "subtleGradientShift 30s ease infinite",
            zIndex: -1,
            pointerEvents: "none",
          },
          "@keyframes subtleGradientShift": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        {/* Hero Section with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Hero />
        </motion.div>

        {/* Features Section with staggered entrance */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <Features />
        </motion.div>

        {/* Target Audience Section with slide from right */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <TargetAudience />
        </motion.div>

        {/* Footer with fade up animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
<Footer />
        </motion.div>
      </Box>
    </motion.div>
  )
}

export default Home
