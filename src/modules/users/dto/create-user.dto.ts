import { z } from 'zod';

import { ROLE_VALUES } from '@app/constants/role.constants';

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(255, 'Name must be at most 255 characters'),
  email: z.email('Invalid email address').trim().toLowerCase(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be at most 72 characters'),
  role: z.enum(ROLE_VALUES, 'Invalid role').optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
