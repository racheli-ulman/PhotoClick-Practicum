import React from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// import Header from '../src/components/Header';
import Hero from './components/HomePage/Hero';
import Features from './components/HomePage/Features';
import TargetAudience from './components/HomePage/TargetAudience';
// import CtaSection from './components/CtaSection';
import Footer from './components/HomePage/Footer';
import { RouterProvider } from 'react-router-dom';
import { Router } from './router';

// RTL support
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme instance with RTL support
let theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#4a6fa5',
    },
    secondary: {
      main: '#f8c146',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: [
      'Heebo',
      'Assistant',
      'Rubik',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div dir="rtl">
          <RouterProvider router={Router} /> {/* כאן נטען ה-Router */}
        </div>
      </ThemeProvider>
    </CacheProvider>
  //   <CacheProvider value={cacheRtl}>
  //     <ThemeProvider theme={theme}>
  //       <CssBaseline />
  //       <Header />
  //       {/* <Hero /> */}
  //       {/* <Features /> */}
  //       {/* <TargetAudience /> */}
  //       {/* <CtaSection /> */}
  //       {/* <Footer /> */}
  //     </ThemeProvider>
  //  </CacheProvider>
  );
}

export default App;



