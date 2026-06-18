import { EmployeeEducation } from "@/features/employee/schemas/employee-schema";
import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";

export const getEducationService = async (
  employeeId: string,
): Promise<PaginatedData<EmployeeEducation>> => {
  const response = await api.get("/employee-educations/_current", {
    params: { employee_id: employeeId, page: 1, size: 50 },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data pendidikan");
  }

  return { ...response.data, data: response.data.data };
};
