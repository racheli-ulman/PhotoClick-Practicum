import { makeAutoObservable } from "mobx";
import { Album } from "../models/Album";
import api from "../components/api";
// import axios from "axios";

class AlbumStore {
  albums: Album[] = [];
  photos: any[] = []; // הוסף מערך עבור התמונות
  error: string | null = null;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
    this.baseUrl = import.meta.env.VITE_API_URL;
    // this.baseUrl = "http://localhost:5083/api"; // עדכון כאן

  }

  setAlbums(albums: Album[]) {
    this.albums = albums;
  }

  setPhotos(photos: any[]) { // הוסף פונקציה להגדיר תמונות
    this.photos = photos;
  }

  setError(error: string | null) {
    this.error = error;
  }

  async fetchAlbums(userId: number) {
    console.log("Fetching albums for user ID in Store:", userId);
    if (!userId) return; // אם לא קיים userId, אל תבצע שום דבר

    try {
      const response = await api.get(`/Album/user/${userId}`);
      this.setAlbums(response.data);
    } catch (err: any) {
      this.setError(err.message || "Error fetching albums");
      console.error("Error fetching albums:", err);
    }
  }

  async fetchPhotos(userId: number) { // הוסף את הפונקציה הזו
    console.log("Fetching photos for user ID in Store:", userId);
    if (!userId) return; // אם לא קיים userId, אל תבצע שום דבר

    try {
      const response = await api.get(`/Album/user/${userId}/photos`);
      this.setPhotos(response.data); // שמור את התמונות במערך
    } catch (err: any) {
      this.setError(err.message || "Error fetching photos");
      console.error("Error fetching photos:", err);
    }
  }

  async createAlbum(albumName: string, description: string, userId: number) {
    if (!albumName.trim()) {
      this.setError("Please enter a folder name");
      return;
    }

    const newAlbum = {
      userId,
      albumName: albumName.trim(),
      description: description.trim()
    };

    try {
      const response = await api.post(`/Album`, newAlbum);
      this.setAlbums([...this.albums, response.data]);
      this.setError(null);
    } catch (err: any) {
      this.setError(err.message || "Error creating album");
      console.error("Error creating album:", err);
    }
  }

  async updateAlbum(updatedAlbum: Album) {
    console.log("Updated album:", updatedAlbum);

    const albumToUpdate = {
      userId: updatedAlbum.userId,
      albumName: updatedAlbum.albumName,
      description: updatedAlbum.description
    };
    console.log("Album to update:", albumToUpdate);
    console.log("Album ID to update:", updatedAlbum.id);
    try {
      const response = await api.put(`/Album/${updatedAlbum.id}`, albumToUpdate);
      this.setAlbums(this.albums.map(album =>
        album.id === updatedAlbum.id ? response.data : album
      ));
    } catch (err: any) {
      this.setError(err.message || "Error updating album");
      console.error("Error updating album:", err);
    }
  }

  async deleteAlbum(albumId: number) {
    try {
      const response = await api.delete(`/Album/${albumId}`);
      if (response.status === 200) {
        this.setAlbums(this.albums.filter(album => album.id !== albumId));
      }
    } catch (err: any) {
      console.error("Error deleting album:", err);
      this.setError("Error deleting album.");
    }
  }


}




const albumStore = new AlbumStore();
export default albumStore;
