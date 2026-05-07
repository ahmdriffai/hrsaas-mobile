import Button from "@/components/ui/button";
import { Colors } from "@/constans/color";
import { StyleSheet, View } from "react-native";

interface Props {
  onPress: () => void;
}

export default function SubmitCardTimeOff({ onPress }: Props) {
  return (
    <View style={style.containerSubmit}>
      <Button title="Pengajuan Cuti" fullWidth onPress={onPress} />
    </View>
  );
}

const style = StyleSheet.create({
  containerSubmit: {
    position: "absolute",
    backgroundColor: Colors.light.background,
    width: "100%",
    padding: 20,
    paddingBottom: 40,
    bottom: 0,
    left: 0,
    borderTopColor: Colors.light.border,
    borderTopWidth: 0.4,
  },
});
