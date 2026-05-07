import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { TimeOffRequest } from "../schemas/time-off-schema";

export const createTimeOffService = async (
  payload: TimeOffRequest
): Promise<ResponseData<unknown>> => {
  const response = await api.post("/time-off-requests/", {
    ...payload,
    request_status: "PENDING",
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal mengajukan cuti");
  }

  return response.data;
};
