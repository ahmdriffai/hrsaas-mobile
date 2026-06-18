import ListTraining from "@/features/employee-training/components/list-training";
import { SafeAreaView, StyleSheet } from "react-native";

export default function TrainingScreen() {
  return (
    <SafeAreaView style={styles.root}>
      <ListTraining />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6FA" },
});
