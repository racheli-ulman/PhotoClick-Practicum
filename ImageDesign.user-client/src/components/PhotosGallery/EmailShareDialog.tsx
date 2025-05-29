// import React, { useState } from 'react';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     Box,
//     Typography,
//     CircularProgress,
//     Alert,
//     IconButton,
//     Avatar,
//     Divider
// } from '@mui/material';
// import { Close, Email, Send, Image } from '@mui/icons-material';

// interface EmailShareDialogProps {
//     open: boolean;
//     onClose: () => void;
//     photo: {
//         id: number;
//         photoName: string;
//         photoPath: string;
//     } | null;
// }

// interface EmailFormData {
//     to: string;
//     subject: string;
//     body: string;
//     senderName: string;
// }

// const EmailShareDialog: React.FC<EmailShareDialogProps> = ({ open, onClose, photo }) => {
//     const [formData, setFormData] = useState<EmailFormData>({
//         to: '',
//         subject: 'שיתוף תמונה',
//         body: 'שלום,\n\nאני שותף איתך תמונה מעניינת.\n\nבברכה',
//         senderName: ''
//     });

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState(false);
//     const [errors, setErrors] = useState<{ [key: string]: string }>({});
//     const baseUrl =import.meta.env.VITE_API_URL;

//     const validateForm = (): boolean => {
//         const newErrors: { [key: string]: string } = {};

//         if (!formData.to.trim()) {
//             newErrors.to = 'נדרש להזין כתובת מייל של הנמען';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to)) {
//             newErrors.to = 'כתובת מייל לא תקינה';
//         }

//         if (!formData.subject.trim()) {
//             newErrors.subject = 'נדרש להזין נושא למייל';
//         }

//         if (!formData.body.trim()) {
//             newErrors.body = 'נדרש להזין תוכן למייל';
//         }

//         if (!formData.senderName.trim()) {
//             newErrors.senderName = 'נדרש להזין שם השולח';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleInputChange = (field: keyof EmailFormData) => (
//         event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//     ) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: event.target.value
//         }));

//         // Clear error for this field when user starts typing
//         if (errors[field]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         }
//     };

//     const handleSendEmail = async () => {
//         if (!validateForm() || !photo) return;

//         setLoading(true);
//         setError(null);

//         try {
//             const emailRequest = {
//                 to: formData.to.trim(),
//                 subject: formData.subject.trim(),
//                 body: formData.body.trim(),
//                 senderName: formData.senderName.trim(),
//                 imageUrl: photo.photoPath
//             };
//             console.log('emailRequest', emailRequest);
//             const response = await fetch(`${baseUrl}/Mail/send-email`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(emailRequest)
//             });

//             if (response.ok) {
//                 setSuccess(true);
//                 setTimeout(() => {
//                     handleClose();
//                 }, 2000);
//             } else {
//                 const errorText = await response.text();
//                 setError(`שגיאה בשליחת המייל: ${errorText}`);
//             }
//         } catch (err) {
//             setError('שגיאה בחיבור לשרת. אנא נסה שוב.');
//             console.error('Error sending email:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleClose = () => {
//         if (!loading) {
//             setFormData({
//                 to: '',
//                 subject: 'שיתוף תמונה',
//                 body: 'שלום,\n\nאני שותף איתך תמונה מעניינת.\n\nבברכה',
//                 senderName: ''
//             });
//             setError(null);
//             setSuccess(false);
//             setErrors({});
//             onClose();
//         }
//     };

//     if (!photo) return null;

//     return (
//         <Dialog
//             open={open}
//             onClose={handleClose}
//             maxWidth="md"
//             fullWidth
//             dir="rtl"
//         >
//             <DialogTitle>
//                 <Box display="flex" alignItems="center" justifyContent="space-between">
//                     <Box display="flex" alignItems="center" gap={1}>
//                         <Email color="primary" />
//                         <Typography variant="h6">שיתוף תמונה במייל</Typography>
//                     </Box>
//                     <IconButton onClick={handleClose} disabled={loading}>
//                         <Close />
//                     </IconButton>
//                 </Box>
//             </DialogTitle>

//             <DialogContent>
//                 {/* Photo Preview */}
//                 <Box mb={3}>
//                     <Box display="flex" alignItems="center" gap={2} mb={2}>
//                         <Image color="action" />
//                         <Typography variant="subtitle2" color="text.secondary">
//                             תמונה לשיתוף:
//                         </Typography>
//                     </Box>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 2,
//                             p: 2,
//                             bgcolor: 'grey.50',
//                             borderRadius: 1,
//                             border: '1px solid',
//                             borderColor: 'grey.200'
//                         }}
//                     >
//                         <Avatar
//                             src={photo.photoPath}
//                             alt={photo.photoName}
//                             sx={{ width: 60, height: 60 }}
//                             variant="rounded"
//                         />
//                         <Typography variant="body2" color="text.primary">
//                             {photo.photoName}
//                         </Typography>
//                     </Box>
//                 </Box>

//                 <Divider sx={{ mb: 3 }} />

//                 {success && (
//                     <Alert severity="success" sx={{ mb: 2 }}>
//                         המייל נשלח בהצלחה!
//                     </Alert>
//                 )}

//                 {error && (
//                     <Alert severity="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Alert>
//                 )}

//                 <Box component="form" noValidate>
//                     <TextField
//                         fullWidth
//                         label="שם השולח"
//                         value={formData.senderName}
//                         onChange={handleInputChange('senderName')}
//                         margin="normal"
//                         required
//                         error={!!errors.senderName}
//                         helperText={errors.senderName}
//                         disabled={loading}
//                         placeholder="הזן את שמך"
//                     />

//                     <TextField
//                         fullWidth
//                         label="כתובת מייל של הנמען"
//                         type="email"
//                         value={formData.to}
//                         onChange={handleInputChange('to')}
//                         margin="normal"
//                         required
//                         error={!!errors.to}
//                         helperText={errors.to}
//                         disabled={loading}
//                         placeholder="example@email.com"
//                     />

//                     <TextField
//                         fullWidth
//                         label="נושא המייל"
//                         value={formData.subject}
//                         onChange={handleInputChange('subject')}
//                         margin="normal"
//                         required
//                         error={!!errors.subject}
//                         helperText={errors.subject}
//                         disabled={loading}
//                     />

//                     <TextField
//                         fullWidth
//                         label="תוכן המייל"
//                         multiline
//                         rows={6}
//                         value={formData.body}
//                         onChange={handleInputChange('body')}
//                         margin="normal"
//                         required
//                         error={!!errors.body}
//                         helperText={errors.body}
//                         disabled={loading}
//                     />
//                 </Box>
//             </DialogContent>

//             <DialogActions sx={{ p: 3 }}>
//                 <Button
//                     onClick={handleClose}
//                     disabled={loading}
//                     variant="outlined"
//                 >
//                     ביטול
//                 </Button>
//                 <Button
//                     onClick={handleSendEmail}
//                     disabled={loading}
//                     variant="contained"
//                     startIcon={loading ? <CircularProgress size={20} /> : <Send />}
//                     sx={{
//                         background: 'linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)',
//                         color: '#fff',
//                         '&:hover': {
//                             background: 'linear-gradient(135deg, rgb(189, 132, 246), rgb(234, 102, 203), #00d4ff, #f093fb)'
//                         }
//                     }}
//                 >
//                     {loading ? 'שולח...' : 'שלח מייל'}
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default EmailShareDialog;



import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    // Alert,
    IconButton,
    Avatar,
    // Divider,
    Fade,
    Slide,
    Paper
} from '@mui/material';
import { Close, Email, Send, Image, CheckCircle, Error } from '@mui/icons-material';

interface EmailShareDialogProps {
    open: boolean;
    onClose: () => void;
    photo: {
        id: number;
        photoName: string;
        photoPath: string;
    } | null;
}

interface EmailFormData {
    to: string;
    subject: string;
    body: string;
    senderName: string;
}

const EmailShareDialog: React.FC<EmailShareDialogProps> = ({ open, onClose, photo }) => {
    const [formData, setFormData] = useState<EmailFormData>({
        to: '',
        subject: 'שיתוף תמונה',
        body: 'שלום,\n\nאני שותף איתך תמונה מעניינת.\n\nבברכה',
        senderName: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const baseUrl = import.meta.env.VITE_API_URL;

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.to.trim()) {
            newErrors.to = 'נדרש להזין כתובת מייל של הנמען';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to)) {
            newErrors.to = 'כתובת מייל לא תקינה';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'נדרש להזין נושא למייל';
        }

        if (!formData.body.trim()) {
            newErrors.body = 'נדרש להזין תוכן למייל';
        }

        if (!formData.senderName.trim()) {
            newErrors.senderName = 'נדרש להזין שם השולח';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof EmailFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSendEmail = async () => {
        if (!validateForm() || !photo) return;

        setLoading(true);
        setError(null);

        try {
            const emailRequest = {
                to: formData.to.trim(),
                subject: formData.subject.trim(),
                body: formData.body.trim(),
                senderName: formData.senderName.trim(),
                imageUrl: photo.photoPath
            };
            console.log('emailRequest', emailRequest);
            const response = await fetch(`${baseUrl}/Mail/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailRequest)
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                const errorText = await response.text();
                setError(`שגיאה בשליחת המייל: ${errorText}`);
            }
        } catch (err) {
            setError('שגיאה בחיבור לשרת. אנא נסה שוב.');
            console.error('Error sending email:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFormData({
                to: '',
                subject: 'שיתוף תמונה',
                body: 'שלום,\n\nאני שותף איתך תמונה מעניינת.\n\nבברכה',
                senderName: ''
            });
            setError(null);
            setSuccess(false);
            setErrors({});
            onClose();
        }
    };

    if (!photo) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            dir="rtl"
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.8)',
                    overflow: 'hidden',
                    width: '480px',
                    maxHeight: '90vh'
                }
            }}
            TransitionComponent={Slide}
            // TransitionProps={{ direction: 'up' }}
        >
            {/* Success/Error Overlay */}
            {(success || error) && (
                <Fade in={!!(success || error)}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: success 
                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(56, 142, 60, 0.95))'
                                : 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(211, 47, 47, 0.95))',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            color: 'white'
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                p: 4,
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            {success ? (
                                <>
                                    <CheckCircle sx={{ fontSize: 64, mb: 2, color: '#fff' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                        המייל נשלח בהצלחה!
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        ההודעה נשלחה בהצלחה לנמען
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Error sx={{ fontSize: 64, mb: 2, color: '#fff' }} />
                                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                                        שליחת המייל נכשלה
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                        {error}
                                    </Typography>
                                </>
                            )}
                        </Paper>
                    </Box>
                </Fade>
            )}

            <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb)', 
                color: 'white', 
                py: 2.5,
                position: 'relative' 
            }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ 
                            background: 'rgba(255,255,255,0.2)', 
                            borderRadius: '10px', 
                            p: 0.8,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Email sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                            שיתוף תמונה במייל
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={handleClose} 
                        disabled={loading}
                        size="small"
                        sx={{ 
                            color: 'white',
                            background: 'rgba(255,255,255,0.15)',
                            '&:hover': { background: 'rgba(255,255,255,0.25)' }
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, rgba(234, 102, 203, 0.08), rgba(189, 132, 246, 0.08))',
                        borderRadius: '12px',
                        p: 2,
                        mb: 2.5,
                        border: '1px solid rgba(234, 102, 203, 0.15)'
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
                        <Image sx={{ color: 'rgb(189, 132, 246)', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgb(189, 132, 246)' }}>
                            תמונה לשיתוף
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={photo.photoPath}
                            alt={photo.photoName}
                            sx={{ 
                                width: 48, 
                                height: 48,
                                border: '2px solid rgba(189, 132, 246, 0.3)'
                            }}
                            variant="rounded"
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px' }}>
                            {photo.photoName}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 2 }}>
                    {[
                        { field: 'senderName', label: 'שם השולח', placeholder: 'הזן את שמך' },
                        { field: 'to', label: 'כתובת מייל', placeholder: 'example@email.com', type: 'email' },
                        { field: 'subject', label: 'נושא', placeholder: '' },
                        { field: 'body', label: 'הודעה', placeholder: '', multiline: true, rows: 3 }
                    ].map(({ field, label, placeholder, type, multiline, rows }) => (
                        <TextField
                            key={field}
                            fullWidth
                            size="small"
                            label={label}
                            type={type || 'text'}
                            multiline={multiline}
                            rows={rows}
                            value={formData[field as keyof EmailFormData]}
                            onChange={handleInputChange(field as keyof EmailFormData)}
                            required
                            error={!!errors[field]}
                            helperText={errors[field]}
                            disabled={loading}
                            placeholder={placeholder}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.9)',
                                    fontSize: '14px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        background: 'rgba(255,255,255,1)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(189, 132, 246, 0.4)'
                                        }
                                    },
                                    '&.Mui-focused': {
                                        background: 'rgba(255,255,255,1)',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgb(189, 132, 246)',
                                            borderWidth: '2px'
                                        }
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    fontSize: '14px',
                                    '&.Mui-focused': {
                                        color: 'rgb(189, 132, 246)'
                                    }
                                },
                                '& .MuiFormHelperText-root': {
                                    fontSize: '12px'
                                }
                            }}
                        />
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, gap: 1.5, justifyContent: 'center' }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                    size="medium"
                    sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        borderColor: 'rgba(189, 132, 246, 0.5)',
                        color: 'rgb(189, 132, 246)',
                        fontWeight: 600,
                        fontSize: '14px',
                        minWidth: '100px',
                        '&:hover': {
                            borderColor: 'rgb(234, 102, 203)',
                            color: 'rgb(234, 102, 203)',
                            background: 'rgba(234, 102, 203, 0.05)'
                        }
                    }}
                >
                    ביטול
                </Button>
                <Button
                    onClick={handleSendEmail}
                    disabled={loading}
                    variant="contained"
                    size="medium"
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send fontSize="small" />}
                    sx={{
                        borderRadius: '10px',
                        px: 3,
                        py: 1,
                        background: 'linear-gradient(135deg, rgb(234, 102, 203), rgb(189, 132, 246), #f093fb, #00d4ff)',
                        fontWeight: 600,
                        fontSize: '14px',
                        minWidth: '120px',
                        boxShadow: '0 6px 20px rgba(234, 102, 203, 0.25)',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgb(189, 132, 246), rgb(234, 102, 203), #00d4ff, #f093fb)',
                            boxShadow: '0 8px 25px rgba(189, 132, 246, 0.35)',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {loading ? 'שולח...' : 'שלח מייל'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailShareDialog;