import express from 'express';

import auth from '../middlewares/auth.js';
import restrict from '../middlewares/restrict.js';
import upload from '../middlewares/multer.js';
import {createContent, getAllContent, getContentById, updateContent, deleteContent} from '../controllers/contentController.js';

const router = express.Router();
// Route pour récupérer tous les contenus
router.post('/contents', auth, upload, createContent);
router.get('/contents', auth, getAllContent);
// Route pour récupérer un contenu spécifique par son ID
router.get('/contents/:id', auth, restrict, getContentById);
// Route pour mettre à jour un contenu spécifique par son ID
router.put('/contents/:id', auth, upload, restrict, updateContent);
// Route pour supprimer un contenu spécifique par son ID
router.delete('/contents/:id', auth, restrict, deleteContent);

export default router;