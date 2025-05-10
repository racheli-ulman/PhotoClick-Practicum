// // components/AddPhoto1.js
// import React, { useEffect } from "react";
// import { observer } from "mobx-react-lite";
// import photoStore from "../stores/photoStore";

// const AddPhoto1 = ({ albumId }) => {
//     useEffect(() => {
//         photoStore.fetchImages(albumId);
//     }, [albumId]);

//     const handleUpload = async (event:any) => {
//         const file = event.target.files[0];
//         if (!file) return;

//         const photoData = {
//             UserId: userId,
//             PhotoName: file.name,
//             AlbumId: albumId,
//             PhotoPath: "", // נתיב התמונה (אם יש)
//             PhotoSize: file.size,
//             tag: "", // תגים אם יש
//         };

//         try {
//             await photoStore.uploadPhoto(photoData);
//             await photoStore.fetchImages(albumId); // רענן את התמונות
//         } catch (error) {
//             console.error('Error uploading photo:', error);
//         }
//     };

//     return (
//         <>
//             <h2>תמונות באלבום {albumId}</h2>
//             {photoStore.loading && <div>Loading...</div>}
//             {photoStore.error && <div>Error: {photoStore.error}</div>}
//             <div>
//                 {photoStore.images.map((image) => (
//                     <div key={image.Id}>
//                         <img src={image.PhotoPath} alt={image.PhotoName} />
//                         <p>{image.PhotoName}</p>
//                     </div>
//                 ))}
//             </div>
//             <input type="file" onChange={handleUpload} />
//             <button>העלה תמונה</button>
//         </>
//     );
// };

// export default observer(AddPhoto1);
