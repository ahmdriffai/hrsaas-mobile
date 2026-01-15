import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function BackButton() {
  const navigation = useNavigation();
  return (
    <View className="flex-row p-4">
      <TouchableOpacity
        className="p-3 bg-white rounded-full border border-gray-200"
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={24} />
      </TouchableOpacity>
    </View>
  );
}
