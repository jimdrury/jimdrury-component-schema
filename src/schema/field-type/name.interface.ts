import z from 'zod';

export const NameSchema = z
  .string()
  .regex(
    /^[a-z_]+$/,
    'name must only contain lowercase letters and underscores',
  );
