import { PhotoResult } from "@/components/ui/camera-capture";
import { uploadPhoto } from "@/services/upload-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { VisitForm } from "../schemas/visit-schema";
import { createVisitService } from "../services/create-visit-service";

export type CreateVisitInput = VisitForm & {
  photo: PhotoResult;
  latitude: string;
  longitude: string;
  address: string;
};

export const useCreateVisit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photo, ...visitData }: CreateVisitInput) => {
      const file_url = await uploadPhoto(photo);
      return createVisitService({ ...visitData, file_url });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Visit berhasil dibuat",
      });
      router.back();
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Gagal",
        text2: error.message || "Gagal membuat visit",
      });
    },
  });
};
