import { fetchLocationName } from "@/lib/getAddress";
import Feather from "@expo/vector-icons/Feather";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { useNavigation } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Presence() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [photo, setPhoto] = useState<any>(null);
  const navigation = useNavigation();
  const [loadingAddress, setLoadingAddress] = useState(true);

  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      try {
        // Permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Location permission denied");
          setLoadingAddress(false);
          return;
        }

        // Tambah timeout (bikin lebih stabil)
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        clearTimeout(timeout);

        if (!location) {
          setErrorMsg("Unable to get location");
          setLoadingAddress(false);
          return;
        }

        // Reverse geocoding
        const addr = await fetchLocationName(
          location.coords.latitude,
          location.coords.longitude
        );

        setAddress(addr);
      } catch (err: any) {
        console.log("Error getting location:", err);
        setErrorMsg("Failed to get location");
      } finally {
        setLoadingAddress(false);
      }
    }

    getCurrentLocation();
  }, []);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-center mb-3">We need camera permission</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-medium">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    const rawPhoto = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      base64: true,
      skipProcessing: true,
    });

    // SET → baru render 1x
    setPhoto(rawPhoto);

    setTimeout(() => setPhoto(null), 10000);
  };

  const uploadPhoto = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    const res = await fetch("https://your-api.com/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    console.log(await res.json());
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row p-4">
        <TouchableOpacity
          className="p-3 bg-white rounded-full border border-gray-200"
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} />
        </TouchableOpacity>
      </View>

      <View className="items-center justify-around  mt-5">
        {/* CAMERA ROUND / ROUNDED FRAME */}
        <View className="w-80 h-80 rounded-full overflow-hidden border-4 border-white">
          {photo ? (
            <View className="w-full h-full">
              <Image
                source={{ uri: photo.uri }}
                className="w-full h-80 rounded-xl"
                style={{ transform: [{ scaleX: -1 }] }}
              />

              {/* SCAN GIF */}
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255,255,255, 0.3)",
                }}
              >
                <LottieView
                  source={require("../assets/scanner.json")}
                  autoPlay
                  loop
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Animated.View>
            </View>
          ) : (
            <CameraView ref={cameraRef} facing="front" style={{ flex: 1 }} />
          )}
        </View>
        {/* BUTTON */}
        <View className=" mt-6 gap-3 px-7 w-full">
          <View className="bg-white p-5 rounded-xl gap-3 border border-gray-200">
            <View className="flex flex-row gap-3 border-b pb-3 border-gray-200">
              <Feather name="calendar" color="black" size={18} />
              <Text>Absen Masuk</Text>
            </View>
            <View className="flex flex-row gap-3 items-center ">
              <Feather name="map-pin" color="black" size={18} />
              {loadingAddress ? (
                <Text>Loading ...</Text>
              ) : (
                <Text className="font-semibold">{address}</Text>
              )}
            </View>
            <View className="flex flex-row gap-3 border-b pb-3 border-gray-200">
              {loadingAddress ? (
                <>
                  <Feather name="info" color="orange" size={18} />
                  <Text className="text-yellow-500">Diluar jangkauan</Text>
                </>
              ) : (
                <>
                  <Feather name="check" color="green" size={18} />
                  <Text className="text-green-800">Dalam Titik kehadiran</Text>
                </>
              )}
            </View>
          </View>
          <TouchableOpacity
            className="p-4 w-full flex flex-row gap-3 items-center justify-center bg-primary rounded-xl"
            onPress={capturePhoto}
          >
            <Feather name="log-in" color="white" size={18} />
            <Text className="text-white font-medium">Absen Masuk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
