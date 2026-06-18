import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";
import { EmployeeContract } from "@/features/employee/schemas/employee-schema";

export const getContractsService = async (
  employeeId: string,
): Promise<PaginatedData<EmployeeContract>> => {
  const response = await api.get("/employee-contracts", {
    params: { employee_id: employeeId, page: 1, size: 50 },
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data kontrak");
  }

  return { ...response.data, data: response.data.data };
};
