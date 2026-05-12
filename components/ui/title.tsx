import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "./text";

interface TitleProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  light?: boolean;
}

export default function Title({
  title,
  subtitle,
  showBack,
  light,
}: TitleProps) {
  const router = useRouter();
  const iconColor = light ? "#ffffff" : "#111827";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {showBack && (
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="chevron-left" size={22} color={iconColor} />
              </TouchableOpacity>
            )}
            <Text
              style={[
                styles.title,
                light ? styles.titleLight : styles.titleDark,
              ]}
            >
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                light ? styles.subtitleLight : styles.subtitleDark,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  titleDark: {
    color: "#111827",
  },
  titleLight: {
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 32,
  },
  subtitleDark: {
    color: "#6b7280",
  },
  subtitleLight: {
    color: "rgba(255, 255, 255, 0.7)",
  },
});
