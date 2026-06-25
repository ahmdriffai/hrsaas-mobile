import { PhotoResult } from "@/components/ui/camera-capture";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import { useLocation } from "@/hooks/use-location";
import Feather from "@expo/vector-icons/Feather";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCheckin } from "../hooks/use-checkin";
import { useCheckout } from "../hooks/use-checkout";
import AttendanceSubmitCard from "./attendance-submit-card";

export default function AttendanceForm() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<PhotoResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
        setPhoto(null);
        setIsScanning(false);
      };
    }, []),
  );

  const {
    coor,
    address,
    loading: loadingLocation,
    error: locationError,
  } = useLocation();
  const { mutate: checkin, isPending: isCheckingIn } = useCheckin();
  const { mutate: checkout, isPending: isCheckingOut } = useCheckout();

  const isPending = isCheckingIn || isCheckingOut;

  const capturePhoto = async (): Promise<PhotoResult | null> => {
    if (!cameraRef.current) return null;
    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
    });
    const p: PhotoResult = { uri: result.uri, mimeType: "image/jpeg" };
    setPhoto(p);
    setIsScanning(true);
    return p;
  };

  const resetCamera = () => {
    setPhoto(null);
    setIsScanning(false);
  };

  const handleCheckin = async () => {
    if (!coor) {
      Alert.alert("Validasi", "Lokasi belum tersedia");
      return;
    }
    const captured = await capturePhoto();
    if (!captured) return;

    checkin(
      { photo: captured, lat: coor.lat, lng: coor.lng },
      { onSettled: resetCamera },
    );
  };

  const handleCheckout = async () => {
    if (!coor) {
      Alert.alert("Validasi", "Lokasi belum tersedia");
      return;
    }
    const captured = await capturePhoto();
    if (!captured) return;

    checkout(
      { photo: captured, lat: coor.lat, lng: coor.lng },
      { onSettled: resetCamera },
    );
  };

  if (!permission) return <View style={styles.flex1} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="camera-off" size={40} color={Colors.light.gray400} />
        <Text style={styles.permissionText}>Izin kamera diperlukan</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Camera circle */}
        <View style={styles.cameraRing}>
          <View style={styles.cameraInner}>
            {isScanning && photo ? (
              <>
                <Image
                  source={{ uri: photo.uri }}
                  style={[styles.fill, { transform: [{ scaleX: -1 }] }]}
                />
                <Animated.View style={styles.scanOverlay}>
                  <LottieView
                    source={require("../../../assets/scanner.json")}
                    autoPlay
                    loop
                    style={styles.fill}
                  />
                </Animated.View>
              </>
            ) : isFocused ? (
              <CameraView ref={cameraRef} facing="front" style={styles.fill} />
            ) : (
              <View style={styles.fill} />
            )}
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={16} color={Colors.light.gray600} />
            {loadingLocation ? (
              <Text style={styles.infoTextMuted}>Mengambil lokasi...</Text>
            ) : (
              <Text style={styles.infoText} numberOfLines={3}>
                {address || locationError || "-"}
              </Text>
            )}
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Feather
              name={loadingLocation ? "info" : "check-circle"}
              size={16}
              color={
                loadingLocation ? Colors.light.warning : Colors.light.success
              }
            />
            <Text
              style={[
                styles.infoStatus,
                {
                  color: loadingLocation
                    ? Colors.light.warning
                    : Colors.light.success,
                },
              ]}
            >
              {loadingLocation ? "Mendeteksi lokasi..." : "Lokasi terdeteksi"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <AttendanceSubmitCard
        onCheckin={handleCheckin}
        onCheckout={handleCheckout}
        disabled={loadingLocation || isPending}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 180,
    alignItems: "center",
    gap: 20,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  permissionText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
  permissionButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
  },
  permissionButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 14,
  },
  cameraRing: {
    width: 288,
    height: 288,
    borderRadius: 144,
    padding: 5,
    backgroundColor: Colors.light.primaryLight + "50",
  },
  cameraInner: {
    flex: 1,
    borderRadius: 144,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: Colors.light.white,
  },
  fill: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scanOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  infoCard: {
    width: "100%",
    backgroundColor: Colors.light.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textPrimary,
    fontWeight: "500",
    lineHeight: 20,
  },
  infoTextMuted: {
    flex: 1,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
  },
  infoStatus: {
    fontSize: 13,
    fontWeight: "500",
  },
});
