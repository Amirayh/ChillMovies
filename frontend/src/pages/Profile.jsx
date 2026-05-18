import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import Loader from '../components/ui/Loader';
import { ArrowLeft, User, Mail, Calendar, Heart, Camera } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { favoriteIds, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setUser(data);
      } catch (err) {
        setError("Impossible de charger le profil.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await authService.updateAvatar(file);
      setUser(prev => ({ ...prev, avatar_url: data.avatar_url }));
    } catch (err) {
      console.error("Erreur upload avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Bouton retour */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Retour</span>
      </button>

      <h1 className="text-3xl title-gothic text-white mb-8">Mon Profil</h1>

      {/* Carte profil */}
      <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-zinc-800 overflow-hidden">
        
        {/* Header dégradé */}
        <div className="h-32 bg-gradient-to-r from-pink-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8">
            {/* Avatar avec bouton d'upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img 
                    src={`https://chillmovies.onrender.com${user.avatar_url}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-pink-500" />
                )}
              </div>
              {/* Overlay au survol */}
              <button 
                onClick={handleAvatarClick}
                disabled={uploading}
                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
              >
                <Camera size={20} className="text-white" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                accept="image/*" 
                className="hidden" 
              />
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
          <p className="text-zinc-400 text-sm mb-8">Membre ChillMovies</p>

          {/* Infos */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <User size={20} className="text-pink-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Nom d'utilisateur</p>
                <p className="text-white font-medium">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Mail size={20} className="text-purple-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Membre depuis</p>
                <p className="text-white font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Heart size={20} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-sm">Favoris</p>
                <p className="text-white font-medium">{favoriteIds.length} film{favoriteIds.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Bouton Déconnexion */}
          <button 
            onClick={handleLogout}
            className="mt-8 w-full bg-red-500/10 border border-red-500/30 text-red-500 py-3 rounded-xl font-medium hover:bg-red-500/20 transition"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
