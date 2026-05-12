import Text from "@/components/ui/text";
import { useSignOut } from "@/features/auth/hooks/use-signout";
import Feather from "@expo/vector-icons/Feather";
import { Pressable, StyleSheet } from "react-native";

export default function SignOutButton() {
  const { handleSignOut } = useSignOut();

  return (
    <Pressable style={styles.button} onPress={handleSignOut}>
      <Feather name="log-out" size={18} color="#FF4D4F" />
      <Text style={styles.text}>Keluar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 14,
    color: "#FF4D4F",
    fontWeight: "500",
  },
});
