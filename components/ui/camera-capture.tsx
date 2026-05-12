import Button from "@/components/ui/button";
import Text from "@/components/ui/text";
import { Colors } from "@/constans/color";
import Feather from "@expo/vector-icons/Feather";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export type PhotoResult = {
  uri: string;
  mimeType: string;
};

interface Props {
  value: PhotoResult | null;
  onChange: (photo: PhotoResult | null) => void;
}

export default function CameraCapture({ value, onChange }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<CameraType>("back");

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    const result = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      skipProcessing: true,
    });

    onChange({ uri: result.uri, mimeType: "image/jpeg" });
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  if (!permission) return <View style={styles.placeholder} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Feather name="camera-off" size={24} color={Colors.light.gray500} />
        <Text style={styles.permissionText}>Izin kamera diperlukan</Text>
        <View>
          <Button title="Izinkan Kamera" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        {value ? (
          <Image source={{ uri: value.uri }} style={styles.preview} />
        ) : (
          <CameraView
            ref={cameraRef}
            facing={cameraFacing}
            style={styles.preview}
          />
        )}
      </View>

      <View style={styles.actions}>
        {!value && (
          <TouchableOpacity
            style={styles.rotateButton}
            onPress={toggleCameraFacing}
          >
            <Feather name="refresh-cw" size={16} color={Colors.light.primary} />
            <Text style={styles.rotateButtonText}>
              {cameraFacing === "back" ? "Kamera Depan" : "Kamera Belakang"}
            </Text>
          </TouchableOpacity>
        )}
        <Button
          title={value ? "Ambil Ulang Foto" : "Ambil Foto"}
          onPress={value ? () => onChange(null) : capturePhoto}
          icon="photo-camera"
          fullWidth
        />
      </View>
    </View>
  );
}

const PRIMARY_LIGHT = "#E8F4F7";

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  placeholder: {
    height: 280,
    borderRadius: 16,
    backgroundColor: Colors.light.gray200,
  },
  permissionBox: {
    height: 280,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.gray200,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: Colors.light.gray50,
  },
  permissionText: {
    fontSize: 14,
    color: Colors.light.gray600,
  },
  cameraWrapper: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: Colors.light.gray900,
  },
  preview: {
    width: "100%",
    height: 280,
  },
  actions: {
    gap: 10,
  },
  rotateButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: PRIMARY_LIGHT,
  },
  rotateButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.primary,
  },
});
