import { api } from "@/lib/axios";
import { PaginatedData } from "@/lib/types";
import {
  SearchTimeOffApproval,
  TimeOffApproval,
  TimeOffApprovalListSchema,
} from "../schemas/time-off-approval-schema";

export const getTimeOffApprovalsService = async (
  params?: SearchTimeOffApproval
): Promise<PaginatedData<TimeOffApproval>> => {
  const response = await api.get("/time-off-approvals/_current", { params });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memuat data persetujuan cuti");
  }

  const data = TimeOffApprovalListSchema.parse(response.data.data);

  return { ...response.data, data };
};
