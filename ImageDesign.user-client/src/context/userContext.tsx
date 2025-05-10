// import React, { createContext, useState, useContext, ReactNode } from "react";
// import { User } from "../models/user";

// // 🎯 נגדיר סוג (Type) לנתוני המשתמש

// // 🎯 נגדיר את ה-Context Interface (אובייקט ברירת מחדל)
// interface UserContextType {
//   user: User | null;
//   saveUser: (userData: User) => void;
//   logout: () => void;
// }

// // 🎯 יצירת ה-Context עם ערכים ריקים כברירת מחדל
// export const UserContext = createContext<UserContextType>({
//   user: null,
//   saveUser: () => {},
//   logout: () => {},
// });

// // 🎯 ספק הנתונים (Provider) - עוטף את האפליקציה
// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // 🔹 פונקציה לשמירת המשתמש
//   const saveUser = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData)); // שומר בלוקאל סטורג'
//   };

//   // 🔹 פונקציה להתנתקות
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <UserContext.Provider value={{ user, saveUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // 🎯 פונקציה מותאמת ל-Context לשימוש נוח יותר
// export const useUser = () => useContext(UserContext);