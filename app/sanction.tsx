import Header from "@/components/fragment/header";
import Title from "@/components/fragment/title";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Sanction() {
  return (
    <SafeAreaView className="flex-1">
      <Header title="Sanksi / Peringatan" />
      <View className="flex flex-row items-center justify-start gap-x-4 mx-3 mt-5 bg-white rounded-2xl border border-gray-200 p-4">
        <View className="bg-blue-100 self-start p-3 rounded-full">
          <Feather name="check-circle" size={20} color="blue" />
        </View>
        <View>
          <Text className="font-semibold text-[14px]">Performa Baik</Text>
          <Text className="text-[12px] font-medium text-gray-500">
            Tidak ada pelanggaran bulan ini
          </Text>
        </View>
      </View>
      <Title title="Riwayat" />
      <View className="mx-3 p-4 bg-white border border-gray-200 rounded-2xl">
        <View className="flex flex-row justify-between ">
          <View className="flex gap-y-1">
            <Text className="font-semibold">Keterlambatan</Text>
            <Text className="text-[11px] text-gray-500">20 Des 2025</Text>
            <Text className="text-[12px]">Terlambat 25 menit</Text>
          </View>

          <Text className="text-[10px] p-2 font-semibold bg-primary/10 rounded-4xl self-center">
            Keterlambatan
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
