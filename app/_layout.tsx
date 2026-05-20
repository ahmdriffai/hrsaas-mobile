import BackButton from "@/components/ui/back-button";
import { Colors } from "@/constans/color";
import { AuthProvider, useAuth } from "@/features/auth/context/auth-context";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toaster from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerShadowVisible: false,
          headerBackTitle: "Kembali",
          contentStyle: { backgroundColor: Colors.light.background },
          headerLeft: () => <BackButton />,
        }}
      >
        <Stack.Protected guard={!!token}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="presence"
            options={{ title: "Kehadiran Harian" }}
          />
          <Stack.Screen
            name="time-off/index"
            options={{ title: "Cuti & Izin", headerShown: false }}
          />
          <Stack.Screen
            name="time-off/create"
            options={{ title: "Buat Cuti & Izin" }}
          />
          <Stack.Screen
            name="time-off-approval/index"
            options={{ title: "Persetujuan Cuti", headerShown: false }}
          />
          <Stack.Screen
            name="employee/personal-data"
            options={{ title: "Personal Data" }}
          />
          <Stack.Screen name="visit/index" options={{ headerShown: false }} />
          <Stack.Screen name="visit/create" options={{ title: "Kunjungan" }} />
        </Stack.Protected>
        <Stack.Protected guard={!token}>
          <Stack.Screen name="on-board" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="dark" />
            <RootNavigator />
            <Toaster />
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
