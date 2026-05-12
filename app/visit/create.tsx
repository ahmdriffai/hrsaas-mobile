import { Colors } from "@/constans/color";
import FormVisit from "@/features/visit/components/form-visit";
import { StyleSheet, View } from "react-native";

export default function CreateVisitPage() {
  return (
    <View style={styles.container}>
      {/* <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      > */}
      <FormVisit />
      {/* </ScrollView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
  },
  header: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 16,
  },
});
