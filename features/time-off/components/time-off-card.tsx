import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { StyleSheet, View } from "react-native";

export default function TimeOffCard() {
  return (
    <View style={style.cardLeave}>
      <Text style={style.titleLeave}>Detail Saldo Cuti</Text>
      <Text style={style.subtitleLeave}>Periode 1 Jan 2024 - 30 Dec 2024</Text>
      <View style={style.containerAvailable}>
        <View style={style.cardAvailable}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: Colors.light.success,
                borderRadius: "100%",
              }}
            ></View>
            <Text style={style.availableTitle}>Tersedia</Text>
          </View>
          <Text style={style.availableSubTitle}>20</Text>
        </View>
        <View style={style.cardAvailable}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: Colors.light.primary,
                borderRadius: "100%",
              }}
            ></View>
            <Text style={style.availableTitle}>Sisa cuti</Text>
          </View>
          <Text style={style.availableSubTitle}>20</Text>
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
    flex: 1,
    padding: 12,
    borderWidth: 0.4,
    borderColor: Colors.light.gray300,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 5,
  },
  availableTitle: {
    fontWeight: "500",
  },
});
