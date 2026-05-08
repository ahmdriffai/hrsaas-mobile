import { z } from "zod/v3";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  employee: z
    .object({
      id: z.string(),
      company_id: z.string(),
      user_id: z.string(),
      employee_number: z.string(),
      fullname: z.string(),
      birth_place: z.string(),
      birth_date: z.number(),
      blood_type: z.string(),
      marital_status: z.string(),
      religion: z.string(),
      phone: z.string(),
      timezone: z.string(),
    })
    .optional(),
  company_id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const AuthSchema = z.object({
  user: UserSchema,
  token: z.string().min(10, "Token tidak ada"),
});

export const SignInRequestSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(4, "Minimal 4 karakter"),
});

export type User = z.infer<typeof UserSchema>;
export type Auth = z.infer<typeof AuthSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
