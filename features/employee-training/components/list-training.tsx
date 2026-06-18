import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useAuth } from "@/features/auth/context/auth-context";
import { EmployeeTraining } from "@/features/employee/schemas/employee-schema";
import Feather from "@expo/vector-icons/Feather";
import * as WebBrowser from "expo-web-browser";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetTraining } from "../hooks/use-get-training";

function formatDate(ms: number): string {
  if (!ms) return "-";
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function calcDuration(start: number, end?: number): string {
  const to = end ?? Date.now();
  const diff = to - start;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "< 1 hari";
  if (days < 30) return `${days} hari`;
  const months = Math.floor(days / 30);
  return `${months} bulan`;
}

function TrainingCard({ item }: { item: EmployeeTraining }) {
  const isOngoing = !item.end_date || item.end_date > Date.now();
  const dateLabel = item.end_date
    ? `${formatDate(item.start_date)} – ${formatDate(item.end_date)}`
    : `${formatDate(item.start_date)} – Sekarang`;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: isOngoing ? Colors.light.success : Colors.light.gray300 },
          ]}
        />
        <Text style={styles.statusText}>
          {isOngoing ? "Sedang Berjalan" : "Selesai"}
        </Text>
        <View style={styles.durationTag}>
          <Feather name="clock" size={10} color={Colors.light.textSecondary} />
          <Text style={styles.durationText}>
            {calcDuration(item.start_date, item.end_date)}
          </Text>
        </View>
      </View>

      <Text style={styles.trainingName}>{item.training_name}</Text>

      <View style={styles.organizerRow}>
        <Feather name="briefcase" size={12} color={Colors.light.textSecondary} />
        <Text style={styles.organizerText}>{item.organizer}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.dateRow}>
        <Feather name="calendar" size={12} color={Colors.light.textSecondary} />
        <Text style={styles.dateText}>{dateLabel}</Text>
      </View>

      {item.certificate_url && (
        <TouchableOpacity
          style={styles.certBtn}
          onPress={() => WebBrowser.openBrowserAsync(item.certificate_url!)}
          activeOpacity={0.7}
        >
          <Feather name="award" size={13} color={Colors.light.primary} />
          <Text style={styles.certBtnText}>Lihat Sertifikat</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ListTraining() {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const { data, isLoading, refetch, isFetching } = useGetTraining(employeeId);
  const items = data?.data ?? [];

  const ongoingCount = items.filter(
    (i) => !i.end_date || i.end_date > Date.now(),
  ).length;

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Feather name="award" size={22} color={Colors.light.primary} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>{items.length} Riwayat Pelatihan</Text>
          <Text style={styles.summaryDesc}>
            {ongoingCount > 0
              ? `${ongoingCount} sedang berjalan`
              : "Tidak ada pelatihan aktif"}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Daftar Pelatihan</Text>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TrainingCard item={item} />}
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
                name="award"
                size={48}
                color={Colors.light.gray300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Belum Ada Riwayat Pelatihan</Text>
              <Text style={styles.emptyDesc}>
                Data pelatihan karyawan akan ditampilkan di sini
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
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  durationTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  durationText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  trainingName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.textPrimary,
    lineHeight: 21,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  organizerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  certBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.primary + "12",
    borderRadius: 20,
    marginTop: 2,
  },
  certBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
});
