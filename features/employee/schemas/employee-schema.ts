import { UserSchema } from "@/features/auth/schemas/auth-schema";
import z from "zod/v3";

export const DivisionSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Position = {
  id: string;
  name: string;
  is_approver: boolean;
  company_id: string;
  parent?: Position;
};

export const PositionSchema: z.ZodType<Position> = z.object({
  id: z.string(),
  name: z.string(),
  is_approver: z.boolean(),
  company_id: z.string(),
  parent: z.lazy(() => PositionSchema).optional(),
});

const EmployeeRefSchema = z.object({
  id: z.string(),
  employee_number: z.string(),
  fullname: z.string(),
  phone: z.string().optional(),
  gender: z.string().optional(),
});

export const EMPLOYEE_STATUS_OPTIONS = [
  "A1", "A2", "A3", "A4",
  "B1", "B2", "B3", "B4",
  "C1", "C2", "C3", "C4",
  "D1", "D2",
] as const;

export type EmployeeStatus = typeof EMPLOYEE_STATUS_OPTIONS[number];

export const EmployeeContractSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  contract_type: z.string(),
  start_date: z.number(),
  end_date: z.number().nullable().optional(),
  division_id: z.string(),
  position_id: z.string(),
  salary: z.number(),
  employee_status: z.enum(EMPLOYEE_STATUS_OPTIONS).nullable().optional(),
  is_active: z.boolean(),
  division: DivisionSchema,
  position: PositionSchema,
  employee: EmployeeRefSchema.optional(),
});

export const EmployeeDocumentSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  employee_name: z.string(),
  doc_type: z.string(),
  doc_name: z.string(),
  doc_number: z.string(),
  file_url: z.string(),
  issued: z.number(),
  created_at: z.number(),
  updated_at: z.number(),
});

export const EmployeeEducationSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  employee_id: z.string(),
  employee_name: z.string(),
  education_level: z.string(),
  institution_name: z.string(),
  major: z.string(),
  graduation_year: z.number().int(),
  gpa: z.number().optional(),
  start_year: z.number().int().optional(),
  end_year: z.number().int().optional(),
});

export const EmployeeTrainingSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  employee_id: z.string(),
  employee_name: z.string(),
  training_name: z.string(),
  organizer: z.string(),
  start_date: z.number().int(),
  end_date: z.number().int().optional(),
  certificate_url: z.string().optional(),
});

export const EmployeeSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  user_id: z.string().uuid(),
  employee_number: z.string().max(20),
  fullname: z.string().min(2).max(100),
  gender: z.string().optional(),
  birth_place: z.string().max(100),
  birth_date: z.number().int(),
  identity_number: z.string().optional(),
  blood_type: z.string().max(10),
  marital_status: z.string().max(20),
  religion: z.string().max(50),
  phone: z.string().max(20),
  address: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().max(10),
  contracts: z.array(EmployeeContractSchema).optional(),
  employee_docs: z.array(EmployeeDocumentSchema).optional(),
  employee_educations: z.array(EmployeeEducationSchema).optional(),
  employee_trainings: z.array(EmployeeTrainingSchema).optional(),
  user: UserSchema,
  is_active: z.boolean().optional(),
  created_at: z.number().int().optional(),
  updated_at: z.number().int().optional(),
});

export type Employee = z.infer<typeof EmployeeSchema>;
export type EmployeeContract = z.infer<typeof EmployeeContractSchema>;
export type EmployeeDocument = z.infer<typeof EmployeeDocumentSchema>;
export type EmployeeEducation = z.infer<typeof EmployeeEducationSchema>;
export type EmployeeTraining = z.infer<typeof EmployeeTrainingSchema>;
export type Division = z.infer<typeof DivisionSchema>;
