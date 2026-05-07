import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function BackButton() {
  const router = useRouter();
  return (
    <View className="flex-row mr-4">
      <TouchableOpacity
        className="p-1 bg-white rounded-full border border-gray-200"
        onPress={() => router.push("/(tabs)")}
      >
        <Feather name="chevron-left" size={24} />
      </TouchableOpacity>
    </View>
  );
}
