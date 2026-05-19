import { z } from "zod/v3";
import { TimeOffTypeSchema } from "@/features/time-off/schemas/type-off-type-schema";

export const EmployeeSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  employee_number: z.string().optional(),
  phone: z.string().optional(),
});

export const ApprovalsSchema = z.object({
  employee_name: z.string(),
  is_required: z.boolean(),
  status: z.string(),
  action_at: z.number(),
  action_reason: z.string(),
});

export const TimeOffRequestSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  time_off_type_id: z.string(),
  start_date: z.number(),
  end_date: z.number(),
  requested_days: z.number(),
  request_reason: z.string(),
  request_status: z.string(),
  created_at: z.number(),
  employee: EmployeeSchema,
  time_off_type: TimeOffTypeSchema,
  approvals: z.array(ApprovalsSchema),
});

export const TimeOffApprovalSchema = z.object({
  id: z.string(),
  time_off_request_id: z.string(),
  approver_employee_id: z.string(),
  is_required: z.boolean(),
  status: z.string(),
  action_at: z.number(),
  action_reason: z.string(),
  time_off_request: TimeOffRequestSchema,
});

export const TimeOffApprovalListSchema = z.array(TimeOffApprovalSchema);

export const SearchTimeOffApprovalSchema = z.object({
  employee_id: z.string().optional(),
  status: z.enum(["REJECTED", "APPROVED", "PENDING"]).optional(),
  time_off_type_id: z.string().optional(),
  request_status: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const ActionTimeOffApprovalSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  action_reason: z.string(),
});

export type TimeOffApproval = z.infer<typeof TimeOffApprovalSchema>;
export type SearchTimeOffApproval = z.infer<typeof SearchTimeOffApprovalSchema>;
export type ActionTimeOffApproval = z.infer<typeof ActionTimeOffApprovalSchema>;
