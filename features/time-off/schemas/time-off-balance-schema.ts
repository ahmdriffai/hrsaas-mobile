import { z } from "zod/v3";
import { TimeOffTypeSchema } from "./type-off-type-schema";

export const TimeOffBalanceSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string(),
  employee_id: z.string().uuid(),
  time_off_type_id: z.string().uuid(),
  period_year: z.number().int(),
  entitled_days: z.number().int(),
  used_days: z.number().int(),
  remaining_days: z.number().int(),
  employee: z.record(z.unknown()).optional(),
  time_off_type: TimeOffTypeSchema,
});

export const TimeOffBalanceListSchema = z.array(TimeOffBalanceSchema);

export type TimeOffBalance = z.infer<typeof TimeOffBalanceSchema>;
