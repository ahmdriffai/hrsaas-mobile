import Button from "@/components/ui/button";
import { Colors } from "@/constans/color";
import { Dimensions, StyleSheet, View } from "react-native";

interface Props {
  onCheckin: () => void;
  onCheckout: () => void;
  disabled?: boolean;
}

export default function AttendanceSubmitCard({
  onCheckin,
  onCheckout,
  disabled,
}: Props) {
  return (
    <View style={styles.container}>
      <Button
        title="Check In"
        icon="login"
        variant="primary"
        onPress={onCheckin}
        disabled={disabled}
        fullWidth
      />
      <Button
        title="Check Out"
        icon="logout"
        variant="outline"
        onPress={onCheckout}
        disabled={disabled}
        fullWidth
      />
    </View>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: windowWidth,
    backgroundColor: Colors.light.white,
    borderTopWidth: 0.4,
    borderTopColor: Colors.light.border,
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },
});
