import { makeAutoObservable } from "mobx";
import axios from "axios";
import api from "../components/api";


class UserStore {

  user: any = null;
  error: string | null = null;
  baseUrl: string;
  constructor() {
    makeAutoObservable(this);
    this.loadUserFromSession();
     this.baseUrl =import.meta.env.VITE_API_URL;
    // this.baseUrl = "http://localhost:5083/api"; // עדכון כאן

  }

  setUser(user: any) {
    this.user = user;
    sessionStorage.setItem("user", JSON.stringify(user)); // שמירה ב-sessionStorage
  }

  setError(error: string | null) {
    this.error = error;
  }

  loadUserFromSession() {
    const user = sessionStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    }
  }

  async login(email: string, password: string) {
    console.log("llllllllllllllllogin function called", this.baseUrl);

    try {
      this.logout(); // התנתקות מהמשתמש הקודם
      console.log("email", email); // הדפסת המייל והסיסמה לקונסולה
      console.log("password", password); // הדפסת המייל והסיסמה לקונסולה
      console.log("login function called"); // הדפסת המייל והסיסמה לקונסולה


      const response = await axios.post(`${this.baseUrl}/Auth/login`, { email, password });

      this.setUser(response.data); // שמירה ב-sessionStorage
      this.setError(null);
    } catch (err: any) {
      this.setError(err.message || "Error logging in");
    }
  }


  //   async login(email: string, password: string) {
  //     try {
  //         const response = await axios.post("http://localhost:5083/api/Auth/login", { email, password });
  //         this.setUser(response.data); // שמירה ב-sessionStorage
  //         this.setError(null);
  //         return { success: true, user: response.data }; // החזרת אובייקט עם הצלחה
  //     } catch (err: any) {
  //         this.setError(err.message || "Error logging in");
  //         return { success: false, error: this.error }; // החזרת אובייקט עם שגיאה
  //     }
  // }



  async register(firstName: string, lastName: string, email: string, password: string, roleName: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/Auth/register`, {
        firstName,
        lastName,
        email,
        password,
        roleName, // תפקיד שנבחר על ידי המשתמש
      });
      this.setUser(response.data); // שמירה ב-sessionStorage
      this.setError(null);
    } catch (err: any) {
      this.setError(err.message || "Error registering user");
    }
  }


  async updateUser(firstName: string, lastName: string, email: string) {
    try {
      console.log("userStore.user.user.id ", this.user.user.id);
      
      const response = await api.put(`${this.baseUrl}/User/${this.user.user.id}`, {
        firstName,
        lastName,
        email,
        password:this.user.user.password, // שמירה על הסיסמה הקיימת
      });
      this.setUser(response.data); // עדכון המשתמש בסטור
      this.setError(null);
    } catch (err: any) {
      this.setError(err.message || "Error updating user");
    }
  }




  logout() {
    this.user = null;
    sessionStorage.removeItem("user"); // הסרת המשתמש מה-sessionStorage
  }
}

const userStore = new UserStore();
export default userStore;
