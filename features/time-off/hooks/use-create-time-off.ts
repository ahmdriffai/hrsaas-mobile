import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { TimeOffRequest } from "../schemas/time-off-schema";
import { createTimeOffService } from "../services/create-time-off-service";

export const useCreateTimeOff = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TimeOffRequest) => createTimeOffService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off-requests"] });
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Pengajuan cuti berhasil dikirim",
      });
      router.replace("/time-off");
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: error.message || "Gagal mengajukan cuti",
      });
    },
  });
};
