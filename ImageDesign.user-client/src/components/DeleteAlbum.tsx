// import { useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { observer } from "mobx-react-lite";
// import albumStore from "../stores/albumStore";

// const DeleteAlbum: React.FC = () => {
//   const { albumId } = useParams<{ albumId: string }>();
//   const navigate = useNavigate();
//   const hasDeleted = useRef(false);  // דגל כדי לוודא שהאפקט רץ רק פעם אחת

//   useEffect(() => {
//     const deleteAlbum = async () => {
//       if (!albumId || hasDeleted.current) return;

//       try {
//         const albumIdNumber = Number(albumId);
//         console.log(`Attempting to delete album with ID: ${albumIdNumber}`);

//         // בדוק אם האלבום קיים לפני מחיקה
//         const albumExists = albumStore.albums.some(album => album.id === albumIdNumber);
//         if (!albumExists) {
//           console.error("Album not found in the system");
//           navigate("/userAlbums");
//           return;
//         }

//         await albumStore.deleteAlbum(albumIdNumber);
//         navigate("/userAlbums"); // נווט לדף האלבומים
//         hasDeleted.current = true;  // הגדר את הדגל לאחר מחיקה מוצלחת
//       } catch (err: any) {
//         console.error("Error deleting album:", err.message);
//         navigate("/userAlbums"); // נווט לדף האלבומים גם במקרה של שגיאה
//         hasDeleted.current = true;  // הגדר את הדגל כדי למנוע ניסיונות נוספים
//       }
//     };

//     deleteAlbum(); // קריאה לפונקציה כאן
//   }, [albumId, navigate]);

//   return <div>Deleting album... Please wait</div>;
// };

// export default observer(DeleteAlbum);
