
import { makeAutoObservable } from "mobx";
import { Tag } from "../models/Tag";
// import axios from "axios";
import api from "../components/api";


class TagStore {
  albums: Tag[] = [];
  tags: Tag[] = [];
  // photos: any[] = []; // הוסף מערך עבור התמונות
  error: string | null = null;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
    // this.baseUrl = import.meta.env.VITE_API_URL;
    // this.baseUrl = "http://localhost:5083/api"; // עדכון כאן
        this.baseUrl = import.meta.env.VITE_API_URL;


  }

  setError(error: string | null) {
    this.error = error;
  }


  async fetchTagsById(tagId: number) {
    console.log("Fetching tag name for tag ID in Store:", tagId);
    if (!tagId) return; // אם לא קיים tagId, אל תבצע שום דבר

    try {
      const response = await api.get(`${this.baseUrl}/Tag/${tagId}`);
      console.log("response", response);

    } catch (err: any) {
      this.setError(err.message || "Error fetching tag");
      console.error("Error fetching tag:", err);

    }
  }



async addTag(tagName: string): Promise<Tag | null> {
    try {
      const response = await api.post<Tag>(`${this.baseUrl}/Tag`, { tagName })
      this.tags.push(response.data) // Add the new tag to the store's list
      this.setError(null)
      return response.data
    } catch (err: any) {
      this.setError(err.message || "Error adding new tag")
      console.error("Error adding new tag:", err)
      return null
    }
  }



}
const tagStore = new TagStore();
export default tagStore;