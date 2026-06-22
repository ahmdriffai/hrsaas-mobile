import { PaginatedData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AttendanceHistory, GetCurrentAttendanceParams } from "../schemas/attendance-schema";
import { getCurrentAttendanceService } from "../services/get-current-attendance-service";

export const useGetCurrentAttendance = (params?: GetCurrentAttendanceParams) =>
  useQuery<PaginatedData<AttendanceHistory>>({
    queryKey: ["attendances", "current", params],
    queryFn: () => getCurrentAttendanceService(params),
  });
