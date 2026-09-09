import { ArgumentMetadata, BadRequestException, } from '@nestjs/common';
import { z } from 'zod';

import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    name: z.string().trim().min(1),
    email: z.email().trim().toLowerCase(),
  });

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: Object,
    data: '',
  };

  const pipe = new ZodValidationPipe(schema);

  it('should return the parsed data when the payload is valid', () => {
    const value = { name: 'Alice', email: 'alice@example.com' };

    expect(pipe.transform(value, metadata)).toEqual(value);
  });

  it('should apply transforms when the payload is valid', () => {
    const value = { name: '  Alice  ', email: 'Alice@Example.com' };

    expect(pipe.transform(value, metadata)).toEqual({
      name: 'Alice',
      email: 'alice@example.com',
    });
  });

  it('should throw BadRequestException when the payload is invalid', () => {
    expect(() =>
      pipe.transform({ name: '', email: 'not-an-email' }, metadata),
    ).toThrow(BadRequestException);
  });
});