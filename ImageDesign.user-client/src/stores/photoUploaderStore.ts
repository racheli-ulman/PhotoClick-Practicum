// // stores/photoUploadStore.ts
// import { makeAutoObservable } from "mobx";
// import axios from "axios";
// import { Photo } from "../models/Photo";

// class PhotoUploadStore {
//   file: File | null = null;
//   progress: number = 0;
//   imageUrl: string | null = null;
//   error: string | null = null;
//   tags: string[] = ["נוף", "חיות", "עוגות"]; // רשימת התיוגים

//   constructor() {
//     makeAutoObservable(this);
//   }

//   setFile(file: File) {
//     this.file = file;
//   }

//   setProgress(progress: number) {
//     this.progress = progress;
//   }

//   setImageUrl(url: string) {
//     this.imageUrl = url;
//   }

//   setError(error: string) {
//     this.error = error;
//   }

//   async uploadFile(selectedFile: File, userId: number, albumId: number, selectedTag: string) {
//     if (!selectedFile) return;

//     try {
//       const response = await axios.get('http://localhost:5083/api/upload/presigned-url', {
//         params: { fileName: selectedFile.name },
//       });
//       const presignedUrl = response.data.url;

//       await axios.put(presignedUrl, selectedFile, {
//         headers: {
//           'Content-Type': selectedFile.type,
//         },
//         onUploadProgress: (progressEvent) => {
//           const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
//           this.setProgress(percent);
//         },
//       });

//       const photo: Photo = {
//         UserId: userId,
//         PhotoName: selectedFile.name,
//         AlbumId: albumId,
//         PhotoPath: presignedUrl, // נשתמש ב-URL של התמונה שהועלתה
//         PhotoSize: selectedFile.size,
//         tags: [selectedTag], // נשתמש בתג שנבחר על ידי המשתמש
//       };

//       await this.addPhoto(photo);
//       this.setImageUrl(presignedUrl);
//       this.setError("");
//     } catch (error) {
//       console.error('שגיאה בהעלאה:', error);
//       this.setError('התרחשה שגיאה במהלך העלאת הקובץ.');
//     }
//   }

//   async addPhoto(photo: Photo) {
//     try {
//       await axios.post('http://localhost:5083/api/photos', photo);
//     } catch (error) {
//       console.error('שגיאה בהוספת התמונה:', error);
//     }
//   }

//   async getImageUrl(fileName: string) {
//     try {
//       const response = await axios.get(`http://localhost:5083/api/Download/download-url/${fileName}`);
//       return response.data;
//     } catch (error) {
//       console.error('שגיאה בהבאת ה-URL:', error);
//       return null;
//     }
//   }
// }

// const photoUploadStore = new PhotoUploadStore();
// export default photoUploadStore;












// import { makeAutoObservable } from "mobx";
// import axios from "axios";
// import { Photo } from "../models/Photo";
// import userStore from './userStore';

// class PhotoUploadStore {
//     file: File | null = null;
//     progress: number = 0;
//     imageUrl: string | null = null;
//     error: string | null = null;
//     tags: { id: number, tagName: string }[] = []; // רשימת התיוגים

//     constructor() {
//         makeAutoObservable(this);
//         this.fetchTags(); // קריאת התיוגים מהשרת בעת יצירת האובייקט
//     }

//     setFile(file: File) {
//         this.file = file;
//     }

//     setProgress(progress: number) {
//         this.progress = progress;
//     }

//     setImageUrl(url: string) {
//         this.imageUrl = url;
//     }

//     setError(error: string) {
//         this.error = error;
//     }

//     async fetchTags() {
//         try {
//             const response = await axios.get('http://localhost:5083/api/Tag');
//             this.tags = response.data;
//         } catch (error) {
//             console.error('שגיאה בקבלת התיוגים:', error);
//             this.setError('שגיאה בקבלת התיוגים.');
//         }
//     }

//     async uploadFile(selectedFile: File, albumId: number, tags: string[]) {
//         if (!selectedFile) return;

//         try {
//             const response = await axios.get('http://localhost:5083/api/upload/presigned-url', {
//                 params: { fileName: selectedFile.name },
//             });
//             const presignedUrl = response.data.url;

//             await axios.put(presignedUrl, selectedFile, {
//                 headers: {
//                     'Content-Type': selectedFile.type,
//                 },
//                 onUploadProgress: (progressEvent) => {
//                     const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
//                     this.setProgress(percent);
//                 },
//             });

//             const userId = userStore.user?.user?.id ?? null;
//             console.log("albumId in upload ", selectedFile.size);

//             const photoPath = await this.getImageUrl(selectedFile.name);
//             const photo: Photo = {
//                 UserId: userId,
//                 PhotoName: selectedFile.name,
//                 AlbumId: albumId,
//                 PhotoPath: photoPath,
//                 PhotoSize: selectedFile.size,
//                 tags: tags,
//             };
//             console.log("checking1");

//             await this.addPhoto(userId,selectedFile.name,albumId,photoPath,selectedFile.size,
//                 tags
//             );
//             console.log("checking2");

//             this.setError("");
//         } catch (error) {
//             console.error('שגיאה בהעלאה:', error);
//             this.setError('התרחשה שגיאה במהלך העלאת הקובץ.');
//         }
//     }

//     async getImageUrl(fileName: string) {
//         try {
//             const response = await axios.get(`http://localhost:5083/api/Download/download-url/${fileName}`);
//             return response.data;
//         } catch (error) {
//             console.error('שגיאה בהבאת ה-URL:', error);
//             return null;
//         }
//     }

//     async addPhoto(userId:number,photoName:string,albumId:number,photoPath:string
//         ,photoSize:number,tag:string[]
//     ) {
//         console.log("userId ",userId);

//         try {
//             console.log("checking addd");
//             // console.log(photo);

//             await axios.post('http://localhost:5083/api/Photo',{
//                 userId,photoName,albumId,photoPath
//         ,photoSize,tag
//             } );
//         } catch (error) {
//             console.log("erorrrrrrrrr");

//             console.error('שגיאה בהוספת התמונה:', error);
//             this.setError('התרחשה שגיאה במהלך הוספת התמונה.');
//         }
//     }
// }

// const photoUploadStore = new PhotoUploadStore();
// export default photoUploadStore;

import { makeAutoObservable } from "mobx";
import axios from "axios";
import userStore from './userStore';
import { Photo } from "../models/Photo";
import { Tag } from "../models/Tag";

class PhotoUploadStore {
    file: File | null = null;
    progress: number = 0;
    imageUrl: string | null = null;
    error: string | null = null;
    // tag: { id: number, tagName: string }[] = []; // מערך של אובייקטים עם ID ושם התג
    tag: Tag[] = []; // מערך של אובייקטים עם ID ושם התג
    photos: Photo[] = []; // מערך של תמונות
    recyclingPhotos: Photo[] = []; // מערך של תמונות שנמחקו
    baseUrl: string;


    constructor() {
        makeAutoObservable(this);
        // קריאת התיוגים מהשרת בעת יצירת האובייקט
        // this.baseUrl = import.meta.env.VITE_API_URL;
        this.baseUrl = "http://localhost:5083/api"; // עדכון כאן

        this.fetchTags();
    }

    setFile(file: File | null) {
        this.file = file;
    }

    setProgress(progress: number) {
        this.progress = progress;
    }

    setImageUrl(url: string) {
        this.imageUrl = url;
    }

    setError(error: string) {
        this.error = error;
    }

    async fetchTags() {
        console.log("baseUrl ", this.baseUrl);

        try {
            const response = await axios.get(`${this.baseUrl}/Tag`);
            this.tag = response.data; // השאר את זה כמו שזה אם אתה רוצה לשמור את התגים
        } catch (error) {
            console.error('שגיאה בקבלת התיוגים:', error);
            this.setError('שגיאה בקבלת התיוגים.');
        }
    }

    async fetchPhotosByAlbumId(albumId: number) {
        try {
            console.log(albumId);
            const response = await axios.get(`${this.baseUrl}/Photo/photo/album/${albumId}`);
            this.photos = response.data;
            console.log("images ", this.photos);
            console.log("response", response);

            if (response == null)
                alert("אין תמונות להצגה");
        } catch (error) {
            console.error('שגיאה בקבלת התמונות:', error);
            this.setError('שגיאה בקבלת התמונות.');
        }
        return this.photos.length;
    }

    async deletePhoto(photoId: number) {
        console.log("photoId in deletePhoto: ", photoId);

        try {
            await axios.delete(`${this.baseUrl}/Photo/${photoId}`);
            console.log("photoId ", photoId);

            this.photos = this.photos.filter(photo => photo.id !== photoId);
            // אם יש צורך, תוכל לקרוא שוב ל-fetchPhotosByAlbumId כאן
        } catch (error: any) {
            console.error('שגיאה במחיקת התמונה:', error);
            this.setError('התרחשה שגיאה במהלך מחיקת התמונה.');
        }
    }

    // New method to copy photo to another album
    async copyPhotoToAlbum(photoId: number, targetAlbumId: number) {
        try {
            // Call the API to copy the photo
            const response = await axios.post(
                `${this.baseUrl}/Photo/copy/${photoId}/to-album/${targetAlbumId}`
            );
            console.log("Photo copied successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.error('שגיאה בהעתקת התמונה:', error);
            this.setError('התרחשה שגיאה במהלך העתקת התמונה.');
            throw error;
        }
    }

    // New method to move photo from one album to another
    async movePhotoToAlbum(photoId: number, sourceAlbumId: number, targetAlbumId: number) {
        try {
            // Call the API to move the photo
            const response = await axios.put(
                `${this.baseUrl}/Photo/move/${photoId}/from-album/${sourceAlbumId}/to-album/${targetAlbumId}`
            );
            console.log("Photo moved successfully:", response.data);
            return response.data;
        } catch (error: any) {
            console.error('שגיאה בהעברת התמונה:', error);
            this.setError('התרחשה שגיאה במהלך העברת התמונה.');
            throw error;
        }
    }

    // Method to copy all photos from one album to another
    // async copyAllPhotosToAlbum(sourceAlbumId: number, targetAlbumId: number) {
    //     try {
    //         // Call the API to copy all photos
    //         const response = await axios.post(
    //             `http://localhost:5083/api/Photo/copy-all/from-album/${sourceAlbumId}/to-album/${targetAlbumId}`
    //         );
    //         console.log("All photos copied successfully:", response.data);
    //         return response.data;
    //     } catch (error: any) {
    //         console.error('שגיאה בהעתקת כל התמונות:', error);
    //         this.setError('התרחשה שגיאה במהלך העתקת כל התמונות.');
    //         throw error;
    //     }
    // }

    // // Method to move all photos from one album to another
    // async moveAllPhotosToAlbum(sourceAlbumId: number, targetAlbumId: number) {
    //     try {
    //         // Call the API to move all photos
    //         const response = await axios.put(
    //             `http://localhost:5083/api/Photo/move-all/from-album/${sourceAlbumId}/to-album/${targetAlbumId}`
    //         );
    //         console.log("All photos moved successfully:", response.data);
    //         return response.data;
    //     } catch (error: any) {
    //         console.error('שגיאה בהעברת כל התמונות:', error);
    //         this.setError('התרחשה שגיאה במהלך העברת כל התמונות.');
    //         throw error;
    //     }
    // }

    async uploadFile(selectedFile: File, albumId: number, tagId: number | null) { // שינינו ל-tagId
        if (!selectedFile) return;

        try {
            const response = await axios.get(`${this.baseUrl}/upload/presigned-url`, {
                params: { fileName: selectedFile.name },
            });
            const presignedUrl = response.data.url;

            await axios.put(presignedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                    this.setProgress(percent);
                },
            });

            const userId = userStore.user?.user?.id ?? null;

            const downloadUrl = await this.getDownloadUrl(selectedFile.name)
            // if (downloadUrl != null) {

            const data = {
                userId: userId,
                photoName: selectedFile.name,
                albumId: albumId,
                photoPath: downloadUrl?.toString() || "", // נשתמש ב-URL של התמונה שהועלתה
                photoSize: selectedFile.size,
                tagId: tagId, // הוספת ה-ID של התג

            };
            console.log("data being sent: ", data); // לוג של הנתונים

            if (data.photoPath) {
                if (data.photoPath) {
                    await this.addPhoto(data);
                } else {
                    this.setError('התרחשה שגיאה: נתיב התמונה אינו תקין.');
                }
            } else {
                this.setError('התרחשה שגיאה: נתיב התמונה אינו תקין.');
            }
            if (downloadUrl) {
                this.setImageUrl(downloadUrl);
            }
            this.setError("");
            // }
            // console.log("photoPath ",photoPath);

        } catch (error) {
            console.error('שגיאה בהעלאה:', error);
            this.setError('התרחשה שגיאה במהלך העלאת הקובץ.');
        }
    }

    async addPhoto(data: { userId: number | null, photoName: string, albumId: number, photoPath: string, photoSize: number, tagId: number | null }) { // שינינו ל-tagId

        try {
            await axios.post(`${this.baseUrl}/Photo`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error: any) {
            if (error == "there is photo in this album whith the same name please change name")
                alert("אנא שנה אץ שם התמונה לפני ההעלאה");
            console.error('שגיאה בהוספת התמונה:', error);
            console.error('תוכן השגיאה:', error.response?.data);
            this.setError('התרחשה שגיאה במהלך הוספת התמונה.');
        }
    }

    async getDownloadUrl(fileName: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/Download/download-url/${fileName}`);

            // בדיקה שהתגובה מהשרת מכילה URL תקין
            if (response.data && typeof response.data === 'string' && response.data.startsWith('http')) {
                return response.data;
            } else {
                console.error('התקבלה תגובה לא תקינה מהשרת:', response.data);
                this.setError('התקבל URL לא תקין להורדה.');
                return null;
            }
        } catch (error) {
            console.error('שגיאה בקבלת URL להורדה:', error);
            this.setError('שגיאה בקבלת URL להורדה.');
            return null;
        }
    }


    async fetchRecyclingPhotos(userId: number) {
        console.log("userId in fetchRecyclingPhotos: ", userId);

        try {
            const response = await axios.get(`${this.baseUrl}/Photo/Recycling-photos/user/${userId}`);
            this.recyclingPhotos = response.data; // שמירה של התמונות שנמחקו
            console.log("Recycling photos response: ", response.data);

            console.log("Recycling photos: ", this.recyclingPhotos);
        } catch (error) {
            console.error('שגיאה בקבלת התמונות שנמחקו:', error);
            this.setError('שגיאה בקבלת התמונות שנמחקו.');
        }
    }


    //שחזור תמונה
    async restorePhoto(photoId: number) {
        try {
            const response = await axios.post(`${this.baseUrl}/Photo/restore/photo/${photoId}`);
            console.log("Photo restored successfully:", response.data);
            // אם יש צורך, תוכל לעדכן את המערך של recyclingPhotos או לבצע קריאה מחדש ל-fetchRecyclingPhotos
            await this.fetchRecyclingPhotos(userStore.user?.user?.id); // עדכון המערך של התמונות שנמחקו
        } catch (error: any) {
            console.error('שגיאה בשחזור התמונה:', error);
            this.setError('התרחשה שגיאה במהלך שחזור התמונה.');
        }
    }




    // async fetchPhotosByTag(tagName: string) {
    //     const tag = this.tag.find(t => t.tagName === tagName); // חיפוש ה-ID של התג לפי השם
    //     if (tag) {
    //         try {
    //             const response = await axios.get(`${this.baseUrl}/Photo/tag/${tag.Id}`); // הנחה שיש API שמחזיר תמונות לפי ID של תג
    //             this.photos = response.data; // עדכון המערך של התמונות
    //         } catch (error) {
    //             console.error('שגיאה בקבלת התמונות לפי תג:', error);
    //             this.setError('שגיאה בקבלת התמונות לפי תג.');
    //         }
    //     } else {
    //         console.error('תג לא נמצא');
    //         this.setError('תג לא נמצא.');
    //     }
    // }


    async fetchTagIdByTagName(tagName: string): Promise<number | null> {
        try {
            const response = await axios.get(`${this.baseUrl}/Tag/name/${tagName}`);
            return response.data.id; // הנחה שה-API מחזיר אובייקט עם ID
        } catch (error) {
            console.error('שגיאה בקבלת ID של תג:', error);
            this.setError('שגיאה בקבלת ID של תג.');
            return null;
        }

    }



    async fetchPhotosByTag(tagId: number) {
        try {
            const response = await fetch(`/api/Photo/tag/${tagId}`) // הנחה על ה-API שלך
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            const data = await response.json()
            console.log("data", data);

            this.photos = data.photos // הנחה שהנתונים מגיעים במבנה הזה
        } catch (error) {
            console.error("Error fetching photos by tag:", error)
        }
    }

}

const photoUploadStore = new PhotoUploadStore();
export default photoUploadStore;