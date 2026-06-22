import express, { Response } from 'express';
import { db } from '@school/db';
import { students, users } from '@school/db';
import { AuthRequest, authMiddleware, roleMiddleware } from '../middleware/auth';

export const studentRoutes = express.Router();

studentRoutes.use(authMiddleware);

// Get all students
studentRoutes.get('/', roleMiddleware('PRINCIPAL', 'ADMIN_STAFF', 'COUNSELOR'), async (req: AuthRequest, res: Response) => {
  try {
    const allStudents = await db.query.students.findMany({
      with: {
        user: true,
      },
    });

    res.json(allStudents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
studentRoutes.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const student = await db.query.students.findFirst({
      where: (students, { eq }) => eq(students.id, req.params.id),
      with: {
        user: true,
        parent: true,
        attendance: {
          limit: 30,
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Get student by user ID
studentRoutes.get('/user/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const student = await db.query.students.findFirst({
      where: (students, { eq }) => eq(students.userId, req.params.userId),
      with: {
        user: true,
        attendance: {
          limit: 30,
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});
