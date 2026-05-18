import { Content } from '../models/index.js';

export default async function restrict (req, res, next){
  const { id } = req.params;
  try {
    const content = await Content.findByPk(id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found.' });
    }

    if (content.created_by !== req.user.user_id) {
      return res.status(403).json({ message: 'Access denied. You are not the creator of this content.' });
    }

    next();
  } catch (error) {
    console.error('Error in restrict middleware:', error);
    return res.status(500).json({ message: 'Server error during authorization check.' });
  }
}
