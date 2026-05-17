import express from "express";
import auth from "../middlewares/auth.js";
import { getFavorites, addFavorite, removeFavorite, togglePin } from "../controllers/favoriteController.js";

const router = express.Router();
router.get('/', auth, getFavorites);
router.post('/', auth, addFavorite);
router.delete('/:content_id', auth, removeFavorite);
router.patch('/:content_id/pin', auth, togglePin);

export default router;