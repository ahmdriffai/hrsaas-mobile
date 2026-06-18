import { useQuery } from "@tanstack/react-query";
import { getCurrentEmployeeService } from "../services/get-current-employee-service";

export const useGetCurrentEmployee = () => {
  return useQuery({
    queryKey: ["employee-current"],
    queryFn: getCurrentEmployeeService,
  });
};
