import { z } from 'zod';

import { STATUS_VALUES } from '@app/constants/status.constants';
import { createCategorySchema } from '@app/modules/categories/dto/create-category.dto';

export const updateCategorySchema = createCategorySchema.partial().extend({
  status: z.enum(STATUS_VALUES).optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
