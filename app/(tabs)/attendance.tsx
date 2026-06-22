import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import ListAttendanceHistory from "@/features/attendance/components/list-attendance-history";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AttendanceHistoryTab() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Kehadiran</Text>
      </View>
      <ListAttendanceHistory />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
});
