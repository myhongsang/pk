import { z } from 'zod';

import { createUserSchema } from '@app/modules/users/dto/create-user.dto';

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
