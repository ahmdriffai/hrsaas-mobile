import React from "react";
import { Text, View } from "react-native";

interface TitleProps {
  title: string;
}
export default function Title({ title }: TitleProps) {
  return (
    <View className="mx-4 my-4">
      <Text className="text-lg">{title}</Text>
    </View>
  );
}
