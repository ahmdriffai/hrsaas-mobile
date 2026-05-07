import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function HeroCard() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    // Function to update the time
    const updateClock = () => {
      setTime(new Date());
    };

    // Set up an interval to call updateClock every 1000 milliseconds (1 second)
    const timerId = setInterval(updateClock, 1000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(timerId);
    };
  }, []); // The empty dependency array ensures the effect runs only once on mount

  // Format the time as a readable string
  const formattedTime = time.toLocaleTimeString();
  return (
    <View className="bg-linear-to-bl to-[#3F9AAE] from-[#79C9C5] p-5 rounded-2xl">
      <View className="flex flex-row gap-x-3 border-b pb-4 border-white/10">
        <View className="bg-white/30 p-2 px-3 rounded-xl items-center justify-center">
          <Feather size={22} name="clock" color="white" />
        </View>
        <View className="flex gap-2 items-center">
          <Text className="text-[10px] text-white font-light">Check-in</Text>
          <Text className="text-lg text-white font-semibold">08:40</Text>
        </View>
        <View className="px-5">
          <Text className="text-white text-2xl">...</Text>
        </View>
        <View className="flex gap-2 items-center">
          <Text className="text-[10px] text-white font-light">Check-out</Text>
          <Text className="text-lg text-white font-semibold">-</Text>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center mt-3">
        <Text className="text-white font-semibold">{formattedTime} WIB</Text>
        <Text className="text-white font-light text-xs">
          Kamis, 18 Januari 2026
        </Text>
      </View>
    </View>
  );
}
