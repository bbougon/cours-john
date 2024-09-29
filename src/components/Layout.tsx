import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Header />
        <Sidebar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};
