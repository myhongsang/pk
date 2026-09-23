import { z } from 'zod';

import { createCategorySchema } from '@app/modules/categories/dto/create-category.dto';

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
