import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import { sequelize } from './sequelize.js'; 

import uploadRouter from './routes/uploadRoute.js';
import slidesRouter from './routes/slidesRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));
app.use('/api', uploadRouter);
app.use('/api', slidesRouter);

app.get('/', (req, res) => {
  res.send('✅ Server is running...');
});


app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});


sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📁 Uploads directory: ${uploadDir}`);
    });
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });