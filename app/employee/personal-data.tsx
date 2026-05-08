import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select, { SelectOption } from "@/components/ui/select";
import { useAuth } from "@/features/auth/context/auth-context";
import { useZodForm } from "@/hooks/use-zod-form";
import Feather from "@expo/vector-icons/Feather";
import { Controller } from "react-hook-form";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { z } from "zod/v3";

const BLOOD_TYPES: SelectOption[] = [
  "A",
  "B",
  "AB",
  "O",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
].map((v) => ({ label: v, value: v }));

const MARITAL_STATUSES: SelectOption[] = [
  { label: "Belum Menikah", value: "single" },
  { label: "Menikah", value: "married" },
  { label: "Cerai", value: "divorced" },
  { label: "Duda/Janda", value: "widowed" },
];

const RELIGIONS: SelectOption[] = [
  { label: "Islam", value: "islam" },
  { label: "Kristen", value: "christian" },
  { label: "Katolik", value: "catholic" },
  { label: "Hindu", value: "hindu" },
  { label: "Buddha", value: "buddhist" },
  { label: "Konghucu", value: "confucian" },
];

const TIMEZONES: SelectOption[] = [
  { label: "WIB (UTC+7)", value: "Asia/Jakarta" },
  { label: "WITA (UTC+8)", value: "Asia/Makassar" },
  { label: "WIT (UTC+9)", value: "Asia/Jayapura" },
];

function formatBirthDate(unixMs: number): string {
  if (!unixMs) return "-";
  return new Date(unixMs).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const PersonalDataSchema = z.object({
  fullname: z.string().min(1, "Nama lengkap wajib diisi"),
  birth_place: z.string().min(1, "Tempat lahir wajib diisi"),
  blood_type: z.string().optional(),
  marital_status: z.string().optional(),
  religion: z.string().optional(),
  phone: z.string().min(1, "Nomor telepon wajib diisi"),
  timezone: z.string().optional(),
});

export default function PersonalDataScreen() {
  const { user } = useAuth();
  const emp = user?.employee;

  const form = useZodForm(PersonalDataSchema, {
    defaultValues: {
      fullname: emp?.fullname ?? "",
      birth_place: emp?.birth_place ?? "",
      blood_type: emp?.blood_type ?? "",
      marital_status: emp?.marital_status ?? "",
      religion: emp?.religion ?? "",
      phone: emp?.phone ?? "",
      timezone: emp?.timezone ?? "",
    },
  });

  const onSubmit = () => {
    Toast.show({
      type: "info",
      text1: "Coming Soon",
      text2: "Fitur update data pribadi akan segera tersedia",
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoWrapper}>
            <Image
              source={require("@/assets/images/profile.png")}
              style={styles.photo}
            />
            <Pressable style={styles.photoBadge}>
              <Feather name="refresh-cw" size={14} color="white" />
            </Pressable>
          </View>
          <Text style={styles.photoLabel}>Upload Photo</Text>
          <Text style={styles.photoHint}>
            Format should be in .jpeg .png atleast{"\n"}800×800px and less than
            5MB
          </Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {/* Employee Number – read only */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Employee Number</Text>
            <View style={styles.readOnly}>
              <Text style={styles.readOnlyText}>
                {emp?.employee_number ?? "-"}
              </Text>
            </View>
          </View>

          <Controller
            control={form.control}
            name="fullname"
            render={({ field, fieldState }) => (
              <Input
                label="Full Name"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                prefixIcon={<Feather name="user" size={18} color="#ABABAB" />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="birth_place"
            render={({ field, fieldState }) => (
              <Input
                label="Birth Place"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                prefixIcon={
                  <Feather name="map-pin" size={18} color="#ABABAB" />
                }
              />
            )}
          />

          {/* Date of Birth – read only */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <View style={styles.readOnly}>
              <Feather name="calendar" size={18} color="#ABABAB" />
              <Text style={[styles.readOnlyText, styles.readOnlyWithIcon]}>
                {formatBirthDate(emp?.birth_date ?? 0)}
              </Text>
            </View>
          </View>

          <Controller
            control={form.control}
            name="blood_type"
            render={({ field, fieldState }) => (
              <Select
                label="Blood Type"
                options={BLOOD_TYPES}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="marital_status"
            render={({ field, fieldState }) => (
              <Select
                label="Marital Status"
                options={MARITAL_STATUSES}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="religion"
            render={({ field, fieldState }) => (
              <Select
                label="Religion"
                options={RELIGIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <Input
                label="Phone Number"
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                prefixIcon={<Feather name="phone" size={18} color="#ABABAB" />}
              />
            )}
          />

          <Controller
            control={form.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <Select
                label="Timezone"
                options={TIMEZONES}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Update"
            onPress={form.handleSubmit(onSubmit)}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const PRIMARY = "#3F9AAE";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F5" },
  scroll: { flex: 1 },
  content: { paddingBottom: 40 },

  photoSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "white",
    marginBottom: 12,
  },
  photoWrapper: { position: "relative", marginBottom: 12 },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: "#E8E8FF",
  },
  photoBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 6,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#090909",
    marginBottom: 4,
  },
  photoHint: {
    fontSize: 12,
    color: "#ABABAB",
    textAlign: "center",
    lineHeight: 18,
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },

  fieldGroup: { paddingVertical: 10 },
  fieldLabel: { fontSize: 12, color: "#999", marginBottom: 6 },
  readOnly: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    height: 45,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  readOnlyText: { fontSize: 14, color: "#090909" },
  readOnlyWithIcon: { marginLeft: 8 },

  footer: { paddingHorizontal: 16, marginTop: 8 },
});
