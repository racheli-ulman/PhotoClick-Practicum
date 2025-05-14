import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
    Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import PersonIcon from '@mui/icons-material/Person';

interface ChatComponentProps {
    onClose?: () => void; // אופציונלי אם הקומפוננטה לא תמיד נסגרת מבחוץ
}

const ChatComponent: React.FC<ChatComponentProps> = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
const baseURL= import.meta.env.VITE_API_URL

    // נושאים מוצעים לשיחות על תמונות
    const suggestedTopics = [
        "פורמטים של קבצי תמונה",
        "עריכת תמונות בסיסית",
        "המלצות לתוכנות עריכה",
        "היסטוריה של הצילום",
        "טכניקות צילום"
    ];

    // הרחבת הצ'אט לאחר השהייה קצרה (אם צריך אפקט פתיחה)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    // גלילה לתחתית כאשר ההודעות משתנות
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (input.trim() === '' || status === 'loading') return;

        setStatus('loading');
        setMessages([...messages, { sender: 'user', text: input }]);
        setInput('');

        try {
            const response = await axios.post(`${baseURL}/Chat`, {
                Question: input,
            });
            const botResponse = response.data?.choices?.[0]?.message?.content || 'אני מצטער, קרתה שגיאה.';
            setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: botResponse }]);
            setStatus('idle');
        } catch (error) {
            console.error('שגיאה בעת שליחת השאלה:', error);
            setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: 'אני מצטער, הייתה לי בעיה לענות על השאלה הזו.' }]);
            setStatus('error');
        } finally {
            setStatus('idle');
        }
    };

    const handleTopicClick = (topic: string) => {
        setInput(topic);
        handleSend();
    };

    const handleClose = () => {
        setIsExpanded(false);
        setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 300);
    };

    return (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
            <Paper
                elevation={8}
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    width: 350,
                    height: isExpanded ? 450 : 0,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'height 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#ffffff',
                    direction: 'rtl',
                    zIndex: 1000,
                }}
            >
                {/* כותרת הצ'אט */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: '#4caf50', // צבע ירוק לתמונות
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #e0e0e0',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ImageIcon sx={{ color: '#ffffff', ml: 1 }} />
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            שיחה עם מומחה תמונות
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#ffffff', ml: 1 }}>
                            עוזר תמונות אישי
                        </Typography>
                        <IconButton onClick={handleClose} size="small" sx={{ color: '#ffffff' }}>
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
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            bgcolor: '#f5f5f5',
                        }}
                    >
                        {messages.length === 0 ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}>
                                <Box sx={{
                                    bgcolor: '#ffffff',
                                    p: 3,
                                    borderRadius: 2,
                                    width: '100%',
                                    mb: 2,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                    <Typography variant="body1" align="center" sx={{ color: '#388e3c', mb: 2 }}>
                                        שלום! אני כאן כדי לעזור לך בכל הנוגע לתמונות.
                                    </Typography>
                                    <Typography variant="body2" align="center" sx={{ color: '#666', mb: 3 }}>
                                        שאל/י אותי כל שאלה על תמונות, עריכה, פורמטים ועוד, או נסה/י אחד מהנושאים האלה:
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                        {suggestedTopics.map((topic, index) => (
                                            <Chip
                                                key={index}
                                                label={topic}
                                                onClick={() => handleTopicClick(topic)}
                                                sx={{
                                                    bgcolor: '#4caf50',
                                                    color: '#fff',
                                                    '&:hover': { bgcolor: '#388e3c' },
                                                    fontSize: '0.75rem',
                                                    mb: 1
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
                                        display: 'flex',
                                        justifyContent: msg.sender === 'user' ? 'flex-start' : 'flex-end',
                                        mb: 1,
                                    }}
                                >
                                    {msg.sender === 'user' && (
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: '#81c784', // ירוק בהיר יותר למשתמש
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                ml: 1
                                            }}
                                        >
                                            <PersonIcon sx={{ fontSize: 16, color: '#fff' }} />
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            maxWidth: '75%',
                                            p: 1.5,
                                            bgcolor: msg.sender === 'user' ? '#e8f5e9' : '#4caf50', // גווני ירוק
                                            color: msg.sender === 'user' ? '#333' : '#fff',
                                            borderRadius: msg.sender === 'user'
                                                ? '18px 18px 18px 4px'
                                                : '18px 18px 4px 18px',
                                            position: 'relative',
                                        }}
                                    >
                                        {msg.sender !== 'user' && (
                                            <Typography variant="caption" sx={{ color: '#e0e0e0', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                                                מומחה תמונות
                                            </Typography>
                                        )}
                                        <Typography variant="body2">{msg.text}</Typography>
                                    </Box>

                                    {msg.sender !== 'user' && (
                                        <Box
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: '50%',
                                                bgcolor: '#4caf50',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 1
                                            }}
                                        >
                                            <ImageIcon sx={{ fontSize: 16, color: '#fff' }} />
                                        </Box>
                                    )}
                                </Box>
                            ))
                        )}

                        {status === 'loading' && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                <Box
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        bgcolor: '#4caf50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 1
                                    }}
                                >
                                    <ImageIcon sx={{ fontSize: 16, color: '#fff' }} />
                                </Box>
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: '#4caf50',
                                        borderRadius: '18px 18px 4px 18px',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <CircularProgress size={20} sx={{ color: '#fff' }} />
                                </Box>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>
                </Fade>

                {/* אזור הקלט */}
                <Box
                    sx={{
                        display: 'flex',
                        p: 2,
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: '#4caf50'
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        sx={{
                            mr: 1,
                            minWidth: 'unset',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: '#ffffff',
                            color: '#4caf50',
                            '&:hover': {
                                bgcolor: '#e0e0e0',
                            }
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </Button>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="הקלד/י הודעה..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 5,
                                backgroundColor: '#ffffff',
                                color: '#333',
                                '& fieldset': {
                                    borderColor: '#a5d6a7', // ירוק בהיר לגבול
                                },
                                '&:hover fieldset': {
                                    borderColor: '#81c784',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#388e3c',
                                },
                            },
                            '& .MuiInputBase-input': {
                                '&::placeholder': {
                                    color: '#a5d6a7',
                                    opacity: 1,
                                },
                            },
                        }}
                        inputProps={{
                            style: { color: '#333', textAlign: 'right' }
                        }}
                    />
                </Box>
            </Paper>
        </Slide>
    );
};

export default ChatComponent;