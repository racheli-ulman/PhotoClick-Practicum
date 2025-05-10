import React, { JSX } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  useTheme 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
}

const features: Feature[] = [
  {
    title: 'אלבומים מאורגנים',
    description: 'צרו וארגנו אלבומים לפי נושאים, אירועים או כל דרך שתבחרו.',
    icon: <PhotoAlbumIcon fontSize="large" />,
  },
  {
    title: 'גיבוי אוטומטי',
    description: 'לעולם לא תאבדו תמונות חשובות עם הגיבוי האוטומטי שלנו בענן.',
    icon: <CloudUploadIcon fontSize="large" />,
  },
  {
    title: 'חיפוש חכם',
     description: 'מצאו כל תקיה במהירות עם חיפוש לפי שם',

    // description: 'מצאו כל תמונה במהירות עם חיפוש לפי תגיות, תאריכים או טקסט חופשי.',
    icon: <SearchIcon fontSize="large" />,
  },
  {
    title: 'שיתוף קל',
    description: 'שתפו אלבומים ותמונות עם משפחה וחברים בלחיצת כפתור.',
    icon: <ShareIcon fontSize="large" />,
  },
  {
    title: 'עריכה מתקדמת',
    description: 'ערכו תמונות ישירות באפליקציה עם כלי עריכה ידידותיים למשתמש.',
    icon: <EditIcon fontSize="large" />,
  },
  {
    title: 'יצירת קולאז׳ים',
    description: 'צרו קולאז׳ים מרהיבים מהתמונות האהובות עליכם במגוון סגנונות.',
    icon: <CollectionsIcon fontSize="large" />,
  },
];

const Features: React.FC = () => {
  const theme = useTheme();

  return (
    <Box component="section" id="features" sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          תכונות מרכזיות
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box sx={{ color: '#c46868', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
