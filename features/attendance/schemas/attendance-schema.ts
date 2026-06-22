import z from "zod/v3";

export const AttendanceRequestSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  face_image_url: z.string().url(),
  device_info: z.string(),
});

export const AttendanceSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  date: z.string(),
  check_in: z.string().nullable(),
  check_out: z.string().nullable(),
  status: z.string(),
});

export const AttendanceHistorySchema = z.object({
  id: z.string(),
  company_id: z.string(),
  employee_id: z.string(),
  date: z.number(),
  check_in_time: z.number(),
  check_out_time: z.number(),
  status: z.string(),
});

export const GetCurrentAttendanceParamsSchema = z.object({
  status: z.string().optional(),
  date: z.number().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export type AttendanceRequest = z.infer<typeof AttendanceRequestSchema>;
export type Attendance = z.infer<typeof AttendanceSchema>;
export type AttendanceHistory = z.infer<typeof AttendanceHistorySchema>;
export type GetCurrentAttendanceParams = z.infer<typeof GetCurrentAttendanceParamsSchema>;
