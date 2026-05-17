import { Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ContentCard from '../components/ui/ContentCard';
import Loader from '../components/ui/Loader';
import { contentService } from '../services/content.service';
import { Link } from 'react-router-dom';

const Home = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSynopsis, setShowSynopsis] = useState(false);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const data = await contentService.getAll();
        setContents(data);
      } catch (err) {
        setError('Impossible de charger les films.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const featuredContent = contents.length > 0 ? contents[0] : null;
  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="pb-12">
      {/* Hero Section */}
      {featuredContent && (
        <div className="relative h-[70vh] w-full flex items-center mb-12">
          <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
            {featuredContent.poster_url && (
              <img 
                src={`http://localhost:3000${featuredContent.poster_url}`} 
                alt={featuredContent.title}
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10" />
          </div>

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
            <span className="text-pink-500 font-bold tracking-wider text-sm mb-4 block uppercase">Nouveauté</span>
            <h1 className="text-5xl md:text-7xl title-gothic text-white mb-4 max-w-3xl leading-tight">
              {featuredContent.title}
            </h1>
            <p className="text-zinc-300 max-w-xl text-lg mb-8 font-light line-clamp-3">
              {featuredContent.synopsis || "Aucun synopsis disponible."}
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowSynopsis(true)}
                className="bg-zinc-800/80 text-white px-8 py-3 rounded-md font-medium flex items-center gap-2 hover:bg-zinc-700 transition backdrop-blur-sm"
              >
                <Info size={20} /> Plus d'infos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Synopsis */}
      {showSynopsis && featuredContent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSynopsis(false)}>
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-2xl title-gothic text-white">{featuredContent.title}</h2>
              <button onClick={() => setShowSynopsis(false)} className="text-zinc-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <span className="bg-zinc-800 text-white px-2 py-1 rounded">
                  {featuredContent.content_type === 'SERIES' ? 'Série' : featuredContent.content_type === 'DOCUMENTARY' ? 'Documentaire' : 'Film'}
                </span>
                <span>{featuredContent.release_year}</span>
                {featuredContent.director && <span>Réalisé par {featuredContent.director}</span>}
              </div>
              <h3 className="text-lg text-white font-medium">Synopsis</h3>
              <p className="text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                {featuredContent.synopsis || "Aucun synopsis disponible."}
              </p>
              <div className="pt-4">
                <Link 
                  to={`/content/${featuredContent.content_id}`}
                  className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Voir la fiche complète
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Catalogue par type */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {contents.length === 0 ? (
          <p className="text-zinc-500">Aucun contenu disponible pour le moment.</p>
        ) : (
          <>
            {/* Sections par type (FILM, SERIES, DOCUMENTARY) */}
            {(() => {
              const typeLabels = { FILM: 'Films', SERIES: 'Séries', DOCUMENTARY: 'Documentaires' };
              const types = [...new Set(contents.map(c => c.content_type))];
              return types.map(type => {
                const filtered = contents.filter(c => c.content_type === type);
                if (filtered.length === 0) return null;
                return (
                  <div key={type}>
                    <h2 className="text-2xl title-gothic text-white mb-6">{typeLabels[type] || type}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {filtered.map(content => (
                        <ContentCard key={content.content_id} content={content} />
                      ))}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Sections par thème/genre (tous types confondus) */}
            {(() => {
              const genres = [...new Set(contents.filter(c => c.genre).map(c => c.genre))];
              if (genres.length === 0) return null;
              return (
                <>
                  <div className="border-t border-zinc-800 pt-8">
                    <h2 className="text-3xl title-gothic text-gradient mb-8">Explorer par Thème</h2>
                  </div>
                  {genres.map(genre => {
                    const filtered = contents.filter(c => c.genre === genre);
                    return (
                      <div key={genre}>
                        <h2 className="text-2xl title-gothic text-white mb-6">{genre}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {filtered.map(content => (
                            <ContentCard key={`${genre}-${content.content_id}`} content={content} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
