import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <div className="mx-auto flex h-screen min-h-screen max-w-7xl flex-col px-6 lg:px-8">
        <Header />
        <Sidebar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};
