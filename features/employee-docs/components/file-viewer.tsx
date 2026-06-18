import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
const PDF_EXTS = ["pdf"];

function getExt(url: string): string {
  return url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
}

type FileType = "image" | "pdf" | "other";

function getFileType(url: string): FileType {
  const ext = getExt(url);
  if (IMAGE_EXTS.includes(ext)) return "image";
  if (PDF_EXTS.includes(ext)) return "pdf";
  return "other";
}

interface Props {
  visible: boolean;
  url: string;
  fileName: string;
  onClose: () => void;
}

// ─── Image viewer ────────────────────────────────────────────────────────────

function ImageContent({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Feather name="alert-circle" size={40} color={Colors.light.gray400} />
        <Text style={styles.errorText}>Gagal memuat gambar</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => WebBrowser.openBrowserAsync(url)}
          activeOpacity={0.8}
        >
          <Feather name="external-link" size={14} color={Colors.light.white} />
          <Text style={styles.actionBtnText}>Buka di Browser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Pressable style={styles.imageArea}>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={Colors.light.white}
          size="large"
        />
      )}
      <Image
        source={{ uri: url }}
        style={styles.image}
        contentFit="contain"
        onLoadStart={() => { setLoading(true); setError(false); }}
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true); }}
      />
    </Pressable>
  );
}

// ─── PDF viewer ──────────────────────────────────────────────────────────────

function PdfContent({ url }: { url: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <View style={styles.pdfArea}>
      {loading && !error && (
        <View style={styles.pdfLoading}>
          <ActivityIndicator color={Colors.light.primary} size="large" />
          <Text style={styles.loadingText}>Memuat dokumen PDF...</Text>
        </View>
      )}
      {error ? (
        <View style={styles.centerBox}>
          <Feather name="file-text" size={48} color={Colors.light.gray300} />
          <Text style={styles.errorTitle}>Gagal memuat PDF</Text>
          <Text style={styles.errorText}>
            Dokumen tidak dapat ditampilkan secara langsung
          </Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => WebBrowser.openBrowserAsync(url)}
            activeOpacity={0.8}
          >
            <Feather name="external-link" size={14} color={Colors.light.white} />
            <Text style={styles.actionBtnText}>Buka di Browser</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          source={{ uri: viewerUrl }}
          style={styles.webview}
          onLoadStart={() => setLoading(true)}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          scalesPageToFit
        />
      )}
    </View>
  );
}

// ─── Other file ──────────────────────────────────────────────────────────────

function OtherContent({ url, fileName }: { url: string; fileName: string }) {
  const ext = getExt(url).toUpperCase() || "FILE";
  return (
    <View style={styles.centerBox}>
      <View style={styles.fileIconBox}>
        <Feather name="file" size={48} color={Colors.light.primary} />
        <Text style={styles.fileExtLabel}>{ext}</Text>
      </View>
      <Text style={styles.otherFileName} numberOfLines={2}>{fileName}</Text>
      <Text style={styles.errorText}>
        Format ini tidak dapat dipratampilkan
      </Text>
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => WebBrowser.openBrowserAsync(url)}
        activeOpacity={0.8}
      >
        <Feather name="external-link" size={14} color={Colors.light.white} />
        <Text style={styles.actionBtnText}>Buka di Browser</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function FileViewer({ visible, url, fileName, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const fileType = getFileType(url);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor={Colors.light.textPrimary}
        barStyle="light-content"
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color={Colors.light.white} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {fileName}
            </Text>
            <View style={styles.fileTypeBadge}>
              <Text style={styles.fileTypeText}>
                {getExt(url).toUpperCase() || "FILE"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => WebBrowser.openBrowserAsync(url)}
            activeOpacity={0.7}
          >
            <Feather name="external-link" size={18} color={Colors.light.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {fileType === "image" && <ImageContent url={url} />}
        {fileType === "pdf" && <PdfContent url={url} />}
        {fileType === "other" && <OtherContent url={url} fileName={fileName} />}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.textPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.white,
    textAlign: "center",
  },
  fileTypeBadge: {
    backgroundColor: Colors.light.primary + "30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  fileTypeText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.light.primaryLight,
    letterSpacing: 0.5,
  },

  // Image
  imageArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: SCREEN_W,
    height: SCREEN_H * 0.85,
  },

  // PDF
  pdfArea: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
  },
  pdfLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    zIndex: 1,
    backgroundColor: Colors.light.gray100,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  webview: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
  },

  // Shared / Other
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.light.white,
  },
  errorText: {
    fontSize: 13,
    color: Colors.light.gray400,
    textAlign: "center",
  },
  fileIconBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    backgroundColor: Colors.light.primary + "15",
    borderRadius: 20,
  },
  fileExtLabel: {
    position: "absolute",
    bottom: 10,
    fontSize: 8,
    fontWeight: "800",
    color: Colors.light.primary,
    letterSpacing: 0.5,
  },
  otherFileName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.white,
    textAlign: "center",
    lineHeight: 20,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.white,
  },
});
