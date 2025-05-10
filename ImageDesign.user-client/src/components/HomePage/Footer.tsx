import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  List, 
  ListItem,
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface FooterProps {
  companyName?: string;
  year?: number;
}

// Styled component for footer links
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 400,
  marginLeft: '1rem',
  marginRight: '1rem',
  '&:hover': {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
  },
}));

const Footer: React.FC<FooterProps> = ({ 
  companyName = "פוטו-קליק", 
  year = 2025 
}) => {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        width: '100%', 
        bgcolor: '#737373', // כחול
        color: theme.palette.primary.contrastText, 
        py: 3,
        mt: 'auto' // מיקום בתחתית האתר במקרה של תוכן קצר
      }}
      dir="rtl"
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <List sx={{ display: 'flex', justifyContent: 'center', p: 0 }}>
            <ListItem sx={{ width: 'auto', p: 1 }}>
              <FooterLink href="#">צור קשר</FooterLink>
            </ListItem>
            <ListItem sx={{ width: 'auto', p: 1 }}>
              <FooterLink href="#">עזרה ותמיכה</FooterLink>
            </ListItem>
            <ListItem sx={{ width: 'auto', p: 1 }}>
              <FooterLink href="#">מדיניות פרטיות</FooterLink>
            </ListItem>
            <ListItem sx={{ width: 'auto', p: 1 }}>
              <FooterLink href="#">תנאי שימוש</FooterLink>
            </ListItem>
          </List>
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 300 }}>
            © {year} {companyName}. כל הזכויות שמורות.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;