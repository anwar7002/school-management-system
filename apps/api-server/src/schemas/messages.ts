import { z } from 'zod';

export const messageSchema = z.object({
  conversationId: z.string().uuid(),
  receiverId: z.string().uuid().optional(),
  content: z.string().min(1),
  mediaUrl: z.string().optional(),
  mediaType: z.string().optional(),
});

export const createConversationSchema = z.object({
  title: z.string().optional(),
  isGroupChat: z.boolean().optional(),
  participantIds: z.array(z.string().uuid()),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
