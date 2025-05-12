// import React, { useState } from 'react';
// import { observer } from 'mobx-react-lite';
// import userStore from '../stores/userStore'; // יש לוודא שהנתיב נכון

// const Register = observer(() => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [roleName, setRoleName] = useState('User'); // ברירת מחדל היא User

//   const handleRegister = async () => {
//     await userStore.register(firstName, lastName, email, password, roleName);
//     if (userStore.error) {
//       alert(userStore.error); // הצגת שגיאה אם יש
//     } else {
//       alert('User registered successfully!'); // הודעה על הצלחה
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input
//         type="text"
//         placeholder="First Name"
//         value={firstName}
//         onChange={(e) => setFirstName(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Last Name"
//         value={lastName}
//         onChange={(e) => setLastName(e.target.value)}
//       />
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <select value={roleName} onChange={(e) => setRoleName(e.target.value)}>
//         <option value="User">User</option>
//         <option value="Admin">Admin</option>
//       </select>
//       <button onClick={handleRegister}>Register</button>
//       {userStore.error && <p style={{ color: 'red' }}>{userStore.error}</p>}
//     </div>
//   );
// });

// export default Register;



import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../stores/userStore';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  EmailOutlined, 
  LockOutlined, 
  PersonOutlined, 
  BadgeOutlined 
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = observer(() => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Input validation
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('כתובת מייל לא חוקית');
      return;
    }

    try {
      await userStore.register(firstName, lastName, email, password, 'User'); // Set roleName to 'User' directly
      
      if (userStore.error) {
        setError(userStore.error);
      } else {
        setError('');
        navigate('/personal-area/userAlbums');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Grid 
      container 
      sx={{ 
        height: "100vh", 
        overflow: "hidden",
        background: 'linear-gradient(135deg, #e6f2ff 0%, #b3d9ff 100%)'
      }}
    >
      {/* Right Column - Image */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          backgroundColor: "#c46868", 
          height: "100%",
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '120%',
            height: '120%',
            backgroundImage: 'url("/images/15.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.8) blur(5px)',
            transform: 'rotate(-5deg)',
            zIndex: 1
          }}
        />
        <Box
          sx={{
            zIndex: 2,
            textAlign: 'center',
            color: 'white',
            padding: 4,
            backgroundColor: '#c46868',
            borderRadius: 2
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="subtitle1">
            Join our creative community
          </Typography>
        </Box>
      </Grid>

      {/* Left Column - Registration Form */}
      <Grid 
        item 
        xs={12} 
        md={6} 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100%",
          backgroundColor: 'white'
        }}
      >
        <Paper
          elevation={10}
          sx={{
            padding: 5,
            borderRadius: "20px",
            width: "400px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0, 51, 102, 0.1)",
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="700" 
            color="text.primary" 
            sx={{ 
              marginBottom: 3,
              background: 'linear-gradient(45deg, #c46868 0%,rgb(210, 132, 189) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Sign Up
          </Typography>
          
          <TextField
            label="First Name"
            value={firstName}
            required
            onChange={({ target }) => setFirstName(target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Last Name"
            value={lastName}
            required
            onChange={({ target }) => setLastName(target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Email Address"
            type="email"
            value={email}
            required
            onChange={({ target }) => setEmail(target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            required
            onChange={({ target }) => setPassword(target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            variant="contained" 
            fullWidth 
            size="large" 
            onClick={handleRegister} 
            sx={{ 
              marginBottom: 2,
              background: 'linear-gradient(45deg, #c46868 0%, #d59a9a 100%)', // צבע חלש יותר
              '&:hover': { 
                background: 'linear-gradient(45deg, #d59a9a 0%, #c46868 100%)' // צבע חלש יותר בה-hover
              }
            }}
            
          >
            Create Account
          </Button>
          
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                marginTop: 2,
                textAlign: 'center'
              }}
            >
              {error}
            </Typography>
          )}
          
          <Typography 
            variant="body2" 
            sx={{ 
              marginTop: 2,
              color: '#c46868'
            }}
          >
            Already have an account? 
            <Link 
              to="/login" 
              style={{ 
                color: '#c46868', 
                marginLeft: 5,
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
});

export default Register;
