import BottomSheet from "@/components/ui/bottom-sheet";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useActionTimeOffApproval } from "../hooks/use-action-time-off-approval";
import { useGetTimeOffApprovals } from "../hooks/use-get-time-off-approvals";
import { TimeOffApproval } from "../schemas/time-off-approval-schema";

type TabStatus = "PENDING" | "APPROVED" | "REJECTED";

const TABS: { label: string; value: TabStatus }[] = [
  { label: "Perlu Tindakan", value: "PENDING" },
  { label: "Disetujui", value: "APPROVED" },
  { label: "Ditolak", value: "REJECTED" },
];

const STATUS_CONFIG: Record<
  TabStatus,
  { icon: React.ComponentProps<typeof Feather>["name"]; color: string; label: string }
> = {
  PENDING: { icon: "clock", color: Colors.light.warning, label: "Menunggu Tindakan" },
  APPROVED: { icon: "check-circle", color: Colors.light.success, label: "Disetujui" },
  REJECTED: { icon: "x-circle", color: Colors.light.error, label: "Ditolak" },
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShort(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}

type ActionType = "APPROVE" | "REJECT";

function ActionSheet({
  visible,
  action,
  onClose,
  onConfirm,
  isPending,
}: {
  visible: boolean;
  action: ActionType | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}) {
  const [reason, setReason] = useState("");
  const isApprove = action === "APPROVE";

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleClose}
      title={isApprove ? "Setujui Pengajuan" : "Tolak Pengajuan"}
      snapHeight={0.42}
    >
      <View style={actionStyle.container}>
        <View
          style={[
            actionStyle.iconWrap,
            {
              backgroundColor: isApprove
                ? Colors.light.successLight
                : Colors.light.errorLight,
            },
          ]}
        >
          <Feather
            name={isApprove ? "check-circle" : "x-circle"}
            size={28}
            color={isApprove ? Colors.light.success : Colors.light.error}
          />
        </View>

        <Text style={actionStyle.desc}>
          {isApprove
            ? "Konfirmasi persetujuan pengajuan cuti ini."
            : "Berikan alasan penolakan pengajuan cuti ini."}
        </Text>

        <View style={actionStyle.inputWrap}>
          <Text style={actionStyle.inputLabel}>
            Alasan{isApprove ? " (opsional)" : ""}
          </Text>
          <TextInput
            style={actionStyle.input}
            placeholder="Tulis alasan..."
            placeholderTextColor={Colors.light.textDisabled}
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[
            actionStyle.confirmBtn,
            {
              backgroundColor: isApprove
                ? Colors.light.success
                : Colors.light.error,
              opacity: isPending ? 0.7 : 1,
            },
          ]}
          onPress={handleConfirm}
          disabled={isPending || (!isApprove && reason.trim().length === 0)}
          activeOpacity={0.8}
        >
          {isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={actionStyle.confirmBtnText}>
              {isApprove ? "Ya, Setujui" : "Ya, Tolak"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

function ApprovalCard({
  item,
  activeTab,
}: {
  item: TimeOffApproval;
  activeTab: TabStatus;
}) {
  const [actionType, setActionType] = useState<ActionType | null>(null);
  const { mutate, isPending } = useActionTimeOffApproval(item.id);
  const req = item.time_off_request;
  const statusCfg = STATUS_CONFIG[activeTab];

  const handleConfirm = (reason: string) => {
    if (!actionType) return;
    mutate(
      { action: actionType, action_reason: reason },
      { onSuccess: () => setActionType(null) }
    );
  };

  return (
    <>
      <View style={s.card}>
        {/* Header */}
        <View style={s.cardHeader}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>
              {req.employee.fullname[0]?.toUpperCase() ?? "?"}
            </Text>
          </View>
          <View style={s.headerInfo}>
            <Text style={s.employeeName}>{req.employee.fullname}</Text>
            <View style={s.typePill}>
              <Text style={s.typePillText}>{req.time_off_type.name}</Text>
            </View>
          </View>
          <View
            style={[
              s.statusBadge,
              { backgroundColor: statusCfg.color + "18" },
            ]}
          >
            <Feather name={statusCfg.icon} size={12} color={statusCfg.color} />
            <Text style={[s.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* Info row */}
        <View style={s.infoRow}>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Tanggal</Text>
            <Text style={s.infoValue}>
              {formatShort(req.start_date)}
              {req.end_date !== req.start_date
                ? ` - ${formatShort(req.end_date)}`
                : ""}
            </Text>
          </View>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Durasi</Text>
            <Text style={s.infoValue}>{req.requested_days} Hari</Text>
          </View>
          <View style={s.infoBlock}>
            <Text style={s.infoLabel}>Diajukan</Text>
            <Text style={s.infoValue}>{formatDate(req.created_at)}</Text>
          </View>
        </View>

        {req.request_reason ? (
          <View style={s.reasonBox}>
            <Feather
              name="message-square"
              size={12}
              color={Colors.light.textSecondary}
            />
            <Text style={s.reasonText} numberOfLines={2}>
              {req.request_reason}
            </Text>
          </View>
        ) : null}

        {/* Actions */}
        {activeTab === "PENDING" && (
          <View style={s.actionRow}>
            <TouchableOpacity
              style={s.rejectBtn}
              onPress={() => setActionType("REJECT")}
              activeOpacity={0.8}
            >
              <Feather name="x" size={14} color={Colors.light.error} />
              <Text style={s.rejectBtnText}>Tolak</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.approveBtn}
              onPress={() => setActionType("APPROVE")}
              activeOpacity={0.8}
            >
              <Feather name="check" size={14} color="#fff" />
              <Text style={s.approveBtnText}>Setujui</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ActionSheet
        visible={actionType !== null}
        action={actionType}
        onClose={() => setActionType(null)}
        onConfirm={handleConfirm}
        isPending={isPending}
      />
    </>
  );
}

export default function ListTimeOffApproval() {
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING");

  const { data, isLoading } = useGetTimeOffApprovals({ status: activeTab });
  const items = data?.data ?? [];

  return (
    <View style={s.container}>
      {/* Tab bar */}
      <View style={s.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              style={[s.tabItem, isActive && s.tabItemActive]}
              onPress={() => setActiveTab(tab.value)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <ActivityIndicator style={s.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ApprovalCard item={item} activeTab={activeTab} />
          )}
          contentContainerStyle={
            items.length === 0 ? s.emptyContainer : s.listContent
          }
          ListEmptyComponent={
            <View style={s.emptyWrapper}>
              <Feather name="inbox" size={32} color={Colors.light.gray300} />
              <Text style={s.emptyText}>Tidak ada pengajuan</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, marginTop: 12 },
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
  tabItemActive: { backgroundColor: Colors.light.primary },
  tabLabel: { fontSize: 11, fontWeight: "500", color: Colors.light.textSecondary },
  tabLabelActive: { color: Colors.light.textInverse },
  loader: { marginTop: 40 },
  listContent: { gap: 10, paddingBottom: 40 },
  emptyContainer: { flex: 1 },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyText: { fontSize: 14, color: Colors.light.textSecondary },
  // Card
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
    alignItems: "center",
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.white,
  },
  headerInfo: { flex: 1, gap: 4 },
  employeeName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  typePill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.light.infoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.light.info,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "600" },
  divider: { height: 1, backgroundColor: Colors.light.divider },
  infoRow: { flexDirection: "row" },
  infoBlock: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 10, color: Colors.light.textSecondary },
  infoValue: { fontSize: 13, fontWeight: "600", color: Colors.light.textPrimary },
  reasonBox: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 8,
    padding: 10,
  },
  reasonText: { flex: 1, fontSize: 12, color: Colors.light.textSecondary },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 2 },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.error,
  },
  rejectBtnText: { fontSize: 13, fontWeight: "600", color: Colors.light.error },
  approveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.light.success,
  },
  approveBtnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
});

const actionStyle = StyleSheet.create({
  container: { gap: 16 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  desc: {
    textAlign: "center",
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  inputWrap: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: "500", color: Colors.light.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.light.textPrimary,
    minHeight: 72,
    textAlignVertical: "top",
  },
  confirmBtn: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
