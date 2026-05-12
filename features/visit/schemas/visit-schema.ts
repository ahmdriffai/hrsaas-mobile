import z from "zod/v3";

export const DetailVisitSchema = z.object({
  id: z.string(),
  visit_type: z.string(),
  visit_at: z.string(),
  date_visit: z.string(),
  file_url: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  address: z.string(),
  note: z.string(),
  visit_id: z.string(),
  created_at: z.number(),
});

export const VisitSchema = z.object({
  id: z.string(),
  employee_id: z.string(),
  employee_name: z.string(),
  date: z.string(),
  client_name: z.string(),
  created_at: z.number(),
  details: z.array(DetailVisitSchema),
});

export const SearchVisitSchema = z.object({
  visit_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  sort_by: z.string().optional(),
  page: z.number().optional(),
  size: z.number().optional(),
});

export const CreateVisitSchema = z.object({
  visit_type: z.enum(["IN", "OUT"]),
  note: z.string().min(1, "Note is required"),
  client_name: z.string().min(1, "Client name is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  address: z.string().min(1, "Address is required"),
  file_url: z.string().url("Invalid file url"),
});

export const VisitFormSchema = z.object({
  visit_type: z.enum(["IN", "OUT"]),
  client_name: z.string().min(1, "Nama client wajib diisi"),
  note: z.string().min(1, "Catatan visit wajib diisi"),
});

export type DetailVisit = z.infer<typeof DetailVisitSchema>;
export type Visit = z.infer<typeof VisitSchema>;
export type SearchVisit = z.infer<typeof SearchVisitSchema>;
export type CreateVisit = z.infer<typeof CreateVisitSchema>;
export type VisitForm = z.infer<typeof VisitFormSchema>;
