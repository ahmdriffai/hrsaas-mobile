import Button from "@/components/fragments/button/button";
import Input from "@/components/fragments/input/input";

import { useAuth } from "@/lib/context/authContext";
import { useForm } from "@/lib/hooks/useForm";
import { login } from "@/lib/service/authService";

import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Logo = require("@/assets/images/logo.png");

export default function SignIn() {
  const { signIn, loading } = useAuth();
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { form, handleChange } = useForm({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    const response = await login(form.username, form.password);
    const responseBody = await response.json();

    if (response.status === 200) {
      const data = responseBody.data;
      await signIn(data.token, data.user);
    } else {
      setError(true);
      setMessage(
        responseBody.error === "Invalid request body"
          ? "Username atau password salah"
          : responseBody.error,
      );
    }
  };

  return (
    <View className="flex-1 w-full bg-white items-center px-5">
      {/* Header */}
      <View className="justify-center items-center mt-36 mb-5 gap-3">
        <Image source={Logo} className="w-[180px] h-[37px]" />
        <Text className="font-bold text-base">Aplikasi Absensi Online</Text>
        <Text className="text-center text-gray-400 text-sm">
          Silahkan login menggunakan akun karyawan perusahaan anda.
        </Text>
      </View>

      {/* Form */}
      <View className="w-full mb-8 gap-5">
        <Input
          label="Username / Email"
          value={form.username}
          onChange={(value) => handleChange("username", value)}
        />
        <Input
          label="Password"
          value={form.password}
          onChange={(value) => handleChange("password", value)}
          type="password"
        />

        <Pressable>
          <Text className="text-[13px] text-[#3F9AAE]">Lupa Password?</Text>
        </Pressable>
      </View>

      {/* Button */}
      <Button
        variant="primary"
        onPress={handleLogin}
        loading={loading}
        className="w-full"
        disabled={loading}
      >
        Login
      </Button>

      {/* Register */}
      <Pressable className="mt-3">
        <Text className="text-[13px] text-[#3F9AAE]">
          Belum Punya Akun Karyawan?
        </Text>
      </Pressable>

      {/* Footer */}
      <View className="absolute bottom-5">
        <Text className="text-[#3F9AAE] font-semibold">Versi 0.1.0</Text>
      </View>
    </View>
  );
}
