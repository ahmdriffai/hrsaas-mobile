import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function BackButton() {
  const router = useRouter();
  return (
    <View className="flex-row mr-4">
      <TouchableOpacity
        className="p-1.5 bg-gray-50 rounded-full border-gray-200"
        onPress={() => router.back()}
      >
        <Feather name="chevron-left" size={22} color={Colors.light.primary} />
      </TouchableOpacity>
    </View>
  );
}
