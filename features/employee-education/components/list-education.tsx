import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useAuth } from "@/features/auth/context/auth-context";
import { EmployeeEducation } from "@/features/employee/schemas/employee-schema";
import Feather from "@expo/vector-icons/Feather";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useGetEducation } from "../hooks/use-get-education";

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  SD:    { bg: "#F3F4F6", text: "#6B7280" },
  SMP:   { bg: "#F3F4F6", text: "#6B7280" },
  SMA:   { bg: "#FEF3C7", text: "#92400E" },
  SMK:   { bg: "#FEF3C7", text: "#92400E" },
  D1:    { bg: "#DBEAFE", text: "#1D4ED8" },
  D2:    { bg: "#DBEAFE", text: "#1D4ED8" },
  D3:    { bg: "#DBEAFE", text: "#1D4ED8" },
  D4:    { bg: "#DBEAFE", text: "#1D4ED8" },
  S1:    { bg: "#D1FAE5", text: "#065F46" },
  S2:    { bg: "#EDE9FE", text: "#5B21B6" },
  S3:    { bg: "#FCE7F3", text: "#9D174D" },
};

function getLevelColor(level: string) {
  const key = level.toUpperCase().split("/")[0].trim();
  return (
    LEVEL_COLORS[key] ?? {
      bg: Colors.light.surfaceSecondary,
      text: Colors.light.textSecondary,
    }
  );
}

function getHighestLevel(items: EmployeeEducation[]): string {
  const ORDER = ["S3", "S2", "S1", "D4", "D3", "D2", "D1", "SMK", "SMA", "SMP", "SD"];
  for (const lvl of ORDER) {
    if (
      items.some((i) =>
        i.education_level.toUpperCase().startsWith(lvl),
      )
    ) {
      return lvl;
    }
  }
  return items[0]?.education_level ?? "-";
}

function toYear(ms?: number | null): string {
  if (!ms) return "-";
  return new Date(ms).getFullYear().toString();
}

function EducationCard({ edu }: { edu: EmployeeEducation }) {
  const levelColor = getLevelColor(edu.education_level);
  const yearRange = edu.start_year
    ? `${toYear(edu.start_year)} – ${toYear(edu.graduation_year)}`
    : `Lulus ${toYear(edu.graduation_year)}`;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor.bg }]}>
          <Text style={[styles.levelText, { color: levelColor.text }]}>
            {edu.education_level}
          </Text>
        </View>
        <View style={styles.yearTag}>
          <Feather name="calendar" size={10} color={Colors.light.textSecondary} />
          <Text style={styles.yearText}>{yearRange}</Text>
        </View>
      </View>

      <Text style={styles.institution}>{edu.institution_name}</Text>
      <Text style={styles.major}>{edu.major}</Text>

      {edu.gpa != null && (
        <>
          <View style={styles.divider} />
          <View style={styles.gpaRow}>
            <Text style={styles.gpaLabel}>IPK</Text>
            <Text style={styles.gpaValue}>{edu.gpa.toFixed(2)}</Text>
          </View>
        </>
      )}
    </View>
  );
}

export default function ListEducation() {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const { data, isLoading, refetch, isFetching } = useGetEducation(employeeId);
  const items = data?.data ?? [];

  const highestLevel = items.length > 0 ? getHighestLevel(items) : null;

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Feather name="book-open" size={22} color={Colors.light.primary} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>
            {items.length} Riwayat Pendidikan
          </Text>
          <Text style={styles.summaryDesc}>
            {highestLevel
              ? `Pendidikan tertinggi: ${highestLevel}`
              : "Belum ada data pendidikan"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Daftar Pendidikan</Text>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EducationCard edu={item} />}
          contentContainerStyle={
            items.length === 0 ? styles.emptyContainer : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isLoading}
              onRefresh={refetch}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Feather
                name="book-open"
                size={48}
                color={Colors.light.gray300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Belum Ada Riwayat Pendidikan</Text>
              <Text style={styles.emptyDesc}>
                Data pendidikan karyawan akan ditampilkan di sini
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Colors.light.primaryLight + "20",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary + "25",
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.light.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: { flex: 1, gap: 3 },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  summaryDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.textSecondary,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  loader: { marginTop: 40 },
  listContent: { gap: 10, paddingBottom: 100 },
  emptyContainer: { flex: 1 },
  emptyWrapper: { alignItems: "center", paddingTop: 60 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  yearTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  yearText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  institution: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  major: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  gpaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gpaLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gpaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});
