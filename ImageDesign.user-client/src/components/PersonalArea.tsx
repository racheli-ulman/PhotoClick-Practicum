import React, {  useState } from "react";
import { Button } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import UserPhotosDialog from "./Collage/UserPhotos"; // יבוא של הקומפוננטה החדשה

const PersonalArea: React.FC = () => {
    const [openCollageDialog, setOpenCollageDialog] = useState<boolean>(false); // מצב חדש לדיאלוג הקולאז'

    const navigate = useNavigate(); // שימוש ב-hook של React Router לניווט

    return (
        <div style={{ display: 'flex', padding: '16px', overflow: 'hidden' }}> {/* מניעת גלילה */}
            <div style={{
                width: '250px',
                position: 'fixed', // או 'fixed'
                top: '16px',
                height: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                // alignItems: 'center', // מרכז את הכפתורים
                justifyContent: 'flex-start', // מתחיל מהחלק העליון
                marginTop: '80px', // מרווח מהחלק העליון
            }}>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon sx={{ color: 'blue' }}/>}
                    onClick={() => navigate(`/personal-area/add-photo`)}
                    sx={{ 
                        padding: '4px 8px', // הקטנת padding
                        backgroundColor: '#737373', 
                        whiteSpace: 'normal', // מאפשר ירידת שורה
                        textAlign: 'left', // טקסט משמאל
                        width: 'auto', // גודל הכפתור בהתאם לטקסט
                        marginBottom: 2 
                    }} 
                >
                    העלאת תמונה לאלבום שלי
                </Button>

                <Button
                    variant="contained"
                    startIcon={<PhotoLibraryIcon sx={{ color: 'green' }}/>}
                    onClick={() => setOpenCollageDialog(true)} // פתיחת הדיאלוג במקום ניווט
                    sx={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#737373', 
                        whiteSpace: 'normal', 
                        textAlign: 'left', 
                        width: 'auto', 
                        marginBottom: 2 
                    }} 
                >
                    צור קולאז מתמונות האלבומים שלך
                </Button>

                <Button
                    variant="contained"
                    startIcon={<DeleteForeverIcon sx={{ color: 'red' }}/>} // אייקון סל המחזור
                    onClick={() => navigate(`/personal-area/tin-photo`)}
                    sx={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#737373', 
                        whiteSpace: 'normal', 
                        textAlign: 'left', 
                        width: 'auto', 
                        marginBottom: 2 
                    }} 
                >
                    סל המחזור
                </Button>
                <Button
                    variant="contained"
                    startIcon={<PhotoAlbumIcon sx={{ color: 'yellow' }}/>} // אייקון אלבום
                    onClick={() => navigate(`/personal-area/userAlbums`)}
                    sx={{ 
                        padding: '4px 8px', 
                        backgroundColor: '#737373', 
                        whiteSpace: 'normal', 
                        textAlign: 'left', 
                        width: 'auto', 
                        marginBottom: 2 
                    }} 
                >
                    האלבומים שלי
                </Button>
                <UserPhotosDialog
                    open={openCollageDialog}
                    onClose={() => setOpenCollageDialog(false)}
                />
            </div>

            <div style={{ flex: 1, marginRight: '250px' }}> {/* הוספת מרווח לסיידבר */}
                <Outlet />
            </div>
        </div>
    );
}

export default PersonalArea;
