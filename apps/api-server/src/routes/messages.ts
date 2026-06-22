import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const messageRoutes = express.Router();

messageRoutes.use(authMiddleware);

// Get conversations for user
messageRoutes.get('/conversations', async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: 'Conversations endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});
