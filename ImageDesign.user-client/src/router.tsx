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

import { createBrowserRouter } from "react-router-dom";
// import Signup from "./components/signup"
import UserAlbums from "./components/UserAlbums";
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
// import Sidbar from "./components/Sidbar";

// import CreateCollage from "./components/Collage/CreateCollage";
// import AddPhoto1 from "./components/AddPhoto";

export const Router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: 'home', element: <Gggg></Gggg> },
            { index: true, element: <Gggg></Gggg> },
            // { path: 'signup', element: <Signup /> },
            { path: 'login', element: <Login /> },
            {path:"register",element:<Register/>},
            {path:"personal-area",element:<PersonalArea/>,
                children:[
                    { path: 'userAlbums', element: <UserAlbums /> },
                    {index:true,element:<UserAlbums/>},
                    // { path: 'userAlbums', element: <UserAlbums /> },
                    { path: 'upload', element: <PhotoUploader /> },
                    { path: "delete-album/:albumId", element: <DeleteAlbum /> },
                    { path: "add-photo", element: <FileUploader/> },
                    {path:"get-photos/:albumId",element:<PhotoGallery/>},
                    {path:"all-photoes-of-user",element:<UserPhotosDialog open={true} onClose={() => {}} />},
                    {path:"tin-photo",element:<TinPhoto/>},
                    
                    
                ]
            },
            // {index:true,element:<userAlbums/>},
            // {index:true,element:<UserAlbums/>},
            
            // {path:"create-collage",element:<CreateCollage/>}
            // {path:'about',element:<AboutUs/>}
        ]

    }
]);