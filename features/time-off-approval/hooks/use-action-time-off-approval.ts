import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { ActionTimeOffApproval } from "../schemas/time-off-approval-schema";
import { actionTimeOffApprovalService } from "../services/action-time-off-approval-service";

export const useActionTimeOffApproval = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ActionTimeOffApproval) =>
      actionTimeOffApprovalService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["time-off-approvals"],
        exact: false,
      });
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Persetujuan berhasil diproses",
      });
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: error.message || "Gagal memproses persetujuan",
      });
    },
  });
};
