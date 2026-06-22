import express, { Response } from 'express';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

export const scheduleRoutes = express.Router();

scheduleRoutes.use(authMiddleware);

// Get teacher schedule
scheduleRoutes.get('/teacher/:teacherId', roleMiddleware('PRINCIPAL', 'ADMIN_STAFF', 'TEACHER'), async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: 'Teacher schedule endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});
