import React, { JSX } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Avatar,
  useTheme 
} from '@mui/material';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import BusinessIcon from '@mui/icons-material/Business';

// טיפוס עבור כל קהל יעד
interface Audience {
  title: string;
  description: string;
  icon: JSX.Element;
}

function TargetAudience() {
  const theme = useTheme();
  
  const audiences: Audience[] = [
    {
      title: 'משפחות',
      description: 'נהלו את זכרונות המשפחה שלכם במקום אחד מסודר ושתפו אותם עם קרובים.',
      icon: <FamilyRestroomIcon fontSize="large" />,
    },
    {
      title: 'אמהות',
      description: 'שמרו על רגעי הילדים היקרים מאורגנים וזמינים לשיתוף עם המשפחה המורחבת.',
      icon: <PregnantWomanIcon fontSize="large" />,
    },
    {
      title: 'עסקים קטנים',
      description: 'נהלו גלריות תמונות לפרויקטים ושתפו אותן עם לקוחות ושותפים בקלות.',
      icon: <BusinessIcon fontSize="large" />,
    },
  ];

  return (
    <Box component="section" sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          למי זה מתאים?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {audiences.map((audience, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#c46868',
                    width: 80,
                    height: 80,
                    mb: 2,
                  }}
                >
                  {audience.icon}
                </Avatar>
                <Typography variant="h5" component="h3" gutterBottom>
                  {audience.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {audience.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default TargetAudience;
