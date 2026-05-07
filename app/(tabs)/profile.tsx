import SignOutButton from "@/features/auth/components/sign-out-button";
import { useAuth } from "@/features/auth/context/auth-context";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const { user } = useAuth();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        style={styles.background}
        colors={["#3F9AAE", "#79C9C5"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.4, y: 1 }}
      >
        <Text style={styles.title}>Profile</Text>
      </LinearGradient>
      <View style={styles.card}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user?.name.charAt(0)}</Text>
          </View>
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profilePosition}>
              {user?.employee?.employee_number}
            </Text>
          </View>
          <Text>Hallo</Text>
        </View>
        <View>
          <SignOutButton />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight: 300,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 60,
    position: "relative",
  },
  title: {
    color: "#fff",
    fontWeight: 500,
    fontSize: 16,
  },
  card: {
    position: "relative",
    top: -130,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    top: -70,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    position: "relative",
  },
  profileName: {
    fontWeight: 500,
    fontSize: 17,
  },
  profilePosition: {
    fontWeight: 400,
    fontSize: 12,
    color: "#999",
  },
  avatarContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    borderRadius: "50%",
    // position: "relative",
    // top: -70,
    boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.1)",
  },
  avatar: {
    fontSize: 30,
  },
});
