import BottomSheet from "@/components/ui/bottom-sheet";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetTimeOffBalance } from "../hooks/use-get-time-off-balance";
import { TimeOffBalance } from "../schemas/time-off-balance-schema";

function BalanceRow({ balance }: { balance: TimeOffBalance }) {
  const usedPercent =
    balance.entitled_days > 0
      ? (balance.used_days / balance.entitled_days) * 100
      : 0;

  return (
    <View style={sheet.balanceRow}>
      <View style={sheet.balanceRowHeader}>
        <View style={sheet.balanceTypePill}>
          <Text style={sheet.balanceTypePillText}>
            {balance.time_off_type.category}
          </Text>
        </View>
        <Text style={sheet.balanceTypeName}>{balance.time_off_type.name}</Text>
        <Text style={sheet.balanceRemaining}>
          {balance.remaining_days}{" "}
          <Text style={sheet.balanceRemainingLabel}>hari tersisa</Text>
        </Text>
      </View>

      {/* Progress bar */}
      <View style={sheet.progressTrack}>
        <View
          style={[
            sheet.progressFill,
            { width: `${Math.min(usedPercent, 100)}%` as any },
          ]}
        />
      </View>

      <View style={sheet.balanceStats}>
        <Text style={sheet.statLabel}>
          Hak: <Text style={sheet.statValue}>{balance.entitled_days} hari</Text>
        </Text>
        <Text style={sheet.statLabel}>
          Dipakai: <Text style={sheet.statValue}>{balance.used_days} hari</Text>
        </Text>
      </View>
    </View>
  );
}

export default function TimeOffCard() {
  const currentYear = new Date().getFullYear();
  const [sheetVisible, setSheetVisible] = useState(false);
  const { data, isLoading } = useGetTimeOffBalance(currentYear);

  const balances = data?.data ?? [];
  const totalRemaining = balances.reduce((sum, b) => sum + b.remaining_days, 0);
  const totalEntitled = balances.reduce((sum, b) => sum + b.entitled_days, 0);
  const totalUsed = balances.reduce((sum, b) => sum + b.used_days, 0);

  return (
    <>
      <View style={sheet.card}>
        {/* Top row */}
        <View style={sheet.cardTopRow}>
          <View>
            <Text style={sheet.cardTitle}>Saldo Cuti</Text>
            <Text style={sheet.cardPeriod}>Periode {currentYear}</Text>
          </View>
          <TouchableOpacity
            style={sheet.arrowButton}
            activeOpacity={0.85}
            onPress={() => setSheetVisible(true)}
          >
            <Feather
              name="chevron-right"
              size={16}
              color={Colors.light.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={sheet.divider} />

        {/* Stats row */}
        {isLoading ? (
          <ActivityIndicator
            color={Colors.light.primary}
            style={{ marginTop: 8 }}
          />
        ) : (
          <View style={sheet.statsRow}>
            <View style={sheet.statBlock}>
              <Text style={sheet.statBigNumber}>{totalEntitled}</Text>
              <Text style={sheet.statBlockLabel}>Total Hak</Text>
            </View>
            <View style={sheet.statDivider} />
            <View style={sheet.statBlock}>
              <Text
                style={[sheet.statBigNumber, { color: Colors.light.error }]}
              >
                {totalUsed}
              </Text>
              <Text style={sheet.statBlockLabel}>Dipakai</Text>
            </View>
            <View style={sheet.statDivider} />
            <View style={sheet.statBlock}>
              <Text
                style={[sheet.statBigNumber, { color: Colors.light.success }]}
              >
                {totalRemaining}
              </Text>
              <Text style={sheet.statBlockLabel}>Tersisa</Text>
            </View>
          </View>
        )}

        {/* Hint */}
        {!isLoading && balances.length > 0 && (
          <Text style={sheet.hintText}>
            {balances.length} jenis cuti · Ketuk untuk detail
          </Text>
        )}
      </View>

      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Detail Saldo Cuti"
        snapHeight={0.55}
      >
        {balances.length === 0 ? (
          <View style={sheet.emptyState}>
            <Feather name="inbox" size={32} color={Colors.light.gray300} />
            <Text style={sheet.emptyText}>Tidak ada data saldo cuti</Text>
          </View>
        ) : (
          balances.map((balance) => (
            <BalanceRow key={balance.id} balance={balance} />
          ))
        )}
      </BottomSheet>
    </>
  );
}

const sheet = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  cardPeriod: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.light.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.divider,
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBlock: {
    flex: 1,
    alignItems: "center",
  },
  statBigNumber: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  statBlockLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.light.divider,
  },
  hintText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
  // Bottom sheet — balance row
  balanceRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  balanceRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  balanceTypePill: {
    backgroundColor: Colors.light.infoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  balanceTypePillText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.light.info,
  },
  balanceTypeName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: Colors.light.textPrimary,
  },
  balanceRemaining: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.success,
  },
  balanceRemainingLabel: {
    fontSize: 11,
    fontWeight: "400",
    color: Colors.light.textSecondary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.light.gray100,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  balanceStats: {
    flexDirection: "row",
    gap: 16,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  statValue: {
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
