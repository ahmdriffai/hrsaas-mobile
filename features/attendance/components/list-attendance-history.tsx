"use client";

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
import { useGetCurrentAttendance } from "../hooks/use-get-current-attendance";
import { AttendanceHistory } from "../schemas/attendance-schema";

type TabStatus = "ALL" | "HADIR" | "TERLAMBAT";

const TABS: { label: string; value: TabStatus }[] = [
  { label: "Semua", value: "ALL" },
  { label: "Hadir", value: "HADIR" },
  { label: "Terlambat", value: "TERLAMBAT" },
];

const STATUS_CONFIG: Record<
  string,
  { color: string; bg: string; icon: React.ComponentProps<typeof Feather>["name"] }
> = {
  HADIR: { color: Colors.light.success, bg: Colors.light.successLight, icon: "check-circle" },
  TERLAMBAT: { color: Colors.light.warning, bg: Colors.light.warningLight, icon: "clock" },
  TIDAK_HADIR: { color: Colors.light.error, bg: Colors.light.errorLight, icon: "x-circle" },
};

function formatTime(ms: number): string {
  if (!ms) return "-";
  return new Date(ms).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AttendanceCard({ item }: { item: AttendanceHistory }) {
  const cfg = STATUS_CONFIG[item.status] ?? {
    color: Colors.light.gray500,
    bg: Colors.light.gray100,
    icon: "minus-circle" as const,
  };

  const hasCheckout = item.check_out_time > 0;

  return (
    <View style={styles.card}>
      {/* Date row */}
      <View style={styles.cardHeader}>
        <Feather name="calendar" size={14} color={Colors.light.textSecondary} />
        <Text style={styles.dateText}>{formatDate(item.date)}</Text>
        <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
          <Feather name={cfg.icon} size={11} color={cfg.color} />
          <Text style={[styles.badgeText, { color: cfg.color }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Check-in / Check-out */}
      <View style={styles.timeRow}>
        <View style={styles.timeItem}>
          <View style={styles.timeDot}>
            <Feather name="log-in" size={14} color={Colors.light.success} />
          </View>
          <View>
            <Text style={styles.timeLabel}>Check-in</Text>
            <Text style={styles.timeValue}>{formatTime(item.check_in_time)}</Text>
          </View>
        </View>

        <View style={styles.timeSeparator}>
          <View style={styles.timeLine} />
        </View>

        <View style={styles.timeItem}>
          <View style={styles.timeDot}>
            <Feather
              name="log-out"
              size={14}
              color={hasCheckout ? Colors.light.error : Colors.light.gray300}
            />
          </View>
          <View>
            <Text style={styles.timeLabel}>Check-out</Text>
            <Text style={[styles.timeValue, !hasCheckout && { color: Colors.light.gray300 }]}>
              {hasCheckout ? formatTime(item.check_out_time) : "-"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ListAttendanceHistory() {
  const [activeTab, setActiveTab] = useState<TabStatus>("ALL");
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useGetCurrentAttendance({
    status: activeTab === "ALL" ? undefined : activeTab,
    size: 20,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const items = data?.data ?? [];

  return (
    <View style={styles.container}>
      {/* Tab filter */}
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
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
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
          renderItem={({ item }) => <AttendanceCard item={item} />}
          contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primary]}
              tintColor={Colors.light.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Feather name="calendar" size={40} color={Colors.light.gray300} />
              <Text style={styles.emptyText}>Tidak ada riwayat kehadiran</Text>
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
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.light.surface,
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    marginHorizontal: 16,
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
  },
  listContent: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  loader: {
    marginTop: 40,
  },
  card: {
    backgroundColor: Colors.light.white,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  timeLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  timeSeparator: {
    width: 24,
    alignItems: "center",
  },
  timeLine: {
    width: 16,
    height: 1,
    backgroundColor: Colors.light.border,
  },
});
