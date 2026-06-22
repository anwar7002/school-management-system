import { z } from 'zod';

export const attendanceSchema = z.object({
  studentId: z.string().uuid(),
  date: z.coerce.date(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'ON_LEAVE']),
  remarks: z.string().optional(),
});

export const geofenceCheckInSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
  studentId: z.string().uuid().optional(),
});

export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type GeofenceCheckInInput = z.infer<typeof geofenceCheckInSchema>;
