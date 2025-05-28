import { createHashRouter } from "react-router-dom";
import PhotoUploader from "./components/FileUploader";
import Layout from "./components/Layout";
import Login from "./components/Auth/Login";
import Gggg from "./components/HomePage/Home";
// import DeleteAlbum from "./components/DeleteAlbum";
import FileUploader from "./components/FileUploader";
import Register from "./components/Auth/Register";
import UserPhotosDialog from "./components/Collage/UserPhotos";
import PhotoGallery from "./components/PhotosGallery";
import TinPhoto from "./components/TinPhoto";
import PersonalArea from "./components/PersonalArea";
import UserAlbums from "../src/components/UserAlbums/UserAlbums";
import CollageCreatorPage from "./components/Collage/collage-creator-page";

export const Router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: 'home', element: <Gggg></Gggg> },
            { index: true, element: <Gggg></Gggg> },
            { path: 'login', element: <Login /> },
            { path: "register", element: <Register /> },
            {
                path: "personal-area", element: <PersonalArea />,
                children: [
                    { path: 'userAlbums', element: <UserAlbums/> },
                    { index: true, element: <UserAlbums /> },
                    { path: 'upload', element: <PhotoUploader /> },
                    // { path: "delete-album/:albumId", element: <DeleteAlbum /> },
                    { path: "add-photo", element: <FileUploader /> },
                    { path: "get-photos/:albumId", element: <PhotoGallery /> },
                    { path: "all-photoes-of-user", element: <UserPhotosDialog open={true} onClose={() => { }} /> },
                    { path: "tin-photo", element: <TinPhoto /> },
                    { path: "create-collage", element: <CollageCreatorPage /> }, // הדף החדש לקולאז'


                ]
            },
         
        ]

    }
]);