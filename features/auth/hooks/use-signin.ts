import { useAuth } from "@/features/auth/context/auth-context";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { SignInRequest } from "../schemas/auth-schema";
import { signInService } from "../services/signin-service";

export const useSignIn = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (credentials: SignInRequest) =>
      signInService(credentials.email, credentials.password),
    onSuccess: async (data) => {
      await signIn(data.data.token, data.data.user);
      Toast.show({
        type: "success",
        text1: "Berhasil",
        text2: "Berhasil login",
      });
      setTimeout(() => router.replace("/(tabs)"), 100);
    },
    onError: (error) => {
      console.log(error);
      Toast.show({ type: "error", text1: "Gagal", text2: "Gagal login" });
    },
  });
};
