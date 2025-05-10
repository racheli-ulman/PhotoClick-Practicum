import { AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './HomePage/Footer';

const Layout = () => {
    return (
        <div>
            <AppBar position="static">
                <Header />
            </AppBar>

            <main style={{ paddingTop: '64px' }}> {/* Adjust padding based on AppBar height */}
                <Outlet />
            </main>
            <AppBar position="static">
                <Footer></Footer>
            </AppBar>
        </div>
    );
};

export default Layout;
