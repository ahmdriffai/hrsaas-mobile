import CameraCapture, { PhotoResult } from "@/components/ui/camera-capture";
import Input from "@/components/ui/input";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useLocation } from "@/hooks/use-location";
import { useZodForm } from "@/hooks/use-zod-form";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Alert, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useCreateVisit } from "../hooks/use-create-visit";
import { VisitForm, VisitFormSchema } from "../schemas/visit-schema";
import SubmitCardVisit from "./submit-card-visit";

export default function FormVisit() {
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const { visit_type, client_name: defaultClientName } = useLocalSearchParams<{
    visit_type?: string;
    client_name?: string;
  }>();

  const {
    coor,
    address,
    loading: loadingLocation,
    error: locationError,
  } = useLocation();
  const { mutate: createVisit, isPending } = useCreateVisit();

  const form = useZodForm(VisitFormSchema, {
    defaultValues: {
      visit_type: visit_type === "OUT" ? "OUT" : "IN",
      client_name: defaultClientName ?? "",
      note: "",
    },
  });

  const onSubmit = (data: VisitForm) => {
    if (!photo) {
      Alert.alert("Validasi", "Silakan ambil foto terlebih dahulu");
      return;
    }
    if (!coor) {
      Alert.alert("Validasi", "Lokasi belum tersedia");
      return;
    }

    createVisit({
      ...data,
      photo,
      latitude: String(coor.lat),
      longitude: String(coor.lng),
      address,
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={[styles.card, { paddingBottom: 150 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <CameraCapture value={photo} onChange={setPhoto} />
        </View>

        <Text style={styles.label}>Alamat</Text>
        <View style={styles.infoBox}>
          <Feather
            name="map-pin"
            size={18}
            color={Colors.light.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            {loadingLocation ? "Sedang mengambil alamat..." : address || "-"}
          </Text>
        </View>

        {/* <Text style={styles.label}>Koordinat</Text>
        <View style={styles.infoBox}>
          <Feather
            name="navigation"
            size={18}
            color={Colors.light.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            {coor ? `${coor.lat}, ${coor.lng}` : "Lokasi belum tersedia"}
          </Text>
        </View> */}

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <Controller
          control={form.control}
          name="client_name"
          render={({ field, fieldState }) => (
            <Input
              label="Nama Client"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="note"
          render={({ field, fieldState }) => (
            <Input
              label="Catatan"
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </ScrollView>

      <SubmitCardVisit
        onPress={form.handleSubmit(onSubmit)}
        disabled={isPending || loadingLocation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.gray800,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.light.gray50,
  },
  infoIcon: {
    marginTop: 1,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.gray700,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 13,
  },
});
