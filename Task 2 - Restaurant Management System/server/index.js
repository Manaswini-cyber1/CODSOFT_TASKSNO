import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'DineDesk Real REST API Server', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`🚀 DineDesk REST API Server running on http://localhost:${PORT}`);
});
