import { z } from 'zod';

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required'),

  description: z
    .string()
    .optional(),

  price: z
    .number()
    .min(0, 'Price must be greater than or equal to 0')
    .optional(),

  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock must be greater than or equal to 0')
    .optional(),

  categoryId: z
    .uuid('categoryId must be a valid UUID')
    .optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;