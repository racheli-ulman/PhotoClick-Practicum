import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import albumStore from "../stores/albumStore";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  FormHelperText,
  Fade
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import FolderSpecialIcon from "@mui/icons-material/FolderSpecial";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { motion } from "framer-motion"; // Add framer-motion for animations

// Slide up transition for dialog
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
  const [isNameFocused, setIsNameFocused] = useState<boolean>(false);
  const [isDescFocused, setIsDescFocused] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Character counter for name field
  const maxNameLength = 50;
  const nameCharactersLeft = maxNameLength - albumName.length;
  const isNameTooLong = nameCharactersLeft < 0;

  // Character counter for description field
  const maxDescLength = 200;
  const descCharactersLeft = maxDescLength - description.length;
  const isDescTooLong = descCharactersLeft < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNameTooLong || isDescTooLong) {
      return;
    }
    
    setIsSubmitting(true);

    // Get user data from sessionStorage
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
        
        // Reset form after successful submission
        setTimeout(() => {
          setAlbumName("");
          setDescription("");
          setShowSuccess(false);
          onClose();
        }, 1500);
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const folderColorVariants = {
    initial: { color: "#f8d775" },
    hover: { color: "#ffb347", scale: 1.05 },
  };

  return (
    <Dialog 
      open
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          maxWidth: "500px",
          width: "100%",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          direction: "rtl", // RTL direction for the entire dialog
        }
      }}
    >
      {showSuccess ? (
        <Fade in={showSuccess}>
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              minHeight: "300px",
              direction: "rtl",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
            </motion.div>
            <Typography variant="h5" align="center" fontWeight="600" color="#333" sx={{ direction: "rtl" }}>
              התיקייה נוצרה בהצלחה!
            </Typography>
          </Box>
        </Fade>
      ) : (
        <>
          {/* Header */}
          <Box 
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 3,
              background: "linear-gradient(90deg, #556b9b, #6b7fb8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                pointerEvents: "none",
              }}
            />
            
            <Box sx={{ flex: 1, direction: "rtl" }}>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  color: "white",
                  "&:hover": { 
                    backgroundColor: "rgba(255, 255, 255, 0.1)" 
                  } 
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography 
              variant="h5" 
              fontWeight="700" 
              color="white" 
              sx={{ 
                flex: 5, 
                textAlign: 'center',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              יצירת תיקייה חדשה
            </Typography>
            
            <Box sx={{ flex: 1 }}></Box>
          </Box>

          {/* Folder Icon */}
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            pt={4} 
            pb={2}
            sx={{ direction: "rtl" }}
          >
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={folderColorVariants}
            >
              <FolderSpecialIcon sx={{ fontSize: 70, mb: 1, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }} />
            </motion.div>
          </Box>

          <DialogContent sx={{ p: 4, direction: "rtl" }}>
            {albumStore.error && (
              <Fade in={!!albumStore.error}>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: "#fff5f5",
                    border: "1px solid #fed7d7",
                    color: "#c53030",
                    padding: 3,
                    borderRadius: 3,
                    mb: 3,
                    textAlign: "center",
                    direction: "rtl",
                  }}
                >
                  <Typography variant="body2" fontWeight="500">
                    {albumStore.error}
                  </Typography>
                </Paper>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              {/* Album Name Field */}
              <Box mb={4}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mb={2}
                  sx={{ direction: "rtl" }}
                >
                
                  <FormHelperText 
                    sx={{ 
                      m: 0, 
                      color: isNameTooLong ? "#e53e3e" : "#718096",
                      transition: "color 0.2s ease",
                      fontWeight: 500,
                      direction: "rtl"
                    }}
                  >
                    {nameCharactersLeft} / {maxNameLength}
                  </FormHelperText>  <Typography 
                    variant="h6" 
                    fontWeight="600" 
                    color="#2d3748"
                    sx={{ direction: "rtl" }}
                  >
                    שם התיקייה <Box component="span" color="#e53e3e">*</Box>
                  </Typography>
                </Box>
                
                <TextField
                  variant="outlined"
                  fullWidth
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  placeholder="הזן שם לתיקייה החדשה"
                  required
                  error={isNameTooLong}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  InputProps={{
                    sx: { 
                      height: 56,
                      transition: "all 0.3s ease",
                      backgroundColor: isNameFocused ? "rgba(85, 107, 155, 0.06)" : "rgba(247, 250, 252, 0.8)",
                      borderRadius: 3,
                      fontSize: "16px",
                      direction: "ltr",
                      textAlign: "right",
                      "& input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(85, 107, 155, 0.08)"
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(85, 107, 155, 0.06)",
                        boxShadow: "0 0 0 3px rgba(85, 107, 155, 0.1)"
                      }
                    },
                  }}
                />
                {isNameTooLong && (
                  <FormHelperText error sx={{ direction: "rtl", textAlign: "right", mt: 1 }}>
                    שם התיקייה ארוך מידי
                  </FormHelperText>
                )}
              </Box>

              {/* Description Field */}
              <Box mb={4}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mb={2}
                  sx={{ direction: "rtl" }}
                >
           
                  <FormHelperText 
                    sx={{ 
                      m: 0, 
                      color: isDescTooLong ? "#e53e3e" : "#718096",
                      transition: "color 0.2s ease",
                      fontWeight: 500,
                      direction: "rtl"
                    }}
                  >
                    {descCharactersLeft} / {maxDescLength}
                  </FormHelperText>       <Typography 
                    variant="h6" 
                    fontWeight="600" 
                    color="#2d3748"
                    sx={{ direction: "rtl" }}
                  >
                    תיאור התיקייה
                  </Typography>
                </Box>
                
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="הוסף תיאור קצר לתיקייה"
                  rows={4}
                  error={isDescTooLong}
                  onFocus={() => setIsDescFocused(true)}
                  onBlur={() => setIsDescFocused(false)}
                  InputProps={{
                    sx: { 
                      transition: "all 0.3s ease",
                      backgroundColor: isDescFocused ? "rgba(85, 107, 155, 0.06)" : "rgba(247, 250, 252, 0.8)",
                      borderRadius: 3,
                      fontSize: "16px",
                      direction: "rtl",
                      "& textarea": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(85, 107, 155, 0.08)"
                      },
                      "&.Mui-focused": {
                        backgroundColor: "rgba(85, 107, 155, 0.06)",
                        boxShadow: "0 0 0 3px rgba(85, 107, 155, 0.1)"
                      }
                    },
                  }}
                />
                {isDescTooLong && (
                  <FormHelperText error sx={{ direction: "rtl", textAlign: "right", mt: 1 }}>
                    התיאור ארוך מידי
                  </FormHelperText>
                )}
              </Box>

              {/* Info Text */}
              <Box mb={2}>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: "rgba(79, 172, 254, 0.08)",
                    border: "1px solid rgba(79, 172, 254, 0.2)",
                    borderRadius: 3,
                    p: 3,
                    direction: "rtl"
                  }}
                >
                  <Typography 
                    variant="body2" 
                    color="#2b6cb0" 
                    align="right"
                    fontWeight="500"
                  >
                    התיקייה תופיע באלבומים שלך מיד לאחר היצירה
                  </Typography>
                </Paper>
              </Box>
            </form>
          </DialogContent>

          {/* Action Buttons */}
          <DialogActions sx={{ p: 4, pt: 0, gap: 2, direction: "rtl" }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting || isNameTooLong || isDescTooLong || !albumName.trim()}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: 600,
                borderRadius: 3,
                fontSize: "16px",
                background: "linear-gradient(135deg, #556b9b 0%, #6b7fb8 100%)",
                boxShadow: "0 8px 25px rgba(85, 107, 155, 0.3)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #455a8a 0%, #5a6fa7 100%)",
                  boxShadow: "0 12px 35px rgba(85, 107, 155, 0.4)",
                  transform: "translateY(-3px)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%)",
                  color: "white",
                  boxShadow: "none",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                  pointerEvents: "none",
                }
              }}
            >
              {isSubmitting ? "יוצר תיקייה...ה" : "צור תיקייה"}
            </Button>
            
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                flex: 1,
                py: 2,
                fontWeight: 600,
                borderRadius: 3,
                fontSize: "16px",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderColor: "rgba(113, 128, 150, 0.3)",
                color: "#4a5568",
                transition: "all 0.3s ease",
                "&:hover": { 
                  backgroundColor: "rgba(247, 250, 252, 1)",
                  borderColor: "rgba(113, 128, 150, 0.5)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)"
                },
                "&:active": {
                  transform: "translateY(0px)",
                },
              }}
            >
              ביטול
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default observer(CreateNewAlbum);