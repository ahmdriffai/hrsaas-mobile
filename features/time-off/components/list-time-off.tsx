import BottomSheet from "@/components/ui/bottom-sheet";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetCurrentTimeOff } from "../hooks/use-get-current-timeoff";
import {
  ApprovalResponse,
  TimeOffRequestResponse,
} from "../schemas/time-off-schema";

type TabStatus = "review" | "approved" | "rejected";

const TAB_TO_API_STATUS: Record<TabStatus, string> = {
  review: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
};

const TABS: { label: string; value: TabStatus }[] = [
  { label: "Proses", value: "review" },
  { label: "Disetujui", value: "approved" },
  { label: "Ditolak", value: "rejected" },
];

function formatFullDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

function formatShortDateYear(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FOOTER_STATUS: Record<
  TabStatus,
  {
    icon: React.ComponentProps<typeof Feather>["name"];
    color: string;
    label: string;
  }
> = {
  review: {
    icon: "clock",
    color: Colors.light.warning,
    label: "Menunggu Persetujuan",
  },
  approved: {
    icon: "check-circle",
    color: Colors.light.success,
    label: "Disetujui",
  },
  rejected: { icon: "x-circle", color: Colors.light.error, label: "Ditolak" },
};

const APPROVAL_AVATAR_BG: Record<string, string> = {
  APPROVED: Colors.light.success,
  REJECTED: Colors.light.error,
  PENDING: Colors.light.gray400,
};

const MAX_AVATARS = 3;

function StackedAvatars({
  approvals,
  onPress,
}: {
  approvals: ApprovalResponse[];
  onPress: () => void;
}) {
  const visible = approvals.slice(0, MAX_AVATARS);
  const extra = approvals.length - MAX_AVATARS;

  return (
    <TouchableOpacity
      style={style.stackedAvatars}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {visible.map((a, i) => (
        <View
          key={i}
          style={[
            style.stackedAvatar,
            {
              backgroundColor:
                APPROVAL_AVATAR_BG[a.status] ?? Colors.light.gray400,
              marginLeft: i === 0 ? 0 : -8,
              zIndex: MAX_AVATARS - i,
            },
          ]}
        >
          <Text style={style.stackedAvatarText}>
            {a.employee_name[0]?.toUpperCase() ?? "?"}
          </Text>
        </View>
      ))}
      {extra > 0 && (
        <View
          style={[
            style.stackedAvatar,
            style.stackedAvatarMore,
            { marginLeft: -8 },
          ]}
        >
          <Text style={style.stackedAvatarMoreText}>+{extra}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function getActionDate(
  approvals: ApprovalResponse[],
  tab: TabStatus,
): string | null {
  if (tab === "review") return null;
  const targetStatus = tab === "approved" ? "APPROVED" : "REJECTED";
  const match = approvals.find((a) => a.status === targetStatus);
  return match?.action_at ? formatShortDateYear(match.action_at) : null;
}

const APPROVAL_STATUS_LABEL: Record<string, { label: string; color: string }> =
  {
    APPROVED: { label: "Disetujui", color: Colors.light.success },
    REJECTED: { label: "Ditolak", color: Colors.light.error },
    PENDING: { label: "Menunggu", color: Colors.light.warning },
  };

function TimeOffItem({
  item,
  tab,
}: {
  item: TimeOffRequestResponse;
  tab: TabStatus;
}) {
  const [sheetVisible, setSheetVisible] = useState(false);
  const footerInfo = FOOTER_STATUS[tab];
  const actionDate = getActionDate(item.approvals, tab);

  return (
    <>
      <View style={style.itemCard}>
        <View style={style.cardHeader}>
          <Feather name="file-text" size={18} color={Colors.light.primary} />
          <Text style={style.cardHeaderDate}>
            {formatFullDate(item.created_at)}
          </Text>
        </View>

        <View style={style.divider} />

        <View style={style.infoRow}>
          <View style={style.infoCol}>
            <Text style={style.infoLabel}>Tanggal Cuti / Izin</Text>
            <Text style={style.infoValue}>
              {formatShortDate(item.start_date)}
              {item.end_date ? ` - ${formatShortDate(item.end_date)}` : ""}
            </Text>
          </View>
          <View style={style.infoCol}>
            <Text style={style.infoLabel}>Total Hari</Text>
            <Text style={style.infoValue}>{item.requested_days} Hari</Text>
          </View>
        </View>
        <View>
          <Text style={style.infoLabel}>- {item.request_reason}</Text>
        </View>
        <View style={style.cardFooter}>
          <View style={style.footerStatus}>
            <Feather
              name={footerInfo.icon}
              size={15}
              color={footerInfo.color}
            />
            <Text style={[style.footerStatusText, { color: footerInfo.color }]}>
              {footerInfo.label}
              {actionDate ? ` pada ${actionDate}` : ""}
            </Text>
          </View>
          {item.approvals.length > 0 && (
            <View style={style.approverSection}>
              <Text style={style.approverByLabel}>Persetujuan</Text>
              <StackedAvatars
                approvals={item.approvals}
                onPress={() => setSheetVisible(true)}
              />
            </View>
          )}
        </View>
      </View>

      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Approvals"
        snapHeight={0.35 + item.approvals.length * 0.1}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {item.approvals.map((a, i) => {
            const statusInfo =
              APPROVAL_STATUS_LABEL[a.status] ?? APPROVAL_STATUS_LABEL.PENDING;
            return (
              <View key={i} style={style.approvalRow}>
                <View
                  style={[
                    style.approvalAvatar,
                    {
                      backgroundColor:
                        APPROVAL_AVATAR_BG[a.status] ?? Colors.light.gray400,
                    },
                  ]}
                >
                  <Text style={style.approvalAvatarText}>
                    {a.employee_name[0]?.toUpperCase() ?? "?"}
                  </Text>
                </View>
                <View style={style.approvalInfo}>
                  <Text style={style.approvalName}>{a.employee_name}</Text>
                  {a.action_at && a.status !== "PENDING" && (
                    <Text style={style.approvalDate}>
                      {formatShortDateYear(a.action_at)}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    style.approvalBadge,
                    { backgroundColor: statusInfo.color + "20" },
                  ]}
                >
                  <Text
                    style={[
                      style.approvalBadgeText,
                      { color: statusInfo.color },
                    ]}
                  >
                    {statusInfo.label}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </BottomSheet>
    </>
  );
}

export default function ListTimeOff() {
  const [activeTab, setActiveTab] = useState<TabStatus>("review");

  const { data, isLoading } = useGetCurrentTimeOff({
    request_status: TAB_TO_API_STATUS[activeTab],
  });

  const items = data?.data ?? [];

  return (
    <View style={style.container}>
      <View style={style.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[style.tabItem, isActive && style.tabItemActive]}
              onPress={() => setActiveTab(tab.value)}
              activeOpacity={0.7}
            >
              <Text style={[style.tabLabel, isActive && style.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator style={style.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TimeOffItem item={item} tab={activeTab} />}
          contentContainerStyle={
            items.length === 0 ? style.emptyContainer : style.listContent
          }
          ListEmptyComponent={
            <View style={style.emptyWrapper}>
              <Text style={style.emptyText}>Tidak ada pengajuan</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const style = StyleSheet.create({
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
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyWrapper: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  emptyText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardHeaderDate: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoCol: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  footerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  approverSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  approverByLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  stackedAvatars: {
    flexDirection: "row",
    alignItems: "center",
  },
  stackedAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.light.surface,
  },
  stackedAvatarText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.light.white,
  },
  stackedAvatarMore: {
    backgroundColor: Colors.light.gray300,
  },
  stackedAvatarMoreText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.light.gray700,
  },
  loader: {
    marginTop: 40,
  },
  approvalRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  approvalAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  approvalAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.white,
  },
  approvalInfo: {
    flex: 1,
    gap: 2,
  },
  approvalName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  approvalDate: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  approvalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  approvalBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
