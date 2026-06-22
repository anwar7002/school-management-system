import { z } from 'zod';

export const violationSchema = z.object({
  studentId: z.string().uuid(),
  violationTypeId: z.string().uuid(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(10),
  location: z.string().optional(),
  witnesses: z.array(z.string()).optional(),
});

export const assignCounselorSchema = z.object({
  violationId: z.string().uuid(),
  counselorId: z.string().uuid(),
  notes: z.string().optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.coerce.date().optional(),
});

export type ViolationInput = z.infer<typeof violationSchema>;
export type AssignCounselorInput = z.infer<typeof assignCounselorSchema>;
