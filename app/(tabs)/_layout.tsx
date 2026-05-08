import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
        tabBarStyle: {
          position: "absolute",
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          height: 90,
          paddingBottom: 0,
          paddingHorizontal: 8,
          shadowColor: "#006D77",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#006D77",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 10,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 4,
          marginVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: () => (
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 120, height: 40, resizeMode: "contain" }}
            />
          ),
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#E8F4F5" : "transparent",
                borderRadius: 12,
                width: 44,
                height: 32,
              }}
            >
              <FontAwesome6
                name="house-chimney"
                size={focused ? 18 : 17}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: "Aktivitas",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#E8F4F5" : "transparent",
                borderRadius: 12,
                width: 44,
                height: 32,
              }}
            >
              <FontAwesome6
                name="calendar"
                size={focused ? 18 : 17}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: focused ? "#E8F4F5" : "transparent",
                borderRadius: 12,
                width: 44,
                height: 32,
              }}
            >
              <FontAwesome6
                name="user-circle"
                size={focused ? 18 : 17}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
