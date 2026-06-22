import { pgTable, pgEnum, text, serial, timestamp, decimal, integer, boolean, varchar, uuid, jsonb, index, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================

export const roleEnum = pgEnum('role', [
  'PRINCIPAL',
  'VICE_PRINCIPAL',
  'COUNSELOR',
  'TEACHER',
  'ADMIN_STAFF',
  'GUARD',
  'STUDENT',
  'PARENT',
]);

export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);

export const attendanceStatusEnum = pgEnum('attendance_status', [
  'PRESENT',
  'ABSENT',
  'LATE',
  'EXCUSED',
  'ON_LEAVE',
]);

export const violationSeverityEnum = pgEnum('violation_severity', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const violationStatusEnum = pgEnum('violation_status', [
  'REPORTED',
  'ASSIGNED_TO_COUNSELOR',
  'UNDER_REVIEW',
  'RESOLVED',
  'DISMISSED',
]);

export const messageStatusEnum = pgEnum('message_status', [
  'SENT',
  'DELIVERED',
  'READ',
]);

export const visitorStatusEnum = pgEnum('visitor_status', [
  'PENDING',
  'APPROVED',
  'CHECKED_IN',
  'CHECKED_OUT',
  'DENIED',
]);

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: roleEnum('role').notNull(),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true).notNull(),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  roleIdx: index('users_role_idx').on(table.role),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  student: one(students, {
    fields: [users.id],
    references: [students.userId],
  }),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
  parent: one(parents, {
    fields: [users.id],
    references: [parents.userId],
  }),
  attendance: many(attendance),
  violations: many(studentViolations),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  counselorAssignments: many(violationCounselorAssignments),
  schedules: many(teacherSchedules),
  substitutions: many(substitutionRequests),
}));

// ============================================================================
// STUDENTS
// ============================================================================

export const students = pgTable('students', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  enrollmentNumber: varchar('enrollment_number', { length: 50 }).unique().notNull(),
  classGrade: varchar('class_grade', { length: 50 }).notNull(),
  section: varchar('section', { length: 10 }).notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  gender: genderEnum('gender').notNull(),
  noorStudentId: varchar('noor_student_id', { length: 100 }).unique(),
  parentId: uuid('parent_id').references(() => parents.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('students_user_id_idx').on(table.userId),
  classGradeIdx: index('students_class_grade_idx').on(table.classGrade),
  parentIdIdx: index('students_parent_id_idx').on(table.parentId),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  parent: one(parents, {
    fields: [students.parentId],
    references: [parents.id],
  }),
  attendance: many(attendance),
  violations: many(studentViolations),
  geofences: many(geofenceCheckIns),
}));

// ============================================================================
// TEACHERS
// ============================================================================

export const teachers = pgTable('teachers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  employeeId: varchar('employee_id', { length: 50 }).unique().notNull(),
  subject: varchar('subject', { length: 100 }).notNull(),
  department: varchar('department', { length: 100 }),
  noorTeacherId: varchar('noor_teacher_id', { length: 100 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('teachers_user_id_idx').on(table.userId),
  employeeIdIdx: index('teachers_employee_id_idx').on(table.employeeId),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  schedules: many(teacherSchedules),
  substitutionRequests: many(substitutionRequests),
  geofences: many(geofenceCheckIns),
}));

// ============================================================================
// PARENTS
// ============================================================================

export const parents = pgTable('parents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  relationship: varchar('relationship', { length: 50 }).notNull(), // Father, Mother, Guardian
  occupationOrCompany: varchar('occupation_or_company', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('parents_user_id_idx').on(table.userId),
}));

export const parentsRelations = relations(parents, ({ one, many }) => ({
  user: one(users, {
    fields: [parents.userId],
    references: [users.id],
  }),
  students: many(students),
  visitorRequests: many(visitorRequests),
}));

// ============================================================================
// ATTENDANCE & GEOFENCING
// ============================================================================

export const geofenceCheckIns = pgTable('geofence_check_ins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').references(() => students.id, { onDelete: 'cascade' }),
  teacherId: uuid('teacher_id').references(() => teachers.id, { onDelete: 'cascade' }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal('accuracy', { precision: 10, scale: 2 }),
  isWithinRadius: boolean('is_within_radius').notNull(),
  checkInTime: timestamp('check_in_time').defaultNow().notNull(),
  checkOutTime: timestamp('check_out_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('geofence_check_ins_user_id_idx').on(table.userId),
  studentIdIdx: index('geofence_check_ins_student_id_idx').on(table.studentId),
  checkInTimeIdx: index('geofence_check_ins_check_in_time_idx').on(table.checkInTime),
}));

export const geofenceCheckInsRelations = relations(geofenceCheckIns, ({ one }) => ({
  user: one(users, {
    fields: [geofenceCheckIns.userId],
    references: [users.id],
  }),
  student: one(students, {
    fields: [geofenceCheckIns.studentId],
    references: [students.id],
  }),
  teacher: one(teachers, {
    fields: [geofenceCheckIns.teacherId],
    references: [teachers.id],
  }),
}));

export const attendance = pgTable('attendance', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  status: attendanceStatusEnum('status').notNull(),
  checkedInBy: uuid('checked_in_by').references(() => users.id),
  geofenceCheckInId: uuid('geofence_check_in_id').references(() => geofenceCheckIns.id),
  noorAttendanceId: varchar('noor_attendance_id', { length: 100 }),
  noorStatus: varchar('noor_status', { length: 50 }),
  matchesNoor: boolean('matches_noor'),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  studentIdIdx: index('attendance_student_id_idx').on(table.studentId),
  dateIdx: index('attendance_date_idx').on(table.date),
  statusIdx: index('attendance_status_idx').on(table.status),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  checkedInByUser: one(users, {
    fields: [attendance.checkedInBy],
    references: [users.id],
  }),
  geofenceCheckIn: one(geofenceCheckIns, {
    fields: [attendance.geofenceCheckInId],
    references: [geofenceCheckIns.id],
  }),
}));

// ============================================================================
// BEHAVIOR & VIOLATIONS
// ============================================================================

export const violationTypes = pgTable('violation_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  defaultSeverity: violationSeverityEnum('default_severity').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const studentViolations = pgTable('student_violations', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: uuid('student_id').notNull().references(() => students.id, { onDelete: 'cascade' }),
  violationTypeId: uuid('violation_type_id').notNull().references(() => violationTypes.id),
  reportedBy: uuid('reported_by').notNull().references(() => users.id),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  severity: violationSeverityEnum('severity').notNull(),
  status: violationStatusEnum('status').default('REPORTED').notNull(),
  description: text('description').notNull(),
  location: varchar('location', { length: 255 }),
  witnesses: jsonb('witnesses'),
  attachments: jsonb('attachments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  studentIdIdx: index('student_violations_student_id_idx').on(table.studentId),
  statusIdx: index('student_violations_status_idx').on(table.status),
  severityIdx: index('student_violations_severity_idx').on(table.severity),
}));

export const studentViolationsRelations = relations(studentViolations, ({ one, many }) => ({
  student: one(students, {
    fields: [studentViolations.studentId],
    references: [students.id],
  }),
  violationType: one(violationTypes, {
    fields: [studentViolations.violationTypeId],
    references: [violationTypes.id],
  }),
  reportedByUser: one(users, {
    fields: [studentViolations.reportedBy],
    references: [users.id],
  }),
  counselorAssignments: many(violationCounselorAssignments),
}));

export const violationCounselorAssignments = pgTable('violation_counselor_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  violationId: uuid('violation_id').notNull().references(() => studentViolations.id, { onDelete: 'cascade' }),
  counselorId: uuid('counselor_id').notNull().references(() => users.id),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  notes: text('notes'),
  followUpRequired: boolean('follow_up_required').default(false),
  followUpDate: timestamp('follow_up_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  violationIdIdx: index('violation_counselor_assignments_violation_id_idx').on(table.violationId),
  counselorIdIdx: index('violation_counselor_assignments_counselor_id_idx').on(table.counselorId),
}));

export const violationCounselorAssignmentsRelations = relations(violationCounselorAssignments, ({ one }) => ({
  violation: one(studentViolations, {
    fields: [violationCounselorAssignments.violationId],
    references: [studentViolations.id],
  }),
  counselor: one(users, {
    fields: [violationCounselorAssignments.counselorId],
    references: [users.id],
  }),
}));

// ============================================================================
// COMMUNICATION & MESSAGING
// ============================================================================

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }),
  isGroupChat: boolean('is_group_chat').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const conversationParticipants = pgTable('conversation_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.conversationId, table.userId] }),
}));

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: uuid('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  receiverId: uuid('receiver_id').references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  mediaType: varchar('media_type', { length: 50 }), // image, video, document, etc.
  status: messageStatusEnum('status').default('SENT').notNull(),
  readAt: timestamp('read_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdIdx: index('messages_conversation_id_idx').on(table.conversationId),
  senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  receiverIdIdx: index('messages_receiver_id_idx').on(table.receiverId),
  createdAtIdx: index('messages_created_at_idx').on(table.createdAt),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}));

export const pushNotifications = pgTable('push_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  relatedId: uuid('related_id'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
}, (table) => ({
  userIdIdx: index('push_notifications_user_id_idx').on(table.userId),
  createdAtIdx: index('push_notifications_created_at_idx').on(table.createdAt),
}));

// ============================================================================
// TEACHER SCHEDULES & SUBSTITUTIONS
// ============================================================================

export const teacherSchedules = pgTable('teacher_schedules', {
  id: uuid('id').primaryKey().defaultRandom(),
  teacherId: uuid('teacher_id').notNull().references(() => teachers.id, { onDelete: 'cascade' }),
  dayOfWeek: varchar('day_of_week', { length: 20 }).notNull(), // MONDAY, TUESDAY, etc.
  startTime: varchar('start_time', { length: 8 }).notNull(), // HH:MM
  endTime: varchar('end_time', { length: 8 }).notNull(),
  classGrade: varchar('class_grade', { length: 50 }).notNull(),
  section: varchar('section', { length: 10 }),
  subject: varchar('subject', { length: 100 }).notNull(),
  room: varchar('room', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  teacherIdIdx: index('teacher_schedules_teacher_id_idx').on(table.teacherId),
  dayOfWeekIdx: index('teacher_schedules_day_of_week_idx').on(table.dayOfWeek),
}));

export const teacherSchedulesRelations = relations(teacherSchedules, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [teacherSchedules.teacherId],
    references: [teachers.id],
  }),
  substitutionRequests: many(substitutionRequests),
}));

export const substitutionRequests = pgTable('substitution_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('schedule_id').notNull().references(() => teacherSchedules.id, { onDelete: 'cascade' }),
  requesterTeacherId: uuid('requester_teacher_id').notNull().references(() => teachers.id),
  substituteTeacherId: uuid('substitute_teacher_id').references(() => teachers.id),
  requestedDate: timestamp('requested_date').notNull(),
  reason: text('reason'),
  status: varchar('status', { length: 50 }).default('OPEN').notNull(), // OPEN, ACCEPTED, REJECTED, CANCELLED
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  scheduleIdIdx: index('substitution_requests_schedule_id_idx').on(table.scheduleId),
  requesterTeacherIdIdx: index('substitution_requests_requester_teacher_id_idx').on(table.requesterTeacherId),
  statusIdx: index('substitution_requests_status_idx').on(table.status),
}));

export const substitutionRequestsRelations = relations(substitutionRequests, ({ one }) => ({
  schedule: one(teacherSchedules, {
    fields: [substitutionRequests.scheduleId],
    references: [teacherSchedules.id],
  }),
  requesterTeacher: one(teachers, {
    fields: [substitutionRequests.requesterTeacherId],
    references: [teachers.id],
  }),
  substituteTeacher: one(teachers, {
    fields: [substitutionRequests.substituteTeacherId],
    references: [teachers.id],
  }),
}));

// ============================================================================
// PARENT VISITOR PORTAL
// ============================================================================

export const visitorRequests = pgTable('visitor_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').notNull().references(() => parents.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id').notNull().references(() => students.id),
  visitorName: varchar('visitor_name', { length: 255 }).notNull(),
  visitorPhone: varchar('visitor_phone', { length: 20 }),
  visitorRelationship: varchar('visitor_relationship', { length: 100 }),
  visitPurpose: varchar('visit_purpose', { length: 255 }).notNull(),
  requestedDate: timestamp('requested_date').notNull(),
  status: visitorStatusEnum('status').default('PENDING').notNull(),
  qrCode: text('qr_code'),
  qrCodeGeneratedAt: timestamp('qr_code_generated_at'),
  checkedInAt: timestamp('checked_in_at'),
  checkedOutAt: timestamp('checked_out_at'),
  checkedInByGuardId: uuid('checked_in_by_guard_id').references(() => users.id),
  denialReason: text('denial_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  parentIdIdx: index('visitor_requests_parent_id_idx').on(table.parentId),
  studentIdIdx: index('visitor_requests_student_id_idx').on(table.studentId),
  statusIdx: index('visitor_requests_status_idx').on(table.status),
  requestedDateIdx: index('visitor_requests_requested_date_idx').on(table.requestedDate),
}));

export const visitorRequestsRelations = relations(visitorRequests, ({ one }) => ({
  parent: one(parents, {
    fields: [visitorRequests.parentId],
    references: [parents.id],
  }),
  student: one(students, {
    fields: [visitorRequests.studentId],
    references: [students.id],
  }),
  checkedInByGuard: one(users, {
    fields: [visitorRequests.checkedInByGuardId],
    references: [users.id],
  }),
}));

// ============================================================================
// NOOR SYSTEM INTEGRATION
// ============================================================================

export const noorSyncLogs = pgTable('noor_sync_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  syncType: varchar('sync_type', { length: 50 }).notNull(), // ATTENDANCE, STUDENTS, TEACHERS
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  totalRecords: integer('total_records').default(0),
  successfulRecords: integer('successful_records').default(0),
  failedRecords: integer('failed_records').default(0),
  status: varchar('status', { length: 50 }).default('IN_PROGRESS').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const noorAttendanceComparison = pgTable('noor_attendance_comparison', {
  id: uuid('id').primaryKey().defaultRandom(),
  attendanceId: uuid('attendance_id').notNull().references(() => attendance.id, { onDelete: 'cascade' }),
  noorRecordId: varchar('noor_record_id', { length: 100 }),
  systemStatus: attendanceStatusEnum('system_status').notNull(),
  noorStatus: varchar('noor_status', { length: 50 }).notNull(),
  isMatched: boolean('is_matched').notNull(),
  discrepancyReason: text('discrepancy_reason'),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  attendanceIdIdx: index('noor_attendance_comparison_attendance_id_idx').on(table.attendanceId),
  isMatchedIdx: index('noor_attendance_comparison_is_matched_idx').on(table.isMatched),
}));

// ============================================================================
// EXPORT ALL RELATIONS
// ============================================================================

export const allRelations = {
  usersRelations,
  studentsRelations,
  teachersRelations,
  parentsRelations,
  geofenceCheckInsRelations,
  attendanceRelations,
  studentViolationsRelations,
  violationCounselorAssignmentsRelations,
  messagesRelations,
  teacherSchedulesRelations,
  substitutionRequestsRelations,
  visitorRequestsRelations,
};
