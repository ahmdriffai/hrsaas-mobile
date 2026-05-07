import Title from "@/components/ui/title";
import { Colors } from "@/constans/color";
import ListTimeOff from "@/features/time-off/components/list-time-off";
import SubmitCardTimeOff from "@/features/time-off/components/submit-card-time-off";
import TimeOffCard from "@/features/time-off/components/time-off-card";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TimeOffPage() {
  const router = useRouter();
  const handleSubmitPress = () => {
    router.push("/time-off/create");
  };
  return (
    <>
      <View style={style.container}>
        <View style={style.bgHeader}>
          <Title
            title="Izin & Cuti"
            subtitle="Pengajuan Izin & Cuti"
            showBack
            light
          />
        </View>
        <View style={style.mainContainer}>
          <TimeOffCard />
          <ListTimeOff />
        </View>
      </View>
      <SubmitCardTimeOff onPress={handleSubmitPress} />
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
  },
  bgHeader: {
    backgroundColor: Colors.light.primary,
    minHeight: 230,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 40,
    position: "relative",
  },
  title: {
    color: Colors.light.textInverse,
    fontSize: 25,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.light.textInverse,
    fontSize: 12,
    fontWeight: "400",
  },
  mainContainer: {
    paddingHorizontal: 20,
    position: "relative",
    top: -100,
    flex: 1,
  },
});
