import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { EmployeeContract } from "@/features/employee/schemas/employee-schema";
import { useAuth } from "@/features/auth/context/auth-context";
import Feather from "@expo/vector-icons/Feather";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useGetContracts } from "../hooks/use-get-contracts";

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function isContractActive(start: number, end?: number | null): boolean {
  const now = Date.now();
  return start <= now && (!end || end >= now);
}

function ContractCard({ contract }: { contract: EmployeeContract }) {
  const active =
    isContractActive(contract.start_date, contract.end_date) &&
    contract.is_active;

  const statusColor = active ? Colors.light.success : Colors.light.gray400;

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.contractType}>{contract.contract_type}</Text>
          {contract.employee_status ? (
            <View style={styles.golBadge}>
              <Text style={styles.golText}>Gol. {contract.employee_status}</Text>
            </View>
          ) : null}
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + "18" },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {active ? "Aktif" : "Berakhir"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Division & Position */}
      <View style={styles.infoRow}>
        <Feather name="briefcase" size={13} color={Colors.light.textSecondary} />
        <Text style={styles.infoText}>
          {contract.division.name}
          <Text style={styles.dot}> · </Text>
          {contract.position.name}
        </Text>
      </View>

      {/* Date range */}
      <View style={styles.infoRow}>
        <Feather name="calendar" size={13} color={Colors.light.textSecondary} />
        <Text style={styles.infoText}>
          {formatDate(contract.start_date)}
          {" – "}
          {contract.end_date ? (
            formatDate(contract.end_date)
          ) : (
            <Text style={styles.noLimit}>Tidak ada batas</Text>
          )}
        </Text>
      </View>

      {/* Salary */}
      <View style={[styles.salaryRow]}>
        <Feather name="dollar-sign" size={13} color={Colors.light.primary} />
        <Text style={styles.salaryText}>{formatRupiah(contract.salary)}</Text>
      </View>
    </View>
  );
}

export default function ListContract() {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const { data, isLoading } = useGetContracts(employeeId);
  const contracts = data?.data ?? [];

  const activeContract = contracts.find(
    (c) => isContractActive(c.start_date, c.end_date) && c.is_active,
  );

  return (
    <View style={styles.container}>
      {/* Summary card */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: activeContract
              ? Colors.light.successLight
              : Colors.light.surfaceSecondary,
          },
        ]}
      >
        <View
          style={[
            styles.summaryIcon,
            {
              backgroundColor: activeContract
                ? Colors.light.success + "20"
                : Colors.light.gray300 + "40",
            },
          ]}
        >
          <Feather
            name="file-text"
            size={22}
            color={activeContract ? Colors.light.success : Colors.light.gray400}
          />
        </View>
        <View style={styles.summaryText}>
          <Text
            style={[
              styles.summaryTitle,
              {
                color: activeContract
                  ? Colors.light.success
                  : Colors.light.textSecondary,
              },
            ]}
          >
            {activeContract ? "Kontrak Aktif" : "Tidak Ada Kontrak Aktif"}
          </Text>
          <Text style={styles.summaryDesc}>
            {activeContract
              ? `${activeContract.contract_type} · ${activeContract.division.name}`
              : "Belum ada kontrak yang berjalan saat ini"}
          </Text>
        </View>
      </View>

      {/* Section label */}
      <Text style={styles.sectionLabel}>Riwayat Kontrak</Text>

      {isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          color={Colors.light.primary}
        />
      ) : (
        <FlatList
          data={contracts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ContractCard contract={item} />}
          contentContainerStyle={
            contracts.length === 0 ? styles.emptyContainer : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Feather
                name="file-text"
                size={48}
                color={Colors.light.gray300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Belum Ada Kontrak</Text>
              <Text style={styles.emptyDesc}>
                Riwayat kontrak kerja akan ditampilkan di sini
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
    marginBottom: 20,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: { flex: 1, gap: 3 },
  summaryTitle: { fontSize: 15, fontWeight: "700" },
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  contractType: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  golBadge: {
    backgroundColor: Colors.light.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  golText: { fontSize: 11, fontWeight: "600", color: Colors.light.info },
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
  divider: { height: 1, backgroundColor: Colors.light.border },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  dot: { color: Colors.light.gray300 },
  noLimit: { color: Colors.light.textDisabled, fontStyle: "italic" },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 10,
  },
  salaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
  },
});
