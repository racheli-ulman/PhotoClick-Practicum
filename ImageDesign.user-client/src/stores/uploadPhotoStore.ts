import { makeAutoObservable } from "mobx";
import axios from "axios";

class PhotoUploadStore {
    progress = 0;
    imageUrl = null;
    isUploading = false;
    error = null;
    baseUrl: string;

    constructor() {
        makeAutoObservable(this);
        this.baseUrl = import.meta.env.VITE_API_URL;
    // this.baseUrl = "http://localhost:5083/api"; // עדכון כאן

    }

    async uploadFile(file: any) {
        this.error = null;
        this.isUploading = true;
        this.progress = 0;

        try {
            // שלב 1: קבלת Presigned URL מהשרת
            console.log("file.name ", file.name);
            const response = await axios.get(`${this.baseUrl}/Upload/presigned-url`, {
                params: { fileName: file.name }
            });
            const presignedUrl = response.data.url;

            // שלב 2: העלאת הקובץ ישירות ל-S3
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    this.progress = percent;
                    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");

                },
            });

            // קבלת URL של התמונה
            console.log("file.name ", file.name);

            const url = await this.getImageUrl(file.name);
            this.imageUrl = url;
            console.log("this.imageUrl ", this.imageUrl);

        } catch (error: any) {
            this.error = error.message;
        } finally {
            this.isUploading = false;
        }
    }

    async getImageUrl(fileName: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/Download/download-url/${fileName}`);
            return response.data;
        } catch (error: any) {
            this.error = error.message;
        }
    }
}

const photoUploadStore = new PhotoUploadStore();
export default photoUploadStore;