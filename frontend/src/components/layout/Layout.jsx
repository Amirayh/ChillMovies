import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* pt-16 offset for fixed navbar */}
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-500 text-sm mt-12">
        <p>&copy; {new Date().getFullYear()} ChillMovies. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Layout;
