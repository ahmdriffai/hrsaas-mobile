import { useQuery } from "@tanstack/react-query";
import {
  getCurrentTimeOffService,
  GetCurrentTimeOffParams,
} from "../services/get-current-timeoff-service";

export const useGetCurrentTimeOff = (params?: GetCurrentTimeOffParams) =>
  useQuery({
    queryKey: ["time-off-requests", "current", params],
    queryFn: () => getCurrentTimeOffService(params),
  });
