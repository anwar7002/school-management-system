import express, { Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const geofenceRoutes = express.Router();

geofenceRoutes.use(authMiddleware);

// Check-in with GPS
geofenceRoutes.post('/check-in', async (req: AuthRequest, res: Response) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    res.json({
      message: 'Check-in successful',
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Check-in failed' });
  }
});
