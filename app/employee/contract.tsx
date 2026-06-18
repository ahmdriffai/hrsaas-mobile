import ListContract from "@/features/employee-contract/components/list-contract";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContractScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F9FAFB" }} edges={["bottom"]}>
      <ListContract />
    </SafeAreaView>
  );
}
