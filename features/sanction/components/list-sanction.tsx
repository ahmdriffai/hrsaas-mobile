import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSearchSanction } from "../hooks/use-search-sanction";
import { EmployeeSanction } from "../schemas/sanction-schema";

type TabStatus = "all" | "active" | "inactive";

const TABS: { label: string; value: TabStatus }[] = [
  { label: "Semua", value: "all" },
  { label: "Aktif", value: "active" },
  { label: "Selesai", value: "inactive" },
];

function formatDate(ms: number): string {
  if (!ms) return "-";
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SanctionCard({ item }: { item: EmployeeSanction }) {
  const isActive = item.end_date > Date.now();

  const statusColor = isActive ? Colors.light.error : Colors.light.success;
  const statusLabel = isActive ? "Aktif" : "Selesai";
  const statusIcon: React.ComponentProps<typeof Feather>["name"] = isActive
    ? "alert-circle"
    : "check-circle";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.sanctionTypeBadge,
            { backgroundColor: statusColor + "18" },
          ]}
        >
          <Feather name="tag" size={12} color={statusColor} />
          <Text style={[styles.sanctionTypeText, { color: statusColor }]}>
            {item.sanction.name}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + "18" },
          ]}
        >
          <Feather name={statusIcon} size={12} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.reason} numberOfLines={2}>
        {item.reason}
      </Text>

      <View style={styles.dateRow}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Mulai</Text>
          <Text style={styles.dateValue}>{formatDate(item.start_date)}</Text>
        </View>
        <Feather
          name="arrow-right"
          size={14}
          color={Colors.light.textSecondary}
          style={{ marginTop: 14 }}
        />
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Berakhir</Text>
          <Text style={styles.dateValue}>{formatDate(item.end_date)}</Text>
        </View>
      </View>

      {item.sanction.description ? (
        <View style={styles.noteRow}>
          <Feather
            name="info"
            size={12}
            color={Colors.light.textSecondary}
          />
          <Text style={styles.noteText} numberOfLines={2}>
            {item.sanction.description}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SummaryCard({ totalActive }: { totalActive: number }) {
  const hasActive = totalActive > 0;
  const bg = hasActive ? Colors.light.errorLight : Colors.light.successLight;
  const iconColor = hasActive ? Colors.light.error : Colors.light.success;
  const iconName: React.ComponentProps<typeof Feather>["name"] = hasActive
    ? "alert-triangle"
    : "shield";

  return (
    <View style={[styles.summaryCard, { backgroundColor: bg }]}>
      <View style={[styles.summaryIcon, { backgroundColor: iconColor + "20" }]}>
        <Feather name={iconName} size={22} color={iconColor} />
      </View>
      <View style={styles.summaryText}>
        <Text style={[styles.summaryTitle, { color: iconColor }]}>
          {hasActive ? `${totalActive} Sanksi Aktif` : "Performa Baik"}
        </Text>
        <Text style={styles.summaryDesc}>
          {hasActive
            ? "Harap segera tindak lanjuti sanksi yang berlaku"
            : "Tidak ada pelanggaran aktif saat ini"}
        </Text>
      </View>
    </View>
  );
}

export default function ListSanction() {
  const [activeTab, setActiveTab] = useState<TabStatus>("all");

  const { data, isLoading, refetch } = useSearchSanction();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const allItems = data?.data ?? [];
  const totalActive = allItems.filter((i) => i.end_date > Date.now()).length;

  const items =
    activeTab === "all"
      ? allItems
      : activeTab === "active"
        ? allItems.filter((i) => i.end_date > Date.now())
        : allItems.filter((i) => i.end_date <= Date.now());

  return (
    <View style={styles.container}>
      <SummaryCard totalActive={totalActive} />

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.value)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SanctionCard item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
          contentContainerStyle={
            items.length === 0 ? styles.emptyContainer : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Feather
                name="shield"
                size={48}
                color={Colors.light.gray300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Tidak Ada Sanksi</Text>
              <Text style={styles.emptyDesc}>
                {activeTab === "active"
                  ? "Tidak ada sanksi aktif saat ini"
                  : "Riwayat sanksi kosong"}
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    flex: 1,
    gap: 3,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  summaryDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: Colors.light.primary,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.light.textSecondary,
  },
  tabLabelActive: {
    color: Colors.light.textInverse,
    fontWeight: "600",
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    gap: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyWrapper: {
    alignItems: "center",
    paddingTop: 60,
  },
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
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sanctionTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sanctionTypeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  reason: {
    fontSize: 14,
    color: Colors.light.textPrimary,
    fontWeight: "500",
    lineHeight: 20,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  dateItem: {
    gap: 2,
  },
  dateLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: Colors.light.surfaceSecondary,
    padding: 10,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
});
