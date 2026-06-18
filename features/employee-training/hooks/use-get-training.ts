import { useQuery } from "@tanstack/react-query";
import { getTrainingService } from "../services/get-training-service";

export const useGetTraining = (employeeId?: string) => {
  return useQuery({
    queryKey: ["employee-trainings", employeeId],
    queryFn: () => getTrainingService(employeeId!),
    enabled: !!employeeId,
  });
};
