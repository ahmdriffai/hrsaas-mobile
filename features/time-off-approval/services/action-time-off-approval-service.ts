import { api } from "@/lib/axios";
import { ResponseData } from "@/lib/types";
import { ActionTimeOffApproval } from "../schemas/time-off-approval-schema";

export const actionTimeOffApprovalService = async (
  id: string,
  payload: ActionTimeOffApproval
): Promise<ResponseData<unknown>> => {
  const response = await api.patch(`/time-off-approvals/${id}`, payload);

  if (response.status !== 200) {
    throw new Error(response.data.error || "Gagal memproses persetujuan");
  }

  return response.data;
};
