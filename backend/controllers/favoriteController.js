import { Favorite, Content } from "../models/index.js";

export const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.findAll({ 
            where: { user_id: req.user.user_id },
            include: [Content] 
        });
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: "Server error while fetching favorites." });
    }
};

export const addFavorite = async (req, res) => {
    const { content_id } = req.body;
    try {
        const newFavorite = await Favorite.create({ user_id: req.user.user_id, content_id });
        res.status(201).json(newFavorite);
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: "Server error while adding favorite." });
    }
};

export const removeFavorite = async (req, res) => {
    const { content_id } = req.params;  
    try {
        const deleted = await Favorite.destroy({ where: { user_id: req.user.user_id, content_id } });
        if (deleted) {
            res.status(200).json({ message: "Favorite removed." });
        } else {
            res.status(404).json({ message: "Favorite not found." });
        }
    } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Server error while removing favorite." });
    }
};

export const togglePin = async (req, res) => {
    const { content_id } = req.params;
    try {
        const favorite = await Favorite.findOne({ where: { user_id: req.user.user_id, content_id } });
        if (!favorite) {
            return res.status(404).json({ message: "Favorite not found." });
        }
        favorite.is_pinned = !favorite.is_pinned;
        await favorite.save();
        res.status(200).json(favorite);
    } catch (error) {
        console.error("Error toggling pin:", error);
        res.status(500).json({ message: "Server error while toggling pin." });
    }   

};
