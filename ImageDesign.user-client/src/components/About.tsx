import React from 'react';
import { Card, CardContent, Typography, Grid, Icon } from '@mui/material';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';

const AboutUs: React.FC = () => {
  return (
    <Card style={{ maxWidth: 800, margin: 'auto', marginTop: 20, padding: 20 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Icon>
              <PhotoAlbumIcon style={{ fontSize: 40 }} />
            </Icon>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="div">
              אודות האתר שלנו
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body1" color="textSecondary" paragraph>
          האפליקציה נועדה לאפשר למשתמשים לנהל אלבומי תמונות בצורה נוחה ואינטואיטיבית. היא תאפשר העלאת תמונות, ארגון באלבומים, שיתוף עם אחרים וגיבוי אוטומטי בענן. המטרה היא לפשט את ניהול התמונות האישיות ולהפוך את החוויה למהנה יותר.
        </Typography>
        <Typography variant="h6" component="div">
          קהל היעד
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          קהל היעד העיקרי של האפליקציה הוא אמהות לילדים, משפחות שרוצות לנהל את התמונות האישיות שלהן בצורה מסודרת, וחברות קטנות שצריכות לנהל גלריות תמונות לפרויקטים.
        </Typography>
        <Typography variant="h6" component="div">
          פונקציונליות של המערכת
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <ul>
            <li>העלאת תמונות לענן.</li>
            <li>יצירת אלבומים וארגון תמונות בתוכם.</li>
            <li>שיתוף אלבומים עם משתמשים אחרים.</li>
            <li>חיפוש תמונות לפי תגיות או תאריכים.</li>
            <li>גיבוי אוטומטי של תמונות.</li>
            <li>יצירת קולאזים.</li>
          </ul>
        </Typography>
        <Typography variant="h6" component="div">
          בעיות שהמערכת פותרת
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          האפליקציה פותרת את הבעיה של ניהול תמונות מבולגן ומפוזר בין מכשירים שונים. היא מאפשרת גישה נוחה לכל התמונות ממקום אחד, מבטיחה גיבוי אוטומטי כדי למנוע אובדן תמונות, ומאפשרת שיתוף קל עם אחרים.
        </Typography>
        <Typography variant="h6" component="div">
          טכנולוגית בשימוש
        </Typography>
        <Typography variant="body1" color="textSecondary">
          <ul>
            <li>צד שרת (Backend): NET 9. לבניית ה-API.</li>
            <li>צד לקוח (Frontend): React.js לבניית ממשק משתמש אינטראקטיבי.</li>
            <li>מסד נתונים MYSQL לאחסון נתונים של משתמשים ותמונות.</li>
            <li>אחסון קבצים: שימוש ב-Amazon S3 לאחסון תמונות.</li>
          </ul>
        </Typography>
        <Typography variant="h6" component="div">
          נוצר בשנת 2025
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AboutUs;