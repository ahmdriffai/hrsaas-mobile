import Button from "@/components/ui/button";
import { Colors } from "@/constans/color";
import { Dimensions, StyleSheet, View } from "react-native";

interface Props {
  onPress: () => void;
  disabled?: boolean;
}

export default function SubmitCardVisit({ onPress, disabled }: Props) {
  return (
    <View style={style.containerSubmit}>
      <Button
        variant="primary"
        title="Tambah Kunjungan"
        fullWidth
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  );
}

const windowWidth = Dimensions.get("window").width;
const style = StyleSheet.create({
  containerSubmit: {
    position: "absolute",
    backgroundColor: Colors.light.white,
    width: windowWidth,
    padding: 20,
    paddingBottom: 40,
    bottom: 0,
    left: 0,
    borderTopColor: Colors.light.border,
    borderTopWidth: 0.4,
  },
});
