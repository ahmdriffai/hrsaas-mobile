import ListDocument from "@/features/employee-docs/components/list-document";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["bottom"]}>
      <ListDocument />
    </SafeAreaView>
  );
}
