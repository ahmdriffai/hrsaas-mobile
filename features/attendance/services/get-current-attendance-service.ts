import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";
import {
  AttendanceHistory,
  GetCurrentAttendanceParams,
} from "../schemas/attendance-schema";

export const getCurrentAttendanceService = async (
  params?: GetCurrentAttendanceParams,
): Promise<PaginatedData<AttendanceHistory>> => {
  const response = await api.get("/attendances/_current", { params });

  if (response.status !== 200) {
    throw new Error(
      response.data?.error || response.data?.message || "Gagal memuat riwayat kehadiran",
    );
  }

  return { ...response.data, data: response.data.data };
};
