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
    Alert,
    IconButton,
    Avatar,
    Divider
} from '@mui/material';
import { Close, Email, Send, Image } from '@mui/icons-material';

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
    const baseUrl =import.meta.env.VITE_API_URL;

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

        // Clear error for this field when user starts typing
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
            maxWidth="md"
            fullWidth
            dir="rtl"
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Email color="primary" />
                        <Typography variant="h6">שיתוף תמונה במייל</Typography>
                    </Box>
                    <IconButton onClick={handleClose} disabled={loading}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent>
                {/* Photo Preview */}
                <Box mb={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Image color="action" />
                        <Typography variant="subtitle2" color="text.secondary">
                            תמונה לשיתוף:
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            p: 2,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.200'
                        }}
                    >
                        <Avatar
                            src={photo.photoPath}
                            alt={photo.photoName}
                            sx={{ width: 60, height: 60 }}
                            variant="rounded"
                        />
                        <Typography variant="body2" color="text.primary">
                            {photo.photoName}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        המייל נשלח בהצלחה!
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" noValidate>
                    <TextField
                        fullWidth
                        label="שם השולח"
                        value={formData.senderName}
                        onChange={handleInputChange('senderName')}
                        margin="normal"
                        required
                        error={!!errors.senderName}
                        helperText={errors.senderName}
                        disabled={loading}
                        placeholder="הזן את שמך"
                    />

                    <TextField
                        fullWidth
                        label="כתובת מייל של הנמען"
                        type="email"
                        value={formData.to}
                        onChange={handleInputChange('to')}
                        margin="normal"
                        required
                        error={!!errors.to}
                        helperText={errors.to}
                        disabled={loading}
                        placeholder="example@email.com"
                    />

                    <TextField
                        fullWidth
                        label="נושא המייל"
                        value={formData.subject}
                        onChange={handleInputChange('subject')}
                        margin="normal"
                        required
                        error={!!errors.subject}
                        helperText={errors.subject}
                        disabled={loading}
                    />

                    <TextField
                        fullWidth
                        label="תוכן המייל"
                        multiline
                        rows={6}
                        value={formData.body}
                        onChange={handleInputChange('body')}
                        margin="normal"
                        required
                        error={!!errors.body}
                        helperText={errors.body}
                        disabled={loading}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    ביטול
                </Button>
                <Button
                    onClick={handleSendEmail}
                    disabled={loading}
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                        background: 'linear-gradient(135deg,rgb(234, 102, 203),rgb(189, 132, 246), #f093fb, #00d4ff)',
                        color: '#fff',
                        '&:hover': {
                            background: 'linear-gradient(135deg, rgb(189, 132, 246), rgb(234, 102, 203), #00d4ff, #f093fb)'
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