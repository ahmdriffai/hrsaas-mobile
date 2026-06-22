import AttendanceForm from "@/features/attendance/components/attendance-form";
import { Colors } from "@/constans/color";
import { StyleSheet, View } from "react-native";

export default function AttendancePage() {
  return (
    <View style={styles.container}>
      <AttendanceForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
  },
});
