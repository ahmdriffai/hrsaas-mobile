import z from "zod/v3";

export const SanctionTypeSchema = z.object({
  id: z.string(),
  company_id: z.string(),
  name: z.string(),
  description: z.string(),
  note: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
});

const SanctionEmployeeSchema = z.object({
  id: z.string(),
  employee_number: z.string(),
  fullname: z.string(),
  phone: z.string().optional(),
  gender: z.string().optional(),
});

export const EmployeeSanctionSchema = z.object({
  id: z.string(),
  employee: SanctionEmployeeSchema,
  sanction: SanctionTypeSchema,
  reason: z.string(),
  start_date: z.number(),
  end_date: z.number(),
  document_url: z.string(),
  status: z.string().optional(),
});

export const SearchEmployeeSanctionSchema = z.object({
  employee_id: z.string().optional(),
  sanction_id: z.string().optional(),
  reason: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type SanctionType = z.infer<typeof SanctionTypeSchema>;
export type EmployeeSanction = z.infer<typeof EmployeeSanctionSchema>;
export type SearchEmployeeSanction = z.infer<typeof SearchEmployeeSanctionSchema>;
