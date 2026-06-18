import { api } from "@/lib/axios";
import { Employee } from "../schemas/employee-schema";

export const getCurrentEmployeeService = async (): Promise<Employee> => {
  const response = await api.get("/employees/_current");

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data karyawan");
  }

  return response.data.data;
};
