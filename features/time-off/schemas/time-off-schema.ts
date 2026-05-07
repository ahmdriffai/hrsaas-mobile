import { z } from "zod/v3";
import { TimeOffTypeSchema } from "./type-off-type-schema";

export const ApprovalResponseSchema = z.object({
  employee_name: z.string(),
  is_required: z.boolean(),
  status: z.string(),
  action_at: z.number(),
  action_reason: z.string(),
});

export const TimeOffRequestResponseSchema = z.object({
  id: z.string().uuid(),
  employee_id: z.string().uuid(),
  time_off_type_id: z.string().uuid(),
  start_date: z.number(),
  end_date: z.number().nullable().optional(),
  requested_days: z.number().int(),
  request_reason: z.string().nullable().optional(),
  request_status: z.string().nullable().optional(),
  created_at: z.number(),
  time_off_type: TimeOffTypeSchema,
  approvals: z.array(ApprovalResponseSchema),
});

export const TimeOffRequestListSchema = z.array(TimeOffRequestResponseSchema);

export type ApprovalResponse = z.infer<typeof ApprovalResponseSchema>;
export type TimeOffRequestResponse = z.infer<typeof TimeOffRequestResponseSchema>;

export const TimeOffRequestSchema = z
  .object({
    time_off_type_id: z.string().uuid("Tipe cuti tidak valid"),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
    end_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal tidak valid (YYYY-MM-DD)"),
    request_reason: z
      .string()
      .min(3, "Alasan minimal 3 karakter")
      .max(500, "Alasan maksimal 500 karakter"),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "Tanggal selesai tidak boleh sebelum tanggal mulai",
    path: ["end_date"],
  });

export type TimeOffRequest = z.infer<typeof TimeOffRequestSchema>;
