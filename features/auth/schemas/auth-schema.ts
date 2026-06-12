import { z } from "zod/v3";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const UserEmployeeSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  user_id: z.string().uuid(),
  employee_number: z.string(),
  fullname: z.string(),
  gender: z.string().optional(),
  birth_place: z.string(),
  birth_date: z.number().int(),
  identity_number: z.string().optional(),
  blood_type: z.string(),
  marital_status: z.string(),
  religion: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string(),
  is_active: z.boolean().optional(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  email_verified: z.boolean().optional(),
  roles: z.array(RoleSchema).optional(),
  permissions: z.array(z.object({ name: z.string() })).optional(),
  company_id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  employee: UserEmployeeSchema.optional(),
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
export type UserEmployee = z.infer<typeof UserEmployeeSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type Auth = z.infer<typeof AuthSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
