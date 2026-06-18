import { useQuery } from "@tanstack/react-query";
import { getEducationService } from "../services/get-education-service";

export const useGetEducation = (employeeId?: string) => {
  return useQuery({
    queryKey: ["employee-educations", employeeId],
    queryFn: () => getEducationService(employeeId!),
    enabled: !!employeeId,
  });
};
