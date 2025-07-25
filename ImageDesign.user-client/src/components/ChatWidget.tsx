"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Paper,
  Slide,
  Fade,
  Chip,
  //   useTheme,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import SendIcon from "@mui/icons-material/Send"
import ImageIcon from "@mui/icons-material/Image"
import PersonIcon from "@mui/icons-material/Person"

interface ChatComponentProps {
  onClose?: () => void // אופציונלי אם הקומפוננטה לא תמיד נסגרת מבחוץ
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onClose }) => {
  //   const theme = useTheme()

  const [input, setInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const baseURL = import.meta.env.VITE_API_URL

  // נושאים מוצעים לשיחות על תמונות
  const suggestedTopics = [
    "פורמטים של קבצי תמונה",
    "עריכת תמונות בסיסית",
    "המלצות לתוכנות עריכה",
    "היסטוריה של הצילום",
    "טכניקות צילום",
  ]

  // הרחבת הצ'אט לאחר השהייה קצרה (אם צריך אפקט פתיחה)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // גלילה לתחתית כאשר ההודעות משתנות
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (input.trim() === "" || status === "loading") return

    setStatus("loading")
    setMessages([...messages, { sender: "user", text: input }])
    setInput("")

    try {
      const response = await axios.post(`${baseURL}/Chat`, {
        Question: input,
      })
      const botResponse = response.data?.choices?.[0]?.message?.content || "אני מצטער, קרתה שגיאה."
      setMessages([
        ...messages,
        { sender: "user", text: input },
        { sender: "bot", text: botResponse }
      ])
      setStatus("idle")

      speakText(botResponse) // 🗣️ השמעת תשובת הבוט


    } catch (error) {
      console.error("שגיאה בעת שליחת השאלה:", error)
      setMessages([
        ...messages,
        { sender: "user", text: input },
        { sender: "bot", text: "אני מצטער, הייתה לי בעיה לענות על השאלה הזו." },
      ])
      setStatus("error")
    } finally {
      setStatus("idle")
    }
  }







const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "he-IL" // עברית

    window.speechSynthesis.cancel() // עצור כל דיבור קודם
    window.speechSynthesis.speak(utterance) // דבר את הטקסט החדש
  } else {
    console.warn("Speech Synthesis לא נתמך בדפדפן זה")
  }
}










  const handleTopicClick = (topic: string) => {
    setInput(topic)
    handleSend()
  }

  const handleClose = () => {
    setIsExpanded(false)
    setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, 300)
  }

  // טיפול במקש Enter עם או בלי Shift
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // אם נלחץ Shift+Enter, פשוט מוסיפים ירידת שורה (ברירת המחדל)
        return
      } else {
        // אם נלחץ רק Enter, שולחים את ההודעה ומונעים ירידת שורה
        e.preventDefault()
        handleSend()
      }
    }
  }

  return (
    <Slide direction="up" in={true} mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 350,
          height: isExpanded ? 450 : 0,
          borderRadius: 3,
          overflow: "hidden",
          transition: "height 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
          direction: "rtl",
          zIndex: 1000,
        }}
      >
        {/* כותרת הצ'אט */}
        <Box
          sx={{
            p: 2,
            background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ImageIcon sx={{ color: "#ffffff", ml: 1 }} />
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: "bold" }}>
              שיחה עם מומחה תמונות
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="caption" sx={{ color: "#ffffff", ml: 1 }}>
              עוזר תמונות אישי
            </Typography>
            <IconButton onClick={handleClose} size="small" sx={{ color: "#ffffff" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* הודעות הצ'אט */}
        <Fade in={isExpanded}>
          <Box
            sx={{
              flexGrow: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              bgcolor: "#f5f5f5",
            }}
          >
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    p: 3,
                    borderRadius: 2,
                    width: "100%",
                    mb: 2,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="body1" align="center" sx={{ color: "rgb(234, 102, 203)", mb: 2 }}>
                    שלום! אני כאן כדי לעזור לך בכל הנוגע לתמונות.
                  </Typography>
                  <Typography variant="body2" align="center" sx={{ color: "#666", mb: 3 }}>
                    שאל/י אותי כל שאלה על תמונות, עריכה, פורמטים ועוד, או נסה/י אחד מהנושאים האלה:
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                    {suggestedTopics.map((topic, index) => (
                      <Chip
                        key={index}
                        label={topic}
                        onClick={() => handleTopicClick(topic)}
                        sx={{
                          background: "linear-gradient(45deg, #f093fb, #00d4ff)",
                          color: "#fff",
                          "&:hover": {
                            background: "linear-gradient(45deg, rgb(189, 132, 246), rgb(234, 102, 203))",
                            transform: "scale(1.05)",
                          },
                          fontSize: "0.75rem",
                          mb: 1,
                          transition: "all 0.2s ease",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            ) : (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-start" : "flex-end",
                    mb: 1,
                  }}
                >
                  {msg.sender === "user" && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(240, 147, 251, 0.2))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ml: 1,
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 16, color: "#00d4ff" }} />
                    </Box>
                  )}

                  <Box
                    sx={{
                      maxWidth: "75%",
                      p: 1.5,
                      bgcolor:
                        msg.sender === "user"
                          ? "rgba(0, 212, 255, 0.1)"
                          : "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                      color: msg.sender === "user" ? "#333" : "#1a1a1a", // שינוי מ-#fff ל-#1a1a1a
                      borderRadius: msg.sender === "user" ? "18px 18px 18px 4px" : "18px 18px 4px 18px",
                      position: "relative",
                      whiteSpace: "pre-wrap",
                      border: msg.sender === "user" ? "1px solid rgba(0, 212, 255, 0.3)" : "none",
                    }}
                  >
                    {msg.sender !== "user" && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#2d2d2d", fontWeight: "bold", display: "block", mb: 0.5 }} // שינוי מ-#e0e0e0 ל-#2d2d2d
                      >
                        מומחה תמונות
                      </Typography>
                    )}
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>

                  {msg.sender !== "user" && (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "linear-gradient(45deg, #f093fb, #00d4ff)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 16, color: "#fff" }} />
                    </Box>
                  )}
                </Box>
              ))
            )}

            {status === "loading" && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(45deg, #f093fb, #00d4ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 1,
                  }}
                >
                  <ImageIcon sx={{ fontSize: 16, color: "#fff" }} />
                </Box>
                <Box
                  sx={{
                    p: 2,
                    background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
                    borderRadius: "18px 18px 4px 18px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>
        </Fade>

        {/* אזור הקלט */}
        <Box
          sx={{
            display: "flex",
            p: 2,
            borderTop: "1px solid #e0e0e0",
            background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246))",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSend}
            sx={{
              mr: 1,
              minWidth: "unset",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "#ffffff",
              color: "rgb(234, 102, 203)",
              "&:hover": {
                bgcolor: "#f8f9fa",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <SendIcon fontSize="small" />
          </Button>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="...הקלד/י הודעה"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                backgroundColor: "#ffffff",
                color: "#333",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.8)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffffff",
                },
              },
              "& .MuiInputBase-input": {
                "&::placeholder": {
                  color: "rgba(234, 102, 203, 0.7)",
                  opacity: 1,
                },
              },
            }}
            inputProps={{
              style: { color: "#333", textAlign: "right" },
            }}
          />
        </Box>
      </Paper>
    </Slide>
  )
}

export default ChatComponent
