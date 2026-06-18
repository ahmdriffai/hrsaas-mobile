import { useQuery } from "@tanstack/react-query";
import { getDocsService } from "../services/get-docs-service";

export const useGetDocs = (employeeId?: string) =>
  useQuery({
    queryKey: ["employee-docs", employeeId],
    queryFn: () => getDocsService(employeeId!),
    enabled: !!employeeId,
    placeholderData: (prev) => prev,
  });
