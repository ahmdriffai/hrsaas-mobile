import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { StyleSheet, View } from "react-native";
import { useCurrentVisits } from "../hooks/use-current-visits";

export default function CardVisit() {
  const now = new Date();

  const { data } = useCurrentVisits({
    start_date: now.toISOString().split("T")[0],
    end_date: now.toISOString().split("T")[0],
    size: 100,
    sort_by: "newest",
  });

  return (
    <View style={style.cardLeave}>
      <Text style={style.titleLeave}>Informasi Kunjungan Client</Text>
      <Text style={style.subtitleLeave}>
        Ringkasan aktivitas kunjungan hari ini
      </Text>
      <View style={style.containerAvailable}>
        <View style={style.cardAvailable}>
          <View style={style.labelRow}>
            <View style={style.indicator} />
            <Text style={style.availableTitle}>Kunjungan Hari ini</Text>
          </View>
          <Text style={style.availableSubTitle}>{data?.data.length}</Text>
        </View>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  cardLeave: {
    backgroundColor: Colors.light.surface,
    padding: 16,
    borderRadius: 10,
  },
  titleLeave: {
    fontWeight: "600",
    fontSize: 15,
  },
  subtitleLeave: {
    color: Colors.light.textSecondary,
    fontSize: 12,
  },
  containerAvailable: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 9,
  },
  availableSubTitle: {
    fontSize: 24,
    fontWeight: "500",
    marginTop: 5,
  },
  cardAvailable: {
    flex: 1 / 2,
    padding: 12,
    borderWidth: 0.4,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 5,
  },
  availableTitle: {
    fontWeight: "500",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
});
