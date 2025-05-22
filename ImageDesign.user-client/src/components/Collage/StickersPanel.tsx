"use client"

import type React from "react"
import { Box, Typography, Grid, Paper, Tooltip } from "@mui/material"

interface StickersPanelProps {
  onAddSticker: (stickerUrl: string) => void
}

export const StickersPanel: React.FC<StickersPanelProps> = ({ onAddSticker }) => {
  // Sample sticker URLs - in a real app, these would come from an API or database
  const stickers = [
    {
      id: "emoji-smile",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f604.png",
      name: "חיוך",
    },
    {
      id: "emoji-heart",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png",
      name: "לב",
    },
    {
      id: "emoji-star",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2b50.png",
      name: "כוכב",
    },
    {
      id: "emoji-party",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f389.png",
      name: "מסיבה",
    },
    {
      id: "emoji-cake",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f382.png",
      name: "עוגה",
    },
    {
      id: "emoji-balloon",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f388.png",
      name: "בלון",
    },
    {
      id: "emoji-gift",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f381.png",
      name: "מתנה",
    },
    {
      id: "emoji-camera",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4f7.png",
      name: "מצלמה",
    },
    {
      id: "emoji-sun",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2600.png",
      name: "שמש",
    },
    {
      id: "emoji-rainbow",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f308.png",
      name: "קשת",
    },
    {
      id: "emoji-crown",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f451.png",
      name: "כתר",
    },
    {
      id: "emoji-sparkles",
      url: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2728.png",
      name: "נצנוצים",
    },
  ]

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        הוסף מדבקות
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {stickers.map((sticker) => (
          <Grid item xs={4} sm={3} key={sticker.id}>
            <Tooltip title={sticker.name}>
              <Paper
                elevation={2}
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                  height: "60px",
                }}
                onClick={() => onAddSticker(sticker.url)}
              >
                <img
                  src={sticker.url || "/placeholder.svg"}
                  alt={sticker.name}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </Paper>
            </Tooltip>
          </Grid>
        ))}
      </Grid>

      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
        לחץ על מדבקה כדי לבחור אותה, ואז לחץ על הקולאז' כדי למקם אותה. לאחר הוספה, תוכל לשנות את גודלה ומיקומה.
      </Typography>
    </Box>
  )
}
