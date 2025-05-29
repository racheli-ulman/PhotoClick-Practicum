// import { AppBar, Button, Tooltip } from '@mui/material';
// import { Outlet } from 'react-router-dom';
// import Header from './Header';
// // import Footer from './HomePage/Footer';
// import ChatComponent from './ChatWidget';
// import ChatIcon from '@mui/icons-material/Chat';
// import { useState } from 'react';

// const Layout = () => {

//     const [isChatOpen, setIsChatOpen] = useState(false);

//     // פונקציה לפתיחת הצ'אט
//     const handleOpenChat = () => {
//         setIsChatOpen(true);
//     };

//     // פונקציה לסגירת הצ'אט
//     const handleCloseChat = () => {
//         setIsChatOpen(false);
//     };

//     return (
//         <div style={{ width: '100%', position: 'relative', minHeight: '100vh' }}> {/* הוספת position: 'relative' */}
//             <AppBar position="static">
//                 <Header onOpenChat={handleOpenChat} />
//             </AppBar>

//             <main style={{ paddingTop: '20px' }}> {/* Adjust padding based on AppBar height */}
//                 <Outlet />
//             </main>

//             <Tooltip title="פתח צ'אט עם אורית - מומחית תחום התמונות והצילום " placement="bottom">
//                 <Button
//                     onClick={handleOpenChat}
//                     startIcon={<ChatIcon />}
//                     variant="contained"
//                     sx={{
//                   background: "white",
//                         color: 'lightblue',
//                         borderRadius: '25px',
//                         padding: '8px 20px',
//                         fontWeight: 'bold',
//                         letterSpacing: '0.5px',
//                         border: '2px solid rgba(255, 111, 241, 0.3)',
//                         // boxShadow: '0 4px 10px rgba(255,140,0,0.3)',
//                         transition: 'all 0.3s ease',
//                         whiteSpace: 'nowrap',
//                         textTransform: 'none', // אותיות לא גדולות
//                         '&:hover': {
//                             background: 'linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
//                             boxShadow: '0 6px 15px rgba(2, 184, 250, 0.5)',
//                             transform: 'translateY(-2px)',
//                         },
//                         '&:active': {
//                             transform: 'translateY(1px)',
//                             boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
//                         },
//                         '@media (max-width: 600px)': {
//                             minWidth: '48px',
//                             paddingLeft: '12px',
//                             paddingRight: '12px',
//                             '& .MuiButton-startIcon': {
//                                 margin: 0
//                             },
//                             '& .MuiButton-startIcon + span': {
//                                 display: 'none'
//                             }
//                         },
//                         position: 'fixed', // מיקום קבוע
//                         bottom: '10px',
//                         left: '20px',
//                         zIndex: 1000, // מעל תוכן אחר
//                     }}
//                 >
//                     צאט עם אורית
//                 </Button>
//             </Tooltip>

//             {isChatOpen && <ChatComponent onClose={handleCloseChat} />}

//             <AppBar position="static">
//                 {/* <Footer></Footer> */}
//             </AppBar>
//         </div>
//     );
// };

// export default Layout;



import { AppBar , Tooltip, Box, Fab } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
// import Footer from './HomePage/Footer';
import ChatComponent from './ChatWidget';
import ChatIcon from '@mui/icons-material/Chat';
import { useState } from 'react';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
// const float = keyframes`
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0px); }
// `;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(2, 184, 250, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(2, 184, 250, 0); }
  100% { box-shadow: 0 0 0 0 rgba(2, 184, 250, 0); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
`;

const fadeOut = keyframes`
  0% { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0.8) translateY(20px); 
  }
`;

const fadeIn = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0.8) translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
`;

// Styled speech bubble container
const SpeechBubbleContainer = styled(Box)<{ isVisible: boolean }>(({ isVisible }) => ({
  position: "fixed",
  bottom: 30,
  left: 30,
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 12,
  opacity: isVisible ? 1 : 0,
  visibility: isVisible ? "visible" : "hidden",
  animation: isVisible ? `${fadeIn} 0.5s ease-out` : `${fadeOut} 0.3s ease-in`,
  transition: "all 0.3s ease",
}));

// Speech bubble for text
// const SpeechBubble = styled(Box)(({}) => ({
//   background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
//   color: "white",
//   padding: "12px 16px",
//   borderRadius: "20px 20px 20px 4px",
//   position: "relative",
//   maxWidth: 200,
//   boxShadow: "0 8px 25px rgba(2, 184, 250, 0.3)",
//   animation: `${float} 3s ease-in-out infinite`,
//   border: "2px solid rgba(255, 111, 241, 0.3)",
//   backdropFilter: "blur(10px)",

//   "&::after": {
//     content: '""',
//     position: "absolute",
//     bottom: -8,
//     left: 15,
//     width: 0,
//     height: 0,
//     borderLeft: "10px solid transparent",
//     borderRight: "10px solid transparent",
//     borderTop: "10px solid rgb(234, 102, 203)",
//     filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
//   },

//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     borderRadius: "20px 20px 20px 4px",
//     background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
//     pointerEvents: "none",
//   },
// }));

// Floating action button
const ChatFab = styled(Fab)(({ theme }) => ({
  width: 70,
  height: 70,
  background: "linear-gradient(45deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)",
  color: "white",
  border: "2px solid rgba(255, 111, 241, 0.3)",
  boxShadow: "0 8px 25px rgba(2, 184, 250, 0.4)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${pulse} 2s infinite`,
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)",
    pointerEvents: "none",
  },

  "&:hover": {
    transform: "scale(1.1)",
    background: "linear-gradient(45deg, rgb(189, 132, 246), rgb(234, 102, 203), #00d4ff, #f093fb)",
    boxShadow: "0 12px 35px rgba(2, 184, 250, 0.6)",
    animation: `${bounce} 0.6s ease`,

    "& .chat-icon": {
      transform: "scale(1.2) rotate(10deg)",
    },
  },

  "&:active": {
    transform: "scale(0.95)",
  },

  // Responsive design
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    bottom: 20,
    left: 20,
  },
}));

// Chat icon with animation
const AnimatedChatIcon = styled(ChatIcon)(({}) => ({
  fontSize: 32,
  transition: "all 0.3s ease",
  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
}));

// Notification dot
const NotificationDot = styled(Box)(({}) => ({
  position: "absolute",
  top: 8,
  right: 8,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #ff4757, #ff3838)",
  border: "2px solid white",
  animation: `${bounce} 1s infinite`,
  boxShadow: "0 2px 8px rgba(255, 71, 87, 0.4)",
}));

const Layout = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    // const [showBubbleText, setShowBubbleText] = useState(true);
    // const [ setShowBubbleText] = useState(true);
    const [hasNewMessage] = useState(true); // Mock new message indicator

    // פונקציה לפתיחת הצ'אט
    const handleOpenChat = () => {
        setIsChatOpen(true);
        // setShowBubbleText(false);
    };

    // פונקציה לסגירת הצ'אט
    const handleCloseChat = () => {
        setIsChatOpen(false);
        // Show bubble text again after a delay
        // setTimeout(() => setShowBubbleText(true), 1000);
    };

    return (
        <div style={{ width: '100%', position: 'relative', minHeight: '100vh' }}>
            <AppBar position="static">
                <Header onOpenChat={handleOpenChat} />
            </AppBar>

            <main style={{ paddingTop: '20px' }}>
                <Outlet />
            </main>

            {/* Floating Chat Button - Only show when chat is closed */}
            <SpeechBubbleContainer isVisible={!isChatOpen}>
                {/* Speech bubble text */}
                {/* {showBubbleText && (
                    <SpeechBubble>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                textAlign: "center",
                                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                            }}
                        >
                            שלום! 👋
                            <br />
                            אני אורית, מומחית תחום התמונות והצילום
                            <br />
                            איך אוכל לעזור?
                        </Typography>
                    </SpeechBubble>
                )} */}

                {/* Floating action button */}
                <Tooltip
                    title="פתח צ'אט עם אורית - מומחית תחום התמונות והצילום"
                    placement="right"
                    arrow
                    componentsProps={{
                        tooltip: {
                            sx: {
                                bgcolor: "rgba(0, 0, 0, 0.8)",
                                color: "white",
                                fontSize: "0.75rem",
                                borderRadius: 2,
                                backdropFilter: "blur(10px)",
                            },
                        },
                    }}
                >
                    <ChatFab onClick={handleOpenChat} aria-label="פתח צ'אט">
                        {hasNewMessage && <NotificationDot />}
                        <AnimatedChatIcon className="chat-icon" />
                    </ChatFab>
                </Tooltip>
            </SpeechBubbleContainer>

            {isChatOpen && <ChatComponent onClose={handleCloseChat} />}

            <AppBar position="static">
                {/* <Footer></Footer> */}
            </AppBar>
        </div>
    );
};

export default Layout;