import Title from "@/components/ui/title";
import { Colors } from "@/constans/color";
import CardVisit from "@/features/visit/components/card-visit";
import ListVisit from "@/features/visit/components/list-visit";
import SubmitCardVisit from "@/features/visit/components/submit-card-visit";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function VisitPage() {
  const router = useRouter();
  const handleSubmitPress = () => {
    router.push("/visit/create");
  };
  return (
    <>
      <View style={style.container}>
        <View style={style.bgHeader}>
          <Title
            title="Kunjungan Client"
            subtitle="Pengajuan Izin & Cuti"
            showBack
            light
          />
        </View>
        <View style={style.mainContainer}>
          <CardVisit />
          <ListVisit />
        </View>
      </View>
      <SubmitCardVisit onPress={handleSubmitPress} />
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
    top: -130,
    flex: 1,
  },
});
