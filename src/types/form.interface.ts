import { z } from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'Name must start with an uppercase letter'),
    age: z.coerce.number().min(0) as unknown as number,
    email: z.email({ message: 'Invalid email' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[A-Z]/, 'Must contain uppercase')
      .regex(/[a-z]/, 'Must contain lowercase')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirm_password: z.string(),
    gender: z.enum(['male', 'female'], 'Gender is required'),
    country: z.string().min(1, 'Country is required'),
    file: z
      .any()
      .refine((file: File | FileList) => {
        const neededData = file instanceof FileList ? file[0] : file;
        return neededData && neededData.size <= 5 * 1024 * 1024;
      }, 'File must be <= 5MB')
      .refine((file) => {
        const neededData = file instanceof FileList ? file[0] : file;
        return neededData && ['image/png', 'image/jpeg'].includes(neededData.type);
      }, 'Only PNG or JPEG allowed'),
    agreement: z.boolean().refine((val) => val === true, { message: 'You must accept T&C' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

export type FormSchema = z.infer<typeof formSchema>;