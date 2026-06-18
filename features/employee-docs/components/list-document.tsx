import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useAuth } from "@/features/auth/context/auth-context";
import { EmployeeDocument } from "@/features/employee/schemas/employee-schema";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useGetDocs } from "../hooks/use-get-docs";
import FileViewer from "./file-viewer";

const DOC_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  KTP: { bg: "#DBEAFE", text: "#1D4ED8" },
  KK: { bg: "#D1FAE5", text: "#065F46" },
  NPWP: { bg: "#FEF3C7", text: "#92400E" },
  IJAZAH: { bg: "#EDE9FE", text: "#5B21B6" },
  SIM: { bg: "#FFE4E6", text: "#9F1239" },
};

function getDocTypeColor(type: string) {
  return (
    DOC_TYPE_COLORS[type.toUpperCase()] ?? {
      bg: Colors.light.surfaceSecondary,
      text: Colors.light.textSecondary,
    }
  );
}

function formatDate(ms: number): string {
  if (!ms) return "-";
  return new Date(ms).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DocumentCard({ doc }: { doc: EmployeeDocument }) {
  const typeColor = getDocTypeColor(doc.doc_type);
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
            <Text style={[styles.typeText, { color: typeColor.text }]}>
              {doc.doc_type}
            </Text>
          </View>
          {doc.file_url ? (
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => setViewerOpen(true)}
              activeOpacity={0.7}
            >
              <Feather name="eye" size={13} color={Colors.light.primary} />
              <Text style={styles.viewBtnText}>Lihat File</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noFileTag}>
              <Text style={styles.noFileText}>Tidak ada file</Text>
            </View>
          )}
        </View>

      <Text style={styles.docName}>{doc.doc_name}</Text>

      <View style={styles.divider} />

      <View style={styles.metaGrid}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Nomor Dokumen</Text>
          <Text style={styles.metaValue}>{doc.doc_number}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Tanggal Terbit</Text>
          <Text style={styles.metaValue}>{formatDate(doc.issued)}</Text>
        </View>
      </View>

      <View style={styles.uploadRow}>
        <Feather name="upload" size={11} color={Colors.light.textDisabled} />
        <Text style={styles.uploadText}>
          Diupload {formatDate(doc.created_at)}
        </Text>
      </View>
    </View>

      {doc.file_url && (
        <FileViewer
          visible={viewerOpen}
          url={doc.file_url}
          fileName={doc.doc_name}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  );
}

export default function ListDocument() {
  const { user } = useAuth();
  const employeeId = user?.employee?.id;

  const { data, isLoading } = useGetDocs(employeeId);
  const docs = data?.data ?? [];

  return (
    <View style={styles.container}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Feather name="folder" size={22} color={Colors.light.primary} />
        </View>
        <View style={styles.summaryText}>
          <Text style={styles.summaryTitle}>
            {docs.length} Dokumen
          </Text>
          <Text style={styles.summaryDesc}>
            Dokumen identitas & keperluan kerja
          </Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Daftar Dokumen</Text>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} color={Colors.light.primary} />
      ) : (
        <FlatList
          data={docs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DocumentCard doc={item} />}
          contentContainerStyle={
            docs.length === 0 ? styles.emptyContainer : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Feather
                name="folder"
                size={48}
                color={Colors.light.gray300}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyTitle}>Belum Ada Dokumen</Text>
              <Text style={styles.emptyDesc}>
                Dokumen karyawan akan ditampilkan di sini
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
    backgroundColor: Colors.light.infoLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.light.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: { flex: 1, gap: 3 },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.info,
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
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.light.primary + "12",
    borderRadius: 20,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  noFileTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.light.surfaceSecondary,
    borderRadius: 20,
  },
  noFileText: {
    fontSize: 11,
    color: Colors.light.textDisabled,
  },
  docName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.textPrimary,
  },
  divider: { height: 1, backgroundColor: Colors.light.border },
  metaGrid: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: { flex: 1, gap: 3 },
  metaLabel: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.textPrimary,
  },
  uploadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  uploadText: {
    fontSize: 11,
    color: Colors.light.textDisabled,
  },
});
