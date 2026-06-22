import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { Attendance, AttendanceRequest } from "../schemas/attendance-schema";

export const checkoutService = async (
  payload: AttendanceRequest,
): Promise<ResponseData<Attendance>> => {
  const response = await api.post("/attendances/check-out", payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(
      response.data?.error || response.data?.message || "Gagal melakukan check-out",
    );
  }

  return response.data;
};
