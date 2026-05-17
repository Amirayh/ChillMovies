import {Content} from "../models/index.js";

export const createContent = async (req, res) => {
  try {     
    const { 
      title, title_localized, content_type, release_year, 
      duration_minutes, seasons_count, synopsis, director, genre, average_rating 
    } = req.body;
    
    let poster_url = null;
    if (req.file) {
      poster_url = `/uploads/${req.file.filename}`;
    }

    const newContent = await Content.create({ 
      title, title_localized, content_type, release_year, 
      duration_minutes: duration_minutes || null, 
      seasons_count: seasons_count || null, 
      synopsis, director, genre,
      average_rating: average_rating || null, 
      poster_url,
      created_by: req.user ? req.user.user_id : null
    });
    res.status(201).json(newContent);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Server error while creating content." });
  }
};     

export const getAllContent = async (req, res) => {
  try {
    const contents = await Content.findAll({ order: [['created_at', 'DESC']] });               
    res.status(200).json(contents); 
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Server error while fetching content." });
  }
};

export const getContentById = async (req, res) => { 
    const { id } = req.params;
    try {
        const content = await Content.findByPk(id);
        if (!content) {
            return res.status(404).json({ message: "Content not found." });
        }
        res.status(200).json(content);
    }
    catch (error) {
        console.error("Error fetching content by ID:", error);
        res.status(500).json({ message: "Server error while fetching content." });
    }
};

export const updateContent = async (req, res) => {
    const { id } = req.params;
    try {
        const content = await Content.findByPk(id);
        if (!content) {
            return res.status(404).json({ message: "Content not found." });
        }

        const { 
          title, title_localized, content_type, release_year, 
          duration_minutes, seasons_count, synopsis, director, genre, average_rating 
        } = req.body;

        if (req.file) {
          content.poster_url = `/uploads/${req.file.filename}`;
        }

        if (title !== undefined) content.title = title;
        if (title_localized !== undefined) content.title_localized = title_localized;
        if (content_type !== undefined) content.content_type = content_type;
        if (release_year !== undefined) content.release_year = release_year;
        if (duration_minutes !== undefined) content.duration_minutes = duration_minutes || null;
        if (seasons_count !== undefined) content.seasons_count = seasons_count || null;
        if (synopsis !== undefined) content.synopsis = synopsis;
        if (director !== undefined) content.director = director;
        if (genre !== undefined) content.genre = genre;
        if (average_rating !== undefined) content.average_rating = average_rating || null;

        await content.save();
        res.status(200).json(content);
    } catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ message: "Server error while updating content." });
    }
};

export const deleteContent = async (req, res) => { 
    const { id } = req.params;
    try {
        const content = await Content.findByPk(id); 
        if (!content) {
            return res.status(404).json({ message: "Content not found." });
        }
        await content.destroy();
        res.status(200).json({ message: "Content deleted successfully." });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Server error while deleting content." });
    }
};
