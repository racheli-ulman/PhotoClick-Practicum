import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  Box,
  Typography,
  Button,
  Container,
  useTheme
} from '@mui/material';

const images: string[] = [
  '/images/11.jpg',
  '/images/12.jpg',
  '/images/13.jpg',
  '/images/14.jpg'
];

const Hero: React.FC = () => {
  const theme = useTheme();
  const [currentImage, setCurrentImage] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000); // שינוי תמונה כל 4 שניות
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '375px', // שינוי גובה ל-75% מהגובה המקורי
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        overflow: 'hidden',
      }}
    >
      {/* רקע מתחלף */}
      {images.map((image, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            opacity: currentImage === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />
      ))}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            נהלו את התמונות שלכם בקלות
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            אפליקציה פשוטה ונוחה לניהול, ארגון ושיתוף התמונות האישיות שלכם. שמרו את הרגעים החשובים במקום אחד מאובטח.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#c46868', // צבע הכפתור
              color: 'white', // צבע הטקסט
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[8],
                backgroundColor: '#c46868', // צבע הכפתור בעת hover (אופציונלי)
              },
              transition: 'all 0.3s ease',
            }}
            component={Link}
            to="/register">
            הרשמו והתחילו
          </Button>

        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
