import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../services/content.service';
import Loader from '../components/ui/Loader';
import { Trash2, Edit, Plus, X, ArrowLeft } from 'lucide-react';

const ContentManager = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const initialForm = {
    title: '', title_localized: '', content_type: 'FILM', release_year: new Date().getFullYear(),
    duration_minutes: '', seasons_count: '', synopsis: '', director: '', genre: '', average_rating: '', poster: null
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchContents = async () => {
    setLoading(true);
    try {
      const data = await contentService.getAll();
      setContents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setFormData(prev => ({ ...prev, poster: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const openModal = (content = null) => {
    if (content) {
      setEditingId(content.content_id);
      setFormData({
        title: content.title,
        title_localized: content.title_localized || '',
        content_type: content.content_type,
        release_year: content.release_year,
        duration_minutes: content.duration_minutes || '',
        seasons_count: content.seasons_count || '',
        synopsis: content.synopsis || '',
        director: content.director || '',
        genre: content.genre || '',
        average_rating: content.average_rating || '',
        poster: null // We don't repopulate the file input
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        // Le backend attend "file" pour l'image via multer
        if (key === 'poster') {
          data.append('file', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      }
    });

    try {
      if (editingId) {
        await contentService.update(editingId, data);
      } else {
        await contentService.create(data);
      }
      closeModal();
      fetchContents();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de l'enregistrement du contenu");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
      try {
        await contentService.delete(id);
        fetchContents();
      } catch (err) {
        console.error(err);
      }
    }
  };

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

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl title-gothic text-white">Gestion du Catalogue</h1>
        <button 
          onClick={() => openModal()}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus size={20} /> Ajouter un Contenu
        </button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-zinc-300">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">Titre</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Année</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map(content => (
              <tr key={content.content_id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                <td className="px-6 py-4 font-medium text-white">{content.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-zinc-800 px-2 py-1 rounded text-xs">{content.content_type}</span>
                </td>
                <td className="px-6 py-4">{content.release_year}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button onClick={() => openModal(content)} className="text-blue-400 hover:text-blue-300 transition">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(content.content_id)} className="text-red-400 hover:text-red-300 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {contents.length === 0 && (
          <div className="text-center py-8 text-zinc-500">Aucun contenu trouvé.</div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
              <h2 className="text-2xl title-gothic text-white">{editingId ? 'Modifier le contenu' : 'Ajouter un contenu'}</h2>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm text-zinc-400 mb-1">Titre *</label>
                  <input id="title" type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label htmlFor="title_localized" className="block text-sm text-zinc-400 mb-1">Titre original</label>
                  <input id="title_localized" type="text" name="title_localized" value={formData.title_localized} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="content_type" className="block text-sm text-zinc-400 mb-1">Type *</label>
                  <select id="content_type" name="content_type" value={formData.content_type} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white">
                    <option value="FILM">Film</option>
                    <option value="SERIES">Série</option>
                    <option value="DOCUMENTARY">Documentaire</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="release_year" className="block text-sm text-zinc-400 mb-1">Année *</label>
                  <input id="release_year" type="number" name="release_year" required value={formData.release_year} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label htmlFor="average_rating" className="block text-sm text-zinc-400 mb-1">Note moy. (/5)</label>
                  <input id="average_rating" type="number" step="0.1" max="5" name="average_rating" value={formData.average_rating} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duration_minutes" className="block text-sm text-zinc-400 mb-1">Durée (minutes)</label>
                  <input id="duration_minutes" type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label htmlFor="seasons_count" className="block text-sm text-zinc-400 mb-1">Nb. de saisons</label>
                  <input id="seasons_count" type="number" name="seasons_count" value={formData.seasons_count} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
              </div>

              <div>
                <label htmlFor="director" className="block text-sm text-zinc-400 mb-1">Réalisateur</label>
                <input id="director" type="text" name="director" value={formData.director} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm text-zinc-400 mb-1">Thème / Genre</label>
                <select id="genre" name="genre" value={formData.genre} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white">
                  <option value="">-- Aucun --</option>
                  <option value="Action">Action</option>
                  <option value="Aventure">Aventure</option>
                  <option value="Comédie">Comédie</option>
                  <option value="Drame">Drame</option>
                  <option value="Fantastique">Fantastique</option>
                  <option value="Horreur">Horreur</option>
                  <option value="Romance">Romance</option>
                  <option value="Science-Fiction">Science-Fiction</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Animation">Animation</option>
                  <option value="Documentaire">Documentaire</option>
                </select>
              </div>

              <div>
                <label htmlFor="synopsis" className="block text-sm text-zinc-400 mb-1">Synopsis</label>
                <textarea id="synopsis" name="synopsis" rows="3" value={formData.synopsis} onChange={handleInputChange} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white"></textarea>
              </div>

              <div>
                <label htmlFor="poster" className="block text-sm text-zinc-400 mb-1">Affiche (Image)</label>
                <input id="poster" type="file" name="poster" onChange={handleInputChange} accept="image/*" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-pink-500 file:text-white hover:file:bg-pink-600" />
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-6 py-2 rounded text-zinc-300 hover:bg-zinc-800 transition">Annuler</button>
                <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded hover:opacity-90 transition">
                  {editingId ? 'Mettre à jour' : 'Créer le contenu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
