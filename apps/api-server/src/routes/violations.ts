import express, { Response } from 'express';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

export const violationRoutes = express.Router();

violationRoutes.use(authMiddleware);

// Get all violations (for counselor/principal)
violationRoutes.get('/', roleMiddleware('PRINCIPAL', 'VICE_PRINCIPAL', 'COUNSELOR'), async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: 'Violations endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch violations' });
  }
});
