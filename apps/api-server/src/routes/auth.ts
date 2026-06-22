import express, { Response } from 'express';
import { db } from '@school/db';
import { users } from '@school/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthRequest, authMiddleware, validateSchema } from '../middleware/auth';
import { createUserSchema, loginSchema } from '../schemas/user';

export const authRoutes = express.Router();

// Register
authRoutes.post(
  '/register',
  validateSchema(createUserSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, role } = req.body;

      // Check if user exists
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          firstName,
          lastName,
          phone,
          role,
        })
        .returning();

      // Generate token
      const token = jwt.sign(
        { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser[0].id,
          email: newUser[0].email,
          firstName: newUser[0].firstName,
          lastName: newUser[0].lastName,
          role: newUser[0].role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// Login
authRoutes.post(
  '/login',
  validateSchema(loginSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where((users) => eq(users.id, user.id));

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// Get current user
authRoutes.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, req.user!.id),
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Logout (client-side token removal)
authRoutes.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});
