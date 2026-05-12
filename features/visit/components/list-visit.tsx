import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCurrentVisits } from "../hooks/use-current-visits";
import { Visit } from "../schemas/visit-schema";

type VisitStatus = "ongoing" | "completed";

const STATUS_CONFIG: Record<
  VisitStatus,
  { label: string; bg: string; color: string }
> = {
  ongoing: {
    label: "Berjalan",
    bg: Colors.light.warningLight,
    color: Colors.light.warning,
  },
  completed: {
    label: "Selesai",
    bg: Colors.light.successLight,
    color: Colors.light.success,
  },
};

function VisitCard({ item }: { item: Visit }) {
  const router = useRouter();
  const detailIn = item.details?.find((d) => d.visit_type === "IN");
  const detailOut = item.details?.find((d) => d.visit_type === "OUT");
  const isOngoing = !!detailIn && !detailOut;
  const status = STATUS_CONFIG[isOngoing ? "ongoing" : "completed"];

  const handleVisitOut = () => {
    router.push({
      pathname: "/visit/create",
      params: { visit_type: "OUT", client_name: item.client_name },
    });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWrapper}>
          <Text style={styles.clientName}>{item.client_name}</Text>
          <Text style={styles.note}>{detailIn?.note ?? "-"}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.metaRow}>
        <Feather name="map-pin" size={13} color={Colors.light.textSecondary} />
        <Text style={styles.metaText} numberOfLines={1}>
          {detailIn?.address ?? "-"}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Feather name="clock" size={13} color={Colors.light.textSecondary} />
        <Text style={styles.metaText}>
          {detailIn?.visit_at ?? "-"}{" "}
          {detailOut ? `→ ${detailOut.visit_at}` : "→ ..."}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Feather name="calendar" size={13} color={Colors.light.textSecondary} />
        <Text style={styles.metaText}>{item.date}</Text>
      </View>

      {isOngoing && (
        <TouchableOpacity style={styles.outButton} onPress={handleVisitOut}>
          <Feather name="log-out" size={14} color={Colors.light.warning} />
          <Text style={styles.outButtonText}>Visit Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ListVisit() {
  const now = new Date();
  const fifteenDaysAgo = new Date();
  fifteenDaysAgo.setDate(now.getDate() - 15);

  const { data, isLoading } = useCurrentVisits({
    start_date: fifteenDaysAgo.toISOString().split("T")[0],
    end_date: now.toISOString().split("T")[0],
    size: 100,
    sort_by: "newest",
  });

  const visits = data?.data ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Daftar Kunjungan</Text>
      <Text style={styles.sectionSubtitle}>
        Pantau agenda kunjungan client terbaru
      </Text>

      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color={Colors.light.primary}
        />
      ) : (
        <FlatList
          data={visits}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VisitCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            visits.length === 0 ? styles.emptyContainer : styles.listContent
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Belum ada data kunjungan</Text>
              <Text style={styles.emptySubtitle}>
                Jadwal kunjungan client akan muncul di sini.
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
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  listContent: {
    gap: 10,
    paddingBottom: 120,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  emptyState: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleWrapper: {
    flex: 1,
    gap: 2,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  note: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  outButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.warningLight,
    borderWidth: 1,
    borderColor: Colors.light.warning,
    marginTop: 2,
  },
  outButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.warning,
  },
});
