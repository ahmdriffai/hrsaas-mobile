import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import FormTimeOff from "@/features/time-off/components/form-time-off";
import { StyleSheet, View } from "react-native";

export default function CreateTimeOffPage() {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.headerText}>Fill Leave Information</Text>
        <Text style={style.headerTextDetail}>Fill Leave Information</Text>
      </View>
      <FormTimeOff />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.white,
    padding: 20,
    borderRadius: 10,
  },
  header: {
    gap: 2,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  headerTextDetail: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
});
