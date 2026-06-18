import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";
import {
  EmployeeSanction,
  SearchEmployeeSanction,
} from "../schemas/sanction-schema";

export const searchSanctionService = async (
  params?: SearchEmployeeSanction,
): Promise<PaginatedData<EmployeeSanction>> => {
  const response = await api.get("/employee-sanctions/_current", { params });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data sanksi");
  }

  return { ...response.data, data: response.data.data };
};
