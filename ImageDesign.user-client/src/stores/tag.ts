
import { makeAutoObservable } from "mobx";
import { Tag } from "../models/Tag";
import axios from "axios";

class TagStore {
  albums: Tag[] = [];
  // photos: any[] = []; // הוסף מערך עבור התמונות
  error: string | null = null;
  baseUrl: string;

  constructor() {
    makeAutoObservable(this);
    this.baseUrl = import.meta.env.VITE_API_URL;

  }

  setError(error: string | null) {
    this.error = error;
  }


  async fetchTagsById(tagId: number) {
    console.log("Fetching tag name for tag ID in Store:", tagId);
    if (!tagId) return; // אם לא קיים tagId, אל תבצע שום דבר

    try {
      const response = await axios.get(`${this.baseUrl}/Tag/${tagId}`);
      console.log("response", response);

    } catch (err: any) {
      this.setError(err.message || "Error fetching tag");
      console.error("Error fetching tag:", err);

    }
  }
}
const tagStore = new TagStore();
export default tagStore;