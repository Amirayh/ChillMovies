import express from "express";
import cors from "cors";
import { sequelize }    from './models/index.js';
import helmet from "helmet";
import "dotenv/config";
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/contents.js';
import favoriteRoutes from './routes/favorites.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Fichiers statiques (uploads d'images) — AVANT helmet
app.use("/uploads", express.static("uploads"));

// Sécurise les en-têtes HTTP (configuré pour ne pas bloquer les images)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use('/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/favorites', favoriteRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});
await sequelize.sync();
const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
