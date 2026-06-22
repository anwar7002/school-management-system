import express, { Response } from 'express';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

export const visitorRoutes = express.Router();

visitorRoutes.use(authMiddleware);

// Request visitor access
visitorRoutes.post('/request', roleMiddleware('PARENT'), async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: 'Visitor request created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create visitor request' });
  }
});

// Validate QR code
visitorRoutes.post('/validate-qr', roleMiddleware('GUARD'), async (req: AuthRequest, res: Response) => {
  try {
    res.json({ message: 'QR validation endpoint' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate QR' });
  }
});
