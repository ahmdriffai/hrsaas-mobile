import Title from "@/components/ui/title";
import { Colors } from "@/constans/color";
import ListTimeOffApproval from "@/features/time-off-approval/components/list-time-off-approval";
import { StyleSheet, View } from "react-native";

export default function TimeOffApprovalPage() {
  return (
    <View style={style.container}>
      <View style={style.bgHeader}>
        <Title
          title="Persetujuan Cuti"
          subtitle="Tindak lanjut pengajuan cuti"
          showBack
          light
        />
      </View>
      <View style={style.mainContainer}>
        <ListTimeOffApproval />
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
  },
  bgHeader: {
    backgroundColor: Colors.light.primary,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    paddingHorizontal: 20,
  },
  mainContainer: {
    paddingHorizontal: 20,
    position: "relative",
    flex: 1,
  },
});
