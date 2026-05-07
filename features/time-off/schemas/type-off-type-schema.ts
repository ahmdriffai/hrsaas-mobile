import { z } from "zod/v3";

export const TimeOffTypeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.enum(["CUTI", "IZIN", "SAKIT"]),
  is_quota_based: z.boolean(),
  default_quota_days: z.number().int().min(0),
});

export const TimeOffTypeListSchema = z.array(TimeOffTypeSchema);
export type TimeOffType = z.infer<typeof TimeOffTypeSchema>;
