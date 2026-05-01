import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name required'),
  description: z.string().optional(),
})

export const addMemberSchema = z.object({
  email: z.string().email('Valid email required'),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
