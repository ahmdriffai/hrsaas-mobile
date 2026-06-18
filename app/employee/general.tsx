import AppText from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useGetCurrentEmployee } from "@/features/employee/hooks/use-get-current-employee";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDate(ms?: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calcAge(ms?: number): string {
  if (!ms) return "";
  const years = Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24 * 365.25));
  return `${years} tahun`;
}

function calcTenure(ms?: number): string {
  if (!ms) return "—";
  const diff = Date.now() - ms;
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44),
  );
  const days = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24),
  );
  return `${years} tahun ${months} bulan ${days} hari`;
}

// ─── sub-components ─────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.infoRow}>
      <AppText style={styles.infoLabel}>{label}</AppText>
      <AppText style={styles.infoValue}>{value || "—"}</AppText>
    </View>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <AppText style={styles.sectionTitle}>{title}</AppText>
      <View style={styles.divider} />
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

// ─── main ───────────────────────────────────────────────────────────────────

export default function GeneralScreen() {
  const { data: emp, isLoading } = useGetCurrentEmployee();

  const contracts = emp?.contracts ?? [];
  const activeContract = contracts.find(
    (c) =>
      c.is_active &&
      c.start_date <= Date.now() &&
      (!c.end_date || c.end_date >= Date.now()),
  );

  const isActive = emp?.is_active ?? true;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <ActivityIndicator
          style={{ flex: 1 }}
          color={Colors.light.primary}
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Ionicons name="person" size={36} color={Colors.light.primary} />
          </View>
          <View style={styles.profileInfo}>
            <AppText style={styles.profileName}>
              {emp?.fullname ?? emp?.user?.name ?? "—"}
            </AppText>
            {activeContract && (
              <AppText style={styles.profilePosition}>
                {activeContract.position.name} · {activeContract.division.name}
              </AppText>
            )}
            <View style={styles.profileMeta}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isActive
                      ? Colors.light.successLight
                      : Colors.light.errorLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: isActive
                        ? Colors.light.success
                        : Colors.light.error,
                    },
                  ]}
                />
                <AppText
                  style={[
                    styles.statusText,
                    {
                      color: isActive
                        ? Colors.light.success
                        : Colors.light.error,
                    },
                  ]}
                >
                  {isActive ? "Aktif" : "Nonaktif"}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* ── Contact strip ── */}
        <View style={styles.contactStrip}>
          <View style={styles.contactItem}>
            <Feather name="mail" size={14} color={Colors.light.textSecondary} />
            <AppText style={styles.contactText}>
              {emp?.user?.email ?? "—"}
            </AppText>
          </View>
          <View style={styles.contactDivider} />
          <View style={styles.contactItem}>
            <Feather name="phone" size={14} color={Colors.light.textSecondary} />
            <AppText style={styles.contactText}>{emp?.phone ?? "—"}</AppText>
          </View>
        </View>

        {/* ── Informasi Pribadi ── */}
        <SectionCard
          title={`Informasi Pribadi${emp?.birth_date ? `  (${calcAge(emp.birth_date)})` : ""}`}
        >
          <InfoRow label="Nama Lengkap" value={emp?.fullname} />
          <InfoRow label="Jenis Kelamin" value={emp?.gender} />
          <InfoRow label="NIK / No. Identitas" value={emp?.identity_number} />
          <InfoRow label="Tempat Lahir" value={emp?.birth_place} />
          <InfoRow label="Tanggal Lahir" value={formatDate(emp?.birth_date)} />
          <InfoRow label="Status Perkawinan" value={emp?.marital_status} />
          <InfoRow label="Golongan Darah" value={emp?.blood_type} />
          <InfoRow label="Agama" value={emp?.religion} />
          <InfoRow label="Alamat" value={emp?.address} />
          <InfoRow label="Kota" value={emp?.city} />
        </SectionCard>

        {/* ── Informasi Pekerjaan ── */}
        <SectionCard title="Informasi Pekerjaan">
          <InfoRow label="No. Karyawan" value={emp?.employee_number} />
          {activeContract && (
            <>
              <InfoRow label="Divisi" value={activeContract.division.name} />
              <InfoRow label="Jabatan" value={activeContract.position.name} />
              <InfoRow
                label="Jenis Kontrak"
                value={activeContract.contract_type}
              />
              {activeContract.employee_status && (
                <InfoRow
                  label="Golongan"
                  value={`Gol. ${activeContract.employee_status}`}
                />
              )}
              <InfoRow
                label="Tanggal Masuk"
                value={formatDate(activeContract.start_date)}
              />
              <InfoRow
                label="Masa Kerja"
                value={calcTenure(activeContract.start_date)}
              />
            </>
          )}
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },

  profileCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.light.primaryLight + "25",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1, gap: 5 },
  profileName: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  profilePosition: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
  profileMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "600" },

  contactStrip: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  contactText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  contactDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.light.border,
    marginHorizontal: 8,
  },

  sectionCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.textPrimary,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 12,
  },
  sectionBody: { gap: 12 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    width: 140,
    flexShrink: 0,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.textPrimary,
    flex: 1,
    textAlign: "right",
  },
});
