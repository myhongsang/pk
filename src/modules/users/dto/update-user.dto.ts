import { z } from 'zod';

import { STATUS_VALUES } from '@app/constants/status.constants';
import { createUserSchema } from '@app/modules/users/dto/create-user.dto';

export const updateUserSchema = createUserSchema.partial().extend({
  status: z.enum(STATUS_VALUES).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
