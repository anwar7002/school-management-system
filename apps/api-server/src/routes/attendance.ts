import express, { Response } from 'express';
import { db } from '@school/db';
import { AuthRequest, authMiddleware } from '../middleware/auth';

export const attendanceRoutes = express.Router();

attendanceRoutes.use(authMiddleware);

// Get attendance for a student
attendanceRoutes.get('/student/:studentId', async (req: AuthRequest, res: Response) => {
  try {
    const records = await db.query.attendance.findMany({
      where: (attendance, { eq }) => eq(attendance.studentId, req.params.studentId),
      limit: 100,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});
