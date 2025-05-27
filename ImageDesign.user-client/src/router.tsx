// import { createBrowserRouter } from "react-router-dom";
// import Layout from "./components/AppLayot";
// import Signup from "./components/signup";

// export const Router = createBrowserRouter([
//     {
//         path: '/',
//         element: <Layout></Layout>,
//         children:[
//             { path: 'signup', element: <Signup /> }

//         ]
//     }])

import { createHashRouter } from "react-router-dom";
// import Signup from "./components/signup"
// import { UserContext, UserProvider, useUser } from "./context/userContext";
import PhotoUploader from "./components/FileUploader";
// import { Home, Login } from "@mui/icons-material";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Gggg from "./components/HomePage/Home";
import DeleteAlbum from "./components/DeleteAlbum";
import FileUploader from "./components/FileUploader";
import Register from "./components/Register";
import UserPhotosDialog from "./components/Collage/UserPhotos";
import PhotoGallery from "./components/PhotosGallery";
import TinPhoto from "./components/TinPhoto";
import PersonalArea from "./components/PersonalArea";
// import CollageCreatorPage from  "./components/Collage/CreateCollage";
import UserAlbums from "../src/components/UserAlbums/UserAlbums";
import CollageCreatorPage from "./components/Collage/collage-creator-page";
// import Sidbar from "./components/Sidbar";

// import CreateCollage from "./components/Collage/CreateCollage";
// import AddPhoto1 from "./components/AddPhoto";

export const Router = createHashRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: 'home', element: <Gggg></Gggg> },
            { index: true, element: <Gggg></Gggg> },
            // { path: 'signup', element: <Signup /> },
            { path: 'login', element: <Login /> },
            { path: "register", element: <Register /> },
            {
                path: "personal-area", element: <PersonalArea />,
                children: [
                    { path: 'userAlbums', element: <UserAlbums/> },
                    { index: true, element: <UserAlbums /> },
                    // { path: 'userAlbums', element: <UserAlbums /> },
                    { path: 'upload', element: <PhotoUploader /> },
                    { path: "delete-album/:albumId", element: <DeleteAlbum /> },
                    { path: "add-photo", element: <FileUploader /> },
                    { path: "get-photos/:albumId", element: <PhotoGallery /> },
                    { path: "all-photoes-of-user", element: <UserPhotosDialog open={true} onClose={() => { }} /> },
                    { path: "tin-photo", element: <TinPhoto /> },
                    { path: "create-collage", element: <CollageCreatorPage /> }, // הדף החדש לקולאז'


                ]
            },
            // {index:true,element:<userAlbums/>},
            // {index:true,element:<UserAlbums/>},

            // {path:"create-collage",element:<CreateCollage/>}
            // {path:'about',element:<AboutUs/>}
        ]

    }
]);