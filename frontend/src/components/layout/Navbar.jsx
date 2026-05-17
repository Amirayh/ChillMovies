import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, User, LogOut, Settings } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-display font-bold tracking-widest text-gradient">
              CHILLMOVIES
            </Link>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="text-zinc-300 hover:text-white transition flex items-center gap-2">
                  <Heart size={20} />
                  <span className="hidden sm:inline">Favoris</span>
                </Link>
                <Link to="/manage" className="text-zinc-300 hover:text-white transition flex items-center gap-2">
                  <Settings size={20} />
                  <span className="hidden sm:inline">Gestion</span>
                </Link>
                <Link to="/profile" className="text-zinc-300 hover:text-white transition flex items-center gap-2">
                  <User size={20} />
                  <span className="hidden sm:inline">Profil</span>
                </Link>
                <button onClick={handleLogout} className="text-zinc-300 hover:text-pink-500 transition flex items-center gap-2">
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-zinc-300 hover:text-white transition px-3 py-2">
                  Connexion
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md font-medium hover:opacity-90 transition">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
