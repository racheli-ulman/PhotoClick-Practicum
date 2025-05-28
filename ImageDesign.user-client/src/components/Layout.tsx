import { AppBar, Button, Tooltip } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
// import Footer from './HomePage/Footer';
import ChatComponent from './ChatWidget';
import ChatIcon from '@mui/icons-material/Chat';
import { useState } from 'react';

const Layout = () => {

    const [isChatOpen, setIsChatOpen] = useState(false);

    // פונקציה לפתיחת הצ'אט
    const handleOpenChat = () => {
        setIsChatOpen(true);
    };

    // פונקציה לסגירת הצ'אט
    const handleCloseChat = () => {
        setIsChatOpen(false);
    };

    return (
        <div style={{ width: '100%', position: 'relative', minHeight: '100vh' }}> {/* הוספת position: 'relative' */}
            <AppBar position="static">
                <Header onOpenChat={handleOpenChat} />
            </AppBar>

            <main style={{ paddingTop: '20px' }}> {/* Adjust padding based on AppBar height */}
                <Outlet />
            </main>

            <Tooltip title="פתח צ'אט עם אורית - מומחית תחום התמונות והצילום " placement="bottom">
                <Button
                    onClick={handleOpenChat}
                    startIcon={<ChatIcon />}
                    variant="contained"
                    sx={{
                  background: "white",
                        color: 'lightblue',
                        borderRadius: '25px',
                        padding: '8px 20px',
                        fontWeight: 'bold',
                        letterSpacing: '0.5px',
                        border: '2px solid rgba(255, 111, 241, 0.3)',
                        // boxShadow: '0 4px 10px rgba(255,140,0,0.3)',
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap',
                        textTransform: 'none', // אותיות לא גדולות
                        '&:hover': {
                            background: 'linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
                            boxShadow: '0 6px 15px rgba(2, 184, 250, 0.5)',
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(1px)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        },
                        '@media (max-width: 600px)': {
                            minWidth: '48px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            '& .MuiButton-startIcon': {
                                margin: 0
                            },
                            '& .MuiButton-startIcon + span': {
                                display: 'none'
                            }
                        },
                        position: 'fixed', // מיקום קבוע
                        bottom: '10px',
                        left: '20px',
                        zIndex: 1000, // מעל תוכן אחר
                    }}
                >
                    צאט עם אורית
                </Button>
            </Tooltip>

            {isChatOpen && <ChatComponent onClose={handleCloseChat} />}

            <AppBar position="static">
                {/* <Footer></Footer> */}
            </AppBar>
        </div>
    );
};

export default Layout;