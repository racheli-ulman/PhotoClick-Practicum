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
  Fade,
  Chip,
  Divider,
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
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          maxWidth: "450px",
          width: "100%",
          background: "linear-gradient(145deg, #ffffff, #f9f9ff)",
          direction: "rtl", // RTL direction
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
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
            </motion.div>
            <Typography variant="h5" align="center" fontWeight="600" color="#333">
              התיקייה נוצרה בהצלחה!
            </Typography>
          </Box>
        </Fade>
      ) : (
        <>
          <Box 
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  "&:hover": { 
                    backgroundColor: "rgba(0, 0, 0, 0.04)" 
                  } 
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Typography variant="h6" fontWeight="600" color="#333" sx={{ flex: 5, textAlign: 'center' }}>
              יצירת תיקייה חדשה
            </Typography>
            
            <Box sx={{ flex: 1 }}></Box>
          </Box>

          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            pt={3} 
            pb={1}
          >
            <motion.div
              initial="initial"
              whileHover="hover"
              variants={folderColorVariants}
            >
              <FolderSpecialIcon sx={{ fontSize: 60, mb: 1 }} />
            </motion.div>
          </Box>

          <DialogContent>
            {albumStore.error && (
              <Fade in={!!albumStore.error}>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: "#fff0f0",
                    border: "1px solid #ffd6d6",
                    color: "#d32f2f",
                    padding: 2,
                    borderRadius: 2,
                    mb: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" fontWeight="500">
                    {albumStore.error}
                  </Typography>
                </Paper>
              </Fade>
            )}

            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mb={1}
                >
                  <Typography fontWeight="500" color="#444">
                    שם התיקיה <Box component="span" color="#d32f2f">*</Box>
                  </Typography>
                  <FormHelperText 
                    sx={{ 
                      m: 0, 
                      color: isNameTooLong ? "#d32f2f" : "text.secondary",
                      transition: "color 0.2s ease"
                    }}
                  >
                    {nameCharactersLeft} / {maxNameLength}
                  </FormHelperText>
                </Box>
                
                <TextField
                  variant="outlined"
                  fullWidth
                  value={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  placeholder="הזן שם לתיקיה החדשה"
                  required
                  error={isNameTooLong}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  InputProps={{
                    sx: { 
                      height: 48,
                      transition: "all 0.3s ease",
                      backgroundColor: isNameFocused ? "rgba(85, 107, 155, 0.04)" : "transparent",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(85, 107, 155, 0.04)"
                      },
                    },
                  }}
                />
                {isNameTooLong && (
                  <FormHelperText error>
                    שם התיקיה ארוך מידי
                  </FormHelperText>
                )}
              </Box>

              <Box mb={3}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mb={1}
                >
                  <Typography fontWeight="500" color="#444">
                    תיאור התיקיה
                  </Typography>
                  <FormHelperText 
                    sx={{ 
                      m: 0, 
                      color: isDescTooLong ? "#d32f2f" : "text.secondary",
                      transition: "color 0.2s ease"
                    }}
                  >
                    {descCharactersLeft} / {maxDescLength}
                  </FormHelperText>
                </Box>
                
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="הוסף תיאור קצר לתיקיה"
                  rows={3}
                  error={isDescTooLong}
                  onFocus={() => setIsDescFocused(true)}
                  onBlur={() => setIsDescFocused(false)}
                  InputProps={{
                    sx: { 
                      transition: "all 0.3s ease",
                      backgroundColor: isDescFocused ? "rgba(85, 107, 155, 0.04)" : "transparent",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(85, 107, 155, 0.04)"
                      },
                    },
                  }}
                />
                {isDescTooLong && (
                  <FormHelperText error>
                    התיאור ארוך מידי
                  </FormHelperText>
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" align="center">
                  התיקיה תופיע באלבומים שלך מיד לאחר היצירה
                </Typography>
              </Box>
            </form>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={isSubmitting}
              sx={{
                flex: 1,
                py: 1.5,
                mx: 1,
                fontWeight: 500,
                borderRadius: 2,
                backgroundColor: "transparent",
                borderColor: "rgba(0, 0, 0, 0.12)",
                color: "#555",
                "&:hover": { 
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  borderColor: "rgba(0, 0, 0, 0.2)"
                },
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting || isNameTooLong || isDescTooLong || !albumName.trim()}
              sx={{
                flex: 1,
                py: 1.5,
                mx: 1,
                fontWeight: 500,
                borderRadius: 2,
                backgroundColor: "#556b9b",
                boxShadow: "0 4px 12px rgba(85, 107, 155, 0.25)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#455a8a",
                  boxShadow: "0 6px 16px rgba(85, 107, 155, 0.3)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  backgroundColor: "#a0aec0",
                  color: "white",
                },
              }}
            >
              {isSubmitting ? "יוצר תיקיה..." : "צור תיקיה"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default observer(CreateNewAlbum);