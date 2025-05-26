// "use client"

// import type React from "react"
// import { motion } from "framer-motion"
// import { Box, Container, Typography, Link, Grid, IconButton, Divider } from "@mui/material"
// import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn, PhotoLibrary } from "@mui/icons-material"

// interface FooterProps {
//   companyName?: string
//   year?: number
// }

// const Footer: React.FC<FooterProps> = ({ companyName = "פוטו-קליק", year = 2025 }) => {
//   const footerLinks = [
//     { label: "צור קשר", href: "#contact" },
//     { label: "עזרה ותמיכה", href: "#support" },
//     { label: "מדיניות פרטיות", href: "#privacy" },
//     { label: "תנאי שימוש", href: "#terms" },
//     { label: "אודותינו", href: "#about" },
//     { label: "קריירה", href: "#careers" },
//   ]

//   const socialLinks = [
//     { icon: <Facebook />, href: "#facebook", color: "#1877f2" },
//     { icon: <Instagram />, href: "#instagram", color: "#e4405f" },
//     { icon: <Twitter />, href: "#twitter", color: "#1da1f2" },
//     { icon: <LinkedIn />, href: "#linkedin", color: "#0077b5" },
//   ]

//   const contactInfo = [
//     { icon: <Email />, text: "info@photo-click.com", color: "#667eea" },
//     { icon: <Phone />, text: "03-1234567", color: "#764ba2" },
//     { icon: <LocationOn />, text: "תל אביב, ישראל", color: "#f093fb" },
//   ]

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//         delayChildren: 0.2,
//       },
//     },
//   }

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//       },
//     },
//   }

//   return (
//     <Box
//       component="footer"
//       sx={{
//         background: "linear-gradient(135deg, #2c3e50, #34495e, #2c3e50)",
//         color: "white",
//         position: "relative",
//         overflow: "hidden",
//         "&::before": {
//           content: '""',
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background:
//             "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1), rgba(240, 147, 251, 0.1))",
//           backgroundSize: "400% 400%",
//           animation: "gradientShift 20s ease infinite",
//         },
//         "@keyframes gradientShift": {
//           "0%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//           "100%": { backgroundPosition: "0% 50%" },
//         },
//       }}
//     >
//       {/* Floating Background Elements */}
//       <motion.div
//         style={{
//           position: "absolute",
//           top: "20%",
//           left: "10%",
//           width: 100,
//           height: 100,
//           background: "linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
//           borderRadius: "50%",
//           filter: "blur(30px)",
//         }}
//         animate={{
//           x: [0, 30, 0],
//           y: [0, -20, 0],
//         }}
//         transition={{
//           duration: 8,
//           repeat: Number.POSITIVE_INFINITY,
//           ease: "easeInOut",
//         }}
//       />

//       <motion.div
//         style={{
//           position: "absolute",
//           bottom: "30%",
//           right: "15%",
//           width: 80,
//           height: 80,
//           background: "linear-gradient(45deg, rgba(240, 147, 251, 0.1), rgba(0, 212, 255, 0.1))",
//           borderRadius: "30px",
//           filter: "blur(25px)",
//         }}
//         animate={{
//           rotate: [0, 180, 360],
//           scale: [1, 1.1, 1],
//         }}
//         transition={{
//           duration: 12,
//           repeat: Number.POSITIVE_INFINITY,
//           ease: "easeInOut",
//         }}
//       />

//       <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.3 }}
//         >
//           <Box sx={{ py: 6 }}>
//             <Grid container spacing={4}>
//               {/* Company Info */}
//               <Grid item xs={12} md={4}>
//                 <motion.div variants={itemVariants}>
//                   <Box sx={{ mb: 4 }}>
//                     <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//                       <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
//                         <Box
//                           sx={{
//                             width: 60,
//                             height: 60,
//                             borderRadius: "50%",
//                             background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             marginRight: 2,
//                             boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
//                           }}
//                         >
//                           <PhotoLibrary sx={{ color: "white", fontSize: 30 }} />
//                         </Box>
//                       </motion.div>
//                       <Typography
//                         variant="h4"
//                         component="div"
//                         sx={{
//                           fontWeight: "bold",
//                           background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
//                           backgroundClip: "text",
//                           WebkitBackgroundClip: "text",
//                           WebkitTextFillColor: "transparent",
//                         }}
//                       >
//                         {companyName}
//                       </Typography>
//                     </Box>
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         color: "rgba(255, 255, 255, 0.8)",
//                         lineHeight: 1.6,
//                         mb: 3,
//                       }}
//                     >
//                       הפלטפורמה המובילה לניהול ושיתוף תמונות עם טכנולוגיה מתקדמת וחוויית משתמש מעולה.
//                     </Typography>

//                     {/* Contact Info */}
//                     <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                       {contactInfo.map((contact, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ opacity: 0, x: -20 }}
//                           whileInView={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.1, duration: 0.6 }}
//                           viewport={{ once: true }}
//                         >
//                           <Box sx={{ display: "flex", alignItems: "center" }}>
//                             <Box
//                               sx={{
//                                 color: contact.color,
//                                 mr: 2,
//                                 p: 1,
//                                 borderRadius: "8px",
//                                 background: `${contact.color}20`,
//                               }}
//                             >
//                               {contact.icon}
//                             </Box>
//                             <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
//                               {contact.text}
//                             </Typography>
//                           </Box>
//                         </motion.div>
//                       ))}
//                     </Box>
//                   </Box>
//                 </motion.div>
//               </Grid>

//               {/* Quick Links */}
//               <Grid item xs={12} md={4}>
//                 <motion.div variants={itemVariants}>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 3,
//                       color: "white",
//                     }}
//                   >
//                     קישורים מהירים
//                   </Typography>
//                   <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
//                     {footerLinks.map((link, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, x: -20 }}
//                         whileInView={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.1, duration: 0.6 }}
//                         viewport={{ once: true }}
//                         whileHover={{ x: 5 }}
//                       >
//                         <Link
//                           href={link.href}
//                           sx={{
//                             color: "rgba(255, 255, 255, 0.7)",
//                             textDecoration: "none",
//                             fontSize: "0.95rem",
//                             fontWeight: 400,
//                             py: 0.5,
//                             display: "block",
//                             transition: "all 0.3s ease",
//                             "&:hover": {
//                               color: "#667eea",
//                               textDecoration: "none",
//                             },
//                           }}
//                         >
//                           {link.label}
//                         </Link>
//                       </motion.div>
//                     ))}
//                   </Box>
//                 </motion.div>
//               </Grid>

//               {/* Social Media & Newsletter */}
//               <Grid item xs={12} md={4}>
//                 <motion.div variants={itemVariants}>
//                   <Typography
//                     variant="h6"
//                     sx={{
//                       fontWeight: 600,
//                       mb: 3,
//                       color: "white",
//                     }}
//                   >
//                     עקבו אחרינו
//                   </Typography>
//                   <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
//                     {socialLinks.map((social, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         whileInView={{ opacity: 1, scale: 1 }}
//                         transition={{ delay: index * 0.1, duration: 0.6 }}
//                         viewport={{ once: true }}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                       >
//                         <IconButton
//                           href={social.href}
//                           sx={{
//                             color: "white",
//                             background: `${social.color}20`,
//                             border: `1px solid ${social.color}40`,
//                             "&:hover": {
//                               background: social.color,
//                               transform: "translateY(-2px)",
//                               boxShadow: `0 8px 25px ${social.color}40`,
//                             },
//                             transition: "all 0.3s ease",
//                           }}
//                         >
//                           {social.icon}
//                         </IconButton>
//                       </motion.div>
//                     ))}
//                   </Box>

//                   <Typography
//                     variant="body2"
//                     sx={{
//                       color: "rgba(255, 255, 255, 0.8)",
//                       lineHeight: 1.6,
//                     }}
//                   >
//                     הישארו מעודכנים עם החדשות והעדכונים האחרונים שלנו ברשתות החברתיות.
//                   </Typography>
//                 </motion.div>
//               </Grid>
//             </Grid>

//             <Divider
//               sx={{
//                 my: 4,
//                 borderColor: "rgba(255, 255, 255, 0.1)",
//                 background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
//                 height: "1px",
//                 border: "none",
//               }}
//             />

//             {/* Copyright */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5, duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   flexWrap: "wrap",
//                   gap: 2,
//                 }}
//               >
//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "rgba(255, 255, 255, 0.6)",
//                     fontWeight: 300,
//                   }}
//                 >
//                   © {year} {companyName}. כל הזכויות שמורות.
//                 </Typography>

//                 <Typography
//                   variant="body2"
//                   sx={{
//                     color: "rgba(255, 255, 255, 0.6)",
//                     fontWeight: 300,
//                   }}
//                 >
//                   נבנה באהבה עם טכנולוגיות מתקדמות 💜
//                 </Typography>
//               </Box>
//             </motion.div>
//           </Box>
//         </motion.div>
//       </Container>
//     </Box>
//   )
// }

// export default Footer


"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Box, Container, Typography, Link, Grid, IconButton, Divider } from "@mui/material"
import { Facebook, Twitter, Instagram, LinkedIn, Email, Phone, LocationOn, PhotoLibrary } from "@mui/icons-material"

interface FooterProps {
  companyName?: string
  year?: number
}

const Footer: React.FC<FooterProps> = ({ companyName = "פוטו-קליק", year = 2025 }) => {
  const footerLinks = [
    { label: "צור קשר", href: "#contact" },
    { label: "עזרה ותמיכה", href: "#support" },
    { label: "מדיניות פרטיות", href: "#privacy" },
    { label: "תנאי שימוש", href: "#terms" },
    { label: "אודותינו", href: "#about" },
    { label: "קריירה", href: "#careers" },
  ]

  const socialLinks = [
    { icon: <Facebook />, href: "#facebook", color: "#1877f2" },
    { icon: <Instagram />, href: "#instagram", color: "#e4405f" },
    { icon: <Twitter />, href: "#twitter", color: "#1da1f2" },
    { icon: <LinkedIn />, href: "#linkedin", color: "#0077b5" },
  ]

  const contactInfo = [
    { icon: <Email />, text: "info@photo-click.com" },
    { icon: <Phone />, text: "03-1234567" },
    { icon: <LocationOn />, text: "תל אביב, ישראל" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        borderTop: "1px solid #e2e8f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(162, 75, 156, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Box sx={{ py: 6 }}>
            <Grid container spacing={5}>
              {/* Company Info */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "12px",
                          background: "rgba(255, 255, 255, 0.9)",
                          border: "2px solid transparent",
                          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), linear-gradient(45deg, rgb(102, 126, 234), rgb(162, 75, 156))",
                          backgroundOrigin: "border-box",
                          backgroundClip: "content-box, border-box",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 2,
                          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.15)",
                        }}
                      >
                        <PhotoLibrary sx={{ color: "rgb(102, 126, 234)", fontSize: 24 }} />
                      </Box>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{
                          fontWeight: 700,
                          color: "#1e293b",
                          letterSpacing: "-0.025em",
                        }}
                      >
                        {companyName}
                      </Typography>
                    </Box>
                    
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.6,
                        mb: 4,
                        fontSize: "0.95rem",
                      }}
                    >
                      הפלטפורמה המובילה לניהול ושיתוף תמונות עם טכנולוגיה מתקדמת וחוויית משתמש מעולה.
                    </Typography>

                    {/* Contact Info */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                      {contactInfo.map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.6 }}
                          viewport={{ once: true }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                color: "#667eea",
                                mr: 3,
                                p: 1.5,
                                borderRadius: "10px",
                                background: "rgba(102, 126, 234, 0.08)",
                              }}
                            >
                              {contact.icon}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: "#475569",
                                fontWeight: 500,
                              }}
                            >
                              {contact.text}
                            </Typography>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      color: "#1e293b",
                      fontSize: "1.1rem",
                    }}
                  >
                    קישורים מהירים
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {footerLinks.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 3 }}
                      >
                        <Link
                          href={link.href}
                          sx={{
                            color: "#64748b",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            py: 0.5,
                            display: "block",
                            transition: "all 0.3s ease",
                            borderRadius: "6px",
                            px: 1,
                            mx: -1,
                            "&:hover": {
                              color: "#667eea",
                              textDecoration: "none",
                              background: "rgba(102, 126, 234, 0.05)",
                            },
                          }}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Grid>

              {/* Social Media */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      color: "#1e293b",
                      fontSize: "1.1rem",
                    }}
                  >
                    עקבו אחרינו
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconButton
                          href={social.href}
                          sx={{
                            width: 44,
                            height: 44,
                            color: "#64748b",
                            background: "rgba(255, 255, 255, 0.8)",
                            border: "1px solid #e2e8f0",
                            backdropFilter: "blur(10px)",
                            "&:hover": {
                              color: social.color,
                              background: "rgba(255, 255, 255, 1)",
                              borderColor: `${social.color}30`,
                              boxShadow: `0 4px 20px ${social.color}20`,
                            },
                            transition: "all 0.3s ease",
                          }}
                        >
                          {social.icon}
                        </IconButton>
                      </motion.div>
                    ))}
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      lineHeight: 1.6,
                      fontSize: "0.9rem",
                    }}
                  >
                    הישארו מעודכנים עם החדשות והעדכונים האחרונים שלנו ברשתות החברתיות.
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>

            <Divider
              sx={{
                my: 5,
                borderColor: "#e2e8f0",
                background: "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
                height: "1px",
                border: "none",
              }}
            />

            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  © {year} {companyName}. כל הזכויות שמורות.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#94a3b8",
                    fontWeight: 400,
                    fontSize: "0.85rem",
                  }}
                >
                  נבנה באהבה עם טכנולוגיות מתקדמות ✨
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Footer
