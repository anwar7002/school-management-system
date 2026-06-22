import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import { authRoutes } from './routes/auth';
import { studentRoutes } from './routes/students';
import { attendanceRoutes } from './routes/attendance';
import { violationRoutes } from './routes/violations';
import { messageRoutes } from './routes/messages';
import { scheduleRoutes } from './routes/schedules';
import { visitorRoutes } from './routes/visitors';
import { geofenceRoutes } from './routes/geofence';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/geofence', geofenceRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 School Management System API running on port ${PORT}`);
});

export default app;
