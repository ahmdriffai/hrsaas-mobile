import { Colors } from "@/constans/color";
import { useAuth } from "@/features/auth/context/auth-context";
import { useSignOut } from "@/features/auth/hooks/use-signout";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PURPLE = Colors.light.primary;
const HEADER_HEIGHT = 180;

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function MenuItem({
  icon,
  label,
  labelColor = "#1A1A2E",
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  labelColor?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuIconWrap}>{icon}</View>
      <Text style={[styles.menuLabel, { color: labelColor }]}>{label}</Text>
      <Feather name="chevron-right" size={18} color="#BBBBC0" />
    </TouchableOpacity>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { handleSignOut } = useSignOut();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        style={styles.header}
        colors={[Colors.light.primary, Colors.light.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      {/* Avatar overlapping header */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require("@/assets/images/profile.png")}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>

      {/* Name + Position */}
      <View style={styles.nameWrapper}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user?.name ?? "—"}</Text>
          <MaterialIcons
            name="verified"
            size={20}
            color="#4A90D9"
            style={{ marginLeft: 4 }}
          />
        </View>
        <Text style={styles.position}>
          {user?.employee?.employee_number ?? "—"}
        </Text>
      </View>

      {/* Sections */}
      <View style={styles.content}>
        {/* CONTACT */}
        <SectionLabel label="CONTACT" />
        <View style={styles.card}>
          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="mail" size={14} color="#fff" />
            </View>
            <Text style={styles.contactText}>{user?.email ?? "—"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <Ionicons name="location" size={14} color="#fff" />
            </View>
            <Text style={styles.contactText}>
              {user?.employee?.birth_place ?? "—"}
            </Text>
          </View>
        </View>

        {/* ACCOUNT */}
        <SectionLabel label="ACCOUNT" />
        <View style={styles.card}>
          <MenuItem
            icon={<Ionicons name="person" size={18} color={PURPLE} />}
            label="Personal Data"
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Ionicons name="folder" size={18} color={PURPLE} />}
            label="Office Assets"
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<MaterialIcons name="payment" size={18} color={PURPLE} />}
            label="Payroll & Tax"
          />
        </View>

        {/* SETTINGS */}
        <SectionLabel label="SETTINGS" />
        <View style={styles.card}>
          <MenuItem
            icon={<Ionicons name="settings" size={18} color={PURPLE} />}
            label="Change Password"
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Ionicons name="code-slash" size={18} color={PURPLE} />}
            label="Versioning"
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Ionicons name="document-text" size={18} color={PURPLE} />}
            label="FAQ and Help"
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<MaterialIcons name="logout" size={18} color="#FF4D4F" />}
            label="Logout"
            labelColor="#FF4D4F"
            onPress={handleSignOut}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.gray100,
    marginBottom: 35,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 56,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginTop: -(HEADER_HEIGHT / 2 - 10),
    width: 110,
    height: 110,
    borderRadius: 20,
    backgroundColor: "#FFCCE0",
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameWrapper: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  position: {
    fontSize: 13,
    color: PURPLE,
    marginTop: 3,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#444",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  contactIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(63, 154, 174, 0.1)",
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});
