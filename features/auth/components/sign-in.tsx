import BottomSheet from "@/components/ui/bottom-sheet";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";
import Feather from "@expo/vector-icons/Feather";
import { Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useSignIn } from "../hooks/use-signin";
import { SignInRequest, SignInRequestSchema } from "../schemas/auth-schema";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function SignInAuth({ show, setShow }: Props) {
  const form = useZodForm(SignInRequestSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useSignIn();

  const onSubmit = (data: SignInRequest) => {
    mutation.mutate(data);
    setShow(false);
  };

  return (
    <BottomSheet
      visible={show}
      onClose={() => setShow(false)}
      title="Masuk Akun"
      snapHeight={0.7}
    >
      <View style={style.form}>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Input
              label="Email"
              prefixIcon={<Feather name="mail" size={18} color="#999" />}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              label="Password"
              prefixIcon={<Feather name="lock" size={18} color="#999" />}
              secure
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Button
          title="Masuk"
          fullWidth
          disabled={mutation.isPending}
          style={style.submitBtn}
          onPress={form.handleSubmit(onSubmit)} // ✅ validasi zod sebelum submit
        />
      </View>
    </BottomSheet>
  );
}

const style = StyleSheet.create({
  form: {
    flex: 1,
    gap: 4,
  },
  submitBtn: {
    marginTop: 12,
  },
});
