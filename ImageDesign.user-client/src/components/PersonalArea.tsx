import React, { useState } from "react";
import { 
  Button, 
  IconButton, 
  Tooltip, 
  Box,
  Typography,
  Divider,
//   Paper,
  useTheme
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import UserPhotosDialog from "./Collage/UserPhotos";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';

const PersonalArea: React.FC = () => {
    const theme = useTheme();
    const [openCollageDialog, setOpenCollageDialog] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // פונקציה לבדיקה אם כפתור פעיל כעת (נמצאים בנתיב שלו)
    const isActive = (path: string) => {
        return location.pathname.includes(path);
    };

    // מידע על פריטי התפריט
    const menuItems = [
        {
            title: "העלאת תמונה לאלבום שלי",
            description: "העלה תמונות חדשות לאלבומים שלך",
            icon: <UploadFileIcon sx={{ color: theme.palette.primary.main }} />,
            onClick: () => navigate(`/personal-area/add-photo`),
            path: "add-photo"
        },
        {
            title: "צור קולאז' מתמונות האלבומים שלך",
            description: "יצירת קולאז' מותאם אישית",
            icon: <PhotoLibraryIcon sx={{ color: theme.palette.success.main }} />,
            onClick: () => setOpenCollageDialog(true),
            path: "collage"
        },
        {
            title: "האלבומים שלי",
            description: "צפה וערוך את האלבומים שלך",
            icon: <PhotoAlbumIcon sx={{ color: theme.palette.warning.main }} />,
            onClick: () => navigate(`/personal-area/userAlbums`),
            path: "userAlbums"
        },
        {
            title: "סל המחזור",
            description: "נהל תמונות שנמחקו",
            icon: <DeleteForeverIcon sx={{ color: theme.palette.error.main }} />,
            onClick: () => navigate(`/personal-area/tin-photo`),
            path: "tin-photo"
        }
    ];

    return (
        <div style={{ 
            display: 'flex', 
            padding: '16px', 
            overflow: 'hidden', 
            minHeight: 'calc(100vh - 130px)',
        }}>
            {/* סיידבר */}
            <div style={{
                width: sidebarOpen ? '280px' : '80px',
                height: 'calc(95vh - 120px)',
                position: 'fixed',
                right: '24px', // קיבוע הסיידבר בצד ימין
                top: '90px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                transition: 'width 0.3s ease-in-out',
                zIndex: 10
            }}>
                {/* כותרת הסיידבר */}
                <Box sx={{ 
                    p: sidebarOpen ? 2.5 : 1.5,
                  background: "linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)",
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarOpen ? 'space-between' : 'center'
                }}>
                    {sidebarOpen && (
                        <Typography variant="h6" fontWeight="bold">
                            אזור אישי
                        </Typography>
                    )}
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {!sidebarOpen && (
                            <PersonIcon sx={{ fontSize: 24, mb: 1 }} />
                        )}
                        <IconButton
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            size="small"
                            sx={{
                                color: 'white',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                }
                            }}
                        >
                            {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </Box>
                </Box>

                <Divider />

                {/* רשימת פריטי התפריט */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    p: 2,
                    gap: 1.5,
                    flexGrow: 1,
                    overflowY: 'auto'
                }}>
                    {menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        
                        return sidebarOpen ? (
                            // גרסה מורחבת של הכפתור
                            <Button
                                key={index}
                                variant="text"
                                onClick={item.onClick}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: active ? `${theme.palette.primary.light}20` : 'transparent',
                                    color: active ? theme.palette.primary.main : 'text.primary',
                                    textAlign: 'right',
                                    transition: 'all 0.2s ease',
                                    width: '100%',
                                    textTransform: 'none',
                                    '&:hover': {
                                        bgcolor: active 
                                            ? `${theme.palette.primary.light}30` 
                                            : 'rgba(0, 0, 0, 0.04)'
                                    },
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': active ? {
                                        content: '""',
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                        width: 4,
                                        height: '100%',
                                        bgcolor: theme.palette.primary.main,
                                        borderRadius: '0 4px 4px 0'
                                    } : {}
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    width: '100%',
                                    mb: 0.5
                                }}>
                                    <Box
                                        sx={{
                                            mr: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: active 
                                                ? `${theme.palette.primary.main}20` 
                                                : 'rgba(0, 0, 0, 0.04)',
                                        }}
                                    >
                                        {React.cloneElement(item.icon, { 
                                            sx: { fontSize: 22 } 
                                        })}
                                    </Box>
                                    <Typography 
                                        variant="subtitle1" 
                                        fontWeight={active ? 'bold' : 'medium'}
                                        sx={{ flexGrow: 1, textAlign: 'right' }}
                                    >
                                        {item.title}
                                    </Typography>
                                </Box>
                                
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ 
                                        opacity: 0.8,
                                        width: '100%',
                                        textAlign: 'right',
                                        pr: 7
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </Button>
                        ) : (
                            // גרסה מוקטנת (אייקון בלבד)
                            <Tooltip
                                key={index}
                                title={item.title}
                                placement="left"
                                arrow
                            >
                                <IconButton
                                    onClick={item.onClick}
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        color: active ? theme.palette.primary.main : 'text.secondary',
                                        bgcolor: active ? `${theme.palette.primary.light}20` : 'transparent',
                                        '&:hover': {
                                            bgcolor: active 
                                                ? `${theme.palette.primary.light}30` 
                                                : 'rgba(0, 0, 0, 0.04)'
                                        },
                                        position: 'relative',
                                        mx: 'auto',
                                        '&::before': active ? {
                                            content: '""',
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            width: 3,
                                            height: '100%',
                                            bgcolor: theme.palette.primary.main
                                        } : {}
                                    }}
                                >
                                    {item.icon}
                                </IconButton>
                            </Tooltip>
                        );
                    })}
                </Box>
                
                {/* רווח נוסף בתחתית */}
                <Box sx={{ p: 2 }}></Box>
            </div>

            {/* תוכן ראשי */}
            <div style={{ 
                flex: 1, 
                marginRight: sidebarOpen ? '310px' : '110px',
                transition: 'margin-right 0.3s ease',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                minHeight: 'calc(100vh - 160px)'
            }}>
                <Outlet />
            </div>

            {/* דיאלוג יצירת קולאז' */}
            <UserPhotosDialog
                open={openCollageDialog}
                onClose={() => setOpenCollageDialog(false)}
            />
        </div>
    );
}

export default PersonalArea;