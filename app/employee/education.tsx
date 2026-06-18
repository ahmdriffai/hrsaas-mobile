import ListEducation from "@/features/employee-education/components/list-education";
import { SafeAreaView, StyleSheet } from "react-native";

export default function EducationScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ListEducation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },
});
