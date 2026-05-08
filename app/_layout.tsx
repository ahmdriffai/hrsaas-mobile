import BackButton from "@/components/ui/back-button";
import { Colors } from "@/constans/color";
import { AuthProvider, useAuth } from "@/features/auth/context/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toaster from "react-native-toast-message";
import "../global.css";

const queryClient = new QueryClient();

function RootNavigator() {
  const { token, loading } = useAuth();

  if (loading) return null;

  return (
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
        <Stack.Screen name="presence" options={{ title: "Kehadiran Harian" }} />
        <Stack.Screen
          name="time-off/index"
          options={{ title: "Cuti & Izin", headerShown: false }}
        />
        <Stack.Screen
          name="time-off/create"
          options={{ title: "Buat Cuti & Izin" }}
        />
        <Stack.Screen
          name="employee/personal-data"
          options={{ title: "Personal Data" }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!token}>
        <Stack.Screen name="on-board" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
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
