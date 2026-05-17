import multer from 'multer';    
import path from 'path';

// Configuration de multer pour stocker les fichiers dans le dossier "uploads/"
const storage = multer.diskStorage({
  destination: (req, file, cb) => { 
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Génère un nom unique avec l'extension d'origine
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Création de l'instance de multer avec la configuration de stockage
const upload = multer({ storage }).single('file'); // 'file' est le nom du champ dans le formulaire

export default upload;
