// import React, { createContext, useState, useContext, ReactNode } from "react";
// import { Album } from "../models/Album";

// // 🎯 נגדיר את ה-Context Interface (אובייקט ברירת מחדל)
// interface AlbumContextType {
//   albums: Album[];
//   saveAlbum: (album: Album) => void;
//   removeAlbum: (albumId: number) => void;
// }

// // 🎯 יצירת ה-Context עם ערכים ריקים כברירת מחדל
// export const AlbumContext = createContext<AlbumContextType>({
//   albums: [],
//   saveAlbum: () => {},
//   removeAlbum: () => {},
// });

// // 🎯 ספק הנתונים (Provider) - עוטף את האפליקציה
// export const AlbumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [albums, setAlbums] = useState<Album[]>([]);

//   // 🔹 פונקציה לשמירת אלבום
//   const saveAlbum = (album: Album) => {
//     setAlbums((prevAlbums) => [...prevAlbums, album]);
//     localStorage.setItem("albums", JSON.stringify([...albums, album])); // שומר בלוקאל סטורג'
//   };

//   // 🔹 פונקציה להסרת אלבום
//   const removeAlbum = (albumId: number) => {
//     const updatedAlbums = albums.filter(album => album.userId !== albumId);
//     setAlbums(updatedAlbums);
//     localStorage.setItem("albums", JSON.stringify(updatedAlbums));
//   };

//   return (
//     <AlbumContext.Provider value={{ albums, saveAlbum, removeAlbum }}>
//       {children}
//     </AlbumContext.Provider>
//   );
// };

// // 🎯 פונקציה מותאמת ל-Context לשימוש נוח יותר
// export const useAlbum = () => useContext(AlbumContext);