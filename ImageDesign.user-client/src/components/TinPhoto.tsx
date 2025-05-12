import React, { useEffect } from 'react';
import { observer } from "mobx-react-lite";
import photoUploadStore from '../stores/photoUploaderStore';
import { Restore, DeleteForever, ZoomIn } from '@mui/icons-material';
import './TinPhoto.css'; // נייבא קובץ CSS נפרד

const TinPhoto: React.FC = observer(() => {
    const userData = sessionStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const userId = user ? user.user.id : null;
    
    // State for zoom modal
    const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            photoUploadStore.fetchRecyclingPhotos(userId);
        }
    }, [userId]);

    // Handle permanent delete function
    const handlePermanentDelete = async (photoId: number) => {
        console.log(photoId);
        
        if (window.confirm('האם אתה בטוח שברצונך למחוק לצמיתות את התמונה?')) {
            await photoUploadStore.deletePhoto(photoId);
            
            // עדכון הסטייט כדי להסיר את התמונה שנמחקה
            photoUploadStore.recyclingPhotos = photoUploadStore.recyclingPhotos.filter(photo => photo.id !== photoId);
        }
    };

    // Handle restore photo
    const handleRestorePhoto = async (photoId: number) => {
        await photoUploadStore.restorePhoto(photoId);
    };

    // Handle image zoom
    const handleImageClick = (photoPath: string) => {
        setSelectedPhoto(photoPath);
    };

    // Close the zoom modal
    const closeModal = () => {
        setSelectedPhoto(null);
    };

    if (photoUploadStore.error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h3>שגיאה</h3>
                    <p>{photoUploadStore.error}</p>
                </div>
            </div>
        );
    }

    const deletedPhotos = photoUploadStore.recyclingPhotos;

    if (deletedPhotos.length === 0) {
        return (
            <div className="empty-trash-container">
                <div className="empty-trash-message">
                    <img 
                        src="/assets/empty-trash.svg" 
                        alt="Empty Trash" 
                        className="empty-trash-icon"
                    />
                    <h3>סל המחזור ריק</h3>
                    <p>לא נמצאו תמונות בסל המחזור</p>
                </div>
            </div>
        );
    }

    return (
        <div className="trash-container">
            <div className="trash-header">
                <h2>סל המחזור</h2>
                {/* <p>תמונות נשמרות בסל המחזור למשך 30 יום לפני מחיקה סופית</p> */}
            </div>

            <div className="photo-grid">
                {deletedPhotos.map((photo, index) => (
                    <div key={`${photo.id}-${index}`} className="photo-card">
                        <div className="photo-container">
                            <img 
                                src={photo.photoPath} 
                                alt={photo.photoName} 
                                onClick={() => photo.photoPath && handleImageClick(photo.photoPath)}
                            />
                            <div className="photo-overlay">
                                <ZoomIn className="zoom-icon" onClick={() => photo.photoPath && handleImageClick(photo.photoPath)} />
                            </div>
                        </div>
                        <div className="photo-info">
                            <p className="photo-name">{photo.photoName}</p>
                            {/* <p className="photo-date">נמחק: {new Date(photo.deletedAt).toLocaleDateString('he-IL')}</p> */}
                        </div>
                        <div className="photo-actions">
                            <button 
                                className="action-button restore-button"
                                onClick={() => handleRestorePhoto(photo.id!)}
                                title="שחזור תמונה"
                            >
                                <Restore />
                                <span>שחזור</span>
                            </button>
                            <button 
                                className="action-button delete-button"
                                onClick={() => handlePermanentDelete(photo.id!)}
                                title="מחיקה סופית"
                            >
                                <DeleteForever />
                                <span>מחיקה</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for zoomed image */}
            {selectedPhoto && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedPhoto} alt="Zoomed photo" />
                        <button className="close-modal" onClick={closeModal}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default TinPhoto;