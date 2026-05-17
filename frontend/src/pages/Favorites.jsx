import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentCard from '../components/ui/ContentCard';
import Loader from '../components/ui/Loader';
import { favoritesService } from '../services/favorites.service';
import { ArrowLeft } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await favoritesService.getFavorites();
        // Le backend renvoie souvent des objets où le contenu est imbriqué, ex: data[0].Content
        // Il faut vérifier la structure exacte. Supposons que c'est un tableau de Content.
        // Si c'est un tableau de Favoris avec { Content: {...} }, on fait:
        const formattedData = data.map(fav => fav.Content || fav);
        setFavorites(formattedData);
      } catch (err) {
        setError('Impossible de charger vos favoris.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <Loader />;

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

      <h1 className="text-3xl title-gothic text-white mb-6">Mes Favoris</h1>
      
      {error && <div className="text-red-500 mb-6">{error}</div>}

      {favorites.length === 0 && !error ? (
        <div className="text-zinc-500 py-12 text-center bg-zinc-900/50 rounded-xl border border-zinc-800">
          Vous n'avez pas encore ajouté de favoris à votre liste.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favorites.map((content) => (
            <ContentCard key={content.content_id} content={content} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
