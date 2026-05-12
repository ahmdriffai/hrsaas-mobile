import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { CreateVisit, Visit } from "../schemas/visit-schema";

export const createVisitService = async (
  payload: CreateVisit,
): Promise<ResponseData<Visit>> => {
  const response = await api.post("/visits/", payload);

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal mengajukan cuti");
  }

  return response.data;
};
