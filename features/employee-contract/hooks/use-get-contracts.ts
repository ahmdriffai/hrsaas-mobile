import { useQuery } from "@tanstack/react-query";
import { getContractsService } from "../services/get-contracts-service";

export const useGetContracts = (employeeId?: string) =>
  useQuery({
    queryKey: ["employee-contracts", employeeId],
    queryFn: () => getContractsService(employeeId!),
    enabled: !!employeeId,
    placeholderData: (prev) => prev,
  });
