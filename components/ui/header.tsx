import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const navigation = useNavigation();
  return (
    <View className="flex flex-row gap-x-3 px-4 py-6 border-b items-center border-gray-200 bg-white">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={23} />
      </TouchableOpacity>
      <Text className="font-semibold text-lg">{title}</Text>
    </View>
  );
}
