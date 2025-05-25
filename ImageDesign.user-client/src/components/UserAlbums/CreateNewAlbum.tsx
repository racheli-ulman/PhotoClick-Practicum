import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import albumStore from "../../stores/albumStore";
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogContent,
    Slide,
    FormHelperText,
    //   Fade,
    Chip
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import FolderIcon from "@mui/icons-material/Folder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "framer-motion";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CreateAlbumProps {
    onClose: () => void;
}

const CreateNewAlbum: React.FC<CreateAlbumProps> = ({ onClose }) => {
    const [albumName, setAlbumName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const maxNameLength = 50;
    const maxDescLength = 150;
    const nameCharactersLeft = maxNameLength - albumName.length;
    const descCharactersLeft = maxDescLength - description.length;
    const isNameTooLong = nameCharactersLeft < 0;
    const isDescTooLong = descCharactersLeft < 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isNameTooLong || isDescTooLong || !albumName.trim()) {
            return;
        }

        setIsSubmitting(true);

        const userData = sessionStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const userId = user ? user.user.id : null;

        if (!userId) {
            albumStore.setError("לא נמצא משתמש מחובר");
            setIsSubmitting(false);
            return;
        }

        try {
            await albumStore.createAlbum(albumName.trim(), description.trim(), userId);

            if (!albumStore.error) {
                setShowSuccess(true);
                setTimeout(() => {
                    setAlbumName("");
                    setDescription("");
                    setShowSuccess(false);
                    onClose();
                }, 1200);
            } else {
                setIsSubmitting(false);
            }
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open
            onClose={onClose}
            TransitionComponent={Transition}
            PaperProps={{
                sx: {
                    borderRadius: 5,
                    boxShadow: "0 25px 80px rgba(0, 0, 0, 0.15)",
                    overflow: "hidden",
                    maxWidth: "420px",
                    width: "100%",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                    direction: "rtl",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                }
            }}
        >
            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 5,
                                textAlign: "center",
                                direction: "rtl",
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 64,
                                        color: "#22c55e",
                                        mb: 2,
                                        filter: "drop-shadow(0 4px 12px rgba(34, 197, 94, 0.3))"
                                    }}
                                />
                            </motion.div>
                            <Typography variant="h6" fontWeight="700" color="#1a202c" sx={{ mb: 1 }}>
                                התיקייה נוצרה בהצלחה!
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                                "{albumName}" נוספה לאלבומים שלך
                            </Typography>
                        </Box>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header */}
                        <Box
                            sx={{
                                position: "relative",
                                background: "linear-gradient(135deg, #0f766e, #7dd3fc,#f8bbd9,rgb(247, 84, 165))",
                                p: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        transform: "scale(1.05)"
                                    },
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <FolderIcon sx={{ color: "white", fontSize: 28 }} />
                                <Typography
                                    variant="h6"
                                    fontWeight="700"
                                    color="white"
                                    sx={{ letterSpacing: "0.5px" }}
                                >
                                    תיקייה חדשה
                                </Typography>
                            </Box>
                        </Box>

                        <DialogContent sx={{ p: 4, direction: "rtl" }}>
                            {/* Error Message */}
                            <AnimatePresence>
                                {albumStore.error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                backgroundColor: "#fef2f2",
                                                border: "1px solid #fecaca",
                                                color: "#dc2626",
                                                p: 2.5,
                                                borderRadius: 3,
                                                mb: 3,
                                                textAlign: "center",
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight="500">
                                                {albumStore.error}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit}>
                                {/* Album Name Field */}
                                <Box mb={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>

                                        <Chip
                                            label={`${nameCharactersLeft}/${maxNameLength}`}
                                            size="small"
                                            variant="outlined"
                                            color={isNameTooLong ? "error" : "default"}
                                            sx={{
                                                fontSize: "11px",
                                                height: 20,
                                                "& .MuiChip-label": { px: 1 }
                                            }}
                                        />
                                        <Typography variant="subtitle1" fontWeight="600" color="#374151">
                                            שם התיקייה
                                            <Box component="span" color="#dc2626" sx={{ ml: 0.5 }}>*</Box>
                                        </Typography>
                                    </Box>

                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={albumName}
                                        onChange={(e) => setAlbumName(e.target.value)}
                                        placeholder="בחר שם לתיקייה שלך"
                                        required
                                        error={isNameTooLong}
                                        InputProps={{
                                            sx: {
                                                height: 48,
                                                backgroundColor: "#f8fafc",
                                                borderRadius: 2.5,
                                                fontSize: "15px",
                                                transition: "all 0.2s ease",
                                                "& input": {
                                                    textAlign: "left",
                                                    direction: "rtl",
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#f1f5f9"
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                                                }
                                            },
                                        }}
                                    />
                                    {isNameTooLong && (
                                        <FormHelperText error sx={{ textAlign: "right", mt: 0.5 }}>
                                            השם ארוך מדי
                                        </FormHelperText>
                                    )}
                                </Box>

                                {/* Description Field */}
                                <Box mb={3}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>

                                        <Chip
                                            label={`${descCharactersLeft}/${maxDescLength}`}
                                            size="small"
                                            variant="outlined"
                                            color={isDescTooLong ? "error" : "default"}
                                            sx={{
                                                fontSize: "11px",
                                                height: 20,
                                                "& .MuiChip-label": { px: 1 }
                                            }}
                                        />
                                        <Typography variant="subtitle1" fontWeight="600" color="#374151">
                                            תיאור (אופציונלי)
                                        </Typography>
                                    </Box>

                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="הוסף תיאור קצר (אופציונלי)"
                                        error={isDescTooLong}
                                        InputProps={{
                                            sx: {
                                                backgroundColor: "#f8fafc",
                                                borderRadius: 2.5,
                                                fontSize: "15px",
                                                transition: "all 0.2s ease",
                                                "& textarea": {
                                                    textAlign: "left",
                                                    direction: "rtl",
                                                },
                                                "&:hover": {
                                                    backgroundColor: "#f1f5f9"
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#ffffff",
                                                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)"
                                                }
                                            },
                                        }}
                                    />
                                    {isDescTooLong && (
                                        <FormHelperText error sx={{ textAlign: "right", mt: 0.5 }}>
                                            התיאור ארוך מדי
                                        </FormHelperText>
                                    )}
                                </Box>

                                {/* Action Buttons */}
                                <Box display="flex" gap={2} mt={4}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={isSubmitting || isNameTooLong || isDescTooLong || !albumName.trim()}
                                        sx={{
                                            flex: 1,
                                            py: 1.5,
                                            fontWeight: 600,
                                            borderRadius: 2.5,
                                            fontSize: "15px",
                                            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                                            boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)",
                                            textTransform: "none",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                                                boxShadow: "0 6px 25px rgba(79, 70, 229, 0.4)",
                                                transform: "translateY(-1px)",
                                            },
                                            "&:disabled": {
                                                background: "#e2e8f0",
                                                color: "#94a3b8",
                                                boxShadow: "none",
                                            }
                                        }}
                                    >
                                        {isSubmitting ? "...יוצר" : "צור תיקייה"}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        sx={{
                                            flex: 1,
                                            py: 1.5,
                                            fontWeight: 600,
                                            borderRadius: 2.5,
                                            fontSize: "15px",
                                            borderColor: "#d1d5db",
                                            color: "#6b7280",
                                            textTransform: "none",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: "#f9fafb",
                                                borderColor: "#9ca3af",
                                                transform: "translateY(-1px)",
                                            }
                                        }}
                                    >
                                        ביטול
                                    </Button>
                                </Box>
                            </form>
                        </DialogContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Dialog>
    );
};

export default observer(CreateNewAlbum);