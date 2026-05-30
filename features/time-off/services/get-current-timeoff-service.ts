import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";
import { TimeOffRequestResponse } from "../schemas/time-off-schema";

export type GetCurrentTimeOffParams = {
  request_status?: string;
  page?: number;
  size?: number;
};

export const getCurrentTimeOffService = async (
  params?: GetCurrentTimeOffParams,
): Promise<PaginatedData<TimeOffRequestResponse>> => {
  const response = await api.get("/time-off-requests/_current", { params });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data cuti");
  }

  const data = response.data.data;

  return { ...response.data, data };
};
