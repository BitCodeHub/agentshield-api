import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import agentsRouter from './routes/v1/agents';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'agentshield-api',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/v1/agents', agentsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🛡️  AgentShield API running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
