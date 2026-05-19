import HeroCard from "@/components/ui/hero-card";
import Text from "@/components/ui/text";
import { useAuth } from "@/features/auth/context/auth-context";
import Feather from "@expo/vector-icons/Feather";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

type FeatherIconName = React.ComponentProps<typeof Feather>["name"];

type Menu = {
  title: string;
  desc: string;
  icon: FeatherIconName;
  bgColor: string;
  iconColor: string;
  route: Href;
};

const menus: Menu[] = [
  // {
  //   title: "Absensi",
  //   desc: "Kehadiran Harian",
  //   icon: "clock",
  //   bgColor: "bg-green-100",
  //   iconColor: "green",
  //   route: "/presence",
  // },
  // {
  //   title: "Istirahat",
  //   desc: "Mulai dan akhir istirahat",
  //   icon: "coffee",
  //   bgColor: "bg-yellow-100",
  //   iconColor: "orange",
  //   route: "/presence",
  // },
  {
    title: "Cuti & Izin",
    desc: "Pengajuan izin dan cuti",
    icon: "calendar",
    bgColor: "bg-fuchsia-200",
    iconColor: "fuchsia",
    route: "/time-off",
  },
  {
    title: "Persetujuan Cuti",
    desc: "Persetujuan karyawan cuti",
    icon: "check-circle",
    bgColor: "bg-blue-100",
    iconColor: "blue",
    route: "/time-off-approval",
  },
  {
    title: "Kunjungan Client",
    desc: "Pengajuan kunjungan client",
    icon: "map-pin",
    bgColor: "bg-red-100",
    iconColor: "red",
    route: "/visit",
  },
  // {
  //   title: "Kalender",
  //   desc: "Jadwal & Event Perusahaan",
  //   icon: "calendar",
  //   bgColor: "bg-blue-100",
  //   iconColor: "blue",
  //   route: "/presence",
  // },
  // {
  //   title: "Claim",
  //   desc: "Pengajuan reimbursement",
  //   icon: "file-text",
  //   bgColor: "bg-indigo-100",
  //   iconColor: "indigo",
  //   route: "/presence",
  // },
  // {
  //   title: "Gaji",
  //   desc: "Slip gaji & riwayat",
  //   icon: "file-text",
  //   bgColor: "bg-green-100",
  //   iconColor: "green",
  //   route: "/presence",
  // },
  // {
  //   title: "Data Karyawan",
  //   desc: "Daftar dan kontak karyawan",
  //   icon: "users",
  //   bgColor: "bg-blue-100",
  //   iconColor: "blue",
  //   route: "/presence",
  // },

  // // 🔥 Tambah tombol baru di sini
  // {
  //   title: "Project",
  //   desc: "Daftar dan progress project",
  //   icon: "briefcase",
  //   bgColor: "bg-purple-100",
  //   iconColor: "purple",
  //   route: "/presence",
  // },
  // {
  //   title: "Dokumen",
  //   desc: "File perusahaan & SOP",
  //   icon: "folder",
  //   bgColor: "bg-amber-100",
  //   iconColor: "orange",
  //   route: "/presence",
  // },
  // {
  //   title: "Sanksi",
  //   desc: "Peringatan dan Sanksi",
  //   icon: "info",
  //   bgColor: "bg-amber-100",
  //   iconColor: "orange",
  //   route: "/sanction",
  // },
];

export default function Beranda() {
  // Initialize the state with the current time
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const visibleMenus = showAll ? menus : menus.slice(0, 6);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-white pt-2 px-6 pb-7 border-b border-gray-100">
        <View className="py-4 flex flex-row items-center justify-between">
          <View className="flex gap-1">
            <Text className="text-xs text-gray-600">Selamat Pagi</Text>
            <Text className="text-xl font-semibold">{user?.name}</Text>
          </View>
          {/* <TouchableOpacity className="relative" onPress={signOut}>
            <Feather size={22} name="bell" />
            <View className="w-2 h-2 bg-primary absolute right-0 rounded-full"></View>
          </TouchableOpacity> */}
        </View>

        {/* Hero card */}
        <HeroCard />
      </View>

      {/* Menu  */}
      <View className="flex-row flex-wrap mx-3 mt-4">
        {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
        {visibleMenus.map((menu, index) => (
          <View key={index} className="w-1/2 sm:w-1/2 lg:w-1/3 p-1">
            <TouchableOpacity
              className="bg-white p-4 rounded-2xl"
              onPress={() => router.push(menu.route)}
            >
              <View className={`${menu.bgColor} self-start p-2 rounded-xl`}>
                <Feather name={menu.icon} size={20} color={menu.iconColor} />
              </View>
              <Text className="text-xs font-medium mt-2">{menu.title}</Text>
              <Text className="text-[10px] text-gray-400">{menu.desc}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {menus.length > 6 && (
        <View className="items-center mt-1 mb-7">
          <TouchableOpacity
            onPress={() => setShowAll(!showAll)}
            className="bg-white px-4 py-2 rounded-xl"
          >
            <Text className="text-xs font-medium text-gray-600 flex-row justify-center gap-1">
              {showAll ? (
                <>
                  Lihat Lebih Sedikit <Feather name="chevron-up" />
                </>
              ) : (
                <>
                  Lihat Semua <Feather name="chevron-down" />
                </>
              )}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
