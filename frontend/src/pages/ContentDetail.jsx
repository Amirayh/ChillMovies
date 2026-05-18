import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { contentService } from '../services/content.service';
import { favoritesService } from '../services/favorites.service';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { Star, Heart, ArrowLeft } from 'lucide-react';

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { favoriteIds, updateFavoriteIds } = useContext(AuthContext);
  const isFavorite = favoriteIds.includes(id);

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(id);
        updateFavoriteIds(id, false);
      } else {
        await favoritesService.addFavorite(id);
        updateFavoriteIds(id, true);
      }
    } catch (err) {
      console.error('Erreur lors du toggle favori:', err);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentService.getById(id);
        setContent(data);
      } catch (err) {
        setError('Film introuvable.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  if (loading) return <Loader />;
  if (error || !content) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Bouton retour */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Retour</span>
      </button>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Affiche */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          {content.poster_url ? (
            <img 
              src={`https://chillmovies.onrender.com${content.poster_url}`} 
              alt={content.title}
              className="w-full rounded-2xl shadow-2xl shadow-pink-500/10 border border-zinc-800"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 text-zinc-500">
              Affiche manquante
            </div>
          )}
        </div>

        {/* Détails */}
        <div className="w-full md:w-2/3 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-zinc-800 text-white px-3 py-1 rounded font-medium text-sm">
              {content.content_type === 'SERIES' ? 'Série' : content.content_type === 'DOCUMENTARY' ? 'Documentaire' : 'Film'}
            </span>
            <span className="text-zinc-400 font-medium">
              {content.release_year}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl title-gothic text-white mb-6">
            {content.title}
          </h1>

          <div className="flex items-center gap-6 mb-8">
            {content.average_rating && (
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                <Star size={20} fill="currentColor" />
                <span className="font-bold text-lg">{content.average_rating}</span>
                <span className="text-zinc-400 text-sm">/ 5</span>
              </div>
            )}
            {content.duration_minutes && (
              <div className="text-zinc-300">
                {Math.floor(content.duration_minutes / 60)}h {content.duration_minutes % 60}m
              </div>
            )}
            {content.seasons_count && (
              <div className="text-zinc-300">
                {content.seasons_count} Saison{content.seasons_count > 1 ? 's' : ''}
              </div>
            )}
          </div>

          <h3 className="text-xl text-white font-medium mb-3">Synopsis</h3>
          <p className="text-zinc-300 text-lg leading-relaxed font-light mb-8 max-w-3xl">
            {content.synopsis || "Aucun synopsis disponible."}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={handleFavoriteClick}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold transition text-lg ${
                isFavorite 
                  ? 'bg-pink-500/10 border border-pink-500 text-pink-500 hover:bg-pink-500/20' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 shadow-lg shadow-pink-500/20'
              }`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </button>
          </div>

          {content.director && (
            <div className="mt-10 pt-6 border-t border-zinc-800">
              <span className="text-zinc-500">Réalisateur : </span>
              <span className="text-white font-medium">{content.director}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContentDetail;
