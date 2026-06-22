import { PhotoResult } from "@/components/ui/camera-capture";
import { uploadPhoto } from "@/services/upload-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { checkoutService } from "../services/checkout-service";

export type CheckoutInput = {
  photo: PhotoResult;
  lat: number;
  lng: number;
};

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photo, lat, lng }: CheckoutInput) => {
      try {
        const face_image_url = await uploadPhoto(photo);
        const device_info = `${Constants.deviceName ?? "Unknown"} - ${Platform.OS} ${Platform.Version}`;
        await checkoutService({ lat, lng, face_image_url, device_info });
        queryClient.invalidateQueries({ queryKey: ["attendances"] });
        Toast.show({
          type: "success",
          text1: "Berhasil",
          text2: "Check-out berhasil dicatat",
        });
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1: "Gagal",
          text2: error?.message || "Gagal melakukan check-out",
        });
      }
    },
  });
};
