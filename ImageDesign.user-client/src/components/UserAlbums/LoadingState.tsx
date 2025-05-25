import type React from "react"
import { Box } from "@mui/material"

const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        background: "white",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }
          
          @keyframes colorShift {
            0% { 
              background: linear-gradient(45deg, #00e5ff, #ff4081, #00e5ff);
            }
            33% { 
              background: linear-gradient(45deg, #ff4081, #e91e63, #00e5ff);
            }
            66% { 
              background: linear-gradient(45deg, #00bcd4, #00e5ff, #ff4081);
            }
            100% { 
              background: linear-gradient(45deg, #00e5ff, #ff4081, #00e5ff);
            }
          }
        `}
      </style>

      {/* Main spinning circle */}
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(45deg, #00e5ff, #ff4081, #00bcd4, #e91e63)",
          backgroundSize: "400% 400%",
          animation: "spin 2s linear infinite, colorShift 4s ease-in-out infinite",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 0 30px rgba(0, 229, 255, 0.4), 0 0 60px rgba(255, 64, 129, 0.3)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "10px",
            borderRadius: "50%",
            background: "white",
            animation: "pulse 2s ease-in-out infinite",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            bottom: "20px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, rgba(0, 229, 255, 0.1), rgba(255, 64, 129, 0.1))",
            animation: "spin 3s linear infinite reverse",
          },
        }}
      />

      {/* Orbiting dots */}
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          animation: "spin 4s linear infinite",
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              position: "absolute",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: index === 0 ? "#00e5ff" : index === 1 ? "#ff4081" : "#00bcd4",
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
              transform: `rotate(${index * 120}deg) translateX(100px) translateY(-6px)`,
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${index * 0.5}s`,
              boxShadow: `0 0 15px ${index === 0 ? "#00e5ff" : index === 1 ? "#ff4081" : "#00bcd4"}`,
            }}
          />
        ))}
      </Box>

      {/* Loading text */}
      <Box
        sx={{
          position: "absolute",
          bottom: "30%",
          textAlign: "center",
          color: "transparent",
          background: "linear-gradient(45deg, #00e5ff, #ff4081)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          fontSize: "1.5rem",
          fontWeight: "bold",
          animation: "pulse 2s ease-in-out infinite",
          textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        טוען אלבומים...
      </Box>
    </Box>
  )
}

export default LoadingState
