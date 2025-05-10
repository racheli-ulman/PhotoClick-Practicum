

// import React, { useState } from "react";
// import { Box, Button, TextField, Typography, Paper } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useUser } from "../context/userContext";
// import axios from "axios";
// import { User } from "../models/user";

// interface SignupForm {
//     firstName: string;
//     lastName: string;
//     password: string;
//     email: string;
//     roleName: string;
//     // id?: number;
// }

// const SignUp = () => {
//     const { register, handleSubmit, formState: { errors, isValid } } = useForm<SignupForm>({ mode: "onChange" });
//     const [msg, setMsg] = useState<string>("");
//     const [loading, setLoading] = useState<boolean>(false);
//     const { saveUser } = useUser();
//     const navigate = useNavigate();

//     const onSend = async (data: SignupForm) => {
//         setLoading(true);
//         setMsg("");

//         try {
//             const res = await axios.post(
//                 "http://localhost:5083/api/Auth/register",
//                 data,
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             if (res.data && res.data.Id) {
//                 setMsg("ההרשמה בוצעה בהצלחה! 🎉");
//                 saveUser(res.data); // שמירת המשתמש ב-Context
//                 navigate("/");
//             } else {
//                 setMsg("שגיאה בהרשמה. נסה שוב.");
//             }
//         } catch (error: any) {
//             if (error.response) {
//                 setMsg("😜לחץ כאן לכניסה אתה כבר רשום במאגר");
//                 //navigate("/profile"); 
//             } else {
//                 setMsg("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Box
//                 sx={{
//                     position: "fixed", // קיבוע ה-Box למסך
//                     top: 0,
//                     left: 0,
//                     height: "100vh", // כיסוי מלא של הגובה
//                     width: "100vw", // כיסוי מלא של הרוחב
//                     display: "flex",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: "rgba(255, 255, 255, 0.5)", // רקע שקוף למחצה כדי לא להסתיר את תמונת הרקע
//                     overflow: "hidden", // מניעת גלילה
//                 }}
//             >
//                 <Paper
//                     elevation={3}
//                     sx={{
//                         padding: 3, // הקטנת הפדינג
//                         borderRadius: "12px",
//                         backgroundColor: "rgba(255, 255, 255, 0.8)", // מסגרת לבנה אלגנטית עם שקיפות
//                         width: "350px", // הקטנת הרוחב
//                         textAlign: "center",
//                         boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // צל עדין למראה מקצועי
//                         overflow: "auto", // אפשרות לגלילה בתוך ה-Paper
//                         maxHeight: "90vh", // הגבלת הגובה של ה-Paper כדי לאפשר גלילה
//                     }}
//                 >
//                     <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
//                         הרשמה
//                     </Typography>
//                     <Box component="form" noValidate onSubmit={handleSubmit(onSend)} sx={{ mt: 1 }}>
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="שם משתמש"
//                             {...register("firstName", { required: "שדה חובה" })}
//                             error={Boolean(errors.firstName)}
//                             helperText={errors.firstName?.message}
//                         />
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="סיסמה"
//                             type="password"
//                             {...register("password", { required: "שדה חובה" })}
//                             error={Boolean(errors.password)}
//                             helperText={errors.password?.message}
//                         />
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="שם משפחה"
//                             {...register("lastName", { required: "שדה חובה" })}
//                             error={Boolean(errors.lastName)}
//                             helperText={errors.lastName?.message}
//                         />
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="תפקיד"
//                             {...register("roleName", { required: "שדה חובה" })}
//                             error={Boolean(errors.roleName)}
//                             helperText={errors.roleName?.message}
//                         />
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="אימייל"
//                             {...register("email", { required: "שדה חובה" })}
//                             error={Boolean(errors.email)}
//                             helperText={errors.email?.message}
//                         />
//                         {/* <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="מזהה ייחודי"
//                             {...register("id", { required: "שדה חובה" })}
//                             error={Boolean(errors.id)}
//                             helperText={errors.id?.message}
//                         /> */}
//                         <Button
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             sx={{ mt: 3, mb: 2, backgroundColor: "#000000", "&:hover": { backgroundColor: "#333333" } }}
//                             type="submit"
//                             disabled={!isValid || loading}
//                         >
//                             {loading ? "ביצוע הרשמה..." : "הרשמה"}
//                         </Button>
//                         {msg === "😜לחץ כאן לכניסה אתה כבר רשום במאגר" && (
//                             <Link to="/login">
//                                 <Typography variant="body2" align="center">
//                                     להתחברות הקליקו כאן
//                                 </Typography>
//                             </Link>
//                         )}
//                         {msg && (
//                             <Typography variant="body2" color="error" align="center">
//                                 {msg}
//                             </Typography>
//                         )}
//                     </Box>
//                 </Paper>
//             </Box>
//         </>
//     );
// };

// export default SignUp;













import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUser } from "../context/userContext";
import axios from "axios";

interface SignupForm {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    roleName: string;
}

const SignUp = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<SignupForm>({ mode: "onChange" });
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const { saveUser } = useUser();
    const navigate = useNavigate();

    const onSend = async (data: SignupForm) => {
        setLoading(true);
        setMsg("");

        try {
            const res = await axios.post(
                "http://localhost:5083/api/Auth/register",
                data,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data) {
                setMsg("ההרשמה בוצעה בהצלחה! 🎉");
                saveUser({ id: res.data.user.id, ...res.data });
                navigate("/userAlbums");
            } else {
                setMsg("שגיאה בהרשמה. נסה שוב.");
            }
        } catch (error: any) {
            if (error.response) {
                setMsg("😜לחץ כאן לכניסה אתה כבר רשום במאגר");
            } else {
                setMsg("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.5)",
                    overflow: "hidden",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        borderRadius: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        width: "350px",
                        textAlign: "center",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        overflow: "auto",
                        maxHeight: "90vh",
                    }}
                >
                    <Typography variant="h4" fontWeight="600" color="text.primary" gutterBottom>
                        הרשמה
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit(onSend)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="שם משתמש"
                            {...register("firstName", { required: "שדה חובה" })}
                            error={Boolean(errors.firstName)}
                            helperText={errors.firstName?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="סיסמה"
                            type="password"
                            {...register("password", { required: "שדה חובה" })}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="שם משפחה"
                            {...register("lastName", { required: "שדה חובה" })}
                            error={Boolean(errors.lastName)}
                            helperText={errors.lastName?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="תפקיד"
                            {...register("roleName", { required: "שדה חובה" })}
                            error={Boolean(errors.roleName)}
                            helperText={errors.roleName?.message}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="אימייל"
                            {...register("email", { required: "שדה חובה" })}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2, backgroundColor: "#000000", "&:hover": { backgroundColor: "#333333" } }}
                            type="submit"
                            disabled={!isValid || loading}
                        >
                            {loading ? "ביצוע הרשמה..." : "הרשמה"}
                        </Button>
                        {msg === "😜לחץ כאן לכניסה אתה כבר רשום במאגר" && (
                            <Link to="/login">
                                <Typography variant="body2" align="center">
                                    להתחברות הקליקו כאן
                                </Typography>
                            </Link>
                        )}
                        {msg && (
                            <Typography variant="body2" color="error" align="center">
                                {msg}
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default SignUp;