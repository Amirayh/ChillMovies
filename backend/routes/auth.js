import express from 'express';
import { register, login, logout, getProfile, updateAvatar } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';


const router = express.Router();

// Route d'inscription
router.post('/register', register );

// Route de connexion
router.post('/login', login);

router.get('/me', auth, getProfile);

// Route upload avatar
router.put('/me/avatar', auth, upload, updateAvatar);

router.get('/logout', logout);

export default router;