import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { favoritesService } from '../../services/favorites.service';

const ContentCard = ({ content }) => {
  const { content_id, title, poster_url, release_year, average_rating, content_type } = content;
  const { favoriteIds, updateFavoriteIds } = useContext(AuthContext);
  
  const isFavorite = favoriteIds.includes(content_id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Empêche le clic de naviguer vers la page détail
    try {
      if (isFavorite) {
        await favoritesService.removeFavorite(content_id);
        updateFavoriteIds(content_id, false);
      } else {
        await favoritesService.addFavorite(content_id);
        updateFavoriteIds(content_id, true);
      }
    } catch (err) {
      console.error('Erreur lors du toggle favori:', err);
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all hover:scale-105 hover:shadow-xl hover:shadow-pink-500/10 hover:border-zinc-700">
      
      {/* Bouton Favori flottant */}
      <button 
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-20 p-2 backdrop-blur-md rounded-full transition ${
          isFavorite ? 'bg-pink-500/80 text-white' : 'bg-black/50 text-zinc-400 hover:text-pink-500 hover:bg-black/80'
        }`}
      >
        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>

      {/* Badge Type de contenu (Film, Série...) */}
      <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs font-semibold text-zinc-300">
        {content_type === 'SERIES' ? 'Série' : content_type === 'DOCUMENTARY' ? 'Documentaire' : 'Film'}
      </div>

      <Link to={`/content/${content_id}`} className="block relative aspect-[2/3] w-full">
        {/* L'image de l'affiche */}
        {poster_url ? (
          <img 
            src={`https://chillmovies.onrender.com${poster_url}`} // À adapter avec l'URL de base backend
            alt={`Affiche de ${title}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center bg-zinc-800 text-zinc-600">
            <span className="text-center px-4 font-display uppercase tracking-widest">{title}</span>
          </div>
        )}
        
        {/* Overlay dégradé sombre en bas de l'image pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        
        {/* Informations de bas de carte */}
        <div className="absolute bottom-0 w-full p-4 flex flex-col gap-1 translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-white font-semibold truncate text-lg">{title}</h3>
          
          <div className="flex items-center justify-between text-zinc-400 text-sm">
            <span>{release_year}</span>
            {average_rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={14} fill="currentColor" />
                <span className="text-white font-medium">{average_rating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ContentCard;
