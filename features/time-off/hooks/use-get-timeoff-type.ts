import { useQuery } from "@tanstack/react-query";
import { getAllTimeOffTypeService } from "../services/get-all-time-off-type-service";

export const useGetTimeOffType = () =>
  useQuery({
    queryKey: ["time-off-types"],
    queryFn: getAllTimeOffTypeService,
  });
