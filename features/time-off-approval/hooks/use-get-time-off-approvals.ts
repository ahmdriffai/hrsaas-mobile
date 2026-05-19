import { useQuery } from "@tanstack/react-query";
import { getTimeOffApprovalsService } from "../services/get-time-off-approvals-service";
import { SearchTimeOffApproval } from "../schemas/time-off-approval-schema";

export const useGetTimeOffApprovals = (params?: SearchTimeOffApproval) =>
  useQuery({
    queryKey: ["time-off-approvals", "current", params],
    queryFn: () => getTimeOffApprovalsService(params),
  });
