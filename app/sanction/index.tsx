import ListSanction from "@/features/sanction/components/list-sanction";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SanctionScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["bottom"]}>
      <ListSanction />
    </SafeAreaView>
  );
}
