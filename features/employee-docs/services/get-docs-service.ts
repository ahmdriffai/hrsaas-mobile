import { EmployeeDocument } from "@/features/employee/schemas/employee-schema";
import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";

export const getDocsService = async (
  employeeId: string,
): Promise<PaginatedData<EmployeeDocument>> => {
  const response = await api.get("/employee-docs/_current", {
    params: { employee_id: employeeId, page: 1, size: 50 },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data dokumen");
  }

  return { ...response.data, data: response.data.data };
};
